"use server"

import { createClient } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

export async function saveDocument(formData: any) {
  try {
    const supabase = createClient()

    console.log("Saving settlement document with data:", formData)

    // Prepare data for insertion
    const documentData = {
      document_number: formData.documentNumber,
      document_date: formData.documentDate,
      registration_office_id: formData.registrationOffice,
      book_number_id: formData.bookNumber,
      settlement_type: "family", // Default to family type

      donor_name: formData.donorName,
      donor_address: formData.donorAddress,

      recipient_name: formData.recipientName,
      recipient_address: formData.recipientAddress,

      property_description: formData.propertyDescription,

      witness1_name: formData.witness1Name,
      witness1_address: formData.witness1Address,

      witness2_name: formData.witness2Name,
      witness2_address: formData.witness2Address,

      typist_name: formData.typistName,
      typist_office_name: formData.typistOffice,

      created_at: new Date().toISOString(),
    }

    // Insert data into the settlement_documents table
    const { data, error } = await supabase.from("settlement_documents").insert(documentData).select("id").single()

    if (error) {
      console.error("Error saving settlement document:", error)
      return { success: false, error: error.message }
    }

    console.log("Settlement document saved successfully with ID:", data.id)
    revalidatePath("/document-details/settlement-document")
    return { success: true, id: data.id }
  } catch (error: any) {
    console.error("Error in saveSettlementDocument:", error)
    return { success: false, error: error.message }
  }
}
