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
import { Loader2, AlertTriangle } from "lucide-react"
import { deletePartitionReleaseDocument } from "@/app/document-details/partition-release/delete-document-action"
import { useToast } from "@/hooks/use-toast"

interface DeletePartitionReleaseDialogProps {
  documentId: number
  documentNumber: string
  isOpen: boolean
  onClose: () => void
  onDeleted: () => void
}

export function DeletePartitionReleaseDialog({
  documentId,
  documentNumber,
  isOpen,
  onClose,
  onDeleted,
}: DeletePartitionReleaseDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const result = await deletePartitionReleaseDocument(documentId)

      if (result.success) {
        toast({
          title: "ஆவணம் நீக்கப்பட்டது",
          description: "பாகபாத்திய விடுதலை ஆவணம் வெற்றிகரமாக நீக்கப்பட்டது",
          variant: "default",
        })
        onDeleted()
      } else {
        toast({
          title: "பிழை ஏற்பட்டது",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "பிழை ஏற்பட்டது",
        description: "ஆவணத்தை நீக்குவதில் பிழை ஏற்பட்டது",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            ஆவணத்தை நீக்குவதை உறுதிப்படுத்தவும்
          </DialogTitle>
          <DialogDescription>
            இந்த செயலை திரும்ப பெற முடியாது. ஆவண எண் <span className="font-semibold">{documentNumber}</span> நிரந்தரமாக
            நீக்கப்படும்.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-row justify-between sm:justify-between">
          <Button type="button" variant="outline" onClick={onClose} disabled={isDeleting}>
            ரத்து செய்
          </Button>
          <Button type="button" variant="destructive" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                நீக்குகிறது...
              </>
            ) : (
              "நீக்கு"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
