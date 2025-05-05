"use client"

import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { useReactToPrint } from "react-to-print"
import SaleDeedPdfTemplate from "./sale-deed-pdf-template"

interface SaleDeedPdfGeneratorProps {
  formData: any
  title: string
}

export const SaleDeedPdfGenerator = ({ formData, title }: SaleDeedPdfGeneratorProps) => {
  const componentRef = useRef(null)

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: title,
    removeAfterPrint: true,
  })

  return (
    <div>
      <div style={{ display: "none" }}>
        <SaleDeedPdfTemplate ref={componentRef} formData={formData} />
      </div>
      <Button onClick={handlePrint} className="bg-purple-600 hover:bg-purple-700">
        PDF ஏற்றுமதி செய் (Export PDF)
      </Button>
    </div>
  )
}
