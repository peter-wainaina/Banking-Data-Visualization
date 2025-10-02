
"use client"
// AnomalyScatterChart: Scatter plot of flagged transactions
import { useMemo } from "react"
import { Scatter, ScatterChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ZAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../card"
import type { CleanedTransaction } from "../../types/bankingtypes"
import { detectAnomalousTransactions } from "../../utils/businessmetric"

export function AnomalyScatterChart({ cleanedTransactions }: { cleanedTransactions: CleanedTransaction[] }) {
  // Find anomalies and prep chart data
  const anomalyData = useMemo(() =>
    detectAnomalousTransactions(cleanedTransactions || []).map(tx => ({
      customerId: tx.customerId,
      amount: tx.transactionAmount,
      date: tx.transactionDate.toLocaleDateString(),
      z: Math.abs(tx.transactionAmount / 1000)
    })), [cleanedTransactions])
  // Render a scatter chart inside a card
  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur">
      <CardHeader>
        <CardTitle className="text-foreground">Anomalous Transactions</CardTitle>
        <CardDescription className="text-muted-foreground">Transactions with unusual patterns flagged for review</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Scatter chart: each dot is a flagged transaction! */}
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis type="number" dataKey="customerId" name="Customer ID" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis type="number" dataKey="amount" name="Amount" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <ZAxis type="number" dataKey="z" range={[50, 400]} />
              <Tooltip cursor={{ strokeDasharray: "3 3" }} contentStyle={{ backgroundColor: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} formatter={(value: any, name: string) => name === "amount" ? [`$${value.toLocaleString()}`, "Amount"] : [value, name]} />
              <Scatter name="Anomalies" data={anomalyData} fill="#ef4444" opacity={0.6} />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
        {/* Summary: how many anomalies did we find? */}
        <div className="mt-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
          <strong>{anomalyData.length}</strong> anomalous transactions detected requiring investigation
        </div>
      </CardContent>
    </Card>
  )
}
