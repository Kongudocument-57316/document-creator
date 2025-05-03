import { getSupabaseServerClient } from "@/lib/supabase"

export async function fetchUsers() {
  const supabase = getSupabaseServerClient()

  const { data, error } = await supabase
    .from("users")
    .select("id, name, father_name, address, phone, email")
    .order("name")

  if (error) {
    console.error("Error fetching users:", error)
    throw new Error("Failed to fetch users")
  }

  return data || []
}

export async function fetchSubRegistrarOffices() {
  const supabase = getSupabaseServerClient()

  const { data, error } = await supabase
    .from("sub_registrar_offices")
    .select("id, name, registration_district_id, registration_districts(name)")
    .order("name")

  if (error) {
    console.error("Error fetching sub-registrar offices:", error)
    throw new Error("Failed to fetch sub-registrar offices")
  }

  return data || []
}

export async function fetchBookNumbers() {
  const supabase = getSupabaseServerClient()

  // Remove 'description' from the select query since it doesn't exist in the table
  const { data, error } = await supabase.from("book_numbers").select("id, number").order("number")

  if (error) {
    console.error("Error fetching book numbers:", error)
    throw new Error("Failed to fetch book numbers")
  }

  return data || []
}

export async function fetchTypists() {
  const supabase = getSupabaseServerClient()

  const { data, error } = await supabase.from("typists").select("id, name, phone").order("name")

  if (error) {
    console.error("Error fetching typists:", error)
    throw new Error("Failed to fetch typists")
  }

  return data || []
}

export async function fetchOffices() {
  const supabase = getSupabaseServerClient()

  const { data, error } = await supabase.from("offices").select("id, name, phone").order("name")

  if (error) {
    console.error("Error fetching offices:", error)
    throw new Error("Failed to fetch offices")
  }

  return data || []
}
