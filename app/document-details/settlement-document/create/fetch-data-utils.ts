"use server"

import { getSupabaseServerClient } from "@/lib/supabase"
import { cookies } from "next/headers"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"

export type Party = {
  id: string
  name: string
  age?: string
  relation_name?: string
  relation_type?: string
  door_no?: string
  address_line1?: string
  address_line2?: string | null
  address_line3?: string | null
  taluk?: string
  district?: string
  pincode?: string
  aadhar_no?: string
  phone_no?: string
  address?: string
}

export type Witness = {
  id: string
  name: string
  age?: string
  relation_name?: string
  relation_type?: string
  door_no?: string
  address_line1?: string
  address_line2?: string | null
  address_line3?: string | null
  taluk?: string
  district?: string
  pincode?: string
  aadhar_no?: string
  address?: string
}

export type User = {
  id: string
  name: string
  age?: string
  relation_name?: string
  relation_type?: string
  door_no?: string
  address_line1?: string
  address_line2?: string | null
  address_line3?: string | null
  taluk?: string
  district?: string
  pincode?: string
  aadhar_no?: string
  phone_no?: string
  address?: string
  email?: string
  role?: string
}

export type DocumentType = {
  id: string
  name: string
  description?: string | null
}

export type SubRegistrarOffice = {
  id: string
  name: string
  registration_district_id?: string
  registration_districts?: {
    name: string
  }
}

export type BookNumber = {
  id: string
  number: string
}

export type Typist = {
  id: string
  name: string
  phone?: string
}

export type TypistOffice = {
  id: string
  name: string
  location?: string
  phone?: string
  address?: string
}

export type SubmissionType = {
  id: string
  name: string
  description?: string | null
}

// Helper function to check if a table exists
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

export async function fetchParties() {
  try {
    const supabase = getSupabaseServerClient()

    // First try to get parties from the parties table
    const partiesTableExists = await checkTableExists(supabase, "parties")
    if (partiesTableExists) {
      const { data: partiesData, error: partiesError } = await supabase.from("parties").select("*").order("name")

      if (!partiesError && partiesData && partiesData.length > 0) {
        return partiesData.map((party) => ({
          ...party,
          address: party.address || formatAddress(party),
        }))
      }
    }

    // If parties table doesn't exist or is empty, try to get users from users table
    const usersTableExists = await checkTableExists(supabase, "users")
    if (usersTableExists) {
      const { data: usersData, error: usersError } = await supabase.from("users").select("*").order("name")

      if (!usersError && usersData) {
        // Convert users to parties format
        return usersData.map((user) => ({
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

    return []
  } catch (error) {
    console.error("Error in fetchParties:", error)
    return []
  }
}

export async function fetchWitnesses() {
  try {
    const supabase = getSupabaseServerClient()

    // First try to get witnesses from the witnesses table
    const witnessesTableExists = await checkTableExists(supabase, "witnesses")
    if (witnessesTableExists) {
      const { data: witnessesData, error: witnessesError } = await supabase.from("witnesses").select("*").order("name")

      if (!witnessesError && witnessesData && witnessesData.length > 0) {
        return witnessesData.map((witness) => ({
          ...witness,
          address: witness.address || formatAddress(witness),
        }))
      }
    }

    // If witnesses table doesn't exist or is empty, try to get users from users table
    const usersTableExists = await checkTableExists(supabase, "users")
    if (usersTableExists) {
      const { data: usersData, error: usersError } = await supabase.from("users").select("*").order("name")

      if (!usersError && usersData) {
        // Convert users to witnesses format
        return usersData.map((user) => ({
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

    return []
  } catch (error) {
    console.error("Error in fetchWitnesses:", error)
    return []
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

export async function fetchUsers() {
  try {
    const supabase = getSupabaseServerClient()

    // Check if the table exists first
    const tableExists = await checkTableExists(supabase, "users")
    if (!tableExists) return []

    const { data, error } = await supabase.from("users").select("*").order("name")

    if (error) {
      console.error("Error fetching users:", error)
      return []
    }

    // Format addresses for all users
    return (
      data?.map((user) => ({
        ...user,
        address: user.address || formatAddress(user),
      })) || []
    )
  } catch (error) {
    console.error("Error in fetchUsers:", error)
    return []
  }
}

export async function fetchDocumentTypes() {
  try {
    const supabase = getSupabaseServerClient()

    // Check if the table exists first
    const tableExists = await checkTableExists(supabase, "document_types")
    if (!tableExists) return []

    const { data, error } = await supabase.from("document_types").select("id, name").order("name")

    if (error) {
      console.error("Error fetching document types:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error in fetchDocumentTypes:", error)
    return []
  }
}

export async function fetchSubmissionTypes() {
  try {
    const supabase = getSupabaseServerClient()

    // Check if the table exists first
    const tableExists = await checkTableExists(supabase, "submission_types")
    if (!tableExists) return []

    const { data, error } = await supabase.from("submission_types").select("id, name").order("name")

    if (error) {
      console.error("Error fetching submission types:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error in fetchSubmissionTypes:", error)
    return []
  }
}

export async function fetchSubRegistrarOffices() {
  try {
    const supabase = getSupabaseServerClient()

    // Check if the table exists first
    const tableExists = await checkTableExists(supabase, "sub_registrar_offices")
    if (!tableExists) return []

    const { data, error } = await supabase
      .from("sub_registrar_offices")
      .select("*, registration_districts(name)")
      .order("name")

    if (error) {
      console.error("Error fetching sub-registrar offices:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error in fetchSubRegistrarOffices:", error)
    return []
  }
}

export async function fetchBookNumbers() {
  try {
    const supabase = getSupabaseServerClient()

    // Check if the table exists first
    const tableExists = await checkTableExists(supabase, "book_numbers")
    if (!tableExists) return []

    const { data, error } = await supabase.from("book_numbers").select("id, number").order("number")

    if (error) {
      console.error("Error fetching book numbers:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error in fetchBookNumbers:", error)
    return []
  }
}

export async function fetchTypists() {
  try {
    const supabase = createServerComponentClient({ cookies })

    // Check if table exists
    const tableExists = await checkTableExists(supabase, "typists")
    if (!tableExists) {
      console.log("typists table does not exist yet")
      return []
    }

    const { data, error } = await supabase.from("typists").select("*").order("name", { ascending: true })

    if (error) {
      console.error("Error fetching typists:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Unexpected error fetching typists:", error)
    return []
  }
}

export async function fetchTypistOffices() {
  try {
    const supabase = createServerComponentClient({ cookies })

    // Check if table exists
    const tableExists = await checkTableExists(supabase, "typist_offices")
    if (!tableExists) {
      console.log("typist_offices table does not exist yet")
      return []
    }

    const { data, error } = await supabase.from("typist_offices").select("*").order("name", { ascending: true })

    if (error) {
      console.error("Error fetching typist offices:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Unexpected error fetching typist offices:", error)
    return []
  }
}

// Fetch default values for form
export async function fetchDefaultValues() {
  try {
    const supabase = getSupabaseServerClient()

    // Check if settlement_documents table exists
    const tableExists = await checkTableExists(supabase, "settlement_documents")
    if (!tableExists) {
      return {
        defaultRegistrationOffice: "",
        defaultBookNumber: "",
        defaultTypist: "",
        defaultTypistOffice: "",
      }
    }

    // Get the most recent document for default values
    try {
      const { data: recentDocument, error } = await supabase
        .from("settlement_documents")
        .select("registration_office_id, book_number_id, typist_id, typist_office_id")
        .order("created_at", { ascending: false })
        .limit(1)
        .single()

      if (error) {
        console.log("No recent documents found:", error)
        return {
          defaultRegistrationOffice: "",
          defaultBookNumber: "",
          defaultTypist: "",
          defaultTypistOffice: "",
        }
      }

      return {
        defaultRegistrationOffice: recentDocument?.registration_office_id || "",
        defaultBookNumber: recentDocument?.book_number_id || "",
        defaultTypist: recentDocument?.typist_id || "",
        defaultTypistOffice: recentDocument?.typist_office_id || "",
      }
    } catch (queryError) {
      console.log("Error querying recent document:", queryError)
      return {
        defaultRegistrationOffice: "",
        defaultBookNumber: "",
        defaultTypist: "",
        defaultTypistOffice: "",
      }
    }
  } catch (error) {
    console.error("Error fetching default values:", error)
    return {
      defaultRegistrationOffice: "",
      defaultBookNumber: "",
      defaultTypist: "",
      defaultTypistOffice: "",
    }
  }
}

export async function fetchAllData() {
  try {
    const supabase = getSupabaseServerClient()

    // Initialize result object with empty arrays
    const result = {
      parties: [] as Party[],
      witnesses: [] as Witness[],
      users: [] as User[],
      documentTypes: [] as DocumentType[],
      submissionTypes: [] as SubmissionType[],
      subRegistrarOffices: [] as SubRegistrarOffice[],
      bookNumbers: [] as BookNumber[],
      typists: [] as Typist[],
      typistOffices: [] as TypistOffice[],
      defaultValues: {
        defaultRegistrationOffice: "",
        defaultBookNumber: "",
        defaultTypist: "",
        defaultTypistOffice: "",
      },
    }

    // Fetch all data in parallel for better performance
    const [
      parties,
      witnesses,
      users,
      documentTypes,
      submissionTypes,
      subRegistrarOffices,
      bookNumbers,
      typists,
      typistOffices,
      defaultValues,
    ] = await Promise.all([
      fetchParties(),
      fetchWitnesses(),
      fetchUsers(),
      fetchDocumentTypes(),
      fetchSubmissionTypes(),
      fetchSubRegistrarOffices(),
      fetchBookNumbers(),
      fetchTypists(),
      fetchTypistOffices(),
      fetchDefaultValues(),
    ])

    // Assign results
    result.parties = parties
    result.witnesses = witnesses
    result.users = users
    result.documentTypes = documentTypes
    result.submissionTypes = submissionTypes
    result.subRegistrarOffices = subRegistrarOffices
    result.bookNumbers = bookNumbers
    result.typists = typists
    result.typistOffices = typistOffices
    result.defaultValues = defaultValues

    return result
  } catch (error) {
    console.error("Error in fetchAllData:", error)
    // Return empty arrays and default values to prevent the app from crashing
    return {
      parties: [],
      witnesses: [],
      users: [],
      documentTypes: [],
      submissionTypes: [],
      subRegistrarOffices: [],
      bookNumbers: [],
      typists: [],
      typistOffices: [],
      defaultValues: {
        defaultRegistrationOffice: "",
        defaultBookNumber: "",
        defaultTypist: "",
        defaultTypistOffice: "",
      },
    }
  }
}
