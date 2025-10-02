// src/services/validator.ts
import type { RawTransaction, ValidationResult } from "../types/bankingtypes";
import { parseAmount, parseDate } from "../utils/parser";

export class DataValidator {
  validateDataset(rawData: RawTransaction[]) {
    // run row-level validation to compute counts
    let valid = 0;
    let invalid = 0;
    const ids = new Set<string>();
    let dupCount = 0;

    for (const row of rawData) {
      const res = this.validateTransaction(row);
      if (res.isValid) valid++; else invalid++;
      const id = (row["TransactionID"] || "").trim();
      if (id) {
        if (ids.has(id)) dupCount++;
        else ids.add(id);
      }
    }

    return {
      summary: {
        totalRecords: rawData.length,
        validRecords: valid,
        invalidRecords: invalid,
        duplicateRecords: dupCount,
        customersWithInconsistencies: 0,
      },
      duplicateResults: { uniqueTransactions: rawData },
      consistencyResults: [],
    };
  }

  validateTransaction(tx: RawTransaction): ValidationResult {
    const errors: string[] = [];
    // Required fields
    if (!tx["Customer ID"]) errors.push("Missing Customer ID");
    if (!tx["Transaction Date"] && !tx["Last Transaction Date"]) errors.push("Missing Transaction Date");
    if (!tx["Transaction Amount"]) errors.push("Missing Transaction Amount");

    // Numeric checks
    const amt = parseAmount(tx["Transaction Amount"]);
    if (amt === 0 && String(tx["Transaction Amount"]).trim() !== "0") {
      // treat empty/N/A as 0 earlier; flag suspicious empties if source had no amount
      errors.push("Invalid Transaction Amount");
    }
    if (amt < 0 && (String(tx["Transaction Type"] || "").toLowerCase().includes("deposit"))) {
      errors.push("Deposit amount must be positive");
    }

    const balAfter = parseAmount(tx["Account Balance After Transaction"]);
    if (Number.isNaN(balAfter)) errors.push("Invalid Account Balance After Transaction");

    const age = Number(tx["Age"]);
    if (isNaN(age) || age < 18 || age > 120) errors.push("Invalid Customer Age");

    return { isValid: errors.length === 0, errors, warnings: [] };
  }
}
