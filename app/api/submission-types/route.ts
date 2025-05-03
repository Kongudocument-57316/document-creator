import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

// Helper function to check if table exists
async function checkTableExists(supabase: any, tableName: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from("information_schema.tables")
      .select("table_name")
      .eq("table_schema", "public")
      .eq("table_name", tableName)
      .single()

    return !error && data !== null
  } catch (error) {
    console.error(`Error checking if table ${tableName} exists:`, error)
    return false
  }
}

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    // Check if the table exists first
    const tableExists = await checkTableExists(supabase, "submission_types")

    if (!tableExists) {
      console.log("submission_types table does not exist yet")
      return NextResponse.json([])
    }

    const { data: submissionTypes, error } = await supabase
      .from("submission_types")
      .select("*")
      .order("name", { ascending: true })

    if (error) {
      console.error("Error fetching submission types:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(submissionTypes || [])
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json([], { status: 200 }) // Return empty array instead of error
  }
}
