"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DocumentDetailDialog } from "../components/document-detail-dialog"
import { DeleteConfirmationDialog } from "../components/delete-confirmation-dialog"
import { FileText, Eye, Edit, Trash2, FilePlus2 } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface PreviousDocTabProps {
  data: any
  updateData: (data: any) => void
  sellers: any[]
}

export function PreviousDocTab({ data, updateData, sellers = [] }: PreviousDocTabProps) {
  const [commonDocuments, setCommonDocuments] = useState<any[]>(data.commonDocuments || [])
  const [sellerDocuments, setSellerDocuments] = useState<any[]>(data.sellerDocuments || [])
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<any>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [selectedSeller, setSelectedSeller] = useState<string>("")
  const [isForAllSellers, setIsForAllSellers] = useState(true)

  const handleAddCommonDocument = (document: any) => {
    const newCommonDocuments = [...commonDocuments, { ...document, id: Date.now() }]
    setCommonDocuments(newCommonDocuments)
    updateData({ commonDocuments: newCommonDocuments, sellerDocuments })
    setIsDetailOpen(false)
  }

  const handleAddSellerDocument = (document: any) => {
    const newDocument = {
      ...document,
      id: Date.now(),
      sellerId: selectedSeller,
    }
    const newSellerDocuments = [...sellerDocuments, newDocument]
    setSellerDocuments(newSellerDocuments)
    updateData({ commonDocuments, sellerDocuments: newSellerDocuments })
    setIsDetailOpen(false)
  }

  const handleEditDocument = (document: any, isCommon: boolean) => {
    setSelectedDocument({ ...document, isCommon })
    setIsEditing(true)
    setIsDetailOpen(true)
  }

  const handleDeleteDocument = (documentId: number, isCommon: boolean) => {
    if (isCommon) {
      const newCommonDocuments = commonDocuments.filter((doc) => doc.id !== documentId)
      setCommonDocuments(newCommonDocuments)
      updateData({ commonDocuments: newCommonDocuments, sellerDocuments })
    } else {
      const newSellerDocuments = sellerDocuments.filter((doc) => doc.id !== documentId)
      setSellerDocuments(newSellerDocuments)
      updateData({ commonDocuments, sellerDocuments: newSellerDocuments })
    }
    setIsDeleteOpen(false)
  }

  const handleUpdateDocument = (updatedDocument: any) => {
    if (updatedDocument.isCommon) {
      const newCommonDocuments = commonDocuments.map((doc) =>
        doc.id === updatedDocument.id ? { ...updatedDocument } : doc,
      )
      setCommonDocuments(newCommonDocuments)
      updateData({ commonDocuments: newCommonDocuments, sellerDocuments })
    } else {
      const newSellerDocuments = sellerDocuments.map((doc) =>
        doc.id === updatedDocument.id ? { ...updatedDocument } : doc,
      )
      setSellerDocuments(newSellerDocuments)
      updateData({ commonDocuments, sellerDocuments: newSellerDocuments })
    }
    setIsDetailOpen(false)
    setIsEditing(false)
  }

  const handleViewDocument = (document: any, isCommon: boolean) => {
    setSelectedDocument({ ...document, isCommon })
    setIsEditing(false)
    setIsDetailOpen(true)
  }

  const handleConfirmDelete = (document: any, isCommon: boolean) => {
    setSelectedDocument({ ...document, isCommon })
    setIsDeleteOpen(true)
  }

  const openAddDocumentDialog = (isCommon = true) => {
    setSelectedDocument(null)
    setIsEditing(false)
    setIsDetailOpen(true)
    if (!isCommon && !selectedSeller && sellers.length > 0) {
      setSelectedSeller(sellers[0].id.toString())
    }
  }

  const getSellerName = (sellerId: string) => {
    const seller = sellers.find((s) => s.id.toString() === sellerId)
    return seller ? seller.name : "Unknown Seller"
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="text-xl font-semibold text-purple-800 flex items-center">
          <FileText className="h-5 w-5 mr-2 text-purple-600" />
          முந்தைய ஆவண விவரங்கள்
        </h3>
        <Separator className="my-4 bg-purple-200" />

        <Card className="p-4 border-purple-200 mb-6">
          <h4 className="text-md font-medium text-purple-700 mb-3">பொதுவான ஆவணங்கள் (Common Documents)</h4>

          <div className="flex justify-end mb-4">
            <Button onClick={() => openAddDocumentDialog(true)} className="bg-purple-600 hover:bg-purple-700">
              <FilePlus2 className="h-4 w-4 mr-2" />
              பொதுவான ஆவணத்தைச் சேர்க்க
            </Button>
          </div>

          {commonDocuments.length === 0 ? (
            <Card className="border-dashed border-2 border-purple-200 bg-purple-50">
              <CardContent className="flex flex-col items-center justify-center p-6">
                <FileText className="h-12 w-12 text-purple-400 mb-2" />
                <p className="text-purple-600 text-center">பொதுவான ஆவணங்கள் எதுவும் சேர்க்கப்படவில்லை</p>
                <p className="text-purple-500 text-sm text-center mt-1">
                  பொதுவான ஆவணத்தைச் சேர்க்க மேலே உள்ள பொத்தானைக் கிளிக் செய்யவும்
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {commonDocuments.map((document) => (
                <Card key={document.id} className="border-purple-200 hover:border-purple-300 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium text-purple-800">{document.documentNumber || "Document"}</h4>
                        <p className="text-sm text-gray-600">{document.documentType || "Unknown Type"}</p>
                        <p className="text-sm text-gray-600">{document.documentDate || "No Date"}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDocument(document, true)}
                          className="border-purple-200 hover:bg-purple-50"
                        >
                          <Eye className="h-4 w-4 text-purple-600" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditDocument(document, true)}
                          className="border-purple-200 hover:bg-purple-50"
                        >
                          <Edit className="h-4 w-4 text-purple-600" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleConfirmDelete(document, true)}
                          className="border-purple-200 hover:bg-purple-50"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </Card>

        <Separator className="my-4 bg-purple-200" />

        <Card className="p-4 border-purple-200 mt-4">
          <h4 className="text-md font-medium text-purple-700 mb-3">விற்பனையாளர் ஆவணங்கள் (Seller Documents)</h4>

          <div className="mb-4 space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="all-sellers"
                checked={isForAllSellers}
                onCheckedChange={(checked) => setIsForAllSellers(checked as boolean)}
              />
              <Label htmlFor="all-sellers" className="text-purple-700">
                அனைத்து விற்பனையாளர்களுக்கும் பொதுவான ஆவணங்கள்
              </Label>
            </div>

            {!isForAllSellers && (
              <div>
                <Label htmlFor="seller-select" className="text-purple-700">
                  விற்பனையாளரைத் தேர்ந்தெடுக்கவும்
                </Label>
                <Select value={selectedSeller} onValueChange={setSelectedSeller} disabled={sellers.length === 0}>
                  <SelectTrigger className="mt-1 border-purple-200 focus-visible:ring-purple-400">
                    <SelectValue placeholder="விற்பனையாளரைத் தேர்ந்தெடுக்கவும்" />
                  </SelectTrigger>
                  <SelectContent>
                    {sellers.map((seller) => (
                      <SelectItem key={seller.id} value={seller.id.toString()}>
                        {seller.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="flex justify-end">
              <Button
                onClick={() => openAddDocumentDialog(false)}
                className="bg-purple-600 hover:bg-purple-700"
                disabled={!isForAllSellers && (!selectedSeller || sellers.length === 0)}
              >
                <FilePlus2 className="h-4 w-4 mr-2" />
                விற்பனையாளர் ஆவணத்தைச் சேர்க்க
              </Button>
            </div>
          </div>

          {sellerDocuments.length === 0 ? (
            <Card className="border-dashed border-2 border-purple-200 bg-purple-50">
              <CardContent className="flex flex-col items-center justify-center p-6">
                <FileText className="h-12 w-12 text-purple-400 mb-2" />
                <p className="text-purple-600 text-center">விற்பனையாளர் ஆவணங்கள் எதுவும் சேர்க்கப்படவில்லை</p>
                <p className="text-purple-500 text-sm text-center mt-1">
                  விற்பனையாளர் ஆவணத்தைச் சேர்க்க மேலே உள்ள பொத்தானைக் கிளிக் செய்யவும்
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {sellers.length > 0 &&
                sellers.map((seller) => {
                  const sellerDocs = sellerDocuments.filter((doc) => doc.sellerId === seller.id.toString())
                  if (sellerDocs.length === 0) return null

                  return (
                    <div key={seller.id} className="space-y-2">
                      <h5 className="font-medium text-purple-700">{seller.name}</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {sellerDocs.map((document) => (
                          <Card
                            key={document.id}
                            className="border-purple-200 hover:border-purple-300 transition-colors"
                          >
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <h4 className="font-medium text-purple-800">
                                    {document.documentNumber || "Document"}
                                  </h4>
                                  <p className="text-sm text-gray-600">{document.documentType || "Unknown Type"}</p>
                                  <p className="text-sm text-gray-600">{document.documentDate || "No Date"}</p>
                                </div>
                                <div className="flex space-x-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleViewDocument(document, false)}
                                    className="border-purple-200 hover:bg-purple-50"
                                  >
                                    <Eye className="h-4 w-4 text-purple-600" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleEditDocument(document, false)}
                                    className="border-purple-200 hover:bg-purple-50"
                                  >
                                    <Edit className="h-4 w-4 text-purple-600" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleConfirmDelete(document, false)}
                                    className="border-purple-200 hover:bg-purple-50"
                                  >
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )
                })}
            </div>
          )}
        </Card>
      </div>

      <DocumentDetailDialog
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        document={selectedDocument}
        isEditing={isEditing}
        onAdd={selectedDocument?.isCommon ? handleAddCommonDocument : handleAddSellerDocument}
        onUpdate={handleUpdateDocument}
        title={isEditing ? "ஆவண விவரங்களைத் திருத்து" : "புதிய ஆவணத்தைச் சேர்க்க"}
        sellers={sellers}
        selectedSeller={selectedSeller}
        isCommon={selectedDocument?.isCommon ?? true}
      />

      <DeleteConfirmationDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={() => handleDeleteDocument(selectedDocument?.id, selectedDocument?.isCommon)}
        title="ஆவணத்தை நீக்கு"
        description="இந்த ஆவணத்தை நீக்க விரும்புகிறீர்களா? இந்த செயல்பாட்டை மீட்டெடுக்க முடியாது."
      />
    </div>
  )
}
