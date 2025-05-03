"use client"

import { useState, useEffect } from "react"
import { EnhancedMortgageLoanForm } from "../../create/enhanced-mortgage-loan-form"
import { DocumentLivePreview } from "../../create/document-live-preview"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Home, FileText, FileIcon as FilePdf, Save } from "lucide-react"
import { useRouter } from "next/navigation"
import { exportMortgageLoanToWord, exportMortgageLoanToPDF } from "../../create/export-utils"
import { useToast } from "@/hooks/use-toast"
import { fetchMortgageLoanDocument } from "../fetch-document"
import { updateMortgageLoanDocument } from "../update-document-action"
import type { MortgageLoanFormValues } from "../../create/enhanced-mortgage-loan-form"

interface EditMortgageLoanFormProps {
  documentId: string
}

export function EditMortgageLoanForm({ documentId }: EditMortgageLoanFormProps) {
  const [formData, setFormData] = useState<MortgageLoanFormValues | null>(null)
  const [originalData, setOriginalData] = useState<MortgageLoanFormValues | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showPdfPreview, setShowPdfPreview] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  // Fetch document data
  useEffect(() => {
    const loadDocument = async () => {
      setLoading(true)
      try {
        const data = await fetchMortgageLoanDocument(documentId)
        if (data) {
          setFormData(data)
          setOriginalData(data)
        } else {
          toast({
            title: "பிழை",
            description: "ஆவணத்தை பெறுவதில் பிழை ஏற்பட்டது",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error loading document:", error)
        toast({
          title: "பிழை",
          description: "ஆவணத்தை பெறுவதில் பிழை ஏற்பட்டது",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadDocument()
  }, [documentId, toast])

  const handleFormChange = (values: MortgageLoanFormValues) => {
    setFormData(values)
  }

  const handleSave = async () => {
    if (!formData) return

    setSaving(true)
    try {
      const result = await updateMortgageLoanDocument(Number(documentId), formData)

      if (result.success) {
        toast({
          title: "வெற்றி",
          description: "அடமான கடன் ஆவணம் வெற்றிகரமாக புதுப்பிக்கப்பட்டது",
        })
        // Update original data to reflect saved changes
        setOriginalData(formData)
      } else {
        toast({
          title: "பிழை",
          description: result.error || "ஆவணத்தை புதுப்பிப்பதில் பிழை ஏற்பட்டது",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      console.error("Save error:", error)
      toast({
        title: "பிழை",
        description: error.message || "ஆவணத்தை புதுப்பிப்பதில் பிழை ஏற்பட்டது",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleExportToWord = async () => {
    if (!formData) {
      toast({
        title: "தகவல் தேவை",
        description: "ஆவணத்தை ஏற்றுமதி செய்ய முடியவில்லை",
        variant: "destructive",
      })
      return
    }

    try {
      const result = await exportMortgageLoanToWord(formData)
      if (result) {
        toast({
          title: "வெற்றி",
          description: "அடமான கடன் ஆவணம் Word கோப்பாக ஏற்றுமதி செய்யப்பட்டது",
        })
      } else {
        toast({
          title: "பிழை",
          description: "ஆவணத்தை ஏற்றுமதி செய்வதில் பிழை ஏற்பட்டது",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Export error:", error)
      toast({
        title: "பிழை",
        description: "ஆவணத்தை ஏற்றுமதி செய்வதில் பிழை ஏற்பட்டது",
        variant: "destructive",
      })
    }
  }

  const handleExportToPDF = async () => {
    if (!formData) {
      toast({
        title: "தகவல் தேவை",
        description: "ஆவணத்தை ஏற்றுமதி செய்ய முடியவில்லை",
        variant: "destructive",
      })
      return
    }

    // Show PDF preview first (this is hidden but needed for html2canvas)
    setShowPdfPreview(true)

    // Wait for the PDF preview to render
    setTimeout(async () => {
      try {
        const result = await exportMortgageLoanToPDF(formData)
        if (result) {
          toast({
            title: "வெற்றி",
            description: "அடமான கடன் ஆவணம் PDF கோப்பாக ஏற்றுமதி செய்யப்பட்டது",
          })
        } else {
          toast({
            title: "பிழை",
            description: "ஆவணத்தை ஏற்றுமதி செய்வதில் பிழை ஏற்பட்டது",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Export error:", error)
        toast({
          title: "பிழை",
          description: "ஆவணத்தை ஏற்றுமதி செய்வதில் பிழை ஏற்பட்டது",
          variant: "destructive",
        })
      } finally {
        // Hide PDF preview after export
        setShowPdfPreview(false)
      }
    }, 500)
  }

  const handleViewDocument = () => {
    router.push(`/document-details/mortgage-loan/view/${documentId}`)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-700"></div>
      </div>
    )
  }

  if (!formData) {
    return (
      <div className="text-center p-8">
        <p className="text-red-500">ஆவணத்தை பெற முடியவில்லை. மீண்டும் முயற்சிக்கவும்.</p>
        <Button onClick={() => router.back()} className="mt-4">
          திரும்பிச் செல்
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => router.back()} className="flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            திரும்பிச் செல்
          </Button>

          <Button variant="outline" size="sm" onClick={() => router.push("/")} className="flex items-center gap-1">
            <Home className="h-4 w-4" />
            முகப்பு
          </Button>
        </div>
        <h1 className="text-2xl font-bold">அடமான கடன் ஆவணம் திருத்து</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <EnhancedMortgageLoanForm initialValues={formData} onFormChange={handleFormChange} isEditMode={true} />

          <div className="flex justify-between">
            <Button onClick={handleViewDocument} variant="outline" className="flex items-center gap-2">
              ஆவணத்தைக் காண்
            </Button>

            <Button
              onClick={handleSave}
              disabled={saving || JSON.stringify(formData) === JSON.stringify(originalData)}
              className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  சேமிக்கிறது...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  மாற்றங்களை சேமி
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="sticky top-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">ஆவண முன்னோட்டம���</h2>
            <div className="flex gap-2">
              <Button onClick={handleExportToWord} variant="outline" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Word
              </Button>
              <Button onClick={handleExportToPDF} variant="outline" className="flex items-center gap-2">
                <FilePdf className="h-4 w-4" />
                PDF
              </Button>
            </div>
          </div>
          <DocumentLivePreview formData={formData} />
        </div>
      </div>
    </div>
  )
}
