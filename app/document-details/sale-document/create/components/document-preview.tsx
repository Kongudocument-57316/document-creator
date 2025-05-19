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
    const options = { year: "numeric", month: "long", day: "numeric" }
    return date.toLocaleDateString("ta-IN", options)
  }

  const formatCurrency = (amount) => {
    if (!amount) return "0"
    return new Intl.NumberFormat("ta-IN").format(amount)
  }

  const formatCurrencyInWords = (amount) => {
    if (!amount) return "சுழியம்"

    // This is a placeholder - in a real application you'd implement
    // a proper number-to-Tamil-words converter
    return `${amount} (எழுத்தில்)`
  }

  // Get primary buyer and seller for easier access
  const primaryBuyer = formData.buyers && formData.buyers.length > 0 ? formData.buyers[0] : {}
  const primarySeller = formData.sellers && formData.sellers.length > 0 ? formData.sellers[0] : {}

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true)
    try {
      // ஆவண எண் இருந்தால் அதை பயன்படுத்தி, இல்லையெனில் இயல்புநிலை பெயரைப் பயன்படுத்தவும்
      const fileName = formData.basicDetails?.documentNumber
        ? `sale-document-${formData.basicDetails.documentNumber}`
        : "sale-document"

      const success = await generatePDF("document-preview-content", fileName)
      if (success) {
        toast.success("Document successfully downloaded as PDF")
      } else {
        toast.error("Error generating PDF")
      }
    } catch (error) {
      console.error("Error generating PDF:", error)
      toast.error("Error downloading PDF")
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold mb-4 text-cyan-700">Document Preview</h2>
        <Button
          onClick={handleDownloadPDF}
          disabled={isGeneratingPDF}
          className="bg-cyan-600 hover:bg-cyan-700 text-white"
        >
          {isGeneratingPDF ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating PDF...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </>
          )}
        </Button>
      </div>

      <div
        id="document-preview-content"
        ref={documentRef}
        className="space-y-6 font-tamil text-justify leading-relaxed"
      >
        <Card className="border-2 border-gray-300">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">
                கிரையம் ரூ.{formatCurrency(formData.paymentDetails?.totalValue)}/-{" "}
              </h2>
              <p>{formatDate(formData.basicDetails?.registrationDate)}</p>
            </div>

            <div className="mb-4">
              {primaryBuyer.address && (
                <p>
                  {formData.basicDetails?.registrationDate &&
                    new Date(formData.basicDetails.registrationDate).getFullYear()}
                  -ம் வருடம்{" "}
                  {formData.basicDetails?.registrationDate &&
                    new Date(formData.basicDetails.registrationDate).toLocaleString("ta-IN", { month: "long" })}{" "}
                  மாதம்{" "}
                  {formData.basicDetails?.registrationDate &&
                    new Date(formData.basicDetails.registrationDate).getDate()}
                  -ம் தேதியில்
                  <br />
                  {/* Here we would add district, pincode, etc. - placeholder for now */}
                  {primaryBuyer.address} என்ற முகவரியில் வசித்து வருபவரும், {primaryBuyer.relationDetails}
                  அவர்களின் {/* Relation type would go here */} {/* Age would go here */} வயதுடைய {primaryBuyer.name}
                  (ஆதார் அடையாள அட்டை எண்:-{primaryBuyer.aadhaarNumber}, கைப்பேசி எண்:-{primaryBuyer.phone}) ஆகிய தங்களுக்கு
                </p>
              )}
            </div>

            <div className="mb-4">
              {primarySeller.address && (
                <p>
                  {/* Here we would add district, pincode, etc. - placeholder for now */}
                  {primarySeller.address} என்ற முகவரியில் வசித்து வருபவரும், {primarySeller.relationDetails}
                  அவர்களின் {/* Relation type would go here */} {/* Age would go here */} வயதுடைய {primarySeller.name}
                  (ஆதார் அடையாள அட்டை எண்:-{primarySeller.aadhaarNumber}, கைப்பேசி எண்:-{primarySeller.phone}) ஆகிய நான் எழுதிக்
                  கொடுத்த சுத்தக்கிரைய சாசனப்பத்திரத்திற்கு விவரம் என்னவென்றால்,
                </p>
              )}
            </div>

            {/* Previous document details */}
            {formData.previousDocuments && formData.previousDocuments.length > 0 && (
              <div className="mb-4">
                <p>
                  எனக்கு கடந்த{" "}
                  {formData.previousDocuments[0].registrationDate &&
                    formatDate(formData.previousDocuments[0].registrationDate)}
                  -ம் தேதியில்,
                  {/* Sub Registrar Office placeholder */} சார்பதிவாளர் அலுவலகத்தில் {/* Book number placeholder */} புத்தகம்
                  {/* Document year placeholder */}-ம் ஆண்டின் {formData.previousDocuments[0].documentNumber}-ம் எண்ணாக பதிவு
                  செய்யப்பட்ட {/* Document type placeholder */} ஆவணத்தின் படி பாத்தியப்பட்டதாகும்.
                </p>
              </div>
            )}

            {/* Property and payment details */}
            <div className="mb-4">
              <p>
                மேற்படி வகையில் பாத்தியப்பட்டு என்னுடைய அனுபோக சுவாதீனத்தில் இருந்து வருகின்ற இதனடியிற்க்காணும் சொத்தை நான் தங்களுக்கு ரூ.
                {formatCurrency(formData.paymentDetails?.totalValue)}/-(ரூபாய்{" "}
                {formatCurrencyInWords(formData.paymentDetails?.totalValue)} மட்டும்) விலைக்கு பேசி கொடுப்பதாக ஒப்புக்கொண்டு
                மேற்படி கிரையத் தொகையை கீழ்க்கண்ட சாட்சிகள் முன்பாக நான் ரொக்கமாகப் பெற்றுக்கொண்டு கீழ்க்கண்ட சொத்துக்களை இன்று தங்களுக்கு
                சுத்தக்கிரையமும் சுவாதீனமும் செய்து கொடுத்திருக்கின்றேன்.
              </p>
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
                  {formatCurrencyInWords(formData.paymentDetails?.paymentAmount)} மட்டும்
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
                  {formatCurrencyInWords(formData.paymentDetails?.paymentAmount)} மட்டும்
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
                  {formatCurrencyInWords(formData.paymentDetails?.paymentAmount)} மட்டும்
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
                  {formatCurrencyInWords(formData.paymentDetails?.paymentAmount)} மட்டும்
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
                  {formatCurrencyInWords(formData.paymentDetails?.paymentAmount)} மட்டும்
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
                  {formatCurrencyInWords(formData.paymentDetails?.paymentAmount)} மட்டும்
                  {formData.paymentDetails?.paymentDate && formatDate(formData.paymentDetails.paymentDate)}-ம் தேதியில்
                  எனக்கு வரவாகி விட்டபடியால், கீழ்க்கண்ட சொத்துக்களை இன்று தங்களுக்கு சுத்தக் கிரையமும் சுவாதீனமும் செய்து கொடுத்திருக்கின்றேன்.
                </p>
              )}

              {formData.paymentDetails?.paymentMethod === "cash" && (
                <p className="mt-2">
                  மேற்படி கிரையத் தொகை ரூ.{formatCurrency(formData.paymentDetails?.paymentAmount)}/-(ரூபாய்{" "}
                  {formatCurrencyInWords(formData.paymentDetails?.paymentAmount)} மட்டும் கீழ்க்கண்ட சாட்சிகள் முன்பாக நான் ரொக்கமாகப்
                  பெற்றுக்கொண்டு கீழ்க்கண்ட சொத்துக்களை இன்று தங்களுக்கு சுத்தக்கிரையமும் சுவாதீனமும் செய்து கொடுத்திருக்கின்றேன்.
                </p>
              )}
            </div>

            {/* Legal clauses */}
            <div className="mb-4">
              <p>
                கிரைய சொத்தை இது முதல் தாங்களே சர்வ சுதந்திர பாத்தியத்துடனும் தானாதி வினியோக விற்கிரையங்களுக்கு யோக்கியமாகவும் அடைந்து
                ஆண்டனுபவித்துக் கொள்ள வேண்டியது.
              </p>
              <p className="mt-2">
                கிரையச் சொத்தை குறித்து இனிமேல் எனக்கும், எனக்கு பின்னிட்ட எனது இதர ஆண், பெண் வாரிசுகளுக்கும் இனி எவ்வித பாத்தியமும்
                சம்மந்தமும் பின் தொடர்ச்சியும் உரிமையும் இல்லை.
              </p>
              <p className="mt-2">
                கிரைய சொத்துக்களின் பேரில் யாதொரு முன் வில்லங்க விவகாரம், கடன், கோர்ட் நடவடிக்கைகள் முதலியவை ஏதுமில்லையென்றும் உண்மையாகவும்
                உறுதியாகவும் சொல்கின்றேன்.
              </p>
              <p className="mt-2">
                பின்னிட்டு அப்படி ஒருகால் ஏதேனும் முன் வில்லங்க விவகாரம், அடமானம், கிரைய உடன்படிக்கை, கோர்ட் நடவடிக்கைகள், போக்கியம்,
                ஈக்விடபுள் மார்ட்கேஜ் முதலியவை ஏதுமிருப்பதாகத் தெரியவரும் பட்சத்தில் அவற்றை நானே முன்னின்று எனது சொந்த செலவிலும், சொந்த
                பொறுப்பிலும் எனது இதர சொத்துக்களைக் கொண்டு நானே ஜவாப்தாரியாய் இருந்து கிரைய சொத்துக்கு நஷ்டம் ஏற்படாதவாறு நானே முன்னின்று
                தீர்த்துக் கொடுக்க இதன் மூலம் உறுதி கூறுகிறேன்.
              </p>
              <p className="mt-2">
                கிரைய பத்திரத்தில் எழுதிக்கொடுப்பவருக்கு முழு உரிமையும் சுவாதீனமும் உள்ளது என எழுதிவாங்குபவருக்கு, எழுதிக்கொடுப்பவர்
                உறுதியளித்ததின் பேரிலும், எழுதிக்கொடுப்பவர் அளித்த பதிவுருக்களை எழுதிவாங்குபவர் ஆய்வு செய்து, அதன் பேரில் இந்த கிரைய
                ஆவணம் தயார் செய்யப்பட்டு எழுதிவாங்குபவர், எழுதிக்கொடுப்பவர் என இரு தரப்பினரும் படித்துப்பார்த்தும் படிக்கச்சொல்லி கேட்டும் மன
                நிறைவு அடைந்ததன் பேரிலும் இக்கிரைய ஆவணம் பதிவு செய்யப்படுகிறது.
              </p>
              <p className="mt-2">
                பிற்காலத்தில் கிரைய ஆவணத்தில் ஏதேனும் பிழைகள் ஏற்பட்டதாக வாங்குபவர் கருதினால், சம்பந்தப்பட்ட சார்பதிவாளர் அலுவலகம் வந்து பிழை
                திருத்தல் ஆவணத்தில் எந்தவொரு பிரதி பிரயோஜனமும் பெற்றுக் கொள்ளாமல் பிழையைத் திருத்திக் கொடுக்க நான் கடமைப்பட்டவர் ஆவேன்.
              </p>
              <p className="mt-2">
                மேற்படி நான் பிழைத்திருத்தல் பத்திரம் எழுதிக்கொடுக்க தவறினால், மேற்படி கிரையம் பெறும் தாங்களே உறுதிமொழி ஆவணம் எழுதி, அதன்
                மூலம் பிழையை திருத்திக் கொள்ள வேண்டியது.
              </p>
              <p className="mt-2">
                கீழ்க்கண்ட கிரைய சொத்தின் பட்டா தங்கள் பெயருக்கு மாறும் பொருட்டு பட்டா மாறுதல் மனுவும் இத்துடன் தாக்கல் செய்கின்றேன்.
              </p>
            </div>

            {/* Previous document reference */}
            {formData.previousDocuments && formData.previousDocuments.length > 0 && (
              <div className="mb-4">
                <p>
                  மேலே சொன்ன {/* Book number placeholder */} புத்தகம் {formData.previousDocuments[0].documentNumber}/
                  {/* Document year placeholder */}
                  க்கு {/* Document type placeholder */} ஆவணத்தின் {/* Original/Copy placeholder */} இக்கிரைய ஆவணத்திற்கு
                  ஆதரவாக தங்களுக்கு கொடுத்திருக்கின்றேன்.
                </p>
              </div>
            )}

            <div className="mb-4">
              <p>
                மேலும் தணிக்கையின் போது இந்த ஆவணம் தொடர்பாக அரசுக்கு இழப்பு ஏற்படின் அத்தொகையை கிரையம் பெறுபவர் செலுத்தவும்
                உறுதியளிக்கிறார்.
              </p>
            </div>

            <div className="flex justify-between mt-6">
              <div>
                <p className="font-bold">எழுதிக்கொடுப்பவர்</p>
                <p>{primarySeller.name}</p>
              </div>
              <div>
                <p className="font-bold">எழுதிவாங்குபவர்</p>
                <p>{primaryBuyer.name}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Property details section */}
        <Card className="border-2 border-gray-300">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-center mb-4">சொத்து விவரம்</h3>
            <div>
              <p>{formData.propertyDetails?.propertyName}</p>
              <p>சர்வே எண்: {formData.propertyDetails?.surveyNumber}</p>
              <p>{formData.propertyDetails?.propertyDetails}</p>
            </div>
          </CardContent>
        </Card>

        {/* Witnesses section */}
        {formData.witnesses && formData.witnesses.length > 0 && (
          <Card className="border-2 border-gray-300">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-4">சாட்சிகள்:</h3>

              {formData.witnesses.map((witness, index) => (
                <div key={index} className="mb-4">
                  <p>
                    {index + 1}. {witness.name}
                    {/* Full details would go here including address, relation, age, Aadhar number */}
                    {witness.address ? `, ${witness.address}` : ""}
                  </p>
                </div>
              ))}

              <div className="mt-6">
                <p>கணினியில் தட்டச்சு செய்து ஆவணம் தயார் செய்தவர்:-{/* Typist name placeholder */}</p>
                {/* Office details placeholder */}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
