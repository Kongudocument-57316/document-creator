"use client"

import { useState, useEffect } from "react"
import { DocumentEditor } from "../components/document-editor"
import { saveDocumentContent, getDocumentContent } from "../actions/document-actions"
import { Separator } from "@/components/ui/separator"
import { FileText } from "lucide-react"

interface DocumentEditorTabProps {
  data: any
  documentId?: string
  updateDocumentId: (id: string) => void
}

export function DocumentEditorTab({ data, documentId, updateDocumentId }: DocumentEditorTabProps) {
  const [initialContent, setInitialContent] = useState("")
  const [isLoading, setIsLoading] = useState(!!documentId)

  useEffect(() => {
    async function loadDocumentContent() {
      if (documentId) {
        setIsLoading(true)
        try {
          const result = await getDocumentContent(documentId)
          if (result.success) {
            setInitialContent(result.content)
          }
        } catch (error) {
          console.error("Error loading document content:", error)
        } finally {
          setIsLoading(false)
        }
      }
    }

    loadDocumentContent()
  }, [documentId])

  const handleSaveDocument = async (content: string) => {
    const result = await saveDocumentContent(documentId, content, data)
    if (result.success && result.id) {
      updateDocumentId(result.id)
    }
    return result
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="text-xl font-semibold text-purple-800 flex items-center">
          <FileText className="h-5 w-5 mr-2 text-purple-600" />
          ஆவண உருவாக்கி
        </h3>
        <Separator className="my-4 bg-purple-200" />

        <DocumentEditor
          initialContent={initialContent}
          documentId={documentId}
          formData={data}
          onSave={handleSaveDocument}
        />
      </div>
    </div>
  )
}
