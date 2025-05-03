"use server"

import { createClient } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

export async function deleteSettlementDocument(id: string) {
  try {
    const supabase = createClient()

    const { error } = await supabase.from("settlement_documents").delete().eq("id", id)

    if (error) {
      console.error("Error deleting settlement document:", error)
      return { success: false, error: error.message }
    }

    revalidatePath("/document-details/settlement-document")
    return { success: true }
  } catch (error: any) {
    console.error("Error in deleteSettlementDocument:", error)
    return { success: false, error: error.message }
  }
}
