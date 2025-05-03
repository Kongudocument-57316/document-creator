"use server"

import { getSupabaseServerClient } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

export interface SaleDocumentData {
  id: number
  documentName: string
  documentDate: string | null
  saleAmount: string | null
  saleAmountWords: string | null
  previousDocumentDate: string | null
  subRegistrarOfficeId: string | null
  bookNumberId: string | null
  documentYear: string | null
  documentNumber: string | null
  documentTypeId: string | null
  submissionTypeId: string | null
  typistId: string | null
  typistPhone: string | null
  officeId: string | null
  landTypes: string[]
  valueTypes: string[]
  paymentMethods: string[]
  documentContent: string
  buyers: number[]
  sellers: number[]
  witnesses: number[]
  properties: number[]
  propertyDetails: string[]
  docxData?: Uint8Array | null
}

export async function updateDocument(data: SaleDocumentData) {
  try {
    const supabase = getSupabaseServerClient()

    // Format dates for database
    const formatDateForDB = (dateString: string | null) => {
      if (!dateString) return null
      const [day, month, year] = dateString.split("/")
      return `${year}-${month}-${day}`
    }

    // Update sale_documents table
    const { error: documentError } = await supabase
      .from("sale_documents")
      .update({
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
        land_types: data.landTypes,
        value_types: data.valueTypes,
        payment_methods: data.paymentMethods,
        document_content: data.documentContent,
        docx_data: data.docxData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", data.id)

    if (documentError) {
      throw documentError
    }

    // Delete existing parties and properties to replace with new ones
    const { error: deletePartiesError } = await supabase
      .from("sale_document_parties")
      .delete()
      .eq("sale_document_id", data.id)

    if (deletePartiesError) {
      throw deletePartiesError
    }

    const { error: deletePropertiesError } = await supabase
      .from("sale_document_properties")
      .delete()
      .eq("sale_document_id", data.id)

    if (deletePropertiesError) {
      throw deletePropertiesError
    }

    // Insert buyers
    if (data.buyers.length > 0) {
      const buyerRecords = data.buyers.map((userId) => ({
        sale_document_id: data.id,
        user_id: userId,
        party_type: "buyer",
      }))

      const { error: buyersError } = await supabase.from("sale_document_parties").insert(buyerRecords)

      if (buyersError) {
        throw buyersError
      }
    }

    // Insert sellers
    if (data.sellers.length > 0) {
      const sellerRecords = data.sellers.map((userId) => ({
        sale_document_id: data.id,
        user_id: userId,
        party_type: "seller",
      }))

      const { error: sellersError } = await supabase.from("sale_document_parties").insert(sellerRecords)

      if (sellersError) {
        throw sellersError
      }
    }

    // Insert witnesses
    if (data.witnesses.length > 0) {
      const witnessRecords = data.witnesses.map((userId) => ({
        sale_document_id: data.id,
        user_id: userId,
        party_type: "witness",
      }))

      const { error: witnessesError } = await supabase.from("sale_document_parties").insert(witnessRecords)

      if (witnessesError) {
        throw witnessesError
      }
    }

    // Insert properties
    if (data.properties.length > 0) {
      const propertyRecords = data.properties.map((propertyId, index) => ({
        sale_document_id: data.id,
        property_id: propertyId,
        property_details: data.propertyDetails[index] || null,
      }))

      const { error: propertiesError } = await supabase.from("sale_document_properties").insert(propertyRecords)

      if (propertiesError) {
        throw propertiesError
      }
    }

    revalidatePath("/document-details/sale-document/search")
    revalidatePath(`/document-details/sale-document/view/${data.id}`)
    return { success: true, documentId: data.id }
  } catch (error: any) {
    console.error("Error updating document:", error)
    return { success: false, error: error.message }
  }
}
