"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Star, ShoppingCart, Heart, Share } from "lucide-react"
import Image from "next/image"
import ReviewSection from "./ReviewSection"
import type { Product } from "@/types"

interface ProductDetailProps {
  productId: string
}

export default function ProductDetail({ productId }: ProductDetailProps) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    fetchProduct()
  }, [productId])

  const fetchProduct = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/products/${productId}`,
      )
      if (response.ok) {
        const data = await response.json()
        setProduct(data)
      }
    } catch (error) {
      console.error("Error fetching product:", error)
    } finally {
      setLoading(false)
    }
  }

  const addToCart = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/cart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity }),
      })
    } catch (error) {
      console.error("Error adding to cart:", error)
    }
  }

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star key={i} className={`w-5 h-5 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
    ))
  }

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-8">Loading...</div>
  }

  if (!product) {
    return <div className="max-w-7xl mx-auto px-4 py-8">Product not found</div>
  }

  const images = [product.imageUrl, product.imageUrl, product.imageUrl] // Mock multiple images

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Product Images */}
        <div className="lg:col-span-1">
          <div className="mb-4">
            <Image
              src={images[selectedImage] || "/placeholder.svg"}
              alt={product.title}
              width={500}
              height={500}
              className="w-full h-96 object-cover rounded-lg"
            />
          </div>
          <div className="flex space-x-2">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`border-2 rounded ${selectedImage === index ? "border-blue-500" : "border-gray-300"}`}
              >
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`${product.title} ${index + 1}`}
                  width={80}
                  height={80}
                  className="w-20 h-20 object-cover rounded"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="lg:col-span-1">
          <h1 className="text-2xl font-bold mb-4">{product.title}</h1>

          <div className="flex items-center mb-4">
            <div className="flex">{renderStars(4)}</div>
            <span className="text-blue-600 ml-2 hover:underline cursor-pointer">4.0 out of 5 stars</span>
            <span className="text-gray-600 ml-2">(1,234 ratings)</span>
          </div>

          <div className="mb-6">
            <div className="flex items-center space-x-4">
              <span className="text-3xl font-bold text-red-600">₹{product.price.toLocaleString()}</span>
              <span className="text-lg text-gray-500 line-through">₹{(product.price * 1.2).toLocaleString()}</span>
              <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">Save 17%</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">Inclusive of all taxes</p>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold mb-2">About this item</h3>
            <p className="text-gray-700">{product.description}</p>
          </div>

          <div className="mb-6">
            <p className="text-green-600 font-semibold">In Stock</p>
            <p className="text-sm text-gray-600">Ships from and sold by Amazon</p>
          </div>
        </div>

        {/* Purchase Options */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardContent className="p-6">
              <div className="mb-4">
                <span className="text-2xl font-bold text-red-600">₹{product.price.toLocaleString()}</span>
              </div>

              <div className="mb-4">
                <p className="text-green-600 font-semibold">In Stock</p>
                <p className="text-sm text-gray-600">Ships from and sold by Amazon</p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Quantity:</label>
                <select
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="border rounded px-3 py-2 w-20"
                >
                  {[...Array(10)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-3">
                <Button onClick={addToCart} className="w-full bg-yellow-400 hover:bg-yellow-500 text-black">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add to Cart
                </Button>

                <Button className="w-full bg-orange-400 hover:bg-orange-500 text-white">Buy Now</Button>

                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Heart className="w-4 h-4 mr-2" />
                    Add to List
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Share className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>

              <div className="mt-6 text-sm text-gray-600">
                <p>• FREE delivery by tomorrow</p>
                <p>• Easy returns</p>
                <p>• Amazon Prime eligible</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-12">
        <ReviewSection productId={productId} />
      </div>
    </div>
  )
}
