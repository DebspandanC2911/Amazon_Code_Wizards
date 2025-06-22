import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"

const categories = [
  {
    title: "Prime Video",
    subtitle: "Try 30 days for free",
    image: "https://picsum.photos/seed/prime-video/300/200",
    link: "/prime-video",
  },
  {
    title: "Customers' most-loved",
    subtitle: "Discover items with 4+ stars",
    image: "https://picsum.photos/seed/most-loved/300/200",
    link: "/most-loved",
  },
  {
    title: "Best Sellers in Outlet",
    subtitle: "Shop now",
    image: "https://picsum.photos/seed/best-sellers/300/200",
    link: "/outlet",
  },
  {
    title: "Amazon exclusive toys",
    subtitle: "See more",
    image: "https://picsum.photos/seed/toys/300/200",
    link: "/toys",
  },
  {
    title: "Small space solutions",
    subtitle: "Shop now",
    image: "https://picsum.photos/seed/small-space/300/200",
    link: "/small-space",
  },
  {
    title: "Save on pre-owned Amazon devices",
    subtitle: "Shop now",
    image: "https://picsum.photos/seed/pre-owned/300/200",
    link: "/pre-owned",
  },
  {
    title: "Live plants & planters",
    subtitle: "Shop now",
    image: "https://picsum.photos/seed/plants/300/200",
    link: "/plants",
  },
  {
    title: "Easy, elevated t-shirts",
    subtitle: "Shop now",
    image: "https://picsum.photos/seed/tshirts/300/200",
    link: "/tshirts",
  },
]

export default function CategoryCards() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category, index) => (
          <Card key={index} className="bg-white hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <h3 className="font-bold text-lg mb-2">{category.title}</h3>
              <div className="mb-4">
                <Image
                  src={category.image}
                  alt={category.title}
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover rounded"
                />
              </div>
              <Link href={category.link}>
                <Button variant="link" className="p-0 text-blue-600 hover:text-blue-800">
                  {category.subtitle}
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
