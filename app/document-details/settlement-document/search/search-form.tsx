"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { searchSettlementDocuments } from "./search-documents-action"
import { ResultsTable } from "./results-table"
import { DatePicker } from "@/components/ui/date-picker"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { format } from "date-fns"

interface SearchSettlementDocumentFormProps {
  subRegistrarOffices: any[]
}

export function SearchSettlementDocumentForm({ subRegistrarOffices }: SearchSettlementDocumentFormProps) {
  const [searchParams, setSearchParams] = useState({
    documentName: "",
    recipientName: "",
    donorName: "",
    documentNumber: "",
    subRegistrarOfficeId: "",
    fromDate: null as Date | null,
    toDate: null as Date | null,
    propertyDescription: "",
    advancedSearch: false,
  })
  const [results, setResults] = useState<any[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setSearchParams((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setSearchParams((prev) => ({ ...prev, [name]: value }))
  }

  const handleDateChange = (name: string, date: Date | null) => {
    setSearchParams((prev) => ({ ...prev, [name]: date }))
  }

  const handleCheckboxChange = (checked: boolean) => {
    setShowAdvanced(checked)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Convert dates to string format if they exist
      const formattedParams = {
        ...searchParams,
        fromDate: searchParams.fromDate ? format(searchParams.fromDate, "yyyy-MM-dd") : undefined,
        toDate: searchParams.toDate ? format(searchParams.toDate, "yyyy-MM-dd") : undefined,
      }

      const results = await searchSettlementDocuments(formattedParams)
      setResults(results)
    } catch (error) {
      console.error("Search error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setSearchParams({
      documentName: "",
      recipientName: "",
      donorName: "",
      documentNumber: "",
      subRegistrarOfficeId: "",
      fromDate: null,
      toDate: null,
      propertyDescription: "",
      advancedSearch: false,
    })
    setResults(null)
    setShowAdvanced(false)
  }

  return (
    <div className="space-y-6">
      <Card className="border-amber-200">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="documentName">ஆவண பெயர்</Label>
                <Input
                  id="documentName"
                  name="documentName"
                  placeholder="ஆவண பெயரை உள்ளிடவும்"
                  value={searchParams.documentName}
                  onChange={handleInputChange}
                  className="border-amber-200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="recipientName">பெறுபவரின் பெயர்</Label>
                <Input
                  id="recipientName"
                  name="recipientName"
                  placeholder="பெறுபவரின் பெயரை உள்ளிடவும்"
                  value={searchParams.recipientName}
                  onChange={handleInputChange}
                  className="border-amber-200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="donorName">கொடுப்பவரின் பெயர்</Label>
                <Input
                  id="donorName"
                  name="donorName"
                  placeholder="கொடுப்பவரின் ��ெயரை உள்ளிடவும்"
                  value={searchParams.donorName}
                  onChange={handleInputChange}
                  className="border-amber-200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="documentNumber">ஆவண எண்</Label>
                <Input
                  id="documentNumber"
                  name="documentNumber"
                  placeholder="ஆவண எண்ணை உள்ளிடவும்"
                  value={searchParams.documentNumber}
                  onChange={handleInputChange}
                  className="border-amber-200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subRegistrarOfficeId">சார்பதிவாளர் அலுவலகம்</Label>
                <Select
                  value={searchParams.subRegistrarOfficeId}
                  onValueChange={(value) => handleSelectChange("subRegistrarOfficeId", value)}
                >
                  <SelectTrigger className="border-amber-200">
                    <SelectValue placeholder="அலுவலகத்தைத் தேர்ந்தெடுக்கவும்" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">அனைத்தும்</SelectItem>
                    {subRegistrarOffices.map((office) => (
                      <SelectItem key={office.id} value={office.id}>
                        {office.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2 pt-6">
                <Checkbox id="advancedSearch" checked={showAdvanced} onCheckedChange={handleCheckboxChange} />
                <label
                  htmlFor="advancedSearch"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  மேம்பட்ட தேடல் விருப்பங்களைக் காட்டு
                </label>
              </div>
            </div>

            {showAdvanced && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-amber-200 pt-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="fromDate">தேதியிலிருந்து</Label>
                  <DatePicker
                    id="fromDate"
                    selectedDate={searchParams.fromDate}
                    onSelect={(date) => handleDateChange("fromDate", date)}
                    className="border-amber-200"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="toDate">தேதி வரை</Label>
                  <DatePicker
                    id="toDate"
                    selectedDate={searchParams.toDate}
                    onSelect={(date) => handleDateChange("toDate", date)}
                    className="border-amber-200"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="propertyDescription">சொத்து விவரம்</Label>
                  <Input
                    id="propertyDescription"
                    name="propertyDescription"
                    placeholder="சொத்து விவரத்தில் தேட"
                    value={searchParams.propertyDescription}
                    onChange={handleInputChange}
                    className="border-amber-200"
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                className="border-amber-300 text-amber-700 hover:bg-amber-100"
              >
                அழி
              </Button>
              <Button type="submit" disabled={loading} className="bg-amber-600 hover:bg-amber-700 text-white">
                {loading ? "தேடுகிறது..." : "தேடு"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {results !== null && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4 text-amber-800">தேடல் முடிவுகள்</h2>
          <ResultsTable results={results} />
        </div>
      )}
    </div>
  )
}
