"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CreateSettlementDocumentForm } from "./create-settlement-document-form"
import { Home, ArrowLeft } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

function FormSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-8 w-64 bg-gray-200 rounded animate-pulse" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="h-10 bg-gray-200 rounded animate-pulse" />
        <div className="h-10 bg-gray-200 rounded animate-pulse" />
      </div>
      <div className="h-10 bg-gray-200 rounded animate-pulse" />
      <div className="h-32 bg-gray-200 rounded animate-pulse" />
      <div className="h-10 bg-gray-200 rounded animate-pulse" />
      <div className="h-32 bg-gray-200 rounded animate-pulse" />
      <div className="h-10 bg-gray-200 rounded animate-pulse" />
    </div>
  )
}

export default function CreateSettlementDocumentPageClient() {
  const [isLoading, setIsLoading] = useState(true)
  const [formData, setFormData] = useState(null)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true)
        setError(null)

        // Helper function to safely fetch and parse JSON
        async function safelyFetchJson(url: string, errorMessage: string) {
          try {
            const response = await fetch(url)

            // Check if response is ok
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`)
            }

            // Check if response is empty
            const text = await response.text()
            if (!text || text.trim() === "") {
              console.log(`Empty response from ${url}`)
              return []
            }

            // Try to parse JSON
            try {
              return JSON.parse(text)
            } catch (parseError) {
              console.error(`Error parsing JSON from ${url}:`, parseError)
              console.error(`Response text:`, text)
              throw new Error(`Invalid JSON response from ${url}`)
            }
          } catch (fetchError) {
            console.error(`${errorMessage}:`, fetchError)
            // Return empty array instead of throwing to allow other data to load
            return []
          }
        }

        // Fetch all required data with safe parsing
        const [
          parties,
          witnesses,
          users,
          documentTypes,
          submissionTypes,
          subRegistrarOffices,
          bookNumbers,
          typists,
          typistOffices,
        ] = await Promise.all([
          safelyFetchJson("/api/parties", "Failed to fetch parties"),
          safelyFetchJson("/api/witnesses", "Failed to fetch witnesses"),
          safelyFetchJson("/api/users", "Failed to fetch users"),
          safelyFetchJson("/api/document-types", "Failed to fetch document types"),
          safelyFetchJson("/api/submission-types", "Failed to fetch submission types"),
          safelyFetchJson("/api/sub-registrar-offices", "Failed to fetch sub-registrar offices"),
          safelyFetchJson("/api/book-numbers", "Failed to fetch book numbers"),
          safelyFetchJson("/api/typists", "Failed to fetch typists"),
          safelyFetchJson("/api/typist-offices", "Failed to fetch typist offices"),
        ])

        // Get default values from localStorage or use empty strings
        let defaultRegistrationOffice = ""
        let defaultBookNumber = ""
        let defaultTypist = ""
        let defaultTypistOffice = ""

        try {
          const savedDefaults = localStorage.getItem("settlementDocumentDefaults")
          if (savedDefaults) {
            const defaults = JSON.parse(savedDefaults)
            defaultRegistrationOffice = defaults.defaultRegistrationOffice || ""
            defaultBookNumber = defaults.defaultBookNumber || ""
            defaultTypist = defaults.defaultTypist || ""
            defaultTypistOffice = defaults.defaultTypistOffice || ""
          }
        } catch (e) {
          console.error("Error loading defaults from localStorage:", e)
        }

        // Set form data
        setFormData({
          parties: parties || [],
          witnesses: witnesses || [],
          users: users || [],
          documentTypes: documentTypes || [],
          submissionTypes: submissionTypes || [],
          subRegistrarOffices: subRegistrarOffices || [],
          bookNumbers: bookNumbers || [],
          typists: typists || [],
          typistOffices: typistOffices || [],
          defaultValues: {
            defaultRegistrationOffice,
            defaultBookNumber,
            defaultTypist,
            defaultTypistOffice,
          },
        })

        console.log("Data loaded successfully:", {
          parties: parties?.length || 0,
          witnesses: witnesses?.length || 0,
          users: users?.length || 0,
          typists: typists?.length || 0,
          typistOffices: typistOffices?.length || 0,
        })
      } catch (err) {
        console.error("Error fetching data:", err)
        setError(err.message || "Failed to load data")
        toast({
          title: "தரவு ஏற்றுவதில் பிழை",
          description: "தரவை ஏற்றுவதில் பிழை ஏற்பட்டது. தயவுசெய்து பக்கத்தை மீண்டும் ஏற்றவும்.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [toast])

  return (
    <div className="flex min-h-screen flex-col bg-amber-50">
      <Header className="bg-amber-100 border-amber-200" />
      <main className="flex-1 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Link href="/document-details/settlement-document">
                <Button
                  variant="outline"
                  size="icon"
                  className="border-amber-300 text-amber-700 hover:bg-amber-100"
                  aria-label="Back"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/">
                <Button
                  variant="outline"
                  size="icon"
                  className="border-amber-300 text-amber-700 hover:bg-amber-100"
                  aria-label="Home"
                >
                  <Home className="h-4 w-4" />
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-amber-800 ml-2">புதிய தானசெட்டில்மெண்ட் ஆவணம் உருவாக்கு</h1>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500 mx-auto"></div>
                <p className="mt-4 text-amber-700">தரவு ஏற்றப்படுகிறது...</p>
              </div>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md">
              <h3 className="text-red-700 font-medium">தரவு ஏற்றுவதில் பிழை ஏற்பட்டது</h3>
              <p className="text-red-600">{error}</p>
              <Button onClick={() => window.location.reload()} className="mt-4" variant="outline">
                பக்கத்தை மீண்டும் ஏற்று
              </Button>
            </div>
          ) : formData ? (
            <CreateSettlementDocumentForm
              parties={formData.parties}
              witnesses={formData.witnesses}
              users={formData.users}
              documentTypes={formData.documentTypes}
              submissionTypes={formData.submissionTypes}
              subRegistrarOffices={formData.subRegistrarOffices}
              bookNumbers={formData.bookNumbers}
              typists={formData.typists}
              typistOffices={formData.typistOffices}
              defaultValues={formData.defaultValues}
            />
          ) : (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
              <h3 className="text-yellow-700 font-medium">தரவு கிடைக்கவில்லை</h3>
              <p className="text-yellow-600">தரவு ஏற்றப்படவில்லை. தயவுசெய்து பக்கத்தை மீண்டும் ஏற்றவும்.</p>
              <Button onClick={() => window.location.reload()} className="mt-4" variant="outline">
                பக்கத்தை மீண்டும் ஏற்று
              </Button>
            </div>
          )}
        </div>
      </main>
      <footer className="bg-amber-100 border-t border-amber-200 py-4 text-center text-amber-700">
        <p>© 2025 தமிழ் ஆவண மேலாண்மை. அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.</p>
      </footer>
    </div>
  )
}
