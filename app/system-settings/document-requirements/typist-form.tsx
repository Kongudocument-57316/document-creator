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

interface Typist {
  id: number
  name: string
  phone: string | null
  created_at: string
}

export function TypistForm() {
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [typists, setTypists] = useState<Typist[]>([])
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)

  const supabase = getSupabaseBrowserClient()

  const fetchTypists = async () => {
    try {
      const { data, error } = await supabase.from("typists").select("*").order("name")

      if (error) {
        toast.error("தட்டச்சாளர்களை பெறுவதில் பிழை: " + error.message)
        return
      }

      setTypists(data || [])
    } catch (error: any) {
      toast.error("தட்டச்சாளர்களை பெறுவதில் பிழை: " + error.message)
    }
  }

  useEffect(() => {
    fetchTypists()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      toast.error("தட்டச்சாளரின் பெயரை உள்ளிடவும்")
      return
    }

    setLoading(true)

    try {
      if (editingId) {
        // Update existing typist
        const { error, data } = await supabase
          .from("typists")
          .update({ name, phone: phone || null })
          .eq("id", editingId)
          .select()

        if (error) throw error

        // Update the typist in the list
        if (data && data.length > 0) {
          setTypists((prevTypists) => prevTypists.map((typist) => (typist.id === editingId ? data[0] : typist)))
        }

        toast.success("தட்டச்சாளர் வெற்றிகரமாக புதுப்பிக்கப்பட்டார்")
      } else {
        // Add new typist
        const { error, data } = await supabase
          .from("typists")
          .insert([{ name, phone: phone || null }])
          .select()

        if (error) throw error

        // Add the new typist to the list
        if (data && data.length > 0) {
          setTypists((prevTypists) => [...prevTypists, data[0]])
        }

        toast.success("தட்டச்சாளர் வெற்றிகரமாக சேர்க்கப்பட்டார்")
      }

      // Reset form
      setName("")
      setPhone("")
      setEditingId(null)

      // Refresh typists
      fetchTypists()
    } catch (error: any) {
      toast.error("பிழை: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (typist: Typist) => {
    setName(typist.name)
    setPhone(typist.phone || "")
    setEditingId(typist.id)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("இந்த தட்டச்சாளரை நீக்க விரும்புகிறீர்களா?")) {
      return
    }

    try {
      const { error } = await supabase.from("typists").delete().eq("id", id)

      if (error) throw error

      // Remove the deleted typist from the list
      setTypists((prevTypists) => prevTypists.filter((typist) => typist.id !== id))

      toast.success("தட்டச்சாளர் வெற்றிகரமாக நீக்கப்பட்டார்")
    } catch (error: any) {
      toast.error("நீக்குவதில் பிழை: " + error.message)
    }
  }

  const columns: ColumnDef<Typist>[] = [
    {
      accessorKey: "name",
      header: "தட்டச்சாளரின் பெயர்",
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
        const typist = row.original

        return (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => handleEdit(typist)}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleDelete(typist.id)}>
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
          <CardTitle className="text-rose-700">தட்டச்சாளர் சேர்க்க</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="typist-name">தட்டச்சாளரின் பெயர்</Label>
              <Input
                id="typist-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="தட்டச்சாளரின் பெயரை உள்ளிடவும்"
                className="border-rose-200 focus:border-rose-400"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="typist-phone">தொலைபேசி எண்</Label>
              <Input
                id="typist-phone"
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
          <CardTitle className="text-rose-700">தட்டச்சாளர்கள்</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={typists} searchKey="name" searchPlaceholder="தட்டச்சாளரின் பெயரை தேடுக..." />
        </CardContent>
      </Card>
    </div>
  )
}
