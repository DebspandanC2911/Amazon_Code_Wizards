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

// Updated comprehensive product image mapping
const productImageMap: { [key: string]: string } = {
  // Exact product name matches from the API
  "unbranded plastic pants": "/images/products/pants.jpg",
  "handmade steel keyboard": "/images/products/keyboard.jpg",
  "licensed frozen bacon": "/images/products/bacon.jpg",
  "handcrafted frozen cheese": "/images/products/cheese.jpg",
  "unbranded fresh bike": "/images/products/bike.jpg",
  "rustic soft keyboard": "/images/products/keyboard-2.jpg",
  "awesome concrete cheese": "/images/products/cheese-2.jpg",
  "tasty cotton shirt": "/images/products/shirt.jpg",
  "ergonomic wooden bacon": "/images/products/bacon-2.jpg",
  "sleek cotton pizza": "/images/products/pizza.jpg",
  "generic concrete table": "/images/products/table.jpg",
  "sleek soft gloves": "/images/products/gloves.jpg",
  "tasty wooden tuna": "/images/products/tuna.jpg",
  "unbranded plastic bacon": "/images/products/bacon-3.jpg",
  "unbranded rubber tuna": "/images/products/tuna-2.jpg",
  "practical plastic chicken": "/images/products/chicken.jpg",
  "handmade wooden pizza": "/images/products/pizza-2.jpg",
  "fantastic frozen sausages": "/images/products/sausages.jpg",
  "unbranded soft salad": "/images/products/salad.jpg",
  "handmade frozen sausages": "/images/products/sausages-2.jpg",

  // Original products
  "wireless bluetooth headphones": "/images/product-headphones.jpg",
  "smart fitness watch": "/images/product-smartwatch.jpg",
  "organic cotton t-shirt": "/images/product-tshirt.jpg",
  "professional camera lens": "/images/product-camera-lens.jpg",
  "yoga mat premium": "/images/product-yoga-mat.jpg",
  "coffee maker deluxe": "/images/product-coffee-maker.jpg",
  "gaming mechanical keyboard": "/images/product-keyboard.jpg",
  "skincare serum set": "/images/product-skincare.jpg",
}

function getProductImage(title: string): string {
  const titleLower = title.toLowerCase().trim()

  // First try exact match
  if (productImageMap[titleLower]) {
    return productImageMap[titleLower]
  }

  // Then try keyword matching with more specific patterns
  const keywords = [
    { words: ["pants", "trouser"], image: "/images/products/pants.jpg" },
    { words: ["keyboard"], image: "/images/products/keyboard.jpg" },
    { words: ["bacon"], image: "/images/products/bacon.jpg" },
    { words: ["cheese"], image: "/images/products/cheese.jpg" },
    { words: ["bike", "bicycle"], image: "/images/products/bike.jpg" },
    { words: ["shirt", "tshirt", "t-shirt"], image: "/images/products/shirt.jpg" },
    { words: ["pizza"], image: "/images/products/pizza.jpg" },
    { words: ["table", "desk"], image: "/images/products/table.jpg" },
    { words: ["gloves"], image: "/images/products/gloves.jpg" },
    { words: ["tuna", "fish"], image: "/images/products/tuna.jpg" },
    { words: ["chicken"], image: "/images/products/chicken.jpg" },
    { words: ["sausage"], image: "/images/products/sausages.jpg" },
    { words: ["salad"], image: "/images/products/salad.jpg" },
    { words: ["headphones", "bluetooth", "wireless"], image: "/images/product-headphones.jpg" },
    { words: ["watch", "smartwatch", "fitness"], image: "/images/product-smartwatch.jpg" },
    { words: ["cotton", "organic"], image: "/images/product-tshirt.jpg" },
    { words: ["lens", "camera"], image: "/images/product-camera-lens.jpg" },
    { words: ["yoga", "mat"], image: "/images/product-yoga-mat.jpg" },
    { words: ["coffee", "maker"], image: "/images/product-coffee-maker.jpg" },
    { words: ["gaming", "mechanical"], image: "/images/product-keyboard.jpg" },
    { words: ["skincare", "serum", "beauty"], image: "/images/product-skincare.jpg" },
  ]

  for (const keyword of keywords) {
    if (keyword.words.some((word) => titleLower.includes(word))) {
      return keyword.image
    }
  }

  // Fallback to a default product image
  return "/images/products/default-product.png"
}

export default function ProductCard({ product }: ProductCardProps) {
  const [imageError, setImageError] = useState(false)
  const productImage = getProductImage(product.title)

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
    <Card className="bg-white hover:shadow-xl transition-all duration-300 h-full group">
      <CardContent className="p-4 flex flex-col h-full">
        <Link href={`/product/${product._id}`}>
          <div className="mb-4 overflow-hidden rounded-lg bg-gray-100">
            <Image
              src={imageError ? "/images/products/default-product.jpg" : productImage}
              alt={product.title}
              width={200}
              height={200}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              onError={() => setImageError(true)}
              priority
            />
          </div>
          <h3 className="font-semibold text-sm mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
            {product.title}
          </h3>
        </Link>

        <div className="flex items-center mb-2">
          <div className="flex">{renderStars(4)}</div>
          <span className="text-sm text-gray-600 ml-2">(125)</span>
        </div>

        <div className="flex items-center mb-4">
          <span className="text-xl font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
          <span className="text-sm text-gray-500 line-through ml-2">₹{(product.price * 1.2).toLocaleString()}</span>
          <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded ml-2">17% off</span>
        </div>

        <div className="mt-auto space-y-2">
          <Button
            onClick={addToCart}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-medium transition-colors"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Add to Cart
          </Button>
          <Link href={`/product/${product._id}`}>
            <Button variant="outline" className="w-full hover:bg-gray-50 transition-colors bg-transparent">
              View Details
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
