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

interface BookNumber {
  id: number
  number: string
  created_at: string
}

export function BookNumberForm() {
  const [number, setNumber] = useState("")
  const [bookNumbers, setBookNumbers] = useState<BookNumber[]>([])
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)

  const supabase = getSupabaseBrowserClient()

  const fetchBookNumbers = async () => {
    try {
      const { data, error } = await supabase.from("book_numbers").select("*").order("number")

      if (error) {
        toast.error("புத்தக எண்களை பெறுவதில் பிழை: " + error.message)
        return
      }

      setBookNumbers(data || [])
    } catch (error: any) {
      toast.error("புத்தக எண்களை பெறுவதில் பிழை: " + error.message)
    }
  }

  useEffect(() => {
    fetchBookNumbers()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!number.trim()) {
      toast.error("புத்தக எண்ணை உள்ளிடவும்")
      return
    }

    setLoading(true)

    try {
      if (editingId) {
        // Update existing book number
        const { error, data } = await supabase.from("book_numbers").update({ number }).eq("id", editingId).select()

        if (error) throw error

        // Update the book number in the list
        if (data && data.length > 0) {
          setBookNumbers((prevNumbers) => prevNumbers.map((item) => (item.id === editingId ? data[0] : item)))
        }

        toast.success("புத்தக எண் வெற்றிகரமாக புதுப்பிக்கப்பட்டது")
      } else {
        // Add new book number
        const { error, data } = await supabase.from("book_numbers").insert([{ number }]).select()

        if (error) throw error

        // Add the new book number to the list
        if (data && data.length > 0) {
          setBookNumbers((prevNumbers) => [...prevNumbers, data[0]])
        }

        toast.success("புத்தக எண் வெற்றிகரமாக சேர்க்கப்பட்டது")
      }

      // Reset form
      setNumber("")
      setEditingId(null)

      // Refresh book numbers
      fetchBookNumbers()
    } catch (error: any) {
      toast.error("பிழை: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (bookNumber: BookNumber) => {
    setNumber(bookNumber.number)
    setEditingId(bookNumber.id)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("இந்த புத்தக எண்ணை நீக்க விரும்புகிறீர்களா?")) {
      return
    }

    try {
      const { error } = await supabase.from("book_numbers").delete().eq("id", id)

      if (error) throw error

      // Remove the deleted book number from the list
      setBookNumbers((prevNumbers) => prevNumbers.filter((item) => item.id !== id))

      toast.success("புத்தக எண் வெற்றிகரமாக நீக்கப்பட்டது")
    } catch (error: any) {
      toast.error("நீக்குவதில் பிழை: " + error.message)
    }
  }

  const columns: ColumnDef<BookNumber>[] = [
    {
      accessorKey: "number",
      header: "புத்தக எண்",
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
        const bookNumber = row.original

        return (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => handleEdit(bookNumber)}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleDelete(bookNumber.id)}>
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
          <CardTitle className="text-rose-700">புத்தக எண் சேர்க்க</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="book-number">புத்தக எண்</Label>
              <Input
                id="book-number"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                placeholder="புத்தக எண்ணை உள்ளிடவும்"
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
                    setNumber("")
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
          <CardTitle className="text-rose-700">புத்தக எண்கள்</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={bookNumbers} searchKey="number" searchPlaceholder="புத்தக எண்ணை தேடுக..." />
        </CardContent>
      </Card>
    </div>
  )
}
