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

interface TahsildarOffice {
  id: number
  name: string
  created_at: string
}

export function TahsildarOfficeForm() {
  const [name, setName] = useState("")
  const [offices, setOffices] = useState<TahsildarOffice[]>([])
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)

  const supabase = getSupabaseBrowserClient()

  const fetchOffices = async () => {
    const { data, error } = await supabase.from("tahsildar_offices").select("*").order("name")

    if (error) {
      toast.error("வட்டாட்சியர் அலுவலகங்களை பெறுவதில் பிழை: " + error.message)
      return
    }

    setOffices(data || [])
  }

  useEffect(() => {
    fetchOffices()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      toast.error("வட்டாட்சியர் அலுவலகத்தின் பெயரை உள்ளிடவும்")
      return
    }

    setLoading(true)

    try {
      if (editingId) {
        // Update existing office
        const { error } = await supabase.from("tahsildar_offices").update({ name }).eq("id", editingId)

        if (error) throw error
        toast.success("வட்டாட்சியர் அலுவலகம் வெற்றிகரமாக புதுப்பிக்கப்பட்டது")
      } else {
        // Add new office
        const { error } = await supabase.from("tahsildar_offices").insert([{ name }])

        if (error) throw error
        toast.success("வட்டாட்சியர் அலுவலகம் வெற்றிகரமாக சேர்க்கப்பட்டது")
      }

      setName("")
      setEditingId(null)
      fetchOffices()
    } catch (error: any) {
      toast.error("பிழை: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (office: TahsildarOffice) => {
    setName(office.name)
    setEditingId(office.id)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("இந்த வட்டாட்சியர் அலுவலகத்தை நீக்க விரும்புகிறீர்களா?")) {
      return
    }

    try {
      const { error } = await supabase.from("tahsildar_offices").delete().eq("id", id)

      if (error) throw error

      toast.success("வட்டாட்சியர் அலுவலகம் வெற்றிகரமாக நீக்கப்பட்டது")
      fetchOffices()
    } catch (error: any) {
      toast.error("நீக்குவதில் பிழை: " + error.message)
    }
  }

  const columns: ColumnDef<TahsildarOffice>[] = [
    {
      accessorKey: "name",
      header: "வட்டாட்சியர் அலுவலகம்",
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
          <CardTitle>வட்டாட்சியர் அலுவலகம் சேர்க்க</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="office-name">வட்டாட்சியர் அலுவலகத்தின் பெயர்</Label>
              <Input
                id="office-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="வட்டாட்சியர் அலுவலகத்தின் பெயரை உள்ளிடவும்"
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
          <CardTitle>வட்டாட்சியர் அலுவலகங்கள்</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={offices}
            searchKey="name"
            searchPlaceholder="வட்டாட்சியர் அலுவலகத்தை தேடுக..."
          />
        </CardContent>
      </Card>
    </div>
  )
}
