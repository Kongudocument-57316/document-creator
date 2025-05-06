"use client"

import { useEffect, useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getSupabaseBrowserClient } from "@/lib/supabase"

interface RegistrationOffice {
  id: number
  name: string
}

interface DocumentPreparer {
  id: number
  name: string
}

interface TypingOffice {
  id: number
  name: string
}

interface DeedTabProps {
  data: any
  updateData: (data: any) => void
}

export function DeedTab({ data, updateData }: DeedTabProps) {
  const [registrationOffices, setRegistrationOffices] = useState<RegistrationOffice[]>([])
  const [documentPreparers, setDocumentPreparers] = useState<DocumentPreparer[]>([])
  const [typingOffices, setTypingOffices] = useState<TypingOffice[]>([])
  const [loading, setLoading] = useState(true)
  const [formValues, setFormValues] = useState({
    registrationOfficeId: data.registrationOfficeId || "",
    day: data.day || "",
    month: data.month || "",
    year: data.year || "",
    documentPreparerId: data.documentPreparerId || "",
    phoneNumber: data.phoneNumber || "",
    typingOfficeId: data.typingOfficeId || "",
  })

  const supabase = getSupabaseBrowserClient()

  useEffect(() => {
    async function fetchReferenceData() {
      try {
        setLoading(true)

        // Fetch registration offices (using sub_registrar_offices table)
        const { data: officesData } = await supabase.from("sub_registrar_offices").select("id, name").order("name")

        if (officesData) setRegistrationOffices(officesData)

        // Fetch document preparers (using typists table as a placeholder)
        const { data: preparersData } = await supabase.from("typists").select("id, name").order("name")

        if (preparersData) setDocumentPreparers(preparersData)

        // Fetch typing offices (using offices table)
        const { data: typingOfficesData } = await supabase.from("offices").select("id, name").order("name")

        if (typingOfficesData) setTypingOffices(typingOfficesData)
      } catch (error) {
        console.error("Error fetching reference data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchReferenceData()
  }, [supabase])

  useEffect(() => {
    async function loadDocumentPreparerPhone() {
      if (formValues.documentPreparerId) {
        try {
          const { data: preparerData } = await supabase
            .from("typists")
            .select("phone_number")
            .eq("id", formValues.documentPreparerId)
            .single()

          if (preparerData && preparerData.phone_number) {
            handleChange("phoneNumber", preparerData.phone_number)
          }
        } catch (error) {
          console.error("Error fetching document preparer phone:", error)
        }
      }
    }

    loadDocumentPreparerPhone()
  }, [formValues.documentPreparerId, supabase])

  const handleChange = (field: string, value: string | Date) => {
    const newValues = { ...formValues, [field]: value }
    setFormValues(newValues)
    updateData(newValues)
  }

  const months = [
    "ஜனவரி",
    "பிப்ரவரி",
    "மார்ச்",
    "ஏப்ரல்",
    "மே",
    "ஜூன்",
    "ஜூலை",
    "ஆகஸ்ட்",
    "செப்டம்பர்",
    "அக்டோபர்",
    "நவம்பர்",
    "டிசம்பர்",
  ]

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-purple-800">ஆவண அடிப்படை விவரங்கள்</h3>

      <div className="space-y-4">
        <div>
          <Label htmlFor="registration-office">ஆவணம் பதிவு செய்யும் சார்பதிவாளர் அலுவலகம் (Registration Office)</Label>
          <Select
            value={formValues.registrationOfficeId}
            onValueChange={(value) => handleChange("registrationOfficeId", value)}
          >
            <SelectTrigger className="mt-1 border-purple-200 focus-visible:ring-purple-400">
              <SelectValue placeholder="சார்பதிவாளர் அலுவலகத்தைத் தேர்ந்தெடுக்கவும்" />
            </SelectTrigger>
            <SelectContent>
              {registrationOffices.map((office) => (
                <SelectItem key={office.id} value={office.id.toString()}>
                  {office.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="day">தேதி (Date)</Label>
            <Input
              id="day"
              placeholder="தேதி (01-31)"
              value={formValues.day}
              onChange={(e) => handleChange("day", e.target.value)}
              className="mt-1 border-purple-200 focus-visible:ring-purple-400"
            />
            <p className="text-xs text-gray-500 mt-1">Format: 01-31</p>
          </div>

          <div>
            <Label htmlFor="month">மாதம் (Month)</Label>
            <Select value={formValues.month} onValueChange={(value) => handleChange("month", value)}>
              <SelectTrigger className="mt-1 border-purple-200 focus-visible:ring-purple-400">
                <SelectValue placeholder="மாதத்தைத் தேர்ந்தெடுக்கவும்" />
              </SelectTrigger>
              <SelectContent>
                {months.map((month, index) => (
                  <SelectItem key={index} value={(index + 1).toString()}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="year">ஆண்டு (Year)</Label>
            <Input
              id="year"
              placeholder="ஆண்டை உள்ளிடவும்"
              value={formValues.year}
              onChange={(e) => handleChange("year", e.target.value)}
              className="mt-1 border-purple-200 focus-visible:ring-purple-400"
            />
            <p className="text-xs text-gray-500 mt-1">Format: YYYY</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="document-preparer">ஆவணம் தயாரித்தவர் (Document Preparer)</Label>
            <Select
              value={formValues.documentPreparerId}
              onValueChange={(value) => handleChange("documentPreparerId", value)}
            >
              <SelectTrigger className="mt-1 border-purple-200 focus-visible:ring-purple-400">
                <SelectValue placeholder="ஆவணம் தயாரித்தவரைத் தேர்ந்தெடுக்கவும்" />
              </SelectTrigger>
              <SelectContent>
                {documentPreparers.map((preparer) => (
                  <SelectItem key={preparer.id} value={preparer.id.toString()}>
                    {preparer.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="phone-number">தொலைபேசி எண் (Phone Number)</Label>
            <Input
              id="phone-number"
              placeholder="தொலைபேசி எண்ணை உள்ளிடவும்"
              value={formValues.phoneNumber}
              onChange={(e) => handleChange("phoneNumber", e.target.value)}
              className="mt-1 border-purple-200 focus-visible:ring-purple-400"
              readOnly={!!formValues.documentPreparerId}
            />
            {formValues.documentPreparerId && (
              <p className="text-xs text-gray-500 mt-1">தட்டச்சாளரின் தொலைபேசி எண்ணிலிருந்து தானாகவே நிரப்பப்பட்டது</p>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="typing-office">தட்டச்சு அலுவலகத்தின் பெயர் (Typing Office Name)</Label>
          <Select value={formValues.typingOfficeId} onValueChange={(value) => handleChange("typingOfficeId", value)}>
            <SelectTrigger className="mt-1 border-purple-200 focus-visible:ring-purple-400">
              <SelectValue placeholder="தட்டச்சு அலுவலகத்தைத் தேர்ந்தெடுக்கவும்" />
            </SelectTrigger>
            <SelectContent>
              {typingOffices.map((office) => (
                <SelectItem key={office.id} value={office.id.toString()}>
                  {office.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
