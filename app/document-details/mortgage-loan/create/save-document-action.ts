"use server"

import { getSupabaseServerClient } from "@/lib/supabase"
import { revalidatePath } from "next/cache"
import type { MortgageLoanFormValues } from "@/types/mortgage-loan"

export async function saveMortgageLoanDocument(formData: MortgageLoanFormValues) {
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

    // First, create the main document record
    const documentData = {
      document_date: documentDate,

      // Loan details
      loan_amount: loanAmount,
      loan_amount_in_words: formData.loanAmountInWords,
      interest_rate: formData.interestRate,
      loan_start_date: loanStartDate,
      loan_duration: formData.loanDuration,
      loan_duration_type: formData.loanDurationType,

      // Property document details
      pr_document_date: prDocumentDate,
      sub_register_office: formData.subRegisterOffice,
      pr_book_no: formData.prBookNo,
      pr_document_year: formData.prDocumentYear,
      pr_document_no: formData.prDocumentNo,
      pr_document_type: formData.prDocumentType,

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

      // Status
      document_status: "completed",
      updated_at: new Date(),
    }

    // Insert the document into the database
    const { data, error } = await supabase.from("mortgage_loan_documents").insert(documentData).select("id").single()

    if (error) {
      console.error("Error saving mortgage loan document:", error)
      throw new Error(`ஆவணத்தை சேமிப்பதில் பிழை: ${error.message}`)
    }

    // Generate a document number based on the ID
    const documentId = data.id
    const documentNumber = `ML-${new Date().getFullYear()}-${documentId.toString().padStart(5, "0")}`

    // Update the document with the generated document number
    const { error: updateError } = await supabase
      .from("mortgage_loan_documents")
      .update({ document_number: documentNumber })
      .eq("id", documentId)

    if (updateError) {
      console.error("Error updating document number:", updateError)
      throw new Error(`ஆவண எண் புதுப்பிப்பதில் பிழை: ${updateError.message}`)
    }

    // Create mortgage_loan_buyers table if it doesn't exist

    // Types for multiple borrowers and lenders
    type Borrower = {
      name: string
      age: string
      relationsName: string
      relationType: string
      doorNo: string
      addressLine1: string
      addressLine2: string
      addressLine3: string
      taluk: string
      district: string
      pincode: string
      aadharNo: string
    }

    type Lender = {
      name: string
      age: string
      relationsName: string
      relationType: string
      doorNo: string
      addressLine1: string
      addressLine2: string
      addressLine3: string
      taluk: string
      district: string
      pincode: string
      aadharNo: string
    }
  } catch (error: any) {
    console.error("Error saving mortgage loan document:", error)
    throw new Error(`Mortgage Loan Document சேமிப்பதில் பிழை: ${error.message}`)
  } finally {
    revalidatePath("/document-details/mortgage-loan")
  }
}
