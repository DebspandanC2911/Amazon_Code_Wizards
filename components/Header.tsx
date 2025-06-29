"use client"

import { useState } from "react"
import { Search, ShoppingCart, MapPin, Menu, Package, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <header className="bg-gray-900 text-white shadow-lg">
      {/* Top bar */}
      <div className="bg-gray-800 px-4 py-1 text-xs">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <span className="hover:underline cursor-pointer">Deliver to India</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/account" className="hover:underline transition-colors">
              Your Account
            </Link>
            <Link href="/help" className="hover:underline transition-colors">
              Help
            </Link>
            <Link href="/cart" className="hover:underline transition-colors">
              Cart
            </Link>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center space-x-4">
          {/* Logo */}
          <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
            <div className="bg-white text-black px-4 py-2 rounded font-bold text-xl shadow-md">amazon</div>
          </Link>

          {/* Location */}
          <div className="hidden md:flex items-center space-x-1 text-sm hover:bg-gray-800 p-2 rounded transition-colors cursor-pointer">
            <MapPin className="w-4 h-4" />
            <div>
              <div className="text-xs text-gray-300">Deliver to</div>
              <div className="font-bold">India</div>
            </div>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-2xl">
            <div className="flex shadow-lg">
              <select className="bg-gray-200 text-black px-3 py-3 rounded-l border-r border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400">
                <option>All</option>
                <option>Electronics</option>
                <option>Books</option>
                <option>Clothing</option>
                <option>Home</option>
                <option>Sports</option>
              </select>
              <Input
                type="text"
                placeholder="Search Amazon"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 rounded-none border-0 focus:ring-0 py-3"
              />
              <Button className="bg-orange-400 hover:bg-orange-500 text-black rounded-r px-6 transition-colors">
                <Search className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Account & Cart */}
          <div className="flex items-center space-x-4">
            <Link
              href="/account"
              className="hidden md:flex flex-col text-sm hover:bg-gray-800 p-2 rounded transition-colors"
            >
              <span className="text-xs">Hello, sign in</span>
              <span className="font-bold">Account & Lists</span>
            </Link>

            <Link
              href="/orders"
              className="hidden md:flex flex-col text-sm hover:bg-gray-800 p-2 rounded transition-colors"
            >
              <span className="text-xs">Returns</span>
              <span className="font-bold">& Orders</span>
            </Link>

            <Link href="/cart" className="flex items-center space-x-1 hover:bg-gray-800 p-2 rounded transition-colors">
              <ShoppingCart className="w-6 h-6" />
              <div className="flex flex-col">
                <span className="text-xs">Cart</span>
                <span className="font-bold text-orange-400">0</span>
              </div>
            </Link>

            {/* New Tabs - Added after cart */}
            <Link
              href="https://open-box-delivery.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded text-white transition-colors"
            >
              <Package className="w-5 h-5 mr-2" />
              <div className="flex flex-col">
                <span className="text-xs">Open Box</span>
                <span className="font-bold">Delivery</span>
              </div>
            </Link>

            <Link
              href="https://user-filter-phi.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center bg-green-600 hover:bg-green-700 px-3 py-2 rounded text-white transition-colors"
            >
              <Settings className="w-5 h-5 mr-2" />
              <div className="flex flex-col">
                <span className="text-xs">Seller</span>
                <span className="font-bold">Dashboard</span>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-gray-700 px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center space-x-6 text-sm">
          <Button variant="ghost" className="text-white hover:bg-gray-600 p-2 transition-colors">
            <Menu className="w-4 h-4 mr-2" />
            All
          </Button>
          <Link href="/category/electronics" className="hover:underline transition-colors">
            Electronics
          </Link>
          <Link href="/category/books" className="hover:underline transition-colors">
            Books
          </Link>
          <Link href="/category/clothing" className="hover:underline transition-colors">
            Clothing
          </Link>
          <Link href="/category/home" className="hover:underline transition-colors">
            Home & Garden
          </Link>
          <Link href="/category/sports" className="hover:underline transition-colors">
            Sports
          </Link>
          
        </div>
      </div>
    </header>
  )
}
