"use server"

import { createClient } from "@/lib/supabase"

export async function fetchSubRegistrarOffices() {
  try {
    // Create the Supabase client with explicit URL and key from environment variables
    const supabase = createClient()

    const { data, error } = await supabase.from("sub_registrar_offices").select("id, name").order("name")

    if (error) {
      console.error("Error fetching sub registrar offices:", error)
      throw new Error("Failed to fetch sub registrar offices")
    }

    return data || []
  } catch (error) {
    console.error("Error in fetchSubRegistrarOffices:", error)
    return []
  }
}

export async function fetchTypists() {
  try {
    // Create the Supabase client with explicit URL and key from environment variables
    const supabase = createClient()

    const { data, error } = await supabase.from("typists").select("id, name, phone").order("name")

    if (error) {
      console.error("Error fetching typists:", error)
      throw new Error("Failed to fetch typists")
    }

    return data || []
  } catch (error) {
    console.error("Error in fetchTypists:", error)
    return []
  }
}
