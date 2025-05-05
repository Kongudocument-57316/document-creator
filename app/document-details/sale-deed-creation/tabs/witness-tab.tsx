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

interface WitnessTabProps {
  data: any[]
  updateData: (data: any[]) => void
}

export function WitnessTab({ data, updateData }: WitnessTabProps) {
  const [witnesses, setWitnesses] = useState<any[]>(data.length > 0 ? data : [createEmptyWitness()])
  const [districts, setDistricts] = useState<District[]>([])
  const [taluks, setTaluks] = useState<Taluk[]>([])
  const [filteredTaluks, setFilteredTaluks] = useState<{ [key: number]: Taluk[] }>({})
  const [loading, setLoading] = useState(true)

  const supabase = getSupabaseBrowserClient()

  function createEmptyWitness() {
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
    const updatedWitnesses = [...witnesses]
    updatedWitnesses[index] = { ...updatedWitnesses[index], [field]: value }

    // If district changed, reset taluk
    if (field === "districtId") {
      updatedWitnesses[index].talukId = ""
    }

    setWitnesses(updatedWitnesses)
    updateData(updatedWitnesses)
  }

  const addWitness = () => {
    const updatedWitnesses = [...witnesses, createEmptyWitness()]
    setWitnesses(updatedWitnesses)
    updateData(updatedWitnesses)
  }

  const removeWitness = (index: number) => {
    if (witnesses.length === 1) return // Keep at least one witness

    const updatedWitnesses = witnesses.filter((_, i) => i !== index)
    setWitnesses(updatedWitnesses)
    updateData(updatedWitnesses)
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-purple-800">சாட்சி விவரங்கள்</h3>

      {witnesses.map((witness, index) => (
        <Card key={witness.id} className="border-purple-200">
          <CardHeader className="bg-purple-50 rounded-t-lg flex flex-row items-center justify-between">
            <CardTitle className="text-purple-700">சாட்சி #{index + 1}</CardTitle>
            {witnesses.length > 1 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeWitness(index)}
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
                <Select
                  value={witness.contactType}
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <Label htmlFor={`name-${index}`}>பெயர் (Name)</Label>
                <Input
                  id={`name-${index}`}
                  placeholder="பெயரை உள்ளிடவும்"
                  value={witness.name}
                  onChange={(e) => handleChange(index, "name", e.target.value)}
                  className="mt-1 border-purple-200 focus-visible:ring-purple-400"
                />
              </div>

              <div>
                <Label htmlFor={`age-${index}`}>வயது (Age)</Label>
                <Input
                  id={`age-${index}`}
                  placeholder="வயதை உள்ளிடவும்"
                  value={witness.age}
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
                  value={witness.relationType}
                  onChange={(e) => handleChange(index, "relationType", e.target.value)}
                  className="mt-1 border-purple-200 focus-visible:ring-purple-400"
                />
              </div>

              <div>
                <Label htmlFor={`relation-name-${index}`}>உறவினர் பெயர் (Relation Name)</Label>
                <Input
                  id={`relation-name-${index}`}
                  placeholder="உறவினர் பெயரை உள்ளிடவும்"
                  value={witness.relationName}
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
                  value={witness.doorNo}
                  onChange={(e) => handleChange(index, "doorNo", e.target.value)}
                  className="mt-1 border-purple-200 focus-visible:ring-purple-400"
                />
              </div>

              <div>
                <Label htmlFor={`pincode-${index}`}>அஞ்சல் குறியீடு (Pincode)</Label>
                <Input
                  id={`pincode-${index}`}
                  placeholder="அஞ்சல் குறியீட்டை உள்ளிடவும்"
                  value={witness.pincode}
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
                  value={witness.address1}
                  onChange={(e) => handleChange(index, "address1", e.target.value)}
                  className="mt-1 border-purple-200 focus-visible:ring-purple-400"
                />
              </div>

              <div>
                <Label htmlFor={`address2-${index}`}>முகவரி (Address) 2</Label>
                <Input
                  id={`address2-${index}`}
                  placeholder="முகவரியை உள்ளிடவும்"
                  value={witness.address2}
                  onChange={(e) => handleChange(index, "address2", e.target.value)}
                  className="mt-1 border-purple-200 focus-visible:ring-purple-400"
                />
              </div>

              <div>
                <Label htmlFor={`address3-${index}`}>முகவரி (Address) 3</Label>
                <Input
                  id={`address3-${index}`}
                  placeholder="முகவரியை உள்ளிடவும்"
                  value={witness.address3}
                  onChange={(e) => handleChange(index, "address3", e.target.value)}
                  className="mt-1 border-purple-200 focus-visible:ring-purple-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <Label htmlFor={`district-${index}`}>மாவட்டம் (District)</Label>
                <Select value={witness.districtId} onValueChange={(value) => handleChange(index, "districtId", value)}>
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
                  value={witness.talukId}
                  onValueChange={(value) => handleChange(index, "talukId", value)}
                  disabled={!witness.districtId}
                >
                  <SelectTrigger className="mt-1 border-purple-200 focus-visible:ring-purple-400">
                    <SelectValue placeholder="வட்டத்தை தேர்ந்தெடுக்கவும்" />
                  </SelectTrigger>
                  <SelectContent>
                    {witness.districtId &&
                      filteredTaluks[Number(witness.districtId)]?.map((taluk) => (
                        <SelectItem key={taluk.id} value={taluk.id.toString()}>
                          {taluk.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-4">
              <Label htmlFor={`aadhar-${index}`}>ஆதார் எண் (Aadhar No)</Label>
              <Input
                id={`aadhar-${index}`}
                placeholder="ஆதார் எண்ணை உள்ளிடவும்"
                value={witness.aadharNo}
                onChange={(e) => handleChange(index, "aadharNo", e.target.value)}
                className="mt-1 border-purple-200 focus-visible:ring-purple-400"
              />
            </div>
          </CardContent>
        </Card>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={addWitness}
        className="w-full border-purple-300 text-purple-700 hover:bg-purple-100"
      >
        <Plus className="h-4 w-4 mr-2" />
        மற்றொரு சாட்சியை சேர்க்க
      </Button>
    </div>
  )
}
