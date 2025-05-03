import { getSupabaseServerClient } from "@/lib/supabase"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseServerClient()
    const searchParams = request.nextUrl.searchParams

    // Get query parameters
    const documentNumber = searchParams.get("documentNumber")
    const buyerName = searchParams.get("buyerName")
    const sellerName = searchParams.get("sellerName")
    const fromDate = searchParams.get("fromDate")
    const toDate = searchParams.get("toDate")

    // Build query
    let query = supabase.from("mortgage_loan_documents").select("*").order("created_at", { ascending: false })

    // Apply filters if provided
    if (documentNumber) {
      query = query.ilike("document_number", `%${documentNumber}%`)
    }

    if (buyerName) {
      query = query.ilike("buyer_name", `%${buyerName}%`)
    }

    if (sellerName) {
      query = query.ilike("seller_name", `%${sellerName}%`)
    }

    if (fromDate) {
      query = query.gte("document_date", fromDate)
    }

    if (toDate) {
      query = query.lte("document_date", toDate)
    }

    const { data, error } = await query

    if (error) {
      throw error
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching mortgage loan documents:", error)
    return NextResponse.json({ error: "Failed to fetch mortgage loan documents" }, { status: 500 })
  }
}
