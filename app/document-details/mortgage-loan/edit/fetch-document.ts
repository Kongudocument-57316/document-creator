"use client"

import type { MortgageLoanFormValues } from "../create/enhanced-mortgage-loan-form"

export async function fetchMortgageLoanDocument(id: string): Promise<MortgageLoanFormValues | null> {
  try {
    const response = await fetch(`/api/mortgage-loan-documents/${id}`)

    if (!response.ok) {
      throw new Error("Failed to fetch document")
    }

    const data = await response.json()

    // Format dates from ISO to DD/MM/YYYY
    const formatDate = (dateString: string | null) => {
      if (!dateString) return ""
      const date = new Date(dateString)
      return date.toLocaleDateString("en-GB") // DD/MM/YYYY format
    }

    // Convert database fields to form values
    return {
      // Document date
      documentDate: formatDate(data.document_date),

      // Buyer details
      buyerName: data.buyer_name || "",
      buyerAge: data.buyer_age || "",
      buyerRelationsName: data.buyer_relations_name || "",
      buyerRelationType: data.buyer_relation_type || "",
      buyerDoorNo: data.buyer_door_no || "",
      buyerAddressLine1: data.buyer_address_line1 || "",
      buyerAddressLine2: data.buyer_address_line2 || "",
      buyerAddressLine3: data.buyer_address_line3 || "",
      buyerTaluk: data.buyer_taluk || "",
      buyerDistrict: data.buyer_district || "",
      buyerPincode: data.buyer_pincode || "",
      buyerAadharNo: data.buyer_aadhar_no || "",
      buyerPhoneNo: data.buyer_phone_no || "",

      // Seller details
      sellerName: data.seller_name || "",
      sellerAge: data.seller_age || "",
      sellerRelationsName: data.seller_relations_name || "",
      sellerRelationType: data.seller_relation_type || "",
      sellerDoorNo: data.seller_door_no || "",
      sellerAddressLine1: data.seller_address_line1 || "",
      sellerAddressLine2: data.seller_address_line2 || "",
      sellerAddressLine3: data.seller_address_line3 || "",
      sellerTaluk: data.seller_taluk || "",
      sellerDistrict: data.seller_district || "",
      sellerPincode: data.seller_pincode || "",
      sellerAadharNo: data.seller_aadhar_no || "",
      sellerPhoneNo: data.seller_phone_no || "",

      // Property document details
      prDocumentDate: formatDate(data.pr_document_date),
      subRegisterOffice: data.sub_register_office || "",
      prBookNo: data.pr_book_no || "",
      prDocumentYear: data.pr_document_year || "",
      prDocumentNo: data.pr_document_no || "",
      prDocumentType: data.pr_document_type || "",

      // Loan details
      loanAmount: data.loan_amount ? data.loan_amount.toString() : "",
      loanAmountInWords: data.loan_amount_in_words || "",
      interestRate: data.interest_rate || "",
      loanStartDate: formatDate(data.loan_start_date),
      loanDuration: data.loan_duration || "",
      loanDurationType: data.loan_duration_type || "மாதங்களுக்குள்",

      // Property details
      propertyDetails: data.property_details || "",

      // Witness 1 details
      witness1Name: data.witness1_name || "",
      witness1Age: data.witness1_age || "",
      witness1RelationsName: data.witness1_relations_name || "",
      witness1RelationType: data.witness1_relation_type || "",
      witness1DoorNo: data.witness1_door_no || "",
      witness1AddressLine1: data.witness1_address_line1 || "",
      witness1AddressLine2: data.witness1_address_line2 || "",
      witness1AddressLine3: data.witness1_address_line3 || "",
      witness1Taluk: data.witness1_taluk || "",
      witness1District: data.witness1_district || "",
      witness1Pincode: data.witness1_pincode || "",
      witness1AadharNo: data.witness1_aadhar_no || "",

      // Witness 2 details
      witness2Name: data.witness2_name || "",
      witness2Age: data.witness2_age || "",
      witness2RelationsName: data.witness2_relations_name || "",
      witness2RelationType: data.witness2_relation_type || "",
      witness2DoorNo: data.witness2_door_no || "",
      witness2AddressLine1: data.witness2_address_line1 || "",
      witness2AddressLine2: data.witness2_address_line2 || "",
      witness2AddressLine3: data.witness2_address_line3 || "",
      witness2Taluk: data.witness2_taluk || "",
      witness2District: data.witness2_district || "",
      witness2Pincode: data.witness2_pincode || "",
      witness2AadharNo: data.witness2_aadhar_no || "",

      // Typist details
      typistName: data.typist_name || "",
      typistOfficeName: data.typist_office_name || "",
      typistPhoneNo: data.typist_phone_no || "",
    }
  } catch (error) {
    console.error("Error fetching mortgage loan document:", error)
    return null
  }
}
