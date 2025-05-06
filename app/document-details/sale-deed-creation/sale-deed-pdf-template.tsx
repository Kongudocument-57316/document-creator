import { forwardRef } from "react"

interface SaleDeedPdfTemplateProps {
  formData: any
}

const SaleDeedPdfTemplate = forwardRef<HTMLDivElement, SaleDeedPdfTemplateProps>(function SaleDeedPdfTemplate(
  { formData },
  ref,
) {
  return (
    <div ref={ref} className="p-8 bg-white">
      <h1 className="text-3xl font-bold text-center mb-6">கிரைய ஆவணம் (Sale Deed)</h1>

      {/* Deed Details */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">ஆவண விவரங்கள் (Document Details)</h2>
        <div className="border p-4 rounded">
          <p>
            <strong>ஆவண எண்:</strong> {formData.deed.documentNumber || "-"}
          </p>
          <p>
            <strong>ஆவண தேதி:</strong> {formData.deed.documentDate || "-"}
          </p>
          <p>
            <strong>ஆவண வகை:</strong> {formData.deed.documentType || "-"}
          </p>
        </div>
      </div>

      {/* Buyer Details */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">வாங்குபவர் விவரங்கள் (Buyer Details)</h2>
        {formData.buyer && formData.buyer.length > 0 ? (
          formData.buyer.map((buyer: any, index: number) => (
            <div key={index} className="border p-4 rounded mb-2">
              <p>
                <strong>பெயர்:</strong> {buyer.name || "-"}
              </p>
              <p>
                <strong>முகவரி:</strong> {buyer.address || "-"}
              </p>
              <p>
                <strong>தொடர்பு எண்:</strong> {buyer.phone || "-"}
              </p>
            </div>
          ))
        ) : (
          <p>வாங்குபவர் விவரங்கள் எதுவும் இல்லை</p>
        )}
      </div>

      {/* Seller Details */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">விற்பனையாளர் விவரங்கள் (Seller Details)</h2>
        {formData.seller && formData.seller.length > 0 ? (
          formData.seller.map((seller: any, index: number) => (
            <div key={index} className="border p-4 rounded mb-2">
              <p>
                <strong>பெயர்:</strong> {seller.name || "-"}
              </p>
              <p>
                <strong>முகவரி:</strong> {seller.address || "-"}
              </p>
              <p>
                <strong>தொடர்பு எண்:</strong> {seller.phone || "-"}
              </p>
            </div>
          ))
        ) : (
          <p>விற்பனையாளர் விவரங்கள் எதுவும் இல்லை</p>
        )}
      </div>

      {/* Property Details */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">சொத்து விவரங்கள் (Property Details)</h2>
        <div className="border p-4 rounded">
          <p>
            <strong>சொத்து வகை:</strong> {formData.property.propertyType || "-"}
          </p>
          <p>
            <strong>சொத்து முகவரி:</strong> {formData.property.address || "-"}
          </p>
          <p>
            <strong>பரப்பளவு:</strong> {formData.property.area || "-"}
          </p>
        </div>
      </div>

      {/* Payment Details */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">பணம் விவரங்கள் (Payment Details)</h2>
        {formData.payment && formData.payment.length > 0 ? (
          formData.payment.map((payment: any, index: number) => (
            <div key={index} className="border p-4 rounded mb-2">
              <p>
                <strong>பணம் வகை:</strong> {payment.paymentType || "-"}
              </p>
              <p>
                <strong>தொகை:</strong> {payment.amount || "-"}
              </p>
              <p>
                <strong>தேதி:</strong> {payment.date || "-"}
              </p>
            </div>
          ))
        ) : (
          <p>பணம் விவரங்கள் எதுவும் இல்லை</p>
        )}
      </div>

      {/* Witness Details */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">சாட்சி விவரங்கள் (Witness Details)</h2>
        {formData.witness && formData.witness.length > 0 ? (
          formData.witness.map((witness: any, index: number) => (
            <div key={index} className="border p-4 rounded mb-2">
              <p>
                <strong>பெயர்:</strong> {witness.name || "-"}
              </p>
              <p>
                <strong>முகவரி:</strong> {witness.address || "-"}
              </p>
            </div>
          ))
        ) : (
          <p>சாட்சி விவரங்கள் எதுவும் இல்லை</p>
        )}
      </div>

      {/* Signatures */}
      <div className="mt-12">
        <div className="flex justify-between">
          <div className="w-1/3 border-t border-black pt-2">
            <p className="text-center">
              வாங்குபவர் கையொப்பம்
              <br />
              (Buyer Signature)
            </p>
          </div>
          <div className="w-1/3 border-t border-black pt-2">
            <p className="text-center">
              விற்பனையாளர் கையொப்பம்
              <br />
              (Seller Signature)
            </p>
          </div>
          <div className="w-1/3 border-t border-black pt-2">
            <p className="text-center">
              சாட்சி கையொப்பம்
              <br />
              (Witness Signature)
            </p>
          </div>
        </div>
      </div>
    </div>
  )
})

export default SaleDeedPdfTemplate
