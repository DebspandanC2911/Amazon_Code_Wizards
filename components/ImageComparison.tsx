"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface ImageComparisonProps {
  canvasRef: React.RefObject<HTMLCanvasElement>
  differencePercentage: number
}

export default function ImageComparison({ canvasRef, differencePercentage }: ImageComparisonProps) {
  const [differenceImageUrl, setDifferenceImageUrl] = useState<string>("")

  useEffect(() => {
    if (canvasRef.current) {
      const dataUrl = canvasRef.current.toDataURL()
      setDifferenceImageUrl(dataUrl)
    }
  }, [canvasRef])

  const getDifferenceLevel = () => {
    if (differencePercentage < 5) return { level: "Minimal", color: "bg-green-100 text-green-800" }
    if (differencePercentage < 15) return { level: "Moderate", color: "bg-yellow-100 text-yellow-800" }
    return { level: "Significant", color: "bg-red-100 text-red-800" }
  }

  const diffLevel = getDifferenceLevel()

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold">Difference Visualization</h4>
          <Badge className={diffLevel.color}>
            {diffLevel.level} ({differencePercentage.toFixed(2)}%)
          </Badge>
        </div>

        {differenceImageUrl ? (
          <div className="space-y-4">
            <img
              src={differenceImageUrl || "/placeholder.svg"}
              alt="Difference visualization"
              className="w-full h-auto rounded-lg border"
            />
            <div className="text-sm text-gray-600">
              <p className="mb-2">
                <strong>Red areas:</strong> Significant differences detected
              </p>
              <p className="mb-2">
                <strong>Yellow areas:</strong> Minor variations
              </p>
              <p>
                <strong>Green/Blue areas:</strong> Identical regions
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-48 bg-gray-100 rounded-lg">
            <p className="text-gray-500">No difference image available</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
