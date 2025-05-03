import { getSupabaseServerClient } from "../lib/supabase"
import fs from "fs"
import path from "path"

async function setupDatabase() {
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
    for (const statement of statements) {
      try {
        const { error } = await supabase.rpc("exec_sql", { sql: statement })

        if (error) {
          console.error("Error executing SQL statement:", error)
          console.error("Statement:", statement)
        }
      } catch (err) {
        console.error("Exception executing SQL statement:", err)
        console.error("Statement:", statement)
      }
    }

    console.log("Database setup completed successfully!")
  } catch (error) {
    console.error("Error setting up database:", error)
  }
}

// Execute the setup function
setupDatabase()
