"use client"

import { Card } from "@/components/ui/card"
import { Clock, Wallet, Copy, Check } from "lucide-react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

interface ClaimRecord {
  walletAddress: string
  timestamp: string
  amount: string
}

export default function HistoryPage() {
  const [claims, setClaims] = useState<ClaimRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  useEffect(() => {
    const storedClaims = localStorage.getItem("claimHistory")
    if (storedClaims) {
      try {
        setClaims(JSON.parse(storedClaims))
      } catch (error) {
        console.error("Failed to parse claim history:", error)
      }
    }
    setLoading(false)
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const copyToClipboard = (address: string, index: number) => {
    navigator.clipboard.writeText(address)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Claim History</h1>
          <p className="text-muted-foreground">Your recent token claims</p>
        </div>

        {loading ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">Loading...</p>
          </Card>
        ) : claims.length === 0 ? (
          <Card className="p-8 text-center border-border/50">
            <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">No claims yet. Start claiming tokens!</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {claims.map((claim, index) => (
              <Card
                key={index}
                className="p-4 flex items-center justify-between hover:shadow-md transition-all duration-200 border-border/50 group"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg group-hover:bg-primary/20 transition-colors">
                    <Wallet className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{truncateAddress(claim.walletAddress)}</p>
                    <p className="text-sm text-muted-foreground">{formatDate(claim.timestamp)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-semibold text-foreground">{claim.amount} tokens</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => copyToClipboard(claim.walletAddress, index)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    {copiedIndex === index ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
