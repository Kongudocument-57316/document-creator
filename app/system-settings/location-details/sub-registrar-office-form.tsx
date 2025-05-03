"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DataTable } from "@/components/ui/data-table"
import { useState, useEffect } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase"
import { Pencil, Trash2 } from "lucide-react"
import { toast } from "sonner"
import type { ColumnDef } from "@tanstack/react-table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface RegistrationDistrict {
  id: number
  name: string
}

interface SubRegistrarOffice {
  id: number
  name: string
  registration_district_id: number
  created_at: string
  registration_district_name?: string
}

export function SubRegistrarOfficeForm() {
  const [name, setName] = useState("")
  const [districtId, setDistrictId] = useState("")
  const [offices, setOffices] = useState<SubRegistrarOffice[]>([])
  const [districts, setDistricts] = useState<RegistrationDistrict[]>([])
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)

  const supabase = getSupabaseBrowserClient()

  const fetchDistricts = async () => {
    const { data, error } = await supabase.from("registration_districts").select("*").order("name")

    if (error) {
      toast.error("பதிவு மாவட்டங்களை பெறுவதில் பிழை: " + error.message)
      return
    }

    setDistricts(data || [])
  }

  const fetchOffices = async () => {
    const { data, error } = await supabase
      .from("sub_registrar_offices")
      .select(`
        *,
        registration_districts:registration_district_id (name)
      `)
      .order("name")

    if (error) {
      toast.error("சார்பதிவாளர் அலுவலகங்களை பெறுவதில் பிழை: " + error.message)
      return
    }

    const formattedData =
      data?.map((item) => ({
        ...item,
        registration_district_name: item.registration_districts?.name,
      })) || []

    setOffices(formattedData)
  }

  useEffect(() => {
    fetchDistricts()
    fetchOffices()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      toast.error("சார்பதிவாளர் அலுவலகத்தின் பெயரை உள்ளிடவும்")
      return
    }

    if (!districtId) {
      toast.error("பதிவு மாவட்டத்தை தேர்ந்தெடுக்கவும்")
      return
    }

    setLoading(true)

    try {
      if (editingId) {
        // Update existing office
        const { error } = await supabase
          .from("sub_registrar_offices")
          .update({
            name,
            registration_district_id: Number.parseInt(districtId),
          })
          .eq("id", editingId)

        if (error) throw error
        toast.success("சார்பதிவாளர் அலுவலகம் வெற்றிகரமாக புதுப்பிக்கப்பட்டது")
      } else {
        // Add new office
        const { error } = await supabase.from("sub_registrar_offices").insert([
          {
            name,
            registration_district_id: Number.parseInt(districtId),
          },
        ])

        if (error) throw error
        toast.success("சார்பதிவாளர் அலுவலகம் வெற்றிகரமாக சேர்க்கப்பட்டது")
      }

      setName("")
      setDistrictId("")
      setEditingId(null)
      fetchOffices()
    } catch (error: any) {
      toast.error("பிழை: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (office: SubRegistrarOffice) => {
    setName(office.name)
    setDistrictId(office.registration_district_id.toString())
    setEditingId(office.id)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("இந்த சார்பதிவாளர் அலுவலகத்தை நீக்க விரும்புகிறீர்களா?")) {
      return
    }

    try {
      const { error } = await supabase.from("sub_registrar_offices").delete().eq("id", id)

      if (error) throw error

      toast.success("சார்பதிவாளர் அலுவலகம் வெற்றிகரமாக நீக்கப்பட்டது")
      fetchOffices()
    } catch (error: any) {
      toast.error("நீக்குவதில் பிழை: " + error.message)
    }
  }

  const columns: ColumnDef<SubRegistrarOffice>[] = [
    {
      accessorKey: "name",
      header: "சார்பதிவாளர் அலுவலகம்",
    },
    {
      accessorKey: "registration_district_name",
      header: "பதிவு மாவட்டம்",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const office = row.original

        return (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => handleEdit(office)}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleDelete(office.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )
      },
    },
  ]

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>சார்பதிவாளர் அலுவலகம் சேர்க்க</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="district-select">பதிவு மாவட்டம்</Label>
              <Select value={districtId} onValueChange={setDistrictId}>
                <SelectTrigger>
                  <SelectValue placeholder="பதிவு மாவட்டத்தை தேர்ந்தெடுக்கவும்" />
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

            <div className="grid gap-2">
              <Label htmlFor="office-name">சார்பதிவாளர் அலுவலகத்தின் பெயர்</Label>
              <Input
                id="office-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="சார்பதிவாளர் அலுவலகத்தின் பெயரை உள்ளிடவும்"
              />
            </div>

            <Button type="submit" disabled={loading}>
              {editingId ? "புதுப்பி" : "சேர்"}
            </Button>
            {editingId && (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setName("")
                  setDistrictId("")
                  setEditingId(null)
                }}
                className="ml-2"
              >
                ரத்து செய்
              </Button>
            )}
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>சார்பதிவாளர் அலுவலகங்கள்</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={offices}
            searchKey="name"
            searchPlaceholder="சார்பதிவாளர் அலுவலகத்தை தேடுக..."
          />
        </CardContent>
      </Card>
    </div>
  )
}
