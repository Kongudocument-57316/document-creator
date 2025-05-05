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

interface DocumentType {
  id: number
  name: string
  created_at: string
}

export function DocumentTypeForm() {
  const [name, setName] = useState("")
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([])
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)

  const supabase = getSupabaseBrowserClient()

  const fetchDocumentTypes = async () => {
    try {
      const { data, error } = await supabase.from("document_types").select("*").order("name")

      if (error) {
        toast.error("ஆவணத்தின் வகைகளை பெறுவதில் பிழை: " + error.message)
        return
      }

      setDocumentTypes(data || [])
    } catch (error: any) {
      toast.error("ஆவணத்தின் வகைகளை பெறுவதில் பிழை: " + error.message)
    }
  }

  useEffect(() => {
    fetchDocumentTypes()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      toast.error("ஆவணத்தின் வகையை உள்ளிடவும்")
      return
    }

    setLoading(true)

    try {
      if (editingId) {
        // Update existing document type
        const { error, data } = await supabase.from("document_types").update({ name }).eq("id", editingId).select()

        if (error) throw error

        // Update the document type in the list
        if (data && data.length > 0) {
          setDocumentTypes((prevTypes) => prevTypes.map((type) => (type.id === editingId ? data[0] : type)))
        }

        toast.success("ஆவணத்தின் வகை வெற்றிகரமாக புதுப்பிக்கப்பட்டது")
      } else {
        // Add new document type
        const { error, data } = await supabase.from("document_types").insert([{ name }]).select()

        if (error) throw error

        // Add the new document type to the list
        if (data && data.length > 0) {
          setDocumentTypes((prevTypes) => [...prevTypes, data[0]])
        }

        toast.success("ஆவணத்தின் வகை வெற்றிகரமாக சேர்க்கப்பட்டது")
      }

      // Reset form
      setName("")
      setEditingId(null)

      // Refresh document types
      fetchDocumentTypes()
    } catch (error: any) {
      toast.error("பிழை: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (documentType: DocumentType) => {
    setName(documentType.name)
    setEditingId(documentType.id)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("இந்த ஆவணத்தின் வகையை நீக்க விரும்புகிறீர்களா?")) {
      return
    }

    try {
      const { error } = await supabase.from("document_types").delete().eq("id", id)

      if (error) throw error

      // Remove the deleted document type from the list
      setDocumentTypes((prevTypes) => prevTypes.filter((type) => type.id !== id))

      toast.success("ஆவணத்தின் வகை வெற்றிகரமாக நீக்கப்பட்டது")
    } catch (error: any) {
      toast.error("நீக்குவதில் பிழை: " + error.message)
    }
  }

  const columns: ColumnDef<DocumentType>[] = [
    {
      accessorKey: "name",
      header: "ஆவணத்தின் வகை",
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
        const documentType = row.original

        return (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => handleEdit(documentType)}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleDelete(documentType.id)}>
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
          <CardTitle className="text-rose-700">ஆவணத்தின் வகை சேர்க்க</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="document-type-name">ஆவணத்தின் வகை</Label>
              <Input
                id="document-type-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="ஆவணத்தின் வகையை உள்ளிடவும்"
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
          <CardTitle className="text-rose-700">ஆவணத்தின் வகைகள்</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={documentTypes}
            searchKey="name"
            searchPlaceholder="ஆவணத்தின் வகையை தேடுக..."
          />
        </CardContent>
      </Card>
    </div>
  )
}
