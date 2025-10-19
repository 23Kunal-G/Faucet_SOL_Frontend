"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Coins, Clock, CheckCircle, AlertCircle } from "lucide-react"

export default function FaucetPage() {
  const [walletAddress, setWalletAddress] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState<"success" | "error" | "">("")
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [claimed, setClaimed] = useState(false)

  useEffect(() => {
    const lastClaimTime = localStorage.getItem("lastClaimTime")
    if (lastClaimTime) {
      const timeSinceLastClaim = Date.now() - Number.parseInt(lastClaimTime)
      const claimInterval = 24 * 60 * 60 * 1000
      const remaining = Math.max(0, claimInterval - timeSinceLastClaim)
      setTimeRemaining(remaining)
      setClaimed(remaining > 0)
    }
  }, [])

  useEffect(() => {
    if (timeRemaining <= 0) return

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1000) {
          setClaimed(false)
          return 0
        }
        return prev - 1000
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [timeRemaining])

  const formatTime = (ms: number) => {
    const hours = Math.floor(ms / (1000 * 60 * 60))
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((ms % (1000 * 60)) / 1000)
    return `${hours}h ${minutes}m ${seconds}s`
  }

  const handleClaim = async () => {
    if (!walletAddress.trim()) {
      setMessage("Please enter a wallet address")
      setMessageType("error")
      return
    }

    setLoading(true)
    setMessage("")

    try {
      const response = await fetch("/api/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletAddress }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage(`Success! 0.1 tokens claimed to ${walletAddress}`)
        setMessageType("success")
        localStorage.setItem("lastClaimTime", Date.now().toString())

        const claimRecord = {
          walletAddress,
          timestamp: new Date().toISOString(),
          amount: "0.1",
        }
        const existingHistory = localStorage.getItem("claimHistory")
        const history = existingHistory ? JSON.parse(existingHistory) : []
        history.unshift(claimRecord)
        localStorage.setItem("claimHistory", JSON.stringify(history.slice(0, 50)))

        setTimeRemaining(24 * 60 * 60 * 1000)
        setClaimed(true)
        setWalletAddress("")
      } else {
        setMessage(data.message || "Claim failed. Please try again.")
        setMessageType("error")
      }
    } catch (error) {
      setMessage("Error connecting to server. Please try again.")
      setMessageType("error")
      console.error("Claim error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-border/50">
        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-primary/10 p-4 rounded-full ring-2 ring-primary/20">
                <Coins className="w-8 h-8 text-primary" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Token Faucet</h1>
            <p className="text-muted-foreground">Claim free tokens every 24 hours</p>
          </div>

          {/* Wallet Input */}
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Wallet Address</label>
              <Input
                type="text"
                placeholder="0x..."
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                disabled={loading || claimed}
                className="w-full transition-all"
              />
            </div>
          </div>

          {/* Claim Button */}
          <Button
            onClick={handleClaim}
            disabled={loading || claimed}
            className="w-full mb-4 h-12 text-base font-semibold transition-all duration-200"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin">⏳</span>
                Claiming...
              </span>
            ) : claimed ? (
              "Already Claimed"
            ) : (
              "Claim Tokens"
            )}
          </Button>

          {/* Countdown Timer */}
          {claimed && timeRemaining > 0 && (
            <div className="bg-muted/50 border border-border/50 p-4 rounded-lg flex items-center gap-3 mb-4 animate-in fade-in slide-in-from-top-2">
              <Clock className="w-5 h-5 text-primary flex-shrink-0" />
              <div>
                <p className="text-sm text-muted-foreground">Next claim in:</p>
                <p className="text-lg font-semibold text-foreground font-mono">{formatTime(timeRemaining)}</p>
              </div>
            </div>
          )}

          {/* Messages */}
          {message && (
            <div
              className={`p-4 rounded-lg flex items-start gap-3 animate-in fade-in slide-in-from-top-2 ${
                messageType === "success"
                  ? "bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900/50"
                  : "bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50"
              }`}
            >
              {messageType === "success" ? (
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              )}
              <p
                className={`text-sm ${
                  messageType === "success" ? "text-green-800 dark:text-green-200" : "text-red-800 dark:text-red-200"
                }`}
              >
                {message}
              </p>
            </div>
          )}

          {/* Info */}
          <div className="mt-6 pt-6 border-t border-border/50">
            <p className="text-xs text-muted-foreground text-center leading-relaxed">
              Claim 0.1 tokens every 24 hours. No limits, no fees. Secure and transparent.
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
