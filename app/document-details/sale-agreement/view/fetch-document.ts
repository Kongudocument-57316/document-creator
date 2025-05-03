import { getSupabaseServerClient } from "@/lib/supabase"

export async function fetchSaleAgreement(id: string) {
  try {
    const supabase = getSupabaseServerClient()

    // 1. Fetch the main sale agreement data
    const { data: agreementData, error: agreementError } = await supabase
      .from("sale_agreements")
      .select(`
        id,
        document_name,
        document_date,
        agreement_amount,
        agreement_amount_words,
        previous_document_date,
        document_year,
        document_number,
        document_content,
        agreement_terms,
        agreement_duration,
        agreement_start_date,
        agreement_end_date,
        created_at,
        updated_at,
        sub_registrar_office_id,
        book_number_id,
        document_type_id,
        submission_type_id,
        typist_id,
        typist_phone,
        office_id,
        land_types,
        value_types,
        payment_methods
      `)
      .eq("id", id)
      .single()

    if (agreementError) {
      console.error("Error fetching sale agreement:", agreementError)
      throw new Error(`ஆவணத்தை பெறுவதில் பிழை: ${agreementError.message}`)
    }

    if (!agreementData) {
      throw new Error("ஆவணம் கிடைக்கவில்லை")
    }

    // 2. Fetch related data for foreign keys
    // 2.1 Sub Registrar Office
    let subRegistrarOffice = null
    if (agreementData.sub_registrar_office_id) {
      const { data: officeData } = await supabase
        .from("sub_registrar_offices")
        .select("id, name")
        .eq("id", agreementData.sub_registrar_office_id)
        .single()

      subRegistrarOffice = officeData
    }

    // 2.2 Book Number
    let bookNumber = null
    if (agreementData.book_number_id) {
      const { data: bookData } = await supabase
        .from("book_numbers")
        .select("id, number")
        .eq("id", agreementData.book_number_id)
        .single()

      bookNumber = bookData
    }

    // 2.3 Document Type
    let documentType = null
    if (agreementData.document_type_id) {
      const { data: typeData } = await supabase
        .from("document_types")
        .select("id, name")
        .eq("id", agreementData.document_type_id)
        .single()

      documentType = typeData
    }

    // 2.4 Submission Type
    let submissionType = null
    if (agreementData.submission_type_id) {
      const { data: subTypeData } = await supabase
        .from("submission_types")
        .select("id, name")
        .eq("id", agreementData.submission_type_id)
        .single()

      submissionType = subTypeData
    }

    // 2.5 Typist
    let typist = null
    if (agreementData.typist_id) {
      const { data: typistData } = await supabase
        .from("typists")
        .select("id, name")
        .eq("id", agreementData.typist_id)
        .single()

      typist = typistData
    }

    // 2.6 Office
    let office = null
    if (agreementData.office_id) {
      const { data: officeData } = await supabase
        .from("offices")
        .select("id, name, phone")
        .eq("id", agreementData.office_id)
        .single()

      office = officeData
    }

    // 3. Fetch parties (buyers, sellers, witnesses)
    const { data: partiesData, error: partiesError } = await supabase
      .from("sale_agreement_parties")
      .select(`
        id,
        party_type,
        user_id,
        users:user_id (
          id, 
          name, 
          age, 
          gender,
          phone
        )
      `)
      .eq("sale_agreement_id", id)

    if (partiesError) {
      console.error("Error fetching parties:", partiesError)
    }

    // Group parties by type
    const buyers = partiesData?.filter((p) => p.party_type === "buyer") || []
    const sellers = partiesData?.filter((p) => p.party_type === "seller") || []
    const witnesses = partiesData?.filter((p) => p.party_type === "witness") || []

    // 4. Fetch properties
    const { data: propertiesData, error: propertiesError } = await supabase
      .from("sale_agreement_properties")
      .select(`
        id,
        property_details,
        property_id,
        properties:property_id (
          id,
          survey_number,
          land_area,
          land_type,
          address,
          village_id,
          villages:village_id (
            id,
            name,
            taluk_id,
            taluks:taluk_id (
              id,
              name,
              district_id,
              districts:district_id (
                id,
                name,
                state_id,
                states:state_id (
                  id,
                  name
                )
              )
            )
          )
        )
      `)
      .eq("sale_agreement_id", id)

    if (propertiesError) {
      console.error("Error fetching properties:", propertiesError)
    }

    // Return the complete document data
    return {
      ...agreementData,
      subRegistrarOffice,
      bookNumber,
      documentType,
      submissionType,
      typist,
      office,
      buyers,
      sellers,
      witnesses,
      properties: propertiesData || [],
    }
  } catch (error) {
    console.error("Error in fetchSaleAgreement:", error)
    throw error
  }
}
