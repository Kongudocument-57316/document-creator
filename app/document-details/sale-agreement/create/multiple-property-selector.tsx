"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PlusCircle, Trash2 } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface Property {
  id: string
  name: string
  description: string
  surveyNo: string
  area: string
  value: string
}

interface MultiplePropertySelectorProps {
  properties: Property[]
  selectedProperties: Property[]
  onPropertiesChange: (properties: Property[]) => void
}

export function MultiplePropertySelector({
  properties,
  selectedProperties,
  onPropertiesChange,
}: MultiplePropertySelectorProps) {
  const [propertySelections, setPropertySelections] = useState<Property[]>(
    selectedProperties.length > 0
      ? selectedProperties
      : [
          {
            id: "",
            name: "",
            description: "",
            surveyNo: "",
            area: "",
            value: "",
          },
        ],
  )

  // Add an empty property if none exists - only run once on mount
  useEffect(() => {
    if (selectedProperties.length === 0 && propertySelections.length === 0) {
      setPropertySelections([
        {
          id: "",
          name: "",
          description: "",
          surveyNo: "",
          area: "",
          value: "",
        },
      ])
    }
  }, []) // Empty dependency array means this runs once on mount

  // Update parent component when selections change - but avoid the infinite loop
  useEffect(() => {
    // Only notify parent if our internal state is different from the props
    // This prevents the infinite loop of updates
    if (JSON.stringify(propertySelections) !== JSON.stringify(selectedProperties)) {
      onPropertiesChange(propertySelections)
    }
  }, [propertySelections]) // Only depend on propertySelections, not onPropertiesChange

  const addNewProperty = useCallback(() => {
    setPropertySelections((prev) => [
      ...prev,
      {
        id: "",
        name: "",
        description: "",
        surveyNo: "",
        area: "",
        value: "",
      },
    ])
  }, [])

  const removeProperty = useCallback((index: number) => {
    setPropertySelections((prev) => {
      const updatedProperties = [...prev]
      updatedProperties.splice(index, 1)

      // Ensure at least one property exists
      if (updatedProperties.length === 0) {
        return [
          {
            id: "",
            name: "",
            description: "",
            surveyNo: "",
            area: "",
            value: "",
          },
        ]
      }

      return updatedProperties
    })
  }, [])

  const handlePropertyChange = useCallback(
    (index: number, propertyId: string) => {
      const selectedProperty = properties.find((p) => p.id === propertyId)
      if (!selectedProperty) return

      setPropertySelections((prev) => {
        const updatedProperties = [...prev]
        updatedProperties[index] = selectedProperty
        return updatedProperties
      })
    },
    [properties],
  )

  const handlePropertyFieldChange = useCallback((index: number, field: keyof Property, value: string) => {
    setPropertySelections((prev) => {
      const updatedProperties = [...prev]
      updatedProperties[index] = {
        ...updatedProperties[index],
        [field]: value,
      }
      return updatedProperties
    })
  }, [])

  return (
    <div className="space-y-4 mb-16">
      <div className="flex justify-between items-center">
        <Label className="text-lg font-semibold">சொத்து விவரங்கள்</Label>
        <Button type="button" variant="outline" size="sm" onClick={addNewProperty} className="flex items-center gap-1">
          <PlusCircle className="h-4 w-4" />
          சொத்து சேர்க்க
        </Button>
      </div>

      {propertySelections.map((property, index) => (
        <Card key={index} className="relative">
          <CardContent className="pt-6 pb-4">
            <div className="absolute top-2 right-2">
              {propertySelections.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeProperty(index)}
                  className="h-8 w-8 p-0"
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                  <span className="sr-only">சொத்தை நீக்கு</span>
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`property-${index}`}>சொத்து தேர்வு</Label>
                <Select value={property.id || ""} onValueChange={(value) => handlePropertyChange(index, value)}>
                  <SelectTrigger id={`property-${index}`}>
                    <SelectValue placeholder="சொத்தைத் தேர்ந்தெடுக்கவும்" />
                  </SelectTrigger>
                  <SelectContent>
                    {properties.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`survey-${index}`}>சர்வே எண்</Label>
                <Input
                  id={`survey-${index}`}
                  value={property.surveyNo || ""}
                  onChange={(e) => handlePropertyFieldChange(index, "surveyNo", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`area-${index}`}>பரப்பளவு</Label>
                <Input
                  id={`area-${index}`}
                  value={property.area || ""}
                  onChange={(e) => handlePropertyFieldChange(index, "area", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`value-${index}`}>மதிப்பு</Label>
                <Input
                  id={`value-${index}`}
                  value={property.value || ""}
                  onChange={(e) => handlePropertyFieldChange(index, "value", e.target.value)}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor={`description-${index}`}>சொத்து விளக்கம்</Label>
                <Textarea
                  id={`description-${index}`}
                  value={property.description || ""}
                  onChange={(e) => handlePropertyFieldChange(index, "description", e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
