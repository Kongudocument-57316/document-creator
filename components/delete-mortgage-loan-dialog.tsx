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
import { deleteMortgageLoanDocument } from "@/app/document-details/mortgage-loan/delete-document-action"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface DeleteMortgageLoanDialogProps {
  id: number
  onSuccess?: () => void
  variant?: "icon" | "button"
}

export function DeleteMortgageLoanDialog({ id, onSuccess, variant = "icon" }: DeleteMortgageLoanDialogProps) {
  const [open, setOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      const result = await deleteMortgageLoanDocument(id)

      if (result.success) {
        toast.success("ஆவணம் வெற்றிகரமாக நீக்கப்பட்டது")
        setOpen(false)

        if (onSuccess) {
          onSuccess()
        } else {
          // If we're on the view page, redirect to the search page
          router.push("/document-details/mortgage-loan/search")
        }
      } else {
        toast.error(`ஆவணத்தை நீக்குவதில் பிழை: ${result.error}`)
      }
    } catch (error) {
      console.error("Error deleting document:", error)
      toast.error("ஆவணத்தை நீக்குவதில் பிழை ஏற்பட்டது")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      {variant === "icon" ? (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setOpen(true)}
          className="text-red-500 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">நீக்கு</span>
        </Button>
      ) : (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setOpen(true)}
          className="text-red-500 hover:text-red-700 border-red-200 hover:bg-red-50"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          நீக்கு
        </Button>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-white border-red-100 shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-red-600">ஆவணத்தை நீக்க உறுதிப்படுத்தவும்</DialogTitle>
            <DialogDescription className="text-gray-600">
              இந்த செயலை திரும்ப பெற முடியாது. இந்த ஆவணம் நிரந்தரமாக நீக்கப்படும்.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isDeleting}
              className="border-gray-200 hover:bg-gray-50"
            >
              ரத்து செய்
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600"
            >
              {isDeleting ? "நீக்குகிறது..." : "நீக்கு"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
