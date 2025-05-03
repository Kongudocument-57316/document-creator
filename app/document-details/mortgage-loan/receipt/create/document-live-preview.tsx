"use client"

import { Card, CardContent } from "@/components/ui/card"

interface DocumentPreviewProps {
  formData: any
}

export function DocumentLivePreview({ formData }: DocumentPreviewProps) {
  const {
    // Receipt details
    receiptDate = "",

    // Buyer details
    buyerName = "",
    buyerAge = "",
    buyerRelationshipType = "",
    buyerRelationsName = "",
    buyerDoorNo = "",
    buyerAddressLine1 = "",
    buyerAddressLine2 = "",
    buyerAddressLine3 = "",
    buyerTaluk = "",
    buyerDistrict = "",
    buyerPincode = "",
    buyerAadharNo = "",
    buyerPhoneNo = "",

    // Seller details
    sellerName = "",
    sellerAge = "",
    sellerRelationshipType = "",
    sellerRelationsName = "",
    sellerDoorNo = "",
    sellerAddressLine1 = "",
    sellerAddressLine2 = "",
    sellerAddressLine3 = "",
    sellerTaluk = "",
    sellerDistrict = "",
    sellerPincode = "",
    sellerAadharNo = "",
    sellerPhoneNo = "",

    // Document details
    documentDate = "",
    loanAmount = "",
    loanAmountInWords = "",

    // Registration details
    subRegistrarOffice = "",
    prBookNo = "",
    prDocumentYear = "",
    prDocumentNo = "",

    // Property details
    propertyDetails = "",

    // Witness details
    witness1Name = "",
    witness1Age = "",
    witness1RelationshipType = "",
    witness1RelationsName = "",
    witness1DoorNo = "",
    witness1AddressLine1 = "",
    witness1AddressLine2 = "",
    witness1AddressLine3 = "",
    witness1Taluk = "",
    witness1District = "",
    witness1Pincode = "",
    witness1AadharNo = "",

    witness2Name = "",
    witness2Age = "",
    witness2RelationshipType = "",
    witness2RelationsName = "",
    witness2DoorNo = "",
    witness2AddressLine1 = "",
    witness2AddressLine2 = "",
    witness2AddressLine3 = "",
    witness2Taluk = "",
    witness2District = "",
    witness2Pincode = "",
    witness2AadharNo = "",

    // Typist details
    typistName = "",
    typistOfficeName = "",
    typistPhoneNo = "",
  } = formData

  return (
    <Card className="w-full h-full overflow-auto">
      <CardContent className="p-6">
        <div className="text-center font-bold text-xl mb-4">அடமான கடன் செல்லு ரசீது</div>

        <div className="text-center mb-6">{receiptDate && <p>{receiptDate} அன்று</p>}</div>

        <div className="mb-6">
          <p className="text-justify">
            {buyerDistrict && `${buyerDistrict} மாவட்டம்`}
            {buyerPincode && `-${buyerPincode}`},{buyerTaluk && `${buyerTaluk} வட்டம்`},
            {buyerAddressLine3 && `${buyerAddressLine3},`}
            {buyerAddressLine2 && `${buyerAddressLine2},`}
            {buyerAddressLine1 && `${buyerAddressLine1},`}
            {buyerDoorNo && `கதவு எண்:- ${buyerDoorNo}`} என்ற முகவரியில் வசித்து வருபவரும்,
            {buyerRelationsName && `${buyerRelationsName} அவர்களின்`}
            {buyerRelationshipType && `${buyerRelationshipType}`}
            {buyerAge && `${buyerAge} வயதுடைய`}
            {buyerName && `${buyerName}`}
            {buyerAadharNo && `(ஆதார் அடையாள அட்டை எண்:- ${buyerAadharNo},`}
            {buyerPhoneNo && `கைப்பேசி எண்:- ${buyerPhoneNo})`} ஆகிய தங்களுக்கு
          </p>

          <p className="text-justify mt-2">
            {sellerDistrict && `${sellerDistrict} மாவட்டம்`}
            {sellerPincode && `-${sellerPincode}`},{sellerTaluk && `${sellerTaluk} வட்டம்`},
            {sellerAddressLine3 && `${sellerAddressLine3},`}
            {sellerAddressLine2 && `${sellerAddressLine2},`}
            {sellerAddressLine1 && `${sellerAddressLine1},`}
            {sellerDoorNo && `கதவு எண்:-${sellerDoorNo}`} என்ற முகவரியில் வசித்து வருபவரும்,
            {sellerRelationsName && `${sellerRelationsName} அவர்களின்`}
            {sellerRelationshipType && `${sellerRelationshipType}`}
            {sellerAge && `${sellerAge} வயதுடைய`}
            {sellerName && `${sellerName}`}
            {sellerAadharNo && `(ஆதார் அடையாள அட்டை எண்:- ${sellerAadharNo},`}
            {sellerPhoneNo && `கைப்பேசி எண்:- ${sellerPhoneNo})`} ஆகிய நான் எழுதிக்கொடுத்த அடமான கடன் செல்லு ரசீது.
          </p>

          <p className="text-justify mt-2">
            எனக்கு கடந்த {documentDate && `${documentDate}`}–ம் தேதியில் ரூ.{loanAmount && `${loanAmount}/-`}(ரூபாய்{" "}
            {loanAmountInWords && `${loanAmountInWords}`} மட்டும்)-க்கு சொத்து விவரத்தில் கண்ட சொத்தினை அடமானம் வைத்தீர்கள்.
          </p>

          <p className="text-justify mt-2">
            மேற்படி அடமானப்பத்திரம் {subRegistrarOffice && `${subRegistrarOffice}`} சார்பதிவாளர் அலுவலகத்தில்{" "}
            {prBookNo && `${prBookNo}`} புத்தகம் {prDocumentYear && `${prDocumentYear}`}-ம் ஆண்டின்{" "}
            {prDocumentNo && `${prDocumentNo}`}–ம் எண்ணாக பதிவு செய்யப்பட்டுள்ளது.
          </p>

          <p className="text-justify mt-2">
            மேற்படி எனக்கு செலுத்த வேண்டிய கடன் தொகை ரூ.{loanAmount && `${loanAmount}/-`}(ரூபாய்{" "}
            {loanAmountInWords && `${loanAmountInWords}`} மட்டும்)-மும் அதற்கான வட்டியும் எனக்கு செல்லாகிவிட்டது. நிலுவை ஏதும் இல்லை.
          </p>

          <p className="text-justify mt-2">
            மேற்படி அடமான கடன் பத்திரத்திற்கு நாளது தேதிவரை அசல் மற்றும் வட்டிதொகை செலுத்தியதற்கு இதுவே இரசீது.
          </p>
        </div>

        <div className="mb-6">
          <h3 className="text-center font-bold mb-2">சொத்து விவரம்</h3>
          <p className="text-justify">{propertyDetails}</p>
        </div>

        <div className="mt-8">
          <h3 className="mb-2">சாட்சிகள் :-</h3>
          <div className="border-t border-gray-300 pt-2">
            <p className="mb-4">
              1. {witness1Name && `(${witness1Name})`} {witness1RelationshipType && `${witness1RelationshipType}`}.
              {witness1RelationsName && `${witness1RelationsName}`},{witness1DoorNo && `கதவு எண்:-${witness1DoorNo},`}
              {witness1AddressLine1 && `${witness1AddressLine1},`}
              {witness1AddressLine2 && `${witness1AddressLine2},`}
              {witness1AddressLine3 && `${witness1AddressLine3},`}
              {witness1Taluk && `${witness1Taluk} வட்டம்,`}
              {witness1District && `${witness1District} மாவட்டம்`}
              {witness1Pincode && `-${witness1Pincode},`}
              {witness1Age && `(வயது-${witness1Age})`}
              {witness1AadharNo && `(ஆதார் அடையாள அட்டை எண்:-${witness1AadharNo}).`}
            </p>

            <p className="mb-4">
              2. {witness2Name && `(${witness2Name})`} {witness2RelationshipType && `${witness2RelationshipType}`}.
              {witness2RelationsName && `${witness2RelationsName}`},{witness2DoorNo && `கதவு எண்:-${witness2DoorNo},`}
              {witness2AddressLine1 && `${witness2AddressLine1},`}
              {witness2AddressLine2 && `${witness2AddressLine2},`}
              {witness2AddressLine3 && `${witness2AddressLine3},`}
              {witness2Taluk && `${witness2Taluk} வட்டம்,`}
              {witness2District && `${witness2District} மாவட்டம்`}
              {witness2Pincode && `-${witness2Pincode},`}
              {witness2Age && `(வயது-${witness2Age})`}
              {witness2AadharNo && `(ஆதார் அடையாள அட்டை எண்:-${witness2AadharNo}).`}
            </p>
          </div>

          <div className="mt-4">
            <p>
              கணினியில் தட்டச்சு செய்து ஆவணம் தயார் செய்தவர்:-{typistName && `${typistName}`}
              {typistOfficeName && `(${typistOfficeName},`}
              {typistPhoneNo && `போன்:-${typistPhoneNo})`}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
