"use client"
// AgeDistributionChart: Bar chart showing customer age bands, with friendly comments!
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../card"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import type { CleanedTransaction } from "../../types/bankingtypes"
import { getAgeBands } from "../../utils/businessmetric"

export function AgeDistributionChart({ data }: { data: CleanedTransaction[] }) {
  // Get age bands and counts from the data
  const chartData = Object.entries(getAgeBands(data)).map(([band, count]) => ({ band, count }))
  // Render a stylish bar chart inside a card
  return (
    <Card className="bg-gray-100 text-gray-900 border border-gray-300">
      <CardHeader>
        <CardTitle className="text-gray-900">Age Distribution</CardTitle>
        <CardDescription className="text-gray-500">Customer age demographics</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Bar chart: each bar is an age group! */}
        <div className="w-full h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" />
              <XAxis dataKey="band" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: "#f3f4f6", border: "1px solid #d1d5db", borderRadius: "8px", color: "#111827" }} />
              <Bar dataKey="count" fill="#452e9fff" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
