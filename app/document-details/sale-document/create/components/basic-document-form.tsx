"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { getSupabaseBrowserClient } from "@/lib/supabase"
import { toast } from "sonner"
import { FormError } from "@/components/ui/form-error"
import { isRequired, isValidDate, isNotFutureDate, errorMessages } from "@/lib/validation"

export default function BasicDocumentForm({ data, updateData }) {
  const [bookNumbers, setBookNumbers] = useState([])
  const [documentTypes, setDocumentTypes] = useState([])
  const [submissionTypes, setSubmissionTypes] = useState([])
  const [offices, setOffices] = useState([])
  const [subRegistrarOffices, setSubRegistrarOffices] = useState([])
  const [loading, setLoading] = useState(true)

  const [formState, setFormState] = useState(data)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  useEffect(() => {
    const fetchReferenceData = async () => {
      try {
        const supabase = getSupabaseBrowserClient()

        // Fetch book numbers
        const { data: bookNumbersData } = await supabase.from("book_numbers").select("id, number as name")

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
        toast.error("தரவுகளை பெறுவதில் பிழை ஏற்பட்டது")
      } finally {
        setLoading(false)
      }
    }

    fetchReferenceData()
  }, [])

  const validateField = (field, value) => {
    switch (field) {
      case "documentNumber":
        return isRequired(value) ? "" : errorMessages.required
      case "bookNumberId":
        return isRequired(value) ? "" : errorMessages.required
      case "documentTypeId":
        return isRequired(value) ? "" : errorMessages.required
      case "registrationDate":
        if (!isRequired(value)) return errorMessages.required
        if (!isValidDate(value)) return errorMessages.date
        if (!isNotFutureDate(value)) return errorMessages.futureDate
        return ""
      case "submissionDate":
        if (!isValidDate(value)) return errorMessages.date
        if (!isNotFutureDate(value)) return errorMessages.futureDate
        return ""
      case "submissionTypeId":
        return isRequired(value) ? "" : errorMessages.required
      case "officeId":
        return isRequired(value) ? "" : errorMessages.required
      case "subRegistrarOfficeId":
        return isRequired(value) ? "" : errorMessages.required
      case "documentStatus":
        return isRequired(value) ? "" : errorMessages.required
      default:
        return ""
    }
  }

  const validateForm = () => {
    const newErrors = {}
    let isValid = true

    // Validate all fields
    Object.keys(formState).forEach((field) => {
      const error = validateField(field, formState[field])
      if (error) {
        newErrors[field] = error
        isValid = false
      }
    })

    setErrors(newErrors)
    return isValid
  }

  const handleChange = (field, value) => {
    const updatedState = { ...formState, [field]: value }
    setFormState(updatedState)

    // Mark field as touched
    setTouched({ ...touched, [field]: true })

    // Validate the field
    const error = validateField(field, value)
    setErrors({ ...errors, [field]: error })
  }

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true })
    const error = validateField(field, formState[field])
    setErrors({ ...errors, [field]: error })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Mark all fields as touched
    const allTouched = {}
    Object.keys(formState).forEach((field) => {
      allTouched[field] = true
    })
    setTouched(allTouched)

    // Validate all fields
    if (validateForm()) {
      updateData(formState)
    } else {
      toast.error("படிவத்தில் பிழைகள் உள்ளன. சரிபார்த்து மீண்டும் முயற்சிக்கவும்.")
    }
  }

  if (loading) {
    return <div>தரவுகளை ஏற்றுகிறது...</div>
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label
            htmlFor="registrationDate"
            className={errors.registrationDate && touched.registrationDate ? "text-red-500" : ""}
          >
            பதிவு தேதி <span className="text-red-500">*</span>
          </Label>
          <Input
            id="registrationDate"
            type="text"
            placeholder="DD/MM/YYYY"
            value={formState.registrationDate ? new Date(formState.registrationDate).toLocaleDateString("en-GB") : ""}
            onChange={(e) => {
              const dateValue = e.target.value
              // Try to parse the date in DD/MM/YYYY format
              if (dateValue) {
                const [day, month, year] = dateValue.split("/")
                if (day && month && year) {
                  const parsedDate = new Date(`${year}-${month}-${day}`)
                  if (!isNaN(parsedDate.getTime())) {
                    handleChange("registrationDate", parsedDate.toISOString().split("T")[0])
                    return
                  }
                }
              }
              handleChange("registrationDate", dateValue)
            }}
            onBlur={() => handleBlur("registrationDate")}
            className={errors.registrationDate && touched.registrationDate ? "border-red-500" : ""}
            required
          />
          {touched.registrationDate && <FormError message={errors.registrationDate} />}
        </div>

        <div className="space-y-2"></div>

        <div className="space-y-2">
          <Label htmlFor="bookNumberId" className={errors.bookNumberId && touched.bookNumberId ? "text-red-500" : ""}>
            புத்தக எண் <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formState.bookNumberId || ""}
            onValueChange={(value) => handleChange("bookNumberId", value)}
            onOpenChange={() => handleBlur("bookNumberId")}
          >
            <SelectTrigger className={errors.bookNumberId && touched.bookNumberId ? "border-red-500" : ""}>
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
          {touched.bookNumberId && <FormError message={errors.bookNumberId} />}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="documentTypeId"
            className={errors.documentTypeId && touched.documentTypeId ? "text-red-500" : ""}
          >
            ஆவண வகை <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formState.documentTypeId || ""}
            onValueChange={(value) => handleChange("documentTypeId", value)}
            onOpenChange={() => handleBlur("documentTypeId")}
          >
            <SelectTrigger className={errors.documentTypeId && touched.documentTypeId ? "border-red-500" : ""}>
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
          {touched.documentTypeId && <FormError message={errors.documentTypeId} />}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="submissionDate"
            className={errors.submissionDate && touched.submissionDate ? "text-red-500" : ""}
          >
            சமர்ப்பிக்கப்பட்ட தேதி
          </Label>
          <Input
            id="submissionDate"
            type="date"
            value={formState.submissionDate || ""}
            onChange={(e) => handleChange("submissionDate", e.target.value)}
            onBlur={() => handleBlur("submissionDate")}
            className={errors.submissionDate && touched.submissionDate ? "border-red-500" : ""}
            max={new Date().toISOString().split("T")[0]} // இன்றைய தேதி வரை மட்டும்
          />
          {touched.submissionDate && <FormError message={errors.submissionDate} />}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="submissionTypeId"
            className={errors.submissionTypeId && touched.submissionTypeId ? "text-red-500" : ""}
          >
            சமர்ப்பிப்பு வகை <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formState.submissionTypeId || ""}
            onValueChange={(value) => handleChange("submissionTypeId", value)}
            onOpenChange={() => handleBlur("submissionTypeId")}
          >
            <SelectTrigger className={errors.submissionTypeId && touched.submissionTypeId ? "border-red-500" : ""}>
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
          {touched.submissionTypeId && <FormError message={errors.submissionTypeId} />}
        </div>

        <div className="space-y-2">
          <Label htmlFor="officeId" className={errors.officeId && touched.officeId ? "text-red-500" : ""}>
            அலுவலகம் <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formState.officeId || ""}
            onValueChange={(value) => handleChange("officeId", value)}
            onOpenChange={() => handleBlur("officeId")}
          >
            <SelectTrigger className={errors.officeId && touched.officeId ? "border-red-500" : ""}>
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
          {touched.officeId && <FormError message={errors.officeId} />}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="subRegistrarOfficeId"
            className={errors.subRegistrarOfficeId && touched.subRegistrarOfficeId ? "text-red-500" : ""}
          >
            துணை பதிவாளர் அலுவலகம் <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formState.subRegistrarOfficeId || ""}
            onValueChange={(value) => handleChange("subRegistrarOfficeId", value)}
            onOpenChange={() => handleBlur("subRegistrarOfficeId")}
          >
            <SelectTrigger
              className={errors.subRegistrarOfficeId && touched.subRegistrarOfficeId ? "border-red-500" : ""}
            >
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
          {touched.subRegistrarOfficeId && <FormError message={errors.subRegistrarOfficeId} />}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="documentStatus"
            className={errors.documentStatus && touched.documentStatus ? "text-red-500" : ""}
          >
            ஆவண நிலை <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formState.documentStatus || ""}
            onValueChange={(value) => handleChange("documentStatus", value)}
            onOpenChange={() => handleBlur("documentStatus")}
          >
            <SelectTrigger className={errors.documentStatus && touched.documentStatus ? "border-red-500" : ""}>
              <SelectValue placeholder="ஆவண நிலை தேர்ந்தெடுக்கவும்" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">வரைவு</SelectItem>
              <SelectItem value="pending">நிலுவையில்</SelectItem>
              <SelectItem value="completed">முடிந்தது</SelectItem>
              <SelectItem value="cancelled">ரத்து செய்யப்பட்டது</SelectItem>
            </SelectContent>
          </Select>
          {touched.documentStatus && <FormError message={errors.documentStatus} />}
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <Label htmlFor="remarks">குறிப்புகள்</Label>
        <Textarea
          id="remarks"
          value={formState.remarks || ""}
          onChange={(e) => handleChange("remarks", e.target.value)}
          rows={3}
        />
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
