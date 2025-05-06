"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { UserDetailDialog } from "../components/user-detail-dialog"
import { UserSearchDialog } from "../components/user-search-dialog"
import { User, UserPlus, Edit, Trash2 } from "lucide-react"
import { Separator } from "@/components/ui/separator"

interface WitnessTabProps {
  data: any[]
  updateData: (data: any[]) => void
}

export function WitnessTab({ data, updateData }: WitnessTabProps) {
  const [witnesses, setWitnesses] = useState<any[]>(Array.isArray(data) ? data : [])
  const [selectedWitness, setSelectedWitness] = useState<any>(null)
  const [isEditing, setIsEditing] = useState(false)

  const handleAddWitness = (witness: any) => {
    const newWitnesses = [...witnesses, { ...witness, id: Date.now() }]
    setWitnesses(newWitnesses)
    updateData(newWitnesses)
  }

  const handleEditWitness = (witness: any) => {
    setSelectedWitness(witness)
    setIsEditing(true)
  }

  const handleDeleteWitness = (witnessId: number) => {
    const newWitnesses = witnesses.filter((witness) => witness.id !== witnessId)
    setWitnesses(newWitnesses)
    updateData(newWitnesses)
  }

  const handleUpdateWitness = (updatedWitness: any) => {
    const newWitnesses = witnesses.map((witness) =>
      witness.id === updatedWitness.id ? { ...witness, ...updatedWitness } : witness,
    )
    setWitnesses(newWitnesses)
    updateData(newWitnesses)
    setIsEditing(false)
  }

  const handleViewWitness = (witness: any) => {
    setSelectedWitness(witness)
    setIsEditing(false)
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="text-xl font-semibold text-purple-800 flex items-center">
          <User className="h-5 w-5 mr-2 text-purple-600" />
          சாட்சி விவரங்கள்
        </h3>
        <Separator className="my-4 bg-purple-200" />

        <div className="flex justify-end mb-4">
          <UserSearchDialog onSelectUser={handleAddWitness} buttonLabel="சாட்சியைச் சேர்க்க" dialogTitle="சாட்சியைத் தேடு" />
        </div>

        {witnesses.length === 0 ? (
          <Card className="border-dashed border-2 border-purple-200 bg-purple-50">
            <CardContent className="flex flex-col items-center justify-center p-6">
              <UserPlus className="h-12 w-12 text-purple-400 mb-2" />
              <p className="text-purple-600 text-center">சாட்சி விவரங்கள் எதுவும் சேர்க்கப்படவில்லை</p>
              <p className="text-purple-500 text-sm text-center mt-1">சாட்சியைச் சேர்க்க மேலே உள்ள பொத்தானைக் கிளிக் செய்யவும்</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {witnesses.map((witness) => (
              <Card key={witness.id} className="border-purple-200 hover:border-purple-300 transition-colors">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium text-purple-800">{witness.name}</h4>
                      <p className="text-sm text-gray-600">{witness.address_line1 || witness.address1}</p>
                      {(witness.phone || witness.phoneNo) && (
                        <p className="text-sm text-gray-600">தொலைபேசி: {witness.phone || witness.phoneNo}</p>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <UserDetailDialog user={witness} buttonLabel="விவரங்கள்" dialogTitle="சாட்சி விவரங்கள்" />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditWitness(witness)}
                        className="border-purple-200 hover:bg-purple-50"
                      >
                        <Edit className="h-4 w-4 text-purple-600" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteWitness(witness.id)}
                        className="border-purple-200 hover:bg-purple-50"
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
