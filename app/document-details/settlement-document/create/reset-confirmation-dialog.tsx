"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface ResetConfirmationDialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onConfirm?: () => void
}

export function ResetConfirmationDialog({ open = false, onOpenChange, onConfirm }: ResetConfirmationDialogProps) {
  const [isOpen, setIsOpen] = useState(open)

  const handleOpenChange = (newOpen: boolean) => {
    setIsOpen(newOpen)
    if (onOpenChange) {
      onOpenChange(newOpen)
    }
  }

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm()
    }
    handleOpenChange(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>படிவத்தை மீட்டமைக்க விரும்புகிறீர்களா?</DialogTitle>
          <DialogDescription>இந்த செயல்பாடு அனைத்து புலங்களையும் அழித்துவிடும். இந்த செயலை செய்ய முடியாது.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            ரத்து செய்
          </Button>
          <Button variant="destructive" onClick={handleConfirm}>
            மீட்டமை
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
