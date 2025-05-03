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

interface Office {
  id: number
  name: string
  phone: string | null
  created_at: string
}

export function OfficeForm() {
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [offices, setOffices] = useState<Office[]>([])
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)

  const supabase = getSupabaseBrowserClient()

  const fetchOffices = async () => {
    try {
      const { data, error } = await supabase.from("offices").select("*").order("name")

      if (error) {
        toast.error("அலுவலகங்களை பெறுவதில் பிழை: " + error.message)
        return
      }

      setOffices(data || [])
    } catch (error: any) {
      toast.error("அலுவலகங்களை பெறுவதில் பிழை: " + error.message)
    }
  }

  useEffect(() => {
    fetchOffices()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      toast.error("அலுவலகத்தின் பெயரை உள்ளிடவும்")
      return
    }

    setLoading(true)

    try {
      if (editingId) {
        // Update existing office
        const { error, data } = await supabase
          .from("offices")
          .update({ name, phone: phone || null })
          .eq("id", editingId)
          .select()

        if (error) throw error

        // Update the office in the list
        if (data && data.length > 0) {
          setOffices((prevOffices) => prevOffices.map((office) => (office.id === editingId ? data[0] : office)))
        }

        toast.success("அலுவலகம் வெற்றிகரமாக புதுப்பிக்கப்பட்டது")
      } else {
        // Add new office
        const { error, data } = await supabase
          .from("offices")
          .insert([{ name, phone: phone || null }])
          .select()

        if (error) throw error

        // Add the new office to the list
        if (data && data.length > 0) {
          setOffices((prevOffices) => [...prevOffices, data[0]])
        }

        toast.success("அலுவலகம் வெற்றிகரமாக சேர்க்கப்பட்டது")
      }

      // Reset form
      setName("")
      setPhone("")
      setEditingId(null)

      // Refresh offices
      fetchOffices()
    } catch (error: any) {
      toast.error("பிழை: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (office: Office) => {
    setName(office.name)
    setPhone(office.phone || "")
    setEditingId(office.id)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("இந்த அலுவலகத்தை நீக்க விரும்புகிறீர்களா?")) {
      return
    }

    try {
      const { error } = await supabase.from("offices").delete().eq("id", id)

      if (error) throw error

      // Remove the deleted office from the list
      setOffices((prevOffices) => prevOffices.filter((office) => office.id !== id))

      toast.success("அலுவலகம் வெற்றிகரமாக நீக்கப்பட்டது")
    } catch (error: any) {
      toast.error("நீக்குவதில் பிழை: " + error.message)
    }
  }

  const columns: ColumnDef<Office>[] = [
    {
      accessorKey: "name",
      header: "தட்டச்சு அலுவலகத்தின் பெயர்",
    },
    {
      accessorKey: "phone",
      header: "தொலைபேசி எண்",
      cell: ({ row }) => row.original.phone || "-",
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
      <Card className="border-rose-200">
        <CardHeader className="bg-rose-50 rounded-t-lg">
          <CardTitle className="text-rose-700">தட்டச்சு அலுவலகம் சேர்க்க</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="office-name">தட்டச்சு அலுவலகத்தின் பெயர்</Label>
              <Input
                id="office-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="தட்டச்சு அலுவலகத்தின் பெயரை உள்ளிடவும்"
                className="border-rose-200 focus:border-rose-400"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="office-phone">தொலைபேசி எண்</Label>
              <Input
                id="office-phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="தொலைபேசி எண்ணை உள்ளிடவும்"
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
                    setPhone("")
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
          <CardTitle className="text-rose-700">தட்டச்சு அலுவலகங்கள்</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={offices}
            searchKey="name"
            searchPlaceholder="தட்டச்சு அலுவலகத்தின் பெயரை தேடுக..."
          />
        </CardContent>
      </Card>
    </div>
  )
}
