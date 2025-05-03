import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    // First check if the table exists
    const { data: tableExists, error: checkError } = await supabase
      .from("information_schema.tables")
      .select("table_name")
      .eq("table_schema", "public")
      .eq("table_name", "typist_offices")
      .single()

    // If there was an error checking or the table doesn't exist, return an empty array
    if (checkError || !tableExists) {
      console.log("Typist offices table does not exist yet, returning empty array")
      return NextResponse.json([])
    }

    // If the table exists, query it
    const { data: typistOffices, error } = await supabase
      .from("typist_offices")
      .select("*")
      .order("name", { ascending: true })

    if (error) {
      console.error("Error fetching typist offices:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(typistOffices)
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json([], { status: 200 }) // Return empty array instead of error
  }
}
