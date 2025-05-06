"use client"

import { useState } from "react"
import { DocumentEditor } from "@/app/document-details/sale-deed-creation/components/document-editor"
import { saveDocumentContent } from "@/app/document-details/sale-deed-creation/actions/document-actions"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface DocumentEditorWrapperProps {
  saleDocumentId: string
  documentId?: string
  initialContent: string
  formData: any
}

export function DocumentEditorWrapper({
  saleDocumentId,
  documentId,
  initialContent,
  formData,
}: DocumentEditorWrapperProps) {
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()

  const handleSaveDocument = async (content: string) => {
    setIsSaving(true)
    try {
      const result = await saveDocumentContent(documentId, content, formData)

      if (result.success) {
        // Update the sale_documents table with the document_id if it's a new document
        if (!documentId && result.id) {
          await updateSaleDocumentWithDocumentId(saleDocumentId, result.id)
        }

        toast.success("ஆவணம் வெற்றிகரமாக சேமிக்கப்பட்டது")
        return result
      } else {
        toast.error("ஆவணத்தை சேமிப்பதில் பிழை: " + result.error)
        return { success: false }
      }
    } catch (error) {
      console.error("Error saving document:", error)
      toast.error("ஆவணத்தை சேமிப்பதில் எதிர்பாராத பிழை")
      return { success: false }
    } finally {
      setIsSaving(false)
    }
  }

  const updateSaleDocumentWithDocumentId = async (saleDocumentId: string, documentId: string) => {
    try {
      const response = await fetch("/api/update-sale-document", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          saleDocumentId,
          documentId,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update sale document")
      }
    } catch (error) {
      console.error("Error updating sale document:", error)
    }
  }

  const handleGoBack = () => {
    router.back()
  }

  return (
    <div className="space-y-4">
      <Button variant="outline" onClick={handleGoBack} className="border-purple-300 hover:bg-purple-50">
        <ArrowLeft className="h-4 w-4 mr-2 text-purple-600" />
        பின் செல்
      </Button>

      <Card className="border-purple-200 shadow-md">
        <CardContent className="p-6">
          <DocumentEditor
            initialContent={initialContent}
            documentId={documentId}
            formData={formData}
            onSave={handleSaveDocument}
          />
        </CardContent>
      </Card>
    </div>
  )
}
