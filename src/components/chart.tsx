
"use client"

import React from "react"

export interface ChartConfig {
  [key: string]: {
    label: string;
    color: string;
  };
}

export function ChartContainer({
  children,
  className = "",
  config,
}: {
  children: React.ReactNode
  className?: string
  config?: ChartConfig
}) {
  // Optionally render a legend or config info here if needed
  return <div className={`w-full h-[350px] ${className}`}>{children}</div>
}


// ChartTooltip: Wrapper for recharts custom tooltip
export function ChartTooltip({ content }: { content: (props: any) => React.ReactNode }) {
  // This component is just a passthrough for recharts' <Tooltip content={...} />
  // Usage: <ChartTooltip content={...} />
  // In actual chart, you should use <Tooltip content={<ChartTooltip content={...} />} />
  // But for simplicity, we export as a function to be used directly in recharts
  return null;
}

// ChartTooltipContent: Default tooltip content for bar/pie charts
export function ChartTooltipContent({ active, payload }: { active?: boolean; payload?: any[] }) {
  if (active && payload && payload.length) {
    const item = payload[0];
    return (
      <div className="rounded-lg border border-border bg-card p-3 shadow-lg">
        <p className="font-semibold text-foreground">{item.payload.branch || item.payload.segment || item.name}</p>
        <p className="text-sm text-muted-foreground">
          {item.value?.toLocaleString()} {item.payload.current !== undefined && item.payload.previous !== undefined
            ? `Current: ${item.payload.current}K, Previous: ${item.payload.previous}K`
            : item.payload.percentage !== undefined
            ? `(${item.payload.percentage}%)`
            : null}
        </p>
      </div>
    );
  }
  return null;
}
