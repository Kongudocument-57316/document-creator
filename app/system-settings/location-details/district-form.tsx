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
  created_at: string
  state_name?: string
}

export function DistrictForm() {
  const [name, setName] = useState("")
  const [stateId, setStateId] = useState("")
  const [districts, setDistricts] = useState<District[]>([])
  const [states, setStates] = useState<State[]>([])
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)

  const supabase = getSupabaseBrowserClient()

  const fetchStates = async () => {
    try {
      const { data, error } = await supabase.from("states").select("*").order("name")

      if (error) {
        toast.error("மாநிலங்களை பெறுவதில் பிழை: " + error.message)
        return
      }

      setStates(data || [])
    } catch (error: any) {
      toast.error("மாநிலங்களை பெறுவதில் பிழை: " + error.message)
    }
  }

  const fetchDistricts = async () => {
    try {
      const { data, error } = await supabase
        .from("districts")
        .select(`
          *,
          states:state_id (name)
        `)
        .order("name")

      if (error) {
        toast.error("மாவட்டங்களை பெறுவதில் பிழை: " + error.message)
        return
      }

      const formattedData =
        data?.map((item) => ({
          ...item,
          state_name: item.states?.name,
        })) || []

      setDistricts(formattedData)
    } catch (error: any) {
      toast.error("மாவட்டங்களை பெறுவதில் பிழை: " + error.message)
    }
  }

  useEffect(() => {
    fetchStates()
    fetchDistricts()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      toast.error("மாவட்டத்தின் பெயரை உள்ளிடவும்")
      return
    }

    if (!stateId) {
      toast.error("மாநிலத்தை தேர்ந்தெடுக்கவும்")
      return
    }

    setLoading(true)

    try {
      const stateIdNum = Number.parseInt(stateId)
      const selectedState = states.find((state) => state.id === stateIdNum)
      const stateName = selectedState ? selectedState.name : ""

      if (editingId) {
        // Update existing district
        const { error } = await supabase
          .from("districts")
          .update({
            name,
            state_id: stateIdNum,
          })
          .eq("id", editingId)

        if (error) throw error

        // Update the district in the districts array
        setDistricts((prevDistricts) =>
          prevDistricts.map((district) =>
            district.id === editingId ? { ...district, name, state_id: stateIdNum, state_name: stateName } : district,
          ),
        )

        toast.success("மாவட்டம் வெற்றிகரமாக புதுப்பிக்கப்பட்டது")
      } else {
        // Add new district
        const { error, data } = await supabase
          .from("districts")
          .insert([
            {
              name,
              state_id: stateIdNum,
            },
          ])
          .select()

        if (error) throw error

        // Add the new district to the districts array
        if (data && data.length > 0) {
          const newDistrict = {
            ...data[0],
            state_name: stateName,
          }
          setDistricts((prevDistricts) => [...prevDistricts, newDistrict])
        }

        toast.success("மாவட்டம் வெற்றிகரமாக சேர்க்கப்பட்டது")
      }

      // Reset form
      setName("")
      setStateId("")
      setEditingId(null)

      // Fetch updated districts
      fetchDistricts()
    } catch (error: any) {
      toast.error("பிழை: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (district: District) => {
    setName(district.name)
    setStateId(district.state_id.toString())
    setEditingId(district.id)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("இந்த மாவட்டத்தை நீக்க விரும்புகிறீர்களா?")) {
      return
    }

    try {
      const { error } = await supabase.from("districts").delete().eq("id", id)

      if (error) throw error

      // Remove the deleted district from the districts array
      setDistricts((prevDistricts) => prevDistricts.filter((district) => district.id !== id))

      toast.success("மாவட்டம் வெற்றிகரமாக நீக்கப்பட்டது")
    } catch (error: any) {
      toast.error("நீக்குவதில் பிழை: " + error.message)
    }
  }

  const columns: ColumnDef<District>[] = [
    {
      accessorKey: "name",
      header: "மாவட்டம்",
    },
    {
      accessorKey: "state_name",
      header: "மாநிலம்",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const district = row.original

        return (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => handleEdit(district)}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleDelete(district.id)}>
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
          <CardTitle>மாவட்டம் சேர்க்க</CardTitle>
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
              <Label htmlFor="district-name">மாவட்டத்தின் பெயர்</Label>
              <Input
                id="district-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="மாவட்டத்தின் பெயரை உள்ளிடவும்"
              />
            </div>

            <Button type="submit" disabled={loading}>
              {editingId ? "புதுப்பி" : "சேர்க்க"}
            </Button>
            {editingId && (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setName("")
                  setStateId("")
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
          <CardTitle>மாவட்டங்கள்</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={districts} searchKey="name" searchPlaceholder="மாவட்டத்தை தேடுக..." />
        </CardContent>
      </Card>
    </div>
  )
}
