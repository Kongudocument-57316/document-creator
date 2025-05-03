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

interface SubmissionType {
  id: number
  name: string
  created_at: string
}

export function SubmissionTypeForm() {
  const [name, setName] = useState("")
  const [submissionTypes, setSubmissionTypes] = useState<SubmissionType[]>([])
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)

  const supabase = getSupabaseBrowserClient()

  const fetchSubmissionTypes = async () => {
    try {
      const { data, error } = await supabase.from("submission_types").select("*").order("name")

      if (error) {
        toast.error("ஆவணம் ஒப்படைப்பு வகைகளை பெறுவதில் பிழை: " + error.message)
        return
      }

      setSubmissionTypes(data || [])
    } catch (error: any) {
      toast.error("ஆவணம் ஒப்படைப்பு வகைகளை பெறுவதில் பிழை: " + error.message)
    }
  }

  useEffect(() => {
    fetchSubmissionTypes()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      toast.error("ஆவணம் ஒப்படைப்பு வகையை உள்ளிடவும்")
      return
    }

    setLoading(true)

    try {
      if (editingId) {
        // Update existing submission type
        const { error, data } = await supabase.from("submission_types").update({ name }).eq("id", editingId).select()

        if (error) throw error

        // Update the submission type in the list
        if (data && data.length > 0) {
          setSubmissionTypes((prevTypes) => prevTypes.map((type) => (type.id === editingId ? data[0] : type)))
        }

        toast.success("ஆவணம் ஒப்படைப்பு வகை வெற்றிகரமாக புதுப்பிக்கப்பட்டது")
      } else {
        // Add new submission type
        const { error, data } = await supabase.from("submission_types").insert([{ name }]).select()

        if (error) throw error

        // Add the new submission type to the list
        if (data && data.length > 0) {
          setSubmissionTypes((prevTypes) => [...prevTypes, data[0]])
        }

        toast.success("ஆவணம் ஒப்படைப்பு வகை வெற்றிகரமாக சேர்க்கப்பட்டது")
      }

      // Reset form
      setName("")
      setEditingId(null)

      // Refresh submission types
      fetchSubmissionTypes()
    } catch (error: any) {
      toast.error("பிழை: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (submissionType: SubmissionType) => {
    setName(submissionType.name)
    setEditingId(submissionType.id)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("இந்த ஆவணம் ஒப்படைப்பு வகையை நீக்க விரும்புகிறீர்களா?")) {
      return
    }

    try {
      const { error } = await supabase.from("submission_types").delete().eq("id", id)

      if (error) throw error

      // Remove the deleted submission type from the list
      setSubmissionTypes((prevTypes) => prevTypes.filter((type) => type.id !== id))

      toast.success("ஆவணம் ஒப்படைப்பு வகை வெற்றிகரமாக நீக்கப்பட்டது")
    } catch (error: any) {
      toast.error("நீக்குவதில் பிழை: " + error.message)
    }
  }

  const columns: ColumnDef<SubmissionType>[] = [
    {
      accessorKey: "name",
      header: "ஆவணம் ஒப்படைப்பு வகை",
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
        const submissionType = row.original

        return (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => handleEdit(submissionType)}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleDelete(submissionType.id)}>
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
          <CardTitle className="text-rose-700">ஆவணம் ஒப்படைப்பு வகை சேர்க்க</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="submission-type-name">ஆவணம் ஒப்படைப்பு வகை</Label>
              <Input
                id="submission-type-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="ஆவணம் ஒப்படைப்பு வகையை உள்ளிடவும்"
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
          <CardTitle className="text-rose-700">ஆவணம் ஒப்படைப்பு வகைகள்</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={submissionTypes}
            searchKey="name"
            searchPlaceholder="ஆவணம் ஒப்படைப்பு வகையை தேடுக..."
          />
        </CardContent>
      </Card>
    </div>
  )
}
