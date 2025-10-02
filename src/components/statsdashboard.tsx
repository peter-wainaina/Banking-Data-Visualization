"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card"
import type { ProcessingStats, CleanedTransaction } from "../types/bankingtypes"
import { getMonthlyVolumeByBranch, detectAnomalousTransactions, calculateCustomerLTV } from "../utils/businessmetric";

interface StatsDashboardProps {
  stats: ProcessingStats;
  cleanedData: CleanedTransaction[];
  selectedCustomerId?: number;
}

export function StatsDashboard({ stats, cleanedData, selectedCustomerId }: StatsDashboardProps) {
  const metrics = [
    { label: "Total Records", value: stats.totalRecords, color: "#3b82f6" }, // blue
    { label: "Valid Records", value: stats.validRecords, color: "#16a34a" }, // green
    { label: "Invalid Records", value: stats.invalidRecords, color: "#dc2626" }, // red
    { label: "Duplicate Records", value: stats.duplicateRecords, color: "#f59e0b" }, // amber
    { label: "Processing Time (ms)", value: stats.processingTime, color: "#9333ea" }, // purple
    { label: "Reconciliation Issues", value: stats.reconciliationIssues.length, color: "#ef4444" }, // red
  ]

  // Compute business metrics
  const monthlyVolume = getMonthlyVolumeByBranch(cleanedData);
  const anomalies = detectAnomalousTransactions(cleanedData);
  const ltv = selectedCustomerId ? calculateCustomerLTV(selectedCustomerId, cleanedData) : null;

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-foreground">Dataset Processing Stats</CardTitle>
        <CardDescription className="text-muted-foreground">
          Key metrics from data validation, cleaning, and reconciliation
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          {metrics.map((m, idx) => (
            <div
              key={idx}
              className="rounded-lg p-4 shadow bg-muted flex flex-col items-center justify-center"
              style={{ borderTop: `4px solid ${m.color}` }}
            >
              <p className="text-xs font-medium text-muted-foreground">{m.label}</p>
              <p className="mt-1 text-lg font-bold text-foreground">{m.value.toLocaleString()}</p>
            </div>
          ))}
        </div>

        {/* Monthly Volume by Branch */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Monthly Volume by Branch</CardTitle>
            <CardDescription>Transaction volume per branch per month</CardDescription>
          </CardHeader>
          <CardContent>
            {Array.from(monthlyVolume.entries()).map(([branch, months]) => (
              <div key={branch} className="mb-2">
                <strong>{branch}</strong>
                <ul className="ml-4">
                  {Array.from(months.entries()).map(([month, volume]) => (
                    <li key={month}>{month}: {volume.toLocaleString()}</li>
                  ))}
                </ul>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Anomalous Transactions */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Anomalous Transactions</CardTitle>
            <CardDescription>Transactions with unusual patterns</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Total anomalies: {anomalies.length}</p>
            {/* Optionally list some anomalies */}
            {anomalies.slice(0, 5).map((tx, idx) => (
              <div key={idx} className="text-xs text-muted-foreground mb-1">
                Customer {tx.customerId} | Amount: {tx.transactionAmount} | Date: {tx.transactionDate.toLocaleDateString()}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Customer Lifetime Value */}
        {selectedCustomerId && (
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>Customer Lifetime Value</CardTitle>
              <CardDescription>Selected Customer LTV</CardDescription>
            </CardHeader>
            <CardContent>
              <p>LTV: {ltv?.toLocaleString()}</p>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  )
}
