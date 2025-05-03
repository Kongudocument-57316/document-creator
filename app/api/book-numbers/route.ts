import { NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase"

export async function GET() {
  try {
    const supabase = getSupabaseServerClient()

    // Remove 'description' from the select query since it doesn't exist in the table
    const { data, error } = await supabase.from("book_numbers").select("id, number").order("number")

    if (error) {
      console.error("Error fetching book numbers:", error)
      return NextResponse.json({ error: "Failed to fetch book numbers" }, { status: 500 })
    }

    // Return empty array if no data to avoid null
    return NextResponse.json(data || [])
  } catch (error) {
    console.error("Error in book numbers API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
