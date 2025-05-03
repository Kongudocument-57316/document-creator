import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase"
import puppeteer from "puppeteer"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    if (!id) {
      return NextResponse.json({ error: "Document ID is required" }, { status: 400 })
    }

    const supabase = getSupabaseServerClient()

    // Get the document with all related data
    const { data: document, error } = await supabase
      .from("sale_agreements")
      .select(`
        *,
        subRegistrarOffice:sub_registrar_office_id(id, name),
        bookNumber:book_number_id(id, number),
        documentType:document_type_id(id, name),
        typist:typist_id(id, name),
        sellers:sale_agreement_parties(id, party_type, users:user_id(*)),
        buyers:sale_agreement_parties(id, party_type, users:user_id(*)),
        properties:sale_agreement_properties(id, properties:property_id(*))
      `)
      .eq("id", id)
      .single()

    if (error) {
      console.error("Error fetching document:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 })
    }

    // Filter sellers and buyers
    document.sellers = document.sellers.filter((party: any) => party.party_type === "seller")
    document.buyers = document.buyers.filter((party: any) => party.party_type === "buyer")

    // Generate PDF using Puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    })
    const page = await browser.newPage()

    // Generate HTML content
    const htmlContent = generateHtml(document)
    await page.setContent(htmlContent, { waitUntil: "networkidle0" })

    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "1cm",
        right: "1cm",
        bottom: "1cm",
        left: "1cm",
      },
    })

    await browser.close()

    // Create a safe filename
    const filename = document.document_name
      ? document.document_name.replace(/[^a-z0-9]/gi, "_").toLowerCase() + ".pdf"
      : `sale_agreement_${id}.pdf`

    // Return the PDF file
    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    })
  } catch (error) {
    console.error("Error in PDF download handler:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error occurred" },
      { status: 500 },
    )
  }
}

// Generate HTML content for PDF
function generateHtml(document: any) {
  // Format document date
  const documentDate = document.document_date
    ? new Date(document.document_date).toLocaleDateString("ta-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "தேதி குறிப்பிடப்படவில்லை"

  // Create HTML content
  return `
    <!DOCTYPE html>
    <html lang="ta">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${document.document_name || "கிரைய உடன்படிக்கை ஆவணம்"}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Tamil:wght@400;500;700&display=swap');
        
        body {
          font-family: 'Noto Sans Tamil', sans-serif;
          line-height: 1.6;
          color: #000;
          margin: 0;
          padding: 20px;
          background-color: white;
        }
        
        .container {
          max-width: 800px;
          margin: 0 auto;
          border: 1px solid #000;
          padding: 20px;
          background-color: white;
        }
        
        h1, h2, h3 {
          text-align: center;
          margin-bottom: 20px;
        }
        
        .date {
          text-align: center;
          margin-bottom: 30px;
        }
        
        .section {
          margin-bottom: 20px;
          text-align: justify;
        }
        
        .property-details {
          margin: 20px 0;
        }
        
        .signatures {
          display: flex;
          justify-content: space-between;
          margin-top: 50px;
          margin-bottom: 30px;
        }
        
        .signature {
          width: 45%;
        }
        
        .seller-signature {
          text-align: left;
        }
        
        .buyer-signature {
          text-align: right;
        }
        
        .witnesses {
          margin-top: 40px;
        }
        
        .witness-list {
          padding-left: 20px;
        }
        
        .typist {
          text-align: right;
          margin-top: 30px;
          font-style: italic;
        }
        
        .page-number {
          text-align: center;
          font-size: 12px;
          margin-top: 20px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>${document.document_name || "கிரைய உடன்படிக்கை ஆவணம்"}</h1>
        <div class="date">${documentDate}</div>
        
        ${generatePartiesSection(document)}
        ${generatePropertiesSection(document)}
        ${generatePaymentSection(document)}
        ${generateSignaturesSection(document)}
        ${generateWitnessesSection(document)}
        ${generateTypistSection(document)}
        
        <div class="page-number">பக்கம் 1</div>
      </div>
    </body>
    </html>
  `
}

// Generate parties section
function generatePartiesSection(document: any) {
  if (!document.sellers || !document.buyers || document.sellers.length === 0 || document.buyers.length === 0) {
    return '<div class="section">கட்சிகள் விவரங்கள் கிடைக்கவில்லை.</div>'
  }

  const sellerNames = document.sellers.map((seller: any) => seller.users?.name || "பெயர் குறிப்பிடப்படவில்லை").join(", ")
  const buyerNames = document.buyers.map((buyer: any) => buyer.users?.name || "பெயர் குறிப்பிடப்படவில்லை").join(", ")

  return `
    <div class="section">
      இந்த கிரைய உடன்படிக்கை ஆவணம் ${sellerNames} (இனி "விற்பவர்" என்று குறிப்பிடப்படுவார்) மற்றும் ${buyerNames} (இனி "வாங்குபவர்" என்று குறிப்பிடப்படுவார்) ஆகியோருக்கிடையே செய்யப்படுகிறது.
    </div>
  `
}

// Generate properties section
function generatePropertiesSection(document: any) {
  if (!document.properties || document.properties.length === 0) {
    return '<div class="section">சொத்து விவரங்கள் கிடைக்கவில்லை.</div>'
  }

  let propertiesHtml = '<div class="section"><h3>சொத்து விவரம்</h3>'

  document.properties.forEach((property: any, index: number) => {
    propertiesHtml += `
      <div class="property-details">
        <p><strong>சர்வே எண்:</strong> ${property.properties?.survey_number || ""}${
          property.properties?.sub_division_number ? ` / ${property.properties.sub_division_number}` : ""
        }</p>
        <p><strong>கிராமம்:</strong> ${property.properties?.villages?.name || ""}</p>
        <p><strong>தாலுகா:</strong> ${property.properties?.villages?.taluks?.name || ""}</p>
        <p><strong>மாவட்டம்:</strong> ${property.properties?.villages?.taluks?.districts?.name || ""}</p>
        <p><strong>பரப்பளவு:</strong> ${property.area || ""} ${property.area_unit || ""}</p>
        <p><strong>விலை:</strong> ₹${property.value || "0"}</p>
      </div>
    `
  })

  propertiesHtml += "</div>"
  return propertiesHtml
}

// Generate payment section
function generatePaymentSection(document: any) {
  if (!document.sale_amount) {
    return ""
  }

  return `
    <div class="section">
      <p><strong>விற்பனை தொகை:</strong> ₹${document.sale_amount}</p>
    </div>
  `
}

// Generate signatures section
function generateSignaturesSection(document: any) {
  return `
    <div class="signatures">
      <div class="signature seller-signature">
        <p><strong>விற்பவர்</strong></p>
        <p style="margin-top: 50px;">____________________</p>
      </div>
      <div class="signature buyer-signature">
        <p><strong>வாங்குபவர்</strong></p>
        <p style="margin-top: 50px;">____________________</p>
      </div>
    </div>
  `
}

// Generate witnesses section
function generateWitnessesSection(document: any) {
  if (!document.witnesses) {
    return ""
  }

  const witnesses = document.witnesses.split("\n")
  let witnessesHtml = '<div class="witnesses"><h3>சாட்சிகள்</h3><ol class="witness-list">'

  witnesses.forEach((witness: string) => {
    if (witness.trim()) {
      witnessesHtml += `<li>${witness.trim()}</li>`
    }
  })

  witnessesHtml += "</ol></div>"
  return witnessesHtml
}

// Generate typist section
function generateTypistSection(document: any) {
  if (!document.typist) {
    return ""
  }

  return `
    <div class="typist">
      <p>தட்டச்சு செய்தவர்: ${document.typist.name || ""}</p>
    </div>
  `
}
