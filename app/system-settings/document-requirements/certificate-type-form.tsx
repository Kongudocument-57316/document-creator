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

interface CertificateType {
  id: number
  name: string
  description: string | null
  created_at: string
}

export function CertificateTypeForm() {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [certificateTypes, setCertificateTypes] = useState<CertificateType[]>([])
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)

  const supabase = getSupabaseBrowserClient()

  const fetchCertificateTypes = async () => {
    try {
      const { data, error } = await supabase.from("certificate_types").select("*").order("name")

      if (error) {
        toast.error("சான்றிதழ்கள் வகைகளை பெறுவதில் பிழை: " + error.message)
        return
      }

      setCertificateTypes(data || [])
    } catch (error: any) {
      toast.error("சான்றிதழ்கள் வகைகளை பெறுவதில் பிழை: " + error.message)
    }
  }

  useEffect(() => {
    fetchCertificateTypes()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      toast.error("சான்றிதழின் பெயரை உள்ளிடவும்")
      return
    }

    setLoading(true)

    try {
      if (editingId) {
        // Update existing certificate type
        const { error, data } = await supabase
          .from("certificate_types")
          .update({ name, description: description || null })
          .eq("id", editingId)
          .select()

        if (error) throw error

        // Update the certificate type in the list
        if (data && data.length > 0) {
          setCertificateTypes((prevTypes) => prevTypes.map((type) => (type.id === editingId ? data[0] : type)))
        }

        toast.success("சான்றிதழ் வகை வெற்றிகரமாக புதுப்பிக்கப்பட்டது")
      } else {
        // Add new certificate type
        const { error, data } = await supabase
          .from("certificate_types")
          .insert([{ name, description: description || null }])
          .select()

        if (error) throw error

        // Add the new certificate type to the list
        if (data && data.length > 0) {
          setCertificateTypes((prevTypes) => [...prevTypes, data[0]])
        }

        toast.success("சான்றிதழ் வகை வெற்றிகரமாக சேர்க்கப்பட்டது")
      }

      // Reset form
      setName("")
      setDescription("")
      setEditingId(null)

      // Refresh certificate types
      fetchCertificateTypes()
    } catch (error: any) {
      toast.error("பிழை: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (certificateType: CertificateType) => {
    setName(certificateType.name)
    setDescription(certificateType.description || "")
    setEditingId(certificateType.id)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("இந்த சான்றிதழ் வகையை நீக்க விரும்புகிறீர்களா?")) {
      return
    }

    try {
      const { error } = await supabase.from("certificate_types").delete().eq("id", id)

      if (error) throw error

      // Remove the deleted certificate type from the list
      setCertificateTypes((prevTypes) => prevTypes.filter((type) => type.id !== id))

      toast.success("சான்றிதழ் வகை வெற்றிகரமாக நீக்கப்பட்டது")
    } catch (error: any) {
      toast.error("நீக்குவதில் பிழை: " + error.message)
    }
  }

  const columns: ColumnDef<CertificateType>[] = [
    {
      accessorKey: "name",
      header: "சான்றிதழின் பெயர்",
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
        const certificateType = row.original

        return (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => handleEdit(certificateType)}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleDelete(certificateType.id)}>
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
          <CardTitle className="text-rose-700">சான்றிதழ் வகை சேர்க்க</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="certificate-type-name">சான்றிதழின் பெயர்</Label>
              <Input
                id="certificate-type-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="சான்றிதழின் பெயரை உள்ளிடவும் (உதாரணம்: இறப்பு சான்று, வாரிசு சான்று)"
                className="border-rose-200 focus:border-rose-400"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="certificate-type-description">விளக்கம்</Label>
              <Textarea
                id="certificate-type-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="விளக்கத்தை உள்ளிடவும் (உதாரணம்: சான்றிதழ் எண், வழங்கப்பட்ட தேதி, வழங்கிய அலுவலகம்)"
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
          <CardTitle className="text-rose-700">சான்றிதழ்கள் வகைகள்</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={certificateTypes}
            searchKey="name"
            searchPlaceholder="சான்றிதழின் பெயரை தேடுக..."
          />
        </CardContent>
      </Card>
    </div>
  )
}
