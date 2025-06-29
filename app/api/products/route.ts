import { NextResponse } from "next/server"

// Mock data - in real app, this would come from MongoDB
const mockProducts = [
  {
    _id: "1",
    title: "Wireless Bluetooth Headphones",
    description: "High-quality wireless headphones with noise cancellation",
    category: "Electronics",
    imageUrl: "/placeholder.svg?height=300&width=300",
    price: 2999,
    stock: 50,
    createdAt: new Date().toISOString(),
  },
  {
    _id: "2",
    title: "Smart Fitness Watch",
    description: "Track your fitness goals with this advanced smartwatch",
    category: "Electronics",
    imageUrl: "/placeholder.svg?height=300&width=300",
    price: 8999,
    stock: 30,
    createdAt: new Date().toISOString(),
  },
  {
    _id: "3",
    title: "Organic Cotton T-Shirt",
    description: "Comfortable and sustainable organic cotton t-shirt",
    category: "Clothing",
    imageUrl: "/placeholder.svg?height=300&width=300",
    price: 799,
    stock: 100,
    createdAt: new Date().toISOString(),
  },
  {
    _id: "4",
    title: "Professional Camera Lens",
    description: "50mm prime lens for professional photography",
    category: "Electronics",
    imageUrl: "/placeholder.svg?height=300&width=300",
    price: 25999,
    stock: 15,
    createdAt: new Date().toISOString(),
  },
  {
    _id: "5",
    title: "Yoga Mat Premium",
    description: "Non-slip premium yoga mat for all your workout needs",
    category: "Sports",
    imageUrl: "/placeholder.svg?height=300&width=300",
    price: 1499,
    stock: 75,
    createdAt: new Date().toISOString(),
  },
  {
    _id: "6",
    title: "Coffee Maker Deluxe",
    description: "Programmable coffee maker with built-in grinder",
    category: "Home",
    imageUrl: "/placeholder.svg?height=300&width=300",
    price: 12999,
    stock: 25,
    createdAt: new Date().toISOString(),
  },
  {
    _id: "7",
    title: "Gaming Mechanical Keyboard",
    description: "RGB backlit mechanical keyboard for gaming",
    category: "Electronics",
    imageUrl: "/placeholder.svg?height=300&width=300",
    price: 4999,
    stock: 40,
    createdAt: new Date().toISOString(),
  },
  {
    _id: "8",
    title: "Skincare Serum Set",
    description: "Complete skincare routine with vitamin C serum",
    category: "Beauty",
    imageUrl: "/placeholder.svg?height=300&width=300",
    price: 2499,
    stock: 60,
    createdAt: new Date().toISOString(),
  },
]

export async function GET() {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    return NextResponse.json(mockProducts)
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}
