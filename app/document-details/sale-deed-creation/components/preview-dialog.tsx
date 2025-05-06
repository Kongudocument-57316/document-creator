"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Eye } from 'lucide-react'
import { DocumentPreview } from "./document-preview"

interface PreviewDialogProps {
  formData: any
  children?: React.ReactNode
}

export function PreviewDialog({ formData, children }: PreviewDialogProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button 
        variant="outline" 
        className="border-purple-300 hover:bg-purple-50 text-purple-700"
        onClick={() => setOpen(true)}
      >
        {children || (
          <>
            <Eye className="h-4 w-4 mr-2" />
            முன்னோட்டம்
          </>
        )}
      </Button>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>கிரைய பத்திர முன்னோட்டம்</DialogTitle>
          <DialogDescription>இது உங்கள் கிரைய பத்திரத்தின் முன்னோட்டம். அச்சிடுவதற்கு முன் சரிபார்க்கவும்.</DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <DocumentPreview formData={formData} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
