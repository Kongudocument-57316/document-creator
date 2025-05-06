"use client"

import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Home, ArrowLeft } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import BasicDocumentForm from "./components/basic-document-form"
import BuyerDetailsForm from "./components/buyer-details-form"
import SellerDetailsForm from "./components/seller-details-form"
import PreviousDocumentForm from "./components/previous-document-form"
import PropertyDetailsForm from "./components/property-details-form"
import PaymentDetailsForm from "./components/payment-details-form"
import WitnessDetailsForm from "./components/witness-details-form"
import DocumentPreview from "./components/document-preview"
import { getSupabaseBrowserClient } from "@/lib/supabase"

export default function CreateSaleDocument() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    basicDetails: {
      documentNumber: "",
      bookNumberId: "",
      documentTypeId: "",
      registrationDate: "",
      submissionDate: "",
      submissionTypeId: "",
      officeId: "",
      subRegistrarOfficeId: "",
      documentStatus: "draft",
      remarks: "",
    },
    buyers: [{ id: "", name: "", relationDetails: "", address: "", phone: "", aadhaarNumber: "" }],
    sellers: [{ id: "", name: "", relationDetails: "", address: "", phone: "", aadhaarNumber: "" }],
    previousDocuments: [],
    propertyDetails: {
      propertyId: "",
      propertyName: "",
      surveyNumber: "",
      registrationDistrictId: "",
      subRegistrarOfficeId: "",
      districtId: "",
      talukId: "",
      villageId: "",
      landTypeId: "",
      guideValueSqm: "",
      guideValueSqft: "",
      propertyDetails: "",
    },
    paymentDetails: {
      totalValue: "",
      paymentMethodId: "",
      paymentReference: "",
      paymentAmount: "",
      paymentDate: "",
    },
    witnesses: [
      { name: "", address: "" },
      { name: "", address: "" },
    ],
  })

  const [expandedSections, setExpandedSections] = useState({
    basicDetails: true,
    buyerDetails: false,
    sellerDetails: false,
    previousDocuments: false,
    propertyDetails: false,
    paymentDetails: false,
    witnessDetails: false,
  })

  const toggleSection = (section) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section],
    })
  }

  const updateFormData = (section, data) => {
    setFormData({
      ...formData,
      [section]: data,
    })

    // Auto-collapse current section and expand next section
    const sections = [
      "basicDetails",
      "buyerDetails",
      "sellerDetails",
      "previousDocuments",
      "propertyDetails",
      "paymentDetails",
      "witnessDetails",
    ]
    const currentIndex = sections.indexOf(section)

    if (currentIndex < sections.length - 1) {
      const nextSection = sections[currentIndex + 1]
      setExpandedSections({
        ...expandedSections,
        [section]: false,
        [nextSection]: true,
      })
    }
  }

  const handleSubmit = async () => {
    try {
      const supabase = getSupabaseBrowserClient()

      // Create sale document record
      const { data, error } = await supabase
        .from("sale_documents")
        .insert({
          document_number: formData.basicDetails.documentNumber,
          book_number_id: formData.basicDetails.bookNumberId,
          document_type_id: formData.basicDetails.documentTypeId,
          registration_date: formData.basicDetails.registrationDate,
          submission_date: formData.basicDetails.submissionDate,
          submission_type_id: formData.basicDetails.submissionTypeId,
          seller_id: formData.sellers[0].id, // Primary seller
          buyer_id: formData.buyers[0].id, // Primary buyer
          property_id: formData.propertyDetails.propertyId,
          total_value: formData.paymentDetails.totalValue,
          office_id: formData.basicDetails.officeId,
          payment_method_id: formData.paymentDetails.paymentMethodId,
          payment_reference: formData.paymentDetails.paymentReference,
          payment_amount: formData.paymentDetails.paymentAmount,
          payment_date: formData.paymentDetails.paymentDate,
          sub_registrar_office_id: formData.basicDetails.subRegistrarOfficeId,
          document_status: formData.basicDetails.documentStatus,
          remarks: formData.basicDetails.remarks,
        })
        .select()

      if (error) throw error

      // Handle additional buyers, sellers, witnesses, etc. in separate tables if needed

      alert("கிரைய ஆவணம் வெற்றிகரமாக உருவாக்கப்பட்டது!")
      router.push("/document-details/sale-document")
    } catch (error) {
      console.error("Error creating sale document:", error)
      alert("ஆவணம் உருவாக்குவதில் பிழை ஏற்பட்டது. மீண்டும் முயற்சிக்கவும்.")
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-cyan-50">
      <Header className="bg-cyan-100 border-cyan-200" />
      <div className="flex items-center gap-2 p-4 bg-cyan-50">
        <Button asChild variant="outline" className="border-cyan-300 text-cyan-700 hover:bg-cyan-100">
          <Link href="/document-details/sale-document">
            <ArrowLeft className="h-4 w-4 mr-2" />
            பின்செல்
          </Link>
        </Button>
        <Button asChild variant="outline" className="border-cyan-300 text-cyan-700 hover:bg-cyan-100">
          <Link href="/">
            <Home className="h-4 w-4 mr-2" />
            முகப்பு
          </Link>
        </Button>
      </div>
      <main className="flex-1 p-6">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Left side - Forms */}
            <div className="w-full md:w-1/2 space-y-4">
              <h1 className="text-2xl font-bold text-cyan-700 mb-4">புதிய கிரைய ஆவணம் உருவாக்கு</h1>

              <div className="space-y-4">
                <Card
                  className={`border-l-4 ${expandedSections.basicDetails ? "border-l-cyan-500" : "border-l-gray-300"}`}
                >
                  <div
                    className="p-4 font-medium flex justify-between items-center cursor-pointer"
                    onClick={() => toggleSection("basicDetails")}
                  >
                    <h2 className="text-lg">அடிப்படை ஆவண விவரங்கள்</h2>
                    <span>{expandedSections.basicDetails ? "▼" : "►"}</span>
                  </div>
                  {expandedSections.basicDetails && (
                    <CardContent>
                      <BasicDocumentForm
                        data={formData.basicDetails}
                        updateData={(data) => updateFormData("basicDetails", data)}
                      />
                    </CardContent>
                  )}
                </Card>

                <Card
                  className={`border-l-4 ${expandedSections.buyerDetails ? "border-l-cyan-500" : "border-l-gray-300"}`}
                >
                  <div
                    className="p-4 font-medium flex justify-between items-center cursor-pointer"
                    onClick={() => toggleSection("buyerDetails")}
                  >
                    <h2 className="text-lg">வாங்குபவர் விவரங்கள்</h2>
                    <span>{expandedSections.buyerDetails ? "▼" : "►"}</span>
                  </div>
                  {expandedSections.buyerDetails && (
                    <CardContent>
                      <BuyerDetailsForm data={formData.buyers} updateData={(data) => updateFormData("buyers", data)} />
                    </CardContent>
                  )}
                </Card>

                <Card
                  className={`border-l-4 ${expandedSections.sellerDetails ? "border-l-cyan-500" : "border-l-gray-300"}`}
                >
                  <div
                    className="p-4 font-medium flex justify-between items-center cursor-pointer"
                    onClick={() => toggleSection("sellerDetails")}
                  >
                    <h2 className="text-lg">விற்பவர் விவரங்கள்</h2>
                    <span>{expandedSections.sellerDetails ? "▼" : "►"}</span>
                  </div>
                  {expandedSections.sellerDetails && (
                    <CardContent>
                      <SellerDetailsForm
                        data={formData.sellers}
                        updateData={(data) => updateFormData("sellers", data)}
                      />
                    </CardContent>
                  )}
                </Card>

                <Card
                  className={`border-l-4 ${expandedSections.previousDocuments ? "border-l-cyan-500" : "border-l-gray-300"}`}
                >
                  <div
                    className="p-4 font-medium flex justify-between items-center cursor-pointer"
                    onClick={() => toggleSection("previousDocuments")}
                  >
                    <h2 className="text-lg">முந்தைய ஆவண விவரங்கள்</h2>
                    <span>{expandedSections.previousDocuments ? "▼" : "►"}</span>
                  </div>
                  {expandedSections.previousDocuments && (
                    <CardContent>
                      <PreviousDocumentForm
                        data={formData.previousDocuments}
                        sellers={formData.sellers}
                        updateData={(data) => updateFormData("previousDocuments", data)}
                      />
                    </CardContent>
                  )}
                </Card>

                <Card
                  className={`border-l-4 ${expandedSections.propertyDetails ? "border-l-cyan-500" : "border-l-gray-300"}`}
                >
                  <div
                    className="p-4 font-medium flex justify-between items-center cursor-pointer"
                    onClick={() => toggleSection("propertyDetails")}
                  >
                    <h2 className="text-lg">சொத்து விவரங்கள்</h2>
                    <span>{expandedSections.propertyDetails ? "▼" : "►"}</span>
                  </div>
                  {expandedSections.propertyDetails && (
                    <CardContent>
                      <PropertyDetailsForm
                        data={formData.propertyDetails}
                        updateData={(data) => updateFormData("propertyDetails", data)}
                      />
                    </CardContent>
                  )}
                </Card>

                <Card
                  className={`border-l-4 ${expandedSections.paymentDetails ? "border-l-cyan-500" : "border-l-gray-300"}`}
                >
                  <div
                    className="p-4 font-medium flex justify-between items-center cursor-pointer"
                    onClick={() => toggleSection("paymentDetails")}
                  >
                    <h2 className="text-lg">பணம் செலுத்தும் விவரங்கள்</h2>
                    <span>{expandedSections.paymentDetails ? "▼" : "►"}</span>
                  </div>
                  {expandedSections.paymentDetails && (
                    <CardContent>
                      <PaymentDetailsForm
                        data={formData.paymentDetails}
                        updateData={(data) => updateFormData("paymentDetails", data)}
                      />
                    </CardContent>
                  )}
                </Card>

                <Card
                  className={`border-l-4 ${expandedSections.witnessDetails ? "border-l-cyan-500" : "border-l-gray-300"}`}
                >
                  <div
                    className="p-4 font-medium flex justify-between items-center cursor-pointer"
                    onClick={() => toggleSection("witnessDetails")}
                  >
                    <h2 className="text-lg">சாட்சிகள் விவரங்கள்</h2>
                    <span>{expandedSections.witnessDetails ? "▼" : "►"}</span>
                  </div>
                  {expandedSections.witnessDetails && (
                    <CardContent>
                      <WitnessDetailsForm
                        data={formData.witnesses}
                        updateData={(data) => updateFormData("witnesses", data)}
                      />
                    </CardContent>
                  )}
                </Card>
              </div>

              <div className="flex space-x-4 mt-6">
                <Button variant="outline" onClick={() => router.push("/document-details/sale-document")}>
                  பின்செல்
                </Button>
                <Button variant="outline" onClick={() => router.push("/")}>
                  முகப்பு
                </Button>
                <Button className="bg-cyan-600 hover:bg-cyan-700 text-white" onClick={handleSubmit}>
                  சமர்ப்பி
                </Button>
              </div>
            </div>

            {/* Right side - Document Preview */}
            <div className="w-full md:w-1/2 mt-4 md:mt-0">
              <Card className="sticky top-4">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-4 text-cyan-700">ஆவண முன்னோட்டம்</h2>
                  <DocumentPreview formData={formData} />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <footer className="bg-cyan-100 border-t border-cyan-200 py-4 text-center text-cyan-700">
        <p>© 2023 தமிழ் ஆவண மேலாண்மை. அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.</p>
      </footer>
    </div>
  )
}
