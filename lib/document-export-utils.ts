import { Document, Packer, Paragraph, HeadingLevel, AlignmentType } from "docx"
import FileSaver from "file-saver"
import { format } from "date-fns"

// Helper functions
export function getRelationshipTypeInTamil(type: string | null | undefined) {
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

export function getMonthInTamil(month: string | null | undefined) {
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

export function formatDate(dateString: string | Date | undefined | null) {
  if (!dateString) return ""
  try {
    return format(new Date(dateString), "dd-MM-yyyy")
  } catch (error) {
    return ""
  }
}

// Export to Word document
export async function exportSettlementToWord(document: any, filename = "தானசெட்டில்மெண்ட்.docx") {
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
            // Content would be added here similar to the API implementation
            // Simplified for brevity
          ],
        },
      ],
    })

    const buffer = await Packer.toBuffer(doc)
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" })
    FileSaver.saveAs(blob, filename)

    return true
  } catch (error) {
    console.error("Error generating Word document:", error)
    return false
  }
}
