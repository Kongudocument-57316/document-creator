"use client"

import { Card, CardContent } from "@/components/ui/card"
import type { MortgageLoanFormValues } from "@/types/mortgage-loan"

export function DocumentLivePreview({ formData }: { formData: MortgageLoanFormValues }) {
  if (!formData) return null

  // Helper function to determine singular or plural text based on count
  const getBuyerText = (count: number) => {
    return count > 1 ? "அடமானம் பெறுபவர்கள்" : "அடமானம் பெறுபவர்"
  }

  const getSellerText = (count: number) => {
    return count > 1 ? "அடமானம் கொடுப்பவர்கள்" : "அடமானம் கொடுப்பவர்"
  }

  // Helper function to format buyer details
  const formatBuyerDetails = () => {
    return formData.buyers.map((buyer, index) => (
      <p key={buyer.id} className="mb-4">
        {formData.buyers.length > 1 && `${index + 1}. `}
        {buyer.district || "_______"} மாவட்டம்-{buyer.pincode || "_______"}, {buyer.taluk || "_______"} வட்டம்,{" "}
        {buyer.addressLine3 || "_______"}, {buyer.addressLine2 || "_______"}, {buyer.addressLine1 || "_______"}, கதவு
        எண்:- {buyer.doorNo || "_______"} என்ற முகவரியில் வசித்து வருபவரும், {buyer.relationsName || "_______"} அவர்களின்{" "}
        {buyer.relationType || "_______"} {buyer.age || "_______"} வயதுடைய {buyer.name || "_______"} (ஆதார் அடையாள அட்டை
        எண்:- {buyer.aadharNo || "_______"}, கைப்பேசி எண்:- {buyer.phoneNo || "_______"})
        {index < formData.buyers.length - 1 ? " மற்றும்" : ""}
      </p>
    ))
  }

  // Helper function to format seller details
  const formatSellerDetails = () => {
    return formData.sellers.map((seller, index) => (
      <p key={seller.id} className="mb-4">
        {formData.sellers.length > 1 && `${index + 1}. `}
        {seller.district || "_______"} மாவட்டம்-{seller.pincode || "_______"}, {seller.taluk || "_______"} வட்டம்,{" "}
        {seller.addressLine3 || "_______"}, {seller.addressLine2 || "_______"}, {seller.addressLine1 || "_______"}, கதவு
        எண்:-
        {seller.doorNo || "_______"} என்ற முகவரியில் வசித்து வருபவரும், {seller.relationsName || "_______"} அவர்களின்{" "}
        {seller.relationType || "_______"} {seller.age || "_______"} வயதுடைய {seller.name || "_______"} (ஆதார் அடையாள அட்டை
        எண்:- {seller.aadharNo || "_______"}, கைப்பேசி எண்:- {seller.phoneNo || "_______"})
        {index < formData.sellers.length - 1 ? " மற்றும்" : ""}
      </p>
    ))
  }

  // Get document date parts
  const documentDateParts = formData.documentDate ? formData.documentDate.split("/") : ["_______", "_______", "_______"]
  const documentDay = documentDateParts[0] || "_______"
  const documentMonth = documentDateParts[1] || "_______"
  const documentYear = documentDateParts[2] || "_______"

  // Get loan start date parts
  const loanStartDateParts = formData.loanStartDate
    ? formData.loanStartDate.split("/")
    : ["_______", "_______", "_______"]
  const loanStartDay = loanStartDateParts[0] || "_______"
  const loanStartMonth = loanStartDateParts[1] || "_______"
  const loanStartYear = loanStartDateParts[2] || "_______"

  // Calculate loan end date (placeholder)
  const loanEndDay = "_______"
  const loanEndMonth = "_______"
  const loanEndYear = "_______"

  return (
    <Card className="bg-white shadow-md border border-cyan-100">
      <CardContent className="p-6">
        <div className="prose prose-sm max-w-none">
          <h2 className="text-center text-xl font-bold mb-6 text-cyan-800">ஈடுகாட்டிய அடமான கடன் பத்திரம்</h2>

          <p className="mb-4">
            {documentYear || "_______"}-ம் வருடம் {documentMonth || "_______"} மாதம் {documentDay || "_______"}-ம் தேதியில்
          </p>

          {formatBuyerDetails()}

          <p className="mb-2">ஆகிய {getBuyerText(formData.buyers.length)} தங்களுக்கு</p>

          {formatSellerDetails()}

          <p className="mb-4">
            ஆகிய {formData.sellers.length > 1 ? "நாங்கள்" : "நான்"} மனப்பூர்வமான சம்மதத்துடன் எழுதிக் கொடுக்கும் சுவாதீனமில்லாத அடமானக்கடன்
            பத்திரம்.
          </p>

          <p className="mb-4">
            என்னவென்றால், இந்த அடமானக்கடன் பத்திரத்தில் சொத்து விவரத்தில் விவரமாக குறிக்கப்பட்ட சொத்தானது{" "}
            {formData.sellers.length > 1 ? "எங்களுக்கு" : "எனக்கு"} கடந்த {formData.prDocumentDate || "_______"}/
            {formData.prDocumentMonth || "_______"}/{formData.prDocumentYear || "_______"}-ம் தேதியில்,{" "}
            {formData.subRegisterOffice || "_______"} சார்பதிவாளர் அலுவலகம் {formData.prBookNo || "_______"} புத்தகம்{" "}
            {formData.prDocumentYear || "_______"}-ம் ஆண்டின் {formData.prDocumentNo || "_______"}-ம் எண்ணாக பதிவு செய்யப்பட்ட{" "}
            {formData.prDocumentType || "_______"} ஆவணத்தின் படி {formData.sellers.length > 1 ? "எங்களுக்கு" : "எனக்கு"}{" "}
            தனித்து பாத்தியப்பட்ட சொத்தாகும்.
          </p>

          <p className="mb-4">
            மேற்படி வகையில் {formData.sellers.length > 1 ? "எங்களுக்கு" : "எனக்கு"} பாத்தியப்பட்டு{" "}
            {formData.sellers.length > 1 ? "நாங்கள்" : "நான்"} சர்வ சுதந்திரமாக ஆண்டனுபவித்து வருகின்ற கீழ்க்கண்ட சொத்தை{" "}
            {formData.sellers.length > 1 ? "நாங்கள்" : "நான்"} உங்களிடம் அவசர நிமித்தமாகவும், குடும்பார்த்தமான செலவுகளுக்காவும்,
            வியாபாரத்திற்கு வேண்டியும், நாளது தேதியில் தங்களுக்கு ஈடு காட்டி, மேற்படி அசல் ஆவணத்தை அடமானம் வைத்து, அடமானத் தொகையாக ரூ.
            {formData.loanAmount || "_______"}/-(ரூபாய் {formData.loanAmountInWords || "_______"} மட்டும்){" "}
            {formData.sellers.length > 1 ? "எங்கள்" : "என்"} குடும்பார்த்தமான செலவுகளுக்காக கீழ்க்கண்ட சாட்சிகள் முன்னிலையில் தங்களிடமிருந்து{" "}
            {formData.sellers.length > 1 ? "நாங்கள்" : "நான்"} ரொக்கமாய் கடனாகப் பெற்றுக் கொண்டேன்.
          </p>

          <p className="mb-4">
            மேற்படி தொகைக்கு {loanStartDay || "_______"}/{loanStartMonth || "_______"}/{loanStartYear || "_______"}-ம் தேதி
            முதல் காலக் கெடுவிற்கு இந்த ரூ.{formData.loanAmount || "_______"}
            /-(ரூபாய் {formData.loanAmountInWords || "_______"} மட்டும்)-த்திற்கு பிரதி ஆங்கில மாதம் தோறும் ரூ.100/-க்கு ரூ.{formData.interestRate || "_______"} வட்டி வீதம் உண்டான
            வட்டித் தொகையை, {formData.sellers.length > 1 ? "நாங்கள்" : "நான்"} உங்களுக்கு தவறாமல் செலுத்தி வந்து, அசல் கடன் தொகையை{" "}
            {loanEndDay || "_______"}/{loanEndMonth || "_______"}/{loanEndYear || "_______"}-ம் தேதி முதல் வரும்
            காலக்கெடுவிற்குள் {formData.sellers.length > 1 ? "நாங்கள்" : "நான்"}
            உங்களுக்கு செலுத்தி விடுவதாக ஒப்புக்கொண்டுள்ளேன்.
          </p>

          <p className="mb-4">
            அவ்வாறு வட்டிக்கெடுவில் வட்டியை செலுத்தத் தவறும் பட்சத்தில் ரூ.100/-க்கு ரூ.
            {formData.interestRate || "_______"} பைசா மட்டும் மேற்படி வட்டியில் கூடுதலாக சேர்த்து கட்டத் தவறிய மாதத்திற்கு மட்டும் உண்டான
            வட்டியை {formData.sellers.length > 1 ? "நாங்கள்" : "நான்"} உங்களுக்கு செலுத்தி விடுவதாக முழுமனதுடன் ஒப்புக்கொண்டுள்ளேன்.
          </p>

          <p className="mb-4">
            அவ்வாறு வட்டிக்கெடுவில் வட்டியும், அசல் கெடுவில் அசல் தொகையும் {formData.sellers.length > 1 ? "நாங்கள்" : "நான்"} உங்களுக்கு
            செலுத்தத் தவறும் பட்சத்தில் சொத்துரிமை மாற்றுச்சட்ட பிரிவின் கீழ் பகிரங்க ஏலத்திலோ அல்லது பேரம் பேசி விலைக்கோ, அல்லது
            இதனடியிற்கண்ட சொத்தை வேறு நபருக்கு விலைக்கு பேசி விற்பனை செய்து அதன் மூலம் வரும் தொகையிலிருந்து உங்களுக்கு சேர வேண்டிய அசல்
            கடன் தொகையை பிடித்தம் செய்து கொண்டது போக {formData.sellers.length > 1 ? "எங்களுக்கு" : "எனக்கு"} சேர வேண்டிய தொகையை{" "}
            {formData.sellers.length > 1 ? "எங்கள்" : "எனது"} வசம் ஒப்படைக்க வேண்டியது என{" "}
            {formData.sellers.length > 1 ? "நாங்கள்" : "நான்"} உங்களிடம் முழு மனதுடன் ஒப்புக்கொண்டுள்ளேன்.
          </p>

          <p className="mb-4">
            கீழ்க்கண்ட சொத்துக்களின் பேரில் எந்தவிதமான வில்லங்க விவகாரமும் அடமானமும் ஈக்விடபுள் மார்ட்கேஜ், கோர்ட் ஜப்தி ஆகியவை ஒன்றும் இல்லை எனவும்
            {formData.sellers.length > 1 ? "நாங்கள்" : "நான்"} எந்தவிதமான வில்லங்க விவகாரத்திற்கும் உட்படுத்தவில்லை எனவும் உண்மையாகவும்
            உறுதியாகவும் சொல்கிறேன்.
          </p>

          <p className="mb-4">
            அப்படி தவறி ஏதாவது வில்லங்க விவகாரம் இருந்து பின்னிட்டு வெளிப்படும் பட்சத்தில் அதை{" "}
            {formData.sellers.length > 1 ? "நாங்களே" : "நானே"} முன்னின்று {formData.sellers.length > 1 ? "எங்கள்" : "எனது"}{" "}
            சொந்த பொறுப்பிலும் சொந்த செலவிலும் {formData.sellers.length > 1 ? "எங்கள்" : "எனது"} இதர சொத்துகளைக் கொண்டு முன்னின்று
            தீர்த்துக் கொடுக்க கடமைப்பட்டவர் ஆவேன்.
          </p>

          <p className="mb-4">
            இந்தப்படிக்கு {formData.sellers.length > 1 ? "நாங்கள் எங்கள்" : "நான் என்"} மனப்பூர்வமாய் தங்களுக்கு எழுதிக்கொடுத்த சுவாதீனமில்லாத
            அடமானக்கடன் பத்திரம். மேற்படி சொத்து சுவாதீனம் கொடுக்கப்படவில்லை.
          </p>

          <div className="mb-4">
            <h3 className="font-semibold text-center">சொத்து விவரம்</h3>
            <p className="mt-2">{formData.propertyDetails || "சொத்து விவரங்கள் இங்கே காண்பிக்கப்படும்."}</p>
          </div>

          <div className="mb-4">
            <h3 className="font-semibold">சாட்சிகள் :-</h3>
            <p className="mt-2">
              1. ({formData.witness1Name || "_______"}) {formData.witness1RelationType || "_______"}.
              {formData.witness1RelationsName || "_______"}, கதவு எண்:-{formData.witness1DoorNo || "_______"},{" "}
              {formData.witness1AddressLine1 || "_______"}, {formData.witness1AddressLine2 || "_______"},{" "}
              {formData.witness1AddressLine3 || "_______"}, {formData.witness1Taluk || "_______"} வட்டம்,{" "}
              {formData.witness1District || "_______"} மாவட்டம்-{formData.witness1Pincode || "_______"}, (வயது-
              {formData.witness1Age || "_______"}) (ஆதார் அடையாள அட்டை எண்:-{formData.witness1AadharNo || "_______"}).
            </p>
            <p className="mt-2">
              2. ({formData.witness2Name || "_______"}) {formData.witness2RelationType || "_______"}.
              {formData.witness2RelationsName || "_______"}, கதவு எண்:-{formData.witness2DoorNo || "_______"},{" "}
              {formData.witness2AddressLine1 || "_______"}, {formData.witness2AddressLine2 || "_______"},{" "}
              {formData.witness2AddressLine3 || "_______"}, {formData.witness2Taluk || "_______"} வட்டம்,{" "}
              {formData.witness2District || "_______"} மாவட்டம்-{formData.witness2Pincode || "_______"}, (வயது-
              {formData.witness2Age || "_______"}) (ஆதார் அடையாள அட்டை எண்:-{formData.witness2AadharNo || "_______"}).
            </p>
          </div>

          <div className="mt-4 text-right">
            <p>கணினியில் தட்டச்சு செய்து ஆவணம் தயார் செய்தவர்:-{formData.typistName || "_______"}</p>
            <p>
              ({formData.typistOfficeName || "_______"}, போன்:-{formData.typistPhoneNo || "_______"})
            </p>
          </div>

          <div className="mt-8 flex justify-between">
            <div>
              <p className="font-semibold">{getBuyerText(formData.buyers.length)} கையொப்பம்</p>
              {formData.buyers.map((buyer, index) => (
                <div key={buyer.id} className="mt-4">
                  <p className="mt-4">_________________</p>
                  <p>{buyer.name || "_______"}</p>
                </div>
              ))}
            </div>
            <div>
              <p className="font-semibold">{getSellerText(formData.sellers.length)} கையொப்பம்</p>
              {formData.sellers.map((seller, index) => (
                <div key={seller.id} className="mt-4">
                  <p className="mt-4">_________________</p>
                  <p>{seller.name || "_______"}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
