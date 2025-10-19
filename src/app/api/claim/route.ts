import { type NextRequest, NextResponse } from "next/server"

// In-memory store for claim tracking (in production, use MongoDB)
const claimStore = new Map<string, number>()

export async function POST(request: NextRequest) {
  try {
    const { walletAddress } = await request.json()

    // Validate wallet address
    if (!walletAddress || typeof walletAddress !== "string") {
      return NextResponse.json({ message: "Invalid wallet address" }, { status: 400 })
    }

    // Check if wallet has already claimed in the last 24 hours
    const lastClaimTime = claimStore.get(walletAddress)
    const now = Date.now()
    const claimInterval = 24 * 60 * 60 * 1000 // 24 hours

    if (lastClaimTime && now - lastClaimTime < claimInterval) {
      const timeRemaining = claimInterval - (now - lastClaimTime)
      const hours = Math.floor(timeRemaining / (1000 * 60 * 60))
      return NextResponse.json(
        {
          message: `You can claim again in ${hours} hours. Please try again later.`,
          canClaim: false,
          timeRemaining,
        },
        { status: 429 },
      )
    }

    // Record the claim
    claimStore.set(walletAddress, now)

    // In production, you would:
    // 1. Connect to MongoDB
    // 2. Record the claim in the database
    // 3. Send tokens to the wallet address
    // 4. Log the transaction

    return NextResponse.json(
      {
        message: "Tokens claimed successfully!",
        amount: "0.1",
        walletAddress,
        timestamp: new Date().toISOString(),
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Claim error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
