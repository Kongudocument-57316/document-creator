"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Home, ArrowLeft, Save } from "lucide-react"
import { getSupabaseBrowserClient } from "@/lib/supabase"
import { CreateSaleDocumentForm } from "../../create/create-sale-document-form"
import { DocumentNameDialog } from "@/components/document-name-dialog"
import { updateDocument } from "../update-document-action"

// Format date from YYYY-MM-DD to DD/MM/YYYY for display
const formatDateForDisplay = (dateString: string | null) => {
  if (!dateString) return ""
  const date = new Date(dateString)
  return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(
    2,
    "0",
  )}/${date.getFullYear()}`
}

export default function EditSaleDocument() {
  const params = useParams()
  const router = useRouter()
  const documentId = params.id as string

  const [document, setDocument] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showNameDialog, setShowNameDialog] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState<any>(null)

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
          users:user_id (*)
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
          properties:property_id (*)
        `)
        .eq("sale_document_id", id)

      if (propertiesError) throw propertiesError

      // Format the document data for the form
      const formattedDocument = {
        ...data,
        document_date: formatDateForDisplay(data.document_date),
        previous_document_date: formatDateForDisplay(data.previous_document_date),
        buyers,
        sellers,
        witnesses,
        properties:
          properties?.map((p) => ({
            ...p.properties,
            property_details: p.property_details,
          })) || [],
      }

      setDocument(formattedDocument)
    } catch (error: any) {
      toast.error("ஆவணத்தை பெறுவதில் பிழை: " + error.message)
      router.push("/document-details/sale-document/search")
    } finally {
      setIsLoading(false)
    }
  }

  const handleFormDataChange = (data: any) => {
    // Use a ref to prevent unnecessary updates
    if (JSON.stringify(data) !== JSON.stringify(formData)) {
      setFormData(data)
    }
  }

  const handleSave = () => {
    if (!formData) {
      toast.error("சேமிக்க தேவையான தரவு கிடைக்கவில்லை")
      return
    }
    setShowNameDialog(true)
  }

  const handleSaveWithName = async (documentName: string) => {
    if (!formData || !document) return

    try {
      setIsSaving(true)

      // Prepare data for saving
      const documentData = {
        ...formData,
        id: document.id,
        documentName,
      }

      const result = await updateDocument(documentData)

      if (result.success) {
        toast.success("கிரைய ஆவணம் வெற்றிகரமாக புதுப்பிக்கப்பட்டது")
        setShowNameDialog(false)
        router.push(`/document-details/sale-document/view/${result.documentId}`)
      } else {
        toast.error("கிரைய ஆவணத்தை புதுப்பிப்பதில் பிழை: " + result.error)
      }
    } catch (error: any) {
      toast.error("கிரைய ஆவணத்தை புதுப்பிப்பதில் பிழை: " + error.message)
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-cyan-50">
        <Header className="bg-cyan-100 border-cyan-200" />
        <div className="flex-1 p-6 flex items-center justify-center">
          <p className="text-cyan-700">ஆவணத்தை ஏற்றுகிறது...</p>
        </div>
      </div>
    )
  }

  if (!document) {
    return (
      <div className="flex min-h-screen flex-col bg-cyan-50">
        <Header className="bg-cyan-100 border-cyan-200" />
        <div className="flex-1 p-6 flex items-center justify-center">
          <p className="text-red-700">ஆவண��் கிடைக்கவில்லை</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-cyan-50">
      <Header className="bg-cyan-100 border-cyan-200" />
      <div className="flex items-center justify-between p-4 bg-cyan-50">
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" className="border-cyan-300 text-cyan-700 hover:bg-cyan-100">
            <Link href={`/document-details/sale-document/view/${document.id}`}>
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
        <Button onClick={handleSave} className="bg-cyan-600 hover:bg-cyan-700 text-white">
          <Save className="h-4 w-4 mr-2" />
          மாற்றங்களை சேமி
        </Button>
      </div>
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-cyan-800">ஆவணத்தை திருத்து: {document.document_name}</h2>

          <CreateSaleDocumentForm initialData={document} isEditMode={true} onFormDataChange={handleFormDataChange} />
        </div>
      </main>
      <footer className="bg-cyan-100 border-t border-cyan-200 py-4 text-center text-cyan-700">
        <p>© 2025 தமிழ் ஆவண மேலாண்மை. அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.</p>
      </footer>

      {/* Document Name Dialog */}
      <DocumentNameDialog
        open={showNameDialog}
        onOpenChange={setShowNameDialog}
        onSave={handleSaveWithName}
        onCancel={() => setShowNameDialog(false)}
        initialName={document.document_name}
      />
    </div>
  )
}
