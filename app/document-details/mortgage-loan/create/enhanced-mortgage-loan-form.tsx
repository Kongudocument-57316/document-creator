"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { v4 as uuidv4 } from "uuid"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getSupabaseBrowserClient } from "@/lib/supabase"
import { convertToTamilNumber } from "@/lib/number-to-words"
import { Button } from "@/components/ui/button"
import { UserSelector } from "./user-selector"
import { saveMortgageLoanDocument } from "./save-document-action"
import { useRouter } from "next/navigation"
import { PlusCircle, Trash2 } from "lucide-react"

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

interface EnhancedMortgageLoanFormProps {
  onFormChange: (values: MortgageLoanFormValues) => void
  initialValues?: MortgageLoanFormValues
  isEditMode?: boolean
}

export interface MortgageLoanFormValues {
  // Document date
  documentDate: string

  // Buyer details (multiple)
  buyers: MortgageParty[]

  // Seller details (multiple)
  sellers: MortgageParty[]

  // Property document details
  prDocumentDate: string
  subRegisterOffice: string
  prBookNo: string
  prDocumentYear: string
  prDocumentNo: string
  prDocumentType: string

  // Loan details
  loanAmount: string
  loanAmountInWords: string
  interestRate: string
  loanStartDate: string
  loanDuration: string
  loanDurationType: string

  // Property details
  propertyDetails: string

  // Witness details
  witness1Name: string
  witness1Age: string
  witness1RelationsName: string
  witness1RelationType: string
  witness1DoorNo: string
  witness1AddressLine1: string
  witness1AddressLine2: string
  witness1AddressLine3: string
  witness1Taluk: string
  witness1District: string
  witness1Pincode: string
  witness1AadharNo: string

  witness2Name: string
  witness2Age: string
  witness2RelationsName: string
  witness2RelationType: string
  witness2DoorNo: string
  witness2AddressLine1: string
  witness2AddressLine2: string
  witness2AddressLine3: string
  witness2Taluk: string
  witness2District: string
  witness2Pincode: string
  witness2AadharNo: string

  // Typist details
  typistName: string
  typistOfficeName: string
  typistPhoneNo: string
}

interface MortgageParty {
  id: string
  name: string
  age: string
  relationsName: string
  relationType: string
  doorNo: string
  addressLine1: string
  addressLine2: string
  addressLine3: string
  taluk: string
  district: string
  pincode: string
  aadharNo: string
  phoneNo: string
}

export function EnhancedMortgageLoanForm({
  onFormChange,
  initialValues,
  isEditMode = false,
}: EnhancedMortgageLoanFormProps) {
  const { toast } = useToast()
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("basic")
  const [formData, setFormData] = useState<MortgageLoanFormValues>(
    initialValues || {
      // Document date
      documentDate: new Date().toLocaleDateString("en-GB"), // Default to today's date in DD/MM/YYYY format

      // Buyer details (multiple)
      buyers: [
        {
          id: uuidv4(),
          name: "",
          age: "",
          relationsName: "",
          relationType: "",
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
      ],

      // Seller details (multiple)
      sellers: [
        {
          id: uuidv4(),
          name: "",
          age: "",
          relationsName: "",
          relationType: "",
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
      ],

      // Property document details
      prDocumentDate: "",
      subRegisterOffice: "",
      prBookNo: "",
      prDocumentYear: "",
      prDocumentNo: "",
      prDocumentType: "",

      // Loan details
      loanAmount: "",
      loanAmountInWords: "",
      interestRate: "",
      loanStartDate: new Date().toLocaleDateString("en-GB"), // Default to today's date
      loanDuration: "",
      loanDurationType: "மாதங்களுக்குள்", // Default value

      // Property details
      propertyDetails: "",

      // Witness details
      witness1Name: "",
      witness1Age: "",
      witness1RelationsName: "",
      witness1RelationType: "",
      witness1DoorNo: "",
      witness1AddressLine1: "",
      witness1AddressLine2: "",
      witness1AddressLine3: "",
      witness1Taluk: "",
      witness1District: "",
      witness1Pincode: "",
      witness1AadharNo: "",

      witness2Name: "",
      witness2Age: "",
      witness2RelationsName: "",
      witness2RelationType: "",
      witness2DoorNo: "",
      witness2AddressLine1: "",
      witness2AddressLine2: "",
      witness2AddressLine3: "",
      witness2Taluk: "",
      witness2District: "",
      witness2Pincode: "",
      witness2AadharNo: "",

      // Typist details
      typistName: "",
      typistOfficeName: "",
      typistPhoneNo: "",
    },
  )

  // State for dropdown data
  const [subRegistrarOffices, setSubRegistrarOffices] = useState<SubRegistrarOffice[]>([])
  const [bookNumbers, setBookNumbers] = useState<BookNumber[]>([])
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([])
  const [loading, setLoading] = useState(true)
  const [typistDetailsLoaded, setTypistDetailsLoaded] = useState(false)

  const supabase = getSupabaseBrowserClient()

  // Fetch data from settings
  useEffect(() => {
    const fetchSettingsData = async () => {
      setLoading(true)
      try {
        // Check if sub_registrar_offices table exists
        const { data: officesTableExists, error: officesTableError } = await supabase
          .from("information_schema.tables")
          .select("table_name")
          .eq("table_schema", "public")
          .eq("table_name", "sub_registrar_offices")
          .single()

        if (!officesTableError && officesTableExists) {
          // Fetch sub-registrar offices
          const { data: officesData, error: officesError } = await supabase
            .from("sub_registrar_offices")
            .select("*")
            .order("name")

          if (!officesError) {
            setSubRegistrarOffices(officesData || [])
          }
        }

        // Check if book_numbers table exists
        const { data: bookTableExists, error: bookTableError } = await supabase
          .from("information_schema.tables")
          .select("table_name")
          .eq("table_schema", "public")
          .eq("table_name", "book_numbers")
          .single()

        if (!bookTableError && bookTableExists) {
          // Fetch book numbers
          const { data: bookData, error: bookError } = await supabase.from("book_numbers").select("*").order("number")

          if (!bookError) {
            setBookNumbers(bookData || [])
          }
        }

        // Check if document_types table exists
        const { data: docTypeTableExists, error: docTypeTableError } = await supabase
          .from("information_schema.tables")
          .select("table_name")
          .eq("table_schema", "public")
          .eq("table_name", "document_types")
          .single()

        if (!docTypeTableError && docTypeTableExists) {
          // Fetch document types
          const { data: docTypeData, error: docTypeError } = await supabase
            .from("document_types")
            .select("*")
            .order("name")

          if (!docTypeError) {
            setDocumentTypes(docTypeData || [])
          }
        }
      } catch (error: any) {
        console.error("Error fetching settings data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSettingsData()
  }, [supabase])

  // Fetch typist details (only if not in edit mode or no initial values)
  useEffect(() => {
    if (isEditMode && initialValues) {
      // In edit mode with initial values, don't fetch typist details
      return
    }

    const loadTypistDetails = async () => {
      try {
        // Check if typist_offices table exists
        const { data: typistOfficesExists, error: typistOfficesError } = await supabase
          .from("information_schema.tables")
          .select("table_name")
          .eq("table_schema", "public")
          .eq("table_name", "typist_offices")
          .single()

        if (!typistOfficesError && typistOfficesExists) {
          // Fetch first typist office
          const { data: typistOfficeData, error: typistOfficeError } = await supabase
            .from("typist_offices")
            .select("*")
            .limit(1)
            .single()

          if (!typistOfficeError && typistOfficeData) {
            setFormData((prev) => ({
              ...prev,
              typistName: "தட்டச்சாளர்", // Default typist name
              typistOfficeName: typistOfficeData.name || "",
              typistPhoneNo: typistOfficeData.phone || "",
            }))
            setTypistDetailsLoaded(true)
          }
        }
      } catch (error: any) {
        console.error("Error loading typist details:", error)
      }
    }

    loadTypistDetails()
  }, [supabase, isEditMode, initialValues])

  // Auto-convert loan amount to words
  useEffect(() => {
    if (formData.loanAmount) {
      try {
        const amount = Number.parseFloat(formData.loanAmount.replace(/,/g, ""))
        if (!isNaN(amount)) {
          // Use the correct function from number-to-words.ts
          const amountInWords = convertToTamilNumber(amount)
          setFormData((prev) => ({
            ...prev,
            loanAmountInWords: amountInWords,
          }))
        }
      } catch (error) {
        // If conversion fails, don't update the words field
        console.error("Error converting amount to words:", error)
      }
    }
  }, [formData.loanAmount])

  // Update preview whenever form data changes
  useEffect(() => {
    onFormChange(formData)
  }, [formData, onFormChange])

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  // Handle changes to buyer fields
  const handleBuyerChange = (index: number, field: string, value: any) => {
    setFormData((prev) => {
      const updatedBuyers = [...prev.buyers]
      updatedBuyers[index] = { ...updatedBuyers[index], [field]: value }
      return { ...prev, buyers: updatedBuyers }
    })
  }

  // Handle changes to seller fields
  const handleSellerChange = (index: number, field: string, value: any) => {
    setFormData((prev) => {
      const updatedSellers = [...prev.sellers]
      updatedSellers[index] = { ...updatedSellers[index], [field]: value }
      return { ...prev, sellers: updatedSellers }
    })
  }

  // Add a new buyer
  const addBuyer = () => {
    setFormData((prev) => ({
      ...prev,
      buyers: [
        ...prev.buyers,
        {
          id: uuidv4(),
          name: "",
          age: "",
          relationsName: "",
          relationType: "",
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
      ],
    }))
  }

  // Add a new seller
  const addSeller = () => {
    setFormData((prev) => ({
      ...prev,
      sellers: [
        ...prev.sellers,
        {
          id: uuidv4(),
          name: "",
          age: "",
          relationsName: "",
          relationType: "",
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
      ],
    }))
  }

  // Remove a buyer
  const removeBuyer = (index: number) => {
    if (formData.buyers.length <= 1) {
      toast({
        title: "குறைந்தபட்சம் ஒரு அடமானம் பெறுபவர் தேவை",
        description: "குறைந்தபட்சம் ஒரு அடமானம் பெறுபவர் இருக்க வேண்டும்",
        variant: "destructive",
      })
      return
    }

    setFormData((prev) => ({
      ...prev,
      buyers: prev.buyers.filter((_, i) => i !== index),
    }))
  }

  // Remove a seller
  const removeSeller = (index: number) => {
    if (formData.sellers.length <= 1) {
      toast({
        title: "குறைந்தபட்சம் ஒரு அடமானம் கொடுப்பவர் தேவை",
        description: "குறைந்தபட்சம் ஒரு அடமானம் கொடுப்பவர் இருக்க வேண்டும்",
        variant: "destructive",
      })
      return
    }

    setFormData((prev) => ({
      ...prev,
      sellers: prev.sellers.filter((_, i) => i !== index),
    }))
  }

  const handleUpdatePreview = () => {
    onFormChange(formData)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Skip form submission in edit mode (handled by parent component)
    if (isEditMode) {
      return
    }

    // Validate required fields
    if (formData.buyers.some((buyer) => !buyer.name)) {
      toast({
        title: "தகவல் தேவை",
        description: "அனைத்து அடமானம் பெறுபவர்களின் பெயரை உள்ளிடவும்",
        variant: "destructive",
      })
      return
    }

    if (formData.sellers.some((seller) => !seller.name)) {
      toast({
        title: "தகவல் தேவை",
        description: "அனைத்து அடமானம் கொடுப்பவர்களின் பெயரை உள்ளிடவும்",
        variant: "destructive",
      })
      return
    }

    if (!formData.loanAmount) {
      toast({
        title: "தகவல் தேவை",
        description: "அடமான தொகையை உள்ளிடவும்",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSaving(true)

      // Call the server action to save the document
      const result = await saveMortgageLoanDocument(formData)

      if (result.success) {
        toast({
          title: "ஆவணம் சேமிக்கப்பட்டது",
          description: `அடமான கடன் ஆவணம் ${result.documentNumber} வெற்றிகரமாக சேமிக்கப்பட்டது.`,
        })

        // Redirect to the view page
        router.push(`/document-details/mortgage-loan/view/${result.documentId}`)
      } else {
        toast({
          title: "சேமிப்பதில் பிழை",
          description: result.error || "ஆவணத்தை சேமிப்பதில் பிழை ஏற்பட்டது",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      console.error("Save error:", error)
      toast({
        title: "சேமிப்பதில் பிழை",
        description: error.message || "ஆவணத்தை சேமிப்பதில் பிழை ஏற்பட்டது",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Handle user selection for mortgage receiver (buyer)
  const handleMortgageReceiverSelect = (user: User, index: number) => {
    setFormData((prev) => {
      const updatedBuyers = [...prev.buyers]
      updatedBuyers[index] = {
        ...updatedBuyers[index],
        name: user.name || "",
        relationsName: user.relative_name || "",
        relationType: user.relation_type || "",
        doorNo: user.door_no || "",
        addressLine1: user.address_line1 || "",
        addressLine2: user.address_line2 || "",
        addressLine3: user.address_line3 || "",
        taluk: user.taluk || user.taluk_name || "",
        district: user.district || user.district_name || "",
        pincode: user.pincode || "",
        aadharNo: user.aadhaar_number || "",
        phoneNo: user.phone || "",
      }
      return { ...prev, buyers: updatedBuyers }
    })
    toast({
      title: "அடமானம் பெறுபவர் சேர்க்கப்பட்டார்",
      description: `${user.name} அடமானம் பெறுபவராக சேர்க்கப்பட்டார்`,
    })
  }

  // Handle user selection for mortgage giver (seller)
  const handleMortgageGiverSelect = (user: User, index: number) => {
    setFormData((prev) => {
      const updatedSellers = [...prev.sellers]
      updatedSellers[index] = {
        ...updatedSellers[index],
        name: user.name || "",
        relationsName: user.relative_name || "",
        relationType: user.relation_type || "",
        doorNo: user.door_no || "",
        addressLine1: user.address_line1 || "",
        addressLine2: user.address_line2 || "",
        addressLine3: user.address_line3 || "",
        taluk: user.taluk || user.taluk_name || "",
        district: user.district || user.district_name || "",
        pincode: user.pincode || "",
        aadharNo: user.aadhaar_number || "",
        phoneNo: user.phone || "",
      }
      return { ...prev, sellers: updatedSellers }
    })
    toast({
      title: "அடமானம் கொடுப்பவர் சேர்க்கப்பட்டார்",
      description: `${user.name} அடமானம் கொடுப்பவராக சேர்க்கப்பட்டார்`,
    })
  }

  // Handle user selection for witness 1
  const handleWitness1Select = (user: User) => {
    setFormData((prev) => ({
      ...prev,
      witness1Name: user.name || "",
      witness1RelationsName: user.relative_name || "",
      witness1RelationType: user.relation_type || "",
      witness1DoorNo: user.door_no || "",
      witness1AddressLine1: user.address_line1 || "",
      witness1AddressLine2: user.address_line2 || "",
      witness1AddressLine3: user.address_line3 || "",
      witness1Taluk: user.taluk || user.taluk_name || "",
      witness1District: user.district || user.district_name || "",
      witness1Pincode: user.pincode || "",
      witness1AadharNo: user.aadhaar_number || "",
    }))
    toast({
      title: "முதல் சாட்சி சேர்க்கப்பட்டார்",
      description: `${user.name} முதல் சாட்சியாக சேர்க்கப்பட்டார்`,
    })
  }

  // Handle user selection for witness 2
  const handleWitness2Select = (user: User) => {
    setFormData((prev) => ({
      ...prev,
      witness2Name: user.name || "",
      witness2RelationsName: user.relative_name || "",
      witness2RelationType: user.relation_type || "",
      witness2DoorNo: user.door_no || "",
      witness2AddressLine1: user.address_line1 || "",
      witness2AddressLine2: user.address_line2 || "",
      witness2AddressLine3: user.address_line3 || "",
      witness2Taluk: user.taluk || user.taluk_name || "",
      witness2District: user.district || user.district_name || "",
      witness2Pincode: user.pincode || "",
      witness2AadharNo: user.aadhaar_number || "",
    }))
    toast({
      title: "இரண்டாவது சாட்சி சேர்க்கப்பட்டார்",
      description: `${user.name} ��ரண்டாவது சாட்சியாக சேர்க்கப்பட்டார்`,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5 mb-4 bg-gray-100 p-1 rounded-lg">
          <TabsTrigger
            value="basic"
            className="text-xs sm:text-sm whitespace-normal px-1 py-2 h-auto data-[state=active]:bg-cyan-100 data-[state=active]:text-cyan-900"
          >
            அடிப்படை விவரங்கள்
          </TabsTrigger>
          <TabsTrigger
            value="buyer"
            className="text-xs sm:text-sm whitespace-normal px-1 py-2 h-auto data-[state=active]:bg-lavender-100 data-[state=active]:text-lavender-900"
          >
            அடமானம் பெறுபவர் விவரங்கள்
          </TabsTrigger>
          <TabsTrigger
            value="seller"
            className="text-xs sm:text-sm whitespace-normal px-1 py-2 h-auto data-[state=active]:bg-mint-100 data-[state=active]:text-mint-900"
          >
            அடமானம் கொடுப்பவர் விவரங்கள்
          </TabsTrigger>
          <TabsTrigger
            value="property"
            className="text-xs sm:text-sm whitespace-normal px-1 py-2 h-auto data-[state=active]:bg-amber-100 data-[state=active]:text-amber-900"
          >
            சொத்து விவரங்கள்
          </TabsTrigger>
          <TabsTrigger
            value="witnesses"
            className="text-xs sm:text-sm whitespace-normal px-1 py-2 h-auto data-[state=active]:bg-teal-100 data-[state=active]:text-teal-900"
          >
            சாட்சிகள்
          </TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <Card className="bg-cyan-50 border-cyan-100">
            <CardHeader>
              <CardTitle>அடிப்படை விவரங்கள்</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="documentDate">ஆவண தேதி (DD/MM/YYYY)</Label>
                  <Input
                    id="documentDate"
                    value={formData.documentDate}
                    onChange={(e) => handleChange("documentDate", e.target.value)}
                    placeholder="DD/MM/YYYY"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="loanAmount">அடமான தொகை</Label>
                    <Input
                      id="loanAmount"
                      value={formData.loanAmount}
                      onChange={(e) => handleChange("loanAmount", e.target.value)}
                      placeholder="₹"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="loanAmountInWords">அடமான தொகை (எழுத்தில்)</Label>
                    <Input
                      id="loanAmountInWords"
                      value={formData.loanAmountInWords}
                      onChange={(e) => handleChange("loanAmountInWords", e.target.value)}
                      readOnly
                      className="bg-gray-50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="interestRate">வட்டி விகிதம்</Label>
                  <Input
                    id="interestRate"
                    value={formData.interestRate}
                    onChange={(e) => handleChange("interestRate", e.target.value)}
                    placeholder="%"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="loanStartDate">கடன் தொடக்க தேதி (DD/MM/YYYY)</Label>
                    <Input
                      id="loanStartDate"
                      value={formData.loanStartDate}
                      onChange={(e) => handleChange("loanStartDate", e.target.value)}
                      placeholder="DD/MM/YYYY"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="loanDuration">காலக்கெடு</Label>
                    <div className="flex gap-2">
                      <Input
                        id="loanDuration"
                        value={formData.loanDuration}
                        onChange={(e) => handleChange("loanDuration", e.target.value)}
                        placeholder="காலக்கெடு"
                        className="flex-1"
                      />
                      <Select
                        value={formData.loanDurationType}
                        onValueChange={(value) => handleChange("loanDurationType", value)}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="காலக்கெடு வகை" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="நாட்களுக்குள்">நாட்களுக்குள்</SelectItem>
                          <SelectItem value="மாதங்களுக்குள்">மாதங்களுக்குள்</SelectItem>
                          <SelectItem value="வருடத்திற்குள்">வருடத்திற்குள்</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-sky-50 border-sky-100">
            <CardHeader>
              <CardTitle>சொத்து ஆவண விவரங்கள்</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="prDocumentDate">PR ஆவண தேதி (DD/MM/YYYY)</Label>
                  <Input
                    id="prDocumentDate"
                    value={formData.prDocumentDate}
                    onChange={(e) => handleChange("prDocumentDate", e.target.value)}
                    placeholder="DD/MM/YYYY"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subRegisterOffice">சார்பதிவாளர் அலுவலகம்</Label>
                  <Select
                    value={formData.subRegisterOffice}
                    onValueChange={(value) => handleChange("subRegisterOffice", value)}
                    disabled={loading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="சார்பதிவாளர் அலுவலகத்தை தேர்ந்தெடுக்கவும்" />
                    </SelectTrigger>
                    <SelectContent>
                      {subRegistrarOffices.map((office) => (
                        <SelectItem key={office.id} value={office.name}>
                          {office.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="prBookNo">புத்தக எண்</Label>
                    <Select
                      value={formData.prBookNo}
                      onValueChange={(value) => handleChange("prBookNo", value)}
                      disabled={loading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="புத்தக எண்" />
                      </SelectTrigger>
                      <SelectContent>
                        {bookNumbers.map((book) => (
                          <SelectItem key={book.id} value={book.number}>
                            {book.number}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="prDocumentYear">ஆவண ஆண்டு</Label>
                    <Input
                      id="prDocumentYear"
                      value={formData.prDocumentYear}
                      onChange={(e) => handleChange("prDocumentYear", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="prDocumentNo">ஆவண எண்</Label>
                    <Input
                      id="prDocumentNo"
                      value={formData.prDocumentNo}
                      onChange={(e) => handleChange("prDocumentNo", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="prDocumentType">ஆவண வகை</Label>
                  <Select
                    value={formData.prDocumentType}
                    onValueChange={(value) => handleChange("prDocumentType", value)}
                    disabled={loading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="ஆவண வகையை தேர்ந்தெடுக்கவும்" />
                    </SelectTrigger>
                    <SelectContent>
                      {documentTypes.map((docType) => (
                        <SelectItem key={docType.id} value={docType.name}>
                          {docType.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="buyer" className="space-y-4">
          {formData.buyers.map((buyer, index) => (
            <Card key={buyer.id} className="bg-lavender-50 border-lavender-100 mb-6">
              <CardContent className="pt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">அடமானம் பெறுபவர் {index + 1}</h3>
                  {formData.buyers.length > 1 && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeBuyer(index)}
                      className="h-8"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      நீக்கு
                    </Button>
                  )}
                </div>

                <div className="mb-4">
                  <UserSelector
                    onUserSelect={(user) => handleMortgageReceiverSelect(user, index)}
                    buttonLabel="அடமானம் பெறுபவரை தேர்ந்தெடுக்கவும்"
                  />
                </div>

                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`buyer-name-${index}`}>அடமானம் பெறுபவர் பெயர்</Label>
                      <Input
                        id={`buyer-name-${index}`}
                        value={buyer.name}
                        onChange={(e) => handleBuyerChange(index, "name", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`buyer-age-${index}`}>வயது</Label>
                      <Input
                        id={`buyer-age-${index}`}
                        value={buyer.age}
                        onChange={(e) => handleBuyerChange(index, "age", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`buyer-relations-name-${index}`}>உறவினர் பெயர்</Label>
                      <Input
                        id={`buyer-relations-name-${index}`}
                        value={buyer.relationsName}
                        onChange={(e) => handleBuyerChange(index, "relationsName", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`buyer-relation-type-${index}`}>உறவு முறை</Label>
                      <Input
                        id={`buyer-relation-type-${index}`}
                        value={buyer.relationType}
                        onChange={(e) => handleBuyerChange(index, "relationType", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`buyer-door-no-${index}`}>கதவு எண்</Label>
                    <Input
                      id={`buyer-door-no-${index}`}
                      value={buyer.doorNo}
                      onChange={(e) => handleBuyerChange(index, "doorNo", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`buyer-address-line1-${index}`}>முகவரி வரி 1</Label>
                    <Input
                      id={`buyer-address-line1-${index}`}
                      value={buyer.addressLine1}
                      onChange={(e) => handleBuyerChange(index, "addressLine1", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`buyer-address-line2-${index}`}>முகவரி வரி 2</Label>
                    <Input
                      id={`buyer-address-line2-${index}`}
                      value={buyer.addressLine2}
                      onChange={(e) => handleBuyerChange(index, "addressLine2", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`buyer-address-line3-${index}`}>முகவரி வரி 3</Label>
                    <Input
                      id={`buyer-address-line3-${index}`}
                      value={buyer.addressLine3}
                      onChange={(e) => handleBuyerChange(index, "addressLine3", e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`buyer-taluk-${index}`}>வட்டம்</Label>
                      <Input
                        id={`buyer-taluk-${index}`}
                        value={buyer.taluk}
                        onChange={(e) => handleBuyerChange(index, "taluk", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`buyer-district-${index}`}>மாவட்டம்</Label>
                      <Input
                        id={`buyer-district-${index}`}
                        value={buyer.district}
                        onChange={(e) => handleBuyerChange(index, "district", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`buyer-pincode-${index}`}>அஞ்சல் குறியீடு</Label>
                      <Input
                        id={`buyer-pincode-${index}`}
                        value={buyer.pincode}
                        onChange={(e) => handleBuyerChange(index, "pincode", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`buyer-aadhar-no-${index}`}>ஆதார் எண்</Label>
                      <Input
                        id={`buyer-aadhar-no-${index}`}
                        value={buyer.aadharNo}
                        onChange={(e) => handleBuyerChange(index, "aadharNo", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`buyer-phone-no-${index}`}>தொலைபேசி எண்</Label>
                      <Input
                        id={`buyer-phone-no-${index}`}
                        value={buyer.phoneNo}
                        onChange={(e) => handleBuyerChange(index, "phoneNo", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          <div className="flex justify-center">
            <Button type="button" onClick={addBuyer} className="bg-lavender-600 hover:bg-lavender-700 text-white">
              <PlusCircle className="h-4 w-4 mr-2" />
              மற்றொரு அடமானம் பெறுபவரை சேர்க்கவும்
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="seller" className="space-y-4">
          {formData.sellers.map((seller, index) => (
            <Card key={seller.id} className="bg-mint-50 border-mint-100 mb-6">
              <CardContent className="pt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">அடமானம் கொடுப்பவர் {index + 1}</h3>
                  {formData.sellers.length > 1 && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeSeller(index)}
                      className="h-8"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      நீக்கு
                    </Button>
                  )}
                </div>

                <div className="mb-4">
                  <UserSelector
                    onUserSelect={(user) => handleMortgageGiverSelect(user, index)}
                    buttonLabel="அடமானம் கொடுப்பவரை தேர்ந்தெடுக்கவும்"
                  />
                </div>

                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`seller-name-${index}`}>அடமானம் கொடுப்பவர் பெயர்</Label>
                      <Input
                        id={`seller-name-${index}`}
                        value={seller.name}
                        onChange={(e) => handleSellerChange(index, "name", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`seller-age-${index}`}>வயது</Label>
                      <Input
                        id={`seller-age-${index}`}
                        value={seller.age}
                        onChange={(e) => handleSellerChange(index, "age", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`seller-relations-name-${index}`}>உறவினர் பெயர்</Label>
                      <Input
                        id={`seller-relations-name-${index}`}
                        value={seller.relationsName}
                        onChange={(e) => handleSellerChange(index, "relationsName", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`seller-relation-type-${index}`}>உறவு முறை</Label>
                      <Input
                        id={`seller-relation-type-${index}`}
                        value={seller.relationType}
                        onChange={(e) => handleSellerChange(index, "relationType", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`seller-door-no-${index}`}>கதவு எண்</Label>
                    <Input
                      id={`seller-door-no-${index}`}
                      value={seller.doorNo}
                      onChange={(e) => handleSellerChange(index, "doorNo", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`seller-address-line1-${index}`}>முகவரி வரி 1</Label>
                    <Input
                      id={`seller-address-line1-${index}`}
                      value={seller.addressLine1}
                      onChange={(e) => handleSellerChange(index, "addressLine1", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`seller-address-line2-${index}`}>முகவரி வரி 2</Label>
                    <Input
                      id={`seller-address-line2-${index}`}
                      value={seller.addressLine2}
                      onChange={(e) => handleSellerChange(index, "addressLine2", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`seller-address-line3-${index}`}>முகவரி வரி 3</Label>
                    <Input
                      id={`seller-address-line3-${index}`}
                      value={seller.addressLine3}
                      onChange={(e) => handleSellerChange(index, "addressLine3", e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`seller-taluk-${index}`}>வட்டம்</Label>
                      <Input
                        id={`seller-taluk-${index}`}
                        value={seller.taluk}
                        onChange={(e) => handleSellerChange(index, "taluk", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`seller-district-${index}`}>மாவட்டம்</Label>
                      <Input
                        id={`seller-district-${index}`}
                        value={seller.district}
                        onChange={(e) => handleSellerChange(index, "district", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`seller-pincode-${index}`}>அஞ்சல் குறியீடு</Label>
                      <Input
                        id={`seller-pincode-${index}`}
                        value={seller.pincode}
                        onChange={(e) => handleSellerChange(index, "pincode", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`seller-aadhar-no-${index}`}>ஆதார் எண்</Label>
                      <Input
                        id={`seller-aadhar-no-${index}`}
                        value={seller.aadharNo}
                        onChange={(e) => handleSellerChange(index, "aadharNo", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`seller-phone-no-${index}`}>தொலைபேசி எண்</Label>
                      <Input
                        id={`seller-phone-no-${index}`}
                        value={seller.phoneNo}
                        onChange={(e) => handleSellerChange(index, "phoneNo", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          <div className="flex justify-center">
            <Button type="button" onClick={addSeller} className="bg-mint-600 hover:bg-mint-700 text-white">
              <PlusCircle className="h-4 w-4 mr-2" />
              மற்றொரு அடமானம் கொடுப்பவரை சேர்க்கவும்
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="property" className="space-y-4">
          <Card className="bg-amber-50 border-amber-100">
            <CardContent className="pt-6">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="propertyDetails">சொத்து விவரங்கள்</Label>
                  <Textarea
                    id="propertyDetails"
                    value={formData.propertyDetails}
                    onChange={(e) => handleChange("propertyDetails", e.target.value)}
                    rows={10}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="witnesses" className="space-y-4">
          <Card className="bg-teal-50 border-teal-100">
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">சாட்சி 1</h3>
              <div className="mb-4">
                <UserSelector onUserSelect={handleWitness1Select} buttonLabel="முதல் சாட்சியை தேர்ந்தெடுக்கவும்" />
              </div>
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="witness1Name">பெயர்</Label>
                    <Input
                      id="witness1Name"
                      value={formData.witness1Name}
                      onChange={(e) => handleChange("witness1Name", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="witness1Age">வயது</Label>
                    <Input
                      id="witness1Age"
                      value={formData.witness1Age}
                      onChange={(e) => handleChange("witness1Age", e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="witness1RelationsName">உறவினர் பெயர்</Label>
                    <Input
                      id="witness1RelationsName"
                      value={formData.witness1RelationsName}
                      onChange={(e) => handleChange("witness1RelationsName", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="witness1RelationType">உறவு முறை</Label>
                    <Input
                      id="witness1RelationType"
                      value={formData.witness1RelationType}
                      onChange={(e) => handleChange("witness1RelationType", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="witness1DoorNo">கதவு எண்</Label>
                  <Input
                    id="witness1DoorNo"
                    value={formData.witness1DoorNo}
                    onChange={(e) => handleChange("witness1DoorNo", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="witness1AddressLine1">முகவரி வரி 1</Label>
                  <Input
                    id="witness1AddressLine1"
                    value={formData.witness1AddressLine1}
                    onChange={(e) => handleChange("witness1AddressLine1", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="witness1AddressLine2">முகவரி வரி 2</Label>
                  <Input
                    id="witness1AddressLine2"
                    value={formData.witness1AddressLine2}
                    onChange={(e) => handleChange("witness1AddressLine2", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="witness1AddressLine3">முகவரி வரி 3</Label>
                  <Input
                    id="witness1AddressLine3"
                    value={formData.witness1AddressLine3}
                    onChange={(e) => handleChange("witness1AddressLine3", e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="witness1Taluk">வட்டம்</Label>
                    <Input
                      id="witness1Taluk"
                      value={formData.witness1Taluk}
                      onChange={(e) => handleChange("witness1Taluk", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="witness1District">மாவட்டம்</Label>
                    <Input
                      id="witness1District"
                      value={formData.witness1District}
                      onChange={(e) => handleChange("witness1District", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="witness1Pincode">அஞ்சல் குறிய���டு</Label>
                    <Input
                      id="witness1Pincode"
                      value={formData.witness1Pincode}
                      onChange={(e) => handleChange("witness1Pincode", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="witness1AadharNo">ஆதார் எண்</Label>
                  <Input
                    id="witness1AadharNo"
                    value={formData.witness1AadharNo}
                    onChange={(e) => handleChange("witness1AadharNo", e.target.value)}
                  />
                </div>
              </div>

              <h3 className="text-lg font-medium mt-8 mb-4">சாட்சி 2</h3>
              <div className="mb-4">
                <UserSelector onUserSelect={handleWitness2Select} buttonLabel="இரண்டாவது சாட்சியை தேர்ந்தெடுக்கவும்" />
              </div>
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="witness2Name">பெயர்</Label>
                    <Input
                      id="witness2Name"
                      value={formData.witness2Name}
                      onChange={(e) => handleChange("witness2Name", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="witness2Age">வயது</Label>
                    <Input
                      id="witness2Age"
                      value={formData.witness2Age}
                      onChange={(e) => handleChange("witness2Age", e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="witness2RelationsName">உறவினர் பெயர்</Label>
                    <Input
                      id="witness2RelationsName"
                      value={formData.witness2RelationsName}
                      onChange={(e) => handleChange("witness2RelationsName", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="witness2RelationType">உறவு முறை</Label>
                    <Input
                      id="witness2RelationType"
                      value={formData.witness2RelationType}
                      onChange={(e) => handleChange("witness2RelationType", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="witness2DoorNo">கதவு எண்</Label>
                  <Input
                    id="witness2DoorNo"
                    value={formData.witness2DoorNo}
                    onChange={(e) => handleChange("witness2DoorNo", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="witness2AddressLine1">முகவரி வரி 1</Label>
                  <Input
                    id="witness2AddressLine1"
                    value={formData.witness2AddressLine1}
                    onChange={(e) => handleChange("witness2AddressLine1", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="witness2AddressLine2">முகவரி வரி 2</Label>
                  <Input
                    id="witness2AddressLine2"
                    value={formData.witness2AddressLine2}
                    onChange={(e) => handleChange("witness2AddressLine2", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="witness2AddressLine3">முகவரி வரி 3</Label>
                  <Input
                    id="witness2AddressLine3"
                    value={formData.witness2AddressLine3}
                    onChange={(e) => handleChange("witness2AddressLine3", e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="witness2Taluk">வட்டம்</Label>
                    <Input
                      id="witness2Taluk"
                      value={formData.witness2Taluk}
                      onChange={(e) => handleChange("witness2Taluk", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="witness2District">மாவட்டம்</Label>
                    <Input
                      id="witness2District"
                      value={formData.witness2District}
                      onChange={(e) => handleChange("witness2District", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="witness2Pincode">அஞ்சல் குறியீடு</Label>
                    <Input
                      id="witness2Pincode"
                      value={formData.witness2Pincode}
                      onChange={(e) => handleChange("witness2Pincode", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="witness2AadharNo">ஆதார் எண்</Label>
                  <Input
                    id="witness2AadharNo"
                    value={formData.witness2AadharNo}
                    onChange={(e) => handleChange("witness2AadharNo", e.target.value)}
                  />
                </div>
              </div>

              <h3 className="text-lg font-medium mt-8 mb-4">தட்டச்சு விவரங்கள்</h3>
              {typistDetailsLoaded && (
                <div className="bg-blue-50 p-3 rounded-md mb-4 text-sm">
                  <p>தட்டச்சு விவரங்கள் தானாக ஏற்றப்பட்டுள்ளன</p>
                </div>
              )}
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="typistName">தட்டச்சாளர் பெயர்</Label>
                  <Input
                    id="typistName"
                    value={formData.typistName}
                    onChange={(e) => handleChange("typistName", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="typistOfficeName">தட்டச்சு அலுவலகம்</Label>
                  <Input
                    id="typistOfficeName"
                    value={formData.typistOfficeName}
                    onChange={(e) => handleChange("typistOfficeName", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="typistPhoneNo">தட்டச்சாளர் தொலைபேசி எண்</Label>
                  <Input
                    id="typistPhoneNo"
                    value={formData.typistPhoneNo}
                    onChange={(e) => handleChange("typistPhoneNo", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-between gap-4 mt-6">
        <Button type="button" onClick={() => router.push("/document-details/mortgage-loan")} variant="outline">
          ரத்து செய்
        </Button>
        <Button type="submit" disabled={isSaving} className="bg-cyan-600 hover:bg-cyan-700 text-white">
          {isSaving ? "சேமிக்கிறது..." : "சேமி"}
        </Button>
      </div>
    </form>
  )
}
