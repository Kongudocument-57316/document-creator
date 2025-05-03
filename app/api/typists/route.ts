import { NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase"

export async function GET() {
  try {
    const supabase = getSupabaseServerClient()

    const { data, error } = await supabase.from("typists").select("id, name, phone").order("name")

    if (error) {
      console.error("Error fetching typists:", error)
      return NextResponse.json({ error: "Failed to fetch typists" }, { status: 500 })
    }

    // Return empty array if no data to avoid null
    return NextResponse.json(data || [])
  } catch (error) {
    console.error("Error in typists API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
