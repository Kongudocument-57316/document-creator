import html2canvas from "html2canvas"
import jsPDF from "jspdf"

export async function generatePDF(elementId: string, fileName = "document"): Promise<boolean> {
  try {
    const element = document.getElementById(elementId)
    if (!element) {
      console.error("Element not found:", elementId)
      return false
    }

    // Create canvas from the element
    const canvas = await html2canvas(element, {
      scale: 2, // Higher scale for better quality
      useCORS: true,
      logging: false,
      allowTaint: true,
      backgroundColor: "#ffffff",
    })

    // Calculate dimensions
    const imgWidth = 210 // A4 width in mm
    const pageHeight = 297 // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    const heightLeft = imgHeight

    // Create PDF
    const pdf = new jsPDF("p", "mm", "a4")
    const imgData = canvas.toDataURL("image/png")

    // Add image to PDF
    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight)

    // If the content is longer than one page, add more pages
    const position = 0
    pdf.setFontSize(10)

    // Add page numbers
    const totalPages = Math.ceil(heightLeft / pageHeight)
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i)
      pdf.text(`${i} / ${totalPages}`, pdf.internal.pageSize.getWidth() - 20, pdf.internal.pageSize.getHeight() - 10)
    }

    // Save the PDF
    pdf.save(`${fileName}.pdf`)
    return true
  } catch (error) {
    console.error("Error generating PDF:", error)
    return false
  }
}
