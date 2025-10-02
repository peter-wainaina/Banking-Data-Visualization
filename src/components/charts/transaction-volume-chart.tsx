"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../card"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import type { CleanedTransaction } from "../../types/bankingtypes"
import { getMonthlyTransactionVolume } from "../../utils/businessmetric"

interface TransactionVolumeChartProps {
  data: CleanedTransaction[]
}

export function TransactionVolumeChart({ data }: TransactionVolumeChartProps) {
  const volumeByMonth = getMonthlyTransactionVolume(data)
  const chartData = Object.entries(volumeByMonth)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, amount]) => ({
      month,
      amount,
    }))

  return (
    <Card className="bg-gray-100 text-gray-900 border border-gray-300">
      <CardHeader>
        <CardTitle className="text-gray-900">Monthly Transaction Volume</CardTitle>
        <CardDescription className="text-gray-500">Total transaction amount over time</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#25c7ebff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" />
              <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#f3f4f6",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                  color: "#111827",
                }}
              />
              <Area
                type="monotone"
                dataKey="amount"
                stroke="#2563eb"
                fillOpacity={1}
                fill="url(#colorAmount)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
