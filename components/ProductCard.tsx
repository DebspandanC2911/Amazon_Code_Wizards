"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, ShoppingCart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type { Product } from "@/types"

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const [imageError, setImageError] = useState(false)

  const addToCart = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/cart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product._id, quantity: 1 }),
      })
      // Show success message
    } catch (error) {
      console.error("Error adding to cart:", error)
    }
  }

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
    ))
  }

  return (
    <Card className="bg-white hover:shadow-lg transition-shadow h-full">
      <CardContent className="p-4 flex flex-col h-full">
        <Link href={`/product/${product._id}`}>
          <div className="mb-4">
            <Image
              src={imageError ? "/placeholder.svg?height=200&width=200" : product.imageUrl}
              alt={product.title}
              width={200}
              height={200}
              className="w-full h-48 object-cover rounded"
              onError={() => setImageError(true)}
            />
          </div>
          <h3 className="font-semibold text-sm mb-2 line-clamp-2 hover:text-blue-600">{product.title}</h3>
        </Link>

        <div className="flex items-center mb-2">
          <div className="flex">{renderStars(4)}</div>
          <span className="text-sm text-gray-600 ml-2">(125)</span>
        </div>

        <div className="flex items-center mb-4">
          <span className="text-xl font-bold">₹{product.price.toLocaleString()}</span>
          <span className="text-sm text-gray-500 line-through ml-2">₹{(product.price * 1.2).toLocaleString()}</span>
        </div>

        <div className="mt-auto space-y-2">
          <Button onClick={addToCart} className="w-full bg-yellow-400 hover:bg-yellow-500 text-black">
            <ShoppingCart className="w-4 h-4 mr-2" />
            Add to Cart
          </Button>
          <Link href={`/product/${product._id}`}>
            <Button variant="outline" className="w-full">
              View Details
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
