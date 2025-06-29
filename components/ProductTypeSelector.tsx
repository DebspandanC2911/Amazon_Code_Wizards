"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { ProductType } from "@/types"

interface ProductTypeSelectorProps {
  selectedType: ProductType
  onTypeChange: (type: ProductType) => void
}

const productTypes: Array<{ type: ProductType; label: string; description: string; sensitivity: string }> = [
  { type: "electronics", label: "Electronics", description: "Phones, laptops, gadgets", sensitivity: "High" },
  { type: "fragile", label: "Fragile Items", description: "Glass, ceramics, delicate items", sensitivity: "Very High" },
  { type: "books", label: "Books & Media", description: "Books, DVDs, documents", sensitivity: "Medium" },
  { type: "clothing", label: "Clothing", description: "Apparel, textiles, accessories", sensitivity: "Low" },
  { type: "food", label: "Food & Beverages", description: "Packaged food, drinks", sensitivity: "High" },
  { type: "toys", label: "Toys & Games", description: "Children's toys, board games", sensitivity: "Medium" },
  { type: "cosmetics", label: "Beauty & Cosmetics", description: "Makeup, skincare, perfumes", sensitivity: "High" },
  { type: "sports", label: "Sports Equipment", description: "Fitness gear, outdoor equipment", sensitivity: "Medium" },
  { type: "automotive", label: "Automotive Parts", description: "Car parts, accessories", sensitivity: "High" },
  { type: "home", label: "Home & Garden", description: "Furniture, decor, tools", sensitivity: "Medium" },
  { type: "jewelry", label: "Jewelry", description: "Watches, rings, precious items", sensitivity: "Very High" },
  { type: "medical", label: "Medical Supplies", description: "Health products, equipment", sensitivity: "Very High" },
  { type: "office", label: "Office Supplies", description: "Stationery, equipment", sensitivity: "Low" },
  { type: "pet", label: "Pet Supplies", description: "Pet food, toys, accessories", sensitivity: "Medium" },
  { type: "baby", label: "Baby Products", description: "Baby care, toys, clothing", sensitivity: "High" },
  { type: "music", label: "Musical Instruments", description: "Instruments, audio equipment", sensitivity: "High" },
  { type: "art", label: "Art & Crafts", description: "Art supplies, craft materials", sensitivity: "Medium" },
  { type: "industrial", label: "Industrial", description: "Heavy equipment, machinery", sensitivity: "Low" },
  { type: "chemicals", label: "Chemicals", description: "Cleaning supplies, chemicals", sensitivity: "Very High" },
  { type: "generic", label: "Generic", description: "General purpose items", sensitivity: "Medium" },
]

export default function ProductTypeSelector({ selectedType, onTypeChange }: ProductTypeSelectorProps) {
  const getSensitivityColor = (sensitivity: string) => {
    switch (sensitivity) {
      case "Very High":
        return "bg-red-100 text-red-800"
      case "High":
        return "bg-orange-100 text-orange-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800"
      case "Low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Select Product Type</h3>
        <p className="text-sm text-gray-600 mb-4">
          Choose the product category to optimize comparison sensitivity and accuracy.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {productTypes.map(({ type, label, description, sensitivity }) => (
          <Card
            key={type}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedType === type ? "ring-2 ring-blue-500 bg-blue-50" : "hover:bg-gray-50"
            }`}
            onClick={() => onTypeChange(type)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-sm">{label}</h4>
                <Badge className={`text-xs ${getSensitivityColor(sensitivity)}`}>{sensitivity}</Badge>
              </div>
              <p className="text-xs text-gray-600">{description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-sm mb-2">
          Selected: {productTypes.find((p) => p.type === selectedType)?.label}
        </h4>
        <p className="text-sm text-gray-700">{productTypes.find((p) => p.type === selectedType)?.description}</p>
        <Badge
          className={`mt-2 ${getSensitivityColor(productTypes.find((p) => p.type === selectedType)?.sensitivity || "Medium")}`}
        >
          Sensitivity: {productTypes.find((p) => p.type === selectedType)?.sensitivity}
        </Badge>
      </div>
    </div>
  )
}
