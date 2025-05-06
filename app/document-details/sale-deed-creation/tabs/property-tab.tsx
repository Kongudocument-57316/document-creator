"use client"

import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getSupabaseBrowserClient } from "@/lib/supabase"
import { Separator } from "@/components/ui/separator"
import { Card } from "@/components/ui/card"
import { Home, MapPin, Plus, FileText } from "lucide-react"
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

  const [formValues, setFormValues] = useState({
    propertyType: data.propertyType || "",
    propertyAddress: data.propertyAddress || "",
    propertyDescription: data.propertyDescription || "",
    propertyArea: data.propertyArea || "",
    propertyValue: data.propertyValue || "",
    northBoundary: data.northBoundary || "",
    southBoundary: data.southBoundary || "",
    eastBoundary: data.eastBoundary || "",
    westBoundary: data.westBoundary || "",
    propertySelectionType: data.propertySelectionType || "existing",
    siteDetails: data.siteDetails || [],
    buildingDetails: data.buildingDetails || [],
    otherDetails: data.otherDetails || [],
    registrationDistrictId: data.registrationDistrictId || "",
    subRegistrarOfficeId: data.subRegistrarOfficeId || "",
    districtId: data.districtId || "",
    talukId: data.talukId || "",
    villageId: data.villageId || "",
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
    updateData(newValues)
  }

  const handlePropertySelectionTypeChange = (value: string) => {
    handleChange("propertySelectionType", value)
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
    updateData(newValues)
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
    updateData(newValues)
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
    updateData(newValues)
  }

  const handleRemoveBuilding = (index: number) => {
    const updatedBuildings = formValues.buildingDetails.filter((_, i) => i !== index)
    const newValues = { ...formValues, buildingDetails: updatedBuildings }
    setFormValues(newValues)
    updateData(newValues)
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

  const handleSelectProperty = (property: any) => {
    setSelectedProperty(property)
  }

  const handleAddAllToDescription = () => {
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

    handleChange("propertyDescription", propertyDetails)
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
              checked={formValues.propertySelectionType === "existing"}
              onCheckedChange={(checked) => {
                if (checked) handlePropertySelectionTypeChange("existing")
                else handlePropertySelectionTypeChange("")
              }}
            />
            <Label htmlFor="existing-property" className="text-purple-700">
              ஏற்கனவே உள்ள சொத்து விவரங்களைப் பயன்படுத்து (Use existing property details)
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="add-site"
              checked={formValues.propertySelectionType === "site"}
              onCheckedChange={(checked) => {
                if (checked) handlePropertySelectionTypeChange("site")
                else handlePropertySelectionTypeChange("")
              }}
            />
            <Label htmlFor="add-site" className="text-purple-700">
              மனை விவரங்களைச் சேர்க்க (Add site details)
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="add-building"
              checked={formValues.propertySelectionType === "building"}
              onCheckedChange={(checked) => {
                if (checked) handlePropertySelectionTypeChange("building")
                else handlePropertySelectionTypeChange("")
              }}
            />
            <Label htmlFor="add-building" className="text-purple-700">
              கட்டிடம் விவரங்கள் சேர்க்க (Add building details)
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="add-other"
              checked={formValues.propertySelectionType === "other"}
              onCheckedChange={(checked) => {
                if (checked) handlePropertySelectionTypeChange("other")
                else handlePropertySelectionTypeChange("")
              }}
            />
            <Label htmlFor="add-other" className="text-purple-700">
              இதர விவரங்கள் சேர்க்க (Add other details)
            </Label>
          </div>
        </div>

        {formValues.propertySelectionType === "site" && (
          <>
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
                <h4 className="text-md font-medium text-purple-700 mb-3">சேர்க்கப்பட்ட மனை விவரங்கள்</h4>
                <ScrollArea className="h-[300px] border rounded-md p-4">
                  <div className="space-y-4">
                    {formValues.siteDetails.map((site, index) => (
                      <Card key={site.id} className="p-4 border-purple-200">
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
          </>
        )}

        {formValues.propertySelectionType === "building" && (
          <>
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
                <h4 className="text-md font-medium text-purple-700 mb-3">சேர்க்கப்பட்ட கட்டட விவரங்கள்</h4>
                <ScrollArea className="h-[300px] border rounded-md p-4">
                  <div className="space-y-4">
                    {formValues.buildingDetails.map((building, index) => (
                      <Card key={building.id} className="p-4 border-purple-200">
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
                              கட்டடத்தின் வயது: {building.buildingAge || "N/A"} ஆண்டுகள் | மொத்த பரப்பளவு:{" "}
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
          </>
        )}

        {formValues.propertySelectionType === "existing" && (
          <Card className="p-4 border-purple-200">
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
                    <Button onClick={handleAddAllToDescription} className="bg-green-600 hover:bg-green-700" size="sm">
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

            <div className="mt-6">
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
            </div>
          </Card>
        )}

        {formValues.propertySelectionType === "other" && (
          <Card className="p-4 border-purple-200">
            <h4 className="text-md font-medium text-purple-700 mb-3 flex items-center">
              <FileText className="h-4 w-4 mr-2 text-purple-600" />
              இதர விவரங்கள் (Other Details)
            </h4>

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
      </div>
    </div>
  )
}
