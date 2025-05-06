"use client"

import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getSupabaseBrowserClient } from "@/lib/supabase"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Plus, Eye, Pencil, Trash2, Users } from "lucide-react"
import { DocumentDetailDialog } from "../components/document-detail-dialog"
import { DeleteConfirmationDialog } from "../components/delete-confirmation-dialog"
import { v4 as uuidv4 } from "uuid"

interface SubRegistrarOffice {
  id: number
  name: string
}

interface BookNumber {
  id: number
  number: string
}

interface DocumentType {
  id: number
  name: string
}

interface SubmissionType {
  id: number
  name: string
}

interface Seller {
  id: any
  name: string
  [key: string]: any
}

interface PreviousDocument {
  id: string
  sellerId?: string
  sellerIds?: string[]
  sellerName?: string
  previousDocDate: string
  subRegistrarOfficeId: string
  bookNumberId: string
  documentYear: string
  documentNumber: string
  documentTypeId: string
  submissionTypeId: string
}

interface PreviousDocTabProps {
  data: any
  updateData: (data: any) => void
  sellers?: Seller[]
}

export function PreviousDocTab({ data, updateData, sellers = [] }: PreviousDocTabProps) {
  const [documentMode, setDocumentMode] = useState<string>(data.documentMode || "singleSellerSingleDoc")
  const [subRegistrarOffices, setSubRegistrarOffices] = useState<SubRegistrarOffice[]>([])
  const [bookNumbers, setBookNumbers] = useState<BookNumber[]>([])
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([])
  const [submissionTypes, setSubmissionTypes] = useState<SubmissionType[]>([])
  const [loading, setLoading] = useState(true)

  // Dialog states
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<PreviousDocument | null>(null)
  const [selectedSellerIndex, setSelectedSellerIndex] = useState<number | null>(null)

  const [formValues, setFormValues] = useState({
    documentMode: data.documentMode || "singleSellerSingleDoc",
    commonDocument: data.commonDocument || {
      id: uuidv4(),
      previousDocDate: "",
      subRegistrarOfficeId: "",
      bookNumberId: "",
      documentYear: "",
      documentNumber: "",
      documentTypeId: "",
      submissionTypeId: "",
    },
    sellerDocuments: data.sellerDocuments || [],
    additionalDocuments: data.additionalDocuments || [],
  })

  const supabase = getSupabaseBrowserClient()

  // Initialize or update seller documents when sellers change
  useEffect(() => {
    if (sellers && sellers.length > 0) {
      // Create a map of existing seller documents by seller ID
      const existingDocsMap = new Map()
      if (formValues.sellerDocuments && formValues.sellerDocuments.length > 0) {
        formValues.sellerDocuments.forEach((doc) => {
          if (doc.sellerId) {
            existingDocsMap.set(doc.sellerId, doc)
          }
        })
      }

      // Create or update seller documents
      const updatedSellerDocs = sellers.map((seller) => {
        const existingDoc = existingDocsMap.get(seller.id)
        if (existingDoc) {
          return existingDoc
        } else {
          return {
            id: uuidv4(),
            sellerId: seller.id,
            sellerName: seller.name,
            previousDocDate: "",
            subRegistrarOfficeId: "",
            bookNumberId: "",
            documentYear: "",
            documentNumber: "",
            documentTypeId: "",
            submissionTypeId: "",
          }
        }
      })

      // Update form values with the new seller documents
      setFormValues((prev) => ({
        ...prev,
        sellerDocuments: updatedSellerDocs,
      }))

      // Update parent component's data
      updateData({
        ...formValues,
        sellerDocuments: updatedSellerDocs,
      })
    }
  }, [sellers])

  useEffect(() => {
    async function fetchReferenceData() {
      try {
        setLoading(true)

        // Fetch sub registrar offices
        const { data: officesData } = await supabase.from("sub_registrar_offices").select("id, name").order("name")
        if (officesData) setSubRegistrarOffices(officesData)

        // Fetch book numbers
        const { data: bookNumbersData } = await supabase.from("book_numbers").select("id, number").order("number")
        if (bookNumbersData) setBookNumbers(bookNumbersData)

        // Fetch document types
        const { data: documentTypesData } = await supabase.from("document_types").select("id, name").order("name")
        if (documentTypesData) setDocumentTypes(documentTypesData)

        // Fetch submission types
        const { data: submissionTypesData } = await supabase.from("submission_types").select("id, name").order("name")
        if (submissionTypesData) setSubmissionTypes(submissionTypesData)
      } catch (error) {
        console.error("Error fetching reference data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchReferenceData()
  }, [supabase])

  const handleDocumentModeChange = (value: string) => {
    setDocumentMode(value)
    setFormValues((prev) => ({
      ...prev,
      documentMode: value,
    }))
    updateData({
      ...formValues,
      documentMode: value,
    })
  }

  // Handle changes to the common document form
  const handleCommonDocChange = (field: string, value: string) => {
    const updatedCommonDoc = {
      ...formValues.commonDocument,
      [field]: value,
    }

    setFormValues((prev) => ({
      ...prev,
      commonDocument: updatedCommonDoc,
    }))

    updateData({
      ...formValues,
      commonDocument: updatedCommonDoc,
    })
  }

  // Handle changes to individual seller documents
  const handleSellerDocChange = (sellerIndex: number, field: string, value: string) => {
    const updatedSellerDocs = [...formValues.sellerDocuments]
    updatedSellerDocs[sellerIndex] = {
      ...updatedSellerDocs[sellerIndex],
      [field]: value,
    }

    setFormValues((prev) => ({
      ...prev,
      sellerDocuments: updatedSellerDocs,
    }))

    updateData({
      ...formValues,
      sellerDocuments: updatedSellerDocs,
    })
  }

  // Add a new document
  const handleAddDocument = () => {
    setSelectedDocument({
      id: uuidv4(),
      previousDocDate: "",
      subRegistrarOfficeId: "",
      bookNumberId: "",
      documentYear: "",
      documentNumber: "",
      documentTypeId: "",
      submissionTypeId: "",
    })
    setAddDialogOpen(true)
  }

  // Save a new document
  const handleSaveNewDocument = (newDoc: PreviousDocument) => {
    const updatedAdditionalDocs = [...(formValues.additionalDocuments || [])]
    updatedAdditionalDocs.push(newDoc)

    setFormValues((prev) => ({
      ...prev,
      additionalDocuments: updatedAdditionalDocs,
    }))

    updateData({
      ...formValues,
      additionalDocuments: updatedAdditionalDocs,
    })
  }

  // View document details
  const handleViewDocument = (document: PreviousDocument) => {
    setSelectedDocument(document)
    setViewDialogOpen(true)
  }

  // Edit document
  const handleEditDocument = (document: PreviousDocument, sellerIndex?: number) => {
    setSelectedDocument(document)
    if (sellerIndex !== undefined) {
      setSelectedSellerIndex(sellerIndex)
    } else {
      setSelectedSellerIndex(null)
    }
    setEditDialogOpen(true)
  }

  // Update document after edit
  const handleUpdateDocument = (updatedDoc: PreviousDocument) => {
    if (selectedSellerIndex !== null) {
      // Update seller document
      const updatedSellerDocs = [...formValues.sellerDocuments]
      updatedSellerDocs[selectedSellerIndex] = {
        ...updatedSellerDocs[selectedSellerIndex],
        ...updatedDoc,
      }

      setFormValues((prev) => ({
        ...prev,
        sellerDocuments: updatedSellerDocs,
      }))

      updateData({
        ...formValues,
        sellerDocuments: updatedSellerDocs,
      })
    } else if (updatedDoc.id === formValues.commonDocument.id) {
      // Update common document
      setFormValues((prev) => ({
        ...prev,
        commonDocument: updatedDoc,
      }))

      updateData({
        ...formValues,
        commonDocument: updatedDoc,
      })
    } else {
      // Update additional document
      const updatedAdditionalDocs = [...(formValues.additionalDocuments || [])]
      const docIndex = updatedAdditionalDocs.findIndex((doc) => doc.id === updatedDoc.id)

      if (docIndex !== -1) {
        updatedAdditionalDocs[docIndex] = updatedDoc

        setFormValues((prev) => ({
          ...prev,
          additionalDocuments: updatedAdditionalDocs,
        }))

        updateData({
          ...formValues,
          additionalDocuments: updatedAdditionalDocs,
        })
      }
    }
  }

  // Delete document
  const handleDeleteDocument = (document: PreviousDocument) => {
    setSelectedDocument(document)
    setDeleteDialogOpen(true)
  }

  // Confirm delete document
  const confirmDeleteDocument = () => {
    if (!selectedDocument) return

    // If it's an additional document
    if (formValues.additionalDocuments?.some((doc) => doc.id === selectedDocument.id)) {
      const updatedAdditionalDocs = formValues.additionalDocuments.filter((doc) => doc.id !== selectedDocument.id)

      setFormValues((prev) => ({
        ...prev,
        additionalDocuments: updatedAdditionalDocs,
      }))

      updateData({
        ...formValues,
        additionalDocuments: updatedAdditionalDocs,
      })
    }

    setDeleteDialogOpen(false)
    setSelectedDocument(null)
  }

  // Get seller names for a document
  const getSellerNamesForDocument = (document: PreviousDocument) => {
    if (!document.sellerIds || document.sellerIds.length === 0) {
      return document.sellerName || "-"
    }

    return document.sellerIds
      .map((id) => sellers.find((s) => s.id === id)?.name || "")
      .filter((name) => name)
      .join(", ")
  }

  // Render a common document form
  const renderCommonDocumentForm = () => {
    return (
      <div className="space-y-4">
        <div>
          <Label htmlFor="previous-doc-date">முந்தைய ஆவண தேதி (Previous Document Date)</Label>
          <Input
            id="previous-doc-date"
            placeholder="DD/MM/YYYY"
            value={formValues.commonDocument.previousDocDate}
            onChange={(e) => handleCommonDocChange("previousDocDate", e.target.value)}
            className="mt-1 border-purple-200 focus-visible:ring-purple-400"
          />
          <p className="text-xs text-gray-500 mt-1">தேதியை DD/MM/YYYY வடிவத்தில் உள்ளிடவும்</p>
        </div>

        <div>
          <Label htmlFor="sub-registrar-office">சார்பதிவாளர் அலுவலகம் (Sub Register Office)</Label>
          <Select
            value={formValues.commonDocument.subRegistrarOfficeId}
            onValueChange={(value) => handleCommonDocChange("subRegistrarOfficeId", value)}
          >
            <SelectTrigger className="mt-1 border-purple-200 focus-visible:ring-purple-400">
              <SelectValue placeholder="சார்பதிவாளர் அலுவலகத்தைத் தேர்ந்தெடுக்கவும்" />
            </SelectTrigger>
            <SelectContent>
              {subRegistrarOffices.map((office) => (
                <SelectItem key={office.id} value={office.id.toString()}>
                  {office.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="book-number">புத்தகம் எண் (Book No)</Label>
          <Select
            value={formValues.commonDocument.bookNumberId}
            onValueChange={(value) => handleCommonDocChange("bookNumberId", value)}
          >
            <SelectTrigger className="mt-1 border-purple-200 focus-visible:ring-purple-400">
              <SelectValue placeholder="புத்தக எண்ணைத் தேர்ந்தெடுக்கவும்" />
            </SelectTrigger>
            <SelectContent>
              {bookNumbers.map((book) => (
                <SelectItem key={book.id} value={book.id.toString()}>
                  {book.number}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="document-year">ஆவண வருடம் (Document Year)</Label>
            <Input
              id="document-year"
              placeholder="ஆவண ஆண்டை உள்ளிடவும்"
              value={formValues.commonDocument.documentYear}
              onChange={(e) => handleCommonDocChange("documentYear", e.target.value)}
              className="mt-1 border-purple-200 focus-visible:ring-purple-400"
            />
          </div>

          <div>
            <Label htmlFor="document-number">ஆவண எண் (Document No)</Label>
            <Input
              id="document-number"
              placeholder="ஆவண எண்ணை உள்ளிடவும்"
              value={formValues.commonDocument.documentNumber}
              onChange={(e) => handleCommonDocChange("documentNumber", e.target.value)}
              className="mt-1 border-purple-200 focus-visible:ring-purple-400"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="document-type">ஆவண வகை (Document Type)</Label>
          <Select
            value={formValues.commonDocument.documentTypeId}
            onValueChange={(value) => handleCommonDocChange("documentTypeId", value)}
          >
            <SelectTrigger className="mt-1 border-purple-200 focus-visible:ring-purple-400">
              <SelectValue placeholder="ஆவண வகையைத் தேர்ந்தெடுக்கவும்" />
            </SelectTrigger>
            <SelectContent>
              {documentTypes.map((type) => (
                <SelectItem key={type.id} value={type.id.toString()}>
                  {type.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="submission-type">ஆவணம் ஒப்படைப்பு வகை (Document Submission Type)</Label>
          <Select
            value={formValues.commonDocument.submissionTypeId}
            onValueChange={(value) => handleCommonDocChange("submissionTypeId", value)}
          >
            <SelectTrigger className="mt-1 border-purple-200 focus-visible:ring-purple-400">
              <SelectValue placeholder="ஆவணம் ஒப்படைப்பு வகையைத் தேர்ந்தெடுக்கவும்" />
            </SelectTrigger>
            <SelectContent>
              {submissionTypes.map((type) => (
                <SelectItem key={type.id} value={type.id.toString()}>
                  {type.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-end space-x-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleViewDocument(formValues.commonDocument)}
            className="border-purple-300 text-purple-700 hover:bg-purple-100"
          >
            <Eye className="h-4 w-4 mr-2" />
            காண்
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleEditDocument(formValues.commonDocument)}
            className="border-purple-300 text-purple-700 hover:bg-purple-100"
          >
            <Pencil className="h-4 w-4 mr-2" />
            திருத்து
          </Button>
        </div>
      </div>
    )
  }

  // Render an individual seller document form
  const renderSellerDocumentForm = (seller: any, index: number) => {
    return (
      <Card key={seller.sellerId} className="border-purple-200 mb-6">
        <CardHeader className="bg-purple-50 rounded-t-lg">
          <div className="flex justify-between items-center">
            <CardTitle className="text-purple-700 text-lg">{seller.sellerName || `விற்பனையாளர் ${index + 1}`}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor={`prev-doc-date-${index}`}>முந்தைய ஆவண தேதி (Previous Document Date)</Label>
              <Input
                id={`prev-doc-date-${index}`}
                placeholder="DD/MM/YYYY"
                value={seller.previousDocDate}
                onChange={(e) => handleSellerDocChange(index, "previousDocDate", e.target.value)}
                className="mt-1 border-purple-200 focus-visible:ring-purple-400"
              />
              <p className="text-xs text-gray-500 mt-1">தேதியை DD/MM/YYYY வடிவத்தில் உள்ளிடவும்</p>
            </div>

            <div>
              <Label htmlFor={`sub-registrar-${index}`}>சார்பதிவாளர் அலுவலகம் (Sub Register Office)</Label>
              <Select
                value={seller.subRegistrarOfficeId}
                onValueChange={(value) => handleSellerDocChange(index, "subRegistrarOfficeId", value)}
              >
                <SelectTrigger className="mt-1 border-purple-200 focus-visible:ring-purple-400">
                  <SelectValue placeholder="சார்பதிவாளர் அலுவலகத்தைத் தேர்ந்தெடுக்கவும்" />
                </SelectTrigger>
                <SelectContent>
                  {subRegistrarOffices.map((office) => (
                    <SelectItem key={office.id} value={office.id.toString()}>
                      {office.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor={`book-number-${index}`}>புத்தகம் எண் (Book No)</Label>
              <Select
                value={seller.bookNumberId}
                onValueChange={(value) => handleSellerDocChange(index, "bookNumberId", value)}
              >
                <SelectTrigger className="mt-1 border-purple-200 focus-visible:ring-purple-400">
                  <SelectValue placeholder="புத்தக எண்ணைத் தேர்ந்தெடுக்கவும்" />
                </SelectTrigger>
                <SelectContent>
                  {bookNumbers.map((book) => (
                    <SelectItem key={book.id} value={book.id.toString()}>
                      {book.number}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`doc-year-${index}`}>ஆவண வருடம் (Document Year)</Label>
                <Input
                  id={`doc-year-${index}`}
                  placeholder="ஆவண ஆண்டை உள்ளிடவும்"
                  value={seller.documentYear}
                  onChange={(e) => handleSellerDocChange(index, "documentYear", e.target.value)}
                  className="mt-1 border-purple-200 focus-visible:ring-purple-400"
                />
              </div>

              <div>
                <Label htmlFor={`doc-number-${index}`}>ஆவண எண் (Document No)</Label>
                <Input
                  id={`doc-number-${index}`}
                  placeholder="ஆவண எண்ணை உள்ளிடவும்"
                  value={seller.documentNumber}
                  onChange={(e) => handleSellerDocChange(index, "documentNumber", e.target.value)}
                  className="mt-1 border-purple-200 focus-visible:ring-purple-400"
                />
              </div>
            </div>

            <div>
              <Label htmlFor={`doc-type-${index}`}>ஆவண வகை (Document Type)</Label>
              <Select
                value={seller.documentTypeId}
                onValueChange={(value) => handleSellerDocChange(index, "documentTypeId", value)}
              >
                <SelectTrigger className="mt-1 border-purple-200 focus-visible:ring-purple-400">
                  <SelectValue placeholder="ஆவண வகையைத் தேர்ந்தெடுக்கவும்" />
                </SelectTrigger>
                <SelectContent>
                  {documentTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id.toString()}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor={`submission-type-${index}`}>ஆவணம் ஒப்படைப்பு வகை (Document Submission Type)</Label>
              <Select
                value={seller.submissionTypeId}
                onValueChange={(value) => handleSellerDocChange(index, "submissionTypeId", value)}
              >
                <SelectTrigger className="mt-1 border-purple-200 focus-visible:ring-purple-400">
                  <SelectValue placeholder="ஆவணம் ஒப்படைப்பு வகையைத் தேர்ந்தெடுக்கவும்" />
                </SelectTrigger>
                <SelectContent>
                  {submissionTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id.toString()}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2 bg-gray-50 rounded-b-lg">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleViewDocument(seller)}
            className="border-purple-300 text-purple-700 hover:bg-purple-100"
          >
            <Eye className="h-4 w-4 mr-2" />
            காண்
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleEditDocument(seller, index)}
            className="border-purple-300 text-purple-700 hover:bg-purple-100"
          >
            <Pencil className="h-4 w-4 mr-2" />
            திருத்து
          </Button>
        </CardFooter>
      </Card>
    )
  }

  // Render additional documents
  const renderAdditionalDocuments = () => {
    if (!formValues.additionalDocuments || formValues.additionalDocuments.length === 0) {
      return null
    }

    return (
      <div className="mt-6">
        <h4 className="text-lg font-semibold text-purple-700 mb-4">கூடுதல் ஆவணங்கள்</h4>
        {formValues.additionalDocuments.map((doc, index) => (
          <Card key={doc.id} className="border-purple-200 mb-4">
            <CardHeader className="bg-purple-50 rounded-t-lg py-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-purple-700 text-md">
                  {doc.sellerIds && doc.sellerIds.length > 0 ? (
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      கூடுதல் ஆவணம் {index + 1}
                    </div>
                  ) : (
                    `கூடுதல் ஆவணம் ${index + 1}`
                  )}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="py-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="font-medium">விற்பனையாளர்(கள்)</Label>
                  <p className="text-sm">{getSellerNamesForDocument(doc) || "-"}</p>
                </div>
                <div>
                  <Label className="font-medium">ஆவண தேதி</Label>
                  <p className="text-sm">{doc.previousDocDate || "-"}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div>
                  <Label className="font-medium">ஆவண எண்</Label>
                  <p className="text-sm">{doc.documentNumber || "-"}</p>
                </div>
                <div>
                  <Label className="font-medium">ஆவண வருடம்</Label>
                  <p className="text-sm">{doc.documentYear || "-"}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2 bg-gray-50 rounded-b-lg py-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleViewDocument(doc)}
                className="border-purple-300 text-purple-700 hover:bg-purple-100"
              >
                <Eye className="h-4 w-4 mr-2" />
                காண்
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEditDocument(doc)}
                className="border-purple-300 text-purple-700 hover:bg-purple-100"
              >
                <Pencil className="h-4 w-4 mr-2" />
                திருத்து
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDeleteDocument(doc)}
                className="border-red-300 text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                நீக்கு
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-purple-800">முந்தைய ஆவண விவரங்கள்</h3>

      <div className="mb-6 bg-purple-50 p-4 rounded-lg border border-purple-200">
        <div className="space-y-4">
          <Label className="text-lg font-medium text-purple-700">முந்தைய ஆவண விவரங்கள் வகை</Label>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="single-seller-single-doc"
              checked={documentMode === "singleSellerSingleDoc"}
              onCheckedChange={() => handleDocumentModeChange("singleSellerSingleDoc")}
            />
            <Label htmlFor="single-seller-single-doc" className="text-sm font-medium">
              ஒற்றை விற்பனையாளர் ஒற்றை ஆவணம் (Single Seller, Single Document)
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="single-seller-multi-doc"
              checked={documentMode === "singleSellerMultiDoc"}
              onCheckedChange={() => handleDocumentModeChange("singleSellerMultiDoc")}
            />
            <Label htmlFor="single-seller-multi-doc" className="text-sm font-medium">
              ஒற்றை விற்பனையாளர் பல ஆவணங்கள் (Single Seller, Multiple Documents)
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="multi-seller-single-doc"
              checked={documentMode === "multiSellerSingleDoc"}
              onCheckedChange={() => handleDocumentModeChange("multiSellerSingleDoc")}
            />
            <Label htmlFor="multi-seller-single-doc" className="text-sm font-medium">
              பல விற்பனையாளர்கள் ஒற்றை ஆவணம் (Multiple Sellers, Single Document)
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="multi-seller-multi-doc"
              checked={documentMode === "multiSellerMultiDoc"}
              onCheckedChange={() => handleDocumentModeChange("multiSellerMultiDoc")}
            />
            <Label htmlFor="multi-seller-multi-doc" className="text-sm font-medium">
              பல விற்பனையாளர்கள் பல ஆவணங்கள் (Multiple Sellers, Multiple Documents)
            </Label>
          </div>
        </div>
      </div>

      {/* Display the appropriate form based on the selected mode */}
      {(documentMode === "singleSellerSingleDoc" || documentMode === "multiSellerSingleDoc") && (
        <>
          <div className="mb-4 flex justify-between items-center">
            <div>
              <h4 className="text-lg font-semibold text-purple-700">பொதுவான ஆவண விவரங்கள்</h4>
              <p className="text-sm text-gray-600">
                {documentMode === "singleSellerSingleDoc"
                  ? "விற்பனையாளருக்கான ஆவண விவரங்கள்"
                  : "அனைத்து விற்பனையாளர்களுக்கான பொதுவான ஆவண விவரங்கள்"}
              </p>
            </div>
            <Button
              variant="outline"
              onClick={handleAddDocument}
              className="border-purple-300 text-purple-700 hover:bg-purple-100"
            >
              <Plus className="h-4 w-4 mr-2" />
              கூடுதல் ஆவணம் சேர்
            </Button>
          </div>
          {renderCommonDocumentForm()}
        </>
      )}

      {(documentMode === "singleSellerMultiDoc" || documentMode === "multiSellerMultiDoc") && (
        <>
          <div className="mb-4 flex justify-between items-center">
            <div>
              <h4 className="text-lg font-semibold text-purple-700">
                {documentMode === "singleSellerMultiDoc"
                  ? "விற்பனையாளருக்கான பல ஆவண விவரங்கள்"
                  : "ஒவ்வொரு விற்பனையாளருக்கான தனித்தனி ஆவண விவரங்கள்"}
              </h4>
            </div>
            <Button
              variant="outline"
              onClick={handleAddDocument}
              className="border-purple-300 text-purple-700 hover:bg-purple-100"
            >
              <Plus className="h-4 w-4 mr-2" />
              கூடுதல் ஆவணம் சேர்
            </Button>
          </div>

          {formValues.sellerDocuments && formValues.sellerDocuments.length > 0 ? (
            formValues.sellerDocuments.map((seller, index) => renderSellerDocumentForm(seller, index))
          ) : (
            <div className="text-center p-6 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-gray-500">
                விற்பனையாளர்கள் எதுவும் சேர்க்கப்படவில்லை. முதலில் "விற்பனையாளர் விவரங்கள்" பிரிவில் விற்பனையாளர்களைச் சேர்க்கவும்.
              </p>
            </div>
          )}
        </>
      )}

      {/* Render additional documents */}
      {renderAdditionalDocuments()}

      {/* View Document Dialog */}
      <DocumentDetailDialog
        isOpen={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        document={selectedDocument}
        readOnly={true}
        title="ஆவண விவரங்களைக் காண்"
        sellers={sellers}
        allowSellerSelection={true}
      />

      {/* Edit Document Dialog */}
      <DocumentDetailDialog
        isOpen={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        document={selectedDocument}
        onSave={handleUpdateDocument}
        title="ஆவண விவரங்களைத் திருத்து"
        sellers={sellers}
        allowSellerSelection={true}
      />

      {/* Add Document Dialog */}
      <DocumentDetailDialog
        isOpen={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        document={selectedDocument}
        onSave={handleSaveNewDocument}
        title="புதிய ஆவணம் சேர்"
        sellers={sellers}
        allowSellerSelection={true}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDeleteDocument}
      />
    </div>
  )
}
