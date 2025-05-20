"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@supabase/supabase-js"
import { Home, ArrowLeft, Search, User, Users, MapPin, Plus, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "@/components/ui/use-toast"

// Import the relation type utility
import { getRelationTypeText } from "@/utils/relation-types"

// Create Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default function CreateSaleDocument() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("buyer")
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [selectedBuyer, setSelectedBuyer] = useState(null)
  const [buyersList, setBuyersList] = useState([])
  const [sellersList, setSellersList] = useState([])

  // Form fields for buyer
  const [buyerForm, setBuyerForm] = useState({
    name: "",
    gender: "",
    relation_type: "",
    relative_name: "",
    door_number: "",
    address_line1: "",
    address_line2: "",
    address_line3: "",
    district_id: "",
    taluk_id: "",
    phone: "",
    aadhaar_number: "",
    pan_number: "",
    pincode: "",
    date_of_birth: "",
    age: "",
  })

  // Search for users as user types
  useEffect(() => {
    const searchUsers = async () => {
      if (searchQuery.length < 2) {
        setSearchResults([])
        setIsSearching(false)
        return
      }

      setIsSearching(true)

      try {
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .or(`name.ilike.%${searchQuery}%,phone.ilike.%${searchQuery}%,aadhaar_number.ilike.%${searchQuery}%`)
          .limit(5)

        if (error) throw error

        setSearchResults(data || [])
      } catch (error) {
        console.error("Error searching users:", error)
      } finally {
        setIsSearching(false)
      }
    }

    const debounceTimer = setTimeout(searchUsers, 300)
    return () => clearTimeout(debounceTimer)
  }, [searchQuery])

  // Handle selecting a user from search results
  const handleSelectUser = (user) => {
    // Format date of birth if it exists
    let formattedDob = ""
    let calculatedAge = ""

    if (user.date_of_birth) {
      formattedDob = new Date(user.date_of_birth).toISOString().split("T")[0]

      // Calculate age
      const dob = new Date(user.date_of_birth)
      const today = new Date()
      let age = today.getFullYear() - dob.getFullYear()
      const monthDiff = today.getMonth() - dob.getMonth()
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        age--
      }
      calculatedAge = age.toString()
    }

    setSelectedBuyer(user)
    setBuyerForm({
      name: user.name || "",
      gender: user.gender || "",
      relation_type: user.relation_type || "",
      relative_name: user.relative_name || "",
      door_number: user.door_number || "",
      address_line1: user.address_line1 || "",
      address_line2: user.address_line2 || "",
      address_line3: user.address_line3 || "",
      district_id: user.district_id || "",
      taluk_id: user.taluk_id || "",
      phone: user.phone || "",
      aadhaar_number: user.aadhaar_number || "",
      pan_number: user.pan_number || "",
      pincode: user.pincode || "",
      date_of_birth: formattedDob,
      age: calculatedAge || user.age?.toString() || "",
    })
    setSearchQuery("")
    setSearchResults([])
  }

  // Handle form field changes
  const handleBuyerFormChange = (e) => {
    const { name, value } = e.target
    setBuyerForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Add this function after the handleBuyerFormChange function
  const handleDateOfBirthChange = (e) => {
    const dob = new Date(e.target.value)
    const today = new Date()
    let age = today.getFullYear() - dob.getFullYear()
    const monthDiff = today.getMonth() - dob.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--
    }

    setBuyerForm({
      ...buyerForm,
      date_of_birth: e.target.value,
      age: age.toString(),
    })
  }

  // Add buyer to the list
  const addBuyerToList = () => {
    // Basic validation
    if (!buyerForm.name) {
      toast({
        title: "தவறு",
        description: "பெயர் அவசியம் தேவை",
        variant: "destructive",
      })
      return
    }

    // Check if buyer with same Aadhaar already exists in the list
    if (buyerForm.aadhaar_number && buyersList.some((buyer) => buyer.aadhaar_number === buyerForm.aadhaar_number)) {
      toast({
        title: "தவறு",
        description: "இந்த ஆதார் எண்ணுடன் ஒரு வாங்குபவர் ஏற்கனவே சேர்க்கப்பட்டுள்ளார்",
        variant: "destructive",
      })
      return
    }

    const newBuyer = {
      ...buyerForm,
      id: selectedBuyer?.id || `temp-${Date.now()}`, // Use existing ID or generate temporary one
      isExisting: !!selectedBuyer,
    }

    setBuyersList([...buyersList, newBuyer])

    // Reset form and selected buyer
    setBuyerForm({
      name: "",
      gender: "",
      relation_type: "",
      relative_name: "",
      door_number: "",
      address_line1: "",
      address_line2: "",
      address_line3: "",
      district_id: "",
      taluk_id: "",
      phone: "",
      aadhaar_number: "",
      pan_number: "",
      pincode: "",
      date_of_birth: "",
      age: "",
    })
    setSelectedBuyer(null)

    toast({
      title: "வெற்றி",
      description: "வாங்குபவர் பட்டியலில் சேர்க்கப்பட்டார்",
    })
  }

  // Remove buyer from the list
  const removeBuyerFromList = (index) => {
    const newList = [...buyersList]
    newList.splice(index, 1)
    setBuyersList(newList)

    toast({
      title: "வெற்றி",
      description: "வாங்குபவர் பட்டியலிலிருந்து நீக்கப்பட்டார்",
    })
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-cyan-800">புதிய கிரைய ஆவணம் உருவாக்கு</h1>
        <div className="flex space-x-2">
          <Button variant="outline" asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              முகப்பு
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/document-details/sale-document">
              <ArrowLeft className="mr-2 h-4 w-4" />
              பின்செல்
            </Link>
          </Button>
        </div>
      </div>

      <Card className="bg-cyan-50 border-cyan-200">
        <CardHeader>
          <CardTitle className="text-cyan-800">கிரைய ஆவண விவரங்கள்</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="buyer" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="buyer" className="data-[state=active]:bg-cyan-100">
                <User className="mr-2 h-4 w-4" />
                வாங்குபவர் விவரங்கள்{" "}
                {buyersList.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {buyersList.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="seller" className="data-[state=active]:bg-cyan-100">
                <Users className="mr-2 h-4 w-4" />
                விற்பவர் விவரங்கள்{" "}
                {sellersList.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {sellersList.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="property" className="data-[state=active]:bg-cyan-100">
                <MapPin className="mr-2 h-4 w-4" />
                சொத்து விவரங்கள்
              </TabsTrigger>
            </TabsList>

            <TabsContent value="buyer" className="space-y-4">
              {/* Added Buyers List */}
              {buyersList.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-cyan-800 mb-2">சேர்க்கப்பட்ட வாங்குபவர்கள்</h3>
                  <ScrollArea className="h-48 border rounded-md bg-white p-2">
                    {buyersList.map((buyer, index) => (
                      <div key={index} className="flex justify-between items-center p-2 border-b">
                        <div>
                          <p className="font-medium">{buyer.name}</p>
                          <div className="text-sm text-gray-500">
                            {buyer.relation_type &&
                              `${getRelationTypeText(buyer.relation_type)} ${buyer.relative_name ? "of " + buyer.relative_name : ""} | `}
                            {buyer.phone && `📞 ${buyer.phone}`}
                            {buyer.aadhaar_number && ` | 🆔 ${buyer.aadhaar_number}`}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeBuyerFromList(index)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </ScrollArea>
                </div>
              )}

              <div className="relative mb-6">
                <div className="flex items-center border rounded-md bg-white">
                  <Search className="ml-2 h-4 w-4 text-gray-500" />
                  <Input
                    type="text"
                    placeholder="பெயர், தொலைபேசி எண் அல்லது ஆதார் எண் மூலம் தேடவும்..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border-0 focus-visible:ring-0"
                  />
                </div>

                {searchResults.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
                    {searchResults.map((user) => (
                      <div
                        key={user.id}
                        className="p-2 hover:bg-cyan-50 cursor-pointer border-b"
                        onClick={() => handleSelectUser(user)}
                      >
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-gray-500">
                          {user.phone && `📞 ${user.phone}`}
                          {user.aadhaar_number && ` | 🆔 ${user.aadhaar_number}`}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {isSearching && (
                  <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg p-2 text-center">
                    தேடுகிறது...
                  </div>
                )}
              </div>

              {selectedBuyer && (
                <div className="bg-cyan-100 p-3 rounded-md mb-4">
                  <p className="font-medium">தேர்ந்தெடுக்கப்பட்ட வாங்குபவர்: {selectedBuyer.name}</p>
                  <p className="text-sm">
                    தொலைபேசி: {selectedBuyer.phone} | ஆதார்: {selectedBuyer.aadhaar_number}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">பெயர் *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={buyerForm.name}
                    onChange={handleBuyerFormChange}
                    className="bg-white"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender">பாலினம்</Label>
                  <select
                    id="gender"
                    name="gender"
                    value={buyerForm.gender}
                    onChange={handleBuyerFormChange}
                    className="w-full p-2 rounded-md border border-gray-300 bg-white"
                  >
                    <option value="">தேர்ந்தெடுக்கவும்</option>
                    <option value="male">ஆண்</option>
                    <option value="female">பெண்</option>
                    <option value="other">மற்றவை</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date_of_birth">பிறந்த தேதி</Label>
                  <Input
                    id="date_of_birth"
                    name="date_of_birth"
                    type="date"
                    value={buyerForm.date_of_birth}
                    onChange={handleDateOfBirthChange}
                    className="bg-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="age">வயது</Label>
                  <Input id="age" name="age" value={buyerForm.age} className="bg-white" readOnly />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="relation_type">உறவு வகை</Label>
                  <select
                    id="relation_type"
                    name="relation_type"
                    value={buyerForm.relation_type}
                    onChange={handleBuyerFormChange}
                    className="w-full p-2 rounded-md border border-gray-300 bg-white"
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
                    value={buyerForm.relative_name}
                    onChange={handleBuyerFormChange}
                    className="bg-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">தொலைபேசி எண்</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={buyerForm.phone}
                    onChange={handleBuyerFormChange}
                    className="bg-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="aadhaar_number">ஆதார் எண்</Label>
                  <Input
                    id="aadhaar_number"
                    name="aadhaar_number"
                    value={buyerForm.aadhaar_number}
                    onChange={handleBuyerFormChange}
                    className="bg-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pan_number">பான் எண்</Label>
                  <Input
                    id="pan_number"
                    name="pan_number"
                    value={buyerForm.pan_number}
                    onChange={handleBuyerFormChange}
                    className="bg-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="door_number">கதவு எண்</Label>
                  <Input
                    id="door_number"
                    name="door_number"
                    value={buyerForm.door_number}
                    onChange={handleBuyerFormChange}
                    className="bg-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address_line1">முகவரி வரி 1</Label>
                  <Input
                    id="address_line1"
                    name="address_line1"
                    value={buyerForm.address_line1}
                    onChange={handleBuyerFormChange}
                    className="bg-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address_line2">முகவரி வரி 2</Label>
                  <Input
                    id="address_line2"
                    name="address_line2"
                    value={buyerForm.address_line2}
                    onChange={handleBuyerFormChange}
                    className="bg-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address_line3">முகவரி வரி 3</Label>
                  <Input
                    id="address_line3"
                    name="address_line3"
                    value={buyerForm.address_line3}
                    onChange={handleBuyerFormChange}
                    className="bg-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pincode">பின்கோடு</Label>
                  <Input
                    id="pincode"
                    name="pincode"
                    value={buyerForm.pincode}
                    onChange={handleBuyerFormChange}
                    className="bg-white"
                  />
                </div>
              </div>

              <div className="flex justify-between mt-6">
                <Button onClick={addBuyerToList} className="bg-green-600 hover:bg-green-700">
                  <Plus className="mr-2 h-4 w-4" />
                  வாங்குபவரை சேர்
                </Button>
                <Button
                  onClick={() => setActiveTab("seller")}
                  className="bg-cyan-600 hover:bg-cyan-700"
                  disabled={buyersList.length === 0}
                >
                  அடுத்து: விற்பவர் விவரங்கள்
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="seller" className="space-y-4">
              <div className="p-4 bg-cyan-100 rounded-md text-center">
                <p>விற்பவர் விவரங்கள் பகுதி - இங்கே விற்பவர் தேடல் மற்றும் படிவம் இருக்கும்</p>
                <div className="flex justify-between mt-6">
                  <Button onClick={() => setActiveTab("buyer")} variant="outline">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    பின்: வாங்குபவர் விவரங்கள்
                  </Button>
                  <Button
                    onClick={() => setActiveTab("property")}
                    className="bg-cyan-600 hover:bg-cyan-700"
                    disabled={sellersList.length === 0}
                  >
                    அடுத்து: சொத்து விவரங்கள்
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="property" className="space-y-4">
              <div className="p-4 bg-cyan-100 rounded-md text-center">
                <p>சொத்து விவரங்கள் பகுதி - இங்கே சொத்து தேடல் மற்றும் படிவம் இருக்கும்</p>
                <div className="flex justify-between mt-6">
                  <Button onClick={() => setActiveTab("seller")} variant="outline">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    பின்: விற்பவர் விவரங்கள்
                  </Button>
                  <Button
                    className="bg-cyan-600 hover:bg-cyan-700"
                    disabled={buyersList.length === 0 || sellersList.length === 0}
                  >
                    சேமி
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
