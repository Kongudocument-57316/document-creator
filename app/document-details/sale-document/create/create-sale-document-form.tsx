"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase"
import { toast } from "sonner"
import { numToTamilWords } from "@/lib/number-to-words"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Printer, FileDown, FileText, Search, Plus, X, Check } from "lucide-react"

// Import the export utilities
import { exportToDocx, exportToPdf } from "./export-utils"

// Import the DocumentNameDialog and saveDocument action
import { DocumentNameDialog } from "@/components/document-name-dialog"
import { saveDocument } from "./save-document-action"

// BuildingForm கூறுகளை import செய்ய கோப்பின் ஆரம்பத்தில் இந்த import அறிக்கைகளைச் சேர்க்கவும்:
import { BuildingForm, type BuildingDetail } from "./building-form"

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

// Component props interface
interface CreateSaleDocumentFormProps {
  initialData?: any
  isEditMode?: boolean
  onFormDataChange?: (data: any) => void
}

// அச்சிடும் CSS ஸ்டைல்களை மேம்படுத்துகிறேன்

// அச்சிடும் போது பட்டன்கள் மறைவதற்கான CSS ஸ்டைல்கள்
const printStyles = `
@media print {
  /* அடிப்படை அச்சிடும் அமைப்புகள் */
  button, .no-print, nav, header, .flex.justify-between.mb-6 {
    display: none !important;
  }
  
  .print-only {
    display: block !important;
  }
  
  /* லீகல் சைஸ் பேப்பர் அமைப்பு */
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
  
  /* ஆவண உள்ளடக்கம் */
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
  
  /* முதல் மற்றும் இரண்டாம் பக்கங்களுக்கான 15.5 செ.மீ இடைவெளி */
  .document-content::before {
    content: "";
    display: block;
    height: 15.5cm;
    width: 100%;
    page-break-after: always;
  }
  
  /* மூன்றாம் பக்கம் முதல் இயல்பாக ஆரம்பிக்க */
  .document-content > *:nth-child(3) {
    page-break-before: always;
    margin-top: 1cm;
  }
  
  /* தலைப்பு மற்றும் தேதி */
  .document-content h1.text-3xl,
  .document-content .text-lg {
    text-align: center;
    margin-bottom: 1cm;
  }
  
  /* பத்தி அமைப்புகள் */
  .document-content p {
    text-align: justify;
    text-indent: 0.5in;
    margin-bottom: 0.25in;
    line-height: 1.5;
    orphans: 4;
    widows: 3;
  }
  
  /* சொத்து விவரங்கள் */
  .document-content h3.text-xl {
    text-align: center;
    margin-top: 0.5in;
    margin-bottom: 0.25in;
    page-break-after: avoid;
  }
  
  /* சாட்சிகள் பகுதி */
  .document-content ol.list-decimal {
    padding-left: 0.75in;
    margin-bottom: 0.25in;
  }
  
  .document-content ol.list-decimal li {
    margin-bottom: 0.15in;
  }
  
  /* கையொப்ப பகுதி */
  .document-content .flex.justify-between.mt-8.mb-6 {
    display: flex !important;
    justify-content: space-between !important;
    margin-top: 1in !important;
    page-break-inside: avoid;
    position: fixed;
    bottom: 2in;
    left: 1in;
    right: 1in;
    width: calc(100% - 2in);
  }
  
  /* பக்க எண்கள் */
  .document-content::after {
    content: counter(page);
    counter-increment: page;
    position: fixed;
    top: 0.5in;
    left: 0;
    right: 0;
    text-align: center;
    font-size: 12pt;
  }
  
  /* எழுதிக்கொடுப்பவர் மற்றும் எழுதிவாங்குபவர் */
  .document-content .flex.justify-between.mt-8.mb-6 p {
    font-weight: bold;
    margin-bottom: 0.5in;
  }
  
  /* பக்க பிரிப்புகள் */
  .document-content .mb-6 {
    page-break-inside: avoid;
  }
  
  /* சொத்து விவரங்கள் பகுதி */
  .document-content .whitespace-pre-line {
    white-space: pre-line;
    text-align: justify;
    text-indent: 0.5in;
  }
  
  /* தட்டச்சு விவரங்கள் */
  .document-content .text-right {
    text-align: right;
    margin-top: 0.5in;
    page-break-inside: avoid;
  }
  
  /* ஆங்கில எழுத்துக்கள் மற்றும் எண்கள் */
  .document-content .english-text,
  .document-content .number {
    font-family: 'Times New Roman', serif !important;
  }
}

/* Font styles for preview */
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

/* பத்தி அமைப்புகள் */
.document-content p {
  text-align: justify;
  margin-bottom: 1rem;
}

/* சொத்து விவரங்கள் */
.document-content .whitespace-pre-line {
  white-space: pre-line;
}

/* சாட்சிகள் பகுதி */
.document-content ol.list-decimal {
  padding-left: 1.5rem;
}

.document-content ol.list-decimal li {
  margin-bottom: 0.5rem;
}

/* கையொப்ப பகுதி */
.document-content .flex.justify-between.mt-8.mb-6 {
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
  margin-bottom: 1.5rem;
}

/* தட்டச்சு விவரங்கள் */
.document-content .text-right {
  text-align: right;
}
`

export function CreateSaleDocumentForm({
  initialData,
  isEditMode = false,
  onFormDataChange,
}: CreateSaleDocumentFormProps) {
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

  // புதிய சொத்து தரவை இடைநிலை சேமிப்பதற்கான state variable சேர்க்க
  const [previewOnlyProperty, setPreviewOnlyProperty] = useState<Property | null>(null)

  // புதிய சொத்து விவரங்கள் - புதிய சொத்து சேர்க்க
  // புதிய சொத்து விவரங்கள் - புதிய சொத்து சேர்க்க state variables-ஐ மாற்றவும்
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

  // தொகை செலுத்தும் விவரங்கள்
  const [selectedPaymentMethods, setSelectedPaymentMethods] = useState<string[]>([])
  // பணம் செலுத்தும் முறை விவரங்களுக்கான state variables சேர்க்கவும்:
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

  // கட்டிட விவரங்கள்
  const [shouldShowBuildingForm, setShouldShowBuildingForm] = useState(false)
  const [buildings, setBuildings] = useState<BuildingDetail[]>([])
  const [selectedBuildingForEdit, setSelectedBuildingForEdit] = useState<BuildingDetail | null>(null)
  const [isEditingBuilding, setIsEditingBuilding] = useState(false)

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
  const [registrationDistricts, setRegistrationDistricts] = useState<SubRegistrarOffice[]>([])

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

  // Document name dialog state
  const [showNameDialog, setShowNameDialog] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // கட்டிட சேர்ப்பு செயல்பாடு
  const handleAddBuilding = (building: BuildingDetail) => {
    if (isEditingBuilding) {
      // ஏற்கனவே உள்ள கட்டிடத்தை புதுப்பித்தல்
      setBuildings(buildings.map((b) => (b.id === building.id ? building : b)))
      setIsEditingBuilding(false)
      setSelectedBuildingForEdit(null)
    } else {
      // புதிய கட்டிடம் சேர்த்தல்
      setBuildings([...buildings, building])
    }
    setShouldShowBuildingForm(false)
    toast.success(isEditingBuilding ? "கட்டிட விவரங்கள் வெற்றிகரமாக புதுப்பிக்கப்பட்டன" : "கட்டிட விவரங்கள் வெற்றிகரமாக சேர்க்கப்பட்டன")
  }

  // கட்டிட திருத்தம் செயல்பாடு
  const handleEditBuilding = (building: BuildingDetail) => {
    setSelectedBuildingForEdit(building)
    setIsEditingBuilding(true)
    setShouldShowBuildingForm(true)
  }

  // கட்டிட நீக்கம் செயல்பாடு
  const handleRemoveBuilding = (buildingId: string) => {
    setBuildings(buildings.filter((building) => building.id !== buildingId))
    toast.success("கட்டிட விவரங்கள் வெற்றிகரமாக நீக்கப்பட்டன")
  }

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
    fetchRegistrationDistricts()
    // Load all reference data on component mount
    fetchAccountTypes() // கணக்கு வகைகளை பெறுதல்
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
      // Use a ref to prevent unnecessary updates
      const updateParent = () => {
        // Get the document content from the preview
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

      // Use setTimeout to break the potential update cycle
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

  // Add a new useEffect that updates only when the preview tab is active
  useEffect(() => {
    if (isEditMode && onFormDataChange && activeTab === "preview") {
      // Get the document content from the preview
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
      })
    }
  }, [
    activeTab,
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

  const fetchRegistrationDistricts = async () => {
    try {
      const { data, error } = await supabase.from("registration_districts").select("*").order("name")
      if (error) throw error
      setRegistrationDistricts(data || [])
    } catch (error: any) {
      toast.error("பதிவு மாவட்டங்களை பெறுவதில் பிழை: " + error.message)
    }
  }

  // கணக்கு வகைகளை பெறுதல்
  const fetchAccountTypes = async () => {
    try {
      const { data, error } = await supabase.from("account_types").select("*").order("name")
      if (error) throw error
      setAccountTypes(data || [])
    } catch (error: any) {
      toast.error("கணக்கு வகைகளை பெறுவதில் பிழை: " + error.message)
    }
  }

  // சொத்து தேடுதல் வடிகட்டிகளுக்கான useEffect
  useEffect(() => {
    if (propertyFilterRegistrationDistrictId && propertyFilterRegistrationDistrictId !== "all") {
      const filtered = subRegistrarOffices.filter(
        (office) => office.registration_district_id === Number.parseInt(propertyFilterRegistrationDistrictId),
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

  // சொத்து விவரங்களை உருவாக்கும் ஃபங்க்ஷன்
  const generatePropertyDetails = () => {
    let details = ""

    // மனை எண் மற்றும் எல்லைகள்
    details += "மனை எண்:-" + newPropertyPlotNumber + "\n"
    details += newPropertyNorthBoundary + "………………………………………………………………………………வடக்கு\n"
    details += newPropertyEastBoundary + "………………………………………………………………………………கிழக்கு\n"
    details += newPropertySouthBoundary + "………………………………………………………………………………தெற்கு\n"
    details += newPropertyWestBoundary + "………………………………………………………………………………மேற்கு\n"

    // நான்கு பக்க அளவுகள்
    details +=
      "இதன் மத்தியில் வடபுறம் கிழமேலடி " +
      newPropertyNorthMeasurement +
      " அடி, தென்புறம் கிழமேலடி " +
      newPropertySouthMeasurement +
      " அடி, கிழபுறம் தென்வடலடி " +
      newPropertyEastMeasurement +
      " அடி, மேல்புறம் தென்வடலடி " +
      newPropertyWestMeasurement +
      " அடி, ஆக இதனளவு " +
      newPropertyTotalSqFeet +
      " சதுரடிக்கு " +
      newPropertyTotalSqMeter +
      " சதுரமீட்டர் அளவுள்ள இடம் மற்றும் அடிநிலம் பூராவும்.\n"

    // சர்வே எண் விவரங்கள்
    details +=
      "மேற்படி இடத்தில் கட்டிடம் " +
      (newPropertyHasBuilding ? "உள்ளது" : "ஏதுமில்லை") +
      ". மேற்படி ரீ.ச." +
      newPropertyOldSurveyNumber +
      " நெ காலையானது ரீ.ச." +
      newPropertyOldSubdivisionNumber +
      " நெ காலை என உட்பிரிவாகி, தற்போதைய புதிய உட்பிரிவின் படி ரீ.ச." +
      newPropertyNewSurveyNumber +
      " நெ காலை என உட்பிரிவாகி உள்ளது.\n"

    // சாலைகள் மற்றும் தடபாத்தியங்கள்
    details +=
      "மேற்படி இடத்திற்கு மேற்படி மனைப்பிரிவில் விடப்பட்டுள்ள சகல விதமான சாலைகளிலும், சகல விதமான கனரக வண்டி வாகனங்களுடன் பொதுவில் போக வர உள்ள மாமூல் தடபாத்தியங்கள் சகிதம் பூராவும்.\n"

    // இடத்தின் மதிப்பு
    if (newPropertyUseLandValueCalculation && newPropertyCalculatedLandValue) {
      details +=
        newPropertyTotalSqFeet +
        " சதுரடி (" +
        newPropertyTotalSqMeter +
        " ச.மீ X ரூ." +
        newPropertyGuideValueSqm +
        ") இடத்தின் மதிப்பு ரூ." +
        newPropertyCalculatedLandValue +
        "/-\n"
    } else if (newPropertyManualLandValue) {
      details += "இடத்தின் மதிப்பு ரூ." + newPropertyManualLandValue + "/-\n"
    }

    // தடபாத்திய மதிப்பு
    if (newPropertyPathwayValue) {
      details += "தடபாத்திய மதிப்பு ரூ." + newPropertyPathwayValue + "/-\n"
    }

    // மற்ற மதிப்புகள்
    newPropertyValues.forEach((item) => {
      if (item.value) {
        details += item.name + " ரூ." + item.value + "/-\n"
      }
    })

    // மொத்த மதிப்பு
    details += "ஆக மொத்த மதிப்பு ரூ." + newPropertyTotalValue + "/-\n"

    return details
  }

  // Handle new property preview only (without saving to database)
  const handlePreviewPropertyOnly = () => {
    if (!newPropertyPlotNumber.trim()) {
      toast.error("மனை எண்ணை உள்ளிடவும்")
      return
    }

    const propertyDetails = generatePropertyDetails()

    const propertyData = {
      id: Date.now(), // Temporary ID for the preview
      property_name: `மனை எண்: ${newPropertyPlotNumber}`,
      survey_number: newPropertyNewSurveyNumber || null,
      guide_value_sqm: newPropertyGuideValueSqm ? Number.parseFloat(newPropertyGuideValueSqm) : null,
      guide_value_sqft: newPropertyGuideValueSqft ? Number.parseFloat(newPropertyGuideValueSqft) : null,
      property_details: propertyDetails,
      registration_district_id: null,
      sub_registrar_office_id: null,
      district_id: null,
      taluk_id: null,
      village_id: null,
    } as Property

    setSelectedProperties([...selectedProperties, propertyData])

    // மொத்த மதிப்பை விற்பனை தொகையாக அமைக்கவும்
    if (newPropertyTotalValue) {
      setSaleAmount(newPropertyTotalValue)
    }

    toast.success("புதிய சொத்து முன்னோட்டத்தில் சேர்க்கப்பட்டது")
    resetNewPropertyForm()
    setActiveTab("preview")
  }

  // Handle new property submission
  const handleNewPropertySubmit = async () => {
    if (!newPropertyPlotNumber.trim()) {
      toast.error("மனை எண்ணை உள்ளிடவும்")
      return
    }

    try {
      const propertyDetails = generatePropertyDetails()

      const propertyData = {
        property_name: `மனை எண்: ${newPropertyPlotNumber}`,
        survey_number: newPropertyNewSurveyNumber || null,
        guide_value_sqm: newPropertyGuideValueSqm ? Number.parseFloat(newPropertyGuideValueSqm) : null,
        guide_value_sqft: newPropertyGuideValueSqft ? Number.parseFloat(newPropertyGuideValueSqft) : null,
        property_details: propertyDetails,
        registration_district_id: null,
        sub_registrar_office_id: null,
        district_id: null,
        taluk_id: null,
        village_id: null,
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

        // மொத்த மதிப்பை விற்பனை தொகையாக அமைக்கவும்
        if (newPropertyTotalValue) {
          setSaleAmount(newPropertyTotalValue)
        }

        toast.success("புதிய சொத்து வெற்றிகரமாக சேர்க்கப்பட்டது")
        resetNewPropertyForm()
      }
    } catch (error: any) {
      toast.error("சொத்தை சேர்ப்பதில் பிழை: " + error.message)
    }
  }

  // Reset new property form
  const resetNewPropertyForm = () => {
    setNewPropertyPlotNumber("")
    setNewPropertyNorthBoundary("")
    setNewPropertyEastBoundary("")
    setNewPropertySouthBoundary("")
    setNewPropertyWestBoundary("")
    setNewPropertyNorthMeasurement("")
    setNewPropertySouthMeasurement("")
    setNewPropertyEastMeasurement("")
    setNewPropertyWestMeasurement("")
    setNewPropertyTotalSqFeet("")
    setNewPropertyTotalSqMeter("")
    setNewPropertyOldSurveyNumber("")
    setNewPropertyOldSubdivisionNumber("")
    setNewPropertyNewSurveyNumber("")
    setNewPropertyHasBuilding(false)
    setNewPropertyGuideValueSqft("")
    setNewPropertyGuideValueSqm("")
    setNewPropertyDetails("")
    setNewPropertyValues([])
    // மொத்த மதிப்பை மட்டும் அழிக்காமல் வைத்திருக்கவும்
    // setNewPropertyTotalValue("")
    setNewPropertyManualLandValue("")
    setNewPropertyCalculatedLandValue("")
    setNewPropertyUseLandValueCalculation(true)
    setShowNewPropertyForm(false)
  }

  // மதிப்பு வகை தேர்வு மாற்றம் கையாளும் செயல்பாடு
  const handleValueTypeSelection = (id: string, checked: boolean) => {
    if (checked) {
      // மதிப்பு வகையை சேர்க்கவும்
      const valueType = valueTypes.find((type) => type.id.toString() === id)
      if (valueType) {
        setNewPropertyValues((prev) => [...prev, { id: id, name: valueType.name, value: "" }])
      }
    } else {
      // மதிப்பு வகையை நீக்கவும்
      setNewPropertyValues((prev) => prev.filter((item) => item.id !== id))
    }
  }

  // மதிப்பு மாற்றத்தை கையாளும் செயல்பாடு
  const handleValueChange = (id: string, value: string) => {
    setNewPropertyValues((prev) => prev.map((item) => (item.id === id ? { ...item, value } : item)))
  }

  // மொத்த மதிப்பை கணக்கிடும் செயல்பாடு
  const calculateTotalValue = useCallback(() => {
    let total = 0

    // இடத்தின் மதிப்பை சேர்க்கவும்
    if (newPropertyUseLandValueCalculation) {
      // தானியங்கி கணக்கீடு
      if (newPropertyCalculatedLandValue) {
        total += Number(newPropertyCalculatedLandValue)
      }
    } else {
      // கையால் உள்ளிடப்பட்ட மதிப்பு
      if (newPropertyManualLandValue) {
        total += Number(newPropertyManualLandValue)
      }
    }

    // மற்ற மதிப்புகளை சேர்க்கவும்
    newPropertyValues.forEach((item) => {
      if (item.value && !isNaN(Number(item.value))) {
        total += Number(item.value)
      }
    })

    // தடபாத்திய மதிப்பை சேர்க்கவும்
    if (newPropertyPathwayValue && !isNaN(Number(newPropertyPathwayValue))) {
      total += Number(newPropertyPathwayValue)
    }

    setNewPropertyTotalValue(total.toString())

    // மொத்த மதிப்பை விற்பனை தொகையாக அமைக்கவும் - இதை நீக்கவும்
    // setSaleAmount(total.toString())
  }, [
    newPropertyUseLandValueCalculation,
    newPropertyCalculatedLandValue,
    newPropertyManualLandValue,
    newPropertyValues,
    newPropertyPathwayValue,
  ])

  // இடத்தின் மதிப்பை கணக்கிடும் useEffect
  useEffect(() => {
    if (newPropertyTotalSqMeter && newPropertyGuideValueSqm) {
      const landValue = Number(newPropertyTotalSqMeter) * Number(newPropertyGuideValueSqm)
      setNewPropertyCalculatedLandValue(landValue.toString())
    } else {
      setNewPropertyCalculatedLandValue("")
    }
  }, [newPropertyTotalSqMeter, newPropertyGuideValueSqm])

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

    // In edit mode, we don't show the save dialog here
    // as it's handled by the parent component
    if (isEditMode) return

    setShowNameDialog(true)
  }

  // Handle document save with name
  const handleSaveWithName = async (documentName: string) => {
    try {
      setIsSaving(true)

      // Get the document content from the preview
      const documentContent = document.querySelector(".document-content")?.innerHTML || ""

      // Generate DOCX data
      let docxData = null
      try {
        // This is a placeholder - in a real implementation, you would convert the HTML to a binary DOCX
        // For now, we'll just store the HTML content
        docxData = null
      } catch (error) {
        console.error("Error generating DOCX:", error)
      }

      // Prepare data for saving
      const documentData = {
        documentName,
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
        // பணம் செலுத்தும் முறை விவரங்கள்
        paymentDetails: selectedPaymentMethod
          ? {
              paymentMethodId: selectedPaymentMethod,
              buyerBankName,
              buyerBankBranch,
              buyerAccountType,
              buyerAccountNumber,
              sellerBankName,
              sellerBankBranch,
              sellerAccountType,
              sellerAccountNumber,
              transactionNumber,
              transactionDate: formatDateForDB(transactionDate),
              amount: saleAmount ? Number.parseFloat(saleAmount) : null,
            }
          : null,
      }

      const result = await saveDocument(documentData)

      if (result.success) {
        toast.success("கிரைய ஆவணம் வெற்றிகரமாக சேமிக்கப்பட்டது")
        setShowNameDialog(false)

        // சேமித்த பிறகு தேடல் பக்கத்திற்கு திருப்பி அனுப்பவும்
        window.location.href = "/document-details/sale-document/search"
      } else {
        toast.error("கிரைய ஆவணத்தை சேமிப்பதில் பிழை: " + result.error)
      }
    } catch (error: any) {
      toast.error("கிரைய ஆவணத்தை சேமிப்பதில் பிழை: " + error.message)
    } finally {
      setIsSaving(false)
    }
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
      const newLandTypes = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]

      // கட்டிடத்துடன் கூடிய நில வகைகள் தேர்ந்தெடுக்கப்பட்டால் கட்டிட படிவத்தை காட்டு
      const buildingLandTypes = ["1", "3", "4"] // கட்டிடத்துடன் கூடிய நில வகைகளின் ID
      const hasBuildingType = newLandTypes.some((type) => buildingLandTypes.includes(type))
      setShouldShowBuildingForm(hasBuildingType)

      return newLandTypes
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
    // முந்தைய தேர்வுகளை அழிக்கவும்
    if (selectedPaymentMethod === id) {
      setSelectedPaymentMethod(null)
      setSelectedPaymentMethods([])
    } else {
      setSelectedPaymentMethod(id)
      setSelectedPaymentMethods([id])

      // பழைய விவரங்களை அழிக்கவும்
      setBuyerBankName("")
      setBuyerBankBranch("")
      setBuyerAccountType("")
      setBuyerAccountNumber("")
      setSellerBankName("")
      setSellerBankBranch("")
      setSellerAccountType("")
      setSellerAccountNumber("")
      setTransactionNumber("")
      setTransactionDate("")
    }
  }

  // Get a user's full name with relation
  const getUserFullName = (user: UserType) => {
    return `${user.name}, ${user.relation_type} ${user.relative_name}`
  }

  // Preview component to show the current document details
  const DocumentPreview = () => {
    // Format date for display

    // ஒருமை/பன்மை வார்த்தைகளை தீர்மானிக்க
    const isSellersPlural = sellers.length > 1
    const isBuyersPlural = buyers.length > 1

    // பன்மை வார்த்தைகள்
    const pronounI = isSellersPlural ? "நாங்கள்" : "நான்"
    const pronounIEmphatic = isSellersPlural ? "நாங்களே" : "நானே"
    const pronounMe = isSellersPlural ? "எங்களுக்கு" : "எனக்கு"
    const pronounMy = isSellersPlural ? "எங்களுடைய" : "என்னுடைய"
    const pronounMine = isSellersPlural ? "எங்களது" : "எனது"

    // வினைச்சொற்கள்
    const verbGive = isSellersPlural ? "கொடுத்திருக்கின்றோம்" : "கொடுத்திருக்கின்றேன்"
    const verbSay = isSellersPlural ? "சொல்கின்றோம்" : "சொல்கின்றேன்"
    const verbDeclare = isSellersPlural ? "கூறுகின்றோம்" : "கூறுகிறேன்"
    const verbWillBe = isSellersPlural ? "ஆவோம்" : "ஆவே"
    const verbDo = isSellersPlural ? "செய்கின்றோம்" : "செய்கின்றேன்"

    // பெயர்ச்சொற்கள்
    const nounSeller = isSellersPlural ? "எழுதிக்கொடுப்பவர்கள்" : "எழுதிக்கொடுப்பவர்"
    const nounBuyer = isBuyersPlural ? "எழுதிவாங்குபவர்கள்" : "எழுதிவாங்குபவர்"
    const nounReceiver = isBuyersPlural ? "வாங்குபவர்கள்" : "வாங்குபவர்"
    const nounReceivingPerson = isBuyersPlural ? "பெறுபவர்கள்" : "பெறுபவர்"

    // பிற சொற்கள்
    const nounSellerTo = isSellersPlural ? "எழுதிக்கொடுப்பவர்களுக்கு" : "எழுதிக்கொடுப்பவருக்கு"
    const nounBuyerTo = isBuyersPlural ? "எழுதிவாங்குபவர்களுக்கு" : "எழுதிவாங்குபவருக்கு"
    const verbPromise = isBuyersPlural ? "உறுதியளிக்கிறார்கள்" : "உறுதியளிக்கிறார்"
    const nounGiver = isSellersPlural ? "கொடுப்பவர்கள்" : "கொடுப்பவர்"
    const nounResponsible = isSellersPlural ? "கடமைப்பட்டவர்கள்" : "கடமைப்பட்டவர்"

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

    // Helper function to wrap English text and numbers in appropriate spans
    const formatTextWithFonts = (text: string) => {
      // This regex will match numbers and English text
      const parts = text.split(/([0-9]+|[a-zA-Z]+)/g)

      return parts.map((part, index) => {
        if (/^[0-9]+$/.test(part)) {
          return (
            <span key={index} className="number">
              {part}
            </span>
          )
        } else if (/^[a-zA-Z]+$/.test(part)) {
          return (
            <span key={index} className="english-text">
              {part}
            </span>
          )
        }
        return part
      })
    }

    // கணக்கு வகை பெயரை பெறுதல்
    const getAccountTypeName = (accountTypeId: string) => {
      const accountType = accountTypes.find((type) => type.id.toString() === accountTypeId)
      return accountType ? accountType.name : ""
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
                  const handler = exportToDocx(
                    ".document-content",
                    `கிரைய_ஆவணம்_${formattedDocumentDate.day}_${formattedDocumentDate.month}_${formattedDocumentDate.year}`,
                  )
                  handler()
                }}
                className="bg-cyan-600 hover:bg-cyan-700 text-white"
              >
                <FileText className="h-4 w-4 mr-2" />
                Word DOCX-ஆக பதிவிறக்கு
              </Button>
              <Button
                onClick={() => {
                  const handler = exportToPdf(
                    ".document-content",
                    `கிரைய_ஆவணம்_${formattedDocumentDate.day}_${formattedDocumentDate.month}_${formattedDocumentDate.year}`,
                  )
                  handler()
                }}
                className="bg-cyan-600 hover:bg-cyan-700 text-white"
              >
                <FileDown className="h-4 w-4 mr-2" />
                PDF ஏற்றுமதி
              </Button>
            </div>
          </div>

          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">
              <b> கிரையம் ரூ.{formatTextWithFonts(saleAmount)}/-</b>
            </h1>
            <p className="text-lg">
              <b>
                {formatTextWithFonts(`${formattedDocumentDate.year}-ம் வருடம் ${formattedDocumentDate.month} மாதம் ${formattedDocumentDate.day}-ம்
              தேதியில்`)}
              </b>
            </p>
          </div>

          {/* வாங்குபவர் மற்றும் விற்பவர் விவரங்கள் */}
          {buyers.length > 0 && sellers.length > 0 && (
            <div className="mb-6 text-justify">
              {/* எழுதிவாங்குபவர்கள் விவரங்கள் முதலில் காட்டப்படும் */}
              {buyers.map((buyer, index) => (
                <div key={buyer.id} className="mb-4">
                  <p>
                    {formatTextWithFonts(`${buyer.districts?.name} மாவட்டம்-${buyer.pincode}, ${buyer.taluks?.name} வட்டம், ${buyer.address_line3}, 
                    ${buyer.address_line2}, ${buyer.address_line1}, கதவு எண்:-${buyer.door_number} என்ற முகவரியில் வசித்து
                    வருபவரும், ${buyer.relative_name} அவர்களின் ${getFormattedRelationType(buyer)} ${buyer.age} வயதுடைய`)}{" "}
                    <b>{buyer.name}</b> {formatTextWithFonts(`(ஆதார் அடையாள அட்டை எண்:-`)}
                    <b>{formatTextWithFonts(buyer.aadhaar_number)}</b>
                    {formatTextWithFonts(
                      buyers.length > 1 ? `)-${index + 1}${index === buyers.length - 1 ? " ஆகிய தங்களுக்கு" : ""}` : "",
                    )}
                  </p>
                </div>
              ))}

              {/* எழுதிகொடுப்பவர்கள் விவரங்கள் அடுத்து காட்டப்படும் */}
              {sellers.map((seller, index) => (
                <div key={seller.id} className="mb-4">
                  <p>
                    {formatTextWithFonts(`${seller.districts?.name} மாவட்டம்-${seller.pincode}, ${seller.taluks?.name} வட்டம், ${seller.address_line3},
                    ${seller.address_line2}, ${seller.address_line1}, கதவு எண்:-${seller.door_number} என்ற முகவரியில் வசித்து
                    வருபவரும், ${seller.relative_name} அவர்களின் ${getFormattedRelationType(seller)} ${seller.age} வயதுடைய`)}{" "}
                    <b>{seller.name}</b> {formatTextWithFonts(`(ஆதார் அடையாள அட்டை எண்:-`)}
                    <b>{formatTextWithFonts(seller.aadhaar_number)}</b>
                    {formatTextWithFonts(`, கைப்பேசி எண்:-`)}
                    <b>{formatTextWithFonts(seller.phone)}</b>
                    {formatTextWithFonts(`)-${index + 1}
                    ${
                      index === sellers.length - 1
                        ? " ஆகிய நான் எழுதிக் கொடுத்த சுத்தக்கிரைய சாசனப்பத்திரத்திற்கு விவரம் என்னவென்றால்,"
                        : ""
                    }`)}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* முந்தைய ஆவணம் விவரங்கள் */}
          {previousDocumentDate && (
            <div className="mb-6 text-justify">
              <p>
                {pronounMe} கடந்த{" "}
                <b>
                  {formatTextWithFonts(`${formattedPreviousDocumentDate.day}/${formattedPreviousDocumentDate.month}/
                ${formattedPreviousDocumentDate.year}`)}
                </b>
                -ம் தேதியில், <b>{getSubRegistrarOfficeName()}</b> சார்பதிவாளர் அலுவலகத்தில் <b>{getBookNumber()}</b> புத்தகம்{" "}
                <b>{documentYear}</b>-ம் ஆண்டின் <b>{documentNumber}</b>-ம் எண்ணாக பதிவு செய்யப்பட்ட {getDocumentTypeName()}{" "}
                ஆவணத்தின் படி பாத்தியப்பட்டதாகும்.
              </p>
              <p className="mt-4">
                மேற்படி வகையில் பாத்தியப்பட்டு {pronounMy} அனுபோக சுவாதீனத்தில் இருந்து வருகின்ற இதனடியிற்க்காணும் சொத்தை {pronounI}
                தங்களுக்கு{" "}
                <b>
                  ரூ.
                  {formatTextWithFonts(saleAmount)}/-(ரூபாய் {saleAmountWords} மட்டும்)
                </b>{" "}
                விலைக்கு பேசி கொடுப்பதாக ஒப்புக்கொண்டு மேற்படி கிரையத் தொகையை கீழ்க்கண்ட சாட்சிகள் முன்பாக {pronounI} ரொக்கமாகப் பெற்றுக்கொண்டு
                கீழ்க்கண்ட சொத்துக்களை இன்று தங்களுக்கு சுத்தக்கிரையமும் சுவாதீனமும் செய்து
                {verbGive}.
              </p>
            </div>
          )}

          {/* பணம் செலுத்தும் முறை விவரங்கள் */}
          {selectedPaymentMethod && (
            <div className="mb-6 text-justify">
              <p>
                மேற்படி வகையில் பாத்தியப்பட்டு {pronounMy} அனுபோக சுவாதீனத்தில் இருந்து வருகின்ற இதனடியிற்க்காணும் சொத்தை நான் தங்களுக்கு ரூ.
                {formatTextWithFonts(saleAmount)}/-(ரூபாய் {saleAmountWords} மட்டும்) விலைக்கு பேசி கொடுப்பதாக ஒப்புக்கொண்டு
                மேற்படி கிரையத் தொகை {pronounMe} வரவானதுக்கான விவரம்:-
              </p>

              {selectedPaymentMethod === "9" && (
                <p className="mt-2">
                  கிரையம் எழுதி பெறும் {buyers.length > 0 ? buyers[0].name : "[BUYER PARTY NAME]"} அவர்களின்{" "}
                  {buyerBankName || "[BUYER BANK NAME]"}, {buyerBankBranch || "[BUYER BANK BRANCH]"},{" "}
                  {getAccountTypeName(buyerAccountType) || "[BUYER ACCOUNT TYPE]"}{" "}
                  {buyerAccountNumber || "[ACCOUNT NO.]"} -இதன் வங்கிக் காசோலை எண்:-{transactionNumber || "[CHEQUE NO]"}
                  -மூலம், கிரையம் எழுதி கொடுக்கும் {sellers.length > 0 ? sellers[0].name : "[SELLER PARTY NAME]"}
                  அவர்களின் பெயரில் வழங்கிய தொகை ரூ.{formatTextWithFonts(saleAmount)}/-(ரூபாய் {saleAmountWords}) மட்டும்
                  {transactionDate || "[TRANSACATION DATE/MONTH/YEAR]"}-ம் தேதியில் வரவாகி விட்டபடியால், கீழ்க்கண்ட சொத்துக்களை இன்று
                  தங்களுக்கு சுத்தக் கிரையமும் சுவாதீனமும் செய்து {verbGive}.
                </p>
              )}

              {selectedPaymentMethod === "2" && (
                <p className="mt-2">
                  கிரையம் எழுதி பெறும் {buyers.length > 0 ? buyers[0].name : "[BUYER PARTY NAME]"} அவர்களின்{" "}
                  {buyerBankName || "[BUYER BANK NAME]"}, {buyerBankBranch || "[BUYER BANK BRANCH]"},{" "}
                  {getAccountTypeName(buyerAccountType) || "[BUYER ACCOUNT TYPE]"}{" "}
                  {buyerAccountNumber || "[ACCOUNT NO.]"} -இதன் வங்கி வரைவோலை எண்:-{transactionNumber || "[DD NO]"}-மூலம்,
                  கிரையம் எழுதி கொடுக்கும் {sellers.length > 0 ? sellers[0].name : "[SELLER PARTY NAME]"}
                  அவர்களின் பெயரில் வழங்கிய தொகை ரூ.{formatTextWithFonts(saleAmount)}/-(ரூபாய் {saleAmountWords}) மட்டும்
                  {transactionDate || "[TRANSACATION DATE/MONTH/YEAR]"}-ம் தேதியில் வரவாகி விட்டபடியால், கீழ்க்கண்ட சொத்துக்களை இன்று
                  தங்களுக்கு சுத்தக் கிரையமும் சுவாதீனமும் செய்து {verbGive}.
                </p>
              )}

              {selectedPaymentMethod === "4" && (
                <p className="mt-2">
                  கிரையம் பெறும் {buyers.length > 0 ? buyers[0].name : "[BUYER PARTY NAME]"} அவர்களின்{" "}
                  {buyerBankName || "[BUYER BANK NAME]"}, {buyerBankBranch || "[BUYER BANK BRANCH]"},{" "}
                  {getAccountTypeName(buyerAccountType) || "[BUYER ACCOUNT TYPE]"}
                  {buyerAccountNumber || "[ACCOUNT NO.]"}-இதிலிருந்து, {pronounMy}{" "}
                  {sellerBankName || "[SELLER BANK NAME]"}, {sellerBankBranch || "[SELLER BANK BRANCH]"},{" "}
                  {getAccountTypeName(sellerAccountType) || "[SELLER ACCOUNT TYPE]"}
                  {sellerAccountNumber || "[ACCOUNT NO.]"}-க்கு வங்கி மின்னணு பரிவர்த்தனை எண்.(UPI):-
                  {transactionNumber || "[TRANSACATION NO]"}-மூலம் ரூ.
                  {formatTextWithFonts(saleAmount)}/-(ரூபாய் {saleAmountWords}) மட்டும்{" "}
                  {transactionDate || "[TRANSACATION DATE/MONTH/YEAR]"}-ம் தேதியில் {pronounMe} வரவாகி விட்டபடியால், கீழ்க்கண்ட
                  சொத்துக்களை இன்று தங்களுக்கு சுத்தக் கிரையமும் சுவாதீனமும் செய்து {verbGive}.
                </p>
              )}

              {selectedPaymentMethod === "6" && (
                <p className="mt-2">
                  கிரையம் பெறும் {buyers.length > 0 ? buyers[0].name : "[BUYER PARTY NAME]"} அவர்களின்{" "}
                  {buyerBankName || "[BUYER BANK NAME]"}, {buyerBankBranch || "[BUYER BANK BRANCH]"},{" "}
                  {getAccountTypeName(buyerAccountType) || "[BUYER ACCOUNT TYPE]"}
                  {buyerAccountNumber || "[ACCOUNT NO.]"}-இதிலிருந்து, {pronounMy}{" "}
                  {sellerBankName || "[SELLER BANK NAME]"}, {sellerBankBranch || "[SELLER BANK BRANCH]"},{" "}
                  {getAccountTypeName(sellerAccountType) || "[SELLER ACCOUNT TYPE]"}
                  {sellerAccountNumber || "[ACCOUNT NO.]"}-க்கு வங்கி மின்னணு பரிவர்த்தனை எண்.(NEFT):-
                  {transactionNumber || "[TRANSACATION NO]"}-மூலம் ரூ.
                  {formatTextWithFonts(saleAmount)}/-(ரூபாய் {saleAmountWords}) மட்டும்{" "}
                  {transactionDate || "[TRANSACATION DATE/MONTH/YEAR]"}-ம் தேதியில் {pronounMe} வரவாகி விட்டபடியால், கீழ்க்கண்ட
                  சொத்துக்களை இன்று தங்களுக்கு சுத்தக் கிரையமும் சுவாதீனமும் செய்து {verbGive}.
                </p>
              )}

              {selectedPaymentMethod === "7" && (
                <p className="mt-2">
                  கிரையம் பெறும் {buyers.length > 0 ? buyers[0].name : "[BUYER PARTY NAME]"} அவர்களின்{" "}
                  {buyerBankName || "[BUYER BANK NAME]"}, {buyerBankBranch || "[BUYER BANK BRANCH]"},{" "}
                  {getAccountTypeName(buyerAccountType) || "[BUYER ACCOUNT TYPE]"}
                  {buyerAccountNumber || "[ACCOUNT NO.]"}-இதிலிருந்து, {pronounMy}{" "}
                  {sellerBankName || "[SELLER BANK NAME]"}, {sellerBankBranch || "[SELLER BANK BRANCH]"},{" "}
                  {getAccountTypeName(sellerAccountType) || "[SELLER ACCOUNT TYPE]"}
                  {sellerAccountNumber || "[ACCOUNT NO.]"}-க்கு வங்கி மின்னணு பரிவர்த்தனை எண்.(RTGS):-
                  {transactionNumber || "[TRANSACATION NO]"}-மூலம் ரூ.
                  {formatTextWithFonts(saleAmount)}/-(ரூபாய் {saleAmountWords}) மட்டும்{" "}
                  {transactionDate || "[TRANSACATION DATE/MONTH/YEAR]"}-ம் தேதியில் {pronounMe} வரவாகி விட்டபடியால், கீழ்க்கண்ட
                  சொத்துக்களை இன்று தங்களுக்கு சுத்தக் கிரையமும் சுவாதீனமும் செய்து {verbGive}.
                </p>
              )}

              {selectedPaymentMethod === "5" && (
                <p className="mt-2">
                  கிரையம் பெறும் {buyers.length > 0 ? buyers[0].name : "[BUYER PARTY NAME]"} அவர்களின்{" "}
                  {buyerBankName || "[BUYER BANK NAME]"}, {buyerBankBranch || "[BUYER BANK BRANCH]"},{" "}
                  {getAccountTypeName(buyerAccountType) || "[BUYER ACCOUNT TYPE]"}
                  {buyerAccountNumber || "[ACCOUNT NO.]"}-இதிலிருந்து, {pronounMy}{" "}
                  {sellerBankName || "[SELLER BANK NAME]"}, {sellerBankBranch || "[SELLER BANK BRANCH]"},{" "}
                  {getAccountTypeName(sellerAccountType) || "[SELLER ACCOUNT TYPE]"}
                  {sellerAccountNumber || "[ACCOUNT NO.]"}-க்கு வங்கி மின்னணு பரிவர்த்தனை எண்.(IMPS):-
                  {transactionNumber || "[TRANSACATION NO]"}-மூலம் ரூ.
                  {formatTextWithFonts(saleAmount)}/-(ரூபாய் {saleAmountWords}) மட்டும்{" "}
                  {transactionDate || "[TRANSACATION DATE/MONTH/YEAR]"}-ம் தேதியில் {pronounMe} வரவாகி விட்டபடியால், கீழ்க்கண்ட
                  சொத்துக்களை இன்று தங்களுக்கு சுத்தக் கிரையமும் சுவாதீனமும் செய்து {verbGive}.
                </p>
              )}
            </div>
          )}

          {/* சொத்து உரிமை விவரங்கள் */}
          <div className="mb-6 text-justify">
            <p>
              கிரைய சொத்தை இது முதல் தாங்களே சர்வ சுதந்திர பாத்தியத்துடனும் தானாதி வினியோக விற்கிரையங்களுக்கு யோக்கியமாகவும் அடைந்து
              ஆண்டனுபவித்துக் கொள்ள வேண்டியது.
            </p>
            <p className="mt-2">
              கிரைய சொத்தை குறித்து இனிமேல் {pronounMe}ம், {pronounMe} பின்னிட்ட {pronounMy} இதர ஆண், பெண் வாரிசுகளுக்கும் இனி
              எவ்வித பாத்தியமும் சம்மந்தமும் பின் தொடர்ச்சியும் உரிமையும் இல்லை.
            </p>
            <p className="mt-2">
              கிரைய சொத்துக்களின் பேரில் யாதொரு முன் வில்லங்க விவகாரம், கடன், கோர்ட் நடவடிக்கைகள் முதலியவை ஏதுமில்லையென்றும் உண்மையாகவும்
              உறுதியாகவும் {verbSay}.
            </p>
            <p className="mt-2">
              பின்னிட்டு அப்படி ஒருகால் ஏதேனும் முன் வில்லங்க விவகாரம், அடமானம், கிரைய உடன்படிக்கை, கோர்ட் நடவடிக்கைகள், போக்கியம், ஈக்விடபுள்
              மார்ட்கேஜ் முதலியவை ஏதுமிருப்பதாகத் தெரியவரும் பட்சத்தில் அவற்றை {pronounIEmphatic} முன்னின்று {pronounMy} சொந்த
              செலவிலும், சொந்த பொறுப்பிலும் {pronounMy} இதர சொத்துக்களைக் கொண்டு {pronounIEmphatic} முன்னின்று ஜவாப்தாரியாய் இருந்து
              கிரைய சொத்துக்கு நஷ்டம் ஏற்படாதவாறு {pronounIEmphatic} முன்னின்று தீர்த்துக் கொடுக்க இதன் மூலம் உறுதி {verbDeclare}.
            </p>
            <p className="mt-2">
              கிரைய பத்திரத்தில் {nounSellerTo} முழு உரிமையும் சுவாதீனமும் உள்ளது என {nounBuyerTo}, எழுதிக்{nounGiver}
              உறுதியளித்ததின் பேரிலும், எழுதிக்{nounGiver} அளித்த பதிவுருக்களை எழுதி{nounReceiver} ஆய்வு செய்து, அதன் பேரில் இந்த
              கிரைய ஆவணம் தயார் செய்யப்பட்டு {nounBuyer}, {nounSeller} என இரு தரப்பினரும் படித்துப்பார்த்தும் படிக்கச்சொல்லி கேட்டும் மன
              நிறைவு அடைந்ததன் பேரிலும் இக்கிரைய ஆவணம் பதிவு செய்யப்படுகிறது.
            </p>
            <p className="mt-2">
              பிற்காலத்தில் கிரைய ஆவணத்தில் ஏதேனும் பிழைகள் ஏற்பட்டதாக வாங்குபவர் கருதினால், சம்பந்தப்பட்ட சார்பதிவாளர் அலுவலகம் வந்து பிழை
              திருத்தல் ஆவணத்தில் எந்தவொரு பிரதி பிரயோஜனமும் பெற்றுக் கொள்ளாமல் பிழையைத் திருத்திக் கொடுக்க {pronounI}{" "}
              {nounResponsible} {verbWillBe}.
            </p>
            <p className="mt-2">
              மேற்படி {pronounI} பிழைத்திருத்தல் பத்திரம் எழுதிக்கொடுக்க தவறினால், மேற்படி கிரையம் பெறும் தாங்களே உறுதிமொழி ஆவணம் எழுதி,
              அதன் மூலம் பிழையைத் திருத்திக் கொள்ள வேண்டியது.
            </p>
            <p className="mt-2">
              கீழ்க்கண்ட கிரைய சொத்தின் பட்டா தங்கள் பெயருக்கு மாறும் பொருட்டு பட்டா மாறுதல் மனுவும் இத்துடன் தாக்கல் {verbDo}.
            </p>
            <p className="mt-2">
              மேலே சொன்ன <b>{getBookNumber()}</b> புத்தகம்{" "}
              <b>
                {documentNumber}/{documentYear}
              </b>{" "}
              நெ {getDocumentTypeName()} ஆவணத்தின் {getSubmissionTypeName()} இக்கிரைய ஆவணத்திற்கு ஆதரவாக தங்களுக்கு {verbGive}.
            </p>
            <p className="mt-2">
              மேலும் தணிக்கையின் போது இந்த ஆவணம் தொடர்பாக அரசுக்கு இழப்பு ஏற்படின் அத்தொகையை கிரையம் {nounReceivingPerson} செலுத்தவும்{" "}
              {verbPromise}.
            </p>
          </div>

          {/* சொத்து விவரங்கள் */}
          {selectedProperties.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2 text-center">சொத்து விவரம்</h3>
              {selectedProperties.map((property, index) => (
                <div key={property.id} className="mb-4">
                  <p className="whitespace-pre-line">{property.property_details}</p>
                </div>
              ))}
            </div>
          )}

          {/* கட்டிட விவரங்கள் */}
          {buildings.length > 0 && (
            <div className="mb-6">
              {buildings.map((building, index) => (
                <div key={building.id} className="mb-4">
                  <p className="whitespace-pre-line">{building.description}</p>
                </div>
              ))}
            </div>
          )}

          {/* எழுதிக்கொடுப்பவர் மற்றும் எழுதிவாங்குபவர் */}
          <div className="flex justify-between mt-8 mb-6">
            <div>
              <p className="font-semibold">{nounSeller}</p>
            </div>
            <div>
              <p className="font-semibold">{nounBuyer}</p>
            </div>
          </div>

          {/* சாட்சிகள் விவரங்கள் */}
          {witnesses.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">சாட்சிகள்</h3>
              <ol className="list-decimal pl-5">
                {witnesses.map((witness, index) => (
                  <li key={witness.id} className="mb-2">
                    <p>
                      <b>{witness.name}</b> {witness.relation_type} {witness.relative_name}, கதவு எண்:-
                      {witness.door_number}, {witness.address_line1}, {witness.address_line2}, {witness.address_line3},{" "}
                      {witness.taluks?.name} வட்டம், {witness.districts?.name} மாவட்டம்-{witness.pincode}, (வயது-
                      {witness.age}) (ஆதார் அடையாள அட்டை எண்:-<b>{formatTextWithFonts(witness.aadhaar_number)}</b>).
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* தட்டச்சு விவரங்கள் */}
          {typistId && (
            <div className="mb-6">
              <p className="text-right">
                கணினியில் தட்டச்சு செய்து ஆவணம் தயார் செய்தவர்:-{typists.find((t) => t.id.toString() === typistId)?.name || ""}
                <br />
                {officeId && `(${offices.find((o) => o.id.toString() === officeId)?.name || ""}, `}
                {typistPhone && <>போன்:-{formatTextWithFonts(typistPhone)})</>}
              </p>
            </div>
          )}
        </div>
      </div>
    )
  }

  // மொத்த மதிப்பை கணக்கிடும் useEffect
  useEffect(() => {
    calculateTotalValue()
  }, [calculateTotalValue])

  // Main form component

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
                  {selectedLandTypes.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-medium mb-2 text-cyan-800">தேர்ந்தெடுக்கப்பட்ட நில வகைகள்</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedLandTypes.map((typeId) => {
                          const landType = landTypes.find((type) => type.id.toString() === typeId)
                          return landType ? (
                            <div key={typeId} className="bg-cyan-100 text-cyan-800 px-3 py-1 rounded-full text-sm">
                              {landType.name}
                            </div>
                          ) : null
                        })}
                      </div>
                    </div>
                  )}

                  {/* கட்டிட விவரங்கள் படிவம் */}
                  {shouldShowBuildingForm && (
                    <BuildingForm
                      onAddBuilding={handleAddBuilding}
                      onCancel={() => {
                        setShouldShowBuildingForm(false)
                        setIsEditingBuilding(false)
                        setSelectedBuildingForEdit(null)
                      }}
                      initialData={selectedBuildingForEdit || undefined}
                      isEdit={isEditingBuilding}
                    />
                  )}

                  {/* சேர்க்கப்பட்ட கட்டிடங்களின் பட்டியல் */}
                  {!shouldShowBuildingForm && buildings.length > 0 && (
                    <div className="mt-4">
                      <div className="flex justify-between mb-2">
                        <h4 className="font-medium mb-2 text-cyan-800">சேர்க்கப்பட்ட கட்டிடங்கள்</h4>
                        <Button
                          onClick={() => setShouldShowBuildingForm(true)}
                          className="bg-cyan-600 hover:bg-cyan-700 text-white"
                          size="sm"
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          புதிய கட்டிடம் சேர்க்க
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {buildings.map((building) => (
                          <div key={building.id} className="bg-white p-3 rounded-lg border border-cyan-200">
                            <div className="flex justify-between">
                              <div>
                                <h5 className="font-medium text-cyan-700">
                                  {building.buildingType} - {building.facingDirection}ப் பார்த்த கட்டிடம்
                                </h5>
                                <p className="text-sm text-gray-600">
                                  {building.totalSqFeet} சதுரடி | {building.buildingAge} வருடங்கள் பழைமையானது
                                </p>
                              </div>
                              <div className="flex gap-1">
                                <Button
                                  onClick={() => handleEditBuilding(building)}
                                  variant="outline"
                                  size="sm"
                                  className="border-cyan-300 text-cyan-700 hover:bg-cyan-100 h-8 px-2"
                                >
                                  திருத்து
                                </Button>
                                <Button
                                  onClick={() => handleRemoveBuilding(building.id)}
                                  variant="outline"
                                  size="sm"
                                  className="border-red-300 text-red-700 hover:bg-red-50 h-8 px-2"
                                >
                                  நீக்கு
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

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
                              {registrationDistricts.map((district) => (
                                <SelectItem key={district.id} value={district.id.toString()}>
                                  {district.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="property-filter-sub-registrar-office" className="text-cyan-800 text-sm">
                            சார்பதிவாளர் அலுவலகம்
                          </Label>
                          <Select
                            value={propertyFilterSubRegistrarOfficeId}
                            onValueChange={setPropertyFilterSubRegistrarOfficeId}
                            disabled={
                              !propertyFilterRegistrationDistrictId || propertyFilterRegistrationDistrictId === "all"
                            }
                          >
                            <SelectTrigger className="bg-white border-cyan-200 focus:border-cyan-400">
                              <SelectValue placeholder="அனைத்தும்" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">அனைத்தும்</SelectItem>
                              {filteredPropertySubRegistrarOffices.map((office) => (
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
                        <div>
                          <Label htmlFor="new-property-plot-number" className="text-cyan-800 text-sm">
                            மனை எண்
                          </Label>
                          <Input
                            id="new-property-plot-number"
                            value={newPropertyPlotNumber}
                            onChange={(e) => setNewPropertyPlotNumber(e.target.value)}
                            placeholder="மனை எண்ணை உள்ளிடவும்"
                            className="bg-white border-cyan-200 focus:border-cyan-400"
                          />
                        </div>

                        <div className="border-t border-cyan-200 pt-4">
                          <h5 className="font-medium mb-2 text-cyan-800">எல்லைகள்</h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="new-property-north-boundary" className="text-cyan-800 text-sm">
                                வடக்கு
                              </Label>
                              <Input
                                id="new-property-north-boundary"
                                value={newPropertyNorthBoundary}
                                onChange={(e) => setNewPropertyNorthBoundary(e.target.value)}
                                placeholder="வடக்கு எல்லையை உள்ளிடவும்"
                                className="bg-white border-cyan-200 focus:border-cyan-400"
                              />
                            </div>
                            <div>
                              <Label htmlFor="new-property-east-boundary" className="text-cyan-800 text-sm">
                                கிழக்கு
                              </Label>
                              <Input
                                id="new-property-east-boundary"
                                value={newPropertyEastBoundary}
                                onChange={(e) => setNewPropertyEastBoundary(e.target.value)}
                                placeholder="கிழக்கு எல்லையை உள்ளிடவும்"
                                className="bg-white border-cyan-200 focus:border-cyan-400"
                              />
                            </div>
                            <div>
                              <Label htmlFor="new-property-south-boundary" className="text-cyan-800 text-sm">
                                தெற்கு
                              </Label>
                              <Input
                                id="new-property-south-boundary"
                                value={newPropertySouthBoundary}
                                onChange={(e) => setNewPropertySouthBoundary(e.target.value)}
                                placeholder="தெற்கு எல்லையை உள்ளிடவும்"
                                className="bg-white border-cyan-200 focus:border-cyan-400"
                              />
                            </div>
                            <div>
                              <Label htmlFor="new-property-west-boundary" className="text-cyan-800 text-sm">
                                மேற்கு
                              </Label>
                              <Input
                                id="new-property-west-boundary"
                                value={newPropertyWestBoundary}
                                onChange={(e) => setNewPropertyWestBoundary(e.target.value)}
                                placeholder="மேற்கு எல்லையை உள்ளிடவும்"
                                className="bg-white border-cyan-200 focus:border-cyan-400"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="border-t border-cyan-200 pt-4">
                          <h5 className="font-medium mb-2 text-cyan-800">நான்கு பக்க அளவுகள்</h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="new-property-north-measurement" className="text-cyan-800 text-sm">
                                வடபுறம் கிழமேலடி (அடி)
                              </Label>
                              <Input
                                id="new-property-north-measurement"
                                value={newPropertyNorthMeasurement}
                                onChange={(e) => setNewPropertyNorthMeasurement(e.target.value)}
                                placeholder="வடபுறம் அளவை உள்ளிடவும்"
                                className="bg-white border-cyan-200 focus:border-cyan-400"
                              />
                            </div>
                            <div>
                              <Label htmlFor="new-property-south-measurement" className="text-cyan-800 text-sm">
                                தென்புறம் கிழமேலடி (அடி)
                              </Label>
                              <Input
                                id="new-property-south-measurement"
                                value={newPropertySouthMeasurement}
                                onChange={(e) => setNewPropertySouthMeasurement(e.target.value)}
                                placeholder="தென்புறம் அளவை உள்ளிடவும்"
                                className="bg-white border-cyan-200 focus:border-cyan-400"
                              />
                            </div>
                            <div>
                              <Label htmlFor="new-property-east-measurement" className="text-cyan-800 text-sm">
                                கிழபுறம் தென்வடலடி (அடி)
                              </Label>
                              <Input
                                id="new-property-east-measurement"
                                value={newPropertyEastMeasurement}
                                onChange={(e) => setNewPropertyEastMeasurement(e.target.value)}
                                placeholder="கிழபுறம் அளவை உள்ளிடவும்"
                                className="bg-white border-cyan-200 focus:border-cyan-400"
                              />
                            </div>
                            <div>
                              <Label htmlFor="new-property-west-measurement" className="text-cyan-800 text-sm">
                                மேல்புறம் தென்வடலடி (அடி)
                              </Label>
                              <Input
                                id="new-property-west-measurement"
                                value={newPropertyWestMeasurement}
                                onChange={(e) => setNewPropertyWestMeasurement(e.target.value)}
                                placeholder="மேல்புறம் அளவை உள்ளிடவும்"
                                className="bg-white border-cyan-200 focus:border-cyan-400"
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div>
                              <Label htmlFor="new-property-total-sqfeet" className="text-cyan-800 text-sm">
                                மொத்த அளவு (சதுரடி)
                              </Label>
                              <Input
                                id="new-property-total-sqfeet"
                                value={newPropertyTotalSqFeet}
                                onChange={(e) => setNewPropertyTotalSqFeet(e.target.value)}
                                placeholder="மொத்த சதுரடி அளவை உள்ளிடவும்"
                                className="bg-white border-cyan-200 focus:border-cyan-400"
                              />
                            </div>
                            <div>
                              <Label htmlFor="new-property-total-sqmeter" className="text-cyan-800 text-sm">
                                மொத்த அளவு (சதுரமீட்டர்)
                              </Label>
                              <Input
                                id="new-property-total-sqmeter"
                                value={newPropertyTotalSqMeter}
                                onChange={(e) => setNewPropertyTotalSqMeter(e.target.value)}
                                placeholder="மொத்த சதுரமீட்டர் அளவை உள்ளிடவும்"
                                className="bg-white border-cyan-200 focus:border-cyan-400"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="border-t border-cyan-200 pt-4">
                          <h5 className="font-medium mb-2 text-cyan-800">சர்வே எண் விவரங்கள்</h5>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <Label htmlFor="new-property-old-survey-number" className="text-cyan-800 text-sm">
                                பழைய சர்வே எண்
                              </Label>
                              <Input
                                id="new-property-old-survey-number"
                                value={newPropertyOldSurveyNumber}
                                onChange={(e) => setNewPropertyOldSurveyNumber(e.target.value)}
                                placeholder="பழைய சர்வே எண்ணை உள்ளிடவும்"
                                className="bg-white border-cyan-200 focus:border-cyan-400"
                              />
                            </div>
                            <div>
                              <Label htmlFor="new-property-old-subdivision-number" className="text-cyan-800 text-sm">
                                பழைய உட்பிரிவு எண்
                              </Label>
                              <Input
                                id="new-property-old-subdivision-number"
                                value={newPropertyOldSubdivisionNumber}
                                onChange={(e) => setNewPropertyOldSubdivisionNumber(e.target.value)}
                                placeholder="பழைய உட்பிரிவு எண்ணை உள்ளிடவும்"
                                className="bg-white border-cyan-200 focus:border-cyan-400"
                              />
                            </div>
                            <div>
                              <Label htmlFor="new-property-new-survey-number" className="text-cyan-800 text-sm">
                                புதிய சர்வே எண்
                              </Label>
                              <Input
                                id="new-property-new-survey-number"
                                value={newPropertyNewSurveyNumber}
                                onChange={(e) => setNewPropertyNewSurveyNumber(e.target.value)}
                                placeholder="புதிய சர்வே எண்ணை உள்ளிடவும்"
                                className="bg-white border-cyan-200 focus:border-cyan-400"
                              />
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 mt-4">
                            <Checkbox
                              id="new-property-has-building"
                              checked={newPropertyHasBuilding}
                              onCheckedChange={(checked) => setNewPropertyHasBuilding(checked as boolean)}
                              className="border-cyan-300 data-[state=checked]:bg-cyan-600"
                            />
                            <Label
                              htmlFor="new-property-has-building"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              இடத்தில் கட்டிடம் உள்ளது
                            </Label>
                          </div>
                        </div>

                        <div className="border-t border-cyan-200 pt-4">
                          <h5 className="font-medium mb-2 text-cyan-800">வழிகாட்டு மதிப்பு</h5>
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

                        <div className="border-t border-cyan-200 pt-4">
                          <h5 className="font-medium mb-2 text-cyan-800">இடத்தின் மதிப்பு</h5>
                          <div className="space-y-4">
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="new-property-use-calculation"
                                checked={newPropertyUseLandValueCalculation}
                                onChange={(checked) => setNewPropertyUseLandValueCalculation(checked as boolean)}
                                className="border-cyan-300 data-[state=checked]:bg-cyan-600"
                              />
                              <Label
                                htmlFor="new-property-use-calculation"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                தானாக கணக்கிடு
                              </Label>
                            </div>

                            {newPropertyUseLandValueCalculation ? (
                              <div>
                                {newPropertyCalculatedLandValue ? (
                                  <div className="p-3 bg-cyan-50 rounded border border-cyan-200">
                                    <p className="text-sm text-cyan-800">
                                      <strong>இடத்தின் மதிப்பு:</strong> ரூ. {newPropertyCalculatedLandValue}/-
                                    </p>
                                    <p className="text-xs text-cyan-600 mt-1">
                                      (சதுர மீட்டர் × வழிகாட்டு மதிப்பு அடிப்படையில் கணக்கிடப்பட்டது)
                                    </p>
                                  </div>
                                ) : (
                                  <p className="text-sm text-amber-600">சதுர மீட்டர் மற்றும் வழிகாட்டு மதிப்பை உள்ளிடவும்</p>
                                )}
                              </div>
                            ) : (
                              <div>
                                <Label htmlFor="new-property-manual-land-value" className="text-cyan-800 text-sm">
                                  இடத்தின் மதிப்பு (ரூபாய்)
                                </Label>
                                <Input
                                  id="new-property-manual-land-value"
                                  value={newPropertyManualLandValue}
                                  onChange={(e) => setNewPropertyManualLandValue(e.target.value)}
                                  placeholder="இடத்தின் மதிப்பை உள்ளிடவும்"
                                  className="bg-white border-cyan-200 focus:border-cyan-400"
                                />
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="border-t border-cyan-200 pt-4">
                          <h5 className="font-medium mb-2 text-cyan-800">மதிப்பு வகைகள்</h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {valueTypes.map((type) => (
                              <div key={type.id} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`value-type-${type.id}`}
                                  checked={newPropertyValues.some((v) => v.id === type.id.toString())}
                                  onCheckedChange={(checked) =>
                                    handleValueTypeSelection(type.id.toString(), checked as boolean)
                                  }
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

                          {newPropertyValues.length > 0 && (
                            <div className="mt-4 space-y-4">
                              <h6 className="text-sm font-medium text-cyan-800">தேர்ந்தெடுக்கப்பட்ட மதிப்பு வகைகள்</h6>
                              {newPropertyValues.map((item) => (
                                <div key={item.id} className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                                  <Label htmlFor={`value-${item.id}`} className="text-cyan-800 text-sm">
                                    {item.name} (ரூபாய்)
                                  </Label>
                                  <Input
                                    id={`value-${item.id}`}
                                    value={item.value}
                                    onChange={(e) => handleValueChange(item.id, e.target.value)}
                                    placeholder={`${item.name} மதிப்பை உள்ளிடவும்`}
                                    className="bg-white border-cyan-200 focus:border-cyan-400"
                                  />
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="border-t border-cyan-200 pt-4">
                          <h5 className="font-medium mb-2 text-cyan-800">மொத்த மதிப்பு</h5>
                          <div className="p-3 bg-cyan-50 rounded border border-cyan-200">
                            <p className="text-lg font-semibold text-cyan-800">ரூ. {newPropertyTotalValue || "0"}/-</p>
                          </div>
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
                            onClick={handlePreviewPropertyOnly}
                            className="bg-cyan-600 hover:bg-cyan-700 text-white"
                          >
                            சேர்க்க
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

                {/* மதிப்பு வகை */}
                <div className="border-b border-cyan-200 pb-6">
                  <h3 className="text-lg font-semibold mb-4 text-cyan-800">மதிப்பு வகை</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {valueTypes.map((type) => (
                      <div key={type.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`value-type-${type.id}`}
                          checked={selectedValueTypes.includes(type.id.toString())}
                          onChange={(checked) => handleValueTypeChange(type.id.toString())}
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
                  {selectedValueTypes.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-medium mb-2 text-cyan-800">தேர்ந்தெடுக்கப்பட்ட மதிப்பு வகைகள்</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedValueTypes.map((typeId) => {
                          const valueType = valueTypes.find((type) => type.id.toString() === typeId)
                          return valueType ? (
                            <div key={typeId} className="bg-cyan-100 text-cyan-800 px-3 py-1 rounded-full text-sm">
                              {valueType.name}
                            </div>
                          ) : null
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* பணம் செலுத்தும் முறை */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-cyan-800">பணம் செலுத்தும் முறை</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {paymentMethods.map((method) => (
                      <div key={method.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`payment-method-${method.id}`}
                          checked={selectedPaymentMethod === method.id.toString()}
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

                  {/* பணம் செலுத்தும் முறை விவரங்கள் */}
                  {selectedPaymentMethod && (
                    <div className="mt-4 p-4 border border-cyan-200 rounded-lg bg-cyan-50">
                      <h4 className="font-medium mb-4 text-cyan-800">பணம் செலுத்தும் விவரங்கள்</h4>

                      {/* வாங்குபவர் வங்கி விவரங்கள் */}
                      <div className="mb-4">
                        <h5 className="font-medium mb-2 text-cyan-700">வாங்குபவர் வங்கி விவரங்கள்</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="buyer-bank-name" className="text-cyan-800 text-sm">
                              வங்கியின் பெயர்
                            </Label>
                            <Input
                              id="buyer-bank-name"
                              value={buyerBankName}
                              onChange={(e) => setBuyerBankName(e.target.value)}
                              placeholder="வங்கியின் பெயரை உள்ளிடவும்"
                              className="bg-white border-cyan-200 focus:border-cyan-400"
                            />
                          </div>
                          <div>
                            <Label htmlFor="buyer-bank-branch" className="text-cyan-800 text-sm">
                              வங்கியின் கிளை
                            </Label>
                            <Input
                              id="buyer-bank-branch"
                              value={buyerBankBranch}
                              onChange={(e) => setBuyerBankBranch(e.target.value)}
                              placeholder="வங்கியின் கிளையை உள்ளிடவும்"
                              className="bg-white border-cyan-200 focus:border-cyan-400"
                            />
                          </div>
                          <div>
                            <Label htmlFor="buyer-account-type" className="text-cyan-800 text-sm">
                              கணக்கு வகை
                            </Label>
                            <Select value={buyerAccountType} onValueChange={setBuyerAccountType}>
                              <SelectTrigger className="bg-white border-cyan-200 focus:border-cyan-400">
                                <SelectValue placeholder="கணக்கு வகையை தேர்ந்தெடுக்கவும்" />
                              </SelectTrigger>
                              <SelectContent>
                                {accountTypes.map((type) => (
                                  <SelectItem key={type.id} value={type.id.toString()}>
                                    {type.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="buyer-account-number" className="text-cyan-800 text-sm">
                              கணக்கு எண்
                            </Label>
                            <Input
                              id="buyer-account-number"
                              value={buyerAccountNumber}
                              onChange={(e) => setBuyerAccountNumber(e.target.value)}
                              placeholder="கணக்கு எண்ணை உள்ளிடவும்"
                              className="bg-white border-cyan-200 focus:border-cyan-400"
                            />
                          </div>
                        </div>
                      </div>

                      {/* விற்பவர் வங்கி விவரங்கள் */}
                      <div className="mb-4">
                        <h5 className="font-medium mb-2 text-cyan-700">விற்பவர் வங்கி விவரங்கள்</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="seller-bank-name" className="text-cyan-800 text-sm">
                              வங்கியின் பெயர்
                            </Label>
                            <Input
                              id="seller-bank-name"
                              value={sellerBankName}
                              onChange={(e) => setSellerBankName(e.target.value)}
                              placeholder="வங்கியின் பெயரை உள்ளிடவும்"
                              className="bg-white border-cyan-200 focus:border-cyan-400"
                            />
                          </div>
                          <div>
                            <Label htmlFor="seller-bank-branch" className="text-cyan-800 text-sm">
                              வங்கியின் கிளை
                            </Label>
                            <Input
                              id="seller-bank-branch"
                              value={sellerBankBranch}
                              onChange={(e) => setSellerBankBranch(e.target.value)}
                              placeholder="வங்கியின் கிளையை உள்ளிடவும்"
                              className="bg-white border-cyan-200 focus:border-cyan-400"
                            />
                          </div>
                          <div>
                            <Label htmlFor="seller-account-type" className="text-cyan-800 text-sm">
                              கணக்கு வகை
                            </Label>
                            <Select value={sellerAccountType} onValueChange={setSellerAccountType}>
                              <SelectTrigger className="bg-white border-cyan-200 focus:border-cyan-400">
                                <SelectValue placeholder="கணக்கு வகையை தேர்ந்தெடுக்கவும்" />
                              </SelectTrigger>
                              <SelectContent>
                                {accountTypes.map((type) => (
                                  <SelectItem key={type.id} value={type.id.toString()}>
                                    {type.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="seller-account-number" className="text-cyan-800 text-sm">
                              கணக்கு எண்
                            </Label>
                            <Input
                              id="seller-account-number"
                              value={sellerAccountNumber}
                              onChange={(e) => setSellerAccountNumber(e.target.value)}
                              placeholder="கணக்கு எண்ணை உள்ளிடவும்"
                              className="bg-white border-cyan-200 focus:border-cyan-400"
                            />
                          </div>
                        </div>
                      </div>

                      {/* பரிவர்த்தனை விவரங்கள் */}
                      <div>
                        <h5 className="font-medium mb-2 text-cyan-700">
                          {selectedPaymentMethod === "1"
                            ? "காசோலை விவரங்கள்"
                            : selectedPaymentMethod === "2"
                              ? "வரைவோலை விவரங்கள்"
                              : "மின்னணு பரிவர்த்தனை விவரங்கள்"}
                        </h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="transaction-number" className="text-cyan-800 text-sm">
                              {selectedPaymentMethod === "1"
                                ? "காசோலை எண்"
                                : selectedPaymentMethod === "2"
                                  ? "வரைவோலை எண்"
                                  : "பரிவர்த்தனை எண்"}
                            </Label>
                            <Input
                              id="transaction-number"
                              value={transactionNumber}
                              onChange={(e) => setTransactionNumber(e.target.value)}
                              placeholder={
                                selectedPaymentMethod === "1"
                                  ? "காசோலை எண்ணை உள்ளிடவும்"
                                  : selectedPaymentMethod === "2"
                                    ? "வரைவோலை எண்ணை உள்ளிடவும்"
                                    : "பரிவர்த்தனை எண்ணை உள்ளிடவும்"
                              }
                              className="bg-white border-cyan-200 focus:border-cyan-400"
                            />
                          </div>
                          <div>
                            <Label htmlFor="transaction-date" className="text-cyan-800 text-sm">
                              தேதி (DD/MM/YYYY)
                            </Label>
                            <Input
                              id="transaction-date"
                              value={transactionDate}
                              onChange={(e) => setTransactionDate(e.target.value)}
                              placeholder="DD/MM/YYYY"
                              className="bg-white border-cyan-200 focus:border-cyan-400"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
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

            {!isEditMode && (
              <div className="flex justify-between mt-6">
                <Button
                  type="button"
                  onClick={() => setActiveTab("section3")}
                  variant="outline"
                  className="border-cyan-300 text-cyan-700 hover:bg-cyan-100"
                >
                  முந்தைய பக்கம்
                </Button>
                <Button
                  type="submit"
                  onClick={handleSubmit}
                  className="bg-cyan-600 hover:bg-cyan-700 text-white"
                  disabled={isSaving}
                >
                  <Check className="h-4 w-4 mr-2" />
                  {isSaving ? "சேமிக்கிறது..." : "சேமி"}
                </Button>
              </div>
            )}
          </TabsContent>
        </div>
      </Tabs>
      {/* Document Name Dialog */}
      <DocumentNameDialog
        open={showNameDialog}
        onOpenChange={setShowNameDialog}
        onSave={handleSaveWithName}
        onCancel={() => setShowNameDialog(false)}
        title="கிரைய ஆவணத்தை சேமிக்க"
        description="இந்த கிரைய ஆவணத்திற்கு ஒரு பெயரை உள்ளிடவும்"
        saveButtonText={isSaving ? "சேமிக்கிறது..." : "சேமி"}
        cancelButtonText="ரத்து செய்"
      />
    </div>
  )
}
