"use client"

import { useState, useEffect } from "react"
import ProductCard from "./ProductCard"
import type { Product } from "@/types"

export default function ProductGrid() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    const url =
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/products`
    console.log("👉 fetching products from:", url)

    try {
      const response = await fetch(url)

      if (!response.ok) {
        const text = await response.text()
        console.error(
          "🚨 server responded with status",
          response.status,
          "and body:",
          text
        )
        return
      }

      const data = await response.json()
      console.log("✅ fetched data:", data)
      setProducts(data.products || data)
    } catch (error) {
      console.error("❌ fetch threw an error:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white p-4 rounded shadow animate-pulse">
            <div className="bg-gray-300 h-48 rounded mb-4"></div>
            <div className="bg-gray-300 h-4 rounded mb-2"></div>
            <div className="bg-gray-300 h-4 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Featured Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  )
}
