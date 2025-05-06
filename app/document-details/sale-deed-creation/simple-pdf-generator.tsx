"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Printer, Loader2 } from "lucide-react"

interface SimplePdfGeneratorProps {
  formData: any
  title: string
  children?: React.ReactNode
}

export function SimplePdfGenerator({ formData, title, children }: SimplePdfGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)

  const generatePdf = async () => {
    try {
      setIsGenerating(true)

      // Create a new window for printing
      const printWindow = window.open("", "_blank")
      if (!printWindow) {
        alert("பாப்-அப் விண்டோக்களை அனுமதிக்கவும்")
        setIsGenerating(false)
        return
      }

      // Basic HTML structure with Tamil font support
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>${title}</title>
          <meta charset="UTF-8">
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Tamil:wght@400;700&display=swap');
            body {
              font-family: 'Noto Sans Tamil', sans-serif;
              padding: 20px;
              line-height: 1.6;
            }
            h1, h2, h3 {
              color: #5b21b6;
            }
            .section {
              margin-bottom: 20px;
              border-bottom: 1px solid #ddd;
              padding-bottom: 15px;
            }
            .section-title {
              font-weight: bold;
              margin-bottom: 10px;
              color: #5b21b6;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 15px;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 8px;
              text-align: left;
            }
            th {
              background-color: #f3e8ff;
            }
            .user-card {
              border: 1px solid #ddd;
              padding: 10px;
              margin-bottom: 10px;
              border-radius: 5px;
            }
            .property-details {
              margin-top: 10px;
            }
            @media print {
              body {
                font-size: 12pt;
              }
              .no-print {
                display: none;
              }
              button {
                display: none;
              }
            }
          </style>
        </head>
        <body>
          <div class="no-print" style="margin-bottom: 20px;">
            <button onclick="window.print()" style="padding: 10px 20px; background-color: #5b21b6; color: white; border: none; border-radius: 5px; cursor: pointer;">
              அச்சிடு
            </button>
          </div>
          <h1>${title}</h1>
      `)

      // Document Basic Details
      if (formData.deed) {
        printWindow.document.write(`
          <div class="section">
            <div class="section-title">ஆவண அடிப்படை விவரங்கள்</div>
            <table>
              <tr>
                <th>ஆவண வகை</th>
                <td>${formData.deed.documentType || "-"}</td>
                <th>பதிவு எண்</th>
                <td>${formData.deed.registrationNumber || "-"}</td>
              </tr>
              <tr>
                <th>பதிவு தேதி</th>
                <td>${formData.deed.registrationDate || "-"}</td>
                <th>புத்தக எண்</th>
                <td>${formData.deed.bookNumber || "-"}</td>
              </tr>
              <tr>
                <th>ஆண்டு</th>
                <td>${formData.deed.year || "-"}</td>
                <th>பக்க எண்</th>
                <td>${formData.deed.pageNumber || "-"}</td>
              </tr>
              <tr>
                <th>சார்-பதிவாளர் அலுவலகம்</th>
                <td>${formData.deed.subRegistrarOffice || "-"}</td>
                <th>மாவட்டம்</th>
                <td>${formData.deed.district || "-"}</td>
              </tr>
            </table>
          </div>
        `)
      }

      // Seller Details
      if (formData.seller && formData.seller.length > 0) {
        printWindow.document.write(`
          <div class="section">
            <div class="section-title">விற்பனையாளர் விவரங்கள்</div>
        `)

        formData.seller.forEach((seller: any, index: number) => {
          printWindow.document.write(`
            <div class="user-card">
              <strong>விற்பனையாளர் ${index + 1}</strong>
              <table>
                <tr>
                  <th>பெயர்</th>
                  <td>${seller.name || "-"}</td>
                  <th>வயது</th>
                  <td>${seller.age || "-"}</td>
                </tr>
                <tr>
                  <th>பாலினம்</th>
                  <td>${seller.gender || "-"}</td>
                  <th>தொலைபேசி</th>
                  <td>${seller.phone || "-"}</td>
                </tr>
                <tr>
                  <th>முகவரி</th>
                  <td colspan="3">${seller.address || "-"}</td>
                </tr>
              </table>
            </div>
          `)
        })

        printWindow.document.write(`</div>`)
      }

      // Buyer Details
      if (formData.buyer && formData.buyer.length > 0) {
        printWindow.document.write(`
          <div class="section">
            <div class="section-title">வாங்குபவர் விவரங்கள்</div>
        `)

        formData.buyer.forEach((buyer: any, index: number) => {
          printWindow.document.write(`
            <div class="user-card">
              <strong>வாங்குபவர் ${index + 1}</strong>
              <table>
                <tr>
                  <th>பெயர்</th>
                  <td>${buyer.name || "-"}</td>
                  <th>வயது</th>
                  <td>${buyer.age || "-"}</td>
                </tr>
                <tr>
                  <th>பாலினம்</th>
                  <td>${buyer.gender || "-"}</td>
                  <th>தொலைபேசி</th>
                  <td>${buyer.phone || "-"}</td>
                </tr>
                <tr>
                  <th>முகவரி</th>
                  <td colspan="3">${buyer.address || "-"}</td>
                </tr>
              </table>
            </div>
          `)
        })

        printWindow.document.write(`</div>`)
      }

      // Property Details
      if (formData.property) {
        printWindow.document.write(`
          <div class="section">
            <div class="section-title">சொத்து விவரங்கள்</div>
        `)

        // Site Details
        if (formData.property.sites && formData.property.sites.length > 0) {
          printWindow.document.write(`
            <div class="property-details">
              <h3>நிலம் விவரங்கள்</h3>
          `)

          formData.property.sites.forEach((site: any, index: number) => {
            printWindow.document.write(`
              <div class="user-card">
                <strong>நிலம் ${index + 1}</strong>
                <table>
                  <tr>
                    <th>மனை எண்</th>
                    <td>${site.plotNumber || "-"}</td>
                    <th>சர்வே எண்</th>
                    <td>${site.surveyNumber || "-"}</td>
                  </tr>
                  <tr>
                    <th>மொத்த பரப்பளவு</th>
                    <td>${site.totalArea || "-"} ${site.areaUnit || ""}</td>
                    <th>மதிப்பு</th>
                    <td>₹${site.siteValue ? site.siteValue.toLocaleString("ta-IN") : "-"}</td>
                  </tr>
                  <tr>
                    <th>எல்லைகள்</th>
                    <td colspan="3">
                      வடக்கு: ${site.northBoundary || "-"}<br>
                      தெற்கு: ${site.southBoundary || "-"}<br>
                      கிழக்கு: ${site.eastBoundary || "-"}<br>
                      மேற்கு: ${site.westBoundary || "-"}
                    </td>
                  </tr>
                </table>
              </div>
            `)
          })

          printWindow.document.write(`</div>`)
        }

        // Building Details
        if (formData.property.buildings && formData.property.buildings.length > 0) {
          printWindow.document.write(`
            <div class="property-details">
              <h3>கட்டிட விவரங்கள்</h3>
          `)

          formData.property.buildings.forEach((building: any, index: number) => {
            printWindow.document.write(`
              <div class="user-card">
                <strong>கட்டிடம் ${index + 1}</strong>
                <table>
                  <tr>
                    <th>கட்டிட வகை</th>
                    <td>${building.buildingType || "-"}</td>
                    <th>கதவு எண்</th>
                    <td>${building.doorNumber || "-"}</td>
                  </tr>
                  <tr>
                    <th>வயது</th>
                    <td>${building.buildingAge || "-"} ஆண்டுகள்</td>
                    <th>திசை</th>
                    <td>${building.direction || "-"}</td>
                  </tr>
                  <tr>
                    <th>மொத்த பரப்பளவு</th>
                    <td>${building.totalArea || "-"} ${building.areaUnit || ""}</td>
                    <th>மதிப்பு</th>
                    <td>₹${building.buildingValue ? building.buildingValue.toLocaleString("ta-IN") : "-"}</td>
                  </tr>
                </table>
              </div>
            `)
          })

          printWindow.document.write(`</div>`)
        }

        // Property Value
        if (formData.property.propertyValue) {
          printWindow.document.write(`
            <div class="property-details">
              <h3>சொத்து மொத்த மதிப்பு</h3>
              <p>₹${formData.property.propertyValue.toLocaleString("ta-IN")}</p>
            </div>
          `)
        }

        printWindow.document.write(`</div>`)
      }

      // Payment Details
      if (formData.payment && formData.payment.payments && formData.payment.payments.length > 0) {
        printWindow.document.write(`
          <div class="section">
            <div class="section-title">பணப்பட்டுவாடா விவரங்கள்</div>
            <table>
              <tr>
                <th>வ.எண்</th>
                <th>வாங்குபவர்</th>
                <th>விற்பனையாளர்</th>
                <th>தொகை</th>
                <th>பணம் செலுத்தும் முறை</th>
                <th>விவரங்கள்</th>
              </tr>
        `)

        formData.payment.payments.forEach((payment: any, index: number) => {
          const buyerName =
            payment.buyerId && formData.buyer
              ? formData.buyer.find((b: any) => b.id === payment.buyerId)?.name || "-"
              : "-"
          const sellerName =
            payment.sellerId && formData.seller
              ? formData.seller.find((s: any) => s.id === payment.sellerId)?.name || "-"
              : "-"

          let paymentDetails = "-"
          if (payment.paymentMethod === "cash") {
            paymentDetails = "ரொக்கம்"
          } else if (payment.paymentMethod === "cheque") {
            paymentDetails = `காசோலை எண்: ${payment.chequeNumber || "-"}, வங்கி: ${payment.bankName || "-"}, கிளை: ${payment.branchName || "-"}`
          } else if (payment.paymentMethod === "electronic") {
            paymentDetails = `UTR எண்: ${payment.utrNumber || "-"}, வங்கி: ${payment.bankName || "-"}`
          }

          printWindow.document.write(`
              <tr>
                <td>${index + 1}</td>
                <td>${buyerName}</td>
                <td>${sellerName}</td>
                <td>₹${payment.amount ? payment.amount.toLocaleString("ta-IN") : "-"}</td>
                <td>${payment.paymentMethod === "cash" ? "ரொக்கம்" : payment.paymentMethod === "cheque" ? "காசோலை" : payment.paymentMethod === "electronic" ? "மின்னணு பரிமாற்றம்" : "-"}</td>
                <td>${paymentDetails}</td>
              </tr>
          `)
        })

        printWindow.document.write(`
            </table>
          </div>
        `)
      }

      // Witness Details
      if (formData.witness && formData.witness.length > 0) {
        printWindow.document.write(`
          <div class="section">
            <div class="section-title">சாட்சி விவரங்கள்</div>
        `)

        formData.witness.forEach((witness: any, index: number) => {
          printWindow.document.write(`
            <div class="user-card">
              <strong>சாட்சி ${index + 1}</strong>
              <table>
                <tr>
                  <th>பெயர்</th>
                  <td>${witness.name || "-"}</td>
                  <th>வயது</th>
                  <td>${witness.age || "-"}</td>
                </tr>
                <tr>
                  <th>பாலினம்</th>
                  <td>${witness.gender || "-"}</td>
                  <th>தொலைபேசி</th>
                  <td>${witness.phone || "-"}</td>
                </tr>
                <tr>
                  <th>முகவரி</th>
                  <td colspan="3">${witness.address || "-"}</td>
                </tr>
              </table>
            </div>
          `)
        })

        printWindow.document.write(`</div>`)
      }

      // Previous Document Details
      if (formData.previousDoc && formData.previousDoc.documents && formData.previousDoc.documents.length > 0) {
        printWindow.document.write(`
          <div class="section">
            <div class="section-title">முந்தைய ஆவண விவரங்கள்</div>
            <table>
              <tr>
                <th>வ.எண்</th>
                <th>ஆவண வகை</th>
                <th>ஆவண எண்</th>
                <th>தேதி</th>
                <th>பதிவாளர் அலுவலகம்</th>
              </tr>
        `)

        formData.previousDoc.documents.forEach((doc: any, index: number) => {
          printWindow.document.write(`
              <tr>
                <td>${index + 1}</td>
                <td>${doc.documentType || "-"}</td>
                <td>${doc.documentNumber || "-"}</td>
                <td>${doc.documentDate || "-"}</td>
                <td>${doc.registrarOffice || "-"}</td>
              </tr>
          `)
        })

        printWindow.document.write(`
            </table>
          </div>
        `)
      }

      printWindow.document.write(`
        </body>
        </html>
      `)

      printWindow.document.close()

      // Trigger print after content is loaded
      printWindow.onload = () => {
        printWindow.focus()
        // Uncomment to automatically print
        // printWindow.print()
      }
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert("PDF உருவாக்குவதில் பிழை ஏற்பட்டது")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <>
      {children ? (
        <div onClick={generatePdf}>{children}</div>
      ) : (
        <Button
          variant="outline"
          onClick={generatePdf}
          disabled={isGenerating}
          className="border-purple-300 hover:bg-purple-50 text-purple-700"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              உருவாக்குகிறது...
            </>
          ) : (
            <>
              <Printer className="h-4 w-4 mr-2" />
              அச்சிடு
            </>
          )}
        </Button>
      )}
    </>
  )
}
