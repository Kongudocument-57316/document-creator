"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { exportToDocx, exportToPdf } from "../create/export-utils"
import { FileDown, FileText, Printer } from "lucide-react"
import { formatDate } from "@/lib/utils"

interface DocumentPreviewProps {
  document: any
}

export function DocumentPreview({ document }: DocumentPreviewProps) {
  if (!document) return null

  const handlePrint = () => {
    window.print()
  }

  const handleExportDocx = exportToDocx("#document-preview", document.document_name || "கிர���ய-உடன்படிக்கை")
  const handleExportPdf = exportToPdf("#document-preview", document.document_name || "கிரைய-உடன்படிக்கை")

  // Format the document date
  const documentDate = document.document_date ? formatDate(new Date(document.document_date)) : ""

  // Format buyers and sellers for display
  const formatParty = (party: any) => {
    if (!party.users) return ""
    const user = party.users
    return `${user.name}, த/பெ ${user.father_name}, வயது ${user.age}, ${user.gender === "male" ? "ஆண்" : "பெண்"}, ${user.address}`
  }

  const buyersList = document.buyers?.map((buyer: any) => formatParty(buyer)).join(", ")
  const sellersList = document.sellers?.map((seller: any) => formatParty(seller)).join(", ")

  // Determine pluralization based on number of buyers and sellers
  const buyerPlural = document.buyers?.length > 1 ? "வாங்குபவர்கள்" : "வாங்குபவர்"
  const sellerPlural = document.sellers?.length > 1 ? "விற்பவர்கள்" : "விற்பவர்"
  const partiesPlural = (document.buyers?.length || 0) + (document.sellers?.length || 0) > 2 ? "அனைவரும்" : "இருவரும்"

  return (
    <div className="relative">
      <div className="flex justify-end gap-2 mb-4 print:hidden">
        <Button variant="outline" size="sm" onClick={handlePrint}>
          <Printer className="mr-2 h-4 w-4" />
          அச்சிடு
        </Button>
        <Button variant="outline" size="sm" onClick={handleExportDocx}>
          <FileText className="mr-2 h-4 w-4" />
          DOCX பதிவிறக்கு
        </Button>
        <Button variant="outline" size="sm" onClick={handleExportPdf}>
          <FileDown className="mr-2 h-4 w-4" />
          PDF பதிவிறக்கு
        </Button>
      </div>

      <Card className="border shadow-sm">
        <CardContent className="p-6">
          <div id="document-preview" className="text-black">
            <h1 className="text-3xl font-bold text-center mb-4">கிரைய உடன்படிக்கை</h1>

            {documentDate && <p className="text-lg text-center mb-6">{documentDate}</p>}

            {/* Parties information */}
            {(buyersList || sellersList) && (
              <div className="mb-6 text-justify">
                <p>
                  {sellersList && (
                    <span>
                      <strong>{sellerPlural}:</strong> {sellersList}
                    </span>
                  )}
                  {buyersList && sellersList && <span> மற்றும் </span>}
                  {buyersList && (
                    <span>
                      <strong>{buyerPlural}:</strong> {buyersList}
                    </span>
                  )}{" "}
                  ஆகிய {partiesPlural} இந்த கிரைய உடன்படிக்கையை செய்துகொள்கிறோம்.
                </p>
              </div>
            )}

            {/* Previous document details */}
            {document.previous_document_date && (
              <div className="mb-6 text-justify">
                <p>
                  <strong>முந்தைய ஆவண விவரம்:</strong> {formatDate(new Date(document.previous_document_date))} அன்று பதிவு
                  செய்யப்பட்ட ஆவணம் எண் {document.document_number || ""}, {document.documentType?.name || ""} ஆவணத்தின்படி இந்த
                  சொத்து {sellerPlural}க்கு சொந்தமானது.
                </p>
              </div>
            )}

            {/* Payment details */}
            {document.agreement_amount && (
              <div className="mb-6 text-justify">
                <p>
                  <strong>விற்பனை தொகை:</strong> ரூ. {document.agreement_amount} (ரூபாய்{" "}
                  {document.agreement_amount_words || ""} மட்டும்). இந்த தொகையை{" "}
                  {document.payment_methods?.join(", ") || "பணமாக"} மூலம் {sellerPlural} பெற்றுக்கொண்டார்
                  {document.sellers?.length > 1 ? "கள்" : ""}.
                </p>
              </div>
            )}

            {/* Property rights */}
            <div className="mb-6 text-justify">
              <p>
                இந்த உடன்படிக்கையின் மூலம், மேலே குறிப்பிடப்பட்ட சொத்தின் முழு உரிமையும் {buyerPlural}க்கு மாற்றப்படுகிறது. இந்த சொத்தின்
                மீது {sellerPlural}க்கு இனி எந்த உரிமையும் இல்லை.
              </p>
            </div>

            {/* Property Details Section */}
            <div className="mb-6">
              <h3 className="text-lg font-bold mb-2">சொத்து விவரங்கள்:</h3>
              {document.properties && document.properties.length > 0 ? (
                document.properties.map((property, index) => (
                  <div key={index} className="mb-4 border-b pb-4 last:border-b-0">
                    <p>
                      <strong>சொத்து {index + 1}:</strong> {property.name}
                    </p>
                    <p>
                      <strong>சர்வே எண்:</strong> {property.surveyNo}
                    </p>
                    <p>
                      <strong>பரப்பளவு:</strong> {property.area}
                    </p>
                    <p>
                      <strong>மதிப்பு:</strong> {property.value}
                    </p>
                    <p>
                      <strong>விளக்கம்:</strong> {property.description}
                    </p>
                  </div>
                ))
              ) : (
                <p>சொத்து விவரங்கள் இல்லை</p>
              )}
            </div>

            {/* Agreement terms */}
            {document.agreement_terms && document.agreement_terms.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">உடன்படிக்கை நிபந்தனைகள்</h3>
                <ol className="list-decimal pl-5">
                  {document.agreement_terms.map((term: string, index: number) => (
                    <li key={index} className="mb-1">
                      {term}
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* Signatures */}
            <div className="flex justify-between mt-8 mb-6">
              <div className="text-center">
                <p className="font-semibold">{sellerPlural}</p>
                <p className="mt-16">{sellersList}</p>
              </div>
              <div className="text-center">
                <p className="font-semibold">{buyerPlural}</p>
                <p className="mt-16">{buyersList}</p>
              </div>
            </div>

            {/* Witnesses */}
            {document.witnesses && document.witnesses.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">சாட்சிகள்</h3>
                <ol className="list-decimal pl-5">
                  {document.witnesses.map((witness: any, index: number) => (
                    <li key={index} className="mb-1">
                      {witness.users?.name || ""}, {witness.users?.address || ""}
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* Typist details */}
            {document.typist && (
              <div className="mb-6 text-right">
                <p>
                  தட்டச்சு செய்தவர்: {document.typist.name || ""},
                  {document.typist_phone ? ` தொலைபேசி: ${document.typist_phone}` : ""}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
