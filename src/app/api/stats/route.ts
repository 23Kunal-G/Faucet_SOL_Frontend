import { NextResponse } from "next/server"

export async function GET() {
  // In production, fetch from MongoDB
  const stats = {
    totalClaims: 0,
    totalTokensDistributed: "0",
    activeClaims: 0,
    lastUpdated: new Date().toISOString(),
  }

  return NextResponse.json(stats, { status: 200 })
}
