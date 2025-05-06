"use client"
import { Button } from "@/components/ui/button"
import { Printer } from "lucide-react"

interface SimplePdfGeneratorProps {
  formData: any
  title: string
}

export function SimplePdfGenerator({ formData, title }: SimplePdfGeneratorProps) {
  const handlePrint = () => {
    // Create a new window
    const printWindow = window.open("", "_blank")
    if (!printWindow) return

    // Generate HTML content
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${title}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1 { text-align: center; margin-bottom: 20px; }
          .section { margin-bottom: 20px; }
          .section-title { font-size: 18px; font-weight: bold; margin-bottom: 10px; border-bottom: 1px solid #ccc; padding-bottom: 5px; }
          .details { padding: 10px; border: 1px solid #ddd; border-radius: 4px; }
          .signature-section { margin-top: 50px; display: flex; justify-content: space-between; }
          .signature { width: 30%; text-align: center; }
          .signature-line { border-top: 1px solid #000; margin-top: 50px; padding-top: 10px; }
        </style>
      </head>
      <body>
        <h1>கிரைய ஆவணம் (Sale Deed)</h1>
        
        <div class="section">
          <div class="section-title">ஆவண விவரங்கள் (Document Details)</div>
          <div class="details">
            <p><strong>ஆவண எண்:</strong> ${formData.deed.documentNumber || "-"}</p>
            <p><strong>ஆவண தேதி:</strong> ${formData.deed.documentDate || "-"}</p>
          </div>
        </div>
        
        <div class="section">
          <div class="section-title">வாங்குபவர் விவரங்கள் (Buyer Details)</div>
          <div class="details">
            ${
              formData.buyer && formData.buyer.length > 0
                ? formData.buyer
                    .map(
                      (buyer: any, index: number) => `
                <p><strong>பெயர்:</strong> ${buyer.name || "-"}</p>
                <p><strong>முகவரி:</strong> ${buyer.address || "-"}</p>
              `,
                    )
                    .join("<hr>")
                : "<p>வாங்குபவர் விவரங்கள் எதுவும் இல்லை</p>"
            }
          </div>
        </div>
        
        <div class="section">
          <div class="section-title">விற்பனையாளர் விவரங்கள் (Seller Details)</div>
          <div class="details">
            ${
              formData.seller && formData.seller.length > 0
                ? formData.seller
                    .map(
                      (seller: any, index: number) => `
                <p><strong>பெயர்:</strong> ${seller.name || "-"}</p>
                <p><strong>முகவரி:</strong> ${seller.address || "-"}</p>
              `,
                    )
                    .join("<hr>")
                : "<p>விற்பனையாளர் விவரங்கள் எதுவும் இல்லை</p>"
            }
          </div>
        </div>
        
        <div class="signature-section">
          <div class="signature">
            <div class="signature-line">வாங்குபவர் கையொப்பம்<br>(Buyer Signature)</div>
          </div>
          <div class="signature">
            <div class="signature-line">விற்பனையாளர் கையொப்பம்<br>(Seller Signature)</div>
          </div>
          <div class="signature">
            <div class="signature-line">சாட்சி கையொப்பம்<br>(Witness Signature)</div>
          </div>
        </div>
      </body>
      </html>
    `

    // Write to the new window
    printWindow.document.open()
    printWindow.document.write(htmlContent)
    printWindow.document.close()

    // Print after the content is loaded
    printWindow.onload = () => {
      printWindow.print()
    }
  }

  return (
    <Button onClick={handlePrint} className="bg-purple-600 hover:bg-purple-700">
      <Printer className="mr-2 h-4 w-4" />
      ஆவணத்தை அச்சிடு (Print Document)
    </Button>
  )
}
