"use client"

import { Card, CardContent } from "@/components/ui/card"
import { format } from "date-fns"
import { useState } from "react"

interface DocumentPreviewProps {
  document: any
}

export function DocumentPreview({ document }: DocumentPreviewProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = 3

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return format(date, "dd-MM-yyyy")
    } catch (error) {
      return dateString
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

  const renderPage1 = () => {
    if (!document) return null

    const documentDate = formatDate(document.document_date)
    const [day, month, year] = documentDate.split("-")

    const recipientAddress = `${document.recipient_district} மாவட்டம்-${document.recipient_pincode}, ${document.recipient_taluk} வட்டம், ${document.recipient_address_line_3 ? document.recipient_address_line_3 + ", " : ""}${document.recipient_address_line_2 ? document.recipient_address_line_2 + ", " : ""}${document.recipient_address_line_1}, கதவு எண்:-${document.recipient_door_no}`

    const donorAddress = `${document.donor_district} மாவட்டம்-${document.donor_pincode}, ${document.donor_taluk} வட்டம், ${document.donor_address_line_3 ? document.donor_address_line_3 + ", " : ""}${document.donor_address_line_2 ? document.donor_address_line_2 + ", " : ""}${document.donor_address_line_1}, கதவு எண்:-${document.donor_door_no}`

    const relationshipType = getRelationshipTypeInTamil(document.relationship_type)
    const prDocumentMonth = getMonthInTamil(document.pr_document_month)

    return (
      <div className="text-justify leading-relaxed">
        <div className="text-center font-bold text-xl mb-4">தானசெட்டில்மெண்ட் பத்திரம்</div>
        <div className="text-center font-bold mb-6">({relationshipType})</div>

        <div className="mb-4 text-center">
          {document.pr_document_year}-ம் வருடம் {prDocumentMonth} மாதம் {day}-ம் தேதியில்
        </div>

        <div className="mb-4">
          {recipientAddress} என்ற முகவரியில் வசித்து வருபவரும், {document.recipient_relation_name} அவர்களின்{" "}
          {getRelationshipTypeInTamil(document.recipient_relation_type)} {document.recipient_age} வயதுடைய பெறுபவர்{" "}
          {document.recipient_name} (ஆதார் அடையாள அட்டை எண்:-{document.recipient_aadhar_no}, கைப்பேசி எண்:-
          {document.recipient_phone_no}) ஆகிய உமக்கு,
        </div>

        <div className="mb-4">
          {donorAddress} என்ற முகவரியில் வசித்து வருபவரும், {document.donor_relation_name} அவர்களின்{" "}
          {getRelationshipTypeInTamil(document.donor_relation_type)} {document.donor_age} வயதுடைய கொடுப்பவர்{" "}
          {document.donor_name} (ஆதார் அடையாள அட்டை எண்:-{document.donor_aadhar_no}, கைப்பேசி எண்:-{document.donor_phone_no})
          ஆகிய நான் எழுதிக்கொடுத்த தானசெட்டில்மெண்ட் பத்திரத்திற்கு விவரம் என்னவென்றால்,
        </div>

        <div className="mb-4 pl-8">
          இந்த தானசெட்டில்மெண்ட் பத்திரம் பெறும் பெறுபவர் {document.recipient_name} ஆகிய நீங்கள், எனக்கு கொடுப்பவருக்கு{" "}
          {relationshipType} ஆவீர்கள். நான் உமக்கு பெறுபவருக்கு {relationshipType} ஆவேன்.
        </div>

        <div className="mb-4 pl-8">
          கீழ்க்கண்ட சொத்து விவரத்தில் விவரிக்கப்பட்டுள்ள சொத்தானது எனக்கு கடந்த {formatDate(document.pr_document_date)}-ம் தேதியில்,{" "}
          {document.sub_register_office} சார்பதிவாளர் அலுவலகம் {document.pr_book_no} புத்தகம் {document.pr_document_year}-ம்
          ஆண்டின் {document.pr_document_no}-ம் எண்ணாக பதிவு செய்யப்பட்ட {document.pr_document_type} ஆவணத்தின் படி எனக்கு தனித்து
          பாத்தியப்பட்ட சொத்தாகும்.
        </div>

        <div className="mb-4 pl-8">
          மேற்படி வகையில் எனக்கு பாத்தியப்பட்ட சொத்துக்களை இப்பவும், உமது பெயரில் கொண்டுள்ள அன்பினாலும், பிரியத்தினாலும், உங்களது பிற்கால
          வாழ்விற்கு ஒரு ஆதரவு செய்து வைக்க வேண்டும் என்ற நல்ல எண்ணத்தினாலும், சமூகத்தில் உமக்கு ஒரு நல்ல அந்தஸ்த்து கிடைக்க வேண்டும் என்கிற
          என்னுடைய ஆவலினாலும், நான் சர்வ சுதந்திரமாக அடைந்து ஆண்டனுபவித்து வருகின்ற கீழ்க்கண்ட சொத்துக்களை, நாளது தேதியேலயே உமக்கு இந்த
          தானசெட்டில்மெண்ட் பத்திரம் மூலம் எழுதி, சுவாதீனம் செய்து, நாளது தேதியிலயே உமது வசம் ஒப்படைத்து விட்டேன். தாங்களும் அதைப் பெற்றுக்
          கொண்டுள்ளீர்கள்.
        </div>
      </div>
    )
  }

  const renderPage2 = () => {
    if (!document) return null

    return (
      <div className="text-justify leading-relaxed">
        <div className="mb-4 pl-8">
          தானசெட்டில்மெண்ட் சொத்துகளை இனி நீங்களே தானாதி விநியோக விற்கிரையங்களுக்கு யோக்கியமாய் சர்வ சுதந்திரமாய் அடைந்து ஆண்டனுபவித்துக் கொள்ள
          வேண்டியது.
        </div>

        <div className="mb-4 pl-8">
          தானசெட்டில்மெண்ட் சொத்துக்களை குறித்து இனி எனக்காவது, எனக்கு பின்னிட்ட எனது இதர ஆண், பெண் வாரிசுகளுக்காவது எவ்வித பாத்தியமும்
          சம்பந்தமும் பின்தொடர்ச்சியும், உரிமையும் எக்காரணம் கொண்டும், எக்காலத்திலும் இல்லை என உறுதியளிக்கிறேன்.
        </div>

        <div className="mb-4 pl-8">
          அப்படி ஏதேனும் உரிமை கோரல்கள் எழுந்தால் அத்தகைவகள் எக்காரணம் கொண்டும் செல்லத்தக்கவையல்ல என்றும் உறுதியளிக்கிறேன்.
        </div>

        <div className="mb-4 pl-8">தானசெட்டில்மெண்ட் சொத்தின் பேரில் எந்த விதமான முன் வில்லங்கமும், விவகாரமும் இல்லை.</div>

        <div className="mb-4 pl-8">
          அப்படி மீறி ஏதாவது வில்லங்கம் இருந்தாலும் அவ்வில்லங்கத்தை நானே எனது சொந்த பொறுப்பில் முன் நின்று தீர்த்துக் கொடுக்க உள்ளவர் ஆவேன்.
        </div>

        <div className="mb-4 pl-8">
          இந்த தானசெட்டில்மெண்ட் பத்திரத்தை எக்காரணம் கொண்டும் ரத்து செய்வதில்லை என்றும், அப்படி மீறி ரத்து செய்தாலும் அது செல்லத்தக்கது அல்ல என்றும்
          உறுதியளிக்கிறேன்.
        </div>

        <div className="mb-4 pl-8">இந்த தானசெட்டில்மெண்ட் பத்திரத்திற்காக உம்மிடமிருந்து நான் தொகை ஏதும் பெற்றுக் கொள்ளவில்லை.</div>

        <div className="mb-4 pl-8">
          நான் இதனடியில் கண்ட சொத்தை உமது பெயரில் பட்டா மாறுதல் செய்ய இத்துடன் பட்டா மாறுதல் மனுவும் இத்துடன் தாக்கல் செய்துள்ளேன். இந்தப்படிக்கு நான்
          எனது முழு சம்மதத்துடன் உமக்கு எழுதிக்கொடுத்த தா��செட்டில்மெண்ட் பத்திரம்.
        </div>

        <div className="mb-4 pl-8">
          மேலே சொன்ன {document.pr_book_no} புத்தகம் {document.pr_document_no}/{document.pr_document_year} ன்{" "}
          {document.pr_document_type} ஆவணத்தின் {document.pr_document_copy_type === "original" ? "அசல்" : "நகல்"} இந்த தானசெட்டில்மெண்ட் ஆவணத்திற்கு ஆதரவாக தங்களுக்கு கொடுத்திருக்கின்றேன்.
        </div>

        <div className="mb-4 pl-8">
          மேலும் தணிக்கையின் போது இந்த ஆவணம் தொடர்பாக அரசுக்கு இழப்பு ஏற்படின் அத்தொகையை இந்த தானசெட்டில்மெண்ட் பத்திரம் எழுதி பெறுபவர்
          செலுத்தவும் உறுதியளிக்கிறார்.
        </div>
      </div>
    )
  }

  const renderPage3 = () => {
    if (!document) return null

    return (
      <div className="text-justify leading-relaxed">
        <div className="text-center font-bold text-xl mb-6">சொத்து விவரம்</div>

        <div className="mb-8 whitespace-pre-line">{document.property_description}</div>

        <div className="mb-6">
          <div className="font-bold mb-2">சாட்சிகள்:</div>
          <div className="border-t border-b border-gray-300 my-2"></div>

          <div className="mb-4">
            <div className="font-bold">1.</div>
            <div>({document.witness1_name})</div>
            <div>
              {getRelationshipTypeInTamil(document.witness1_relation_type)}.{document.witness1_relation_name}, கதவு எண்:-
              {document.witness1_door_no}, {document.witness1_address_line_1},{" "}
              {document.witness1_address_line_2 ? document.witness1_address_line_2 + ", " : ""}
              {document.witness1_address_line_3 ? document.witness1_address_line_3 + ", " : ""}
              {document.witness1_taluk} வட்டம், {document.witness1_district} மாவட்டம்-{document.witness1_pincode}, (வயது-
              {document.witness1_age}) (ஆதார் அடையாள அட்டை எண்:-{document.witness1_aadhar_no}).
            </div>
          </div>

          <div className="mb-4">
            <div className="font-bold">2.</div>
            <div>({document.witness2_name})</div>
            <div>
              {getRelationshipTypeInTamil(document.witness2_relation_type)}.{document.witness2_relation_name}, கதவு ��ண்:-
              {document.witness2_door_no}, {document.witness2_address_line_1},{" "}
              {document.witness2_address_line_2 ? document.witness2_address_line_2 + ", " : ""}
              {document.witness2_address_line_3 ? document.witness2_address_line_3 + ", " : ""}
              {document.witness2_taluk} வட்டம், {document.witness2_district} மாவட்டம்-{document.witness2_pincode}, (வயது-
              {document.witness2_age}) (ஆதார் அடையாள அட்டை எண்:-{document.witness2_aadhar_no}).
            </div>
          </div>
        </div>

        <div className="mt-8">
          <div>கணினியில் தட்டச்சு செய்து ஆவணம் தயார் செய்தவர்:-{document.typist_name}</div>
          <div>
            ({document.typist_office_name}, {document.typist_office_location}, போன்:-{document.typist_phone_no})
          </div>
        </div>
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

  return (
    <div className="space-y-4">
      <Card className="border-amber-300">
        <CardContent className="p-6">{renderCurrentPage()}</CardContent>
      </Card>

      <div className="flex justify-between items-center">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-amber-600 text-white rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          முந்தைய பக்கம்
        </button>

        <div className="text-center">
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
    </div>
  )
}
