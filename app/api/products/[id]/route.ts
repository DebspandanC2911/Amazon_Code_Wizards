import { NextResponse } from "next/server"

const mockProducts = [
  {
    _id: "1",
    title: "Wireless Bluetooth Headphones",
    description:
      "High-quality wireless headphones with active noise cancellation technology. Features 30-hour battery life, premium sound quality, and comfortable over-ear design. Perfect for music lovers, commuters, and professionals who need crystal-clear audio for calls and entertainment.",
    category: "Electronics",
    imageUrl: "/placeholder.svg?height=500&width=500",
    price: 2999,
    stock: 50,
    createdAt: new Date().toISOString(),
  },
  {
    _id: "2",
    title: "Smart Fitness Watch",
    description:
      "Advanced fitness tracking smartwatch with heart rate monitoring, GPS, sleep tracking, and 50+ workout modes. Water-resistant design with 7-day battery life and smartphone connectivity.",
    category: "Electronics",
    imageUrl: "/placeholder.svg?height=500&width=500",
    price: 8999,
    stock: 30,
    createdAt: new Date().toISOString(),
  },
]

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const product = mockProducts.find((p) => p._id === params.id)

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error("Error fetching product:", error)
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 })
  }
}
