import { NextResponse } from "next/server"
import OpenAI from "openai"

// Set the maximum duration for this API route
export const maxDuration = 60 // 60 seconds

// Demo mode images - pre-generated Scrooge-like images
const DEMO_IMAGES = [
  "https://i.imgur.com/JXgwWQF.jpg", // Replace with actual demo image URLs
]

export async function POST(request: Request) {
  try {
    // We're no longer expecting an image in the request
    const { generateScrooge, demoMode } = await request.json()

    if (!generateScrooge) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 })
    }

    // Use demo mode if specified or if there's an error with OpenAI
    const useDemoMode = demoMode === true

    if (useDemoMode) {
      // In demo mode, return a pre-generated image
      const demoImageUrl = DEMO_IMAGES[0]

      // Fetch the demo image and convert it to base64
      const imageResponse = await fetch(demoImageUrl)
      const imageBuffer = await imageResponse.arrayBuffer()
      const base64Image = Buffer.from(imageBuffer).toString("base64")

      return NextResponse.json({
        processedImage: `data:image/jpeg;base64,${base64Image}`,
        message: "Demo mode: Scrooge transformation complete!",
        demoMode: true,
      })
    }

    // Try to use OpenAI if not in demo mode
    try {
      // Initialize the OpenAI client
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      })

      // Generate a Scrooge image
      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt:
          "Create a detailed portrait of a person dressed as Ebenezer Scrooge at night. The person should be wearing old-timey Victorian-era pajamas, a white nightcap, and holding a lit brass candlestick. The scene should have a dark background with a warm candlelight glow illuminating their face. Make it look like a scene from A Christmas Carol with rich, dramatic lighting.",
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
        message: "Scrooge transformation complete!",
      })
    } catch (openaiError) {
      console.error("OpenAI error, falling back to demo mode:", openaiError)

      // Fall back to demo mode if OpenAI fails
      const demoImageUrl = DEMO_IMAGES[0]

      // Fetch the demo image and convert it to base64
      const imageResponse = await fetch(demoImageUrl)
      const imageBuffer = await imageResponse.arrayBuffer()
      const base64Image = Buffer.from(imageBuffer).toString("base64")

      return NextResponse.json({
        processedImage: `data:image/jpeg;base64,${base64Image}`,
        message: "OpenAI unavailable - using demo image instead",
        demoMode: true,
      })
    }
  } catch (error) {
    console.error("Error processing image:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to process image" },
      { status: 500 },
    )
  }
}

