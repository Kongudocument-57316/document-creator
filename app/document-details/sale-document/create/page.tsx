import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Home, ArrowLeft } from "lucide-react"

export default function CreateSaleDocument() {
  return (
    <div className="flex min-h-screen flex-col bg-cyan-50">
      <Header className="bg-cyan-100 border-cyan-200" />
      <div className="flex items-center gap-2 p-4 bg-cyan-50">
        <Button asChild variant="outline" className="border-cyan-300 text-cyan-700 hover:bg-cyan-100">
          <Link href="/document-details/sale-document">
            <ArrowLeft className="h-4 w-4 mr-2" />
            பின்செல்
          </Link>
        </Button>
        <Button asChild variant="outline" className="border-cyan-300 text-cyan-700 hover:bg-cyan-100">
          <Link href="/">
            <Home className="h-4 w-4 mr-2" />
            முகப்பு
          </Link>
        </Button>
      </div>
      <main className="flex-1 p-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-cyan-800">புதிய கிரைய ஆவணம் உருவாக்கு</h2>

          {/* இங்கே புதிய கிரைய ஆவணம் உருவாக்கும் படிவம் வரும் */}
          <div className="bg-white p-6 rounded-lg border border-cyan-200 shadow-sm">
            <p className="text-cyan-700">புதிய கிரைய ஆவணம் உருவாக்கும் படிவம்</p>
          </div>
        </div>
      </main>
      <footer className="bg-cyan-100 border-t border-cyan-200 py-4 text-center text-cyan-700">
        <p>© 2023 தமிழ் ஆவண மேலாண்மை. அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.</p>
      </footer>
    </div>
  )
}
