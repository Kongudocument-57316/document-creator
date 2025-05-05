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

interface PaymentMethod {
  id: number
  name: string
  description: string | null
  created_at: string
}

export function PaymentMethodForm() {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)

  const supabase = getSupabaseBrowserClient()

  const fetchPaymentMethods = async () => {
    try {
      const { data, error } = await supabase.from("payment_methods").select("*").order("name")

      if (error) {
        toast.error("பணம் செலு��்தும் முறைகளை பெறுவதில் பிழை: " + error.message)
        return
      }

      setPaymentMethods(data || [])
    } catch (error: any) {
      toast.error("பணம் செலுத்தும் முறைகளை பெறுவதில் பிழை: " + error.message)
    }
  }

  useEffect(() => {
    fetchPaymentMethods()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      toast.error("பணம் செலுத்தும் முறையின் பெயரை உள்ளிடவும்")
      return
    }

    setLoading(true)

    try {
      if (editingId) {
        // Update existing payment method
        const { error, data } = await supabase
          .from("payment_methods")
          .update({ name, description: description || null })
          .eq("id", editingId)
          .select()

        if (error) throw error

        // Update the payment method in the list
        if (data && data.length > 0) {
          setPaymentMethods((prevMethods) => prevMethods.map((method) => (method.id === editingId ? data[0] : method)))
        }

        toast.success("பணம் செலுத்தும் முறை வெற்றிகரமாக புதுப்பிக்கப்பட்டது")
      } else {
        // Add new payment method
        const { error, data } = await supabase
          .from("payment_methods")
          .insert([{ name, description: description || null }])
          .select()

        if (error) throw error

        // Add the new payment method to the list
        if (data && data.length > 0) {
          setPaymentMethods((prevMethods) => [...prevMethods, data[0]])
        }

        toast.success("பணம் செலுத்தும் முறை வெற்றிகரமாக சேர்க்கப்பட்டது")
      }

      // Reset form
      setName("")
      setDescription("")
      setEditingId(null)

      // Refresh payment methods
      fetchPaymentMethods()
    } catch (error: any) {
      toast.error("பிழை: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (paymentMethod: PaymentMethod) => {
    setName(paymentMethod.name)
    setDescription(paymentMethod.description || "")
    setEditingId(paymentMethod.id)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("இந்த பணம் செலுத்தும் முறையை நீக்க விரும்புகிறீர்களா?")) {
      return
    }

    try {
      const { error } = await supabase.from("payment_methods").delete().eq("id", id)

      if (error) throw error

      // Remove the deleted payment method from the list
      setPaymentMethods((prevMethods) => prevMethods.filter((method) => method.id !== id))

      toast.success("பணம் செலுத்தும் முறை வெற்றிகரமாக நீக்கப்பட்டது")
    } catch (error: any) {
      toast.error("நீக்குவதில் பிழை: " + error.message)
    }
  }

  const columns: ColumnDef<PaymentMethod>[] = [
    {
      accessorKey: "name",
      header: "பணம் செலுத்தும் முறை",
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
        const paymentMethod = row.original

        return (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => handleEdit(paymentMethod)}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleDelete(paymentMethod.id)}>
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
          <CardTitle className="text-rose-700">பணம் செலுத்தும் முறை சேர்க்க</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="payment-method-name">பணம் செலுத்தும் முறையின் பெயர்</Label>
              <Input
                id="payment-method-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="பணம் செலுத்தும் முறையின் பெயரை உள்ளிடவும்"
                className="border-rose-200 focus:border-rose-400"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="payment-method-description">விளக்கம்</Label>
              <Textarea
                id="payment-method-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="விளக்கத்தை உள்ளிடவும் (உதாரணம்: DD எண், UPI ID, வங்கி கணக்கு விவரங்கள்)"
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
          <CardTitle className="text-rose-700">பணம் செலுத்தும் முறைகள்</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={paymentMethods}
            searchKey="name"
            searchPlaceholder="பணம் செலுத்தும் முறையை தேடுக..."
          />
        </CardContent>
      </Card>
    </div>
  )
}
