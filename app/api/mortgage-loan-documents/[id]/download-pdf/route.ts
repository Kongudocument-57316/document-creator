import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import puppeteer from "puppeteer"
import { formatDate } from "@/lib/utils"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // Fetch document data
    const supabase = createRouteHandlerClient({ cookies })
    const { data: document, error } = await supabase.from("mortgage_loan_documents").select("*").eq("id", id).single()

    if (error) {
      console.error("Error fetching document:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 })
    }

    // Generate HTML content for PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>அடமான கடன் ஆவணம்</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 20px;
          }
          h1 {
            text-align: center;
            color: #0369a1;
            margin-bottom: 20px;
          }
          h2 {
            color: #0284c7;
            border-bottom: 1px solid #0284c7;
            padding-bottom: 5px;
            margin-top: 20px;
          }
          .header-info {
            text-align: right;
            margin-bottom: 20px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          table, th, td {
            border: 1px solid #ddd;
          }
          th, td {
            padding: 8px;
            text-align: left;
          }
          th {
            background-color: #f0f9ff;
            width: 30%;
          }
          .property-details {
            white-space: pre-wrap;
            margin-bottom: 20px;
          }
          .signatures {
            margin-top: 50px;
            text-align: center;
          }
          .signature-row {
            display: flex;
            justify-content: space-between;
            margin-top: 20px;
          }
          .signature-box {
            border-top: 1px solid #000;
            width: 200px;
            padding-top: 5px;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <h1>அடமான கடன் ஆவணம்</h1>
        
        <div class="header-info">
          <p><strong>ஆவண எண்:</strong> ${document.document_number || "-"}</p>
          <p><strong>தேதி:</strong> ${document.document_date ? formatDate(document.document_date) : "-"}</p>
        </div>
        
        <h2>அடிப்படை தகவல்</h2>
        <table>
          <tr>
            <th>கடன் தொகை</th>
            <td>₹ ${document.loan_amount?.toLocaleString() || "-"}</td>
          </tr>
          <tr>
            <th>கடன் தொகை (எழுத்தில்)</th>
            <td>${document.loan_amount_in_words || "-"}</td>
          </tr>
          <tr>
            <th>வட்டி விகிதம்</th>
            <td>${document.interest_rate || "-"}%</td>
          </tr>
          <tr>
            <th>கடன் காலம்</th>
            <td>${document.loan_duration || "-"} ${document.loan_duration_type || "-"}</td>
          </tr>
          <tr>
            <th>கடன் தொடக்க தேதி</th>
            <td>${document.loan_start_date ? formatDate(document.loan_start_date) : "-"}</td>
          </tr>
        </table>
        
        <h2>வாங்குபவர் விவரம் (கடன் பெறுபவர்)</h2>
        <table>
          <tr>
            <th>பெயர்</th>
            <td>${document.buyer_name || "-"}</td>
          </tr>
          <tr>
            <th>வயது</th>
            <td>${document.buyer_age || "-"}</td>
          </tr>
          <tr>
            <th>உறவினர் பெயர்</th>
            <td>${document.buyer_relations_name || "-"}</td>
          </tr>
          <tr>
            <th>உறவு முறை</th>
            <td>${document.buyer_relation_type || "-"}</td>
          </tr>
          <tr>
            <th>முகவரி</th>
            <td>${
              [
                document.buyer_door_no,
                document.buyer_address_line1,
                document.buyer_address_line2,
                document.buyer_address_line3,
                document.buyer_taluk,
                document.buyer_district,
                document.buyer_pincode,
              ]
                .filter(Boolean)
                .join(", ") || "-"
            }</td>
          </tr>
          <tr>
            <th>ஆதார் எண்</th>
            <td>${document.buyer_aadhar_no || "-"}</td>
          </tr>
          <tr>
            <th>தொலைபேசி எண்</th>
            <td>${document.buyer_phone_no || "-"}</td>
          </tr>
        </table>
        
        <h2>விற்பவர் விவரம் (கடன் கொடுப்பவர்)</h2>
        <table>
          <tr>
            <th>பெயர்</th>
            <td>${document.seller_name || "-"}</td>
          </tr>
          <tr>
            <th>வயது</th>
            <td>${document.seller_age || "-"}</td>
          </tr>
          <tr>
            <th>உறவினர் பெயர்</th>
            <td>${document.seller_relations_name || "-"}</td>
          </tr>
          <tr>
            <th>உறவு முறை</th>
            <td>${document.seller_relation_type || "-"}</td>
          </tr>
          <tr>
            <th>முகவரி</th>
            <td>${
              [
                document.seller_door_no,
                document.seller_address_line1,
                document.seller_address_line2,
                document.seller_address_line3,
                document.seller_taluk,
                document.seller_district,
                document.seller_pincode,
              ]
                .filter(Boolean)
                .join(", ") || "-"
            }</td>
          </tr>
          <tr>
            <th>ஆதார் எண்</th>
            <td>${document.seller_aadhar_no || "-"}</td>
          </tr>
          <tr>
            <th>தொலைபேசி எண்</th>
            <td>${document.seller_phone_no || "-"}</td>
          </tr>
        </table>
        
        <h2>சொத்து ஆவண விவரங்கள்</h2>
        <table>
          <tr>
            <th>ஆவண தேதி</th>
            <td>${document.pr_document_date ? formatDate(document.pr_document_date) : "-"}</td>
          </tr>
          <tr>
            <th>துணை பதிவாளர் அலுவலகம்</th>
            <td>${document.sub_register_office || "-"}</td>
          </tr>
          <tr>
            <th>புத்தக எண்</th>
            <td>${document.pr_book_no || "-"}</td>
          </tr>
          <tr>
            <th>ஆவண ஆண்டு</th>
            <td>${document.pr_document_year || "-"}</td>
          </tr>
          <tr>
            <th>ஆவண எண்</th>
            <td>${document.pr_document_no || "-"}</td>
          </tr>
          <tr>
            <th>ஆவண வகை</th>
            <td>${document.pr_document_type || "-"}</td>
          </tr>
        </table>
        
        <h2>சொத்து விவரம்</h2>
        <div class="property-details">
          ${document.property_details || "-"}
        </div>
        
        <h2>சாட்சி 1 விவரம்</h2>
        <table>
          <tr>
            <th>பெயர்</th>
            <td>${document.witness1_name || "-"}</td>
          </tr>
          <tr>
            <th>வயது</th>
            <td>${document.witness1_age || "-"}</td>
          </tr>
          <tr>
            <th>உறவினர் பெயர்</th>
            <td>${document.witness1_relations_name || "-"}</td>
          </tr>
          <tr>
            <th>உறவு முறை</th>
            <td>${document.witness1_relation_type || "-"}</td>
          </tr>
          <tr>
            <th>முகவரி</th>
            <td>${
              [
                document.witness1_door_no,
                document.witness1_address_line1,
                document.witness1_address_line2,
                document.witness1_address_line3,
                document.witness1_taluk,
                document.witness1_district,
                document.witness1_pincode,
              ]
                .filter(Boolean)
                .join(", ") || "-"
            }</td>
          </tr>
          <tr>
            <th>ஆதார் எண்</th>
            <td>${document.witness1_aadhar_no || "-"}</td>
          </tr>
        </table>
        
        <h2>சாட்சி 2 விவரம்</h2>
        <table>
          <tr>
            <th>பெயர்</th>
            <td>${document.witness2_name || "-"}</td>
          </tr>
          <tr>
            <th>வயது</th>
            <td>${document.witness2_age || "-"}</td>
          </tr>
          <tr>
            <th>உறவினர் பெயர்</th>
            <td>${document.witness2_relations_name || "-"}</td>
          </tr>
          <tr>
            <th>உறவு முறை</th>
            <td>${document.witness2_relation_type || "-"}</td>
          </tr>
          <tr>
            <th>முகவரி</th>
            <td>${
              [
                document.witness2_door_no,
                document.witness2_address_line1,
                document.witness2_address_line2,
                document.witness2_address_line3,
                document.witness2_taluk,
                document.witness2_district,
                document.witness2_pincode,
              ]
                .filter(Boolean)
                .join(", ") || "-"
            }</td>
          </tr>
          <tr>
            <th>ஆதார் எண்</th>
            <td>${document.witness2_aadhar_no || "-"}</td>
          </tr>
        </table>
        
        <h2>டைப்பிஸ்ட் ��ிவரம்</h2>
        <table>
          <tr>
            <th>டைப்பிஸ்ட் பெயர்</th>
            <td>${document.typist_name || "-"}</td>
          </tr>
          <tr>
            <th>அலுவலக பெயர்</th>
            <td>${document.typist_office_name || "-"}</td>
          </tr>
          <tr>
            <th>தொலைபேசி எண்</th>
            <td>${document.typist_phone_no || "-"}</td>
          </tr>
        </table>
        
        <div class="signatures">
          <h2>கையொப்பங்கள்</h2>
          <div class="signature-row">
            <div class="signature-box">வாங்குபவர் (கடன் பெறுபவர்)</div>
            <div class="signature-box">விற்பவர் (கடன் கொடுப்பவர்)</div>
          </div>
          
          <h2>சாட்சிகள்</h2>
          <div class="signature-row">
            <div class="signature-box">1. சாட்சி</div>
            <div class="signature-box">2. சாட்சி</div>
          </div>
        </div>
      </body>
      </html>
    `

    // Generate PDF using Puppeteer
    const browser = await puppeteer.launch({ headless: true })
    const page = await browser.newPage()
    await page.setContent(htmlContent)

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "20mm",
        right: "20mm",
        bottom: "20mm",
        left: "20mm",
      },
    })

    await browser.close()

    // Return PDF as download
    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="mortgage-loan-document-${id}.pdf"`,
      },
    })
  } catch (error) {
    console.error("Error generating PDF document:", error)
    return NextResponse.json({ error: "Error generating PDF document" }, { status: 500 })
  }
}
