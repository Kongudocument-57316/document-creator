"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DataTable } from "@/components/ui/data-table"
import { useState, useEffect } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase"
import { Pencil, Trash2 } from "lucide-react"
import { toast } from "sonner"
import type { ColumnDef } from "@tanstack/react-table"

interface LandType {
  id: number
  name: string
  description: string | null
  created_at: string
}

export function LandTypeForm() {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [landTypes, setLandTypes] = useState<LandType[]>([])
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)

  const supabase = getSupabaseBrowserClient()

  const fetchLandTypes = async () => {
    try {
      const { data, error } = await supabase.from("land_types").select("*").order("name")

      if (error) {
        toast.error("நில வகைகளை பெறுவதில் பிழை: " + error.message)
        return
      }

      setLandTypes(data || [])
    } catch (error: any) {
      toast.error("நில வகைகளை பெறுவதில் பிழை: " + error.message)
    }
  }

  useEffect(() => {
    fetchLandTypes()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      toast.error("நில வகையின் பெயரை உள்ளிடவும்")
      return
    }

    setLoading(true)

    try {
      if (editingId) {
        // Update existing land type
        const { error, data } = await supabase
          .from("land_types")
          .update({ name, description: description || null })
          .eq("id", editingId)
          .select()

        if (error) throw error

        // Update the land type in the list
        if (data && data.length > 0) {
          setLandTypes((prevTypes) => prevTypes.map((type) => (type.id === editingId ? data[0] : type)))
        }

        toast.success("நில வகை வெற்றிகரமாக புதுப்பிக்கப்பட்டது")
      } else {
        // Add new land type
        const { error, data } = await supabase
          .from("land_types")
          .insert([{ name, description: description || null }])
          .select()

        if (error) throw error

        // Add the new land type to the list
        if (data && data.length > 0) {
          setLandTypes((prevTypes) => [...prevTypes, data[0]])
        }

        toast.success("நில வகை வெற்றிகரமாக சேர்க்கப்பட்டது")
      }

      // Reset form
      setName("")
      setDescription("")
      setEditingId(null)

      // Refresh land types
      fetchLandTypes()
    } catch (error: any) {
      toast.error("பிழை: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (landType: LandType) => {
    setName(landType.name)
    setDescription(landType.description || "")
    setEditingId(landType.id)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("இந்த நில வகையை நீக்க விரும்புகிறீர்களா?")) {
      return
    }

    try {
      const { error } = await supabase.from("land_types").delete().eq("id", id)

      if (error) throw error

      // Remove the deleted land type from the list
      setLandTypes((prevTypes) => prevTypes.filter((type) => type.id !== id))

      toast.success("நில வகை வெற்றிகரமாக நீக்கப்பட்டது")
    } catch (error: any) {
      toast.error("நீக்குவதில் பிழை: " + error.message)
    }
  }

  const columns: ColumnDef<LandType>[] = [
    {
      accessorKey: "name",
      header: "நில வகையின் பெயர்",
    },
    {
      accessorKey: "description",
      header: "விளக்கம்",
      cell: ({ row }) => row.original.description || "-",
    },
    {
      accessorKey: "created_at",
      header: "உருவாக்கப்பட்ட தேதி",
      cell: ({ row }) => {
        const date = new Date(row.original.created_at)
        return date.toLocaleDateString("ta-IN")
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const landType = row.original

        return (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => handleEdit(landType)}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleDelete(landType.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )
      },
    },
  ]

  return (
    <div className="grid gap-6">
      <Card className="border-rose-200">
        <CardHeader className="bg-rose-50 rounded-t-lg">
          <CardTitle className="text-rose-700">நில வகை சேர்க்க</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="land-type-name">நில வகையின் பெயர்</Label>
              <Input
                id="land-type-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="நில வகையின் பெயரை உள்ளிடவும் (உதாரணம்: மனை, விவசாய நிலம்)"
                className="border-rose-200 focus:border-rose-400"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="land-type-description">விளக்கம்</Label>
              <Textarea
                id="land-type-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="விளக்கத்தை உள்ளிடவும்"
                className="border-rose-200 focus:border-rose-400"
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={loading} className="bg-rose-600 hover:bg-rose-700">
                {loading ? "சேமிக்கிறது..." : editingId ? "புதுப்பி" : "சேர்க்க"}
              </Button>

              {editingId && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setName("")
                    setDescription("")
                    setEditingId(null)
                  }}
                  className="border-rose-200 text-rose-700"
                >
                  ரத்து செய்
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="border-rose-200">
        <CardHeader className="bg-rose-50 rounded-t-lg">
          <CardTitle className="text-rose-700">நில வகைகள்</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={landTypes} searchKey="name" searchPlaceholder="நில வகையை தேடுக..." />
        </CardContent>
      </Card>
    </div>
  )
}
