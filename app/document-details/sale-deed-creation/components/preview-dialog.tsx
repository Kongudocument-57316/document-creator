"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { FileText } from "lucide-react"
import { DocumentPreview } from "./document-preview"
import { useState } from "react"

interface PreviewDialogProps {
  formData: any
}

export function PreviewDialog({ formData }: PreviewDialogProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-purple-600 hover:bg-purple-700">
          <FileText className="h-4 w-4 mr-2" />
          ஆவணத்தை முன்னோட்டம் காண் (Preview)
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl text-purple-800">ஆவண முன்னோட்டம் (Document Preview)</DialogTitle>
          <DialogDescription>இது உங்கள் ஆவணத்தின் முன்னோட்டம். அச்சிடுவதற்கு முன் சரிபார்க்கவும்.</DialogDescription>
        </DialogHeader>
        <DocumentPreview formData={formData} />
      </DialogContent>
    </Dialog>
  )
}
