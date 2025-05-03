import { getSupabaseBrowserClient } from "@/lib/supabase"

export interface TypistDetails {
  typistName: string
  typistOfficeName: string
  typistPhoneNo: string
}

export async function fetchTypistDetails(): Promise<TypistDetails> {
  const supabase = getSupabaseBrowserClient()
  let typistName = ""
  let typistOfficeName = ""
  let typistPhoneNo = ""

  try {
    // Check if typists table exists
    const { data: typistTableExists, error: typistTableError } = await supabase
      .from("information_schema.tables")
      .select("table_name")
      .eq("table_schema", "public")
      .eq("table_name", "typists")
      .single()

    if (!typistTableError && typistTableExists) {
      // Fetch typist details
      const { data: typistData, error: typistError } = await supabase.from("typists").select("*").order("name").limit(1)

      if (!typistError && typistData && typistData.length > 0) {
        typistName = typistData[0].name || ""
        typistPhoneNo = typistData[0].phone || ""
      }
    }

    // Check if typist_offices table exists
    const { data: officeTableExists, error: officeTableError } = await supabase
      .from("information_schema.tables")
      .select("table_name")
      .eq("table_schema", "public")
      .eq("table_name", "typist_offices")
      .single()

    if (!officeTableError && officeTableExists) {
      // Fetch typist office details
      const { data: officeData, error: officeError } = await supabase
        .from("typist_offices")
        .select("*")
        .order("name")
        .limit(1)

      if (!officeError && officeData && officeData.length > 0) {
        typistOfficeName = officeData[0].name || ""
      }
    }

    return {
      typistName,
      typistOfficeName,
      typistPhoneNo,
    }
  } catch (error) {
    console.error("Error fetching typist details:", error)
    return {
      typistName: "",
      typistOfficeName: "",
      typistPhoneNo: "",
    }
  }
}
