"use client"

import { useState, useRef, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Upload, ContrastIcon as Compare, Download, RotateCcw, AlertTriangle, CheckCircle } from "lucide-react"
import ImageUploader from "./ImageUploader"
import ImageComparison from "./ImageComparison"
import ProductTypeSelector from "./ProductTypeSelector"
import { compareImages, preprocessImage, detectProductType } from "@/lib/imageUtils"
import type { ComparisonResult, ProductType } from "@/types"

export default function OpenBoxValidator() {
  const [packagingImage, setPackagingImage] = useState<File | null>(null)
  const [deliveryImage, setDeliveryImage] = useState<File | null>(null)
  const [packagingPreview, setPackagingPreview] = useState<string>("")
  const [deliveryPreview, setDeliveryPreview] = useState<string>("")
  const [selectedProductType, setSelectedProductType] = useState<ProductType>("electronics")
  const [isComparing, setIsComparing] = useState(false)
  const [comparisonResult, setComparisonResult] = useState<ComparisonResult | null>(null)
  const [error, setError] = useState<string>("")
  const [progress, setProgress] = useState(0)

  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleImageUpload = useCallback((file: File, type: "packaging" | "delivery") => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      if (type === "packaging") {
        setPackagingImage(file)
        setPackagingPreview(result)
      } else {
        setDeliveryImage(file)
        setDeliveryPreview(result)
      }
    }
    reader.readAsDataURL(file)
    setError("")
    setComparisonResult(null)
  }, [])

  const handleCompareImages = useCallback(async () => {
    if (!packagingImage || !deliveryImage) {
      setError("Please upload both packaging and delivery images")
      return
    }

    setIsComparing(true)
    setError("")
    setProgress(0)

    try {
      // Progress updates
      setProgress(20)

      // Detect product type automatically if not manually selected
      const detectedType = await detectProductType(packagingImage)
      setProgress(40)

      // Preprocess images
      const processedPackaging = await preprocessImage(packagingImage, selectedProductType)
      setProgress(60)

      const processedDelivery = await preprocessImage(deliveryImage, selectedProductType)
      setProgress(80)

      // Compare images
      const result = await compareImages(processedPackaging, processedDelivery, selectedProductType, canvasRef.current)

      setProgress(100)
      setComparisonResult(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred during comparison")
    } finally {
      setIsComparing(false)
      setProgress(0)
    }
  }, [packagingImage, deliveryImage, selectedProductType])

  const handleReset = useCallback(() => {
    setPackagingImage(null)
    setDeliveryImage(null)
    setPackagingPreview("")
    setDeliveryPreview("")
    setComparisonResult(null)
    setError("")
    setProgress(0)
  }, [])

  const downloadDifferenceImage = useCallback(() => {
    if (!canvasRef.current) return

    const link = document.createElement("a")
    link.download = `difference-${Date.now()}.png`
    link.href = canvasRef.current.toDataURL()
    link.click()
  }, [])

  const getValidationStatus = () => {
    if (!comparisonResult) return null

    const { differencePercentage, isValid } = comparisonResult

    if (isValid) {
      return {
        status: "valid",
        message: "Package integrity validated",
        color: "bg-green-100 text-green-800 border-green-200",
      }
    } else if (differencePercentage > 15) {
      return {
        status: "invalid",
        message: "Significant damage detected",
        color: "bg-red-100 text-red-800 border-red-200",
      }
    } else {
      return {
        status: "warning",
        message: "Minor differences detected",
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      }
    }
  }

  const validationStatus = getValidationStatus()

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Product Type Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Product Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ProductTypeSelector selectedType={selectedProductType} onTypeChange={setSelectedProductType} />
        </CardContent>
      </Card>

      {/* Image Upload Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Original Packaging Image</CardTitle>
          </CardHeader>
          <CardContent>
            <ImageUploader
              onImageUpload={(file) => handleImageUpload(file, "packaging")}
              preview={packagingPreview}
              label="Upload packaging image"
              accept="image/*"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Delivery Image</CardTitle>
          </CardHeader>
          <CardContent>
            <ImageUploader
              onImageUpload={(file) => handleImageUpload(file, "delivery")}
              preview={deliveryPreview}
              label="Upload delivery image"
              accept="image/*"
            />
          </CardContent>
        </Card>
      </div>

      {/* Control Buttons */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4 justify-center">
            <Button
              onClick={handleCompareImages}
              disabled={!packagingImage || !deliveryImage || isComparing}
              className="bg-blue-600 hover:bg-blue-700"
              size="lg"
            >
              <Compare className="w-4 h-4 mr-2" />
              {isComparing ? "Comparing..." : "Compare Images"}
            </Button>

            <Button onClick={handleReset} variant="outline" size="lg">
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>

            {comparisonResult && (
              <Button onClick={downloadDifferenceImage} variant="outline" size="lg">
                <Download className="w-4 h-4 mr-2" />
                Download Difference
              </Button>
            )}
          </div>

          {isComparing && (
            <div className="mt-4">
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-gray-600 mt-2 text-center">Processing images... {progress}%</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Results Section */}
      {comparisonResult && (
        <div className="space-y-6">
          {/* Validation Status */}
          {validationStatus && (
            <Card className={`border-2 ${validationStatus.color}`}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-center gap-3">
                  {validationStatus.status === "valid" ? (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  ) : (
                    <AlertTriangle className="w-6 h-6 text-yellow-600" />
                  )}
                  <span className="text-lg font-semibold">{validationStatus.message}</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Comparison Results */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Comparison Results
                <Badge variant={comparisonResult.isValid ? "default" : "destructive"}>
                  {comparisonResult.differencePercentage.toFixed(2)}% Difference
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Analysis Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Difference Percentage:</span>
                      <span className="font-mono">{comparisonResult.differencePercentage.toFixed(2)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Pixels Compared:</span>
                      <span className="font-mono">{comparisonResult.totalPixels.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Different Pixels:</span>
                      <span className="font-mono">{comparisonResult.differentPixels.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Product Type:</span>
                      <span className="capitalize">{selectedProductType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Validation Status:</span>
                      <Badge variant={comparisonResult.isValid ? "default" : "destructive"}>
                        {comparisonResult.isValid ? "Valid" : "Invalid"}
                      </Badge>
                    </div>
                  </div>

                  {comparisonResult.damageAreas && comparisonResult.damageAreas.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-semibold mb-2">Detected Issues:</h4>
                      <ul className="space-y-1">
                        {comparisonResult.damageAreas.map((area, index) => (
                          <li key={index} className="text-sm text-red-600">
                            • {area.type} at ({area.x}, {area.y}) - Severity: {area.severity}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Visual Difference</h3>
                  <ImageComparison canvasRef={canvasRef} differencePercentage={comparisonResult.differencePercentage} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Hidden canvas for image processing */}
      <canvas ref={canvasRef} style={{ display: "none" }} width={800} height={600} />
    </div>
  )
}
