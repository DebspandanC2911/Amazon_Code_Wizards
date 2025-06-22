import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { productId, quantity } = await request.json()

    // In real app, save to database and associate with user session
    console.log(`Added product ${productId} with quantity ${quantity} to cart`)

    return NextResponse.json({ success: true, message: "Product added to cart" })
  } catch (error) {
    console.error("Error adding to cart:", error)
    return NextResponse.json({ error: "Failed to add to cart" }, { status: 500 })
  }
}
