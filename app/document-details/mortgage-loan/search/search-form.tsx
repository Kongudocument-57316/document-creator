"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { Search, RefreshCw } from "lucide-react"

interface SearchFormProps {
  onSearch: (searchParams: any) => void
}

export function SearchForm({ onSearch }: SearchFormProps) {
  const { toast } = useToast()
  const router = useRouter()
  const [searchParams, setSearchParams] = useState({
    documentNumber: "",
    buyerName: "",
    sellerName: "",
    fromDate: "",
    toDate: "",
  })

  const handleChange = (field: string, value: string) => {
    setSearchParams((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(searchParams)
  }

  const handleReset = () => {
    setSearchParams({
      documentNumber: "",
      buyerName: "",
      sellerName: "",
      fromDate: "",
      toDate: "",
    })
    onSearch({})
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card className="border-cyan-100 bg-white shadow-sm">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="documentNumber" className="text-cyan-800">
                ஆவண எண்
              </Label>
              <Input
                id="documentNumber"
                value={searchParams.documentNumber}
                onChange={(e) => handleChange("documentNumber", e.target.value)}
                placeholder="ML-YYYY-XXXXX"
                className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="buyerName" className="text-cyan-800">
                அடமானம் பெறுபவர் பெயர்
              </Label>
              <Input
                id="buyerName"
                value={searchParams.buyerName}
                onChange={(e) => handleChange("buyerName", e.target.value)}
                placeholder="பெயரை உள்ளிடவும்"
                className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sellerName" className="text-cyan-800">
                அடமானம் கொடுப்பவர் பெயர்
              </Label>
              <Input
                id="sellerName"
                value={searchParams.sellerName}
                onChange={(e) => handleChange("sellerName", e.target.value)}
                placeholder="பெயரை உள்ளிடவும்"
                className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fromDate" className="text-cyan-800">
                தேதி முதல்
              </Label>
              <Input
                id="fromDate"
                type="date"
                value={searchParams.fromDate}
                onChange={(e) => handleChange("fromDate", e.target.value)}
                className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="toDate" className="text-cyan-800">
                தேதி வரை
              </Label>
              <Input
                id="toDate"
                type="date"
                value={searchParams.toDate}
                onChange={(e) => handleChange("toDate", e.target.value)}
                className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-400"
              />
            </div>
          </div>

          <div className="flex justify-between mt-6">
            <div className="flex gap-2">
              <Button type="submit" className="bg-cyan-600 hover:bg-cyan-700 flex items-center gap-2">
                <Search className="h-4 w-4" />
                தேடு
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                className="border-cyan-200 hover:bg-cyan-50 text-cyan-700 flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                மீட்டமை
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
