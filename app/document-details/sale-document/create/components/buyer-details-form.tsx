"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusCircle, Trash2 } from "lucide-react"
import { getSupabaseBrowserClient } from "@/lib/supabase"
import { toast } from "sonner"
import { FormError } from "@/components/ui/form-error"
import { isRequired, isValidPhone, isValidAadhaar, errorMessages } from "@/lib/validation"

export default function BuyerDetailsForm({ data, updateData }) {
  const [buyers, setBuyers] = useState(data)
  const [existingUsers, setExistingUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [errors, setErrors] = useState([])
  const [touched, setTouched] = useState([])

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

  useEffect(() => {
    // Initialize errors and touched arrays
    setErrors(buyers.map(() => ({})))
    setTouched(buyers.map(() => ({})))
  }, [buyers.length])

  const validateField = (index, field, value) => {
    switch (field) {
      case "name":
        return isRequired(value) ? "" : errorMessages.required
      case "phone":
        if (!isValidPhone(value) && value) return errorMessages.phone
        return ""
      case "aadhaarNumber":
        if (!isValidAadhaar(value) && value) return errorMessages.aadhaar
        return ""
      default:
        return ""
    }
  }

  const validateBuyer = (buyer, index) => {
    const buyerErrors = {}
    let isValid = true

    // Validate required fields
    if (!isRequired(buyer.name)) {
      buyerErrors.name = errorMessages.required
      isValid = false
    }

    // Validate phone if provided
    if (buyer.phone && !isValidPhone(buyer.phone)) {
      buyerErrors.phone = errorMessages.phone
      isValid = false
    }

    // Validate aadhaar if provided
    if (buyer.aadhaarNumber && !isValidAadhaar(buyer.aadhaarNumber)) {
      buyerErrors.aadhaarNumber = errorMessages.aadhaar
      isValid = false
    }

    // Update errors for this buyer
    const newErrors = [...errors]
    newErrors[index] = buyerErrors
    setErrors(newErrors)

    return isValid
  }

  const validateAllBuyers = () => {
    // Mark all fields as touched
    const allTouched = buyers.map(() => ({
      name: true,
      relationDetails: true,
      address: true,
      phone: true,
      aadhaarNumber: true,
    }))
    setTouched(allTouched)

    // Validate all buyers
    return buyers.every((buyer, index) => validateBuyer(buyer, index))
  }

  const handleAddBuyer = () => {
    setBuyers([...buyers, { id: "", name: "", relationDetails: "", address: "", phone: "", aadhaarNumber: "" }])
    setErrors([...errors, {}])
    setTouched([...touched, {}])
  }

  const handleRemoveBuyer = (index) => {
    const updatedBuyers = [...buyers]
    updatedBuyers.splice(index, 1)
    setBuyers(updatedBuyers)

    const updatedErrors = [...errors]
    updatedErrors.splice(index, 1)
    setErrors(updatedErrors)

    const updatedTouched = [...touched]
    updatedTouched.splice(index, 1)
    setTouched(updatedTouched)
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

    // Validate the updated buyer
    validateBuyer(updatedBuyers[index], index)
  }

  const handleChange = (index, field, value) => {
    const updatedBuyers = [...buyers]
    updatedBuyers[index] = { ...updatedBuyers[index], [field]: value }
    setBuyers(updatedBuyers)

    // Mark field as touched
    const newTouched = [...touched]
    newTouched[index] = { ...newTouched[index], [field]: true }
    setTouched(newTouched)

    // Validate the field
    const error = validateField(index, field, value)
    const newErrors = [...errors]
    newErrors[index] = { ...newErrors[index], [field]: error }
    setErrors(newErrors)
  }

  const handleBlur = (index, field) => {
    // Mark field as touched
    const newTouched = [...touched]
    newTouched[index] = { ...newTouched[index], [field]: true }
    setTouched(newTouched)

    // Validate the field
    const error = validateField(index, field, buyers[index][field])
    const newErrors = [...errors]
    newErrors[index] = { ...newErrors[index], [field]: error }
    setErrors(newErrors)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (validateAllBuyers()) {
      updateData(buyers)
    } else {
      toast.error("படிவத்தில் பிழைகள் உள்ளன. சரிபார்த்து மீண்டும் முயற்சிக்கவும்.")
    }
  }

  if (loading) {
    return <div>தரவுகளை ஏற்றுகிறது...</div>
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
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
              <Label
                htmlFor={`name-${index}`}
                className={errors[index]?.name && touched[index]?.name ? "text-red-500" : ""}
              >
                பெயர் <span className="text-red-500">*</span>
              </Label>
              <Input
                id={`name-${index}`}
                value={buyer.name}
                onChange={(e) => handleChange(index, "name", e.target.value)}
                onBlur={() => handleBlur(index, "name")}
                className={errors[index]?.name && touched[index]?.name ? "border-red-500" : ""}
                required
              />
              {touched[index]?.name && <FormError message={errors[index]?.name} />}
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
              <Label
                htmlFor={`phone-${index}`}
                className={errors[index]?.phone && touched[index]?.phone ? "text-red-500" : ""}
              >
                தொலைபேசி எண்
              </Label>
              <Input
                id={`phone-${index}`}
                value={buyer.phone}
                onChange={(e) => handleChange(index, "phone", e.target.value)}
                onBlur={() => handleBlur(index, "phone")}
                className={errors[index]?.phone && touched[index]?.phone ? "border-red-500" : ""}
              />
              {touched[index]?.phone && <FormError message={errors[index]?.phone} />}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor={`aadhaarNumber-${index}`}
                className={errors[index]?.aadhaarNumber && touched[index]?.aadhaarNumber ? "text-red-500" : ""}
              >
                ஆதார் எண்
              </Label>
              <Input
                id={`aadhaarNumber-${index}`}
                value={buyer.aadhaarNumber}
                onChange={(e) => handleChange(index, "aadhaarNumber", e.target.value)}
                onBlur={() => handleBlur(index, "aadhaarNumber")}
                className={errors[index]?.aadhaarNumber && touched[index]?.aadhaarNumber ? "border-red-500" : ""}
              />
              {touched[index]?.aadhaarNumber && <FormError message={errors[index]?.aadhaarNumber} />}
            </div>
          </div>
        </div>
      ))}

      <div className="mt-4 text-sm text-gray-500">
        <span className="text-red-500">*</span> குறிக்கப்பட்ட புலங்கள் கட்டாயமாக நிரப்பப்பட வேண்டும்
      </div>

      <Button type="button" variant="outline" onClick={handleAddBuyer} className="mt-2">
        <PlusCircle className="h-4 w-4 mr-1" /> மற்றொரு வாங்குபவரைச் சேர்க்க
      </Button>

      <Button type="submit" className="mt-4 ml-2 bg-cyan-600 hover:bg-cyan-700 text-white">
        அடுத்த பக்கம்
      </Button>
    </form>
  )
}
