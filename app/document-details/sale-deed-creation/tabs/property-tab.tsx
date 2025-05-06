"use client"

import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getSupabaseBrowserClient } from "@/lib/supabase"
import { Plus } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface RegistrationDistrict {
  id: number
  name: string
}

interface SubRegistrarOffice {
  id: number
  name: string
  registration_district_id: number
}

interface District {
  id: number
  name: string
}

interface Taluk {
  id: number
  name: string
  district_id: number
}

interface Village {
  id: number
  name: string
  taluk_id: number
}

interface LandType {
  id: number
  name: string
}

interface ValueType {
  id: number
  name: string
}

interface PropertyTabProps {
  data: any
  updateData: (data: any) => void
}

export function PropertyTab({ data, updateData }: PropertyTabProps) {
  const [useExistingProperty, setUseExistingProperty] = useState<boolean>(data.useExistingProperty || true)
  const [registrationDistricts, setRegistrationDistricts] = useState<RegistrationDistrict[]>([])
  const [subRegistrarOffices, setSubRegistrarOffices] = useState<SubRegistrarOffice[]>([])
  const [filteredSubRegistrarOffices, setFilteredSubRegistrarOffices] = useState<SubRegistrarOffice[]>([])
  const [districts, setDistricts] = useState<District[]>([])
  const [taluks, setTaluks] = useState<Taluk[]>([])
  const [filteredTaluks, setFilteredTaluks] = useState<Taluk[]>([])
  const [villages, setVillages] = useState<Village[]>([])
  const [filteredVillages, setFilteredVillages] = useState<Village[]>([])
  const [landTypes, setLandTypes] = useState<LandType[]>([])
  const [valueTypes, setValueTypes] = useState<ValueType[]>([])
  const [loading, setLoading] = useState(true)
  const [formValues, setFormValues] = useState({
    useExistingProperty: data.useExistingProperty || true,
    registrationDistrictId: data.registrationDistrictId || "",
    subRegistrarOfficeId: data.subRegistrarOfficeId || "",
    districtId: data.districtId || "",
    talukId: data.talukId || "",
    villageId: data.villageId || "",
    landTypeId: data.landTypeId || "",
    propertyDescription: data.propertyDescription || "",
    otherDetails: data.otherDetails || [],
    totalValue: data.totalValue || "0.00",
    manualEdit: data.manualEdit || false,
  })

  const supabase = getSupabaseBrowserClient()

  useEffect(() => {
    async function fetchReferenceData() {
      try {
        setLoading(true)

        // Fetch registration districts
        const { data: regDistrictsData } = await supabase
          .from("registration_districts")
          .select("id, name")
          .order("name")

        if (regDistrictsData) setRegistrationDistricts(regDistrictsData)

        // Fetch sub registrar offices
        const { data: subRegOfficesData } = await supabase
          .from("sub_registrar_offices")
          .select("id, name, registration_district_id")
          .order("name")

        if (subRegOfficesData) setSubRegistrarOffices(subRegOfficesData)

        // Fetch districts
        const { data: districtsData } = await supabase.from("districts").select("id, name").order("name")

        if (districtsData) setDistricts(districtsData)

        // Fetch taluks
        const { data: taluksData } = await supabase.from("taluks").select("id, name, district_id").order("name")

        if (taluksData) setTaluks(taluksData)

        // Fetch villages
        const { data: villagesData } = await supabase.from("villages").select("id, name, taluk_id").order("name")

        if (villagesData) setVillages(villagesData)

        // Fetch land types
        const { data: landTypesData } = await supabase.from("land_types").select("id, name").order("name")

        if (landTypesData) setLandTypes(landTypesData)

        // Fetch value types
        const { data: valueTypesData } = await supabase.from("value_types").select("id, name").order("name")

        if (valueTypesData) setValueTypes(valueTypesData)
      } catch (error) {
        console.error("Error fetching reference data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchReferenceData()
  }, [supabase])

  useEffect(() => {
    // Filter sub registrar offices based on selected registration district
    if (formValues.registrationDistrictId) {
      const filtered = subRegistrarOffices.filter(
        (office) => office.registration_district_id === Number(formValues.registrationDistrictId),
      )
      setFilteredSubRegistrarOffices(filtered)
    } else {
      setFilteredSubRegistrarOffices([])
    }
  }, [formValues.registrationDistrictId, subRegistrarOffices])

  useEffect(() => {
    // Filter taluks based on selected district
    if (formValues.districtId) {
      const filtered = taluks.filter((taluk) => taluk.district_id === Number(formValues.districtId))
      setFilteredTaluks(filtered)
    } else {
      setFilteredTaluks([])
    }
  }, [formValues.districtId, taluks])

  useEffect(() => {
    // Filter villages based on selected taluk
    if (formValues.talukId) {
      const filtered = villages.filter((village) => village.taluk_id === Number(formValues.talukId))
      setFilteredVillages(filtered)
    } else {
      setFilteredVillages([])
    }
  }, [formValues.talukId, villages])

  const handleChange = (field: string, value: any) => {
    const newValues = { ...formValues, [field]: value }

    // Reset dependent fields
    if (field === "registrationDistrictId") {
      newValues.subRegistrarOfficeId = ""
    } else if (field === "districtId") {
      newValues.talukId = ""
      newValues.villageId = ""
    } else if (field === "talukId") {
      newValues.villageId = ""
    }

    setFormValues(newValues)
    updateData(newValues)
  }

  const handleUseExistingPropertyChange = (value: string) => {
    const useExisting = value === "true"
    setUseExistingProperty(useExisting)
    handleChange("useExistingProperty", useExisting)
  }

  const addOtherDetail = () => {
    const newDetail = {
      id: Date.now(),
      valueTypeId: "",
      amount: "",
      description: "",
    }

    const newOtherDetails = [...formValues.otherDetails, newDetail]
    handleChange("otherDetails", newOtherDetails)
  }

  const handleOtherDetailChange = (index: number, field: string, value: string) => {
    const newOtherDetails = [...formValues.otherDetails]
    newOtherDetails[index] = { ...newOtherDetails[index], [field]: value }
    handleChange("otherDetails", newOtherDetails)
  }

  const recalculateTotalValue = () => {
    // Calculate total from other details
    const total = formValues.otherDetails.reduce((sum, detail) => {
      const amount = Number.parseFloat(detail.amount) || 0
      return sum + amount
    }, 0)

    handleChange("totalValue", total.toFixed(2))
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-purple-800">சொத்து விவரங்கள்</h3>

      <div>
        <Label htmlFor="land-type-select">நில வகை (Land Type)</Label>
        <Select value={formValues.landTypeId} onValueChange={(value) => handleChange("landTypeId", value)}>
          <SelectTrigger className="mt-1 border-purple-200 focus-visible:ring-purple-400">
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

      <div className="mb-6">
        <RadioGroup
          value={useExistingProperty ? "true" : "false"}
          onValueChange={handleUseExistingPropertyChange}
          className="flex flex-col space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="true" id="use-existing" />
            <Label htmlFor="use-existing">ஏற்கனவே உள்ள சொத்து விவரங்களைப் பயன்படுத்து (Use existing property details)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="false" id="add-new" />
            <Label htmlFor="add-new">புதிய சொத்து விவரங்களைச் சேர்க்க (Add site details)</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-4">
        <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
          <h4 className="font-medium text-purple-800 mb-4">சொத்து தேடல் (Property Search)</h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="registration-district">பதிவு மாவட்டம் (Registration District)</Label>
              <Select
                value={formValues.registrationDistrictId}
                onValueChange={(value) => handleChange("registrationDistrictId", value)}
              >
                <SelectTrigger className="mt-1 border-purple-200 focus-visible:ring-purple-400">
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

            <div>
              <Label htmlFor="sub-registrar-office">சார்பதிவாளர் அலுவலகம் (Sub Register Office)</Label>
              <Select
                value={formValues.subRegistrarOfficeId}
                onValueChange={(value) => handleChange("subRegistrarOfficeId", value)}
                disabled={filteredSubRegistrarOffices.length === 0}
              >
                <SelectTrigger className="mt-1 border-purple-200 focus-visible:ring-purple-400">
                  <SelectValue placeholder="சார்பதிவாளர் அலுவலகத்தைத் தேர்ந்தெடுக்கவும்" />
                </SelectTrigger>
                <SelectContent>
                  {filteredSubRegistrarOffices.map((office) => (
                    <SelectItem key={office.id} value={office.id.toString()}>
                      {office.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="district">மாவட்டம் (District)</Label>
              <Select value={formValues.districtId} onValueChange={(value) => handleChange("districtId", value)}>
                <SelectTrigger className="mt-1 border-purple-200 focus-visible:ring-purple-400">
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div>
              <Label htmlFor="taluk">வட்டம் (Taluk)</Label>
              <Select
                value={formValues.talukId}
                onValueChange={(value) => handleChange("talukId", value)}
                disabled={filteredTaluks.length === 0}
              >
                <SelectTrigger className="mt-1 border-purple-200 focus-visible:ring-purple-400">
                  <SelectValue placeholder="வட்டத்தைத் தேர்ந்தெடுக்கவும்" />
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

            <div>
              <Label htmlFor="village">கிராமம் (Village)</Label>
              <Select
                value={formValues.villageId}
                onValueChange={(value) => handleChange("villageId", value)}
                disabled={filteredVillages.length === 0}
              >
                <SelectTrigger className="mt-1 border-purple-200 focus-visible:ring-purple-400">
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

            <div>
              <Label htmlFor="land-type">நில வகை (Land Type)</Label>
              <Select value={formValues.landTypeId} onValueChange={(value) => handleChange("landTypeId", value)}>
                <SelectTrigger className="mt-1 border-purple-200 focus-visible:ring-purple-400">
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
          </div>

          <div className="mt-4 flex justify-center">
            <Button type="button" variant="outline" className="border-purple-300 text-purple-700 hover:bg-purple-100">
              சொத்துக்களைத் தேடு (Search Properties)
            </Button>
          </div>
        </div>

        {!useExistingProperty && (
          <div className="space-y-4">
            <div>
              <Button
                type="button"
                variant="outline"
                className="w-full border-purple-300 text-purple-700 hover:bg-purple-100"
              >
                <Plus className="h-4 w-4 mr-2" />
                புதிய தளம் விவரங்கள் சேர்க்க (Add New Site Details)
              </Button>
            </div>

            <div>
              <Button
                type="button"
                variant="outline"
                className="w-full border-purple-300 text-purple-700 hover:bg-purple-100"
              >
                <Plus className="h-4 w-4 mr-2" />
                புதிய கட்டட விவரங்கள் சேர்க்க (Add New Building Details)
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <h4 className="font-medium text-purple-800">இதர விவரங்கள் (Other Details)</h4>

          {formValues.otherDetails.map((detail, index) => (
            <div key={detail.id} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>மதிப்பு வகை (Value Type)</Label>
                <Select
                  value={detail.valueTypeId}
                  onValueChange={(value) => handleOtherDetailChange(index, "valueTypeId", value)}
                >
                  <SelectTrigger className="mt-1 border-purple-200 focus-visible:ring-purple-400">
                    <SelectValue placeholder="மதிப்பு வகையைத் தேர்ந்தெடுக்கவும்" />
                  </SelectTrigger>
                  <SelectContent>
                    {valueTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id.toString()}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>தொகை (Amount)</Label>
                <Input
                  placeholder="தொகையை உள்ளிடவும்"
                  value={detail.amount}
                  onChange={(e) => handleOtherDetailChange(index, "amount", e.target.value)}
                  className="mt-1 border-purple-200 focus-visible:ring-purple-400"
                  type="number"
                  step="0.01"
                />
              </div>

              <div>
                <Label>விளக்கம் (Description)</Label>
                <Input
                  placeholder="விளக்கத்தை உள்ளிடவும்"
                  value={detail.description}
                  onChange={(e) => handleOtherDetailChange(index, "description", e.target.value)}
                  className="mt-1 border-purple-200 focus-visible:ring-purple-400"
                />
              </div>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={addOtherDetail}
            className="border-purple-300 text-purple-700 hover:bg-purple-100"
          >
            <Plus className="h-4 w-4 mr-2" />
            சேர்க்க (Add)
          </Button>
        </div>

        <div>
          <Label htmlFor="property-description">சொத்து விவரம் (Property Description)</Label>
          <Textarea
            id="property-description"
            placeholder="சொத்து விவரத்தை உள்ளிடவும்"
            value={formValues.propertyDescription}
            onChange={(e) => handleChange("propertyDescription", e.target.value)}
            className="mt-1 border-purple-200 focus-visible:ring-purple-400"
            rows={6}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>இந்த ஆவணத்தின் மொத்த மதிப்பு (Total Value of this Deed)</Label>
            <div className="flex items-center gap-2">
              <Input
                value={formValues.totalValue}
                onChange={(e) => handleChange("totalValue", e.target.value)}
                className="mt-1 border-purple-200 focus-visible:ring-purple-400"
                type="number"
                step="0.01"
                disabled={!formValues.manualEdit}
              />

              <div className="flex items-center gap-2 mt-1">
                <input
                  type="checkbox"
                  id="manual-edit"
                  checked={formValues.manualEdit}
                  onChange={(e) => handleChange("manualEdit", e.target.checked)}
                  className="rounded border-purple-300 text-purple-600 focus:ring-purple-500"
                />
                <Label htmlFor="manual-edit" className="text-sm">
                  கைமுறையாக திருத்த (Manual Edit)
                </Label>
              </div>
            </div>
          </div>

          <div className="flex items-end">
            <Button
              type="button"
              onClick={recalculateTotalValue}
              className="mt-1 border-purple-300 text-purple-700 hover:bg-purple-100"
              variant="outline"
            >
              மீண்டும் கணக்கிடு (Recalculate)
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
