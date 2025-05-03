import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase"
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  HeadingLevel,
  BorderStyle,
  TableRow,
  TableCell,
  Table,
  WidthType,
  PageNumber,
  Header,
  Footer,
  PageOrientation,
  PageBorderDisplay,
  PageBorderOffsetFrom,
  PageBorderZOrder,
  SectionType,
  convertInchesToTwip,
  UnderlineType,
  PageBreak,
  LineRuleType,
  HeightRule,
  VerticalAlign,
  TableBorders,
  TableLayoutType,
  type ITableBordersOptions,
} from "docx"

// தமிழ் எழுத்துருக்கள் பட்டியல்
const TAMIL_FONTS = [
  "Nirmala UI",
  "Latha",
  "Vijaya",
  "Tamil MN",
  "InaiMathi",
  "Bamini",
  "Kavivanar",
  "Catamaran",
  "Mukta Malar",
  "Noto Sans Tamil",
]

// சிறப்பு எழுத்துரு பெயர்களை சரிபார்க்கும் ச���யல்பாடு
const getBestTamilFont = () => {
  // முதல் எழுத்துருவை பயன்படுத்து
  return TAMIL_FONTS[0]
}

// அட்டவணை எல்லைகள் உருவாக்கும் செயல்பாடு
const createTableBorders = (options: Partial<ITableBordersOptions> = {}): TableBorders => {
  const defaultBorder = {
    style: BorderStyle.SINGLE,
    size: 1,
    color: "000000",
  }

  return new TableBorders({
    top: options.top || defaultBorder,
    bottom: options.bottom || defaultBorder,
    left: options.left || defaultBorder,
    right: options.right || defaultBorder,
    insideHorizontal: options.insideHorizontal || defaultBorder,
    insideVertical: options.insideVertical || defaultBorder,
  })
}

// பத்தி உருவாக்கும் செயல்பாடு
const createParagraph = (text: string, options: any = {}) => {
  const {
    alignment = AlignmentType.JUSTIFIED,
    heading = false,
    headingLevel = HeadingLevel.HEADING_1,
    bold = false,
    fontSize = 24, // 12pt
    font = getBestTamilFont(),
    spacing = 240, // 1.0 line spacing
    indent = 0,
    border = false,
    underline = false,
    pageBreakBefore = false,
    keepNext = false,
    keepLines = false,
    lineSpacing = {
      before: 120, // 6pt
      after: 120, // 6pt
    },
  } = options

  // உரையை வரிகளாக பிரித்தல்
  const lines = text.split("\n")

  const textRuns = lines.flatMap((line, index) => {
    const runs = []

    // உரை இருந்தால் TextRun சேர்
    if (line.trim()) {
      runs.push(
        new TextRun({
          text: line.trim(),
          bold: bold,
          size: fontSize,
          font: font,
          underline: underline ? UnderlineType.SINGLE : undefined,
        }),
      )
    }

    // கடைசி வரி அல்லாவிட்டால் வரி முறிவு சேர்
    if (index < lines.length - 1) {
      runs.push(new TextRun({ break: 1 }))
    }

    return runs
  })

  return new Paragraph({
    children: textRuns,
    alignment: alignment,
    heading: heading ? headingLevel : undefined,
    spacing: {
      line: spacing,
      lineRule: LineRuleType.EXACT,
      before: lineSpacing.before,
      after: lineSpacing.after,
    },
    indent: {
      firstLine: convertInchesToTwip(indent),
    },
    border: border
      ? {
          top: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
          bottom: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
          left: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
          right: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
        }
      : undefined,
    pageBreakBefore: pageBreakBefore,
    keepNext: keepNext,
    keepLines: keepLines,
  })
}

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
    const sellers = document.sellers.filter((party: any) => party.party_type === "seller")
    const buyers = document.buyers.filter((party: any) => party.party_type === "buyer")

    // Format document date
    const documentDate = document.document_date
      ? new Date(document.document_date).toLocaleDateString("ta-IN", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "தேதி குறிப்பிடப்படவில்லை"

    // Create DOCX document
    const docxDocument = await generateDocx(document, sellers, buyers, documentDate)

    // Convert to buffer
    const buffer = await Packer.toBuffer(docxDocument)

    // Create a safe filename
    const filename = document.document_name
      ? document.document_name.replace(/[^a-z0-9]/gi, "_").toLowerCase() + ".docx"
      : `sale_agreement_${id}.docx`

    // Return the DOCX file
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    })
  } catch (error) {
    console.error("Error in download handler:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error occurred" },
      { status: 500 },
    )
  }
}

// DOCX ஆவணம் உருவாக்கும் செயல்பாடு
async function generateDocx(document: any, sellers: any[], buyers: any[], documentDate: string) {
  // தலைப்பு மற்றும் அடிக்குறிப்பு
  const header = new Header({
    children: [
      new Paragraph({
        children: [
          new TextRun({
            text: document.document_name || "கிரைய உடன்படிக்கை ஆவணம்",
            bold: true,
            size: 20, // 10pt
            font: getBestTamilFont(),
          }),
        ],
        alignment: AlignmentType.RIGHT,
        spacing: {
          after: 200,
        },
      }),
    ],
  })

  const footer = new Footer({
    children: [
      new Paragraph({
        children: [
          new TextRun({
            text: "பக்கம் ",
            size: 16, // 8pt
            font: getBestTamilFont(),
          }),
          new TextRun({
            children: [PageNumber.CURRENT],
            size: 16, // 8pt
            font: getBestTamilFont(),
          }),
          new TextRun({
            text: " / ",
            size: 16, // 8pt
            font: getBestTamilFont(),
          }),
          new TextRun({
            children: [PageNumber.TOTAL_PAGES],
            size: 16, // 8pt
            font: getBestTamilFont(),
          }),
        ],
        alignment: AlignmentType.CENTER,
      }),
    ],
  })

  // ஆவண உள்ளடக்கம்
  const children = [
    // தலைப்பு
    new Paragraph({
      children: [
        new TextRun({
          text: document.document_name || "கிரைய உடன்படிக்கை ஆவணம்",
          bold: true,
          size: 32, // 16pt
          font: getBestTamilFont(),
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: {
        after: 400, // 20pt
      },
      keepNext: true,
    }),

    // தேதி
    new Paragraph({
      children: [
        new TextRun({
          text: documentDate,
          size: 24, // 12pt
          font: getBestTamilFont(),
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: {
        after: 400, // 20pt
      },
      keepNext: true,
    }),
  ]

  // வாங்குபவர் மற்றும் விற்பவர் விவரங்கள்
  if (sellers.length > 0 && buyers.length > 0) {
    const sellerNames = sellers.map((seller: any) => seller.users?.name || "பெயர் குறிப்பிடப்படவில்லை").join(", ")
    const buyerNames = buyers.map((buyer: any) => buyer.users?.name || "பெயர் குறிப்பிடப்படவில்லை").join(", ")

    const partiesText = `இந்த கிரைய உடன்படிக்கை ஆவணம் ${sellerNames} (இனி "விற்பவர்" என்று குறிப்பிடப்படுவார்) மற்றும் ${buyerNames} (இனி "வாங்குபவர்" என்று குறிப்பிடப்படுவார்) ஆகியோருக்கிடையே செய்யப்படுகிறது.`

    children.push(
      createParagraph(partiesText, {
        keepNext: true,
        keepLines: true,
      }),
    )
  }

  // பக்க பிரிப்பு சேர்த்தல்
  children.push(new Paragraph({ children: [new PageBreak()] }))

  // சொத்து விவரங்கள்
  if (document.properties && document.properties.length > 0) {
    children.push(
      createParagraph("சொத்து விவரம்", {
        alignment: AlignmentType.CENTER,
        bold: true,
        fontSize: 28, // 14pt
        keepNext: true,
        lineSpacing: {
          before: 240,
          after: 240,
        },
      }),
    )

    document.properties.forEach((property: any, index: number) => {
      const propertyDetails = `
சர்வே எண்: ${property.properties?.survey_number || ""}${property.properties?.sub_division_number ? ` / ${property.properties.sub_division_number}` : ""}
கிராமம்: ${property.properties?.villages?.name || ""}
தாலுகா: ${property.properties?.villages?.taluks?.name || ""}
மாவட்டம்: ${property.properties?.villages?.taluks?.districts?.name || ""}
பரப்பளவு: ${property.area || ""} ${property.area_unit || ""}
விலை: ₹${property.value || "0"}
      `
      children.push(
        createParagraph(propertyDetails, {
          keepLines: true,
          lineSpacing: {
            before: 120,
            after: 240,
          },
        }),
      )
    })
  }

  // விற்பனை தொகை
  if (document.sale_amount) {
    children.push(
      createParagraph(`விற்பனை தொகை: ₹${document.sale_amount}`, {
        bold: true,
        lineSpacing: {
          before: 240,
          after: 240,
        },
      }),
    )
  }

  // கையொப்ப பகுதி
  children.push(
    createParagraph("\n\n", {
      lineSpacing: {
        before: 360,
        after: 240,
      },
    }),
  )

  const signatureTable = new Table({
    width: {
      size: 100,
      type: WidthType.PERCENTAGE,
    },
    borders: createTableBorders({
      top: { style: BorderStyle.NONE },
      bottom: { style: BorderStyle.NONE },
      left: { style: BorderStyle.NONE },
      right: { style: BorderStyle.NONE },
      insideHorizontal: { style: BorderStyle.NONE },
      insideVertical: { style: BorderStyle.NONE },
    }),
    layout: TableLayoutType.FIXED,
    rows: [
      new TableRow({
        children: [
          new TableCell({
            children: [createParagraph("விற்பவர்", { alignment: AlignmentType.LEFT, bold: true })],
            width: {
              size: 50,
              type: WidthType.PERCENTAGE,
            },
            verticalAlign: VerticalAlign.CENTER,
          }),
          new TableCell({
            children: [createParagraph("வாங்குபவர்", { alignment: AlignmentType.RIGHT, bold: true })],
            width: {
              size: 50,
              type: WidthType.PERCENTAGE,
            },
            verticalAlign: VerticalAlign.CENTER,
          }),
        ],
        height: {
          value: 400,
          rule: HeightRule.EXACT,
        },
      }),
      new TableRow({
        children: [
          new TableCell({
            children: [createParagraph("\n\n\n", { alignment: AlignmentType.LEFT })],
          }),
          new TableCell({
            children: [createParagraph("\n\n\n", { alignment: AlignmentType.RIGHT })],
          }),
        ],
        height: {
          value: 800,
          rule: HeightRule.EXACT,
        },
      }),
    ],
  })

  children.push(signatureTable)

  // பக்க பிரிப்பு சேர்த்தல்
  children.push(new Paragraph({ children: [new PageBreak()] }))

  // சாட்சிகள் விவரங்கள்
  if (document.witnesses) {
    children.push(
      createParagraph("சாட்சிகள்", {
        alignment: AlignmentType.LEFT,
        bold: true,
        fontSize: 28, // 14pt
        keepNext: true,
        lineSpacing: {
          before: 240,
          after: 240,
        },
      }),
    )

    const witnesses = document.witnesses.split("\n")
    witnesses.forEach((witness: string, index: number) => {
      if (witness.trim()) {
        children.push(
          createParagraph(`${index + 1}. ${witness.trim()}`, {
            lineSpacing: {
              before: 120,
              after: 120,
            },
          }),
        )
      }
    })
  }

  // தட்டச்சு விவரங்கள்
  if (document.typist) {
    const typistText = `தட்டச்சு செய்தவர்: ${document.typist.name || ""}`
    children.push(
      createParagraph(typistText, {
        alignment: AlignmentType.RIGHT,
        lineSpacing: {
          before: 360,
          after: 120,
        },
      }),
    )
  }

  // ஆவணம் உருவாக்கம்
  return new Document({
    sections: [
      {
        properties: {
          type: SectionType.CONTINUOUS,
          page: {
            margin: {
              top: 1440, // 1 inch
              right: 1440, // 1 inch
              bottom: 1440, // 1 inch
              left: 1440, // 1 inch
            },
            size: {
              orientation: PageOrientation.PORTRAIT,
            },
            borders: {
              pageBorderTop: {
                style: BorderStyle.SINGLE,
                size: 1,
                color: "000000",
                space: 24,
              },
              pageBorderRight: {
                style: BorderStyle.SINGLE,
                size: 1,
                color: "000000",
                space: 24,
              },
              pageBorderBottom: {
                style: BorderStyle.SINGLE,
                size: 1,
                color: "000000",
                space: 24,
              },
              pageBorderLeft: {
                style: BorderStyle.SINGLE,
                size: 1,
                color: "000000",
                space: 24,
              },
              pageBorderDisplay: PageBorderDisplay.ALL_PAGES,
              pageBorderOffsetFrom: PageBorderOffsetFrom.PAGE,
              pageBorderZOrder: PageBorderZOrder.FRONT,
            },
          },
        },
        headers: {
          default: header,
        },
        footers: {
          default: footer,
        },
        children: children,
      },
    ],
  })
}
