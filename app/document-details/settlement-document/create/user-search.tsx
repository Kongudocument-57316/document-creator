"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, UserPlus } from "lucide-react"

interface User {
  id: string
  name: string
  age?: string
  address?: string
  [key: string]: any
}

interface UserSearchProps {
  title: string
  users: User[]
  onSelect: (user: User) => void
}

export function UserSearch({ title, users, onSelect }: UserSearchProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [showAllUsers, setShowAllUsers] = useState(false)

  // Filter users when search term changes
  useEffect(() => {
    if (!searchTerm && !showAllUsers) {
      setFilteredUsers([])
      return
    }

    if (showAllUsers) {
      setFilteredUsers(users)
      return
    }

    const filtered = users.filter((user) => {
      const searchTermLower = searchTerm.toLowerCase()
      return (
        user.name?.toLowerCase().includes(searchTermLower) ||
        user.address?.toLowerCase().includes(searchTermLower) ||
        user.door_no?.toLowerCase().includes(searchTermLower) ||
        user.address_line1?.toLowerCase().includes(searchTermLower) ||
        user.address_line2?.toLowerCase().includes(searchTermLower) ||
        user.district?.toLowerCase().includes(searchTermLower) ||
        user.taluk?.toLowerCase().includes(searchTermLower)
      )
    })
    setFilteredUsers(filtered)
  }, [searchTerm, users, showAllUsers])

  // Format address for display
  const formatAddress = (user: User): string => {
    if (!user) return ""

    const addressParts = [
      user.door_no,
      user.address_line1,
      user.address_line2,
      user.address_line3,
      user.taluk,
      user.district,
      user.pincode,
    ].filter(Boolean)

    return addressParts.length > 0 ? addressParts.join(", ") : user.address || ""
  }

  return (
    <div className="space-y-4">
      {title && <h3 className="text-lg font-medium">{title}</h3>}

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="பெயர் அல்லது முகவரியால் தேடுங்கள்..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setShowAllUsers(false)
            }}
          />
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setShowAllUsers(true)
            setSearchTerm("")
          }}
        >
          அனைத்தையும் காட்டு
        </Button>
      </div>

      {filteredUsers.length > 0 ? (
        <div className="border rounded-md overflow-hidden">
          <div className="max-h-60 overflow-y-auto">
            <table className="w-full">
              <thead className="bg-muted/50 sticky top-0">
                <tr className="border-b">
                  <th className="text-left p-2">பெயர்</th>
                  <th className="text-left p-2">வயது</th>
                  <th className="text-left p-2">முகவரி</th>
                  <th className="text-center p-2">செயல்கள்</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-muted/50">
                    <td className="p-2">{user.name || "-"}</td>
                    <td className="p-2">{user.age || "-"}</td>
                    <td className="p-2 max-w-xs truncate">{formatAddress(user) || "-"}</td>
                    <td className="p-2 text-center">
                      <Button type="button" size="sm" variant="ghost" onClick={() => onSelect(user)}>
                        <UserPlus className="h-4 w-4 mr-1" />
                        தேர்வு செய்
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : searchTerm || showAllUsers ? (
        <div className="text-center p-4 border rounded-md bg-muted/20">
          <p>பயனாளர்கள் எதுவும் கிடைக்கவில்லை</p>
        </div>
      ) : null}
    </div>
  )
}
