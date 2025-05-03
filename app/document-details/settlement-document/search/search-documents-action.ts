"use server"

import { getSupabaseServerClient } from "@/lib/supabase"

interface SearchParams {
  documentName?: string
  recipientName?: string
  donorName?: string
  documentNumber?: string
  subRegistrarOfficeId?: string
  fromDate?: string
  toDate?: string
  propertyDescription?: string
}

export async function searchSettlementDocuments(params: SearchParams) {
  const supabase = getSupabaseServerClient()

  // Start with the base query
  let query = supabase.from("settlement_documents").select("*").order("created_at", { ascending: false })

  // Add filters based on provided parameters
  if (params.documentName) {
    query = query.ilike("document_name", `%${params.documentName}%`)
  }

  if (params.recipientName) {
    query = query.ilike("recipient_name", `%${params.recipientName}%`)
  }

  if (params.donorName) {
    query = query.ilike("donor_name", `%${params.donorName}%`)
  }

  if (params.documentNumber) {
    query = query.ilike("pr_document_no", `%${params.documentNumber}%`)
  }

  if (params.subRegistrarOfficeId) {
    query = query.eq("sub_registrar_office_id", params.subRegistrarOfficeId)
  }

  if (params.fromDate) {
    query = query.gte("document_date", params.fromDate)
  }

  if (params.toDate) {
    query = query.lte("document_date", params.toDate)
  }

  if (params.propertyDescription) {
    query = query.ilike("property_description", `%${params.propertyDescription}%`)
  }

  // Execute the query
  const { data, error } = await query

  if (error) {
    console.error("Error searching settlement documents:", error)
    throw error
  }

  return data || []
}
