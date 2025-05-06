"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { PreviousDocTab } from "./tabs/previous-doc-tab"
import { SellerTab } from "./tabs/seller-tab"
import { BuyerTab } from "./tabs/buyer-tab"
import { PropertyTab } from "./tabs/property-tab"
import { WitnessTab } from "./tabs/witness-tab"
import { PaymentTab } from "./tabs/payment-tab"
import { DeedTab } from "./tabs/deed-tab"
import { useRouter } from "next/navigation"
import { Home, ArrowLeft, Save, ArrowRight, Loader2, AlertCircle, Printer, Eye } from "lucide-react"
import { SimplePdfGenerator } from "./simple-pdf-generator"
import { PreviewDialog } from "./components/preview-dialog"
import { saveSaleDeed } from "./actions"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { validateForm } from "./validation"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function SaleDeedCreationForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("deed")
  const [isSaving, setIsSaving] = useState(false)
  const [savedDeedId, setSavedDeedId] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({})
  const [showValidationErrors, setShowValidationErrors] = useState(false)
  const [formData, setFormData] = useState({
    previousDoc: {},
    seller: [],
    buyer: [],
    property: {},
    witness: [],
    payment: {},
    deed: {},
    id: null,
  })

  const updateFormData = (section: string, data: any) => {
    setFormData((prev) => {
      const newFormData = {
        ...prev,
        [section]: data,
      }

      // If property value is updated, pass it to payment section
      if (section === "property" && data.propertyValue && prev.payment) {
        return {
          ...newFormData,
          payment: {
            ...prev.payment,
            propertyValue: data.propertyValue,
          },
        }
      }

      return newFormData
    })

    // Clear validation errors for this section when data is updated
    if (validationErrors[section]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[section]
        return newErrors
      })
    }
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)
  }

  const goToPreviousTab = () => {
    const tabs = ["deed", "seller", "buyer", "property", "payment", "witness", "previous-doc"]
    const currentIndex = tabs.indexOf(activeTab)
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1])
    }
  }

  const goToNextTab = () => {
    const tabs = ["deed", "seller", "buyer", "property", "payment", "witness", "previous-doc"]
    const currentIndex = tabs.indexOf(activeTab)
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1])
    }
  }

  const handleGoBack = () => {
    router.back()
  }

  const handleGoHome = () => {
    router.push("/")
  }

  const validateFormData = () => {
    const validation = validateForm(formData)
    setValidationErrors(validation.errors)
    setShowValidationErrors(!validation.isValid)

    if (!validation.isValid && validation.firstInvalidTab) {
      setActiveTab(validation.firstInvalidTab)
      toast({
        title: "சரிபார்ப்பு பிழை",
        description: "சில தேவையான தகவல்கள் நிரப்பப்படவில்லை. தயவுசெய்து சிவப்பு நட்சத்திரம் (*) குறிக்கப்பட்ட புலங்களை நிரப்பவும்.",
        variant: "destructive",
      })
    }

    return validation.isValid
  }

  const handleSave = async () => {
    // Validate form before saving
    if (!validateFormData()) {
      return
    }

    try {
      setIsSaving(true)

      // Include the saved ID if we have one
      const dataToSave = savedDeedId ? { ...formData, id: savedDeedId } : formData

      const result = await saveSaleDeed(dataToSave)

      if (result.success) {
        // Store the deed ID for future saves
        if (result.id) {
          setSavedDeedId(result.id)
        }

        toast({
          title: "சேமிக்கப்பட்டது",
          description: "கிரைய பத்திரம் வெற்றிகரமாக சேமிக்கப்பட்டது",
          variant: "default",
        })

        // Clear validation errors after successful save
        setValidationErrors({})
        setShowValidationErrors(false)
      } else {
        toast({
          title: "சேமிப்பதில் பிழை",
          description: result.error || "கிரைய பத்திரத்தை சேமிப்பதில் பிழை ஏற்பட்டது",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error saving deed:", error)
      toast({
        title: "சேமிப்பதில் பிழை",
        description: "கிரைய பத்திரத்தை சேமிப்பதில் எதிர்பாராத பிழை ஏற்பட்டது",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const tabs = [
    { id: "deed", label: "ஆவண அடிப்படை விவரங்கள்" },
    { id: "buyer", label: "வாங்குபவர் விவரங்கள்" },
    { id: "seller", label: "விற்பனையாளர் விவரங்கள்" },
    { id: "previous-doc", label: "முந்தைய ஆவண விவரங்கள்" },
    { id: "property", label: "சொத்து விவரங்கள்" },
    { id: "payment", label: "பணப்பட்டுவாடா விவரங்கள்" },
    { id: "witness", label: "சாட்சி விவரங்கள்" },
  ]

  // Check if a tab has validation errors
  const hasTabErrors = (tabId: string) => {
    return validationErrors[tabId] && validationErrors[tabId].length > 0
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-purple-800">கிரைய பத்திரம் உருவாக்கு</h1>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={handleGoBack} className="border-purple-300 hover:bg-purple-50">
            <ArrowLeft className="h-4 w-4 mr-2 text-purple-600" />
            பின் செல்
          </Button>
          <Button variant="outline" size="sm" onClick={handleGoHome} className="border-purple-300 hover:bg-purple-50">
            <Home className="h-4 w-4 mr-2 text-purple-600" />
            முகப்பு
          </Button>
        </div>
      </div>

      <Card className="p-6 border-purple-200 shadow-md">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <div className="overflow-x-auto pb-2">
            <TabsList className="w-full grid-cols-7 mb-6 bg-purple-50 p-1">
              {tabs.map((tab, index) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className={`data-[state=active]:bg-purple-600 data-[state=active]:text-white py-2 text-sm ${
                    hasTabErrors(tab.id) ? "relative" : ""
                  }`}
                >
                  <div className="flex items-center">
                    {index > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-5 w-5 p-0 mr-1 text-purple-600 hover:bg-purple-100 hover:text-purple-800"
                        onClick={(e) => {
                          e.stopPropagation()
                          const prevIndex = index - 1
                          setActiveTab(tabs[prevIndex].id)
                        }}
                      >
                        <ArrowLeft className="h-3 w-3" />
                        <span className="sr-only">முந்தைய</span>
                      </Button>
                    )}
                    <span>{tab.label}</span>
                    {index < tabs.length - 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-5 w-5 p-0 ml-1 text-purple-600 hover:bg-purple-100 hover:text-purple-800"
                        onClick={(e) => {
                          e.stopPropagation()
                          const nextIndex = index + 1
                          setActiveTab(tabs[nextIndex].id)
                        }}
                      >
                        <ArrowRight className="h-3 w-3" />
                        <span className="sr-only">அடுத்து</span>
                      </Button>
                    )}
                  </div>
                  {hasTabErrors(tab.id) && (
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </span>
                  )}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* Show validation errors for current tab */}
          {showValidationErrors && hasTabErrors(activeTab) && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>சரிபார்ப்பு பிழைகள்</AlertTitle>
              <AlertDescription>
                <ul className="list-disc pl-5 mt-2">
                  {validationErrors[activeTab].map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          <TabsContent value="deed" className="mt-2 bg-purple-50 p-6 rounded-lg">
            <DeedTab data={formData.deed} updateData={(data) => updateFormData("deed", data)} />
          </TabsContent>

          <TabsContent value="seller" className="mt-2 bg-purple-50 p-6 rounded-lg">
            <SellerTab data={formData.seller} updateData={(data) => updateFormData("seller", data)} />
          </TabsContent>

          <TabsContent value="buyer" className="mt-2 bg-purple-50 p-6 rounded-lg">
            <BuyerTab data={formData.buyer} updateData={(data) => updateFormData("buyer", data)} />
          </TabsContent>

          <TabsContent value="property" className="mt-2 bg-purple-50 p-6 rounded-lg">
            <PropertyTab data={formData.property} updateData={(data) => updateFormData("property", data)} />
          </TabsContent>

          <TabsContent value="witness" className="mt-2 bg-purple-50 p-6 rounded-lg">
            <WitnessTab data={formData.witness} updateData={(data) => updateFormData("witness", data)} />
          </TabsContent>

          <TabsContent value="payment" className="mt-2 bg-purple-50 p-6 rounded-lg">
            <PaymentTab
              data={{
                ...formData.payment,
                buyers: formData.buyer,
                sellers: formData.seller,
                propertyValue: formData.property?.propertyValue,
              }}
              updateData={(data) => updateFormData("payment", data)}
            />
          </TabsContent>

          <TabsContent value="previous-doc" className="mt-2 bg-purple-50 p-6 rounded-lg">
            <PreviousDocTab
              data={formData.previousDoc}
              updateData={(data) => updateFormData("previousDoc", data)}
              sellers={formData.seller || []}
            />
          </TabsContent>

          {/* Navigation and action buttons below tab content */}
          <div className="flex flex-col md:flex-row justify-between mt-6 gap-4">
            <Button
              variant="outline"
              onClick={goToPreviousTab}
              disabled={activeTab === "deed"}
              className="border-purple-300 hover:bg-purple-50 text-purple-700"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              முந்தைய பக்கம்
            </Button>

            <div className="flex flex-wrap justify-center gap-2">
              <Button
                variant="outline"
                onClick={handleSave}
                disabled={isSaving}
                className="border-purple-300 hover:bg-purple-50 text-purple-700"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    சேமிக்கிறது...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    சேமி
                  </>
                )}
              </Button>

              <PreviewDialog formData={formData}>
                <Button variant="outline" className="border-purple-300 hover:bg-purple-50 text-purple-700">
                  <Eye className="h-4 w-4 mr-2" />
                  முன்னோட்டம்
                </Button>
              </PreviewDialog>

              <SimplePdfGenerator formData={formData} title="கிரைய ஆவணம்">
                <Button variant="outline" className="border-purple-300 hover:bg-purple-50 text-purple-700">
                  <Printer className="h-4 w-4 mr-2" />
                  அச்சிடு
                </Button>
              </SimplePdfGenerator>
            </div>

            <Button
              onClick={goToNextTab}
              disabled={activeTab === "previous-doc"}
              className="bg-purple-600 hover:bg-purple-700"
            >
              அடுத்த பக்கம்
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </Tabs>
      </Card>

      {/* Toast notifications */}
      <Toaster />
    </div>
  )
}
