"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { getSupabaseBrowserClient } from "@/lib/supabase"
import { Search, UserPlus } from "lucide-react"
import { DataTable } from "@/components/ui/data-table"
import type { ColumnDef } from "@tanstack/react-table"
import { toast } from "sonner"

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
  age?: number
  door_number?: string
  address_line1?: string
  address_line2?: string
  address_line3?: string
  pincode?: string
  district_id?: number
  taluk_id?: number
}

interface UserSearchDialogProps {
  onSelectUser: (user: User) => void
  buttonLabel?: string
  dialogTitle?: string
}

export function UserSearchDialog({
  onSelectUser,
  buttonLabel = "பயனாளரைத் தேடு",
  dialogTitle = "பயனாளர் தேடுதல்",
}: UserSearchDialogProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [searchBy, setSearchBy] = useState<"name" | "phone" | "aadhaar_number">("name")
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

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
    if (open) {
      fetchUsers()
    }
  }, [open])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchUsers()
  }

  const handleSelectUser = (user: User) => {
    onSelectUser(user)
    setOpen(false)
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
      accessorKey: "age",
      header: "வயது",
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
      accessorKey: "phone",
      header: "தொலைபேசி எண்",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const user = row.original

        return (
          <div className="flex items-center gap-2">
            <Button
              variant="default"
              size="sm"
              onClick={() => handleSelectUser(user)}
              className="bg-purple-600 hover:bg-purple-700"
            >
              தேர்ந்தெடு
            </Button>
          </div>
        )
      },
    },
  ]

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-purple-300 text-purple-700 hover:bg-purple-100">
          <UserPlus className="h-4 w-4 mr-2" />
          {buttonLabel}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-purple-700">{dialogTitle}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search-term">தேடுதல்</Label>
              <Input
                id="search-term"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="தேடுதல் சொல்லை உள்ளிடவும்"
                className="border-purple-200 focus:border-purple-400"
              />
            </div>

            <div className="w-full md:w-48">
              <Label htmlFor="search-by">தேடுதல் வகை</Label>
              <select
                id="search-by"
                value={searchBy}
                onChange={(e) => setSearchBy(e.target.value as any)}
                className="flex h-10 w-full rounded-md border border-purple-200 bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="name">பெயர்</option>
                <option value="phone">தொலைபேசி எண்</option>
                <option value="aadhaar_number">ஆதார் எண்</option>
              </select>
            </div>

            <div className="flex items-end">
              <Button type="submit" disabled={loading} className="bg-purple-600 hover:bg-purple-700">
                <Search className="h-4 w-4 mr-2" />
                தேடு
              </Button>
            </div>
          </div>
        </form>

        <div className="border rounded-md mt-4">
          <DataTable columns={columns} data={users} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
