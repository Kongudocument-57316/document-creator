"use server"

import { createClient } from "@/lib/supabase"

// Define the form data type
type PartitionReleaseFormData = {
  // Date details
  documentDate: Date

  // Receiver details
  receiverName: string
  receiverAge: string
  receiverRelationName: string
  receiverRelationType: string
  receiverDoorNo: string
  receiverAddressLine1: string
  receiverAddressLine2: string
  receiverAddressLine3: string
  receiverTaluk: string
  receiverDistrict: string
  receiverPincode: string
  receiverAadharNo: string
  receiverPhoneNo: string

  // Giver details
  giverName: string
  giverAge: string
  giverRelationName: string
  giverRelationType: string
  giverDoorNo: string
  giverAddressLine1: string
  giverAddressLine2: string
  giverAddressLine3: string
  giverTaluk: string
  giverDistrict: string
  giverPincode: string
  giverAadharNo: string
  giverPhoneNo: string

  // Deceased person details
  deathPersonName: string
  deathPersonRelations: string
  deathDate: Date

  // Document details
  prDocumentDate: Date
  subRegistrarOffice: string
  prBookNo: string
  prDocumentYear: string
  prDocumentNo: string
  prDocumentType: string

  // Certificate details
  deathCertificateNo: string
  deathCertificateDate: Date
  heirCertificateNo: string
  heirCertificateDate: Date
  tahsildarOfficeName: string

  // Share details
  totalShare: string
  releaseShare: string

  // Property details
  propertyDetails: string

  // Witness details
  witness1Name: string
  witness1Relation: string
  witness1RelationName: string
  witness1DoorNo: string
  witness1AddressLine1: string
  witness1AddressLine2: string
  witness1AddressLine3: string
  witness1Taluk: string
  witness1District: string
  witness1Pincode: string
  witness1Age: string
  witness1AadharNo: string

  witness2Name: string
  witness2Relation: string
  witness2RelationName: string
  witness2DoorNo: string
  witness2AddressLine1: string
  witness2AddressLine2: string
  witness2AddressLine3: string
  witness2Taluk: string
  witness2District: string
  witness2Pincode: string
  witness2Age: string
  witness2AadharNo: string

  // Typist details
  typistName: string
  typistOffice: string
  typistPhone: string
}

export async function savePartitionReleaseDocument(formData: PartitionReleaseFormData) {
  try {
    const supabase = createClient()

    // Format dates for database storage
    const documentDateFormatted = formData.documentDate.toISOString()
    const deathDateFormatted = formData.deathDate.toISOString()
    const prDocumentDateFormatted = formData.prDocumentDate.toISOString()
    const deathCertificateDateFormatted = formData.deathCertificateDate.toISOString()
    const heirCertificateDateFormatted = formData.heirCertificateDate.toISOString()

    // Insert document into database
    const { data, error } = await supabase
      .from("partition_release_documents")
      .insert([
        {
          // Date details
          document_date: documentDateFormatted,

          // Receiver details
          receiver_name: formData.receiverName,
          receiver_age: formData.receiverAge,
          receiver_relation_name: formData.receiverRelationName,
          receiver_relation_type: formData.receiverRelationType,
          receiver_door_no: formData.receiverDoorNo,
          receiver_address_line1: formData.receiverAddressLine1,
          receiver_address_line2: formData.receiverAddressLine2,
          receiver_address_line3: formData.receiverAddressLine3,
          receiver_taluk: formData.receiverTaluk,
          receiver_district: formData.receiverDistrict,
          receiver_pincode: formData.receiverPincode,
          receiver_aadhar_no: formData.receiverAadharNo,
          receiver_phone_no: formData.receiverPhoneNo,

          // Giver details
          giver_name: formData.giverName,
          giver_age: formData.giverAge,
          giver_relation_name: formData.giverRelationName,
          giver_relation_type: formData.giverRelationType,
          giver_door_no: formData.giverDoorNo,
          giver_address_line1: formData.giverAddressLine1,
          giver_address_line2: formData.giverAddressLine2,
          giver_address_line3: formData.giverAddressLine3,
          giver_taluk: formData.giverTaluk,
          giver_district: formData.giverDistrict,
          giver_pincode: formData.giverPincode,
          giver_aadhar_no: formData.giverAadharNo,
          giver_phone_no: formData.giverPhoneNo,

          // Deceased person details
          death_person_name: formData.deathPersonName,
          death_person_relations: formData.deathPersonRelations,
          death_date: deathDateFormatted,

          // Document details
          pr_document_date: prDocumentDateFormatted,
          sub_registrar_office: formData.subRegistrarOffice,
          pr_book_no: formData.prBookNo,
          pr_document_year: formData.prDocumentYear,
          pr_document_no: formData.prDocumentNo,
          pr_document_type: formData.prDocumentType,

          // Certificate details
          death_certificate_no: formData.deathCertificateNo,
          death_certificate_date: deathCertificateDateFormatted,
          heir_certificate_no: formData.heirCertificateNo,
          heir_certificate_date: heirCertificateDateFormatted,
          tahsildar_office_name: formData.tahsildarOfficeName,

          // Share details
          total_share: formData.totalShare,
          release_share: formData.releaseShare,

          // Property details
          property_details: formData.propertyDetails,

          // Witness details
          witness1_name: formData.witness1Name,
          witness1_relation: formData.witness1Relation,
          witness1_relation_name: formData.witness1RelationName,
          witness1_door_no: formData.witness1DoorNo,
          witness1_address_line1: formData.witness1AddressLine1,
          witness1_address_line2: formData.witness1AddressLine2,
          witness1_address_line3: formData.witness1AddressLine3,
          witness1_taluk: formData.witness1Taluk,
          witness1_district: formData.witness1District,
          witness1_pincode: formData.witness1Pincode,
          witness1_age: formData.witness1Age,
          witness1_aadhar_no: formData.witness1AadharNo,

          witness2_name: formData.witness2Name,
          witness2_relation: formData.witness2Relation,
          witness2_relation_name: formData.witness2RelationName,
          witness2_door_no: formData.witness2DoorNo,
          witness2_address_line1: formData.witness2AddressLine1,
          witness2_address_line2: formData.witness2AddressLine2,
          witness2_address_line3: formData.witness2AddressLine3,
          witness2_taluk: formData.witness2Taluk,
          witness2_district: formData.witness2District,
          witness2_pincode: formData.witness2Pincode,
          witness2_age: formData.witness2Age,
          witness2_aadhar_no: formData.witness2AadharNo,

          // Typist details
          typist_name: formData.typistName,
          typist_office: formData.typistOffice,
          typist_phone: formData.typistPhone,

          // Status
          status: "active",
          created_at: new Date().toISOString(),
        },
      ])
      .select()

    if (error) {
      console.error("Error saving document:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error in savePartitionReleaseDocument:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

// Export saveDocument as an alias to savePartitionReleaseDocument for compatibility
export const saveDocument = savePartitionReleaseDocument
