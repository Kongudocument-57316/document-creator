"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Trash2 } from "lucide-react"
import { useState } from "react"
import { deleteAgreement } from "@/app/document-details/sale-agreement/delete-agreement-action"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface DeleteAgreementDialogProps {
  id: string
  onSuccess?: () => void
  variant?: "icon" | "button"
}

export function DeleteAgreementDialog({ id, onSuccess, variant = "icon" }: DeleteAgreementDialogProps) {
  const [open, setOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      const result = await deleteAgreement(id)

      if (result.success) {
        toast.success("ஆவணம் வெற்றிகரமாக நீக்கப்பட்டது")
        setOpen(false)

        if (onSuccess) {
          onSuccess()
        } else {
          // If we're on the view page, redirect to the search page
          router.push("/document-details/sale-agreement/search")
        }
      } else {
        toast.error(`ஆவணத்தை நீக்குவதில் பிழை: ${result.error}`)
      }
    } catch (error) {
      console.error("Error deleting document:", error)
      toast.error("ஆவணத்தை ந��க்குவதில் பிழை ஏற்பட்டது")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      {variant === "icon" ? (
        <Button variant="ghost" size="icon" onClick={() => setOpen(true)}>
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">நீக்கு</span>
        </Button>
      ) : (
        <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
          <Trash2 className="mr-2 h-4 w-4" />
          நீக்கு
        </Button>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ஆவணத்தை நீக்க உறுதிப்படுத்தவும்</DialogTitle>
            <DialogDescription>இந்த செயலை திரும்ப பெற முடியாது. இந்த ஆவணம் நிரந்தரமாக நீக்கப்படும்.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={isDeleting}>
              ரத்து செய்
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? "நீக்குகிறது..." : "நீக்கு"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
