import { saveAs } from "file-saver"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"
import { Document, Packer, Paragraph, TextRun } from "docx"

// Export to DOCX
export const exportToDocx = (selector: string, filename: string) => {
  return async () => {
    try {
      const element = document.querySelector(selector) as HTMLElement
      if (!element) {
        console.error("Element not found")
        return
      }

      // Extract text content
      const textContent = element.innerText

      // Create a new document
      const doc = new Document({
        sections: [
          {
            properties: {},
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: textContent,
                    font: "Noto Sans Tamil",
                  }),
                ],
              }),
            ],
          },
        ],
      })

      // Generate the document
      const buffer = await Packer.toBuffer(doc)
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      })
      saveAs(blob, `${filename}.docx`)
    } catch (error) {
      console.error("Error exporting to DOCX:", error)
    }
  }
}

// Export to PDF
export const exportToPdf = (selector: string, filename: string) => {
  return async () => {
    try {
      const element = document.querySelector(selector) as HTMLElement
      if (!element) {
        console.error("Element not found")
        return
      }

      // Create canvas from HTML element
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
      })

      // Create PDF
      const imgData = canvas.toDataURL("image/png")
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      })

      const imgWidth = 210 // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight)
      pdf.save(`${filename}.pdf`)
    } catch (error) {
      console.error("Error exporting to PDF:", error)
    }
  }
}
