"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

export interface FilterState {
  dateRange: string
  branch: string
  accountType: string
  transactionType: string
  showAnomalies: boolean
}

interface DashboardFiltersProps {
  onFilterChange: (filters: FilterState) => void
  branches: string[]
  accountTypes: string[]
}

export function DashboardFilters({ onFilterChange, branches, accountTypes }: DashboardFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    dateRange: "all",
    branch: "all",
    accountType: "all",
    transactionType: "all",
    showAnomalies: false,
  })

  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  const updateFilter = (key: keyof FilterState, value: string | boolean) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
    setOpenDropdown(null)
  }

  const dateRanges = [
    { value: "all", label: "All Months" },
    { value: "2023-01", label: "January 2023" },
    { value: "2023-02", label: "February 2023" },
    { value: "2023-03", label: "March 2023" },
    { value: "2023-04", label: "April 2023" },
    { value: "2023-05", label: "May 2023" },
    { value: "2023-06", label: "June 2023" },
    { value: "2023-07", label: "July 2023" },
    { value: "2023-08", label: "August 2023" },
    { value: "2023-09", label: "September 2023" },
    { value: "2023-10", label: "October 2023" },
    { value: "2023-11", label: "November 2023" },
    { value: "2023-12", label: "December 2023" },
  ]

  const transactionTypes = [
    { value: "all", label: "All Types" },
    { value: "deposit", label: "Deposits" },
    { value: "withdrawal", label: "Withdrawals" },
    { value: "transfer", label: "Transfers" },
    { value: "payment", label: "Payments" },
  ]

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex flex-wrap gap-3">
        {/* Date Range */}
        <div className="relative">
          <button
            onClick={() => setOpenDropdown(openDropdown === "date" ? null : "date")}
            className="flex items-center gap-2 px-4 py-2 bg-background border border-border rounded-lg hover:bg-accent transition-colors text-sm"
          >
            <span className="text-muted-foreground">Date:</span>
            <span className="font-medium">{dateRanges.find((d) => d.value === filters.dateRange)?.label}</span>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </button>
          {openDropdown === "date" && (
            <div className="absolute top-full mt-2 w-48 bg-card border border-border rounded-lg shadow-lg z-10 max-h-64 overflow-y-auto">
              {dateRanges.map((range) => (
                <button
                  key={range.value}
                  onClick={() => updateFilter("dateRange", range.value)}
                  className="w-full text-left px-4 py-2 hover:bg-accent transition-colors text-sm first:rounded-t-lg last:rounded-b-lg"
                >
                  {range.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Branch */}
        <div className="relative">
          <button
            onClick={() => setOpenDropdown(openDropdown === "branch" ? null : "branch")}
            className="flex items-center gap-2 px-4 py-2 bg-background border border-border rounded-lg hover:bg-accent transition-colors text-sm"
          >
            <span className="text-muted-foreground">Branch:</span>
            <span className="font-medium">{filters.branch === "all" ? "All Branches" : filters.branch}</span>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </button>
          {openDropdown === "branch" && (
            <div className="absolute top-full mt-2 w-48 bg-card border border-border rounded-lg shadow-lg z-10 max-h-64 overflow-y-auto">
              <button
                onClick={() => updateFilter("branch", "all")}
                className="w-full text-left px-4 py-2 hover:bg-accent transition-colors text-sm rounded-t-lg"
              >
                All Branches
              </button>
              {branches.map((branch) => (
                <button
                  key={branch}
                  onClick={() => updateFilter("branch", branch)}
                  className="w-full text-left px-4 py-2 hover:bg-accent transition-colors text-sm"
                >
                  {branch}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Account Type */}
        <div className="relative">
          <button
            onClick={() => setOpenDropdown(openDropdown === "account" ? null : "account")}
            className="flex items-center gap-2 px-4 py-2 bg-background border border-border rounded-lg hover:bg-accent transition-colors text-sm"
          >
            <span className="text-muted-foreground">Account:</span>
            <span className="font-medium">{filters.accountType === "all" ? "All Types" : filters.accountType}</span>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </button>
          {openDropdown === "account" && (
            <div className="absolute top-full mt-2 w-48 bg-card border border-border rounded-lg shadow-lg z-10 max-h-64 overflow-y-auto">
              <button
                onClick={() => updateFilter("accountType", "all")}
                className="w-full text-left px-4 py-2 hover:bg-accent transition-colors text-sm rounded-t-lg"
              >
                All Types
              </button>
              {accountTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => updateFilter("accountType", type)}
                  className="w-full text-left px-4 py-2 hover:bg-accent transition-colors text-sm"
                >
                  {type}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Transaction Type */}
        <div className="relative">
          <button
            onClick={() => setOpenDropdown(openDropdown === "transaction" ? null : "transaction")}
            className="flex items-center gap-2 px-4 py-2 bg-background border border-border rounded-lg hover:bg-accent transition-colors text-sm"
          >
            <span className="text-muted-foreground">Transaction:</span>
            <span className="font-medium">
              {transactionTypes.find((t) => t.value === filters.transactionType)?.label}
            </span>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </button>
          {openDropdown === "transaction" && (
            <div className="absolute top-full mt-2 w-48 bg-card border border-border rounded-lg shadow-lg z-10">
              {transactionTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => updateFilter("transactionType", type.value)}
                  className="w-full text-left px-4 py-2 hover:bg-accent transition-colors text-sm first:rounded-t-lg last:rounded-b-lg"
                >
                  {type.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Show Anomalies Toggle */}
        <button
          onClick={() => updateFilter("showAnomalies", !filters.showAnomalies)}
          className={`px-4 py-2 border rounded-lg transition-colors text-sm ${
            filters.showAnomalies
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-background border-border hover:bg-accent"
          }`}
        >
          {filters.showAnomalies ? "Hide Anomalies" : "Show Anomalies"}
        </button>
      </div>
    </div>
  )
}
