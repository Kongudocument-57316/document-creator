"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import Link from "next/link"
import {
  Home,
  ArrowLeft,
  Search,
  Eye,
  Pencil,
  Trash2,
  Download,
  FileText,
  FileDown,
  ChevronDown,
  ChevronUp,
  Filter,
  List,
  Grid,
  SortAsc,
  HelpCircle,
  FileSpreadsheet,
  History,
  Clock,
  X,
  Info,
} from "lucide-react"
import { getSupabaseBrowserClient } from "@/lib/supabase"
import { searchDocuments, deleteDocument } from "./search-documents-action"
import { exportToDocx, exportToPdf } from "../create/export-utils"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"

// Format date from YYYY-MM-DD to DD/MM/YYYY for display
const formatDateForDisplay = (dateString: string) => {
  if (!dateString) return ""
  const date = new Date(dateString)
  return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(
    2,
    "0",
  )}/${date.getFullYear()}`
}

// Format currency for display
const formatCurrency = (amount: number | string) => {
  if (!amount) return "₹0"
  const numAmount = typeof amount === "string" ? Number.parseFloat(amount) : amount
  return new Intl.NumberFormat("ta-IN", { style: "currency", currency: "INR" }).format(numAmount)
}

// Export search results to CSV
const exportToCSV = (data: any[]) => {
  // Define CSV headers
  const headers = [
    "ஆவணப் பெயர்",
    "ஆவணத் தேதி",
    "விற்பனை தொகை",
    "வாங்குபவர்கள்",
    "விற்பவர்கள்",
    "சார்பதிவாளர் அலுவலகம்",
    "ஆவண வகை",
    "புத்தக எண்",
  ]

  // Format data for CSV
  const csvData = data.map((doc) => {
    return [
      doc.document_name,
      formatDateForDisplay(doc.document_date),
      doc.sale_amount,
      doc.buyers.map((b: any) => b.name).join(", "),
      doc.sellers.map((s: any) => s.name).join(", "),
      doc.sub_registrar_offices?.name || "",
      doc.document_types?.name || "",
      doc.book_numbers?.number || "",
    ]
  })

  // Combine headers and data
  const csvContent = [headers.join(","), ...csvData.map((row) => row.map((cell) => `"${cell}"`).join(","))].join("\n")

  // Create and download the CSV file
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.setAttribute("href", url)
  link.setAttribute("download", `ஆவண_தேடல்_முடிவுகள்_${new Date().toLocaleDateString()}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// Define tooltip content for search filters
const tooltips = {
  documentName: "ஆவணத்தின் பெயரை உள்ளிடவும். பகுதி பெயரையும் தேடலாம்.",
  documentDate: "DD/MM/YYYY வடிவத்தில் தேதியை உள்ளிடவும்.",
  buyerName: "வாங்குபவரின் பெயரை உள்ளிடவும். பகுதி பெயரையும் தேடலாம்.",
  sellerName: "விற்பவரின் பெயரை உள்ளிடவும். பகுதி பெயரையும் தேடலாம்.",
  registrationDistrict: "பதிவு மாவட்டத்தை தேர்ந்தெடுக்கவும்.",
  subRegistrarOffice: "சார்பதிவாளர் அலுவலகத்தை தேர்ந்தெடுக்கவும்.",
  saleAmount: "விற்பனை தொகையை உள்ளிடவும்.",
  documentType: "ஆவண வகையை தேர்ந்தெடுக்கவும்.",
  bookNumber: "புத்தக எண்ணை தேர்ந்தெடுக்கவும்.",
  documentNumber: "ஆவண எண்ணை உள்ளிடவும்.",
  documentYear: "ஆவண ஆண்டை உள்ளிடவும்.",
  typist: "தட்டச்சாளரை தேர்ந்தெடுக்கவும்.",
  landType: "நில வகையை தேர்ந்தெடுக்கவும்.",
  surveyNumber: "சர்வே எண்ணை உள்ளிடவும்.",
  propertyName: "சொத்து பெயரை உள்ளிடவும்.",
}

export default function SearchSaleDocument() {
  // Search filters
  const [documentName, setDocumentName] = useState("")
  const [documentDateFrom, setDocumentDateFrom] = useState("")
  const [documentDateTo, setDocumentDateTo] = useState("")
  const [buyerName, setBuyerName] = useState("")
  const [sellerName, setSellerName] = useState("")
  const [registrationDistrictId, setRegistrationDistrictId] = useState("")
  const [subRegistrarOfficeId, setSubRegistrarOfficeId] = useState("")

  // புதிய வடிகட்டிகள்
  const [saleAmountFrom, setSaleAmountFrom] = useState("")
  const [saleAmountTo, setSaleAmountTo] = useState("")
  const [documentTypeId, setDocumentTypeId] = useState("")
  const [bookNumberId, setBookNumberId] = useState("")
  const [documentNumber, setDocumentNumber] = useState("")
  const [documentYear, setDocumentYear] = useState("")
  const [typistId, setTypistId] = useState("")
  const [landTypeId, setLandTypeId] = useState("")
  const [surveyNumber, setSurveyNumber] = useState("")
  const [propertyName, setPropertyName] = useState("")

  // மேம்பட்ட வடிகட்டிகள் காட்ட/மறைக்க
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)

  // Reference data
  const [registrationDistricts, setRegistrationDistricts] = useState<any[]>([])
  const [subRegistrarOffices, setSubRegistrarOffices] = useState<any[]>([])
  const [filteredSubRegistrarOffices, setFilteredSubRegistrarOffices] = useState<any[]>([])
  const [documentTypes, setDocumentTypes] = useState<any[]>([])
  const [bookNumbers, setBookNumbers] = useState<any[]>([])
  const [typists, setTypists] = useState<any[]>([])
  const [landTypes, setLandTypes] = useState<any[]>([])

  // Search results
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [filteredResults, setFilteredResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  // Delete confirmation
  const [documentToDelete, setDocumentToDelete] = useState<number | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Document download
  const [isDownloading, setIsDownloading] = useState<number | null>(null)
  const [downloadFormat, setDownloadFormat] = useState<"html" | "docx" | "pdf" | null>(null)

  // UI state
  const [viewMode, setViewMode] = useState<"list" | "grid">("list")
  const [sortField, setSortField] = useState<string>("document_date")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [activeTab, setActiveTab] = useState("results")

  // Search history
  const [searchHistory, setSearchHistory] = useState<any[]>([])
  const [showSearchHistory, setShowSearchHistory] = useState(false)

  // Loading states
  const [isLoadingReference, setIsLoadingReference] = useState(true)

  const supabase = getSupabaseBrowserClient()

  // Fetch reference data on component mount
  useEffect(() => {
    const fetchAllReferenceData = async () => {
      setIsLoadingReference(true)
      await Promise.all([
        fetchRegistrationDistricts(),
        fetchSubRegistrarOffices(),
        fetchDocumentTypes(),
        fetchBookNumbers(),
        fetchTypists(),
        fetchLandTypes(),
      ])
      setIsLoadingReference(false)
    }

    fetchAllReferenceData()

    // Load search history from local storage
    const savedHistory = localStorage.getItem("searchHistory")
    if (savedHistory) {
      try {
        setSearchHistory(JSON.parse(savedHistory))
      } catch (error) {
        console.error("Error loading search history:", error)
      }
    }
  }, [])

  // Filter sub-registrar offices when registration district changes
  useEffect(() => {
    if (registrationDistrictId && registrationDistrictId !== "all") {
      const filtered = subRegistrarOffices.filter(
        (office) => office.registration_district_id === Number.parseInt(registrationDistrictId),
      )
      setFilteredSubRegistrarOffices(filtered)
    } else {
      setFilteredSubRegistrarOffices(subRegistrarOffices)
    }
    setSubRegistrarOfficeId("")
  }, [registrationDistrictId, subRegistrarOffices])

  // Apply sorting and pagination to search results
  useEffect(() => {
    if (searchResults.length === 0) {
      setFilteredResults([])
      return
    }

    // Apply sorting
    const sorted = [...searchResults]
    sorted.sort((a, b) => {
      let valueA, valueB

      // Handle nested properties
      if (sortField === "buyers") {
        valueA = a.buyers && a.buyers.length > 0 ? a.buyers[0].name : ""
        valueB = b.buyers && b.buyers.length > 0 ? b.buyers[0].name : ""
      } else if (sortField === "sellers") {
        valueA = a.sellers && a.sellers.length > 0 ? a.sellers[0].name : ""
        valueB = b.sellers && b.sellers.length > 0 ? b.sellers[0].name : ""
      } else if (sortField === "sub_registrar_office") {
        valueA = a.sub_registrar_offices?.name || ""
        valueB = b.sub_registrar_offices?.name || ""
      } else if (sortField === "document_type") {
        valueA = a.document_types?.name || ""
        valueB = b.document_types?.name || ""
      } else if (sortField === "book_number") {
        valueA = a.book_numbers?.number || ""
        valueB = b.book_numbers?.number || ""
      } else {
        valueA = a[sortField]
        valueB = b[sortField]
      }

      // Handle different data types
      if (typeof valueA === "string" && typeof valueB === "string") {
        return sortDirection === "asc" ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA)
      } else {
        return sortDirection === "asc" ? (valueA > valueB ? 1 : -1) : valueA < valueB ? 1 : -1
      }
    })

    // Apply pagination
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    setFilteredResults(sorted.slice(startIndex, endIndex))
  }, [searchResults, sortField, sortDirection, currentPage, itemsPerPage])

  // Fetch reference data functions
  const fetchRegistrationDistricts = async () => {
    try {
      const { data, error } = await supabase.from("registration_districts").select("*").order("name")
      if (error) throw error
      setRegistrationDistricts(data || [])
    } catch (error: any) {
      toast.error("பதிவு மாவட்டங்களை பெறுவதில் பிழை: " + error.message)
    }
  }

  const fetchSubRegistrarOffices = async () => {
    try {
      const { data, error } = await supabase.from("sub_registrar_offices").select("*").order("name")
      if (error) throw error
      setSubRegistrarOffices(data || [])
      setFilteredSubRegistrarOffices(data || [])
    } catch (error: any) {
      toast.error("சார்பதிவாளர் அலுவலகங்களை பெறுவதில் பிழை: " + error.message)
    }
  }

  const fetchDocumentTypes = async () => {
    try {
      const { data, error } = await supabase.from("document_types").select("*").order("name")
      if (error) throw error
      setDocumentTypes(data || [])
    } catch (error: any) {
      toast.error("ஆவண வகைகளை பெறுவதில் பிழை: " + error.message)
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

  const fetchTypists = async () => {
    try {
      const { data, error } = await supabase.from("typists").select("*").order("name")
      if (error) throw error
      setTypists(data || [])
    } catch (error: any) {
      toast.error("தட்டச்சாளர்களை பெறுவதில் பிழை: " + error.message)
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

  // Get current search filters
  const getCurrentFilters = () => {
    return {
      documentName,
      documentDateFrom,
      documentDateTo,
      buyerName,
      sellerName,
      propertyName,
      registrationDistrictId,
      subRegistrarOfficeId,
      saleAmountFrom,
      saleAmountTo,
      documentTypeId,
      bookNumberId,
      documentNumber,
      documentYear,
      typistId,
      landTypeId,
      surveyNumber,
    }
  }

  // Save search to history
  const saveSearchToHistory = (filters: any, resultCount: number) => {
    const timestamp = new Date().toISOString()
    const newSearch = {
      id: timestamp,
      timestamp,
      filters,
      resultCount,
    }

    const updatedHistory = [newSearch, ...searchHistory.slice(0, 9)] // Keep only the 10 most recent searches
    setSearchHistory(updatedHistory)

    // Save to local storage
    try {
      localStorage.setItem("searchHistory", JSON.stringify(updatedHistory))
    } catch (error) {
      console.error("Error saving search history:", error)
    }
  }

  // Load search from history
  const loadSearchFromHistory = (historicalSearch: any) => {
    const { filters } = historicalSearch

    // Set all filter values
    setDocumentName(filters.documentName || "")
    setDocumentDateFrom(filters.documentDateFrom || "")
    setDocumentDateTo(filters.documentDateTo || "")
    setBuyerName(filters.buyerName || "")
    setSellerName(filters.sellerName || "")
    setPropertyName(filters.propertyName || "")
    setRegistrationDistrictId(filters.registrationDistrictId || "")
    setSubRegistrarOfficeId(filters.subRegistrarOfficeId || "")
    setSaleAmountFrom(filters.saleAmountFrom || "")
    setSaleAmountTo(filters.saleAmountTo || "")
    setDocumentTypeId(filters.documentTypeId || "")
    setBookNumberId(filters.bookNumberId || "")
    setDocumentNumber(filters.documentNumber || "")
    setDocumentYear(filters.documentYear || "")
    setTypistId(filters.typistId || "")
    setLandTypeId(filters.landTypeId || "")
    setSurveyNumber(filters.surveyNumber || "")

    // Show advanced filters if any are set
    if (
      filters.saleAmountFrom ||
      filters.saleAmountTo ||
      filters.documentTypeId ||
      filters.bookNumberId ||
      filters.documentNumber ||
      filters.documentYear ||
      filters.typistId ||
      filters.landTypeId ||
      filters.surveyNumber ||
      filters.propertyName
    ) {
      setShowAdvancedFilters(true)
    }

    // Close the history panel
    setShowSearchHistory(false)

    // Execute the search
    handleSearch(new Event("submit") as any)
  }

  // Delete search from history
  const deleteSearchFromHistory = (id: string) => {
    const updatedHistory = searchHistory.filter((item) => item.id !== id)
    setSearchHistory(updatedHistory)

    // Save to local storage
    try {
      localStorage.setItem("searchHistory", JSON.stringify(updatedHistory))
    } catch (error) {
      console.error("Error saving search history:", error)
    }
  }

  // Handle search
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSearching(true)
    setCurrentPage(1) // Reset to first page on new search

    try {
      const filters = getCurrentFilters()
      const result = await searchDocuments(filters)

      if (result.success) {
        setSearchResults(result.documents)
        setHasSearched(true)
        saveSearchToHistory(filters, result.documents.length)

        if (result.documents.length === 0) {
          toast.info("தேடலுக்கு பொருத்தமான ஆவணங்கள் எதுவும் கிடைக்கவில்லை")
        } else {
          toast.success(`${result.documents.length} ஆவணங்கள் கண்டுபிடிக்கப்பட்டன`)
        }
      } else {
        toast.error("ஆவணங்களை தேடுவதில் பிழை: " + result.error)
      }
    } catch (error: any) {
      toast.error("ஆவணங்களை தேடுவதில் பிழை: " + error.message)
    } finally {
      setIsSearching(false)
    }
  }

  // Handle form reset
  const handleReset = () => {
    setDocumentName("")
    setDocumentDateFrom("")
    setDocumentDateTo("")
    setBuyerName("")
    setSellerName("")
    setRegistrationDistrictId("")
    setSubRegistrarOfficeId("")
    setSaleAmountFrom("")
    setSaleAmountTo("")
    setDocumentTypeId("")
    setBookNumberId("")
    setDocumentNumber("")
    setDocumentYear("")
    setTypistId("")
    setLandTypeId("")
    setSurveyNumber("")
    setPropertyName("")
    setShowAdvancedFilters(false)
    toast.info("தேடல் வடிகட்டிகள் அழிக்கப்பட்டன")
  }

  // Handle document deletion
  const handleDeleteConfirm = async () => {
    if (!documentToDelete) return

    setIsDeleting(true)

    try {
      const result = await deleteDocument(documentToDelete)

      if (result.success) {
        toast.success("ஆவணம் வெற்றிகரமாக நீக்கப்பட்டது")
        // Remove from search results
        const updatedResults = searchResults.filter((doc) => doc.id !== documentToDelete)
        setSearchResults(updatedResults)
      } else {
        toast.error("ஆவணத்தை நீக்குவதில் பிழை: " + result.error)
      }
    } catch (error: any) {
      toast.error("ஆவணத்தை நீக்குவதில் பிழை: " + error.message)
    } finally {
      setIsDeleting(false)
      setDocumentToDelete(null)
    }
  }

  // Handle document download
  const handleDownload = async (documentId: number, documentName: string, format: "html" | "docx" | "pdf") => {
    try {
      setIsDownloading(documentId)
      setDownloadFormat(format)

      // Fetch document content
      const { data, error } = await supabase
        .from("sale_documents")
        .select("document_content")
        .eq("id", documentId)
        .single()

      if (error) throw error

      if (!data.document_content) {
        toast.error("ஆவணத்தின் உள்ளடக்கம் கிடைக்கவில்லை")
        return
      }

      // Create a temporary div to hold the document content
      const tempDiv = document.createElement("div")
      tempDiv.innerHTML = data.document_content
      tempDiv.className = "document-content"
      tempDiv.style.display = "none"
      document.body.appendChild(tempDiv)

      try {
        if (format === "html") {
          // Create a blob from the HTML content
          const blob = new Blob([data.document_content], { type: "text/html" })
          const url = URL.createObjectURL(blob)

          // Create a download link and click it
          const a = document.createElement("a")
          a.href = url
          a.download = `${documentName.replace(/\s+/g, "_")}.html`
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
          URL.revokeObjectURL(url)

          toast.success("HTML ஆவணம் வெற்றிகரமாக பதிவிறக்கப்பட்டது")
        } else if (format === "docx") {
          // Use the exportToDocx function
          const handler = exportToDocx(".document-content", documentName.replace(/\s+/g, "_"))
          await handler()
        } else if (format === "pdf") {
          // Use the exportToPdf function
          const handler = exportToPdf(".document-content", documentName.replace(/\s+/g, "_"))
          await handler()
        }
      } finally {
        // Clean up the temporary div
        document.body.removeChild(tempDiv)
      }
    } catch (error: any) {
      toast.error(`${format.toUpperCase()} ஆவணத்தை பதிவிறக்குவதில் பிழை: ${error.message}`)
    } finally {
      setIsDownloading(null)
      setDownloadFormat(null)
    }
  }

  // Handle sorting change
  const handleSortChange = (field: string) => {
    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      // Set new field and default to ascending
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Calculate total pages
  const totalPages = Math.ceil(searchResults.length / itemsPerPage)

  // Generate pagination items
  const generatePaginationItems = () => {
    const items = []

    // Always show first page
    items.push(
      <PaginationItem key="first">
        <PaginationLink onClick={() => setCurrentPage(1)} isActive={currentPage === 1}>
          1
        </PaginationLink>
      </PaginationItem>,
    )

    // Show ellipsis if needed
    if (currentPage > 3) {
      items.push(
        <PaginationItem key="ellipsis-1">
          <PaginationEllipsis />
        </PaginationItem>,
      )
    }

    // Show pages around current page
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink onClick={() => setCurrentPage(i)} isActive={currentPage === i}>
            {i}
          </PaginationLink>
        </PaginationItem>,
      )
    }

    // Show ellipsis if needed
    if (currentPage < totalPages - 2) {
      items.push(
        <PaginationItem key="ellipsis-2">
          <PaginationEllipsis />
        </PaginationItem>,
      )
    }

    // Always show last page if there's more than one page
    if (totalPages > 1) {
      items.push(
        <PaginationItem key="last">
          <PaginationLink onClick={() => setCurrentPage(totalPages)} isActive={currentPage === totalPages}>
            {totalPages}
          </PaginationLink>
        </PaginationItem>,
      )
    }

    return items
  }

  // Render loading skeleton
  const renderSkeleton = () => (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <Card key={index} className="border-sky-200">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="w-3/4">
                <Skeleton className="h-6 w-48 mb-2" />
                <Skeleton className="h-4 w-32 mb-1" />
                <Skeleton className="h-4 w-24 mb-3" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div>
                    <Skeleton className="h-4 w-24 mb-1" />
                    <Skeleton className="h-3 w-32 mb-1" />
                    <Skeleton className="h-3 w-28" />
                  </div>
                  <div>
                    <Skeleton className="h-4 w-24 mb-1" />
                    <Skeleton className="h-3 w-36 mb-1" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-8 w-16" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-8 w-16" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  return (
    <div className="flex min-h-screen flex-col bg-sky-50">
      <Header className="bg-sky-100 border-sky-200" />
      <div className="flex items-center gap-2 p-4 bg-sky-50">
        <Button asChild variant="outline" className="border-sky-300 text-sky-700 hover:bg-sky-100">
          <Link href="/document-details/sale-document">
            <ArrowLeft className="h-4 w-4 mr-2" />
            பின்செல்
          </Link>
        </Button>
        <Button asChild variant="outline" className="border-sky-300 text-sky-700 hover:bg-sky-100">
          <Link href="/">
            <Home className="h-4 w-4 mr-2" />
            முகப்பு
          </Link>
        </Button>
      </div>
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-sky-800">கிரைய ஆவணங்கள் தேடுதல்</h2>

            <div className="flex gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-sky-300 text-sky-700 hover:bg-sky-100"
                      onClick={() => setShowSearchHistory(!showSearchHistory)}
                    >
                      <History className="h-4 w-4 mr-2" />
                      தேடல் வரலாறு
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>முந்தைய தேடல்களைக் காட்டு</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {searchResults.length > 0 && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-sky-300 text-sky-700 hover:bg-sky-100"
                        onClick={() => exportToCSV(searchResults)}
                      >
                        <FileSpreadsheet className="h-4 w-4 mr-2" />
                        CSV ஏற்றுமதி
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>தேடல் முடிவுகளை CSV வடிவில் ஏற்றுமதி செய்</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </div>

          {/* Search History Panel */}
          {showSearchHistory && (
            <Card className="mb-6 border-sky-200">
              <CardHeader className="bg-sky-50 flex flex-row items-center justify-between">
                <CardTitle className="text-sky-800">தேடல் வரலாறு</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSearchHistory(false)}
                  className="text-sky-700 hover:bg-sky-100"
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                {searchHistory.length === 0 ? (
                  <div className="text-center py-4 text-sky-700">
                    <p>தேடல் வரலாறு இல்லை</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {searchHistory.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-2 border border-sky-200 rounded-md hover:bg-sky-50"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-sky-600" />
                            <span className="text-sm text-sky-800">
                              {new Date(item.timestamp).toLocaleString("ta-IN")}
                            </span>
                          </div>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {item.filters.documentName && (
                              <Badge variant="outline" className="text-xs bg-sky-50">
                                {item.filters.documentName}
                              </Badge>
                            )}
                            {(item.filters.documentDateFrom || item.filters.documentDateTo) && (
                              <Badge variant="outline" className="text-xs bg-sky-50">
                                {item.filters.documentDateFrom && item.filters.documentDateTo
                                  ? `${item.filters.documentDateFrom} - ${item.filters.documentDateTo}`
                                  : item.filters.documentDateFrom || item.filters.documentDateTo}
                              </Badge>
                            )}
                            {item.filters.buyerName && (
                              <Badge variant="outline" className="text-xs bg-sky-50">
                                வாங்குபவர்: {item.filters.buyerName}
                              </Badge>
                            )}
                            {item.filters.sellerName && (
                              <Badge variant="outline" className="text-xs bg-sky-50">
                                விற்பவர்: {item.filters.sellerName}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-sky-600">{item.resultCount} முடிவுகள்</Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => loadSearchFromHistory(item)}
                            className="text-sky-700 hover:bg-sky-100"
                          >
                            <Search className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteSearchFromHistory(item.id)}
                            className="text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          <Card className="mb-6 border-sky-200">
            <CardHeader className="bg-sky-50">
              <CardTitle className="text-sky-800">தேடல் வடிகட்டிகள்</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div>
                          <Label htmlFor="document-name" className="text-sky-800 flex items-center gap-1">
                            ஆவணப் பெயர்
                            <HelpCircle className="h-3 w-3 text-sky-600" />
                          </Label>
                          <Input
                            id="document-name"
                            value={documentName}
                            onChange={(e) => setDocumentName(e.target.value)}
                            placeholder="ஆவணப் பெயரை உள்ளிடவும்"
                            className="mt-1 bg-white border-sky-200 focus:border-sky-400"
                          />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{tooltips.documentName}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div>
                          <Label htmlFor="document-date-from" className="text-sky-800 flex items-center gap-1">
                            ஆவணத் தேதி (இருந்து)
                            <HelpCircle className="h-3 w-3 text-sky-600" />
                          </Label>
                          <Input
                            id="document-date-from"
                            value={documentDateFrom}
                            onChange={(e) => setDocumentDateFrom(e.target.value)}
                            placeholder="DD/MM/YYYY"
                            className="mt-1 bg-white border-sky-200 focus:border-sky-400"
                          />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{tooltips.documentDate}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div>
                          <Label htmlFor="document-date-to" className="text-sky-800 flex items-center gap-1">
                            ஆவணத் தேதி (வரை)
                            <HelpCircle className="h-3 w-3 text-sky-600" />
                          </Label>
                          <Input
                            id="document-date-to"
                            value={documentDateTo}
                            onChange={(e) => setDocumentDateTo(e.target.value)}
                            placeholder="DD/MM/YYYY"
                            className="mt-1 bg-white border-sky-200 focus:border-sky-400"
                          />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{tooltips.documentDate}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div>
                          <Label htmlFor="buyer-name" className="text-sky-800 flex items-center gap-1">
                            வாங்குபவர் பெயர்
                            <HelpCircle className="h-3 w-3 text-sky-600" />
                          </Label>
                          <Input
                            id="buyer-name"
                            value={buyerName}
                            onChange={(e) => setBuyerName(e.target.value)}
                            placeholder="வாங்குபவர் பெயரை உள்ளிடவும்"
                            className="mt-1 bg-white border-sky-200 focus:border-sky-400"
                          />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{tooltips.buyerName}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div>
                          <Label htmlFor="seller-name" className="text-sky-800 flex items-center gap-1">
                            விற்பவர் பெயர்
                            <HelpCircle className="h-3 w-3 text-sky-600" />
                          </Label>
                          <Input
                            id="seller-name"
                            value={sellerName}
                            onChange={(e) => setSellerName(e.target.value)}
                            placeholder="விற்பவர் பெயரை உள்ளிடவும்"
                            className="mt-1 bg-white border-sky-200 focus:border-sky-400"
                          />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{tooltips.sellerName}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div>
                          <Label htmlFor="registration-district" className="text-sky-800 flex items-center gap-1">
                            பதிவு மாவட்டம்
                            <HelpCircle className="h-3 w-3 text-sky-600" />
                          </Label>
                          <Select value={registrationDistrictId} onValueChange={setRegistrationDistrictId}>
                            <SelectTrigger className="mt-1 bg-white border-sky-200 focus:border-sky-400">
                              <SelectValue placeholder="பதிவு மாவட்டத்தை தேர்ந்தெடுக்கவும்" />
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
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{tooltips.registrationDistrict}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                <Collapsible
                  open={showAdvancedFilters}
                  onOpenChange={setShowAdvancedFilters}
                  className="border-t border-sky-200 pt-4 mt-4"
                >
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex items-center justify-center w-full border-sky-300 text-sky-700 hover:bg-sky-100"
                    >
                      <Filter className="h-4 w-4 mr-2" />
                      {showAdvancedFilters ? "மேம்பட்ட வடிகட்டிகளை மறை" : "மேம்பட்ட வடிகட்டிகளைக் காட்டு"}
                      {showAdvancedFilters ? (
                        <ChevronUp className="h-4 w-4 ml-2" />
                      ) : (
                        <ChevronDown className="h-4 w-4 ml-2" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div>
                              <Label htmlFor="sub-registrar-office" className="text-sky-800 flex items-center gap-1">
                                சார்பதிவாளர் அலுவலகம்
                                <HelpCircle className="h-3 w-3 text-sky-600" />
                              </Label>
                              <Select
                                value={subRegistrarOfficeId}
                                onValueChange={setSubRegistrarOfficeId}
                                disabled={filteredSubRegistrarOffices.length === 0}
                              >
                                <SelectTrigger className="mt-1 bg-white border-sky-200 focus:border-sky-400">
                                  <SelectValue placeholder="சார்பதிவாளர் அலுவலகத்தை தேர்ந்தெடுக்கவும்" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="all">அனைத்தும்</SelectItem>
                                  {filteredSubRegistrarOffices.map((office) => (
                                    <SelectItem key={office.id} value={office.id.toString()}>
                                      {office.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{tooltips.subRegistrarOffice}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div>
                              <Label htmlFor="sale-amount-from" className="text-sky-800 flex items-center gap-1">
                                விற்பனை தொகை (இருந்து)
                                <HelpCircle className="h-3 w-3 text-sky-600" />
                              </Label>
                              <Input
                                id="sale-amount-from"
                                type="number"
                                value={saleAmountFrom}
                                onChange={(e) => setSaleAmountFrom(e.target.value)}
                                placeholder="விற்பனை தொகையை உள்ளிடவும்"
                                className="mt-1 bg-white border-sky-200 focus:border-sky-400"
                              />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{tooltips.saleAmount}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div>
                              <Label htmlFor="sale-amount-to" className="text-sky-800 flex items-center gap-1">
                                விற்பனை தொகை (வரை)
                                <HelpCircle className="h-3 w-3 text-sky-600" />
                              </Label>
                              <Input
                                id="sale-amount-to"
                                type="number"
                                value={saleAmountTo}
                                onChange={(e) => setSaleAmountTo(e.target.value)}
                                placeholder="விற்பனை தொகையை உள்ளிடவும்"
                                className="mt-1 bg-white border-sky-200 focus:border-sky-400"
                              />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{tooltips.saleAmount}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div>
                              <Label htmlFor="document-type" className="text-sky-800 flex items-center gap-1">
                                ஆவண வகை
                                <HelpCircle className="h-3 w-3 text-sky-600" />
                              </Label>
                              <Select value={documentTypeId} onValueChange={setDocumentTypeId}>
                                <SelectTrigger className="mt-1 bg-white border-sky-200 focus:border-sky-400">
                                  <SelectValue placeholder="ஆவண வகையை தேர்ந்தெடுக்கவும்" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="all">அனைத்தும்</SelectItem>
                                  {documentTypes.map((type) => (
                                    <SelectItem key={type.id} value={type.id.toString()}>
                                      {type.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{tooltips.documentType}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div>
                              <Label htmlFor="book-number" className="text-sky-800 flex items-center gap-1">
                                புத்தக எண்
                                <HelpCircle className="h-3 w-3 text-sky-600" />
                              </Label>
                              <Select value={bookNumberId} onValueChange={setBookNumberId}>
                                <SelectTrigger className="mt-1 bg-white border-sky-200 focus:border-sky-400">
                                  <SelectValue placeholder="புத்தக எண்ணை தேர்ந்தெடுக்கவும்" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="all">அனைத்தும்</SelectItem>
                                  {bookNumbers.map((book) => (
                                    <SelectItem key={book.id} value={book.id.toString()}>
                                      {book.number}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{tooltips.bookNumber}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div>
                              <Label htmlFor="document-number" className="text-sky-800 flex items-center gap-1">
                                ஆவண எண்
                                <HelpCircle className="h-3 w-3 text-sky-600" />
                              </Label>
                              <Input
                                id="document-number"
                                value={documentNumber}
                                onChange={(e) => setDocumentNumber(e.target.value)}
                                placeholder="ஆவண எண்ணை உள்ளிடவும்"
                                className="mt-1 bg-white border-sky-200 focus:border-sky-400"
                              />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{tooltips.documentNumber}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div>
                              <Label htmlFor="document-year" className="text-sky-800 flex items-center gap-1">
                                ஆவண ஆண்டு
                                <HelpCircle className="h-3 w-3 text-sky-600" />
                              </Label>
                              <Input
                                id="document-year"
                                value={documentYear}
                                onChange={(e) => setDocumentYear(e.target.value)}
                                placeholder="ஆவண ஆண்டை உள்ளிடவும்"
                                className="mt-1 bg-white border-sky-200 focus:border-sky-400"
                              />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{tooltips.documentYear}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div>
                              <Label htmlFor="typist" className="text-sky-800 flex items-center gap-1">
                                தட்டச்சாளர்
                                <HelpCircle className="h-3 w-3 text-sky-600" />
                              </Label>
                              <Select value={typistId} onValueChange={setTypistId}>
                                <SelectTrigger className="mt-1 bg-white border-sky-200 focus:border-sky-400">
                                  <SelectValue placeholder="தட்டச்சாளரை தேர்ந்தெடுக்கவும்" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="all">அனைத்தும்</SelectItem>
                                  {typists.map((typist) => (
                                    <SelectItem key={typist.id} value={typist.id.toString()}>
                                      {typist.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{tooltips.typist}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div>
                              <Label htmlFor="land-type" className="text-sky-800 flex items-center gap-1">
                                நில வகை
                                <HelpCircle className="h-3 w-3 text-sky-600" />
                              </Label>
                              <Select value={landTypeId} onValueChange={setLandTypeId}>
                                <SelectTrigger className="mt-1 bg-white border-sky-200 focus:border-sky-400">
                                  <SelectValue placeholder="நில வகையை தேர்ந்தெடுக்கவும்" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="all">அனைத்தும்</SelectItem>
                                  {landTypes.map((type) => (
                                    <SelectItem key={type.id} value={type.id.toString()}>
                                      {type.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{tooltips.landType}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div>
                              <Label htmlFor="survey-number" className="text-sky-800 flex items-center gap-1">
                                சர்வே எண்
                                <HelpCircle className="h-3 w-3 text-sky-600" />
                              </Label>
                              <Input
                                id="survey-number"
                                value={surveyNumber}
                                onChange={(e) => setSurveyNumber(e.target.value)}
                                placeholder="சர்வே எண்ணை உள்ளிடவும்"
                                className="mt-1 bg-white border-sky-200 focus:border-sky-400"
                              />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{tooltips.surveyNumber}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div>
                              <Label htmlFor="property-name" className="text-sky-800 flex items-center gap-1">
                                சொத்து பெயர்
                                <HelpCircle className="h-3 w-3 text-sky-600" />
                              </Label>
                              <Input
                                id="property-name"
                                value={propertyName}
                                onChange={(e) => setPropertyName(e.target.value)}
                                placeholder="சொத்து பெயரை உள்ளிடவும்"
                                className="mt-1 bg-white border-sky-200 focus:border-sky-400"
                              />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{tooltips.propertyName}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleReset}
                    className="border-sky-300 text-sky-700 hover:bg-sky-100"
                  >
                    அழி
                  </Button>
                  <Button type="submit" className="bg-sky-600 hover:bg-sky-700 text-white" disabled={isSearching}>
                    <Search className="h-4 w-4 mr-2" />
                    {isSearching ? "தேடுகிறது..." : "தேடு"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {hasSearched && (
            <div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                <h3 className="text-xl font-semibold text-sky-800">
                  தேடல் முடிவுகள்
                  <Badge className="ml-2 bg-sky-600">{searchResults.length} ஆவணங்கள்</Badge>
                </h3>

                <div className="flex items-center gap-2 mt-2 sm:mt-0">
                  {searchResults.length > 0 && (
                    <>
                      <div className="flex items-center border border-sky-200 rounded-md overflow-hidden">
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`px-2 ${viewMode === "list" ? "bg-sky-100" : ""}`}
                          onClick={() => setViewMode("list")}
                        >
                          <List className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`px-2 ${viewMode === "grid" ? "bg-sky-100" : ""}`}
                          onClick={() => setViewMode("grid")}
                        >
                          <Grid className="h-4 w-4" />
                        </Button>
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" className="border-sky-300 text-sky-700 hover:bg-sky-100">
                            <SortAsc className="h-4 w-4 mr-2" />
                            வரிசைப்படுத்து
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => handleSortChange("document_name")}>
                            ஆவணப் பெயர் {sortField === "document_name" && (sortDirection === "asc" ? "↑" : "↓")}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleSortChange("document_date")}>
                            ஆவணத் தேதி {sortField === "document_date" && (sortDirection === "asc" ? "↑" : "↓")}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleSortChange("sale_amount")}>
                            விற்பனை தொகை {sortField === "sale_amount" && (sortDirection === "asc" ? "↑" : "↓")}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleSortChange("buyers")}>
                            வாங்குபவர் பெயர் {sortField === "buyers" && (sortDirection === "asc" ? "↑" : "↓")}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleSortChange("sellers")}>
                            விற்பவர் பெயர் {sortField === "sellers" && (sortDirection === "asc" ? "↑" : "↓")}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>

                      <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(Number(value))}>
                        <SelectTrigger className="w-[120px] border-sky-300 text-sky-700 hover:bg-sky-100">
                          <SelectValue placeholder="10 ஆவணங்கள்" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5">5 ஆவணங்கள்</SelectItem>
                          <SelectItem value="10">10 ஆவணங்கள்</SelectItem>
                          <SelectItem value="20">20 ஆவணங்கள்</SelectItem>
                          <SelectItem value="50">50 ஆவணங்கள்</SelectItem>
                        </SelectContent>
                      </Select>
                    </>
                  )}
                </div>
              </div>

              {isSearching ? (
                renderSkeleton()
              ) : searchResults.length === 0 ? (
                <div className="bg-white p-6 rounded-lg border border-sky-200 shadow-sm text-center">
                  <Info className="h-12 w-12 text-sky-400 mx-auto mb-2" />
                  <p className="text-sky-700 text-lg">தேடலுக்கு பொருத்தமான ஆவணங்கள் எதுவும் கிடைக்கவில்லை</p>
                  <p className="text-sky-600 mt-2">வேறு வடிகட்டிகளை முயற்சிக்கவும் அல்லது வடிகட்டிகளை அழிக்கவும்</p>
                </div>
              ) : (
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="mb-4">
                    <TabsTrigger value="results">முடிவுகள்</TabsTrigger>
                    <TabsTrigger value="summary">சுருக்கம்</TabsTrigger>
                  </TabsList>

                  <TabsContent value="results">
                    {viewMode === "list" ? (
                      <div className="space-y-4">
                        {filteredResults.map((document) => (
                          <Card key={document.id} className="border-sky-200">
                            <CardContent className="p-6">
                              <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                                <div className="flex-1">
                                  <h4 className="text-lg font-semibold text-sky-800">{document.document_name}</h4>
                                  <div className="flex flex-wrap gap-2 mt-1">
                                    <Badge variant="outline" className="bg-sky-50">
                                      {formatDateForDisplay(document.document_date)}
                                    </Badge>
                                    <Badge variant="outline" className="bg-sky-50">
                                      {formatCurrency(document.sale_amount)}
                                    </Badge>
                                    {document.document_types && (
                                      <Badge variant="outline" className="bg-sky-50">
                                        {document.document_types.name}
                                      </Badge>
                                    )}
                                  </div>

                                  <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                      <p className="text-sm font-medium text-sky-700">வாங்குபவர்கள்:</p>
                                      <ul className="text-sm">
                                        {document.buyers.map((buyer: any, index: number) => (
                                          <li key={index}>{buyer.name}</li>
                                        ))}
                                      </ul>
                                    </div>

                                    <div>
                                      <p className="text-sm font-medium text-sky-700">விற்பவர்கள்:</p>
                                      <ul className="text-sm">
                                        {document.sellers.map((seller: any, index: number) => (
                                          <li key={index}>{seller.name}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  </div>

                                  {document.properties && document.properties.length > 0 && (
                                    <div className="mt-2">
                                      <p className="text-sm font-medium text-sky-700">சொத்து விவரங்கள்:</p>
                                      <ul className="text-sm">
                                        {document.properties.map((property: any, index: number) => (
                                          <li key={index}>
                                            {property.property_name}
                                            {property.survey_number && ` (சர்வே எண்: ${property.survey_number})`}
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                </div>

                                <div className="flex flex-col gap-2 w-full md:w-auto">
                                  <div className="flex gap-2">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="border-sky-300 text-sky-700 hover:bg-sky-100"
                                      onClick={() => handleDownload(document.id, document.document_name, "html")}
                                      disabled={isDownloading === document.id}
                                    >
                                      <Download className="h-4 w-4 mr-1" />
                                      HTML
                                    </Button>

                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="border-sky-300 text-sky-700 hover:bg-sky-100"
                                      onClick={() => handleDownload(document.id, document.document_name, "docx")}
                                      disabled={isDownloading === document.id}
                                    >
                                      <FileText className="h-4 w-4 mr-1" />
                                      DOCX
                                    </Button>

                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="border-sky-300 text-sky-700 hover:bg-sky-100"
                                      onClick={() => handleDownload(document.id, document.document_name, "pdf")}
                                      disabled={isDownloading === document.id}
                                    >
                                      <FileDown className="h-4 w-4 mr-1" />
                                      PDF
                                    </Button>
                                  </div>

                                  <div className="flex gap-2">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="border-sky-300 text-sky-700 hover:bg-sky-100"
                                      asChild
                                    >
                                      <Link href={`/document-details/sale-document/view/${document.id}`}>
                                        <Eye className="h-4 w-4 mr-1" />
                                        காண்
                                      </Link>
                                    </Button>

                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="border-sky-300 text-sky-700 hover:bg-sky-100"
                                      asChild
                                    >
                                      <Link href={`/document-details/sale-document/edit/${document.id}`}>
                                        <Pencil className="h-4 w-4 mr-1" />
                                        திருத்து
                                      </Link>
                                    </Button>

                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="border-red-300 text-red-700 hover:bg-red-50"
                                      onClick={() => setDocumentToDelete(document.id)}
                                    >
                                      <Trash2 className="h-4 w-4 mr-1" />
                                      நீக்கு
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredResults.map((document) => (
                          <Card key={document.id} className="border-sky-200">
                            <CardContent className="p-4">
                              <h4 className="text-md font-semibold text-sky-800 truncate">{document.document_name}</h4>
                              <div className="flex flex-wrap gap-1 mt-1">
                                <Badge variant="outline" className="bg-sky-50 text-xs">
                                  {formatDateForDisplay(document.document_date)}
                                </Badge>
                                <Badge variant="outline" className="bg-sky-50 text-xs">
                                  {formatCurrency(document.sale_amount)}
                                </Badge>
                              </div>

                              <div className="mt-2 text-xs">
                                <p className="font-medium text-sky-700">வாங்குபவர்கள்:</p>
                                <p className="truncate">{document.buyers.map((b: any) => b.name).join(", ")}</p>
                              </div>

                              <div className="mt-1 text-xs">
                                <p className="font-medium text-sky-700">விற்பவர்கள்:</p>
                                <p className="truncate">{document.sellers.map((s: any) => s.name).join(", ")}</p>
                              </div>

                              <div className="flex justify-between mt-3">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button size="sm" variant="outline" className="text-xs h-8">
                                      <Download className="h-3 w-3 mr-1" />
                                      பதிவிறக்கு
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent>
                                    <DropdownMenuItem
                                      onClick={() => handleDownload(document.id, document.document_name, "html")}
                                    >
                                      HTML
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => handleDownload(document.id, document.document_name, "docx")}
                                    >
                                      DOCX
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => handleDownload(document.id, document.document_name, "pdf")}
                                    >
                                      PDF
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>

                                <div className="flex gap-1">
                                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0" asChild>
                                    <Link href={`/document-details/sale-document/view/${document.id}`}>
                                      <Eye className="h-4 w-4" />
                                    </Link>
                                  </Button>
                                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0" asChild>
                                    <Link href={`/document-details/sale-document/edit/${document.id}`}>
                                      <Pencil className="h-4 w-4" />
                                    </Link>
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                    onClick={() => setDocumentToDelete(document.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}

                    {/* Pagination */}
                    {searchResults.length > 0 && (
                      <div className="mt-6">
                        <Pagination>
                          <PaginationContent>
                            <PaginationItem>
                              <PaginationPrevious
                                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                              />
                            </PaginationItem>

                            {generatePaginationItems()}

                            <PaginationItem>
                              <PaginationNext
                                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                                disabled={currentPage === totalPages}
                              />
                            </PaginationItem>
                          </PaginationContent>
                        </Pagination>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="summary">
                    <Card className="border-sky-200">
                      <CardContent className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          <div>
                            <h4 className="text-lg font-semibold text-sky-800 mb-2">ஆவண விவரங்கள்</h4>
                            <div className="space-y-2">
                              <div>
                                <p className="text-sm font-medium text-sky-700">மொத்த ஆவணங்கள்:</p>
                                <p className="text-lg font-bold">{searchResults.length}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-sky-700">மொத்த விற்பனை தொகை:</p>
                                <p className="text-lg font-bold">
                                  {formatCurrency(
                                    searchResults.reduce((sum, doc) => sum + Number(doc.sale_amount || 0), 0),
                                  )}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-sky-700">சரா��ரி விற்பனை தொகை:</p>
                                <p className="text-lg font-bold">
                                  {searchResults.length > 0
                                    ? formatCurrency(
                                        searchResults.reduce((sum, doc) => sum + Number(doc.sale_amount || 0), 0) /
                                          searchResults.length,
                                      )
                                    : "₹0"}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h4 className="text-lg font-semibold text-sky-800 mb-2">ஆவண வகைகள்</h4>
                            <div className="space-y-1">
                              {Array.from(new Set(searchResults.map((doc) => doc.document_types?.name || "அறியப்படாதது")))
                                .map((typeName) => ({
                                  name: typeName,
                                  count: searchResults.filter(
                                    (doc) => (doc.document_types?.name || "அறியப்படாதது") === typeName,
                                  ).length,
                                }))
                                .sort((a, b) => b.count - a.count)
                                .map((type, index) => (
                                  <div key={index} className="flex justify-between items-center">
                                    <span className="text-sm">{type.name}</span>
                                    <Badge variant="outline" className="bg-sky-50">
                                      {type.count}
                                    </Badge>
                                  </div>
                                ))}
                            </div>
                          </div>

                          <div>
                            <h4 className="text-lg font-semibold text-sky-800 mb-2">சார்பதிவாளர் அலுவலகங்கள்</h4>
                            <div className="space-y-1">
                              {Array.from(
                                new Set(searchResults.map((doc) => doc.sub_registrar_offices?.name || "அறியப்படாதது")),
                              )
                                .map((officeName) => ({
                                  name: officeName,
                                  count: searchResults.filter(
                                    (doc) => (doc.sub_registrar_offices?.name || "அறியப்படாதது") === officeName,
                                  ).length,
                                }))
                                .sort((a, b) => b.count - a.count)
                                .map((office, index) => (
                                  <div key={index} className="flex justify-between items-center">
                                    <span className="text-sm">{office.name}</span>
                                    <Badge variant="outline" className="bg-sky-50">
                                      {office.count}
                                    </Badge>
                                  </div>
                                ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              )}
            </div>
          )}
        </div>
      </main>

      <footer className="bg-sky-100 border-t border-sky-200 py-4 text-center text-sky-700">
        <p>© 2025 தமிழ் ஆவண மேலாண்மை. அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.</p>
      </footer>

      {/* Delete confirmation dialog */}
      <AlertDialog open={documentToDelete !== null} onOpenChange={(open) => !open && setDocumentToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>ஆவணத்தை நீக்க உறுதிசெய்</AlertDialogTitle>
            <AlertDialogDescription>
              இந்த ஆவணத்தை நீக்க விரும்புகிறீர்களா? இந்த செயல்பாட்டை திரும்ப பெற முடியாது.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>ரத்து செய்</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "நீக்குகிறது..." : "நீக்கு"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
