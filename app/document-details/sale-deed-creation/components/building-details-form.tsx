"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RequiredFieldLabel } from "./required-field-label"

interface BuildingDetailsFormProps {
  onSave: (data: any) => void
  onCancel: () => void
  initialData?: any
}

export function BuildingDetailsForm({ onSave, onCancel, initialData = {} }: BuildingDetailsFormProps) {
  const [formData, setFormData] = useState({
    buildingType: initialData.buildingType || "residential",
    buildingAge: initialData.buildingAge || "",
    buildingDirection: initialData.buildingDirection || "",
    northMeasurement: initialData.northMeasurement || "",
    southMeasurement: initialData.southMeasurement || "",
    eastMeasurement: initialData.eastMeasurement || "",
    westMeasurement: initialData.westMeasurement || "",
    totalAreaSqFt: initialData.totalAreaSqFt || "",
    totalAreaSqM: initialData.totalAreaSqM || "",
    doorNumbers: initialData.doorNumbers || [{ doorNumber: "", taxNumber: "", id: Date.now().toString() }],
    waterConnectionNumber: initialData.waterConnectionNumber || "",
    electricityConnectionNumber: initialData.electricityConnectionNumber || "",
    hasToilet: initialData.hasToilet || false,
    toiletType: initialData.toiletType || "",
    toiletDirection: initialData.toiletDirection || "",
    toiletLength: initialData.toiletLength || "",
    toiletWidth: initialData.toiletWidth || "",
    toiletAreaSqFt: initialData.toiletAreaSqFt || "",
    toiletAreaSqM: initialData.toiletAreaSqM || "",
    hasCompoundWall: initialData.hasCompoundWall || false,
    wallLength: initialData.wallLength || "",
    wallHeight: initialData.wallHeight || "",
    guideValue: initialData.guideValue || "",
    buildingValue: initialData.buildingValue || "",
    id: initialData.id || Date.now().toString(),
  })

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleDoorNumberChange = (index: number, field: string, value: string) => {
    const updatedDoorNumbers = [...formData.doorNumbers]
    updatedDoorNumbers[index] = {
      ...updatedDoorNumbers[index],
      [field]: value,
    }
    handleChange("doorNumbers", updatedDoorNumbers)
  }

  const addDoorNumber = () => {
    handleChange("doorNumbers", [...formData.doorNumbers, { doorNumber: "", taxNumber: "", id: Date.now().toString() }])
  }

  const removeDoorNumber = (index: number) => {
    const updatedDoorNumbers = formData.doorNumbers.filter((_, i) => i !== index)
    handleChange("doorNumbers", updatedDoorNumbers)
  }

  const handleSave = () => {
    onSave(formData)
  }

  return (
    <Card className="p-6 border-purple-200 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-purple-800">புதிய கட்டட விவரங்கள் சேர்க்க (Add New Building Details)</h3>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <RequiredFieldLabel htmlFor="building-type" className="text-purple-700">
              கட்டட வகை (Building Type)
            </RequiredFieldLabel>
            <Select value={formData.buildingType} onValueChange={(value) => handleChange("buildingType", value)}>
              <SelectTrigger id="building-type" className="mt-1 border-purple-200 focus-visible:ring-purple-400">
                <SelectValue placeholder="கட்டட வகையைத் தேர்ந்தெடுக்கவும்" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="residential">குடியிருப்பு (Residential)</SelectItem>
                <SelectItem value="commercial">வணிக (Commercial)</SelectItem>
                <SelectItem value="industrial">தொழில் (Industrial)</SelectItem>
                <SelectItem value="agricultural">விவசாய (Agricultural)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <RequiredFieldLabel htmlFor="building-age" className="text-purple-700">
              கட்டடத்தின் வயது (ஆண்டுகளில்) (Building Age in Years)
            </RequiredFieldLabel>
            <Input
              id="building-age"
              placeholder="கட்டடத்தின் வயதை உள்ளிடவும்"
              value={formData.buildingAge}
              onChange={(e) => handleChange("buildingAge", e.target.value)}
              className="mt-1 border-purple-200 focus-visible:ring-purple-400"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="building-direction" className="text-purple-700">
            கட்டடத்தின் திசை (Building Direction)
          </Label>
          <Select
            value={formData.buildingDirection}
            onValueChange={(value) => handleChange("buildingDirection", value)}
          >
            <SelectTrigger id="building-direction" className="mt-1 border-purple-200 focus-visible:ring-purple-400">
              <SelectValue placeholder="கட்டடத்தின் திசையைத் தேர்ந்தெடுக்கவும்" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="north">வடக்கு (North)</SelectItem>
              <SelectItem value="south">தெற்கு (South)</SelectItem>
              <SelectItem value="east">கிழக்கு (East)</SelectItem>
              <SelectItem value="west">மேற்கு (West)</SelectItem>
              <SelectItem value="northeast">வடகிழக்கு (North East)</SelectItem>
              <SelectItem value="northwest">வடமேற்கு (North West)</SelectItem>
              <SelectItem value="southeast">தென்கிழக்கு (South East)</SelectItem>
              <SelectItem value="southwest">தென்மேற்கு (South West)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-purple-700 font-medium">நான்கு பக்க அளவுகள் (Four Side Measurements)</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <div>
              <Label htmlFor="north-measurement" className="text-purple-700">
                வடபுறம் (அடி) (North Side)
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
                தென்புறம் (அடி) (South Side)
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
                கிழபுறம் (அடி) (East Side)
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
                மேற்புறம் (அடி) (West Side)
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
              மொத்த பரப்பளவு (சதுரடி) (Total Area in Sq.ft)
            </RequiredFieldLabel>
            <Input
              id="total-area-sqft"
              placeholder="மொத்த பரப்பளவை சதுரடியில் உள்ளிடவும்"
              value={formData.totalAreaSqFt}
              onChange={(e) => handleChange("totalAreaSqFt", e.target.value)}
              className="mt-1 border-purple-200 focus-visible:ring-purple-400"
            />
          </div>
          <div>
            <Label htmlFor="total-area-sqm" className="text-purple-700">
              மொத்த பரப்பளவு (சதுரமீட்டர்) (Total Area in Sq.m)
            </Label>
            <Input
              id="total-area-sqm"
              placeholder="மொத்த பரப்பளவை சதுரமீட்டரில் உள்ளிடவும்"
              value={formData.totalAreaSqM}
              onChange={(e) => handleChange("totalAreaSqM", e.target.value)}
              className="mt-1 border-purple-200 focus-visible:ring-purple-400"
            />
          </div>
        </div>

        <div>
          <Label className="text-purple-700 font-medium mb-2 block">
            கதவு எண்கள் மற்றும் விவரங்கள் (Door Numbers & Details)
          </Label>

          {formData.doorNumbers.map((door, index) => (
            <div key={door.id} className="border p-4 rounded-md mb-4 bg-gray-50">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium">கதவு விவரங்கள் #{index + 1}</h4>
                {formData.doorNumbers.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeDoorNumber(index)}
                    className="h-8 px-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    நீக்கு
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`door-number-${index}`} className="text-purple-700">
                    கதவு எண்கள் (Door Numbers)
                  </Label>
                  <Input
                    id={`door-number-${index}`}
                    placeholder="கதவு எண்களை உள்ளிடவும்"
                    value={door.doorNumber}
                    onChange={(e) => handleDoorNumberChange(index, "doorNumber", e.target.value)}
                    className="mt-1 border-purple-200 focus-visible:ring-purple-400"
                  />
                </div>
                <div>
                  <Label htmlFor={`tax-number-${index}`} className="text-purple-700">
                    வரி விதிப்பு எண்கள் (Tax Numbers)
                  </Label>
                  <Input
                    id={`tax-number-${index}`}
                    placeholder="வரி விதிப்பு எண்களை உள்ளிடவும்"
                    value={door.taxNumber}
                    onChange={(e) => handleDoorNumberChange(index, "taxNumber", e.target.value)}
                    className="mt-1 border-purple-200 focus-visible:ring-purple-400"
                  />
                </div>
              </div>
            </div>
          ))}

          <Button
            variant="outline"
            onClick={addDoorNumber}
            className="mt-2 border-purple-300 text-purple-700 hover:bg-purple-50"
          >
            + புதிய கதவு விவரங்கள் சேர்க்க
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="water-connection" className="text-purple-700">
              குடிநீர் இணைப்பு எரிவிப்பு எண்கள் (Water Connection Numbers)
            </Label>
            <Input
              id="water-connection"
              placeholder="குடிநீர் இணைப்பு எண்களை உள்ளிடவும்"
              value={formData.waterConnectionNumber}
              onChange={(e) => handleChange("waterConnectionNumber", e.target.value)}
              className="mt-1 border-purple-200 focus-visible:ring-purple-400"
            />
          </div>
          <div>
            <Label htmlFor="electricity-connection" className="text-purple-700">
              மின் இணைப்பு எண்கள் (Electricity Connection Numbers)
            </Label>
            <Input
              id="electricity-connection"
              placeholder="மின் இணைப்பு எண்களை உள்ளிடவும்"
              value={formData.electricityConnectionNumber}
              onChange={(e) => handleChange("electricityConnectionNumber", e.target.value)}
              className="mt-1 border-purple-200 focus-visible:ring-purple-400"
            />
          </div>
        </div>

        <div className="space-y-6 mt-4">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Checkbox
                id="has-toilet"
                checked={formData.hasToilet}
                onCheckedChange={(checked) => handleChange("hasToilet", checked)}
              />
              <Label htmlFor="has-toilet" className="text-purple-700 font-medium">
                கழிப்பறை உள்ளதா? (Has Toilet?)
              </Label>
            </div>

            {formData.hasToilet && (
              <Card className="p-4 border-purple-200 bg-purple-50">
                <h5 className="font-medium text-purple-700 mb-3">கழிப்பறை விவரங்கள் (Toilet Details)</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="toilet-type" className="text-purple-700">
                      கட்டிட வகை (Toilet Type)
                    </Label>
                    <Select
                      value={formData.toiletType || ""}
                      onValueChange={(value) => handleChange("toiletType", value)}
                    >
                      <SelectTrigger id="toilet-type" className="mt-1 border-purple-200 focus-visible:ring-purple-400">
                        <SelectValue placeholder="கழிப்பறை வகையைத் தேர்ந்தெடுக்கவும்" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="indian">இந்திய வகை (Indian Type)</SelectItem>
                        <SelectItem value="western">மேற்கத்திய வகை (Western Type)</SelectItem>
                        <SelectItem value="both">இரண்டும் (Both)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="toilet-direction" className="text-purple-700">
                      திசை (Direction)
                    </Label>
                    <Select
                      value={formData.toiletDirection || ""}
                      onValueChange={(value) => handleChange("toiletDirection", value)}
                    >
                      <SelectTrigger
                        id="toilet-direction"
                        className="mt-1 border-purple-200 focus-visible:ring-purple-400"
                      >
                        <SelectValue placeholder="கழிப்பறை திசையைத் தேர்ந்தெடுக்கவும்" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="north">வடக்கு (North)</SelectItem>
                        <SelectItem value="south">தெற்கு (South)</SelectItem>
                        <SelectItem value="east">கிழக்கு (East)</SelectItem>
                        <SelectItem value="west">மேற்கு (West)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label htmlFor="toilet-length" className="text-purple-700">
                      நீளம் (அடி) (Length in ft)
                    </Label>
                    <Input
                      id="toilet-length"
                      placeholder="நீளத்தை உள்ளிடவும்"
                      value={formData.toiletLength || ""}
                      onChange={(e) => handleChange("toiletLength", e.target.value)}
                      className="mt-1 border-purple-200 focus-visible:ring-purple-400"
                    />
                  </div>
                  <div>
                    <Label htmlFor="toilet-width" className="text-purple-700">
                      அகலம் (அடி) (Width in ft)
                    </Label>
                    <Input
                      id="toilet-width"
                      placeholder="அகலத்தை உள்ளிடவும்"
                      value={formData.toiletWidth || ""}
                      onChange={(e) => handleChange("toiletWidth", e.target.value)}
                      className="mt-1 border-purple-200 focus-visible:ring-purple-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label htmlFor="toilet-area-sqft" className="text-purple-700">
                      மொத்த பரப்பளவு (சதுரடி) (Total Area in Sq.ft)
                    </Label>
                    <Input
                      id="toilet-area-sqft"
                      placeholder="மொத்த பரப்பளவை சதுரடியில் உள்ளிடவும்"
                      value={formData.toiletAreaSqFt || ""}
                      onChange={(e) => handleChange("toiletAreaSqFt", e.target.value)}
                      className="mt-1 border-purple-200 focus-visible:ring-purple-400"
                    />
                    <p className="text-xs text-gray-500 mt-1">தானாக கணக்கிடப்படுகிறது. தேவைப்பட்டால் மாற்றலாம்</p>
                  </div>
                  <div>
                    <Label htmlFor="toilet-area-sqm" className="text-purple-700">
                      மொத்த பரப்பளவு (சதுரமீட்டர்) (Total Area in Sq.m)
                    </Label>
                    <Input
                      id="toilet-area-sqm"
                      placeholder="மொத்த பரப்பளவை சதுரமீட்டரில் உள்ளிடவும்"
                      value={formData.toiletAreaSqM || ""}
                      onChange={(e) => handleChange("toiletAreaSqM", e.target.value)}
                      className="mt-1 border-purple-200 focus-visible:ring-purple-400"
                    />
                    <p className="text-xs text-gray-500 mt-1">தானாக கணக்கிடப்படுகிறது. தேவைப்பட்டால் மாற்றலாம்</p>
                  </div>
                </div>
              </Card>
            )}
          </div>

          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Checkbox
                id="has-compound-wall"
                checked={formData.hasCompoundWall}
                onCheckedChange={(checked) => handleChange("hasCompoundWall", checked)}
              />
              <Label htmlFor="has-compound-wall" className="text-purple-700 font-medium">
                சுற்று சுவர் விவரங்கள் (Compound Wall Details)
              </Label>
            </div>

            {formData.hasCompoundWall && (
              <Card className="p-4 border-purple-200 bg-purple-50">
                <h5 className="font-medium text-purple-700 mb-3">சுற்று சுவர் விவரங்கள் (Compound Wall Details)</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="wall-length" className="text-purple-700">
                      சுற்று சுவரின் நீளம் (அடி) (Length in ft)
                    </Label>
                    <Input
                      id="wall-length"
                      placeholder="சுற்று சுவரின் நீளத்தை உள்ளிடவும்"
                      value={formData.wallLength || ""}
                      onChange={(e) => handleChange("wallLength", e.target.value)}
                      className="mt-1 border-purple-200 focus-visible:ring-purple-400"
                    />
                  </div>
                  <div>
                    <Label htmlFor="wall-height" className="text-purple-700">
                      சுற்று சுவரின் உயரம் (அடி) (Height in ft)
                    </Label>
                    <Input
                      id="wall-height"
                      placeholder="சுற்று சுவரின் உயரத்தை உள்ளிடவும்"
                      value={formData.wallHeight || ""}
                      onChange={(e) => handleChange("wallHeight", e.target.value)}
                      className="mt-1 border-purple-200 focus-visible:ring-purple-400"
                    />
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <RequiredFieldLabel htmlFor="guide-value" className="text-purple-700">
              வழிகாட்டு மதிப்பு (Guide Value)
            </RequiredFieldLabel>
            <Input
              id="guide-value"
              placeholder="வழிகாட்டு மதிப்பை உள்ளிடவும்"
              value={formData.guideValue}
              onChange={(e) => handleChange("guideValue", e.target.value)}
              className="mt-1 border-purple-200 focus-visible:ring-purple-400"
            />
          </div>
          <div>
            <RequiredFieldLabel htmlFor="building-value" className="text-purple-700">
              கட்டடத்தின் மதிப்பு (Building Value)
            </RequiredFieldLabel>
            <Input
              id="building-value"
              placeholder="கட்டடத்தின் மதிப்பை உள்ளிடவும்"
              value={formData.buildingValue}
              onChange={(e) => handleChange("buildingValue", e.target.value)}
              className="mt-1 border-purple-200 focus-visible:ring-purple-400"
            />
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
