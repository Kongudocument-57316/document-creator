"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Edit, Trash2 } from "lucide-react"
import type { BuildingDetail } from "./building-form"

interface BuildingDisplayProps {
  buildings: BuildingDetail[]
  onEdit: (building: BuildingDetail) => void
  onRemove: (buildingId: string) => void
}

export function BuildingDisplay({ buildings, onEdit, onRemove }: BuildingDisplayProps) {
  if (buildings.length === 0) {
    return <p className="text-gray-500 italic">கட்டிட விவரங்கள் எதுவும் சேர்க்கப்படவில்லை</p>
  }

  return (
    <div className="space-y-4">
      {buildings.map((building) => (
        <Card key={building.id} className="overflow-hidden">
          <CardHeader className="bg-gray-50 py-3">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-medium">
                {building.buildingType} - {building.facingDirection} திசை நோக்கி
              </CardTitle>
              <div className="flex space-x-2">
                <Button variant="ghost" size="sm" onClick={() => onEdit(building)}>
                  <Edit className="h-4 w-4 mr-1" /> திருத்து
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onRemove(building.id)}>
                  <Trash2 className="h-4 w-4 mr-1" /> நீக்கு
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">மொத்த பரப்பளவு</p>
                <p>
                  {building.totalSqFeet} சதுரடி / {building.totalSqMeter} சதுரமீட்டர்
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">கட்டிடத்தின் வயது</p>
                <p>{building.buildingAge}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">தளங்கள் / அறைகள்</p>
                <p>
                  {building.floors} தளங்கள் / {building.rooms} அறைகள்
                </p>
              </div>
              {building.hasToilet && (
                <div>
                  <p className="text-sm font-medium text-gray-500">கழிப்பறை அளவுகள்</p>
                  <p>
                    {building.toiletLength} x {building.toiletWidth}
                  </p>
                </div>
              )}
              {building.description && (
                <div className="col-span-2">
                  <p className="text-sm font-medium text-gray-500">கூடுதல் விவரங்கள்</p>
                  <p>{building.description}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
