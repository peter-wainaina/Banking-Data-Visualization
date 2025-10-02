"use client"

import { Card, CardContent } from "./card"
import type { ProcessingStats } from "../types/bankingtypes"
import { FileCheck, FileX, Copy, Clock, AlertTriangle, CheckCircle } from "lucide-react"

interface StatsCardsProps {
  stats: ProcessingStats
}

export function StatsCards({ stats }: StatsCardsProps) {
  const metrics = [
    {
      label: "Total Records",
      value: stats.totalRecords,
      icon: FileCheck,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      label: "Valid Records",
      value: stats.validRecords,
      icon: CheckCircle,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
    },
    {
      label: "Invalid Records",
      value: stats.invalidRecords,
      icon: FileX,
      color: "text-red-500",
      bgColor: "bg-red-500/10",
    },
    {
      label: "Duplicate Records",
      value: stats.duplicateRecords,
      icon: Copy,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
    },
    {
      label: "Processing Time",
      value: `${stats.processingTime}ms`,
      icon: Clock,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {metrics.map((metric, idx) => {
        const Icon = metric.icon
        return (
          <Card key={idx} className="border border-gray-300 bg-card/60 backdrop-blur hover:bg-white/90 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                  <Icon className={`h-4 w-4 ${metric.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-muted-foreground truncate">{metric.label}</p>
                  <p className="text-lg font-bold text-foreground">
                    {typeof metric.value === "number" ? metric.value.toLocaleString() : metric.value}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
