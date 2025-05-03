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

interface State {
  id: number
  name: string
  created_at: string
}

export function StateForm() {
  const [name, setName] = useState("")
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

  useEffect(() => {
    fetchStates()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      toast.error("மாநிலத்தின் பெயரை உள்ளிடவும்")
      return
    }

    setLoading(true)

    try {
      if (editingId) {
        // Update existing state
        const { error } = await supabase.from("states").update({ name }).eq("id", editingId)

        if (error) throw error
        toast.success("மாநிலம் வெற்றிகரமாக புதுப்பிக்கப்பட்டது")
      } else {
        // Add new state
        const { error, data } = await supabase.from("states").insert([{ name }]).select()

        if (error) throw error

        // Add the new state to the states array
        if (data && data.length > 0) {
          setStates((prevStates) => [...prevStates, data[0]])
        }

        toast.success("மாநிலம் வெற்றிகரமாக சேர்க்கப்பட்டது")
      }

      // Reset form
      setName("")
      setEditingId(null)

      // Fetch updated states
      fetchStates()
    } catch (error: any) {
      toast.error("பிழை: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (state: State) => {
    setName(state.name)
    setEditingId(state.id)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("இந்த மாநிலத்தை நீக்க விரும்புகிறீர்களா?")) {
      return
    }

    try {
      const { error } = await supabase.from("states").delete().eq("id", id)

      if (error) throw error

      // Remove the deleted state from the states array
      setStates((prevStates) => prevStates.filter((state) => state.id !== id))

      toast.success("மாநிலம் வெற்றிகரமாக நீக்கப்பட்டது")
    } catch (error: any) {
      toast.error("நீக்குவதில் பிழை: " + error.message)
    }
  }

  const columns: ColumnDef<State>[] = [
    {
      accessorKey: "name",
      header: "மாநிலம்",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const state = row.original

        return (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => handleEdit(state)}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleDelete(state.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )
      },
    },
  ]

  return (
    <div className="grid gap-6">
      <Card className="border-blue-200">
        <CardHeader className="bg-blue-50 rounded-t-lg">
          <CardTitle className="text-blue-700">மாநிலம் சேர்க்க</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="state-name">மாநிலத்தின் பெயர்</Label>
              <Input
                id="state-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="மாநிலத்தின் பெயரை உள்ளிடவும்"
                className="border-blue-200 focus:border-blue-400"
              />
            </div>
            <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
              {editingId ? "புதுப்பி" : "சேர்க்க"}
            </Button>
            {editingId && (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setName("")
                  setEditingId(null)
                }}
                className="ml-2 border-blue-200 text-blue-700"
              >
                ரத்து செய்
              </Button>
            )}
          </form>
        </CardContent>
      </Card>

      <Card className="border-blue-200">
        <CardHeader className="bg-blue-50 rounded-t-lg">
          <CardTitle className="text-blue-700">மாநிலங்கள்</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={states} searchKey="name" searchPlaceholder="மாநிலத்தை தேடுக..." />
        </CardContent>
      </Card>
    </div>
  )
}
