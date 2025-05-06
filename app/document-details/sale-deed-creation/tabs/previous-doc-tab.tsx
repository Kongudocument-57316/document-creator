"use client"

import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getSupabaseBrowserClient } from "@/lib/supabase"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

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

interface PreviousDocTabProps {
  data: any
  updateData: (data: any) => void
}

export function PreviousDocTab({ data, updateData }: PreviousDocTabProps) {
  const [sellerType, setSellerType] = useState<string>(data.sellerType || "single")
  const [subRegistrarOffices, setSubRegistrarOffices] = useState<SubRegistrarOffice[]>([])
  const [bookNumbers, setBookNumbers] = useState<BookNumber[]>([])
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([])
  const [submissionTypes, setSubmissionTypes] = useState<SubmissionType[]>([])
  const [loading, setLoading] = useState(true)
  const [formValues, setFormValues] = useState({
    sellerType: data.sellerType || "single",
    previousDocDate: data.previousDocDate || "",
    subRegistrarOfficeId: data.subRegistrarOfficeId || "",
    bookNumberId: data.bookNumberId || "",
    documentYear: data.documentYear || "",
    documentNumber: data.documentNumber || "",
    documentTypeId: data.documentTypeId || "",
    submissionTypeId: data.submissionTypeId || "",
  })

  const supabase = getSupabaseBrowserClient()

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

  const handleChange = (field: string, value: string) => {
    const newValues = { ...formValues, [field]: value }
    setFormValues(newValues)
    updateData(newValues)
  }

  const handleSellerTypeChange = (value: string) => {
    setSellerType(value)
    handleChange("sellerType", value)
  }

  // Function to validate date format (DD/MM/YYYY)
  const validateDateFormat = (dateString: string) => {
    // Basic validation for DD/MM/YYYY format
    const regex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/
    return regex.test(dateString)
  }

  // Handle date input change with validation
  const handleDateChange = (value: string) => {
    // Allow empty value or partial input during typing
    if (value === "" || value.length < 10) {
      handleChange("previousDocDate", value)
      return
    }

    // Validate complete date
    if (validateDateFormat(value)) {
      handleChange("previousDocDate", value)
    } else {
      // You could show an error message here
      console.log("Invalid date format. Please use DD/MM/YYYY")
    }
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-purple-800">முந்தைய ஆவண விவரங்கள்</h3>

      <div className="mb-6">
        <RadioGroup value={sellerType} onValueChange={handleSellerTypeChange} className="flex flex-col space-y-2">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="single" id="prev-single-seller" />
            <Label htmlFor="prev-single-seller">ஒற்றை விற்பனையாளர் (Single Seller)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="multiple" id="prev-multiple-sellers" />
            <Label htmlFor="prev-multiple-sellers">பல விற்பனையாளர்கள் (Multiple Sellers)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="multiple-single-doc" id="prev-multiple-sellers-single-doc" />
            <Label htmlFor="prev-multiple-sellers-single-doc">
              பல விற்பனையாளர்கள் ஒரே ஆவணம் (Multiple Sellers Single Document)
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="previous-doc-date">முந்தைய ஆவண தேதி (Previous Document Date)</Label>
          <Input
            id="previous-doc-date"
            placeholder="DD/MM/YYYY"
            value={formValues.previousDocDate}
            onChange={(e) => handleDateChange(e.target.value)}
            className="mt-1 border-purple-200 focus-visible:ring-purple-400"
          />
          <p className="text-xs text-gray-500 mt-1">தேதியை DD/MM/YYYY வடிவத்தில் உள்ளிடவும்</p>
        </div>

        <div>
          <Label htmlFor="sub-registrar-office">சார்பதிவாளர் அலுவலகம் (Sub Register Office)</Label>
          <Select
            value={formValues.subRegistrarOfficeId}
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
          <Select value={formValues.bookNumberId} onValueChange={(value) => handleChange("bookNumberId", value)}>
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
              value={formValues.documentYear}
              onChange={(e) => handleChange("documentYear", e.target.value)}
              className="mt-1 border-purple-200 focus-visible:ring-purple-400"
            />
          </div>

          <div>
            <Label htmlFor="document-number">ஆவண எண் (Document No)</Label>
            <Input
              id="document-number"
              placeholder="ஆவண எண்ணை உள்ளிடவும்"
              value={formValues.documentNumber}
              onChange={(e) => handleChange("documentNumber", e.target.value)}
              className="mt-1 border-purple-200 focus-visible:ring-purple-400"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="document-type">ஆவண வகை (Document Type)</Label>
          <Select value={formValues.documentTypeId} onValueChange={(value) => handleChange("documentTypeId", value)}>
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
            value={formValues.submissionTypeId}
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
    </div>
  )
}
