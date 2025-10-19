"use client"

import { Card } from "@/components/ui/card"
import { Coins, TrendingUp, Users, Zap } from "lucide-react"
import { useEffect, useState } from "react"

interface Stats {
  totalClaims: number
  totalTokensDistributed: string
  activeClaims: number
  lastUpdated: string
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/stats")
        const data = await response.json()
        setStats(data)
      } catch (error) {
        console.error("Failed to fetch stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
    const interval = setInterval(fetchStats, 30000)

    return () => clearInterval(interval)
  }, [])

  const StatCard = ({ icon: Icon, label, value, loading: isLoading }: any) => (
    <Card className="p-6 hover:shadow-lg transition-shadow duration-200 border-border/50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-muted-foreground">{label}</h3>
        <div className="bg-primary/10 p-2 rounded-lg">
          <Icon className="w-5 h-5 text-primary" />
        </div>
      </div>
      {isLoading ? (
        <div className="h-8 bg-muted rounded animate-pulse" />
      ) : (
        <p className="text-3xl font-bold text-foreground">{value}</p>
      )}
    </Card>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Faucet statistics and activity</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={Coins} label="Total Claims" value={stats?.totalClaims || 0} loading={loading} />
          <StatCard
            icon={TrendingUp}
            label="Tokens Distributed"
            value={stats?.totalTokensDistributed || "0"}
            loading={loading}
          />
          <StatCard icon={Users} label="Active Claims" value={stats?.activeClaims || 0} loading={loading} />
          <StatCard icon={Zap} label="Status" value={loading ? "..." : "Active"} loading={false} />
        </div>
      </div>
    </div>
  )
}
