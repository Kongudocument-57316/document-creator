import { getSupabaseServerClient } from "@/lib/supabase"
import { DocumentEditorWrapper } from "./document-editor-wrapper"
import { notFound } from "next/navigation"

interface PageProps {
  params: {
    id: string
  }
  searchParams: {
    documentId?: string
  }
}

export default async function EditDocumentPage({ params, searchParams }: PageProps) {
  const supabase = getSupabaseServerClient()
  const { id } = params
  const { documentId } = searchParams

  // Fetch the sale document data
  const { data: saleDocument, error } = await supabase.from("sale_documents").select("*").eq("id", id).single()

  if (error || !saleDocument) {
    notFound()
  }

  // Fetch the document content if documentId is provided
  let documentContent = ""
  if (documentId) {
    const { data: documentData, error: documentError } = await supabase
      .from("sale_deed_documents")
      .select("content")
      .eq("id", documentId)
      .single()

    if (!documentError && documentData) {
      documentContent = documentData.content
    }
  }

  // Fetch the form data
  const { data: formData, error: formError } = await supabase
    .from("sale_deeds")
    .select("*")
    .eq("id", saleDocument.sale_deed_id)
    .single()

  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-2xl font-bold text-purple-800 mb-6">ஆவணம் திருத்து</h1>
      <DocumentEditorWrapper
        saleDocumentId={id}
        documentId={documentId}
        initialContent={documentContent}
        formData={formData || {}}
      />
    </div>
  )
}
