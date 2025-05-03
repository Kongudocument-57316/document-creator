"use server"

import { getSupabaseServerClient } from "@/lib/supabase"
import { revalidatePath } from "next/cache"
import type { SaleDeedFormData } from "@/types/sale-deed"

export async function saveSaleDeed(data: SaleDeedFormData) {
  try {
    const supabase = getSupabaseServerClient()

    // Validate required fields
    if (!data.documentName) {
      return { success: false, error: "ஆவணத்தின் பெயர் தேவை" }
    }

    // Format dates for database
    const formatDateForDB = (dateString: string | null) => {
      if (!dateString) return null
      const [day, month, year] = dateString.split("/")
      return `${year}-${month}-${day}`
    }

    // Insert into sale_deed_documents table
    const { data: documentData, error: documentError } = await supabase
      .from("sale_deed_documents")
      .insert({
        document_name: data.documentName,
        document_date: formatDateForDB(data.documentDate),
        sale_amount: data.saleAmount ? Number.parseFloat(data.saleAmount) : null,
        sale_amount_words: data.saleAmountWords,
        previous_document_date: formatDateForDB(data.previousDocumentDate),
        sub_registrar_office_id: data.subRegistrarOfficeId ? Number.parseInt(data.subRegistrarOfficeId) : null,
        book_number_id: data.bookNumberId ? Number.parseInt(data.bookNumberId) : null,
        document_year: data.documentYear,
        document_number: data.documentNumber,
        document_type_id: data.documentTypeId ? Number.parseInt(data.documentTypeId) : null,
        submission_type_id: data.submissionTypeId ? Number.parseInt(data.submissionTypeId) : null,
        typist_id: data.typistId ? Number.parseInt(data.typistId) : null,
        typist_phone: data.typistPhone,
        office_id: data.officeId ? Number.parseInt(data.officeId) : null,
        document_content: data.documentContent,
      })
      .select("id")
      .single()

    if (documentError) {
      console.error("Error inserting document:", documentError)
      return { success: false, error: documentError.message }
    }

    const documentId = documentData.id

    // Insert buyers
    if (data.buyers.length > 0) {
      const buyerRecords = data.buyers.map((userId) => ({
        sale_deed_id: documentId,
        user_id: userId,
        party_type: "buyer",
      }))

      const { error: buyersError } = await supabase.from("sale_deed_parties").insert(buyerRecords)

      if (buyersError) {
        console.error("Error inserting buyers:", buyersError)
        return { success: false, error: "வாங்குபவர்களை சேர்ப்பதில் பிழை: " + buyersError.message }
      }
    }

    // Insert sellers
    if (data.sellers.length > 0) {
      const sellerRecords = data.sellers.map((userId) => ({
        sale_deed_id: documentId,
        user_id: userId,
        party_type: "seller",
      }))

      const { error: sellersError } = await supabase.from("sale_deed_parties").insert(sellerRecords)

      if (sellersError) {
        console.error("Error inserting sellers:", sellersError)
        return { success: false, error: "விற்பவர்களை சேர்ப்பதில் பிழை: " + sellersError.message }
      }
    }

    // Insert witnesses
    if (data.witnesses.length > 0) {
      const witnessRecords = data.witnesses.map((userId) => ({
        sale_deed_id: documentId,
        user_id: userId,
        party_type: "witness",
      }))

      const { error: witnessesError } = await supabase.from("sale_deed_parties").insert(witnessRecords)

      if (witnessesError) {
        console.error("Error inserting witnesses:", witnessesError)
        return { success: false, error: "சாட்சிகளை சேர்ப்பதில் பிழை: " + witnessesError.message }
      }
    }

    // Insert properties
    if (data.properties.length > 0) {
      const propertyRecords = data.properties.map((propertyId, index) => ({
        sale_deed_id: documentId,
        property_id: propertyId,
        property_details: data.propertyDetails[index] || null,
      }))

      const { error: propertiesError } = await supabase.from("sale_deed_properties").insert(propertyRecords)

      if (propertiesError) {
        console.error("Error inserting properties:", propertiesError)
        return { success: false, error: "சொத்துக்களை சேர்ப்பதில் பிழை: " + propertiesError.message }
      }
    }

    // Insert land types
    if (data.landTypes.length > 0) {
      const landTypeRecords = data.landTypes.map((typeId) => ({
        sale_deed_id: documentId,
        land_type_id: Number.parseInt(typeId),
      }))

      const { error: landTypesError } = await supabase.from("sale_deed_land_types").insert(landTypeRecords)

      if (landTypesError) {
        console.error("Error inserting land types:", landTypesError)
        return { success: false, error: "நில வகைகளை சேர்ப்பதில் பிழை: " + landTypesError.message }
      }
    }

    // Insert value types
    if (data.valueTypes.length > 0) {
      const valueTypeRecords = data.valueTypes.map((typeId) => ({
        sale_deed_id: documentId,
        value_type_id: Number.parseInt(typeId),
      }))

      const { error: valueTypesError } = await supabase.from("sale_deed_value_types").insert(valueTypeRecords)

      if (valueTypesError) {
        console.error("Error inserting value types:", valueTypesError)
        return { success: false, error: "மதிப்பு வகைகளை சேர்ப்பதில் பிழை: " + valueTypesError.message }
      }
    }

    // Insert payment methods
    if (data.paymentMethods.length > 0) {
      const paymentMethodRecords = data.paymentMethods.map((methodId) => ({
        sale_deed_id: documentId,
        payment_method_id: Number.parseInt(methodId),
      }))

      const { error: paymentMethodsError } = await supabase
        .from("sale_deed_payment_methods")
        .insert(paymentMethodRecords)

      if (paymentMethodsError) {
        console.error("Error inserting payment methods:", paymentMethodsError)
        return { success: false, error: "பணம் செலுத்தும் முறைகளை சேர்ப்பதில் பிழை: " + paymentMethodsError.message }
      }
    }

    // Insert buildings
    if (data.buildings && data.buildings.length > 0) {
      const buildingRecords = data.buildings.map((building) => ({
        sale_deed_id: documentId,
        building_id: building.id,
        building_type: building.buildingType,
        facing_direction: building.facingDirection,
        total_sq_feet: Number.parseFloat(building.totalSqFeet),
        building_age: Number.parseInt(building.buildingAge),
        floors: Number.parseInt(building.floors || "1"),
        rooms: Number.parseInt(building.rooms || "1"),
        description: building.description,
      }))

      const { error: buildingsError } = await supabase.from("sale_deed_buildings").insert(buildingRecords)

      if (buildingsError) {
        console.error("Error inserting buildings:", buildingsError)
        return { success: false, error: "கட்டிடங்களை சேர்ப்பதில் பிழை: " + buildingsError.message }
      }
    }

    // Insert payment details if available
    if (data.paymentDetails && documentId) {
      const { error: paymentDetailsError } = await supabase.from("sale_deed_payment_details").insert({
        sale_deed_id: documentId,
        payment_method_id: data.paymentDetails.paymentMethodId
          ? Number.parseInt(data.paymentDetails.paymentMethodId)
          : null,
        buyer_bank_name: data.paymentDetails.buyerBankName,
        buyer_bank_branch: data.paymentDetails.buyerBankBranch,
        buyer_account_type: data.paymentDetails.buyerAccountType,
        buyer_account_number: data.paymentDetails.buyerAccountNumber,
        seller_bank_name: data.paymentDetails.sellerBankName,
        seller_bank_branch: data.paymentDetails.sellerBankBranch,
        seller_account_type: data.paymentDetails.sellerAccountType,
        seller_account_number: data.paymentDetails.sellerAccountNumber,
        transaction_number: data.paymentDetails.transactionNumber,
        transaction_date: formatDateForDB(data.paymentDetails.transactionDate),
        amount: data.paymentDetails.amount,
      })

      if (paymentDetailsError) {
        console.error("Error inserting payment details:", paymentDetailsError)
        return { success: false, error: "பணம் செலுத்தும் விவரங்களைச் சேர்ப்பதில் பிழை: " + paymentDetailsError.message }
      }
    }

    revalidatePath("/document-details/sale-deed/search")
    return { success: true, documentId }
  } catch (error: any) {
    console.error("Error saving document:", error)
    return { success: false, error: error.message }
  }
}
