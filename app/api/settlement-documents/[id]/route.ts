import { createClient } from "@/lib/supabase"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const supabase = createClient()

    const { data, error } = await supabase.from("settlement_documents").select("*").eq("id", id).single()

    if (error) {
      console.error("Error fetching settlement document:", error)
      return NextResponse.json({ error: "ஆவணத்தை பெற முடியவில்லை" }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({ error: "ஆவணம் கிடைக்கவில்லை" }, { status: 404 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in GET settlement document:", error)
    return NextResponse.json({ error: "ஆவணத்தை பெறுவதில் பிழை ஏற்பட்டது" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const supabase = createClient()

    const { error } = await supabase.from("settlement_documents").delete().eq("id", id)

    if (error) {
      console.error("Error deleting settlement document:", error)
      return NextResponse.json({ error: "ஆவணத்தை நீக்க முடியவில்லை" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in DELETE settlement document:", error)
    return NextResponse.json({ error: "ஆவணத்தை நீக்குவதில் பிழை ஏற்பட்டது" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const body = await request.json()
    const supabase = createClient()

    const { error } = await supabase.from("settlement_documents").update(body).eq("id", id)

    if (error) {
      console.error("Error updating settlement document:", error)
      return NextResponse.json({ error: "ஆவணத்தை புதுப்பிக்க முடியவில்லை" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in PATCH settlement document:", error)
    return NextResponse.json({ error: "ஆவணத்தை புதுப்பிப்பதில் பிழை ஏற்பட்டது" }, { status: 500 })
  }
}
