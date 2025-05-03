"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Save, FileUp } from "lucide-react"
import type { SettlementFormValues } from "./create-settlement-document-form"

interface DraftManagerProps {
  onLoadDraft: (draftData: SettlementFormValues) => void
}

export function DraftManager({ onLoadDraft }: DraftManagerProps) {
  const { toast } = useToast()
  const [hasSavedDraft, setHasSavedDraft] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("settlementDocumentDraft") !== null
    }
    return false
  })

  const saveDraft = () => {
    try {
      // Get form data from the form element
      const form = document.querySelector("form") as HTMLFormElement
      if (!form) return

      const formData = new FormData(form)
      const draftData: Record<string, any> = {}

      // Convert FormData to object
      formData.forEach((value, key) => {
        draftData[key] = value
      })

      // Special handling for date fields
      if (draftData.documentDate) {
        try {
          draftData.documentDate = new Date(draftData.documentDate).toISOString()
        } catch (e) {
          console.error("Error converting date:", e)
        }
      }

      localStorage.setItem("settlementDocumentDraft", JSON.stringify(draftData))
      setHasSavedDraft(true)

      toast({
        title: "வரைவு சேமிக்கப்பட்டது",
        description: "உங்கள் வரைவு உள்ளூர் சேமிப்பில் சேமிக்கப்பட்டது",
      })
    } catch (error) {
      console.error("Error saving draft:", error)
      toast({
        title: "பிழை",
        description: "வரைவை சேமிப்பதில் பிழை ஏற்பட்டது",
        variant: "destructive",
      })
    }
  }

  const loadDraft = () => {
    try {
      const savedDraft = localStorage.getItem("settlementDocumentDraft")
      if (savedDraft) {
        const draftData = JSON.parse(savedDraft)
        onLoadDraft(draftData)
      } else {
        toast({
          title: "வரைவு இல்லை",
          description: "சேமிக்கப்பட்ட வரைவு எதுவும் கிடைக்கவில்லை",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error loading draft:", error)
      toast({
        title: "பிழை",
        description: "வரைவை ஏற்றுவதில் பிழை ஏற்பட்டது",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex gap-2">
      <Button variant="outline" onClick={saveDraft}>
        <Save className="mr-2 h-4 w-4" />
        வரைவு சேமி
      </Button>
      <Button variant="outline" onClick={loadDraft} disabled={!hasSavedDraft}>
        <FileUp className="mr-2 h-4 w-4" />
        வரைவ��� ஏற்று
      </Button>
    </div>
  )
}
