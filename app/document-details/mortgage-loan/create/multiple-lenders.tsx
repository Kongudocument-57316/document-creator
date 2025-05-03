"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { PlusCircle, Trash2 } from "lucide-react"

export type Lender = {
  id: string
  name: string
  age: string
  occupation: string
  address: string
}

type MultipleLendersProps = {
  lenders: Lender[]
  onChange: (lenders: Lender[]) => void
}

export function MultipleLenders({ lenders, onChange }: MultipleLendersProps) {
  const addLender = () => {
    const newLender: Lender = {
      id: `lender-${Date.now()}`,
      name: "",
      age: "",
      occupation: "",
      address: "",
    }
    onChange([...lenders, newLender])
  }

  const updateLender = (index: number, field: keyof Lender, value: string) => {
    const updatedLenders = [...lenders]
    updatedLenders[index] = {
      ...updatedLenders[index],
      [field]: value,
    }
    onChange(updatedLenders)
  }

  const removeLender = (index: number) => {
    const updatedLenders = [...lenders]
    updatedLenders.splice(index, 1)
    onChange(updatedLenders)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">அடமானம் கொடுப்பவர் விவரங்கள்</h3>
        <Button type="button" variant="outline" onClick={addLender} className="flex items-center gap-1">
          <PlusCircle className="h-4 w-4" />
          அடமானம் கொடுப்பவர் சேர்க்க
        </Button>
      </div>

      {lenders.map((lender, index) => (
        <Card key={lender.id} className="border border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between py-3">
            <CardTitle className="text-md">அடமானம் கொடுப்பவர் {index + 1}</CardTitle>
            {lenders.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeLender(index)}
                className="h-8 w-8 p-0"
              >
                <Trash2 className="h-4 w-4 text-red-500" />
                <span className="sr-only">நீக்கு</span>
              </Button>
            )}
          </CardHeader>
          <CardContent className="space-y-4 pt-0">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor={`lender-name-${index}`}>பெயர்</Label>
                <Input
                  id={`lender-name-${index}`}
                  value={lender.name}
                  onChange={(e) => updateLender(index, "name", e.target.value)}
                  placeholder="பெயர் உள்ளிடவும்"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`lender-age-${index}`}>வயது</Label>
                <Input
                  id={`lender-age-${index}`}
                  value={lender.age}
                  onChange={(e) => updateLender(index, "age", e.target.value)}
                  placeholder="வயது உள்ளிடவும்"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor={`lender-occupation-${index}`}>தொழில்</Label>
              <Input
                id={`lender-occupation-${index}`}
                value={lender.occupation}
                onChange={(e) => updateLender(index, "occupation", e.target.value)}
                placeholder="தொழில் உள்ளிடவும்"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`lender-address-${index}`}>முகவரி</Label>
              <Textarea
                id={`lender-address-${index}`}
                value={lender.address}
                onChange={(e) => updateLender(index, "address", e.target.value)}
                placeholder="முகவரி உள்ளிடவும்"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
      ))}

      {lenders.length === 0 && (
        <div className="flex justify-center p-4 border border-dashed border-gray-300 rounded-md">
          <Button type="button" variant="outline" onClick={addLender} className="flex items-center gap-1">
            <PlusCircle className="h-4 w-4" />
            அடமானம் கொடுப்பவர் சேர்க்க
          </Button>
        </div>
      )}
    </div>
  )
}
