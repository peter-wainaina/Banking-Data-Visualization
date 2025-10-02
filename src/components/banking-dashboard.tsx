"use client"

import { useState, useMemo } from "react"

type FilterState = {
  dateRange: string;
  branch: string;
  accountType: string;
  transactionType: string;
  showAnomalies: boolean;
  loanType?: string;
  cardType?: string;
};
import { DataUploader } from "./dataupploader"
import { StatsCards } from "./stats-card"
import { KPICards } from "./kpi-cards"
import { DashboardFilters } from "./dashboard-filters"
import { TransactionVolumeChart } from "./charts/transaction-volume-chart"
import { AccountTypeChart } from "./charts/account-type-chart"
import { AgeDistributionChart } from "./charts/age-distribution-chart"
import { DepositWithdrawalChart } from "./charts/deposit-withdrawal-chart"
import { TopCitiesChart } from "./charts/top-cities-chart"

import { ProductMixChart } from "./charts/product-mix-chart"
// import { PerformanceMetricsChart } from "./charts/performance-metric-chart"
import { LTVHistogramChart } from "./charts/ltv-histogram-chart"
import { RegionalSalesChart } from "./charts/regional-sales-chart"
import { AnomalyScatterChart } from "./charts/anomaly-scatter-chart"
import { ThemeToggle } from "./theme-toggle"
import type { CleanedTransaction, ProcessingStats } from "../types/bankingtypes"
import { Building2, Upload, BarChart3, TrendingUp, Users, CreditCard } from "lucide-react"

export function BankingDashboard() {
  // --- Dashboard state: data, stats, filters ---
  const [cleanedData, setCleanedData] = useState<CleanedTransaction[]>([]),
    [stats, setStats] = useState<ProcessingStats | null>(null),
    [filters, setFilters] = useState<FilterState>({ dateRange: "all", branch: "all", accountType: "all", transactionType: "all", showAnomalies: false })

  // When user uploads data, update dashboard state
  const handleDataProcessed = (data: CleanedTransaction[], newStats: ProcessingStats) => (setCleanedData(data), setStats(newStats))

  // --- Extract unique filter values from data ---
  // Only use branches and accountTypes, filter out nulls to ensure string[]
  const branches = useMemo(() => Array.from(new Set(cleanedData.map(tx => tx.branchId).filter((b): b is string => !!b))), [cleanedData]),
    accountTypes = useMemo(() => Array.from(new Set(cleanedData.map(tx => tx.accountType).filter((a): a is string => !!a))), [cleanedData])

  // --- Filter data based on selected filters ---
  const filteredData = useMemo(() => cleanedData.filter(tx =>
    (filters.branch === "all" || tx.branchId === filters.branch) &&
    (filters.accountType === "all" || tx.accountType === filters.accountType) &&
    (filters.transactionType === "all" || tx.transactionType === filters.transactionType) &&
    (filters.dateRange === "all" || (filters.dateRange.match(/^\d{4}-\d{2}$/) ? tx.transactionMonth === filters.dateRange : true))
  ), [cleanedData, filters])

  // --- UI: header, upload, stats, filters, KPIs, charts, empty state ---
  return (
    <div className="min-h-screen bg-background">
      {/* --- Dashboard header: branding & theme toggle --- */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10"><Building2 className="h-6 w-6 text-primary" /></div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Banking Analytics system</h1>
                <p className="text-sm text-muted-foreground">Data visualization for Transactions & Customer Insights</p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* --- Upload section: let user upload CSV --- */}
        <div className="space-y-4">
          <div className="flex items-center gap-2"><Upload className="h-5 w-5 text-primary" /><h2 className="text-lg font-semibold text-foreground">Data Upload</h2></div>
          <DataUploader onDataProcessed={handleDataProcessed} />
        </div>

        {/* --- Stats cards: show processing stats --- */}
        {stats && <div className="space-y-4"><div className="flex items-center gap-2"><BarChart3 className="h-5 w-5 text-primary" /><h2 className="text-lg font-semibold text-foreground">Processing Statistics</h2></div><StatsCards stats={stats} /></div>}

        {/* --- Filters: let user filter data --- */}
        {cleanedData.length > 0 && <div className="space-y-4"><div className="flex items-center gap-2"><TrendingUp className="h-5 w-5 text-primary" /><h2 className="text-lg font-semibold text-foreground">Filters</h2></div><DashboardFilters onFilterChange={setFilters} branches={branches} accountTypes={accountTypes} /></div>}

        {/* --- KPI cards: show key metrics --- */}
        {filteredData.length > 0 && <div className="space-y-4"><div className="flex items-center gap-2"><BarChart3 className="h-5 w-5 text-primary" /><h2 className="text-lg font-semibold text-foreground">Key Performance Indicators</h2></div><KPICards data={filteredData} /></div>}

        {/* --- Charts: transaction overview --- */}
        {filteredData.length > 0 && <div className="space-y-4"><div className="flex items-center gap-2"><TrendingUp className="h-5 w-5 text-primary" /><h2 className="text-lg font-semibold text-foreground">Transaction Overview</h2></div><div className="grid grid-cols-1 xl:grid-cols-2 gap-6"><TransactionVolumeChart data={filteredData} /><DepositWithdrawalChart data={filteredData} /><AgeDistributionChart data={filteredData} /><AccountTypeChart data={filteredData} /></div></div>}

        {/* --- Charts: customer demographics --- */}
        {filteredData.length > 0 && <div className="space-y-4"><div className="flex items-center gap-2"><Users className="h-5 w-5 text-primary" /><h2 className="text-lg font-semibold text-foreground">Customer Demographics</h2></div><div className="grid grid-cols-1 xl:grid-cols-2 gap-6"><RegionalSalesChart data={filteredData} /><TopCitiesChart data={filteredData} /></div></div>}

        {/* --- Charts: product mix, performance, LTV --- */}
        {filteredData.length > 0 && <div className="space-y-4"><div className="flex items-center gap-2"><BarChart3 className="h-5 w-5 text-primary" /><h2 className="text-lg font-semibold text-foreground">Product & Performance Metrics</h2></div><div className="grid grid-cols-1 xl:grid-cols-2 gap-6"><ProductMixChart cleanedTransactions={filteredData} /><LTVHistogramChart cleanedTransactions={filteredData} /></div></div>}

        {/* --- Charts: anomaly detection (optional) --- */}
        {filteredData.length > 0 && filters.showAnomalies && <div className="space-y-4"><div className="flex items-center gap-2"><CreditCard className="h-5 w-5 text-primary" /><h2 className="text-lg font-semibold text-foreground">Anomaly Detection</h2></div><div className="grid grid-cols-1 gap-6"><AnomalyScatterChart cleanedTransactions={filteredData} /></div></div>}

        {/* --- Empty state: prompt user to upload data --- */}
        {!cleanedData.length && <div className="flex flex-col items-center justify-center py-20 text-center"><div className="p-4 rounded-full bg-muted/50 mb-4"><Upload className="h-12 w-12 text-muted-foreground" /></div><h3 className="text-xl font-semibold text-foreground mb-2">No Data Yet</h3><p className="text-muted-foreground max-w-md">Upload a CSV file to start analyzing your banking transaction data. The dashboard will automatically process and visualize your data with comprehensive insights.</p></div>}
      </main>
    </div>
  )
}
