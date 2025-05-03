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
import { deleteSettlementDocument } from "@/app/document-details/settlement-document/delete-document-action"
import { useRouter } from "next/navigation"
import { AlertCircle } from "lucide-react"

interface DeleteSettlementDialogProps {
  documentId: string
  documentNumber: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeleteSettlementDialog({
  documentId,
  documentNumber,
  open,
  onOpenChange,
}: DeleteSettlementDialogProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      setError(null)

      const result = await deleteSettlementDocument(documentId)

      if (result.success) {
        onOpenChange(false)
        router.push("/document-details/settlement-document")
      } else {
        setError(result.error || "ஆவணத்தை நீக்குவதில் பிழை ஏற்பட்டது")
      }
    } catch (err: any) {
      setError(err.message || "ஆவணத்தை நீக்குவதில் பிழை ஏற்பட்டது")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>ஆவணத்தை நீக்க உறுதிப்படுத்தவும்</DialogTitle>
          <DialogDescription>
            ஆவண எண் <span className="font-medium">{documentNumber}</span> நீக்க விரும்புகிறீர்களா? இந்த செயல் திரும்பப்பெற முடியாது.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="bg-red-50 p-3 rounded-md flex items-start gap-2 text-red-800">
            <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <DialogFooter className="flex space-x-2 sm:justify-end">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isDeleting}>
            ரத்து செய்
          </Button>
          <Button type="button" variant="destructive" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? "நீக்குகிறது..." : "நீக்கு"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
