import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const body = await request.json()

    // Generate a receipt number
    const receiptNumber = `MLR-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)
      .toString()
      .padStart(5, "0")}`

    // Insert the receipt into the database
    const { data, error } = await supabase
      .from("mortgage_loan_receipts")
      .insert({
        receipt_number: receiptNumber,
        receipt_date: body.receiptDate,
        mortgage_loan_document_id: body.mortgageLoanDocumentId || null,

        // Payment details
        amount_paid: Number.parseFloat(body.loanAmount.replace(/[^0-9.]/g, "") || "0"),
        amount_paid_in_words: body.loanAmountInWords,

        // Payer details (buyer)
        payer_name: body.buyerName,
        payer_age: body.buyerAge,
        payer_relation_type: body.buyerRelationshipType,
        payer_relations_name: body.buyerRelationsName,
        payer_door_no: body.buyerDoorNo,
        payer_address_line1: body.buyerAddressLine1,
        payer_address_line2: body.buyerAddressLine2,
        payer_address_line3: body.buyerAddressLine3,
        payer_taluk: body.buyerTaluk,
        payer_district: body.buyerDistrict,
        payer_pincode: body.buyerPincode,
        payer_aadhar_no: body.buyerAadharNo,
        payer_phone_no: body.buyerPhoneNo,

        // Receiver details (seller)
        receiver_name: body.sellerName,
        receiver_age: body.sellerAge,
        receiver_relation_type: body.sellerRelationshipType,
        receiver_relations_name: body.sellerRelationsName,
        receiver_door_no: body.sellerDoorNo,
        receiver_address_line1: body.sellerAddressLine1,
        receiver_address_line2: body.sellerAddressLine2,
        receiver_address_line3: body.sellerAddressLine3,
        receiver_taluk: body.sellerTaluk,
        receiver_district: body.sellerDistrict,
        receiver_pincode: body.sellerPincode,
        receiver_aadhar_no: body.sellerAadharNo,
        receiver_phone_no: body.sellerPhoneNo,

        // Document details
        document_date: body.documentDate,
        sub_registrar_office: body.subRegistrarOffice,
        pr_book_no: body.prBookNo,
        pr_document_year: body.prDocumentYear,
        pr_document_no: body.prDocumentNo,
        property_details: body.propertyDetails,

        // Witness 1 details
        witness1_name: body.witness1Name,
        witness1_age: body.witness1Age,
        witness1_relation_type: body.witness1RelationshipType,
        witness1_relations_name: body.witness1RelationsName,
        witness1_door_no: body.witness1DoorNo,
        witness1_address_line1: body.witness1AddressLine1,
        witness1_address_line2: body.witness1AddressLine2,
        witness1_address_line3: body.witness1AddressLine3,
        witness1_taluk: body.witness1Taluk,
        witness1_district: body.witness1District,
        witness1_pincode: body.witness1Pincode,
        witness1_aadhar_no: body.witness1AadharNo,

        // Witness 2 details
        witness2_name: body.witness2Name,
        witness2_age: body.witness2Age,
        witness2_relation_type: body.witness2RelationshipType,
        witness2_relations_name: body.witness2RelationsName,
        witness2_door_no: body.witness2DoorNo,
        witness2_address_line1: body.witness2AddressLine1,
        witness2_address_line2: body.witness2AddressLine2,
        witness2_address_line3: body.witness2AddressLine3,
        witness2_taluk: body.witness2Taluk,
        witness2_district: body.witness2District,
        witness2_pincode: body.witness2Pincode,
        witness2_aadhar_no: body.witness2AadharNo,

        // Typist details
        typist_name: body.typistName,
        typist_office_name: body.typistOfficeName,
        typist_phone_no: body.typistPhoneNo,
      })
      .select()
      .single()

    if (error) {
      console.error("Error saving mortgage loan receipt:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data, success: true })
  } catch (error) {
    console.error("Error in mortgage loan receipt API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const url = new URL(request.url)

    // Get query parameters
    const receiptNumber = url.searchParams.get("receiptNumber") || ""
    const mortgageLoanDocumentNumber = url.searchParams.get("mortgageLoanDocumentNumber") || ""
    const payerName = url.searchParams.get("payerName") || ""
    const receiverName = url.searchParams.get("receiverName") || ""
    const fromDate = url.searchParams.get("fromDate") || ""
    const toDate = url.searchParams.get("toDate") || ""

    let query = supabase
      .from("mortgage_loan_receipts")
      .select(`
        *,
        mortgage_loan_documents:mortgage_loan_document_id (id, document_number)
      `)
      .order("created_at", { ascending: false })

    // Apply filters if provided
    if (receiptNumber) {
      query = query.ilike("receipt_number", `%${receiptNumber}%`)
    }

    if (mortgageLoanDocumentNumber) {
      query = query.eq("mortgage_loan_documents.document_number", mortgageLoanDocumentNumber)
    }

    if (payerName) {
      query = query.ilike("payer_name", `%${payerName}%`)
    }

    if (receiverName) {
      query = query.ilike("receiver_name", `%${receiverName}%`)
    }

    if (fromDate && toDate) {
      query = query.gte("receipt_date", fromDate).lte("receipt_date", toDate)
    } else if (fromDate) {
      query = query.gte("receipt_date", fromDate)
    } else if (toDate) {
      query = query.lte("receipt_date", toDate)
    }

    const { data, error } = await query

    if (error) {
      console.error("Error fetching mortgage loan receipts:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data, success: true })
  } catch (error) {
    console.error("Error in mortgage loan receipt API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
