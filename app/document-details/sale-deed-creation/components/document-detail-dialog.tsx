"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getSupabaseBrowserClient } from "@/lib/supabase"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"

interface DocumentDetailDialogProps {
  isOpen: boolean
  onClose: () => void
  document: any
  onSave?: (updatedDoc: any) => void
  readOnly?: boolean
  title?: string
  sellers?: any[]
  allowSellerSelection?: boolean
}

export function DocumentDetailDialog({
  isOpen,
  onClose,
  document,
  onSave,
  readOnly = false,
  title = "ஆவண விவரங்கள்",
  sellers = [],
  allowSellerSelection = false,
}: DocumentDetailDialogProps) {
  const [formData, setFormData] = useState(document || {})
  const [subRegistrarOffices, setSubRegistrarOffices] = useState([])
  const [bookNumbers, setBookNumbers] = useState([])
  const [documentTypes, setDocumentTypes] = useState([])
  const [submissionTypes, setSubmissionTypes] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedSellers, setSelectedSellers] = useState<string[]>([])
  const [sellerSelectionMode, setSellerSelectionMode] = useState<"single" | "multiple">("single")

  const supabase = getSupabaseBrowserClient()

  useEffect(() => {
    if (isOpen) {
      setFormData(document || {})

      // Initialize selected sellers
      if (document && document.sellerIds) {
        setSelectedSellers(Array.isArray(document.sellerIds) ? document.sellerIds : [document.sellerIds])
      } else if (document && document.sellerId) {
        setSelectedSellers([document.sellerId])
      } else {
        setSelectedSellers([])
      }

      fetchReferenceData()
    }
  }, [isOpen, document])

  async function fetchReferenceData() {
    try {
      setLoading(true)

      // Fetch sub registrar offices
      const { data: officesData } = await supabase.from("sub_registrar_offices").select("id, name").order("name")
      if (officesData) setSubRegistrarOffices(officesData)

      // Fetch book numbers
      const { data: bookNumbersData } = await supabase.from("book_numbers").select("id, number").order("number")
      if (bookNumbersData) setBookNumbers(bookNumbersData)

      // Fetch document types
      const { data: documentTypesData } = await supabase.from("document_types").select("id, name").order("name")
      if (documentTypesData) setDocumentTypes(documentTypesData)

      // Fetch submission types
      const { data: submissionTypesData } = await supabase.from("submission_types").select("id, name").order("name")
      if (submissionTypesData) setSubmissionTypes(submissionTypesData)
    } catch (error) {
      console.error("Error fetching reference data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSellerSelectionModeChange = (mode: "single" | "multiple") => {
    setSellerSelectionMode(mode)
    if (mode === "single" && selectedSellers.length > 1) {
      // If switching to single mode and multiple sellers are selected, keep only the first one
      setSelectedSellers([selectedSellers[0]])
    }
  }

  const handleSellerSelection = (sellerId: string) => {
    if (sellerSelectionMode === "single") {
      setSelectedSellers([sellerId])
    } else {
      // For multiple selection mode
      if (selectedSellers.includes(sellerId)) {
        setSelectedSellers(selectedSellers.filter((id) => id !== sellerId))
      } else {
        setSelectedSellers([...selectedSellers, sellerId])
      }
    }
  }

  const handleSingleSellerChange = (sellerId: string) => {
    setSelectedSellers([sellerId])
  }

  const handleSave = () => {
    if (onSave) {
      // Include selected sellers in the form data
      const updatedData = {
        ...formData,
        sellerIds: selectedSellers,
        // For backward compatibility
        sellerId: selectedSellers.length > 0 ? selectedSellers[0] : null,
        sellerName: selectedSellers.length > 0 ? sellers.find((s) => s.id === selectedSellers[0])?.name : null,
      }
      onSave(updatedData)
    }
    onClose()
  }

  // Function to get name by ID from a reference list
  const getNameById = (list, id) => {
    const item = list.find((item) => item.id?.toString() === id?.toString())
    return item ? item.name : ""
  }

  // Function to get book number by ID
  const getBookNumberById = (id) => {
    const book = bookNumbers.find((book) => book.id?.toString() === id?.toString())
    return book ? book.number : ""
  }

  // Get seller names for display
  const getSellerNames = () => {
    if (!selectedSellers.length) return "-"
    return selectedSellers
      .map((id) => sellers.find((s) => s.id === id)?.name || "")
      .filter((name) => name)
      .join(", ")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-purple-800">{title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Seller Selection Section */}
          {allowSellerSelection && !readOnly && (
            <div className="space-y-4 border-b pb-4 mb-4">
              <div>
                <Label className="font-medium mb-2 block">விற்பனையாளர் தேர்வு முறை</Label>
                <div className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="single-seller-selection"
                      checked={sellerSelectionMode === "single"}
                      onCheckedChange={() => handleSellerSelectionModeChange("single")}
                    />
                    <Label htmlFor="single-seller-selection">ஒரு விற்பனையாளர்</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="multiple-seller-selection"
                      checked={sellerSelectionMode === "multiple"}
                      onCheckedChange={() => handleSellerSelectionModeChange("multiple")}
                    />
                    <Label htmlFor="multiple-seller-selection">பல விற்பனையாளர்கள்</Label>
                  </div>
                </div>
              </div>

              {sellerSelectionMode === "single" ? (
                <div>
                  <Label htmlFor="seller-select">விற்பனையாளரைத் தேர்ந்தெடுக்கவும்</Label>
                  <Select
                    value={selectedSellers.length > 0 ? selectedSellers[0] : ""}
                    onValueChange={handleSingleSellerChange}
                  >
                    <SelectTrigger className="mt-1 border-purple-200 focus-visible:ring-purple-400">
                      <SelectValue placeholder="விற்பனையாளரைத் தேர்ந்தெடுக்கவும்" />
                    </SelectTrigger>
                    <SelectContent>
                      {sellers.map((seller) => (
                        <SelectItem key={seller.id} value={seller.id}>
                          {seller.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <div>
                  <Label className="font-medium mb-2 block">விற்பனையாளர்களைத் தேர்ந்தெடுக்கவும்</Label>
                  <ScrollArea className="h-[150px] border rounded-md p-2">
                    <div className="space-y-2">
                      {sellers.map((seller) => (
                        <div key={seller.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`seller-${seller.id}`}
                            checked={selectedSellers.includes(seller.id)}
                            onCheckedChange={() => handleSellerSelection(seller.id)}
                          />
                          <Label htmlFor={`seller-${seller.id}`}>{seller.name}</Label>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              )}
            </div>
          )}

          {readOnly ? (
            // Read-only view
            <div className="space-y-4">
              {allowSellerSelection && (
                <div>
                  <Label className="font-medium">விற்பனையாளர்(கள்)</Label>
                  <p className="mt-1 p-2 bg-gray-50 rounded-md">{getSellerNames()}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="font-medium">முந்தைய ஆவண தேதி</Label>
                  <p className="mt-1 p-2 bg-gray-50 rounded-md">{formData.previousDocDate || "-"}</p>
                </div>
                <div>
                  <Label className="font-medium">சார்பதிவாளர் அலுவலகம்</Label>
                  <p className="mt-1 p-2 bg-gray-50 rounded-md">
                    {getNameById(subRegistrarOffices, formData.subRegistrarOfficeId) || "-"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="font-medium">புத்தகம் எண்</Label>
                  <p className="mt-1 p-2 bg-gray-50 rounded-md">{getBookNumberById(formData.bookNumberId) || "-"}</p>
                </div>
                <div>
                  <Label className="font-medium">ஆவண வருடம்</Label>
                  <p className="mt-1 p-2 bg-gray-50 rounded-md">{formData.documentYear || "-"}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="font-medium">ஆவண எண்</Label>
                  <p className="mt-1 p-2 bg-gray-50 rounded-md">{formData.documentNumber || "-"}</p>
                </div>
                <div>
                  <Label className="font-medium">ஆவண வகை</Label>
                  <p className="mt-1 p-2 bg-gray-50 rounded-md">
                    {getNameById(documentTypes, formData.documentTypeId) || "-"}
                  </p>
                </div>
              </div>

              <div>
                <Label className="font-medium">ஆவணம் ஒப்படைப்பு வகை</Label>
                <p className="mt-1 p-2 bg-gray-50 rounded-md">
                  {getNameById(submissionTypes, formData.submissionTypeId) || "-"}
                </p>
              </div>
            </div>
          ) : (
            // Editable form
            <div className="space-y-4">
              <div>
                <Label htmlFor="previous-doc-date">முந்தைய ஆவண தேதி (Previous Document Date)</Label>
                <Input
                  id="previous-doc-date"
                  placeholder="DD/MM/YYYY"
                  value={formData.previousDocDate || ""}
                  onChange={(e) => handleChange("previousDocDate", e.target.value)}
                  className="mt-1 border-purple-200 focus-visible:ring-purple-400"
                />
                <p className="text-xs text-gray-500 mt-1">தேதியை DD/MM/YYYY வடிவத்தில் உள்ளிடவும்</p>
              </div>

              <div>
                <Label htmlFor="sub-registrar-office">சார்பதிவாளர் அலுவலகம் (Sub Register Office)</Label>
                <Select
                  value={formData.subRegistrarOfficeId?.toString() || ""}
                  onValueChange={(value) => handleChange("subRegistrarOfficeId", value)}
                >
                  <SelectTrigger className="mt-1 border-purple-200 focus-visible:ring-purple-400">
                    <SelectValue placeholder="சார்பதிவாளர் அலுவலகத்தைத் தேர்ந்தெடுக்கவும்" />
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

              <div>
                <Label htmlFor="book-number">புத்தகம் எண் (Book No)</Label>
                <Select
                  value={formData.bookNumberId?.toString() || ""}
                  onValueChange={(value) => handleChange("bookNumberId", value)}
                >
                  <SelectTrigger className="mt-1 border-purple-200 focus-visible:ring-purple-400">
                    <SelectValue placeholder="புத்தக எண்ணைத் தேர்ந்தெடுக்கவும்" />
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="document-year">ஆவண வருடம் (Document Year)</Label>
                  <Input
                    id="document-year"
                    placeholder="ஆவண ஆண்டை உள்ளிடவும்"
                    value={formData.documentYear || ""}
                    onChange={(e) => handleChange("documentYear", e.target.value)}
                    className="mt-1 border-purple-200 focus-visible:ring-purple-400"
                  />
                </div>

                <div>
                  <Label htmlFor="document-number">ஆவண எண் (Document No)</Label>
                  <Input
                    id="document-number"
                    placeholder="ஆவண எண்ணை உள்ளிடவும்"
                    value={formData.documentNumber || ""}
                    onChange={(e) => handleChange("documentNumber", e.target.value)}
                    className="mt-1 border-purple-200 focus-visible:ring-purple-400"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="document-type">ஆவண வகை (Document Type)</Label>
                <Select
                  value={formData.documentTypeId?.toString() || ""}
                  onValueChange={(value) => handleChange("documentTypeId", value)}
                >
                  <SelectTrigger className="mt-1 border-purple-200 focus-visible:ring-purple-400">
                    <SelectValue placeholder="ஆவண வகையைத் தேர்ந்தெடுக்கவும்" />
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
                <Label htmlFor="submission-type">ஆவணம் ஒப்படைப்பு வகை (Document Submission Type)</Label>
                <Select
                  value={formData.submissionTypeId?.toString() || ""}
                  onValueChange={(value) => handleChange("submissionTypeId", value)}
                >
                  <SelectTrigger className="mt-1 border-purple-200 focus-visible:ring-purple-400">
                    <SelectValue placeholder="ஆவணம் ஒப்படைப்பு வகையைத் தேர்ந்தெடுக்கவும்" />
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
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {readOnly ? "மூடு" : "ரத்து செய்"}
          </Button>
          {!readOnly && (
            <Button onClick={handleSave} className="bg-purple-600 hover:bg-purple-700">
              சேமி
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
