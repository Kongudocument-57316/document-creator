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
import { isRequired, isPositiveNumber, errorMessages } from "@/lib/validation"

export default function PropertyDetailsForm({ data, updateData }) {
  const [formState, setFormState] = useState(data)
  const [existingProperties, setExistingProperties] = useState([])
  const [registrationDistricts, setRegistrationDistricts] = useState([])
  const [subRegistrarOffices, setSubRegistrarOffices] = useState([])
  const [districts, setDistricts] = useState([])
  const [taluks, setTaluks] = useState([])
  const [villages, setVillages] = useState([])
  const [landTypes, setLandTypes] = useState([])
  const [filteredTaluks, setFilteredTaluks] = useState([])
  const [filteredVillages, setFilteredVillages] = useState([])
  const [loading, setLoading] = useState(true)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  useEffect(() => {
    const fetchReferenceData = async () => {
      try {
        const supabase = getSupabaseBrowserClient()

        // Fetch existing properties
        const { data: propertiesData } = await supabase.from("properties").select("id, property_name, survey_number")

        // Fetch registration districts
        const { data: regDistrictsData } = await supabase.from("registration_districts").select("id, name")

        // Fetch sub-registrar offices
        const { data: subRegOfficesData } = await supabase.from("sub_registrar_offices").select("id, name")

        // Fetch districts
        const { data: districtsData } = await supabase.from("districts").select("id, name")

        // Fetch taluks
        const { data: taluksData } = await supabase.from("taluks").select("id, name, district_id")

        // Fetch villages
        const { data: villagesData } = await supabase.from("villages").select("id, name, taluk_id")

        // Fetch land types
        const { data: landTypesData } = await supabase.from("land_types").select("id, name")

        setExistingProperties(propertiesData || [])
        setRegistrationDistricts(regDistrictsData || [])
        setSubRegistrarOffices(subRegOfficesData || [])
        setDistricts(districtsData || [])
        setTaluks(taluksData || [])
        setVillages(villagesData || [])
        setLandTypes(landTypesData || [])
      } catch (error) {
        console.error("Error fetching reference data:", error)
        toast.error("தரவுகளை பெறுவதில் பிழை ஏற்பட்டது")
      } finally {
        setLoading(false)
      }
    }

    fetchReferenceData()
  }, [])

  useEffect(() => {
    // Filter taluks based on selected district
    if (formState.districtId) {
      const filtered = taluks.filter((taluk) => taluk.district_id.toString() === formState.districtId)
      setFilteredTaluks(filtered)
    } else {
      setFilteredTaluks([])
    }
  }, [formState.districtId, taluks])

  useEffect(() => {
    // Filter villages based on selected taluk
    if (formState.talukId) {
      const filtered = villages.filter((village) => village.taluk_id.toString() === formState.talukId)
      setFilteredVillages(filtered)
    } else {
      setFilteredVillages([])
    }
  }, [formState.talukId, villages])

  const validateField = (field, value) => {
    switch (field) {
      case "propertyName":
        return isRequired(value) ? "" : errorMessages.required
      case "registrationDistrictId":
        return isRequired(value) ? "" : errorMessages.required
      case "subRegistrarOfficeId":
        return isRequired(value) ? "" : errorMessages.required
      case "districtId":
        return isRequired(value) ? "" : errorMessages.required
      case "talukId":
        return isRequired(value) ? "" : errorMessages.required
      case "villageId":
        return isRequired(value) ? "" : errorMessages.required
      case "landTypeId":
        return isRequired(value) ? "" : errorMessages.required
      case "guideValueSqm":
        if (!isPositiveNumber(value) && value) return errorMessages.positiveNumber
        return ""
      case "guideValueSqft":
        if (!isPositiveNumber(value) && value) return errorMessages.positiveNumber
        return ""
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

  const handleSelectExistingProperty = (propertyId) => {
    const property = existingProperties.find((p) => p.id.toString() === propertyId)
    if (!property) return

    setFormState({
      ...formState,
      propertyId: property.id.toString(),
      propertyName: property.property_name,
      surveyNumber: property.survey_number,
    })

    // Validate the updated fields
    setErrors({
      ...errors,
      propertyName: validateField("propertyName", property.property_name),
    })
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
      <div className="mb-4">
        <Label htmlFor="existingProperty">ஏற்கனவே உள்ள சொத்தைத் தேர்ந்தெடுக்கவும்</Label>
        <Select value={formState.propertyId} onValueChange={handleSelectExistingProperty}>
          <SelectTrigger>
            <SelectValue placeholder="சொத்தைத் தேர்ந்தெடுக்கவும்" />
          </SelectTrigger>
          <SelectContent>
            {existingProperties.map((property) => (
              <SelectItem key={property.id} value={property.id.toString()}>
                {property.property_name} - {property.survey_number || "சர்வே எண் இல்லை"}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="propertyName" className={errors.propertyName && touched.propertyName ? "text-red-500" : ""}>
            சொத்தின் பெயர் <span className="text-red-500">*</span>
          </Label>
          <Input
            id="propertyName"
            value={formState.propertyName || ""}
            onChange={(e) => handleChange("propertyName", e.target.value)}
            onBlur={() => handleBlur("propertyName")}
            className={errors.propertyName && touched.propertyName ? "border-red-500" : ""}
            required
          />
          {touched.propertyName && <FormError message={errors.propertyName} />}
        </div>

        <div className="space-y-2">
          <Label htmlFor="surveyNumber">சர்வே எண்</Label>
          <Input
            id="surveyNumber"
            value={formState.surveyNumber || ""}
            onChange={(e) => handleChange("surveyNumber", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="registrationDistrictId"
            className={errors.registrationDistrictId && touched.registrationDistrictId ? "text-red-500" : ""}
          >
            பதிவு மாவட்டம் <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formState.registrationDistrictId || ""}
            onValueChange={(value) => handleChange("registrationDistrictId", value)}
            onOpenChange={() => handleBlur("registrationDistrictId")}
          >
            <SelectTrigger
              className={errors.registrationDistrictId && touched.registrationDistrictId ? "border-red-500" : ""}
            >
              <SelectValue placeholder="பதிவு மாவட்டத்தைத் தேர்ந்தெடுக்கவும்" />
            </SelectTrigger>
            <SelectContent>
              {registrationDistricts.map((district) => (
                <SelectItem key={district.id} value={district.id.toString()}>
                  {district.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {touched.registrationDistrictId && <FormError message={errors.registrationDistrictId} />}
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
              <SelectValue placeholder="துணை பதிவாளர் அலுவலகத்தைத் தேர்ந்தெடுக்கவும்" />
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
          <Label htmlFor="districtId" className={errors.districtId && touched.districtId ? "text-red-500" : ""}>
            மாவட்டம் <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formState.districtId || ""}
            onValueChange={(value) => handleChange("districtId", value)}
            onOpenChange={() => handleBlur("districtId")}
          >
            <SelectTrigger className={errors.districtId && touched.districtId ? "border-red-500" : ""}>
              <SelectValue placeholder="மாவட்டத்தைத் தேர்ந்தெடுக்கவும்" />
            </SelectTrigger>
            <SelectContent>
              {districts.map((district) => (
                <SelectItem key={district.id} value={district.id.toString()}>
                  {district.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {touched.districtId && <FormError message={errors.districtId} />}
        </div>

        <div className="space-y-2">
          <Label htmlFor="talukId" className={errors.talukId && touched.talukId ? "text-red-500" : ""}>
            தாலுகா <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formState.talukId || ""}
            onValueChange={(value) => handleChange("talukId", value)}
            onOpenChange={() => handleBlur("talukId")}
            disabled={filteredTaluks.length === 0}
          >
            <SelectTrigger className={errors.talukId && touched.talukId ? "border-red-500" : ""}>
              <SelectValue placeholder="தாலுகாவைத் தேர்ந்தெடுக்கவும்" />
            </SelectTrigger>
            <SelectContent>
              {filteredTaluks.map((taluk) => (
                <SelectItem key={taluk.id} value={taluk.id.toString()}>
                  {taluk.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {touched.talukId && <FormError message={errors.talukId} />}
        </div>

        <div className="space-y-2">
          <Label htmlFor="villageId" className={errors.villageId && touched.villageId ? "text-red-500" : ""}>
            கிராமம் <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formState.villageId || ""}
            onValueChange={(value) => handleChange("villageId", value)}
            onOpenChange={() => handleBlur("villageId")}
            disabled={filteredVillages.length === 0}
          >
            <SelectTrigger className={errors.villageId && touched.villageId ? "border-red-500" : ""}>
              <SelectValue placeholder="கிராமத்தைத் தேர்ந்தெடுக்கவும்" />
            </SelectTrigger>
            <SelectContent>
              {filteredVillages.map((village) => (
                <SelectItem key={village.id} value={village.id.toString()}>
                  {village.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {touched.villageId && <FormError message={errors.villageId} />}
        </div>

        <div className="space-y-2">
          <Label htmlFor="landTypeId" className={errors.landTypeId && touched.landTypeId ? "text-red-500" : ""}>
            நில வகை <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formState.landTypeId || ""}
            onValueChange={(value) => handleChange("landTypeId", value)}
            onOpenChange={() => handleBlur("landTypeId")}
          >
            <SelectTrigger className={errors.landTypeId && touched.landTypeId ? "border-red-500" : ""}>
              <SelectValue placeholder="நில வகையைத் தேர்ந்தெடுக்கவும்" />
            </SelectTrigger>
            <SelectContent>
              {landTypes.map((type) => (
                <SelectItem key={type.id} value={type.id.toString()}>
                  {type.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {touched.landTypeId && <FormError message={errors.landTypeId} />}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="guideValueSqm"
            className={errors.guideValueSqm && touched.guideValueSqm ? "text-red-500" : ""}
          >
            வழிகாட்டு மதிப்பு (சதுர மீட்டர்)
          </Label>
          <Input
            id="guideValueSqm"
            type="number"
            value={formState.guideValueSqm || ""}
            onChange={(e) => handleChange("guideValueSqm", e.target.value)}
            onBlur={() => handleBlur("guideValueSqm")}
            className={errors.guideValueSqm && touched.guideValueSqm ? "border-red-500" : ""}
          />
          {touched.guideValueSqm && <FormError message={errors.guideValueSqm} />}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="guideValueSqft"
            className={errors.guideValueSqft && touched.guideValueSqft ? "text-red-500" : ""}
          >
            வழிகாட்டு மதிப்பு (சதுர அடி)
          </Label>
          <Input
            id="guideValueSqft"
            type="number"
            value={formState.guideValueSqft || ""}
            onChange={(e) => handleChange("guideValueSqft", e.target.value)}
            onBlur={() => handleBlur("guideValueSqft")}
            className={errors.guideValueSqft && touched.guideValueSqft ? "border-red-500" : ""}
          />
          {touched.guideValueSqft && <FormError message={errors.guideValueSqft} />}
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <Label htmlFor="propertyDetails">சொத்து விவரங்கள்</Label>
        <Textarea
          id="propertyDetails"
          value={formState.propertyDetails || ""}
          onChange={(e) => handleChange("propertyDetails", e.target.value)}
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
