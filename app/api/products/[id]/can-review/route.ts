import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    // Mock logic - in real app, check if user has purchased and received the product
    // For demo purposes, we'll return true for product ID '1' and false for others
    const canReview = params.id === "1"

    return NextResponse.json({ canReview })
  } catch (error) {
    console.error("Error checking review permission:", error)
    return NextResponse.json({ error: "Failed to check review permission" }, { status: 500 })
  }
}
