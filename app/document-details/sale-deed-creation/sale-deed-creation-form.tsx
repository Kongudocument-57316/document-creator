"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { DeedTab } from "./tabs/deed-tab"
import { BuyerTab } from "./tabs/buyer-tab"
import { SellerTab } from "./tabs/seller-tab"
import { PreviousDocTab } from "./tabs/previous-doc-tab"
import { PropertyTab } from "./tabs/property-tab"
import { PaymentTab } from "./tabs/payment-tab"
import { WitnessTab } from "./tabs/witness-tab"
import { FileText, User, Users, FileSearch, Home, CreditCard, UserCheck, Printer, ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { SimplePdfGenerator } from "./simple-pdf-generator"

type TabType = "deed" | "buyer" | "seller" | "previousDoc" | "property" | "payment" | "witness"

export function SaleDeedCreationForm() {
  const [activeTab, setActiveTab] = useState<TabType>("deed")
  const [formData, setFormData] = useState({
    deed: {},
    buyer: [],
    seller: [],
    previousDoc: {},
    property: {},
    payment: [],
    witness: [],
  })
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const [showPdfGenerator, setShowPdfGenerator] = useState(false)

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab)
  }

  const updateFormData = (section: TabType, data: any) => {
    setFormData((prev) => ({
      ...prev,
      [section]: data,
    }))
  }

  const handleNext = () => {
    const tabOrder: TabType[] = ["deed", "buyer", "seller", "previousDoc", "property", "payment", "witness"]
    const currentIndex = tabOrder.indexOf(activeTab)
    if (currentIndex < tabOrder.length - 1) {
      setActiveTab(tabOrder[currentIndex + 1])
    }
  }

  const handlePrevious = () => {
    const tabOrder: TabType[] = ["deed", "buyer", "seller", "previousDoc", "property", "payment", "witness"]
    const currentIndex = tabOrder.indexOf(activeTab)
    if (currentIndex > 0) {
      setActiveTab(tabOrder[currentIndex - 1])
    }
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      // Here you would submit the form data to your API
      console.log("Form data to submit:", formData)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast.success("கிரைய ஆவணம் வெற்றிகரமாக சேமிக்கப்பட்டது")
      setShowPdfGenerator(true) // Show the PDF generator after successful submission
    } catch (error: any) {
      toast.error("பிழை ஏற்பட்டது: " + error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const tabs = [
    { id: "deed", label: "ஆவணம்", icon: <FileText className="h-5 w-5" /> },
    { id: "buyer", label: "வாங்குபவர்", icon: <User className="h-5 w-5" /> },
    { id: "seller", label: "விற்பனையாளர்", icon: <Users className="h-5 w-5" /> },
    { id: "previousDoc", label: "முந்தைய ஆவணம்", icon: <FileSearch className="h-5 w-5" /> },
    { id: "property", label: "சொத்து", icon: <Home className="h-5 w-5" /> },
    { id: "payment", label: "பணம்", icon: <CreditCard className="h-5 w-5" /> },
    { id: "witness", label: "சாட்சி", icon: <UserCheck className="h-5 w-5" /> },
  ]

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex overflow-x-auto pb-2 -mx-2 px-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id as TabType)}
            className={cn(
              "flex flex-col items-center min-w-[100px] px-4 py-2 mx-1 rounded-lg transition-colors",
              activeTab === tab.id ? "bg-purple-600 text-white" : "bg-purple-100 text-purple-700 hover:bg-purple-200",
            )}
          >
            {tab.icon}
            <span className="mt-1 text-sm">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <Card className="border-purple-200 p-4">
        {activeTab === "deed" && <DeedTab data={formData.deed} updateData={(data) => updateFormData("deed", data)} />}
        {activeTab === "buyer" && (
          <BuyerTab data={formData.buyer} updateData={(data) => updateFormData("buyer", data)} />
        )}
        {activeTab === "seller" && (
          <SellerTab data={formData.seller} updateData={(data) => updateFormData("seller", data)} />
        )}
        {activeTab === "previousDoc" && (
          <PreviousDocTab data={formData.previousDoc} updateData={(data) => updateFormData("previousDoc", data)} />
        )}
        {activeTab === "property" && (
          <PropertyTab data={formData.property} updateData={(data) => updateFormData("property", data)} />
        )}
        {activeTab === "payment" && (
          <PaymentTab data={formData.payment} updateData={(data) => updateFormData("payment", data)} />
        )}
        {activeTab === "witness" && (
          <WitnessTab data={formData.witness} updateData={(data) => updateFormData("witness", data)} />
        )}
      </Card>

      {showPdfGenerator && (
        <div className="mt-6">
          <SimplePdfGenerator formData={formData} title="கிரைய ஆவணம்" />
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            className="border-purple-300 text-purple-700 hover:bg-purple-100"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> பின் செல்க
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/")}
            className="border-purple-300 text-purple-700 hover:bg-purple-100"
          >
            <Home className="mr-2 h-4 w-4" /> முகப்பு
          </Button>
        </div>

        <div>
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowPdfGenerator(!showPdfGenerator)}
            className="border-purple-300 text-purple-700 hover:bg-purple-100"
          >
            {showPdfGenerator ? (
              <>
                <Printer className="mr-2 h-4 w-4" /> மறை
              </>
            ) : (
              <>
                <Printer className="mr-2 h-4 w-4" /> அச்சிடு
              </>
            )}
          </Button>
        </div>

        <div>
          {activeTab === "witness" ? (
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isLoading ? "சேமிக்கிறது..." : "சேமி"}
            </Button>
          ) : (
            <Button type="button" onClick={handleNext} className="bg-purple-600 hover:bg-purple-700">
              அடுத்து
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
