import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase"

// GET - Fetch a single sale agreement by ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = getSupabaseServerClient()
    const { id } = params

    // Fetch the main sale agreement data
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
      return NextResponse.json({ error: `ஆவணத்தை பெறுவதில் பிழை: ${agreementError.message}` }, { status: 500 })
    }

    if (!agreementData) {
      return NextResponse.json({ error: "ஆவணம் கிடைக்கவில்லை" }, { status: 404 })
    }

    // Fetch related data for foreign keys
    // Sub Registrar Office
    let subRegistrarOffice = null
    if (agreementData.sub_registrar_office_id) {
      const { data: officeData } = await supabase
        .from("sub_registrar_offices")
        .select("id, name")
        .eq("id", agreementData.sub_registrar_office_id)
        .single()

      subRegistrarOffice = officeData
    }

    // Book Number
    let bookNumber = null
    if (agreementData.book_number_id) {
      const { data: bookData } = await supabase
        .from("book_numbers")
        .select("id, number")
        .eq("id", agreementData.book_number_id)
        .single()

      bookNumber = bookData
    }

    // Document Type
    let documentType = null
    if (agreementData.document_type_id) {
      const { data: typeData } = await supabase
        .from("document_types")
        .select("id, name")
        .eq("id", agreementData.document_type_id)
        .single()

      documentType = typeData
    }

    // Submission Type
    let submissionType = null
    if (agreementData.submission_type_id) {
      const { data: subTypeData } = await supabase
        .from("submission_types")
        .select("id, name")
        .eq("id", agreementData.submission_type_id)
        .single()

      submissionType = subTypeData
    }

    // Typist
    let typist = null
    if (agreementData.typist_id) {
      const { data: typistData } = await supabase
        .from("typists")
        .select("id, name")
        .eq("id", agreementData.typist_id)
        .single()

      typist = typistData
    }

    // Office
    let office = null
    if (agreementData.office_id) {
      const { data: officeData } = await supabase
        .from("offices")
        .select("id, name, phone")
        .eq("id", agreementData.office_id)
        .single()

      office = officeData
    }

    // Fetch parties (buyers, sellers, witnesses)
    const { data: partiesData, error: partiesError } = await supabase
      .from("sale_agreement_parties")
      .select(`
        id,
        party_type,
        user_id,
        users:user_id (
          id, 
          name, 
          father_name, 
          age, 
          gender, 
          address, 
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

    // Fetch properties
    const { data: propertiesData, error: propertiesError } = await supabase
      .from("sale_agreement_properties")
      .select(`
        id,
        property_details,
        property_id,
        properties:property_id (
          id,
          survey_number,
          sub_division_number,
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
    return NextResponse.json({
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
    })
  } catch (error) {
    console.error("Error in GET sale agreement:", error)
    return NextResponse.json({ error: "ஆவணத்தை பெறுவதில் பிழை ஏற்பட்டது" }, { status: 500 })
  }
}

// DELETE - Delete a sale agreement by ID
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = getSupabaseServerClient()
    const { id } = params

    // First delete related records from sale_agreement_parties
    const { error: partiesError } = await supabase.from("sale_agreement_parties").delete().eq("sale_agreement_id", id)

    if (partiesError) {
      console.error("Error deleting parties:", partiesError)
      return NextResponse.json({ error: `கட்சிகளை நீக்குவதில் பிழை: ${partiesError.message}` }, { status: 500 })
    }

    // Then delete related records from sale_agreement_properties
    const { error: propertiesError } = await supabase
      .from("sale_agreement_properties")
      .delete()
      .eq("sale_agreement_id", id)

    if (propertiesError) {
      console.error("Error deleting properties:", propertiesError)
      return NextResponse.json({ error: `சொத்துக்களை நீக்குவதில் பிழை: ${propertiesError.message}` }, { status: 500 })
    }

    // Finally delete the main sale agreement record
    const { error: agreementError } = await supabase.from("sale_agreements").delete().eq("id", id)

    if (agreementError) {
      console.error("Error deleting agreement:", agreementError)
      return NextResponse.json({ error: `ஆவணத்தை நீக்குவதில் பிழை: ${agreementError.message}` }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "ஆவணம் வெற்றிகரமாக நீக்கப்பட்டது" })
  } catch (error) {
    console.error("Error in DELETE sale agreement:", error)
    return NextResponse.json({ error: "ஆவணத்தை நீக்குவதில் பிழை ஏற்பட்டது" }, { status: 500 })
  }
}
