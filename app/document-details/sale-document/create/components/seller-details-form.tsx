"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusCircle, Trash2 } from "lucide-react"
import { getSupabaseBrowserClient } from "@/lib/supabase"
import { toast } from "sonner"

export default function SellerDetailsForm({ data, updateData }) {
  const [sellers, setSellers] = useState(data)
  const [existingUsers, setExistingUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const supabase = getSupabaseBrowserClient()
        const { data: usersData } = await supabase
          .from("users")
          .select(
            "id, name, gender, relation_type, relative_name, door_number, address_line1, address_line2, address_line3, phone, aadhaar_number",
          )

        setExistingUsers(usersData || [])
      } catch (error) {
        console.error("Error fetching users:", error)
        toast.error("பயனாளர்களை பெறுவதில் பிழை ஏற்பட்டது")
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const handleAddSeller = () => {
    setSellers([...sellers, { id: "", name: "", relationDetails: "", address: "", phone: "", aadhaarNumber: "" }])
  }

  const handleRemoveSeller = (index) => {
    const updatedSellers = [...sellers]
    updatedSellers.splice(index, 1)
    setSellers(updatedSellers)
  }

  const handleSelectExistingUser = (index, userId) => {
    const user = existingUsers.find((u) => u.id.toString() === userId)
    if (!user) return

    const updatedSellers = [...sellers]
    updatedSellers[index] = {
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

    setSellers(updatedSellers)
  }

  const handleChange = (index, field, value) => {
    const updatedSellers = [...sellers]
    updatedSellers[index] = { ...updatedSellers[index], [field]: value }
    setSellers(updatedSellers)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    updateData(sellers)
  }

  if (loading) {
    return <div>தரவுகளை ஏற்றுகிறது...</div>
  }

  return (
    <form onSubmit={handleSubmit}>
      {sellers.map((seller, index) => (
        <div key={index} className="mb-6 p-4 border rounded-md bg-gray-50">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-md font-medium">விற்பவர் {index + 1}</h3>
            {sellers.length > 1 && (
              <Button type="button" variant="ghost" size="sm" onClick={() => handleRemoveSeller(index)}>
                <Trash2 className="h-4 w-4 mr-1" /> நீக்கு
              </Button>
            )}
          </div>

          <div className="mb-4">
            <Label htmlFor={`existingUser-${index}`}>ஏற்கனவே உள்ள பயனாளரைத் தேர்ந்தெடுக்கவும்</Label>
            <Select value={seller.id} onValueChange={(value) => handleSelectExistingUser(index, value)}>
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
                value={seller.name}
                onChange={(e) => handleChange(index, "name", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`relationDetails-${index}`}>உறவு விவரங்கள்</Label>
              <Input
                id={`relationDetails-${index}`}
                value={seller.relationDetails}
                onChange={(e) => handleChange(index, "relationDetails", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`address-${index}`}>முகவரி</Label>
              <Input
                id={`address-${index}`}
                value={seller.address}
                onChange={(e) => handleChange(index, "address", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`phone-${index}`}>தொலைபேசி எண்</Label>
              <Input
                id={`phone-${index}`}
                value={seller.phone}
                onChange={(e) => handleChange(index, "phone", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`aadhaarNumber-${index}`}>ஆதார் எண்</Label>
              <Input
                id={`aadhaarNumber-${index}`}
                value={seller.aadhaarNumber}
                onChange={(e) => handleChange(index, "aadhaarNumber", e.target.value)}
              />
            </div>
          </div>
        </div>
      ))}

      <Button type="button" variant="outline" onClick={handleAddSeller} className="mt-2">
        <PlusCircle className="h-4 w-4 mr-1" /> மற்றொரு விற்பவரைச் சேர்க்க
      </Button>

      <Button type="submit" className="mt-4 ml-2 bg-cyan-600 hover:bg-cyan-700 text-white">
        அடுத்த பக்கம்
      </Button>
    </form>
  )
}
