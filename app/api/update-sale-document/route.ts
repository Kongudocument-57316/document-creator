import { getSupabaseServerClient } from "@/lib/supabase"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { saleDocumentId, documentId } = await request.json()

    if (!saleDocumentId || !documentId) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    const supabase = getSupabaseServerClient()

    const { error } = await supabase.from("sale_documents").update({ document_id: documentId }).eq("id", saleDocumentId)

    if (error) {
      console.error("Error updating sale document:", error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ success: false, error: "Unexpected error occurred" }, { status: 500 })
  }
}
