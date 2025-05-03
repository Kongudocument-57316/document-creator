import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase"
import { format } from "date-fns"
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from "docx"

export async function GET(request: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {
  const { id } = params

  if (!id) {
    return NextResponse.json({ error: "ஆவண ஐடி தேவைப்படுகிறது" }, { status: 400 })
  }

  const supabase = getSupabaseServerClient()
  const { data: document, error } = await supabase.from("settlement_documents").select("*").eq("id", id).single()

  if (error || !document) {
    return NextResponse.json({ error: "ஆவணம் கிடைக்கவில்லை" }, { status: 404 })
  }

  try {
    // Create document
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
            new Paragraph({
              text: `${document.prDocumentYear || "___"}-ம் வருடம் ${getMonthInTamil(document.prDocumentMonth) || "___"} மாதம் ${document.documentDate ? format(new Date(document.documentDate), "dd") : "___"}-ம் தேதியில்`,
              alignment: AlignmentType.CENTER,
              spacing: { after: 400 },
            }),
            // Recipient details
            new Paragraph({
              children: [
                new TextRun({
                  text: getRecipientDetails(document),
                  break: 1,
                }),
              ],
              spacing: { after: 300 },
            }),
            // Donor details
            new Paragraph({
              children: [
                new TextRun({
                  text: getDonorDetails(document),
                  break: 1,
                }),
              ],
              spacing: { after: 300 },
            }),
            // Relationship context
            new Paragraph({
              text: getRelationshipContext(document),
              indent: { firstLine: 720 },
              spacing: { after: 300 },
            }),
            // Property acquisition
            new Paragraph({
              text: getPropertyAcquisition(document),
              indent: { firstLine: 720 },
              spacing: { after: 300 },
            }),
            // Settlement context
            new Paragraph({
              text: "மேற்படி வகையில் எனக்கு பாத்தியப்பட்ட சொத்துக்களை இப்பவும், உமது பெயரில் கொண்டுள்ள அன்பினாலும், பிரியத்தினாலும், உங்களது பிற்கால வாழ்விற்கு ஒரு ஆதரவு செய்து வைக்க வேண்டும் என்ற நல்ல எண்ணத்தினாலும், சமூகத்தில் உமக்கு ஒரு நல்ல அந்தஸ்த்து கிடைக்க வேண்டும் என்கிற என்னுடைய ஆவலினாலும், நான் சர்வ சுதந்திரமாக அடைந்து ஆண்டனுபவித்து வருகின்ற கீழ்க்கண்ட சொத்துக்களை, நாளது தேதியேலயே உமக்கு இந்த தானசெட்டில்மெண்ட் பத்திரம் மூலம் எழுதி, சுவாதீனம் செய்து, நாளது தேதியிலயே உமது வசம் ஒப்படைத்து விட்டேன். தாங்களும் அதைப் பெற்றுக் கொண்டுள்ளீர்கள்.",
              indent: { firstLine: 720 },
              spacing: { after: 300 },
            }),
            // Page 2 content
            new Paragraph({
              text: "தானசெட்டில்மெண்ட் சொத்துகளை இனி நீங்களே தானாதி விநியோக விற்கிரையங்களுக்கு யோக்கியமாய் சர்வ சுதந்திரமாய் அடைந்து ஆண்டனுபவித்துக் கொள்ள வேண்டியது.",
              indent: { firstLine: 720 },
              spacing: { after: 300 },
            }),
            new Paragraph({
              text: "தானசெட்டில்மெண்ட் சொத்துக்களை குறித்து இனி எனக்காவது, எனக்கு பின்னிட்ட எனது இதர ஆண், பெண் வாரிசுகளுக்காவது எவ்வித பாத்தியமும் சம்பந்தமும் பின்தொடர்ச்சியும், உரிமையும் எக்காரணம் கொண்டும், எக்கா��த்திலும் இல்லை என உறுதியளிக்கிறேன்.",
              indent: { firstLine: 720 },
              spacing: { after: 300 },
            }),
            new Paragraph({
              text: "அப்படி ஏதேனும் உரிமை கோரல்கள் எழுந்தால் அத்தகைவகள் எக்காரணம் கொண்டும் செல்லத்தக்கவையல்ல என்றும் உறுதியளிக்கிறேன்.",
              indent: { firstLine: 720 },
              spacing: { after: 300 },
            }),
            new Paragraph({
              text: "தானசெட்டில்மெண்ட் சொத்தின் பேரில் எந்த விதமான முன் வில்லங்கமும், விவகாரமும் இல்லை.",
              indent: { firstLine: 720 },
              spacing: { after: 300 },
            }),
            new Paragraph({
              text: "அப்படி மீறி ஏதாவது வில்லங்கம் இருந்தாலும் அவ்வில்லங்கத்தை நானே எனது சொந்த பொறுப்பில் முன் நின்று தீர்த்துக் கொடுக்க உள்ளவர் ஆவேன்.",
              indent: { firstLine: 720 },
              spacing: { after: 300 },
            }),
            new Paragraph({
              text: "இந்த தானசெட்டில்மெண்ட் பத்திரத்தை எக்காரணம் கொண்டும் ரத்து செய்வதில்லை என்றும், அப்படி மீறி ரத்து செய்தாலும் அது செல்லத்தக்கது அல்ல என்றும் உறுதியளிக்கிறேன்.",
              indent: { firstLine: 720 },
              spacing: { after: 300 },
            }),
            new Paragraph({
              text: "இந்த தானசெட்டில்மெண்ட் பத்திரத்திற்காக உம்மிடமிருந்து நான் தொகை ஏதும் பெற்றுக் கொள்ளவில்லை.",
              indent: { firstLine: 720 },
              spacing: { after: 300 },
            }),
            new Paragraph({
              text: "நான் இதனடிய��ல் கண்ட சொத்தை உமது பெயரில் பட்டா மாறுதல் செய்ய இத்துடன் பட்டா மாறுதல் மனுவும் இத்துடன் தாக்கல் செய்துள்ளேன். இந்தப்படிக்கு நான் எனது முழு சம்மதத்துடன் உமக்கு எழுதிக்கொடுத்த தானசெட்டில்மெண்ட் பத்திரம்.",
              indent: { firstLine: 720 },
              spacing: { after: 300 },
            }),
            // Previous document reference
            ...(document.prBookNo && document.prDocumentNo
              ? [
                  new Paragraph({
                    text: `மேலே சொன்ன ${document.prBookNo} புத்தகம் ${document.prDocumentNo}/${document.prDocumentYear} ன் ${document.prDocumentType} ஆவணத்தின் ${document.prDocumentCopyType === "original" ? "அசல்" : "நகல்"} இந்த தானசெட்டில்மெண்ட் ஆவணத்திற்கு ஆதரவாக தங்களுக்கு கொடுத்திருக்கின்றேன்.`,
                    indent: { firstLine: 720 },
                    spacing: { after: 300 },
                  }),
                ]
              : []),
            new Paragraph({
              text: "மேலும் தணிக்கையின் போது இந்த ஆவணம் தொடர்பாக அரசுக்கு இழப்பு ஏற்படின் அத்தொகையை இந்த தானசெட்டில்மெண்ட் பத்திரம் எழுதி பெறுபவர் செலுத்தவும் உறுதியளிக்கிறார்.",
              indent: { firstLine: 720 },
              spacing: { after: 300 },
            }),
            // Page 3 - Property description
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
            // Witnesses section
            new Paragraph({
              text: "சாட்சிகள்:",
              bold: true,
              spacing: { before: 400, after: 200 },
            }),
            // Witness 1
            ...(document.witness1Name
              ? [
                  new Paragraph({
                    text: "1.",
                    bold: true,
                    spacing: { after: 100 },
                  }),
                  new Paragraph({
                    text: `(${document.witness1Name})`,
                    spacing: { after: 100 },
                  }),
                  new Paragraph({
                    text: getWitness1Details(document),
                    spacing: { after: 200 },
                  }),
                ]
              : []),
            // Witness 2
            ...(document.witness2Name
              ? [
                  new Paragraph({
                    text: "2.",
                    bold: true,
                    spacing: { after: 100 },
                  }),
                  new Paragraph({
                    text: `(${document.witness2Name})`,
                    spacing: { after: 100 },
                  }),
                  new Paragraph({
                    text: getWitness2Details(document),
                    spacing: { after: 400 },
                  }),
                ]
              : []),
            // Typist
            ...(document.typistName
              ? [
                  new Paragraph({
                    text: `கணினியில் தட்டச்சு செய்து ஆவணம் தயார் செய்தவர்:-${document.typistName}`,
                    spacing: { after: 100 },
                  }),
                  new Paragraph({
                    text: `(${document.typistOfficeName || "___"}, ${document.typistOfficeLocation || "___"}, போன்:-${document.typistPhoneNo || "___"})`,
                    spacing: { after: 200 },
                  }),
                ]
              : []),
          ],
        },
      ],
    })

    // Create a buffer from the document
    const buffer = await Packer.toBuffer(doc)

    // Set the response headers for downloading
    const filename = `தானசெட்டில்மெண்ட்_${id}.docx`

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename=${encodeURIComponent(filename)}`,
      },
    })
  } catch (error) {
    console.error("Error generating Word document:", error)
    return NextResponse.json({ error: "வார்த்தை ஆவணத்தை உருவாக்குவதில் பிழை" }, { status: 500 })
  }
}

// Helper functions
function getRelationshipTypeInTamil(type: string | null | undefined) {
  if (!type) return ""

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

function getMonthInTamil(month: string | null | undefined) {
  if (!month) return ""

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

function getRecipientDetails(document: any) {
  if (!document.recipientName) return ""

  const recipientAddress =
    document.recipientDistrict && document.recipientPincode
      ? `${document.recipientDistrict} மாவட்டம்-${document.recipientPincode}, ${document.recipientTaluk} வட்டம், ${document.recipientAddressLine3 ? document.recipientAddressLine3 + ", " : ""}${document.recipientAddressLine2 ? document.recipientAddressLine2 + ", " : ""}${document.recipientAddressLine1}, கதவு எண்:-${document.recipientDoorNo}`
      : "___"

  return `${recipientAddress} என்ற முகவரியில் வசித்து வருபவரும், ${document.recipientRelationName || "___"} அவர்களின் ${getRelationshipTypeInTamil(document.recipientRelationType) || "___"} ${document.recipientAge || "___"} வயதுடைய பெறுபவர் ${document.recipientName || "___"} (ஆதார் அடையாள அட்டை எண்:-${document.recipientAadharNo || "___"}, கைப்பேசி எண்:-${document.recipientPhoneNo || "___"}) ஆகிய உமக்கு,`
}

function getDonorDetails(document: any) {
  if (!document.donorName) return ""

  const donorAddress =
    document.donorDistrict && document.donorPincode
      ? `${document.donorDistrict} மாவட்டம்-${document.donorPincode}, ${document.donorTaluk} வட்டம், ${document.donorAddressLine3 ? document.donorAddressLine3 + ", " : ""}${document.donorAddressLine2 ? document.donorAddressLine2 + ", " : ""}${document.donorAddressLine1}, கதவு எண்:-${document.donorDoorNo}`
      : "___"

  return `${donorAddress} என்ற முகவரியில் வசித்து வருபவரும், ${document.donorRelationName || "___"} அவர்களின் ${getRelationshipTypeInTamil(document.donorRelationType) || "___"} ${document.donorAge || "___"} வயதுடைய கொடுப்பவர் ${document.donorName || "___"} (ஆதார் அடையாள அட்டை எண்:-${document.donorAadharNo || "___"}, கைப்பேசி எண்:-${document.donorPhoneNo || "___"}) ஆகிய நான் எழுதிக்கொடுத்த தானசெட்டில்மெண்ட் பத்திரத்திற்கு விவரம் என்னவென்றால்,`
}

function getRelationshipContext(document: any) {
  if (!document.recipientName || !document.donorName) return ""

  const relationshipType = getRelationshipTypeInTamil(document.relationshipType)
  return `இந்த தானசெட்டில்மெண்ட் பத்திரம் பெறும் பெறுபவர் ${document.recipientName} ஆகிய நீங்கள், எனக்கு கொடுப்பவருக்கு ${relationshipType || "___"} ஆவீர்கள். நான் உமக்���ு பெறுபவருக்கு ${relationshipType || "___"} ஆவேன்.`
}

function getPropertyAcquisition(document: any) {
  if (!document.prDocumentDate || !document.subRegisterOffice) return ""

  const documentDate = document.prDocumentDate ? format(new Date(document.prDocumentDate), "dd-MM-yyyy") : "___"

  return `கீழ்க்கண்ட சொத்து விவரத்தில் விவரிக்கப்பட்டுள்ள சொத்தானது எனக்கு கடந்த ${documentDate}-ம் தேதியில், ${document.subRegisterOffice || "___"} சார்பதிவாளர் அலுவலகம் ${document.prBookNo || "___"} புத்தகம் ${document.prDocumentYear || "___"}-ம் ஆண்டின் ${document.prDocumentNo || "___"}-ம் எண்ணாக பதிவு செய்யப்பட்ட ${document.prDocumentType || "___"} ஆவணத்தின் படி எனக்கு தனித்து பாத்தியப்பட்ட சொத்தாகும்.`
}

function getWitness1Details(document: any) {
  return `${getRelationshipTypeInTamil(document.witness1RelationType) || "___"}.${document.witness1RelationName || "___"}, கதவு எண்:-${document.witness1DoorNo || "___"}, ${document.witness1AddressLine1 || "___"}, ${document.witness1AddressLine2 ? document.witness1AddressLine2 + ", " : ""}${document.witness1AddressLine3 ? document.witness1AddressLine3 + ", " : ""}${document.witness1Taluk || "___"} வட்டம், ${document.witness1District || "___"} மாவட்டம்-${document.witness1Pincode || "___"}, (வயது-${document.witness1Age || "___"}) (ஆதார் அடையாள அட்டை எண்:-${document.witness1AadharNo || "___"}).`
}

function getWitness2Details(document: any) {
  return `${getRelationshipTypeInTamil(document.witness2RelationType) || "___"}.${document.witness2RelationName || "___"}, கதவு எண்:-${document.witness2DoorNo || "___"}, ${document.witness2AddressLine1 || "___"}, ${document.witness2AddressLine2 ? document.witness2AddressLine2 + ", " : ""}${document.witness2AddressLine3 ? document.witness2AddressLine3 + ", " : ""}${document.witness2Taluk || "___"} வட்டம், ${document.witness2District || "___"} மாவட்டம்-${document.witness2Pincode || "___"}, (வயது-${document.witness2Age || "___"}) (ஆதார் அடையாள அட்டை எண்:-${document.witness2AadharNo || "___"}).`
}
