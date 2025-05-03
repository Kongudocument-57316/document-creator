import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { SearchSettlementDocumentForm } from "./search-form"
import { getSupabaseServerClient } from "@/lib/supabase"
import { Home, ArrowLeft } from "lucide-react"

async function getSubRegistrarOffices() {
  const supabase = getSupabaseServerClient()
  const { data, error } = await supabase.from("sub_registrar_offices").select("*").order("name")

  if (error) {
    console.error("Error fetching sub-registrar offices:", error)
    return []
  }

  return data || []
}

export default async function SearchSettlementDocumentPage() {
  const subRegistrarOffices = await getSubRegistrarOffices()

  return (
    <div className="flex min-h-screen flex-col bg-amber-50">
      <Header className="bg-amber-100 border-amber-200" />
      <main className="flex-1 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Link href="/document-details/settlement-document">
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
              <h1 className="text-3xl font-bold text-amber-800 ml-2">தானசெட்டில்மெண்ட் ஆவணங்கள் தேடுதல்</h1>
            </div>
          </div>

          <SearchSettlementDocumentForm subRegistrarOffices={subRegistrarOffices} />
        </div>
      </main>
      <footer className="bg-amber-100 border-t border-amber-200 py-4 text-center text-amber-700">
        <p>© 2025 தமிழ் ஆவண மேலாண்மை. அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.</p>
      </footer>
    </div>
  )
}
