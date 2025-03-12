import { NextResponse } from "next/server"
import OpenAI from "openai"

// Set the maximum duration for this API route
export const maxDuration = 60 // 60 seconds

export async function POST(request: Request) {
  try {
    const { image } = await request.json()

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 })
    }

    // Extract the base64 data from the data URL
    const base64Image = image.split(",")[1]

    // Initialize the OpenAI client
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    // Call the OpenAI API to generate the image
    const response = await openai.images.edit({
      image: Buffer.from(base64Image, "base64"),
      prompt:
        "Transform this person into Ebenezer Scrooge at night. Add old-timey nightcap, Victorian-era pajamas, and a lit candlestick. Keep the person's face recognizable but make them look like they're in a Dickensian nighttime scene. Dark background with candlelight glow.",
      n: 1,
      size: "1024x1024",
    })

    // Get the URL of the generated image
    const generatedImageUrl = response.data[0]?.url

    if (!generatedImageUrl) {
      throw new Error("No image was generated")
    }

    // Fetch the generated image and convert it to base64
    const imageResponse = await fetch(generatedImageUrl)
    const imageBuffer = await imageResponse.arrayBuffer()
    const base64GeneratedImage = Buffer.from(imageBuffer).toString("base64")

    // Return the processed image as a data URL
    return NextResponse.json({
      processedImage: `data:image/png;base64,${base64GeneratedImage}`,
      message: "Image processed successfully with Scrooge filter",
    })
  } catch (error) {
    console.error("Error processing image:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to process image" },
      { status: 500 },
    )
  }
}

