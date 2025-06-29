"use client"

import type React from "react"
import { useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, X } from "lucide-react"

interface ImageUploaderProps {
  onImageUpload: (file: File) => void
  preview: string
  label: string
  accept: string
}

export default function ImageUploader({ onImageUpload, preview, label, accept }: ImageUploaderProps) {
  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (file) {
        onImageUpload(file)
      }
    },
    [onImageUpload],
  )

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault()
      const file = event.dataTransfer.files?.[0]
      if (file && file.type.startsWith("image/")) {
        onImageUpload(file)
      }
    },
    [onImageUpload],
  )

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }, [])

  return (
    <div className="space-y-4">
      {!preview ? (
        <Card
          className="border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors cursor-pointer"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Upload className="w-12 h-12 text-gray-400 mb-4" />
            <p className="text-lg font-medium text-gray-600 mb-2">{label}</p>
            <p className="text-sm text-gray-500 mb-4">Drag and drop or click to browse</p>
            <Button variant="outline" asChild>
              <label className="cursor-pointer">
                Choose File
                <input type="file" accept={accept} onChange={handleFileChange} className="hidden" />
              </label>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="relative">
          <img
            src={preview || "/placeholder.svg"}
            alt="Preview"
            className="w-full h-64 object-cover rounded-lg border"
          />
          <Button
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2"
            onClick={() => {
              // Reset the preview by triggering parent component
              const input = document.createElement("input")
              input.type = "file"
              input.accept = accept
              input.onchange = handleFileChange
              input.value = ""
            }}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
