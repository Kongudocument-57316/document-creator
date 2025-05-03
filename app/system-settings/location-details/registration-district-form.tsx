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

interface RegistrationDistrict {
  id: number
  name: string
  created_at: string
}

export function RegistrationDistrictForm() {
  const [name, setName] = useState("")
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

  useEffect(() => {
    fetchDistricts()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      toast.error("பதிவு மாவட்டத்தின் பெயரை உள்ளிடவும்")
      return
    }

    setLoading(true)

    try {
      if (editingId) {
        // Update existing district
        const { error } = await supabase.from("registration_districts").update({ name }).eq("id", editingId)

        if (error) throw error
        toast.success("பதிவு மாவட்டம் வெற்றிகரமாக புதுப்பிக்கப்பட்டது")
      } else {
        // Add new district
        const { error } = await supabase.from("registration_districts").insert([{ name }])

        if (error) throw error
        toast.success("பதிவு மாவட்டம் வெற்றிகரமாக சேர்க்கப்பட்டது")
      }

      setName("")
      setEditingId(null)
      fetchDistricts()
    } catch (error: any) {
      toast.error("பிழை: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (district: RegistrationDistrict) => {
    setName(district.name)
    setEditingId(district.id)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("இந்த பதிவு மாவட்டத்தை நீக்க விரும்புகிறீர்களா?")) {
      return
    }

    try {
      const { error } = await supabase.from("registration_districts").delete().eq("id", id)

      if (error) throw error

      toast.success("பதிவு மாவட்டம் வெற்றிகரமாக நீக்கப்பட்டது")
      fetchDistricts()
    } catch (error: any) {
      toast.error("நீக்குவதில் பிழை: " + error.message)
    }
  }

  const columns: ColumnDef<RegistrationDistrict>[] = [
    {
      accessorKey: "name",
      header: "பதிவு மாவட்டம்",
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
          <CardTitle>பதிவு மாவட்டம் சேர்க்க</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="district-name">பதிவு மாவட்டத்தின் பெயர்</Label>
              <Input
                id="district-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="பதிவு மாவட்டத்தின் பெயரை உள்ளிடவும்"
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
          <CardTitle>பதிவு மாவட்டங்கள்</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={districts} searchKey="name" searchPlaceholder="பதிவு மாவட்டத்தை தேடுக..." />
        </CardContent>
      </Card>
    </div>
  )
}
