"use client"

import { Coins } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ThemeToggle } from "./theme-toggle"

export function Header() {
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  return (
    <header className="border-b border-border bg-card">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <div className="bg-primary/10 p-2 rounded-lg">
            <Coins className="w-5 h-5 text-primary" />
          </div>
          <span className="text-foreground">Token Faucet</span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link
            href="/"
            className={`text-sm font-medium transition-colors ${
              isActive("/") ? "text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Claim
          </Link>
          <Link
            href="/dashboard"
            className={`text-sm font-medium transition-colors ${
              isActive("/dashboard") ? "text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Dashboard
          </Link>
          <Link
            href="/history"
            className={`text-sm font-medium transition-colors ${
              isActive("/history") ? "text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            History
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}
