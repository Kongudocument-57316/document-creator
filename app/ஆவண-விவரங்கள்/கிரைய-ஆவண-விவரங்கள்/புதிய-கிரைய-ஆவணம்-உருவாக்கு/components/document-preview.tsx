"use client"

import { useRef, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Loader2 } from "lucide-react"
import { generatePDF } from "@/lib/pdf-utils"
import { toast } from "sonner"

export default function DocumentPreview({ formData }) {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const documentRef = useRef(null)

  const formatDate = (dateString) => {
    if (!dateString) return ""

    const date = new Date(dateString)
    return date.toLocaleDateString("ta-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatCurrency = (amount) => {
    if (!amount) return "0.00"
    return amount.toLocaleString("ta-IN", {
      style: "currency",
      currency: "INR",
    })
  }

  const formatCurrencyInWords = (amount) => {
    if (!amount) return ""
    const formatter = new Intl.NumberFormat("ta-IN", {
      style: "decimal",
    })
    return formatter.format(amount)
  }

  const primaryBuyer = formData.buyers?.[0] || {}
  const primarySeller = formData.sellers?.[0] || {}

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true)
    try {
      // ஆவண எண் இருந்தால் அதை பயன்படுத்தி, இல்லையெனில் இயல்புநிலை பெயரைப் பயன்படுத்தவும்
      const fileName = formData.basicDetails?.documentNumber
        ? `கிரைய-ஆவணம்-${formData.basicDetails.documentNumber}`
        : "கிரைய-ஆவணம்"

      const success = await generatePDF("document-preview-content", fileName)
      if (success) {
        toast.success("ஆவணம் வெற்றிகரமாக PDF வடிவில் பதிவிறக்கப்பட்டது")
      } else {
        toast.error("PDF உருவாக்கத்தில் பிழை ஏற்பட்டது")
      }
    } catch (error) {
      console.error("PDF பதிவிறக்கத்தில் பிழை:", error)
      toast.error("PDF பதிவிறக்கத்தில் பிழை ஏற்பட்டது")
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-cyan-700">ஆவண முன்னோட்டம்</h2>
        <Button
          onClick={handleDownloadPDF}
          disabled={isGeneratingPDF}
          className="bg-cyan-600 hover:bg-cyan-700 text-white"
        >
          {isGeneratingPDF ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              PDF உருவாக்குகிறது...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              PDF பதிவிறக்கம்
            </>
          )}
        </Button>
      </div>

      <div id="document-preview-content" ref={documentRef} className="space-y-6 font-tamil">
        <Card className="border-2 border-gray-300">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">கிரையம் ரூ.{formData.paymentDetails?.totalValue || "/-"}</h2>
              <p>{formatDate(formData.basicDetails?.registrationDate)}</p>
            </div>

            {/* Payment method details - will show based on payment method */}
            <div className="mb-4">
              <p>
                மேற்படி வகையில் பாத்தியப்பட்டு என்னுடைய அனுபோக சுவாதீனத்தில் இருந்து வருகின்ற இதனடியிற்க்காணும் சொத்தை நான் தங்களுக்கு ரூ.
                {formatCurrency(formData.paymentDetails?.totalValue)}/-(ரூபாய்{" "}
                {formatCurrencyInWords(formData.paymentDetails?.totalValue)} மட்டும்) விலைக்கு பேசி கொடுப்பதாக ஒப்புக்கொண்டு
                மேற்படி கிரையத் தொகை எனக்கு வரவானதுக்கான விவரம்:-
              </p>

              {/* Conditionally render payment method details based on selected method */}
              {formData.paymentDetails?.paymentMethod === "cheque" && (
                <p className="mt-2">
                  கிரையம் எழுதி பெறும் {primaryBuyer.name} அவர்களின் {formData.paymentDetails?.buyerBankName || ""},
                  {formData.paymentDetails?.buyerBankBranch || ""}, {formData.paymentDetails?.buyerAccountType || ""}
                  {formData.paymentDetails?.buyerAccountNumber || ""}-இதன் வங்கிக் காசோலை எண்:-
                  {formData.paymentDetails?.paymentReference || ""}-மூலம், கிரையம் எழுதி கொடுக்கும் {primarySeller.name}
                  அவர்களின் பெயரில் வழங்கிய தொகை ரூ.
                  {formatCurrency(formData.paymentDetails?.paymentAmount)}/-(ரூபாய்{" "}
                  {formatCurrencyInWords(formData.paymentDetails?.paymentAmount)}) மட்டும்
                  {formData.paymentDetails?.paymentDate && formatDate(formData.paymentDetails.paymentDate)}-ம் தேதியில்
                  வரவாகி விட்டபடியால், கீழ்க்கண்ட சொத்துக்களை இன்று தங்களுக்கு சுத்தக் கிரையமும் சுவாதீனமும் செய்து கொடுத்திருக்கின்றேன்.
                </p>
              )}

              {formData.paymentDetails?.paymentMethod === "dd" && (
                <p className="mt-2">
                  கிரையம் எழுதி பெறும் {primaryBuyer.name} அவர்களின் {formData.paymentDetails?.buyerBankName || ""},
                  {formData.paymentDetails?.buyerBankBranch || ""}, {formData.paymentDetails?.buyerAccountType || ""}
                  {formData.paymentDetails?.buyerAccountNumber || ""}-இதன் வங்கி வரைவோலை எண்:-
                  {formData.paymentDetails?.paymentReference || ""}-மூலம், கிரையம் எழுதி கொடுக்கும் {primarySeller.name}
                  அவர்களின் பெயரில் வழங்கிய தொகை ரூ.
                  {formatCurrency(formData.paymentDetails?.paymentAmount)}/-(ரூபாய்{" "}
                  {formatCurrencyInWords(formData.paymentDetails?.paymentAmount)}) மட்டும்
                  {formData.paymentDetails?.paymentDate && formatDate(formData.paymentDetails.paymentDate)}-ம் தேதியில்
                  வரவாகி விட்டபடியால், கீழ்க்கண்ட சொத்துக்களை இன்று தங்களுக்கு சுத்தக் கிரையமும் சுவாதீனமும் செய்து கொடுத்திருக்கின்றேன்.
                </p>
              )}

              {formData.paymentDetails?.paymentMethod === "upi" && (
                <p className="mt-2">
                  கிரையம் பெறும் {primaryBuyer.name} அவர்களின் {formData.paymentDetails?.buyerBankName || ""},
                  {formData.paymentDetails?.buyerBankBranch || ""}, {formData.paymentDetails?.buyerAccountType || ""}
                  {formData.paymentDetails?.buyerAccountNumber || ""}-இதிலிருந்து, எனது{" "}
                  {formData.paymentDetails?.sellerBankName || ""},{formData.paymentDetails?.sellerBankBranch || ""},{" "}
                  {formData.paymentDetails?.sellerAccountType || ""}
                  {formData.paymentDetails?.sellerAccountNumber || ""}-க்கு வங்கி மின்னணு பரிவர்த்தனை எண்.(G-PAY-UPI):-
                  {formData.paymentDetails?.paymentReference || ""}-மூலம் ரூ.
                  {formatCurrency(formData.paymentDetails?.paymentAmount)}/-(ரூபாய்{" "}
                  {formatCurrencyInWords(formData.paymentDetails?.paymentAmount)}) மட்டும்
                  {formData.paymentDetails?.paymentDate && formatDate(formData.paymentDetails.paymentDate)}-ம் தேதியில்
                  எனக்கு வரவாகி விட்டபடியால், கீழ்க்கண்ட சொத்துக்களை இன்று தங்களுக்கு சுத்தக் கிரையமும் சுவாதீனமும் செய்து கொடுத்திருக்கின்றேன்.
                </p>
              )}

              {formData.paymentDetails?.paymentMethod === "neft" && (
                <p className="mt-2">
                  கிரையம் பெறும் {primaryBuyer.name} அவர்களின் {formData.paymentDetails?.buyerBankName || ""},
                  {formData.paymentDetails?.buyerBankBranch || ""}, {formData.paymentDetails?.buyerAccountType || ""}
                  {formData.paymentDetails?.buyerAccountNumber || ""}-இதிலிருந்து, எனது{" "}
                  {formData.paymentDetails?.sellerBankName || ""},{formData.paymentDetails?.sellerBankBranch || ""},{" "}
                  {formData.paymentDetails?.sellerAccountType || ""}
                  {formData.paymentDetails?.sellerAccountNumber || ""}-க்கு வங்கி மின்னணு பரிவர்த்தனை எண்.(NEFT):-
                  {formData.paymentDetails?.paymentReference || ""}-மூலம் ரூ.
                  {formatCurrency(formData.paymentDetails?.paymentAmount)}/-(ரூபாய்{" "}
                  {formatCurrencyInWords(formData.paymentDetails?.paymentAmount)}) மட்டும்
                  {formData.paymentDetails?.paymentDate && formatDate(formData.paymentDetails.paymentDate)}-ம் தேதியில்
                  எனக்கு வரவாகி விட்டபடியால், கீழ்க்கண்ட சொத்துக்களை இன்று தங்களுக்கு சுத்தக் கிரையமும் சுவாதீனமும் செய்து கொடுத்திருக்கின்றேன்.
                </p>
              )}

              {formData.paymentDetails?.paymentMethod === "rtgs" && (
                <p className="mt-2">
                  கிரையம் பெறும் {primaryBuyer.name} அவர்களின் {formData.paymentDetails?.buyerBankName || ""},
                  {formData.paymentDetails?.buyerBankBranch || ""}, {formData.paymentDetails?.buyerAccountType || ""}
                  {formData.paymentDetails?.buyerAccountNumber || ""}-இதிலிருந்து, எனது{" "}
                  {formData.paymentDetails?.sellerBankName || ""},{formData.paymentDetails?.sellerBankBranch || ""},{" "}
                  {formData.paymentDetails?.sellerAccountType || ""}
                  {formData.paymentDetails?.sellerAccountNumber || ""}-க்கு வங்கி மின்னணு பரிவர்த்தனை எண்.(RTGS):-
                  {formData.paymentDetails?.paymentReference || ""}-மூலம் ரூ.
                  {formatCurrency(formData.paymentDetails?.paymentAmount)}/-(ரூபாய்{" "}
                  {formatCurrencyInWords(formData.paymentDetails?.paymentAmount)}) மட்டும்
                  {formData.paymentDetails?.paymentDate && formatDate(formData.paymentDetails.paymentDate)}-ம் தேதியில்
                  எனக்கு வரவாகி விட்டபடியால், கீழ்க்கண்ட சொத்துக்களை இன்று தங்களுக்கு சுத்தக் கிரையமும் சுவாதீனமும் செய்து கொடுத்திருக்கின்றேன்.
                </p>
              )}

              {formData.paymentDetails?.paymentMethod === "imps" && (
                <p className="mt-2">
                  கிரையம் பெறும் {primaryBuyer.name} அவர்களின் {formData.paymentDetails?.buyerBankName || ""},
                  {formData.paymentDetails?.buyerBankBranch || ""}, {formData.paymentDetails?.buyerAccountType || ""}
                  {formData.paymentDetails?.buyerAccountNumber || ""}-இதிலிருந்து, எனது{" "}
                  {formData.paymentDetails?.sellerBankName || ""},{formData.paymentDetails?.sellerBankBranch || ""},{" "}
                  {formData.paymentDetails?.sellerAccountType || ""}
                  {formData.paymentDetails?.sellerAccountNumber || ""}-க்கு வங்கி மின்னணு பரிவர்த்தனை எண்.(IMPS):-
                  {formData.paymentDetails?.paymentReference || ""}-மூலம் ரூ.
                  {formatCurrency(formData.paymentDetails?.paymentAmount)}/-(ரூபாய்{" "}
                  {formatCurrencyInWords(formData.paymentDetails?.paymentAmount)}) மட்டும்
                  {formData.paymentDetails?.paymentDate && formatDate(formData.paymentDetails.paymentDate)}-ம் தேதியில்
                  எனக்கு வரவாகி விட்டபடியால், கீழ்க்கண்ட சொத்துக்களை இன்று தங்களுக்கு சுத்தக் கிரையமும் சுவாதீனமும் செய்து கொடுத்திருக்கின்றேன்.
                </p>
              )}

              {formData.paymentDetails?.paymentMethod === "cash" && (
                <p className="mt-2">
                  மேற்படி கிரையத் தொகை ரூ.{formatCurrency(formData.paymentDetails?.paymentAmount)}/-(ரூபாய்{" "}
                  {formatCurrencyInWords(formData.paymentDetails?.paymentAmount)}) மட்டும் கீழ்க்கண்ட சாட்சிகள் முன்பாக நான் ரொக்கமாகப்
                  பெற்றுக்கொண்டு கீழ்க்கண்ட சொத்துக்களை இன்று தங்களுக்கு சுத்தக்கிரையமும் சுவாதீனமும் செய்து கொடுத்திருக்கின்றேன்.
                </p>
              )}
            </div>

            <div className="space-y-4">
              {formData.basicDetails?.documentNumber && (
                <div>
                  <p className="font-medium">ஆவண எண்: {formData.basicDetails.documentNumber}</p>
                </div>
              )}

              {formData.buyers?.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium mb-2">கிரையம் வாங்கியவர்:</h3>
                  {formData.buyers.map((buyer, index) => (
                    <div key={index} className="ml-4 mb-2">
                      <p>{buyer.name}</p>
                      {buyer.relationDetails && <p>{buyer.relationDetails}</p>}
                      {buyer.address && <p>முகவரி: {buyer.address}</p>}
                    </div>
                  ))}
                </div>
              )}

              {formData.sellers?.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium mb-2">கிரையம் கொடுத்தவர்:</h3>
                  {formData.sellers.map((seller, index) => (
                    <div key={index} className="ml-4 mb-2">
                      <p>{seller.name}</p>
                      {seller.relationDetails && <p>{seller.relationDetails}</p>}
                      {seller.address && <p>முகவரி: {seller.address}</p>}
                    </div>
                  ))}
                </div>
              )}

              {formData.propertyDetails?.propertyName && (
                <div>
                  <h3 className="text-lg font-medium mb-2">சொத்து விவரங்கள்:</h3>
                  <div className="ml-4">
                    <p>{formData.propertyDetails.propertyName}</p>
                    {formData.propertyDetails.surveyNumber && <p>சர்வே எண்: {formData.propertyDetails.surveyNumber}</p>}
                    {formData.propertyDetails.propertyDetails && <p>{formData.propertyDetails.propertyDetails}</p>}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {formData.witnesses?.length > 0 && (
          <Card className="border-2 border-gray-300 mt-4">
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4">சாட்சிகள்:</h3>

              {formData.witnesses.map((witness, index) => (
                <div key={index} className="mb-4">
                  <p>
                    {index + 1}. பெயர்: {witness.name}
                  </p>
                  <p className="ml-3">முகவரி: {witness.address}</p>
                </div>
              ))}

              <div className="grid grid-cols-2 gap-4 mt-6">
                <div>
                  <p className="font-medium">கிரையம் வாங்கியவர்:</p>
                  {formData.buyers?.[0]?.name && <p>{formData.buyers[0].name}</p>}
                  {formData.buyers?.[0]?.address && <p>முகவரி: {formData.buyers[0].address}</p>}
                </div>

                <div>
                  <p className="font-medium">கிரையம் கொடுத்தவர்:</p>
                  {formData.sellers?.[0]?.name && <p>{formData.sellers[0].name}</p>}
                  {formData.sellers?.[0]?.address && <p>முகவரி: {formData.sellers[0].address}</p>}
                </div>
              </div>

              <div className="mt-6">
                <p className="font-medium">ஆவணம் எழுதியவர்:</p>
                <p>பெயர்: </p>
                <p>முகவரி: </p>
              </div>

              <div className="mt-6 border-t pt-4">
                <p className="text-center">கைரேகை</p>
                <p className="text-center">(கிரையம் கொடுத்தவர்)</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
