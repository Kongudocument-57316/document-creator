import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Home, PlusCircle } from "lucide-react"
import Link from "next/link"
import { SearchForm } from "./search-form"

export default function SearchPartitionReleasePage() {
  return (
    <div className="flex min-h-screen flex-col bg-cyan-50">
      <Header className="bg-cyan-100 border-cyan-200" />
      <main className="flex-1 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h1 className="text-3xl font-bold text-cyan-800">பாகபாத்திய விடுதலை ஆவணங்கள் தேடுதல்</h1>
            <div className="flex gap-2">
              <Link href="/document-details/partition-release/create">
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  புதிய ஆவணம்
                </Button>
              </Link>
              <Link href="/document-details/partition-release">
                <Button variant="outline" className="bg-cyan-100 hover:bg-cyan-200 text-cyan-800 border-cyan-300">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  திரும்பிச் செல்
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" className="bg-cyan-100 hover:bg-cyan-200 text-cyan-800 border-cyan-300">
                  <Home className="mr-2 h-4 w-4" />
                  முகப்பு
                </Button>
              </Link>
            </div>
          </div>

          <SearchForm />
        </div>
      </main>
      <footer className="bg-cyan-100 border-t border-cyan-200 py-4 text-center text-cyan-700">
        <p>© 2025 தமிழ் ஆவண மேலாண்மை. அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.</p>
      </footer>
    </div>
  )
}
