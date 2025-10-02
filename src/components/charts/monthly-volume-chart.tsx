"use client"
// MonthlyVolumeChart: Bar chart of monthly transaction volume,
import { useMemo } from "react"
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../card"
import type { CleanedTransaction } from "../../types/bankingtypes"
import { getMonthlyVolumeByBranch, getTotalMonthlyVolume } from "../../utils/businessmetric"

export function MonthlyVolumeChart({ cleanedTransactions, branchFilter }: { cleanedTransactions: CleanedTransaction[]; branchFilter?: string }) {
  // Prepare chart data for all branches or a specific branch
  const chartData = useMemo(() => {
    if (!cleanedTransactions?.length) return []
    if (!branchFilter || branchFilter === "all") {
      return Array.from(getTotalMonthlyVolume(cleanedTransactions).entries()).map(([month, total]) => ({ month, total })).sort((a, b) => a.month.localeCompare(b.month))
    } else {
      const branchData = getMonthlyVolumeByBranch(cleanedTransactions).get(branchFilter)
      if (!branchData) return []
      return Array.from(branchData.entries()).map(([month, total]) => ({ month, total })).sort((a, b) => a.month.localeCompare(b.month))
    }
  }, [cleanedTransactions, branchFilter])
  // Dynamic title and description
  const title = !branchFilter || branchFilter === "all" ? "Monthly Transaction Volume (All Branches)" : `Monthly Transaction Volume (Branch ${branchFilter})`
  const description = !branchFilter || branchFilter === "all" ? "Total transaction amounts per month across all branches" : `Transaction amounts per month for branch ${branchFilter}`
  // Render a stylish bar chart inside a card using Tailwind CSS
  return (
    <Card className="bg-gradient-to-br from-green-50 via-white to-blue-50 border border-gray-200 shadow-lg rounded-xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl font-bold text-green-700">{title}</CardTitle>
        <CardDescription className="text-sm text-gray-500">{description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        {/* Bar chart: each bar is a month's transaction volume! */}
        <div className="h-[350px] w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#bae6fd" opacity={0.5} />
              <XAxis dataKey="month" angle={-45} textAnchor="end" height={100} stroke="#059669" fontSize={14} tickLine={false} axisLine={false} className="font-semibold" />
              <YAxis stroke="#059669" fontSize={14} tickLine={false} axisLine={false} className="font-semibold" />
              <Tooltip contentStyle={{ backgroundColor: "#f0fdf4", border: "1px solid #059669", borderRadius: "12px", color: "#059669" }} formatter={(value: any) => [`$${value.toLocaleString()}`, "Volume"]} />
              <Legend wrapperStyle={{ paddingTop: "20px" }} />
              <Bar dataKey="total" fill="#156659ff" radius={[12, 12, 0, 0]} name="Transaction Volume" barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
