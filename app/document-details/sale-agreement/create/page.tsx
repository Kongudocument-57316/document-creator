import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Home, ArrowLeft } from "lucide-react"
import CreateSaleAgreementForm from "./create-sale-agreement-form"

export default function CreateSaleAgreement() {
  return (
    <div className="flex min-h-screen flex-col bg-violet-50">
      <Header className="bg-violet-100 border-violet-200" />
      <div className="flex items-center gap-2 p-4 bg-violet-50">
        <Button asChild variant="outline" className="border-violet-300 text-violet-700 hover:bg-violet-100">
          <Link href="/document-details/sale-agreement">
            <ArrowLeft className="h-4 w-4 mr-2" />
            பின்செல்
          </Link>
        </Button>
        <Button asChild variant="outline" className="border-violet-300 text-violet-700 hover:bg-violet-100">
          <Link href="/">
            <Home className="h-4 w-4 mr-2" />
            முகப்பு
          </Link>
        </Button>
      </div>
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-violet-800">புதிய கிரைய உடன்படிக்கை ஆவணம் உருவாக்கு</h2>
          <CreateSaleAgreementForm />
        </div>
      </main>
      <footer className="bg-violet-100 border-t border-violet-200 py-4 text-center text-violet-700">
        <p>© 2025 தமிழ் ஆவண மேலாண்மை. அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.</p>
      </footer>
    </div>
  )
}
