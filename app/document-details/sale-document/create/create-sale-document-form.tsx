"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase"
import { toast } from "sonner"
import { numToTamilWords } from "@/lib/number-to-words"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Printer, FileDown, Search, Plus, X, Check } from "lucide-react"

// Basic types for our entities
interface SubRegistrarOffice {
  id: number
  name: string
}

interface BookNumber {
  id: number
  number: string
}

interface DocumentType {
  id: number
  name: string
}

interface SubmissionType {
  id: number
  name: string
}

interface Typist {
  id: number
  name: string
  phone: string | null
}

interface Office {
  id: number
  name: string
}

interface UserType {
  id: number
  name: string
  gender: string
  relation_type: string
  relative_name: string
  phone: string
  aadhaar_number: string
  door_number: string // கதவு எண்
  address_line1: string // முகவரி வரி 1
  address_line2: string // முகவரி வரி 2
  address_line3: string // முகவரி வரி 3
  district_id: number | null
  taluk_id: number | null
  pincode: string // அஞ்சல் குறியீடு
  date_of_birth?: string | null
  age?: number | null
  // district மற்றும் taluk நேரடியாக இல்லை, அவற்றை நாம் districts மற்றும் taluks அட்டவணைகளிலிருந்து பெற வேண்டும்
  districts?: { name: string } | null
  taluks?: { name: string } | null
}

interface LandType {
  id: number
  name: string
}

interface ValueType {
  id: number
  name: string
}

interface PaymentMethod {
  id: number
  name: string
}

interface Property {
  id: number
  property_name: string
  survey_number: string | null
  guide_value_sqm: number | null
  guide_value_sqft: number | null
  property_details: string | null
  registration_district_id: number | null
  sub_registrar_office_id: number | null
  district_id: number | null
  taluk_id: number | null
  village_id: number | null
  registration_districts?: { name: string } | null
  sub_registrar_offices?: { name: string } | null
  districts?: { name: string } | null
  taluks?: { name: string } | null
  villages?: { name: string } | null
}

interface District {
  id: number
  name: string
}

interface Taluk {
  id: number
  name: string
  district_id: number
}

interface Village {
  id: number
  name: string
  taluk_id: number
}

// அச்சிடும் போது பட்டன்கள் மறைவதற்கான CSS ஸ்டைல்கள்
const printStyles = `
  @media print {
    button, .no-print {
      display: none !important;
    }
    .print-only {
      display: block !important;
    }
    body, html {
      width: 210mm;
      height: 297mm;
      margin: 0;
      padding: 0;
    }
    .document-content {
      padding: 10mm;
    }
  }
`

export function CreateSaleDocumentForm() {
  // அடிப்படை விவரங்கள் - பிரிவு 1
  const [documentDate, setDocumentDate] = useState("")
  const [saleAmount, setSaleAmount] = useState("")
  const [saleAmountWords, setSaleAmountWords] = useState("")

  // முந்தைய ஆவணம் விவரங்கள் - பிரிவு 2
  const [previousDocumentDate, setPreviousDocumentDate] = useState("")
  const [subRegistrarOfficeId, setSubRegistrarOfficeId] = useState("")
  const [bookNumberId, setBookNumberId] = useState("")
  const [documentYear, setDocumentYear] = useState("")
  const [documentNumber, setDocumentNumber] = useState("")
  const [documentTypeId, setDocumentTypeId] = useState("")
  const [submissionTypeId, setSubmissionTypeId] = useState("")

  // தட்டச்சு விவரங்கள் - பிரிவு 3
  const [typistId, setTypistId] = useState("")
  const [typistPhone, setTypistPhone] = useState("")
  const [officeId, setOfficeId] = useState("")

  // எழுதிவாங்குபவர்கள் விவரங்கள்
  const [buyers, setBuyers] = useState<UserType[]>([])
  const [selectedBuyerId, setSelectedBuyerId] = useState<number | null>(null)
  const [buyerSearchTerm, setBuyerSearchTerm] = useState("")
  const [buyerSearchBy, setBuyerSearchBy] = useState<"name" | "phone" | "aadhaar_number">("name")
  const [buyerSearchResults, setBuyerSearchResults] = useState<UserType[]>([]) // Separate state for buyer search results

  // எழுதிகொடுப்பவர்கள் விவரங்கள்
  const [sellers, setSellers] = useState<UserType[]>([])
  const [selectedSellerId, setSelectedSellerId] = useState<number | null>(null)
  const [sellerSearchTerm, setSellerSearchTerm] = useState("")
  const [sellerSearchBy, setSellerSearchBy] = useState<"name" | "phone" | "aadhaar_number">("name")
  const [sellerSearchResults, setSellerSearchResults] = useState<UserType[]>([]) // Separate state for seller search results

  // சாட்சிகள் விவரங்கள்
  const [witnesses, setWitnesses] = useState<UserType[]>([])
  const [selectedWitnessId, setSelectedWitnessId] = useState<number | null>(null)
  const [witnessSearchTerm, setWitnessSearchTerm] = useState("")
  const [witnessSearchBy, setWitnessSearchBy] = useState<"name" | "phone" | "aadhaar_number">("name")
  const [witnessSearchResults, setWitnessSearchResults] = useState<UserType[]>([]) // Separate state for witness search results

  // சொத்து விவரங்கள்
  const [selectedLandTypes, setSelectedLandTypes] = useState<string[]>([])
  const [selectedValueTypes, setSelectedValueTypes] = useState<string[]>([])

  // புதிய சொத்து விவரங்கள்
  const [propertySearchTerm, setPropertySearchTerm] = useState("")
  const [propertySearchResults, setPropertySearchResults] = useState<Property[]>([])
  const [selectedProperties, setSelectedProperties] = useState<Property[]>([])

  // புதிய சொத்து விவரங்கள் - புதிய சொத்து சேர்க்க
  const [showNewPropertyForm, setShowNewPropertyForm] = useState(false)
  const [newPropertyName, setNewPropertyName] = useState("")
  const [newPropertySurveyNumber, setNewPropertySurveyNumber] = useState("")
  const [newPropertyArea, setNewPropertyArea] = useState("")
  const [newPropertyAreaUnit, setNewPropertyAreaUnit] = useState<"sqft" | "sqm">("sqft")
  const [newPropertyRegistrationDistrictId, setNewPropertyRegistrationDistrictId] = useState("")
  const [newPropertySubRegistrarOfficeId, setNewPropertySubRegistrarOfficeId] = useState("")
  const [newPropertyDistrictId, setNewPropertyDistrictId] = useState("")
  const [newPropertyTalukId, setNewPropertyTalukId] = useState("")
  const [newPropertyVillageId, setNewPropertyVillageId] = useState("")
  const [newPropertyDetails, setNewPropertyDetails] = useState("")
  const [newPropertyGuideValueSqft, setNewPropertyGuideValueSqft] = useState("")
  const [newPropertyGuideValueSqm, setNewPropertyGuideValueSqm] = useState("")

  // தொகை செலுத்தும் விவரங்கள்
  const [selectedPaymentMethods, setSelectedPaymentMethods] = useState<string[]>([])

  // Reference data stores
  const [subRegistrarOffices, setSubRegistrarOffices] = useState<SubRegistrarOffice[]>([])
  const [bookNumbers, setBookNumbers] = useState<BookNumber[]>([])
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([])
  const [submissionTypes, setSubmissionTypes] = useState<SubmissionType[]>([])
  const [typists, setTypists] = useState<Typist[]>([])
  const [offices, setOffices] = useState<Office[]>([])
  const [landTypes, setLandTypes] = useState<LandType[]>([])
  const [valueTypes, setValueTypes] = useState<ValueType[]>([])
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [districts, setDistricts] = useState<District[]>([])
  const [taluks, setTaluks] = useState<Taluk[]>([])
  const [villages, setVillages] = useState<Village[]>([])
  const [filteredTaluks, setFilteredTaluks] = useState<Taluk[]>([])
  const [filteredVillages, setFilteredVillages] = useState<Village[]>([])

  // State for tracking the current search mode
  const [currentSearchMode, setCurrentSearchMode] = useState<"buyer" | "seller" | "witness">("buyer")

  // State for tracking form sections
  const [activeTab, setActiveTab] = useState("section1")

  // சொத்து தேடுதல் வடிகட்டிகள்
  const [showPropertyFilters, setShowPropertyFilters] = useState(false)
  const [propertyFilterRegistrationDistrictId, setPropertyFilterRegistrationDistrictId] = useState("")
  const [propertyFilterSubRegistrarOfficeId, setPropertyFilterSubRegistrarOfficeId] = useState("")
  const [propertyFilterDistrictId, setPropertyFilterDistrictId] = useState("")
  const [propertyFilterTalukId, setPropertyFilterTalukId] = useState("")
  const [propertyFilterVillageId, setPropertyFilterVillageId] = useState("")
  const [filteredPropertySubRegistrarOffices, setFilteredPropertySubRegistrarOffices] = useState<SubRegistrarOffice[]>(
    [],
  )
  const [filteredPropertyTaluks, setFilteredPropertyTaluks] = useState<Taluk[]>([])
  const [filteredPropertyVillages, setFilteredPropertyVillages] = useState<Village[]>([])

  const supabase = getSupabaseBrowserClient()

  // Format date from DD/MM/YYYY to YYYY-MM-DD for database
  const formatDateForDB = (dateString: string) => {
    if (!dateString) return null
    const [day, month, year] = dateString.split("/")
    return `${year}-${month}-${day}`
  }

  // Format date from YYYY-MM-DD to DD/MM/YYYY for display
  const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(
      2,
      "0",
    )}/${date.getFullYear()}`
  }

  // Load all reference data on component mount
  useEffect(() => {
    fetchSubRegistrarOffices()
    fetchBookNumbers()
    fetchDocumentTypes()
    fetchSubmissionTypes()
    fetchTypists()
    fetchOffices()
    fetchLandTypes()
    fetchValueTypes()
    fetchPaymentMethods()
    fetchDistricts()
    fetchTaluks()
    fetchVillages()
  }, [])

  // Convert sale amount to words when it changes
  useEffect(() => {
    if (saleAmount) {
      const amount = Number.parseFloat(saleAmount)
      if (!isNaN(amount)) {
        setSaleAmountWords(numToTamilWords(amount))
      } else {
        setSaleAmountWords("")
      }
    } else {
      setSaleAmountWords("")
    }
  }, [saleAmount])

  // Update typist phone when typist changes
  useEffect(() => {
    if (typistId) {
      const selectedTypist = typists.find((t) => t.id.toString() === typistId)
      setTypistPhone(selectedTypist?.phone || "")
    } else {
      setTypistPhone("")
    }
  }, [typistId, typists])

  // Filter taluks when district changes
  useEffect(() => {
    if (newPropertyDistrictId) {
      const districtId = Number.parseInt(newPropertyDistrictId)
      const filtered = taluks.filter((taluk) => taluk.district_id === districtId)
      setFilteredTaluks(filtered)
    } else {
      setFilteredTaluks([])
    }
    setNewPropertyTalukId("")
    setNewPropertyVillageId("")
    setFilteredVillages([])
  }, [newPropertyDistrictId, taluks])

  // Filter villages when taluk changes
  useEffect(() => {
    if (newPropertyTalukId) {
      const talukId = Number.parseInt(newPropertyTalukId)
      const filtered = villages.filter((village) => village.taluk_id === talukId)
      setFilteredVillages(filtered)
    } else {
      setFilteredVillages([])
    }
    setNewPropertyVillageId("")
  }, [newPropertyTalukId, villages])

  // Fetch reference data functions
  const fetchSubRegistrarOffices = async () => {
    try {
      const { data, error } = await supabase.from("sub_registrar_offices").select("*").order("name")
      if (error) throw error
      setSubRegistrarOffices(data || [])
    } catch (error: any) {
      toast.error("சார்பதிவாளர் அலுவலகங்களை பெறுவதில் பிழை: " + error.message)
    }
  }

  const fetchBookNumbers = async () => {
    try {
      const { data, error } = await supabase.from("book_numbers").select("*").order("number")
      if (error) throw error
      setBookNumbers(data || [])
    } catch (error: any) {
      toast.error("புத்தக எண்களை பெறுவதில் பிழை: " + error.message)
    }
  }

  const fetchDocumentTypes = async () => {
    try {
      const { data, error } = await supabase.from("document_types").select("*").order("name")
      if (error) throw error
      setDocumentTypes(data || [])
    } catch (error: any) {
      toast.error("ஆவணத்தின் வகைகளை பெறுவதில் பிழை: " + error.message)
    }
  }

  const fetchSubmissionTypes = async () => {
    try {
      const { data, error } = await supabase.from("submission_types").select("*").order("name")
      if (error) throw error
      setSubmissionTypes(data || [])
    } catch (error: any) {
      toast.error("ஆவணம் ஒப்படைப்பு வகைகளை பெறுவதில் பிழை: " + error.message)
    }
  }

  const fetchTypists = async () => {
    try {
      const { data, error } = await supabase.from("typists").select("*").order("name")
      if (error) throw error
      setTypists(data || [])
    } catch (error: any) {
      toast.error("தட்டச்சாளர்களை பெறுவதில் பிழை: " + error.message)
    }
  }

  const fetchOffices = async () => {
    try {
      const { data, error } = await supabase.from("offices").select("*").order("name")
      if (error) throw error
      setOffices(data || [])
    } catch (error: any) {
      toast.error("அலுவலகங்களை பெறுவதில் பிழை: " + error.message)
    }
  }

  const fetchLandTypes = async () => {
    try {
      const { data, error } = await supabase.from("land_types").select("*").order("name")
      if (error) throw error
      setLandTypes(data || [])
    } catch (error: any) {
      toast.error("நில வகைகளை பெறுவதில் பிழை: " + error.message)
    }
  }

  const fetchValueTypes = async () => {
    try {
      const { data, error } = await supabase.from("value_types").select("*").order("name")
      if (error) throw error
      setValueTypes(data || [])
    } catch (error: any) {
      toast.error("மதிப்பு வகைகளை பெறுவதில் பிழை: " + error.message)
    }
  }

  const fetchPaymentMethods = async () => {
    try {
      const { data, error } = await supabase.from("payment_methods").select("*").order("name")
      if (error) throw error
      setPaymentMethods(data || [])
    } catch (error: any) {
      toast.error("பணம் செலுத்தும் முறைகளை பெறுவதில் பிழை: " + error.message)
    }
  }

  const fetchDistricts = async () => {
    try {
      const { data, error } = await supabase.from("districts").select("*").order("name")
      if (error) throw error
      setDistricts(data || [])
    } catch (error: any) {
      toast.error("மாவட்டங்களை பெறுவதில் பிழை: " + error.message)
    }
  }

  const fetchTaluks = async () => {
    try {
      const { data, error } = await supabase.from("taluks").select("*").order("name")
      if (error) throw error
      setTaluks(data || [])
    } catch (error: any) {
      toast.error("வட்டங்களை பெறுவதில் பிழை: " + error.message)
    }
  }

  const fetchVillages = async () => {
    try {
      const { data, error } = await supabase.from("villages").select("*").order("name")
      if (error) throw error
      setVillages(data || [])
    } catch (error: any) {
      toast.error("கிராமங்களை பெறுவதில் பிழை: " + error.message)
    }
  }

  // சொத்து தேடுதல் வடிகட்டிகளுக்கான useEffect
  useEffect(() => {
    if (propertyFilterRegistrationDistrictId && propertyFilterRegistrationDistrictId !== "all") {
      const filtered = subRegistrarOffices.filter(
        (office) => office.id.toString() === propertyFilterRegistrationDistrictId,
      )
      setFilteredPropertySubRegistrarOffices(filtered)
    } else {
      setFilteredPropertySubRegistrarOffices([])
    }
    setPropertyFilterSubRegistrarOfficeId("")
  }, [propertyFilterRegistrationDistrictId, subRegistrarOffices])

  useEffect(() => {
    if (propertyFilterDistrictId && propertyFilterDistrictId !== "all") {
      const filtered = taluks.filter((taluk) => taluk.district_id === Number.parseInt(propertyFilterDistrictId))
      setFilteredPropertyTaluks(filtered)
    } else {
      setFilteredPropertyTaluks([])
    }
    setPropertyFilterTalukId("")
    setPropertyFilterVillageId("")
  }, [propertyFilterDistrictId, taluks])

  useEffect(() => {
    if (propertyFilterTalukId && propertyFilterTalukId !== "all") {
      const filtered = villages.filter((village) => village.taluk_id === Number.parseInt(propertyFilterTalukId))
      setFilteredPropertyVillages(filtered)
    } else {
      setFilteredPropertyVillages([])
    }
    setPropertyFilterVillageId("")
  }, [propertyFilterTalukId, villages])

  // உறவு முறையை பாலினத்தைப் பொறுத்து மாற்றும் செயல்பாடு
  const getFormattedRelationType = (user: UserType, isWitness = false): string => {
    // சாட்சிகளுக்கு மாற்றம் வேண்டாம்
    if (isWitness) {
      return user.relation_type
    }

    // பாலினத்தைப் பொறுத்து உறவு முறையை மாற்றுதல்
    if (user.gender === "male" && user.relation_type === "த/பெ") {
      return "மகனுமான"
    } else if (user.gender === "female") {
      if (user.relation_type === "த/பெ") {
        return "மகளுமான"
      } else if (user.relation_type === "க/பெ") {
        return "மனைவியுமான"
      }
    }

    // மற்ற உறவு முறைகளுக்கு அப்படியே திருப்பி அனுப்புதல்
    return user.relation_type
  }

  // Calculate age from date of birth
  const calculateAge = (birthDateStr: string): number => {
    const birthDate = new Date(birthDateStr)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }

    return age
  }

  // Search for users based on search criteria
  const searchUsers = useCallback(
    async (searchTerm: string, searchBy: string, searchMode: "buyer" | "seller" | "witness") => {
      if (!searchTerm.trim()) {
        switch (searchMode) {
          case "buyer":
            setBuyerSearchResults([])
            break
          case "seller":
            setSellerSearchResults([])
            break
          case "witness":
            setWitnessSearchResults([])
            break
        }
        return
      }

      try {
        console.log(`Searching for ${searchMode} with ${searchBy}: ${searchTerm}`)
        const { data, error } = await supabase
          .from("users")
          .select(`
            id, name, gender, relation_type, relative_name, phone, aadhaar_number,
            door_number, address_line1, address_line2, address_line3, 
            district_id, taluk_id, pincode, date_of_birth,
            districts:district_id(name), taluks:taluk_id(name)
          `)
          .ilike(searchBy, `%${searchTerm}%`)
          .limit(10)

        if (error) throw error

        console.log("Search results:", data)

        // Format the data and calculate age if date_of_birth exists
        const formattedData =
          data?.map((user) => ({
            ...user,
            // Calculate age if date_of_birth exists
            age: user.date_of_birth ? calculateAge(user.date_of_birth) : null,
          })) || []

        switch (searchMode) {
          case "buyer":
            setBuyerSearchResults(formattedData)
            break
          case "seller":
            setSellerSearchResults(formattedData)
            break
          case "witness":
            setWitnessSearchResults(formattedData)
            break
        }
      } catch (error: any) {
        console.error("Error searching users:", error)
        toast.error("பயனாளர்களை தேடுவதில் பிழை: " + error.message)
      }
    },
    [supabase],
  )

  // Search for properties
  const searchProperties = async () => {
    try {
      let query = supabase
        .from("properties")
        .select(`
          *,
          registration_districts:registration_district_id (name),
          sub_registrar_offices:sub_registrar_office_id (name),
          districts:district_id (name),
          taluks:taluk_id (name),
          villages:village_id (name)
        `)
        .order("property_name")

      // தேடுதல் சொல் இருந்தால் மட்டும் பயன்படுத்து
      if (propertySearchTerm.trim()) {
        query = query.ilike("property_name", `%${propertySearchTerm}%`)
      }

      // வடிகட்டிகள் இருந்தால் பயன்படுத்து
      if (propertyFilterRegistrationDistrictId && propertyFilterRegistrationDistrictId !== "all") {
        query = query.eq("registration_district_id", Number.parseInt(propertyFilterRegistrationDistrictId))
      }

      if (propertyFilterSubRegistrarOfficeId && propertyFilterSubRegistrarOfficeId !== "all") {
        query = query.eq("sub_registrar_office_id", Number.parseInt(propertyFilterSubRegistrarOfficeId))
      }

      if (propertyFilterDistrictId && propertyFilterDistrictId !== "all") {
        query = query.eq("district_id", Number.parseInt(propertyFilterDistrictId))
      }

      if (propertyFilterTalukId && propertyFilterTalukId !== "all") {
        query = query.eq("taluk_id", Number.parseInt(propertyFilterTalukId))
      }

      if (propertyFilterVillageId && propertyFilterVillageId !== "all") {
        query = query.eq("village_id", Number.parseInt(propertyFilterVillageId))
      }

      const { data, error } = await query.limit(20)

      if (error) throw error

      // சொத்து விவரங்களை முழுமையாக பெறுதல்
      const formattedData =
        data?.map((property) => ({
          ...property,
          // சொத்து விவரங்களை முழுமையாக காட்ட தேவையான தகவல்களை உறுதிசெய்தல்
          property_details: property.property_details || "",
          survey_number: property.survey_number || "",
          guide_value_sqft: property.guide_value_sqft || 0,
          guide_value_sqm: property.guide_value_sqm || 0,
        })) || []

      setPropertySearchResults(formattedData)

      if (formattedData.length === 0) {
        toast.info("தேடலுக்கு பொருத்தமான சொத்துக்கள் எதுவும் கிடைக்கவில்லை")
      }
    } catch (error: any) {
      toast.error("சொத்துக்களை தேடுவதில் பிழை: " + error.message)
    }
  }

  // Handle property selection
  const handlePropertySelect = (property: Property) => {
    if (!selectedProperties.some((p) => p.id === property.id)) {
      setSelectedProperties([...selectedProperties, property])
    }
    setPropertySearchTerm("")
    setPropertySearchResults([])
  }

  // Handle property removal
  const removeProperty = (id: number) => {
    setSelectedProperties(selectedProperties.filter((p) => p.id !== id))
  }

  // Handle new property submission
  const handleNewPropertySubmit = async () => {
    if (!newPropertyName.trim()) {
      toast.error("சொத்தின் பெயரை உள்ளிடவும்")
      return
    }

    try {
      const propertyData = {
        property_name: newPropertyName,
        survey_number: newPropertySurveyNumber || null,
        guide_value_sqm: newPropertyGuideValueSqm ? Number.parseFloat(newPropertyGuideValueSqm) : null,
        guide_value_sqft: newPropertyGuideValueSqft ? Number.parseFloat(newPropertyGuideValueSqft) : null,
        property_details: newPropertyDetails || null,
        registration_district_id: newPropertyRegistrationDistrictId
          ? Number.parseInt(newPropertyRegistrationDistrictId)
          : null,
        sub_registrar_office_id: newPropertySubRegistrarOfficeId
          ? Number.parseInt(newPropertySubRegistrarOfficeId)
          : null,
        district_id: newPropertyDistrictId ? Number.parseInt(newPropertyDistrictId) : null,
        taluk_id: newPropertyTalukId ? Number.parseInt(newPropertyTalukId) : null,
        village_id: newPropertyVillageId ? Number.parseInt(newPropertyVillageId) : null,
      }

      const { data, error } = await supabase
        .from("properties")
        .insert([propertyData])
        .select(`
          *,
          registration_districts:registration_district_id (name),
          sub_registrar_offices:sub_registrar_office_id (name),
          districts:district_id (name),
          taluks:taluk_id (name),
          villages:village_id (name)
        `)

      if (error) throw error

      if (data && data.length > 0) {
        setSelectedProperties([...selectedProperties, data[0]])
        toast.success("புதிய சொத்து வெற்றிகரமாக சேர்க்கப்பட்டது")
        resetNewPropertyForm()
      }
    } catch (error: any) {
      toast.error("சொத்தை சேர்ப்பதில் பிழை: " + error.message)
    }
  }

  // Reset new property form
  const resetNewPropertyForm = () => {
    setNewPropertyName("")
    setNewPropertySurveyNumber("")
    setNewPropertyArea("")
    setNewPropertyAreaUnit("sqft")
    setNewPropertyRegistrationDistrictId("")
    setNewPropertySubRegistrarOfficeId("")
    setNewPropertyDistrictId("")
    setNewPropertyTalukId("")
    setNewPropertyVillageId("")
    setNewPropertyDetails("")
    setNewPropertyGuideValueSqft("")
    setNewPropertyGuideValueSqm("")
    setShowNewPropertyForm(false)
  }

  // Handle user selection
  const handleUserSelect = (user: UserType) => {
    console.log("Selected user:", user)
    console.log("Current search mode:", currentSearchMode)

    if (currentSearchMode === "buyer") {
      if (!buyers.some((b) => b.id === user.id)) {
        console.log("Adding user to buyers list")
        setBuyers([...buyers, user])
      }
      setSelectedBuyerId(user.id)
      setBuyerSearchTerm("")
      setBuyerSearchResults([]) // Clear buyer search results after selection
    } else if (currentSearchMode === "seller") {
      if (!sellers.some((s) => s.id === user.id)) {
        console.log("Adding user to sellers list")
        setSellers([...sellers, user])
      }
      setSelectedSellerId(user.id)
      setSellerSearchTerm("")
      setSellerSearchResults([]) // Clear seller search results after selection
    } else if (currentSearchMode === "witness") {
      if (!witnesses.some((w) => w.id === user.id)) {
        console.log("Adding user to witnesses list")
        setWitnesses([...witnesses, user])
      }
      setSelectedWitnessId(user.id)
      setWitnessSearchTerm("")
      setWitnessSearchResults([]) // Clear witness search results after selection
    }
  }

  // Handle removal of users from lists
  const removeUser = (id: number, type: "buyer" | "seller" | "witness") => {
    if (type === "buyer") {
      setBuyers(buyers.filter((b) => b.id !== id))
      if (selectedBuyerId === id) setSelectedBuyerId(null)
    } else if (type === "seller") {
      setSellers(sellers.filter((s) => s.id !== id))
      if (selectedSellerId === id) setSelectedSellerId(null)
    } else if (type === "witness") {
      setWitnesses(witnesses.filter((w) => w.id !== id))
      if (selectedWitnessId === id) setSelectedWitnessId(null)
    }
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Implementation for saving the document will go here
    toast.success("கிரைய ஆவணம் வெற்றிகரமாக சேமிக்கப்பட்டது")
  }

  // Handle buyer search
  const handleBuyerSearch = (e: React.MouseEvent) => {
    e.preventDefault()
    console.log("Searching for buyer:", buyerSearchTerm, buyerSearchBy)
    setCurrentSearchMode("buyer")
    searchUsers(buyerSearchTerm, buyerSearchBy, "buyer") // Pass searchMode
  }

  // Handle seller search
  const handleSellerSearch = (e: React.MouseEvent) => {
    e.preventDefault()
    console.log("Searching for seller:", sellerSearchTerm, sellerSearchBy)
    setCurrentSearchMode("seller")
    searchUsers(sellerSearchTerm, sellerSearchBy, "seller") // Pass searchMode
  }

  // Handle witness search
  const handleWitnessSearch = (e: React.MouseEvent) => {
    e.preventDefault()
    console.log("Searching for witness:", witnessSearchTerm, witnessSearchBy)
    setCurrentSearchMode("witness")
    searchUsers(witnessSearchTerm, witnessSearchBy, "witness") // Pass searchMode
  }

  // Handle property search
  const handlePropertySearch = (e: React.MouseEvent) => {
    e.preventDefault()
    setShowPropertyFilters(true)
    searchProperties()
  }

  // Handle land type checkbox change
  const handleLandTypeChange = (id: string) => {
    setSelectedLandTypes((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id)
      } else {
        return [...prev, id]
      }
    })
  }

  // Handle value type checkbox change
  const handleValueTypeChange = (id: string) => {
    setSelectedValueTypes((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id)
      } else {
        return [...prev, id]
      }
    })
  }

  // Handle payment method checkbox change
  const handlePaymentMethodChange = (id: string) => {
    setSelectedPaymentMethods((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id)
      } else {
        return [...prev, id]
      }
    })
  }

  // Get a user's full name with relation
  const getUserFullName = (user: UserType) => {
    return `${user.name}, ${user.relation_type} ${user.relative_name}`
  }

  // Preview component to show the current document details
  const DocumentPreview = () => {
    // Format date for display
    const formatDate = (dateString: string, useTamilMonth = false) => {
      if (!dateString) return { day: "", month: "", year: "" }
      const [day, month, year] = dateString.split("/")

      // Tamil month names
      const tamilMonths = [
        "ஜனவரி",
        "பிப்ரவரி",
        "மார்ச்",
        "ஏப்ரல்",
        "மே",
        "ஜூன்",
        "ஜூலை",
        "ஆகஸ்ட்",
        "செப்டம்பர்",
        "அக்டோபர்",
        "நவம்பர்",
        "டிசம்பர்",
      ]

      if (useTamilMonth) {
        const monthIndex = Number.parseInt(month) - 1
        return { day, month: tamilMonths[monthIndex], year }
      }

      return { day, month, year }
    }

    const formattedDocumentDate = formatDate(documentDate, true)
    const formattedPreviousDocumentDate = formatDate(previousDocumentDate)

    // Get selected document type name
    const getDocumentTypeName = () => {
      const selectedType = documentTypes.find((type) => type.id.toString() === documentTypeId)
      return selectedType ? selectedType.name : ""
    }

    // Get selected submission type name
    const getSubmissionTypeName = () => {
      const selectedType = submissionTypes.find((type) => type.id.toString() === submissionTypeId)
      return selectedType ? selectedType.name : ""
    }

    // Get selected book number
    const getBookNumber = () => {
      const selectedBook = bookNumbers.find((book) => book.id.toString() === bookNumberId)
      return selectedBook ? selectedBook.number : ""
    }

    // Get selected sub-registrar office name
    const getSubRegistrarOfficeName = () => {
      const selectedOffice = subRegistrarOffices.find((office) => office.id.toString() === subRegistrarOfficeId)
      return selectedOffice ? selectedOffice.name : ""
    }

    return (
      <div className="bg-white p-6 rounded-lg border border-cyan-200 shadow-sm">
        <style>{printStyles}</style>
        <div className="document-content">
          <div className="flex justify-between mb-6">
            <h2 className="text-2xl font-bold text-cyan-800">கிரைய ஆவணம் முன்னோட்டம்</h2>
            <div className="flex gap-2 no-print">
              <Button onClick={() => window.print()} className="bg-cyan-600 hover:bg-cyan-700 text-white">
                <Printer className="h-4 w-4 mr-2" />
                அச்சிடு
              </Button>
              <Button
                onClick={() => {
                  // PDF ஏற்றுமதி செயல்பாடு
                  toast.success("PDF ஏற்றுமதி வெற்றிகரமாக முடிந்தது")
                }}
                className="bg-cyan-600 hover:bg-cyan-700 text-white"
              >
                <FileDown className="h-4 w-4 mr-2" />
                PDF ஏற்றுமதி
              </Button>
            </div>
          </div>

          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">கிரைய ஆவணம்</h1>
            <p className="text-lg">
              {formattedDocumentDate.day} {formattedDocumentDate.month} {formattedDocumentDate.year}
            </p>
          </div>

          {/* முந்தைய ஆவணம் விவரங்கள் */}
          {previousDocumentDate && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">முந்தைய ஆவணம் விவரங்கள்</h3>
              <p>
                தேதி: {formattedPreviousDocumentDate.day}/{formattedPreviousDocumentDate.month}/
                {formattedPreviousDocumentDate.year}, புத்தக எண்: {getBookNumber()}, ஆவண எண்: {documentNumber}/
                {documentYear}, ஆவண வகை: {getDocumentTypeName()}, சார்பதிவாளர் அலுவலகம்: {getSubRegistrarOfficeName()},
                ஒப்படைப்பு வகை: {getSubmissionTypeName()}
              </p>
            </div>
          )}

          {/* விற்பனை தொகை */}
          {saleAmount && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">விற்பனை தொகை</h3>
              <p>
                ரூபாய் {saleAmount} ({saleAmountWords})
              </p>
            </div>
          )}

          {/* எழுதிகொடுப்பவர்கள் விவரங்கள் */}
          {sellers.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">எழுதிகொடுப்பவர்கள் விவரங்கள்</h3>
              <ol className="list-decimal pl-5">
                {sellers.map((seller, index) => (
                  <li key={seller.id} className="mb-2">
                    <p>
                      <strong>{seller.name}</strong>, {getFormattedRelationType(seller)} {seller.relative_name},{" "}
                      {seller.door_number && `கதவு எண் ${seller.door_number},`} {seller.address_line1},{" "}
                      {seller.address_line2 && `${seller.address_line2},`}{" "}
                      {seller.address_line3 && `${seller.address_line3},`}{" "}
                      {seller.districts?.name && `${seller.districts.name} மாவட்டம்,`}{" "}
                      {seller.taluks?.name && `${seller.taluks.name} வட்டம்,`}{" "}
                      {seller.pincode && `அஞ்சல் குறியீடு: ${seller.pincode}`}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* எழுதிவாங்குபவர்கள் விவரங்கள் */}
          {buyers.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">எழுதிவாங்குபவர்கள் விவரங்கள்</h3>
              <ol className="list-decimal pl-5">
                {buyers.map((buyer, index) => (
                  <li key={buyer.id} className="mb-2">
                    <p>
                      <strong>{buyer.name}</strong>, {getFormattedRelationType(buyer)} {buyer.relative_name},{" "}
                      {buyer.door_number && `கதவு எண் ${buyer.door_number},`} {buyer.address_line1},{" "}
                      {buyer.address_line2 && `${buyer.address_line2},`}{" "}
                      {buyer.address_line3 && `${buyer.address_line3},`}{" "}
                      {buyer.districts?.name && `${buyer.districts.name} மாவட்டம்,`}{" "}
                      {buyer.taluks?.name && `${buyer.taluks.name} வட்டம்,`}{" "}
                      {buyer.pincode && `அஞ்சல் குறியீடு: ${buyer.pincode}`}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* சொத்து விவரங்கள் */}
          {selectedProperties.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">சொத்து விவரங்கள்</h3>
              <ol className="list-decimal pl-5">
                {selectedProperties.map((property, index) => (
                  <li key={property.id} className="mb-2">
                    <p>
                      <strong>{property.property_name}</strong>
                      <br />
                      {property.property_details && (
                        <span>
                          {property.property_details}
                          <br />
                        </span>
                      )}
                      {property.guide_value_sqft > 0 && (
                        <span>வழிகாட்டு மதிப்பு: ரூ. {property.guide_value_sqft}/சதுர அடி</span>
                      )}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* சாட்சிகள் விவரங்கள் */}
          {witnesses.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">சாட்சிகள் விவரங்கள்</h3>
              <ol className="list-decimal pl-5">
                {witnesses.map((witness, index) => (
                  <li key={witness.id} className="mb-2">
                    <p>
                      <strong>{witness.name}</strong>, {witness.relation_type} {witness.relative_name},{" "}
                      {witness.door_number && `கதவு எண் ${witness.door_number},`} {witness.address_line1},{" "}
                      {witness.address_line2 && `${witness.address_line2},`}{" "}
                      {witness.address_line3 && `${witness.address_line3},`}{" "}
                      {witness.districts?.name && `${witness.districts.name} மாவட்டம்,`}{" "}
                      {witness.taluks?.name && `${witness.taluks.name} வட்டம்,`}{" "}
                      {witness.pincode && `அஞ்சல் குறியீடு: ${witness.pincode}`}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* தட்டச்சு விவரங்கள் */}
          {typistId && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">தட்டச்சு விவரங்கள்</h3>
              <p>
                தட்டச்சாளர்: {typists.find((t) => t.id.toString() === typistId)?.name || ""},
                {typistPhone && ` தொலைபேசி: ${typistPhone},`}
                {officeId && ` அலுவலகம்: ${offices.find((o) => o.id.toString() === officeId)?.name || ""}`}
              </p>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Main form component
  return (
    <div className="bg-cyan-50 p-6 rounded-lg">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 bg-cyan-100">
          <TabsTrigger value="section1" className="data-[state=active]:bg-cyan-200 data-[state=active]:text-cyan-800">
            அடிப்படை விவரங்கள்
          </TabsTrigger>
          <TabsTrigger value="section2" className="data-[state=active]:bg-cyan-200 data-[state=active]:text-cyan-800">
            பயனாளர் விவரங்கள்
          </TabsTrigger>
          <TabsTrigger value="section3" className="data-[state=active]:bg-cyan-200 data-[state=active]:text-cyan-800">
            சொத்து விவரங்கள்
          </TabsTrigger>
          <TabsTrigger value="preview" className="data-[state=active]:bg-cyan-200 data-[state=active]:text-cyan-800">
            முன்னோட்டம்
          </TabsTrigger>
        </TabsList>

        <div className="mt-4">
          <TabsContent value="section1">
            <Card className="border-cyan-200">
              <CardHeader className="bg-cyan-50">
                <CardTitle className="text-cyan-800">அடிப்படை விவரங்கள்</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="document-date" className="text-cyan-800 font-medium">
                      ஆவணத் தேதி (DD/MM/YYYY)
                    </Label>
                    <Input
                      id="document-date"
                      value={documentDate}
                      onChange={(e) => setDocumentDate(e.target.value)}
                      placeholder="DD/MM/YYYY"
                      className="mt-1 bg-white border-cyan-200 focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <Label htmlFor="sale-amount" className="text-cyan-800 font-medium">
                      விற்பனை தொகை (ரூபாய்)
                    </Label>
                    <Input
                      id="sale-amount"
                      type="number"
                      value={saleAmount}
                      onChange={(e) => setSaleAmount(e.target.value)}
                      placeholder="விற்பனை தொகையை உள்ளிடவும்"
                      className="mt-1 bg-white border-cyan-200 focus:border-cyan-400"
                    />
                    {saleAmountWords && (
                      <p className="mt-2 text-sm text-cyan-600">
                        <strong>சொற்களில்:</strong> {saleAmountWords}
                      </p>
                    )}
                  </div>
                </div>

                <div className="border-t border-cyan-200 pt-6">
                  <h3 className="text-lg font-semibold mb-4 text-cyan-800">முந்தைய ஆவணம் விவரங்கள்</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="previous-document-date" className="text-cyan-800 font-medium">
                        முந்தைய ஆவணத் தேதி (DD/MM/YYYY)
                      </Label>
                      <Input
                        id="previous-document-date"
                        value={previousDocumentDate}
                        onChange={(e) => setPreviousDocumentDate(e.target.value)}
                        placeholder="DD/MM/YYYY"
                        className="mt-1 bg-white border-cyan-200 focus:border-cyan-400"
                      />
                    </div>

                    <div>
                      <Label htmlFor="sub-registrar-office" className="text-cyan-800 font-medium">
                        சார்பதிவாளர் அலுவலகம்
                      </Label>
                      <Select value={subRegistrarOfficeId} onValueChange={setSubRegistrarOfficeId}>
                        <SelectTrigger className="mt-1 bg-white border-cyan-200 focus:border-cyan-400">
                          <SelectValue placeholder="சார்பதிவாளர் அலுவலகத்தை தேர்ந்தெடுக்கவும்" />
                        </SelectTrigger>
                        <SelectContent>
                          {subRegistrarOffices.map((office) => (
                            <SelectItem key={office.id} value={office.id.toString()}>
                              {office.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                    <div>
                      <Label htmlFor="book-number" className="text-cyan-800 font-medium">
                        புத்தக எண்
                      </Label>
                      <Select value={bookNumberId} onValueChange={setBookNumberId}>
                        <SelectTrigger className="mt-1 bg-white border-cyan-200 focus:border-cyan-400">
                          <SelectValue placeholder="புத்தக எண்ணை தேர்ந்தெடுக்கவும்" />
                        </SelectTrigger>
                        <SelectContent>
                          {bookNumbers.map((book) => (
                            <SelectItem key={book.id} value={book.id.toString()}>
                              {book.number}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="document-year" className="text-cyan-800 font-medium">
                        ஆவண ஆண்டு
                      </Label>
                      <Input
                        id="document-year"
                        value={documentYear}
                        onChange={(e) => setDocumentYear(e.target.value)}
                        placeholder="ஆவண ஆண்டை உள்ளிடவும்"
                        className="mt-1 bg-white border-cyan-200 focus:border-cyan-400"
                      />
                    </div>

                    <div>
                      <Label htmlFor="document-number" className="text-cyan-800 font-medium">
                        ஆவண எண்
                      </Label>
                      <Input
                        id="document-number"
                        value={documentNumber}
                        onChange={(e) => setDocumentNumber(e.target.value)}
                        placeholder="ஆவண எண்ணை உள்ளிடவும்"
                        className="mt-1 bg-white border-cyan-200 focus:border-cyan-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div>
                      <Label htmlFor="document-type" className="text-cyan-800 font-medium">
                        ஆவணத்தின் வகை
                      </Label>
                      <Select value={documentTypeId} onValueChange={setDocumentTypeId}>
                        <SelectTrigger className="mt-1 bg-white border-cyan-200 focus:border-cyan-400">
                          <SelectValue placeholder="ஆவணத்தின் வகையை தேர்ந்தெடுக்கவும்" />
                        </SelectTrigger>
                        <SelectContent>
                          {documentTypes.map((type) => (
                            <SelectItem key={type.id} value={type.id.toString()}>
                              {type.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="submission-type" className="text-cyan-800 font-medium">
                        ஆவணம் ஒப்படைப்பு வகை
                      </Label>
                      <Select value={submissionTypeId} onValueChange={setSubmissionTypeId}>
                        <SelectTrigger className="mt-1 bg-white border-cyan-200 focus:border-cyan-400">
                          <SelectValue placeholder="ஆவணம் ஒப்படைப்பு வகையை தேர்ந்தெடுக்கவும்" />
                        </SelectTrigger>
                        <SelectContent>
                          {submissionTypes.map((type) => (
                            <SelectItem key={type.id} value={type.id.toString()}>
                              {type.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="border-t border-cyan-200 pt-6">
                  <h3 className="text-lg font-semibold mb-4 text-cyan-800">தட்டச்சு விவரங்கள்</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="typist" className="text-cyan-800 font-medium">
                        தட்டச்சாளர்
                      </Label>
                      <Select value={typistId} onValueChange={setTypistId}>
                        <SelectTrigger className="mt-1 bg-white border-cyan-200 focus:border-cyan-400">
                          <SelectValue placeholder="தட்டச்சாளரை தேர்ந்தெடுக்கவும்" />
                        </SelectTrigger>
                        <SelectContent>
                          {typists.map((typist) => (
                            <SelectItem key={typist.id} value={typist.id.toString()}>
                              {typist.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="typist-phone" className="text-cyan-800 font-medium">
                        தட்டச்சாளர் தொலைபேசி எண்
                      </Label>
                      <Input
                        id="typist-phone"
                        value={typistPhone}
                        onChange={(e) => setTypistPhone(e.target.value)}
                        placeholder="தட்டச்சாளர் தொலைபேசி எண்ணை உள்ளிடவும்"
                        className="mt-1 bg-white border-cyan-200 focus:border-cyan-400"
                        disabled={!!typistId}
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <Label htmlFor="office" className="text-cyan-800 font-medium">
                      தட்டச்சு அலுவலகம்
                    </Label>
                    <Select value={officeId} onValueChange={setOfficeId}>
                      <SelectTrigger className="mt-1 bg-white border-cyan-200 focus:border-cyan-400">
                        <SelectValue placeholder="தட்டச்சு அலுவலகத்தை தேர்ந்தெடுக்கவும்" />
                      </SelectTrigger>
                      <SelectContent>
                        {offices.map((office) => (
                          <SelectItem key={office.id} value={office.id.toString()}>
                            {office.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    type="button"
                    onClick={() => setActiveTab("section2")}
                    className="bg-cyan-600 hover:bg-cyan-700 text-white"
                  >
                    அடுத்த பக்கம்
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="section2">
            <Card className="border-cyan-200">
              <CardHeader className="bg-cyan-50">
                <CardTitle className="text-cyan-800">பயனாளர் விவரங்கள்</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* எழுதிகொடுப்பவர்கள் விவரங்கள் */}
                <div className="border-b border-cyan-200 pb-6">
                  <h3 className="text-lg font-semibold mb-4 text-cyan-800">எழுதிகொடுப்பவர்கள் விவரங்கள்</h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <Input
                      placeholder="பெயர், தொலைபேசி எண் அல்லது ஆதார் எண்ணை உள்ளிடவும்"
                      value={sellerSearchTerm}
                      onChange={(e) => setSellerSearchTerm(e.target.value)}
                      className="bg-white border-cyan-200 focus:border-cyan-400"
                    />
                    <Select value={sellerSearchBy} onValueChange={(value: any) => setSellerSearchBy(value)}>
                      <SelectTrigger className="bg-white border-cyan-200 focus:border-cyan-400">
                        <SelectValue placeholder="தேடல் வகை" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="name">பெயர்</SelectItem>
                        <SelectItem value="phone">தொலைபேசி எண்</SelectItem>
                        <SelectItem value="aadhaar_number">ஆதார் எண்</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button onClick={handleSellerSearch} className="bg-cyan-600 hover:bg-cyan-700 text-white">
                      <Search className="h-4 w-4 mr-2" />
                      தேடு
                    </Button>
                  </div>

                  {sellerSearchResults.length > 0 && (
                    <div className="mb-4 bg-white p-4 rounded-lg border border-cyan-200">
                      <h4 className="font-medium mb-2 text-cyan-800">தேடல் முடிவுகள்</h4>
                      <div className="space-y-2">
                        {sellerSearchResults.map((user) => (
                          <div
                            key={user.id}
                            className="flex justify-between items-center p-2 hover:bg-cyan-50 rounded cursor-pointer"
                            onClick={() => handleUserSelect(user)}
                          >
                            <div>
                              <p className="font-medium">{user.name}</p>
                              <p className="text-sm text-gray-600">
                                {user.relation_type} {user.relative_name}, {user.phone}
                              </p>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-cyan-300 text-cyan-700 hover:bg-cyan-100"
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              சேர்
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {sellers.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-medium mb-2 text-cyan-800">தேர்ந்தெடுக்கப்பட்ட எழுதிகொடுப்பவர்கள்</h4>
                      <div className="space-y-2">
                        {sellers.map((user) => (
                          <div
                            key={user.id}
                            className={`flex justify-between items-center p-2 rounded ${
                              selectedSellerId === user.id ? "bg-cyan-100" : "bg-white"
                            }`}
                          >
                            <div>
                              <p className="font-medium">{user.name}</p>
                              <p className="text-sm text-gray-600">
                                {user.relation_type} {user.relative_name}, {user.phone}
                              </p>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => removeUser(user.id, "seller")}
                              className="border-red-300 text-red-700 hover:bg-red-50"
                            >
                              <X className="h-4 w-4 mr-1" />
                              நீக்கு
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* எழுதிவாங்குபவர்கள் விவரங்கள் */}
                <div className="border-b border-cyan-200 pb-6">
                  <h3 className="text-lg font-semibold mb-4 text-cyan-800">எழுதிவாங்குபவர்கள் விவரங்கள்</h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <Input
                      placeholder="பெயர், தொலைபேசி எண் அல்லது ஆதார் எண்ணை உள்ளிடவும்"
                      value={buyerSearchTerm}
                      onChange={(e) => setBuyerSearchTerm(e.target.value)}
                      className="bg-white border-cyan-200 focus:border-cyan-400"
                    />
                    <Select value={buyerSearchBy} onValueChange={(value: any) => setBuyerSearchBy(value)}>
                      <SelectTrigger className="bg-white border-cyan-200 focus:border-cyan-400">
                        <SelectValue placeholder="தேடல் வகை" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="name">பெயர்</SelectItem>
                        <SelectItem value="phone">தொலைபேசி எண்</SelectItem>
                        <SelectItem value="aadhaar_number">ஆதார் எண்</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button onClick={handleBuyerSearch} className="bg-cyan-600 hover:bg-cyan-700 text-white">
                      <Search className="h-4 w-4 mr-2" />
                      தேடு
                    </Button>
                  </div>

                  {buyerSearchResults.length > 0 && (
                    <div className="mb-4 bg-white p-4 rounded-lg border border-cyan-200">
                      <h4 className="font-medium mb-2 text-cyan-800">தேடல் முடிவுகள்</h4>
                      <div className="space-y-2">
                        {buyerSearchResults.map((user) => (
                          <div
                            key={user.id}
                            className="flex justify-between items-center p-2 hover:bg-cyan-50 rounded cursor-pointer"
                            onClick={() => handleUserSelect(user)}
                          >
                            <div>
                              <p className="font-medium">{user.name}</p>
                              <p className="text-sm text-gray-600">
                                {user.relation_type} {user.relative_name}, {user.phone}
                              </p>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-cyan-300 text-cyan-700 hover:bg-cyan-100"
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              சேர்
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {buyers.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-medium mb-2 text-cyan-800">தேர்ந்தெடுக்கப்பட்ட எழுதிவாங்குபவர்கள்</h4>
                      <div className="space-y-2">
                        {buyers.map((user) => (
                          <div
                            key={user.id}
                            className={`flex justify-between items-center p-2 rounded ${
                              selectedBuyerId === user.id ? "bg-cyan-100" : "bg-white"
                            }`}
                          >
                            <div>
                              <p className="font-medium">{user.name}</p>
                              <p className="text-sm text-gray-600">
                                {user.relation_type} {user.relative_name}, {user.phone}
                              </p>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => removeUser(user.id, "buyer")}
                              className="border-red-300 text-red-700 hover:bg-red-50"
                            >
                              <X className="h-4 w-4 mr-1" />
                              நீக்கு
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* சாட்சிகள் விவரங்கள் */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-cyan-800">சாட்சிகள் விவரங்கள்</h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <Input
                      placeholder="பெயர், தொலைபேசி எண் அல்லது ஆதார் எண்ணை உள்ளிடவும்"
                      value={witnessSearchTerm}
                      onChange={(e) => setWitnessSearchTerm(e.target.value)}
                      className="bg-white border-cyan-200 focus:border-cyan-400"
                    />
                    <Select value={witnessSearchBy} onValueChange={(value: any) => setWitnessSearchBy(value)}>
                      <SelectTrigger className="bg-white border-cyan-200 focus:border-cyan-400">
                        <SelectValue placeholder="தேடல் வகை" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="name">பெயர்</SelectItem>
                        <SelectItem value="phone">தொலைபேசி எண்</SelectItem>
                        <SelectItem value="aadhaar_number">ஆதார் எண்</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button onClick={handleWitnessSearch} className="bg-cyan-600 hover:bg-cyan-700 text-white">
                      <Search className="h-4 w-4 mr-2" />
                      தேடு
                    </Button>
                  </div>

                  {witnessSearchResults.length > 0 && (
                    <div className="mb-4 bg-white p-4 rounded-lg border border-cyan-200">
                      <h4 className="font-medium mb-2 text-cyan-800">தேடல் முடிவுகள்</h4>
                      <div className="space-y-2">
                        {witnessSearchResults.map((user) => (
                          <div
                            key={user.id}
                            className="flex justify-between items-center p-2 hover:bg-cyan-50 rounded cursor-pointer"
                            onClick={() => handleUserSelect(user)}
                          >
                            <div>
                              <p className="font-medium">{user.name}</p>
                              <p className="text-sm text-gray-600">
                                {user.relation_type} {user.relative_name}, {user.phone}
                              </p>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-cyan-300 text-cyan-700 hover:bg-cyan-100"
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              சேர்
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {witnesses.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-medium mb-2 text-cyan-800">தேர்ந்தெடுக்கப்பட்ட சாட்சிகள்</h4>
                      <div className="space-y-2">
                        {witnesses.map((user) => (
                          <div
                            key={user.id}
                            className={`flex justify-between items-center p-2 rounded ${
                              selectedWitnessId === user.id ? "bg-cyan-100" : "bg-white"
                            }`}
                          >
                            <div>
                              <p className="font-medium">{user.name}</p>
                              <p className="text-sm text-gray-600">
                                {user.relation_type} {user.relative_name}, {user.phone}
                              </p>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => removeUser(user.id, "witness")}
                              className="border-red-300 text-red-700 hover:bg-red-50"
                            >
                              <X className="h-4 w-4 mr-1" />
                              நீக்கு
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-between">
                  <Button
                    type="button"
                    onClick={() => setActiveTab("section1")}
                    variant="outline"
                    className="border-cyan-300 text-cyan-700 hover:bg-cyan-100"
                  >
                    முந்தைய பக்கம்
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setActiveTab("section3")}
                    className="bg-cyan-600 hover:bg-cyan-700 text-white"
                  >
                    அடுத்த பக்கம்
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="section3">
            <Card className="border-cyan-200">
              <CardHeader className="bg-cyan-50">
                <CardTitle className="text-cyan-800">சொத்து விவரங்கள்</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* சொத்து தேடுதல் */}
                <div className="border-b border-cyan-200 pb-6">
                  <h3 className="text-lg font-semibold mb-4 text-cyan-800">சொத்து தேடுதல்</h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <Input
                      placeholder="சொத்தின் பெயரை உள்ளிடவும்"
                      value={propertySearchTerm}
                      onChange={(e) => setPropertySearchTerm(e.target.value)}
                      className="bg-white border-cyan-200 focus:border-cyan-400"
                    />
                    <div className="md:col-span-2 flex gap-4">
                      <Button onClick={handlePropertySearch} className="bg-cyan-600 hover:bg-cyan-700 text-white">
                        <Search className="h-4 w-4 mr-2" />
                        தேடு
                      </Button>
                      <Button
                        onClick={() => setShowNewPropertyForm(!showNewPropertyForm)}
                        variant="outline"
                        className="border-cyan-300 text-cyan-700 hover:bg-cyan-100"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        புதிய சொத்து சேர்க்க
                      </Button>
                    </div>
                  </div>

                  {showPropertyFilters && (
                    <div className="mb-4 bg-white p-4 rounded-lg border border-cyan-200">
                      <h4 className="font-medium mb-2 text-cyan-800">வடிகட்டிகள்</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        <div>
                          <Label htmlFor="property-filter-registration-district" className="text-cyan-800 text-sm">
                            பதிவு மாவட்டம்
                          </Label>
                          <Select
                            value={propertyFilterRegistrationDistrictId}
                            onValueChange={setPropertyFilterRegistrationDistrictId}
                          >
                            <SelectTrigger className="bg-white border-cyan-200 focus:border-cyan-400">
                              <SelectValue placeholder="அனைத்தும்" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">அனைத்தும்</SelectItem>
                              {subRegistrarOffices.map((office) => (
                                <SelectItem key={office.id} value={office.id.toString()}>
                                  {office.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="property-filter-district" className="text-cyan-800 text-sm">
                            மாவட்டம்
                          </Label>
                          <Select value={propertyFilterDistrictId} onValueChange={setPropertyFilterDistrictId}>
                            <SelectTrigger className="bg-white border-cyan-200 focus:border-cyan-400">
                              <SelectValue placeholder="அனைத்தும்" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">அனைத்தும்</SelectItem>
                              {districts.map((district) => (
                                <SelectItem key={district.id} value={district.id.toString()}>
                                  {district.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="property-filter-taluk" className="text-cyan-800 text-sm">
                            வட்டம்
                          </Label>
                          <Select
                            value={propertyFilterTalukId}
                            onValueChange={setPropertyFilterTalukId}
                            disabled={!propertyFilterDistrictId || propertyFilterDistrictId === "all"}
                          >
                            <SelectTrigger className="bg-white border-cyan-200 focus:border-cyan-400">
                              <SelectValue placeholder="அனைத்தும்" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">அனைத்தும்</SelectItem>
                              {filteredPropertyTaluks.map((taluk) => (
                                <SelectItem key={taluk.id} value={taluk.id.toString()}>
                                  {taluk.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="property-filter-village" className="text-cyan-800 text-sm">
                            கிராமம்
                          </Label>
                          <Select
                            value={propertyFilterVillageId}
                            onValueChange={setPropertyFilterVillageId}
                            disabled={!propertyFilterTalukId || propertyFilterTalukId === "all"}
                          >
                            <SelectTrigger className="bg-white border-cyan-200 focus:border-cyan-400">
                              <SelectValue placeholder="அனைத்தும்" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">அனைத்தும்</SelectItem>
                              {filteredPropertyVillages.map((village) => (
                                <SelectItem key={village.id} value={village.id.toString()}>
                                  {village.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex items-end">
                          <Button
                            onClick={searchProperties}
                            className="bg-cyan-600 hover:bg-cyan-700 text-white w-full"
                          >
                            <Search className="h-4 w-4 mr-2" />
                            வடிகட்டு
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {propertySearchResults.length > 0 && (
                    <div className="mb-4 bg-white p-4 rounded-lg border border-cyan-200">
                      <h4 className="font-medium mb-2 text-cyan-800">தேடல் முடிவுகள்</h4>
                      <div className="space-y-2">
                        {propertySearchResults.map((property) => (
                          <div
                            key={property.id}
                            className="flex justify-between items-center p-2 hover:bg-cyan-50 rounded cursor-pointer"
                            onClick={() => handlePropertySelect(property)}
                          >
                            <div>
                              <p className="font-medium">{property.property_name}</p>
                              <p className="text-sm text-gray-600">
                                {property.districts?.name}, {property.taluks?.name}, {property.villages?.name}
                              </p>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-cyan-300 text-cyan-700 hover:bg-cyan-100"
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              சேர்
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {showNewPropertyForm && (
                    <div className="mb-4 bg-white p-4 rounded-lg border border-cyan-200">
                      <h4 className="font-medium mb-2 text-cyan-800">புதிய சொத்து சேர்க்க</h4>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="new-property-name" className="text-cyan-800 text-sm">
                              சொத்தின் பெயர்
                            </Label>
                            <Input
                              id="new-property-name"
                              value={newPropertyName}
                              onChange={(e) => setNewPropertyName(e.target.value)}
                              placeholder="சொத்தின் பெயரை உள்ளிடவும்"
                              className="bg-white border-cyan-200 focus:border-cyan-400"
                            />
                          </div>
                          <div>
                            <Label htmlFor="new-property-survey-number" className="text-cyan-800 text-sm">
                              சர்வே எண்
                            </Label>
                            <Input
                              id="new-property-survey-number"
                              value={newPropertySurveyNumber}
                              onChange={(e) => setNewPropertySurveyNumber(e.target.value)}
                              placeholder="சர்வே எண்ணை உள்ளிடவும்"
                              className="bg-white border-cyan-200 focus:border-cyan-400"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <Label htmlFor="new-property-registration-district" className="text-cyan-800 text-sm">
                              பதிவு மாவட்டம்
                            </Label>
                            <Select
                              value={newPropertyRegistrationDistrictId}
                              onValueChange={setNewPropertyRegistrationDistrictId}
                            >
                              <SelectTrigger className="bg-white border-cyan-200 focus:border-cyan-400">
                                <SelectValue placeholder="பதிவு மாவட்டத்தை தேர்ந்தெடுக்கவும்" />
                              </SelectTrigger>
                              <SelectContent>
                                {subRegistrarOffices.map((office) => (
                                  <SelectItem key={office.id} value={office.id.toString()}>
                                    {office.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label htmlFor="new-property-district" className="text-cyan-800 text-sm">
                              மாவட்டம்
                            </Label>
                            <Select value={newPropertyDistrictId} onValueChange={setNewPropertyDistrictId}>
                              <SelectTrigger className="bg-white border-cyan-200 focus:border-cyan-400">
                                <SelectValue placeholder="மாவட்டத்தை தேர்ந்தெடுக்கவும்" />
                              </SelectTrigger>
                              <SelectContent>
                                {districts.map((district) => (
                                  <SelectItem key={district.id} value={district.id.toString()}>
                                    {district.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label htmlFor="new-property-taluk" className="text-cyan-800 text-sm">
                              வட்டம்
                            </Label>
                            <Select
                              value={newPropertyTalukId}
                              onValueChange={setNewPropertyTalukId}
                              disabled={filteredTaluks.length === 0}
                            >
                              <SelectTrigger className="bg-white border-cyan-200 focus:border-cyan-400">
                                <SelectValue placeholder="வட்டத்தை தேர்ந்தெடுக்கவும்" />
                              </SelectTrigger>
                              <SelectContent>
                                {filteredTaluks.map((taluk) => (
                                  <SelectItem key={taluk.id} value={taluk.id.toString()}>
                                    {taluk.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="new-property-village" className="text-cyan-800 text-sm">
                              கிராமம்
                            </Label>
                            <Select
                              value={newPropertyVillageId}
                              onValueChange={setNewPropertyVillageId}
                              disabled={filteredVillages.length === 0}
                            >
                              <SelectTrigger className="bg-white border-cyan-200 focus:border-cyan-400">
                                <SelectValue placeholder="கிராமத்தை தேர்ந்தெடுக்கவும்" />
                              </SelectTrigger>
                              <SelectContent>
                                {filteredVillages.map((village) => (
                                  <SelectItem key={village.id} value={village.id.toString()}>
                                    {village.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="new-property-guide-value-sqft" className="text-cyan-800 text-sm">
                              வழிகாட்டு மதிப்பு (சதுர அடி)
                            </Label>
                            <Input
                              id="new-property-guide-value-sqft"
                              type="number"
                              value={newPropertyGuideValueSqft}
                              onChange={(e) => setNewPropertyGuideValueSqft(e.target.value)}
                              placeholder="வழிகாட்டு மதிப்பை உள்ளிடவும்"
                              className="bg-white border-cyan-200 focus:border-cyan-400"
                            />
                          </div>
                          <div>
                            <Label htmlFor="new-property-guide-value-sqm" className="text-cyan-800 text-sm">
                              வழிகாட்டு மதிப்பு (சதுர மீட்டர்)
                            </Label>
                            <Input
                              id="new-property-guide-value-sqm"
                              type="number"
                              value={newPropertyGuideValueSqm}
                              onChange={(e) => setNewPropertyGuideValueSqm(e.target.value)}
                              placeholder="வழிகாட்டு மதிப்பை உள்ளிடவும்"
                              className="bg-white border-cyan-200 focus:border-cyan-400"
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="new-property-details" className="text-cyan-800 text-sm">
                            சொத்து விவரங்கள்
                          </Label>
                          <Textarea
                            id="new-property-details"
                            value={newPropertyDetails}
                            onChange={(e) => setNewPropertyDetails(e.target.value)}
                            placeholder="சொத்து விவரங்களை உள்ளிடவும்"
                            className="bg-white border-cyan-200 focus:border-cyan-400"
                          />
                        </div>

                        <div className="flex justify-end gap-2">
                          <Button
                            type="button"
                            onClick={resetNewPropertyForm}
                            variant="outline"
                            className="border-red-300 text-red-700 hover:bg-red-50"
                          >
                            ரத்து செய்
                          </Button>
                          <Button
                            type="button"
                            onClick={handleNewPropertySubmit}
                            className="bg-cyan-600 hover:bg-cyan-700 text-white"
                          >
                            சேமி
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedProperties.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-medium mb-2 text-cyan-800">தேர்ந்தெடுக்கப்பட்ட சொத்துக்கள்</h4>
                      <div className="space-y-2">
                        {selectedProperties.map((property) => (
                          <div key={property.id} className="flex justify-between items-center p-2 bg-white rounded">
                            <div>
                              <p className="font-medium">{property.property_name}</p>
                              <p className="text-sm text-gray-600">{property.property_details}</p>
                              <p className="text-sm text-gray-600">
                                வழிகாட்டு மதிப்பு: ரூ. {property.guide_value_sqft}/சதுர அடி
                              </p>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => removeProperty(property.id)}
                              className="border-red-300 text-red-700 hover:bg-red-50"
                            >
                              <X className="h-4 w-4 mr-1" />
                              நீக்கு
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* நில வகை */}
                <div className="border-b border-cyan-200 pb-6">
                  <h3 className="text-lg font-semibold mb-4 text-cyan-800">நில வகை</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {landTypes.map((type) => (
                      <div key={type.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`land-type-${type.id}`}
                          checked={selectedLandTypes.includes(type.id.toString())}
                          onCheckedChange={() => handleLandTypeChange(type.id.toString())}
                          className="border-cyan-300 data-[state=checked]:bg-cyan-600"
                        />
                        <Label
                          htmlFor={`land-type-${type.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {type.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* மதிப்பு வகை */}
                <div className="border-b border-cyan-200 pb-6">
                  <h3 className="text-lg font-semibold mb-4 text-cyan-800">மதிப்பு வகை</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {valueTypes.map((type) => (
                      <div key={type.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`value-type-${type.id}`}
                          checked={selectedValueTypes.includes(type.id.toString())}
                          onCheckedChange={() => handleValueTypeChange(type.id.toString())}
                          className="border-cyan-300 data-[state=checked]:bg-cyan-600"
                        />
                        <Label
                          htmlFor={`value-type-${type.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {type.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* பணம் செலுத்தும் முறை */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-cyan-800">பணம் செலுத்தும் முறை</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {paymentMethods.map((method) => (
                      <div key={method.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`payment-method-${method.id}`}
                          checked={selectedPaymentMethods.includes(method.id.toString())}
                          onCheckedChange={() => handlePaymentMethodChange(method.id.toString())}
                          className="border-cyan-300 data-[state=checked]:bg-cyan-600"
                        />
                        <Label
                          htmlFor={`payment-method-${method.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {method.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button
                    type="button"
                    onClick={() => setActiveTab("section2")}
                    variant="outline"
                    className="border-cyan-300 text-cyan-700 hover:bg-cyan-100"
                  >
                    முந்தைய பக்கம்
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setActiveTab("preview")}
                    className="bg-cyan-600 hover:bg-cyan-700 text-white"
                  >
                    முன்னோட்டம்
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preview">
            <DocumentPreview />

            <div className="flex justify-between mt-6">
              <Button
                type="button"
                onClick={() => setActiveTab("section3")}
                variant="outline"
                className="border-cyan-300 text-cyan-700 hover:bg-cyan-100"
              >
                முந்தைய பக்கம்
              </Button>
              <Button type="submit" onClick={handleSubmit} className="bg-cyan-600 hover:bg-cyan-700 text-white">
                <Check className="h-4 w-4 mr-2" />
                சேமி
              </Button>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
