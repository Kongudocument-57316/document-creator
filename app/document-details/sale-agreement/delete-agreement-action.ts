"use server"

import { getSupabaseServerClient } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

export async function deleteAgreement(id: string) {
  try {
    const supabase = getSupabaseServerClient()

    // 1. Delete related parties
    const { error: partiesError } = await supabase.from("sale_agreement_parties").delete().eq("sale_agreement_id", id)

    if (partiesError) {
      console.error("Error deleting related parties:", partiesError)
      return { success: false, error: partiesError.message }
    }

    // 2. Delete related properties
    const { error: propertiesError } = await supabase
      .from("sale_agreement_properties")
      .delete()
      .eq("sale_agreement_id", id)

    if (propertiesError) {
      console.error("Error deleting related properties:", propertiesError)
      return { success: false, error: propertiesError.message }
    }

    // 3. Delete the main document
    const { error: documentError } = await supabase.from("sale_agreements").delete().eq("id", id)

    if (documentError) {
      console.error("Error deleting document:", documentError)
      return { success: false, error: documentError.message }
    }

    // Revalidate the search page to reflect the changes
    revalidatePath("/document-details/sale-agreement/search")

    return { success: true }
  } catch (error) {
    console.error("Error in deleteAgreement:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}
