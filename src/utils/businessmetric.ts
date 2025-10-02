// --- Loan, Card, Credit Types & Total Loan Amount ---
// Get loan types and their counts
export function getLoanTypes(data: CleanedTransaction[]): Record<string, number> {
  const types: Record<string, number> = {};
  for (const tx of data) {
    if (tx.loanId) {
      types[tx.loanId] = (types[tx.loanId] || 0) + 1;
    }
  }
  return types;
}

// Get card types and their counts
export function getCardTypes(data: CleanedTransaction[]): Record<string, number> {
  const types: Record<string, number> = {};
  for (const tx of data) {
    if (tx.cardType) {
      types[tx.cardType] = (types[tx.cardType] || 0) + 1;
    }
  }
  return types;
}

// Get credit types and their counts (if you have a creditType field, otherwise skip or clarify)
// Example: export function getCreditTypes(data: CleanedTransaction[]): Record<string, number> { ... }

// Get total loan amount
export function getTotalLoanAmount(data: CleanedTransaction[]): number {
  let total = 0;
  for (const tx of data) {
    if (tx.loanAmount !== undefined && tx.loanAmount !== null) {
      total += tx.loanAmount;
    }
  }
  return total;
}
// Calculate monthly transaction volume by branch
import type { CleanedTransaction } from "../types/bankingtypes";

// Calculate monthly transaction volume by branch
export function getMonthlyVolumeByBranch(data: CleanedTransaction[]): Map<string, Map<string, number>> {
  const result = new Map<string, Map<string, number>>();
  for (const tx of data) {
    // Always use branchId as key, fallback to "Unknown" if missing or empty
    const branchId = tx.branchId && tx.branchId.trim() !== "" ? tx.branchId : "Unknown";
    const month = tx.transactionMonth;
    if (!result.has(branchId)) result.set(branchId, new Map());
    const branchMap = result.get(branchId)!;
    branchMap.set(month, (branchMap.get(month) ?? 0) + tx.transactionAmount);
  }
  return result;
}

// Find customers with unusual spending patterns (simple Z-score anomaly detection)
export function detectAnomalousTransactions(data: CleanedTransaction[]): CleanedTransaction[] {
  const byCustomer = new Map<number, CleanedTransaction[]>();
  for (const tx of data) {
    if (!byCustomer.has(tx.customerId)) byCustomer.set(tx.customerId, []);
    byCustomer.get(tx.customerId)!.push(tx);
  }

  const anomalies: CleanedTransaction[] = [];
  for (const txs of byCustomer.values()) {
    const amounts = txs.map(t => t.transactionAmount);
    const mean = amounts.reduce((a, b) => a + b, 0) / amounts.length;
    const std = Math.sqrt(amounts.reduce((sum, a) => sum + Math.pow(a - mean, 2), 0) / amounts.length);

    for (const tx of txs) {
      const z = std ? Math.abs((tx.transactionAmount - mean) / std) : 0;
      if (z > 2) anomalies.push(tx); // threshold for anomaly
    }
  }
  return anomalies;
}
export function getTotalMonthlyVolume(data: CleanedTransaction[]): Map<string, number> {
  const result = new Map<string, number>()
  for (const tx of data) {
    const month = tx.transactionMonth
    result.set(month, (result.get(month) ?? 0) + tx.transactionAmount)
  }
  return result
}

// Calculate customer lifetime value
export function calculateCustomerLTV(customerId: number, data: CleanedTransaction[]): number {
  const txs = data.filter(tx => tx.customerId === customerId);
  let ltv = 0;
  for (const tx of txs) {
    if (tx.transactionType === "deposit") ltv += tx.transactionAmount;
    if (tx.transactionType === "withdrawal") ltv -= tx.transactionAmount;
  }
  return ltv;
}

// --- Loans ---
export function getLoanTypeStatusCounts(data: CleanedTransaction[]) {
  const typeCounts: Record<string, number> = {};
  const statusCounts: Record<string, number> = {};
  for (const tx of data) {
    // Use loanId for loan presence, loanStatus for status, and loanAmount for amount
    if (tx.loanId && tx.loanAmount !== undefined) {
      const type = tx.loanId || "Unknown";
      typeCounts[type] = (typeCounts[type] || 0) + 1;
    }
    if (tx.loanStatus) statusCounts[tx.loanStatus] = (statusCounts[tx.loanStatus] || 0) + 1;
  }
  return { typeCounts, statusCounts };
}

export function getAverageLoanAmountByTypeStatus(data: CleanedTransaction[]) {
  const byStatus: Record<string, { sum: number; count: number }> = {};
  for (const tx of data) {
    if (tx.loanStatus && tx.loanAmount !== undefined) {
      if (!byStatus[tx.loanStatus]) byStatus[tx.loanStatus] = { sum: 0, count: 0 };
      byStatus[tx.loanStatus].sum += tx.loanAmount ?? 0,
      byStatus[tx.loanStatus].count += 1;
    }
  }
  return {
    byStatus: Object.fromEntries(Object.entries(byStatus).map(([status, { sum, count }]) => [status, sum / count])),
  };
}


// --- Customer Overview ---
export function getAgeBands(data: CleanedTransaction[], bands = [18, 25, 35, 45, 55, 65, 75, 100]) {
  const bandCounts: Record<string, number> = {};
  for (const tx of data) {
    const age = tx.customerAge;
    const band = bands.find(b => age <= b) ?? bands[bands.length - 1];
    const label = age < bands[0] ? `<${bands[0]}` : `${band === bands[0] ? bands[0] : bands[bands.indexOf(band) - 1] + 1}-${band}`;
    bandCounts[label] = (bandCounts[label] || 0) + 1;
  }
  return bandCounts;
}

export function getGenderCounts(data: CleanedTransaction[]) {
  const counts: Record<string, number> = {};
  for (const tx of data) {
    counts[tx.customerGender] = (counts[tx.customerGender] || 0) + 1;
  }
  return counts;
}

export function getTopCities(data: CleanedTransaction[], topN = 10) {
  const counts: Record<string, number> = {};
  for (const tx of data) {
    if (tx.city) counts[tx.city] = (counts[tx.city] || 0) + 1;
  }
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN);
}

export function getAccountTypeCounts(data: CleanedTransaction[]) {
  const counts: Record<string, number> = {};
  for (const tx of data) {
    if (tx.accountType) counts[tx.accountType] = (counts[tx.accountType] || 0) + 1;
  }
  return counts;
}
export function getDepositWithdrawalByMonth(data: CleanedTransaction[]) {
  const byMonth: Record<string, { deposits: number; withdrawals: number }> = {}
  for (const tx of data) {
    if (!byMonth[tx.transactionMonth]) byMonth[tx.transactionMonth] = { deposits: 0, withdrawals: 0 }
    if (tx.transactionType === "deposit") byMonth[tx.transactionMonth].deposits += tx.transactionAmount
    if (tx.transactionType === "withdrawal") byMonth[tx.transactionMonth].withdrawals += tx.transactionAmount
  }
  return byMonth
}

export function getMonthlyTransactionVolume(data: CleanedTransaction[]) {
  const byMonth: Record<string, number> = {}
  for (const tx of data) {
    byMonth[tx.transactionMonth] = (byMonth[tx.transactionMonth] || 0) + tx.transactionAmount
  }
  return byMonth
}

// --- Cards ---
export function getCardTypeCounts(data: CleanedTransaction[]) {
  const counts: Record<string, number> = {};
  for (const tx of data) {
    if (tx.cardType) counts[tx.cardType] = (counts[tx.cardType] || 0) + 1;
  }
  return counts;
}

export function getAverageUtilizationByCardType(data: CleanedTransaction[]) {
  const byType: Record<string, { sum: number; count: number }> = {};
  for (const tx of data) {
    if (tx.cardType && tx.creditLimit && tx.creditLimit > 0 && tx.creditCardBalance !== undefined && tx.creditCardBalance !== null) {
      const utilization = tx.creditCardBalance / tx.creditLimit;
      if (!byType[tx.cardType]) byType[tx.cardType] = { sum: 0, count: 0 };
      byType[tx.cardType].sum += utilization;
      byType[tx.cardType].count += 1;
    }
  }
  return Object.fromEntries(
    Object.entries(byType).map(([type, { sum, count }]) => [type, sum / count])
  );
}

export function getRewardsHistogram(data: CleanedTransaction[], binSize = 1000) {
  const bins: Record<string, number> = {};
  for (const tx of data) {
    if (tx.rewardsPoints !== undefined && tx.rewardsPoints !== null) {
      const bin = Math.floor(tx.rewardsPoints / binSize) * binSize;
      bins[bin] = (bins[bin] || 0) + 1;
    }
  }
  return bins;
}