// "use client"

// import { useMemo } from "react"
// import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../card"
// import type { CleanedTransaction } from "../../types/bankingtypes"

// interface FunnelData {
//   stage: string
//   count: number
//   color: string
//   conversionRate: string
// }

// export function FunnelChart({ cleanedTransactions }: { cleanedTransactions: CleanedTransaction[] }) {
//   const funnelData: FunnelData[] = useMemo(() => {
//     if (!cleanedTransactions?.length) return []

//     const uniqueCustomers = new Set(cleanedTransactions.map((t) => t.customerId)).size
//     const activeAccounts = new Set(
//       cleanedTransactions
//         .filter((t) => {
//           const oneYearAgo = new Date()
//           oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)
//           return t.transactionDate >= oneYearAgo
//         })
//         .map((t) => t.customerId),
//     ).size

//     const customersWithLoans = new Set(cleanedTransactions.filter((t) => t.loanId).map((t) => t.customerId)).size
//     const approvedLoans = new Set(
//       cleanedTransactions.filter((t) => t.loanStatus === "Approved").map((t) => t.customerId),
//     ).size
//     const activeLoans = new Set(
//       cleanedTransactions.filter((t) => t.loanAmount && t.loanAmount > 0).map((t) => t.customerId),
//     ).size
//     const customersWithCards = new Set(cleanedTransactions.filter((t) => t.cardId).map((t) => t.customerId)).size

//     const stages = [
//       { stage: "Total Customers", count: uniqueCustomers, color: "#3b82f6" },
//       { stage: "Active Accounts", count: activeAccounts, color: "#0ea5e9" },
//       { stage: "Loan Applications", count: customersWithLoans, color: "#10b981" },
//       { stage: "Approved Loans", count: approvedLoans, color: "#22c55e" },
//       { stage: "Active Loans", count: activeLoans, color: "#f59e0b" },
//       { stage: "Credit Card Holders", count: customersWithCards, color: "#8b5cf6" },
//     ]

//     return stages.map((stage, index) => ({
//       ...stage,
//       conversionRate: index > 0 ? ((stage.count / stages[index - 1].count) * 100).toFixed(1) : "100.0",
//     }))
//   }, [cleanedTransactions])

//   return (
//     <Card className="border-border/50 bg-card/50 backdrop-blur">
//       <CardHeader>
//         <CardTitle className="text-foreground">Customer Product Adoption Funnel</CardTitle>
//         <CardDescription className="text-muted-foreground">
//           Journey from customer acquisition to product adoption
//         </CardDescription>
//       </CardHeader>
//       <CardContent>
//         <div className="h-[350px] w-full">
//           <ResponsiveContainer width="100%" height="100%">
//             <BarChart data={funnelData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
//               <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
//               <XAxis
//                 dataKey="stage"
//                 angle={-45}
//                 textAnchor="end"
//                 height={100}
//                 stroke="hsl(var(--muted-foreground))"
//                 fontSize={12}
//               />
//               <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
//               <Tooltip
//                 contentStyle={{
//                   backgroundColor: "hsl(var(--popover))",
//                   border: "1px solid hsl(var(--border))",
//                   borderRadius: "8px",
//                 }}
//                 formatter={(value: any, _: any, props: any) => [`${value} customers`, props.payload.stage]}
//                 labelFormatter={(label) => `Stage: ${label}`}
//               />
//               <Bar dataKey="count" radius={[8, 8, 0, 0]}>
//                 {funnelData.map((entry, index) => (
//                   <Cell key={`cell-${index}`} fill={entry.color} />
//                 ))}
//               </Bar>
//             </BarChart>
//           </ResponsiveContainer>
//         </div>

//         <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-6">
//           {funnelData.map((stage, index) => (
//             <div key={index} className="rounded-lg border border-border/50 bg-muted/30 p-3">
//               <p className="text-xs font-medium text-muted-foreground">{stage.stage}</p>
//               <p className="mt-1 text-lg font-bold text-foreground">{stage.conversionRate}%</p>
//             </div>
//           ))}
//         </div>
//       </CardContent>
//     </Card>
//   )
// }
