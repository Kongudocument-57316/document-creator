"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { format } from "date-fns"
import { useState, useRef, useEffect } from "react"
import { jsPDF } from "jspdf"
import "jspdf-autotable"
import { toPng } from "html-to-image"
import { Document, Packer, Paragraph, HeadingLevel, AlignmentType } from "docx"
import FileSaver from "file-saver"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { AlertCircle, Eye, EyeOff, HighlighterIcon } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import type { SettlementFormValues } from "./create-settlement-document-form"

interface DocumentLivePreviewProps {
  document: SettlementFormValues
  onHighlightField?: (fieldName: string) => void
  isDirty?: boolean
}

export function DocumentLivePreview({ document, onHighlightField, isDirty = false }: DocumentLivePreviewProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = 3
  const previewRef = useRef<HTMLDivElement>(null)
  const [highlightedSection, setHighlightedSection] = useState<string | null>(null)
  const [showHighlights, setShowHighlights] = useState(true)
  const [previewMode, setPreviewMode] = useState<"edit" | "final">("edit")
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  // Update lastUpdated timestamp when document changes
  useEffect(() => {
    if (isDirty) {
      setLastUpdated(new Date())
    }
  }, [document, isDirty])

  const formatDate = (dateString: Date | undefined) => {
    if (!dateString) return ""
    try {
      return format(dateString, "dd-MM-yyyy")
    } catch (error) {
      return ""
    }
  }

  const getRelationshipTypeInTamil = (type: string) => {
    const relationshipTypes: Record<string, string> = {
      father: "தந்தை",
      mother: "தாய்",
      son: "மகன்",
      daughter: "மகள்",
      brother: "சகோதரர்",
      sister: "சகோதரி",
      husband: "கணவர்",
      wife: "மனைவி",
      grandfather: "தாத்தா",
      grandmother: "பாட்டி",
      uncle: "மாமா",
      aunt: "அத்தை",
      nephew: "மருமகன்",
      niece: "மருமகள்",
      other: "மற்றவை",
    }
    return relationshipTypes[type] || type
  }

  const getMonthInTamil = (month: string) => {
    const months: Record<string, string> = {
      january: "ஜனவரி",
      february: "பிப்ரவரி",
      march: "மார்ச்",
      april: "ஏப்ரல்",
      may: "மே",
      june: "ஜூன்",
      july: "ஜூலை",
      august: "ஆகஸ்ட்",
      september: "செப்டம்பர்",
      october: "அக்டோபர்",
      november: "நவம்பர்",
      december: "டிசம்பர்",
    }
    return months[month] || month
  }

  // Helper function to highlight editable fields
  const highlightField = (fieldName: string, value: any, defaultValue = "___") => {
    const isHighlighted = highlightedSection === fieldName && showHighlights
    const displayValue = value || defaultValue

    const handleClick = () => {
      setHighlightedSection(fieldName)
      if (onHighlightField) {
        onHighlightField(fieldName)
      }
    }

    if (previewMode === "final") {
      return <span>{displayValue}</span>
    }

    return (
      <span
        className={`cursor-pointer transition-all duration-200 ${
          isHighlighted
            ? "bg-amber-200 px-1 py-0.5 rounded border border-amber-400"
            : "hover:bg-amber-100 px-1 py-0.5 rounded"
        }`}
        onClick={handleClick}
        data-field={fieldName}
      >
        {displayValue}
      </span>
    )
  }

  const handleClick = (fieldName: string) => {
    if (onHighlightField) {
      onHighlightField(fieldName)
    }
  }

  // Format date if available
  const formattedDate = document.documentDate ? format(new Date(document.documentDate), "dd/MM/yyyy") : "__.__.____"

  const renderPage1 = () => {
    if (!document) return null

    const documentDate = formatDate(document.documentDate)
    const [day, month, year] = documentDate ? documentDate.split("-") : ["", "", ""]

    // Format addresses
    const recipientAddress =
      document.recipientDistrict && document.recipientPincode
        ? `${document.recipientDistrict} மாவட்டம்-${document.recipientPincode}, ${document.recipientTaluk} வட்டம், ${document.recipientAddressLine3 ? document.recipientAddressLine3 + ", " : ""}${document.recipientAddressLine2 ? document.recipientAddressLine2 + ", " : ""}${document.recipientAddressLine1}, கதவு எண்:-${document.recipientDoorNo}`
        : ""

    const donorAddress =
      document.donorDistrict && document.donorPincode
        ? `${document.donorDistrict} மாவட்டம்-${document.donorPincode}, ${document.donorTaluk} வட்டம், ${document.donorAddressLine3 ? document.donorAddressLine3 + ", " : ""}${document.donorAddressLine2 ? document.donorAddressLine2 + ", " : ""}${document.donorAddressLine1}, கதவு எண்:-${document.donorDoorNo}`
        : ""

    const relationshipType = getRelationshipTypeInTamil(document.relationshipType)
    const prDocumentMonth = getMonthInTamil(document.prDocumentMonth)

    // Format date components
    const formattedYear = document.documentDate ? new Date(document.documentDate).getFullYear() : ""
    const formattedMonth = document.documentDate
      ? getMonthInTamil(new Date(document.documentDate).toLocaleString("en-US", { month: "long" }).toLowerCase())
      : ""
    const formattedDay = document.documentDate ? new Date(document.documentDate).getDate() : ""

    return (
      <div className="p-6 bg-white text-black font-serif">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-2">தானசெட்டில்மெண்ட் பத்திரம்</h1>
          <p className="mb-4">({highlightField("relationshipType", relationshipType)})</p>
        </div>

        <div className="mb-6">
          <p className="mb-4">
            {highlightField("documentYear", formattedYear)}-ம் வருடம் {highlightField("documentMonth", formattedMonth)}{" "}
            மாதம் {highlightField("documentDay", formattedDay)}-ம் தேதியில்
          </p>

          <p className="mb-4">
            {highlightField("recipientDistrict", document.recipientDistrict)} மாவட்டம்-
            {highlightField("recipientPincode", document.recipientPincode)},{" "}
            {highlightField("recipientTaluk", document.recipientTaluk)} வட்டம்,{" "}
            {highlightField("recipientAddressLine3", document.recipientAddressLine3)},{" "}
            {highlightField("recipientAddressLine2", document.recipientAddressLine2)},{" "}
            {highlightField("recipientAddressLine1", document.recipientAddressLine1)}, கதவு எண்:-
            {highlightField("recipientDoorNo", document.recipientDoorNo)} என்ற முகவரியில் வசித்து வருபவரும்,{" "}
            {highlightField("recipientRelationName", document.recipientRelationName)} அவர்களின்{" "}
            {highlightField("recipientRelationType", getRelationshipTypeInTamil(document.recipientRelationType))}{" "}
            {highlightField("secondPartyAge", document.secondPartyAge)} வயதுடைய பெறுபவர்{" "}
            {highlightField("secondPartyName", document.secondPartyName)} (ஆதார் அடையாள அட்டை எண்:-
            {highlightField("recipientAadharNo", document.recipientAadharNo)}, கைப்பேசி எண்:-
            {highlightField("recipientPhoneNo", document.recipientPhoneNo)}) ஆகிய தங்களுக்கு,
          </p>

          <p className="mb-4">
            {highlightField("donorDistrict", document.donorDistrict)} மாவட்டம்-
            {highlightField("donorPincode", document.donorPincode)}, {highlightField("donorTaluk", document.donorTaluk)}{" "}
            வட்டம், {highlightField("donorAddressLine3", document.donorAddressLine3)},{" "}
            {highlightField("donorAddressLine2", document.donorAddressLine2)},{" "}
            {highlightField("donorAddressLine1", document.donorAddressLine1)}, கதவு எண்:-
            {highlightField("donorDoorNo", document.donorDoorNo)} என்ற முகவரியில் வசித்து வருபவரும்,{" "}
            {highlightField("donorRelationName", document.donorRelationName)} அவர்களின்{" "}
            {highlightField("donorRelationType", getRelationshipTypeInTamil(document.donorRelationType))}{" "}
            {highlightField("firstPartyAge", document.firstPartyAge)} வயதுடைய கொடுப்பவர்{" "}
            {highlightField("firstPartyName", document.firstPartyName)} (ஆதார் அடையாள அட்டை எண்:-
            {highlightField("donorAadharNo", document.donorAadharNo)}, கைப்பேசி எண்:-
            {highlightField("donorPhoneNo", document.donorPhoneNo)}) ஆகிய நான் எழுதிக்கொடுத்த தானசெட்டில்மெண்ட் பத்திரத்திற்கு விவரம்
            என்னவென்றால்,
          </p>
        </div>

        <div className="mb-6">
          <p className="mb-4">
            இந்த தானசெட்டில்மெண்ட் பத்திரம் பெறும் பெறுபவர் {highlightField("secondPartyName", document.secondPartyName)} ஆகிய
            நீங்கள், எனக்கு கொடுப்பவருக்கு {highlightField("relationshipType", relationshipType)} ஆவீர்கள். நான் உமக்கு பெறுபவருக்கு{" "}
            {highlightField("relationshipType", relationshipType)} ஆவேன்.
          </p>

          <p className="mb-4">
            கீழ்க்கண்ட சொத்து விவரத்தில் விவரிக்கப்பட்டுள்ள சொத்தானது எனக்கு கடந்த{" "}
            {highlightField("prDocumentDate", document.prDocumentDate)}/
            {highlightField("prDocumentMonth", prDocumentMonth)}/
            {highlightField("prDocumentYear", document.prDocumentYear)}-ம் தேதியில்,{" "}
            {highlightField("subRegistrarOffice", document.subRegistrarOffice)} சார்பதிவாளர் அலுவலகம்{" "}
            {highlightField("prBookNo", document.prBookNo)} புத்தகம்{" "}
            {highlightField("prDocumentYear", document.prDocumentYear)}-ம் ஆண்டின்{" "}
            {highlightField("prDocumentNo", document.prDocumentNo)}-ம் எண்ணாக பதிவு செய்யப்பட்ட{" "}
            {highlightField("prDocumentType", document.prDocumentType)} ஆவணத்தின் படி எனக்கு தனித்து பாத்தியப்பட்ட சொத்தாகும்.
          </p>
        </div>

        <div className="mb-6">
          <p className="mb-4">
            மேற்படி வகையில் எனக்கு பாத்தியப்பட்ட சொத்துக்களை இப்பவும், உமது பெயரில் கொண்டுள்ள அன்பினாலும், பிரியத்தினாலும், உங்களது பிற்கால
            வாழ்விற்கு ஒரு ஆதரவு செய்து வைக்க வேண்டும் என்ற நல்ல எண்ணத்தினாலும், சமூகத்தில் உமக்கு ஒரு நல்ல அந்தஸ்த்து கிடைக்க வேண்டும் என்கிற
            என்னுடைய ஆவலினாலும், நான் சர்வ சுதந்திரமாக அடைந்து ஆண்டனுபவித்து வருகின்ற கீழ்க்கண்ட சொத்துக்களை, நாளது தேதியேலேயே உமக்கு இந்த
            தானசெட்டில்மெண்ட் பத்திரம் மூலம் எழுதி, சுவாதீனம் செய்து, நாளது தேதியிலயே உமது வசம் ஒப்படைத்து விட்டேன். தாங்களும் அதைப் பெற்றுக்
            கொண்டுள்ளீர்கள்.
          </p>
        </div>
      </div>
    )
  }

  const renderPage2 = () => {
    if (!document) return null

    return (
      <div className="p-6 bg-white text-black font-serif">
        <div className="text-justify leading-relaxed">
          <div className="mb-4">
            தானசெட்டில்மெண்ட் சொத்துகளை இனி நீங்களே தானாதி விநியோக விற்கிரையங்களுக்கு யோக்கியமாய் சர்வ சுதந்திரமாய் அடைந்து ஆண்டனுபவித்துக் கொள்ள
            வேண்டியது.
          </div>

          <div className="mb-4">
            தானசெட்டில்மெண்ட் சொத்துக்களை குறித்து இனி எனக்காவது, எனக்கு பின்னிட்ட எனது இதர ஆண், பெண் வாரிசுகளுக்காவது எவ்வித பாத்தியமும்
            சம்பந்தமும் பின்தொடர்ச்சியும், உரிமையும் எக்காரணம் கொண்டும், எக்காலத்திலும் இல்லை என உறுதியளிக்கிறேன்.
          </div>

          <div className="mb-4">
            அப்படி ஏதேனும் உரிமை கோரல்கள் எழுந்தால் அத்தகைவகள் எக்காரணம் கொண்டும் செல்லத்தக்கவையல்ல என்றும் உறுதியளிக்கிறேன்.
          </div>

          <div className="mb-4">தானசெட்டில்மெண்ட் சொத்தின் பேரில் எந்த விதமான முன் வில்லங்கமும், விவகாரமும் இல்லை.</div>

          <div className="mb-4">
            அப்படி மீறி ஏதாவது வில்லங்கம் இருந்தாலும் அவ்வில்லங்கத்தை நானே எனது சொந்த பொறுப்பில் மு��் நின்று தீர்த்துக் கொடுக்க உள்ளவர் ஆவேன்.
          </div>

          <div className="mb-4">
            இந்த தானசெட்டில்மெண்ட் பத்திரத்தை எக்காரணம் கொண்டும் ரத்து செய்வதில்லை என்றும், அப்படி மீறி ரத்து செய்தாலும் அது செல்லத்தக்கது அல்ல
            என்றும் உறுதியளிக்கிறேன்.
          </div>

          <div className="mb-4">இந்த தானசெட்டில்மெண்ட் பத்திரத்திற்காக உம்மிடமிருந்து நான் தொகை ஏதும் பெற்றுக் கொள்ளவில்லை.</div>

          <div className="mb-4">
            நான் இதனடியில் கண்ட சொத்தை உமது பெயரில் பட்டா மாறுதல் செய்ய இத்துடன் பட்டா மாறுதல் மனுவும் இத்துடன் தாக்கல் செய்துள்ளேன். இந்தப்படிக்கு
            நான் எனது முழு சம்மதத்துடன் உமக்கு எழுதிக்கொடுத்த தானசெட்டில்மெண்ட் பத்திரம்.
          </div>

          {document.prBookNo &&
            document.prDocumentNo &&
            document.prDocumentYear &&
            document.prDocumentType &&
            document.prDocumentCopyType && (
              <div className="mb-4">
                மேலே சொன்ன {highlightField("prBookNo", document.prBookNo)} புத்தகம்{" "}
                {highlightField("prDocumentNo", document.prDocumentNo)}/
                {highlightField("prDocumentYear", document.prDocumentYear)} ன்{" "}
                {highlightField("prDocumentType", document.prDocumentType)} ஆவணத்தின்{" "}
                {highlightField("prDocumentCopyType", document.prDocumentCopyType === "original" ? "அசல்" : "நகல்")} இந்த
                தானசெட்டில்மெண்ட் ஆவணத்திற்கு ஆதரவாக தங்களுக்கு கொடுத்திருக்கின்றேன்.
              </div>
            )}

          <div className="mb-4">
            மேலும் தணிக்கையின் போது இந்த ஆவணம் தொடர்பாக அரசுக்கு இழப்பு ஏற்படின் அத்தொகையை இந்த தானசெட்டில்மெண்ட் பத்திரம் எழுதி பெறுபவர்
            செலுத்தவும் உறுதியளிக்கிறார்.
          </div>
        </div>
      </div>
    )
  }

  const renderPage3 = () => {
    if (!document) return null

    return (
      <div className="p-6 bg-white text-black font-serif">
        <div className="text-center font-bold text-xl mb-6">சொத்து விவரம்</div>

        <div className="mb-8 whitespace-pre-line">
          {highlightField("propertyDescription", document.propertyDescription)}
        </div>

        <div className="mb-6">
          <div className="font-bold mb-2">சாட்சிகள்:</div>
          <div className="border-t border-b border-gray-300 my-2"></div>

          {document.witness1Name && (
            <div className="mb-4">
              <div className="font-bold">1.</div>
              <div>({highlightField("witness1Name", document.witness1Name)})</div>
              <div>
                {highlightField("witness1RelationType", getRelationshipTypeInTamil(document.witness1RelationType))}.
                {highlightField("witness1RelationName", document.witness1RelationName)}, கதவு எண்:-
                {highlightField("witness1DoorNo", document.witness1DoorNo)},{" "}
                {highlightField("witness1AddressLine1", document.witness1AddressLine1)},{" "}
                {document.witness1AddressLine2
                  ? highlightField("witness1AddressLine2", document.witness1AddressLine2) + ", "
                  : ""}
                {document.witness1AddressLine3
                  ? highlightField("witness1AddressLine3", document.witness1AddressLine3) + ", "
                  : ""}
                {highlightField("witness1Taluk", document.witness1Taluk)} வட்டம்,{" "}
                {highlightField("witness1District", document.witness1District)} மாவட்டம்-
                {highlightField("witness1Pincode", document.witness1Pincode)}, (வயது-
                {highlightField("witness1Age", document.witness1Age)}) (ஆதார் அடையாள அட்டை எண்:-
                {highlightField("witness1AadharNo", document.witness1AadharNo)}).
              </div>
            </div>
          )}

          {document.witness2Name && (
            <div className="mb-4">
              <div className="font-bold">2.</div>
              <div>({highlightField("witness2Name", document.witness2Name)})</div>
              <div>
                {highlightField("witness2RelationType", getRelationshipTypeInTamil(document.witness2RelationType))}.
                {highlightField("witness2RelationName", document.witness2RelationName)}, கதவு எண்:-
                {highlightField("witness2DoorNo", document.witness2DoorNo)},{" "}
                {highlightField("witness2AddressLine1", document.witness2AddressLine1)},{" "}
                {document.witness2AddressLine2
                  ? highlightField("witness2AddressLine2", document.witness2AddressLine2) + ", "
                  : ""}
                {document.witness2AddressLine3
                  ? highlightField("witness2AddressLine3", document.witness2AddressLine3) + ", "
                  : ""}
                {highlightField("witness2Taluk", document.witness2Taluk)} வட்டம்,{" "}
                {highlightField("witness2District", document.witness2District)} மாவட்டம்-
                {highlightField("witness2Pincode", document.witness2Pincode)}, (வயது-
                {highlightField("witness2Age", document.witness2Age)}) (ஆதார் அடையாள அட்டை எண்:-
                {highlightField("witness2AadharNo", document.witness2AadharNo)}).
              </div>
            </div>
          )}
        </div>

        {document.typistName && (
          <div className="mt-8">
            <div>கணினியில் தட்டச்சு செய்து ஆவணம் தயார் செய்தவர்:-{highlightField("typistName", document.typistName)}</div>
            <div>
              ({highlightField("typistOfficeName", document.typistOfficeName)},{" "}
              {highlightField("typistOfficeLocation", document.typistOfficeLocation)}, போன்:-
              {highlightField("typistPhoneNo", document.typistPhoneNo)})
            </div>
          </div>
        )}
      </div>
    )
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 1:
        return renderPage1()
      case 2:
        return renderPage2()
      case 3:
        return renderPage3()
      default:
        return null
    }
  }

  const downloadAsPdf = async () => {
    if (!previewRef.current) return

    try {
      // Switch to final mode for PDF generation
      const originalMode = previewMode
      setPreviewMode("final")

      await new Promise((resolve) => setTimeout(resolve, 100))

      const pdf = new jsPDF("p", "mm", "a4")

      // Store current page to restore later
      const originalPage = currentPage

      // Capture page 1
      setCurrentPage(1)
      await new Promise((resolve) => setTimeout(resolve, 100))
      const page1 = await toPng(previewRef.current)

      // Capture page 2
      setCurrentPage(2)
      await new Promise((resolve) => setTimeout(resolve, 100))
      const page2 = await toPng(previewRef.current)

      // Capture page 3
      setCurrentPage(3)
      await new Promise((resolve) => setTimeout(resolve, 100))
      const page3 = await toPng(previewRef.current)

      // Restore original page and mode
      setCurrentPage(originalPage)
      setPreviewMode(originalMode)

      // Add images to PDF
      pdf.addImage(page1, "PNG", 10, 10, 190, 280)
      pdf.addPage()
      pdf.addImage(page2, "PNG", 10, 10, 190, 280)
      pdf.addPage()
      pdf.addImage(page3, "PNG", 10, 10, 190, 280)

      // Save the PDF
      pdf.save(`தானசெட்டில்மெண்ட்_முன்னோட்டம்.pdf`)
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert("PDF உருவாக்குவதில் பிழை")
    }
  }

  const downloadAsWord = async () => {
    if (!document) return

    try {
      const doc = new Document({
        sections: [
          {
            properties: {},
            children: [
              new Paragraph({
                text: "தானசெட்டில்மெண்ட் பத்திரம்",
                heading: HeadingLevel.HEADING_1,
                alignment: AlignmentType.CENTER,
              }),
              new Paragraph({
                text: `(${getRelationshipTypeInTamil(document.relationshipType) || "_"})`,
                alignment: AlignmentType.CENTER,
                spacing: { before: 200, after: 400 },
              }),
              // Content would be similar to the API implementation
              // Simplified for brevity
              new Paragraph({
                text: "சொத்து விவரம்",
                heading: HeadingLevel.HEADING_1,
                alignment: AlignmentType.CENTER,
                spacing: { before: 400, after: 400 },
              }),
              new Paragraph({
                text: document.propertyDescription || "___",
                spacing: { after: 400 },
              }),
            ],
          },
        ],
      })

      // Create a buffer from the document
      const buffer = await Packer.toBuffer(doc)

      // Convert buffer to blob and save
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      })
      FileSaver.saveAs(blob, "தானசெட்டில்மெண்ட்_முன்னோட்டம்.docx")
    } catch (error) {
      console.error("Error generating Word document:", error)
      alert("Word ஆவணத்தை உருவாக்குவதில் பிழை")
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap justify-between items-center gap-2 mb-2">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-amber-800">ஆவண முன்னோட்டம்</h2>
          {lastUpdated && (
            <Badge variant="outline" className="text-xs">
              கடைசி ப���துப்பிப்பு: {format(lastUpdated, "HH:mm:ss")}
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2">
            <Switch id="highlight-mode" checked={showHighlights} onCheckedChange={setShowHighlights} />
            <Label htmlFor="highlight-mode" className="cursor-pointer">
              <div className="flex items-center gap-1">
                <HighlighterIcon className="h-4 w-4" />
                <span>ஹைலைட்</span>
              </div>
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="preview-mode"
              checked={previewMode === "final"}
              onCheckedChange={(checked) => setPreviewMode(checked ? "final" : "edit")}
            />
            <Label htmlFor="preview-mode" className="cursor-pointer">
              <div className="flex items-center gap-1">
                {previewMode === "final" ? (
                  <>
                    <Eye className="h-4 w-4" />
                    <span>இறுதி தோற்றம்</span>
                  </>
                ) : (
                  <>
                    <EyeOff className="h-4 w-4" />
                    <span>திருத்த தோற்றம்</span>
                  </>
                )}
              </div>
            </Label>
          </div>
        </div>
      </div>

      {isDirty && (
        <Alert className="bg-amber-50 border-amber-200">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-700">
            மாற்றங்கள் செய்யப்பட்டுள்ளன. முன்னோட்டம் நேரலையில் புதுப்பிக்கப்படுகிறது.
          </AlertDescription>
        </Alert>
      )}

      <Card className={`border-amber-300 ${previewMode === "final" ? "shadow-md" : "shadow-sm"}`}>
        <CardContent className="p-6" ref={previewRef}>
          {renderPage1()}
        </CardContent>
      </Card>

      <div className="flex flex-wrap justify-between items-center gap-2">
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-amber-600 text-white rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            முந்தைய பக்கம்
          </button>

          <div className="flex items-center px-2">
            பக்கம் {currentPage} / {totalPages}
          </div>

          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-amber-600 text-white rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            அடுத்த பக்கம்
          </button>
        </div>

        <div className="flex gap-2 mt-2 sm:mt-0">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={downloadAsWord} className="bg-amber-600 hover:bg-amber-700 text-white">
                  Word பதிவிறக்கு
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Word ஆவணமாக பதிவிறக்கு</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={downloadAsPdf} className="bg-amber-600 hover:bg-amber-700 text-white">
                  PDF பதிவிறக்கு
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>PDF ஆவணமாக பதிவிறக்கு</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  )
}
