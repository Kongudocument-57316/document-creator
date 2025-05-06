"use client"

import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getSupabaseBrowserClient } from "@/lib/supabase"
import { Trash2, Plus, Pencil } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UserSearchDialog } from "../components/user-search-dialog"
import { UserDetailDialog } from "../components/user-detail-dialog"
import { toast } from "sonner"

interface District {
  id: number
  name: string
}

interface Taluk {
  id: number
  name: string
  district_id: number
}

interface BuyerTabProps {
  data: any[]
  updateData: (data: any[]) => void
}

export function BuyerTab({ data, updateData }: BuyerTabProps) {
  const [buyers, setBuyers] = useState<any[]>(data.length > 0 ? data : [])
  const [districts, setDistricts] = useState<District[]>([])
  const [taluks, setTaluks] = useState<Taluk[]>([])
  const [filteredTaluks, setFilteredTaluks] = useState<{ [key: number]: Taluk[] }>({})
  const [loading, setLoading] = useState(true)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)

  const supabase = getSupabaseBrowserClient()

  function createEmptyBuyer() {
    return {
      id: Date.now(), // Temporary ID for UI purposes
      contactType: "",
      name: "",
      age: "",
      relationType: "",
      relationName: "",
      doorNo: "",
      pincode: "",
      address1: "",
      address2: "",
      address3: "",
      districtId: "",
      talukId: "",
      aadharNo: "",
      phoneNo: "",
      district_name: "",
      taluk_name: "",
    }
  }

  useEffect(() => {
    async function fetchReferenceData() {
      try {
        setLoading(true)

        // Fetch districts
        const { data: districtsData } = await supabase.from("districts").select("id, name").order("name")

        if (districtsData) setDistricts(districtsData)

        // Fetch taluks
        const { data: taluksData } = await supabase.from("taluks").select("id, name, district_id").order("name")

        if (taluksData) {
          setTaluks(taluksData)

          // Group taluks by district_id
          const grouped: { [key: number]: Taluk[] } = {}
          taluksData.forEach((taluk) => {
            if (!grouped[taluk.district_id]) {
              grouped[taluk.district_id] = []
            }
            grouped[taluk.district_id].push(taluk)
          })
          setFilteredTaluks(grouped)
        }
      } catch (error) {
        console.error("Error fetching reference data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchReferenceData()
  }, [supabase])

  const handleChange = (index: number, field: string, value: string) => {
    const updatedBuyers = [...buyers]
    updatedBuyers[index] = { ...updatedBuyers[index], [field]: value }

    // If district changed, reset taluk
    if (field === "districtId") {
      updatedBuyers[index].talukId = ""

      // Update district_name
      const district = districts.find((d) => d.id.toString() === value)
      if (district) {
        updatedBuyers[index].district_name = district.name
      }
    }

    // If taluk changed, update taluk_name
    if (field === "talukId") {
      const taluk = taluks.find((t) => t.id.toString() === value)
      if (taluk) {
        updatedBuyers[index].taluk_name = taluk.name
      }
    }

    setBuyers(updatedBuyers)
    updateData(updatedBuyers)
  }

  const addBuyer = () => {
    const updatedBuyers = [...buyers, createEmptyBuyer()]
    setBuyers(updatedBuyers)
    updateData(updatedBuyers)
    setEditingIndex(updatedBuyers.length - 1)
  }

  const removeBuyer = (index: number) => {
    if (!confirm("இந்த வாங்குபவரை நீக்க விரும்புகிறீர்களா?")) {
      return
    }

    const updatedBuyers = buyers.filter((_, i) => i !== index)
    setBuyers(updatedBuyers)
    updateData(updatedBuyers)

    if (editingIndex === index) {
      setEditingIndex(null)
    } else if (editingIndex !== null && editingIndex > index) {
      setEditingIndex(editingIndex - 1)
    }

    toast.success("வாங்குபவர் வெற்றிகரமாக நீக்கப்பட்டார்")
  }

  const handleSelectUser = (user: any) => {
    const newBuyer = {
      id: Date.now(),
      contactType: "personal",
      name: user.name,
      age: user.age || "",
      relationType: user.relation_type || "",
      relationName: user.relative_name || "",
      doorNo: user.door_number || "",
      pincode: user.pincode || "",
      address1: user.address_line1 || "",
      address2: user.address_line2 || "",
      address3: user.address_line3 || "",
      districtId: user.district_id ? user.district_id.toString() : "",
      talukId: user.taluk_id ? user.taluk_id.toString() : "",
      aadharNo: user.aadhaar_number || "",
      phoneNo: user.phone || "",
      district_name: user.district_name || "",
      taluk_name: user.taluk_name || "",
      user_id: user.id, // Store the original user ID for reference
    }

    const updatedBuyers = [...buyers, newBuyer]
    setBuyers(updatedBuyers)
    updateData(updatedBuyers)
    toast.success("வாங்குபவர் வெற்றிகரமாக சேர்க்கப்பட்டார்")
  }

  const startEditing = (index: number) => {
    setEditingIndex(index)
  }

  const stopEditing = () => {
    setEditingIndex(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-purple-800">வாங்குபவர் விவரங்கள்</h3>
        <div className="flex gap-2">
          <UserSearchDialog onSelectUser={handleSelectUser} buttonLabel="வாங்குபவரைத் தேடு" dialogTitle="வாங்குபவர் தேடுதல்" />
          <Button
            type="button"
            variant="outline"
            onClick={addBuyer}
            className="border-purple-300 text-purple-700 hover:bg-purple-100"
          >
            <Plus className="h-4 w-4 mr-2" />
            புதிய வாங்குபவர்
          </Button>
        </div>
      </div>

      {buyers.length === 0 ? (
        <div className="text-center p-8 bg-purple-50 rounded-lg border border-purple-200">
          <p className="text-purple-700">
            வாங்குபவர்கள் எதுவும் சேர்க்கப்படவில்லை. மேலே உள்ள "வாங்குபவரைத் தேடு" பொத்தானைப் பயன்படுத்தி ஒரு பயனாளரைத் தேர்ந்தெடுக்கவும் அல்லது
            "புதிய வாங்குபவர்" பொத்தானைப் பயன்படுத்தி புதிய வாங்குபவரை உருவாக்கவும்.
          </p>
        </div>
      ) : (
        buyers.map((buyer, index) => (
          <Card key={buyer.id} className="border-purple-200">
            <CardHeader className="bg-purple-50 rounded-t-lg flex flex-row items-center justify-between">
              <CardTitle className="text-purple-700">வாங்குபவர் விவரங்கள் #{index + 1}</CardTitle>
              <div className="flex items-center gap-2">
                <UserDetailDialog user={buyer} />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => (editingIndex === index ? stopEditing() : startEditing(index))}
                  className="text-green-600 hover:text-green-800 hover:bg-green-100"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeBuyer(index)}
                  className="text-red-600 hover:text-red-800 hover:bg-red-100"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {editingIndex === index ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`contact-type-${index}`}>தொடர்புகொள்ள தேதி</Label>
                      <Select
                        value={buyer.contactType}
                        onValueChange={(value) => handleChange(index, "contactType", value)}
                      >
                        <SelectTrigger className="mt-1 border-purple-200 focus-visible:ring-purple-400">
                          <SelectValue placeholder="தொடர்புகொள்ள தேதி" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="personal">தனிப்பட்ட</SelectItem>
                          <SelectItem value="business">வணிக</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`name-${index}`}>பெயர் (Name)</Label>
                      <Input
                        id={`name-${index}`}
                        placeholder="பெயரை உள்ளிடவும்"
                        value={buyer.name}
                        onChange={(e) => handleChange(index, "name", e.target.value)}
                        className="mt-1 border-purple-200 focus-visible:ring-purple-400"
                      />
                    </div>

                    <div>
                      <Label htmlFor={`age-${index}`}>வயது (Age)</Label>
                      <Input
                        id={`age-${index}`}
                        placeholder="வயதை உள்ளிடவும்"
                        value={buyer.age}
                        onChange={(e) => handleChange(index, "age", e.target.value)}
                        className="mt-1 border-purple-200 focus-visible:ring-purple-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`relation-type-${index}`}>உறவு முறை (Relation Type)</Label>
                      <Input
                        id={`relation-type-${index}`}
                        placeholder="உறவு முறையை உள்ளிடவும்"
                        value={buyer.relationType}
                        onChange={(e) => handleChange(index, "relationType", e.target.value)}
                        className="mt-1 border-purple-200 focus-visible:ring-purple-400"
                      />
                    </div>

                    <div>
                      <Label htmlFor={`relation-name-${index}`}>உறவினர் பெயர் (Relation Name)</Label>
                      <Input
                        id={`relation-name-${index}`}
                        placeholder="உறவினர் பெயரை உள்ளிடவும்"
                        value={buyer.relationName}
                        onChange={(e) => handleChange(index, "relationName", e.target.value)}
                        className="mt-1 border-purple-200 focus-visible:ring-purple-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`door-no-${index}`}>கதவு எண் (Door No)</Label>
                      <Input
                        id={`door-no-${index}`}
                        placeholder="கதவு எண்ணை உள்ளிடவும்"
                        value={buyer.doorNo}
                        onChange={(e) => handleChange(index, "doorNo", e.target.value)}
                        className="mt-1 border-purple-200 focus-visible:ring-purple-400"
                      />
                    </div>

                    <div>
                      <Label htmlFor={`pincode-${index}`}>அஞ்சல் குறியீடு (Pincode)</Label>
                      <Input
                        id={`pincode-${index}`}
                        placeholder="அஞ்சல் குறியீட்டை உள்ளிடவும்"
                        value={buyer.pincode}
                        onChange={(e) => handleChange(index, "pincode", e.target.value)}
                        className="mt-1 border-purple-200 focus-visible:ring-purple-400"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor={`address1-${index}`}>முகவரி (Address) 1</Label>
                      <Input
                        id={`address1-${index}`}
                        placeholder="முகவரியை உள்ளிடவும்"
                        value={buyer.address1}
                        onChange={(e) => handleChange(index, "address1", e.target.value)}
                        className="mt-1 border-purple-200 focus-visible:ring-purple-400"
                      />
                    </div>

                    <div>
                      <Label htmlFor={`address2-${index}`}>முகவரி (Address) 2</Label>
                      <Input
                        id={`address2-${index}`}
                        placeholder="முகவரியை உள்ளிடவும்"
                        value={buyer.address2}
                        onChange={(e) => handleChange(index, "address2", e.target.value)}
                        className="mt-1 border-purple-200 focus-visible:ring-purple-400"
                      />
                    </div>

                    <div>
                      <Label htmlFor={`address3-${index}`}>முகவரி (Address) 3</Label>
                      <Input
                        id={`address3-${index}`}
                        placeholder="முகவரியை உள்ளிடவும்"
                        value={buyer.address3}
                        onChange={(e) => handleChange(index, "address3", e.target.value)}
                        className="mt-1 border-purple-200 focus-visible:ring-purple-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`district-${index}`}>மாவட்டம் (District)</Label>
                      <Select
                        value={buyer.districtId}
                        onValueChange={(value) => handleChange(index, "districtId", value)}
                      >
                        <SelectTrigger className="mt-1 border-purple-200 focus-visible:ring-purple-400">
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
                      <Label htmlFor={`taluk-${index}`}>வட்டம் (Taluk)</Label>
                      <Select
                        value={buyer.talukId}
                        onValueChange={(value) => handleChange(index, "talukId", value)}
                        disabled={!buyer.districtId}
                      >
                        <SelectTrigger className="mt-1 border-purple-200 focus-visible:ring-purple-400">
                          <SelectValue placeholder="வட்டத்தை தேர்ந்தெடுக்கவும்" />
                        </SelectTrigger>
                        <SelectContent>
                          {buyer.districtId &&
                            filteredTaluks[Number(buyer.districtId)]?.map((taluk) => (
                              <SelectItem key={taluk.id} value={taluk.id.toString()}>
                                {taluk.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`aadhar-${index}`}>ஆதார் எண் (Aadhar No)</Label>
                      <Input
                        id={`aadhar-${index}`}
                        placeholder="ஆதார் எண்ணை உள்ளிடவும்"
                        value={buyer.aadharNo}
                        onChange={(e) => handleChange(index, "aadharNo", e.target.value)}
                        className="mt-1 border-purple-200 focus-visible:ring-purple-400"
                      />
                    </div>

                    <div>
                      <Label htmlFor={`phone-${index}`}>கைபேசி எண் (Phone No)</Label>
                      <Input
                        id={`phone-${index}`}
                        placeholder="கைபேசி எண்ணை உள்ளிடவும்"
                        value={buyer.phoneNo}
                        onChange={(e) => handleChange(index, "phoneNo", e.target.value)}
                        className="mt-1 border-purple-200 focus-visible:ring-purple-400"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button type="button" onClick={stopEditing} className="bg-purple-600 hover:bg-purple-700">
                      முடிந்தது
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 sm:gap-4">
                    <div>
                      <h3 className="font-semibold text-purple-800 text-sm sm:text-base">பெயர்:</h3>
                      <p className="text-sm sm:text-base truncate">{buyer.name}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-purple-800 text-sm sm:text-base">வயது:</h3>
                      <p className="text-sm sm:text-base">{buyer.age}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 sm:gap-4">
                    <div>
                      <h3 className="font-semibold text-purple-800 text-sm sm:text-base">உறவுமுறை:</h3>
                      <p className="text-sm sm:text-base truncate">{buyer.relationType}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-purple-800 text-sm sm:text-base">உறவினரின் பெயர்:</h3>
                      <p className="text-sm sm:text-base truncate">{buyer.relationName}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-purple-800 text-sm sm:text-base">முகவரி:</h3>
                    <p className="text-sm sm:text-base">
                      {buyer.doorNo && `${buyer.doorNo}, `}
                      {buyer.address1}
                    </p>
                    {buyer.address2 && <p className="text-sm sm:text-base">{buyer.address2}</p>}
                    {buyer.address3 && <p className="text-sm sm:text-base">{buyer.address3}</p>}
                    <p className="text-sm sm:text-base">
                      {buyer.district_name && `${buyer.district_name}, `}
                      {buyer.taluk_name && `${buyer.taluk_name}, `}
                      {buyer.pincode}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 sm:gap-4">
                    <div>
                      <h3 className="font-semibold text-purple-800 text-sm sm:text-base">ஆதார் எண்:</h3>
                      <p className="text-sm sm:text-base">{buyer.aadharNo}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-purple-800 text-sm sm:text-base">கைபேசி எண்:</h3>
                      <p className="text-sm sm:text-base">{buyer.phoneNo}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}
