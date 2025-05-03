"use server"

import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"

export async function saveMortgageLoanReceipt(formData: any) {
  try {
    const supabase = createServerActionClient({ cookies })

    // Generate a receipt number
    const receiptNumber = `MLR-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)
      .toString()
      .padStart(5, "0")}`

    // Insert the receipt into the database
    const { data, error } = await supabase
      .from("mortgage_loan_receipts")
      .insert({
        receipt_number: receiptNumber,
        receipt_date: formData.receiptDate,
        mortgage_loan_document_id: formData.mortgageLoanDocumentId || null,

        // Payment details
        amount_paid: Number.parseFloat(formData.loanAmount.replace(/[^0-9.]/g, "") || "0"),
        amount_paid_in_words: formData.loanAmountInWords,

        // Payer details (buyer)
        payer_name: formData.buyerName,
        payer_age: formData.buyerAge,
        payer_relation_type: formData.buyerRelationshipType,
        payer_relations_name: formData.buyerRelationsName,
        payer_door_no: formData.buyerDoorNo,
        payer_address_line1: formData.buyerAddressLine1,
        payer_address_line2: formData.buyerAddressLine2,
        payer_address_line3: formData.buyerAddressLine3,
        payer_taluk: formData.buyerTaluk,
        payer_district: formData.buyerDistrict,
        payer_pincode: formData.buyerPincode,
        payer_aadhar_no: formData.buyerAadharNo,
        payer_phone_no: formData.buyerPhoneNo,

        // Receiver details (seller)
        receiver_name: formData.sellerName,
        receiver_age: formData.sellerAge,
        receiver_relation_type: formData.sellerRelationshipType,
        receiver_relations_name: formData.sellerRelationsName,
        receiver_door_no: formData.sellerDoorNo,
        receiver_address_line1: formData.sellerAddressLine1,
        receiver_address_line2: formData.sellerAddressLine2,
        receiver_address_line3: formData.sellerAddressLine3,
        receiver_taluk: formData.sellerTaluk,
        receiver_district: formData.sellerDistrict,
        receiver_pincode: formData.sellerPincode,
        receiver_aadhar_no: formData.sellerAadharNo,
        receiver_phone_no: formData.sellerPhoneNo,

        // Document details
        document_date: formData.documentDate,
        sub_registrar_office: formData.subRegistrarOffice,
        pr_book_no: formData.prBookNo,
        pr_document_year: formData.prDocumentYear,
        pr_document_no: formData.prDocumentNo,
        property_details: formData.propertyDetails,

        // Witness 1 details
        witness1_name: formData.witness1Name,
        witness1_age: formData.witness1Age,
        witness1_relation_type: formData.witness1RelationshipType,
        witness1_relations_name: formData.witness1RelationsName,
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
        witness2_relation_type: formData.witness2RelationshipType,
        witness2_relations_name: formData.witness2RelationsName,
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
      })
      .select()
      .single()

    if (error) {
      console.error("Error saving mortgage loan receipt:", error)
      return { success: false, error: error.message }
    }

    // Revalidate the path to update the UI
    revalidatePath("/document-details/mortgage-loan/receipt")

    return { success: true, data }
  } catch (error: any) {
    console.error("Error in saveMortgageLoanReceipt:", error)
    return { success: false, error: error.message || "An error occurred while saving the receipt" }
  }
}
