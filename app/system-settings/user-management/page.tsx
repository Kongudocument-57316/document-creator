"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@supabase/supabase-js"
import Link from "next/link"
import { Home, ArrowLeft, Search, Edit, Trash, Plus } from "lucide-react"

// Create Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default function UserManagementPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [editingUser, setEditingUser] = useState(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    relation_type: "",
    relative_name: "",
    phone: "",
    aadhaar_number: "",
    pan_number: "",
    door_number: "",
    address_line1: "",
    address_line2: "",
    address_line3: "",
    pincode: "",
    date_of_birth: "",
    age: "",
  })

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase.from("users").select("*")
      if (error) throw error
      setUsers(data || [])
    } catch (error) {
      console.error("Error fetching users:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    setSearchQuery(e.target.value)
  }

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.aadhaar_number?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleEdit = (user) => {
    setEditingUser(user)
    setFormData({
      name: user.name || "",
      gender: user.gender || "",
      relation_type: user.relation_type || "",
      relative_name: user.relative_name || "",
      phone: user.phone || "",
      aadhaar_number: user.aadhaar_number || "",
      pan_number: user.pan_number || "",
      door_number: user.door_number || "",
      address_line1: user.address_line1 || "",
      address_line2: user.address_line2 || "",
      address_line3: user.address_line3 || "",
      pincode: user.pincode || "",
      date_of_birth: user.date_of_birth ? new Date(user.date_of_birth).toISOString().split("T")[0] : "",
      age: user.age?.toString() || "",
    })
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleDateChange = (e) => {
    const dob = new Date(e.target.value)
    const today = new Date()
    let age = today.getFullYear() - dob.getFullYear()
    const monthDiff = today.getMonth() - dob.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--
    }

    setFormData({
      ...formData,
      date_of_birth: e.target.value,
      age: age.toString(),
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingUser) {
        // Update existing user
        const { error } = await supabase
          .from("users")
          .update({
            name: formData.name,
            gender: formData.gender,
            relation_type: formData.relation_type,
            relative_name: formData.relative_name,
            phone: formData.phone,
            aadhaar_number: formData.aadhaar_number,
            pan_number: formData.pan_number,
            door_number: formData.door_number,
            address_line1: formData.address_line1,
            address_line2: formData.address_line2,
            address_line3: formData.address_line3,
            pincode: formData.pincode,
            date_of_birth: formData.date_of_birth,
            age: Number.parseInt(formData.age) || null,
            updated_at: new Date(),
          })
          .eq("id", editingUser.id)

        if (error) throw error
        setEditingUser(null)
      } else {
        // Add new user
        const { error } = await supabase.from("users").insert({
          name: formData.name,
          gender: formData.gender,
          relation_type: formData.relation_type,
          relative_name: formData.relative_name,
          phone: formData.phone,
          aadhaar_number: formData.aadhaar_number,
          pan_number: formData.pan_number,
          door_number: formData.door_number,
          address_line1: formData.address_line1,
          address_line2: formData.address_line2,
          address_line3: formData.address_line3,
          pincode: formData.pincode,
          date_of_birth: formData.date_of_birth,
          age: Number.parseInt(formData.age) || null,
          created_at: new Date(),
          updated_at: new Date(),
        })

        if (error) throw error
        setShowAddForm(false)
      }

      // Reset form and refresh users
      setFormData({
        name: "",
        gender: "",
        relation_type: "",
        relative_name: "",
        phone: "",
        aadhaar_number: "",
        pan_number: "",
        door_number: "",
        address_line1: "",
        address_line2: "",
        address_line3: "",
        pincode: "",
        date_of_birth: "",
        age: "",
      })
      fetchUsers()
    } catch (error) {
      console.error("Error saving user:", error)
      alert("Error saving user: " + error.message)
    }
  }

  const handleDelete = async (userId) => {
    if (!confirm("உறுதியாக இந்த பயனாளரை நீக்க விரும்புகிறீர்களா?")) return

    try {
      const { error } = await supabase.from("users").delete().eq("id", userId)
      if (error) throw error
      fetchUsers()
    } catch (error) {
      console.error("Error deleting user:", error)
    }
  }

  const handleAddNewUser = () => {
    setEditingUser(null)
    setFormData({
      name: "",
      gender: "",
      relation_type: "",
      relative_name: "",
      phone: "",
      aadhaar_number: "",
      pan_number: "",
      door_number: "",
      address_line1: "",
      address_line2: "",
      address_line3: "",
      pincode: "",
      date_of_birth: "",
      age: "",
    })
    setShowAddForm(true)
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">பயனாளர் மேலாண்மை</h1>
        <div className="flex space-x-2">
          <Button variant="outline" asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              முகப்பு
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/system-settings">
              <ArrowLeft className="mr-2 h-4 w-4" />
              பின்செல்
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>பயனாளர்கள்</CardTitle>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input type="search" placeholder="தேடு..." className="pl-8" value={searchQuery} onChange={handleSearch} />
            </div>
            <Button onClick={handleAddNewUser}>
              <Plus className="mr-2 h-4 w-4" />
              புதிய பயனாளர்
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">ஏற்றுகிறது...</div>
          ) : (
            <>
              {filteredUsers.length === 0 ? (
                <div className="text-center py-4">பயனாளர்கள் எதுவும் இல்லை</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="p-2 text-left">பெயர்</th>
                        <th className="p-2 text-left">தொலைபேசி</th>
                        <th className="p-2 text-left">ஆதார் எண்</th>
                        <th className="p-2 text-left">உறவுமுறை</th>
                        <th className="p-2 text-left">உறவினர் பெயர்</th>
                        <th className="p-2 text-center">செயல்கள்</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="border-b hover:bg-gray-50">
                          <td className="p-2">{user.name}</td>
                          <td className="p-2">{user.phone}</td>
                          <td className="p-2">{user.aadhaar_number}</td>
                          <td className="p-2">
                            {user.relation_type === "son"
                              ? "மகன்"
                              : user.relation_type === "daughter"
                                ? "மகள்"
                                : user.relation_type === "wife"
                                  ? "மனைவி"
                                  : user.relation_type === "husband"
                                    ? "கணவர்"
                                    : user.relation_type === "father"
                                      ? "தந்தை"
                                      : user.relation_type === "mother"
                                        ? "தாய்"
                                        : user.relation_type}
                          </td>
                          <td className="p-2">{user.relative_name}</td>
                          <td className="p-2 text-center">
                            <Button variant="ghost" size="sm" onClick={() => handleEdit(user)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-500"
                              onClick={() => handleDelete(user.id)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {(editingUser || showAddForm) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>{editingUser ? "பயனாளர் விவரங்களைத் திருத்து" : "புதிய பயனாளர் சேர்க்க"}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">பெயர்</Label>
                    <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender">பாலினம்</Label>
                    <select
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full p-2 rounded-md border border-gray-300"
                    >
                      <option value="">தேர்ந்தெடுக்கவும்</option>
                      <option value="male">ஆண்</option>
                      <option value="female">பெண்</option>
                      <option value="other">மற்றவை</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="relation_type">உறவுமுறை</Label>
                    <select
                      id="relation_type"
                      name="relation_type"
                      value={formData.relation_type}
                      onChange={handleChange}
                      className="w-full p-2 rounded-md border border-gray-300"
                    >
                      <option value="">தேர்ந்தெடுக்கவும்</option>
                      <option value="son">மகன்</option>
                      <option value="daughter">மகள்</option>
                      <option value="wife">மனைவி</option>
                      <option value="husband">கணவர்</option>
                      <option value="father">தந்தை</option>
                      <option value="mother">தாய்</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="relative_name">உறவினர் பெயர்</Label>
                    <Input
                      id="relative_name"
                      name="relative_name"
                      value={formData.relative_name}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date_of_birth">பிறந்த தேதி</Label>
                    <Input
                      id="date_of_birth"
                      name="date_of_birth"
                      type="date"
                      value={formData.date_of_birth}
                      onChange={handleDateChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="age">வயது</Label>
                    <Input id="age" name="age" value={formData.age} readOnly />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">தொலைபேசி எண்</Label>
                    <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="aadhaar_number">ஆதார் எண்</Label>
                    <Input
                      id="aadhaar_number"
                      name="aadhaar_number"
                      value={formData.aadhaar_number}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pan_number">பான் எண்</Label>
                    <Input id="pan_number" name="pan_number" value={formData.pan_number} onChange={handleChange} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="door_number">கதவு எண்</Label>
                    <Input id="door_number" name="door_number" value={formData.door_number} onChange={handleChange} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address_line1">முகவரி வரி 1</Label>
                    <Input
                      id="address_line1"
                      name="address_line1"
                      value={formData.address_line1}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address_line2">முகவரி வரி 2</Label>
                    <Input
                      id="address_line2"
                      name="address_line2"
                      value={formData.address_line2}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address_line3">முகவரி வரி 3</Label>
                    <Input
                      id="address_line3"
                      name="address_line3"
                      value={formData.address_line3}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pincode">பின்கோடு</Label>
                    <Input id="pincode" name="pincode" value={formData.pincode} onChange={handleChange} />
                  </div>
                </div>

                <div className="flex justify-end space-x-2 mt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setEditingUser(null)
                      setShowAddForm(false)
                    }}
                  >
                    ரத்து செய்
                  </Button>
                  <Button type="submit">சேமி</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
