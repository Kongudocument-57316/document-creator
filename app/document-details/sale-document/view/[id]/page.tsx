import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Home, ArrowLeft } from "lucide-react"
import { SaleDocumentView } from "./sale-document-view"

export default function ViewSaleDocument({ params }: { params: { id: string } }) {
  return (
    <div className="flex min-h-screen flex-col bg-teal-50">
      <Header className="bg-teal-100 border-teal-200" />
      <div className="flex items-center gap-2 p-4 bg-teal-50">
        <Button asChild variant="outline" className="border-teal-300 text-teal-700 hover:bg-teal-100">
          <Link href="/document-details/sale-document/search">
            <ArrowLeft className="h-4 w-4 mr-2" />
            பின்செல்
          </Link>
        </Button>
        <Button asChild variant="outline" className="border-teal-300 text-teal-700 hover:bg-teal-100">
          <Link href="/">
            <Home className="h-4 w-4 mr-2" />
            முகப்பு
          </Link>
        </Button>
      </div>
      <main className="flex-1 p-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-teal-800">கிரைய ஆவண விவரங்கள்</h2>

          <div className="bg-white p-6 rounded-lg border border-teal-200 shadow-sm">
            <SaleDocumentView id={params.id} />
          </div>
        </div>
      </main>
      <footer className="bg-teal-100 border-t border-teal-200 py-4 text-center text-teal-700">
        <p>© 2023 தமிழ் ஆவண மேலாண்மை. அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.</p>
      </footer>
    </div>
  )
}
