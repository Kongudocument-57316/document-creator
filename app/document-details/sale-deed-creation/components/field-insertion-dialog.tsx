"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FileText, User, Home, CreditCard } from "lucide-react"

interface FieldInsertionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onInsertField: (field: string, label: string) => void
  formData: any
}

export function FieldInsertionDialog({ open, onOpenChange, onInsertField, formData }: FieldInsertionDialogProps) {
  const [activeTab, setActiveTab] = useState("buyers")

  const handleInsertField = (field: string, label: string) => {
    onInsertField(field, label)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-purple-800">
            ஆவணத்தில் சேர்க்க புலத்தைத் தேர்ந்தெடுக்கவும்
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="buyers" value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="grid grid-cols-5">
            <TabsTrigger value="buyers" className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">வாங்குபவர்</span>
            </TabsTrigger>
            <TabsTrigger value="sellers" className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">விற்பவர்</span>
            </TabsTrigger>
            <TabsTrigger value="property" className="flex items-center gap-1">
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">சொத்து</span>
            </TabsTrigger>
            <TabsTrigger value="payment" className="flex items-center gap-1">
              <CreditCard className="h-4 w-4" />
              <span className="hidden sm:inline">பணம்</span>
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">ஆவணங்கள்</span>
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-hidden mt-4">
            <ScrollArea className="h-[400px] pr-4">
              <TabsContent value="buyers" className="mt-0">
                <h3 className="font-medium text-purple-700 mb-2">வாங்குபவர் விவரங்கள்</h3>
                <div className="grid grid-cols-1 gap-2">
                  {formData.buyers && formData.buyers.length > 0 ? (
                    formData.buyers.map((buyer: any, index: number) => (
                      <div key={buyer.id} className="space-y-2 border-b pb-2 last:border-0">
                        <h4 className="font-medium text-sm">
                          வாங்குபவர் {index + 1}: {buyer.name}
                        </h4>
                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleInsertField(`buyers[${index}].name`, `வாங்குபவர் ${index + 1} பெயர்`)}
                            className="justify-start text-left h-auto py-1 border-purple-200"
                          >
                            பெயர்
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleInsertField(`buyers[${index}].age`, `வாங்குபவர் ${index + 1} வயது`)}
                            className="justify-start text-left h-auto py-1 border-purple-200"
                          >
                            வயது
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleInsertField(`buyers[${index}].relation_type`, `வாங்குபவர் ${index + 1} உறவுமுறை`)
                            }
                            className="justify-start text-left h-auto py-1 border-purple-200"
                          >
                            உறவுமுறை
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleInsertField(`buyers[${index}].relative_name`, `வாங்குபவர் ${index + 1} உறவினர் பெயர்`)
                            }
                            className="justify-start text-left h-auto py-1 border-purple-200"
                          >
                            உறவினர் பெயர்
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleInsertField(`buyers[${index}].address_line1`, `வாங்குபவர் ${index + 1} முகவரி 1`)
                            }
                            className="justify-start text-left h-auto py-1 border-purple-200"
                          >
                            முகவரி 1
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleInsertField(`buyers[${index}].address_line2`, `வாங்குபவர் ${index + 1} முகவரி 2`)
                            }
                            className="justify-start text-left h-auto py-1 border-purple-200"
                          >
                            முகவரி 2
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 italic">வாங்குபவர் விவரங்கள் எதுவும் சேர்க்கப்படவில்லை</p>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="sellers" className="mt-0">
                <h3 className="font-medium text-purple-700 mb-2">விற்பவர் விவரங்கள்</h3>
                <div className="grid grid-cols-1 gap-2">
                  {formData.sellers && formData.sellers.length > 0 ? (
                    formData.sellers.map((seller: any, index: number) => (
                      <div key={seller.id} className="space-y-2 border-b pb-2 last:border-0">
                        <h4 className="font-medium text-sm">
                          விற்பவர் {index + 1}: {seller.name}
                        </h4>
                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleInsertField(`sellers[${index}].name`, `விற்பவர் ${index + 1} பெயர்`)}
                            className="justify-start text-left h-auto py-1 border-purple-200"
                          >
                            பெயர்
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleInsertField(`sellers[${index}].age`, `விற்பவர் ${index + 1} வயது`)}
                            className="justify-start text-left h-auto py-1 border-purple-200"
                          >
                            வயது
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleInsertField(`sellers[${index}].relation_type`, `விற்பவர் ${index + 1} உறவுமுறை`)
                            }
                            className="justify-start text-left h-auto py-1 border-purple-200"
                          >
                            உறவுமுறை
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleInsertField(`sellers[${index}].relative_name`, `விற்பவர் ${index + 1} உறவினர் பெயர்`)
                            }
                            className="justify-start text-left h-auto py-1 border-purple-200"
                          >
                            உறவினர் பெயர்
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleInsertField(`sellers[${index}].address_line1`, `விற்பவர் ${index + 1} முகவரி 1`)
                            }
                            className="justify-start text-left h-auto py-1 border-purple-200"
                          >
                            முகவரி 1
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleInsertField(`sellers[${index}].address_line2`, `விற்பவர் ${index + 1} முகவரி 2`)
                            }
                            className="justify-start text-left h-auto py-1 border-purple-200"
                          >
                            முகவரி 2
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 italic">விற்பவர் விவரங்கள் எதுவும் சேர்க்கப்படவில்லை</p>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="property" className="mt-0">
                <h3 className="font-medium text-purple-700 mb-2">சொத்து விவரங்கள்</h3>
                <div className="grid grid-cols-1 gap-2">
                  {formData.propertyDetails ? (
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleInsertField("propertyDetails.totalArea", "மொத்த பரப்பளவு")}
                          className="justify-start text-left h-auto py-1 border-purple-200"
                        >
                          மொத்த பரப்பளவு
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleInsertField("propertyDetails.surveyNumber", "சர்வே எண்")}
                          className="justify-start text-left h-auto py-1 border-purple-200"
                        >
                          சர்வே எண்
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleInsertField("propertyDetails.northBoundary", "வடக்கு எல்லை")}
                          className="justify-start text-left h-auto py-1 border-purple-200"
                        >
                          வடக்கு எல்லை
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleInsertField("propertyDetails.southBoundary", "தெற்கு எல்லை")}
                          className="justify-start text-left h-auto py-1 border-purple-200"
                        >
                          தெற்கு எல்லை
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleInsertField("propertyDetails.eastBoundary", "கிழக்கு எல்லை")}
                          className="justify-start text-left h-auto py-1 border-purple-200"
                        >
                          கிழக்கு எல்லை
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleInsertField("propertyDetails.westBoundary", "மேற்கு எல்லை")}
                          className="justify-start text-left h-auto py-1 border-purple-200"
                        >
                          மேற்கு எல்லை
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">சொத்து விவரங்கள் எதுவும் சேர்க்கப்படவில்லை</p>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="payment" className="mt-0">
                <h3 className="font-medium text-purple-700 mb-2">பணப்பட்டுவாடா விவரங்கள்</h3>
                <div className="grid grid-cols-1 gap-2">
                  {formData.paymentDetails && formData.paymentDetails.length > 0 ? (
                    formData.paymentDetails.map((payment: any, index: number) => (
                      <div key={index} className="space-y-2 border-b pb-2 last:border-0">
                        <h4 className="font-medium text-sm">பணப்பட்டுவாடா {index + 1}</h4>
                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleInsertField(`paymentDetails[${index}].amount`, `பணப்பட்டுவாடா ${index + 1} தொகை`)
                            }
                            className="justify-start text-left h-auto py-1 border-purple-200"
                          >
                            தொகை
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleInsertField(`paymentDetails[${index}].paymentMethod`, `பணப்பட்டுவாடா ${index + 1} முறை`)
                            }
                            className="justify-start text-left h-auto py-1 border-purple-200"
                          >
                            பணப்பட்டுவாடா முறை
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleInsertField(`paymentDetails[${index}].paymentDate`, `பணப்பட்டுவாடா ${index + 1} தேதி`)
                            }
                            className="justify-start text-left h-auto py-1 border-purple-200"
                          >
                            தேதி
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 italic">பணப்பட்டுவாடா விவரங்கள் எதுவும் சேர்க்கப்படவில்லை</p>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="documents" className="mt-0">
                <h3 className="font-medium text-purple-700 mb-2">முந்தைய ஆவண விவரங்கள்</h3>
                <div className="grid grid-cols-1 gap-2">
                  {formData.previousDocuments &&
                  (formData.previousDocuments.commonDocuments?.length > 0 ||
                    formData.previousDocuments.sellerDocuments?.length > 0) ? (
                    <div>
                      {formData.previousDocuments.commonDocuments?.length > 0 && (
                        <div className="mb-4">
                          <h4 className="font-medium text-sm mb-2">பொதுவான ஆவணங்கள்</h4>
                          <div className="grid grid-cols-2 gap-2">
                            {formData.previousDocuments.commonDocuments.map((doc: any, index: number) => (
                              <Button
                                key={doc.id}
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleInsertField(
                                    `previousDocuments.commonDocuments[${index}].documentNumber`,
                                    `பொதுவான ஆவணம் ${index + 1} எண்`,
                                  )
                                }
                                className="justify-start text-left h-auto py-1 border-purple-200"
                              >
                                ஆவணம் {index + 1}: {doc.documentNumber || "எண் இல்லை"}
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}

                      {formData.previousDocuments.sellerDocuments?.length > 0 && (
                        <div>
                          <h4 className="font-medium text-sm mb-2">விற்பவர் ஆவணங்கள்</h4>
                          <div className="grid grid-cols-2 gap-2">
                            {formData.previousDocuments.sellerDocuments.map((doc: any, index: number) => (
                              <Button
                                key={doc.id}
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleInsertField(
                                    `previousDocuments.sellerDocuments[${index}].documentNumber`,
                                    `விற்பவர் ஆவணம் ${index + 1} எண்`,
                                  )
                                }
                                className="justify-start text-left h-auto py-1 border-purple-200"
                              >
                                ஆவணம் {index + 1}: {doc.documentNumber || "எண் இல்லை"}
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">முந்தைய ஆவண விவரங்கள் எதுவும் சேர்க்கப்படவில்லை</p>
                  )}
                </div>
              </TabsContent>
            </ScrollArea>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
