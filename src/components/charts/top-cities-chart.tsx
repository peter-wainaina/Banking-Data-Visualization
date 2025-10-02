"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../card"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import type { CleanedTransaction } from "../../types/bankingtypes"
import { getTopCities } from "../../utils/businessmetric"

interface TopCitiesChartProps {
  data: CleanedTransaction[]
}

export function TopCitiesChart({ data }: TopCitiesChartProps) {
  const topCities = getTopCities(data, 10)
  const chartData = topCities.map(([city, count]) => ({ city, count }))

  return (
    <Card className="bg-gray-100 text-gray-900 border border-gray-300">
      <CardHeader>
        <CardTitle className="text-gray-900">Top 10 Cities</CardTitle>
        <CardDescription className="text-gray-500">Customer distribution by location</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" />
              <XAxis type="number" stroke="#6b7280" fontSize={12} />
              <YAxis dataKey="city" type="category" stroke="#6b7280" fontSize={12} width={100} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#f3f4f6",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                  color: "#2b59bbff",
                }}
              />
              <Bar dataKey="count" fill="#49bcbcff" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
