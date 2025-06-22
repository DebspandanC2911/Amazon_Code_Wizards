import ProductDetail from "@/components/ProductDetail";
import Header from "@/components/Header";

interface ProductPageProps {
  params: {
    id: string;
  };
}

export default function ProductPage({ params }: ProductPageProps) {
  const productId = params.id; // safely extract synchronously here

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <ProductDetail productId={productId} />
    </div>
  );
}
