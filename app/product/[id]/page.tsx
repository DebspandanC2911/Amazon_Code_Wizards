import ProductDetail from "@/components/ProductDetail"
import Header from "@/components/Header"

interface ProductPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function ProductPage({ params }: ProductPageProps) {
  // Await the params as required by Next.js 15
  const { id } = await params

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <ProductDetail productId={id} />
    </div>
  )
}
