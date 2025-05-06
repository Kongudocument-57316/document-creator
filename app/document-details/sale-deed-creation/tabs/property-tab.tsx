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
  })

  const [propertyTypes, setPropertyTypes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showSiteForm, setShowSiteForm] = useState(false)
  const [showBuildingForm, setShowBuildingForm] = useState(false)
  const [showOtherDetailsForm, setShowOtherDetailsForm] = useState(false)
  const [editingSiteIndex, setEditingSiteIndex] = useState<number | null>(null)
  const [editingBuildingIndex, setEditingBuildingIndex] = useState<number | null>(null)

  const supabase = getSupabaseBrowserClient()

  useEffect(() => {
    async function fetchPropertyTypes() {
      try {
        setLoading(true)
        const { data: typesData } = await supabase.from("land_types").select("id, name").order("name")
        if (typesData) setPropertyTypes(typesData)
      } catch (error) {
        console.error("Error fetching property types:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPropertyTypes()
  }, [supabase])

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
          <>
            <Card className="p-4 border-purple-200">
              <div className="mb-4">
                <h4 className="text-md font-medium text-purple-700 mb-3">சொத்து தேடல் (Property Search)</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="registration-district" className="text-purple-700">
                      பதிவு மாவட்டம் (Registration District)
                    </Label>
                    <Select>
                      <SelectTrigger
                        id="registration-district"
                        className="mt-1 border-purple-200 focus-visible:ring-purple-400"
                      >
                        <SelectValue placeholder="ஈரோடு" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="erode">ஈரோடு</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="sub-register-office" className="text-purple-700">
                      சார்பதிவாளர் அலுவலகம் (Sub Register Office)
                    </Label>
                    <Select>
                      <SelectTrigger
                        id="sub-register-office"
                        className="mt-1 border-purple-200 focus-visible:ring-purple-400"
                      >
                        <SelectValue placeholder="சார்பதிவாளர் அலுவலகத்தைத் தேர்ந்தெடுக்கவும்" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="office1">அலுவலகம் 1</SelectItem>
                        <SelectItem value="office2">அலுவலகம் 2</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="district" className="text-purple-700">
                      மாவட்டம் (District)
                    </Label>
                    <Select>
                      <SelectTrigger id="district" className="mt-1 border-purple-200 focus-visible:ring-purple-400">
                        <SelectValue placeholder="மாவட்டத்தைத் தேர்ந்தெடுக்கவும்" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="district1">மாவட்டம் 1</SelectItem>
                        <SelectItem value="district2">மாவட்டம் 2</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="taluk" className="text-purple-700">
                      வட்டம் (Taluk)
                    </Label>
                    <Select>
                      <SelectTrigger id="taluk" className="mt-1 border-purple-200 focus-visible:ring-purple-400">
                        <SelectValue placeholder="வட்டத்தைத் தேர்ந்தெடுக்கவும்" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="taluk1">வட்டம் 1</SelectItem>
                        <SelectItem value="taluk2">வட்டம் 2</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="village" className="text-purple-700">
                      கிராமம் (Village)
                    </Label>
                    <Select>
                      <SelectTrigger id="village" className="mt-1 border-purple-200 focus-visible:ring-purple-400">
                        <SelectValue placeholder="கிராமத்தைத் தேர்ந்தெடுக்கவும்" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="village1">கிராமம் 1</SelectItem>
                        <SelectItem value="village2">கிராமம் 2</SelectItem>
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
                        <SelectItem value="land1">நில வகை 1</SelectItem>
                        <SelectItem value="land2">நில வகை 2</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="mt-4">
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    <MapPin className="h-4 w-4 mr-2" /> சொத்துகளைத் தேடு (Search Properties)
                  </Button>
                </div>

                <div className="mt-6">
                  <h5 className="text-md font-medium text-purple-700 mb-2">தேடல் முடிவுகள் (Search Results)</h5>
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
                        <tr className="border-t">
                          <td className="px-4 py-2">சக்தி நகர் குடியிருப்பு மனை</td>
                          <td className="px-4 py-2">சக்தி நகர், ஈரோடு, ஈரோடு</td>
                          <td className="px-4 py-2">567/E</td>
                          <td className="px-4 py-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 px-2 text-blue-600 border-blue-200 hover:bg-blue-50"
                            >
                              தேர்ந்தெடு (Select)
                            </Button>
                          </td>
                        </tr>
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

              <div className="mt-6">
                <div className="flex items-center space-x-2">
                  <h4 className="text-md font-medium text-purple-700">
                    இந்த ஆவணத்தின் மொத்த மதிப்பு (Total Value of this Deed)
                  </h4>
                  <div className="flex items-center ml-auto">
                    <input type="radio" id="manual-edit" name="value-edit" className="mr-2" />
                    <label htmlFor="manual-edit" className="text-sm text-purple-700">
                      கைமுறையாக திருத்த (Manual Edit)
                    </label>
                  </div>
                </div>
                <div className="flex items-center mt-2">
                  <Input value="0.00" className="border-purple-200 focus-visible:ring-purple-400" readOnly />
                  <Button variant="outline" className="ml-2 border-purple-300 text-purple-700">
                    மீண்டும் கணக்கிடு (Recalculate)
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-1">தானாக கணக்கிடப்பட்ட மதிப்பு (Automatically calculated value)</p>
              </div>
            </Card>
          </>
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
