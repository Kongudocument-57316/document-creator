import { NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase"
import fs from "fs"
import path from "path"

export async function POST() {
  try {
    console.log("Starting database setup...")

    const supabase = getSupabaseServerClient()

    // Read the SQL file
    const schemaPath = path.join(process.cwd(), "db", "schema.sql")
    const sqlContent = fs.readFileSync(schemaPath, "utf8")

    // Split the SQL content into individual statements
    const statements = sqlContent
      .split(";")
      .filter((statement) => statement.trim() !== "")
      .map((statement) => statement + ";")

    // Execute each statement
    let successCount = 0
    let errorCount = 0

    for (const statement of statements) {
      try {
        // Using Supabase's SQL execution capability
        const { error } = await supabase.rpc("exec_sql", { sql: statement })

        if (error) {
          console.error("Error executing SQL statement:", error)
          errorCount++
        } else {
          successCount++
        }
      } catch (err) {
        console.error("Exception executing SQL statement:", err)
        errorCount++
      }
    }

    return NextResponse.json({
      success: true,
      message: "Database setup completed",
      stats: {
        totalStatements: statements.length,
        successfulStatements: successCount,
        failedStatements: errorCount,
      },
    })
  } catch (error) {
    console.error("Error setting up database:", error)
    return NextResponse.json(
      { success: false, message: "Database setup failed", error: String(error) },
      { status: 500 },
    )
  }
}
