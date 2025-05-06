"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getSupabaseBrowserClient } from "@/lib/supabase"
import { Separator } from "@/components/ui/separator"
import { Card } from "@/components/ui/card"
import { Home, MapPin, Ruler } from "lucide-react"
import { useEffect } from "react"

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
  })

  const [propertyTypes, setPropertyTypes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

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

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="text-xl font-semibold text-purple-800 flex items-center">
          <Home className="h-5 w-5 mr-2 text-purple-600" />
          சொத்து விவரங்கள்
        </h3>
        <Separator className="my-4 bg-purple-200" />

        <Card className="p-4 border-purple-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="property-type" className="text-purple-700">
                சொத்து வகை (Property Type)
              </Label>
              <Select value={formValues.propertyType} onValueChange={(value) => handleChange("propertyType", value)}>
                <SelectTrigger className="mt-1 border-purple-200 focus-visible:ring-purple-400">
                  <SelectValue placeholder="சொத்து வகையைத் தேர்ந்தெடுக்கவும்" />
                </SelectTrigger>
                <SelectContent>
                  {propertyTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id.toString()}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="property-value" className="text-purple-700">
                சொத்தின் மதிப்பு (Property Value)
              </Label>
              <Input
                id="property-value"
                placeholder="சொத்தின் மதிப்பை உள்ளிடவும்"
                value={formValues.propertyValue}
                onChange={(e) => handleChange("propertyValue", e.target.value)}
                className="mt-1 border-purple-200 focus-visible:ring-purple-400"
              />
            </div>
          </div>
        </Card>

        <Separator className="my-4 bg-purple-200" />

        <Card className="p-4 border-purple-200 mt-4">
          <h4 className="text-md font-medium text-purple-700 mb-3 flex items-center">
            <MapPin className="h-4 w-4 mr-2 text-purple-600" />
            சொத்து முகவரி மற்றும் விளக்கம்
          </h4>
          <div className="space-y-4">
            <div>
              <Label htmlFor="property-address" className="text-purple-700">
                சொத்து முகவரி (Property Address)
              </Label>
              <Textarea
                id="property-address"
                placeholder="சொத்து முகவரியை உள்ளிடவும்"
                value={formValues.propertyAddress}
                onChange={(e) => handleChange("propertyAddress", e.target.value)}
                className="mt-1 border-purple-200 focus-visible:ring-purple-400"
              />
            </div>

            <div>
              <Label htmlFor="property-description" className="text-purple-700">
                சொத்து விளக்கம் (Property Description)
              </Label>
              <Textarea
                id="property-description"
                placeholder="சொத்து விளக்கத்தை உள்ளிடவும்"
                value={formValues.propertyDescription}
                onChange={(e) => handleChange("propertyDescription", e.target.value)}
                className="mt-1 border-purple-200 focus-visible:ring-purple-400"
              />
            </div>
          </div>
        </Card>

        <Separator className="my-4 bg-purple-200" />

        <Card className="p-4 border-purple-200 mt-4">
          <h4 className="text-md font-medium text-purple-700 mb-3 flex items-center">
            <Ruler className="h-4 w-4 mr-2 text-purple-600" />
            சொத்து அளவு மற்றும் எல்லைகள்
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <Label htmlFor="property-area" className="text-purple-700">
                சொத்தின் அளவு (Property Area)
              </Label>
              <Input
                id="property-area"
                placeholder="சொத்தின் அளவை உள்ளிடவும்"
                value={formValues.propertyArea}
                onChange={(e) => handleChange("propertyArea", e.target.value)}
                className="mt-1 border-purple-200 focus-visible:ring-purple-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="north-boundary" className="text-purple-700">
                வடக்கு எல்லை (North Boundary)
              </Label>
              <Input
                id="north-boundary"
                placeholder="வடக்கு எல்லையை உள்ளிடவும்"
                value={formValues.northBoundary}
                onChange={(e) => handleChange("northBoundary", e.target.value)}
                className="mt-1 border-purple-200 focus-visible:ring-purple-400"
              />
            </div>

            <div>
              <Label htmlFor="south-boundary" className="text-purple-700">
                தெற்கு எல்லை (South Boundary)
              </Label>
              <Input
                id="south-boundary"
                placeholder="தெற்கு எல்லையை உள்ளிடவும்"
                value={formValues.southBoundary}
                onChange={(e) => handleChange("southBoundary", e.target.value)}
                className="mt-1 border-purple-200 focus-visible:ring-purple-400"
              />
            </div>

            <div>
              <Label htmlFor="east-boundary" className="text-purple-700">
                கிழக்கு எல்லை (East Boundary)
              </Label>
              <Input
                id="east-boundary"
                placeholder="கிழக்கு எல்லையை உள்ளிடவும்"
                value={formValues.eastBoundary}
                onChange={(e) => handleChange("eastBoundary", e.target.value)}
                className="mt-1 border-purple-200 focus-visible:ring-purple-400"
              />
            </div>

            <div>
              <Label htmlFor="west-boundary" className="text-purple-700">
                மேற்கு எல்லை (West Boundary)
              </Label>
              <Input
                id="west-boundary"
                placeholder="மேற்கு எல்லையை உள்ளிடவும்"
                value={formValues.westBoundary}
                onChange={(e) => handleChange("westBoundary", e.target.value)}
                className="mt-1 border-purple-200 focus-visible:ring-purple-400"
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
