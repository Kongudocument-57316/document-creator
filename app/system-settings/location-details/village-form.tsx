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
}

interface Village {
  id: number
  name: string
  taluk_id: number
  created_at: string
  taluk_name?: string
}

export function VillageForm() {
  const [name, setName] = useState("")
  const [stateId, setStateId] = useState("")
  const [districtId, setDistrictId] = useState("")
  const [talukId, setTalukId] = useState("")
  const [villages, setVillages] = useState<Village[]>([])
  const [states, setStates] = useState<State[]>([])
  const [districts, setDistricts] = useState<District[]>([])
  const [taluks, setTaluks] = useState<Taluk[]>([])
  const [filteredDistricts, setFilteredDistricts] = useState<District[]>([])
  const [filteredTaluks, setFilteredTaluks] = useState<Taluk[]>([])
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
    const { data, error } = await supabase.from("taluks").select("*").order("name")

    if (error) {
      toast.error("வட்டங்களை பெறுவதில் பிழை: " + error.message)
      return
    }

    setTaluks(data || [])
  }

  const fetchVillages = async () => {
    const { data, error } = await supabase
      .from("villages")
      .select(`
        *,
        taluks:taluk_id (name)
      `)
      .order("name")

    if (error) {
      toast.error("கிராமங்களை பெறுவதில் பிழை: " + error.message)
      return
    }

    const formattedData =
      data?.map((item) => ({
        ...item,
        taluk_name: item.taluks?.name,
      })) || []

    setVillages(formattedData)
  }

  useEffect(() => {
    fetchStates()
    fetchDistricts()
    fetchTaluks()
    fetchVillages()
  }, [])

  useEffect(() => {
    if (stateId) {
      const filtered = districts.filter((district) => district.state_id === Number.parseInt(stateId))
      setFilteredDistricts(filtered)
    } else {
      setFilteredDistricts([])
    }
    setDistrictId("")
    setTalukId("")
  }, [stateId, districts])

  useEffect(() => {
    if (districtId) {
      const filtered = taluks.filter((taluk) => taluk.district_id === Number.parseInt(districtId))
      setFilteredTaluks(filtered)
    } else {
      setFilteredTaluks([])
    }
    setTalukId("")
  }, [districtId, taluks])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      toast.error("கிராமத்தின் பெயரை உள்ளிடவும்")
      return
    }

    if (!talukId) {
      toast.error("வட்டத்தை தேர்ந்தெடுக்கவும்")
      return
    }

    setLoading(true)

    try {
      if (editingId) {
        // Update existing village
        const { error } = await supabase
          .from("villages")
          .update({
            name,
            taluk_id: Number.parseInt(talukId),
          })
          .eq("id", editingId)

        if (error) throw error
        toast.success("கிராமம் வெற்றிகரமாக புதுப்பிக்கப்பட்டது")
      } else {
        // Add new village
        const { error } = await supabase.from("villages").insert([
          {
            name,
            taluk_id: Number.parseInt(talukId),
          },
        ])

        if (error) throw error
        toast.success("கிராமம் வெற்றிகரமாக சேர்க்கப்பட்டது")
      }

      setName("")
      setTalukId("")
      setEditingId(null)
      fetchVillages()
    } catch (error: any) {
      toast.error("பிழை: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = async (village: Village) => {
    setName(village.name)

    // Get taluk to find district and state
    const { data: talukData } = await supabase.from("taluks").select("*").eq("id", village.taluk_id).single()

    if (talukData) {
      // Get district to find state
      const { data: districtData } = await supabase
        .from("districts")
        .select("*")
        .eq("id", talukData.district_id)
        .single()

      if (districtData) {
        setStateId(districtData.state_id.toString())

        // Wait for state to update filtered districts
        setTimeout(() => {
          setDistrictId(districtData.id.toString())

          // Wait for district to update filtered taluks
          setTimeout(() => {
            setTalukId(village.taluk_id.toString())
          }, 100)
        }, 100)
      }
    }

    setEditingId(village.id)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("இந்த கிராமத்தை நீக்க விரும்புகிறீர்களா?")) {
      return
    }

    try {
      const { error } = await supabase.from("villages").delete().eq("id", id)

      if (error) throw error

      toast.success("கிராமம் வெற்றிகரமாக நீக்கப்பட்டது")
      fetchVillages()
    } catch (error: any) {
      toast.error("நீக்குவதில் பிழை: " + error.message)
    }
  }

  const columns: ColumnDef<Village>[] = [
    {
      accessorKey: "name",
      header: "கிராமம்",
    },
    {
      accessorKey: "taluk_name",
      header: "வட்டம்",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const village = row.original

        return (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => handleEdit(village)}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleDelete(village.id)}>
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
          <CardTitle>கிராமம் சேர்க்க</CardTitle>
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
              <Label htmlFor="taluk-select">வட்டம்</Label>
              <Select value={talukId} onValueChange={setTalukId} disabled={filteredTaluks.length === 0}>
                <SelectTrigger>
                  <SelectValue placeholder="வட்டத்தை த���ர்ந்தெடுக்கவும்" />
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

            <div className="grid gap-2">
              <Label htmlFor="village-name">கிராமத்தின் பெயர்</Label>
              <Input
                id="village-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="கிராமத்தின் பெயரை உள்ளிடவும்"
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
                  setTalukId("")
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
          <CardTitle>கிராமங்கள்</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={villages} searchKey="name" searchPlaceholder="கிராமத்தை தேடுக..." />
        </CardContent>
      </Card>
    </div>
  )
}
