"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DataTable } from "@/components/ui/data-table"
import { useState, useEffect } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase"
import { Pencil, Trash2, Search } from "lucide-react"
import { toast } from "sonner"
import type { ColumnDef } from "@tanstack/react-table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"

interface Property {
  id: number
  property_name: string
  survey_number: string
  registration_district_name?: string
  sub_registrar_office_name?: string
  district_name?: string
  taluk_name?: string
  village_name?: string
  guide_value_sqm: number
  guide_value_sqft: number
}

interface RegistrationDistrict {
  id: number
  name: string
}

interface SubRegistrarOffice {
  id: number
  name: string
  registration_district_id: number
}

interface District {
  id: number
  name: string
}

interface Taluk {
  id: number
  name: string
  district_id: number
}

interface Village {
  id: number
  name: string
  taluk_id: number
}

export function PropertySearch() {
  const [searchTerm, setSearchTerm] = useState("")
  const [searchBy, setSearchBy] = useState<"property_name" | "survey_number">("property_name")
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // Filter states
  const [registrationDistrictId, setRegistrationDistrictId] = useState("")
  const [subRegistrarOfficeId, setSubRegistrarOfficeId] = useState("")
  const [districtId, setDistrictId] = useState("")
  const [talukId, setTalukId] = useState("")
  const [villageId, setVillageId] = useState("")

  // Reference data
  const [registrationDistricts, setRegistrationDistricts] = useState<RegistrationDistrict[]>([])
  const [subRegistrarOffices, setSubRegistrarOffices] = useState<SubRegistrarOffice[]>([])
  const [districts, setDistricts] = useState<District[]>([])
  const [taluks, setTaluks] = useState<Taluk[]>([])
  const [villages, setVillages] = useState<Village[]>([])

  const [filteredSubRegistrarOffices, setFilteredSubRegistrarOffices] = useState<SubRegistrarOffice[]>([])
  const [filteredTaluks, setFilteredTaluks] = useState<Taluk[]>([])
  const [filteredVillages, setFilteredVillages] = useState<Village[]>([])

  const supabase = getSupabaseBrowserClient()

  const fetchReferenceData = async () => {
    // Fetch registration districts
    const { data: registrationDistrictsData, error: registrationDistrictsError } = await supabase
      .from("registration_districts")
      .select("*")
      .order("name")

    if (registrationDistrictsError) {
      toast.error("பதிவு மாவட்டங்களை பெறுவதில் பிழை: " + registrationDistrictsError.message)
    } else {
      setRegistrationDistricts(registrationDistrictsData || [])
    }

    // Fetch sub-registrar offices
    const { data: subRegistrarOfficesData, error: subRegistrarOfficesError } = await supabase
      .from("sub_registrar_offices")
      .select("*")
      .order("name")

    if (subRegistrarOfficesError) {
      toast.error("சார்பதிவாளர் அலுவலகங்களை பெறுவதில் பிழை: " + subRegistrarOfficesError.message)
    } else {
      setSubRegistrarOffices(subRegistrarOfficesData || [])
    }

    // Fetch districts
    const { data: districtsData, error: districtsError } = await supabase.from("districts").select("*").order("name")

    if (districtsError) {
      toast.error("மாவட்டங்களை பெறுவதில் பிழை: " + districtsError.message)
    } else {
      setDistricts(districtsData || [])
    }

    // Fetch taluks
    const { data: taluksData, error: taluksError } = await supabase.from("taluks").select("*").order("name")

    if (taluksError) {
      toast.error("வட்டங்களை பெறுவதில் பிழை: " + taluksError.message)
    } else {
      setTaluks(taluksData || [])
    }

    // Fetch villages
    const { data: villagesData, error: villagesError } = await supabase.from("villages").select("*").order("name")

    if (villagesError) {
      toast.error("கிராமங்களை பெறுவதில் பிழை: " + villagesError.message)
    } else {
      setVillages(villagesData || [])
    }
  }

  const fetchProperties = async () => {
    setLoading(true)

    try {
      let query = supabase.from("properties").select(`
          *,
          registration_districts:registration_district_id (name),
          sub_registrar_offices:sub_registrar_office_id (name),
          districts:district_id (name),
          taluks:taluk_id (name),
          villages:village_id (name)
        `)

      if (searchTerm) {
        query = query.ilike(searchBy, `%${searchTerm}%`)
      }

      if (registrationDistrictId && registrationDistrictId !== "all") {
        query = query.eq("registration_district_id", Number.parseInt(registrationDistrictId))
      }

      if (subRegistrarOfficeId && subRegistrarOfficeId !== "all") {
        query = query.eq("sub_registrar_office_id", Number.parseInt(subRegistrarOfficeId))
      }

      if (districtId && districtId !== "all") {
        query = query.eq("district_id", Number.parseInt(districtId))
      }

      if (talukId && talukId !== "all") {
        query = query.eq("taluk_id", Number.parseInt(talukId))
      }

      if (villageId && villageId !== "all") {
        query = query.eq("village_id", Number.parseInt(villageId))
      }

      const { data, error } = await query.order("property_name")

      if (error) throw error

      const formattedData =
        data?.map((property) => ({
          ...property,
          registration_district_name: property.registration_districts?.name,
          sub_registrar_office_name: property.sub_registrar_offices?.name,
          district_name: property.districts?.name,
          taluk_name: property.taluks?.name,
          village_name: property.villages?.name,
        })) || []

      setProperties(formattedData)
    } catch (error: any) {
      toast.error("சொத்து விவரங்களை பெறுவதில் பிழை: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReferenceData()
    fetchProperties()
  }, [])

  useEffect(() => {
    if (registrationDistrictId && registrationDistrictId !== "all") {
      const filtered = subRegistrarOffices.filter(
        (office) => office.registration_district_id === Number.parseInt(registrationDistrictId),
      )
      setFilteredSubRegistrarOffices(filtered)
    } else {
      setFilteredSubRegistrarOffices([])
    }
    setSubRegistrarOfficeId("")
  }, [registrationDistrictId, subRegistrarOffices])

  useEffect(() => {
    if (districtId && districtId !== "all") {
      const filtered = taluks.filter((taluk) => taluk.district_id === Number.parseInt(districtId))
      setFilteredTaluks(filtered)
    } else {
      setFilteredTaluks([])
    }
    setTalukId("")
    setVillageId("")
  }, [districtId, taluks])

  useEffect(() => {
    if (talukId && talukId !== "all") {
      const filtered = villages.filter((village) => village.taluk_id === Number.parseInt(talukId))
      setFilteredVillages(filtered)
    } else {
      setFilteredVillages([])
    }
    setVillageId("")
  }, [talukId, villages])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchProperties()
  }

  const handleEdit = (id: number) => {
    // Navigate to property form with the property ID
    router.push(`/system-settings/property-details?edit=${id}`)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("இந்த சொத்து விவரங்களை நீக்க விரும்புகிறீர்களா?")) {
      return
    }

    try {
      const { error } = await supabase.from("properties").delete().eq("id", id)

      if (error) throw error

      toast.success("சொத்து விவரங்கள் வெற்றிகரமாக நீக்கப்பட்டன")
      fetchProperties()
    } catch (error: any) {
      toast.error("நீக்குவதில் பிழை: " + error.message)
    }
  }

  const columns: ColumnDef<Property>[] = [
    {
      accessorKey: "property_name",
      header: "மனையின் பெயர்",
    },
    {
      accessorKey: "survey_number",
      header: "சர்வே எண்",
    },
    {
      accessorKey: "registration_district_name",
      header: "பதிவு மாவட்டம்",
    },
    {
      accessorKey: "sub_registrar_office_name",
      header: "சார்பதிவாளர் அலுவலகம்",
    },
    {
      accessorKey: "district_name",
      header: "மாவட்டம்",
    },
    {
      accessorKey: "taluk_name",
      header: "வட்டம்",
    },
    {
      accessorKey: "village_name",
      header: "கிராமம்",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const property = row.original

        return (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => handleEdit(property.id)} className="text-purple-600">
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleDelete(property.id)} className="text-red-600">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )
      },
    },
  ]

  return (
    <div className="grid gap-6">
      <Card className="border-purple-200">
        <CardHeader className="bg-purple-50 rounded-t-lg">
          <CardTitle className="text-purple-700">சொத்து விவரங்கள் தேடுதல்</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="search-term">தேடுதல்</Label>
                <Input
                  id="search-term"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="தேடுதல் சொல்லை உள்ளிடவும்"
                  className="border-purple-200 focus:border-purple-400"
                />
              </div>

              <div className="w-full md:w-48">
                <Label htmlFor="search-by">தேடுதல் வகை</Label>
                <select
                  id="search-by"
                  value={searchBy}
                  onChange={(e) => setSearchBy(e.target.value as any)}
                  className="flex h-10 w-full rounded-md border border-purple-200 bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="property_name">மனையின் பெயர்</option>
                  <option value="survey_number">சர்வே எண்</option>
                </select>
              </div>

              <div className="flex items-end">
                <Button type="submit" disabled={loading} className="bg-purple-600 hover:bg-purple-700">
                  <Search className="h-4 w-4 mr-2" />
                  தேடு
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <Label htmlFor="registration-district-filter">பதிவு மாவட்டம்</Label>
                <Select value={registrationDistrictId} onValueChange={setRegistrationDistrictId}>
                  <SelectTrigger className="border-purple-200">
                    <SelectValue placeholder="அனைத்தும்" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">அனைத்தும்</SelectItem>
                    {registrationDistricts.map((district) => (
                      <SelectItem key={district.id} value={district.id.toString()}>
                        {district.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="sub-registrar-office-filter">சார்பதிவாளர் அலுவலகம்</Label>
                <Select
                  value={subRegistrarOfficeId}
                  onValueChange={setSubRegistrarOfficeId}
                  disabled={!registrationDistrictId || registrationDistrictId === "all"}
                >
                  <SelectTrigger className="border-purple-200">
                    <SelectValue placeholder="அனைத்தும்" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">அனைத்தும்</SelectItem>
                    {filteredSubRegistrarOffices.map((office) => (
                      <SelectItem key={office.id} value={office.id.toString()}>
                        {office.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="district-filter">மாவட்டம்</Label>
                <Select value={districtId} onValueChange={setDistrictId}>
                  <SelectTrigger className="border-purple-200">
                    <SelectValue placeholder="அனைத்தும்" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">அனைத்தும்</SelectItem>
                    {districts.map((district) => (
                      <SelectItem key={district.id} value={district.id.toString()}>
                        {district.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="taluk-filter">வட்டம்</Label>
                <Select value={talukId} onValueChange={setTalukId} disabled={!districtId || districtId === "all"}>
                  <SelectTrigger className="border-purple-200">
                    <SelectValue placeholder="அனைத்தும்" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">அனைத்தும்</SelectItem>
                    {filteredTaluks.map((taluk) => (
                      <SelectItem key={taluk.id} value={taluk.id.toString()}>
                        {taluk.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="village-filter">கிராமம்</Label>
                <Select value={villageId} onValueChange={setVillageId} disabled={!talukId || talukId === "all"}>
                  <SelectTrigger className="border-purple-200">
                    <SelectValue placeholder="அனைத்தும்" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">அனைத்தும்</SelectItem>
                    {filteredVillages.map((village) => (
                      <SelectItem key={village.id} value={village.id.toString()}>
                        {village.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="border-purple-200">
        <CardHeader className="bg-purple-50 rounded-t-lg">
          <CardTitle className="text-purple-700">சொத்து விவரங்கள்</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={properties} />
        </CardContent>
      </Card>
    </div>
  )
}
