import { NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase"

export async function GET() {
  try {
    const supabase = getSupabaseServerClient()

    const { data, error } = await supabase
      .from("sub_registrar_offices")
      .select("id, name, registration_district_id, registration_districts(name)")
      .order("name")

    if (error) {
      console.error("Error fetching sub-registrar offices:", error)
      return NextResponse.json({ error: "Failed to fetch sub-registrar offices" }, { status: 500 })
    }

    // Return empty array if no data to avoid null
    return NextResponse.json(data || [])
  } catch (error) {
    console.error("Error in sub-registrar offices API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
