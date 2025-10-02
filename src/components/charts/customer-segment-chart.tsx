
"use client"
// CustomerSegmentChart: Pie chart of customer account types
import { Pie, PieChart, Cell, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../card"
import { ChartContainer, ChartTooltip } from "../chart"
import { useMemo } from "react"
import type { CleanedTransaction } from "../../types/bankingtypes"
const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))"]

export function CustomerSegmentChart({ data }: { data: CleanedTransaction[] }) {
  // Calculate unique customer counts per account type, and their percentages
  const accountTypeData = useMemo(() => {
    const counts: Record<string, Set<number>> = {}
    data.forEach(tx => {
      if (!tx.accountType) return
      counts[tx.accountType] = counts[tx.accountType] || new Set()
      counts[tx.accountType].add(tx.customerId)
    })
    const total = new Set(data.map(t => t.customerId)).size
    return Object.entries(counts).map(([segment, set]) => ({ segment, value: set.size, percentage: ((set.size / total) * 100).toFixed(1) })).sort((a, b) => b.value - a.value)
  }, [data])
  // Render a pie chart inside a card
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-foreground">Account Type Distribution</CardTitle>
        <CardDescription className="text-muted-foreground">Customer breakdown by account type</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Pie chart: each slice is a customer segment! */}
        <ChartContainer className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={accountTypeData} cx="50%" cy="50%" labelLine={false} label={({ segment, percentage }) => `${segment} ${percentage}%`} outerRadius={90} fill="#8884d8" dataKey="value">
                {accountTypeData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <ChartTooltip content={({ active, payload }: { active?: boolean; payload?: any[] }) => active && payload && payload.length ? (
                <div className="rounded-lg border border-border bg-card p-3 shadow-lg">
                  <p className="font-semibold text-foreground">{payload[0].payload.segment}</p>
                  <p className="text-sm text-muted-foreground">{payload[0].value.toLocaleString()} customers ({payload[0].payload.percentage}%)</p>
                </div>
              ) : null} />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
