"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PlusCircle, Trash2 } from "lucide-react"

export default function WitnessDetailsForm({ data, updateData }) {
  const [witnesses, setWitnesses] = useState(data)

  const handleAddWitness = () => {
    setWitnesses([...witnesses, { name: "", address: "" }])
  }

  const handleRemoveWitness = (index) => {
    const updatedWitnesses = [...witnesses]
    updatedWitnesses.splice(index, 1)
    setWitnesses(updatedWitnesses)
  }

  const handleChange = (index, field, value) => {
    const updatedWitnesses = [...witnesses]
    updatedWitnesses[index] = { ...updatedWitnesses[index], [field]: value }
    setWitnesses(updatedWitnesses)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    updateData(witnesses)
  }

  return (
    <form onSubmit={handleSubmit}>
      {witnesses.map((witness, index) => (
        <div key={index} className="mb-6 p-4 border rounded-md bg-gray-50">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-md font-medium">சாட்சி {index + 1}</h3>
            {witnesses.length > 2 && (
              <Button type="button" variant="ghost" size="sm" onClick={() => handleRemoveWitness(index)}>
                <Trash2 className="h-4 w-4 mr-1" /> நீக்கு
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`name-${index}`}>பெயர்</Label>
              <Input
                id={`name-${index}`}
                value={witness.name}
                onChange={(e) => handleChange(index, "name", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`address-${index}`}>முகவரி</Label>
              <Input
                id={`address-${index}`}
                value={witness.address}
                onChange={(e) => handleChange(index, "address", e.target.value)}
                required
              />
            </div>
          </div>
        </div>
      ))}

      <Button type="button" variant="outline" onClick={handleAddWitness} className="mt-2">
        <PlusCircle className="h-4 w-4 mr-1" /> மற்றொரு சாட்சியைச் சேர்க்க
      </Button>

      <Button type="submit" className="mt-4 ml-2 bg-cyan-600 hover:bg-cyan-700 text-white">
        முடிக்க
      </Button>
    </form>
  )
}
