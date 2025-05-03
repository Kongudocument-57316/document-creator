"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Search, Loader2 } from "lucide-react"
import { searchPartitionReleaseDocuments } from "./search-documents-action"
import { ResultsTable } from "./results-table"
import { useToast } from "@/hooks/use-toast"

export function SearchForm() {
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [hasSearched, setHasSearched] = useState(false)
  const { toast } = useToast()

  const handleSearch = async (formData: FormData) => {
    setIsSearching(true)
    try {
      const result = await searchPartitionReleaseDocuments(formData)

      if (result.success) {
        setSearchResults(result.data)
      } else {
        toast({
          title: "தேடலில் பிழை",
          description: result.message,
          variant: "destructive",
        })
        setSearchResults([])
      }

      setHasSearched(true)
    } catch (error) {
      toast({
        title: "தேடலில் பிழை",
        description: "ஆவணங்களைத் தேடுவதில் பிழை ஏற்பட்டது",
        variant: "destructive",
      })
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const refreshResults = async () => {
    const formData = new FormData(document.querySelector("form") as HTMLFormElement)
    await handleSearch(formData)
  }

  return (
    <div className="space-y-6">
      <Card className="p-6 border-cyan-200 shadow-md bg-gradient-to-r from-cyan-50 to-white">
        <form action={handleSearch} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="documentNumber" className="text-cyan-800">
                ஆவண எண்
              </Label>
              <Input
                type="text"
                id="documentNumber"
                name="documentNumber"
                className="border-cyan-300 focus-visible:ring-cyan-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="documentDate" className="text-cyan-800">
                ஆவண தேதி
              </Label>
              <Input
                type="date"
                id="documentDate"
                name="documentDate"
                className="border-cyan-300 focus-visible:ring-cyan-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="partyName" className="text-cyan-800">
                கட்சி பெயர்
              </Label>
              <Input
                type="text"
                id="partyName"
                name="partyName"
                className="border-cyan-300 focus-visible:ring-cyan-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="propertyDetails" className="text-cyan-800">
                சொத்து விவரங்கள்
              </Label>
              <Input
                type="text"
                id="propertyDetails"
                name="propertyDetails"
                className="border-cyan-300 focus-visible:ring-cyan-500"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" className="bg-cyan-600 hover:bg-cyan-700 text-white" disabled={isSearching}>
              {isSearching ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  தேடுகிறது...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  தேடு
                </>
              )}
            </Button>
          </div>
        </form>
      </Card>

      {hasSearched && (
        <div className="space-y-2">
          <h2 className="text-lg font-medium text-cyan-800">தேடல் முடிவுகள்</h2>
          <ResultsTable documents={searchResults} onRefresh={refreshResults} />
        </div>
      )}
    </div>
  )
}
