"use client"

import { Card } from "./card"
import { Users, Wallet, TrendingUp, CreditCard, DollarSign, AlertCircle } from "lucide-react"
import type { CleanedTransaction } from "../types/bankingtypes"

interface KPICardsProps {
  data: CleanedTransaction[]
}

export function KPICards({ data }: KPICardsProps) {
  // Calculate KPIs
  const uniqueCustomers = new Set(data.map((tx) => tx.customerId)).size
  const uniqueAccounts = new Set(data.map((tx) => `${tx.customerId}-${tx.accountType}`)).size
  const totalBalance = data.reduce((sum, tx) => sum + tx.accountBalance, 0)
  const avgBalance = totalBalance / (uniqueAccounts || 1)

  const totalTransactions = data.length
  const deposits = data.filter((tx) => tx.transactionType === "deposit")
  const withdrawals = data.filter((tx) => tx.transactionType === "withdrawal")
  const totalDeposits = deposits.reduce((sum, tx) => sum + tx.transactionAmount, 0)
  const totalWithdrawals = withdrawals.reduce((sum, tx) => sum + tx.transactionAmount, 0)
  const netInflow = totalDeposits - totalWithdrawals

  const loansData = data.filter((tx) => tx.loanAmount && tx.loanAmount > 0)
  const totalLoans = loansData.length
  const approvedLoans = loansData.filter((tx) => tx.loanStatus === "Approved").length
  const approvalRate = totalLoans > 0 ? (approvedLoans / totalLoans) * 100 : 0
  const avgLoanAmount = loansData.reduce((sum, tx) => sum + (tx.loanAmount || 0), 0) / (totalLoans || 1)

  // Total Loan Amount KPI
  const totalLoanAmount = loansData.reduce((sum, tx) => sum + (tx.loanAmount || 0), 0)

  const cardsData = data.filter((tx) => tx.creditCardBalance !== undefined && tx.creditCardBalance !== null)
  const avgUtilization =
    cardsData.reduce((sum, tx) => {
      if (tx.creditLimit && tx.creditLimit > 0) {
        return sum + (tx.creditCardBalance || 0) / tx.creditLimit
      }
      return sum
    }, 0) / (cardsData.length || 1)
  const totalRewards = data.reduce((sum, tx) => sum + (tx.rewardsPoints || 0), 0)

  const kpis = [
    {
      title: "Total Customers",
      value: uniqueCustomers.toLocaleString(),
      icon: Users,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Total Accounts",
      value: uniqueAccounts.toLocaleString(),
      icon: Wallet,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
    },
    {
      title: "Avg Balance",
      value: `$${avgBalance.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
      icon: DollarSign,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
    },
    {
      title: "Total Transactions",
      value: totalTransactions.toLocaleString(),
      icon: TrendingUp,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "Net Inflow",
      value: `$${netInflow.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
      icon: TrendingUp,
      color: netInflow >= 0 ? "text-emerald-500" : "text-red-500",
      bgColor: netInflow >= 0 ? "bg-emerald-500/10" : "bg-red-500/10",
    },
    {
      title: "Total Loan Amount",
      value: `$${totalLoanAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
      icon: DollarSign,
      color: "text-blue-600",
      bgColor: "bg-blue-600/10",
    },
    {
      title: "Loan Approval Rate",
      value: `${approvalRate.toFixed(1)}%`,
      icon: AlertCircle,
      color: "text-cyan-500",
      bgColor: "bg-cyan-500/10",
    },
    {
      title: "Avg Loan Amount",
      value: `$${avgLoanAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
      icon: DollarSign,
      color: "text-indigo-500",
      bgColor: "bg-indigo-500/10",
    },
    {
      title: "Card Utilization",
      value: `${(avgUtilization * 100).toFixed(1)}%`,
      icon: CreditCard,
      color: "text-pink-500",
      bgColor: "bg-pink-500/10",
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi, index) => (
        <Card key={index} className="p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-lg ${kpi.bgColor}`}>
              <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{kpi.title}</p>
              <p className="text-2xl font-bold">{kpi.value}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
