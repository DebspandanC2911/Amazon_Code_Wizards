import Header from "@/components/Header"
import HeroSection from "@/components/HeroSection"
import ProductGrid from "@/components/ProductGrid"
import CategoryCards from "@/components/CategoryCards"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <HeroSection />
      <CategoryCards />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <ProductGrid />
      </div>
    </div>
  )
}
