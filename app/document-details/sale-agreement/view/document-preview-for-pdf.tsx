import { formatDate } from "@/lib/utils"

interface DocumentPreviewForPdfProps {
  document: any
}

export function DocumentPreviewForPdf({ document }: DocumentPreviewForPdfProps) {
  // Filter sellers and buyers
  const sellers = document.sellers.filter((party: any) => party.party_type === "seller")
  const buyers = document.buyers.filter((party: any) => party.party_type === "buyer")

  // Format document date
  const documentDate = document.document_date ? formatDate(new Date(document.document_date)) : "தேதி குறிப்பிடப்படவில்லை"

  return (
    <div className="bg-white p-8 border border-gray-300 shadow-sm rounded-lg max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">{document.document_name || "கிரைய உடன்படிக்கை ஆவணம்"}</h1>
      <p className="text-lg text-center mb-8">{documentDate}</p>

      {/* Parties Section */}
      {sellers.length > 0 && buyers.length > 0 && (
        <div className="mb-6 text-justify">
          <p>
            இந்த கிரைய உடன்படிக்கை ஆவணம்{" "}
            {sellers.map((seller: any) => seller.users?.name || "பெயர் குறிப்பிடப்படவில்லை").join(", ")} (இனி "விற்பவர்" என்று
            குறிப்பிடப்படுவார்) மற்றும் {buyers.map((buyer: any) => buyer.users?.name || "பெயர் குறிப்பிடப்படவில்லை").join(", ")}{" "}
            (இனி "வாங்குபவர்" என்று குறிப்பிடப்படுவார்) ஆகியோருக்கிடையே செய்யப்படுகிறது.
          </p>
        </div>
      )}

      {/* Previous Document Section */}
      {document.previous_document_details && (
        <div className="mb-6 text-justify">
          <p>{document.previous_document_details}</p>
        </div>
      )}

      {/* Payment Method Section */}
      {document.payment_method && (
        <div className="mb-6 text-justify">
          <p>{document.payment_method}</p>
        </div>
      )}

      {/* Property Rights Section */}
      {document.property_rights && (
        <div className="mb-6 text-justify">
          <p>{document.property_rights}</p>
        </div>
      )}

      {/* Property Details Section */}
      {document.properties && document.properties.length > 0 && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2 text-center">சொத்து விவரம்</h3>
          {document.properties.map((property: any, index: number) => (
            <div key={index} className="whitespace-pre-line mb-4">
              <p>
                <strong>சர்வே எண்:</strong> {property.properties?.survey_number || ""}
                {property.properties?.sub_division_number ? ` / ${property.properties.sub_division_number}` : ""}
              </p>
              <p>
                <strong>கிராமம்:</strong> {property.properties?.villages?.name || ""}
              </p>
              <p>
                <strong>தாலுகா:</strong> {property.properties?.villages?.taluks?.name || ""}
              </p>
              <p>
                <strong>மாவட்டம்:</strong> {property.properties?.villages?.taluks?.districts?.name || ""}
              </p>
              <p>
                <strong>பரப்பளவு:</strong> {property.area || ""} {property.area_unit || ""}
              </p>
              <p>
                <strong>விலை:</strong> ₹{property.value || "0"}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Sale Amount Section */}
      {document.sale_amount && (
        <div className="mb-6">
          <p className="font-semibold">விற்பனை தொகை: ₹{document.sale_amount}</p>
        </div>
      )}

      {/* Signatures Section */}
      <div className="flex justify-between mt-8 mb-6">
        <div>
          <p className="font-semibold">விற்பவர்</p>
          <p className="mt-10">____________________</p>
        </div>
        <div>
          <p className="font-semibold">வாங்குபவர்</p>
          <p className="mt-10">____________________</p>
        </div>
      </div>

      {/* Witnesses Section */}
      {document.witnesses && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">சாட்சிகள்</h3>
          <ol className="list-decimal pl-5">
            {document.witnesses
              .split("\n")
              .map((witness: string, index: number) => witness.trim() && <li key={index}>{witness.trim()}</li>)}
          </ol>
        </div>
      )}

      {/* Typist Section */}
      {document.typist && (
        <div className="mb-6 text-right">
          <p>தட்டச்சு செய்தவர்: {document.typist.name || ""}</p>
        </div>
      )}
    </div>
  )
}
