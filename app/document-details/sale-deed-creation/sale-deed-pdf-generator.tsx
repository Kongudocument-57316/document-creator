"use client"

import { useRef } from "react"
import { Button } from "@/components/ui/button"
import ReactToPrint from "react-to-print"
import SaleDeedPdfTemplate from "./sale-deed-pdf-template"

interface SaleDeedPdfGeneratorProps {
  formData: any
  title: string
}

export function SaleDeedPdfGenerator({ formData, title }: SaleDeedPdfGeneratorProps) {
  const componentRef = useRef<HTMLDivElement>(null)

  return (
    <div>
      <div style={{ display: "none" }}>
        <SaleDeedPdfTemplate ref={componentRef} formData={formData} />
      </div>
      <ReactToPrint
        trigger={() => <Button className="bg-purple-600 hover:bg-purple-700">PDF ஏற்றுமதி செய் (Export PDF)</Button>}
        content={() => componentRef.current}
        documentTitle={title}
      />
    </div>
  )
}
