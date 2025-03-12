import { NextResponse } from "next/server"

// For demo purposes, we'll simulate the AI processing
// This avoids potential issues with the OpenAI integration
export async function POST(request: Request) {
  try {
    const { image } = await request.json()

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 })
    }

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // For demo purposes, we'll just return the original image
    // In a real app, this would be processed by OpenAI
    return NextResponse.json({
      processedImage: image,
      message: "Image processed successfully (demo mode)",
    })
  } catch (error) {
    console.error("Error processing image:", error)
    return NextResponse.json({ error: "Failed to process image" }, { status: 500 })
  }
}
