"use client"

import { useRef, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Printer, ZoomIn, ZoomOut, RotateCw } from "lucide-react"
import { toast } from "sonner"

interface DocumentPreviewProps {
  content: string
  title?: string
}

export function DocumentPreview({ content, title = "கிரைய ஆவணம்" }: DocumentPreviewProps) {
  const [scale, setScale] = useState(1)
  const previewRef = useRef<HTMLDivElement>(null)
  const [pages, setPages] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Split content into pages
  useEffect(() => {
    if (!content) {
      setPages([])
      setIsLoading(false)
      return
    }

    // Simple page splitting based on content length
    // In a real implementation, you might want to use a more sophisticated approach
    const splitContent = () => {
      setIsLoading(true)

      // Process the HTML content to add page breaks
      let processedContent = content

      // Add page breaks at natural points if they don't exist
      if (!processedContent.includes("page-break-after")) {
        // Add page breaks after major sections (h1, h2) if they don't already have them
        processedContent = processedContent.replace(
          /(<h1[^>]*>.*?<\/h1>|<h2[^>]*>.*?<\/h2>)/gi,
          '$1<div style="page-break-after: always;"></div>',
        )
      }

      // Split by page break divs
      const pageBreakRegex = /<div[^>]*style="[^"]*page-break-after:\s*always[^"]*"[^>]*><\/div>/gi
      const contentParts = processedContent.split(pageBreakRegex)

      // If we have very few parts, try to split by paragraphs to create reasonable page sizes
      if (contentParts.length <= 1) {
        const tempDiv = document.createElement("div")
        tempDiv.innerHTML = processedContent

        const paragraphs = tempDiv.querySelectorAll("p")
        const pageSize = 10 // paragraphs per page
        const newPages = []

        let currentPage = ""
        let count = 0

        paragraphs.forEach((p) => {
          currentPage += p.outerHTML
          count++

          if (count >= pageSize) {
            newPages.push(currentPage)
            currentPage = ""
            count = 0
          }
        })

        if (currentPage) {
          newPages.push(currentPage)
        }

        setPages(newPages.length > 0 ? newPages : [processedContent])
      } else {
        setPages(contentParts)
      }

      setIsLoading(false)
    }

    splitContent()
  }, [content])

  const handlePrint = () => {
    const printWindow = window.open("", "_blank")
    if (!printWindow) {
      toast.error("பாப்-அப் விண்டோக்களை அனுமதிக்கவும்")
      return
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${title}</title>
        <meta charset="UTF-8">
        <style>
          @page {
            size: A4;
            margin: 2cm;
          }
          body {
            font-family: 'Noto Sans Tamil', Arial, sans-serif;
            line-height: 1.5;
            color: #000;
            background: #fff;
            margin: 0;
            padding: 0;
          }
          .page {
            page-break-after: always;
            position: relative;
            padding: 2cm;
          }
          .page:last-child {
            page-break-after: avoid;
          }
          h1, h2, h3 {
            margin-top: 0;
          }
          p {
            margin-bottom: 0.5cm;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 0.5cm;
          }
          table, th, td {
            border: 1px solid #000;
            padding: 0.2cm;
          }
          @media print {
            body {
              margin: 0;
              padding: 0;
            }
            .page {
              padding: 0;
            }
            .no-print {
              display: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="no-print" style="padding: 20px; text-align: center;">
          <button onclick="window.print()" style="padding: 10px 20px; background: #5b21b6; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 16px;">
            அச்சிடு
          </button>
        </div>
        ${pages
          .map(
            (page, index) => `
          <div class="page">
            ${index === 0 ? `<h1 style="text-align: center;">${title}</h1>` : ""}
            ${page}
          </div>
        `,
          )
          .join("")}
      </body>
      </html>
    `)

    printWindow.document.close()

    // Focus and print after content is loaded
    printWindow.onload = () => {
      printWindow.focus()
    }
  }

  const zoomIn = () => {
    setScale((prev) => Math.min(prev + 0.1, 2))
  }

  const zoomOut = () => {
    setScale((prev) => Math.max(prev - 0.1, 0.5))
  }

  const resetZoom = () => {
    setScale(1)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={zoomOut} className="border-purple-200 hover:bg-purple-50">
            <ZoomOut className="h-4 w-4" />
            <span className="sr-only">குறை</span>
          </Button>
          <span className="text-sm">{Math.round(scale * 100)}%</span>
          <Button variant="outline" size="sm" onClick={zoomIn} className="border-purple-200 hover:bg-purple-50">
            <ZoomIn className="h-4 w-4" />
            <span className="sr-only">பெரிதாக்கு</span>
          </Button>
          <Button variant="outline" size="sm" onClick={resetZoom} className="border-purple-200 hover:bg-purple-50">
            <RotateCw className="h-4 w-4" />
            <span className="sr-only">மீட்டமை</span>
          </Button>
        </div>
        <Button onClick={handlePrint} className="bg-purple-600 hover:bg-purple-700">
          <Printer className="h-4 w-4 mr-2" />
          அச்சிடு
        </Button>
      </div>

      <div
        className="overflow-auto bg-gray-100 p-4 rounded-lg shadow-inner"
        style={{ maxHeight: "calc(100vh - 200px)" }}
      >
        <div ref={previewRef} className="flex flex-col items-center space-y-8">
          {pages.length > 0 ? (
            pages.map((page, index) => (
              <Card
                key={index}
                className="bg-white shadow-md w-[210mm] min-h-[297mm] relative"
                style={{
                  transform: `scale(${scale})`,
                  transformOrigin: "top center",
                  transition: "transform 0.2s ease",
                }}
              >
                <div className="absolute top-0 right-0 bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded-bl">
                  பக்கம் {index + 1}/{pages.length}
                </div>
                <div
                  className="p-[2cm] prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: index === 0 ? `<h1 style="text-align: center;">${title}</h1>${page}` : page,
                  }}
                />
              </Card>
            ))
          ) : (
            <div className="text-center p-8 bg-white rounded-lg shadow w-full">
              <p className="text-gray-500">ஆவண உள்ளடக்கம் இல்லை</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
