"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { createClient } from "@/lib/supabase/client"

export default function BasicDocumentForm({ data, updateData }) {
  const [bookNumbers, setBookNumbers] = useState([])
  const [documentTypes, setDocumentTypes] = useState([])
  const [submissionTypes, setSubmissionTypes] = useState([])
  const [offices, setOffices] = useState([])
  const [subRegistrarOffices, setSubRegistrarOffices] = useState([])
  const [loading, setLoading] = useState(true)

  const [formState, setFormState] = useState(data)

  useEffect(() => {
    const fetchReferenceData = async () => {
      try {
        const supabase = createClient()

        // Fetch book numbers
        const { data: bookNumbersData } = await supabase.from("book_numbers").select("id, name")

        // Fetch document types
        const { data: documentTypesData } = await supabase.from("document_types").select("id, name")

        // Fetch submission types
        const { data: submissionTypesData } = await supabase.from("submission_types").select("id, name")

        // Fetch offices
        const { data: officesData } = await supabase.from("offices").select("id, name")

        // Fetch sub-registrar offices
        const { data: subRegistrarOfficesData } = await supabase.from("sub_registrar_offices").select("id, name")

        setBookNumbers(bookNumbersData || [])
        setDocumentTypes(documentTypesData || [])
        setSubmissionTypes(submissionTypesData || [])
        setOffices(officesData || [])
        setSubRegistrarOffices(subRegistrarOfficesData || [])
      } catch (error) {
        console.error("Error fetching reference data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchReferenceData()
  }, [])

  const handleChange = (field, value) => {
    const updatedState = { ...formState, [field]: value }
    setFormState(updatedState)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    updateData(formState)
  }

  if (loading) {
    return <div>தரவுகளை ஏற்றுகிறது...</div>
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="documentNumber">ஆவண எண்</Label>
          <Input
            id="documentNumber"
            value={formState.documentNumber}
            onChange={(e) => handleChange("documentNumber", e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bookNumberId">புத்தக எண்</Label>
          <Select value={formState.bookNumberId} onValueChange={(value) => handleChange("bookNumberId", value)}>
            <SelectTrigger>
              <SelectValue placeholder="புத்தக எண் தேர்ந்தெடுக்கவும்" />
            </SelectTrigger>
            <SelectContent>
              {bookNumbers.map((book) => (
                <SelectItem key={book.id} value={book.id.toString()}>
                  {book.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="documentTypeId">ஆவண வகை</Label>
          <Select value={formState.documentTypeId} onValueChange={(value) => handleChange("documentTypeId", value)}>
            <SelectTrigger>
              <SelectValue placeholder="ஆவண வகை தேர்ந்தெடுக்கவும்" />
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

        <div className="space-y-2">
          <Label htmlFor="registrationDate">பதிவு தேதி</Label>
          <Input
            id="registrationDate"
            type="date"
            value={formState.registrationDate}
            onChange={(e) => handleChange("registrationDate", e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="submissionDate">சமர்ப்பிக்கப்பட்ட தேதி</Label>
          <Input
            id="submissionDate"
            type="date"
            value={formState.submissionDate}
            onChange={(e) => handleChange("submissionDate", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="submissionTypeId">சமர்ப்பிப்பு வகை</Label>
          <Select value={formState.submissionTypeId} onValueChange={(value) => handleChange("submissionTypeId", value)}>
            <SelectTrigger>
              <SelectValue placeholder="சமர்ப்பிப்பு வகை தேர்ந்தெடுக்கவும்" />
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

        <div className="space-y-2">
          <Label htmlFor="officeId">அலுவலகம்</Label>
          <Select value={formState.officeId} onValueChange={(value) => handleChange("officeId", value)}>
            <SelectTrigger>
              <SelectValue placeholder="அலுவலகம் தேர்ந்தெடுக்கவும்" />
            </SelectTrigger>
            <SelectContent>
              {offices.map((office) => (
                <SelectItem key={office.id} value={office.id.toString()}>
                  {office.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="subRegistrarOfficeId">துணை பதிவாளர் அலுவலகம்</Label>
          <Select
            value={formState.subRegistrarOfficeId}
            onValueChange={(value) => handleChange("subRegistrarOfficeId", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="துணை பதிவாளர் அலுவலகம் தேர்ந்தெடுக்கவும்" />
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

        <div className="space-y-2">
          <Label htmlFor="documentStatus">ஆவண நிலை</Label>
          <Select value={formState.documentStatus} onValueChange={(value) => handleChange("documentStatus", value)}>
            <SelectTrigger>
              <SelectValue placeholder="ஆவண நிலை தேர்ந்தெடுக்கவும்" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">வரைவு</SelectItem>
              <SelectItem value="pending">நிலுவையில்</SelectItem>
              <SelectItem value="completed">முடிந்தது</SelectItem>
              <SelectItem value="cancelled">ரத்து செய்யப்பட்டது</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <Label htmlFor="remarks">குறிப்புகள்</Label>
        <Textarea
          id="remarks"
          value={formState.remarks}
          onChange={(e) => handleChange("remarks", e.target.value)}
          rows={3}
        />
      </div>

      <Button type="submit" className="mt-4 bg-cyan-600 hover:bg-cyan-700 text-white">
        அடுத்த பக்கம்
      </Button>
    </form>
  )
}
