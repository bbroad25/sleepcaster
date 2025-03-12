"use client"

import type React from "react"

import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Loader2, Upload, Download, RefreshCw } from "lucide-react"
import Image from "next/image"

export default function ImageUploader() {
  const [originalImage, setOriginalImage] = useState<string | null>(null)
  const [processedImage, setProcessedImage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.includes("image")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive",
      })
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      setOriginalImage(event.target?.result as string)
      setProcessedImage(null)
    }
    reader.readAsDataURL(file)
  }

  const processImage = async () => {
    if (!originalImage) return

    setIsProcessing(true)

    try {
      const response = await fetch("/api/process-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: originalImage }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to process image")
      }

      const data = await response.json()

      if (data.processedImage) {
        setProcessedImage(data.processedImage)

        toast({
          title: "Success!",
          description: data.message || "Your Scrooge transformation is complete",
        })
      } else {
        throw new Error("No processed image returned")
      }
    } catch (error) {
      console.error("Processing error:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to process your image. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const downloadImage = () => {
    if (!processedImage) return

    const link = document.createElement("a")
    link.href = processedImage
    link.download = "sleepcaster-scrooge.png"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const resetImages = () => {
    setOriginalImage(null)
    setProcessedImage(null)
  }

  return (
    <div className="space-y-8">
      {!originalImage ? (
        <Card className="border-dashed border-2 border-slate-700 bg-slate-800/50 p-12 text-center hover:bg-slate-800 transition-colors">
          <div className="flex flex-col items-center">
            <Upload className="h-12 w-12 text-amber-300 mb-4" />
            <h3 className="text-xl font-medium mb-2">Upload your selfie</h3>
            <p className="text-slate-400 mb-4">Click to select or drag and drop</p>

            {/* This is the key change - making the button directly trigger the file input */}
            <input type="file" id="image-upload" accept="image/*" className="hidden" onChange={handleFileChange} />
            <Button
              variant="outline"
              className="bg-slate-700"
              onClick={() => document.getElementById("image-upload")?.click()}
            >
              Select Image
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-4 bg-slate-800 overflow-hidden">
            <div className="aspect-square relative overflow-hidden rounded-md mb-3">
              <Image src={originalImage || "/placeholder.svg"} alt="Original selfie" fill className="object-cover" />
            </div>
            <p className="text-center text-sm text-slate-400">Original Image</p>
          </Card>

          <Card className="p-4 bg-slate-800 overflow-hidden">
            <div className="aspect-square relative overflow-hidden rounded-md mb-3 bg-slate-700/50">
              {processedImage ? (
                <Image
                  src={processedImage || "/placeholder.svg"}
                  alt="Scrooge transformation"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  {isProcessing ? (
                    <div className="text-center">
                      <Loader2 className="h-10 w-10 animate-spin text-amber-300 mx-auto mb-2" />
                      <p className="text-slate-300">Transforming...</p>
                    </div>
                  ) : (
                    <p className="text-slate-400 text-center px-4">Click "Transform" to see the Scrooge version</p>
                  )}
                </div>
              )}
            </div>
            <p className="text-center text-sm text-slate-400">Scrooge Transformation</p>
          </Card>
        </div>
      )}

      <div className="flex flex-wrap gap-4 justify-center">
        {originalImage && !processedImage && !isProcessing && (
          <Button onClick={processImage} className="bg-amber-600 hover:bg-amber-700">
            Transform to Scrooge
          </Button>
        )}

        {processedImage && (
          <Button onClick={downloadImage} variant="outline" className="gap-2">
            <Download className="h-4 w-4" /> Download
          </Button>
        )}

        {originalImage && (
          <Button onClick={resetImages} variant="ghost" className="gap-2">
            <RefreshCw className="h-4 w-4" /> Start Over
          </Button>
        )}
      </div>
    </div>
  )
}

