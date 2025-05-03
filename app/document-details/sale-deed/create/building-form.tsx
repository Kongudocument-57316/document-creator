"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { v4 as uuidv4 } from "uuid"

export interface BuildingDetail {
  id: string
  buildingType: string
  facingDirection: string
  totalSqFeet: string
  totalSqMeter: string
  buildingAge: string
  floors: string
  rooms: string
  hasToilet: boolean
  toiletLength: string
  toiletWidth: string
  description: string
}

interface BuildingFormProps {
  onAddBuilding: (building: BuildingDetail) => void
  onCancel: () => void
  initialBuilding?: BuildingDetail | null
  isEditing?: boolean
}

export function BuildingForm({
  onAddBuilding,
  onCancel,
  initialBuilding = null,
  isEditing = false,
}: BuildingFormProps) {
  const [buildingType, setBuildingType] = useState(initialBuilding?.buildingType || "")
  const [facingDirection, setFacingDirection] = useState(initialBuilding?.facingDirection || "")
  const [totalSqFeet, setTotalSqFeet] = useState(initialBuilding?.totalSqFeet || "")
  const [totalSqMeter, setTotalSqMeter] = useState(initialBuilding?.totalSqMeter || "")
  const [buildingAge, setBuildingAge] = useState(initialBuilding?.buildingAge || "")
  const [floors, setFloors] = useState(initialBuilding?.floors || "")
  const [rooms, setRooms] = useState(initialBuilding?.rooms || "")
  const [hasToilet, setHasToilet] = useState(initialBuilding?.hasToilet || false)
  const [toiletLength, setToiletLength] = useState(initialBuilding?.toiletLength || "")
  const [toiletWidth, setToiletWidth] = useState(initialBuilding?.toiletWidth || "")
  const [description, setDescription] = useState(initialBuilding?.description || "")

  const buildingTypes = [
    { value: "தார்சு வீடு", label: "தார்சு வீடு" },
    { value: "ஓட்டு வீடு", label: "ஓட்டு வீடு" },
    { value: "சிமெண்ட் சீட்", label: "சிமெண்ட் சீட்" },
    { value: "தகர சீட்", label: "தகர சீட்" },
    { value: "கூரைச்சாலை", label: "கூரைச்சாலை" },
    { value: "RCC", label: "RCC" },
    { value: "பிளாட்", label: "பிளாட்" },
    { value: "வணிக கட்டிடம்", label: "வணிக கட்டிடம்" },
    { value: "தொழிற்சாலை", label: "தொழிற்சாலை" },
    { value: "மற்றவை", label: "மற்றவை" },
  ]

  const facingDirections = [
    { value: "வடக்கு", label: "வடக்கு" },
    { value: "தெற்கு", label: "தெற்கு" },
    { value: "கிழக்கு", label: "கிழக்கு" },
    { value: "மேற்கு", label: "மேற்கு" },
    { value: "வடகிழக்கு", label: "வடகிழக்கு" },
    { value: "வடமேற்கு", label: "வடமேற்கு" },
    { value: "தென்கிழக்கு", label: "தென்கிழக்கு" },
    { value: "தென்மேற்கு", label: "தென்மேற்கு" },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const buildingData: BuildingDetail = {
      id: initialBuilding?.id || uuidv4(),
      buildingType,
      facingDirection,
      totalSqFeet,
      totalSqMeter,
      buildingAge,
      floors,
      rooms,
      hasToilet,
      toiletLength,
      toiletWidth,
      description,
    }

    onAddBuilding(buildingData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg bg-white">
      <h3 className="text-lg font-semibold mb-4">{isEditing ? "கட்டிட விவரங்களை திருத்து" : "கட்டிட விவரங்களை சேர்க்க"}</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="buildingType">கட்டிடத்தின் வகை</Label>
          <Select value={buildingType} onValueChange={setBuildingType}>
            <SelectTrigger id="buildingType">
              <SelectValue placeholder="கட்டிடத்தின் வகையைத் தேர்ந்தெடுக்கவும்" />
            </SelectTrigger>
            <SelectContent>
              {buildingTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="facingDirection">கட்டிடம் எந்த திசையை நோக்கியுள்ளது</Label>
          <Select value={facingDirection} onValueChange={setFacingDirection}>
            <SelectTrigger id="facingDirection">
              <SelectValue placeholder="திசையைத் தேர்ந்தெடுக்கவும்" />
            </SelectTrigger>
            <SelectContent>
              {facingDirections.map((direction) => (
                <SelectItem key={direction.value} value={direction.value}>
                  {direction.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="totalSqFeet">மொத்த பரப்பளவு (சதுரடி)</Label>
          <Input
            id="totalSqFeet"
            type="text"
            value={totalSqFeet}
            onChange={(e) => setTotalSqFeet(e.target.value)}
            placeholder="சதுரடியில் பரப்பளவை உள்ளிடவும்"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="totalSqMeter">மொத்த பரப்பளவு (சதுரமீட்டர்)</Label>
          <Input
            id="totalSqMeter"
            type="text"
            value={totalSqMeter}
            onChange={(e) => setTotalSqMeter(e.target.value)}
            placeholder="சதுரமீட்டரில் பரப்பளவை உள்ளிடவும்"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="buildingAge">கட்டிடத்தின் வயது</Label>
          <Input
            id="buildingAge"
            type="text"
            value={buildingAge}
            onChange={(e) => setBuildingAge(e.target.value)}
            placeholder="கட்டிடத்தின் வயதை உள்ளிடவும்"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="floors">தளங்களின் எண்ணிக்கை</Label>
          <Input
            id="floors"
            type="text"
            value={floors}
            onChange={(e) => setFloors(e.target.value)}
            placeholder="தளங்களின் எண்ணிக்கையை உள்ளிடவும்"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="rooms">அறைகளின் எண்ணிக்கை</Label>
          <Input
            id="rooms"
            type="text"
            value={rooms}
            onChange={(e) => setRooms(e.target.value)}
            placeholder="அறைகளின் எண்ணிக்கையை உள்ளிடவும்"
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox id="hasToilet" checked={hasToilet} onCheckedChange={(checked) => setHasToilet(checked === true)} />
          <Label htmlFor="hasToilet">கழிப்பறை உள்ளதா?</Label>
        </div>
      </div>

      {hasToilet && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6 border-l-2 border-gray-200">
          <div className="space-y-2">
            <Label htmlFor="toiletLength">கழிப்பறையின் நீளம்</Label>
            <Input
              id="toiletLength"
              type="text"
              value={toiletLength}
              onChange={(e) => setToiletLength(e.target.value)}
              placeholder="நீளத்தை உள்ளிடவும்"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="toiletWidth">கழிப்பறையின் அகலம்</Label>
            <Input
              id="toiletWidth"
              type="text"
              value={toiletWidth}
              onChange={(e) => setToiletWidth(e.target.value)}
              placeholder="அகலத்தை உள்ளிடவும்"
            />
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="description">கூடுதல் விவரங்கள்</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="கட்டிடத்தைப் பற்றிய கூடுதல் விவரங்களை உள்ளிடவும்"
          rows={3}
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          ரத்து செய்
        </Button>
        <Button type="submit">{isEditing ? "புதுப்பி" : "சேர்"}</Button>
      </div>
    </form>
  )
}
