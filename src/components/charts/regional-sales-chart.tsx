"use client"

import { Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../card"
import { ChartContainer, ChartTooltipContent } from "../chart"
import { useMemo } from "react"
import type { CleanedTransaction } from "../../types/bankingtypes"

/**
 * VISUALIZATION 4: CITY-WISE TRANSACTION ANALYSIS
 *
 * Chart Type: Horizontal Bar Chart
 * X-Axis: Transaction volume (in thousands $K)
 * Y-Axis: Cities
 *
 * Data Aggregation:
 * - Sum transaction amounts by city
 * - Calculate: SUM(transactionAmount) GROUP BY city
 * - Sort by transaction volume descending to show top performing cities
 * - Convert to thousands for readability
 *
 * Business Insight:
 * Identifies which geographic markets have the highest banking activity and
 * where growth opportunities exist. Helps executives make decisions about
 * branch expansion, ATM placement, and regional marketing campaigns. Essential
 * for understanding geographic revenue distribution and planning market penetration.
 *
 * Sample Data Preparation:
 * const transactionsByCity = transactions
 *   .reduce((acc, transaction) => {
 *     const city = transaction.city
 *     acc[city] = (acc[city] || 0) + transaction.transactionAmount
 *     return acc
 *   }, {})
 *
 * const cityData = Object.entries(transactionsByCity)
 *   .map(([city, amount]) => ({
 *     city,
 *     volume: Math.round(amount / 1000), // Convert to thousands
 *     customerCount: getUniqueCustomers(city)
 *   }))
 *   .sort((a, b) => b.volume - a.volume)
 */

export function RegionalSalesChart({ data }: { data: CleanedTransaction[] }) {
  const cityTransactionData = useMemo(() => {
    const cityData: Record<string, { volume: number; customers: Set<number> }> = {}

    data.forEach((transaction) => {
      const city = transaction.city || "Unknown"
      if (!cityData[city]) {
        cityData[city] = { volume: 0, customers: new Set() }
      }
      cityData[city].volume += transaction.transactionAmount
      cityData[city].customers.add(transaction.customerId)
    })

    return Object.entries(cityData)
      .map(([city, data]) => ({
        city,
        volume: Math.round(data.volume / 1000),
        customerCount: data.customers.size,
      }))
      .sort((a, b) => b.volume - a.volume)
  }, [data])

  // Tailwind-based styling for card and chart elements
  return (
    <Card className="border rounded-lg bg-white shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-gray-800">City-wise Transaction Analysis</CardTitle>
        <CardDescription className="text-sm text-gray-500">Transaction volume by city (in thousands)</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <ChartContainer
          config={{
            volume: {
              label: "Volume ($K)",
              color: "#6366f1", // Tailwind indigo-500
            },
          }}
          className="h-72"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={cityTransactionData} layout="vertical" margin={{ top: 5, right: 30, left: 100, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" /> {/* Tailwind gray-200 */}
              <XAxis
                type="number"
                tick={{ fill: "#6b7280", fontSize: 12 }} // Tailwind gray-500
                axisLine={false}
              />
              <YAxis
                type="category"
                dataKey="city"
                tick={{ fill: "#6b7280", fontSize: 12 }}
                axisLine={false}
              />
              <Tooltip content={<ChartTooltipContent />} wrapperStyle={{ background: "#f4f4f4fe", borderRadius: 8, boxShadow: "0 2px 8px #e5e7eb" }} />
              <Bar dataKey="volume" fill="#6366f1" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
