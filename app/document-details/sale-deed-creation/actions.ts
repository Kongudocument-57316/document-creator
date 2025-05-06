"use server"

import { getSupabaseServerClient } from "@/lib/supabase"
import { v4 as uuidv4 } from "uuid"

export async function saveSaleDeed(formData: any) {
  try {
    const supabase = getSupabaseServerClient()

    // Generate a new ID if one doesn't exist
    const id = formData.id || uuidv4()

    // Prepare data for saving
    const deedData = {
      id,
      deed_details: formData.deed || {},
      seller_details: formData.seller || [],
      buyer_details: formData.buyer || [],
      property_details: formData.property || {},
      witness_details: formData.witness || [],
      payment_details: formData.payment || {},
      previous_documents: formData.previousDoc || {},
      document_id: formData.documentId || null,
      updated_at: new Date().toISOString(),
      status: "draft",
    }

    // If this is a new record, set created_at
    if (!formData.id) {
      deedData.created_at = new Date().toISOString()
    }

    // Upsert the record (insert if not exists, update if exists)
    const { error } = await supabase.from("sale_deeds").upsert(deedData)

    if (error) {
      console.error("Error saving sale deed:", error)
      return { success: false, error: error.message }
    }

    return { success: true, id }
  } catch (error) {
    console.error("Unexpected error saving sale deed:", error)
    return { success: false, error: "Unexpected error occurred" }
  }
}
