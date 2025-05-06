"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { PlusCircle, Trash2 } from "lucide-react"
import { getSupabaseBrowserClient } from "@/lib/supabase"
import { toast } from "sonner"

export default function PreviousDocumentForm({ data, sellers, updateData }) {
  const [previousDocuments, setPreviousDocuments] = useState(data || [])
  const [existingDocuments, setExistingDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [sellerDocumentMap, setSellerDocumentMap] = useState({})

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const supabase = getSupabaseBrowserClient()
        const { data: documentsData, error } = await supabase.from("sale_documents").select(`
            id, 
            document_number, 
            registration_date,
            seller_id,
            buyer_id,
            users!sale_documents_seller_id_fkey(id, name)
          `)

        if (error) {
          throw error
        }

        setExistingDocuments(documentsData || [])

        // Create a map of seller IDs to their previous documents
        const sellerMap = {}
        if (documentsData) {
          documentsData.forEach((doc) => {
            if (doc.buyer_id) {
              if (!sellerMap[doc.buyer_id]) {
                sellerMap[doc.buyer_id] = []
              }
              sellerMap[doc.buyer_id].push(doc)
            }
          })
        }

        setSellerDocumentMap(sellerMap)
      } catch (error) {
        console.error("Error fetching documents:", error)
        toast.error("ஆவணங்களை பெறுவதில் பிழை ஏற்பட்டது")
      } finally {
        setLoading(false)
      }
    }

    fetchDocuments()
  }, [])

  const handleAddDocument = () => {
    setPreviousDocuments([
      ...previousDocuments,
      {
        id: "",
        documentNumber: "",
        registrationDate: "",
        sellerId: "",
        sellerName: "",
        selected: false,
      },
    ])
  }

  const handleRemoveDocument = (index) => {
    const updatedDocuments = [...previousDocuments]
    updatedDocuments.splice(index, 1)
    setPreviousDocuments(updatedDocuments)
  }

  const handleChange = (index, field, value) => {
    const updatedDocuments = [...previousDocuments]
    updatedDocuments[index] = { ...updatedDocuments[index], [field]: value }
    setPreviousDocuments(updatedDocuments)
  }

  const handleSelectDocument = (index, documentId) => {
    const document = existingDocuments.find((d) => d.id.toString() === documentId)
    if (!document) return

    const updatedDocuments = [...previousDocuments]
    updatedDocuments[index] = {
      id: document.id.toString(),
      documentNumber: document.document_number,
      registrationDate: document.registration_date,
      sellerId: document.seller_id,
      sellerName: document.users?.name || "",
      selected: true,
    }

    setPreviousDocuments(updatedDocuments)
  }

  const handleToggleDocument = (sellerId, documentId, isChecked) => {
    const document = existingDocuments.find((d) => d.id.toString() === documentId)
    if (!document) return

    let updatedDocuments = [...previousDocuments]

    if (isChecked) {
      // Add document if it doesn't exist
      const exists = updatedDocuments.some((d) => d.id === documentId)
      if (!exists) {
        updatedDocuments.push({
          id: document.id.toString(),
          documentNumber: document.document_number,
          registrationDate: document.registration_date,
          sellerId: document.seller_id,
          sellerName: document.users?.name || "",
          selected: true,
        })
      }
    } else {
      // Remove document if it exists
      updatedDocuments = updatedDocuments.filter((d) => d.id !== documentId)
    }

    setPreviousDocuments(updatedDocuments)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    updateData(previousDocuments)
  }

  if (loading) {
    return <div>தரவுகளை ஏற்றுகிறது...</div>
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-6">
        <h3 className="text-md font-medium mb-4">விற்பவர்களின் முந்தைய ஆவணங்கள்</h3>

        {sellers.map((seller) => {
          const sellerDocuments = sellerDocumentMap[seller.id] || []

          if (sellerDocuments.length === 0) return null

          return (
            <div key={seller.id} className="mb-4 p-4 border rounded-md bg-gray-50">
              <h4 className="font-medium mb-2">{seller.name}</h4>

              <div className="space-y-2">
                {sellerDocuments.map((doc) => (
                  <div key={doc.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`doc-${doc.id}`}
                      checked={previousDocuments.some((d) => d.id === doc.id.toString())}
                      onCheckedChange={(checked) => handleToggleDocument(seller.id, doc.id.toString(), checked)}
                    />
                    <Label htmlFor={`doc-${doc.id}`} className="cursor-pointer">
                      {doc.document_number} - {new Date(doc.registration_date).toLocaleDateString("ta-IN")}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      <div className="mb-6">
        <h3 className="text-md font-medium mb-4">மற்ற முந்தைய ஆவணங்கள்</h3>

        {previousDocuments
          .filter((doc) => !sellers.some((s) => s.id === doc.sellerId))
          .map((doc, index) => (
            <div key={index} className="mb-4 p-4 border rounded-md bg-gray-50">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium">ஆவணம் {index + 1}</h4>
                <Button type="button" variant="ghost" size="sm" onClick={() => handleRemoveDocument(index)}>
                  <Trash2 className="h-4 w-4 mr-1" /> நீக்கு
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`documentNumber-${index}`}>ஆவண எண்</Label>
                  <Input
                    id={`documentNumber-${index}`}
                    value={doc.documentNumber}
                    onChange={(e) => handleChange(index, "documentNumber", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`registrationDate-${index}`}>பதிவு தேதி</Label>
                  <Input
                    id={`registrationDate-${index}`}
                    type="date"
                    value={doc.registrationDate}
                    onChange={(e) => handleChange(index, "registrationDate", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`sellerName-${index}`}>விற்பவர் பெயர்</Label>
                  <Input
                    id={`sellerName-${index}`}
                    value={doc.sellerName}
                    onChange={(e) => handleChange(index, "sellerName", e.target.value)}
                  />
                </div>
              </div>
            </div>
          ))}

        <Button type="button" variant="outline" onClick={handleAddDocument} className="mt-2">
          <PlusCircle className="h-4 w-4 mr-1" /> மற்றொரு ஆவணத்தைச் சேர்க்க
        </Button>
      </div>

      <Button type="submit" className="mt-4 bg-cyan-600 hover:bg-cyan-700 text-white">
        அடுத்த பக்கம்
      </Button>
    </form>
  )
}
