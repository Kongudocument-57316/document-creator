"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { PlusCircle, Trash2 } from "lucide-react"
import { getSupabaseBrowserClient } from "@/lib/supabase"
import { toast } from "sonner"
import { FormError } from "@/components/ui/form-error"
import { isRequired, isValidDate, isNotFutureDate, errorMessages } from "@/lib/validation"

export default function PreviousDocumentForm({ data, sellers, updateData }) {
  const [previousDocuments, setPreviousDocuments] = useState(data || [])
  const [existingDocuments, setExistingDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [sellerDocumentMap, setSellerDocumentMap] = useState({})
  const [errors, setErrors] = useState([])
  const [touched, setTouched] = useState([])

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

  useEffect(() => {
    // Initialize errors and touched arrays
    setErrors(previousDocuments.map(() => ({})))
    setTouched(previousDocuments.map(() => ({})))
  }, [previousDocuments.length])

  const validateField = (index, field, value) => {
    switch (field) {
      case "documentNumber":
        return isRequired(value) ? "" : errorMessages.required
      case "registrationDate":
        if (!isRequired(value)) return errorMessages.required
        if (!isValidDate(value)) return errorMessages.date
        if (!isNotFutureDate(value)) return errorMessages.futureDate
        return ""
      case "sellerName":
        return isRequired(value) ? "" : errorMessages.required
      default:
        return ""
    }
  }

  const validateDocument = (document, index) => {
    // Skip validation for documents that are selected from existing documents
    if (document.selected) return true

    const documentErrors = {}
    let isValid = true

    // Validate required fields
    if (!isRequired(document.documentNumber)) {
      documentErrors.documentNumber = errorMessages.required
      isValid = false
    }

    if (!isRequired(document.registrationDate)) {
      documentErrors.registrationDate = errorMessages.required
      isValid = false
    } else if (!isValidDate(document.registrationDate)) {
      documentErrors.registrationDate = errorMessages.date
      isValid = false
    } else if (!isNotFutureDate(document.registrationDate)) {
      documentErrors.registrationDate = errorMessages.futureDate
      isValid = false
    }

    if (!isRequired(document.sellerName)) {
      documentErrors.sellerName = errorMessages.required
      isValid = false
    }

    // Update errors for this document
    const newErrors = [...errors]
    newErrors[index] = documentErrors
    setErrors(newErrors)

    return isValid
  }

  const validateAllDocuments = () => {
    // If no documents, it's valid
    if (previousDocuments.length === 0) return true

    // Mark all fields as touched for manually added documents
    const allTouched = previousDocuments.map((doc) => {
      if (doc.selected) return {}
      return {
        documentNumber: true,
        registrationDate: true,
        sellerName: true,
      }
    })
    setTouched(allTouched)

    // Validate all documents
    return previousDocuments.every((doc, index) => doc.selected || validateDocument(doc, index))
  }

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
    setErrors([...errors, {}])
    setTouched([...touched, {}])
  }

  const handleRemoveDocument = (index) => {
    const updatedDocuments = [...previousDocuments]
    updatedDocuments.splice(index, 1)
    setPreviousDocuments(updatedDocuments)

    const updatedErrors = [...errors]
    updatedErrors.splice(index, 1)
    setErrors(updatedErrors)

    const updatedTouched = [...touched]
    updatedTouched.splice(index, 1)
    setTouched(updatedTouched)
  }

  const handleChange = (index, field, value) => {
    const updatedDocuments = [...previousDocuments]
    updatedDocuments[index] = { ...updatedDocuments[index], [field]: value }
    setPreviousDocuments(updatedDocuments)

    // Mark field as touched
    const newTouched = [...touched]
    newTouched[index] = { ...newTouched[index], [field]: true }
    setTouched(newTouched)

    // Validate the field
    const error = validateField(index, field, value)
    const newErrors = [...errors]
    newErrors[index] = { ...newErrors[index], [field]: error }
    setErrors(newErrors)
  }

  const handleBlur = (index, field) => {
    // Mark field as touched
    const newTouched = [...touched]
    newTouched[index] = { ...newTouched[index], [field]: true }
    setTouched(newTouched)

    // Validate the field
    const error = validateField(index, field, previousDocuments[index][field])
    const newErrors = [...errors]
    newErrors[index] = { ...newErrors[index], [field]: error }
    setErrors(newErrors)
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

    // Clear errors for this document since it's selected from existing documents
    const newErrors = [...errors]
    newErrors[index] = {}
    setErrors(newErrors)
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

        // Add empty error and touched objects for the new document
        setErrors([...errors, {}])
        setTouched([...touched, {}])
      }
    } else {
      // Remove document if it exists
      updatedDocuments = updatedDocuments.filter((d) => d.id !== documentId)

      // Remove corresponding error and touched objects
      const newErrors = errors.filter((_, i) => previousDocuments[i]?.id !== documentId)
      const newTouched = touched.filter((_, i) => previousDocuments[i]?.id !== documentId)
      setErrors(newErrors)
      setTouched(newTouched)
    }

    setPreviousDocuments(updatedDocuments)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (validateAllDocuments()) {
      updateData(previousDocuments)
    } else {
      toast.error("படிவத்தில் பிழைகள் உள்ளன. சரிபார்த்து மீண்டும் முயற்சிக்கவும்.")
    }
  }

  if (loading) {
    return <div>தரவுகளை ஏற்றுகிறது...</div>
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
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
          .filter((doc) => !sellers.some((s) => s.id === doc.sellerId) && !doc.selected)
          .map((doc, index) => {
            const docIndex = previousDocuments.indexOf(doc)
            return (
              <div key={index} className="mb-4 p-4 border rounded-md bg-gray-50">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-medium">ஆவணம் {index + 1}</h4>
                  <Button type="button" variant="ghost" size="sm" onClick={() => handleRemoveDocument(docIndex)}>
                    <Trash2 className="h-4 w-4 mr-1" /> நீக்கு
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor={`documentNumber-${docIndex}`}
                      className={
                        errors[docIndex]?.documentNumber && touched[docIndex]?.documentNumber ? "text-red-500" : ""
                      }
                    >
                      ஆவண எண் <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id={`documentNumber-${docIndex}`}
                      value={doc.documentNumber}
                      onChange={(e) => handleChange(docIndex, "documentNumber", e.target.value)}
                      onBlur={() => handleBlur(docIndex, "documentNumber")}
                      className={
                        errors[docIndex]?.documentNumber && touched[docIndex]?.documentNumber ? "border-red-500" : ""
                      }
                      required
                    />
                    {touched[docIndex]?.documentNumber && <FormError message={errors[docIndex]?.documentNumber} />}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor={`registrationDate-${docIndex}`}
                      className={
                        errors[docIndex]?.registrationDate && touched[docIndex]?.registrationDate ? "text-red-500" : ""
                      }
                    >
                      பதிவு தேதி <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id={`registrationDate-${docIndex}`}
                      type="date"
                      value={doc.registrationDate}
                      onChange={(e) => handleChange(docIndex, "registrationDate", e.target.value)}
                      onBlur={() => handleBlur(docIndex, "registrationDate")}
                      className={
                        errors[docIndex]?.registrationDate && touched[docIndex]?.registrationDate
                          ? "border-red-500"
                          : ""
                      }
                      max={new Date().toISOString().split("T")[0]} // இன்றைய தேதி வரை மட்டும்
                      required
                    />
                    {touched[docIndex]?.registrationDate && <FormError message={errors[docIndex]?.registrationDate} />}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor={`sellerName-${docIndex}`}
                      className={errors[docIndex]?.sellerName && touched[docIndex]?.sellerName ? "text-red-500" : ""}
                    >
                      விற்பவர் பெயர் <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id={`sellerName-${docIndex}`}
                      value={doc.sellerName}
                      onChange={(e) => handleChange(docIndex, "sellerName", e.target.value)}
                      onBlur={() => handleBlur(docIndex, "sellerName")}
                      className={errors[docIndex]?.sellerName && touched[docIndex]?.sellerName ? "border-red-500" : ""}
                      required
                    />
                    {touched[docIndex]?.sellerName && <FormError message={errors[docIndex]?.sellerName} />}
                  </div>
                </div>
              </div>
            )
          })}

        <Button type="button" variant="outline" onClick={handleAddDocument} className="mt-2">
          <PlusCircle className="h-4 w-4 mr-1" /> மற்றொரு ஆவணத்தைச் சேர்க்க
        </Button>
      </div>

      <div className="mt-4 text-sm text-gray-500">
        <span className="text-red-500">*</span> குறிக்கப்பட்ட புலங்கள் கட்டாயமாக நிரப்பப்பட வேண்டும்
      </div>

      <Button type="submit" className="mt-4 bg-cyan-600 hover:bg-cyan-700 text-white">
        அடுத்த பக்கம்
      </Button>
    </form>
  )
}
