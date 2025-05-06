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
import { Home, ArrowLeft, Save } from "lucide-react"
import { SimplePdfGenerator } from "./simple-pdf-generator"
import { PreviewDialog } from "./components/preview-dialog"

export function SaleDeedCreationForm() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("deed")
  const [formData, setFormData] = useState({
    previousDoc: {},
    seller: [],
    buyer: [],
    property: {},
    witness: [],
    payment: {},
    deed: {},
  })

  const updateFormData = (section: string, data: any) => {
    setFormData((prev) => ({
      ...prev,
      [section]: data,
    }))
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
              <TabsTrigger
                value="deed"
                className="data-[state=active]:bg-purple-600 data-[state=active]:text-white py-2 text-sm"
              >
                ஆவண அடிப்படை விவரங்கள்
              </TabsTrigger>
              <TabsTrigger
                value="buyer"
                className="data-[state=active]:bg-purple-600 data-[state=active]:text-white py-2 text-sm"
              >
                வாங்குபவர் விவரங்கள்
              </TabsTrigger>
              <TabsTrigger
                value="seller"
                className="data-[state=active]:bg-purple-600 data-[state=active]:text-white py-2 text-sm"
              >
                விற்பனையாளர் விவரங்கள்
              </TabsTrigger>
              <TabsTrigger
                value="previous-doc"
                className="data-[state=active]:bg-purple-600 data-[state=active]:text-white py-2 text-sm"
              >
                முந்தைய ஆவண விவரங்கள்
              </TabsTrigger>
              <TabsTrigger
                value="property"
                className="data-[state=active]:bg-purple-600 data-[state=active]:text-white py-2 text-sm"
              >
                சொத்து விவரங்கள்
              </TabsTrigger>
              <TabsTrigger
                value="payment"
                className="data-[state=active]:bg-purple-600 data-[state=active]:text-white py-2 text-sm"
              >
                பணப்பட்டுவாடா விவரங்கள்
              </TabsTrigger>
              <TabsTrigger
                value="witness"
                className="data-[state=active]:bg-purple-600 data-[state=active]:text-white py-2 text-sm"
              >
                சாட்சி விவரங்கள்
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="deed" className="mt-6 bg-purple-50 p-6 rounded-lg">
            <DeedTab data={formData.deed} updateData={(data) => updateFormData("deed", data)} />
          </TabsContent>

          <TabsContent value="seller" className="mt-6 bg-purple-50 p-6 rounded-lg">
            <SellerTab data={formData.seller} updateData={(data) => updateFormData("seller", data)} />
          </TabsContent>

          <TabsContent value="buyer" className="mt-6 bg-purple-50 p-6 rounded-lg">
            <BuyerTab data={formData.buyer} updateData={(data) => updateFormData("buyer", data)} />
          </TabsContent>

          <TabsContent value="property" className="mt-6 bg-purple-50 p-6 rounded-lg">
            <PropertyTab data={formData.property} updateData={(data) => updateFormData("property", data)} />
          </TabsContent>

          <TabsContent value="witness" className="mt-6 bg-purple-50 p-6 rounded-lg">
            <WitnessTab data={formData.witness} updateData={(data) => updateFormData("witness", data)} />
          </TabsContent>

          <TabsContent value="payment" className="mt-6 bg-purple-50 p-6 rounded-lg">
            <PaymentTab data={formData.payment} updateData={(data) => updateFormData("payment", data)} />
          </TabsContent>

          <TabsContent value="previous-doc" className="mt-6 bg-purple-50 p-6 rounded-lg">
            <PreviousDocTab
              data={formData.previousDoc}
              updateData={(data) => updateFormData("previousDoc", data)}
              sellers={formData.seller || []}
            />
          </TabsContent>
        </Tabs>

        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={goToPreviousTab}
            disabled={activeTab === "deed"}
            className="border-purple-300 hover:bg-purple-50 text-purple-700"
          >
            முந்தைய
          </Button>
          <div className="flex flex-wrap gap-2 justify-end">
            <Button variant="outline" className="border-purple-300 hover:bg-purple-50 text-purple-700">
              <Save className="h-4 w-4 mr-2" />
              சேமி
            </Button>
            <PreviewDialog formData={formData} />
            <SimplePdfGenerator formData={formData} title="கிரைய ஆவணம்" />
            <Button
              onClick={goToNextTab}
              disabled={activeTab === "previous-doc"}
              className="bg-purple-600 hover:bg-purple-700"
            >
              அடுத்து
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
