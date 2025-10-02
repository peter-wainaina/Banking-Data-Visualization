"use client"

import { Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../chart"
import { useMemo } from "react"
import type { CleanedTransaction } from "../../types/bankingtypes"

/**
 * VISUALIZATION 3: BRANCH PERFORMANCE METRICS
 *
 * Chart Type: Grouped Bar Chart
 * X-Axis: Branch IDs
 * Y-Axis: Transaction volume (in thousands $K)
 *
 * Data Aggregation:
 * - Calculate total transaction volume by branch
 * - Aggregate: SUM(transactionAmount) GROUP BY branchId
 * - Compare current month vs previous month performance
 *
 * Business Insight:
 * Compares branch performance and identifies high/low performing locations.
 * Enables executives to recognize top branches, allocate resources to struggling
 * locations, and make data-driven decisions about staffing, marketing, or
 * expansion. Critical for operational efficiency and regional strategy.
 *
 * Sample Data Preparation:
 * const branchPerformance = transactions
 *   .filter(t => t.transactionMonth === currentMonth)
 *   .reduce((acc, transaction) => {
 *     if (!acc[transaction.branchId]) {
 *       acc[transaction.branchId] = { current: 0, previous: 0 }
 *     }
 *     acc[transaction.branchId].current += transaction.transactionAmount
 *     return acc
 *   }, {})
 */

export function PerformanceMetricsChart({ data }: { data: CleanedTransaction[] }) {
  const branchPerformanceData = useMemo(() => {
    const branchData: Record<string, { current: number; previous: number }> = {}

    // Get current and previous month
    const sortedMonths = Array.from(new Set(data.map((t) => t.transactionMonth))).sort()
    const currentMonth = sortedMonths[sortedMonths.length - 1]
    const previousMonth = sortedMonths[sortedMonths.length - 2]

    data.forEach((transaction) => {
      const branch = transaction.branchId || "Unknown"
      if (!branchData[branch]) {
        branchData[branch] = { current: 0, previous: 0 }
      }

      if (transaction.transactionMonth === currentMonth) {
        branchData[branch].current += transaction.transactionAmount
      } else if (transaction.transactionMonth === previousMonth) {
        branchData[branch].previous += transaction.transactionAmount
      }
    })

    return Object.entries(branchData)
      .map(([branch, data]) => ({
        branch,
        current: Math.round(data.current / 1000),
        previous: Math.round(data.previous / 1000),
      }))
      .sort((a, b) => b.current - a.current)
  }, [data])

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-foreground">Branch Performance Metrics</CardTitle>
        <CardDescription className="text-muted-foreground">
          Transaction volume by branch (Current vs. Previous Month)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            current: {
              label: "Current Month",
              color: "hsl(var(--chart-1))",
            },
            previous: {
              label: "Previous Month",
              color: "hsl(var(--chart-3))",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={branchPerformanceData} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="branch"
                className="text-xs text-muted-foreground"
                tick={{ fill: "hsl(var(--muted-foreground))" }}
              />
              <YAxis className="text-xs text-muted-foreground" tick={{ fill: "hsl(var(--muted-foreground))" }} />
              <ChartTooltip content={ChartTooltipContent } />
              <Bar dataKey="current" fill="var(--color-current)" radius={[8, 8, 0, 0]} />
              <Bar dataKey="previous" fill="var(--color-previous)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
