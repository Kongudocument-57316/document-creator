import { getSupabaseServerClient } from "@/lib/supabase"
import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function POST() {
  try {
    const supabase = getSupabaseServerClient()

    // Read the SQL file
    const sqlFilePath = path.join(process.cwd(), "db", "sale_deed_schema.sql")
    const sqlContent = fs.readFileSync(sqlFilePath, "utf8")

    // Execute the SQL
    const { error } = await supabase.rpc("exec_sql", { sql: sqlContent })

    if (error) {
      console.error("Error setting up sale deed tables:", error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "Sale deed tables created successfully" })
  } catch (error: any) {
    console.error("Error setting up sale deed tables:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
