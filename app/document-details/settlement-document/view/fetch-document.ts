"use server"

import { createClient } from "@/lib/supabase"

export async function fetchSettlementDocument(id: string) {
  try {
    const supabase = createClient()

    const { data, error } = await supabase.from("settlement_documents").select("*").eq("id", id).single()

    if (error) {
      console.error("Error fetching settlement document:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error: any) {
    console.error("Error in fetchSettlementDocument:", error)
    return { success: false, error: error.message }
  }
}
