"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getSupabaseBrowserClient } from "@/lib/supabase"

interface DocumentDetailDialogProps {
  isOpen: boolean
  onClose: () => void
  document: any
  onSave?: (updatedDoc: any) => void
  readOnly?: boolean
  title?: string
}

export function DocumentDetailDialog({
  isOpen,
  onClose,
  document,
  onSave,
  readOnly = false,
  title = "ஆவண விவரங்கள்",
}: DocumentDetailDialogProps) {
  const [formData, setFormData] = useState(document || {})
  const [subRegistrarOffices, setSubRegistrarOffices] = useState([])
  const [bookNumbers, setBookNumbers] = useState([])
  const [documentTypes, setDocumentTypes] = useState([])
  const [submissionTypes, setSubmissionTypes] = useState([])
  const [loading, setLoading] = useState(true)

  const supabase = getSupabaseBrowserClient()

  useEffect(() => {
    if (isOpen) {
      setFormData(document || {})
      fetchReferenceData()
    }
  }, [isOpen, document])

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

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSave = () => {
    if (onSave) {
      onSave(formData)
    }
    onClose()
  }

  // Function to get name by ID from a reference list
  const getNameById = (list, id) => {
    const item = list.find((item) => item.id.toString() === id?.toString())
    return item ? item.name : ""
  }

  // Function to get book number by ID
  const getBookNumberById = (id) => {
    const book = bookNumbers.find((book) => book.id.toString() === id?.toString())
    return book ? book.number : ""
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-purple-800">{title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {readOnly ? (
            // Read-only view
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="font-medium">முந்தைய ஆவண தேதி</Label>
                  <p className="mt-1 p-2 bg-gray-50 rounded-md">{formData.previousDocDate || "-"}</p>
                </div>
                <div>
                  <Label className="font-medium">சார்பதிவாளர் அலுவலகம்</Label>
                  <p className="mt-1 p-2 bg-gray-50 rounded-md">
                    {getNameById(subRegistrarOffices, formData.subRegistrarOfficeId) || "-"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="font-medium">புத்தகம் எண்</Label>
                  <p className="mt-1 p-2 bg-gray-50 rounded-md">{getBookNumberById(formData.bookNumberId) || "-"}</p>
                </div>
                <div>
                  <Label className="font-medium">ஆவண வருடம்</Label>
                  <p className="mt-1 p-2 bg-gray-50 rounded-md">{formData.documentYear || "-"}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="font-medium">ஆவண எண்</Label>
                  <p className="mt-1 p-2 bg-gray-50 rounded-md">{formData.documentNumber || "-"}</p>
                </div>
                <div>
                  <Label className="font-medium">ஆவண வகை</Label>
                  <p className="mt-1 p-2 bg-gray-50 rounded-md">
                    {getNameById(documentTypes, formData.documentTypeId) || "-"}
                  </p>
                </div>
              </div>

              <div>
                <Label className="font-medium">ஆவணம் ஒப்படைப்பு வகை</Label>
                <p className="mt-1 p-2 bg-gray-50 rounded-md">
                  {getNameById(submissionTypes, formData.submissionTypeId) || "-"}
                </p>
              </div>
            </div>
          ) : (
            // Editable form
            <div className="space-y-4">
              <div>
                <Label htmlFor="previous-doc-date">முந்தைய ஆவண தேதி (Previous Document Date)</Label>
                <Input
                  id="previous-doc-date"
                  placeholder="DD/MM/YYYY"
                  value={formData.previousDocDate || ""}
                  onChange={(e) => handleChange("previousDocDate", e.target.value)}
                  className="mt-1 border-purple-200 focus-visible:ring-purple-400"
                />
                <p className="text-xs text-gray-500 mt-1">தேதியை DD/MM/YYYY வடிவத்தில் உள்ளிடவும்</p>
              </div>

              <div>
                <Label htmlFor="sub-registrar-office">சார்பதிவாளர் அலுவலகம் (Sub Register Office)</Label>
                <Select
                  value={formData.subRegistrarOfficeId?.toString() || ""}
                  onValueChange={(value) => handleChange("subRegistrarOfficeId", value)}
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
                  value={formData.bookNumberId?.toString() || ""}
                  onValueChange={(value) => handleChange("bookNumberId", value)}
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
                    value={formData.documentYear || ""}
                    onChange={(e) => handleChange("documentYear", e.target.value)}
                    className="mt-1 border-purple-200 focus-visible:ring-purple-400"
                  />
                </div>

                <div>
                  <Label htmlFor="document-number">ஆவண எண் (Document No)</Label>
                  <Input
                    id="document-number"
                    placeholder="ஆவண எண்ணை உள்ளிடவும்"
                    value={formData.documentNumber || ""}
                    onChange={(e) => handleChange("documentNumber", e.target.value)}
                    className="mt-1 border-purple-200 focus-visible:ring-purple-400"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="document-type">ஆவண வகை (Document Type)</Label>
                <Select
                  value={formData.documentTypeId?.toString() || ""}
                  onValueChange={(value) => handleChange("documentTypeId", value)}
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
                  value={formData.submissionTypeId?.toString() || ""}
                  onValueChange={(value) => handleChange("submissionTypeId", value)}
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
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {readOnly ? "மூடு" : "ரத்து செய்"}
          </Button>
          {!readOnly && (
            <Button onClick={handleSave} className="bg-purple-600 hover:bg-purple-700">
              சேமி
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
