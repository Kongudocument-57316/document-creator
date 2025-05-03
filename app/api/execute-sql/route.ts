import { NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase"

export async function POST(request: Request) {
  try {
    const { sql } = await request.json()

    if (!sql) {
      return NextResponse.json({ success: false, message: "SQL statement is required" }, { status: 400 })
    }

    const supabase = getSupabaseServerClient()

    // Execute the SQL statement
    const { data, error } = await supabase.rpc("exec_sql", { sql })

    if (error) {
      return NextResponse.json(
        { success: false, message: "SQL execution failed", error: error.message },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "SQL executed successfully",
      data,
    })
  } catch (error) {
    console.error("Error executing SQL:", error)
    return NextResponse.json({ success: false, message: "SQL execution failed", error: String(error) }, { status: 500 })
  }
}
