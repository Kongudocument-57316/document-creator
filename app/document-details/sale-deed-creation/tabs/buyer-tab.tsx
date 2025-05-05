"use client"

import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getSupabaseBrowserClient } from "@/lib/supabase"
import { Trash2, Plus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

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
  const [buyers, setBuyers] = useState<any[]>(data.length > 0 ? data : [createEmptyBuyer()])
  const [districts, setDistricts] = useState<District[]>([])
  const [taluks, setTaluks] = useState<Taluk[]>([])
  const [filteredTaluks, setFilteredTaluks] = useState<{ [key: number]: Taluk[] }>({})
  const [loading, setLoading] = useState(true)

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
    }

    setBuyers(updatedBuyers)
    updateData(updatedBuyers)
  }

  const addBuyer = () => {
    const updatedBuyers = [...buyers, createEmptyBuyer()]
    setBuyers(updatedBuyers)
    updateData(updatedBuyers)
  }

  const removeBuyer = (index: number) => {
    if (buyers.length === 1) return // Keep at least one buyer

    const updatedBuyers = buyers.filter((_, i) => i !== index)
    setBuyers(updatedBuyers)
    updateData(updatedBuyers)
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-purple-800">வாங்குபவர் விவரங்கள்</h3>

      {buyers.map((buyer, index) => (
        <Card key={buyer.id} className="border-purple-200">
          <CardHeader className="bg-purple-50 rounded-t-lg flex flex-row items-center justify-between">
            <CardTitle className="text-purple-700">வாங்குபவர் விவரங்கள் #{index + 1}</CardTitle>
            {buyers.length > 1 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeBuyer(index)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                நீக்கு
              </Button>
            )}
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`contact-type-${index}`}>தொடர்புகொள்ள தேதி</Label>
                <Select value={buyer.contactType} onValueChange={(value) => handleChange(index, "contactType", value)}>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
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

            <div className="space-y-4 mt-4">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <Label htmlFor={`district-${index}`}>மாவட்டம் (District)</Label>
                <Select value={buyer.districtId} onValueChange={(value) => handleChange(index, "districtId", value)}>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
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
          </CardContent>
        </Card>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={addBuyer}
        className="w-full border-purple-300 text-purple-700 hover:bg-purple-100"
      >
        <Plus className="h-4 w-4 mr-2" />
        மற்றொரு வாங்குபவரை சேர்க்க
      </Button>
    </div>
  )
}
