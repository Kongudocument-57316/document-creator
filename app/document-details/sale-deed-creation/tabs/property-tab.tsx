"use client"

import { useState, useEffect, useRef } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getSupabaseBrowserClient } from "@/lib/supabase"
import { Separator } from "@/components/ui/separator"
import { Card } from "@/components/ui/card"
import { Home, MapPin, Plus, FileText, Calculator } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SiteDetailsForm } from "../components/site-details-form"
import { BuildingDetailsForm } from "../components/building-details-form"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"

interface PropertyTabProps {
  data: any
  updateData: (data: any) => void
}

export function PropertyTab({ data, updateData }: PropertyTabProps) {
  const [properties, setProperties] = useState<any[]>([])
  const [selectedProperty, setSelectedProperty] = useState<any>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [isManualEdit, setIsManualEdit] = useState(false)
  const initialRender = useRef(true)

  const [formValues, setFormValues] = useState({
    propertyType: data.propertyType || "",
    propertyAddress: data.propertyAddress || "",
    propertyDescription: data.propertyDescription || "",
    propertyArea: data.propertyArea || "",
    propertyValue: data.propertyValue || "0.00",
    northBoundary: data.northBoundary || "",
    southBoundary: data.southBoundary || "",
    eastBoundary: data.eastBoundary || "",
    westBoundary: data.westBoundary || "",
    propertySelectionTypes: data.propertySelectionTypes || {
      existing: data.propertySelectionTypes?.existing || false,
      site: data.propertySelectionTypes?.site || false,
      building: data.propertySelectionTypes?.building || false,
      other: data.propertySelectionTypes?.other || false,
    },
    siteDetails: data.siteDetails || [],
    buildingDetails: data.buildingDetails || [],
    otherDetails: data.otherDetails || [],
    registrationDistrictId: data.registrationDistrictId || "",
    subRegistrarOfficeId: data.subRegistrarOfficeId || "",
    districtId: data.districtId || "",
    talukId: data.talukId || "",
    villageId: data.villageId || "",
    selectedPropertyId: data.selectedPropertyId || null,
  })

  const [propertyTypes, setPropertyTypes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showSiteForm, setShowSiteForm] = useState(false)
  const [showBuildingForm, setShowBuildingForm] = useState(false)
  const [showOtherDetailsForm, setShowOtherDetailsForm] = useState(false)
  const [editingSiteIndex, setEditingSiteIndex] = useState<number | null>(null)
  const [editingBuildingIndex, setEditingBuildingIndex] = useState<number | null>(null)
  const [registrationDistricts, setRegistrationDistricts] = useState<any[]>([])
  const [subRegistrarOffices, setSubRegistrarOffices] = useState<any[]>([])
  const [districts, setDistricts] = useState<any[]>([])
  const [taluks, setTaluks] = useState<any[]>([])
  const [villages, setVillages] = useState<any[]>([])
  const [filteredSubRegistrarOffices, setFilteredSubRegistrarOffices] = useState<any[]>([])
  const [filteredTaluks, setFilteredTaluks] = useState<any[]>([])
  const [filteredVillages, setFilteredVillages] = useState<any[]>([])

  const supabase = getSupabaseBrowserClient()

  useEffect(() => {
    async function fetchPropertyTypes() {
      try {
        setLoading(true)
        const { data: typesData } = await supabase.from("land_types").select("id, name").order("name")
        if (typesData) setPropertyTypes(typesData)

        const { data: registrationDistrictsData } = await supabase
          .from("registration_districts")
          .select("id, name")
          .order("name")
        if (registrationDistrictsData) setRegistrationDistricts(registrationDistrictsData)

        const { data: subRegistrarOfficesData } = await supabase
          .from("sub_registrar_offices")
          .select("id, name, registration_district_id")
          .order("name")
        if (subRegistrarOfficesData) setSubRegistrarOffices(subRegistrarOfficesData)

        const { data: districtsData } = await supabase.from("districts").select("id, name").order("name")
        if (districtsData) setDistricts(districtsData)

        const { data: taluksData } = await supabase.from("taluks").select("id, name, district_id").order("name")
        if (taluksData) setTaluks(taluksData)

        const { data: villagesData } = await supabase.from("villages").select("id, name, taluk_id").order("name")
        if (villagesData) setVillages(villagesData)
      } catch (error) {
        console.error("Error fetching property types:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPropertyTypes()
  }, [supabase])

  // Load selected property if ID exists
  useEffect(() => {
    if (formValues.selectedPropertyId && initialRender.current) {
      initialRender.current = false
      loadPropertyById(formValues.selectedPropertyId)
    }
  }, [formValues.selectedPropertyId])

  // Update parent component when property value changes
  useEffect(() => {
    // Skip on initial render
    if (initialRender.current) {
      initialRender.current = false
      return
    }

    // Only update if the value has actually changed
    if (data.propertyValue !== formValues.propertyValue) {
      updateData({
        ...data,
        propertyValue: formValues.propertyValue,
      })
    }
  }, [formValues.propertyValue])

  useEffect(() => {
    if (formValues.registrationDistrictId && formValues.registrationDistrictId !== "all") {
      const filtered = subRegistrarOffices.filter(
        (office) => office.registration_district_id === Number.parseInt(formValues.registrationDistrictId),
      )
      setFilteredSubRegistrarOffices(filtered)
    } else {
      setFilteredSubRegistrarOffices([])
    }
  }, [formValues.registrationDistrictId, subRegistrarOffices])

  useEffect(() => {
    if (formValues.districtId && formValues.districtId !== "all") {
      const filtered = taluks.filter((taluk) => taluk.district_id === Number.parseInt(formValues.districtId))
      setFilteredTaluks(filtered)
    } else {
      setFilteredTaluks([])
    }
  }, [formValues.districtId, taluks])

  useEffect(() => {
    if (formValues.talukId && formValues.talukId !== "all") {
      const filtered = villages.filter((village) => village.taluk_id === Number.parseInt(formValues.talukId))
      setFilteredVillages(filtered)
    } else {
      setFilteredVillages([])
    }
  }, [formValues.talukId, villages])

  const handleChange = (field: string, value: string) => {
    const newValues = { ...formValues, [field]: value }
    setFormValues(newValues)
    updateData({
      ...data,
      [field]: value,
    })
  }

  const handlePropertySelectionTypeChange = (type: string, checked: boolean) => {
    const newSelectionTypes = { ...formValues.propertySelectionTypes, [type]: checked }
    const newValues = { ...formValues, propertySelectionTypes: newSelectionTypes }
    setFormValues(newValues)
    updateData({
      ...data,
      propertySelectionTypes: newSelectionTypes,
    })
  }

  const handleAddSite = (siteData: any) => {
    let updatedSites

    if (editingSiteIndex !== null) {
      // Update existing site
      updatedSites = [...formValues.siteDetails]
      updatedSites[editingSiteIndex] = siteData
    } else {
      // Add new site
      updatedSites = [...formValues.siteDetails, siteData]
    }

    const newValues = { ...formValues, siteDetails: updatedSites }
    setFormValues(newValues)
    updateData({
      ...data,
      siteDetails: updatedSites,
    })
    setShowSiteForm(false)
    setEditingSiteIndex(null)
  }

  const handleAddBuilding = (buildingData: any) => {
    let updatedBuildings

    if (editingBuildingIndex !== null) {
      // Update existing building
      updatedBuildings = [...formValues.buildingDetails]
      updatedBuildings[editingBuildingIndex] = buildingData
    } else {
      // Add new building
      updatedBuildings = [...formValues.buildingDetails, buildingData]
    }

    const newValues = { ...formValues, buildingDetails: updatedBuildings }
    setFormValues(newValues)
    updateData({
      ...data,
      buildingDetails: updatedBuildings,
    })
    setShowBuildingForm(false)
    setEditingBuildingIndex(null)
  }

  const handleEditSite = (index: number) => {
    setEditingSiteIndex(index)
    setShowSiteForm(true)
  }

  const handleEditBuilding = (index: number) => {
    setEditingBuildingIndex(index)
    setShowBuildingForm(true)
  }

  const handleRemoveSite = (index: number) => {
    const updatedSites = formValues.siteDetails.filter((_, i) => i !== index)
    const newValues = { ...formValues, siteDetails: updatedSites }
    setFormValues(newValues)
    updateData({
      ...data,
      siteDetails: updatedSites,
    })
  }

  const handleRemoveBuilding = (index: number) => {
    const updatedBuildings = formValues.buildingDetails.filter((_, i) => i !== index)
    const newValues = { ...formValues, buildingDetails: updatedBuildings }
    setFormValues(newValues)
    updateData({
      ...data,
      buildingDetails: updatedBuildings,
    })
  }

  const handleSearchProperties = async () => {
    try {
      setIsSearching(true)

      // Build query based on selected filters
      let query = supabase.from("properties").select(`
        *,
        registration_districts:registration_district_id (name),
        sub_registrar_offices:sub_registrar_office_id (name),
        districts:district_id (name),
        taluks:taluk_id (name),
        villages:village_id (name)
      `)

      // Add filters if selected
      if (formValues.registrationDistrictId && formValues.registrationDistrictId !== "all") {
        query = query.eq("registration_district_id", Number.parseInt(formValues.registrationDistrictId))
      }

      if (formValues.subRegistrarOfficeId && formValues.subRegistrarOfficeId !== "all") {
        query = query.eq("sub_registrar_office_id", Number.parseInt(formValues.subRegistrarOfficeId))
      }

      if (formValues.districtId && formValues.districtId !== "all") {
        query = query.eq("district_id", Number.parseInt(formValues.districtId))
      }

      if (formValues.talukId && formValues.talukId !== "all") {
        query = query.eq("taluk_id", Number.parseInt(formValues.talukId))
      }

      if (formValues.villageId && formValues.villageId !== "all") {
        query = query.eq("village_id", Number.parseInt(formValues.villageId))
      }

      const { data, error } = await query.order("property_name")

      if (error) throw error

      const formattedData =
        data?.map((property) => ({
          ...property,
          registration_district_name: property.registration_districts?.name,
          sub_registrar_office_name: property.sub_registrar_offices?.name,
          district_name: property.districts?.name,
          taluk_name: property.taluks?.name,
          village_name: property.villages?.name,
        })) || []

      setProperties(formattedData)
    } catch (error: any) {
      console.error("Error fetching properties:", error)
    } finally {
      setIsSearching(false)
    }
  }

  const loadPropertyById = async (propertyId: number) => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("properties")
        .select(`
          *,
          registration_districts:registration_district_id (name),
          sub_registrar_offices:sub_registrar_office_id (name),
          districts:district_id (name),
          taluks:taluk_id (name),
          villages:village_id (name)
        `)
        .eq("id", propertyId)
        .single()

      if (error) {
        console.error("Error loading property:", error)
        return
      }

      if (data) {
        const formattedProperty = {
          ...data,
          registration_district_name: data.registration_districts?.name,
          sub_registrar_office_name: data.sub_registrar_offices?.name,
          district_name: data.districts?.name,
          taluk_name: data.taluks?.name,
          village_name: data.villages?.name,
        }

        setSelectedProperty(formattedProperty)

        // Update form values with property data
        setFormValues({
          ...formValues,
          propertyType: data.property_type || "",
          propertyAddress: data.address || "",
          propertyArea: data.area_sqft?.toString() || "",
          propertyValue: data.guide_value_sqft?.toString() || "0.00",
          registrationDistrictId: data.registration_district_id?.toString() || "",
          subRegistrarOfficeId: data.sub_registrar_office_id?.toString() || "",
          districtId: data.district_id?.toString() || "",
          talukId: data.taluk_id?.toString() || "",
          villageId: data.village_id?.toString() || "",
        })

        // Update parent component
        updateData({
          ...data,
          propertyType: data.property_type || "",
          propertyAddress: data.address || "",
          propertyArea: data.area_sqft?.toString() || "",
          propertyValue: data.guide_value_sqft?.toString() || "0.00",
          registrationDistrictId: data.registration_district_id?.toString() || "",
          subRegistrarOfficeId: data.sub_registrar_office_id?.toString() || "",
          districtId: data.district_id?.toString() || "",
          talukId: data.taluk_id?.toString() || "",
          villageId: data.village_id?.toString() || "",
          selectedPropertyId: propertyId,
        })
      }
    } catch (error) {
      console.error("Error loading property:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSelectProperty = (property: any) => {
    setSelectedProperty(property)

    // Update form values with selected property data
    setFormValues({
      ...formValues,
      propertyType: property.property_type || "",
      propertyAddress: property.address || "",
      propertyArea: property.area_sqft?.toString() || "",
      propertyValue: property.guide_value_sqft?.toString() || "0.00",
      registrationDistrictId: property.registration_district_id?.toString() || "",
      subRegistrarOfficeId: property.sub_registrar_office_id?.toString() || "",
      districtId: property.district_id?.toString() || "",
      talukId: property.taluk_id?.toString() || "",
      villageId: property.village_id?.toString() || "",
      selectedPropertyId: property.id,
    })

    // Update parent component
    updateData({
      ...data,
      propertyType: property.property_type || "",
      propertyAddress: property.address || "",
      propertyArea: property.area_sqft?.toString() || "",
      propertyValue: property.guide_value_sqft?.toString() || "0.00",
      registrationDistrictId: property.registration_district_id?.toString() || "",
      subRegistrarOfficeId: property.sub_registrar_office_id?.toString() || "",
      districtId: property.district_id?.toString() || "",
      talukId: property.taluk_id?.toString() || "",
      villageId: property.village_id?.toString() || "",
      selectedPropertyId: property.id,
    })
  }

  const handleAddExistingToDescription = () => {
    if (!selectedProperty) return

    const propertyDetails = `
சொத்து பெயர்: ${selectedProperty.property_name || ""}
சர்வே எண்: ${selectedProperty.survey_number || ""}
பதிவு மாவட்டம்: ${selectedProperty.registration_district_name || ""}
சார்பதிவாளர் அலுவலகம்: ${selectedProperty.sub_registrar_office_name || ""}
மாவட்டம்: ${selectedProperty.district_name || ""}
வட்டம்: ${selectedProperty.taluk_name || ""}
கிராமம்: ${selectedProperty.village_name || ""}
வழிகாட்டு மதிப்பு (சதுர மீட்டர்): ${selectedProperty.guide_value_sqm || ""}
வழிகாட்டு மதிப்பு (சதுர அடி): ${selectedProperty.guide_value_sqft || ""}
  `.trim()

    const currentDescription = formValues.propertyDescription
    const newDescription = currentDescription ? `${currentDescription}\n\n${propertyDetails}` : propertyDetails
    handleChange("propertyDescription", newDescription)
  }

  const handleAddSiteDetailsToDescription = () => {
    if (formValues.siteDetails.length === 0) return

    const siteDetailsText = formValues.siteDetails
      .map((site, index) => {
        return `
மனை விவரங்கள் #${index + 1}:
மனை எண்: ${site.plotNumber || "N/A"}
சர்வே எண்: ${site.surveyNumber || "N/A"}
மொத்த அளவு: ${site.totalAreaSqFt || "N/A"} சதுரடி
வடக்கு எல்லை: ${site.northBoundary || "N/A"}
தெற்கு எல்லை: ${site.southBoundary || "N/A"}
கிழக்கு எல்லை: ${site.eastBoundary || "N/A"}
மேற்கு எல்லை: ${site.westBoundary || "N/A"}
மதிப்பு: ${site.siteValue || "N/A"} ரூபாய்
      `.trim()
      })
      .join("\n\n")

    const currentDescription = formValues.propertyDescription
    const newDescription = currentDescription ? `${currentDescription}\n\n${siteDetailsText}` : siteDetailsText
    handleChange("propertyDescription", newDescription)
  }

  const handleAddBuildingDetailsToDescription = () => {
    if (formValues.buildingDetails.length === 0) return

    const buildingDetailsText = formValues.buildingDetails
      .map((building, index) => {
        return `
கட்டட விவரங்கள் #${index + 1}:
கட்டட வகை: ${
          building.buildingType === "residential"
            ? "குடியிருப்பு"
            : building.buildingType === "commercial"
              ? "வணிக"
              : building.buildingType === "industrial"
                ? "தொழில்"
                : building.buildingType === "agricultural"
                  ? "விவசாய"
                  : "N/A"
        }
கட்டடத்தின் வயது: ${building.buildingAge || "N/A"} ஆண்டுகள்
மொத்த பரப்பளவு: ${building.totalAreaSqFt || "N/A"} சதுரடி
கதவு எண்: ${building.doorNumber || "N/A"}
திசை: ${building.direction || "N/A"}
மதிப்பு: ${building.buildingValue || "N/A"} ரூபாய்
      `.trim()
      })
      .join("\n\n")

    const currentDescription = formValues.propertyDescription
    const newDescription = currentDescription ? `${currentDescription}\n\n${buildingDetailsText}` : buildingDetailsText
    handleChange("propertyDescription", newDescription)
  }

  const handleAddOtherDetailsToDescription = () => {
    if (formValues.otherDetails.length === 0) return

    const otherDetailsText = formValues.otherDetails
      .map((detail, index) => {
        return `
இதர விவரங்கள் #${index + 1}:
வகை: ${detail.type || "N/A"}
விளக்கம்: ${detail.description || "N/A"}
மதிப்பு: ${detail.value || "N/A"} ரூபாய்
      `.trim()
      })
      .join("\n\n")

    const currentDescription = formValues.propertyDescription
    const newDescription = currentDescription ? `${currentDescription}\n\n${otherDetailsText}` : otherDetailsText
    handleChange("propertyDescription", newDescription)
  }

  const recalculatePropertyValue = () => {
    let totalValue = 0

    // Add site values
    formValues.siteDetails.forEach((site) => {
      if (site.siteValue && !isNaN(Number.parseFloat(site.siteValue))) {
        totalValue += Number.parseFloat(site.siteValue)
      }
    })

    // Add building values
    formValues.buildingDetails.forEach((building) => {
      if (building.buildingValue && !isNaN(Number.parseFloat(building.buildingValue))) {
        totalValue += Number.parseFloat(building.buildingValue)
      }
    })

    // Add other values
    formValues.otherDetails.forEach((detail) => {
      if (detail.value && !isNaN(Number.parseFloat(detail.value))) {
        totalValue += Number.parseFloat(detail.value)
      }
    })

    // Update property value
    handleChange("propertyValue", totalValue.toFixed(2))
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="text-xl font-semibold text-purple-800 flex items-center">
          <Home className="h-5 w-5 mr-2 text-purple-600" />
          சொத்து விவரங்கள்
        </h3>
        <Separator className="my-4 bg-purple-200" />

        <div className="space-y-3 mb-6">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="existing-property"
              checked={formValues.propertySelectionTypes.existing}
              onCheckedChange={(checked) => handlePropertySelectionTypeChange("existing", !!checked)}
            />
            <Label htmlFor="existing-property" className="text-purple-700">
              ஏற்கனவே உள்ள சொத்து விவரங்களைப் பயன்படுத்து (Use existing property details)
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="add-site"
              checked={formValues.propertySelectionTypes.site}
              onCheckedChange={(checked) => handlePropertySelectionTypeChange("site", !!checked)}
            />
            <Label htmlFor="add-site" className="text-purple-700">
              மனை விவரங்களைச் சேர்க்க (Add site details)
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="add-building"
              checked={formValues.propertySelectionTypes.building}
              onCheckedChange={(checked) => handlePropertySelectionTypeChange("building", !!checked)}
            />
            <Label htmlFor="add-building" className="text-purple-700">
              கட்டிடம் விவரங்கள் சேர்க்க (Add building details)
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="add-other"
              checked={formValues.propertySelectionTypes.other}
              onCheckedChange={(checked) => handlePropertySelectionTypeChange("other", !!checked)}
            />
            <Label htmlFor="add-other" className="text-purple-700">
              இதர விவரங்கள் சேர்க்க (Add other details)
            </Label>
          </div>
        </div>

        {formValues.propertySelectionTypes.existing && (
          <Card className="p-4 border-purple-200 mb-6">
            <div className="mb-4">
              <h4 className="text-md font-medium text-purple-700 mb-3">சொத்து தேடல் (Property Search)</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="registration-district" className="text-purple-700">
                    பதிவு மாவட்டம் (Registration District)
                  </Label>
                  <Select
                    value={formValues.registrationDistrictId}
                    onValueChange={(value) => handleChange("registrationDistrictId", value)}
                  >
                    <SelectTrigger
                      id="registration-district"
                      className="mt-1 border-purple-200 focus-visible:ring-purple-400"
                    >
                      <SelectValue placeholder="பதிவு மாவட்டத்தைத் தேர்ந்தெடுக்கவும்" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">அனைத்தும்</SelectItem>
                      {registrationDistricts.map((district) => (
                        <SelectItem key={district.id} value={district.id.toString()}>
                          {district.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="sub-register-office" className="text-purple-700">
                    சார்பதிவாளர் அலுவலகம் (Sub Register Office)
                  </Label>
                  <Select
                    value={formValues.subRegistrarOfficeId}
                    onValueChange={(value) => handleChange("subRegistrarOfficeId", value)}
                    disabled={!formValues.registrationDistrictId || formValues.registrationDistrictId === "all"}
                  >
                    <SelectTrigger
                      id="sub-register-office"
                      className="mt-1 border-purple-200 focus-visible:ring-purple-400"
                    >
                      <SelectValue placeholder="சார்பதிவாளர் அலுவலகத்தைத் தேர்ந்தெடுக்கவும்" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">அனைத்தும்</SelectItem>
                      {filteredSubRegistrarOffices.map((office) => (
                        <SelectItem key={office.id} value={office.id.toString()}>
                          {office.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="district" className="text-purple-700">
                    மாவட்டம் (District)
                  </Label>
                  <Select value={formValues.districtId} onValueChange={(value) => handleChange("districtId", value)}>
                    <SelectTrigger id="district" className="mt-1 border-purple-200 focus-visible:ring-purple-400">
                      <SelectValue placeholder="மாவட்டத்தைத் தேர்ந்தெடுக்கவும்" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">அனைத்தும்</SelectItem>
                      {districts.map((district) => (
                        <SelectItem key={district.id} value={district.id.toString()}>
                          {district.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="taluk" className="text-purple-700">
                    வட்டம் (Taluk)
                  </Label>
                  <Select
                    value={formValues.talukId}
                    onValueChange={(value) => handleChange("talukId", value)}
                    disabled={!formValues.districtId || formValues.districtId === "all"}
                  >
                    <SelectTrigger id="taluk" className="mt-1 border-purple-200 focus-visible:ring-purple-400">
                      <SelectValue placeholder="வட்டத்தைத் தேர்ந்தெடுக்கவும்" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">அனைத்தும்</SelectItem>
                      {filteredTaluks.map((taluk) => (
                        <SelectItem key={taluk.id} value={taluk.id.toString()}>
                          {taluk.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="village" className="text-purple-700">
                    கிராமம் (Village)
                  </Label>
                  <Select
                    value={formValues.villageId}
                    onValueChange={(value) => handleChange("villageId", value)}
                    disabled={!formValues.talukId || formValues.talukId === "all"}
                  >
                    <SelectTrigger id="village" className="mt-1 border-purple-200 focus-visible:ring-purple-400">
                      <SelectValue placeholder="கிராமத்தைத் தேர்ந்தெடுக்கவும்" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">அனைத்தும்</SelectItem>
                      {filteredVillages.map((village) => (
                        <SelectItem key={village.id} value={village.id.toString()}>
                          {village.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="land-type" className="text-purple-700">
                    நில வகை (Land Type)
                  </Label>
                  <Select>
                    <SelectTrigger id="land-type" className="mt-1 border-purple-200 focus-visible:ring-purple-400">
                      <SelectValue placeholder="நில வகையைத் தேர்ந்தெடுக்கவும்" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">அனைத்தும்</SelectItem>
                      {propertyTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id.toString()}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="mt-4">
                <Button
                  className="w-full bg-purple-600 hover:bg-purple-700"
                  onClick={handleSearchProperties}
                  disabled={isSearching}
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  {isSearching ? "தேடுகிறது..." : "சொத்துகளைத் தேடு (Search Properties)"}
                </Button>
              </div>

              <div className="mt-6">
                <div className="flex justify-between items-center mb-2">
                  <h5 className="text-md font-medium text-purple-700">தேடல் முடிவுகள் (Search Results)</h5>
                  {selectedProperty && (
                    <Button
                      onClick={handleAddExistingToDescription}
                      className="bg-green-600 hover:bg-green-700"
                      size="sm"
                    >
                      <Plus className="h-4 w-4 mr-2" /> அனைத்து விவரங்களையும் சேர்க்க
                    </Button>
                  )}
                </div>
                <div className="border rounded-md overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-purple-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-purple-700">சொத்து பெயர் (Property Name)</th>
                        <th className="px-4 py-2 text-left text-purple-700">இடம் (Location)</th>
                        <th className="px-4 py-2 text-left text-purple-700">சர்வே எண் (Survey No)</th>
                        <th className="px-4 py-2 text-left text-purple-700"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {properties.length === 0 ? (
                        <tr className="border-t">
                          <td colSpan={4} className="px-4 py-4 text-center text-gray-500">
                            {isSearching ? "தேடுகிறது..." : "சொத்துகள் எதுவும் கிடைக்கவில்லை. தேடலைத் தொடங்கவும்."}
                          </td>
                        </tr>
                      ) : (
                        properties.map((property) => (
                          <tr
                            key={property.id}
                            className={`border-t ${selectedProperty?.id === property.id ? "bg-purple-50" : ""}`}
                          >
                            <td className="px-4 py-2">{property.property_name}</td>
                            <td className="px-4 py-2">
                              {[property.village_name, property.taluk_name, property.district_name]
                                .filter(Boolean)
                                .join(", ")}
                            </td>
                            <td className="px-4 py-2">{property.survey_number}</td>
                            <td className="px-4 py-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleSelectProperty(property)}
                                className={`h-8 px-2 ${
                                  selectedProperty?.id === property.id
                                    ? "bg-purple-100 text-purple-700 border-purple-300"
                                    : "text-blue-600 border-blue-200 hover:bg-blue-50"
                                }`}
                              >
                                {selectedProperty?.id === property.id ? "தேர்ந்தெடுக்கப்பட்டது" : "தேர்ந்தெடு (Select)"}
                              </Button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </Card>
        )}

        {formValues.propertySelectionTypes.site && (
          <Card className="p-4 border-purple-200 mb-6">
            {!showSiteForm && (
              <Button
                onClick={() => {
                  setShowSiteForm(true)
                  setEditingSiteIndex(null)
                }}
                className="w-full bg-purple-600 hover:bg-purple-700 mb-4"
              >
                <Plus className="h-4 w-4 mr-2" /> புதிய மனை விவரங்கள் சேர்க்க (Add New Site Details)
              </Button>
            )}

            {showSiteForm && (
              <SiteDetailsForm
                onSave={handleAddSite}
                onCancel={() => {
                  setShowSiteForm(false)
                  setEditingSiteIndex(null)
                }}
                initialData={editingSiteIndex !== null ? formValues.siteDetails[editingSiteIndex] : {}}
              />
            )}

            {formValues.siteDetails.length > 0 && !showSiteForm && (
              <div className="mt-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-md font-medium text-purple-700">சேர்க்கப்பட்ட மனை விவரங்கள்</h4>
                  <Button
                    onClick={handleAddSiteDetailsToDescription}
                    className="bg-green-600 hover:bg-green-700"
                    size="sm"
                  >
                    <Plus className="h-4 w-4 mr-2" /> அனைத்து விவரங்களையும் சேர்க்க
                  </Button>
                </div>
                <ScrollArea className="h-[300px] border rounded-md p-4">
                  <div className="space-y-4">
                    {formValues.siteDetails.map((site, index) => (
                      <Card key={site.id || index} className="p-4 border-purple-200">
                        <div className="flex justify-between items-start">
                          <div>
                            <h5 className="font-medium text-purple-800">மனை எண்: {site.plotNumber || "N/A"}</h5>
                            <p className="text-sm text-gray-600">
                              சர்வே எண்: {site.surveyNumber || "N/A"} | மொத்த அளவு: {site.totalAreaSqFt || "N/A"} சதுரடி
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditSite(index)}
                              className="h-8 px-2 text-blue-600 border-blue-200 hover:bg-blue-50"
                            >
                              திருத்து
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRemoveSite(index)}
                              className="h-8 px-2 text-red-600 border-red-200 hover:bg-red-50"
                            >
                              நீக்கு
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}
          </Card>
        )}

        {formValues.propertySelectionTypes.building && (
          <Card className="p-4 border-purple-200 mb-6">
            {!showBuildingForm && (
              <Button
                onClick={() => {
                  setShowBuildingForm(true)
                  setEditingBuildingIndex(null)
                }}
                className="w-full bg-purple-600 hover:bg-purple-700 mb-4"
              >
                <Plus className="h-4 w-4 mr-2" /> புதிய கட்டட விவரங்கள் சேர்க்க (Add New Building Details)
              </Button>
            )}

            {showBuildingForm && (
              <BuildingDetailsForm
                onSave={handleAddBuilding}
                onCancel={() => {
                  setShowBuildingForm(false)
                  setEditingBuildingIndex(null)
                }}
                initialData={editingBuildingIndex !== null ? formValues.buildingDetails[editingBuildingIndex] : {}}
              />
            )}

            {formValues.buildingDetails.length > 0 && !showBuildingForm && (
              <div className="mt-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-md font-medium text-purple-700">சேர்க்கப்பட்ட கட்டட விவரங்கள்</h4>
                  <Button
                    onClick={handleAddBuildingDetailsToDescription}
                    className="bg-green-600 hover:bg-green-700"
                    size="sm"
                  >
                    <Plus className="h-4 w-4 mr-2" /> அனைத்து விவரங்களையும் சேர்க்க
                  </Button>
                </div>
                <ScrollArea className="h-[300px] border rounded-md p-4">
                  <div className="space-y-4">
                    {formValues.buildingDetails.map((building, index) => (
                      <Card key={building.id || index} className="p-4 border-purple-200">
                        <div className="flex justify-between items-start">
                          <div>
                            <h5 className="font-medium text-purple-800">
                              கட்டட வகை:{" "}
                              {building.buildingType === "residential"
                                ? "குடியிருப்பு"
                                : building.buildingType === "commercial"
                                  ? "வணிக"
                                  : building.buildingType === "industrial"
                                    ? "தொழில்"
                                    : building.buildingType === "agricultural"
                                      ? "விவசாய"
                                      : "N/A"}
                            </h5>
                            <p className="text-sm text-gray-600">
                              கட்டடத்தின் வயது: {building.buildingAge || "N/A"} ஆண்டுகள் | மொத்த பரப்பளவு:
                              {building.totalAreaSqFt || "N/A"} சதுரடி
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditBuilding(index)}
                              className="h-8 px-2 text-blue-600 border-blue-200 hover:bg-blue-50"
                            >
                              திருத்து
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRemoveBuilding(index)}
                              className="h-8 px-2 text-red-600 border-red-200 hover:bg-red-50"
                            >
                              நீக்கு
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}
          </Card>
        )}

        {formValues.propertySelectionTypes.other && (
          <Card className="p-4 border-purple-200 mb-6">
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-md font-medium text-purple-700 flex items-center">
                <FileText className="h-4 w-4 mr-2 text-purple-600" />
                இதர விவரங்கள் (Other Details)
              </h4>
              <Button
                onClick={handleAddOtherDetailsToDescription}
                className="bg-green-600 hover:bg-green-700"
                size="sm"
              >
                <Plus className="h-4 w-4 mr-2" /> அனைத்து விவரங்களையும் சேர்க்க
              </Button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="value-type" className="text-purple-700">
                    மதிப்பு வகை (Value Type)
                  </Label>
                  <Select>
                    <SelectTrigger id="value-type" className="mt-1 border-purple-200 focus-visible:ring-purple-400">
                      <SelectValue placeholder="மதிப்பு வகையைத் தேர்ந்தெடுக்கவும் (Select value type)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="land">நிலம் (Land)</SelectItem>
                      <SelectItem value="building">கட்டிடம் (Building)</SelectItem>
                      <SelectItem value="other">மற்றவை (Other)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="amount" className="text-purple-700">
                    தொகை (Amount)
                  </Label>
                  <Input
                    id="amount"
                    placeholder="தொகையை உள்ளிடவும் (Enter amount)"
                    className="mt-1 border-purple-200 focus-visible:ring-purple-400"
                  />
                </div>
                <div>
                  <Label htmlFor="description" className="text-purple-700">
                    விளக்கம் (Description)
                  </Label>
                  <Input
                    id="description"
                    placeholder="விளக்கத்தை உள்ளிடவும் (Enter description)"
                    className="mt-1 border-purple-200 focus-visible:ring-purple-400"
                  />
                </div>
              </div>

              <Button className="bg-purple-600 hover:bg-purple-700">
                <Plus className="h-4 w-4 mr-2" /> சேர்க்க (Add)
              </Button>
            </div>
          </Card>
        )}

        {/* Property Description - Always visible */}
        <Card className="p-4 border-purple-200 mb-6">
          <Label htmlFor="property-description" className="text-purple-700">
            சொத்து விவரம் (Property Description)
          </Label>
          <Textarea
            id="property-description"
            placeholder="சொத்து விளக்கத்தை உள்ளிடவும்"
            value={formValues.propertyDescription}
            onChange={(e) => handleChange("propertyDescription", e.target.value)}
            className="mt-1 border-purple-200 focus-visible:ring-purple-400 h-32"
          />
        </Card>

        {/* Total Value Section */}
        <Card className="p-4 border-purple-200">
          <div className="flex items-center justify-between">
            <h4 className="text-md font-medium text-purple-700">இந்த ஆவணத்தின் மொத்த மதிப்பு (Total Value of this Deed)</h4>
            <div className="flex items-center">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="manual-edit-property"
                  checked={isManualEdit}
                  onChange={(e) => setIsManualEdit(e.target.checked)}
                  className="rounded text-purple-600 focus:ring-purple-500"
                />
                <Label htmlFor="manual-edit-property" className="text-sm text-purple-700">
                  கைமுறையாக திருத்த (Manual Edit)
                </Label>
              </div>
            </div>
          </div>
          <div className="flex items-center mt-2">
            <Input
              value={formValues.propertyValue}
              onChange={(e) => handleChange("propertyValue", e.target.value)}
              className="border-purple-200 focus-visible:ring-purple-400"
              readOnly={!isManualEdit}
            />
            <Button
              variant="outline"
              className="ml-2 border-purple-300 text-purple-700"
              onClick={recalculatePropertyValue}
            >
              <Calculator className="h-4 w-4 mr-2" />
              மீண்டும் கணக்கிடு (Recalculate)
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-1">தானாக கணக்கிடப்பட்ட மதிப்பு (Automatically calculated value)</p>
        </Card>
      </div>
    </div>
  )
}
