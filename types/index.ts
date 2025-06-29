export type ProductType =
  | "electronics"
  | "fragile"
  | "books"
  | "clothing"
  | "food"
  | "toys"
  | "cosmetics"
  | "sports"
  | "automotive"
  | "home"
  | "jewelry"
  | "medical"
  | "office"
  | "pet"
  | "baby"
  | "music"
  | "art"
  | "industrial"
  | "chemicals"
  | "generic"

export interface DamageArea {
  x: number
  y: number
  size: number
  severity: "Low" | "Medium" | "High"
  type: string
}

export interface ComparisonResult {
  differencePercentage: number
  totalPixels: number
  differentPixels: number
  isValid: boolean
  damageAreas?: DamageArea[]
  productType: ProductType
  threshold: number
  tolerance: number
}

export interface Product {
  _id: string
  title: string
  description: string
  category: string
  imageUrl: string
  price: number
  stock: number
  createdAt: string
}

export interface Review {
  _id: string
  productId: string
  userId?: {
    _id: string
    name: string
    userRating: number | null
  }
  rating: number
  reviewText: string
  purchaseVerified: boolean
  fakeFlag: boolean
  fakeConfidence: number
  userRating: number | null
  createdAt: string
}

export interface User {
  _id: string
  name: string
  email: string
  userRating: number | null
  totalOrders: number
  deliveredOrders: number
  returnedOrders: number
}
