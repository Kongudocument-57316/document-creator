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

interface ValueType {
  id: number
  name: string
  description: string | null
  created_at: string
}

export function ValueTypeForm() {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [valueTypes, setValueTypes] = useState<ValueType[]>([])
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)

  const supabase = getSupabaseBrowserClient()

  const fetchValueTypes = async () => {
    try {
      const { data, error } = await supabase.from("value_types").select("*").order("name")

      if (error) {
        toast.error("மதிப்பு வகைகளை பெறுவதில் பிழை: " + error.message)
        return
      }

      setValueTypes(data || [])
    } catch (error: any) {
      toast.error("மதிப்பு வகைகளை பெறுவதில் பிழை: " + error.message)
    }
  }

  useEffect(() => {
    fetchValueTypes()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      toast.error("மதிப்பு வகையின் பெயரை உள்ளிடவும்")
      return
    }

    setLoading(true)

    try {
      if (editingId) {
        // Update existing value type
        const { error, data } = await supabase
          .from("value_types")
          .update({ name, description: description || null })
          .eq("id", editingId)
          .select()

        if (error) throw error

        // Update the value type in the list
        if (data && data.length > 0) {
          setValueTypes((prevTypes) => prevTypes.map((type) => (type.id === editingId ? data[0] : type)))
        }

        toast.success("மதிப்பு வகை வெற்றிகரமாக புதுப்பிக்கப்பட்டது")
      } else {
        // Add new value type
        const { error, data } = await supabase
          .from("value_types")
          .insert([{ name, description: description || null }])
          .select()

        if (error) throw error

        // Add the new value type to the list
        if (data && data.length > 0) {
          setValueTypes((prevTypes) => [...prevTypes, data[0]])
        }

        toast.success("மதிப்பு வகை வெற்றிகரமாக சேர்க்கப்பட்டது")
      }

      // Reset form
      setName("")
      setDescription("")
      setEditingId(null)

      // Refresh value types
      fetchValueTypes()
    } catch (error: any) {
      toast.error("பிழை: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (valueType: ValueType) => {
    setName(valueType.name)
    setDescription(valueType.description || "")
    setEditingId(valueType.id)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("இந்த மதிப்பு வகையை நீக்க விரும்புகிறீர்களா?")) {
      return
    }

    try {
      const { error } = await supabase.from("value_types").delete().eq("id", id)

      if (error) throw error

      // Remove the deleted value type from the list
      setValueTypes((prevTypes) => prevTypes.filter((type) => type.id !== id))

      toast.success("மதிப்பு வகை வெற்றிகரமாக நீக்கப்பட்டது")
    } catch (error: any) {
      toast.error("நீக்குவதில் பிழை: " + error.message)
    }
  }

  const columns: ColumnDef<ValueType>[] = [
    {
      accessorKey: "name",
      header: "மதிப்பு வகையின் பெயர்",
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
        const valueType = row.original

        return (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => handleEdit(valueType)}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleDelete(valueType.id)}>
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
          <CardTitle className="text-rose-700">மதிப்பு வகை சேர்க்க</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="value-type-name">மதிப்பு வகையின் பெயர்</Label>
              <Input
                id="value-type-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="மதிப்பு வகையின் பெயரை உள்ளிடவும் (உதாரணம்: பூமியின் மதிப்பு, கட்டிடத்தின் மதிப்பு)"
                className="border-rose-200 focus:border-rose-400"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="value-type-description">விளக்கம்</Label>
              <Textarea
                id="value-type-description"
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
          <CardTitle className="text-rose-700">மதிப்பு வகைகள்</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={valueTypes} searchKey="name" searchPlaceholder="மதிப்பு வகையை தேடுக..." />
        </CardContent>
      </Card>
    </div>
  )
}
