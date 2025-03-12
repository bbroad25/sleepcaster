import { Toaster } from "@/components/ui/toaster"
import ImageUploader from "@/components/image-uploader"
import { CandlestickChartIcon as Candle } from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <header className="mb-12 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <h1 className="text-4xl md:text-5xl font-bold text-amber-300">Sleepcaster</h1>
            <Candle className="h-8 w-8 text-amber-300" />
          </div>
          <p className="text-lg text-amber-100">Transform yourself into Ebenezer Scrooge with our AI filter</p>
          <div className="mt-2">
            <span className="bg-amber-900/30 text-amber-300 px-3 py-1 rounded-full text-sm font-mono">$sleepy<a href=“https://dexscreener.com/base/0xf1078a39676a702af5f14a5fce9640a4623c7795”></span>
          </div>
        </header>

        <div className="max-w-3xl mx-auto">
          <ImageUploader />
        </div>

        <footer className="mt-16 text-center text-sm text-slate-400">
          <p>© {new Date().getFullYear()} Sleepcaster. All rights reserved.</p>
        </footer>
      </div>
      <Toaster />
    </main>
  )
}

