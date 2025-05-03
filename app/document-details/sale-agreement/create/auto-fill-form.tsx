"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Loader2 } from "lucide-react"
import { getSupabaseBrowserClient } from "@/lib/supabase"
import { toast } from "sonner"

// Define interfaces for data types
// User interface-ஐ மேலும் சரியாக மாற்றவும்
interface User {
  id: number
  name: string
  gender?: string
  relation_type?: string
  relative_name?: string
  phone?: string
  aadhaar_number?: string
  door_number?: string
  address_line1?: string
  address_line2?: string
  address_line3?: string
  district_id?: number | null
  taluk_id?: number | null
  pincode?: string
  date_of_birth?: string | null
  age?: number | null
  districts?: { name: string } | null
  taluks?: { name: string } | null
}

interface SubRegistrarOffice {
  id: number
  name: string
  registration_district_id: number
}

interface BookNumber {
  id: number
  number: string
}

interface Typist {
  id: number
  name: string
  phone?: string
}

interface Office {
  id: number
  name: string
  phone?: string
}

// AutoFillFormProps interface-ஐ மாற்றவும்
interface AutoFillFormProps {
  onSelectBuyer: (user: User) => void
  onSelectSeller: (user: User) => void
  onSelectWitness: (user: User) => void
  onSelectSubRegistrarOffice: (office: SubRegistrarOffice) => void
  onSelectBookNumber: (bookNumber: BookNumber) => void
  onSelectTypist: (typist: Typist) => void
  onSelectOffice: (office: Office) => void
}

export default function AutoFillForm({
  onSelectBuyer,
  onSelectSeller,
  onSelectWitness,
  onSelectSubRegistrarOffice,
  onSelectBookNumber,
  onSelectTypist,
  onSelectOffice,
}: AutoFillFormProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState<User[]>([])
  const [searchType, setSearchType] = useState<"buyer" | "seller" | "witness" | "office" | "typist" | "book">("buyer")
  const [isLoading, setIsLoading] = useState(false)
  const [subRegistrarOffices, setSubRegistrarOffices] = useState<SubRegistrarOffice[]>([])
  const [bookNumbers, setBookNumbers] = useState<BookNumber[]>([])
  const [typists, setTypists] = useState<Typist[]>([])
  const [offices, setOffices] = useState<Office[]>([])

  // Fetch reference data on component mount
  useEffect(() => {
    const fetchReferenceData = async () => {
      try {
        const supabase = getSupabaseBrowserClient()

        // Fetch sub-registrar offices
        const { data: officesData, error: officesError } = await supabase
          .from("sub_registrar_offices")
          .select("*")
          .order("name")
        if (officesError) throw officesError
        setSubRegistrarOffices(officesData || [])

        // Fetch book numbers
        const { data: bookNumbersData, error: bookNumbersError } = await supabase
          .from("book_numbers")
          .select("*")
          .order("number")
        if (bookNumbersError) throw bookNumbersError
        setBookNumbers(bookNumbersData || [])

        // Fetch typists
        const { data: typistsData, error: typistsError } = await supabase.from("typists").select("*").order("name")
        if (typistsError) throw typistsError
        setTypists(typistsData || [])

        // Fetch offices
        const { data: officesListData, error: officesListError } = await supabase
          .from("offices")
          .select("*")
          .order("name")
        if (officesListError) throw officesListError
        setOffices(officesListData || [])
      } catch (error) {
        console.error("Error fetching reference data:", error)
        toast.error("தரவுகளை பெறுவதில் பிழை ஏற்பட்டது")
      }
    }

    fetchReferenceData()
  }, [])

  // handleSearch function-ஐ மேலும் சரியாக மாற்றவும்
  const handleSearch = async () => {
    if (!searchTerm.trim() && (searchType === "buyer" || searchType === "seller" || searchType === "witness")) {
      toast.error("தேடல் சொல்லை உள்ளிடவும்")
      return
    }

    setIsLoading(true)
    try {
      const supabase = getSupabaseBrowserClient()

      if (searchType === "buyer" || searchType === "seller" || searchType === "witness") {
        // Search for users with correct field names
        const { data, error } = await supabase
          .from("users")
          .select(`
          id, name, gender, relation_type, relative_name, phone, aadhaar_number,
          door_number, address_line1, address_line2, address_line3, 
          district_id, taluk_id, pincode, date_of_birth, age,
          districts:district_id(name), taluks:taluk_id(name)
        `)
          .ilike("name", `%${searchTerm}%`)
          .order("name")
          .limit(10)

        if (error) throw error
        setSearchResults(data || [])
      }
    } catch (error) {
      console.error("Error searching:", error)
      toast.error("தேடலில் பிழை ஏற்பட்டது")
    } finally {
      setIsLoading(false)
    }
  }

  // handleSelectUser function-ஐ மாற்றவும்
  const handleSelectUser = (user: User) => {
    if (searchType === "buyer") {
      onSelectBuyer(user)
    } else if (searchType === "seller") {
      onSelectSeller(user)
    } else {
      onSelectWitness(user)
    }
    setSearchResults([])
    setSearchTerm("")
  }

  const handleSelectOffice = (office: SubRegistrarOffice) => {
    onSelectSubRegistrarOffice(office)
  }

  const handleSelectBookNumber = (bookNumber: BookNumber) => {
    onSelectBookNumber(bookNumber)
  }

  const handleSelectTypist = (typist: Typist) => {
    onSelectTypist(typist)
  }

  const handleSelectOfficeItem = (office: Office) => {
    onSelectOffice(office)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>விரைவு நிரப்புதல்</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col md:flex-row gap-2">
          <Select value={searchType} onValueChange={setSearchType}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="தேடல் வகை" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="buyer">வாங்குபவர்</SelectItem>
              <SelectItem value="seller">விற்பவர்</SelectItem>
              <SelectItem value="witness">சாட்சி</SelectItem>
              <SelectItem value="office">சார்பதிவாளர் அலுவலகம்</SelectItem>
              <SelectItem value="book">புத்தக எண்</SelectItem>
              <SelectItem value="typist">தட்டச்சாளர்</SelectItem>
            </SelectContent>
          </Select>

          {(searchType === "buyer" || searchType === "seller" || searchType === "witness") && (
            <>
              <div className="flex-1 flex gap-2">
                <Input
                  type="search"
                  placeholder="பெயரை உள்ளிடவும்"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleSearch} disabled={isLoading}>
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                  <span className="ml-2 hidden md:inline">தேடு</span>
                </Button>
              </div>
            </>
          )}

          {searchType === "office" && (
            <Select
              onValueChange={(value) => {
                const office = subRegistrarOffices.find((o) => o.id.toString() === value)
                if (office) handleSelectOffice(office)
              }}
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="சார்பதிவாளர் அலுவலகத்தைத் தேர்ந்தெடுக்கவும்" />
              </SelectTrigger>
              <SelectContent>
                {subRegistrarOffices.map((office) => (
                  <SelectItem key={office.id} value={office.id.toString()}>
                    {office.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {searchType === "book" && (
            <Select
              onValueChange={(value) => {
                const book = bookNumbers.find((b) => b.id.toString() === value)
                if (book) handleSelectBookNumber(book)
              }}
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="புத்தக எண்ணைத் தேர்ந்தெடுக்கவும்" />
              </SelectTrigger>
              <SelectContent>
                {bookNumbers.map((book) => (
                  <SelectItem key={book.id} value={book.id.toString()}>
                    {book.number}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {searchType === "typist" && (
            <Select
              onValueChange={(value) => {
                const typist = typists.find((t) => t.id.toString() === value)
                if (typist) handleSelectTypist(typist)
              }}
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="தட்டச்சாளரைத் தேர்ந்தெடுக்கவும்" />
              </SelectTrigger>
              <SelectContent>
                {typists.map((typist) => (
                  <SelectItem key={typist.id} value={typist.id.toString()}>
                    {typist.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        {searchResults.length > 0 && (
          <div className="space-y-2 border rounded-md p-2">
            <p className="text-sm text-muted-foreground mb-2">தேடல் முடிவுகள்:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {searchResults.map((user) => (
                <Button
                  key={user.id}
                  variant="outline"
                  className="justify-start overflow-hidden text-ellipsis whitespace-nowrap"
                  onClick={() => handleSelectUser(user)}
                >
                  {user.name}
                </Button>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
