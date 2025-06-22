export interface Product {
  _id: string
  title: string
  description: string
  category: string
  imageUrl: string
  price: number
  stock: number
  rating?: number
  reviewCount?: number
  createdAt: string
}

export interface Review {
  _id: string;
  productId: string;
  userId: string | { _id: string; name?: string } | null;
  rating: number;
  reviewText: string;
  createdAt: string;
  purchaseVerified?: boolean;
  fakeFlag?: boolean;
  helpfulCount?: number;
}

export interface User {
  _id: string
  name: string
  email: string
  rating: number
  createdAt: string
}

export interface Order {
  _id: string
  userId: string
  products: Array<{
    productId: string
    quantity: number
    price: number
  }>
  total: number
  delivered: boolean
  returned: boolean
  openBox: boolean
  status: string
  createdAt: string
}

export interface CartItem {
  _id: string
  userId: string
  productId: Product
  quantity: number
  createdAt: string
}
