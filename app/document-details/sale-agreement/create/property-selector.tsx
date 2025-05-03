"use client"

import { useState, useEffect } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, X } from "lucide-react"

interface Property {
  id: number
  survey_number: string
  sub_division_number?: string
  land_area?: string
  land_type?: string
  address?: string
  village_id?: number
  villages?: {
    name?: string
    taluk_id?: number
    taluks?: {
      name?: string
      district_id?: number
      districts?: {
        name?: string
        state_id?: number
        states?: {
          name?: string
        }
      }
    }
  }
}

interface PropertySelectorProps {
  selectedProperties: Array<{
    id: string
    details: string
    property?: Property
  }>
  onChange: (properties: Array<{ id: string; details: string; property?: Property }>) => void
}

export function PropertySelector({ selectedProperties, onChange }: PropertySelectorProps) {
  const [properties, setProperties] = useState<Property[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProperties = async () => {
      setIsLoading(true)
      try {
        const supabase = getSupabaseBrowserClient()
        const { data, error } = await supabase
          .from("properties")
          .select(`
            id, survey_number, sub_division_number, land_area, land_type, address, village_id,
            villages:village_id (
              name, taluk_id,
              taluks:taluk_id (
                name, district_id,
                districts:district_id (
                  name, state_id,
                  states:state_id (name)
                )
              )
            )
          `)
          .order("survey_number")

        if (error) throw error
        setProperties(data || [])
      } catch (error) {
        console.error("Error fetching properties:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProperties()
  }, [])

  const handlePropertyChange = (index: number, propertyId: string) => {
    const updatedProperties = [...selectedProperties]
    const selectedProperty = properties.find((p) => p.id.toString() === propertyId)

    updatedProperties[index] = {
      ...updatedProperties[index],
      id: propertyId,
      property: selectedProperty,
    }

    onChange(updatedProperties)
  }

  const handleDetailsChange = (index: number, details: string) => {
    const updatedProperties = [...selectedProperties]
    updatedProperties[index] = {
      ...updatedProperties[index],
      details,
    }
    onChange(updatedProperties)
  }

  const addProperty = () => {
    onChange([...selectedProperties, { id: "", details: "" }])
  }

  const removeProperty = (index: number) => {
    if (selectedProperties.length > 1) {
      const updatedProperties = [...selectedProperties]
      updatedProperties.splice(index, 1)
      onChange(updatedProperties)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-24">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span className="ml-2">சொத்துகளை ஏற்றுகிறது...</span>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {selectedProperties.map((selectedProperty, index) => (
        <div key={index} className="border p-4 rounded-md relative">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">சொத்து {index + 1}</h3>
            {selectedProperties.length > 1 && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8"
                onClick={() => removeProperty(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`property-${index}`}>சொத்தைத் தேர்ந்தெடுக்கவும்</Label>
              <Select value={selectedProperty.id} onValueChange={(value) => handlePropertyChange(index, value)}>
                <SelectTrigger>
                  <SelectValue placeholder="சொத்தைத் தேர்ந்தெடுக்கவும்" />
                </SelectTrigger>
                <SelectContent>
                  {properties.map((property) => (
                    <SelectItem key={property.id} value={property.id.toString()}>
                      {property.survey_number}
                      {property.sub_division_number ? ` / ${property.sub_division_number}` : ""} -
                      {property.villages?.name || ""},{property.villages?.taluks?.name || ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedProperty.id && (
              <div className="space-y-2">
                <Label htmlFor={`property-details-${index}`}>கூடுதல் சொத்து விவரங்கள்</Label>
                <Textarea
                  id={`property-details-${index}`}
                  value={selectedProperty.details}
                  onChange={(e) => handleDetailsChange(index, e.target.value)}
                  placeholder="கூடுதல் சொத்து விவரங்களை உள்ளிடவும்"
                  className="min-h-[100px]"
                />
              </div>
            )}

            {selectedProperty.id && selectedProperty.property && (
              <div className="bg-gray-50 p-3 rounded-md text-sm">
                <h4 className="font-medium mb-2">சொத்து விவரங்கள்:</h4>
                <p>
                  <strong>சர்வே எண்:</strong> {selectedProperty.property.survey_number}
                  {selectedProperty.property.sub_division_number
                    ? ` / ${selectedProperty.property.sub_division_number}`
                    : ""}
                </p>
                <p>
                  <strong>பரப்பளவு:</strong> {selectedProperty.property.land_area || "குறிப்பிடப்படவில்லை"}
                </p>
                <p>
                  <strong>நில வகை:</strong> {selectedProperty.property.land_type || "குறிப்பிடப்படவில்லை"}
                </p>
                <p>
                  <strong>முகவரி:</strong> {selectedProperty.property.address || "குறிப்பிடப்படவில்லை"}
                </p>
                <p>
                  <strong>கிராமம்:</strong> {selectedProperty.property.villages?.name || "குறிப்பிடப்படவில்லை"}
                </p>
                <p>
                  <strong>தாலுகா:</strong> {selectedProperty.property.villages?.taluks?.name || "குறிப்பிடப்படவில்லை"}
                </p>
                <p>
                  <strong>மாவட்டம்:</strong>{" "}
                  {selectedProperty.property.villages?.taluks?.districts?.name || "குறிப்பிடப்படவில்லை"}
                </p>
                <p>
                  <strong>மாநிலம்:</strong>{" "}
                  {selectedProperty.property.villages?.taluks?.districts?.states?.name || "குறிப்பிடப்படவில்லை"}
                </p>
              </div>
            )}
          </div>
        </div>
      ))}

      <Button type="button" variant="outline" onClick={addProperty} className="w-full">
        + சொத்து சேர்
      </Button>
    </div>
  )
}
