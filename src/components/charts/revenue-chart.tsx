"use client"

import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../chart"
import { useMemo } from "react"
import type { CleanedTransaction } from "../../types/bankingtypes"

/**
 * VISUALIZATION 1: TRANSACTION VOLUME TREND ANALYSIS
 *
 * Chart Type: Line Chart
 * X-Axis: Time (Months - Jan to Dec)
 * Y-Axis: Transaction Volume (in thousands $K)
 *
 * Data Aggregation:
 * - Monthly transaction totals aggregated from all transactions
 * - Calculate: SUM(transactionAmount) GROUP BY transactionMonth
 * - Compare deposits vs withdrawals for cash flow insights
 *
 * Business Insight:
 * Shows transaction volume trajectory and seasonal patterns in banking activity.
 * Helps executives identify growth trends, peak banking periods, and cash flow
 * patterns. Critical for liquidity management and forecasting customer behavior.
 *
 * Sample Data Preparation:
 * const volumeData = transactions
 *   .reduce((acc, transaction) => {
 *     const month = transaction.transactionMonth
 *     if (!acc[month]) acc[month] = { deposits: 0, withdrawals: 0 }
 *     if (transaction.transactionType === 'deposit') {
 *       acc[month].deposits += transaction.transactionAmount
 *     } else {
 *       acc[month].withdrawals += transaction.transactionAmount
 *     }
 *     return acc
 *   }, {})
 */

export function RevenueChart({ data }: { data: CleanedTransaction[] }) {
  const transactionVolumeData = useMemo(() => {
    const monthlyData: Record<string, { deposits: number; withdrawals: number }> = {}

    data.forEach((transaction) => {
      const month = transaction.transactionMonth
      if (!monthlyData[month]) {
        monthlyData[month] = { deposits: 0, withdrawals: 0 }
      }

      if (transaction.transactionType === "deposit") {
        monthlyData[month].deposits += transaction.transactionAmount
      } else if (transaction.transactionType === "withdrawal") {
        monthlyData[month].withdrawals += transaction.transactionAmount
      }
    })

    return Object.entries(monthlyData)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, data]) => ({
        month: new Date(month + "-01").toLocaleDateString("en-US", { month: "short" }),
        deposits: Math.round(data.deposits / 1000),
        withdrawals: Math.round(data.withdrawals / 1000),
      }))
  }, [data])

  // Tailwind-based styling for card and chart elements
  return (
    <Card className="border rounded-lg bg-white shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-gray-800">Transaction Volume Trend</CardTitle>
        <CardDescription className="text-sm text-gray-500">Monthly deposits vs. withdrawals (in thousands)</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <ChartContainer
          config={{
            deposits: {
              label: "Deposits",
              color: "#10b981", // Tailwind emerald-500
            },
            withdrawals: {
              label: "Withdrawals",
              color: "#ef4444", // Tailwind red-500
            },
          }}
          className="h-72"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={transactionVolumeData} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" /> {/* Tailwind gray-200 */}
              <XAxis
                dataKey="month"
                tick={{ fill: "#6b7280", fontSize: 12 }} // Tailwind gray-500
                axisLine={false}
              />
              <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} axisLine={false} />
              <ChartTooltip content={ChartTooltipContent} />
              <Line
                type="monotone"
                dataKey="deposits"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ fill: "#10b981", r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="withdrawals"
                stroke="#ef4444"
                strokeWidth={3}
                dot={{ fill: "#ef4444", r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
