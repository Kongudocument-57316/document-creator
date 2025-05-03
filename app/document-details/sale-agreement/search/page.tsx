import { Suspense } from "react"
import { SearchForm } from "./search-form"
import { ResultsTable } from "./results-table"
import { searchAgreements } from "./search-agreements-action"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, Home, ArrowLeft, AlertCircle } from "lucide-react"
import Link from "next/link"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface SearchPageProps {
  searchParams: {
    documentName?: string
    documentNumber?: string
    documentYear?: string
    fromDate?: string
    toDate?: string
    subRegistrarOfficeId?: string
    buyerName?: string
    sellerName?: string
    page?: string
    pageSize?: string
  }
}

export default async function Page({ searchParams }: SearchPageProps) {
  // Default to page 1 if not specified
  const page = searchParams.page ? Number.parseInt(searchParams.page) : 1
  const pageSize = searchParams.pageSize ? Number.parseInt(searchParams.pageSize) : 10

  // Only search if at least one parameter is provided
  const hasSearchParams = Object.values(searchParams).some((param) => param !== undefined && param !== "")

  let searchResults = { agreements: [], count: 0, error: null }

  if (hasSearchParams) {
    try {
      searchResults = await searchAgreements({
        documentName: searchParams.documentName,
        documentNumber: searchParams.documentNumber,
        documentYear: searchParams.documentYear,
        fromDate: searchParams.fromDate,
        toDate: searchParams.toDate,
        subRegistrarOfficeId: searchParams.subRegistrarOfficeId
          ? Number.parseInt(searchParams.subRegistrarOfficeId)
          : undefined,
        buyerName: searchParams.buyerName,
        sellerName: searchParams.sellerName,
        page,
        pageSize,
      })
    } catch (error) {
      console.error("Error searching agreements:", error)
      searchResults.error = error instanceof Error ? error.message : "Unknown error occurred"
    }
  }

  return (
    <div className="container mx-auto py-6 space-y-6 bg-blue-50">
      {/* Navigation buttons */}
      <div className="flex items-center justify-between mb-4 bg-white p-3 rounded-lg shadow-sm">
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/document-details/sale-agreement">
              <ArrowLeft className="mr-2 h-4 w-4" />
              திரும்பிச் செல்
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              முகப்பு
            </Link>
          </Button>
        </div>
      </div>

      <h1 className="text-3xl font-bold">கிரைய உடன்படிக்கை ஆவணங்கள் தேடுதல்</h1>

      <SearchForm />

      {hasSearchParams && (
        <Suspense
          fallback={
            <Card className="bg-white border-blue-100">
              <CardHeader>
                <CardTitle>தேடல் முடிவுகள்</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2">தேடுகிறது...</span>
              </CardContent>
            </Card>
          }
        >
          <Card className="bg-white border-blue-100">
            <CardHeader>
              <CardTitle>தேடல் முடிவுகள் - {searchResults.count} ஆவணங்கள் கண்டறியப்பட்டன</CardTitle>
            </CardHeader>
            <CardContent>
              {searchResults.error ? (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>தேடலில் பிழை ஏற்பட்டது</AlertTitle>
                  <AlertDescription>
                    {searchResults.error}
                    {searchResults.error.includes("does not exist") && (
                      <div className="mt-2">
                        <p>தரவுத்தளத்தில் தேவையான அட்டவணைகள் இல்லை. முதலில் சில ஆவணங்களை உருவாக்கவும்.</p>
                        <Button className="mt-2" asChild>
                          <Link href="/document-details/sale-agreement/create">புதிய கிரைய உடன்படிக்கை உருவாக்கு</Link>
                        </Button>
                      </div>
                    )}
                  </AlertDescription>
                </Alert>
              ) : searchResults.agreements.length === 0 ? (
                <div className="text-center p-8 border rounded-md bg-muted/20">
                  <p className="text-muted-foreground">தேடல் முடிவுகள் எதுவும் இல்லை</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    வேறு தேடல் அளவுருக்களை முயற்சிக்கவும் அல்லது புதிய ஆவணத்தை உருவாக்கவும்
                  </p>
                  <Button className="mt-4" asChild>
                    <Link href="/document-details/sale-agreement/create">புதிய கிரைய உடன்படிக்கை உருவாக்கு</Link>
                  </Button>
                </div>
              ) : (
                <>
                  <ResultsTable
                    results={searchResults.agreements}
                    onRefresh={async () => {
                      "use server"
                      // This is a placeholder for server-side refresh
                      // The actual refresh happens when the page reloads
                    }}
                  />

                  {searchResults.count > pageSize && (
                    <div className="flex justify-center mt-4">
                      <Pagination
                        totalItems={searchResults.count}
                        currentPage={page}
                        pageSize={pageSize}
                        searchParams={searchParams}
                      />
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </Suspense>
      )}
    </div>
  )
}

function Pagination({
  totalItems,
  currentPage,
  pageSize,
  searchParams,
}: {
  totalItems: number
  currentPage: number
  pageSize: number
  searchParams: Record<string, string | undefined>
}) {
  const totalPages = Math.ceil(totalItems / pageSize)

  // Create a new URLSearchParams object without the page parameter
  const createPageUrl = (page: number) => {
    const params = new URLSearchParams()

    // Add all existing search params except page
    Object.entries(searchParams).forEach(([key, value]) => {
      if (key !== "page" && value) {
        params.set(key, value)
      }
    })

    // Add the new page parameter
    params.set("page", page.toString())

    return `?${params.toString()}`
  }

  return (
    <div className="flex items-center space-x-2">
      {currentPage > 1 && (
        <a href={createPageUrl(currentPage - 1)} className="px-3 py-1 border rounded hover:bg-gray-100">
          முந்தைய
        </a>
      )}

      <span className="px-3 py-1">
        பக்கம் {currentPage} / {totalPages}
      </span>

      {currentPage < totalPages && (
        <a href={createPageUrl(currentPage + 1)} className="px-3 py-1 border rounded hover:bg-gray-100">
          அடுத்த
        </a>
      )}
    </div>
  )
}
