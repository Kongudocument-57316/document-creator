"use client"

import { useState, useEffect } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Pencil, Printer, Download } from "lucide-react"
import { useRouter } from "next/navigation"

interface SaleDocument {
  id: number
  document_number: string
  document_date: string
  book_number?: string
  document_type?: string
  submission_type?: string
  typist_name?: string
  office_name?: string
  registration_district?: string
  sub_registrar_office?: string
  property_name?: string
  seller_name?: string
  buyer_name?: string
  sale_amount: number
  payment_method?: string
  land_type?: string
  document_file_path?: string
  remarks?: string
}

export function SaleDocumentView({ id }: { id: string }) {
  const [document, setDocument] = useState<SaleDocument | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = getSupabaseBrowserClient()

  useEffect(() => {
    async function fetchDocument() {
      try {
        const { data, error } = await supabase
          .from("sale_documents")
          .select(`
            *,
            book_numbers:book_number_id (number),
            document_types:document_type_id (name),
            submission_types:submission_type_id (name),
            typists:typist_id (name),
            offices:office_id (name),
            registration_districts:registration_district_id (name),
            sub_registrar_offices:sub_registrar_office_id (name),
            properties:property_id (property_name),
            sellers:seller_id (name),
            buyers:buyer_id (name),
            payment_methods:payment_method_id (name),
            land_types:land_type_id (name)
          `)
          .eq("id", id)
          .single()

        if (error) throw error

        if (data) {
          setDocument({
            id: data.id,
            document_number: data.document_number,
            document_date: data.document_date,
            book_number: data.book_numbers?.number,
            document_type: data.document_types?.name,
            submission_type: data.submission_types?.name,
            typist_name: data.typists?.name,
            office_name: data.offices?.name,
            registration_district: data.registration_districts?.name,
            sub_registrar_office: data.sub_registrar_offices?.name,
            property_name: data.properties?.property_name,
            seller_name: data.sellers?.name,
            buyer_name: data.buyers?.name,
            sale_amount: data.sale_amount,
            payment_method: data.payment_methods?.name,
            land_type: data.land_types?.name,
            document_file_path: data.document_file_path,
            remarks: data.remarks,
          })
        }
      } catch (error: any) {
        toast.error("ஆவண விவரங்களை பெறுவதில் பிழை: " + error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchDocument()
  }, [id, supabase])

  const handleEdit = () => {
    router.push(`/document-details/sale-document/edit/${id}`)
  }

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = async () => {
    if (!document?.document_file_path) {
      toast.error("ஆவண கோப்பு இல்லை")
      return
    }

    try {
      const { data, error } = await supabase.storage.from("document_files").download(document.document_file_path)

      if (error) throw error

      // Create a download link
      const url = URL.createObjectURL(data)
      const a = document.createElement("a")
      a.href = url
      a.download = document.document_file_path.split("/").pop() || "document"
      document.body.appendChild(a)
      a.click()
      URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error: any) {
      toast.error("கோப்பை பதிவிறக்குவதில் பிழை: " + error.message)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("ta-IN")
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ta-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount)
  }

  if (loading) {
    return <div className="text-center p-4">ஏற்றுகிறது...</div>
  }

  if (!document) {
    return <div className="text-center p-4">ஆவணம் கிடைக்கவில்லை</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end gap-2 print:hidden">
        <Button onClick={handleEdit} className="bg-teal-600 hover:bg-teal-700">
          <Pencil className="h-4 w-4 mr-2" />
          திருத்து
        </Button>
        <Button onClick={handlePrint} variant="outline" className="border-teal-300 text-teal-700 hover:bg-teal-100">
          <Printer className="h-4 w-4 mr-2" />
          அச்சிடு
        </Button>
        {document.document_file_path && (
          <Button
            onClick={handleDownload}
            variant="outline"
            className="border-teal-300 text-teal-700 hover:bg-teal-100"
          >
            <Download className="h-4 w-4 mr-2" />
            பதிவிறக்கு
          </Button>
        )}
      </div>

      <Card className="border-teal-200">
        <CardHeader className="bg-teal-50 rounded-t-lg">
          <CardTitle className="text-teal-700">அடிப்படை விவரங்கள்</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">ஆவண எண்</h3>
            <p className="mt-1 text-lg">{document.document_number}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">ஆவண தேதி</h3>
            <p className="mt-1 text-lg">{formatDate(document.document_date)}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">புத்தக எண்</h3>
            <p className="mt-1 text-lg">{document.book_number || "-"}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">ஆவண வகை</h3>
            <p className="mt-1 text-lg">{document.document_type || "-"}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">ஒப்படைப்பு வகை</h3>
            <p className="mt-1 text-lg">{document.submission_type || "-"}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-teal-200">
        <CardHeader className="bg-teal-50 rounded-t-lg">
          <CardTitle className="text-teal-700">அலுவலக விவரங்கள்</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">தட்டச்சாளர்</h3>
            <p className="mt-1 text-lg">{document.typist_name || "-"}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">அலுவலகம்</h3>
            <p className="mt-1 text-lg">{document.office_name || "-"}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">பதிவு மாவட்டம்</h3>
            <p className="mt-1 text-lg">{document.registration_district || "-"}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">சார்பதிவாளர் அலுவலகம்</h3>
            <p className="mt-1 text-lg">{document.sub_registrar_office || "-"}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-teal-200">
        <CardHeader className="bg-teal-50 rounded-t-lg">
          <CardTitle className="text-teal-700">சொத்து மற்றும் நபர் விவரங்கள்</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">சொத்து விவரம்</h3>
            <p className="mt-1 text-lg">{document.property_name || "-"}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">நில வகை</h3>
            <p className="mt-1 text-lg">{document.land_type || "-"}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">விற்பனையாளர்</h3>
            <p className="mt-1 text-lg">{document.seller_name || "-"}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">வாங்குபவர்</h3>
            <p className="mt-1 text-lg">{document.buyer_name || "-"}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-teal-200">
        <CardHeader className="bg-teal-50 rounded-t-lg">
          <CardTitle className="text-teal-700">பணம் விவரங்கள்</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">விற்பனை தொகை</h3>
            <p className="mt-1 text-lg">{formatCurrency(document.sale_amount)}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">பணம் செலுத்தும் முறை</h3>
            <p className="mt-1 text-lg">{document.payment_method || "-"}</p>
          </div>
        </CardContent>
      </Card>

      {document.remarks && (
        <Card className="border-teal-200">
          <CardHeader className="bg-teal-50 rounded-t-lg">
            <CardTitle className="text-teal-700">குறிப்புகள்</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <p className="whitespace-pre-line">{document.remarks}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
