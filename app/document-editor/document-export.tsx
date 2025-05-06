"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, Printer } from "lucide-react"
import { toast } from "sonner"

export function DocumentExport({ title, content }: { title: string; content: string }) {
  const [exportFormat, setExportFormat] = useState("pdf")

  const handleExport = async () => {
    if (!title) {
      toast.error("ஆவணத்திற்கு தலைப்பு தேவை")
      return
    }

    if (!content) {
      toast.error("ஆவணத்தில் உள்ளடக்கம் தேவை")
      return
    }

    try {
      // For demonstration, we'll just show a success message
      // In a real app, this would generate and download the file
      toast.success(`${title} ஆவணம் ${exportFormat.toUpperCase()} வடிவத்தில் ஏற்றுமதி செய்யப்பட்டது`)
    } catch (error) {
      console.error("Export error:", error)
      toast.error("ஆவணத்தை ஏற்றுமதி செய்வதில் பிழை")
    }
  }

  const handlePrint = () => {
    if (!content) {
      toast.error("ஆவணத்தில் உள்ளடக்கம் தேவை")
      return
    }

    // Create a new window with just the content
    const printWindow = window.open("", "_blank")
    if (!printWindow) {
      toast.error("அச்சிடும் சாளரத்தை திறக்க முடியவில்லை")
      return
    }

    // Add content to the new window
    printWindow.document.write(`
      <html>
        <head>
          <title>${title || "ஆவணம்"}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            @media print {
              body { padding: 0; }
            }
          </style>
        </head>
        <body>
          ${content}
        </body>
      </html>
    `)

    // Print and close the window
    printWindow.document.close()
    printWindow.focus()
    setTimeout(() => {
      printWindow.print()
      printWindow.close()
    }, 250)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>ஆவண ஏற்றுமதி</CardTitle>
        <CardDescription>உங்கள் ஆவணத்தை பல்வேறு வடிவங்களில் ஏற்றுமதி செய்யவும்</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs value={exportFormat} onValueChange={setExportFormat}>
          <TabsList className="grid grid-cols-3 w-full max-w-md">
            <TabsTrigger value="pdf">PDF</TabsTrigger>
            <TabsTrigger value="docx">DOCX</TabsTrigger>
            <TabsTrigger value="html">HTML</TabsTrigger>
          </TabsList>
          <TabsContent value="pdf" className="pt-4">
            <p className="text-sm text-gray-500 mb-4">
              PDF வடிவம் அனைத்து சாதனங்களிலும் ஒரே மாதிரியாக தோற்றமளிக்கும் மற்றும் அச்சிடுவதற்கு ஏற்றது.
            </p>
          </TabsContent>
          <TabsContent value="docx" className="pt-4">
            <p className="text-sm text-gray-500 mb-4">
              DOCX வடிவம் Microsoft Word மற்றும் பிற ஆவண திருத்திகளில் திருத்துவதற்கு ஏற்றது.
            </p>
          </TabsContent>
          <TabsContent value="html" className="pt-4">
            <p className="text-sm text-gray-500 mb-4">HTML வடிவம் இணையதளங்களில் பயன்படுத்துவதற்கு ஏற்றது.</p>
          </TabsContent>
        </Tabs>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button onClick={handleExport} className="flex-1 bg-purple-600 hover:bg-purple-700">
            <Download className="mr-2 h-4 w-4" />
            ஏற்றுமதி செய்
          </Button>
          <Button onClick={handlePrint} variant="outline" className="flex-1">
            <Printer className="mr-2 h-4 w-4" />
            அச்சிடு
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
