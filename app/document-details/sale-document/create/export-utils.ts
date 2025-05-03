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
  Footer,
  PageOrientation,
  PageBorderDisplay,
  PageBorderOffsetFrom,
  PageBorderZOrder,
  SectionType,
  convertInchesToTwip,
  UnderlineType,
  LevelFormat,
  Header,
} from "docx"

// தமிழ் எழுத்துருக்கள் பட்டியல்
const TAMIL_FONTS = [
  "Mukta Malar", // Primary font as requested
  "Nirmala UI",
  "Latha",
  "Vijaya",
  "Tamil MN",
  "InaiMathi",
  "Bamini",
  "Kavivanar",
  "Catamaran",
]

// சிறப்பு எழுத்துரு பெயர்களை சரிபார்க்கும் செயல்பாடு
const getBestTamilFont = () => {
  // முதல் எழுத்துருவை பயன்படுத்து
  return TAMIL_FONTS[0]
}

// HTML உள்ளடக்கத்தை பிரித்தெடுக்கும் செயல்பாடு
const extractContentFromHTML = (htmlContent: HTMLElement): any[] => {
  const sections = []

  // தலைப்பு பிரித்தெடுத்தல்
  const titleElement = htmlContent.querySelector("h1")
  if (titleElement) {
    sections.push({
      type: "heading",
      level: HeadingLevel.HEADING_1,
      text: titleElement.textContent || "",
      alignment: AlignmentType.CENTER,
    })
  }

  // பத்திகளை பிரித்தெடுத்தல்
  const paragraphs = htmlContent.querySelectorAll("p")
  paragraphs.forEach((para) => {
    sections.push({
      type: "paragraph",
      text: para.textContent || "",
      alignment:
        para.style.textAlign === "center"
          ? AlignmentType.CENTER
          : para.style.textAlign === "right"
            ? AlignmentType.RIGHT
            : AlignmentType.JUSTIFIED,
    })
  })

  // தலைப்புகளை பிரித்தெடுத்தல்
  const headings = htmlContent.querySelectorAll("h2, h3, h4")
  headings.forEach((heading) => {
    const level =
      heading.tagName === "H2"
        ? HeadingLevel.HEADING_2
        : heading.tagName === "H3"
          ? HeadingLevel.HEADING_3
          : HeadingLevel.HEADING_4

    sections.push({
      type: "heading",
      level: level,
      text: heading.textContent || "",
      alignment: heading.style.textAlign === "center" ? AlignmentType.CENTER : AlignmentType.LEFT,
    })
  })

  return sections
}

// Check if text contains English characters or numbers
const containsEnglishOrNumbers = (text: string): boolean => {
  return /[a-zA-Z0-9]/.test(text)
}

// பத்தி உருவாக்கும் செயல்பாடு
const createParagraph = (text: string, options: any = {}) => {
  const {
    alignment = AlignmentType.JUSTIFIED,
    heading = false,
    headingLevel = HeadingLevel.HEADING_1,
    bold = false,
    fontSize = 28, // 14pt (28 half-points)
    font = getBestTamilFont(),
    spacing = 240, // 1.0 line spacing
    indent = 0,
    border = false,
    underline = false,
    firstLineIndent = 0.5, // Default first line indent in inches
  } = options

  // உரையை வரிகளாக பிரித்தல்
  const lines = text.split("\n")

  const textRuns = lines.flatMap((line, index) => {
    const runs = []

    // உரை இருந்தால் TextRun சேர்
    if (line.trim()) {
      // Split the line into segments of Tamil and English/numbers
      let currentSegment = ""
      let currentIsEnglish = containsEnglishOrNumbers(line[0] || "")
      const segments = []

      for (let i = 0; i < line.length; i++) {
        const char = line[i]
        const isEnglish = containsEnglishOrNumbers(char)

        if (isEnglish !== currentIsEnglish) {
          segments.push({
            text: currentSegment,
            isEnglish: currentIsEnglish,
          })
          currentSegment = char
          currentIsEnglish = isEnglish
        } else {
          currentSegment += char
        }
      }

      // Add the last segment
      if (currentSegment) {
        segments.push({
          text: currentSegment,
          isEnglish: currentIsEnglish,
        })
      }

      // Create TextRun for each segment with appropriate font
      segments.forEach((segment) => {
        if (segment.text.trim()) {
          runs.push(
            new TextRun({
              text: segment.text.trim(),
              bold: bold,
              size: fontSize, // 14pt
              font: segment.isEnglish ? "Times New Roman" : font,
              underline: underline ? UnderlineType.SINGLE : undefined,
            }),
          )
        }
      })
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
      before: 120, // 6pt
      after: 120, // 6pt
    },
    indent: {
      firstLine: convertInchesToTwip(firstLineIndent),
      left: convertInchesToTwip(indent),
    },
    border: border
      ? {
          top: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
          bottom: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
          left: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
          right: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
        }
      : undefined,
  })
}

// Create a numbered list item
const createNumberedListItem = (text: string, level: number, number: number, options: any = {}) => {
  const {
    fontSize = 28, // 14pt (28 half-points)
    font = getBestTamilFont(),
    bold = false,
  } = options

  // Split text into Tamil and English/numbers segments
  let currentSegment = ""
  let currentIsEnglish = containsEnglishOrNumbers(text[0] || "")
  const segments = []

  for (let i = 0; i < text.length; i++) {
    const char = text[i]
    const isEnglish = containsEnglishOrNumbers(char)

    if (isEnglish !== currentIsEnglish) {
      segments.push({
        text: currentSegment,
        isEnglish: currentIsEnglish,
      })
      currentSegment = char
      currentIsEnglish = isEnglish
    } else {
      currentSegment += char
    }
  }

  // Add the last segment
  if (currentSegment) {
    segments.push({
      text: currentSegment,
      isEnglish: currentIsEnglish,
    })
  }

  // Create TextRun for each segment with appropriate font
  const textRuns = segments.map((segment) => {
    return new TextRun({
      text: segment.text,
      bold: bold,
      size: fontSize,
      font: segment.isEnglish ? "Times New Roman" : font,
    })
  })

  return new Paragraph({
    children: textRuns,
    numbering: {
      reference: "my-numbering",
      level: level,
      instance: number,
    },
    spacing: {
      line: 240, // 1.0 line spacing
      before: 120, // 6pt
      after: 120, // 6pt
    },
  })
}

// மேம்படுத்தப்பட்ட DOCX ஏற்றுமதி செயல்பாடு
export const exportToDocx = (contentSelector: string, fileName: string) => {
  return async () => {
    try {
      // HTML உள்ளடக்கத்தைப் பெறுதல்
      const content = document.querySelector(contentSelector)
      if (!content) {
        toast.error("ஆவண உள்ளடக்கத்தைக் கண்டறிய முடியவில்லை")
        return
      }

      // தலைப்பு பெறுதல்
      const titleElement = content.querySelector("h1, h2, .text-3xl")
      const title = titleElement ? titleElement.textContent || "கிரைய ஆவணம்" : "கிரைய ஆவணம்"

      // தேதி பெறுதல்
      const dateElement = content.querySelector(".text-lg")
      const dateText = dateElement ? dateElement.textContent || "" : ""

      // வாங்குபவர் மற்றும் விற்பவர் விவரங்கள் பெறுதல்
      const buyersElement = content.querySelectorAll(".mb-6.text-justify div:first-child p")
      const buyersText = buyersElement
        ? Array.from(buyersElement)
            .map((el) => el.textContent)
            .join("\n")
        : ""
      const isBuyersPlural = buyersElement && buyersElement.length > 1
      const buyerLabel = isBuyersPlural ? "எழுதிவாங்குபவர்கள்" : "எழுதிவாங்குபவர்"

      const sellersElement = content.querySelectorAll(".mb-6.text-justify div:not(:first-child) p")
      const sellersText = sellersElement
        ? Array.from(sellersElement)
            .map((el) => el.textContent)
            .join("\n")
        : ""
      const isSellersPlural = sellersElement && sellersElement.length > 1
      const sellerLabel = isSellersPlural ? "எழுதிக்கொடுப்பவர்கள்" : "எழுதிக்கொடுப்பவர்"

      // உள்ளடககத்தை பிரித்தெடுத்தல்
      const contentSections = []

      // வாங்குபவர் மற்றும் விற்பவர் விவரங்கள்
      const partiesSection = content.querySelector(".mb-6.text-justify")
      if (partiesSection) {
        const partiesText = partiesSection.textContent || ""
        contentSections.push(createParagraph(partiesText, { firstLineIndent: 0.5 }))
      }

      // முந்தைய ஆவணம் விவரங்கள்
      const previousDocSection = content.querySelectorAll(".mb-6.text-justify")[1]
      if (previousDocSection) {
        const previousDocText = previousDocSection.textContent || ""
        contentSections.push(createParagraph(previousDocText, { firstLineIndent: 0.5 }))
      }

      // பணம் செலுத்தும் முறை விவரங்கள்
      const paymentSection = content.querySelectorAll(".mb-6.text-justify")[2]
      if (paymentSection) {
        const paymentText = paymentSection.textContent || ""
        contentSections.push(createParagraph(paymentText, { firstLineIndent: 0.5 }))
      }

      // சொத்து உரிமை விவரங்கள்
      const propertyRightsSection = content.querySelectorAll(".mb-6.text-justify")[3]
      if (propertyRightsSection) {
        const propertyRightsText = propertyRightsSection.textContent || ""
        // ஒவ்வொரு பத்தியையும் தனித்தனியாக பிரித்து சேர்க்கவும்
        const paragraphs = propertyRightsText.split(/\n\s*\n/)
        paragraphs.forEach((para) => {
          if (para.trim()) {
            contentSections.push(createParagraph(para, { firstLineIndent: 0.5 }))
          }
        })
      }

      // சொத்து விவரங்கள்
      const propertyDetailsSection = content.querySelector(".mb-6 h3.text-xl.font-semibold.mb-2.text-center")
      if (propertyDetailsSection) {
        // தலைப்பு
        contentSections.push(
          createParagraph("சொத்து விவரம்", {
            alignment: AlignmentType.CENTER,
            bold: true,
            fontSize: 28, // 14pt
            spacing: 360, // 1.5 line spacing
          }),
        )

        // சொத்து விவரங்கள்
        const propertyDetails = content.querySelectorAll(".mb-6 .whitespace-pre-line")
        propertyDetails.forEach((detail) => {
          const detailText = detail.textContent || ""
          contentSections.push(createParagraph(detailText, { firstLineIndent: 0.5 }))
        })
      }

      // சாட்சிகள் விவரங்கள்
      const witnessesSection = content.querySelector(".mb-6 h3.text-xl.font-semibold.mb-2")
      if (witnessesSection && witnessesSection.textContent?.includes("சாட்சிகள்")) {
        // தலைப்பு
        contentSections.push(
          createParagraph("சாட்சிகள்", {
            alignment: AlignmentType.LEFT,
            bold: true,
            fontSize: 28, // 14pt
            spacing: 360, // 1.5 line spacing
          }),
        )

        // சாட்சிகள் பட்டியல்
        const witnessList = content.querySelectorAll(".mb-6 ol.list-decimal.pl-5 li")

        // Create a numbered list for witnesses
        witnessList.forEach((witness, index) => {
          const witnessText = witness.textContent || ""
          contentSections.push(createNumberedListItem(witnessText, 0, index + 1))
        })
      }

      // தட்டச்சு விவரங்கள்
      const typistSection = content.querySelector(".mb-6 .text-right")
      if (typistSection) {
        const typistText = typistSection.textContent || ""
        contentSections.push(createParagraph(typistText, { alignment: AlignmentType.RIGHT }))
      }

      // ஆவணம் உருவாக்கம்
      const doc = new Document({
        numbering: {
          config: [
            {
              reference: "my-numbering",
              levels: [
                {
                  level: 0,
                  format: LevelFormat.DECIMAL,
                  text: "%1.",
                  alignment: AlignmentType.LEFT,
                  style: {
                    paragraph: {
                      indent: { left: convertInchesToTwip(0.5), hanging: convertInchesToTwip(0.25) },
                    },
                  },
                },
              ],
            },
          ],
        },
        sections: [
          {
            properties: {
              type: SectionType.NEXT_PAGE,
              page: {
                margin: {
                  top: 1440, // 1 inch (5cm would be ~1968)
                  right: 1440, // 1 inch
                  bottom: 1440, // 1 inch
                  left: 1440, // 1 inch
                },
                size: {
                  width: 8.5 * 1440, // Legal width in twips (8.5 inches)
                  height: 14 * 1440, // Legal height in twips (14 inches)
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
            footers: {
              default: new Footer({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "பக்கம் ",
                        size: 28, // 14pt
                        font: getBestTamilFont(),
                      }),
                      new TextRun({
                        children: [PageNumber.CURRENT],
                        size: 28, // 14pt
                        font: "Times New Roman",
                      }),
                      new TextRun({
                        text: " / ",
                        size: 28, // 14pt
                        font: getBestTamilFont(),
                      }),
                      new TextRun({
                        children: [PageNumber.TOTAL_PAGES],
                        size: 28, // 14pt
                        font: "Times New Roman",
                      }),
                    ],
                    alignment: AlignmentType.CENTER,
                  }),
                ],
              }),
              first: new Footer({
                children: [
                  // Add seller and buyer at the bottom of first page
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: sellerLabel,
                        bold: true,
                        size: 28, // 14pt
                        font: getBestTamilFont(),
                      }),
                    ],
                    alignment: AlignmentType.LEFT,
                    spacing: {
                      before: 360, // 18pt
                    },
                  }),
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: buyerLabel,
                        bold: true,
                        size: 28, // 14pt
                        font: getBestTamilFont(),
                      }),
                    ],
                    alignment: AlignmentType.RIGHT,
                  }),
                ],
              }),
              even: new Footer({
                children: [
                  // Add seller and buyer at the bottom of second page
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: sellerLabel,
                        bold: true,
                        size: 28, // 14pt
                        font: getBestTamilFont(),
                      }),
                    ],
                    alignment: AlignmentType.LEFT,
                    spacing: {
                      before: 360, // 18pt
                    },
                  }),
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: buyerLabel,
                        bold: true,
                        size: 28, // 14pt
                        font: getBestTamilFont(),
                      }),
                    ],
                    alignment: AlignmentType.RIGHT,
                  }),
                ],
              }),
            },
            headers: {
              default: new Header({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "பக்கம் ",
                        size: 28, // 14pt
                        font: getBestTamilFont(),
                      }),
                      new TextRun({
                        children: [PageNumber.CURRENT],
                        size: 28, // 14pt
                        font: "Times New Roman",
                      }),
                      new TextRun({
                        text: " / ",
                        size: 28, // 14pt
                        font: getBestTamilFont(),
                      }),
                      new TextRun({
                        children: [PageNumber.TOTAL_PAGES],
                        size: 28, // 14pt
                        font: "Times New Roman",
                      }),
                    ],
                    alignment: AlignmentType.CENTER,
                  }),
                ],
              }),
            },
            children: [
              // First page with 15.5cm top margin
              new Paragraph({
                children: [
                  new TextRun({
                    text: "",
                    size: 28, // 14pt
                  }),
                ],
                spacing: {
                  before: 4400, // ~15.5cm in twips
                },
                pageBreakBefore: true,
              }),

              // Second page with 15.5cm top margin
              new Paragraph({
                children: [
                  new TextRun({
                    text: "",
                    size: 28, // 14pt
                  }),
                ],
                spacing: {
                  before: 4400, // ~15.5cm in twips
                },
                pageBreakBefore: true,
              }),

              // தலைப்பு
              new Paragraph({
                children: [
                  new TextRun({
                    text: title,
                    bold: true,
                    size: 28, // 14pt
                    font: getBestTamilFont(),
                  }),
                ],
                alignment: AlignmentType.CENTER,
                spacing: {
                  after: 400, // 20pt
                },
              }),

              // தேதி
              new Paragraph({
                children: [
                  new TextRun({
                    text: dateText,
                    size: 28, // 14pt
                    font: getBestTamilFont(),
                  }),
                ],
                alignment: AlignmentType.CENTER,
                spacing: {
                  after: 400, // 20pt
                },
              }),

              // உள்ளடக்கம்
              ...contentSections,

              // கையொப்ப பகுதி
              new Paragraph({
                children: [
                  new TextRun({
                    text: "\n\n",
                  }),
                ],
                spacing: {
                  before: 400, // 20pt
                },
              }),

              // கையொப்ப அட்டவணை
              new Table({
                width: {
                  size: 100,
                  type: WidthType.PERCENTAGE,
                },
                rows: [
                  new TableRow({
                    children: [
                      new TableCell({
                        children: [createParagraph(sellerLabel, { alignment: AlignmentType.LEFT, bold: true })],
                        width: {
                          size: 50,
                          type: WidthType.PERCENTAGE,
                        },
                      }),
                      new TableCell({
                        children: [createParagraph(buyerLabel, { alignment: AlignmentType.RIGHT, bold: true })],
                        width: {
                          size: 50,
                          type: WidthType.PERCENTAGE,
                        },
                      }),
                    ],
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
                  }),
                ],
              }),
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
      // முன்னேற்ற அறிவிப்பு காட்டு
      const loadingToast = toast.loading("PDF ஆவணத்தை உருவாக்குகிறது...", {
        duration: 10000,
      })

      // ஆவண உள்ளடக்கத்தைப் பெறு
      const contentElement = document.querySelector(contentSelector) as HTMLElement
      if (!contentElement) {
        toast.error("ஆவண உள்ளடக்கத்தைக் கண்டறிய முடியவில்லை")
        toast.dismiss(loadingToast)
        return
      }

      // உள்ளடக்கத்தின் நகலை உருவாக்கு
      const contentClone = contentElement.cloneNode(true) as HTMLElement

      // முன்னோட்ட பொருட்களை நீக்கு
      const previewTitle = contentClone.querySelector(".text-2xl.font-bold.text-cyan-800")
      if (previewTitle) previewTitle.remove()

      const buttonContainer = contentClone.querySelector(".flex.gap-2.no-print")
      if (buttonContainer) buttonContainer.remove()

      // தமிழ் எழுத்துருக்களை சேர்க்க
      const fontStyleSheet = document.createElement("style")
      fontStyleSheet.textContent = `
        @import url('https://fonts.googleapis.com/css2?family=Mukta+Malar:wght@400;500;600;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Tamil:wght@400;500;600;700&display=swap');
      `
      document.head.appendChild(fontStyleSheet)

      // PDF அமைப்புகள்
      const pdfOptions = {
        margin: [15, 15, 15, 15], // top, right, bottom, left
        filename: `${fileName}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          letterRendering: true,
          logging: false,
          allowTaint: true,
          backgroundColor: "#ffffff",
        },
        jsPDF: {
          unit: "mm",
          format: "legal",
          orientation: "portrait",
          compress: true,
          precision: 16,
          putOnlyUsedFonts: true,
          floatPrecision: 16,
        },
        pagebreak: { mode: ["avoid-all", "css", "legacy"] },
      }

      // தனிப்பயன் பக்க பிரிப்பு ஸ்டைல்களை சேர்க்க
      const pageBreakStyle = document.createElement("style")
      pageBreakStyle.textContent = `
        @media print {
          .page-break { 
            display: block;
            page-break-before: always; 
          }
          
          h1, h2, h3, h4, h5, h6 {
            page-break-after: avoid;
          }
          
          p {
            orphans: 3;
            widows: 3;
          }
          
          .document-content {
            font-family: 'Mukta Malar', 'Noto Sans Tamil', sans-serif !important;
          }
          
          .document-content .english-text,
          .document-content .number {
            font-family: 'Times New Roman', serif !important;
          }
        }
      `
      document.head.appendChild(pageBreakStyle)

      // பக்க பிரிப்புகளை சேர்க்க
      const addPageBreaks = () => {
        // முதல் பக்கம் - தலைப்பு பகுதி
        const titleSection = contentClone.querySelector(".mb-8.text-center")
        if (titleSection) {
          const pageBreak = document.createElement("div")
          pageBreak.className = "page-break"
          titleSection.parentNode?.insertBefore(pageBreak, titleSection.nextSibling)
        }

        // இரண்டாம் பக்கம் - வாங்குபவர் மற்றும் விற்பவர் விவரங்கள்
        const partiesSection = contentClone.querySelector(".mb-6.text-justify")
        if (partiesSection) {
          const pageBreak = document.createElement("div")
          pageBreak.className = "page-break"
          partiesSection.parentNode?.insertBefore(pageBreak, partiesSection.nextSibling)
        }

        // சொத்து விவரங்கள் பகுதி
        const propertySection = contentClone.querySelector("h3.text-xl.font-semibold.mb-2.text-center")
        if (propertySection) {
          const pageBreak = document.createElement("div")
          pageBreak.className = "page-break"
          const parentElement = propertySection.parentElement
          if (parentElement) {
            parentElement.parentNode?.insertBefore(pageBreak, parentElement)
          }
        }

        // சாட்சிகள் பகுதி
        const witnessSection = contentClone.querySelector("h3.text-xl.font-semibold.mb-2")
        if (witnessSection && witnessSection.textContent?.includes("சாட்சிகள்")) {
          const pageBreak = document.createElement("div")
          pageBreak.className = "page-break"
          const parentElement = witnessSection.parentElement
          if (parentElement) {
            parentElement.parentNode?.insertBefore(pageBreak, parentElement)
          }
        }
      }

      // பக்க பிரிப்புகளை சேர்க்க
      addPageBreaks()

      // தமிழ் எழுத்துருக்கள் ஏற்றப்படுவதற்கு காத்திரு
      await document.fonts.ready

      // html2pdf லைப்ரரியை பயன்படுத்தி PDF உருவாக்கு
      import("html2pdf.js")
        .then(async (html2pdfModule) => {
          const html2pdf = html2pdfModule.default

          // PDF உருவாக்கும் செயல்பாடு
          const generatePdf = async () => {
            try {
              // PDF உருவாக்கு
              const pdf = html2pdf().set(pdfOptions).from(contentClone)

              // PDF ஐ பதிவிறக்கு
              await pdf.save()

              // முன்னேற்ற அறிவிப்பை நிறுத்து
              toast.dismiss(loadingToast)
              toast.success("PDF ஆவணம் வெற்றிகரமாக பதிவிறக்கப்பட்டது")
            } catch (error) {
              console.error("PDF உருவாக்கத்தில் பிழை:", error)
              toast.dismiss(loadingToast)
              toast.error("PDF உருவாக்கத்தில் பிழை ஏற்பட்டது")
            } finally {
              // சுத்தம் செய்
              document.head.removeChild(fontStyleSheet)
              document.head.removeChild(pageBreakStyle)
            }
          }

          // PDF உருவாக்கு
          await generatePdf()
        })
        .catch((error) => {
          console.error("html2pdf லைப்ரரி ஏற்றுவதில் பிழை:", error)
          toast.dismiss(loadingToast)
          toast.error("PDF உருவாக்கத்தில் பிழை ஏற்பட்டது")

          // சுத்தம் செய்
          document.head.removeChild(fontStyleSheet)
          document.head.removeChild(pageBreakStyle)
        })
    } catch (error) {
      console.error("PDF ஏற்றுமதியில் பிழை:", error)
      toast.error(`PDF ஏற்றுமதியில் பிழை: ${error instanceof Error ? error.message : "அறியப்படாத பிழை"}`)
    }
  }
}
