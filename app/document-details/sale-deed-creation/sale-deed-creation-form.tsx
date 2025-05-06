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
import { Home, ArrowLeft } from "lucide-react"
import { SimplePdfGenerator } from "./simple-pdf-generator"

export function SaleDeedCreationForm() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("previous-doc")
  const [formData, setFormData] = useState({
    previousDoc: {},
    seller: {},
    buyer: {},
    property: {},
    witness: {},
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
    const tabs = ["previous-doc", "seller", "buyer", "property", "witness", "payment", "deed"]
    const currentIndex = tabs.indexOf(activeTab)
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1])
    }
  }

  const goToNextTab = () => {
    const tabs = ["previous-doc", "seller", "buyer", "property", "witness", "payment", "deed"]
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
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-purple-800">கிரைய பத்திரம் உருவாக்கு</h1>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={handleGoBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            பின் செல்
          </Button>
          <Button variant="outline" size="sm" onClick={handleGoHome}>
            <Home className="h-4 w-4 mr-2" />
            முகப்பு
          </Button>
        </div>
      </div>

      <Card className="p-6">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid grid-cols-7 mb-6">
            <TabsTrigger value="previous-doc" className="data-[state=active]:bg-purple-100">
              முந்தைய ஆவண விவரங்கள்
            </TabsTrigger>
            <TabsTrigger value="seller" className="data-[state=active]:bg-purple-100">
              விற்பனையாளர் விவரங்கள்
            </TabsTrigger>
            <TabsTrigger value="buyer" className="data-[state=active]:bg-purple-100">
              வாங்குபவர் விவரங்கள்
            </TabsTrigger>
            <TabsTrigger value="property" className="data-[state=active]:bg-purple-100">
              சொத்து விவரங்கள்
            </TabsTrigger>
            <TabsTrigger value="witness" className="data-[state=active]:bg-purple-100">
              சாட்சி விவரங்கள்
            </TabsTrigger>
            <TabsTrigger value="payment" className="data-[state=active]:bg-purple-100">
              பணம் செலுத்தும் விவரங்கள்
            </TabsTrigger>
            <TabsTrigger value="deed" className="data-[state=active]:bg-purple-100">
              பத்திர விவரங்கள்
            </TabsTrigger>
          </TabsList>

          <TabsContent value="previous-doc" className="mt-6">
            <PreviousDocTab
              data={formData.previousDoc}
              updateData={(data) => updateFormData("previousDoc", data)}
              sellers={formData.seller.sellers || []}
            />
          </TabsContent>

          <TabsContent value="seller" className="mt-6">
            <SellerTab data={formData.seller} updateData={(data) => updateFormData("seller", data)} />
          </TabsContent>

          <TabsContent value="buyer" className="mt-6">
            <BuyerTab data={formData.buyer} updateData={(data) => updateFormData("buyer", data)} />
          </TabsContent>

          <TabsContent value="property" className="mt-6">
            <PropertyTab data={formData.property} updateData={(data) => updateFormData("property", data)} />
          </TabsContent>

          <TabsContent value="witness" className="mt-6">
            <WitnessTab data={formData.witness} updateData={(data) => updateFormData("witness", data)} />
          </TabsContent>

          <TabsContent value="payment" className="mt-6">
            <PaymentTab data={formData.payment} updateData={(data) => updateFormData("payment", data)} />
          </TabsContent>

          <TabsContent value="deed" className="mt-6">
            <DeedTab data={formData.deed} updateData={(data) => updateFormData("deed", data)} />
          </TabsContent>
        </Tabs>

        <div className="flex justify-between mt-8">
          <Button variant="outline" onClick={goToPreviousTab} disabled={activeTab === "previous-doc"}>
            முந்தைய
          </Button>
          <div className="space-x-2">
            <SimplePdfGenerator formData={formData} />
            <Button onClick={goToNextTab} disabled={activeTab === "deed"} className="bg-purple-600 hover:bg-purple-700">
              அடுத்து
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
