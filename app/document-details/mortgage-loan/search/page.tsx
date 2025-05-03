"use client"

import { useState, useEffect } from "react"
import { SearchForm } from "./search-form"
import { ResultsTable } from "./results-table"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Home, Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export default function SearchMortgageLoanPage() {
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const searchDocuments = async (searchParams: any) => {
    setLoading(true)
    try {
      // Build query string from search params
      const queryParams = new URLSearchParams()

      if (searchParams.documentNumber) {
        queryParams.append("documentNumber", searchParams.documentNumber)
      }

      if (searchParams.buyerName) {
        queryParams.append("buyerName", searchParams.buyerName)
      }

      if (searchParams.sellerName) {
        queryParams.append("sellerName", searchParams.sellerName)
      }

      if (searchParams.fromDate) {
        queryParams.append("fromDate", searchParams.fromDate)
      }

      if (searchParams.toDate) {
        queryParams.append("toDate", searchParams.toDate)
      }

      const response = await fetch(`/api/mortgage-loan-documents?${queryParams.toString()}`)

      if (!response.ok) {
        throw new Error("ஆவணங்களை பெறுவதில் பிழை")
      }

      const data = await response.json()
      setDocuments(data)
    } catch (error: any) {
      console.error("Search error:", error)
      toast({
        title: "தேடலில் பிழை",
        description: error.message || "ஆவணங்களை தேடுவதில் பிழை ஏற்பட்டது",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Load all documents on initial page load
  useEffect(() => {
    searchDocuments({})
  }, [])

  const handleCreateNew = () => {
    router.push("/document-details/mortgage-loan/create")
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
            className="flex items-center gap-1 border-cyan-200 hover:bg-cyan-50 text-cyan-700"
          >
            <ArrowLeft className="h-4 w-4" />
            திரும்பிச் செல்
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/")}
            className="flex items-center gap-1 border-cyan-200 hover:bg-cyan-50 text-cyan-700"
          >
            <Home className="h-4 w-4" />
            முகப்பு
          </Button>
        </div>
        <h1 className="text-2xl font-bold text-cyan-800 border-b-2 border-cyan-200 pb-1">அடமான கடன் ஆவணங்கள் தேடல்</h1>
        <Button onClick={handleCreateNew} className="bg-emerald-600 hover:bg-emerald-700 flex items-center gap-2">
          <Plus className="h-4 w-4" />
          புதிய ஆவணம்
        </Button>
      </div>

      <div className="space-y-6 bg-gradient-to-b from-cyan-50/50 to-white p-6 rounded-lg shadow-sm">
        <SearchForm onSearch={searchDocuments} />

        {loading ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-700"></div>
          </div>
        ) : (
          <ResultsTable documents={documents} onRefresh={() => searchDocuments({})} />
        )}
      </div>
    </div>
  )
}
