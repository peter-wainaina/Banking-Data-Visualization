import { BankingDashboard } from "./components/banking-dashboard"
import { ThemeProvider } from "./components/theme-provider"
import "./App.css"

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <div className="min-h-screen bg-background">
        <BankingDashboard />
      </div>
    </ThemeProvider>
  )
}

export default App
