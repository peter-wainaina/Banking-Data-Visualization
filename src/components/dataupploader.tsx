"use client"

import type React from "react"

import { useState } from "react"
import Papa from "papaparse"
import { processTransactions } from "../utils/processor"
import type { CleanedTransaction, ProcessingStats } from "../types/bankingtypes"

interface DataUploaderProps {
  onDataProcessed: (data: CleanedTransaction[], stats: ProcessingStats) => void
}

export function DataUploader({ onDataProcessed }: DataUploaderProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setLoading(true)
    setError(null)

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          // Destructure all returned values properly
          const { cleaned, stats } = processTransactions(results.data as any[])
          onDataProcessed(cleaned, stats)
        } catch (err: any) {
          console.error("Processing error:", err)
          setError("Failed to process the uploaded file.")
        } finally {
          setLoading(false)
        }
      },
      error: (err) => {
        console.error("CSV parsing error:", err)
        setError("Failed to parse CSV file.")
        setLoading(false)
      },
    })
  }

  return (
    <div className="border rounded-lg p-6 bg-gray-50">
      <h2 className="text-lg font-semibold mb-2">Upload CSV Data</h2>
      <input
        type="file"
        accept=".csv"
        onChange={handleFileUpload}
        className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4
          file:rounded-md file:border-0 file:text-sm file:font-semibold
          file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />
      {loading && <p className="mt-2 text-sm text-gray-500">Processing file...</p>}
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  )
}
