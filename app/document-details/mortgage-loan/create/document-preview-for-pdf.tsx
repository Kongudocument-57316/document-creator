export function DocumentPreviewForPDF({ formData }: { formData: any }) {
  return (
    <div id="pdf-content" className="bg-white p-8 text-black" style={{ fontFamily: "Arial, sans-serif" }}>
      <div className="text-center font-bold text-xl mb-6">ஈடுகாட்டிய அடமான கடன் பத்திரம்</div>

      <div className="mb-4">
        {formData.documentYear || "_______"}-ம் வருடம் {formData.documentMonth || "_______"} மாதம்{" "}
        {formData.documentDate || "_______"}-ம் தேதியில்
      </div>

      <div className="mb-4 text-justify">
        {formData.buyerDistrict || "_______"} மாவட்டம்-{formData.buyerPincode || "_______"},{" "}
        {formData.buyerTaluk || "_______"} வட்டம், {formData.buyerAddressLine3 || "_______"},{" "}
        {formData.buyerAddressLine2 || "_______"}, {formData.buyerAddressLine1 || "_______"}, கதவு எண்:-{" "}
        {formData.buyerDoorNo || "_______"} என்ற முகவரியில் வசித்து வருபவரும், {formData.buyerRelationsName || "_______"}{" "}
        அவர்களின் {formData.buyerRelationType || "_______"} {formData.buyerAge || "_______"} வயதுடைய{" "}
        {formData.buyerName || "_______"} (ஆதார் அடையாள அட்டை எண்:- {formData.buyerAadharNo || "_______"}, கைப்பேசி எண்:-{" "}
        {formData.buyerPhoneNo || "_______"}) ஆகிய தங்களுக்கு
      </div>

      <div className="mb-4 text-justify">
        {formData.sellerDistrict || "_______"} மாவட்டம்-{formData.sellerPincode || "_______"},{" "}
        {formData.sellerTaluk || "_______"} வட்டம், {formData.sellerAddressLine3 || "_______"},{" "}
        {formData.sellerAddressLine2 || "_______"}, {formData.sellerAddressLine1 || "_______"}, கதவு எண்:-
        {formData.sellerDoorNo || "_______"} என்ற முகவரியில் வசித்து வருபவரும், {formData.sellerRelationsName || "_______"}{" "}
        அவர்களின் {formData.sellerRelationType || "_______"} {formData.sellerAge || "_______"} வயதுடைய{" "}
        {formData.sellerName || "_______"} (ஆதார் அடையாள அட்டை எண்:- {formData.sellerAadharNo || "_______"}, கைப்பேசி எண்:-{" "}
        {formData.sellerPhoneNo || "_______"}) ஆகிய நான் மனப்பூர்வமான சம்மதத்துடன் எழுதிக் கொடுக்கும் சுவாதீனமில்லாத அடமானக்கடன் பத்திரம்.
      </div>

      <div className="mb-4 text-justify">
        என்னவென்றால், இந்த அடமானக்கடன் பத்திரத்தில் சொத்து விவரத்தில் விவரமாக குறிக்கப்பட்ட சொத்தானது எனக்கு கடந்த{" "}
        {formData.prDocumentDate || "_______"}/{formData.prDocumentMonth || "_______"}/
        {formData.prDocumentYear || "_______"}-ம் தேதியில், {formData.subRegisterOffice || "_______"} சார்பதிவாளர் அலுவலகம்{" "}
        {formData.prBookNo || "_______"} புத்தகம் {formData.prDocumentYear || "_______"}-ம் ஆண்டின்{" "}
        {formData.prDocumentNo || "_______"}-ம் எண்ணாக பதிவு செய்யப்பட்ட {formData.prDocumentType || "_______"} ஆவணத்தின் படி
        எனக்கு தனித்து பாத்தியப்பட்ட சொத்தாகும்.
      </div>

      <div className="mb-4 text-justify">
        மேற்படி வகையில் எனக்கு பாத்தியப்பட்டு நான் சர்வ சுதந்திரமாக ஆண்டனுபவித்து வருகின்ற கீழ்க்கண்ட சொத்தை நான் உங்களிடம் அவசர நிமித்தமாகவும்,
        குடும்பார்த்தமான செலவுகளுக்காவும், வியாபாரத்திற்கு வேண்டியும், நாளது தேதியில் தங்களுக்கு ஈடு காட்டி, மேற்படி அசல் ஆவணத்தை அடமானம் வைத்து,
        அடமானத் தொகையாக ரூ.{formData.loanAmount || "_______"}/-(ரூபாய் {formData.loanAmountInWords || "_______"} மட்டும்) என்
        குடும்பார்த்தமான செலவுகளுக்காக கீழ்க்கண்ட சாட்சிகள் முன்னிலையில் தங்களிடமிருந்து நான் ரொக்கமாய் கடனாகப் பெற்றுக் கொண்டேன்.
      </div>

      <div className="mb-4 text-justify">
        மேற்படி தொகைக்கு {formData.loanStartDate || "_______"}/{formData.loanStartMonth || "_______"}/
        {formData.loanStartYear || "_______"}-ம் தேதி முதல் காலக் கெடுவிற்கு இந்த ரூ.{formData.loanAmount || "_______"}/-(ரூபாய்{" "}
        {formData.loanAmountInWords || "_______"} மட்டும்)-த்திற்கு பிரதி ஆங்கில மாதம் தோறும் ரூ.{" "}
        {formData.monthlyInterestAmount || "_______"}/-க்கு ரூ.{formData.interestRate || "_______"} வட்டி வீதம் உண்டான வட்டித்
        தொகையை, நான் உங்களுக்கு தவறாமல் செலுத்தி வந்து, அசல் கடன் தொகையை {formData.loanEndDate || "_______"}/
        {formData.loanEndMonth || "_______"}/{formData.loanEndYear || "_______"}-ம் தேதி முதல் வரும் காலக்கெடுவிற்குள் நான்
        உங்களுக்கு செலுத்தி விடுவதாக ஒப்புக்கொண்டுள்ளேன்.
      </div>

      <div className="mb-4 text-justify">
        அவ்வாறு வட்டிக்கெடுவில் வட்டியை செலுத்தத் தவறும் பட்சத்தில் ரூ.{formData.loanAmount || "_______"}/- க்கு ரூ.
        {formData.interestRate || "_______"} பைசா மட்டும் மேற்படி வட்டியில் கூடுதலாக சேர்த்து கட்டத் தவறிய மாதத்திற்கு மட்டும் உண்டான
        வட்டியை நான் உங்களுக்கு செலுத்தி விடுவதாக முழுமனதுடன் ஒப்புக்கொண்டுள்ளேன்.
      </div>

      <div className="mb-4 text-justify">
        அவ்வாறு வட்டிக்கெடுவில் வட்டியும், அசல் கெடுவில் அசல் தொகையும் நான் உங்களுக்கு செலுத்தத் தவறும் பட்சத்தில் சொத்துரிமை மாற்றுச்சட்ட பிரிவின்
        கீழ் பகிரங்க ஏலத்திலோ அல்லது பேரம் பேசி விலைக்கோ, அல்லது இதனடியிற்கண்ட சொத்தை வேறு நபருக்கு விலைக்கு பேசி விற்பனை செய்து அதன்
        மூலம் வரும் தொகையிலிருந்து உங்களுக்கு சேர வேண்டிய அசல் கடன் தொ��ையை பிடித்தம் செய்து கொண்டது போக எனக்கு சேர வேண்டிய தொகையை எனது
        வசம் ஒப்படைக்க வேண்டியது என நான் உங்களிடம் முழு மனதுடன் ஒப்புக்கொண்டுள்ளேன்.
      </div>

      <div className="mb-4 text-justify">
        கீழ்க்கண்ட சொத்துக்களின் பேரில் எந்தவிதமான வில்லங்க விவகாரமும் அடமானமும் ஈக்விடபுள் மார்ட்கேஜ், கோர்ட் ஜப்தி ஆகியவை ஒன்றும் இல்லை எனவும் நான்
        எந்தவிதமான வில்லங்க விவகாரத்திற்கும் உட்படுத்தவில்லை எனவும் உண்மையாகவும் உறுதியாகவும் சொல்கிறேன்.
      </div>

      <div className="mb-4 text-justify">
        அப்படி தவறி ஏதாவது வில்லங்க விவகாரம் இருந்து பின்னிட்டு வெளிப்படும் பட்சத்தில் அதை நானே முன்னின்று எனது சொந்த பொறுப்பிலும் சொந்த
        செலவிலும் எனது இதர சொத்துகளைக் கொண்டு முன்னின்று தீர்த்துக் கொடுக்க கடமைப்பட்டவர் ஆவேன்.
      </div>

      <div className="mb-8 text-justify">
        இந்தப்படிக்கு நான் என் மனப்பூர்வமாய் தங்களுக்கு எழுதிக்கொடுத்த சுவாதீனமில்லாத அடமானக்கடன் பத்திரம். மேற்படி சொத்து சுவாதீனம் கொடுக்கப்படவில்லை.
      </div>

      <div className="text-center font-bold mb-4">சொத்து விவரம்</div>

      <div className="mb-8 text-justify">{formData.propertyDetails || "சொத்து விவரங்கள் இங்கே காண்பிக்கப்படும்."}</div>

      <div className="font-bold mb-2">சாட்சிகள் :-</div>

      <div className="mb-2">
        1. ({formData.witness1Name || "_______"}) {formData.witness1RelationType || "_______"}.
        {formData.witness1RelationsName || "_______"}, கதவு எண்:-{formData.witness1DoorNo || "_______"},{" "}
        {formData.witness1AddressLine1 || "_______"}, {formData.witness1AddressLine2 || "_______"},{" "}
        {formData.witness1AddressLine3 || "_______"}, {formData.witness1Taluk || "_______"} வட்டம்,{" "}
        {formData.witness1District || "_______"} மாவட்டம்-{formData.witness1Pincode || "_______"}, (வயது-
        {formData.witness1Age || "_______"}) (ஆதார் அடையாள அட்டை எண்:-{formData.witness1AadharNo || "_______"}).
      </div>

      <div className="mb-6">
        2. ({formData.witness2Name || "_______"}) {formData.witness2RelationType || "_______"}.
        {formData.witness2RelationsName || "_______"}, கதவு எண்:-{formData.witness2DoorNo || "_______"},{" "}
        {formData.witness2AddressLine1 || "_______"}, {formData.witness2AddressLine2 || "_______"},{" "}
        {formData.witness2AddressLine3 || "_______"}, {formData.witness2Taluk || "_______"} வட்டம்,{" "}
        {formData.witness2District || "_______"} மாவட்டம்-{formData.witness2Pincode || "_______"}, (வயது-
        {formData.witness2Age || "_______"}) (ஆதார் அடையாள அட்டை எண்:-{formData.witness2AadharNo || "_______"}).
      </div>

      <div className="text-right mb-1">கணினியில் தட்டச்சு செய்து ஆவணம் தயார் செய்தவர்:-{formData.typistName || "_______"}</div>

      <div className="text-right mb-8">
        ({formData.typistOfficeName || "_______"}, போன்:-{formData.typistPhoneNo || "_______"})
      </div>

      <div className="flex justify-between mt-8">
        <div className="text-center">
          <div className="font-bold">வாங்குபவர் கையொப்பம்</div>
          <div className="mt-8">_________________</div>
          <div>{formData.buyerName || "_______"}</div>
        </div>

        <div className="text-center">
          <div className="font-bold">விற்பவர் கையொப்பம்</div>
          <div className="mt-8">_________________</div>
          <div>{formData.sellerName || "_______"}</div>
        </div>
      </div>
    </div>
  )
}
