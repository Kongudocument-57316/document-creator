"use server"

import { getSupabaseServerClient } from "@/lib/supabase"
import { v4 as uuidv4 } from "uuid"

export async function saveDocumentContent(documentId: string | null, content: string, formData: any) {
  try {
    const supabase = getSupabaseServerClient()

    // Generate a new ID if one doesn't exist
    const id = documentId || uuidv4()

    // Prepare data for saving
    const documentData = {
      id,
      content,
      form_data_id: formData.id || null,
      updated_at: new Date().toISOString(),
    }

    // If this is a new record, set created_at
    if (!documentId) {
      documentData.created_at = new Date().toISOString()
    }

    // Upsert the record (insert if not exists, update if exists)
    const { error } = await supabase.from("sale_deed_documents").upsert(documentData)

    if (error) {
      console.error("Error saving document content:", error)
      return { success: false, error: error.message }
    }

    return { success: true, id }
  } catch (error) {
    console.error("Unexpected error saving document content:", error)
    return { success: false, error: "Unexpected error occurred" }
  }
}

export async function getDocumentContent(documentId: string) {
  try {
    const supabase = getSupabaseServerClient()

    const { data, error } = await supabase.from("sale_deed_documents").select("content").eq("id", documentId).single()

    if (error) {
      console.error("Error fetching document content:", error)
      return { success: false, error: error.message }
    }

    return { success: true, content: data?.content || "" }
  } catch (error) {
    console.error("Unexpected error fetching document content:", error)
    return { success: false, error: "Unexpected error occurred" }
  }
}

export async function deleteDocument(documentId: string) {
  try {
    const supabase = getSupabaseServerClient()

    const { error } = await supabase.from("sale_deed_documents").delete().eq("id", documentId)

    if (error) {
      console.error("Error deleting document:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Unexpected error deleting document:", error)
    return { success: false, error: "Unexpected error occurred" }
  }
}
