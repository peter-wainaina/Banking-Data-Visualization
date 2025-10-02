"use client"

import { useMemo } from "react"
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../card"
import type { CleanedTransaction } from "../../types/bankingtypes"

export function ProductMixChart({ cleanedTransactions }: { cleanedTransactions: CleanedTransaction[] }) {
  const chartData = useMemo(() => {
    if (!cleanedTransactions?.length) return []

    const branchProducts = new Map<
      string,
      {
        accounts: Set<number>
        loans: Set<number>
        cards: Set<number>
      }
    >()

    cleanedTransactions.forEach((tx) => {
      const branch = tx.branchId || "Unknown"
      if (!branchProducts.has(branch)) {
        branchProducts.set(branch, {
          accounts: new Set(),
          loans: new Set(),
          cards: new Set(),
        })
      }

      const products = branchProducts.get(branch)!
      products.accounts.add(tx.customerId)
      if (tx.loanId) products.loans.add(tx.customerId)
      if (tx.cardId) products.cards.add(tx.customerId)
    })

    return Array.from(branchProducts.entries()).map(([branch, products]) => ({
      branch,
      Accounts: products.accounts.size,
      Loans: products.loans.size,
      Cards: products.cards.size,
    }))
  }, [cleanedTransactions])

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur">
      <CardHeader>
        <CardTitle className="text-foreground">Product Mix by Branch</CardTitle>
        <CardDescription className="text-muted-foreground">
          Distribution of accounts, loans, and cards across branches
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis
                dataKey="branch"
                angle={-45}
                textAnchor="end"
                height={100}
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Legend wrapperStyle={{ paddingTop: "20px" }} />
              <Bar dataKey="Accounts" stackId="a" fill="#3b82f6" radius={[0, 0, 0, 0]} />
              <Bar dataKey="Loans" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} />
              <Bar dataKey="Cards" stackId="a" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
