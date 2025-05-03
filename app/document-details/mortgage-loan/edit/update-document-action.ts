"use server"

import { getSupabaseServerClient } from "@/lib/supabase"
import { revalidatePath } from "next/cache"
import type { MortgageLoanFormValues } from "../create/enhanced-mortgage-loan-form"

export async function updateMortgageLoanDocument(documentId: number, formData: MortgageLoanFormValues) {
  try {
    const supabase = getSupabaseServerClient()

    // Parse date strings to proper format for database
    const documentDate = formData.documentDate ? new Date(formData.documentDate.split("/").reverse().join("-")) : null
    const prDocumentDate = formData.prDocumentDate
      ? new Date(formData.prDocumentDate.split("/").reverse().join("-"))
      : null
    const loanStartDate = formData.loanStartDate
      ? new Date(formData.loanStartDate.split("/").reverse().join("-"))
      : null

    // Parse loan amount to decimal
    const loanAmount = formData.loanAmount ? Number.parseFloat(formData.loanAmount.replace(/,/g, "")) : null

    // Prepare data for update
    const documentData = {
      document_date: documentDate,

      // Buyer details
      buyer_name: formData.buyerName,
      buyer_age: formData.buyerAge,
      buyer_relations_name: formData.buyerRelationsName,
      buyer_relation_type: formData.buyerRelationType,
      buyer_door_no: formData.buyerDoorNo,
      buyer_address_line1: formData.buyerAddressLine1,
      buyer_address_line2: formData.buyerAddressLine2,
      buyer_address_line3: formData.buyerAddressLine3,
      buyer_taluk: formData.buyerTaluk,
      buyer_district: formData.buyerDistrict,
      buyer_pincode: formData.buyerPincode,
      buyer_aadhar_no: formData.buyerAadharNo,
      buyer_phone_no: formData.buyerPhoneNo,

      // Seller details
      seller_name: formData.sellerName,
      seller_age: formData.sellerAge,
      seller_relations_name: formData.sellerRelationsName,
      seller_relation_type: formData.sellerRelationType,
      seller_door_no: formData.sellerDoorNo,
      seller_address_line1: formData.sellerAddressLine1,
      seller_address_line2: formData.sellerAddressLine2,
      seller_address_line3: formData.sellerAddressLine3,
      seller_taluk: formData.sellerTaluk,
      seller_district: formData.sellerDistrict,
      seller_pincode: formData.sellerPincode,
      seller_aadhar_no: formData.sellerAadharNo,
      seller_phone_no: formData.sellerPhoneNo,

      // Property document details
      pr_document_date: prDocumentDate,
      sub_register_office: formData.subRegisterOffice,
      pr_book_no: formData.prBookNo,
      pr_document_year: formData.prDocumentYear,
      pr_document_no: formData.prDocumentNo,
      pr_document_type: formData.prDocumentType,

      // Loan details
      loan_amount: loanAmount,
      loan_amount_in_words: formData.loanAmountInWords,
      interest_rate: formData.interestRate,
      loan_start_date: loanStartDate,
      loan_duration: formData.loanDuration,
      loan_duration_type: formData.loanDurationType,

      // Property details
      property_details: formData.propertyDetails,

      // Witness 1 details
      witness1_name: formData.witness1Name,
      witness1_age: formData.witness1Age,
      witness1_relations_name: formData.witness1RelationsName,
      witness1_relation_type: formData.witness1RelationType,
      witness1_door_no: formData.witness1DoorNo,
      witness1_address_line1: formData.witness1AddressLine1,
      witness1_address_line2: formData.witness1AddressLine2,
      witness1_address_line3: formData.witness1AddressLine3,
      witness1_taluk: formData.witness1Taluk,
      witness1_district: formData.witness1District,
      witness1_pincode: formData.witness1Pincode,
      witness1_aadhar_no: formData.witness1AadharNo,

      // Witness 2 details
      witness2_name: formData.witness2Name,
      witness2_age: formData.witness2Age,
      witness2_relations_name: formData.witness2RelationsName,
      witness2_relation_type: formData.witness2RelationType,
      witness2_door_no: formData.witness2DoorNo,
      witness2_address_line1: formData.witness2AddressLine1,
      witness2_address_line2: formData.witness2AddressLine2,
      witness2_address_line3: formData.witness2AddressLine3,
      witness2_taluk: formData.witness2Taluk,
      witness2_district: formData.witness2District,
      witness2_pincode: formData.witness2Pincode,
      witness2_aadhar_no: formData.witness2AadharNo,

      // Typist details
      typist_name: formData.typistName,
      typist_office_name: formData.typistOfficeName,
      typist_phone_no: formData.typistPhoneNo,

      // Update timestamp
      updated_at: new Date(),
    }

    // Update the document in the database
    const { error } = await supabase.from("mortgage_loan_documents").update(documentData).eq("id", documentId)

    if (error) {
      console.error("Error updating mortgage loan document:", error)
      throw new Error(`ஆவணத்தை புதுப்பிப்பதில் பிழை: ${error.message}`)
    }

    // Revalidate the path to update the UI
    revalidatePath("/document-details/mortgage-loan")
    revalidatePath(`/document-details/mortgage-loan/view/${documentId}`)
    revalidatePath(`/document-details/mortgage-loan/edit/${documentId}`)

    return { success: true, documentId }
  } catch (error: any) {
    console.error("Update document error:", error)
    return { success: false, error: error.message }
  }
}
