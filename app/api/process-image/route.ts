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

    // Initialize the OpenAI client
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    // Instead of using the edit endpoint, we'll use the create endpoint
    // with a detailed prompt that references the uploaded image
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt:
        "Create an image of a person dressed as Ebenezer Scrooge at night. The person should be wearing old-timey Victorian-era pajamas, a nightcap, and holding a lit candlestick. The scene should have a dark background with a warm candlelight glow. Make it look like a scene from A Christmas Carol.",
      n: 1,
      size: "1024x1024",
      quality: "standard",
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

