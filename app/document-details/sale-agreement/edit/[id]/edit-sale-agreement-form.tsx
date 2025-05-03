"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { format, parse } from "date-fns"
import { convertToTamilNumber } from "@/lib/number-to-words"
import { updateDocument } from "../update-document-action"
import { getSupabaseBrowserClient } from "@/lib/supabase"
import Link from "next/link"
import { Textarea } from "@/components/ui/textarea"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Loader2, Home, ArrowLeft } from "lucide-react"

// Define interfaces for data types
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

interface DocumentProps {
  document: any
}

export default function EditSaleAgreementForm({ document }: DocumentProps) {
  const router = useRouter()
  const [previewContent, setPreviewContent] = useState(document.document_content || "")
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

  // Form state
  const [documentName, setDocumentName] = useState(document.document_name || "")

  // Basic Details
  const [documentDate, setDocumentDate] = useState<Date | undefined>(
    document.document_date ? parse(document.document_date.split("T")[0], "yyyy-MM-dd", new Date()) : undefined,
  )
  const [agreementAmount, setAgreementAmount] = useState(document.agreement_amount?.toString() || "")
  const [agreementAmountWords, setAgreementAmountWords] = useState(document.agreement_amount_words || "")
  const [advanceAmount, setAdvanceAmount] = useState("")
  const [advanceAmountWords, setAdvanceAmountWords] = useState("")
  const [balanceAmount, setBalanceAmount] = useState("")
  const [balanceAmountWords, setBalanceAmountWords] = useState("")
  const [timeFrame, setTimeFrame] = useState(document.agreement_duration || "")
  const [timeFrameType, setTimeFrameType] = useState("days")

  // Previous Document Details
  const [previousDocumentDate, setPreviousDocumentDate] = useState<Date | undefined>(
    document.previous_document_date
      ? parse(document.previous_document_date.split("T")[0], "yyyy-MM-dd", new Date())
      : undefined,
  )
  const [subRegistrarOfficeId, setSubRegistrarOfficeId] = useState(document.sub_registrar_office_id?.toString() || "")
  const [bookNumberId, setBookNumberId] = useState(document.book_number_id?.toString() || "")
  const [documentYear, setDocumentYear] = useState(document.document_year || "")
  const [documentNumber, setDocumentNumber] = useState(document.document_number || "")
  const [documentTypeId, setDocumentTypeId] = useState(document.document_type_id?.toString() || "")

  // Buyer Details
  const [selectedBuyerId, setSelectedBuyerId] = useState("")
  const [buyerName, setBuyerName] = useState("")
  const [buyerAge, setBuyerAge] = useState("")
  const [buyerRelationshipType, setBuyerRelationshipType] = useState("")
  const [buyerRelationName, setBuyerRelationName] = useState("")
  const [buyerDoorNo, setBuyerDoorNo] = useState("")
  const [buyerAddressLine1, setBuyerAddressLine1] = useState("")
  const [buyerAddressLine2, setBuyerAddressLine2] = useState("")
  const [buyerAddressLine3, setBuyerAddressLine3] = useState("")
  const [buyerTaluk, setBuyerTaluk] = useState("")
  const [buyerDistrict, setBuyerDistrict] = useState("")
  const [buyerPincode, setBuyerPincode] = useState("")
  const [buyerAadharNo, setBuyerAadharNo] = useState("")
  const [buyerPhoneNo, setBuyerPhoneNo] = useState("")

  // Seller Details
  const [selectedSellerId, setSelectedSellerId] = useState("")
  const [sellerName, setSellerName] = useState("")
  const [sellerAge, setSellerAge] = useState("")
  const [sellerRelationshipType, setSellerRelationshipType] = useState("")
  const [sellerRelationName, setSellerRelationName] = useState("")
  const [sellerDoorNo, setSellerDoorNo] = useState("")
  const [sellerAddressLine1, setSellerAddressLine1] = useState("")
  const [sellerAddressLine2, setSellerAddressLine2] = useState("")
  const [sellerAddressLine3, setSellerAddressLine3] = useState("")
  const [sellerTaluk, setSellerTaluk] = useState("")
  const [sellerDistrict, setSellerDistrict] = useState("")
  const [sellerPincode, setSellerPincode] = useState("")
  const [sellerAadharNo, setSellerAadharNo] = useState("")
  const [sellerPhoneNo, setSellerPhoneNo] = useState("")

  // Property Details
  const [propertyDetails, setPropertyDetails] = useState(document.propertyDetails?.[0] || "")

  // Witnesses
  const [selectedWitnessIds, setSelectedWitnessIds] = useState(document.witnesses?.map(String) || ["", ""])
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
  const [selectedTypistId, setSelectedTypistId] = useState(document.typist_id?.toString() || "")
  const [typistName, setTypistName] = useState("")
  const [typistPhone, setTypistPhone] = useState(document.typist_phone || "")
  const [selectedOfficeId, setSelectedOfficeId] = useState(document.office_id?.toString() || "")
  const [typistOffice, setTypistOffice] = useState("")

  // Relationship types
  const relationshipTypes = [
    { value: "மகன்", label: "மகன்" },
    { value: "மகள்", label: "மகள்" },
    { value: "மனைவி", label: "மனைவி்" },
    { value: "தந்தை", label: "தந்தை" },
    { value: "தாய்", label: "தாய்" },
    { value: "சகோதரர்", label: "சகோதரர்" },
    { value: "சகோதரி", label: "சகோதரி" },
  ]

  // Time frame types
  const timeFrameTypes = [
    { value: "days", label: "நாட்கள்" },
    { value: "months", label: "மாதங்கள்" },
    { value: "years", label: "ஆண்டுகள்" },
    { value: "date", label: "தேத���" },
  ]

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

        // Load buyer and seller details if they exist
        if (document.buyers && document.buyers.length > 0) {
          const buyerId = document.buyers[0]
          setSelectedBuyerId(buyerId.toString())
          handleBuyerChange(buyerId.toString())
        }

        if (document.sellers && document.sellers.length > 0) {
          const sellerId = document.sellers[0]
          setSelectedSellerId(sellerId.toString())
          handleSellerChange(sellerId.toString())
        }

        // Load typist details
        if (document.typist_id) {
          handleTypistChange(document.typist_id.toString())
        }

        if (document.office_id) {
          handleOfficeChange(document.office_id.toString())
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        toast.error("தரவுகளை பெறுவதில் பிழை ஏற்பட்டது")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [document])

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

  // Handle buyer selection
  const handleBuyerChange = (userId: string) => {
    setSelectedBuyerId(userId)
    if (!userId) return

    const selectedUser = users.find((user) => user.id.toString() === userId)
    if (selectedUser) {
      setBuyerName(selectedUser.name || "")
      setBuyerAge(selectedUser.age?.toString() || "")
      setBuyerRelationshipType(selectedUser.relation_type || "")
      setBuyerRelationName(selectedUser.relative_name || "")
      setBuyerDoorNo(selectedUser.door_number || "")
      setBuyerAddressLine1(selectedUser.address_line1 || "")
      setBuyerAddressLine2(selectedUser.address_line2 || "")
      setBuyerAddressLine3(selectedUser.address_line3 || "")
      setBuyerTaluk(selectedUser.taluks?.name || "")
      setBuyerDistrict(selectedUser.districts?.name || "")
      setBuyerPincode(selectedUser.pincode || "")
      setBuyerAadharNo(selectedUser.aadhaar_number || "")
      setBuyerPhoneNo(selectedUser.phone || "")
    }
  }

  // Handle seller selection
  const handleSellerChange = (userId: string) => {
    setSelectedSellerId(userId)
    if (!userId) return

    const selectedUser = users.find((user) => user.id.toString() === userId)
    if (selectedUser) {
      setSellerName(selectedUser.name || "")
      setSellerAge(selectedUser.age?.toString() || "")
      setSellerRelationshipType(selectedUser.relation_type || "")
      setSellerRelationName(selectedUser.relative_name || "")
      setSellerDoorNo(selectedUser.door_number || "")
      setSellerAddressLine1(selectedUser.address_line1 || "")
      setSellerAddressLine2(selectedUser.address_line2 || "")
      setSellerAddressLine3(selectedUser.address_line3 || "")
      setSellerTaluk(selectedUser.taluks?.name || "")
      setSellerDistrict(selectedUser.districts?.name || "")
      setSellerPincode(selectedUser.pincode || "")
      setSellerAadharNo(selectedUser.aadhaar_number || "")
      setSellerPhoneNo(selectedUser.phone || "")
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

  // Get sub-registrar office name by ID
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

  // Update preview content
  const updatePreview = () => {
    const formattedDocDate = documentDate ? format(documentDate, "yyyy-'ம் வருடம்' MMMM 'மாதம்' dd-'ம் தேதியில்'") : ""
    const formattedPrevDocDate = previousDocumentDate ? format(previousDocumentDate, "dd/MM/yyyy") : ""

    const subRegistrarOfficeName = getSubRegistrarOfficeName(subRegistrarOfficeId)
    const bookNumberValue = getBookNumber(bookNumberId)
    const documentTypeName = getDocumentTypeName(documentTypeId)

    const content = `
      <div class="p-8 bg-white">
        <h1 class="text-3xl font-bold text-center mb-6">கிரைய உடன்படிக்கை பத்திரம்</h1>
        <p class="text-lg text-center mb-6">${formattedDocDate}</p>
        
        <p class="mb-6 text-justify">
          ${buyerDistrict} மாவட்டம்- ${buyerPincode}, ${buyerTaluk} வட்டம், ${buyerAddressLine3}, ${buyerAddressLine2}, ${buyerAddressLine1}, கதவு எண்:- ${buyerDoorNo} என்ற முகவரியில் வசித்து வருபவரும், ${buyerRelationName} அவர்களின் ${buyerRelationshipType} ${buyerAge} வயதுடைய ${buyerName} (ஆதார் அடையாள அட்டை எண்:- ${buyerAadharNo}, கைப்பேசி எண்:- ${buyerPhoneNo})-(1), ${sellerDistrict} மாவட்டம்- ${sellerPincode}, ${sellerTaluk} வட்டம், ${sellerAddressLine3}, ${sellerAddressLine2}, ${sellerAddressLine1}, கதவு எண்:- ${sellerDoorNo} என்ற முகவரியில் வசித்து வருபவரும், ${sellerRelationName} அவர்களின் ${sellerRelationshipType} ${sellerAge} வயதுடைய ${sellerName} (ஆதார் அடையாள அட்டை எண்:- ${sellerAadharNo}, கைப்பேசி எண்:- ${sellerPhoneNo})-(2)
        </p>
        
        <p class="mb-6 text-justify">
          ஆகிய நாம் இருவரும் சம்மதித்து எழுதி வைத்துக் கொண்ட கிரைய உடன்படிக்கை பத்திரம் என்னவென்றால், நம்மில் 2-லக்கமிட்டவருக்கு கடந்த ${sellerName} என்பவருக்கு, ${formattedPrevDocDate}-ம் தேதியில், ${subRegistrarOfficeName} சார்பதிவாளர் அலுவலகம் ${bookNumberValue} புத்தகம் ${documentYear}-ம் ஆண்டின் ${documentNumber}-ம் எண்ணாக பதிவு செய்யப்பட்ட ${documentTypeName} ஆவணத்தின் படி பாத்தியப்பட்ட கீழ்கண்ட சொத்துக்களை, நம்மில் 2-லக்கமிட்டவர், நம்மில் 1-லக்கமிட்டவருக்கு ரூ.${agreementAmount}/-(ரூபாய் ${agreementAmountWords} மட்டும்) கிரையத்துக்கு பேசி கொடுப்பதாக ஒப்புக்கொண்டு, நம்மில் 1-லக்கமிட்டவரிடமிருந்து ரூ.${advanceAmount}/-(ரூபாய் ${advanceAmountWords} மட்டும்) மட்டும் முன்பணமாக நம்மில் 2-லக்கமிட்டவர் கீழ்கண்ட சாட்சிகள் முன்னிலையில் ரொக்கமாக பெற்றுக் கொண்டுள்ளார்.
        </p>
        
        <p class="mb-6 text-justify">
          நம்மில் 1-லக்கமிட்டவர், நம்மில் 2-லக்கமிட்டவருக்கு நாளது தேதியில் இருந்து எதிர்வரும் ${timeFrame} ${timeFrameType === "days" ? "நாட்களுக்குள்" : timeFrameType === "months" ? "மாதங்களுக்குள்" : timeFrameType === "years" ? "ஆண்டுகளுக்குள்" : "தேதிக்குள்"}, மீதி பாக்கி தொகை ரூ.${balanceAmount}/-(ரூபாய் ${balanceAmountWords} மட்டும்)-செலுத்தி தன் சொந்த செலவில் கிரையம் செய்து கொள்ள வேண்டியது.
        </p>
        
        <p class="mb-6 text-justify">
          நாளது தேதியில் இருந்து மேற்படி கெடுவிற்குள் நம்மில் 1-லக்கமிட்டவர் மேற்படி பாக்கி தொகையை நம்மில் 2-லக்கமிட்டவருக்கு செலுத்தி, நம்மில் 1-லக்கமிட்டவர் தன் சொந்த செலவில் கிரையம் செய்து கொள்ள தயாராக இருந்து, நம்மில் 1-லக்கமிட்டவர் கிரையம் செய்து கொடுக்கும் படி கூப்பிடும்போது, நம்மில் 2-லக்கமிட்டவர் சர்வ வில்லங்க சுத்தியாய் சகல வாரிசுகள் சகிதமாய், நம்மில் 1-லக்கமிட்டவருக்கோ அல்லது அவர் கோரும் நபருக்கோ கிரையமும் சுவாதீனம் செய்து கொடுத்து விட வேண்டியது.
        </p>
        
        <p class="mb-6 text-justify">
          அப்படி நம்மில் 2-லக்கமிட்டவர் கிரையமும் சுவாதீனமும் செய்து கொடுக்க மறுத்தாலும் அல்லது வீண் காலதாமதம் செய்தாலும் நம்மில் 1-லக்கமிட்டவர் மேற்படி பாக்கி தொகையை தகுந்த நீதிமன்றத்தில் டெபாசிட் செய்து, நம்மில் 2-லக்கமிட்டவரின் அனுமதி இல்லாமலேயே நம்மில் 1-லக்கமிட்டவரால் கட்டாய கிரையம் செய்து கொள்ள வேண்டியது ஆகும்.
        </p>
        
        <p class="mb-6 text-justify">
          இதற்கு ஆகும் நீதிமன்ற செலவினங்களுக்கும், இதர செலவினங்களுக்கும் ���ேற்படி டெபாசிட் தொகையில் பிடித்தம் செய்துகொள்ள வேண்டியதாகும்.
        </p>
        
        <p class="mb-6 text-justify">
          மேற்படி கெடுவிற்குள் நம்மில் 1-லக்கமிட்டவர் கிரையம் செய்ய தவறினால் இன்று 2-லக்கமிட்டவருக்கு செலுத்திய முன்பணத்தை இழந்து விடவேண்டியது ஆகும்.
        </p>
        
        <p class="mb-6 text-justify">
          இந்த படிக்கு நாம் இருவரும் சேர்ந்து சம்மதித்து எழுதி வைத்துக் கொண்ட சுவாதீனம் இல்லாத கிரைய உடன்படிக்கை பத்திரம்.
        </p>
        
        <h3 class="text-xl font-semibold mb-2 text-center">சொத்து விவரம்</h3>
        <p class="mb-6 whitespace-pre-line">${propertyDetails}</p>
        
        <h3 class="text-xl font-semibold mb-2">சாட்சிகள்</h3>
        <ol class="list-decimal pl-5 mb-6">
          ${witnesses
            .map(
              (witness, index) => `
            <li class="mb-2">
              ${witness.name}, ${witness.relationshipType}.${witness.relationName}, கதவு எண்:-${witness.doorNo}, ${witness.addressLine1}, ${witness.addressLine2}, ${witness.addressLine3}, ${witness.taluk} வட்டம், ${witness.district} மாவட்டம்  ${witness.addressLine3}, ${witness.taluk} வட்டம், ${witness.district} மாவட்டம்-${witness.pincode}, (வயது-${witness.age}) (ஆதார் அடையாள அட்டை எண்:-${witness.aadharNo})
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
          <div class="font-semibold">எழுதிக்கொடுப்பவர்</div>
          <div class="font-semibold">எழுதிவாங்குபவர்</div>
        </div>
      </div>
    `

    setPreviewContent(content)
  }

  // Generate document preview
  const generatePreview = () => {
    updatePreview()
    setActiveTab("preview")
  }

  // Handle form submission
  const handleSubmit = async () => {
    if (!documentName) {
      toast.error("ஆவணத்தின் பெயரை உள்ளிடவும்")
      return
    }

    try {
      setIsSubmitting(true)

      // Format dates for submission
      const formattedDocDate = documentDate ? formatDate(documentDate) : null
      const formattedPrevDocDate = previousDocumentDate ? formatDate(previousDocumentDate) : null

      // Prepare data for submission
      const data = {
        id: document.id,
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
        submissionTypeId: document.submission_type_id || null,
        typistId: selectedTypistId || null,
        typistPhone,
        officeId: selectedOfficeId || null,
        landTypes: document.land_types || [],
        valueTypes: document.value_types || [],
        paymentMethods: document.payment_methods || [],
        documentContent: previewContent,
        buyers: selectedBuyerId ? [Number.parseInt(selectedBuyerId)] : [],
        sellers: selectedSellerId ? [Number.parseInt(selectedSellerId)] : [],
        witnesses: selectedWitnessIds.filter((id) => id !== "").map((id) => Number.parseInt(id)),
        properties: document.properties || [],
        propertyDetails: [propertyDetails],
        agreementTerms: document.agreement_terms || [],
        agreementDuration: timeFrame,
        agreementStartDate: formattedDocDate,
        agreementEndDate: document.agreement_end_date || null,
      }

      // Update document
      const result = await updateDocument(data)

      if (result.success) {
        toast.success("கிரைய உடன்படிக்கை ஆவணம் வெற்றிகரமாக புதுப்��ிக்கப்பட்டது")
        router.push(`/document-details/sale-agreement/view/${result.documentId}`)
      } else {
        toast.error(`ஆவணத்தை புதுப்பிப்பதில் பிழை: ${result.error}`)
      }
    } catch (error) {
      console.error("Error updating document:", error)
      toast.error("ஆவணத்தை புதுப்பிப்பதில் பிழை ஏற்பட்டது")
    } finally {
      setIsSubmitting(false)
    }
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
    <div className="flex min-h-screen flex-col bg-violet-50">
      <div className="flex items-center gap-2 p-4 bg-violet-50">
        <Button asChild variant="outline" className="border-violet-300 text-violet-700 hover:bg-violet-100">
          <Link href="/document-details/sale-agreement">
            <ArrowLeft className="h-4 w-4 mr-2" />
            பின்செல்
          </Link>
        </Button>
        <Button asChild variant="outline" className="border-violet-300 text-violet-700 hover:bg-violet-100">
          <Link href="/">
            <Home className="h-4 w-4 mr-2" />
            முகப்பு
          </Link>
        </Button>
      </div>

      <div className="container mx-auto p-6">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-violet-800">கிரைய உடன்படிக்கை ஆவணத்தை திருத்து</h1>
            <div className="flex items-center gap-2"></div>
          </div>

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

          <div className="grid grid-cols-1">
            <div>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="documentDate">ஆவண தேதி</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="outline" className="w-full justify-start text-left font-normal">
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {documentDate ? format(documentDate, "PPP") : "தேதியைத் தேர்ந்தெடுக்கவும்"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar mode="single" selected={documentDate} onSelect={setDocumentDate} initialFocus />
                            </PopoverContent>
                          </Popover>
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
                          {agreementAmount && (
                            <p className="text-sm text-gray-500">ரூபாய் {agreementAmountWords} மட்டும்</p>
                          )}
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
                          <Input
                            id="balanceAmount"
                            type="number"
                            value={balanceAmount}
                            readOnly
                            placeholder="மீதி தொகை"
                          />
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
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                                      <CalendarIcon className="mr-2 h-4 w-4" />
                                      {previousDocumentDate
                                        ? format(previousDocumentDate, "PPP")
                                        : "தேதியைத் தேர்ந்தெடுக்கவும்"}
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-auto p-0">
                                    <Calendar
                                      mode="single"
                                      selected={previousDocumentDate}
                                      onSelect={setPreviousDocumentDate}
                                      initialFocus
                                    />
                                  </PopoverContent>
                                </Popover>
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

                        <AccordionItem value="typist-details">
                          <AccordionTrigger>தட்டச்சு விவரங்கள்</AccordionTrigger>
                          <AccordionContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                              <div className="space-y-2">
                                <Label htmlFor="typistName">தட்டச்சாளர்</Label>
                                <Select value={selectedTypistId} onValueChange={handleTypistChange}>
                                  <SelectTrigger>
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
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="typistPhone">தொலைபேசி எண்</Label>
                                <Input
                                  id="typistPhone"
                                  value={typistPhone}
                                  onChange={(e) => setTypistPhone(e.target.value)}
                                  placeholder="தொலைபேசி எண்ணை உள்ளிடவும்"
                                />
                              </div>

                              <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="typistOffice">அலுவலகம்</Label>
                                <Select value={selectedOfficeId} onValueChange={handleOfficeChange}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="அலுவலகத்தைத் தேர்ந்தெடுக்கவும்" />
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
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="parties">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>வாங்குபவர் விவரங்கள்</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="buyerSelect">வாங்குபவரைத் தேர்ந்தெடுக்கவும்</Label>
                          <Select value={selectedBuyerId} onValueChange={handleBuyerChange}>
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
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="buyerName">பெயர்</Label>
                          <Input
                            id="buyerName"
                            value={buyerName}
                            onChange={(e) => setBuyerName(e.target.value)}
                            placeholder="பெயரை உள்ளிடவும்"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="buyerAge">வயது</Label>
                            <Input
                              id="buyerAge"
                              value={buyerAge}
                              onChange={(e) => setBuyerAge(e.target.value)}
                              placeholder="வயதை உள்ளிடவும்"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="buyerRelationshipType">உறவு முறை</Label>
                            <Select value={buyerRelationshipType} onValueChange={setBuyerRelationshipType}>
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
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="buyerRelationName">உறவினர் பெயர்</Label>
                          <Input
                            id="buyerRelationName"
                            value={buyerRelationName}
                            onChange={(e) => setBuyerRelationName(e.target.value)}
                            placeholder="உறவினர் பெயரை உள்ளிடவும்"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="buyerDoorNo">கதவு எண்</Label>
                          <Input
                            id="buyerDoorNo"
                            value={buyerDoorNo}
                            onChange={(e) => setBuyerDoorNo(e.target.value)}
                            placeholder="கதவு எண்ணை உள்ளிடவும்"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="buyerAddressLine1">முகவரி வரி 1</Label>
                          <Input
                            id="buyerAddressLine1"
                            value={buyerAddressLine1}
                            onChange={(e) => setBuyerAddressLine1(e.target.value)}
                            placeholder="முகவரி வரி 1 உள்ளிடவும்"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="buyerAddressLine2">முகவரி வரி 2</Label>
                          <Input
                            id="buyerAddressLine2"
                            value={buyerAddressLine2}
                            onChange={(e) => setBuyerAddressLine2(e.target.value)}
                            placeholder="முகவரி வரி 2 உள்ளிடவும்"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="buyerAddressLine3">முகவரி வரி 3</Label>
                          <Input
                            id="buyerAddressLine3"
                            value={buyerAddressLine3}
                            onChange={(e) => setBuyerAddressLine3(e.target.value)}
                            placeholder="முகவரி வரி 3 உள்ளிடவும்"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="buyerTaluk">வட்டம்</Label>
                            <Input
                              id="buyerTaluk"
                              value={buyerTaluk}
                              onChange={(e) => setBuyerTaluk(e.target.value)}
                              placeholder="வட்டத்��ை உள்ளிடவும்"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="buyerDistrict">மாவட்டம்</Label>
                            <Input
                              id="buyerDistrict"
                              value={buyerDistrict}
                              onChange={(e) => setBuyerDistrict(e.target.value)}
                              placeholder="மாவட்டத்தை உள்ளிடவும்"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="buyerPincode">அஞ்சல் குறியீடு</Label>
                          <Input
                            id="buyerPincode"
                            value={buyerPincode}
                            onChange={(e) => setBuyerPincode(e.target.value)}
                            placeholder="அஞ்சல் குறியீட்டை உள்ளிடவும்"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="buyerAadharNo">ஆதார் எண்</Label>
                          <Input
                            id="buyerAadharNo"
                            value={buyerAadharNo}
                            onChange={(e) => setBuyerAadharNo(e.target.value)}
                            placeholder="ஆதார் எண்ணை உள்ளிடவும்"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="buyerPhoneNo">தொலைபேசி எண்</Label>
                          <Input
                            id="buyerPhoneNo"
                            value={buyerPhoneNo}
                            onChange={(e) => setBuyerPhoneNo(e.target.value)}
                            placeholder="தொலைபேசி எண்ணை உள்ளிடவும்"
                          />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>விற்பவர் விவரங்கள்</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="sellerSelect">விற்பவரைத் தேர்ந்தெடுக்கவும்</Label>
                          <Select value={selectedSellerId} onValueChange={handleSellerChange}>
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
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="sellerName">பெயர்</Label>
                          <Input
                            id="sellerName"
                            value={sellerName}
                            onChange={(e) => setSellerName(e.target.value)}
                            placeholder="பெயரை உள்ளிடவும்"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="sellerAge">வயது</Label>
                            <Input
                              id="sellerAge"
                              value={sellerAge}
                              onChange={(e) => setSellerAge(e.target.value)}
                              placeholder="வயதை உள்ளிடவும்"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="sellerRelationshipType">உறவு முறை</Label>
                            <Select value={sellerRelationshipType} onValueChange={setSellerRelationshipType}>
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
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="sellerRelationName">உறவினர் பெயர்</Label>
                          <Input
                            id="sellerRelationName"
                            value={sellerRelationName}
                            onChange={(e) => setSellerRelationName(e.target.value)}
                            placeholder="உறவினர் பெயரை உள்ளிடவும்"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="sellerDoorNo">கதவு எண்</Label>
                          <Input
                            id="sellerDoorNo"
                            value={sellerDoorNo}
                            onChange={(e) => setSellerDoorNo(e.target.value)}
                            placeholder="கதவு எண்ணை உள்ளிடவும்"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="sellerAddressLine1">முகவரி வரி 1</Label>
                          <Input
                            id="sellerAddressLine1"
                            value={sellerAddressLine1}
                            onChange={(e) => setSellerAddressLine1(e.target.value)}
                            placeholder="முகவரி வரி 1 உள்ளிடவும்"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="sellerAddressLine2">முகவரி வரி 2</Label>
                          <Input
                            id="sellerAddressLine2"
                            value={sellerAddressLine2}
                            onChange={(e) => setSellerAddressLine2(e.target.value)}
                            placeholder="முகவரி வரி 2 உள்ளிடவும்"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="sellerAddressLine3">முகவரி வரி 3</Label>
                          <Input
                            id="sellerAddressLine3"
                            value={sellerAddressLine3}
                            onChange={(e) => setSellerAddressLine3(e.target.value)}
                            placeholder="முகவரி வரி 3 உள்ளிடவும்"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="sellerTaluk">வட்டம்</Label>
                            <Input
                              id="sellerTaluk"
                              value={sellerTaluk}
                              onChange={(e) => setSellerTaluk(e.target.value)}
                              placeholder="வட்டத்தை உள்ளிடவும்"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="sellerDistrict">மாவட்டம்</Label>
                            <Input
                              id="sellerDistrict"
                              value={sellerDistrict}
                              onChange={(e) => setSellerDistrict(e.target.value)}
                              placeholder="மாவட்டத்தை உள்ளிடவும்"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="sellerPincode">அஞ்சல் குறியீடு</Label>
                          <Input
                            id="sellerPincode"
                            value={sellerPincode}
                            onChange={(e) => setSellerPincode(e.target.value)}
                            placeholder="அஞ்சல் குறியீட்டை உள்ளிடவும்"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="sellerAadharNo">ஆதார் எண்</Label>
                          <Input
                            id="sellerAadharNo"
                            value={sellerAadharNo}
                            onChange={(e) => setSellerAadharNo(e.target.value)}
                            placeholder="ஆதார் எண்ணை உள்ளிடவும்"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="sellerPhoneNo">தொலைபேசி எண்</Label>
                          <Input
                            id="sellerPhoneNo"
                            value={sellerPhoneNo}
                            onChange={(e) => setSellerPhoneNo(e.target.value)}
                            placeholder="தொலைபேசி எண்ணை உள்ளிடவும்"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="property">
                  <Card>
                    <CardHeader>
                      <CardTitle>சொத்து விவரங்கள்</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="propertyDetails">சொத்து விவரங்கள்</Label>
                          <Textarea
                            id="propertyDetails"
                            value={propertyDetails}
                            onChange={(e) => setPropertyDetails(e.target.value)}
                            placeholder="சொத்து விவரங்களை உள்ளிடவும்"
                            className="min-h-[200px]"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="witnesses">
                  <Card>
                    <CardHeader>
                      <CardTitle>சாட்சிகள் விவரங்கள்</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {witnesses.map((witness, index) => (
                        <div key={index} className="mb-6 border p-4 rounded-md">
                          <h3 className="text-lg font-medium mb-4">சாட்சி {index + 1}</h3>
                          <div className="mb-4">
                            <Label htmlFor={`witnessSelect-${index}`}>சாட்சியைத் தேர்ந்தெடுக்கவும்</Label>
                            <Select
                              value={selectedWitnessIds[index]}
                              onValueChange={(value) => handleWitnessSelection(index, value)}
                            >
                              <SelectTrigger className="mt-1">
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
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor={`witnessName-${index}`}>பெயர்</Label>
                              <Input
                                id={`witnessName-${index}`}
                                value={witness.name}
                                onChange={(e) => handleWitnessChange(index, "name", e.target.value)}
                                placeholder="பெயரை உள்ளிடவும்"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor={`witnessAge-${index}`}>வயது</Label>
                              <Input
                                id={`witnessAge-${index}`}
                                value={witness.age}
                                onChange={(e) => handleWitnessChange(index, "age", e.target.value)}
                                placeholder="வயதை உள்ளிடவும்"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor={`witnessRelationshipType-${index}`}>உறவு முறை</Label>
                              <Select
                                value={witness.relationshipType}
                                onValueChange={(value) => handleWitnessChange(index, "relationshipType", value)}
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
                              <Label htmlFor={`witnessRelationName-${index}`}>உறவினர் பெயர்</Label>
                              <Input
                                id={`witnessRelationName-${index}`}
                                value={witness.relationName}
                                onChange={(e) => handleWitnessChange(index, "relationName", e.target.value)}
                                placeholder="உறவினர் பெயரை உள்ளிடவும்"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor={`witnessDoorNo-${index}`}>கதவு எண்</Label>
                              <Input
                                id={`witnessDoorNo-${index}`}
                                value={witness.doorNo}
                                onChange={(e) => handleWitnessChange(index, "doorNo", e.target.value)}
                                placeholder="கதவு எண்ணை உள்ளிடவும்"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor={`witnessAddressLine1-${index}`}>முகவரி வரி 1</Label>
                              <Input
                                id={`witnessAddressLine1-${index}`}
                                value={witness.addressLine1}
                                onChange={(e) => handleWitnessChange(index, "addressLine1", e.target.value)}
                                placeholder="முகவரி வரி 1 உள்ளிடவும்"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor={`witnessAddressLine2-${index}`}>முகவரி வரி 2</Label>
                              <Input
                                id={`witnessAddressLine2-${index}`}
                                value={witness.addressLine2}
                                onChange={(e) => handleWitnessChange(index, "addressLine2", e.target.value)}
                                placeholder="முகவரி வரி 2 உள்ளிடவும்"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor={`witnessAddressLine3-${index}`}>முகவரி வரி 3</Label>
                              <Input
                                id={`witnessAddressLine3-${index}`}
                                value={witness.addressLine3}
                                onChange={(e) => handleWitnessChange(index, "addressLine3", e.target.value)}
                                placeholder="முகவரி வரி 3 உள்ளிடவும்"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor={`witnessTaluk-${index}`}>வட்டம்</Label>
                              <Input
                                id={`witnessTaluk-${index}`}
                                value={witness.taluk}
                                onChange={(e) => handleWitnessChange(index, "taluk", e.target.value)}
                                placeholder="வட்டத்தை உள்ளிடவும்"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor={`witnessDistrict-${index}`}>மாவட்டம்</Label>
                              <Input
                                id={`witnessDistrict-${index}`}
                                value={witness.district}
                                onChange={(e) => handleWitnessChange(index, "district", e.target.value)}
                                placeholder="மாவட்டத்தை உள்ளிடவும்"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor={`witnessPincode-${index}`}>அஞ்சல் குறியீடு</Label>
                              <Input
                                id={`witnessPincode-${index}`}
                                value={witness.pincode}
                                onChange={(e) => handleWitnessChange(index, "pincode", e.target.value)}
                                placeholder="அஞ்சல் குறியீட்டை உள்ளிடவும்"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor={`witnessAadharNo-${index}`}>ஆதார் எண்</Label>
                              <Input
                                id={`witnessAadharNo-${index}`}
                                value={witness.aadharNo}
                                onChange={(e) => handleWitnessChange(index, "aadharNo", e.target.value)}
                                placeholder="ஆதார் எண்ணை உள்ளிடவும்"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="preview">
                  <Card>
                    <CardHeader>
                      <CardTitle>முன்னோட்டம்</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div dangerouslySetInnerHTML={{ __html: previewContent }} />
                    </CardContent>
                  </Card>
                </TabsContent>

                {activeTab !== "preview" && (
                  <div className="flex justify-between mt-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        const tabs = ["basic-details", "parties", "property", "witnesses", "preview"]
                        const currentIndex = tabs.indexOf(activeTab)
                        if (currentIndex > 0) {
                          setActiveTab(tabs[currentIndex - 1])
                        }
                      }}
                      disabled={activeTab === "basic-details"}
                    >
                      முந்தையது
                    </Button>
                    <Button
                      onClick={() => {
                        const tabs = ["basic-details", "parties", "property", "witnesses", "preview"]
                        const currentIndex = tabs.indexOf(activeTab)
                        if (currentIndex < tabs.length - 1) {
                          setActiveTab(tabs[currentIndex + 1])
                        } else {
                          generatePreview()
                        }
                      }}
                    >
                      {activeTab === "witnesses" ? "முன்னோட்டம்" : "அடுத்தது"}
                    </Button>
                  </div>
                )}

                {activeTab === "preview" && (
                  <div className="flex justify-between mt-4">
                    <Button variant="outline" onClick={() => setActiveTab("witnesses")}>
                      முந்தையது
                    </Button>
                    <Button disabled={isSubmitting} onClick={handleSubmit}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          புதுப்பிக்கிறது...
                        </>
                      ) : (
                        "புதுப்பி"
                      )}
                    </Button>
                  </div>
                )}
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
