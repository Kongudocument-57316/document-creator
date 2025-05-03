"use server"

import { getSupabaseServerClient } from "@/lib/supabase"

export interface SaleDocumentSearchFilters {
  documentName?: string
  documentDateFrom?: string
  documentDateTo?: string
  buyerName?: string
  sellerName?: string
  propertyName?: string
  registrationDistrictId?: string
  subRegistrarOfficeId?: string
  // புதிய வடிகட்டிகள்
  saleAmountFrom?: string
  saleAmountTo?: string
  documentTypeId?: string
  bookNumberId?: string
  documentNumber?: string
  documentYear?: string
  typistId?: string
  landTypeId?: string
  surveyNumber?: string
}

export async function searchDocuments(filters: SaleDocumentSearchFilters) {
  try {
    const supabase = getSupabaseServerClient()

    // Format dates for database
    const formatDateForDB = (dateString: string | null) => {
      if (!dateString) return null
      const [day, month, year] = dateString.split("/")
      return `${year}-${month}-${day}`
    }

    // Start with the base query
    let query = supabase
      .from("sale_documents")
      .select(`
        *,
        sub_registrar_offices:sub_registrar_office_id (name),
        book_numbers:book_number_id (number),
        document_types:document_type_id (name),
        submission_types:submission_type_id (name),
        typists:typist_id (name),
        offices:office_id (name)
      `)
      .order("created_at", { ascending: false })

    // Apply filters
    if (filters.documentName) {
      query = query.ilike("document_name", `%${filters.documentName}%`)
    }

    if (filters.documentDateFrom) {
      query = query.gte("document_date", formatDateForDB(filters.documentDateFrom))
    }

    if (filters.documentDateTo) {
      query = query.lte("document_date", formatDateForDB(filters.documentDateTo))
    }

    if (filters.registrationDistrictId && filters.registrationDistrictId !== "all") {
      // This requires a join with sub_registrar_offices
      query = query.eq("sub_registrar_offices.registration_district_id", filters.registrationDistrictId)
    }

    if (filters.subRegistrarOfficeId && filters.subRegistrarOfficeId !== "all") {
      query = query.eq("sub_registrar_office_id", filters.subRegistrarOfficeId)
    }

    // புதிய வடிகட்டிகள்
    if (filters.saleAmountFrom) {
      query = query.gte("sale_amount", filters.saleAmountFrom)
    }

    if (filters.saleAmountTo) {
      query = query.lte("sale_amount", filters.saleAmountTo)
    }

    if (filters.documentTypeId && filters.documentTypeId !== "all") {
      query = query.eq("document_type_id", filters.documentTypeId)
    }

    if (filters.bookNumberId && filters.bookNumberId !== "all") {
      query = query.eq("book_number_id", filters.bookNumberId)
    }

    if (filters.documentNumber) {
      query = query.eq("document_number", filters.documentNumber)
    }

    if (filters.documentYear) {
      query = query.eq("document_year", filters.documentYear)
    }

    if (filters.typistId && filters.typistId !== "all") {
      query = query.eq("typist_id", filters.typistId)
    }

    // Execute the query
    const { data, error } = await query

    if (error) {
      throw error
    }

    // For each document, fetch related parties (buyers, sellers)
    const documentsWithParties = await Promise.all(
      data.map(async (doc) => {
        // Fetch buyers and sellers
        const { data: parties, error: partiesError } = await supabase
          .from("sale_document_parties")
          .select(`
            party_type,
            users:user_id (id, name, phone)
          `)
          .eq("sale_document_id", doc.id)

        if (partiesError) {
          console.error("Error fetching parties:", partiesError)
          return { ...doc, buyers: [], sellers: [], witnesses: [] }
        }

        // Group parties by type
        const buyers = parties?.filter((p) => p.party_type === "buyer").map((p) => p.users) || []
        const sellers = parties?.filter((p) => p.party_type === "seller").map((p) => p.users) || []
        const witnesses = parties?.filter((p) => p.party_type === "witness").map((p) => p.users) || []

        // Apply buyer/seller name filters if provided
        if (filters.buyerName && !buyers.some((b) => b.name.toLowerCase().includes(filters.buyerName!.toLowerCase()))) {
          return null
        }

        if (
          filters.sellerName &&
          !sellers.some((s) => s.name.toLowerCase().includes(filters.sellerName!.toLowerCase()))
        ) {
          return null
        }

        // Fetch properties for this document
        const { data: properties, error: propertiesError } = await supabase
          .from("sale_document_properties")
          .select(`
            properties:property_id (id, property_name, survey_number)
          `)
          .eq("sale_document_id", doc.id)

        if (propertiesError) {
          console.error("Error fetching properties:", propertiesError)
          return { ...doc, buyers, sellers, witnesses, properties: [] }
        }

        const docProperties = properties?.map((p) => p.properties) || []

        // Apply property filters if provided
        if (
          filters.propertyName &&
          !docProperties.some((p) => p.property_name.toLowerCase().includes(filters.propertyName!.toLowerCase()))
        ) {
          return null
        }

        // Apply survey number filter if provided
        if (
          filters.surveyNumber &&
          !docProperties.some(
            (p) => p.survey_number && p.survey_number.toLowerCase().includes(filters.surveyNumber!.toLowerCase()),
          )
        ) {
          return null
        }

        // Check if land types table exists and fetch land types for this document
        let docLandTypes: string[] = []
        try {
          const { data: landTypes, error: landTypesError } = await supabase
            .from("sale_document_land_types")
            .select(`land_type_id`)
            .eq("sale_document_id", doc.id)

          if (!landTypesError) {
            docLandTypes = landTypes?.map((lt) => lt.land_type_id.toString()) || []
          }
        } catch (error) {
          console.log("Land types table might not exist, skipping land type filtering")
        }

        // Apply land type filter if provided and if we have land types data
        if (
          filters.landTypeId &&
          filters.landTypeId !== "all" &&
          docLandTypes.length > 0 &&
          !docLandTypes.includes(filters.landTypeId)
        ) {
          return null
        }

        return {
          ...doc,
          buyers,
          sellers,
          witnesses,
          properties: docProperties,
          landTypes: docLandTypes,
        }
      }),
    )

    // Filter out null results (from buyer/seller name filters)
    const filteredDocuments = documentsWithParties.filter(Boolean)

    return { success: true, documents: filteredDocuments }
  } catch (error: any) {
    console.error("Error searching documents:", error)
    return { success: false, error: error.message, documents: [] }
  }
}

export async function deleteDocument(documentId: number) {
  try {
    const supabase = getSupabaseServerClient()

    // Delete the document (cascade will handle related records)
    const { error } = await supabase.from("sale_documents").delete().eq("id", documentId)

    if (error) {
      throw error
    }

    return { success: true }
  } catch (error: any) {
    console.error("Error deleting document:", error)
    return { success: false, error: error.message }
  }
}
