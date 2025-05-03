"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DataTable } from "@/components/ui/data-table"
import { useState, useEffect } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase"
import { Pencil, Trash2, Search } from "lucide-react"
import { toast } from "sonner"
import type { ColumnDef } from "@tanstack/react-table"
import { useRouter } from "next/navigation"

interface User {
  id: number
  name: string
  gender: string
  relation_type: string
  relative_name: string
  phone: string
  aadhaar_number: string
  district_name?: string
  taluk_name?: string
}

export function UserSearch() {
  const [searchTerm, setSearchTerm] = useState("")
  const [searchBy, setSearchBy] = useState<"name" | "phone" | "aadhaar_number">("name")
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const supabase = getSupabaseBrowserClient()

  const fetchUsers = async () => {
    setLoading(true)

    try {
      let query = supabase.from("users").select(`
          *,
          districts:district_id (name),
          taluks:taluk_id (name)
        `)

      if (searchTerm) {
        query = query.ilike(searchBy, `%${searchTerm}%`)
      }

      const { data, error } = await query.order("name")

      if (error) throw error

      const formattedData =
        data?.map((user) => ({
          ...user,
          district_name: user.districts?.name,
          taluk_name: user.taluks?.name,
        })) || []

      setUsers(formattedData)
    } catch (error: any) {
      toast.error("பயனாளர்களை பெறுவதில் பிழை: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchUsers()
  }

  const handleEdit = (id: number) => {
    // Navigate to user form with the user ID
    router.push(`/system-settings/user-management?edit=${id}`)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("இந்த பயனாளரை நீக்க விரும்புகிறீர்களா?")) {
      return
    }

    try {
      const { error } = await supabase.from("users").delete().eq("id", id)

      if (error) throw error

      toast.success("பயனாளர் வெற்றிகரமாக நீக்கப்பட்டார்")
      fetchUsers()
    } catch (error: any) {
      toast.error("நீக்குவதில் பிழை: " + error.message)
    }
  }

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "name",
      header: "பெயர்",
    },
    {
      accessorKey: "gender",
      header: "பாலினம்",
      cell: ({ row }) => {
        const gender = row.original.gender
        return gender === "male" ? "ஆண்" : "பெண்"
      },
    },
    {
      accessorKey: "relation_type",
      header: "உறவுமுறை",
    },
    {
      accessorKey: "relative_name",
      header: "உறவினரின் பெயர்",
    },
    {
      accessorKey: "district_name",
      header: "மாவட்டம்",
    },
    {
      accessorKey: "taluk_name",
      header: "வட்டம்",
    },
    {
      accessorKey: "phone",
      header: "தொலைபேசி எண்",
    },
    {
      accessorKey: "aadhaar_number",
      header: "ஆதார் எண்",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const user = row.original

        return (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => handleEdit(user.id)} className="text-green-600">
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleDelete(user.id)} className="text-red-600">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )
      },
    },
  ]

  return (
    <div className="grid gap-6">
      <Card className="border-green-200">
        <CardHeader className="bg-green-50 rounded-t-lg">
          <CardTitle className="text-green-700">பயனாளர் தேடுதல்</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="search-term">தேடுதல்</Label>
                <Input
                  id="search-term"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="தேடுதல் சொல்லை உள்ளிடவும்"
                  className="border-green-200 focus:border-green-400"
                />
              </div>

              <div className="w-full md:w-48">
                <Label htmlFor="search-by">தேடுதல் வகை</Label>
                <select
                  id="search-by"
                  value={searchBy}
                  onChange={(e) => setSearchBy(e.target.value as any)}
                  className="flex h-10 w-full rounded-md border border-green-200 bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="name">பெயர்</option>
                  <option value="phone">தொலைபேசி எண்</option>
                  <option value="aadhaar_number">ஆதார் எண்</option>
                </select>
              </div>

              <div className="flex items-end">
                <Button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700">
                  <Search className="h-4 w-4 mr-2" />
                  தேடு
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="border-green-200">
        <CardHeader className="bg-green-50 rounded-t-lg">
          <CardTitle className="text-green-700">பயனாளர்கள்</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={users} />
        </CardContent>
      </Card>
    </div>
  )
}
