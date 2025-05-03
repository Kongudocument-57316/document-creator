import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase"
import puppeteer from "puppeteer"
import { format } from "date-fns"

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
    // Generate HTML content for the PDF
    const htmlContent = generateHtmlContent(document)

    // Use Puppeteer to generate PDF from HTML
    const browser = await puppeteer.launch({ headless: true })
    const page = await browser.newPage()
    await page.setContent(htmlContent)

    // Generate PDF
    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "2cm",
        right: "2cm",
        bottom: "2cm",
        left: "2cm",
      },
    })

    await browser.close()

    // Set the response headers for downloading
    const filename = `தானசெட்டில்மெண்ட்_${id}.pdf`

    return new NextResponse(pdf, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=${encodeURIComponent(filename)}`,
      },
    })
  } catch (error) {
    console.error("Error generating PDF:", error)
    return NextResponse.json({ error: "PDF ஆவணத்தை உருவாக்குவதில் பிழை" }, { status: 500 })
  }
}

// Helper function to generate HTML content
function generateHtmlContent(document: any): string {
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return ""
    try {
      return format(new Date(dateString), "dd-MM-yyyy")
    } catch (error) {
      return ""
    }
  }

  const getRelationshipTypeInTamil = (type: string | null | undefined) => {
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

  const getMonthInTamil = (month: string | null | undefined) => {
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

  const documentDate = formatDate(document.documentDate)
  const [day, month, year] = documentDate ? documentDate.split("-") : ["", "", ""]

  const relationshipType = getRelationshipTypeInTamil(document.relationshipType)
  const prDocumentMonth = getMonthInTamil(document.prDocumentMonth)

  // Generate recipient address
  const recipientAddress =
    document.recipientDistrict && document.recipientPincode
      ? `${document.recipientDistrict} மாவட்டம்-${document.recipientPincode}, ${document.recipientTaluk} வட்டம், ${document.recipientAddressLine3 ? document.recipientAddressLine3 + ", " : ""}${document.recipientAddressLine2 ? document.recipientAddressLine2 + ", " : ""}${document.recipientAddressLine1}, கதவு எண்:-${document.recipientDoorNo}`
      : ""

  // Generate donor address
  const donorAddress =
    document.donorDistrict && document.donorPincode
      ? `${document.donorDistrict} மாவட்டம்-${document.donorPincode}, ${document.donorTaluk} வட்டம், ${document.donorAddressLine3 ? document.donorAddressLine3 + ", " : ""}${document.donorAddressLine2 ? document.donorAddressLine2 + ", " : ""}${document.donorAddressLine1}, கதவு எண்:-${document.donorDoorNo}`
      : ""

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>தானசெட்டில்மெண்ட் பத்திரம்</title>
      <style>
        body { 
          font-family: Arial, Helvetica, sans-serif; 
          line-height: 1.6;
          margin: 0;
          padding: 0;
        }
        .container { 
          max-width: 800px; 
          margin: 0 auto; 
          padding: 20px;
        }
        .text-center { text-align: center; }
        .font-bold { font-weight: bold; }
        .text-xl { font-size: 1.5rem; }
        .mb-4 { margin-bottom: 1rem; }
        .mb-6 { margin-bottom: 1.5rem; }
        .pl-8 { padding-left: 2rem; }
        .page-break { page-break-after: always; }
        .text-justify { text-align: justify; }
        .indent { text-indent: 2em; }
        .title { font-size: 24px; font-weight: bold; text-align: center; margin-bottom: 20px; }
        .subtitle { font-size: 20px; font-weight: bold; text-align: center; margin-bottom: 30px; }
        .witness-title { font-weight: bold; margin-top: 20px; }
        .witness-divider { border-top: 1px solid #ccc; margin: 10px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- Page 1 -->
        <div class="title">தானசெட்டில்மெண்ட் பத்திரம்</div>
        <div class="text-center font-bold mb-6">(${relationshipType || "___"})</div>
        
        <div class="mb-4 text-center">
          ${document.prDocumentYear || "___"}-ம் வருடம் ${prDocumentMonth || "___"} மாதம் ${day || "___"}-ம் தேதியில்
        </div>

        ${
          document.recipientName
            ? `
        <div class="mb-4 text-justify">
          ${recipientAddress || "___"} என்ற முகவரியில் வசித்து வருபவரும், ${document.recipientRelationName || "___"} அவர்களின் ${getRelationshipTypeInTamil(document.recipientRelationType) || "___"} ${document.recipientAge || "___"} வயதுடைய பெறுபவர் ${document.recipientName || "___"} (ஆதார் அடையாள அட்டை எண்:-${document.recipientAadharNo || "___"}, கைப்பேசி எண்:-${document.recipientPhoneNo || "___"}) ஆகிய உமக்கு,
        </div>
        `
            : ""
        }

        ${
          document.donorName
            ? `
        <div class="mb-4 text-justify">
          ${donorAddress || "___"} என்ற முகவரியில் வசித்து வருபவரும், ${document.donorRelationName || "___"} அவர்களின் ${getRelationshipTypeInTamil(document.donorRelationType) || "___"} ${document.donorAge || "___"} வயதுடைய கொடுப்பவர் ${document.donorName || "___"} (ஆதார் அடையாள அட்டை எண்:-${document.donorAadharNo || "___"}, கைப்பேசி எண்:-${document.donorPhoneNo || "___"}) ஆகிய நான் எழுதிக்கொடுத்த தானசெட்டில்மெண்ட் பத்திரத்திற்கு விவரம் என்னவென்றால்,
        </div>
        `
            : ""
        }

        ${
          document.recipientName && document.donorName
            ? `
        <div class="mb-4 pl-8 text-justify">
          இந்த தானசெட்டில்மெண்ட் பத்திரம் பெறும் பெறுபவர் ${document.recipientName} ஆகிய நீங்கள், எனக்கு கொடுப்பவருக்கு ${relationshipType || "___"} ஆவீர்கள். நான் உமக்கு பெறுபவருக்கு ${relationshipType || "___"} ஆவேன்.
        </div>
        `
            : ""
        }

        ${
          document.prDocumentDate && document.subRegisterOffice
            ? `
        <div class="mb-4 pl-8 text-justify">
          கீழ்க்கண்ட சொத்து விவரத்தில் விவரிக்கப்பட்டுள்ள சொத்தானது எனக்கு கடந்த ${formatDate(document.prDocumentDate) || "___"}-ம் தேதியில், ${document.subRegisterOffice || "___"} சார்பதிவாளர் அலுவலகம் ${document.prBookNo || "___"} புத்தகம் ${document.prDocumentYear || "___"}-ம் ஆண்டின் ${document.prDocumentNo || "___"}-ம் எண்ணாக பதிவு செய்யப்பட்ட ${document.prDocumentType || "___"} ஆவணத்தின் படி எனக்கு தனித்து பாத்தியப்பட்ட சொத்தாகும்.
        </div>
        `
            : ""
        }

        <div class="mb-4 pl-8 text-justify">
          மேற்படி வகையில் எனக்கு பாத்தியப்பட்ட சொத்துக்களை இப்பவும், உமது பெயரில் கொண்டுள்ள அன்பினாலும், பிரியத்தினாலும், உங்களது பிற்கால வாழ்விற்கு ஒரு ஆதரவு செய்து வைக்க வேண்டும் என்ற நல்ல எண்ணத்தினாலும், சமூகத்தில் உமக்கு ஒரு நல்ல அந்தஸ்த்து கிடைக்க வேண்டும் என்கிற என்னுடைய ஆவலினாலும், நான் சர்வ சுதந்திரமாக அடைந்து ஆண்டனுபவித்து வருகின்ற கீழ்க்கண்ட சொத்துக்களை, நாளது தேதியேலயே உமக்கு இந்த தானசெட்டில்மெண்ட் பத்திரம் மூலம் எழுதி, சுவாதீனம் செய்து, நாளது தேதியிலயே ��மது வசம் ஒப்படைத்து விட்டேன். தாங்களும் அதைப் பெற்றுக் கொண்டுள்ளீர்கள்.
        </div>

        <div class="page-break"></div>
        
        <!-- Page 2 -->
        <div class="mb-4 pl-8 text-justify">
          தானசெட்டில்மெண்ட் சொத்துகளை இனி நீங்களே தானாதி விநியோக விற்கிரையங்களுக்கு யோக்கியமாய் சர்வ சுதந்திரமாய் அடைந்து ஆண்டனுபவித்துக் கொள்ள வேண்டியது.
        </div>

        <div class="mb-4 pl-8 text-justify">
          தானசெட்டில்மெண்ட் சொத்துக்களை குறித்து இனி எனக்காவது, எனக்கு பின்னிட்ட எனது இதர ஆண், பெண் வாரிசுகளுக்காவது எவ்வித பாத்தியமும் சம்பந்தமும் பின்தொடர்ச்சியும், உரிமையும் எக்காரணம் கொண்டும், எக்காலத்திலும் இல்லை என உறுதியளிக்கிறேன்.
        </div>

        <div class="mb-4 pl-8 text-justify">
          அப்படி ஏதேனும் உரிமை கோரல்கள் எழுந்தால் அத்தகைவகள் எக்காரணம் கொண்டும் செல்லத்தக்கவையல்ல என்றும் உறுதியளிக்கிறேன்.
        </div>

        <div class="mb-4 pl-8 text-justify">
          தானசெட்டில்மெண்ட் சொத்தின் பேரில் எந்த விதமான முன் வில்லங்கமும், விவகாரமும் இல்லை.
        </div>

        <div class="mb-4 pl-8 text-justify">
          அப்படி மீறி ஏதாவது வில்லங்கம் இருந்தாலும் அவ்வில்லங்கத்தை நானே எனது சொந்த பொறுப்பில் முன் நின்று தீர்த்துக் கொடுக்க உள்ளவர் ஆவேன்.
        </div>

        <div class="mb-4 pl-8 text-justify">
          இந்த தானசெட்டில்மெண்ட் பத்திரத்தை எக்காரணம் கொண்டும் ரத்து செய்வதில்லை என்றும், அப்படி மீறி ரத்து செய்தாலும் அது செல்லத்தக்கது அல்ல என்றும் உறுதியளிக்கிறேன்.
        </div>

        <div class="mb-4 pl-8 text-justify">
          இந்த தானசெட்டில்மெண்ட் பத்திரத்திற்காக உம்மிடமிருந்து நான் தொகை ஏதும் பெற்றுக் கொள்ளவில்லை.
        </div>

        <div class="mb-4 pl-8 text-justify">
          நான் இதனடியில் கண்ட சொத்தை உமது பெயரில் பட்டா மாறுதல் செய்ய இத்துடன் பட்டா மாறுதல் மனுவும் இத்துடன் தாக்கல் செய்துள்ளேன். இந்தப���படிக்கு நான் எனது முழு சம்மதத்துடன் உமக்கு எழுதிக்கொடுத்த தானசெட்டில்மெண்ட் பத்திரம்.
        </div>

        ${
          document.prBookNo &&
          document.prDocumentNo &&
          document.prDocumentYear &&
          document.prDocumentType &&
          document.prDocumentCopyType
            ? `
        <div class="mb-4 pl-8 text-justify">
          மேலே சொன்ன ${document.prBookNo} புத்தகம் ${document.prDocumentNo}/${document.prDocumentYear} ன் ${document.prDocumentType} ஆவணத்தின் ${document.prDocumentCopyType === "original" ? "அசல்" : "நகல்"} இந்த தானசெட்டில்மெண்ட் ஆவணத்திற்கு ஆதரவாக தங்களுக்கு கொடுத்திருக்கின்றேன்.
        </div>
        `
            : ""
        }

        <div class="mb-4 pl-8 text-justify">
          மேலும் தணிக்கையின் போது இந்த ஆவணம் தொடர்பாக அரசுக்கு இழப்பு ஏற்படின் அத்தொகையை இந்த தானசெட்டில்மெண்ட் பத்திரம் எழுதி பெறுபவர் செலுத்தவும் உறுதியளிக்கிறார்.
        </div>

        <div class="page-break"></div>
        
        <!-- Page 3 -->
        <div class="subtitle">சொத்து விவரம்</div>

        <div class="mb-8 text-justify">
          ${document.propertyDescription || "___"}
        </div>

        <div class="mb-6">
          <div class="witness-title">சாட்சிகள்:</div>
          <div class="witness-divider"></div>

          ${
            document.witness1Name
              ? `
          <div class="mb-4">
            <div class="font-bold">1.</div>
            <div>(${document.witness1Name})</div>
            <div>
              ${getRelationshipTypeInTamil(document.witness1RelationType) || "___"}.${document.witness1RelationName || "___"}, கதவு எண்:-${document.witness1DoorNo || "___"}, ${document.witness1AddressLine1 || "___"}, ${document.witness1AddressLine2 ? document.witness1AddressLine2 + ", " : ""}${document.witness1AddressLine3 ? document.witness1AddressLine3 + ", " : ""}${document.witness1Taluk || "___"} வட்டம், ${document.witness1District || "___"} மாவட்டம்-${document.witness1Pincode || "___"}, (வயது-${document.witness1Age || "___"}) (ஆதார் அடையாள அட்டை எண்:-${document.witness1AadharNo || "___"}).
            </div>
          </div>
          `
              : ""
          }

          ${
            document.witness2Name
              ? `
          <div class="mb-4">
            <div class="font-bold">2.</div>
            <div>(${document.witness2Name})</div>
            <div>
              ${getRelationshipTypeInTamil(document.witness2RelationType) || "___"}.${document.witness2RelationName || "___"}, கதவு எண்:-${document.witness2DoorNo || "___"}, ${document.witness2AddressLine1 || "___"}, ${document.witness2AddressLine2 ? document.witness2AddressLine2 + ", " : ""}${document.witness2AddressLine3 ? document.witness2AddressLine3 + ", " : ""}${document.witness2Taluk || "___"} வட்டம், ${document.witness2District || "___"} மாவட்டம்-${document.witness2Pincode || "___"}, (வயது-${document.witness2Age || "___"}) (ஆதார் அடையாள அட்டை எண்:-${document.witness2AadharNo || "___"}).
            </div>
          </div>
          `
              : ""
          }
        </div>

        ${
          document.typistName
            ? `
        <div class="mt-8">
          <div>கணினியில் தட்டச்சு செய்து ஆவணம் தயார் செய்தவ���்:-${document.typistName}</div>
          <div>
            (${document.typistOfficeName || "___"}, ${document.typistOfficeLocation || "___"}, போன்:-${document.typistPhoneNo || "___"})
          </div>
        </div>
        `
            : ""
        }
      </div>
    </body>
    </html>
  `
}
