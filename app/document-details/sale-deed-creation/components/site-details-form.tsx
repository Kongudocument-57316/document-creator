"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RequiredFieldLabel } from "./required-field-label"

interface SiteDetailsFormProps {
  onSave: (data: any) => void
  onCancel: () => void
  initialData?: any
}

export function SiteDetailsForm({ onSave, onCancel, initialData = {} }: SiteDetailsFormProps) {
  const [formData, setFormData] = useState({
    plotNumber: initialData.plotNumber || "",
    northBoundary: initialData.northBoundary || "",
    southBoundary: initialData.southBoundary || "",
    eastBoundary: initialData.eastBoundary || "",
    westBoundary: initialData.westBoundary || "",
    northMeasurement: initialData.northMeasurement || "",
    southMeasurement: initialData.southMeasurement || "",
    eastMeasurement: initialData.eastMeasurement || "",
    westMeasurement: initialData.westMeasurement || "",
    totalAreaSqFt: initialData.totalAreaSqFt || "",
    totalAreaSqM: initialData.totalAreaSqM || "",
    surveyNumberType: initialData.surveyNumberType || "old",
    surveyNumber: initialData.surveyNumber || "",
    guideValuePerSqM: initialData.guideValuePerSqM || "",
    propertyValue: initialData.propertyValue || "",
    id: initialData.id || Date.now().toString(),
  })

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSave = () => {
    onSave(formData)
  }

  return (
    <Card className="p-6 border-purple-200 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-purple-800">புதிய மனை விவரங்கள் சேர்க்க (Add New Site Details)</h3>
      </div>

      <div className="space-y-4">
        <div>
          <RequiredFieldLabel htmlFor="plot-number" className="text-purple-700">
            மனை எண் (Plot Number)
          </RequiredFieldLabel>
          <Input
            id="plot-number"
            placeholder="மனை எண்ணை உள்ளிடவும்"
            value={formData.plotNumber}
            onChange={(e) => handleChange("plotNumber", e.target.value)}
            className="mt-1 border-purple-200 focus-visible:ring-purple-400"
          />
        </div>

        <div>
          <Label className="text-purple-700 font-medium">எல்லைகள் (Boundaries)</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <div>
              <Label htmlFor="north-boundary" className="text-purple-700">
                வடக்கு (North)
              </Label>
              <Input
                id="north-boundary"
                placeholder="வடக்கு எல்லையை உள்ளிடவும்"
                value={formData.northBoundary}
                onChange={(e) => handleChange("northBoundary", e.target.value)}
                className="mt-1 border-purple-200 focus-visible:ring-purple-400"
              />
            </div>
            <div>
              <Label htmlFor="east-boundary" className="text-purple-700">
                கிழக்கு (East)
              </Label>
              <Input
                id="east-boundary"
                placeholder="கிழக்கு எல்லையை உள்ளிடவும்"
                value={formData.eastBoundary}
                onChange={(e) => handleChange("eastBoundary", e.target.value)}
                className="mt-1 border-purple-200 focus-visible:ring-purple-400"
              />
            </div>
            <div>
              <Label htmlFor="south-boundary" className="text-purple-700">
                தெற்கு (South)
              </Label>
              <Input
                id="south-boundary"
                placeholder="தெற்கு எல்லையை உள்ளிடவும்"
                value={formData.southBoundary}
                onChange={(e) => handleChange("southBoundary", e.target.value)}
                className="mt-1 border-purple-200 focus-visible:ring-purple-400"
              />
            </div>
            <div>
              <Label htmlFor="west-boundary" className="text-purple-700">
                மேற்கு (West)
              </Label>
              <Input
                id="west-boundary"
                placeholder="மேற்கு எல்லையை உள்ளிடவும்"
                value={formData.westBoundary}
                onChange={(e) => handleChange("westBoundary", e.target.value)}
                className="mt-1 border-purple-200 focus-visible:ring-purple-400"
              />
            </div>
          </div>
        </div>

        <div>
          <Label className="text-purple-700 font-medium">நான்கு பக்க அளவுகள் (Four Side Measurements)</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <div>
              <Label htmlFor="north-measurement" className="text-purple-700">
                வடபுறம் நீளம்/அகலம் (அடி) (North Side)
              </Label>
              <Input
                id="north-measurement"
                placeholder="வடபுற அளவை உள்ளிடவும்"
                value={formData.northMeasurement}
                onChange={(e) => handleChange("northMeasurement", e.target.value)}
                className="mt-1 border-purple-200 focus-visible:ring-purple-400"
              />
            </div>
            <div>
              <Label htmlFor="south-measurement" className="text-purple-700">
                தென்புறம் நீளம்/அகலம் (அடி) (South Side)
              </Label>
              <Input
                id="south-measurement"
                placeholder="தென்புற அளவை உள்ளிடவும்"
                value={formData.southMeasurement}
                onChange={(e) => handleChange("southMeasurement", e.target.value)}
                className="mt-1 border-purple-200 focus-visible:ring-purple-400"
              />
            </div>
            <div>
              <Label htmlFor="east-measurement" className="text-purple-700">
                கிழபுறம் தென்வடபுற (அடி) (East Side)
              </Label>
              <Input
                id="east-measurement"
                placeholder="கிழபுற அளவை உள்ளிடவும்"
                value={formData.eastMeasurement}
                onChange={(e) => handleChange("eastMeasurement", e.target.value)}
                className="mt-1 border-purple-200 focus-visible:ring-purple-400"
              />
            </div>
            <div>
              <Label htmlFor="west-measurement" className="text-purple-700">
                மேற்புறம் தென்வடபுற (அடி) (West Side)
              </Label>
              <Input
                id="west-measurement"
                placeholder="மேற்புற அளவை உள்ளிடவும்"
                value={formData.westMeasurement}
                onChange={(e) => handleChange("westMeasurement", e.target.value)}
                className="mt-1 border-purple-200 focus-visible:ring-purple-400"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <RequiredFieldLabel htmlFor="total-area-sqft" className="text-purple-700">
              மொத்த அளவு (சதுரடி) (Total Area in Sq.ft)
            </RequiredFieldLabel>
            <Input
              id="total-area-sqft"
              placeholder="மொத்த அளவை சதுரடியில் உள்ளிடவும்"
              value={formData.totalAreaSqFt}
              onChange={(e) => handleChange("totalAreaSqFt", e.target.value)}
              className="mt-1 border-purple-200 focus-visible:ring-purple-400"
            />
          </div>
          <div>
            <Label htmlFor="total-area-sqm" className="text-purple-700">
              மொத்த அளவு (சதுரமீட்டர்) (Total Area in Sq.m)
            </Label>
            <Input
              id="total-area-sqm"
              placeholder="மொத்த அளவை சதுரமீட்டரில் உள்ளிடவும்"
              value={formData.totalAreaSqM}
              onChange={(e) => handleChange("totalAreaSqM", e.target.value)}
              className="mt-1 border-purple-200 focus-visible:ring-purple-400"
            />
          </div>
        </div>

        <div>
          <Label className="text-purple-700 font-medium">சர்வே எண் (Survey Numbers)</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <div>
              <Label htmlFor="survey-number-type" className="text-purple-700">
                சர்வே எண் வகை (Survey Number Type)
              </Label>
              <Select
                value={formData.surveyNumberType}
                onValueChange={(value) => handleChange("surveyNumberType", value)}
              >
                <SelectTrigger id="survey-number-type" className="mt-1 border-purple-200 focus-visible:ring-purple-400">
                  <SelectValue placeholder="சர்வே எண் வகையைத் தேர்ந்தெடுக்கவும்" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="old">பழைய சர்வே எண் (Old Survey Number)</SelectItem>
                  <SelectItem value="new">புதிய சர்வே எண் (New Survey Number)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <RequiredFieldLabel htmlFor="survey-number" className="text-purple-700">
                சர்வே எண் (Survey Number)
              </RequiredFieldLabel>
              <Input
                id="survey-number"
                placeholder="சர்வே எண்ணை உள்ளிடவும்"
                value={formData.surveyNumber}
                onChange={(e) => handleChange("surveyNumber", e.target.value)}
                className="mt-1 border-purple-200 focus-visible:ring-purple-400"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <RequiredFieldLabel htmlFor="guide-value" className="text-purple-700">
              வழிகாட்டு மதிப்பு (சதுர மீட்டர்) (Guide Value per Sq.m)
            </RequiredFieldLabel>
            <Input
              id="guide-value"
              placeholder="வழிகாட்டு மதிப்பை உள்ளிடவும்"
              value={formData.guideValuePerSqM}
              onChange={(e) => handleChange("guideValuePerSqM", e.target.value)}
              className="mt-1 border-purple-200 focus-visible:ring-purple-400"
            />
          </div>
          <div>
            <Label htmlFor="property-value" className="text-purple-700">
              இடத்தின் மதிப்பு (Property Value)
            </Label>
            <Input
              id="property-value"
              placeholder="இடத்தின் மதிப்பை உள்ளிடவும்"
              value={formData.propertyValue}
              onChange={(e) => handleChange("propertyValue", e.target.value)}
              className="mt-1 border-purple-200 focus-visible:ring-purple-400"
              disabled
            />
            <p className="text-xs text-gray-500 mt-1">தானாக கணக்கிடப்படுகிறது (Automatically calculated)</p>
          </div>
        </div>

        <div className="flex justify-end space-x-2 mt-6">
          <Button variant="outline" onClick={onCancel} className="border-red-300 text-red-600 hover:bg-red-50">
            ரத்து செய் (Cancel)
          </Button>
          <Button onClick={handleSave} className="bg-purple-600 hover:bg-purple-700">
            சேமி (Save)
          </Button>
        </div>
      </div>
    </Card>
  )
}
