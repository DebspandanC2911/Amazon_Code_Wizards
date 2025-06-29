import Header from "@/components/Header"
import HeroSection from "@/components/HeroSection"
import CategoryCards from "@/components/CategoryCards"
import ProductGrid from "@/components/ProductGrid"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <HeroSection />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <CategoryCards />
        <div className="mt-12">
          <ProductGrid />
        </div>
      </div>
    </div>
  )
}
