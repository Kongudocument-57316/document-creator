"use client"

import type React from "react"

import { useState } from "react"
import { Header } from "@/components/header"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Home, Plus, Search, RefreshCw, FileText, Pencil, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { searchMortgageLoanReceipts } from "./search-receipts-action"

export default function SearchMortgageLoanReceiptPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [searchParams, setSearchParams] = useState({
    receiptNumber: "",
    mortgageLoanDocumentNumber: "",
    payerName: "",
    receiverName: "",
    fromDate: "",
    toDate: "",
  })

  const [receipts, setReceipts] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  // Handle search form changes
  const handleChange = (field: string, value: string) => {
    setSearchParams((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // Handle search form submission
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await searchMortgageLoanReceipts(searchParams)

      if (result.success) {
        setReceipts(result.data || [])
        toast({
          title: "தேடல் முடிந்தது",
          description: `${result.data?.length || 0} ரசீதுகள் கண்டுபிடிக்கப்பட்டன`,
        })
      } else {
        toast({
          title: "தேடலில் பிழை",
          description: result.error || "ரசீதுகளைத் தேட முடியவில்லை. மீண்டும் முயற்சிக்கவும்.",
          variant: "destructive",
        })
        setReceipts([])
      }
    } catch (error) {
      console.error("Error searching receipts:", error)
      toast({
        title: "தேடலில் பிழை",
        description: "ரசீதுகளைத் தேட முடியவில்லை. மீண்டும் முயற்சிக்கவும்.",
        variant: "destructive",
      })
      setReceipts([])
    } finally {
      setLoading(false)
    }
  }

  // Handle form reset
  const handleReset = () => {
    setSearchParams({
      receiptNumber: "",
      mortgageLoanDocumentNumber: "",
      payerName: "",
      receiverName: "",
      fromDate: "",
      toDate: "",
    })
    setReceipts([])
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    return dateString
  }

  return (
    <div className="flex min-h-screen flex-col bg-blue-50">
      <Header />
      <main className="flex-1 p-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-blue-800">அடமான கடன் ரசீது ஆவணங்கள் தேடுதல்</h1>
            <div className="flex gap-2">
              <Button variant="outline" className="bg-white hover:bg-blue-100" onClick={() => router.back()}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                திரும்பிச் செல்
              </Button>
              <Button variant="outline" className="bg-white hover:bg-blue-100" onClick={() => router.push("/")}>
                <Home className="mr-2 h-4 w-4" />
                முகப்பு
              </Button>
            </div>
          </div>

          <Card className="border-blue-100 shadow-sm mb-6">
            <CardContent className="pt-6">
              <form onSubmit={handleSearch}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="receiptNumber">ரசீது எண்</Label>
                    <Input
                      id="receiptNumber"
                      value={searchParams.receiptNumber}
                      onChange={(e) => handleChange("receiptNumber", e.target.value)}
                      placeholder="MLR-YYYY-XXXXX"
                      className="border-blue-200 focus:border-blue-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mortgageLoanDocumentNumber">அடமான கடன் ஆவண எண்</Label>
                    <Input
                      id="mortgageLoanDocumentNumber"
                      value={searchParams.mortgageLoanDocumentNumber}
                      onChange={(e) => handleChange("mortgageLoanDocumentNumber", e.target.value)}
                      placeholder="ML-YYYY-XXXXX"
                      className="border-blue-200 focus:border-blue-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="payerName">பணம் செலுத்துபவர் பெயர்</Label>
                    <Input
                      id="payerName"
                      value={searchParams.payerName}
                      onChange={(e) => handleChange("payerName", e.target.value)}
                      placeholder="பெயர்"
                      className="border-blue-200 focus:border-blue-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="receiverName">பணம் பெறுபவர் பெயர்</Label>
                    <Input
                      id="receiverName"
                      value={searchParams.receiverName}
                      onChange={(e) => handleChange("receiverName", e.target.value)}
                      placeholder="பெயர்"
                      className="border-blue-200 focus:border-blue-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fromDate">தேதி முதல்</Label>
                    <Input
                      id="fromDate"
                      type="text"
                      placeholder="DD/MM/YYYY"
                      value={searchParams.fromDate}
                      onChange={(e) => handleChange("fromDate", e.target.value)}
                      className="border-blue-200 focus:border-blue-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="toDate">தேதி வரை</Label>
                    <Input
                      id="toDate"
                      type="text"
                      placeholder="DD/MM/YYYY"
                      value={searchParams.toDate}
                      onChange={(e) => handleChange("toDate", e.target.value)}
                      className="border-blue-200 focus:border-blue-400"
                    />
                  </div>
                </div>

                <div className="flex justify-between mt-6">
                  <div className="flex gap-2">
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
                      <Search className="h-4 w-4" />
                      தேடு
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleReset}
                      className="border-blue-200 hover:bg-blue-100 text-blue-700 flex items-center gap-2"
                    >
                      <RefreshCw className="h-4 w-4" />
                      மீட்டமை
                    </Button>
                  </div>

                  <Button
                    type="button"
                    className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
                    onClick={() => router.push("/document-details/mortgage-loan/receipt/create")}
                  >
                    <Plus className="h-4 w-4" />
                    புதிய ரசீது
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className="border-blue-100 shadow-sm">
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold text-blue-700 mb-4">தேடல் முடிவுகள்</h2>

              {loading ? (
                <div className="flex justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
                </div>
              ) : receipts.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ரசீது எண்</TableHead>
                        <TableHead>தேதி</TableHead>
                        <TableHead>அடமான கடன் ஆவண எண்</TableHead>
                        <TableHead>பணம் செலுத்துபவர்</TableHead>
                        <TableHead>பணம் பெறுபவர்</TableHead>
                        <TableHead>தொகை</TableHead>
                        <TableHead>செயல்கள்</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {receipts.map((receipt) => (
                        <TableRow key={receipt.id}>
                          <TableCell>{receipt.receipt_number}</TableCell>
                          <TableCell>{formatDate(receipt.receipt_date)}</TableCell>
                          <TableCell>{receipt.mortgage_loan_documents?.document_number || "இல்லை"}</TableCell>
                          <TableCell>{receipt.payer_name}</TableCell>
                          <TableCell>{receipt.receiver_name}</TableCell>
                          <TableCell>₹{receipt.amount_paid}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() =>
                                  router.push(`/document-details/mortgage-loan/receipt/view/${receipt.id}`)
                                }
                              >
                                <FileText className="h-4 w-4" />
                                <span className="sr-only">காண்</span>
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() =>
                                  router.push(`/document-details/mortgage-loan/receipt/edit/${receipt.id}`)
                                }
                              >
                                <Pencil className="h-4 w-4" />
                                <span className="sr-only">திருத்து</span>
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-red-500"
                                onClick={() => {
                                  // Handle delete action
                                  toast({
                                    title: "நீக்க முடியவில்லை",
                                    description: "இந்த செயல்பாடு தற்போது செயல்படுத்தப்படவில்லை.",
                                    variant: "destructive",
                                  })
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">நீக்கு</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>தேடல் முடிவுகள் எதுவும் இல்லை. வேறு தேடல் அளவுருக்களை முயற்சிக்கவும்.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <footer className="bg-blue-100 border-t border-blue-200 py-4 text-center text-blue-600">
        <p>© 2025 தமிழ் ஆவண மேலாண்மை. அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.</p>
      </footer>
    </div>
  )
}
