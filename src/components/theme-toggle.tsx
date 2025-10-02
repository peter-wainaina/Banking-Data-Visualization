"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "./ui/button"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="outline" size="icon" className="h-9 w-9 bg-gray-100 text-gray-900 border border-gray-300">
        <Sun className="h-4 w-4" />
      </Button>
    )
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="h-9 w-9 bg-gray-100 text-gray-900 border border-gray-300"
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4 text-gray-900 transition-all" />
      ) : (
        <Moon className="h-4 w-4 text-gray-900 transition-all" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
