import type {  CleanedTransaction, ProcessingStats } from "../types/bankingtypes";
import { mapToRawTransaction } from "../utils/mapper";
import { cleanTransaction } from "./cleaning";
import { DataValidator } from "../services/validator";

export function processTransactions(rows: any[]): {
  cleaned: CleanedTransaction[];
  stats: ProcessingStats;
  duplicateIds: string[];
} {
  const start = performance.now();
  const rawData = (rows as any[]).map(mapToRawTransaction);

  const validator = new DataValidator();
  validator.validateDataset(rawData); // validation summary logged internally if needed

  const cleanedAll: CleanedTransaction[] = [];
  const validationErrors: Record<string, number> = {};
  let invalid = 0;

  // Step 1: Validation + cleaning
  for (const r of rawData) {
    const val = validator.validateTransaction(r);
    if (!val.isValid) {
      invalid++;
      for (const e of val.errors) {
        validationErrors[e] = (validationErrors[e] || 0) + 1;
      }
      continue;
    }
    const cleaned = cleanTransaction(r);
    if (!cleaned) {
      invalid++;
      validationErrors["Failed to clean"] = (validationErrors["Failed to clean"] || 0) + 1;
      continue;
    }
    cleanedAll.push(cleaned);
  }

  // Step 2: Deduplication by TransactionID
  const seen = new Set<string>();
  const deduped: CleanedTransaction[] = [];
  const duplicateIds: string[] = [];
  for (const tx of cleanedAll) {
    const id = tx.transactionId ? tx.transactionId.trim() : "";
    const key = id || `${tx.customerId}-${tx.transactionDate.getTime()}-${tx.transactionAmount}`;
    if (id && seen.has(id)) {
      duplicateIds.push(id);
      continue;
    }
    seen.add(key);
    deduped.push(tx);
  }

  // Step 3: Reconciliation check
  const byCustomer = new Map<number, CleanedTransaction[]>();
  for (const tx of deduped) {
    if (!byCustomer.has(tx.customerId)) byCustomer.set(tx.customerId, []);
    byCustomer.get(tx.customerId)!.push(tx);
  }

  const reconciliationIssues: { customerId: number; txIndex: number; expected: number; actual: number }[] = [];

  for (const [cid, txs] of byCustomer.entries()) {
    txs.sort((a, b) => a.transactionDate.getTime() - b.transactionDate.getTime());
    let prevBalance = txs[0].accountBalance;
    for (let i = 0; i < txs.length; i++) {
      const t = txs[i];
      const sign = t.transactionType === "withdrawal" ? -1 : 1;
      const expectedAfter = +(prevBalance + sign * t.transactionAmount);
      const actualAfter = +t.accountBalanceAfter;
      if (Number.isFinite(actualAfter) && Math.abs(expectedAfter - actualAfter) > 1.0) {
        reconciliationIssues.push({ customerId: cid, txIndex: i, expected: expectedAfter, actual: actualAfter });
      }
      prevBalance = actualAfter;
    }
  }

  const end = performance.now();

  // Step 4: Build stats object
  const stats: ProcessingStats = {
    totalRecords: rawData.length,
    validRecords: deduped.length,
    invalidRecords: invalid,
    duplicateRecords: duplicateIds.length,
    processingTime: Math.round(end - start),
    validationErrors,
    reconciliationIssues,
  };

  return {
    cleaned: deduped,
    stats,
    duplicateIds,
  };
}
