"use server"

import { getSupabaseServerClient } from "@/lib/supabase"

export interface SearchParams {
  documentName?: string
  documentNumber?: string
  documentYear?: string
  fromDate?: string
  toDate?: string
  subRegistrarOfficeId?: number
  buyerName?: string
  sellerName?: string
  page?: number
  pageSize?: number
}

export interface SearchResult {
  id: number
  document_name: string
  document_date: string
  document_number: string | null
  document_year: string | null
  agreement_amount: number | null
  sub_registrar_office_name: string | null
  buyer_names: string[]
  seller_names: string[]
  created_at: string
}

export async function searchAgreements(params: SearchParams) {
  try {
    const {
      documentName,
      documentNumber,
      documentYear,
      fromDate,
      toDate,
      subRegistrarOfficeId,
      buyerName,
      sellerName,
      page = 1,
      pageSize = 10,
    } = params

    console.log("Search params:", params)

    // Get Supabase client
    const supabase = getSupabaseServerClient()

    // Check if the sale_agreements table exists using a direct query
    // instead of querying information_schema which might not be accessible
    try {
      // Try to get a single record from sale_agreements to check if it exists
      const { error: tableCheckError } = await supabase.from("sale_agreements").select("id").limit(1).single()

      // If we get a specific error about the relation not existing, the table doesn't exist
      if (
        tableCheckError &&
        tableCheckError.message.includes("relation") &&
        tableCheckError.message.includes("does not exist")
      ) {
        console.log("Table 'sale_agreements' does not exist")
        return { agreements: [], count: 0, error: "Sale agreements table does not exist yet" }
      }
    } catch (tableCheckError) {
      console.error("Error checking if table exists:", tableCheckError)
    }

    // Check if the table has any records
    const { count: recordCount, error: countError } = await supabase
      .from("sale_agreements")
      .select("*", { count: "exact", head: true })

    if (countError) {
      // If we get an error here, it's likely the table doesn't exist
      if (countError.message.includes("relation") && countError.message.includes("does not exist")) {
        console.log("Table 'sale_agreements' does not exist")
        return { agreements: [], count: 0, error: "Sale agreements table does not exist yet" }
      }

      console.error("Error counting records:", countError)
      return { agreements: [], count: 0, error: `Error counting records: ${countError.message}` }
    }

    console.log("Total records in sale_agreements:", recordCount)

    if (recordCount === 0) {
      return { agreements: [], count: 0, error: null }
    }

    // Calculate pagination
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    // Start building the query
    let query = supabase.from("sale_agreements").select(
      `
        id,
        document_name,
        document_date,
        document_number,
        document_year,
        agreement_amount,
        sub_registrar_office:sub_registrar_office_id(name),
        created_at
        `,
      { count: "exact" },
    )

    // Apply filters
    if (documentName) {
      query = query.ilike("document_name", `%${documentName}%`)
    }

    if (documentNumber) {
      query = query.ilike("document_number", `%${documentNumber}%`)
    }

    if (documentYear) {
      query = query.ilike("document_year", `%${documentYear}%`)
    }

    if (fromDate) {
      query = query.gte("document_date", fromDate)
    }

    if (toDate) {
      query = query.lte("document_date", toDate)
    }

    if (subRegistrarOfficeId) {
      query = query.eq("sub_registrar_office_id", subRegistrarOfficeId)
    }

    // Apply pagination
    query = query.range(from, to).order("created_at", { ascending: false })

    // Execute the query
    const { data: agreements, error: queryError, count } = await query

    if (queryError) {
      console.error("Error searching agreements:", queryError)
      return { agreements: [], count: 0, error: `Error searching agreements: ${queryError.message}` }
    }

    console.log(`Found ${agreements?.length || 0} agreements out of ${count} total`)

    // Check if sale_agreement_parties table exists
    let hasPartiesTable = true
    try {
      const { error: partiesCheckError } = await supabase.from("sale_agreement_parties").select("id").limit(1).single()

      if (
        partiesCheckError &&
        partiesCheckError.message.includes("relation") &&
        partiesCheckError.message.includes("does not exist")
      ) {
        console.log("Table 'sale_agreement_parties' does not exist")
        hasPartiesTable = false
      }
    } catch (partiesCheckError) {
      console.error("Error checking if parties table exists:", partiesCheckError)
      hasPartiesTable = false
    }

    // Process the results to get buyer and seller names
    const processedAgreements = await Promise.all(
      (agreements || []).map(async (agreement) => {
        let buyerNames: string[] = []
        let sellerNames: string[] = []

        // Only try to get party information if the table exists
        if (hasPartiesTable) {
          try {
            // Get buyers
            const { data: buyers, error: buyersError } = await supabase
              .from("sale_agreement_parties")
              .select("user:user_id(name)")
              .eq("sale_agreement_id", agreement.id)
              .eq("party_type", "buyer")

            if (buyersError) {
              console.error(`Error fetching buyers for agreement ${agreement.id}:`, buyersError)
            } else {
              buyerNames = buyers?.map((b) => b.user?.name || "").filter(Boolean) || []
            }

            // Get sellers
            const { data: sellers, error: sellersError } = await supabase
              .from("sale_agreement_parties")
              .select("user:user_id(name)")
              .eq("sale_agreement_id", agreement.id)
              .eq("party_type", "seller")

            if (sellersError) {
              console.error(`Error fetching sellers for agreement ${agreement.id}:`, sellersError)
            } else {
              sellerNames = sellers?.map((s) => s.user?.name || "").filter(Boolean) || []
            }
          } catch (error) {
            console.error(`Error processing parties for agreement ${agreement.id}:`, error)
          }
        }

        return {
          id: agreement.id,
          document_name: agreement.document_name,
          document_date: agreement.document_date,
          document_number: agreement.document_number,
          document_year: agreement.document_year,
          agreement_amount: agreement.agreement_amount,
          sub_registrar_office_name: agreement.sub_registrar_office?.name || null,
          buyer_names: buyerNames,
          seller_names: sellerNames,
          created_at: agreement.created_at,
        }
      }),
    )

    // Filter by buyer or seller name if provided
    let filteredAgreements = processedAgreements

    if (buyerName && hasPartiesTable) {
      filteredAgreements = filteredAgreements.filter((agreement) =>
        agreement.buyer_names.some((name) => name.toLowerCase().includes(buyerName.toLowerCase())),
      )
    }

    if (sellerName && hasPartiesTable) {
      filteredAgreements = filteredAgreements.filter((agreement) =>
        agreement.seller_names.some((name) => name.toLowerCase().includes(sellerName.toLowerCase())),
      )
    }

    return {
      agreements: filteredAgreements,
      count: count || 0,
      error: null,
    }
  } catch (error) {
    console.error("Error in searchAgreements:", error)
    return {
      agreements: [],
      count: 0,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

export async function deleteAgreement(id: number) {
  try {
    const supabase = getSupabaseServerClient()

    // Check if the sale_agreements table exists by trying to query it
    try {
      const { error: checkError } = await supabase.from("sale_agreements").select("id").eq("id", id).single()

      if (checkError && checkError.message.includes("relation") && checkError.message.includes("does not exist")) {
        return { success: false, error: "Table 'sale_agreements' does not exist" }
      }
    } catch (checkError) {
      console.error("Error checking if table exists:", checkError)
      return { success: false, error: "Error checking if table exists" }
    }

    const { error } = await supabase.from("sale_agreements").delete().eq("id", id)

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, error: null }
  } catch (error) {
    console.error("Error deleting agreement:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}
