import pixelmatch from "pixelmatch"
import type { ProductType, ComparisonResult, DamageArea } from "@/types"

// Product-specific thresholds and settings
const PRODUCT_SETTINGS = {
  electronics: { threshold: 0.1, tolerance: 5, includeAA: true },
  fragile: { threshold: 0.05, tolerance: 3, includeAA: true },
  books: { threshold: 0.15, tolerance: 8, includeAA: false },
  clothing: { threshold: 0.2, tolerance: 10, includeAA: false },
  food: { threshold: 0.08, tolerance: 4, includeAA: true },
  toys: { threshold: 0.12, tolerance: 6, includeAA: false },
  cosmetics: { threshold: 0.1, tolerance: 5, includeAA: true },
  sports: { threshold: 0.15, tolerance: 7, includeAA: false },
  automotive: { threshold: 0.1, tolerance: 5, includeAA: true },
  home: { threshold: 0.15, tolerance: 7, includeAA: false },
  jewelry: { threshold: 0.05, tolerance: 2, includeAA: true },
  medical: { threshold: 0.05, tolerance: 3, includeAA: true },
  office: { threshold: 0.2, tolerance: 10, includeAA: false },
  pet: { threshold: 0.15, tolerance: 7, includeAA: false },
  baby: { threshold: 0.1, tolerance: 5, includeAA: true },
  music: { threshold: 0.1, tolerance: 5, includeAA: true },
  art: { threshold: 0.15, tolerance: 7, includeAA: false },
  industrial: { threshold: 0.25, tolerance: 12, includeAA: false },
  chemicals: { threshold: 0.05, tolerance: 3, includeAA: true },
  generic: { threshold: 0.15, tolerance: 7, includeAA: false },
}

export async function preprocessImage(file: File, productType: ProductType): Promise<ImageData> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")

    if (!ctx) {
      reject(new Error("Could not get canvas context"))
      return
    }

    img.onload = () => {
      // Standardize image size for comparison
      const targetWidth = 800
      const targetHeight = 600

      canvas.width = targetWidth
      canvas.height = targetHeight

      // Draw and resize image
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight)

      // Apply product-specific preprocessing
      const imageData = ctx.getImageData(0, 0, targetWidth, targetHeight)
      const processedData = applyProductSpecificFilters(imageData, productType)

      resolve(processedData)
    }

    img.onerror = () => reject(new Error("Failed to load image"))
    img.src = URL.createObjectURL(file)
  })
}

function applyProductSpecificFilters(imageData: ImageData, productType: ProductType): ImageData {
  const data = new Uint8ClampedArray(imageData.data)

  switch (productType) {
    case "electronics":
    case "fragile":
    case "jewelry":
      // Enhance edge detection for precise items
      return enhanceEdges(new ImageData(data, imageData.width, imageData.height))

    case "clothing":
    case "books":
      // Reduce noise for textured items
      return reduceNoise(new ImageData(data, imageData.width, imageData.height))

    case "food":
    case "cosmetics":
      // Enhance color sensitivity
      return enhanceColors(new ImageData(data, imageData.width, imageData.height))

    default:
      return new ImageData(data, imageData.width, imageData.height)
  }
}

function enhanceEdges(imageData: ImageData): ImageData {
  const data = imageData.data
  const width = imageData.width
  const height = imageData.height
  const output = new Uint8ClampedArray(data.length)

  // Sobel edge detection kernel
  const sobelX = [-1, 0, 1, -2, 0, 2, -1, 0, 1]
  const sobelY = [-1, -2, -1, 0, 0, 0, 1, 2, 1]

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      let pixelX = 0
      let pixelY = 0

      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          const idx = ((y + i) * width + (x + j)) * 4
          const gray = (data[idx] + data[idx + 1] + data[idx + 2]) / 3

          pixelX += gray * sobelX[(i + 1) * 3 + (j + 1)]
          pixelY += gray * sobelY[(i + 1) * 3 + (j + 1)]
        }
      }

      const magnitude = Math.sqrt(pixelX * pixelX + pixelY * pixelY)
      const outputIdx = (y * width + x) * 4

      output[outputIdx] = Math.min(255, magnitude)
      output[outputIdx + 1] = Math.min(255, magnitude)
      output[outputIdx + 2] = Math.min(255, magnitude)
      output[outputIdx + 3] = data[outputIdx + 3]
    }
  }

  return new ImageData(output, width, height)
}

function reduceNoise(imageData: ImageData): ImageData {
  const data = imageData.data
  const width = imageData.width
  const height = imageData.height
  const output = new Uint8ClampedArray(data.length)

  // Gaussian blur kernel
  const kernel = [1, 2, 1, 2, 4, 2, 1, 2, 1]
  const kernelSum = 16

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      let r = 0,
        g = 0,
        b = 0

      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          const idx = ((y + i) * width + (x + j)) * 4
          const weight = kernel[(i + 1) * 3 + (j + 1)]

          r += data[idx] * weight
          g += data[idx + 1] * weight
          b += data[idx + 2] * weight
        }
      }

      const outputIdx = (y * width + x) * 4
      output[outputIdx] = r / kernelSum
      output[outputIdx + 1] = g / kernelSum
      output[outputIdx + 2] = b / kernelSum
      output[outputIdx + 3] = data[outputIdx + 3]
    }
  }

  return new ImageData(output, width, height)
}

function enhanceColors(imageData: ImageData): ImageData {
  const data = imageData.data
  const output = new Uint8ClampedArray(data.length)

  for (let i = 0; i < data.length; i += 4) {
    // Increase color saturation
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    const saturation = max === 0 ? 0 : (max - min) / max

    const enhancementFactor = 1 + saturation * 0.5

    output[i] = Math.min(255, r * enhancementFactor)
    output[i + 1] = Math.min(255, g * enhancementFactor)
    output[i + 2] = Math.min(255, b * enhancementFactor)
    output[i + 3] = data[i + 3]
  }

  return new ImageData(output, imageData.width, imageData.height)
}

export async function compareImages(
  img1: ImageData,
  img2: ImageData,
  productType: ProductType,
  outputCanvas: HTMLCanvasElement | null,
): Promise<ComparisonResult> {
  const { threshold, tolerance, includeAA } = PRODUCT_SETTINGS[productType]

  if (img1.width !== img2.width || img1.height !== img2.height) {
    throw new Error("Images must have the same dimensions")
  }

  const width = img1.width
  const height = img1.height
  const diff = new Uint8ClampedArray(width * height * 4)

  // Perform pixel comparison
  const differentPixels = pixelmatch(img1.data, img2.data, diff, width, height, {
    threshold,
    includeAA,
    alpha: 0.1,
    aaColor: [255, 255, 0],
    diffColor: [255, 0, 0],
    diffColorAlt: [0, 255, 0],
  })

  const totalPixels = width * height
  const differencePercentage = (differentPixels / totalPixels) * 100

  // Render difference image to canvas
  if (outputCanvas) {
    outputCanvas.width = width
    outputCanvas.height = height
    const ctx = outputCanvas.getContext("2d")
    if (ctx) {
      const diffImageData = new ImageData(diff, width, height)
      ctx.putImageData(diffImageData, 0, 0)
    }
  }

  // Detect damage areas
  const damageAreas = detectDamageAreas(diff, width, height, threshold)

  // Determine if package is valid based on product type
  const isValid = differencePercentage <= tolerance

  return {
    differencePercentage,
    totalPixels,
    differentPixels,
    isValid,
    damageAreas,
    productType,
    threshold,
    tolerance,
  }
}

function detectDamageAreas(
  diffData: Uint8ClampedArray,
  width: number,
  height: number,
  threshold: number,
): DamageArea[] {
  const areas: DamageArea[] = []
  const visited = new Set<number>()

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4
      const key = y * width + x

      if (visited.has(key)) continue

      // Check if pixel is significantly different (red in diff image)
      if (diffData[idx] > 200 && diffData[idx + 1] < 100 && diffData[idx + 2] < 100) {
        const area = floodFill(diffData, width, height, x, y, visited)

        if (area.size > 10) {
          // Only consider areas with more than 10 pixels
          const severity = area.size > 100 ? "High" : area.size > 50 ? "Medium" : "Low"
          const type = classifyDamageType(area, diffData, width)

          areas.push({
            x,
            y,
            size: area.size,
            severity,
            type,
          })
        }
      }
    }
  }

  return areas
}

function floodFill(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  startX: number,
  startY: number,
  visited: Set<number>,
): { size: number; pixels: Array<{ x: number; y: number }> } {
  const stack = [{ x: startX, y: startY }]
  const pixels: Array<{ x: number; y: number }> = []

  while (stack.length > 0) {
    const { x, y } = stack.pop()!
    const key = y * width + x

    if (x < 0 || x >= width || y < 0 || y >= height || visited.has(key)) {
      continue
    }

    const idx = (y * width + x) * 4

    // Check if pixel is part of damage area (red in diff)
    if (data[idx] > 200 && data[idx + 1] < 100 && data[idx + 2] < 100) {
      visited.add(key)
      pixels.push({ x, y })

      // Add neighbors to stack
      stack.push({ x: x + 1, y })
      stack.push({ x: x - 1, y })
      stack.push({ x, y: y + 1 })
      stack.push({ x, y: y - 1 })
    }
  }

  return { size: pixels.length, pixels }
}

function classifyDamageType(
  area: { size: number; pixels: Array<{ x: number; y: number }> },
  diffData: Uint8ClampedArray,
  width: number,
): string {
  // Simple classification based on area characteristics
  if (area.size > 500) return "Major structural damage"
  if (area.size > 200) return "Surface damage"
  if (area.size > 50) return "Minor scuff"
  return "Pixel variation"
}

export async function detectProductType(file: File): Promise<ProductType> {
  // Simple heuristic-based product type detection
  // In a real implementation, this could use ML models

  const fileName = file.name.toLowerCase()

  if (fileName.includes("phone") || fileName.includes("laptop") || fileName.includes("electronic")) {
    return "electronics"
  }
  if (fileName.includes("glass") || fileName.includes("fragile")) {
    return "fragile"
  }
  if (fileName.includes("book") || fileName.includes("dvd")) {
    return "books"
  }
  if (fileName.includes("shirt") || fileName.includes("clothing")) {
    return "clothing"
  }

  // Default to generic for unknown types
  return "generic"
}
