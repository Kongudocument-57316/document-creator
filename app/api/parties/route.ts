import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

// Helper function to check if table exists
async function checkTableExists(supabase: any, tableName: string): Promise<boolean> {
  try {
    const { error } = await supabase.from(tableName).select("id").limit(1).maybeSingle()

    if (error && error.code === "42P01") {
      console.log(`Table '${tableName}' does not exist yet`)
      return false
    }

    return true
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
    let parties = []

    // First check if parties table exists
    const partiesTableExists = await checkTableExists(supabase, "parties")

    if (partiesTableExists) {
      // If parties table exists, fetch from there
      const { data: partiesData, error: partiesError } = await supabase
        .from("parties")
        .select("*")
        .order("name", { ascending: true })

      if (partiesError) {
        console.error("Error fetching from parties table:", partiesError)
      } else if (partiesData && partiesData.length > 0) {
        parties = partiesData.map((party) => ({
          ...party,
          address: party.address || formatAddress(party),
        }))
        return NextResponse.json(parties)
      }
    }

    // If parties table doesn't exist or is empty, try to get users from users table
    const usersTableExists = await checkTableExists(supabase, "users")

    if (usersTableExists) {
      const { data: usersData, error: usersError } = await supabase
        .from("users")
        .select("*")
        .order("name", { ascending: true })

      if (usersError) {
        console.error("Error fetching from users table:", usersError)
        return NextResponse.json({ error: usersError.message }, { status: 500 })
      }

      if (usersData) {
        // Convert users to parties format
        parties = usersData.map((user) => ({
          id: user.id,
          name: user.name,
          age: user.age,
          relation_name: user.relation_name,
          relation_type: user.relation_type,
          door_no: user.door_no,
          address_line1: user.address_line1,
          address_line2: user.address_line2,
          address_line3: user.address_line3,
          taluk: user.taluk,
          district: user.district,
          pincode: user.pincode,
          aadhar_no: user.aadhar_no,
          phone_no: user.phone_no,
          address: user.address || formatAddress(user),
        }))
      }
    }

    return NextResponse.json(parties)
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
