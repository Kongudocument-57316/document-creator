"use server"

import { createClient } from "@/lib/supabase"

export async function deleteMortgageLoanDocument(id: number) {
  try {
    const supabase = createClient()

    const { error } = await supabase.from("mortgage_loan_documents").delete().eq("id", id)

    if (error) {
      console.error("Error deleting document:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error: any) {
    console.error("Error deleting document:", error)
    return { success: false, error: error.message || "Unknown error occurred" }
  }
}
