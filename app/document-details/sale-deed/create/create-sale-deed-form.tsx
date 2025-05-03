"use client"

import { useState, useEffect } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase"
import { toast } from "sonner"
import { numToTamilWords } from "@/lib/number-to-words"

// Import the BuildingForm component
import type { BuildingDetail } from "./building-form"
import { BuildingDisplay } from "./building-display"
import { BuildingForm } from "./building-form"

// Basic types for our entities
interface SubRegistrarOffice {
  id: number
  name: string
  registration_district_id: number | null
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
  door_number: string
  address_line1: string
  address_line2: string
  address_line3: string
  district_id: number | null
  taluk_id: number | null
  pincode: string
  date_of_birth?: string | null
  age?: number | null
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

// Component props interface
interface CreateSaleDeedFormProps {
  initialData?: any
  isEditMode?: boolean
  onFormDataChange?: (data: any) => void
}

// Print styles
const printStyles = `
@media print {
  button, .no-print, nav, header, .flex.justify-between.mb-6 {
    display: none !important;
  }
  
  .print-only {
    display: block !important;
  }
  
  @page {
    size: legal portrait;
    margin: 1in;
    marks: none;
  }
  
  body, html {
    width: 8.5in;
    height: 14in;
    margin: 0;
    padding: 0;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    color-adjust: exact !important;
    background-color: white !important;
  }
  
  .document-content {
    position: relative;
    padding: 0;
    margin: 0;
    counter-reset: page;
    font-family: 'Mukta Malar', 'Noto Sans Tamil', sans-serif !important;
    font-size: 14pt !important;
    line-height: 1.5 !important;
    color: black !important;
  }
}

@import url('https://fonts.googleapis.com/css2?family=Mukta+Malar:wght@400;500;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Tamil:wght@400;500;600;700&display=swap');

.document-content {
  font-family: 'Mukta Malar', 'Noto Sans Tamil', sans-serif;
  font-size: 14pt;
}

.document-content .english-text,
.document-content .number {
  font-family: 'Times New Roman', serif;
  font-size: 14pt;
}
`

export function CreateSaleDeedForm({ initialData, isEditMode = false, onFormDataChange }: CreateSaleDeedFormProps) {
  // Basic details - Section 1
  const [documentDate, setDocumentDate] = useState("")
  const [saleAmount, setSaleAmount] = useState("")
  const [saleAmountWords, setSaleAmountWords] = useState("")

  // Previous document details - Section 2
  const [previousDocumentDate, setPreviousDocumentDate] = useState("")
  const [subRegistrarOfficeId, setSubRegistrarOfficeId] = useState("")
  const [bookNumberId, setBookNumberId] = useState("")
  const [documentYear, setDocumentYear] = useState("")
  const [documentNumber, setDocumentNumber] = useState("")
  const [documentTypeId, setDocumentTypeId] = useState("")
  const [submissionTypeId, setSubmissionTypeId] = useState("")

  // Typist details - Section 3
  const [typistId, setTypistId] = useState("")
  const [typistPhone, setTypistPhone] = useState("")
  const [officeId, setOfficeId] = useState("")

  // Buyers details
  const [buyers, setBuyers] = useState<UserType[]>([])
  const [selectedBuyerId, setSelectedBuyerId] = useState<number | null>(null)
  const [buyerSearchTerm, setBuyerSearchTerm] = useState("")
  const [buyerSearchBy, setBuyerSearchBy] = useState<"name" | "phone" | "aadhaar_number">("name")
  const [buyerSearchResults, setBuyerSearchResults] = useState<UserType[]>([])

  // Sellers details
  const [sellers, setSellers] = useState<UserType[]>([])
  const [selectedSellerId, setSelectedSellerId] = useState<number | null>(null)
  const [sellerSearchTerm, setSellerSearchTerm] = useState("")
  const [sellerSearchBy, setSellerSearchBy] = useState<"name" | "phone" | "aadhaar_number">("name")
  const [sellerSearchResults, setSellerSearchResults] = useState<UserType[]>([])

  // Witnesses details
  const [witnesses, setWitnesses] = useState<UserType[]>([])
  const [selectedWitnessId, setSelectedWitnessId] = useState<number | null>(null)
  const [witnessSearchTerm, setWitnessSearchTerm] = useState("")
  const [witnessSearchBy, setWitnessSearchBy] = useState<"name" | "phone" | "aadhaar_number">("name")
  const [witnessSearchResults, setWitnessSearchResults] = useState<UserType[]>([])

  // Property details
  const [selectedLandTypes, setSelectedLandTypes] = useState<string[]>([])
  const [selectedValueTypes, setSelectedValueTypes] = useState<string[]>([])

  // Property search
  const [propertySearchTerm, setPropertySearchTerm] = useState("")
  const [propertySearchResults, setPropertySearchResults] = useState<Property[]>([])
  const [selectedProperties, setSelectedProperties] = useState<Property[]>([])

  // New property
  const [previewOnlyProperty, setPreviewOnlyProperty] = useState<Property | null>(null)
  const [showNewPropertyForm, setShowNewPropertyForm] = useState(false)
  const [newPropertyPlotNumber, setNewPropertyPlotNumber] = useState("")
  const [newPropertyNorthBoundary, setNewPropertyNorthBoundary] = useState("")
  const [newPropertyEastBoundary, setNewPropertyEastBoundary] = useState("")
  const [newPropertySouthBoundary, setNewPropertySouthBoundary] = useState("")
  const [newPropertyWestBoundary, setNewPropertyWestBoundary] = useState("")
  const [newPropertyNorthMeasurement, setNewPropertyNorthMeasurement] = useState("")
  const [newPropertySouthMeasurement, setNewPropertySouthMeasurement] = useState("")
  const [newPropertyEastMeasurement, setNewPropertyEastMeasurement] = useState("")
  const [newPropertyWestMeasurement, setNewPropertyWestMeasurement] = useState("")
  const [newPropertyTotalSqFeet, setNewPropertyTotalSqFeet] = useState("")
  const [newPropertyTotalSqMeter, setNewPropertyTotalSqMeter] = useState("")
  const [newPropertyOldSurveyNumber, setNewPropertyOldSurveyNumber] = useState("")
  const [newPropertyOldSubdivisionNumber, setNewPropertyOldSubdivisionNumber] = useState("")
  const [newPropertyNewSurveyNumber, setNewPropertyNewSurveyNumber] = useState("")
  const [newPropertyHasBuilding, setNewPropertyHasBuilding] = useState(false)
  const [newPropertyGuideValueSqft, setNewPropertyGuideValueSqft] = useState("")
  const [newPropertyGuideValueSqm, setNewPropertyGuideValueSqm] = useState("")
  const [newPropertyDetails, setNewPropertyDetails] = useState("")
  const [newPropertyValues, setNewPropertyValues] = useState<{ id: string; name: string; value: string }[]>([])
  const [newPropertyTotalValue, setNewPropertyTotalValue] = useState("")
  const [newPropertyManualLandValue, setNewPropertyManualLandValue] = useState("")
  const [newPropertyCalculatedLandValue, setNewPropertyCalculatedLandValue] = useState("")
  const [newPropertyUseLandValueCalculation, setNewPropertyUseLandValueCalculation] = useState(true)
  const [newPropertyDistrictId, setNewPropertyDistrictId] = useState("")
  const [newPropertyTalukId, setNewPropertyTalukId] = useState("")
  const [newPropertyVillageId, setNewPropertyVillageId] = useState("")
  const [newPropertyLandValue, setNewPropertyLandValue] = useState("")
  const [newPropertyPathwayValue, setNewPropertyPathwayValue] = useState("")

  // Payment details
  const [selectedPaymentMethods, setSelectedPaymentMethods] = useState<string[]>([])
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null)
  const [buyerBankName, setBuyerBankName] = useState("")
  const [buyerBankBranch, setBuyerBankBranch] = useState("")
  const [buyerAccountType, setBuyerAccountType] = useState("")
  const [buyerAccountNumber, setBuyerAccountNumber] = useState("")
  const [sellerBankName, setSellerBankName] = useState("")
  const [sellerBankBranch, setSellerBankBranch] = useState("")
  const [sellerAccountType, setSellerAccountType] = useState("")
  const [sellerAccountNumber, setSellerAccountNumber] = useState("")
  const [transactionNumber, setTransactionNumber] = useState("")
  const [transactionDate, setTransactionDate] = useState("")
  const [accountTypes, setAccountTypes] = useState<{ id: number; name: string }[]>([])

  // Building details
  const [shouldShowBuildingForm, setShouldShowBuildingForm] = useState(false)
  const [buildings, setBuildings] = useState<BuildingDetail[]>([])
  const [selectedBuildingForEdit, setSelectedBuildingForEdit] = useState<BuildingDetail | null>(null)
  const [isEditingBuilding, setIsEditingBuilding] = useState(false)

  // Reference data
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
  const [registrationDistricts, setRegistrationDistricts] = useState<SubRegistrarOffice[]>([])

  // State for tracking the current search mode
  const [currentSearchMode, setCurrentSearchMode] = useState<"buyer" | "seller" | "witness">("buyer")

  // State for tracking form sections
  const [activeTab, setActiveTab] = useState("section1")

  // Property search filters
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

  // Document name dialog state
  const [showNameDialog, setShowNameDialog] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const supabase = getSupabaseBrowserClient()

  // Building form handlers
  const handleAddBuilding = (building: BuildingDetail) => {
    if (isEditingBuilding) {
      setBuildings(buildings.map((b) => (b.id === building.id ? building : b)))
      setIsEditingBuilding(false)
      setSelectedBuildingForEdit(null)
    } else {
      setBuildings([...buildings, building])
    }
    setShouldShowBuildingForm(false)
    toast.success(isEditingBuilding ? "கட்டிட விவரங்கள் வெற்றிகரமாக புதுப்பிக்கப்பட்டன" : "கட்டிட விவரங்கள் வெற்றிகரமாக சேர்க்கப்பட்டன")
  }

  const handleEditBuilding = (building: BuildingDetail) => {
    setSelectedBuildingForEdit(building)
    setIsEditingBuilding(true)
    setShouldShowBuildingForm(true)
  }

  const handleRemoveBuilding = (buildingId: string) => {
    setBuildings(buildings.filter((building) => building.id !== buildingId))
    toast.success("கட்டிட விவரங்கள் வெற்றிகரமாக நீக்கப்பட்டன")
  }

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
    return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`
  }

  // Load reference data on component mount
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
    fetchRegistrationDistricts()
    fetchAccountTypes()
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

  // Initialize form with initial data if provided (for edit mode)
  useEffect(() => {
    if (initialData && isEditMode) {
      // Set basic details
      setDocumentDate(initialData.document_date || "")
      setSaleAmount(initialData.sale_amount?.toString() || "")
      setSaleAmountWords(initialData.sale_amount_words || "")

      // Set previous document details
      setPreviousDocumentDate(initialData.previous_document_date || "")
      setSubRegistrarOfficeId(initialData.sub_registrar_office_id?.toString() || "")
      setBookNumberId(initialData.book_number_id?.toString() || "")
      setDocumentYear(initialData.document_year || "")
      setDocumentNumber(initialData.document_number || "")
      setDocumentTypeId(initialData.document_type_id?.toString() || "")
      setSubmissionTypeId(initialData.submission_type_id?.toString() || "")

      // Set typist details
      setTypistId(initialData.typist_id?.toString() || "")
      setTypistPhone(initialData.typist_phone || "")
      setOfficeId(initialData.office_id?.toString() || "")

      // Set parties
      if (initialData.buyers) setBuyers(initialData.buyers)
      if (initialData.sellers) setSellers(initialData.sellers)
      if (initialData.witnesses) setWitnesses(initialData.witnesses)

      // Set property details
      if (initialData.properties) setSelectedProperties(initialData.properties)

      // Set selected types
      setSelectedLandTypes(initialData.land_types || [])
      setSelectedValueTypes(initialData.value_types || [])
      setSelectedPaymentMethods(initialData.payment_methods || [])
    }
  }, [initialData, isEditMode])

  // Update parent component with form data changes
  useEffect(() => {
    if (isEditMode && onFormDataChange) {
      const updateParent = () => {
        const documentContent = document.querySelector(".document-content")?.innerHTML || ""

        onFormDataChange({
          documentDate,
          saleAmount,
          saleAmountWords,
          previousDocumentDate,
          subRegistrarOfficeId,
          bookNumberId,
          documentYear,
          documentNumber,
          documentTypeId,
          submissionTypeId,
          typistId,
          typistPhone,
          officeId,
          landTypes: selectedLandTypes,
          valueTypes: selectedValueTypes,
          paymentMethods: selectedPaymentMethods,
          documentContent,
          buyers: buyers.map((b) => b.id),
          sellers: sellers.map((s) => s.id),
          witnesses: witnesses.map((w) => w.id),
          properties: selectedProperties.map((p) => p.id),
          propertyDetails: selectedProperties.map((p) => p.property_details || ""),
          buildings: buildings,
        })
      }

      const timeoutId = setTimeout(updateParent, 100)
      return () => clearTimeout(timeoutId)
    }
  }, [
    isEditMode,
    onFormDataChange,
    documentDate,
    saleAmount,
    saleAmountWords,
    previousDocumentDate,
    subRegistrarOfficeId,
    bookNumberId,
    documentYear,
    documentNumber,
    documentTypeId,
    submissionTypeId,
    typistId,
    typistPhone,
    officeId,
    selectedLandTypes,
    selectedValueTypes,
    selectedPaymentMethods,
    buyers,
    sellers,
    witnesses,
    selectedProperties,
    buildings,
  ])

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
      toast.error("தட்டச்சு செய்பவர்களை பெறுவதில் பிழை: " + error.message)
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
      toast.error("நிலத்தின் வகைகளை பெறுவதில் பிழை: " + error.message)
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
      toast.error("கட்டண முறைகளை பெறுவதில் பிழை: " + error.message)
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

  const fetchRegistrationDistricts = async () => {
    try {
      const { data, error } = await supabase.from("registration_districts").select("*").order("name")
      if (error) throw error
      setRegistrationDistricts(data || [])
    } catch (error: any) {
      toast.error("பதிவு மாவட்டங்களை பெறுவதில் பிழை: " + error.message)
    }
  }

  const fetchAccountTypes = async () => {
    try {
      const { data, error } = await supabase.from("account_types").select("*").order("name")
      if (error) throw error
      setAccountTypes(data || [])
    } catch (error: any) {
      toast.error("கணக்கு வகைகளை பெறுவதில் பிழை: " + error.message)
    }
  }

  // Search functions for parties
  const searchParties = async (
    searchTerm: string,
    searchBy: "name" | "phone" | "aadhaar_number",
    partyType: "buyer" | "seller" | "witness",
  ) => {
    if (!searchTerm) {
      switch (partyType) {
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
      const query = supabase.from("users").select("*").ilike(searchBy, `%${searchTerm}%`).limit(5)

      const { data, error } = await query

      if (error) {
        toast.error(
          `${partyType === "buyer" ? "வாங்குபவர்களை" : partyType === "seller" ? "விற்பனையாளர்களை" : "சாட்சிகளை"} தேடுவதில் பிழை: ` +
            error.message,
        )
      } else {
        switch (partyType) {
          case "buyer":
            setBuyerSearchResults(data || [])
            break
          case "seller":
            setSellerSearchResults(data || [])
            break
          case "witness":
            setWitnessSearchResults(data || [])
            break
        }
      }
    } catch (error: any) {
      toast.error(
        `${partyType === "buyer" ? "வாங்குபவர்களை" : partyType === "seller" ? "விற்பனையாளர்களை" : "சாட்சிகளை"} தேடுவதில் பிழை: ` +
          error.message,
      )
    }
  }

  // Add party to the list
  const addParty = (party: UserType, partyType: "buyer" | "seller" | "witness") => {
    switch (partyType) {
      case "buyer":
        if (!buyers.find((b) => b.id === party.id)) {
          setBuyers([...buyers, party])
          setBuyerSearchTerm("")
          setBuyerSearchResults([])
        } else {
          toast.error("இந்த வாங்குபவர் ஏற்கனவே பட்டியலில் உள்ளார்.")
        }
        break
      case "seller":
        if (!sellers.find((s) => s.id === party.id)) {
          setSellers([...sellers, party])
          setSellerSearchTerm("")
          setSellerSearchResults([])
        } else {
          toast.error("இந்த விற்பனையாளர் ஏற்கனவே பட்டியலில் உள்ளார்.")
        }
        break
      case "witness":
        if (!witnesses.find((w) => w.id === party.id)) {
          setWitnesses([...witnesses, party])
          setWitnessSearchTerm("")
          setWitnessSearchResults([])
        } else {
          toast.error("இந்த சாட்சி ஏற்கனவே பட்டியலில் உள்ளார்.")
        }
        break
    }
  }

  // Remove party from the list
  const removeParty = (partyId: number, partyType: "buyer" | "seller" | "witness") => {
    switch (partyType) {
      case "buyer":
        setBuyers(buyers.filter((b) => b.id !== partyId))
        break
      case "seller":
        setSellers(sellers.filter((s) => s.id !== partyId))
        break
      case "witness":
        setWitnesses(witnesses.filter((w) => w.id !== partyId))
        break
    }
  }

  // Search properties
  const searchProperties = async (searchTerm: string) => {
    if (!searchTerm) {
      setPropertySearchResults([])
      return
    }

    try {
      const query = supabase
        .from("properties")
        .select(`
        *,
        registration_districts (name),
        sub_registrar_offices (name),
        districts (name),
        taluks (name),
        villages (name)
      `)
        .ilike("property_name", `%${searchTerm}%`)
        .limit(5)

      const { data, error } = await query

      if (error) {
        toast.error("சொத்துக்களைத் தேடுவதில் பிழை: " + error.message)
      } else {
        setPropertySearchResults(data || [])
      }
    } catch (error: any) {
      toast.error("சொத்துக்களைத் தேடுவதில் பிழை: " + error.message)
    }
  }

  // Add property to the list
  const addProperty = (property: Property) => {
    if (!selectedProperties.find((p) => p.id === property.id)) {
      setSelectedProperties([...selectedProperties, property])
      setPropertySearchTerm("")
      setPropertySearchResults([])
    } else {
      toast.error("இந்த சொத்து ஏற்கனவே பட்டியலில் உள்ளது.")
    }
  }

  // Remove property from the list
  const removeProperty = (propertyId: number) => {
    setSelectedProperties(selectedProperties.filter((p) => p.id !== propertyId))
  }

  // Handle property filter changes
  const handlePropertyFilterRegistrationDistrictChange = async (e: any) => {
    const registrationDistrictId = e.target.value
    setPropertyFilterRegistrationDistrictId(registrationDistrictId)
    setPropertyFilterSubRegistrarOfficeId("")
    setPropertyFilterDistrictId("")
    setPropertyFilterTalukId("")
    setPropertyFilterVillageId("")
    setFilteredPropertySubRegistrarOffices([])
    setFilteredPropertyTaluks([])
    setFilteredPropertyVillages([])

    if (registrationDistrictId) {
      try {
        const { data, error } = await supabase
          .from("sub_registrar_offices")
          .select("*")
          .eq("registration_district_id", registrationDistrictId)
          .order("name")

        if (error) {
          throw error
        }

        setFilteredPropertySubRegistrarOffices(data || [])
      } catch (error: any) {
        toast.error("துணைப் பதிவாளர் அலுவலகங்களைப் பெறுவதில் பிழை: " + error.message)
      }
    }
  }

  const handlePropertyFilterSubRegistrarOfficeChange = async (e: any) => {
    const subRegistrarOfficeId = e.target.value
    setPropertyFilterSubRegistrarOfficeId(subRegistrarOfficeId)
    setPropertyFilterDistrictId("")
    setPropertyFilterTalukId("")
    setPropertyFilterVillageId("")
    setFilteredPropertyTaluks([])
    setFilteredPropertyVillages([])

    if (subRegistrarOfficeId) {
      try {
        const { data: subRegistrarOfficeData, error: subRegistrarOfficeError } = await supabase
          .from("sub_registrar_offices")
          .select("registration_district_id")
          .eq("id", subRegistrarOfficeId)
          .single()

        if (subRegistrarOfficeError) {
          throw subRegistrarOfficeError
        }

        const registrationDistrictId = subRegistrarOfficeData?.registration_district_id

        if (registrationDistrictId) {
          setPropertyFilterRegistrationDistrictId(registrationDistrictId.toString())
        }

        const { data: districtData, error: districtError } = await supabase
          .from("districts")
          .select("*")
          .eq("registration_district_id", registrationDistrictId)
          .order("name")

        if (districtError) {
          throw districtError
        }

        const districtId = districtData?.[0]?.id

        setPropertyFilterDistrictId(districtData?.[0]?.id?.toString() || "")

        const { data: talukData, error: talukError } = await supabase
          .from("taluks")
          .select("*")
          .eq("district_id", districtId)
          .order("name")

        if (talukError) {
          throw talukError
        }

        setFilteredPropertyTaluks(talukData || [])
      } catch (error: any) {
        toast.error("வட்டங்களைப் பெறுவதில் பிழை: " + error.message)
      }
    }
  }

  const handlePropertyFilterDistrictChange = async (e: any) => {
    const districtId = e.target.value
    setPropertyFilterDistrictId(districtId)
    setPropertyFilterTalukId("")
    setPropertyFilterVillageId("")
    setFilteredPropertyTaluks([])
    setFilteredPropertyVillages([])

    if (districtId) {
      try {
        const { data: talukData, error: talukError } = await supabase
          .from("taluks")
          .select("*")
          .eq("district_id", districtId)
          .order("name")

        if (talukError) {
          throw talukError
        }

        setFilteredPropertyTaluks(talukData || [])
      } catch (error: any) {
        toast.error("வட்டங்களைப் பெறுவதில் பிழை: " + error.message)
      }
    }
  }

  const handlePropertyFilterTalukChange = async (e: any) => {
    const talukId = e.target.value
    setPropertyFilterTalukId(talukId)
    setPropertyFilterVillageId("")
    setFilteredPropertyVillages([])

    if (talukId) {
      try {
        const { data: villageData, error: villageError } = await supabase
          .from("villages")
          .select("*")
          .eq("taluk_id", talukId)
          .order("name")

        if (villageError) {
          throw villageError
        }

        setFilteredPropertyVillages(villageData || [])
      } catch (error: any) {
        toast.error("கிராமங்களைப் பெறுவதில் பிழை: " + error.message)
      }
    }
  }

  // Handle new property form changes
  const handleNewPropertyDistrictChange = (e: any) => {
    setNewPropertyDistrictId(e.target.value)
  }

  const handleNewPropertyTalukChange = (e: any) => {
    setNewPropertyTalukId(e.target.value)
  }

  const handleNewPropertyVillageChange = (e: any) => {
    setNewPropertyVillageId(e.target.value)
  }

  const handleNewPropertyValueChange = (id: string, value: string) => {
    setNewPropertyValues((prevValues) => prevValues.map((v) => (v.id === id ? { ...v, value } : v)))
  }

  const handleNewPropertyValueAdd = () => {
    setValueTypes((prevValueTypes) => {
      if (prevValueTypes.length > 0) {
        const newValueType = prevValueTypes[0]
        setNewPropertyValues((prevValues) => [
          ...prevValues,
          { id: newValueType.id.toString(), name: newValueType.name, value: "" },
        ])
      }
      return prevValueTypes
    })
  }

  const handleNewPropertyValueRemove = (id: string) => {
    setNewPropertyValues((prevValues) => prevValues.filter((v) => v.id !== id))
  }

  // Calculate total value of new property
  useEffect(() => {
    let total = 0
    newPropertyValues.forEach((v) => {
      const value = Number.parseFloat(v.value)
      if (!isNaN(value)) {
        total += value
      }
    })
    setNewPropertyTotalValue(total.toString())
  }, [newPropertyValues])

  // Calculate land value of new property
  useEffect(() => {
    if (newPropertyUseLandValueCalculation) {
      const guideValueSqft = Number.parseFloat(newPropertyGuideValueSqft)
      const totalSqFeet = Number.parseFloat(newPropertyTotalSqFeet)
      const guideValueSqm = Number.parseFloat(newPropertyGuideValueSqm)
      const totalSqMeter = Number.parseFloat(newPropertyTotalSqMeter)

      let calculatedLandValue = 0

      if (!isNaN(guideValueSqft) && !isNaN(totalSqFeet)) {
        calculatedLandValue = guideValueSqft * totalSqFeet
      } else if (!isNaN(guideValueSqm) && !isNaN(totalSqMeter)) {
        calculatedLandValue = guideValueSqm * totalSqMeter
      }

      setNewPropertyCalculatedLandValue(calculatedLandValue.toString())
      setNewPropertyLandValue(calculatedLandValue.toString())
    } else {
      setNewPropertyLandValue(newPropertyManualLandValue)
    }
  }, [
    newPropertyGuideValueSqft,
    newPropertyTotalSqFeet,
    newPropertyGuideValueSqm,
    newPropertyTotalSqMeter,
    newPropertyUseLandValueCalculation,
    newPropertyManualLandValue,
  ])

  // Handle new property form submission
  const handleNewPropertySubmit = async () => {
    try {
      const { data, error } = await supabase
        .from("properties")
        .insert([
          {
            property_name: newPropertyPlotNumber,
            survey_number: newPropertyOldSurveyNumber,
            guide_value_sqft: Number.parseFloat(newPropertyGuideValueSqft),
            guide_value_sqm: Number.parseFloat(newPropertyGuideValueSqm),
            property_details: newPropertyDetails,
            registration_district_id: Number.parseInt(propertyFilterRegistrationDistrictId),
            sub_registrar_office_id: Number.parseInt(propertyFilterSubRegistrarOfficeId),
            district_id: Number.parseInt(newPropertyDistrictId),
            taluk_id: Number.parseInt(newPropertyTalukId),
            village_id: Number.parseInt(newPropertyVillageId),
          },
        ])
        .select()
        .single()

      if (error) {
        throw error
      }

      setPreviewOnlyProperty(data)
      toast.success("புதிய சொத்து வெற்றிகரமாக உருவாக்கப்பட்டது.")
    } catch (error: any) {
      toast.error("புதிய சொத்தை உருவாக்குவதில் பிழை: " + error.message)
    }
  }

  // Handle form submission
  const handleSubmit = async () => {
    setShowNameDialog(true)
  }

  const handleSave = async (documentName: string) => {
    setIsSaving(true)
    try {
      const documentContent = document.querySelector(".document-content")?.innerHTML || ""

      const saleDeedData = {
        document_name: documentName,
        document_date: formatDateForDB(documentDate),
        sale_amount: Number.parseFloat(saleAmount),
        sale_amount_words: saleAmountWords,
        previous_document_date: formatDateForDB(previousDocumentDate),
        sub_registrar_office_id: Number.parseInt(subRegistrarOfficeId),
        book_number_id: Number.parseInt(bookNumberId),
        document_year: documentYear,
        document_number: documentNumber,
        document_type_id: Number.parseInt(documentTypeId),
        submission_type_id: Number.parseInt(submissionTypeId),
        typist_id: Number.parseInt(typistId),
        typist_phone: typistPhone,
        office_id: Number.parseInt(officeId),
        land_types: selectedLandTypes,
        value_types: selectedValueTypes,
        payment_methods: selectedPaymentMethods,
        document_content: documentContent,
      }

      if (isEditMode && initialData?.id) {
        const { error: updateError } = await supabase.from("sale_deeds").update(saleDeedData).eq("id", initialData.id)

        if (updateError) {
          throw updateError
        }

        // Update parties
        await supabase.from("sale_deed_buyers").delete().eq("sale_deed_id", initialData.id)
        await supabase.from("sale_deed_sellers").delete().eq("sale_deed_id", initialData.id)
        await supabase.from("sale_deed_witnesses").delete().eq("sale_deed_id", initialData.id)
        await supabase.from("sale_deed_properties").delete().eq("sale_deed_id", initialData.id)
        await supabase.from("sale_deed_buildings").delete().eq("sale_deed_id", initialData.id)

        for (const buyer of buyers) {
          await supabase.from("sale_deed_buyers").insert([{ sale_deed_id: initialData.id, user_id: buyer.id }])
        }

        for (const seller of sellers) {
          await supabase.from("sale_deed_sellers").insert([{ sale_deed_id: initialData.id, user_id: seller.id }])
        }

        for (const witness of witnesses) {
          await supabase.from("sale_deed_witnesses").insert([{ sale_deed_id: initialData.id, user_id: witness.id }])
        }

        for (const property of selectedProperties) {
          await supabase
            .from("sale_deed_properties")
            .insert([{ sale_deed_id: initialData.id, property_id: property.id }])
        }

        for (const building of buildings) {
          await supabase.from("sale_deed_buildings").insert([
            {
              sale_deed_id: initialData.id,
              building_id: building.id,
              building_type: building.buildingType,
              facing_direction: building.facingDirection,
              total_sq_feet: building.totalSqFeet,
              total_sq_meter: building.totalSqMeter,
              building_age: building.buildingAge,
              floors: building.floors,
              rooms: building.rooms,
              has_toilet: building.hasToilet,
              toilet_length: building.toiletLength,
              toilet_width: building.toiletWidth,
              description: building.description,
            },
          ])
        }

        toast.success("விற்பனை பத்திரம் வெற்றிகரமாக புதுப்பிக்கப்பட்டது.")
      } else {
        const { data: insertData, error: insertError } = await supabase
          .from("sale_deeds")
          .insert([saleDeedData])
          .select()
          .single()

        if (insertError) {
          throw insertError
        }

        for (const buyer of buyers) {
          await supabase.from("sale_deed_buyers").insert([{ sale_deed_id: insertData.id, user_id: buyer.id }])
        }

        for (const seller of sellers) {
          await supabase.from("sale_deed_sellers").insert([{ sale_deed_id: insertData.id, user_id: seller.id }])
        }

        for (const witness of witnesses) {
          await supabase.from("sale_deed_witnesses").insert([{ sale_deed_id: insertData.id, user_id: witness.id }])
        }

        for (const property of selectedProperties) {
          await supabase
            .from("sale_deed_properties")
            .insert([{ sale_deed_id: insertData.id, property_id: property.id }])
        }

        for (const building of buildings) {
          await supabase.from("sale_deed_buildings").insert([
            {
              sale_deed_id: insertData.id,
              building_id: building.id,
              building_type: building.buildingType,
              facing_direction: building.facingDirection,
              total_sq_feet: building.totalSqFeet,
              total_sq_meter: building.totalSqMeter,
              building_age: building.buildingAge,
              floors: building.floors,
              rooms: building.rooms,
              has_toilet: building.hasToilet,
              toilet_length: building.toiletLength,
              toilet_width: building.toiletWidth,
              description: building.description,
            },
          ])
        }

        toast.success("விற்பனை பத்திரம் வெற்றிகரமாக உருவாக்கப்பட்டது.")
      }
    } catch (error: any) {
      toast.error("விற்பனை பத்திரம் உருவாக்குவதில் பிழை: " + error.message)
    } finally {
      setIsSaving(false)
      setShowNameDialog(false)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <style>{printStyles}</style>

      {/* Document Name Dialog */}
      {showNameDialog && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-medium leading-tight">ஆவணத்தின் பெயரை உள்ளிடவும்</h3>
            <input
              type="text"
              className="mt-2 px-4 py-2 bg-gray-100 border rounded w-full"
              placeholder="ஆவணத்தின் பெயர்"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSave(e.target.value)
                }
              }}
            />
            <div className="text-right mt-4">
              <button
                className="px-4 py-2 mr-2 bg-gray-500 text-white rounded hover:bg-gray-700 disabled:bg-gray-300"
                onClick={() => setShowNameDialog(false)}
                disabled={isSaving}
              >
                ரத்து செய்
              </button>
              <button
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700 disabled:bg-green-300"
                onClick={(e) =>
                  handleSave((e.target.previousElementSibling as HTMLButtonElement).previousElementSibling?.value)
                }
                disabled={isSaving}
              >
                சேமி
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between mb-6 no-print">
        <h1 className="text-2xl font-bold">விற்பனை பத்திரம்</h1>
        <div>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
            onClick={() => window.print()}
          >
            அச்சிடு
          </button>
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleSubmit}
          >
            சேமி
          </button>
        </div>
      </div>

      <div className="mb-4 no-print">
        <ul className="flex border-b">
          <li className="-mb-px mr-1">
            <a
              className={`bg-white inline-block py-2 px-4 font-semibold ${
                activeTab === "section1"
                  ? "text-blue-500 border-l border-t border-r rounded-t"
                  : "text-blue-400 hover:text-blue-500"
              } border-blue-500`}
              onClick={() => setActiveTab("section1")}
            >
              அடிப்படை விவரங்கள்
            </a>
          </li>
          <li className="-mb-px mr-1">
            <a
              className={`bg-white inline-block py-2 px-4 font-semibold ${
                activeTab === "section2"
                  ? "text-blue-500 border-l border-t border-r rounded-t"
                  : "text-blue-400 hover:text-blue-500"
              } border-blue-500`}
              onClick={() => setActiveTab("section2")}
            >
              முந்தைய ஆவண விவரங்கள்
            </a>
          </li>
          <li className="-mb-px mr-1">
            <a
              className={`bg-white inline-block py-2 px-4 font-semibold ${
                activeTab === "section3"
                  ? "text-blue-500 border-l border-t border-r rounded-t"
                  : "text-blue-400 hover:text-blue-500"
              } border-blue-500`}
              onClick={() => setActiveTab("section3")}
            >
              தட்டச்சு செய்பவர் விவரங்கள்
            </a>
          </li>
          <li className="-mb-px mr-1">
            <a
              className={`bg-white inline-block py-2 px-4 font-semibold ${
                activeTab === "section4"
                  ? "text-blue-500 border-l border-t border-r rounded-t"
                  : "text-blue-400 hover:text-blue-500"
              } border-blue-500`}
              onClick={() => setActiveTab("section4")}
            >
              வாங்குபவர்கள்
            </a>
          </li>
          <li className="-mb-px mr-1">
            <a
              className={`bg-white inline-block py-2 px-4 font-semibold ${
                activeTab === "section5"
                  ? "text-blue-500 border-l border-t border-r rounded-t"
                  : "text-blue-400 hover:text-blue-500"
              } border-blue-500`}
              onClick={() => setActiveTab("section5")}
            >
              விற்பனையாளர்கள்
            </a>
          </li>
          <li className="-mb-px mr-1">
            <a
              className={`bg-white inline-block py-2 px-4 font-semibold ${
                activeTab === "section6"
                  ? "text-blue-500 border-l border-t border-r rounded-t"
                  : "text-blue-400 hover:text-blue-500"
              } border-blue-500`}
              onClick={() => setActiveTab("section6")}
            >
              சாட்சிகள்
            </a>
          </li>
          <li className="-mb-px mr-1">
            <a
              className={`bg-white inline-block py-2 px-4 font-semibold ${
                activeTab === "section7"
                  ? "text-blue-500 border-l border-t border-r rounded-t"
                  : "text-blue-400 hover:text-blue-500"
              } border-blue-500`}
              onClick={() => setActiveTab("section7")}
            >
              சொத்து விவரங்கள்
            </a>
          </li>
          <li className="-mb-px mr-1">
            <a
              className={`bg-white inline-block py-2 px-4 font-semibold ${
                activeTab === "section8"
                  ? "text-blue-500 border-l border-t border-r rounded-t"
                  : "text-blue-400 hover:text-blue-500"
              } border-blue-500`}
              onClick={() => setActiveTab("section8")}
            >
              கட்டண விவரங்கள்
            </a>
          </li>
          <li className="-mb-px mr-1">
            <a
              className={`bg-white inline-block py-2 px-4 font-semibold ${
                activeTab === "section9"
                  ? "text-blue-500 border-l border-t border-r rounded-t"
                  : "text-blue-400 hover:text-blue-500"
              } border-blue-500`}
              onClick={() => setActiveTab("section9")}
            >
              கட்டிட விவரங்கள்
            </a>
          </li>
        </ul>
      </div>

      {/* Section 1: Basic Details */}
      {activeTab === "section1" && (
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-4">அடிப்படை விவரங்கள்</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="documentDate" className="block text-gray-700 text-sm font-bold mb-2">
                ஆவண தேதி:
              </label>
              <input
                type="text"
                id="documentDate"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="DD/MM/YYYY"
                value={documentDate}
                onChange={(e) => setDocumentDate(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="saleAmount" className="block text-gray-700 text-sm font-bold mb-2">
                விற்பனை தொகை:
              </label>
              <input
                type="number"
                id="saleAmount"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="விற்பனை தொகை"
                value={saleAmount}
                onChange={(e) => setSaleAmount(e.target.value)}
              />
              {saleAmountWords && <p className="text-gray-600 text-sm mt-1">(ரூபாய் {saleAmountWords} மட்டும்)</p>}
            </div>
          </div>
        </section>
      )}

      {/* Section 2: Previous Document Details */}
      {activeTab === "section2" && (
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-4">முந்தைய ஆவண விவரங்கள்</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="previousDocumentDate" className="block text-gray-700 text-sm font-bold mb-2">
                முந்தைய ஆவண தேதி:
              </label>
              <input
                type="text"
                id="previousDocumentDate"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="DD/MM/YYYY"
                value={previousDocumentDate}
                onChange={(e) => setPreviousDocumentDate(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="subRegistrarOffice" className="block text-gray-700 text-sm font-bold mb-2">
                துணைப் பதிவாளர் அலுவலகம்:
              </label>
              <select
                id="subRegistrarOffice"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={subRegistrarOfficeId}
                onChange={(e) => setSubRegistrarOfficeId(e.target.value)}
              >
                <option value="">தேர்ந்தெடு</option>
                {subRegistrarOffices.map((office) => (
                  <option key={office.id} value={office.id}>
                    {office.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="bookNumber" className="block text-gray-700 text-sm font-bold mb-2">
                புத்தக எண்:
              </label>
              <select
                id="bookNumber"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={bookNumberId}
                onChange={(e) => setBookNumberId(e.target.value)}
              >
                <option value="">தேர்ந்தெடு</option>
                {bookNumbers.map((book) => (
                  <option key={book.id} value={book.id}>
                    {book.number}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="documentYear" className="block text-gray-700 text-sm font-bold mb-2">
                ஆவண வருடம்:
              </label>
              <input
                type="text"
                id="documentYear"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="ஆவண வருடம்"
                value={documentYear}
                onChange={(e) => setDocumentYear(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="documentNumber" className="block text-gray-700 text-sm font-bold mb-2">
                ஆவண எண்:
              </label>
              <input
                type="text"
                id="documentNumber"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="ஆவண எண்"
                value={documentNumber}
                onChange={(e) => setDocumentNumber(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="documentType" className="block text-gray-700 text-sm font-bold mb-2">
                ஆவண வகை:
              </label>
              <select
                id="documentType"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={documentTypeId}
                onChange={(e) => setDocumentTypeId(e.target.value)}
              >
                <option value="">தேர்ந்தெடு</option>
                {documentTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="submissionType" className="block text-gray-700 text-sm font-bold mb-2">
                ஒப்படைப்பு வகை:
              </label>
              <select
                id="submissionType"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={submissionTypeId}
                onChange={(e) => setSubmissionTypeId(e.target.value)}
              >
                <option value="">தேர்ந்தெடு</option>
                {submissionTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>
      )}

      {/* Section 3: Typist Details */}
      {activeTab === "section3" && (
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-4">தட்டச்சு செய்பவர் விவரங்கள்</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="typist" className="block text-gray-700 text-sm font-bold mb-2">
                தட்டச்சு செய்பவர்:
              </label>
              <select
                id="typist"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={typistId}
                onChange={(e) => setTypistId(e.target.value)}
              >
                <option value="">தேர்ந்தெடு</option>
                {typists.map((typist) => (
                  <option key={typist.id} value={typist.id}>
                    {typist.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="typistPhone" className="block text-gray-700 text-sm font-bold mb-2">
                தட்டச்சு செய்பவர் தொலைபேசி:
              </label>
              <input
                type="text"
                id="typistPhone"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="தட்டச்சு செய்பவர் தொலைபேசி"
                value={typistPhone}
                readOnly
              />
            </div>
            <div>
              <label htmlFor="office" className="block text-gray-700 text-sm font-bold mb-2">
                அலுவலகம்:
              </label>
              <select
                id="office"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={officeId}
                onChange={(e) => setOfficeId(e.target.value)}
              >
                <option value="">தேர்ந்தெடு</option>
                {offices.map((office) => (
                  <option key={office.id} value={office.id}>
                    {office.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>
      )}

      {/* Section 4: Buyers */}
      {activeTab === "section4" && (
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-4">வாங்குபவர்கள்</h2>

          {/* Search Section */}
          <div className="mb-4">
            <label htmlFor="buyerSearchTerm" className="block text-gray-700 text-sm font-bold mb-2">
              வாங்குபவர்களைத் தேடு:
            </label>
            <div className="flex">
              <input
                type="text"
                id="buyerSearchTerm"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
                placeholder="பெயர், தொலைபேசி அல்லது ஆதார் எண் மூலம் தேடுங்கள்"
                value={buyerSearchTerm}
                onChange={(e) => {
                  setBuyerSearchTerm(e.target.value)
                  searchParties(e.target.value, buyerSearchBy, "buyer")
                }}
              />
              <select
                className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={buyerSearchBy}
                onChange={(e) => setBuyerSearchBy(e.target.value as "name" | "phone" | "aadhaar_number")}
              >
                <option value="name">பெயர்</option>
                <option value="phone">தொலைபேசி</option>
                <option value="aadhaar_number">ஆதார் எண்</option>
              </select>
            </div>

            {/* Search Results */}
            {buyerSearchResults.length > 0 && (
              <ul className="mt-2">
                {buyerSearchResults.map((result) => (
                  <li key={result.id} className="flex items-center justify-between py-2 border-b">
                    <div>
                      {result.name} ({result.phone})
                    </div>
                    <button
                      className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                      onClick={() => addParty(result, "buyer")}
                    >
                      சேர்க்க
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Added Buyers List */}
          <div>
            <h3 className="text-lg font-semibold mb-2">சேர்க்கப்பட்ட வாங்குபவர்கள்:</h3>
            {buyers.length === 0 ? (
              <p>வாங்குபவர்கள் யாரும் சேர்க்கப்படவில்லை.</p>
            ) : (
              <ul>
                {buyers.map((buyer) => (
                  <li key={buyer.id} className="flex items-center justify-between py-2 border-b">
                    <div>
                      {buyer.name} ({buyer.phone})
                    </div>
                    <button
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                      onClick={() => removeParty(buyer.id, "buyer")}
                    >
                      நீக்கு
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      )}

      {/* Section 5: Sellers */}
      {activeTab === "section5" && (
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-4">விற்பனையாளர்கள்</h2>

          {/* Search Section */}
          <div className="mb-4">
            <label htmlFor="sellerSearchTerm" className="block text-gray-700 text-sm font-bold mb-2">
              விற்பனையாளர்களைத் தேடு:
            </label>
            <div className="flex">
              <input
                type="text"
                id="sellerSearchTerm"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
                placeholder="பெயர், தொலைபேசி அல்லது ஆதார் எண் மூலம் தேடுங்கள்"
                value={sellerSearchTerm}
                onChange={(e) => {
                  setSellerSearchTerm(e.target.value)
                  searchParties(e.target.value, sellerSearchBy, "seller")
                }}
              />
              <select
                className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={sellerSearchBy}
                onChange={(e) => setSellerSearchBy(e.target.value as "name" | "phone" | "aadhaar_number")}
              >
                <option value="name">பெயர்</option>
                <option value="phone">தொலைபேசி</option>
                <option value="aadhaar_number">ஆதார் எண்</option>
              </select>
            </div>

            {/* Search Results */}
            {sellerSearchResults.length > 0 && (
              <ul className="mt-2">
                {sellerSearchResults.map((result) => (
                  <li key={result.id} className="flex items-center justify-between py-2 border-b">
                    <div>
                      {result.name} ({result.phone})
                    </div>
                    <button
                      className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                      onClick={() => addParty(result, "seller")}
                    >
                      சேர்க்க
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Added Sellers List */}
          <div>
            <h3 className="text-lg font-semibold mb-2">சேர்க்கப்பட்ட விற்பனையாளர்கள்:</h3>
            {sellers.length === 0 ? (
              <p>விற்பனையாளர்கள் யாரும் சேர்க்கப்படவில்லை.</p>
            ) : (
              <ul>
                {sellers.map((seller) => (
                  <li key={seller.id} className="flex items-center justify-between py-2 border-b">
                    <div>
                      {seller.name} ({seller.phone})
                    </div>
                    <button
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                      onClick={() => removeParty(seller.id, "seller")}
                    >
                      நீக்கு
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      )}

      {/* Section 6: Witnesses */}
      {activeTab === "section6" && (
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-4">சாட்சிகள்</h2>

          {/* Search Section */}
          <div className="mb-4">
            <label htmlFor="witnessSearchTerm" className="block text-gray-700 text-sm font-bold mb-2">
              சாட்சிகளைத் தேடு:
            </label>
            <div className="flex">
              <input
                type="text"
                id="witnessSearchTerm"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
                placeholder="பெயர், தொலைபேசி அல்லது ஆதார் எண் மூலம் தேடுங்கள்"
                value={witnessSearchTerm}
                onChange={(e) => {
                  setWitnessSearchTerm(e.target.value)
                  searchParties(e.target.value, witnessSearchBy, "witness")
                }}
              />
              <select
                className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={witnessSearchBy}
                onChange={(e) => setWitnessSearchBy(e.target.value as "name" | "phone" | "aadhaar_number")}
              >
                <option value="name">பெயர்</option>
                <option value="phone">தொலைபேசி</option>
                <option value="aadhaar_number">ஆதார் எண்</option>
              </select>
            </div>

            {/* Search Results */}
            {witnessSearchResults.length > 0 && (
              <ul className="mt-2">
                {witnessSearchResults.map((result) => (
                  <li key={result.id} className="flex items-center justify-between py-2 border-b">
                    <div>
                      {result.name} ({result.phone})
                    </div>
                    <button
                      className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                      onClick={() => addParty(result, "witness")}
                    >
                      சேர்க்க
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Added Witnesses List */}
          <div>
            <h3 className="text-lg font-semibold mb-2">சேர்க்கப்பட்ட சாட்சிகள்:</h3>
            {witnesses.length === 0 ? (
              <p>சாட்சிகள் யாரும் சேர்க்கப்படவில்லை.</p>
            ) : (
              <ul>
                {witnesses.map((witness) => (
                  <li key={witness.id} className="flex items-center justify-between py-2 border-b">
                    <div>
                      {witness.name} ({witness.phone})
                    </div>
                    <button
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                      onClick={() => removeParty(witness.id, "witness")}
                    >
                      நீக்கு
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      )}

      {/* Section 7: Property Details */}
      {activeTab === "section7" && (
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-4">சொத்து விவரங்கள்</h2>

          {/* Search Section */}
          <div className="mb-4">
            <label htmlFor="propertySearchTerm" className="block text-gray-700 text-sm font-bold mb-2">
              சொத்துக்களைத் தேடு:
            </label>
            <div className="flex">
              <input
                type="text"
                id="propertySearchTerm"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
                placeholder="சொத்தின் பெயர் மூலம் தேடுங்கள்"
                value={propertySearchTerm}
                onChange={(e) => {
                  setPropertySearchTerm(e.target.value)
                  searchProperties(e.target.value)
                }}
              />
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => setShowPropertyFilters(!showPropertyFilters)}
              >
                வடிகட்டிகளை காட்டு
              </button>
            </div>

            {/* Property Filters */}
            {showPropertyFilters && (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label
                    htmlFor="propertyFilterRegistrationDistrict"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    பதிவு மாவட்டம்:
                  </label>
                  <select
                    id="propertyFilterRegistrationDistrict"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={propertyFilterRegistrationDistrictId}
                    onChange={handlePropertyFilterRegistrationDistrictChange}
                  >
                    <option value="">தேர்ந்தெடு</option>
                    {registrationDistricts.map((district) => (
                      <option key={district.id} value={district.id}>
                        {district.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="propertyFilterSubRegistrarOffice"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    துணைப் பதிவாளர் அலுவலகம்:
                  </label>
                  <select
                    id="propertyFilterSubRegistrarOffice"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={propertyFilterSubRegistrarOfficeId}
                    onChange={handlePropertyFilterSubRegistrarOfficeChange}
                    disabled={!propertyFilterRegistrationDistrictId}
                  >
                    <option value="">தேர்ந்தெடு</option>
                    {filteredPropertySubRegistrarOffices.map((office) => (
                      <option key={office.id} value={office.id}>
                        {office.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="propertyFilterDistrict" className="block text-gray-700 text-sm font-bold mb-2">
                    மாவட்டம்:
                  </label>
                  <select
                    id="propertyFilterDistrict"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={propertyFilterDistrictId}
                    onChange={handlePropertyFilterDistrictChange}
                    disabled={!propertyFilterSubRegistrarOfficeId}
                  >
                    <option value="">தேர்ந்தெடு</option>
                    {districts.map((district) => (
                      <option key={district.id} value={district.id}>
                        {district.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="propertyFilterTaluk" className="block text-gray-700 text-sm font-bold mb-2">
                    வட்டம்:
                  </label>
                  <select
                    id="propertyFilterTaluk"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={propertyFilterTalukId}
                    onChange={handlePropertyFilterTalukChange}
                    disabled={!propertyFilterDistrictId}
                  >
                    <option value="">தேர்ந்தெடு</option>
                    {filteredPropertyTaluks.map((taluk) => (
                      <option key={taluk.id} value={taluk.id}>
                        {taluk.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="propertyFilterVillage" className="block text-gray-700 text-sm font-bold mb-2">
                    கிராமம்:
                  </label>
                  <select
                    id="propertyFilterVillage"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={propertyFilterVillageId}
                    onChange={(e) => setPropertyFilterVillageId(e.target.value)}
                    disabled={!propertyFilterTalukId}
                  >
                    <option value="">தேர்ந்தெடு</option>
                    {filteredPropertyVillages.map((village) => (
                      <option key={village.id} value={village.id}>
                        {village.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Search Results */}
            {propertySearchResults.length > 0 && (
              <ul className="mt-2">
                {propertySearchResults.map((result) => (
                  <li key={result.id} className="flex items-center justify-between py-2 border-b">
                    <div>
                      {result.property_name} ({result.villages?.name}, {result.taluks?.name})
                    </div>
                    <button
                      className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                      onClick={() => addProperty(result)}
                    >
                      சேர்க்க
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* New Property Section */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">புதிய சொத்து:</h3>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => setShowNewPropertyForm(!showNewPropertyForm)}
            >
              {showNewPropertyForm ? "புதிய சொத்து படிவத்தை மறை" : "புதிய சொத்து படிவத்தை காட்டு"}
            </button>

            {showNewPropertyForm && (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="newPropertyPlotNumber" className="block text-gray-700 text-sm font-bold mb-2">
                    மனை எண்:
                  </label>
                  <input
                    type="text"
                    id="newPropertyPlotNumber"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="மனை எண்"
                    value={newPropertyPlotNumber}
                    onChange={(e) => setNewPropertyPlotNumber(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="newPropertyOldSurveyNumber" className="block text-gray-700 text-sm font-bold mb-2">
                    பழைய சர்வே எண்:
                  </label>
                  <input
                    type="text"
                    id="newPropertyOldSurveyNumber"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="பழைய சர்வே எண்"
                    value={newPropertyOldSurveyNumber}
                    onChange={(e) => setNewPropertyOldSurveyNumber(e.target.value)}
                  />
                </div>
                <div>
                  <label
                    htmlFor="newPropertyOldSubdivisionNumber"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    பழைய உட்பிரிவு எண்:
                  </label>
                  <input
                    type="text"
                    id="newPropertyOldSubdivisionNumber"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="பழைய உட்பிரிவு எண்"
                    value={newPropertyOldSubdivisionNumber}
                    onChange={(e) => setNewPropertyOldSubdivisionNumber(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="newPropertyNewSurveyNumber" className="block text-gray-700 text-sm font-bold mb-2">
                    புதிய சர்வே எண்:
                  </label>
                  <input
                    type="text"
                    id="newPropertyNewSurveyNumber"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="புதிய சர்வே எண்"
                    value={newPropertyNewSurveyNumber}
                    onChange={(e) => setNewPropertyNewSurveyNumber(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="newPropertyNorthBoundary" className="block text-gray-700 text-sm font-bold mb-2">
                    வடக்கு எல்லை:
                  </label>
                  <input
                    type="text"
                    id="newPropertyNorthBoundary"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="வடக்கு எல்லை"
                    value={newPropertyNorthBoundary}
                    onChange={(e) => setNewPropertyNorthBoundary(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="newPropertyEastBoundary" className="block text-gray-700 text-sm font-bold mb-2">
                    கிழக்கு எல்லை:
                  </label>
                  <input
                    type="text"
                    id="newPropertyEastBoundary"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="கிழக்கு எல்லை"
                    value={newPropertyEastBoundary}
                    onChange={(e) => setNewPropertyEastBoundary(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="newPropertySouthBoundary" className="block text-gray-700 text-sm font-bold mb-2">
                    தெற்கு எல்லை:
                  </label>
                  <input
                    type="text"
                    id="newPropertySouthBoundary"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="தெற்கு எல்லை"
                    value={newPropertySouthBoundary}
                    onChange={(e) => setNewPropertySouthBoundary(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="newPropertyWestBoundary" className="block text-gray-700 text-sm font-bold mb-2">
                    மேற்கு எல்லை:
                  </label>
                  <input
                    type="text"
                    id="newPropertyWestBoundary"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="மேற்கு எல்லை"
                    value={newPropertyWestBoundary}
                    onChange={(e) => setNewPropertyWestBoundary(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="newPropertyNorthMeasurement" className="block text-gray-700 text-sm font-bold mb-2">
                    வடக்கு அளவு:
                  </label>
                  <input
                    type="text"
                    id="newPropertyNorthMeasurement"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="வடக்கு அளவு"
                    value={newPropertyNorthMeasurement}
                    onChange={(e) => setNewPropertyNorthMeasurement(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="newPropertySouthMeasurement" className="block text-gray-700 text-sm font-bold mb-2">
                    தெற்கு அளவு:
                  </label>
                  <input
                    type="text"
                    id="newPropertySouthMeasurement"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="தெற்கு அளவு"
                    value={newPropertySouthMeasurement}
                    onChange={(e) => setNewPropertySouthMeasurement(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="newPropertyEastMeasurement" className="block text-gray-700 text-sm font-bold mb-2">
                    கிழக்கு அளவு:
                  </label>
                  <input
                    type="text"
                    id="newPropertyEastMeasurement"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="கிழக்கு அளவு"
                    value={newPropertyEastMeasurement}
                    onChange={(e) => setNewPropertyEastMeasurement(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="newPropertyWestMeasurement" className="block text-gray-700 text-sm font-bold mb-2">
                    மேற்கு அளவு:
                  </label>
                  <input
                    type="text"
                    id="newPropertyWestMeasurement"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="மேற்கு அளவு"
                    value={newPropertyWestMeasurement}
                    onChange={(e) => setNewPropertyWestMeasurement(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="newPropertyTotalSqFeet" className="block text-gray-700 text-sm font-bold mb-2">
                    மொத்த சதுர அடி:
                  </label>
                  <input
                    type="text"
                    id="newPropertyTotalSqFeet"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="மொத்த சதுர அடி"
                    value={newPropertyTotalSqFeet}
                    onChange={(e) => setNewPropertyTotalSqFeet(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="newPropertyTotalSqMeter" className="block text-gray-700 text-sm font-bold mb-2">
                    மொத்த சதுர மீட்டர்:
                  </label>
                  <input
                    type="text"
                    id="newPropertyTotalSqMeter"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="மொத்த சதுர மீட்டர்"
                    value={newPropertyTotalSqMeter}
                    onChange={(e) => setNewPropertyTotalSqMeter(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="newPropertyGuideValueSqft" className="block text-gray-700 text-sm font-bold mb-2">
                    வழிகாட்டி மதிப்பு (சதுர அடி):
                  </label>
                  <input
                    type="text"
                    id="newPropertyGuideValueSqft"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="வழிகாட்டி மதிப்பு (சதுர அடி)"
                    value={newPropertyGuideValueSqft}
                    onChange={(e) => setNewPropertyGuideValueSqft(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="newPropertyGuideValueSqm" className="block text-gray-700 text-sm font-bold mb-2">
                    வழிகாட்டி மதிப்பு (சதுர மீட்டர்):
                  </label>
                  <input
                    type="text"
                    id="newPropertyGuideValueSqm"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="வழிகாட்டி மதிப்பு (சதுர மீட்டர்)"
                    value={newPropertyGuideValueSqm}
                    onChange={(e) => setNewPropertyGuideValueSqm(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="newPropertyDetails" className="block text-gray-700 text-sm font-bold mb-2">
                    சொத்து விவரங்கள்:
                  </label>
                  <textarea
                    id="newPropertyDetails"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="சொத்து விவரங்கள்"
                    value={newPropertyDetails}
                    onChange={(e) => setNewPropertyDetails(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="newPropertyDistrict" className="block text-gray-700 text-sm font-bold mb-2">
                    மாவட்டம்:
                  </label>
                  <select
                    id="newPropertyDistrict"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={newPropertyDistrictId}
                    onChange={handleNewPropertyDistrictChange}
                  >
                    <option value="">தேர்ந்தெடு</option>
                    {districts.map((district) => (
                      <option key={district.id} value={district.id}>
                        {district.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="newPropertyTaluk" className="block text-gray-700 text-sm font-bold mb-2">
                    வட்டம்:
                  </label>
                  <select
                    id="newPropertyTaluk"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={newPropertyTalukId}
                    onChange={handleNewPropertyTalukChange}
                    disabled={!newPropertyDistrictId}
                  >
                    <option value="">தேர்ந்தெடு</option>
                    {filteredTaluks.map((taluk) => (
                      <option key={taluk.id} value={taluk.id}>
                        {taluk.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="newPropertyVillage" className="block text-gray-700 text-sm font-bold mb-2">
                    கிராமம்:
                  </label>
                  <select
                    id="newPropertyVillage"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={newPropertyVillageId}
                    onChange={handleNewPropertyVillageChange}
                    disabled={!newPropertyTalukId}
                  >
                    <option value="">தேர்ந்தெடு</option>
                    {filteredVillages.map((village) => (
                      <option key={village.id} value={village.id}>
                        {village.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="newPropertyHasBuilding" className="block text-gray-700 text-sm font-bold mb-2">
                    கட்டிடம் உள்ளதா?
                  </label>
                  <input
                    type="checkbox"
                    id="newPropertyHasBuilding"
                    className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    checked={newPropertyHasBuilding}
                    onChange={(e) => setNewPropertyHasBuilding(e.target.checked)}
                  />
                </div>
                <div>
                  <label
                    htmlFor="newPropertyUseLandValueCalculation"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    நில மதிப்பு கணக்கீட்டை பயன்படுத்தவா?
                  </label>
                  <input
                    type="checkbox"
                    id="newPropertyUseLandValueCalculation"
                    className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    checked={newPropertyUseLandValueCalculation}
                    onChange={(e) => setNewPropertyUseLandValueCalculation(e.target.checked)}
                  />
                </div>
                {!newPropertyUseLandValueCalculation && (
                  <div>
                    <label htmlFor="newPropertyManualLandValue" className="block text-gray-700 text-sm font-bold mb-2">
                      நில மதிப்பு:
                    </label>
                    <input
                      type="text"
                      id="newPropertyManualLandValue"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      placeholder="நில மதிப்பு"
                      value={newPropertyManualLandValue}
                      onChange={(e) => setNewPropertyManualLandValue(e.target.value)}
                    />
                  </div>
                )}
                <div>
                  <button
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    onClick={handleNewPropertySubmit}
                  >
                    புதிய சொத்தை உருவாக்கு
                  </button>
                </div>
              </div>
            )}

            {previewOnlyProperty && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">உருவாக்கப்பட்ட சொத்து:</h3>
                <p>மனை எண்: {previewOnlyProperty.property_name}</p>
                <p>சர்வே எண்: {previewOnlyProperty.survey_number}</p>
                <p>வழிகாட்டி மதிப்பு (சதுர அடி): {previewOnlyProperty.guide_value_sqft}</p>
                <p>வழிகாட்டி மதிப்பு (சதுர மீட்டர்): {previewOnlyProperty.guide_value_sqm}</p>
                <p>சொத்து விவரங்கள்: {previewOnlyProperty.property_details}</p>
              </div>
            )}
          </div>

          {/* Added Properties List */}
          <div>
            <h3 className="text-lg font-semibold mb-2">சேர்க்கப்பட்ட சொத்துக்கள்:</h3>
            {selectedProperties.length === 0 ? (
              <p>சொத்துக்கள் எதுவும் சேர்க்கப்படவில்லை.</p>
            ) : (
              <ul>
                {selectedProperties.map((property) => (
                  <li key={property.id} className="flex items-center justify-between py-2 border-b">
                    <div>
                      {property.property_name} ({property.villages?.name}, {property.taluks?.name})
                    </div>
                    <button
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                      onClick={() => removeProperty(property.id)}
                    >
                      நீக்கு
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Land Types */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">நிலத்தின் வகைகள்:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {landTypes.map((type) => (
                <div key={type.id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`landType-${type.id}`}
                    className="mr-2"
                    value={type.id}
                    checked={selectedLandTypes.includes(type.id.toString())}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedLandTypes([...selectedLandTypes, type.id.toString()])
                      } else {
                        setSelectedLandTypes(selectedLandTypes.filter((id) => id !== type.id.toString()))
                      }
                    }}
                  />
                  <label htmlFor={`landType-${type.id}`} className="text-gray-700 text-sm font-bold">
                    {type.name}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Value Types */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">மதிப்பு வகைகள்:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {valueTypes.map((type) => (
                <div key={type.id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`valueType-${type.id}`}
                    className="mr-2"
                    value={type.id}
                    checked={selectedValueTypes.includes(type.id.toString())}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedValueTypes([...selectedValueTypes, type.id.toString()])
                      } else {
                        setSelectedValueTypes(selectedValueTypes.filter((id) => id !== type.id.toString()))
                      }
                    }}
                  />
                  <label htmlFor={`valueType-${type.id}`} className="text-gray-700 text-sm font-bold">
                    {type.name}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Section 8: Payment Details */}
      {activeTab === "section8" && (
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-4">கட்டண விவரங்கள்</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="paymentMethod" className="block text-gray-700 text-sm font-bold mb-2">
                கட்டண முறை:
              </label>
              <select
                id="paymentMethod"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={selectedPaymentMethod || ""}
                onChange={(e) => setSelectedPaymentMethod(e.target.value)}
              >
                <option value="">தேர்ந்தெடு</option>
                {paymentMethods.map((method) => (
                  <option key={method.id} value={method.id}>
                    {method.name}
                  </option>
                ))}
              </select>
            </div>
            {selectedPaymentMethod && (
              <>
                <div>
                  <label htmlFor="buyerBankName" className="block text-gray-700 text-sm font-bold mb-2">
                    வாங்குபவர் வங்கி பெயர்:
                  </label>
                  <input
                    type="text"
                    id="buyerBankName"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="வாங்குபவர் வங்கி பெயர்"
                    value={buyerBankName}
                    onChange={(e) => setBuyerBankName(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="buyerBankBranch" className="block text-gray-700 text-sm font-bold mb-2">
                    வாங்குபவர் வங்கி கிளை:
                  </label>
                  <input
                    type="text"
                    id="buyerBankBranch"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="வாங்குபவர் வங்கி கிளை"
                    value={buyerBankBranch}
                    onChange={(e) => setBuyerBankBranch(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="buyerAccountType" className="block text-gray-700 text-sm font-bold mb-2">
                    வாங்குபவர் கணக்கு வகை:
                  </label>
                  <select
                    id="buyerAccountType"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={buyerAccountType}
                    onChange={(e) => setBuyerAccountType(e.target.value)}
                  >
                    <option value="">தேர்ந்தெடு</option>
                    {accountTypes.map((type) => (
                      <option key={type.id} value={type.name}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="buyerAccountNumber" className="block text-gray-700 text-sm font-bold mb-2">
                    வாங்குபவர் கணக்கு எண்:
                  </label>
                  <input
                    type="text"
                    id="buyerAccountNumber"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="வாங்குபவர் கணக்கு எண்"
                    value={buyerAccountNumber}
                    onChange={(e) => setBuyerAccountNumber(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="sellerBankName" className="block text-gray-700 text-sm font-bold mb-2">
                    விற்பனையாளர் வங்கி பெயர்:
                  </label>
                  <input
                    type="text"
                    id="sellerBankName"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="விற்பனையாளர் வங்கி பெயர்"
                    value={sellerBankName}
                    onChange={(e) => setSellerBankName(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="sellerBankBranch" className="block text-gray-700 text-sm font-bold mb-2">
                    விற்பனையாளர் வங்கி கிளை:
                  </label>
                  <input
                    type="text"
                    id="sellerBankBranch"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="விற்பனையாளர் வங்கி கிளை"
                    value={sellerBankBranch}
                    onChange={(e) => setSellerBankBranch(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="sellerAccountType" className="block text-gray-700 text-sm font-bold mb-2">
                    விற்பனையாளர் கணக்கு வகை:
                  </label>
                  <select
                    id="sellerAccountType"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={sellerAccountType}
                    onChange={(e) => setSellerAccountType(e.target.value)}
                  >
                    <option value="">தேர்ந்தெடு</option>
                    {accountTypes.map((type) => (
                      <option key={type.id} value={type.name}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="sellerAccountNumber" className="block text-gray-700 text-sm font-bold mb-2">
                    விற்பனையாளர் கணக்கு எண்:
                  </label>
                  <input
                    type="text"
                    id="sellerAccountNumber"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="விற்பனையாளர் கணக்கு எண்"
                    value={sellerAccountNumber}
                    onChange={(e) => setSellerAccountNumber(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="transactionNumber" className="block text-gray-700 text-sm font-bold mb-2">
                    பரிவர்த்தனை எண்:
                  </label>
                  <input
                    type="text"
                    id="transactionNumber"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="பரிவர்த்தனை எண்"
                    value={transactionNumber}
                    onChange={(e) => setTransactionNumber(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="transactionDate" className="block text-gray-700 text-sm font-bold mb-2">
                    பரிவர்த்தனை தேதி:
                  </label>
                  <input
                    type="text"
                    id="transactionDate"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="DD/MM/YYYY"
                    value={transactionDate}
                    onChange={(e) => setTransactionDate(e.target.value)}
                  />
                </div>
              </>
            )}
          </div>
        </section>
      )}

      {/* Section 9: Building Details */}
      {activeTab === "section9" && (
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-4">கட்டிட விவரங்கள்</h2>

          {shouldShowBuildingForm ? (
            <BuildingForm
              onAddBuilding={handleAddBuilding}
              onCancel={() => {
                setShouldShowBuildingForm(false)
                setIsEditingBuilding(false)
                setSelectedBuildingForEdit(null)
              }}
              initialBuilding={selectedBuildingForEdit}
              isEditing={isEditingBuilding}
            />
          ) : (
            <div className="space-y-4">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => {
                  setShouldShowBuildingForm(true)
                  setIsEditingBuilding(false)
                  setSelectedBuildingForEdit(null)
                }}
              >
                புதிய கட்டிட விவரங்களை சேர்க்க
              </button>

              <BuildingDisplay buildings={buildings} onEdit={handleEditBuilding} onRemove={handleRemoveBuilding} />
            </div>
          )}
        </section>
      )}

      {/* Document Content */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-4">ஆவண உள்ளடக்கம்</h2>
        <div className="document-content border p-4 rounded shadow-md" contentEditable suppressContentEditableWarning>
          {/* Initial content or dynamic content based on user input */}
          <p>
            <span className="english-text">Sale Deed / விற்பனை பத்திரம்</span>
          </p>
          <p>
            <span className="english-text">Document Date:</span> {documentDate}
          </p>
          <p>
            <span className="english-text">Sale Amount:</span> {saleAmount}
          </p>
          <p>
            <span className="english-text">Sale Amount in Words:</span> {saleAmountWords}
          </p>
          {/* Add more content here */}
        </div>
      </section>
    </div>
  )
}
