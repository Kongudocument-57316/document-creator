"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { format } from "date-fns"
import { convertToTamilNumber } from "@/lib/number-to-words"
import { saveDocument } from "./save-document-action"
import { getSupabaseBrowserClient } from "@/lib/supabase"
import { Loader2, FileDown, FileText } from "lucide-react"
import { exportToPdf, exportToDocx } from "./export-utils"
import { ChevronLeft, ChevronRight, Save } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { DocumentNameDialog } from "@/components/document-name-dialog"
import { MultiplePropertySelector } from "./multiple-property-selector"

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
  registration_district_name?: string
}

interface BookNumber {
  id: number
  number: string
}

interface Typist {
  id: number
  name: string
  phone: string | null
}

interface Office {
  id: number
  name: string
  phone: string | null
}

interface DocumentType {
  id: number
  name: string
}

interface Property {
  id: string
  name: string
  description: string
  surveyNo: string
  area: string
  value: string
}

export default function CreateSaleAgreementForm() {
  const router = useRouter()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [documentName, setDocumentName] = useState("")
  const [previewContent, setPreviewContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("basic-details")
  const [isLoading, setIsLoading] = useState(true)

  // Data from database
  const [users, setUsers] = useState<User[]>([])
  const [subRegistrarOffices, setSubRegistrarOffices] = useState<SubRegistrarOffice[]>([])
  const [bookNumbers, setBookNumbers] = useState<BookNumber[]>([])
  const [typists, setTypists] = useState<Typist[]>([])
  const [offices, setOffices] = useState<Office[]>([])
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([])
  const [availableProperties, setAvailableProperties] = useState<Property[]>([])

  // Basic Details
  const [documentDate, setDocumentDate] = useState<Date | undefined>(undefined)
  const [documentDateInput, setDocumentDateInput] = useState("")
  const [agreementAmount, setAgreementAmount] = useState("")
  const [agreementAmountWords, setAgreementAmountWords] = useState("")
  const [advanceAmount, setAdvanceAmount] = useState("")
  const [advanceAmountWords, setAdvanceAmountWords] = useState("")
  const [balanceAmount, setBalanceAmount] = useState("")
  const [balanceAmountWords, setBalanceAmountWords] = useState("")
  const [timeFrame, setTimeFrame] = useState("")
  const [timeFrameType, setTimeFrameType] = useState("days")

  // Previous Document Details
  const [previousDocumentDate, setPreviousDocumentDate] = useState<Date | undefined>()
  const [previousDocumentDateInput, setPreviousDocumentDateInput] = useState("")
  const [subRegistrarOfficeId, setSubRegistrarOfficeId] = useState("")
  const [bookNumberId, setBookNumberId] = useState("")
  const [documentYear, setDocumentYear] = useState("")
  const [documentNumber, setDocumentNumber] = useState("")
  const [documentTypeId, setDocumentTypeId] = useState("")

  // Buyer Details
  const [buyers, setBuyers] = useState<
    Array<{
      id: string
      name: string
      age: string
      relationshipType: string
      relationName: string
      doorNo: string
      addressLine1: string
      addressLine2: string
      addressLine3: string
      taluk: string
      district: string
      pincode: string
      aadharNo: string
      phoneNo: string
    }>
  >([
    {
      id: "",
      name: "",
      age: "",
      relationshipType: "",
      relationName: "",
      doorNo: "",
      addressLine1: "",
      addressLine2: "",
      addressLine3: "",
      taluk: "",
      district: "",
      pincode: "",
      aadharNo: "",
      phoneNo: "",
    },
  ])

  // Seller Details
  const [sellers, setSellers] = useState<
    Array<{
      id: string
      name: string
      age: string
      relationshipType: string
      relationName: string
      doorNo: string
      addressLine1: string
      addressLine2: string
      addressLine3: string
      taluk: string
      district: string
      pincode: string
      aadharNo: string
      phoneNo: string
    }>
  >([
    {
      id: "",
      name: "",
      age: "",
      relationshipType: "",
      relationName: "",
      doorNo: "",
      addressLine1: "",
      addressLine2: "",
      addressLine3: "",
      taluk: "",
      district: "",
      pincode: "",
      aadharNo: "",
      phoneNo: "",
    },
  ])

  // Property Details
  const [selectedProperties, setSelectedProperties] = useState<Property[]>([
    {
      id: "",
      name: "",
      description: "",
      surveyNo: "",
      area: "",
      value: "",
    },
  ])

  // Witness Details
  const [selectedWitnessIds, setSelectedWitnessIds] = useState(["", ""])
  const [witnesses, setWitnesses] = useState([
    {
      name: "",
      age: "",
      relationshipType: "",
      relationName: "",
      doorNo: "",
      addressLine1: "",
      addressLine2: "",
      addressLine3: "",
      taluk: "",
      district: "",
      pincode: "",
      aadharNo: "",
    },
    {
      name: "",
      age: "",
      relationshipType: "",
      relationName: "",
      doorNo: "",
      addressLine1: "",
      addressLine2: "",
      addressLine3: "",
      taluk: "",
      district: "",
      pincode: "",
      aadharNo: "",
    },
  ])

  // Typist Details
  const [selectedTypistId, setSelectedTypistId] = useState("")
  const [typistName, setTypistName] = useState("")
  const [typistPhone, setTypistPhone] = useState("")
  const [selectedOfficeId, setSelectedOfficeId] = useState("")
  const [typistOffice, setTypistOffice] = useState("")

  // Relationship types
  const relationshipTypes = [
    { value: "மகன்", label: "மகன்" },
    { value: "மகள்", label: "மகள்" },
    { value: "மனைவி", label: "மனைவி" },
    { value: "தந்தை", label: "தந்தை" },
    { value: "தாய்", label: "தாய்" },
    { value: "சகோதரர்", label: "சகோதரரி" },
    { value: "சகோதரி", label: "சகோதரி" },
  ]

  // Time frame types
  const timeFrameTypes = [
    { value: "days", label: "நாட்கள்" },
    { value: "months", label: "மாதங்கள்" },
    { value: "years", label: "ஆண்டுகள்" },
    { value: "date", label: "தேதி" },
  ]

  // Function to handle navigation to the next tab
  const handleNextTab = () => {
    const currentIndex = tabs.findIndex((tab) => tab.value === activeTab)
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1].value)
    }
  }

  // Function to handle navigation to the previous tab
  const handlePreviousTab = () => {
    const currentIndex = tabs.findIndex((tab) => tab.value === activeTab)
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1].value)
    }
  }

  // Fetch data from database
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const supabase = getSupabaseBrowserClient()

        // Fetch users with correct field names
        const { data: usersData, error: usersError } = await supabase
          .from("users")
          .select(`
          id, name, gender, relation_type, relative_name, phone, aadhaar_number,
          door_number, address_line1, address_line2, address_line3, 
          district_id, taluk_id, pincode, date_of_birth, age,
          districts:district_id(name), taluks:taluk_id(name)
        `)
          .order("name")
        if (usersError) throw usersError
        setUsers(usersData || [])

        // Fetch sub-registrar offices
        const { data: officesData, error: officesError } = await supabase
          .from("sub_registrar_offices")
          .select(`
            *,
            registration_districts:registration_district_id (name)
          `)
          .order("name")
        if (officesError) throw officesError
        setSubRegistrarOffices(
          officesData.map((office) => ({
            ...office,
            registration_district_name: office.registration_districts?.name,
          })),
        )

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

        // Fetch document types
        const { data: documentTypesData, error: documentTypesError } = await supabase
          .from("document_types")
          .select("*")
          .order("name")
        if (documentTypesError) throw documentTypesError
        setDocumentTypes(documentTypesData || [])

        // Fetch properties
        const { data: propertiesData, error: propertiesError } = await supabase
          .from("properties")
          .select(`
            id, survey_number, land_area, land_type, address, village_id,
            villages:village_id (
              name, taluk_id,
              taluks:taluk_id (
                name, district_id,
                districts:district_id (
                  name, state_id,
                  states:state_id (name)
                )
              )
            )
          `)
          .order("survey_number")

        if (propertiesError) throw propertiesError

        // Transform property data to match our component's expected format
        const formattedProperties = propertiesData.map((property) => ({
          id: property.id.toString(),
          name: `${property.survey_number} - ${property.villages?.name || ""}`,
          description: property.address || "",
          surveyNo: property.survey_number,
          area: property.land_area || "",
          value: "",
        }))

        setAvailableProperties(formattedProperties)
      } catch (error) {
        console.error("Error fetching data:", error)
        toast.error("தரவுகளை பெறுவதில் பிழை ஏற்பட்டது")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Calculate balance amount when agreement amount or advance amount changes
  useEffect(() => {
    if (agreementAmount && advanceAmount) {
      const balance = Number(agreementAmount) - Number(advanceAmount)
      setBalanceAmount(balance.toString())
      setBalanceAmountWords(convertToTamilNumber(balance))
    }
  }, [agreementAmount, advanceAmount])

  // Update amount words when amount changes
  useEffect(() => {
    if (agreementAmount) {
      setAgreementAmountWords(convertToTamilNumber(Number(agreementAmount)))
    }
    if (advanceAmount) {
      setAdvanceAmountWords(convertToTamilNumber(Number(advanceAmount)))
    }
  }, [agreementAmount, advanceAmount])

  // Handle property changes - use useCallback to prevent infinite loops
  const handlePropertiesChange = useCallback((properties: Property[]) => {
    setSelectedProperties(properties)
  }, [])

  // Live preview update
  useEffect(() => {
    if (activeTab === "preview") {
      updatePreview()
    }
  }, [
    activeTab,
    documentDate,
    agreementAmount,
    agreementAmountWords,
    advanceAmount,
    advanceAmountWords,
    balanceAmount,
    balanceAmountWords,
    timeFrame,
    timeFrameType,
    previousDocumentDate,
    subRegistrarOfficeId,
    bookNumberId,
    documentYear,
    documentNumber,
    documentTypeId,
    witnesses,
    typistName,
    typistPhone,
    typistOffice,
    buyers,
    sellers,
    selectedProperties,
  ])

  // Handle buyer selection
  const handleBuyerChange = (index: number, userId: string) => {
    if (!userId) return

    const selectedUser = users.find((user) => user.id.toString() === userId)
    if (selectedUser) {
      const updatedBuyers = [...buyers]
      updatedBuyers[index] = {
        id: userId,
        name: selectedUser.name || "",
        age: selectedUser.age?.toString() || "",
        relationshipType: selectedUser.relation_type || "",
        relationName: selectedUser.relative_name || "",
        doorNo: selectedUser.door_number || "",
        addressLine1: selectedUser.address_line1 || "",
        addressLine2: selectedUser.address_line2 || "",
        addressLine3: selectedUser.address_line3 || "",
        taluk: selectedUser.taluks?.name || "",
        district: selectedUser.districts?.name || "",
        pincode: selectedUser.pincode || "",
        aadharNo: selectedUser.aadhaar_number || "",
        phoneNo: selectedUser.phone || "",
      }
      setBuyers(updatedBuyers)
    }
  }

  // Handle seller selection
  const handleSellerChange = (index: number, userId: string) => {
    if (!userId) return

    const selectedUser = users.find((user) => user.id.toString() === userId)
    if (selectedUser) {
      const updatedSellers = [...sellers]
      updatedSellers[index] = {
        id: userId,
        name: selectedUser.name || "",
        age: selectedUser.age?.toString() || "",
        relationshipType: selectedUser.relation_type || "",
        relationName: selectedUser.relative_name || "",
        doorNo: selectedUser.door_number || "",
        addressLine1: selectedUser.address_line1 || "",
        addressLine2: selectedUser.address_line2 || "",
        addressLine3: selectedUser.address_line3 || "",
        taluk: selectedUser.taluks?.name || "",
        district: selectedUser.districts?.name || "",
        pincode: selectedUser.pincode || "",
        aadharNo: selectedUser.aadhaar_number || "",
        phoneNo: selectedUser.phone || "",
      }
      setSellers(updatedSellers)
    }
  }

  // Handle buyer field change
  const handleBuyerFieldChange = (index: number, field: string, value: string) => {
    const updatedBuyers = [...buyers]
    updatedBuyers[index] = { ...updatedBuyers[index], [field]: value }
    setBuyers(updatedBuyers)
  }

  // Handle seller field change
  const handleSellerFieldChange = (index: number, field: string, value: string) => {
    const updatedSellers = [...sellers]
    updatedSellers[index] = { ...updatedSellers[index], [field]: value }
    setSellers(updatedSellers)
  }

  // Add new buyer
  const addBuyer = () => {
    setBuyers([
      ...buyers,
      {
        id: "",
        name: "",
        age: "",
        relationshipType: "",
        relationName: "",
        doorNo: "",
        addressLine1: "",
        addressLine2: "",
        addressLine3: "",
        taluk: "",
        district: "",
        pincode: "",
        aadharNo: "",
        phoneNo: "",
      },
    ])
  }

  // Remove buyer
  const removeBuyer = (index: number) => {
    if (buyers.length > 1) {
      const updatedBuyers = [...buyers]
      updatedBuyers.splice(index, 1)
      setBuyers(updatedBuyers)
    } else {
      toast.error("குறைந்தபட்சம் ஒரு வாங்குபவர் தேவை")
    }
  }

  // Add new seller
  const addSeller = () => {
    setSellers([
      ...sellers,
      {
        id: "",
        name: "",
        age: "",
        relationshipType: "",
        relationName: "",
        doorNo: "",
        addressLine1: "",
        addressLine2: "",
        addressLine3: "",
        taluk: "",
        district: "",
        pincode: "",
        aadharNo: "",
        phoneNo: "",
      },
    ])
  }

  // Remove seller
  const removeSeller = (index: number) => {
    if (sellers.length > 1) {
      const updatedSellers = [...sellers]
      updatedSellers.splice(index, 1)
      setSellers(updatedSellers)
    } else {
      toast.error("குறைந்தபட்சம் ஒரு விற்பவர் தேவை")
    }
  }

  // Handle witness selection
  const handleWitnessChange = (index: number, field: string, value: string) => {
    const updatedWitnesses = [...witnesses]
    updatedWitnesses[index] = { ...updatedWitnesses[index], [field]: value }
    setWitnesses(updatedWitnesses)
  }

  // Handle witness selection from dropdown
  const handleWitnessSelection = (index: number, userId: string) => {
    const updatedWitnessIds = [...selectedWitnessIds]
    updatedWitnessIds[index] = userId
    setSelectedWitnessIds(updatedWitnessIds)

    if (!userId) return

    const selectedUser = users.find((user) => user.id.toString() === userId)
    if (selectedUser) {
      const updatedWitnesses = [...witnesses]
      updatedWitnesses[index] = {
        name: selectedUser.name || "",
        age: selectedUser.age?.toString() || "",
        relationshipType: selectedUser.relation_type || "",
        relationName: selectedUser.relative_name || "",
        doorNo: selectedUser.door_number || "",
        addressLine1: selectedUser.address_line1 || "",
        addressLine2: selectedUser.address_line2 || "",
        addressLine3: selectedUser.address_line3 || "",
        taluk: selectedUser.taluks?.name || "",
        district: selectedUser.districts?.name || "",
        pincode: selectedUser.pincode || "",
        aadharNo: selectedUser.aadhaar_number || "",
      }
      setWitnesses(updatedWitnesses)
    }
  }

  // Handle typist selection
  const handleTypistChange = (typistId: string) => {
    setSelectedTypistId(typistId)
    if (!typistId) return

    const selectedTypist = typists.find((typist) => typist.id.toString() === typistId)
    if (selectedTypist) {
      setTypistName(selectedTypist.name || "")
      setTypistPhone(selectedTypist.phone || "")
    }
  }

  // Handle office selection
  const handleOfficeChange = (officeId: string) => {
    setSelectedOfficeId(officeId)
    if (!officeId) return

    const selectedOffice = offices.find((office) => office.id.toString() === officeId)
    if (selectedOffice) {
      setTypistOffice(selectedOffice.name || "")
    }
  }

  // Format date for display
  const formatDate = (date: Date | undefined) => {
    if (!date) return ""
    return format(date, "dd/MM/yyyy")
  }

  // Parse date from string
  const parseDate = (dateString: string): Date | undefined => {
    if (!dateString) return undefined

    const parts = dateString.split("/")
    if (parts.length !== 3) return undefined

    const day = Number.parseInt(parts[0], 10)
    const month = Number.parseInt(parts[1], 10) - 1 // Month is 0-indexed in JS Date
    const year = Number.parseInt(parts[2], 10)

    const date = new Date(year, month, day)
    return !isNaN(date.getTime()) ? date : undefined
  }

  // Get sub-registrar office name
  const getSubRegistrarOfficeName = (id: string) => {
    const office = subRegistrarOffices.find((office) => office.id.toString() === id)
    return office ? office.name : ""
  }

  // Get book number by ID
  const getBookNumber = (id: string) => {
    const book = bookNumbers.find((book) => book.id.toString() === id)
    return book ? book.number : ""
  }

  // Get document type name by ID
  const getDocumentTypeName = (id: string) => {
    const docType = documentTypes.find((type) => type.id.toString() === id)
    return docType ? docType.name : ""
  }

  // Convert English month name to Tamil
  const getMonthInTamil = (monthName: string): string => {
    const months: Record<string, string> = {
      January: "ஜனவரி",
      February: "பிப்ரவரி",
      March: "மார்ச்",
      April: "ஏப்ரல்",
      May: "மே",
      June: "ஜூன்",
      July: "ஜூலை",
      August: "ஆகஸ்ட்",
      September: "செப்டம்பர்",
      October: "அக்டோபர்",
      November: "நவம்பர்",
      December: "டிசம்பர்",
    }

    return months[monthName] || monthName
  }

  // Format date with Tamil month
  const formatDateWithTamilMonth = (date: Date | undefined): string => {
    if (!date) return ""

    const year = format(date, "yyyy")
    const month = getMonthInTamil(format(date, "MMMM"))
    const day = format(date, "dd")

    return `${year}-ம் வருடம் ${month} மாதம் ${day}-ம் தேதியில்`
  }

  // Update preview content
  const updatePreview = () => {
    const formattedDocDate = formatDateWithTamilMonth(documentDate)
    const formattedPrevDocDate = previousDocumentDate ? format(previousDocumentDate, "dd/MM/yyyy") : ""

    const subRegistrarOfficeName = getSubRegistrarOfficeName(subRegistrarOfficeId)
    const bookNumberValue = getBookNumber(bookNumberId)
    const documentTypeName = getDocumentTypeName(documentTypeId)

    // Format buyers for display
    const buyersText = buyers
      .map((buyer, index) => {
        return `${buyer.district} மாவட்டம்- ${buyer.pincode}, ${buyer.taluk} வட்டம், ${buyer.addressLine3}, ${buyer.addressLine2}, ${buyer.addressLine1}, கதவு எண்:- ${buyer.doorNo} என்ற முகவரியில் வசித்து வருபவரும், ${buyer.relationName} அவர்களின் ${buyer.relationshipType} ${buyer.age} வயதுடைய ${buyer.name} (ஆதார் அடையாள அட்டை எண்:- ${buyer.aadharNo}, கைப்பேசி எண்:- ${buyer.phoneNo})-(${index + 1}) (இது முதற்கொண்டு இவர் கிரையம் ${buyers.length > 1 ? "வாங்குபவர்கள்" : "வாங்குபவர்"} என்று அழைக்கப்படுவார்)`
      })
      .join(", ")

    // Format sellers for display
    const sellersText = sellers
      .map((seller, index) => {
        return `${seller.district} மாவட்டம்- ${seller.pincode}, ${seller.taluk} வட்டம், ${seller.addressLine3}, ${seller.addressLine2}, ${seller.addressLine1}, கதவு எண்:- ${seller.doorNo} என்ற முகவரியில் வசித்து வருபவரும், ${seller.relationName} அவர்களின் ${seller.relationshipType} ${seller.age} வயதுடைய ${seller.name} (ஆதார் அடையாள அட்டை எண்:- ${seller.aadharNo}, கைப்பேசி எண்:- ${seller.phoneNo})-(${buyers.length + index + 1}) (இதுமுதற்கொண்டு இவர் கிரையம் ${sellers.length > 1 ? "விற்பவர்கள்" : "விற்பவர்"} என்று அழைக்கப்படுவார்)`
      })
      .join(", ")

    // Format properties for display
    const propertiesText = selectedProperties
      .filter((prop) => prop.id || prop.surveyNo)
      .map((prop, index) => {
        return `
          <div class="mb-4">
            <h4 class="font-medium">சொத்து ${index + 1}:</h4>
            <p><strong>சர்வே எண்:</strong> ${prop.surveyNo}</p>
            <p><strong>பரப்பளவு:</strong> ${prop.area || "குறிப்பிடப்படவில்லை"}</p>
            <p><strong>மதிப்பு:</strong> ${prop.value || "குறிப்பிடப்படவில்லை"}</p>
            ${prop.description ? `<p class="mt-2"><strong>கூடுதல் விவரங்கள்:</strong> ${prop.description}</p>` : ""}
          </div>
        `
      })
      .join("")

    // Determine pluralization based on number of buyers and sellers
    const buyerPlural = buyers.length > 1 ? "வாங்குபவர்கள்" : "வாங்குபவர்"
    const sellerPlural = sellers.length > 1 ? "விற்பவர்கள்" : "விற்பவர்"
    const partiesPlural = buyers.length + sellers.length > 2 ? "நாங்கள் அனைவரும்" : "நாம் இருவரும்"
    const propertiesPlural = selectedProperties.filter((p) => p.id || p.surveyNo).length > 1 ? "சொத்துக்கள்" : "சொத்து"

    const content = `
      <div class="p-8 bg-white">
        <h1 class="text-3xl font-bold text-center mb-6">கிரைய உடன்படிக்கை பத்திரம்</h1>
        <p class="text-lg text-center mb-6">${formattedDocDate}</p>
      
        <p class="mb-6 text-justify">
          ${buyersText}, ${sellersText}
        </p>
      
        <p class="mb-6 text-justify">
          ஆகிய ${partiesPlural} சம்மதித்து எழுதி வைத்துக் கொண்ட சுவாதீனம் இல்லாத கிரைய உடன்படிக்கை பத்திரம் என்னவென்றால், ${sellers.length > 1 ? "விற்பவர்களுக்கு" : "விற்பவருக்கு"}, கடந்த ${formattedPrevDocDate}-ம் தேதியில், ${subRegistrarOfficeName} சார்பதிவாளர் அலுவலகம் ${bookNumberValue} புத்தகம் ${documentYear}-ம் ஆண்டின் ${documentNumber}-ம் எண்ணாக பதிவு செய்யப்பட்ட ${documentTypeName} ஆவணத்தின் படி பாத்தியப்பட்ட கீழ்கண்ட ${propertiesPlural}, ${sellers.length > 1 ? "விற்பவர்கள்" : "விற்பவர்"}, ${buyers.length > 1 ? "வாங்குபவர்களுக்கு" : "வாங்குபவருக்கு"} ரூ.${agreementAmount}/-(ரூபாய் ${agreementAmountWords} மட்டும்) கிரையத்துக்கு பேசி கொடுப்பதாக ஒப்புக்கொண்டு, ${buyers.length > 1 ? "வாங்குபவர்களிடமிருந்து" : "வாங்குபவரிடமிருந்து"} ரூ.${advanceAmount}/-(ரூபாய் ${advanceAmountWords} மட்டும்) மட்டும் முன்பணமாக ${sellers.length > 1 ? "விற்பவர்கள்" : "விற்பவர்"} கீழ்கண்ட சாட்சிகள் முன்னிலையில் ரொக்கமாக பெற்றுக் கொண்டுள்ளார்${sellers.length > 1 ? "கள்" : ""}.
        </p>
      
        <p class="mb-6 text-justify">
          ${buyers.length > 1 ? "வாங்குபவர்கள்" : "வாங்குபவர்"}, ${sellers.length > 1 ? "விற்பவர்களுக்கு" : "விற்பவர்"} நாளது தேதியில் இருந்து எதிர்வரும் ${timeFrame} ${timeFrameType === "days" ? "நாட்களுக்குள்" : timeFrameType === "months" ? "மாதங்களுக்குள்" : timeFrameType === "years" ? "ஆண்டுகளுக்குள்" : "தேதிக்குள்"}, மீதி பாக்கி தொகை ரூ.${balanceAmount}/-(ரூபாய் ${balanceAmountWords} மட்டும்)-செலுத்தி தன் சொந்த செலவில் கிரையம் செய்து கொள்ள வேண்டியது.
        </p>
      
        <p class="mb-6 text-justify">
          நம்மில் ${buyers.length > 1 ? "வாங்குபவர்கள்" : "வாங்குபவர்"}, ${sellers.length > 1 ? "விற்பவர்களுக்கு" : "விற்பவர்"} நாளது தேதியில் இருந்து மேற்படி கெடுவிற்குள் ${buyers.length > 1 ? "வாங்குபவர்கள்" : "வாங்குபவர்"} மேற்படி பாக்கி தொகையை ${sellers.length > 1 ? "விற்பவர்களுக்கு" : "விற்பவர்"} செலுத்தி, ${buyers.length > 1 ? "வாங்குபவர்கள்" : "வாங்குபவர்"} தன் சொந்த செலவில் கிரையம் செய்து கொள்ள தயாராக இருந்து, ${buyers.length > 1 ? "வாங்குபவர்கள்" : "வாங்குபவர்"} கிரையம் செய்து கொடுக்கும் படி கூப்பிடும்போது, ${sellers.length > 1 ? "விற்பவர்கள்" : "விற்பவர்"} சர்வ வில்லங்க சுத்தியாய் சகல வாரிரிசுகள் சகிதமாய், ${buyers.length > 1 ? "வாங்குபவர்களுக்கோ" : "வாங்குபவருக்கோ"} அல்லது அவர் கோரும் நபருக்கோ கிரையமும் சுவாதீனம் செய்து கொடுத்து விட வேண்டியது.
        </p>
      
        <p class="mb-6 text-justify">
          அப்படி ${sellers.length > 1 ? "விற்பவர்கள்" : "விற்பவர்"} கிரையமும் சுவாதீனமும் செய்து கொடுக்க மறுத்தாலும் அல்லது வீண் காலதாமதம் செய்தாலும் ${buyers.length > 1 ? "வாங்குபவர்கள்" : "வாங்குபவர்"} மேற்படி பாக்கி தொகையை தகுந்த நீதிமன்றத்தில் டெபாசிட் செய்து, ${sellers.length > 1 ? "விற்பவர்களின்" : "விற்பவரின்"} அனுமதி இல்லாமலேயே ${buyers.length > 1 ? "வாங்குபவர்களால்" : "வாங்குபவரால்"} கட்டாய கிரையம் செய்து கொள்ள வேண்டியதாகும்.
        </p>
      
        <p class="mb-6 text-justify">
          இதற்கு ஆகும் நீதிமன்ற செலவினங்களுக்கும், இதர செலவினங்களுக்கும் மேற்படி டெபாசிட் தொகையில் பிடித்தம் செய்துகொள்ள வேண்டியதாகும்.
        </p>
      
        <p class="mb-6 text-justify">
          மேற்படி கெடுவிற்குள் ${buyers.length > 1 ? "வாங்குபவர்கள்" : "வாங்குபவர்"} கிரையம் செய்ய தவறினால் இன்று ${sellers.length > 1 ? "விற்பவர்களுக்கு" : "விற்பவர்"} செலுத்திய முன்பணத்தை இழந்து விட வேண்டியதாகும்.
        </p>
      
        <p class="mb-6 text-justify">
          இந்த படிக்கு ${partiesPlural} சேர்ந்து சம்மதித்து எழுதி வைத்துக் கொண்ட சுவாதீனம் இல்லாத கிரைய உடன்படிக்கை பத்திரம்.
        </p>
      
        <h3 class="text-xl font-semibold mb-2 text-center">சொத்து விவரம்</h3>
        <div class="mb-6">
          ${propertiesText || "சொத்து விவரங்கள் குறிப்பிடப்படவில்லை"}
        </div>
      
        <h3 class="text-xl font-semibold mb-2">சாட்சிகள்</h3>
        <ol class="list-decimal pl-5 mb-6">
          ${witnesses
            .map(
              (witness, index) => `
            <li class="mb-2">
              ${witness.name}, ${witness.relationshipType}.${witness.relationName}, கதவு எண்:-${witness.doorNo}, ${witness.addressLine1}, ${witness.addressLine2}, ${witness.addressLine3}, ${witness.taluk} வட்டம், ${witness.district} மாவட்டம்-${witness.pincode}, (வயது-${witness.age}) (ஆதார் அடையாள அட்டை எண்:-${witness.aadharNo})
            </li>
          `,
            )
            .join("")}
        </ol>
      
        <p class="mb-6 text-right">
          கணினியில் தட்டச்சு செய்து ஆவணம் தயார் செய்தவர்:-${typistName}<br>
          (${typistOffice}, போன்:-${typistPhone})
        </p>
      
        <div class="flex justify-between mt-8 mb-6">
          <div class="font-semibold">${sellers.length > 1 ? "விற்பவர்கள்" : "விற்பவர்"}</div>
          <div class="font-semibold">${buyers.length > 1 ? "வாங்குபவர்கள்" : "வாங்குபவர்"}</div>
        </div>
      </div>
    `

    setPreviewContent(content)
  }

  // Handle PDF export
  const handleExportPdf = () => {
    updatePreview()
    exportToPdf("#document-preview", documentName || "கிரைய-உடன்படிக்கை")()
  }

  // Handle Word export
  const handleExportDocx = () => {
    updatePreview()
    exportToDocx("#document-preview", documentName || "கிரைய-உடன்படிக்கை")()
  }

  // Handle tab navigation
  const tabs = [
    { value: "basic-details", label: "அடிப்படை விவரங்கள்" },
    { value: "parties", label: "வாங்குபவர் & விற்பவர்" },
    { value: "property", label: "சொத்து விவரங்கள்" },
    { value: "witnesses", label: "சாட்சிகள்" },
    { value: "preview", label: "முன்னோட்டம்" },
  ]

  // Handle form submission
  const [isPending, startTransition] = useState(false)

  const handleSubmit = async () => {
    if (!documentName) {
      setIsDialogOpen(true)
      return
    }

    startTransition(async () => {
      try {
        setIsSubmitting(true)

        // Format dates for submission
        const formattedDocDate = documentDate ? formatDate(documentDate) : null
        const formattedPrevDocDate = previousDocumentDate ? formatDate(previousDocumentDate) : null

        // Prepare data for submission
        const data = {
          documentName,
          documentDate: formattedDocDate,
          agreementAmount,
          agreementAmountWords,
          previousDocumentDate: formattedPrevDocDate,
          subRegistrarOfficeId,
          bookNumberId,
          documentYear,
          documentNumber,
          documentTypeId,
          submissionTypeId: null,
          typistId: selectedTypistId || null,
          typistPhone,
          officeId: selectedOfficeId || null,
          landTypes: [],
          valueTypes: [],
          paymentMethods: [],
          documentContent: previewContent,
          buyers: buyers.filter((buyer) => buyer.id).map((buyer) => Number(buyer.id)),
          sellers: sellers.filter((seller) => seller.id).map((seller) => Number(seller.id)),
          witnesses: selectedWitnessIds.filter((id) => id !== ""),
          property_details: JSON.stringify(selectedProperties.filter((p) => p.id || p.surveyNo)),
          agreementTerms: [],
          agreementDuration: timeFrame,
          agreementStartDate: formattedDocDate,
          agreementEndDate: null,
        }

        // Save document
        const result = await saveDocument(data)

        if (result.success) {
          toast.success("கிரைய உடன்படிக்கை ஆவணம் வெற்றிகரமாக சேமிக்கப்பட்டது")
          router.push(`/document-details/sale-agreement/view/${result.documentId}`)
        } else {
          toast.error(`ஆவணத்தை சேமிப்பதில் பிழை: ${result.error}`)
        }
      } catch (error) {
        console.error("Error saving document:", error)
        toast.error("ஆவணத்தை சேமிப்பதில் பிழை ஏற்பட்டது")
      } finally {
        setIsSubmitting(false)
      }
    })
  }

  // Dummy function to trigger preview generation
  const generatePreview = () => {
    updatePreview()
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">தரவுகளை ஏற்றுகிறது...</span>
      </div>
    )
  }

  return (
    <div className="container mx-auto">
      <DocumentNameDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={(name) => {
          setDocumentName(name)
          setIsDialogOpen(false)
          handleSubmit()
        }}
      />

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">புதிய கிரைய உடன்படிக்கை உருவாக்கு</h1>
        </div>

        <div className={`grid grid-cols-1`}>
          <div>
            <Tabs
              value={activeTab}
              onValueChange={(value) => {
                setActiveTab(value)
              }}
              className="w-full"
            >
              <TabsList className="grid grid-cols-5 mb-4">
                <TabsTrigger value="basic-details">அடிப்படை விவரங்கள்</TabsTrigger>
                <TabsTrigger value="parties">வாங்குபவர் & விற்பவர்</TabsTrigger>
                <TabsTrigger value="property">சொத்து விவரங்கள்</TabsTrigger>
                <TabsTrigger value="witnesses">சாட்சிகள்</TabsTrigger>
                <TabsTrigger value="preview">முன்னோட்டம்</TabsTrigger>
              </TabsList>

              <TabsContent value="basic-details">
                <Card>
                  <CardHeader>
                    <CardTitle>அடிப்படை விவரங்கள்</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="documentName">ஆவணத்தின் பெயர்</Label>
                        <Input
                          id="documentName"
                          value={documentName}
                          onChange={(e) => setDocumentName(e.target.value)}
                          placeholder="ஆவணத்தின் பெயரை உள்ளிடவும்"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="documentDate">ஆவண தேதி</Label>
                        <Input
                          id="documentDate"
                          placeholder="DD/MM/YYYY"
                          value={documentDateInput}
                          onChange={(e) => {
                            const value = e.target.value
                            setDocumentDateInput(value)

                            if (value === "") {
                              setDocumentDate(undefined)
                              return
                            }

                            // Try to parse the date if it's in correct format
                            if (/^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
                              const parsedDate = parseDate(value)
                              if (parsedDate) {
                                setDocumentDate(parsedDate)
                              }
                            }
                          }}
                        />
                        <p className="text-xs text-muted-foreground">தேதியை DD/MM/YYYY வடிவத்தில் உள்ளிடவும்</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="agreementAmount">கிரைய தொகை</Label>
                        <Input
                          id="agreementAmount"
                          type="number"
                          value={agreementAmount}
                          onChange={(e) => setAgreementAmount(e.target.value)}
                          placeholder="கிரைய தொகையை உள்ளிடவும்"
                        />
                        {agreementAmount && <p className="text-sm text-gray-500">ரூபாய் {agreementAmountWords} மட்டும்</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="advanceAmount">முன்பண தொகை</Label>
                        <Input
                          id="advanceAmount"
                          type="number"
                          value={advanceAmount}
                          onChange={(e) => setAdvanceAmount(e.target.value)}
                          placeholder="முன்பண தொகையை உள்ளிடவும்"
                        />
                        {advanceAmount && <p className="text-sm text-gray-500">ரூபாய் {advanceAmountWords} மட்டும்</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="balanceAmount">மீதி தொகை</Label>
                        <Input id="balanceAmount" type="number" value={balanceAmount} readOnly placeholder="மீதி தொகை" />
                        {balanceAmount && <p className="text-sm text-gray-500">ரூபாய் {balanceAmountWords} மட்டும்</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="timeFrame">கால அளவு</Label>
                        <div className="flex gap-2">
                          <Input
                            id="timeFrame"
                            type="text"
                            value={timeFrame}
                            onChange={(e) => setTimeFrame(e.target.value)}
                            placeholder="கால அளவை உள்ளிடவும்"
                            className="flex-1"
                          />
                          <Select value={timeFrameType} onValueChange={setTimeFrameType}>
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="வகை" />
                            </SelectTrigger>
                            <SelectContent>
                              {" "}
                              {timeFrameTypes.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                  {type.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="previous-document">
                        <AccordionTrigger>முந்தைய ஆவண விவரங்கள்</AccordionTrigger>
                        <AccordionContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                            <div className="space-y-2">
                              <Label htmlFor="previousDocumentDate">முந்தைய ஆவண தேதி</Label>
                              <Input
                                id="previousDocumentDate"
                                placeholder="DD/MM/YYYY"
                                value={previousDocumentDateInput}
                                onChange={(e) => {
                                  const value = e.target.value
                                  setPreviousDocumentDateInput(value)

                                  if (value === "") {
                                    setPreviousDocumentDate(undefined)
                                    return
                                  }

                                  // Try to parse the date if it's in correct format
                                  if (/^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
                                    const parsedDate = parseDate(value)
                                    if (parsedDate) {
                                      setPreviousDocumentDate(parsedDate)
                                    }
                                  }
                                }}
                              />
                              <p className="text-xs text-muted-foreground">தேதியை DD/MM/YYYY வடிவத்தில் உள்ளிடவும்</p>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="subRegistrarOffice">சார்பதிவாளர் அலுவலகம்</Label>
                              <Select value={subRegistrarOfficeId} onValueChange={setSubRegistrarOfficeId}>
                                <SelectTrigger>
                                  <SelectValue placeholder="சார்பதிவாளர் அலுவலகத்தைத் தேர்ந்தெடுக்கவும்" />
                                </SelectTrigger>
                                <SelectContent>
                                  {subRegistrarOffices.map((office) => (
                                    <SelectItem key={office.id} value={office.id.toString()}>
                                      {office.name} ({office.registration_district_name})
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="bookNumber">புத்தக எண்</Label>
                              <Select value={bookNumberId} onValueChange={setBookNumberId}>
                                <SelectTrigger>
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
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="documentYear">ஆவண ஆண்டு</Label>
                              <Input
                                id="documentYear"
                                value={documentYear}
                                onChange={(e) => setDocumentYear(e.target.value)}
                                placeholder="ஆவண ஆண்டை உள்ளிடவும்"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="documentNumber">ஆவண எண்</Label>
                              <Input
                                id="documentNumber"
                                value={documentNumber}
                                onChange={(e) => setDocumentNumber(e.target.value)}
                                placeholder="ஆவண எண்ணை உள்ளிடவும்"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="documentType">ஆவண வகை</Label>
                              <Select value={documentTypeId} onValueChange={setDocumentTypeId}>
                                <SelectTrigger>
                                  <SelectValue placeholder="ஆவண வகையைத் தேர்ந்தெடுக்கவும்" />
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
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                </Card>
                {/* Add navigation buttons */}
                <div className="flex justify-between mt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePreviousTab}
                    disabled={activeTab === "basic-details"}
                  >
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    பின்னால்
                  </Button>
                  <Button type="button" onClick={handleNextTab} disabled={activeTab === "preview"}>
                    அடுத்து
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="parties">
                <Card>
                  <CardHeader>
                    <CardTitle>வாங்குபவர் விவரங்கள்</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {buyers.map((buyer, index) => (
                      <div key={index} className="border p-4 rounded-md">
                        <h3 className="text-lg font-semibold mb-2">வாங்குபவர் {index + 1}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor={`buyerName-${index}`}>பெயர்</Label>
                            <Select value={buyer.id} onValueChange={(value) => handleBuyerChange(index, value)}>
                              <SelectTrigger>
                                <SelectValue placeholder="வாங்குபவரைத் தேர்ந்தெடுக்கவும்" />
                              </SelectTrigger>
                              <SelectContent>
                                {users.map((user) => (
                                  <SelectItem key={user.id} value={user.id.toString()}>
                                    {user.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {!buyer.id && (
                              <Input
                                type="text"
                                id={`buyerName-${index}`}
                                value={buyer.name}
                                onChange={(e) => handleBuyerFieldChange(index, "name", e.target.value)}
                                placeholder="பெயரை உள்ளிடவும்"
                              />
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`buyerAge-${index}`}>வயது</Label>
                            <Input
                              type="number"
                              id={`buyerAge-${index}`}
                              value={buyer.age}
                              onChange={(e) => handleBuyerFieldChange(index, "age", e.target.value)}
                              placeholder="வயதை உள்ளிடவும்"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`buyerRelationshipType-${index}`}>உறவு முறை</Label>
                            <Select
                              value={buyer.relationshipType}
                              onValueChange={(value) => handleBuyerFieldChange(index, "relationshipType", value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="உறவு முறையைத் தேர்ந்தெடுக்கவும்" />
                              </SelectTrigger>
                              <SelectContent>
                                {relationshipTypes.map((type) => (
                                  <SelectItem key={type.value} value={type.value}>
                                    {type.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`buyerRelationName-${index}`}>தொடர்புடைய பெயர்</Label>
                            <Input
                              type="text"
                              id={`buyerRelationName-${index}`}
                              value={buyer.relationName}
                              onChange={(e) => handleBuyerFieldChange(index, "relationName", e.target.value)}
                              placeholder="தொடர்புடைய பெயரை உள்ளிடவும்"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`buyerDoorNo-${index}`}>கதவு எண்</Label>
                            <Input
                              type="text"
                              id={`buyerDoorNo-${index}`}
                              value={buyer.doorNo}
                              onChange={(e) => handleBuyerFieldChange(index, "doorNo", e.target.value)}
                              placeholder="கதவு எண்ணை உள்ளிடவும்"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`buyerAddressLine1-${index}`}>முகவரி வரி 1</Label>
                            <Input
                              type="text"
                              id={`buyerAddressLine1-${index}`}
                              value={buyer.addressLine1}
                              onChange={(e) => handleBuyerFieldChange(index, "addressLine1", e.target.value)}
                              placeholder="முகவரி வரி 1 உள்ளிடவும்"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`buyerAddressLine2-${index}`}>முகவரி வரி 2</Label>
                            <Input
                              type="text"
                              id={`buyerAddressLine2-${index}`}
                              value={buyer.addressLine2}
                              onChange={(e) => handleBuyerFieldChange(index, "addressLine2", e.target.value)}
                              placeholder="முகவரி வரி 2 உள்ளிடவும்"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`buyerAddressLine3-${index}`}>முகவரி வரி 3</Label>
                            <Input
                              type="text"
                              id={`buyerAddressLine3-${index}`}
                              value={buyer.addressLine3}
                              onChange={(e) => handleBuyerFieldChange(index, "addressLine3", e.target.value)}
                              placeholder="முகவரி வரி 3 உள்ளிடவும்"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`buyerTaluk-${index}`}>வட்டம்</Label>
                            <Input
                              type="text"
                              id={`buyerTaluk-${index}`}
                              value={buyer.taluk}
                              onChange={(e) => handleBuyerFieldChange(index, "taluk", e.target.value)}
                              placeholder="வட்டத்தை உள்ளிடவும்"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`buyerDistrict-${index}`}>மாவட்டம்</Label>
                            <Input
                              type="text"
                              id={`buyerDistrict-${index}`}
                              value={buyer.district}
                              onChange={(e) => handleBuyerFieldChange(index, "district", e.target.value)}
                              placeholder="மாவட்டத்தை உள்ளிடவும்"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`buyerPincode-${index}`}>பின்கோடு</Label>
                            <Input
                              type="text"
                              id={`buyerPincode-${index}`}
                              value={buyer.pincode}
                              onChange={(e) => handleBuyerFieldChange(index, "pincode", e.target.value)}
                              placeholder="பின்கோடை உள்ளிடவும்"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`buyerAadharNo-${index}`}>ஆதார் எண்</Label>
                            <Input
                              type="text"
                              id={`buyerAadharNo-${index}`}
                              value={buyer.aadharNo}
                              onChange={(e) => handleBuyerFieldChange(index, "aadharNo", e.target.value)}
                              placeholder="ஆதார் எண்ணை உள்ளிடவும்"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`buyerPhoneNo-${index}`}>கைபேசி எண்</Label>
                            <Input
                              type="text"
                              id={`buyerPhoneNo-${index}`}
                              value={buyer.phoneNo}
                              onChange={(e) => handleBuyerFieldChange(index, "phoneNo", e.target.value)}
                              placeholder="கைபேசி எண்ணை உள்ளிடவும்"
                            />
                          </div>
                        </div>
                        {buyers.length > 1 && (
                          <Button variant="destructive" onClick={() => removeBuyer(index)} className="mt-4">
                            நீக்கு
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button onClick={addBuyer}>வாங்குபவரைச் சேர்க்கவும்</Button>
                  </CardContent>
                </Card>

                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>விற்பவர் விவரங்கள்</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {sellers.map((seller, index) => (
                      <div key={index} className="border p-4 rounded-md">
                        <h3 className="text-lg font-semibold mb-2">விற்பவர் {index + 1}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor={`sellerName-${index}`}>பெயர்</Label>
                            <Select value={seller.id} onValueChange={(value) => handleSellerChange(index, value)}>
                              <SelectTrigger>
                                <SelectValue placeholder="விற்பவரைத் தேர்ந்தெடுக்கவும்" />
                              </SelectTrigger>
                              <SelectContent>
                                {users.map((user) => (
                                  <SelectItem key={user.id} value={user.id.toString()}>
                                    {user.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {!seller.id && (
                              <Input
                                type="text"
                                id={`sellerName-${index}`}
                                value={seller.name}
                                onChange={(e) => handleSellerFieldChange(index, "name", e.target.value)}
                                placeholder="பெயரை உள்ளிடவும்"
                              />
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`sellerAge-${index}`}>வயது</Label>
                            <Input
                              type="number"
                              id={`sellerAge-${index}`}
                              value={seller.age}
                              onChange={(e) => handleSellerFieldChange(index, "age", e.target.value)}
                              placeholder="வயதை உள்ளிடவும்"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`sellerRelationshipType-${index}`}>உறவு முறை</Label>
                            <Select
                              value={seller.relationshipType}
                              onValueChange={(value) => handleSellerFieldChange(index, "relationshipType", value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="உறவு முறையைத் தேர்ந்தெடுக்கவும்" />
                              </SelectTrigger>
                              <SelectContent>
                                {relationshipTypes.map((type) => (
                                  <SelectItem key={type.value} value={type.value}>
                                    {type.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`sellerRelationName-${index}`}>தொடர்புடைய பெயர்</Label>
                            <Input
                              type="text"
                              id={`sellerRelationName-${index}`}
                              value={seller.relationName}
                              onChange={(e) => handleSellerFieldChange(index, "relationName", e.target.value)}
                              placeholder="தொடர்புடைய பெயரை உள்ளிடவும்"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`sellerDoorNo-${index}`}>கதவு எண்</Label>
                            <Input
                              type="text"
                              id={`sellerDoorNo-${index}`}
                              value={seller.doorNo}
                              onChange={(e) => handleSellerFieldChange(index, "doorNo", e.target.value)}
                              placeholder="கதவு எண்ணை உள்ளிடவும்"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`sellerAddressLine1-${index}`}>முகவரி வரி 1</Label>
                            <Input
                              type="text"
                              id={`sellerAddressLine1-${index}`}
                              value={seller.addressLine1}
                              onChange={(e) => handleSellerFieldChange(index, "addressLine1", e.target.value)}
                              placeholder="முகவரி வரி 1 உள்ளிடவும்"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`sellerAddressLine2-${index}`}>முகவரி வரி 2</Label>
                            <Input
                              type="text"
                              id={`sellerAddressLine2-${index}`}
                              value={seller.addressLine2}
                              onChange={(e) => handleSellerFieldChange(index, "addressLine2", e.target.value)}
                              placeholder="முகவரி வரி 2 உள்ளிடவும்"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`sellerAddressLine3-${index}`}>முகவரி வரி 3</Label>
                            <Input
                              type="text"
                              id={`sellerAddressLine3-${index}`}
                              value={seller.addressLine3}
                              onChange={(e) => handleSellerFieldChange(index, "addressLine3", e.target.value)}
                              placeholder="முகவரி வரி 3 உள்ளிடவும்"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`sellerTaluk-${index}`}>வட்டம்</Label>
                            <Input
                              type="text"
                              id={`sellerTaluk-${index}`}
                              value={seller.taluk}
                              onChange={(e) => handleSellerFieldChange(index, "taluk", e.target.value)}
                              placeholder="வட்டத்தை உள்ளிடவும்"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`sellerDistrict-${index}`}>மாவட்டம்</Label>
                            <Input
                              type="text"
                              id={`sellerDistrict-${index}`}
                              value={seller.district}
                              onChange={(e) => handleSellerFieldChange(index, "district", e.target.value)}
                              placeholder="மாவட்டத்தை உள்ளிடவும்"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`sellerPincode-${index}`}>பின்கோடு</Label>
                            <Input
                              type="text"
                              id={`sellerPincode-${index}`}
                              value={seller.pincode}
                              onChange={(e) => handleSellerFieldChange(index, "pincode", e.target.value)}
                              placeholder="பின்கோடை உள்ளிடவும்"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`sellerAadharNo-${index}`}>ஆதார் எண்</Label>
                            <Input
                              type="text"
                              id={`sellerAadharNo-${index}`}
                              value={seller.aadharNo}
                              onChange={(e) => handleSellerFieldChange(index, "aadharNo", e.target.value)}
                              placeholder="ஆதார் எண்ணை உள்ளிடவும்"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`sellerPhoneNo-${index}`}>கைபேசி எண்</Label>
                            <Input
                              type="text"
                              id={`sellerPhoneNo-${index}`}
                              value={seller.phoneNo}
                              onChange={(e) => handleSellerFieldChange(index, "phoneNo", e.target.value)}
                              placeholder="கைபேசி எண்ணை உள்ளிடவும்"
                            />
                          </div>
                        </div>
                        {sellers.length > 1 && (
                          <Button variant="destructive" onClick={() => removeSeller(index)} className="mt-4">
                            நீக்கு
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button onClick={addSeller}>விற்பவரைச் சேர்க்கவும்</Button>
                  </CardContent>
                </Card>
                {/* Add navigation buttons */}
                <div className="flex justify-between mt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePreviousTab}
                    disabled={activeTab === "basic-details"}
                  >
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    பின்னால்
                  </Button>
                  <Button type="button" onClick={handleNextTab} disabled={activeTab === "preview"}>
                    அடுத்து
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="property">
                <Card>
                  <CardHeader>
                    <CardTitle>சொத்து விவரங்கள்</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <MultiplePropertySelector
                      properties={availableProperties}
                      selectedProperties={selectedProperties}
                      onPropertiesChange={handlePropertiesChange}
                    />
                  </CardContent>
                </Card>
                {/* Add navigation buttons */}
                <div className="flex justify-between mt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePreviousTab}
                    disabled={activeTab === "basic-details"}
                  >
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    பின்னால்
                  </Button>
                  <Button type="button" onClick={handleNextTab} disabled={activeTab === "preview"}>
                    அடுத்து
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="witnesses">
                <Card>
                  <CardHeader>
                    <CardTitle>சாட்சிகள்</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {witnesses.map((witness, index) => (
                      <div key={index} className="border p-4 rounded-md">
                        <h3 className="text-lg font-semibold mb-2">சாட்சி {index + 1}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor={`witnessName-${index}`}>பெயர்</Label>
                            <Select
                              value={selectedWitnessIds[index]}
                              onValueChange={(value) => handleWitnessSelection(index, value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="சாட்சியைத் தேர்ந்தெடுக்கவும்" />
                              </SelectTrigger>
                              <SelectContent>
                                {users.map((user) => (
                                  <SelectItem key={user.id} value={user.id.toString()}>
                                    {user.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {!selectedWitnessIds[index] && (
                              <>
                                <Input
                                  type="text"
                                  id={`witnessName-${index}`}
                                  value={witness.name}
                                  onChange={(e) => handleWitnessChange(index, "name", e.target.value)}
                                  placeholder="பெயரை உள்ளிடவும்"
                                />
                                <div className="space-y-2">
                                  <Label htmlFor={`witnessAge-${index}`}>வயது</Label>
                                  <Input
                                    type="number"
                                    id={`witnessAge-${index}`}
                                    value={witness.age}
                                    onChange={(e) => handleWitnessChange(index, "age", e.target.value)}
                                    placeholder="வயதை உள்ளிடவும்"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor={`witnessRelationshipType-${index}`}>உறவு முறை</Label>
                                  <Input
                                    type="text"
                                    id={`witnessRelationshipType-${index}`}
                                    value={witness.relationshipType}
                                    onChange={(e) => handleWitnessChange(index, "relationshipType", e.target.value)}
                                    placeholder="உறவு முறையை உள்ளிடவும்"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor={`witnessRelationName-${index}`}>தொடர்புடைய பெயர்</Label>
                                  <Input
                                    type="text"
                                    id={`witnessRelationName-${index}`}
                                    value={witness.relationName}
                                    onChange={(e) => handleWitnessChange(index, "relationName", e.target.value)}
                                    placeholder="தொடர்புடைய பெயரை உள்ளிடவும்"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor={`witnessDoorNo-${index}`}>கதவு எண்</Label>
                                  <Input
                                    type="text"
                                    id={`witnessDoorNo-${index}`}
                                    value={witness.doorNo}
                                    onChange={(e) => handleWitnessChange(index, "doorNo", e.target.value)}
                                    placeholder="கதவு எண்ணை உள்ளிடவும்"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor={`witnessAddressLine1-${index}`}>முகவரி வரி 1</Label>
                                  <Input
                                    type="text"
                                    id={`witnessAddressLine1-${index}`}
                                    value={witness.addressLine1}
                                    onChange={(e) => handleWitnessChange(index, "addressLine1", e.target.value)}
                                    placeholder="முகவரி வரி 1 உள்ளிடவும்"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor={`witnessAddressLine2-${index}`}>முகவரி வரி 2</Label>
                                  <Input
                                    type="text"
                                    id={`witnessAddressLine2-${index}`}
                                    value={witness.addressLine2}
                                    onChange={(e) => handleWitnessChange(index, "addressLine2", e.target.value)}
                                    placeholder="முகவரி வரி 2 உள்ளிடவும்"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor={`witnessAddressLine3-${index}`}>முகவரி வரி 3</Label>
                                  <Input
                                    type="text"
                                    id={`witnessAddressLine3-${index}`}
                                    value={witness.addressLine3}
                                    onChange={(e) => handleWitnessChange(index, "addressLine3", e.target.value)}
                                    placeholder="முகவரி வரி 3 உள்ளிடவும்"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor={`witnessTaluk-${index}`}>வட்டம்</Label>
                                  <Input
                                    type="text"
                                    id={`witnessTaluk-${index}`}
                                    value={witness.taluk}
                                    onChange={(e) => handleWitnessChange(index, "taluk", e.target.value)}
                                    placeholder="வட்டத்தை உள்ளிடவும்"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor={`witnessDistrict-${index}`}>மாவட்டம்</Label>
                                  <Input
                                    type="text"
                                    id={`witnessDistrict-${index}`}
                                    value={witness.district}
                                    onChange={(e) => handleWitnessChange(index, "district", e.target.value)}
                                    placeholder="மாவட்டத்தை உள்ளிடவும்"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor={`witnessPincode-${index}`}>பின்கோடு</Label>
                                  <Input
                                    type="text"
                                    id={`witnessPincode-${index}`}
                                    value={witness.pincode}
                                    onChange={(e) => handleWitnessChange(index, "pincode", e.target.value)}
                                    placeholder="பின்கோடை உள்ளிடவும்"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor={`witnessAadharNo-${index}`}>ஆதார் எண்</Label>
                                  <Input
                                    type="text"
                                    id={`witnessAadharNo-${index}`}
                                    value={witness.aadharNo}
                                    onChange={(e) => handleWitnessChange(index, "aadharNo", e.target.value)}
                                    placeholder="ஆதார் எண்ணை உள்ளிடவும்"
                                  />
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
                {/* Add navigation buttons */}
                <div className="flex justify-between mt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePreviousTab}
                    disabled={activeTab === "basic-details"}
                  >
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    பின்னால்
                  </Button>
                  <Button type="button" onClick={handleNextTab} disabled={activeTab === "preview"}>
                    அடுத்து
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="preview">
                <Card>
                  <CardHeader>
                    <CardTitle>முன்னோட்டம்</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div id="document-preview" dangerouslySetInnerHTML={{ __html: previewContent }} />
                  </CardContent>
                </Card>

                <div className="flex justify-end space-x-2 mt-4">
                  <Button variant="outline" onClick={generatePreview}>
                    <FileText className="mr-2 h-4 w-4" />
                    முன்னோட்டம் உருவாக்கு
                  </Button>
                  <Button onClick={handleExportPdf} disabled={isSubmitting}>
                    <FileDown className="mr-2 h-4 w-4" />
                    PDF ஏற்றுமதி
                  </Button>
                  <Button onClick={handleExportDocx} disabled={isSubmitting}>
                    <FileDown className="mr-2 h-4 w-4" />
                    Word Document ஏற்றுமதி
                  </Button>
                </div>
                {/* Add navigation buttons */}
                <div className="flex justify-between mt-6">
                  <Button type="button" variant="outline" onClick={handlePreviousTab}>
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    பின்னால்
                  </Button>
                  <Button type="submit" disabled={isPending}>
                    {isPending ? "சமர்ப்பிக்கிறது..." : "சமர்ப்பி"}
                    <Save className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                சேமிக்கிறது...
              </>
            ) : (
              "கிரைய உடன்படிக்கை ஆவணத்தை சேமிக்கவும்"
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
