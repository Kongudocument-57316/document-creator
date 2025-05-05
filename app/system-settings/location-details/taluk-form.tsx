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

interface State {
  id: number
  name: string
}

interface District {
  id: number
  name: string
  state_id: number
}

interface Taluk {
  id: number
  name: string
  district_id: number
  created_at: string
  district_name?: string
}

export function TalukForm() {
  const [name, setName] = useState("")
  const [stateId, setStateId] = useState("")
  const [districtId, setDistrictId] = useState("")
  const [taluks, setTaluks] = useState<Taluk[]>([])
  const [states, setStates] = useState<State[]>([])
  const [districts, setDistricts] = useState<District[]>([])
  const [filteredDistricts, setFilteredDistricts] = useState<District[]>([])
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)

  const supabase = getSupabaseBrowserClient()

  const fetchStates = async () => {
    const { data, error } = await supabase.from("states").select("*").order("name")

    if (error) {
      toast.error("மாநிலங்களை பெறுவதில் பிழை: " + error.message)
      return
    }

    setStates(data || [])
  }

  const fetchDistricts = async () => {
    const { data, error } = await supabase.from("districts").select("*").order("name")

    if (error) {
      toast.error("மாவட்டங்களை பெறுவதில் பிழை: " + error.message)
      return
    }

    setDistricts(data || [])
  }

  const fetchTaluks = async () => {
    const { data, error } = await supabase
      .from("taluks")
      .select(`
        *,
        districts:district_id (name)
      `)
      .order("name")

    if (error) {
      toast.error("வட்டங்களை பெறுவதில் பிழை: " + error.message)
      return
    }

    const formattedData =
      data?.map((item) => ({
        ...item,
        district_name: item.districts?.name,
      })) || []

    setTaluks(formattedData)
  }

  useEffect(() => {
    fetchStates()
    fetchDistricts()
    fetchTaluks()
  }, [])

  useEffect(() => {
    if (stateId) {
      const filtered = districts.filter((district) => district.state_id === Number.parseInt(stateId))
      setFilteredDistricts(filtered)
    } else {
      setFilteredDistricts([])
    }
    setDistrictId("")
  }, [stateId, districts])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      toast.error("வட்டத்தின் பெயரை உள்ளிடவும்")
      return
    }

    if (!districtId) {
      toast.error("மாவட்டத்தை தேர்ந்தெடுக்கவும்")
      return
    }

    setLoading(true)

    try {
      if (editingId) {
        // Update existing taluk
        const { error } = await supabase
          .from("taluks")
          .update({
            name,
            district_id: Number.parseInt(districtId),
          })
          .eq("id", editingId)

        if (error) throw error
        toast.success("வட்டம் வெற்றிகரமாக புதுப்பிக்கப்பட்டது")
      } else {
        // Add new taluk
        const { error } = await supabase.from("taluks").insert([
          {
            name,
            district_id: Number.parseInt(districtId),
          },
        ])

        if (error) throw error
        toast.success("வட்டம் வெற்றிகரமாக சேர்க்கப்பட்டது")
      }

      setName("")
      setDistrictId("")
      setEditingId(null)
      fetchTaluks()
    } catch (error: any) {
      toast.error("பிழை: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = async (taluk: Taluk) => {
    setName(taluk.name)

    // Get district to find state
    const { data: districtData } = await supabase.from("districts").select("*").eq("id", taluk.district_id).single()

    if (districtData) {
      setStateId(districtData.state_id.toString())
      // This will trigger the useEffect to filter districts
      // Then we can set the district ID
      setTimeout(() => {
        setDistrictId(taluk.district_id.toString())
      }, 100)
    }

    setEditingId(taluk.id)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("இந்த வட்டத்தை நீக்க விரும்புகிறீர்களா?")) {
      return
    }

    try {
      const { error } = await supabase.from("taluks").delete().eq("id", id)

      if (error) throw error

      toast.success("வட்டம் வெற்றிகரமாக நீக்கப்பட்டது")
      fetchTaluks()
    } catch (error: any) {
      toast.error("நீக்குவதில் பிழை: " + error.message)
    }
  }

  const columns: ColumnDef<Taluk>[] = [
    {
      accessorKey: "name",
      header: "வட்டம்",
    },
    {
      accessorKey: "district_name",
      header: "மாவட்டம்",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const taluk = row.original

        return (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => handleEdit(taluk)}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleDelete(taluk.id)}>
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
          <CardTitle>வட்டம் சேர்க்க</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="state-select">மாநிலம்</Label>
              <Select value={stateId} onValueChange={setStateId}>
                <SelectTrigger>
                  <SelectValue placeholder="மாநிலத்தை தேர்ந்தெடுக்கவும்" />
                </SelectTrigger>
                <SelectContent>
                  {states.map((state) => (
                    <SelectItem key={state.id} value={state.id.toString()}>
                      {state.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="district-select">மாவட்டம்</Label>
              <Select value={districtId} onValueChange={setDistrictId} disabled={filteredDistricts.length === 0}>
                <SelectTrigger>
                  <SelectValue placeholder="மாவட்டத்தை தேர்ந்தெடுக்கவும்" />
                </SelectTrigger>
                <SelectContent>
                  {filteredDistricts.map((district) => (
                    <SelectItem key={district.id} value={district.id.toString()}>
                      {district.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="taluk-name">வட்டத்தின் பெயர்</Label>
              <Input
                id="taluk-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="வட்டத்தின் பெயரை உள்ளிடவும்"
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
                  setStateId("")
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
          <CardTitle>வட்டங்கள்</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={taluks} searchKey="name" searchPlaceholder="வட்டத்தை தேடுக..." />
        </CardContent>
      </Card>
    </div>
  )
}
