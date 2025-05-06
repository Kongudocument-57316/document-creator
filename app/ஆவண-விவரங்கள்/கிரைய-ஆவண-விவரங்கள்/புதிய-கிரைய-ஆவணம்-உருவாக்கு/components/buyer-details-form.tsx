"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusCircle, Trash2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export default function BuyerDetailsForm({ data, updateData }) {
  const [buyers, setBuyers] = useState(data)
  const [existingUsers, setExistingUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const supabase = createClient()
        const { data: usersData } = await supabase
          .from("users")
          .select(
            "id, name, gender, relation_type, relative_name, door_number, address_line1, address_line2, address_line3, phone, aadhaar_number",
          )

        setExistingUsers(usersData || [])
      } catch (error) {
        console.error("Error fetching users:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const handleAddBuyer = () => {
    setBuyers([...buyers, { id: "", name: "", relationDetails: "", address: "", phone: "", aadhaarNumber: "" }])
  }

  const handleRemoveBuyer = (index) => {
    const updatedBuyers = [...buyers]
    updatedBuyers.splice(index, 1)
    setBuyers(updatedBuyers)
  }

  const handleSelectExistingUser = (index, userId) => {
    const user = existingUsers.find((u) => u.id.toString() === userId)
    if (!user) return

    const updatedBuyers = [...buyers]
    updatedBuyers[index] = {
      id: user.id.toString(),
      name: user.name,
      relationDetails: `${user.relation_type || ""} ${user.relative_name || ""}`.trim(),
      address:
        `${user.door_number || ""}, ${user.address_line1 || ""}, ${user.address_line2 || ""}, ${user.address_line3 || ""}`
          .replace(/,\s*,/g, ",")
          .replace(/^,\s*/, "")
          .replace(/,\s*$/, ""),
      phone: user.phone || "",
      aadhaarNumber: user.aadhaar_number || "",
    }

    setBuyers(updatedBuyers)
  }

  const handleChange = (index, field, value) => {
    const updatedBuyers = [...buyers]
    updatedBuyers[index] = { ...updatedBuyers[index], [field]: value }
    setBuyers(updatedBuyers)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    updateData(buyers)
  }

  if (loading) {
    return <div>தரவுகளை ஏற்றுகிறது...</div>
  }

  return (
    <form onSubmit={handleSubmit}>
      {buyers.map((buyer, index) => (
        <div key={index} className="mb-6 p-4 border rounded-md bg-gray-50">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-md font-medium">வாங்குபவர் {index + 1}</h3>
            {buyers.length > 1 && (
              <Button type="button" variant="ghost" size="sm" onClick={() => handleRemoveBuyer(index)}>
                <Trash2 className="h-4 w-4 mr-1" /> நீக்கு
              </Button>
            )}
          </div>

          <div className="mb-4">
            <Label htmlFor={`existingUser-${index}`}>ஏற்கனவே உள்ள பயனாளரைத் தேர்ந்தெடுக்கவும்</Label>
            <Select value={buyer.id} onValueChange={(value) => handleSelectExistingUser(index, value)}>
              <SelectTrigger>
                <SelectValue placeholder="பயனாளரைத் தேர்ந்தெடுக்கவும்" />
              </SelectTrigger>
              <SelectContent>
                {existingUsers.map((user) => (
                  <SelectItem key={user.id} value={user.id.toString()}>
                    {user.name} - {user.aadhaar_number || "ஆதார் எண் இல்லை"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`name-${index}`}>பெயர்</Label>
              <Input
                id={`name-${index}`}
                value={buyer.name}
                onChange={(e) => handleChange(index, "name", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`relationDetails-${index}`}>உறவு விவரங்கள்</Label>
              <Input
                id={`relationDetails-${index}`}
                value={buyer.relationDetails}
                onChange={(e) => handleChange(index, "relationDetails", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`address-${index}`}>முகவரி</Label>
              <Input
                id={`address-${index}`}
                value={buyer.address}
                onChange={(e) => handleChange(index, "address", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`phone-${index}`}>தொலைபேசி எண்</Label>
              <Input
                id={`phone-${index}`}
                value={buyer.phone}
                onChange={(e) => handleChange(index, "phone", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`aadhaarNumber-${index}`}>ஆதார் எண்</Label>
              <Input
                id={`aadhaarNumber-${index}`}
                value={buyer.aadhaarNumber}
                onChange={(e) => handleChange(index, "aadhaarNumber", e.target.value)}
              />
            </div>
          </div>
        </div>
      ))}

      <Button type="button" variant="outline" onClick={handleAddBuyer} className="mt-2">
        <PlusCircle className="h-4 w-4 mr-1" /> மற்றொரு வாங்குபவரைச் சேர்க்க
      </Button>

      <Button type="submit" className="mt-4 ml-2 bg-cyan-600 hover:bg-cyan-700 text-white">
        அடுத்த பக்கம்
      </Button>
    </form>
  )
}
