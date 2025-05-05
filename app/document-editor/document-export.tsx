"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, Printer, FileText } from "lucide-react"
import { toast } from "sonner"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"

interface DocumentExportProps {
  title: string
  content: string
}

export function DocumentExport({ title, content }: DocumentExportProps) {
  const [paperSize, setPaperSize] = useState("a4")
  const [orientation, setOrientation] = useState("portrait")
  const [margins, setMargins] = useState("normal")
  const [fileName, setFileName] = useState("")
  const [isExporting, setIsExporting] = useState(false)

  const handleExportPDF = async () => {
    if (!content) {
      toast.error("ஏற்றுமதி செய்ய ஆவண உள்ளடக்கம் தேவை")
      return
    }

    setIsExporting(true)
    try {
      // Create a temporary div to render the content
      const tempDiv = document.createElement("div")
      tempDiv.innerHTML = content
      tempDiv.style.width = paperSize === "a4" ? "210mm" : "216mm" // A4 or Letter width
      tempDiv.style.padding = margins === "normal" ? "25mm" : margins === "narrow" ? "12mm" : "40mm"
      tempDiv.style.backgroundColor = "white"
      tempDiv.style.position = "absolute"
      tempDiv.style.left = "-9999px"
      document.body.appendChild(tempDiv)

      // Generate PDF
      const pdf = new jsPDF({
        format: paperSize,
        orientation: orientation,
        unit: "mm",
      })

      // Add title if available
      if (title) {
        pdf.setFontSize(16)
        pdf.text(title, 20, 20)
        pdf.setFontSize(12)
      }

      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
      })

      // Remove the temporary div
      document.body.removeChild(tempDiv)

      const imgData = canvas.toDataURL("image/jpeg", 1.0)

      // Calculate dimensions
      const imgWidth =
        orientation === "portrait" ? pdf.internal.pageSize.getWidth() - 20 : pdf.internal.pageSize.getWidth() - 20
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      // Add content
      pdf.addImage(imgData, "JPEG", 10, title ? 30 : 10, imgWidth, imgHeight)

      // Save the PDF
      const outputFileName = fileName || title || "document"
      pdf.save(`${outputFileName}.pdf`)

      toast.success("PDF ஏற்றுமதி வெற்றிகரமாக முடிந்தது")
    } catch (error: any) {
      toast.error(`PDF ஏற்றுமதியில் பிழை: ${error.message}`)
      console.error("PDF export error:", error)
    } finally {
      setIsExporting(false)
    }
  }

  const handleExportWord = () => {
    if (!content) {
      toast.error("ஏற்றுமதி செய்ய ஆவண உள்ளடக்கம் தேவை")
      return
    }

    try {
      // Create a complete HTML document
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>${title || "Document"}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: ${margins === "normal" ? "2.5cm" : margins === "narrow" ? "1.2cm" : "4cm"};
              size: ${paperSize};
            }
            table {
              border-collapse: collapse;
              width: 100%;
            }
            table, th, td {
              border: 1px solid black;
              padding: 8px;
            }
          </style>
        </head>
        <body>
          ${title ? `<h1>${title}</h1>` : ""}
          ${content}
        </body>
        </html>
      `

      // Create a Blob with the HTML content
      const blob = new Blob([htmlContent], { type: "application/msword" })

      // Create a download link and trigger it
      const link = document.createElement("a")
      link.href = URL.createObjectURL(blob)
      const outputFileName = fileName || title || "document"
      link.download = `${outputFileName}.doc`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(link.href)

      toast.success("Word ஏற்றுமதி வெற்றிகரமாக முடிந்தது")
    } catch (error: any) {
      toast.error(`Word ஏற்றுமதியில் பிழை: ${error.message}`)
      console.error("Word export error:", error)
    }
  }

  const handlePrint = () => {
    if (!content) {
      toast.error("அச்சிட ஆவண உள்ளடக்கம் தேவை")
      return
    }

    try {
      // Create a new window for printing
      const printWindow = window.open("", "_blank")
      if (!printWindow) {
        toast.error("அச்சிடும் சாளரத்தைத் திறக்க முடியவில்லை")
        return
      }

      // Write the content to the new window
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>${title || "Document"}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: ${margins === "normal" ? "2.5cm" : margins === "narrow" ? "1.2cm" : "4cm"};
              size: ${paperSize};
            }
            @page {
              size: ${paperSize} ${orientation};
              margin: ${margins === "normal" ? "2.5cm" : margins === "narrow" ? "1.2cm" : "4cm"};
            }
            table {
              border-collapse: collapse;
              width: 100%;
            }
            table, th, td {
              border: 1px solid black;
              padding: 8px;
            }
          </style>
        </head>
        <body>
          ${title ? `<h1>${title}</h1>` : ""}
          ${content}
        </body>
        </html>
      `)

      // Print and close the window
      printWindow.document.close()
      printWindow.focus()

      // Use setTimeout to ensure the content is loaded before printing
      setTimeout(() => {
        printWindow.print()
        printWindow.close()
      }, 250)
    } catch (error: any) {
      toast.error(`அச்சிடுவதில் பிழை: ${error.message}`)
      console.error("Print error:", error)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>ஆவண ஏற்றுமதி</CardTitle>
        <CardDescription>உங்கள் ஆவணத்தை PDF, Word அல்லது அச்சிடுவதற்கான விருப்பங்களைத் தேர்ந்தெடுக்கவும்</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="file-name">கோப்பு பெயர்</Label>
              <Input
                id="file-name"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                placeholder={title || "document"}
                className="border-purple-200 focus-visible:ring-purple-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="paper-size">தாள் அளவு</Label>
              <Select value={paperSize} onValueChange={setPaperSize}>
                <SelectTrigger id="paper-size" className="border-purple-200 focus:ring-purple-400">
                  <SelectValue placeholder="தாள் அளவைத் தேர்ந்தெடுக்கவும்" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="a4">A4</SelectItem>
                  <SelectItem value="letter">Letter</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="orientation">திசையமைப்பு</Label>
              <Select value={orientation} onValueChange={setOrientation}>
                <SelectTrigger id="orientation" className="border-purple-200 focus:ring-purple-400">
                  <SelectValue placeholder="திசையமைப்பைத் தேர்ந்தெடுக்கவும்" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="portrait">செங்குத்து</SelectItem>
                  <SelectItem value="landscape">கிடைமட்டம்</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="margins">விளிம்புகள்</Label>
              <Select value={margins} onValueChange={setMargins}>
                <SelectTrigger id="margins" className="border-purple-200 focus:ring-purple-400">
                  <SelectValue placeholder="விளிம்புகளைத் தேர்ந்தெடுக்கவும்" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="narrow">குறுகிய</SelectItem>
                  <SelectItem value="normal">சாதாரண</SelectItem>
                  <SelectItem value="wide">அகலமான</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Tabs defaultValue="pdf" className="w-full">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="pdf">PDF</TabsTrigger>
            <TabsTrigger value="word">Word</TabsTrigger>
            <TabsTrigger value="print">அச்சிடு</TabsTrigger>
          </TabsList>
          <TabsContent value="pdf" className="space-y-4 pt-4">
            <p className="text-sm text-gray-500">
              PDF வடிவத்தில் ஏற்றுமதி செய்வது அனைத்து சாதனங்களிலும் ஒரே மாதிரியான தோற்றத்தை உறுதி செய்கிறது.
            </p>
            <Button
              onClick={handleExportPDF}
              disabled={isExporting}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              <Download className="mr-2 h-4 w-4" />
              {isExporting ? "ஏற்றுமதி செய்கிறது..." : "PDF-ஆக ஏற்றுமதி செய்"}
            </Button>
          </TabsContent>
          <TabsContent value="word" className="space-y-4 pt-4">
            <p className="text-sm text-gray-500">Word வடிவத்தில் ஏற்றுமதி செய்வது ஆவணத்தை மேலும் திருத்த அனுமதிக்கிறது.</p>
            <Button onClick={handleExportWord} className="w-full bg-purple-600 hover:bg-purple-700">
              <FileText className="mr-2 h-4 w-4" />
              Word-ஆக ஏற்றுமதி செய்
            </Button>
          </TabsContent>
          <TabsContent value="print" className="space-y-4 pt-4">
            <p className="text-sm text-gray-500">ஆவணத்தை நேரடியாக அச்சிடுவதற்கு இந்த விருப்பத்தைப் பயன்படுத்தவும்.</p>
            <Button onClick={handlePrint} className="w-full bg-purple-600 hover:bg-purple-700">
              <Printer className="mr-2 h-4 w-4" />
              ஆவணத்தை அச்சிடு
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
