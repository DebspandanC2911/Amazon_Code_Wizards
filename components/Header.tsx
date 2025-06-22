"use client"

import { useState } from "react"
import { Search, ShoppingCart, MapPin, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <header className="bg-gray-900 text-white">
      {/* Top bar */}
      <div className="bg-gray-800 px-4 py-1 text-xs">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <span>Deliver to India</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/account" className="hover:underline">
              Your Account
            </Link>
            <Link href="/help" className="hover:underline">
              Help
            </Link>
            <Link href="/cart" className="hover:underline">
              Cart
            </Link>
            
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center space-x-4">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="bg-white text-black px-3 py-1 rounded font-bold text-xl">
              amazon
            </div>
          </Link>

          {/* Location */}
          <div className="hidden md:flex items-center space-x-1 text-sm">
            <MapPin className="w-4 h-4" />
            <div>
              <div className="text-xs text-gray-300">Deliver to</div>
              <div className="font-bold">India</div>
            </div>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-2xl">
            <div className="flex">
              <select className="bg-gray-200 text-black px-3 py-2 rounded-l border-r border-gray-300 text-sm">
                <option>All</option>
                <option>Electronics</option>
                <option>Books</option>
                <option>Clothing</option>
              </select>
              <Input
                type="text"
                placeholder="Search Amazon"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 rounded-none border-0 focus:ring-0"
              />
              <Button className="bg-orange-400 hover:bg-orange-500 text-black rounded-r px-4">
                <Search className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Account & Cart */}
          <div className="flex items-center space-x-4">
            <Link href="/account" className="hidden md:flex flex-col text-sm">
              <span className="text-xs">Hello, sign in</span>
              <span className="font-bold">Account & Lists</span>
            </Link>

            <Link href="/orders" className="hidden md:flex flex-col text-sm">
              <span className="text-xs">Returns</span>
              <span className="font-bold">& Orders</span>
            </Link>

            <Link href="/cart" className="flex items-center space-x-1">
              <ShoppingCart className="w-6 h-6" />
              <span className="font-bold">Cart</span>
            </Link>
            <Link
              href="https://user-filter-phi.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              User Filter
            </Link>
            <Link
              href="https://open-box-delivery.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              Open Box Delivery
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-gray-700 px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center space-x-6 text-sm">
          <Button variant="ghost" className="text-white hover:bg-gray-600 p-2">
            <Menu className="w-4 h-4 mr-2" />
            All
          </Button>
          <Link href="/category/electronics" className="hover:underline">
            Electronics
          </Link>
          <Link href="/category/books" className="hover:underline">
            Books
          </Link>
          <Link href="/category/clothing" className="hover:underline">
            Clothing
          </Link>
          <Link href="/category/home" className="hover:underline">
            Home & Garden
          </Link>
          <Link href="/category/sports" className="hover:underline">
            Sports
          </Link>
        </div>
      </div>
    </header>
  )
}
