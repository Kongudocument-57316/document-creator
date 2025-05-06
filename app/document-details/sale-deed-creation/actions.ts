"use server"

import { getSupabaseServerClient } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

export async function saveSaleDeed(formData: any) {
  try {
    const supabase = getSupabaseServerClient()

    // Generate a unique ID if not provided
    const deedId = formData.id || `deed_${Date.now()}`

    // Prepare the data for storage
    const deedData = {
      id: deedId,
      deed_details: formData.deed || {},
      seller_details: formData.seller || [],
      buyer_details: formData.buyer || [],
      property_details: formData.property || {},
      witness_details: formData.witness || [],
      payment_details: formData.payment || {},
      previous_documents: formData.previousDoc || {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      status: "draft",
    }

    // Save to the database
    const { data, error } = await supabase.from("sale_deeds").upsert(deedData, { onConflict: "id" }).select()

    if (error) {
      throw new Error(`Error saving sale deed: ${error.message}`)
    }

    // Revalidate the path to refresh the data
    revalidatePath("/document-details/sale-deed-creation")

    return { success: true, data, id: deedId }
  } catch (error: any) {
    console.error("Error saving sale deed:", error)
    return { success: false, error: error.message }
  }
}
