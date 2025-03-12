import { NextResponse } from "next/server"
import { generateImage } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: Request) {
  try {
    const { image } = await request.json()

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 })
    }

    // Remove the data URL prefix to get just the base64 data
    const base64Image = image.split(",")[1]

    // Use the AI SDK to generate the transformed image
    const result = await generateImage({
      model: openai("dall-e-3"),
      prompt:
        "Transform this person into Ebenezer Scrooge at night. Add old-timey nightcap, Victorian-era pajamas, and a lit candlestick. Keep the person's face recognizable but make them look like they're in a Dickensian nighttime scene. Dark background with candlelight glow.",
      images: [{ base64: base64Image }],
    })

    // Return the processed image
    return NextResponse.json({
      processedImage: `data:image/png;base64,${result.base64}`,
    })
  } catch (error) {
    console.error("Error processing image:", error)
    return NextResponse.json({ error: "Failed to process image" }, { status: 500 })
  }
}

