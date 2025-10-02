
"use client"
// DepositWithdrawalChart: Bar chart comparing deposits and withdrawals
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../card"
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import type { CleanedTransaction } from "../../types/bankingtypes"
import { getDepositWithdrawalByMonth } from "../../utils/businessmetric"

export function DepositWithdrawalChart({ data }: { data: CleanedTransaction[] }) {
  // Prepare monthly deposit/withdrawal data for the chart
  const chartData = Object.entries(getDepositWithdrawalByMonth(data)).sort(([a], [b]) => a.localeCompare(b)).map(([month, v]) => ({ month, deposits: v.deposits, withdrawals: v.withdrawals }))
  // Render a bar chart inside a card
  return (
    <Card className="bg-gray-100 text-gray-900 border border-gray-300">
      <CardHeader>
        <CardTitle className="text-gray-900">Deposits vs Withdrawals</CardTitle>
        <CardDescription className="text-gray-500">Monthly comparison by transaction type</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Bar chart: each bar is a month's deposits/withdrawals! */}
        <div className="w-full h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" />
              <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: "#f3f4f6", border: "1px solid #d1d5db", borderRadius: "8px", color: "#111827" }} />
              <Legend />
              <Bar dataKey="deposits" fill="#09bf2de7" radius={[4, 4, 0, 0]} />
              <Bar dataKey="withdrawals" fill="#b92b12d7" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
