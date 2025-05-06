"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { createClient } from "@/lib/supabase/client"

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

  useEffect(() => {
    const fetchReferenceData = async () => {
      try {
        const supabase = createClient()

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

  const handleSelectExistingProperty = (propertyId) => {
    const property = existingProperties.find((p) => p.id.toString() === propertyId)
    if (!property) return

    setFormState({
      ...formState,
      propertyId: property.id.toString(),
      propertyName: property.property_name,
      surveyNumber: property.survey_number,
    })
  }

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
          <Label htmlFor="propertyName">சொத்தின் பெயர்</Label>
          <Input
            id="propertyName"
            value={formState.propertyName}
            onChange={(e) => handleChange("propertyName", e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="surveyNumber">சர்வே எண்</Label>
          <Input
            id="surveyNumber"
            value={formState.surveyNumber}
            onChange={(e) => handleChange("surveyNumber", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="registrationDistrictId">பதிவு மாவட்டம்</Label>
          <Select
            value={formState.registrationDistrictId}
            onValueChange={(value) => handleChange("registrationDistrictId", value)}
          >
            <SelectTrigger>
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
        </div>

        <div className="space-y-2">
          <Label htmlFor="subRegistrarOfficeId">துணை பதிவாளர் அலுவலகம்</Label>
          <Select
            value={formState.subRegistrarOfficeId}
            onValueChange={(value) => handleChange("subRegistrarOfficeId", value)}
          >
            <SelectTrigger>
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
        </div>

        <div className="space-y-2">
          <Label htmlFor="districtId">மாவட்டம்</Label>
          <Select value={formState.districtId} onValueChange={(value) => handleChange("districtId", value)}>
            <SelectTrigger>
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
        </div>

        <div className="space-y-2">
          <Label htmlFor="talukId">தாலுகா</Label>
          <Select
            value={formState.talukId}
            onValueChange={(value) => handleChange("talukId", value)}
            disabled={filteredTaluks.length === 0}
          >
            <SelectTrigger>
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
        </div>

        <div className="space-y-2">
          <Label htmlFor="villageId">கிராமம்</Label>
          <Select
            value={formState.villageId}
            onValueChange={(value) => handleChange("villageId", value)}
            disabled={filteredVillages.length === 0}
          >
            <SelectTrigger>
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
        </div>

        <div className="space-y-2">
          <Label htmlFor="landTypeId">நில வகை</Label>
          <Select value={formState.landTypeId} onValueChange={(value) => handleChange("landTypeId", value)}>
            <SelectTrigger>
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
        </div>

        <div className="space-y-2">
          <Label htmlFor="guideValueSqm">வழிகாட்டு மதிப்பு (சதுர மீட்டர்)</Label>
          <Input
            id="guideValueSqm"
            type="number"
            value={formState.guideValueSqm}
            onChange={(e) => handleChange("guideValueSqm", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="guideValueSqft">வழிகாட்டு மதிப்பு (சதுர அடி)</Label>
          <Input
            id="guideValueSqft"
            type="number"
            value={formState.guideValueSqft}
            onChange={(e) => handleChange("guideValueSqft", e.target.value)}
          />
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <Label htmlFor="propertyDetails">சொத்து விவரங்கள்</Label>
        <Textarea
          id="propertyDetails"
          value={formState.propertyDetails}
          onChange={(e) => handleChange("propertyDetails", e.target.value)}
          rows={3}
        />
      </div>

      <Button type="submit" className="mt-4 bg-cyan-600 hover:bg-cyan-700 text-white">
        அடுத்த பக்கம்
      </Button>
    </form>
  )
}
