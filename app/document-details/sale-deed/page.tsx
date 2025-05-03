import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Home, Plus, Search } from "lucide-react"

export default function SaleDeedPage() {
  return (
    <div className="flex min-h-screen flex-col bg-cyan-50">
      <Header className="bg-cyan-100 border-cyan-200" />
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-cyan-800">கிரைய பத்திரம் மேலாண்மை</h1>
            <div className="flex gap-2">
              <Button asChild variant="outline" className="border-cyan-300 text-cyan-700 hover:bg-cyan-100">
                <Link href="/">
                  <Home className="h-4 w-4 mr-2" />
                  முகப்பு
                </Link>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Create New Sale Deed */}
            <Link href="/document-details/sale-deed/create">
              <div className="bg-white p-6 rounded-lg border border-cyan-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col items-center text-center">
                <div className="h-12 w-12 bg-cyan-100 rounded-full flex items-center justify-center mb-4">
                  <Plus className="h-6 w-6 text-cyan-600" />
                </div>
                <h2 className="text-lg font-semibold text-cyan-800 mb-2">புதிய கிரைய பத்திரம் உருவாக்கு</h2>
                <p className="text-gray-600">புதிய கிரைய பத்திரத்தை உருவாக்கி பதிவு செய்யவும்</p>
              </div>
            </Link>

            {/* Search Sale Deeds */}
            <Link href="/document-details/sale-deed/search">
              <div className="bg-white p-6 rounded-lg border border-cyan-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col items-center text-center">
                <div className="h-12 w-12 bg-cyan-100 rounded-full flex items-center justify-center mb-4">
                  <Search className="h-6 w-6 text-cyan-600" />
                </div>
                <h2 className="text-lg font-semibold text-cyan-800 mb-2">கிரைய பத்திரம் தேடல்</h2>
                <p className="text-gray-600">ஏற்கனவே உள்ள கிரைய பத்திரங்களை தேடி காணவும்</p>
              </div>
            </Link>

            {/* Setup Database Tables */}
            <Link href="/document-details/sale-deed/setup">
              <div className="bg-white p-6 rounded-lg border border-cyan-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col items-center text-center">
                <div className="h-12 w-12 bg-cyan-100 rounded-full flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-cyan-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
                    />
                  </svg>
                </div>
                <h2 className="text-lg font-semibold text-cyan-800 mb-2">தரவுத்தள அமைப்பு</h2>
                <p className="text-gray-600">கிரைய பத்திர தரவுத்தள அட்டவணைகளை அமைக்கவும்</p>
              </div>
            </Link>
          </div>
        </div>
      </main>
      <footer className="bg-cyan-100 border-t border-cyan-200 py-4 text-center text-cyan-700">
        <p>© 2025 தமிழ் ஆவண மேலாண்மை. அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.</p>
      </footer>
    </div>
  )
}
