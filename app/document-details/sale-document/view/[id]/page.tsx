"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { toast } from "sonner"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Home, ArrowLeft, Printer, FileDown, Pencil, FileText } from "lucide-react"
import { getSupabaseBrowserClient } from "@/lib/supabase"
import { exportToDocx, exportToPdf } from "../../create/export-utils"

// Format date from YYYY-MM-DD to DD/MM/YYYY for display
const formatDateForDisplay = (dateString: string) => {
  if (!dateString) return ""
  const date = new Date(dateString)
  return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(
    2,
    "0",
  )}/${date.getFullYear()}`
}

export default function ViewSaleDocument() {
  const params = useParams()
  const router = useRouter()
  const documentId = params.id as string

  const [document, setDocument] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  const supabase = getSupabaseBrowserClient()

  useEffect(() => {
    if (documentId) {
      fetchDocument(Number.parseInt(documentId))
    }
  }, [documentId])

  const fetchDocument = async (id: number) => {
    try {
      setIsLoading(true)

      // Fetch document details
      const { data, error } = await supabase
        .from("sale_documents")
        .select(`
          *,
          sub_registrar_offices:sub_registrar_office_id (name),
          book_numbers:book_number_id (number),
          document_types:document_type_id (name),
          submission_types:submission_type_id (name),
          typists:typist_id (name),
          offices:office_id (name)
        `)
        .eq("id", id)
        .single()

      if (error) throw error

      // Fetch related parties (buyers, sellers, witnesses)
      const { data: parties, error: partiesError } = await supabase
        .from("sale_document_parties")
        .select(`
          party_type,
          users:user_id (id, name, phone, relation_type, relative_name)
        `)
        .eq("sale_document_id", id)

      if (partiesError) throw partiesError

      // Group parties by type
      const buyers = parties?.filter((p) => p.party_type === "buyer").map((p) => p.users) || []
      const sellers = parties?.filter((p) => p.party_type === "seller").map((p) => p.users) || []
      const witnesses = parties?.filter((p) => p.party_type === "witness").map((p) => p.users) || []

      // Fetch properties
      const { data: properties, error: propertiesError } = await supabase
        .from("sale_document_properties")
        .select(`
          property_id,
          property_details,
          properties:property_id (property_name)
        `)
        .eq("sale_document_id", id)

      if (propertiesError) throw propertiesError

      setDocument({
        ...data,
        buyers,
        sellers,
        witnesses,
        properties: properties || [],
      })
    } catch (error: any) {
      toast.error("ஆவணத்தை பெறுவதில் பிழை: " + error.message)
      router.push("/document-details/sale-document/search")
    } finally {
      setIsLoading(false)
    }
  }

  // Handle document download as HTML
  const handleHtmlDownload = async () => {
    if (!document) return

    try {
      // For now, we'll just download the HTML content as a text file
      // In a real implementation, you would download the DOCX data
      if (document.document_content) {
        // Create a blob from the HTML content
        const blob = new Blob([document.document_content], { type: "text/html" })
        const url = URL.createObjectURL(blob)

        // Create a download link and click it
        const a = document.createElement("a")
        a.href = url
        a.download = `${document.document_name.replace(/\s+/g, "_")}.html`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      } else {
        toast.error("ஆவணத்தின் உள்ளடக்கம் கிடைக்கவில்லை")
      }
    } catch (error: any) {
      toast.error("ஆவணத்தை பதிவிறக்குவதில் பிழை: " + error.message)
    }
  }

  // Handle document download as DOCX
  const handleDocxDownload = () => {
    if (!document) return

    try {
      const handler = exportToDocx(".document-content", document.document_name || `கிரைய_ஆவணம்_${document.id}`)
      handler()
    } catch (error: any) {
      toast.error("DOCX ஏற்றுமதியில் பிழை: " + error.message)
    }
  }

  // Handle document download as PDF
  const handlePdfDownload = () => {
    if (!document) return

    try {
      const handler = exportToPdf(".document-content", document.document_name || `கிரைய_ஆவணம்_${document.id}`)
      handler()
    } catch (error: any) {
      toast.error("PDF ஏற்றுமதியில் பிழை: " + error.message)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-sky-50">
        <Header className="bg-sky-100 border-sky-200" />
        <div className="flex-1 p-6 flex items-center justify-center">
          <p className="text-sky-700">ஆவணத்தை ஏற்றுகிறது...</p>
        </div>
      </div>
    )
  }

  if (!document) {
    return (
      <div className="flex min-h-screen flex-col bg-sky-50">
        <Header className="bg-sky-100 border-sky-200" />
        <div className="flex-1 p-6 flex items-center justify-center">
          <p className="text-red-700">ஆவணம் கிடைக்கவில்லை</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-sky-50">
      <Header className="bg-sky-100 border-sky-200" />
      <div className="flex items-center gap-2 p-4 bg-sky-50">
        <Button asChild variant="outline" className="border-sky-300 text-sky-700 hover:bg-sky-100">
          <Link href="/document-details/sale-document/search">
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
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-sky-800">{document.document_name}</h2>

            <div className="flex gap-2">
              <Button onClick={() => window.print()} className="bg-sky-600 hover:bg-sky-700 text-white">
                <Printer className="h-4 w-4 mr-2" />
                அச்சிடு
              </Button>

              <Button onClick={handleDocxDownload} className="bg-sky-600 hover:bg-sky-700 text-white">
                <FileText className="h-4 w-4 mr-2" />
                DOCX பதிவிறக்கு
              </Button>

              <Button onClick={handlePdfDownload} className="bg-sky-600 hover:bg-sky-700 text-white">
                <FileDown className="h-4 w-4 mr-2" />
                PDF பதிவிறக்கு
              </Button>

              <Button asChild className="bg-sky-600 hover:bg-sky-700 text-white">
                <Link href={`/document-details/sale-document/edit/${document.id}`}>
                  <Pencil className="h-4 w-4 mr-2" />
                  திருத்து
                </Link>
              </Button>
            </div>
          </div>

          <Card className="border-sky-200 p-6">
            <div className="document-content" dangerouslySetInnerHTML={{ __html: document.document_content }} />
          </Card>
        </div>
      </main>
      <footer className="bg-sky-100 border-t border-sky-200 py-4 text-center text-sky-700">
        <p>© 2025 தமிழ் ஆவண மேலாண்மை. அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.</p>
      </footer>
    </div>
  )
}
