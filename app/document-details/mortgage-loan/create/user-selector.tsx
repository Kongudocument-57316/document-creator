"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getSupabaseBrowserClient } from "@/lib/supabase"
import { Search, UserPlus } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"

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
  door_no?: string
  address_line1?: string
  address_line2?: string
  address_line3?: string
  district?: string
  taluk?: string
  pincode?: string
}

interface UserSelectorProps {
  onUserSelect: (user: User) => void
  buttonLabel: string
}

export function UserSelector({ onUserSelect, buttonLabel }: UserSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [searchBy, setSearchBy] = useState<"name" | "phone" | "aadhaar_number">("name")
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const supabase = getSupabaseBrowserClient()
  const { toast } = useToast()

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
      toast({
        title: "பயனாளர்களை பெறுவதில் பிழை",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isDialogOpen) {
      fetchUsers()
    }
  }, [isDialogOpen])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchUsers()
  }

  const handleSelectUser = (user: User) => {
    onUserSelect(user)
    setIsDialogOpen(false)
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" className="w-full">
          <UserPlus className="mr-2 h-4 w-4" />
          {buttonLabel}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>பயனாளர் தேடுதல்</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
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

          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>பெயர்</TableHead>
                  <TableHead>பாலினம்</TableHead>
                  <TableHead>உறவுமுறை</TableHead>
                  <TableHead>உறவினரின் பெயர்</TableHead>
                  <TableHead>தொலைபேசி எண்</TableHead>
                  <TableHead>ஆதார் எண்</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4">
                      {loading ? "தேடுகிறது..." : "பயனாளர்கள் இல்லை"}
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.gender === "male" ? "ஆண்" : "பெண்"}</TableCell>
                      <TableCell>{user.relation_type}</TableCell>
                      <TableCell>{user.relative_name}</TableCell>
                      <TableCell>{user.phone}</TableCell>
                      <TableCell>{user.aadhaar_number}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSelectUser(user)}
                          className="text-green-600"
                        >
                          தேர்வு செய்
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
