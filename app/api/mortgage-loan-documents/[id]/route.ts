import { getSupabaseServerClient } from "@/lib/supabase"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const supabase = getSupabaseServerClient()

    const { data, error } = await supabase.from("mortgage_loan_documents").select("*").eq("id", id).single()

    if (error) {
      throw error
    }

    if (!data) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching mortgage loan document:", error)
    return NextResponse.json({ error: "Failed to fetch mortgage loan document" }, { status: 500 })
  }
}
