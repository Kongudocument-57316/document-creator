import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import * as docx from "docx"
import { formatDate } from "@/lib/utils"

const {
  Document,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
} = docx

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

    // Create Word document
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              text: "அடமான கடன் ஆவணம்",
              heading: HeadingLevel.HEADING_1,
              alignment: AlignmentType.CENTER,
            }),
            new Paragraph({
              text: `ஆவண எண்: ${document.document_number || "-"}`,
              alignment: AlignmentType.RIGHT,
            }),
            new Paragraph({
              text: `தேதி: ${document.document_date ? formatDate(document.document_date) : "-"}`,
              alignment: AlignmentType.RIGHT,
            }),
            new Paragraph({
              text: "அடிப்படை தகவல்",
              heading: HeadingLevel.HEADING_2,
            }),
            createTable([
              ["கடன் தொகை", `₹ ${document.loan_amount?.toLocaleString() || "-"}`],
              ["கடன் தொகை (எழுத்தில்)", document.loan_amount_in_words || "-"],
              ["வட்டி விகிதம்", `${document.interest_rate || "-"}%`],
              ["கடன் காலம்", `${document.loan_duration || "-"} ${document.loan_duration_type || "-"}`],
              ["கடன் தொடக்க தேதி", document.loan_start_date ? formatDate(document.loan_start_date) : "-"],
            ]),

            new Paragraph({
              text: "வாங்குபவர் விவரம் (கடன் பெறுபவர்)",
              heading: HeadingLevel.HEADING_2,
            }),
            createTable([
              ["பெயர்", document.buyer_name || "-"],
              ["வயது", document.buyer_age || "-"],
              ["உறவினர் பெயர்", document.buyer_relations_name || "-"],
              ["உறவு முறை", document.buyer_relation_type || "-"],
              [
                "முகவரி",
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
                  .join(", ") || "-",
              ],
              ["ஆதார் எண்", document.buyer_aadhar_no || "-"],
              ["தொலைபேசி எண்", document.buyer_phone_no || "-"],
            ]),

            new Paragraph({
              text: "விற்பவர் விவரம் (கடன் கொடுப்பவர்)",
              heading: HeadingLevel.HEADING_2,
            }),
            createTable([
              ["பெயர்", document.seller_name || "-"],
              ["வயது", document.seller_age || "-"],
              ["உறவினர் பெயர்", document.seller_relations_name || "-"],
              ["உறவு முறை", document.seller_relation_type || "-"],
              [
                "முகவரி",
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
                  .join(", ") || "-",
              ],
              ["ஆதார் எண்", document.seller_aadhar_no || "-"],
              ["தொலைபேசி எண்", document.seller_phone_no || "-"],
            ]),

            new Paragraph({
              text: "சொத்து ஆவண விவரங்கள்",
              heading: HeadingLevel.HEADING_2,
            }),
            createTable([
              ["ஆவண தேதி", document.pr_document_date ? formatDate(document.pr_document_date) : "-"],
              ["துணை பதிவாளர் அலுவலகம்", document.sub_register_office || "-"],
              ["புத்தக எண்", document.pr_book_no || "-"],
              ["ஆவண ஆண்டு", document.pr_document_year || "-"],
              ["ஆவண எண்", document.pr_document_no || "-"],
              ["ஆவண வகை", document.pr_document_type || "-"],
            ]),

            new Paragraph({
              text: "சொத்து விவரம்",
              heading: HeadingLevel.HEADING_2,
            }),
            new Paragraph({
              text: document.property_details || "-",
            }),

            new Paragraph({
              text: "சாட்சி 1 விவரம்",
              heading: HeadingLevel.HEADING_2,
            }),
            createTable([
              ["பெயர்", document.witness1_name || "-"],
              ["வயது", document.witness1_age || "-"],
              ["உறவினர் பெயர்", document.witness1_relations_name || "-"],
              ["உறவு முறை", document.witness1_relation_type || "-"],
              [
                "முகவரி",
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
                  .join(", ") || "-",
              ],
              ["ஆதார் எண்", document.witness1_aadhar_no || "-"],
            ]),

            new Paragraph({
              text: "சாட்சி 2 விவரம்",
              heading: HeadingLevel.HEADING_2,
            }),
            createTable([
              ["பெயர்", document.witness2_name || "-"],
              ["வயது", document.witness2_age || "-"],
              ["உறவினர் பெயர்", document.witness2_relations_name || "-"],
              ["உறவு முறை", document.witness2_relation_type || "-"],
              [
                "முகவரி",
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
                  .join(", ") || "-",
              ],
              ["ஆதார் எண்", document.witness2_aadhar_no || "-"],
            ]),

            new Paragraph({
              text: "டைப்பிஸ்ட் விவரம்",
              heading: HeadingLevel.HEADING_2,
            }),
            createTable([
              ["டைப்பிஸ்ட் பெயர்", document.typist_name || "-"],
              ["அலுவலக பெயர்", document.typist_office_name || "-"],
              ["தொலைபேசி எண்", document.typist_phone_no || "-"],
            ]),

            new Paragraph({
              text: "",
              spacing: {
                after: 400,
              },
            }),

            new Paragraph({
              text: "கையொப்பங்கள்",
              heading: HeadingLevel.HEADING_2,
              alignment: AlignmentType.CENTER,
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: "வாங்குபவர் (கடன் பெறுபவர்)",
                  bold: true,
                }),
                new TextRun({
                  text: "                                                                   ",
                }),
                new TextRun({
                  text: "விற்பவர் (கடன் கொடுப்பவர்)",
                  bold: true,
                }),
              ],
            }),

            new Paragraph({
              text: "",
              spacing: {
                after: 400,
              },
            }),

            new Paragraph({
              text: "சாட்சிகள்",
              heading: HeadingLevel.HEADING_2,
              alignment: AlignmentType.CENTER,
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: "1. ",
                  bold: true,
                }),
                new TextRun({
                  text: "                                                                                   ",
                }),
                new TextRun({
                  text: "2. ",
                  bold: true,
                }),
              ],
            }),
          ],
        },
      ],
    })

    // Generate document buffer
    const buffer = await docx.Packer.toBuffer(doc)

    // Return document as download
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="mortgage-loan-document-${id}.docx"`,
      },
    })
  } catch (error) {
    console.error("Error generating Word document:", error)
    return NextResponse.json({ error: "Error generating Word document" }, { status: 500 })
  }
}

function createTable(rows: string[][]) {
  return new Table({
    width: {
      size: 100,
      type: WidthType.PERCENTAGE,
    },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 1 },
      bottom: { style: BorderStyle.SINGLE, size: 1 },
      left: { style: BorderStyle.SINGLE, size: 1 },
      right: { style: BorderStyle.SINGLE, size: 1 },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 1 },
      insideVertical: { style: BorderStyle.SINGLE, size: 1 },
    },
    rows: rows.map(
      (row) =>
        new TableRow({
          children: [
            new TableCell({
              width: {
                size: 30,
                type: WidthType.PERCENTAGE,
              },
              children: [new Paragraph({ text: row[0], alignment: AlignmentType.LEFT })],
            }),
            new TableCell({
              width: {
                size: 70,
                type: WidthType.PERCENTAGE,
              },
              children: [new Paragraph({ text: row[1], alignment: AlignmentType.LEFT })],
            }),
          ],
        }),
    ),
  })
}
