import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Home, ArrowLeft } from "lucide-react"
import { SaleDeedCreationForm } from "./sale-deed-creation-form"

export default function CreateSaleDeed() {
  return (
    <div className="flex min-h-screen flex-col bg-purple-50">
      <Header className="bg-purple-100 border-purple-200" />
      <div className="flex items-center gap-2 p-4 bg-purple-50">
        <Button asChild variant="outline" className="border-purple-300 text-purple-700 hover:bg-purple-100">
          <Link href="/document-details/sale-document">
            <ArrowLeft className="h-4 w-4 mr-2" />
            பின்செல்
          </Link>
        </Button>
        <Button asChild variant="outline" className="border-purple-300 text-purple-700 hover:bg-purple-100">
          <Link href="/">
            <Home className="h-4 w-4 mr-2" />
            முகப்பு
          </Link>
        </Button>
      </div>
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-purple-800">கிரைய ஆவணம் உருவாக்கு</h2>

          <div className="bg-white p-6 rounded-lg border border-purple-200 shadow-sm">
            <SaleDeedCreationForm />
          </div>
        </div>
      </main>
      <footer className="bg-purple-100 border-t border-purple-200 py-4 text-center text-purple-700">
        <p>© 2023 தமிழ் ஆவண மேலாண்மை. அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.</p>
      </footer>
    </div>
  )
}
