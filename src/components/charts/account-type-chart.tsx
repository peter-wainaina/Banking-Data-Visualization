
"use client"
// AccountTypeChart: Pie chart showing distribution of account types 
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../card"
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import type { CleanedTransaction } from "../../types/bankingtypes"
import { getAccountTypeCounts } from "../../utils/businessmetric"
const COLORS = ["#1f4979ff", "#e37a17a8", "#f59e42", "#ef4444"] // Tailwind-inspired palette

// Props: expects an array of cleaned transactions
export function AccountTypeChart({ data }: { data: CleanedTransaction[] }) {
  // Crunch the numbers: get counts for each account type
  const chartData = Object.entries(getAccountTypeCounts(data)).map(([name, value]) => ({ name, value }))
  // Render a beautiful pie chart inside a styled card
  return (
    <Card className="bg-gray-100 text-gray-900 border border-gray-300">
      <CardHeader>
        <CardTitle className="text-gray-900">Account Type Distribution</CardTitle>
        <CardDescription className="text-gray-500">Breakdown by account type</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Pie chart: each slice is an account type! */}
        <div className="w-full h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={chartData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} fill="#2563eb" dataKey="value" label={entry => entry.name}>
                {chartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: "#f3f4f6", border: "1px solid #d1d5db", borderRadius: "8px", color: "#111827" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
