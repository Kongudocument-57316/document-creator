"use client"

import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getSupabaseBrowserClient } from "@/lib/supabase"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
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

interface PreviousDocTabProps {
  data: any
  updateData: (data: any) => void
}

export function PreviousDocTab({ data, updateData }: PreviousDocTabProps) {
  const [sellerType, setSellerType] = useState<string>(data.sellerType || "single")
  const [subRegistrarOffices, setSubRegistrarOffices] = useState<SubRegistrarOffice[]>([])
  const [bookNumbers, setBookNumbers] = useState<BookNumber[]>([])
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([])
  const [loading, setLoading] = useState(true)
  const [formValues, setFormValues] = useState({
    sellerType: data.sellerType || "single",
    previousDocDate: data.previousDocDate ? new Date(data.previousDocDate) : null,
    subRegistrarOfficeId: data.subRegistrarOfficeId || "",
    bookNumberId: data.bookNumberId || "",
    documentYear: data.documentYear || "",
    documentNumber: data.documentNumber || "",
    documentTypeId: data.documentTypeId || "",
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
      } catch (error) {
        console.error("Error fetching reference data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchReferenceData()
  }, [supabase])

  const handleChange = (field: string, value: string | Date | null) => {
    const newValues = { ...formValues, [field]: value }
    setFormValues(newValues)
    updateData(newValues)
  }

  const handleSellerTypeChange = (value: string) => {
    setSellerType(value)
    handleChange("sellerType", value)
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
          <Label>முந்தைய ஆவண தேதி (Previous Document Date)</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full mt-1 pl-3 text-left font-normal border-purple-200 focus-visible:ring-purple-400",
                  !formValues.previousDocDate && "text-muted-foreground",
                )}
              >
                {formValues.previousDocDate ? (
                  format(formValues.previousDocDate, "PPP")
                ) : (
                  <span>தேதியை தேர்ந்தெடுக்கவும்</span>
                )}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formValues.previousDocDate || undefined}
                onSelect={(date) => handleChange("previousDocDate", date)}
                disabled={(date) => date > new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
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
      </div>
    </div>
  )
}
