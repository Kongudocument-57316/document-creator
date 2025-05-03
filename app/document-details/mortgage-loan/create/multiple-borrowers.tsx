"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { PlusCircle, Trash2 } from "lucide-react"

export type Borrower = {
  id: string
  name: string
  age: string
  occupation: string
  address: string
}

type MultipleBorrowersProps = {
  borrowers: Borrower[]
  onChange: (borrowers: Borrower[]) => void
}

export function MultipleBorrowers({ borrowers, onChange }: MultipleBorrowersProps) {
  const addBorrower = () => {
    const newBorrower: Borrower = {
      id: `borrower-${Date.now()}`,
      name: "",
      age: "",
      occupation: "",
      address: "",
    }
    onChange([...borrowers, newBorrower])
  }

  const updateBorrower = (index: number, field: keyof Borrower, value: string) => {
    const updatedBorrowers = [...borrowers]
    updatedBorrowers[index] = {
      ...updatedBorrowers[index],
      [field]: value,
    }
    onChange(updatedBorrowers)
  }

  const removeBorrower = (index: number) => {
    const updatedBorrowers = [...borrowers]
    updatedBorrowers.splice(index, 1)
    onChange(updatedBorrowers)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">அடமானம் பெறுபவர் விவரங்கள்</h3>
        <Button type="button" variant="outline" onClick={addBorrower} className="flex items-center gap-1">
          <PlusCircle className="h-4 w-4" />
          அடமானம் பெறுபவர் சேர்க்க
        </Button>
      </div>

      {borrowers.map((borrower, index) => (
        <Card key={borrower.id} className="border border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between py-3">
            <CardTitle className="text-md">அடமானம் பெறுபவர் {index + 1}</CardTitle>
            {borrowers.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeBorrower(index)}
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
                <Label htmlFor={`borrower-name-${index}`}>பெயர்</Label>
                <Input
                  id={`borrower-name-${index}`}
                  value={borrower.name}
                  onChange={(e) => updateBorrower(index, "name", e.target.value)}
                  placeholder="பெயர் உள்ளிடவ��ம்"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`borrower-age-${index}`}>வயது</Label>
                <Input
                  id={`borrower-age-${index}`}
                  value={borrower.age}
                  onChange={(e) => updateBorrower(index, "age", e.target.value)}
                  placeholder="வயது உள்ளிடவும்"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor={`borrower-occupation-${index}`}>தொழில்</Label>
              <Input
                id={`borrower-occupation-${index}`}
                value={borrower.occupation}
                onChange={(e) => updateBorrower(index, "occupation", e.target.value)}
                placeholder="தொழில் உள்ளிடவும்"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`borrower-address-${index}`}>முகவரி</Label>
              <Textarea
                id={`borrower-address-${index}`}
                value={borrower.address}
                onChange={(e) => updateBorrower(index, "address", e.target.value)}
                placeholder="முகவரி உள்ளிடவும்"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
      ))}

      {borrowers.length === 0 && (
        <div className="flex justify-center p-4 border border-dashed border-gray-300 rounded-md">
          <Button type="button" variant="outline" onClick={addBorrower} className="flex items-center gap-1">
            <PlusCircle className="h-4 w-4" />
            அடமானம் பெறுபவர் சேர்க்க
          </Button>
        </div>
      )}
    </div>
  )
}
