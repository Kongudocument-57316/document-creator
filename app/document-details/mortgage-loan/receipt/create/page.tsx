"use client"

import { Header } from "@/components/header"
import { CreateMortgageReceiptForm } from "./create-mortgage-receipt-form"
import { DocumentLivePreview } from "./document-live-preview"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { saveMortgageLoanReceipt } from "./save-receipt-action"
import { Eye, ArrowLeft, Home } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function CreateMortgageLoanReceiptPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [formData, setFormData] = useState({})
  const [isSaving, setIsSaving] = useState(false)

  const handleFormChange = (data: any) => {
    setFormData(data)
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)

      // Validate required fields
      if (!formData.receiptDate) {
        toast({
          title: "தேதி தேவை",
          description: "ரசீது தேதியை உள்ளிடவும்",
          variant: "destructive",
        })
        setIsSaving(false)
        return
      }

      if (!formData.buyerName) {
        toast({
          title: "பெயர் தேவை",
          description: "வாங்குபவர் பெயரை உள்ளிடவும்",
          variant: "destructive",
        })
        setIsSaving(false)
        return
      }

      if (!formData.sellerName) {
        toast({
          title: "பெயர் தேவை",
          description: "விற்பவர் பெயரை உள்ளிடவும்",
          variant: "destructive",
        })
        setIsSaving(false)
        return
      }

      if (!formData.loanAmount) {
        toast({
          title: "கடன் தொகை தேவை",
          description: "கடன் தொகையை உள்ளிடவும்",
          variant: "destructive",
        })
        setIsSaving(false)
        return
      }

      // Save the receipt
      const result = await saveMortgageLoanReceipt(formData)

      if (result.success) {
        toast({
          title: "ரசீது சேமிக்கப்பட்டது",
          description: "அடமான கடன் ரசீது வெற்றிகரமாக சேமிக்கப்பட்டது",
        })
        router.push("/document-details/mortgage-loan/receipt/search")
      } else {
        toast({
          title: "சேமிப்பதில் பிழை",
          description: result.error || "ரசீதை சேமிக்க முடியவில்லை. மீண்டும் முயற்சிக்கவும்.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error saving receipt:", error)
      toast({
        title: "சேமிப்பதில் பிழை",
        description: "ரசீதை சேமிக்க முடியவில்லை. மீண்டும் முயற்சிக்கவும்.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-blue-50">
      <Header />
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h1 className="text-3xl font-bold text-blue-800">புதிய அடமான கடன் ரசீது</h1>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="bg-white hover:bg-blue-100 flex items-center gap-2"
                onClick={() => router.back()}
              >
                <ArrowLeft className="h-4 w-4" />
                திரும்பிச் செல்
              </Button>
              <Button
                variant="outline"
                className="bg-white hover:bg-blue-100 flex items-center gap-2"
                onClick={() => router.push("/")}
              >
                <Home className="h-4 w-4" />
                முகப்பு
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Form Column */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <CreateMortgageReceiptForm onFormChange={handleFormChange} onSave={handleSave} />
              </div>
            </div>

            {/* Preview Column */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-blue-700 mb-4 flex items-center">
                  <Eye className="mr-2 h-5 w-5" />
                  ஆவண முன்னோட்டம்
                </h2>
                <div className="border border-blue-200 rounded-md p-1 bg-white">
                  <DocumentLivePreview formData={formData} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <footer className="bg-blue-100 border-t border-blue-200 py-4 text-center text-blue-600">
        <p>© 2025 தமிழ் ஆவண மேலாண்மை. அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.</p>
      </footer>
    </div>
  )
}
