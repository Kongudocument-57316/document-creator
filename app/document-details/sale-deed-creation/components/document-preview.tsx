"use client"

import { Separator } from "@/components/ui/separator"
import { getSupabaseBrowserClient } from "@/lib/supabase"
import { useEffect, useState } from "react"

interface DocumentPreviewProps {
  formData: any
}

export function DocumentPreview({ formData }: DocumentPreviewProps) {
  const [registrationOfficeName, setRegistrationOfficeName] = useState("")
  const [documentPreparerName, setDocumentPreparerName] = useState("")
  const [typingOfficeName, setTypingOfficeName] = useState("")
  const [propertyTypeName, setPropertyTypeName] = useState("")
  const [paymentMethodName, setPaymentMethodName] = useState("")
  const [loading, setLoading] = useState(true)

  const supabase = getSupabaseBrowserClient()

  useEffect(() => {
    async function fetchReferenceData() {
      try {
        setLoading(true)

        // Fetch registration office name
        if (formData.deed?.registrationOfficeId) {
          const { data: officeData } = await supabase
            .from("sub_registrar_offices")
            .select("name")
            .eq("id", formData.deed.registrationOfficeId)
            .single()

          if (officeData) setRegistrationOfficeName(officeData.name)
        }

        // Fetch document preparer name
        if (formData.deed?.documentPreparerId) {
          const { data: preparerData } = await supabase
            .from("typists")
            .select("name")
            .eq("id", formData.deed.documentPreparerId)
            .single()

          if (preparerData) setDocumentPreparerName(preparerData.name)
        }

        // Fetch typing office name
        if (formData.deed?.typingOfficeId) {
          const { data: officeData } = await supabase
            .from("offices")
            .select("name")
            .eq("id", formData.deed.typingOfficeId)
            .single()

          if (officeData) setTypingOfficeName(officeData.name)
        }

        // Fetch property type name
        if (formData.property?.propertyType) {
          const { data: typeData } = await supabase
            .from("land_types")
            .select("name")
            .eq("id", formData.property.propertyType)
            .single()

          if (typeData) setPropertyTypeName(typeData.name)
        }

        // Fetch payment method name
        if (formData.payment?.paymentMethod) {
          const { data: methodData } = await supabase
            .from("payment_methods")
            .select("name")
            .eq("id", formData.payment.paymentMethod)
            .single()

          if (methodData) setPaymentMethodName(methodData.name)
        }
      } catch (error) {
        console.error("Error fetching reference data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchReferenceData()
  }, [
    formData.deed?.registrationOfficeId,
    formData.deed?.documentPreparerId,
    formData.deed?.typingOfficeId,
    formData.property?.propertyType,
    formData.payment?.paymentMethod,
    supabase,
  ])

  const getMonthName = (monthNumber: string) => {
    const months = [
      "ஜனவரி",
      "பிப்ரவரி",
      "மார்ச்",
      "ஏப்ரல்",
      "மே",
      "ஜூன்",
      "ஜூலை",
      "ஆகஸ்ட்",
      "செப்டம்பர்",
      "அக்டோபர்",
      "நவம்பர்",
      "டிசம்பர்",
    ]
    const index = Number.parseInt(monthNumber) - 1
    return months[index] || ""
  }

  const formatDate = (day: string, month: string, year: string) => {
    if (!day || !month || !year) return ""
    return `${day} ${getMonthName(month)} ${year}`
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-purple-800 mb-2">கிரைய ஆவணம் (Sale Deed)</h1>
        <p className="text-gray-600">
          {registrationOfficeName ? `${registrationOfficeName} அலுவலகம்` : "சார்பதிவாளர் அலுவலகம்"}
        </p>
        {formData.deed?.day && formData.deed?.month && formData.deed?.year && (
          <p className="text-gray-600">
            தேதி: {formatDate(formData.deed.day, formData.deed.month, formData.deed.year)}
          </p>
        )}
      </div>

      <Separator className="my-6 bg-purple-200" />

      {/* Document Details */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-purple-700 mb-3">ஆவண விவரங்கள்</h2>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">
                <span className="font-semibold">ஆவணம் தயாரித்தவர்:</span> {documentPreparerName || "-"}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">தொலைபேசி எண்:</span> {formData.deed?.phoneNumber || "-"}
              </p>
            </div>
            <div>
              <p className="text-gray-600">
                <span className="font-semibold">தட்டச்சு அலுவலகம்:</span> {typingOfficeName || "-"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Seller Details */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-purple-700 mb-3">விற்பனையாளர் விவரங்கள்</h2>
        {Array.isArray(formData.seller) && formData.seller.length > 0 ? (
          <div className="space-y-4">
            {formData.seller.map((seller: any, index: number) => (
              <div key={index} className="bg-purple-50 p-4 rounded-lg">
                <p className="font-medium text-purple-800">{seller.name}</p>
                <p className="text-gray-600">{seller.address_line1 || seller.address1 || seller.address}</p>
                {(seller.phone || seller.phoneNo) && (
                  <p className="text-gray-600">தொலைபேசி: {seller.phone || seller.phoneNo}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic">விற்பனையாளர் விவரங்கள் எதுவும் சேர்க்கப்படவில்லை</p>
        )}
      </div>

      {/* Buyer Details */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-purple-700 mb-3">வாங்குபவர் விவரங்கள்</h2>
        {Array.isArray(formData.buyer) && formData.buyer.length > 0 ? (
          <div className="space-y-4">
            {formData.buyer.map((buyer: any, index: number) => (
              <div key={index} className="bg-purple-50 p-4 rounded-lg">
                <p className="font-medium text-purple-800">{buyer.name}</p>
                <p className="text-gray-600">{buyer.address_line1 || buyer.address1 || buyer.address}</p>
                {(buyer.phone || buyer.phoneNo) && (
                  <p className="text-gray-600">தொலைபேசி: {buyer.phone || buyer.phoneNo}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic">வாங்குபவர் விவரங்கள் எதுவும் சேர்க்கப்படவில்லை</p>
        )}
      </div>

      {/* Property Details */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-purple-700 mb-3">சொத்து விவரங்கள்</h2>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">
                <span className="font-semibold">சொத்து வகை:</span> {propertyTypeName || "-"}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">சொத்தின் மதிப்பு:</span> {formData.property?.propertyValue || "-"}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">சொத்தின் அளவு:</span> {formData.property?.propertyArea || "-"}
              </p>
            </div>
            <div>
              <p className="text-gray-600">
                <span className="font-semibold">சொத்து முகவரி:</span> {formData.property?.propertyAddress || "-"}
              </p>
            </div>
          </div>

          {(formData.property?.northBoundary ||
            formData.property?.southBoundary ||
            formData.property?.eastBoundary ||
            formData.property?.westBoundary) && (
            <div className="mt-4">
              <p className="font-semibold text-purple-700 mb-2">எல்லைகள்:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <p className="text-gray-600">
                  <span className="font-semibold">வடக்கு:</span> {formData.property?.northBoundary || "-"}
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">தெற்கு:</span> {formData.property?.southBoundary || "-"}
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">கிழக்கு:</span> {formData.property?.eastBoundary || "-"}
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">மேற்கு:</span> {formData.property?.westBoundary || "-"}
                </p>
              </div>
            </div>
          )}

          {formData.property?.propertyDescription && (
            <div className="mt-4">
              <p className="font-semibold text-purple-700 mb-2">சொத்து விளக்கம்:</p>
              <p className="text-gray-600">{formData.property.propertyDescription}</p>
            </div>
          )}
        </div>
      </div>

      {/* Payment Details */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-purple-700 mb-3">பணப்பட்டுவாடா விவரங்கள்</h2>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">
                <span className="font-semibold">மொத்த தொகை:</span> {formData.payment?.totalAmount || "-"}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">முன்பணம்:</span> {formData.payment?.advanceAmount || "-"}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">மீதமுள்ள தொகை:</span> {formData.payment?.remainingAmount || "-"}
              </p>
            </div>
            <div>
              <p className="text-gray-600">
                <span className="font-semibold">பணம் செலுத்தும் முறை:</span> {paymentMethodName || "-"}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">பணம் செலுத்திய தேதி:</span> {formData.payment?.paymentDate || "-"}
              </p>
            </div>
          </div>

          {formData.payment?.paymentDetails && (
            <div className="mt-4">
              <p className="font-semibold text-purple-700 mb-2">கூடுதல் பணப்பட்டுவாடா விவரங்கள்:</p>
              <p className="text-gray-600">{formData.payment.paymentDetails}</p>
            </div>
          )}
        </div>
      </div>

      {/* Witness Details */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-purple-700 mb-3">சாட்சி விவரங்கள்</h2>
        {Array.isArray(formData.witness) && formData.witness.length > 0 ? (
          <div className="space-y-4">
            {formData.witness.map((witness: any, index: number) => (
              <div key={index} className="bg-purple-50 p-4 rounded-lg">
                <p className="font-medium text-purple-800">{witness.name}</p>
                <p className="text-gray-600">{witness.address_line1 || witness.address1 || witness.address}</p>
                {(witness.phone || witness.phoneNo) && (
                  <p className="text-gray-600">தொலைபேசி: {witness.phone || witness.phoneNo}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic">சாட்சி விவரங்கள் எதுவும் சேர்க்கப்படவில்லை</p>
        )}
      </div>

      {/* Previous Documents */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-purple-700 mb-3">முந்தைய ஆவண விவரங்கள்</h2>
        {formData.previousDoc?.commonDocuments?.length > 0 || formData.previousDoc?.sellerDocuments?.length > 0 ? (
          <div className="space-y-4">
            {formData.previousDoc?.commonDocuments?.length > 0 && (
              <div>
                <h3 className="font-medium text-purple-700 mb-2">பொதுவான ஆவணங்கள்</h3>
                <div className="space-y-2">
                  {formData.previousDoc.commonDocuments.map((doc: any, index: number) => (
                    <div key={index} className="bg-purple-50 p-3 rounded-lg">
                      <p className="font-medium">{doc.documentNumber || "Document"}</p>
                      <p className="text-sm text-gray-600">{doc.documentType || "Unknown Type"}</p>
                      <p className="text-sm text-gray-600">{doc.documentDate || "No Date"}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {formData.previousDoc?.sellerDocuments?.length > 0 && (
              <div>
                <h3 className="font-medium text-purple-700 mb-2">விற்பனையாளர் ஆவணங்கள்</h3>
                <div className="space-y-2">
                  {formData.previousDoc.sellerDocuments.map((doc: any, index: number) => {
                    const seller = Array.isArray(formData.seller)
                      ? formData.seller.find((s: any) => s.id.toString() === doc.sellerId)
                      : null
                    return (
                      <div key={index} className="bg-purple-50 p-3 rounded-lg">
                        {seller && <p className="text-sm text-purple-600 mb-1">விற்பனையாளர்: {seller.name}</p>}
                        <p className="font-medium">{doc.documentNumber || "Document"}</p>
                        <p className="text-sm text-gray-600">{doc.documentType || "Unknown Type"}</p>
                        <p className="text-sm text-gray-600">{doc.documentDate || "No Date"}</p>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        ) : (
          <p className="text-gray-500 italic">முந்தைய ஆவண விவரங்கள் எதுவும் சேர்க்கப்படவில்லை</p>
        )}
      </div>

      {/* Signature Section */}
      <div className="mt-12">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="border-t-2 border-gray-400 pt-2 mt-16">
              <p className="font-medium">விற்பனையாளர் கையொப்பம்</p>
              <p className="text-sm text-gray-600">(Seller's Signature)</p>
            </div>
          </div>
          <div className="text-center">
            <div className="border-t-2 border-gray-400 pt-2 mt-16">
              <p className="font-medium">வாங்குபவர் கையொப்பம்</p>
              <p className="text-sm text-gray-600">(Buyer's Signature)</p>
            </div>
          </div>
          <div className="text-center">
            <div className="border-t-2 border-gray-400 pt-2 mt-16">
              <p className="font-medium">சாட்சி கையொப்பம்</p>
              <p className="text-sm text-gray-600">(Witness's Signature)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
