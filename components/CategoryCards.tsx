import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"

const categories = [
  {
    title: "Prime Video",
    subtitle: "Try 30 days for free",
    image: "/images/category-prime-video.jpg",
    link: "/prime-video",
  },
  {
    title: "Customers' most-loved",
    subtitle: "Discover items with 4+ stars",
    image: "/images/category-most-loved.jpg",
    link: "/most-loved",
  },
  {
    title: "Best Sellers in Outlet",
    subtitle: "Shop now",
    image: "/images/category-outlet.jpg",
    link: "/outlet",
  },
  {
    title: "Amazon exclusive toys",
    subtitle: "See more",
    image: "/images/category-toys.jpg",
    link: "/toys",
  },
  {
    title: "Small space solutions",
    subtitle: "Shop now",
    image: "/images/category-small-space.jpg",
    link: "/small-space",
  },
  {
    title: "Save on pre-owned Amazon devices",
    subtitle: "Shop now",
    image: "/images/category-devices.jpg",
    link: "/pre-owned",
  },
  {
    title: "Live plants & planters",
    subtitle: "Shop now",
    image: "/images/category-plants.jpg",
    link: "/plants",
  },
  {
    title: "Easy, elevated t-shirts",
    subtitle: "Shop now",
    image: "/images/category-tshirts.jpg",
    link: "/tshirts",
  },
]

export default function CategoryCards() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Shop by Category</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category, index) => (
          <Card key={index} className="bg-white hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-4">
              <h3 className="font-bold text-lg mb-3 text-gray-800">{category.title}</h3>
              <div className="mb-4 overflow-hidden rounded-lg">
                <Image
                  src={category.image || "/placeholder.svg"}
                  alt={category.title}
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                  priority={index < 4}
                />
              </div>
              <Link href={category.link}>
                <Button variant="link" className="p-0 text-blue-600 hover:text-blue-800 font-medium">
                  {category.subtitle} →
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
