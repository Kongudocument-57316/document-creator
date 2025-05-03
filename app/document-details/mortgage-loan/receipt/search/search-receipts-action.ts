"use server"

import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export async function searchMortgageLoanReceipts(searchParams: {
  receiptNumber?: string
  mortgageLoanDocumentNumber?: string
  payerName?: string
  receiverName?: string
  fromDate?: string
  toDate?: string
}) {
  try {
    const supabase = createServerActionClient({ cookies })

    let query = supabase
      .from("mortgage_loan_receipts")
      .select(`
        *,
        mortgage_loan_documents:mortgage_loan_document_id (id, document_number)
      `)
      .order("created_at", { ascending: false })

    // Apply filters if provided
    if (searchParams.receiptNumber) {
      query = query.ilike("receipt_number", `%${searchParams.receiptNumber}%`)
    }

    if (searchParams.mortgageLoanDocumentNumber && searchParams.mortgageLoanDocumentNumber.trim() !== "") {
      // First, find the mortgage loan document ID
      const { data: documentData } = await supabase
        .from("mortgage_loan_documents")
        .select("id")
        .ilike("document_number", `%${searchParams.mortgageLoanDocumentNumber}%`)
        .limit(1)
        .single()

      if (documentData) {
        query = query.eq("mortgage_loan_document_id", documentData.id)
      }
    }

    if (searchParams.payerName) {
      query = query.ilike("payer_name", `%${searchParams.payerName}%`)
    }

    if (searchParams.receiverName) {
      query = query.ilike("receiver_name", `%${searchParams.receiverName}%`)
    }

    if (searchParams.fromDate && searchParams.toDate) {
      query = query.gte("receipt_date", searchParams.fromDate).lte("receipt_date", searchParams.toDate)
    } else if (searchParams.fromDate) {
      query = query.gte("receipt_date", searchParams.fromDate)
    } else if (searchParams.toDate) {
      query = query.lte("receipt_date", searchParams.toDate)
    }

    const { data, error } = await query

    if (error) {
      console.error("Error searching mortgage loan receipts:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error: any) {
    console.error("Error in searchMortgageLoanReceipts:", error)
    return { success: false, error: error.message || "An error occurred while searching for receipts" }
  }
}
