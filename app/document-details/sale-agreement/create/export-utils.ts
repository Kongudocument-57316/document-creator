"use client"

import { toast } from "sonner"
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

// சிறப்பு எழுத்துரு பெயர்களை சரிபார்க்கும் செயல்பாடு
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

// மேம்படுத்தப்பட்ட DOCX ஏற்றுமதி செயல்பாடு
export const exportToDocx = (contentSelector: string, fileName: string) => {
  return async () => {
    try {
      toast.info("DOCX ஆவணம் உருவாக்கப்படுகிறது...", { duration: 2000 })

      // HTML உள்ளடக்கத்தைப் பெறுதல்
      const content = document.querySelector(contentSelector)
      if (!content) {
        toast.error("ஆவண உள்ளடக்கத்தைக் கண்டறிய முடியவில்லை")
        return
      }

      // தலைப்பு பெறுதல்
      const titleElement = content.querySelector("h1, h2, .text-3xl")
      const title = titleElement ? titleElement.textContent || "கிரைய உடன்படிக்கை ஆவணம்" : "கிரைய உடன்படிக்கை ஆவணம்"

      // தேதி பெறுதல்
      const dateElement = content.querySelector(".text-lg")
      const dateText = dateElement ? dateElement.textContent || "" : ""

      // உள்ளடக்கத்தை பிரித்தெடுத்தல்
      const contentSections = []

      // வாங்குபவர் மற்றும் விற்பவர் விவரங்கள்
      const partiesSection = content.querySelector(".mb-6.text-justify")
      if (partiesSection) {
        const partiesText = partiesSection.textContent || ""
        contentSections.push(
          createParagraph(partiesText, {
            keepNext: true,
            keepLines: true,
          }),
        )
      }

      // முந்தைய ஆவணம் விவரங்கள்
      const previousDocSection = content.querySelectorAll(".mb-6.text-justify")[1]
      if (previousDocSection) {
        const previousDocText = previousDocSection.textContent || ""
        contentSections.push(
          createParagraph(previousDocText, {
            keepLines: true,
          }),
        )
      }

      // பணம் செலுத்தும் முறை விவரங்கள்
      const paymentSection = content.querySelectorAll(".mb-6.text-justify")[2]
      if (paymentSection) {
        const paymentText = paymentSection.textContent || ""
        contentSections.push(
          createParagraph(paymentText, {
            keepLines: true,
          }),
        )
      }

      // சொத்து உரிமை விவரங்கள்
      const propertyRightsSection = content.querySelectorAll(".mb-6.text-justify")[3]
      if (propertyRightsSection) {
        const propertyRightsText = propertyRightsSection.textContent || ""
        contentSections.push(
          createParagraph(propertyRightsText, {
            keepLines: true,
          }),
        )
      }

      // பக்க பிரிப்பு சேர்த்தல்
      contentSections.push(new Paragraph({ children: [new PageBreak()] }))

      // சொத்து விவரங்கள்
      const propertyDetailsSection = content.querySelector(".mb-6 h3.text-xl.font-semibold.mb-2.text-center")
      if (propertyDetailsSection) {
        // தலைப்பு
        contentSections.push(
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

        // சொத்து விவரங்கள்
        const propertyDetails = content.querySelectorAll(".mb-6 .whitespace-pre-line")
        propertyDetails.forEach((detail) => {
          const detailText = detail.textContent || ""
          contentSections.push(
            createParagraph(detailText, {
              keepLines: true,
              lineSpacing: {
                before: 120,
                after: 240,
              },
            }),
          )
        })
      }

      // கையொப்ப பகுதி
      const signatureSection = content.querySelector(".flex.justify-between.mt-8.mb-6")
      if (signatureSection) {
        // கையொப்ப பகுதிக்கு இடைவெளி
        contentSections.push(
          createParagraph("\n\n", {
            lineSpacing: {
              before: 360,
              after: 240,
            },
          }),
        )

        // கையொப்ப பகுதி உருவாக்கம்
        const signatureTexts = signatureSection.querySelectorAll(".font-semibold")
        if (signatureTexts.length >= 2) {
          const sellerText = signatureTexts[0].textContent || "எழுதிக்கொடுப்பவர்"
          const buyerText = signatureTexts[1].textContent || "எழுதிவாங்குபவர்"

          // கையொப்ப அட்டவணை
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
                    children: [createParagraph(sellerText, { alignment: AlignmentType.LEFT, bold: true })],
                    width: {
                      size: 50,
                      type: WidthType.PERCENTAGE,
                    },
                    verticalAlign: VerticalAlign.CENTER,
                  }),
                  new TableCell({
                    children: [createParagraph(buyerText, { alignment: AlignmentType.RIGHT, bold: true })],
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

          contentSections.push(signatureTable)
        }
      }

      // பக்க பிரிப்பு சேர்த்தல்
      contentSections.push(new Paragraph({ children: [new PageBreak()] }))

      // சாட்சிகள் விவரங்கள்
      const witnessesSection = content.querySelector(".mb-6 h3.text-xl.font-semibold.mb-2")
      if (witnessesSection && witnessesSection.textContent?.includes("சாட்சிகள்")) {
        // தலைப்பு
        contentSections.push(
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

        // சாட்சிகள் பட்டியல்
        const witnessList = content.querySelectorAll(".mb-6 ol.list-decimal.pl-5 li")
        witnessList.forEach((witness, index) => {
          const witnessText = witness.textContent || ""
          contentSections.push(
            createParagraph(`${index + 1}. ${witnessText}`, {
              lineSpacing: {
                before: 120,
                after: 120,
              },
            }),
          )
        })
      }

      // தட்டச்சு விவரங்கள்
      const typistSection = content.querySelector(".mb-6 .text-right")
      if (typistSection) {
        const typistText = typistSection.textContent || ""
        contentSections.push(
          createParagraph(typistText, {
            alignment: AlignmentType.RIGHT,
            lineSpacing: {
              before: 360,
              after: 120,
            },
          }),
        )
      }

      // தலைப்பு மற்றும் அடிக்குறிப்பு
      const header = new Header({
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: title,
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

      // ஆவணம் உருவாக்கம்
      const doc = new Document({
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
            children: [
              // தலைப்பு
              new Paragraph({
                children: [
                  new TextRun({
                    text: title,
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
                    text: dateText,
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

              // உள்ளடக்கம்
              ...contentSections,
            ],
          },
        ],
      })

      // DOCX உருவாக்கம்
      const buffer = await Packer.toBuffer(doc)

      // Blob உருவாக்கி பதிவிறக்கம்
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      })

      // பதிவிறக்க இணைப்பு உருவாக்கம்
      const link = document.createElement("a")
      link.href = URL.createObjectURL(blob)
      link.download = `${fileName}.docx`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(link.href)

      toast.success("Word DOCX ஆவணம் வெற்றிகரமாக பதிவிறக்கப்பட்டது")
    } catch (error) {
      console.error("DOCX ஏற்றுமதியில் பிழை:", error)
      toast.error("DOCX ஏற்றுமதியில் பிழை ஏற்பட்டது")
    }
  }
}

// PDF ஏற்றுமதி செயல்பாடு
export const exportToPdf = (contentSelector: string, fileName: string) => {
  return async () => {
    try {
      toast.info("PDF ஆவணம் உருவாக்கப்படுகிறது...", { duration: 2000 })

      // HTML உள்ளடக்கத்தைப் பெறுதல்
      const content = document.querySelector(contentSelector)
      if (!content) {
        toast.error("ஆவண உள்ளடக்கத்தைக் கண்டறிய முடியவில்லை")
        return
      }

      // HTML2PDF நூலகத்தை உலாவியில் மட்டுமே பயன்படுத்த
      const html2pdf = await import("html2pdf.js").then((module) => module.default || module)

      // HTML2PDF விருப்பங்கள்
      const options = {
        margin: 10,
        filename: `${fileName}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          letterRendering: true,
          logging: false,
        },
        jsPDF: {
          unit: "mm",
          format: "a4",
          orientation: "portrait",
          putOnlyUsedFonts: true,
          floatPrecision: 16,
        },
        pagebreak: {
          mode: ["avoid-all", "css", "legacy"],
          before: ".page-break-before",
          after: ".page-break-after",
        },
      }

      // தலைப்பு பகுதிக்கு பக்க பிரிப்பு வகுப்பு சேர்த்தல்
      const titleSection = content.querySelector("h1, h2, .text-3xl")
      if (titleSection) {
        titleSection.classList.add("page-break-before")
      }

      // சொத்து விவரங்கள் பகுதிக்கு பக்க பிரிப்பு வகுப்பு சேர்த்தல்
      const propertySection = content.querySelector(".mb-6 h3.text-xl.font-semibold.mb-2.text-center")
      if (propertySection) {
        propertySection.classList.add("page-break-before")
      }

      // சாட்சிகள் பகுதிக்கு பக்க பிரிப்பு வகுப்பு சேர்த்தல்
      const witnessSection = content.querySelector(".mb-6 h3.text-xl.font-semibold.mb-2")
      if (witnessSection && witnessSection.textContent?.includes("சாட்சிகள்")) {
        witnessSection.classList.add("page-break-before")
      }

      // HTML to PDF மாற்றம்
      await html2pdf().from(content).set(options).save()

      toast.success("PDF ஆவணம் வெற்றிகரமாக பதிவிறக்கப்பட்டது")
    } catch (error) {
      console.error("PDF ஏற்றுமதியில் பிழை:", error)
      toast.error("PDF ஏற்றுமதியில் பிழை ஏற்பட்டது")
    }
  }
}
