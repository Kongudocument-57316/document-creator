"use server"

import { createClient } from "@/lib/supabase"

export async function searchPartitionReleaseDocuments(formData: FormData) {
  try {
    const documentNumber = formData.get("documentNumber") as string
    const documentDate = formData.get("documentDate") as string
    const partyName = formData.get("partyName") as string
    const propertyDetails = formData.get("propertyDetails") as string

    const supabase = createClient()

    let query = supabase.from("partition_release_documents").select("*").order("created_at", { ascending: false })

    if (documentNumber) {
      query = query.ilike("document_number", `%${documentNumber}%`)
    }

    if (documentDate) {
      query = query.eq("document_date", documentDate)
    }

    if (partyName) {
      query = query.or(`first_party_name.ilike.%${partyName}%,second_party_name.ilike.%${partyName}%`)
    }

    if (propertyDetails) {
      query = query.ilike("property_details", `%${propertyDetails}%`)
    }

    const { data, error } = await query

    if (error) {
      console.error("Error searching documents:", error)
      return { success: false, data: [], message: error.message }
    }

    return { success: true, data, message: "" }
  } catch (error) {
    console.error("Error searching documents:", error)
    return { success: false, data: [], message: "An unexpected error occurred" }
  }
}
