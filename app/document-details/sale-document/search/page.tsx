import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Home, ArrowLeft } from "lucide-react"
import { SaleDocumentSearch } from "./sale-document-search"

export default function SearchSaleDocument() {
  return (
    <div className="flex min-h-screen flex-col bg-sky-50">
      <Header className="bg-sky-100 border-sky-200" />
      <div className="flex items-center gap-2 p-4 bg-sky-50">
        <Button asChild variant="outline" className="border-sky-300 text-sky-700 hover:bg-sky-100">
          <Link href="/document-details/sale-document">
            <ArrowLeft className="h-4 w-4 mr-2" />
            பின்செல்
          </Link>
        </Button>
        <Button asChild variant="outline" className="border-sky-300 text-sky-700 hover:bg-sky-100">
          <Link href="/">
            <Home className="h-4 w-4 mr-2" />
            முகப்பு
          </Link>
        </Button>
      </div>
      <main className="flex-1 p-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-sky-800">கிரைய ஆவணங்கள் தேடுதல்</h2>

          <div className="bg-white p-6 rounded-lg border border-sky-200 shadow-sm">
            <SaleDocumentSearch />
          </div>
        </div>
      </main>
      <footer className="bg-sky-100 border-t border-sky-200 py-4 text-center text-sky-700">
        <p>© 2023 தமிழ் ஆவண மேலாண்மை. அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.</p>
      </footer>
    </div>
  )
}
