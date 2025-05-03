"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState, useEffect } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase"
import { toast } from "sonner"
import { useSearchParams, useRouter } from "next/navigation"

interface District {
  id: number
  name: string
}

interface Taluk {
  id: number
  name: string
  district_id: number
}

interface User {
  id: number
  name: string
  gender: string
  relation_type: string
  relative_name: string
  door_number: string
  address_line1: string
  address_line2: string
  address_line3: string
  district_id: number | null
  taluk_id: number | null
  phone: string
  aadhaar_number: string
  pan_number: string
  aadhaar_file_path?: string
  pan_file_path?: string
  pincode: string
  date_of_birth?: string | null
  age?: number | null
}

export function UserForm() {
  const [name, setName] = useState("")
  const [gender, setGender] = useState("male")
  const [relationType, setRelationType] = useState("த/பெ")
  const [relativeName, setRelativeName] = useState("")
  const [doorNumber, setDoorNumber] = useState("")
  const [pincode, setPincode] = useState("")
  const [addressLine1, setAddressLine1] = useState("")
  const [addressLine2, setAddressLine2] = useState("")
  const [addressLine3, setAddressLine3] = useState("")
  const [districtId, setDistrictId] = useState("")
  const [talukId, setTalukId] = useState("")
  const [phone, setPhone] = useState("")
  const [aadhaarNumber, setAadhaarNumber] = useState("")
  const [panNumber, setPanNumber] = useState("")
  const [aadhaarFile, setAadhaarFile] = useState<File | null>(null)
  const [panFile, setPanFile] = useState<File | null>(null)
  const [dateOfBirth, setDateOfBirth] = useState("")
  const [age, setAge] = useState<number | null>(null)

  const [districts, setDistricts] = useState<District[]>([])
  const [taluks, setTaluks] = useState<Taluk[]>([])
  const [filteredTaluks, setFilteredTaluks] = useState<Taluk[]>([])

  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [isInitialLoad, setIsInitialLoad] = useState(true)

  const searchParams = useSearchParams()
  const router = useRouter()
  const editId = searchParams.get("edit")

  const supabase = getSupabaseBrowserClient()

  const fetchDistricts = async () => {
    try {
      const { data, error } = await supabase.from("districts").select("*").order("name")

      if (error) {
        toast.error("மாவட்டங்களை பெறுவதில் பிழை: " + error.message)
        return
      }

      setDistricts(data || [])
    } catch (error: any) {
      toast.error("மாவட்டங்களை பெறுவதில் பிழை: " + error.message)
    }
  }

  const fetchTaluks = async () => {
    try {
      const { data, error } = await supabase.from("taluks").select("*").order("name")

      if (error) {
        toast.error("வட்டங்களை பெறுவதில் பிழை: " + error.message)
        return
      }

      setTaluks(data || [])
    } catch (error: any) {
      toast.error("வட்டங்களை பெறுவதில் பிழை: " + error.message)
    }
  }

  const formatDateForDisplay = (isoDate: string): string => {
    if (!isoDate) return ""
    const date = new Date(isoDate)
    const day = date.getDate().toString().padStart(2, "0")
    const month = (date.getMonth() + 1).toString().padStart(2, "0")
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  const formatDateForInput = (displayDate: string): string => {
    if (!displayDate) return ""
    const [day, month, year] = displayDate.split("/")
    return `${year}-${month}-${day}`
  }

  const calculateAge = (birthDateStr: string) => {
    if (!birthDateStr) {
      setAge(null)
      return
    }

    let birthDate
    // Check if the date is in DD/MM/YYYY format
    if (birthDateStr.includes("/")) {
      const [day, month, year] = birthDateStr.split("/")
      birthDate = new Date(`${year}-${month}-${day}`)
    } else {
      // Assume ISO format (YYYY-MM-DD)
      birthDate = new Date(birthDateStr)
    }

    const today = new Date()
    let calculatedAge = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      calculatedAge--
    }

    setAge(calculatedAge)
  }

  const fetchUserById = async (id: number) => {
    try {
      const { data, error } = await supabase.from("users").select("*").eq("id", id).single()

      if (error) {
        toast.error("பயனாளர் விவரங்களை பெறுவதில் பிழை: " + error.message)
        return
      }

      if (data) {
        setName(data.name || "")
        setGender(data.gender || "male")
        setRelationType(data.relation_type || "த/பெ")
        setRelativeName(data.relative_name || "")
        setDoorNumber(data.door_number || "")
        setPincode(data.pincode || "")
        setAddressLine1(data.address_line1 || "")
        setAddressLine2(data.address_line2 || "")
        setAddressLine3(data.address_line3 || "")
        setDistrictId(data.district_id ? data.district_id.toString() : "")
        setTalukId(data.taluk_id ? data.taluk_id.toString() : "")
        setPhone(data.phone || "")
        setAadhaarNumber(data.aadhaar_number || "")
        setPanNumber(data.pan_number || "")
        setEditingId(data.id)

        // பிறந்த தேதி புலத்தை சேர்க்கவும்
        if (data.date_of_birth) {
          const date = new Date(data.date_of_birth)
          const day = date.getDate().toString().padStart(2, "0")
          const month = (date.getMonth() + 1).toString().padStart(2, "0")
          const year = date.getFullYear()
          setDateOfBirth(`${day}/${month}/${year}`)
          calculateAge(`${day}/${month}/${year}`)
        }
      }
    } catch (error: any) {
      toast.error("பயனாளர் விவரங்களை பெறுவதில் பிழை: " + error.message)
    }
  }

  useEffect(() => {
    fetchDistricts()
    fetchTaluks()

    if (editId && isInitialLoad) {
      const id = Number.parseInt(editId)
      if (!isNaN(id)) {
        fetchUserById(id)
      }
      setIsInitialLoad(false)
    }
  }, [editId, isInitialLoad])

  useEffect(() => {
    if (districtId) {
      const filtered = taluks.filter((taluk) => taluk.district_id === Number.parseInt(districtId))
      setFilteredTaluks(filtered)
    } else {
      setFilteredTaluks([])
    }
    if (!isInitialLoad) {
      setTalukId("")
    }
  }, [districtId, taluks, isInitialLoad])

  const formatAadhaarNumber = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, "")

    // Format as xxxx xxxx xxxx
    const formatted = digits.replace(/(\d{4})(?=\d)/g, "$1 ")

    return formatted.slice(0, 14) // Limit to 14 chars (12 digits + 2 spaces)
  }

  const handleAadhaarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatAadhaarNumber(e.target.value)
    setAadhaarNumber(formatted)
  }

  const checkDuplicateAadhaar = async (aadhaar: string) => {
    // Remove spaces for comparison
    const cleanAadhaar = aadhaar.replace(/\s/g, "")

    if (cleanAadhaar.length !== 12) return false

    const { data, error } = await supabase.from("users").select("id").eq("aadhaar_number", aadhaar)

    if (error) {
      toast.error("ஆதார் எண் சரிபார்ப்பில் பிழை: " + error.message)
      return false
    }

    // If editing, exclude the current user
    if (editingId && data) {
      const filtered = data.filter((user) => user.id !== editingId)
      return filtered.length > 0
    }

    return data && data.length > 0
  }

  const uploadFile = async (file: File, bucket: string) => {
    try {
      const fileName = `${Date.now()}_${file.name}`
      const { data, error } = await supabase.storage.from(bucket).upload(fileName, file)

      if (error) throw error

      return fileName
    } catch (error: any) {
      console.error("File upload error:", error)
      throw new Error(`File upload failed: ${error.message}`)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate required fields
    if (!name.trim()) {
      toast.error("பயனாளரின் பெயரை உள்ளிடவும்")
      return
    }

    if (!gender) {
      toast.error("பாலினத்தை தேர்ந்தெடுக்கவும்")
      return
    }

    if (!relationType) {
      toast.error("உறவுமுறையை தேர்ந்தெடுக்கவும்")
      return
    }

    if (!relativeName.trim()) {
      toast.error("உறவினரின் பெயரை உள்ளிடவும்")
      return
    }

    // Validate Aadhaar format
    const cleanAadhaar = aadhaarNumber.replace(/\s/g, "")
    if (cleanAadhaar && cleanAadhaar.length !== 12) {
      toast.error("சரியான ஆதார் எண்ணை உள்ளிடவும் (12 இலக்கங்கள்)")
      return
    }

    // Check for duplicate Aadhaar
    if (cleanAadhaar) {
      const isDuplicate = await checkDuplicateAadhaar(aadhaarNumber)
      if (isDuplicate) {
        toast.error("இந்த ஆதார் எண் ஏற்கனவே பதிவு செய்யப்பட்டுள்ளது")
        return
      }
    }

    setLoading(true)

    try {
      let aadhaarFilePath = null
      let panFilePath = null

      // Upload files if provided
      if (aadhaarFile) {
        try {
          aadhaarFilePath = await uploadFile(aadhaarFile, "aadhaar_documents")
        } catch (error: any) {
          toast.error("ஆதார் கோப்பு பதிவேற்றத்தில் பிழை: " + error.message)
        }
      }

      if (panFile) {
        try {
          panFilePath = await uploadFile(panFile, "pan_documents")
        } catch (error: any) {
          toast.error("PAN கோப்பு பதிவேற்றத்தில் பிழை: " + error.message)
        }
      }

      // Convert DD/MM/YYYY to YYYY-MM-DD for database
      let formattedDateOfBirth = null
      if (dateOfBirth) {
        const [day, month, year] = dateOfBirth.split("/")
        formattedDateOfBirth = `${year}-${month}-${day}`
      }

      const userData = {
        name,
        gender,
        relation_type: relationType,
        relative_name: relativeName,
        door_number: doorNumber,
        pincode,
        address_line1: addressLine1,
        address_line2: addressLine2,
        address_line3: addressLine3,
        district_id: districtId ? Number.parseInt(districtId) : null,
        taluk_id: talukId ? Number.parseInt(talukId) : null,
        phone,
        aadhaar_number: aadhaarNumber,
        pan_number: panNumber,
        date_of_birth: formattedDateOfBirth,
        age: age || null,
        ...(aadhaarFilePath && { aadhaar_file_path: aadhaarFilePath }),
        ...(panFilePath && { pan_file_path: panFilePath }),
      }

      console.log("Saving user data:", userData)

      if (editingId) {
        // Update existing user
        const { error, data } = await supabase.from("users").update(userData).eq("id", editingId).select()

        if (error) {
          console.error("Update error:", error)
          throw error
        }

        console.log("Updated user:", data)
        toast.success("பயனாளர் விவரங்கள் வெற்றிகரமாக புதுப்பிக்கப்பட்டன")

        // Redirect to search page
        router.push("/system-settings/user-management?tab=search")
      } else {
        // Add new user
        const { error, data } = await supabase.from("users").insert([userData]).select()

        if (error) {
          console.error("Insert error:", error)
          throw error
        }

        console.log("Inserted user:", data)
        toast.success("பயனாளர் விவரங்கள் வெற்றிகரமாக சேர்க்கப்பட்டன")

        // Reset form
        resetForm()

        // Redirect to search page
        router.push("/system-settings/user-management?tab=search")
      }
    } catch (error: any) {
      console.error("Form submission error:", error)
      toast.error("பிழை: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setName("")
    setGender("male")
    setRelationType("த/பெ")
    setRelativeName("")
    setDoorNumber("")
    setPincode("")
    setAddressLine1("")
    setAddressLine2("")
    setAddressLine3("")
    setDistrictId("")
    setTalukId("")
    setPhone("")
    setAadhaarNumber("")
    setPanNumber("")
    setAadhaarFile(null)
    setPanFile(null)
    setEditingId(null)
    setDateOfBirth("")
    setAge(null)
  }

  return (
    <div className="bg-green-50 p-6 rounded-lg">
      <h2 className="text-xl font-bold mb-6 text-green-800">பயனாளர் விவரங்கள்</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* அடிப்படை விவரங்கள் */}
          <div>
            <Label htmlFor="name" className="text-green-800 font-medium">
              பயனாளரின் பெயர்
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="பயனாளரின் பெயரை உள்ளிடவும்"
              className="mt-1 bg-white border-green-200 focus:border-green-400"
            />
          </div>

          <div>
            <Label className="text-green-800 font-medium">பாலினம்</Label>
            <RadioGroup value={gender} onValueChange={setGender} className="flex gap-4 mt-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="male" id="male" className="text-green-600" />
                <Label htmlFor="male" className="text-green-800">
                  ஆண்
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="female" id="female" className="text-green-600" />
                <Label htmlFor="female" className="text-green-800">
                  பெண்
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="date-of-birth" className="text-green-800 font-medium">
              பிறந்த தேதி (DD/MM/YYYY)
            </Label>
            <div className="flex gap-4">
              <Input
                id="date-of-birth"
                value={dateOfBirth}
                onChange={(e) => {
                  const value = e.target.value
                  setDateOfBirth(value)
                  calculateAge(value)
                }}
                placeholder="DD/MM/YYYY"
                className="mt-1 bg-white border-green-200 focus:border-green-400"
              />
              {age !== null && (
                <div className="mt-1 flex items-center">
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-md">வயது: {age}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="relation-type" className="text-green-800 font-medium">
              உறவுமுறை
            </Label>
            <Select value={relationType} onValueChange={setRelationType}>
              <SelectTrigger className="mt-1 bg-white border-green-200 focus:border-green-400">
                <SelectValue placeholder="உறவுமுறையை தேர்ந்தெடுக்கவும்" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="த/பெ">த/பெ</SelectItem>
                <SelectItem value="க/பெ">க/பெ</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="relative-name" className="text-green-800 font-medium">
              உறவினரின் பெயர்
            </Label>
            <Input
              id="relative-name"
              value={relativeName}
              onChange={(e) => setRelativeName(e.target.value)}
              placeholder="உறவினரின் பெயரை உள்ளிடவும்"
              className="mt-1 bg-white border-green-200 focus:border-green-400"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="door-number" className="text-green-800 font-medium">
              கதவு எண்
            </Label>
            <Input
              id="door-number"
              value={doorNumber}
              onChange={(e) => setDoorNumber(e.target.value)}
              placeholder="கதவு எண்ணை உள்ளிடவும்"
              className="mt-1 bg-white border-green-200 focus:border-green-400"
            />
          </div>

          <div>
            <Label htmlFor="address-line1" className="text-green-800 font-medium">
              முகவரி வரி 1
            </Label>
            <Input
              id="address-line1"
              value={addressLine1}
              onChange={(e) => setAddressLine1(e.target.value)}
              placeholder="முகவரி வரி 1 உள்ளிடவும்"
              className="mt-1 bg-white border-green-200 focus:border-green-400"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="address-line2" className="text-green-800 font-medium">
              முகவரி வரி 2
            </Label>
            <Input
              id="address-line2"
              value={addressLine2}
              onChange={(e) => setAddressLine2(e.target.value)}
              placeholder="முகவரி வரி 2 உள்ளிடவும்"
              className="mt-1 bg-white border-green-200 focus:border-green-400"
            />
          </div>

          <div>
            <Label htmlFor="address-line3" className="text-green-800 font-medium">
              முகவரி வரி 3
            </Label>
            <Input
              id="address-line3"
              value={addressLine3}
              onChange={(e) => setAddressLine3(e.target.value)}
              placeholder="முகவரி வரி 3 உள்ளிடவும்"
              className="mt-1 bg-white border-green-200 focus:border-green-400"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="district-select" className="text-green-800 font-medium">
              மாவட்டம்
            </Label>
            <Select value={districtId} onValueChange={setDistrictId}>
              <SelectTrigger className="mt-1 bg-white border-green-200 focus:border-green-400">
                <SelectValue placeholder="மாவட்டத்தை தேர்ந்தெடுக்கவும்" />
              </SelectTrigger>
              <SelectContent>
                {districts.map((district) => (
                  <SelectItem key={district.id} value={district.id.toString()}>
                    {district.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="taluk-select" className="text-green-800 font-medium">
              வட்டம்
            </Label>
            <Select value={talukId} onValueChange={setTalukId} disabled={filteredTaluks.length === 0}>
              <SelectTrigger className="mt-1 bg-white border-green-200 focus:border-green-400">
                <SelectValue placeholder="வட்டத்தை தேர்ந்தெடுக்கவும்" />
              </SelectTrigger>
              <SelectContent>
                {filteredTaluks.map((taluk) => (
                  <SelectItem key={taluk.id} value={taluk.id.toString()}>
                    {taluk.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="pincode" className="text-green-800 font-medium">
              பின்கோடு
            </Label>
            <Input
              id="pincode"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              placeholder="பின்கோடை உள்ளிடவும்"
              className="mt-1 bg-white border-green-200 focus:border-green-400"
              maxLength={6}
            />
          </div>

          <div>
            <Label htmlFor="phone" className="text-green-800 font-medium">
              தொலைபேசி எண்
            </Label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="தொலைபேசி எண்ணை உள்ளிடவும்"
              className="mt-1 bg-white border-green-200 focus:border-green-400"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="aadhaar" className="text-green-800 font-medium">
            ஆதார் அடையாள அட்டை எண்
          </Label>
          <Input
            id="aadhaar"
            value={aadhaarNumber}
            onChange={handleAadhaarChange}
            placeholder="xxxx xxxx xxxx"
            className="mt-1 bg-white border-green-200 focus:border-green-400"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="aadhaar-file" className="text-green-800 font-medium">
              ஆதார் அட்டை பதிவேற்றம்
            </Label>
            <Input
              id="aadhaar-file"
              type="file"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setAadhaarFile(e.target.files[0])
                }
              }}
              className="mt-1 bg-white border-green-200 focus:border-green-400"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="pan" className="text-green-800 font-medium">
            நிரந்தர கணக்கு அட்டை எண்
          </Label>
          <Input
            id="pan"
            value={panNumber}
            onChange={(e) => setPanNumber(e.target.value)}
            placeholder="நிரந்தர கணக்கு அட்டை எண்ணை உள்ளிடவும்"
            className="mt-1 bg-white border-green-200 focus:border-green-400"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="pan-file" className="text-green-800 font-medium">
              நிரந்தர கணக்கு அட்டை பதிவேற்றம்
            </Label>
            <Input
              id="pan-file"
              type="file"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setPanFile(e.target.files[0])
                }
              }}
              className="mt-1 bg-white border-green-200 focus:border-green-400"
            />
          </div>
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2">
            {loading ? "சேமிக்கிறது..." : editingId ? "புதுப்பி" : "புதுப்பி"}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={resetForm}
            disabled={loading}
            className="border-green-300 text-green-700 hover:bg-green-100 px-6 py-2"
          >
            ரத்து செய்
          </Button>
        </div>
      </form>
    </div>
  )
}
