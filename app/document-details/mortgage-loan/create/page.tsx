"use client"

import { useState, Suspense, useRef } from "react"
import { EnhancedMortgageLoanForm } from "./enhanced-mortgage-loan-form"
import { DocumentLivePreview } from "./document-live-preview"
import { DocumentPreviewForPDF } from "./document-preview-for-pdf"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Home, FileText, FileIcon as FilePdf } from "lucide-react"
import { useRouter } from "next/navigation"
import { exportMortgageLoanToWord, exportMortgageLoanToPDF } from "./export-utils"
import { useToast } from "@/hooks/use-toast"

export default function CreateMortgageLoanPage() {
  const [formData, setFormData] = useState(null)
  const [showPdfPreview, setShowPdfPreview] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const pdfPreviewRef = useRef(null)

  const handleFormChange = (values) => {
    // Only update state if values are different to prevent infinite loops
    setFormData(values)
  }

  const handleExportToWord = async () => {
    if (!formData) {
      toast({
        title: "தகவல் தேவை",
        description: "ஆவணத்தை ஏற்றுமதி செய்ய முன் படிவத்தை நிரப்பவும்",
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
        description: "ஆவணத்தை ஏற்றுமதி செய்ய முன் படிவத்தை நிரப்பவும்",
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

  return (
    <div className="container mx-auto py-6 bg-gradient-to-b from-cyan-50 to-white min-h-screen">
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
        <h1 className="text-2xl font-bold mb-6 text-cyan-800 border-b pb-2">புதிய அடமான கடன் ஆவணம் உருவாக்கு</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Suspense fallback={<div>Loading form...</div>}>
            <EnhancedMortgageLoanForm onFormChange={handleFormChange} />
          </Suspense>
        </div>

        <div className="sticky top-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">ஆவண முன்னோட்டம்</h2>
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
          {formData && <DocumentLivePreview formData={formData} />}
        </div>
      </div>

      {/* Hidden PDF preview for export */}
      <div className="hidden">
        {showPdfPreview && formData && (
          <div ref={pdfPreviewRef} id="pdf-container">
            <DocumentPreviewForPDF formData={formData} />
          </div>
        )}
      </div>
    </div>
  )
}
