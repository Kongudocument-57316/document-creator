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

// Helper function to format address from user fields
function formatAddress(user: any): string {
  const addressParts = [
    user.door_no,
    user.address_line1,
    user.address_line2,
    user.address_line3,
    user.taluk,
    user.district,
    user.pincode,
  ].filter(Boolean)

  return addressParts.length > 0 ? addressParts.join(", ") : ""
}

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    // Check if the table exists first
    const tableExists = await checkTableExists(supabase, "users")

    if (!tableExists) {
      console.log("users table does not exist yet")
      return NextResponse.json([])
    }

    const { data: users, error } = await supabase.from("users").select("*").order("name", { ascending: true })

    if (error) {
      console.error("Error fetching users:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Format addresses for all users
    const formattedUsers =
      users?.map((user) => ({
        ...user,
        address: user.address || formatAddress(user),
      })) || []

    return NextResponse.json(formattedUsers)
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json([], { status: 200 }) // Return empty array instead of error
  }
}
