"use client"

import * as React from "react"

export function Select({ value, onValueChange, children, className = "" }: {
  value: string
  onValueChange: (value: string) => void
  children: React.ReactNode
  className?: string
}) {
  return (
    <select
      value={value}
      onChange={e => onValueChange(e.target.value)}
      className={`border rounded px-3 py-2 bg-white text-gray-900 ${className}`}
    >
      {children}
    </select>
  )
}

export function SelectTrigger({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>
}

export function SelectContent({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function SelectItem({ value, children }: { value: string; children: React.ReactNode }) {
  return <option value={value}>{children}</option>;
}

export function SelectValue({ placeholder }: { placeholder?: string }) {
  return <span className="text-gray-500">{placeholder}</span>;
}
