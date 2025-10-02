
"use client"
// LTVHistogramChart: Bar chart of customer lifetime value bands
import { useMemo } from "react"
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../card"
import type { CleanedTransaction } from "../../types/bankingtypes"
import { calculateCustomerLTV } from "../../utils/businessmetric"

export function LTVHistogramChart({ cleanedTransactions }: { cleanedTransactions: CleanedTransaction[] }) {
  // Calculate LTV bands and counts for all customers
  const histogramData = useMemo(() => {
    if (!cleanedTransactions?.length) return []
    const buckets = [
      { range: "$0-$10K", min: 0, max: 10000, count: 0 },
      { range: "$10K-$50K", min: 10000, max: 50000, count: 0 },
      { range: "$50K-$100K", min: 50000, max: 100000, count: 0 },
      { range: "$100K-$250K", min: 100000, max: 250000, count: 0 },
      { range: "$250K+", min: 250000, max: Number.POSITIVE_INFINITY, count: 0 },
    ]
    Array.from(new Set(cleanedTransactions.map(t => t.customerId)))
      .map(id => calculateCustomerLTV(id, cleanedTransactions))
      .forEach(ltv => { const b = buckets.find(b => ltv >= b.min && ltv < b.max); if (b) b.count++ })
    return buckets
  }, [cleanedTransactions])
  // Render a stylish bar chart inside a card using Tailwind CSS
  return (
    <Card className="bg-gray-100 border border-gray-200 shadow-lg rounded-xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl font-bold text-black">Customer Lifetime Value Distribution</CardTitle>
        <CardDescription className="text-sm text-gray-500">Number of customers in each LTV bracket</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        {/* Bar chart: each bar is an LTV band! */}
        <div className="h-[350px] w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={histogramData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" opacity={0.5} />
              <XAxis dataKey="range" stroke="#06050594" fontSize={14} tickLine={false} axisLine={false} className="font-semibold" />
              <YAxis stroke="#19191bdb" fontSize={14} tickLine={false} axisLine={false} className="font-semibold" />
              <Tooltip contentStyle={{ backgroundColor: "#f3f4f6", border: "1px solid #6366f1", borderRadius: "12px", color: "#3730a3" }} formatter={(value: any) => [`${value} customers`, "Count"]} />
              <Bar dataKey="count" fill="#8b5cf6" radius={[12, 12, 0, 0]} barSize={70} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
