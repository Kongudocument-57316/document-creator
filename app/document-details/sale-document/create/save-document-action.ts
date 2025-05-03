"use server"

import { getSupabaseServerClient } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

export interface SaleDocumentData {
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
  buildings?: any[] // கட்டிட விவரங்கள்
  paymentDetails?: {
    paymentMethodId: string
    buyerBankName: string
    buyerBankBranch: string
    buyerAccountType: string
    buyerAccountNumber: string
    sellerBankName: string
    sellerBankBranch: string
    sellerAccountType: string
    sellerAccountNumber: string
    transactionNumber: string
    transactionDate: string | null
    amount: number | null
  } | null
}

export async function saveDocument(data: SaleDocumentData) {
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

    // Insert into sale_documents table
    const { data: documentData, error: documentError } = await supabase
      .from("sale_documents")
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
        land_types: data.landTypes,
        value_types: data.valueTypes,
        payment_methods: data.paymentMethods,
        document_content: data.documentContent,
        docx_data: data.docxData,
        buildings: data.buildings || [],
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
        sale_document_id: documentId,
        user_id: userId,
        party_type: "buyer",
      }))

      const { error: buyersError } = await supabase.from("sale_document_parties").insert(buyerRecords)

      if (buyersError) {
        console.error("Error inserting buyers:", buyersError)
        return { success: false, error: "வாங்குபவர்களை சேர்ப்பதில் பிழை: " + buyersError.message }
      }
    }

    // Insert sellers
    if (data.sellers.length > 0) {
      const sellerRecords = data.sellers.map((userId) => ({
        sale_document_id: documentId,
        user_id: userId,
        party_type: "seller",
      }))

      const { error: sellersError } = await supabase.from("sale_document_parties").insert(sellerRecords)

      if (sellersError) {
        console.error("Error inserting sellers:", sellersError)
        return { success: false, error: "விற்பவர்களை சேர்ப்பதில் பிழை: " + sellersError.message }
      }
    }

    // Insert witnesses
    if (data.witnesses.length > 0) {
      const witnessRecords = data.witnesses.map((userId) => ({
        sale_document_id: documentId,
        user_id: userId,
        party_type: "witness",
      }))

      const { error: witnessesError } = await supabase.from("sale_document_parties").insert(witnessRecords)

      if (witnessesError) {
        console.error("Error inserting witnesses:", witnessesError)
        return { success: false, error: "சாட்சிகளை சேர்ப்பதில் பிழை: " + witnessesError.message }
      }
    }

    // Insert properties
    if (data.properties.length > 0) {
      const propertyRecords = data.properties.map((propertyId, index) => ({
        sale_document_id: documentId,
        property_id: propertyId,
        property_details: data.propertyDetails[index] || null,
      }))

      const { error: propertiesError } = await supabase.from("sale_document_properties").insert(propertyRecords)

      if (propertiesError) {
        console.error("Error inserting properties:", propertiesError)
        return { success: false, error: "சொத்துக்களை சேர்ப்பதில் பிழை: " + propertiesError.message }
      }
    }

    // Insert payment details if available
    if (data.paymentDetails && documentId) {
      const { error: paymentDetailsError } = await supabase.from("payment_details").insert({
        sale_document_id: documentId,
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
        transaction_date: data.paymentDetails.transactionDate,
        amount: data.paymentDetails.amount,
      })

      if (paymentDetailsError) {
        console.error("Error inserting payment details:", paymentDetailsError)
        return { success: false, error: "பணம் செலுத்தும் விவரங்களைச் சேர்ப்பதில் பிழை: " + paymentDetailsError.message }
      }
    }

    revalidatePath("/document-details/sale-document/search")
    return { success: true, documentId }
  } catch (error: any) {
    console.error("Error saving document:", error)
    return { success: false, error: error.message }
  }
}
