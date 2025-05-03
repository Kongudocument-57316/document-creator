"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface DocumentNameDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (name: string) => void
  onCancel: () => void
  title?: string
  description?: string
  saveButtonText?: string
  cancelButtonText?: string
}

export function DocumentNameDialog({
  open,
  onOpenChange,
  onSave,
  onCancel,
  title = "ஆவணத்தை சேமிக்க",
  description = "இந்த ஆவணத்திற்கு ஒரு பெயரை உள்ளிடவும்",
  saveButtonText = "சேமி",
  cancelButtonText = "ரத்து செய்",
}: DocumentNameDialogProps) {
  const [name, setName] = useState("")
  const [error, setError] = useState("")

  // Reset state when dialog opens
  useEffect(() => {
    if (open) {
      setName("")
      setError("")
    }
  }, [open])

  const handleSave = () => {
    if (!name.trim()) {
      setError("ஆவணத்தின் பெயரை உள்ளிடவும்")
      return
    }
    onSave(name)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="document-name" className="text-right">
              ஆவணத்தின் பெயர்
            </Label>
            <Input
              id="document-name"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                setError("")
              }}
              className="col-span-3"
              autoFocus
            />
          </div>
          {error && <p className="text-sm text-red-500 text-center">{error}</p>}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            {cancelButtonText}
          </Button>
          <Button onClick={handleSave}>{saveButtonText}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
