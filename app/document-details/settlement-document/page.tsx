import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Home, ArrowLeft } from "lucide-react"

export default function SettlementDocumentPage() {
  return (
    <div className="flex min-h-screen flex-col bg-amber-50">
      <Header className="bg-amber-100 border-amber-200" />
      <main className="flex-1 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Link href="/document-details">
                <Button
                  variant="outline"
                  size="icon"
                  className="border-amber-300 text-amber-700 hover:bg-amber-100"
                  aria-label="Back"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/">
                <Button
                  variant="outline"
                  size="icon"
                  className="border-amber-300 text-amber-700 hover:bg-amber-100"
                  aria-label="Home"
                >
                  <Home className="h-4 w-4" />
                </Button>
              </Link>
              <h1 className="text-3xl font-bold text-amber-800 ml-2">தானசெட்டில்மெண்ட் ஆவணங்கள்</h1>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link href="/document-details/settlement-document/create">
              <div className="border border-amber-300 rounded-lg p-6 hover:bg-amber-100 transition-colors flex flex-col items-center text-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 text-amber-600 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <h2 className="text-xl font-bold text-amber-800 mb-2">புதிய தானசெட்டில்மெண்ட் ஆவணம் உருவாக்கு</h2>
                <p className="text-amber-700">புதிய தானசெட்டில்மெண்ட் ஆவணத்தை உருவாக்கவும்</p>
              </div>
            </Link>

            <Link href="/document-details/settlement-document/search">
              <div className="border border-amber-300 rounded-lg p-6 hover:bg-amber-100 transition-colors flex flex-col items-center text-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 text-amber-600 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <h2 className="text-xl font-bold text-amber-800 mb-2">தானசெட்டில்மெண்ட் ஆவணங்கள் தேடுதல்</h2>
                <p className="text-amber-700">பதிவு செய்யப்பட்ட தானசெட்டில்மெண்ட் ஆவணங்களைத் தேடவும்</p>
              </div>
            </Link>
          </div>
        </div>
      </main>
      <footer className="bg-amber-100 border-t border-amber-200 py-4 text-center text-amber-700">
        <p>© 2025 தமிழ் ஆவண மேலாண்மை. அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.</p>
      </footer>
    </div>
  )
}
