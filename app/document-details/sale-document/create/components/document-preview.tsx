"use client"

import { Card, CardContent } from "@/components/ui/card"

export default function DocumentPreview({ formData }) {
  const formatDate = (dateString) => {
    if (!dateString) return ""

    const date = new Date(dateString)
    return date.toLocaleDateString("ta-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-6 font-tamil">
      <Card className="border-2 border-gray-300">
        <CardContent className="p-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">கிரையம் ரூ.{formData.paymentDetails.totalValue || "/-"}</h2>
            <p>{formatDate(formData.basicDetails.registrationDate)}</p>
          </div>

          <div className="space-y-4">
            {formData.basicDetails.documentNumber && (
              <div>
                <p className="font-medium">ஆவண எண்: {formData.basicDetails.documentNumber}</p>
              </div>
            )}

            {formData.buyers.length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-2">கிரையம் வாங்கியவர்:</h3>
                {formData.buyers.map((buyer, index) => (
                  <div key={index} className="ml-4 mb-2">
                    <p>{buyer.name}</p>
                    {buyer.relationDetails && <p>{buyer.relationDetails}</p>}
                    {buyer.address && <p>முகவரி: {buyer.address}</p>}
                  </div>
                ))}
              </div>
            )}

            {formData.sellers.length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-2">கிரையம் கொடுத்தவர்:</h3>
                {formData.sellers.map((seller, index) => (
                  <div key={index} className="ml-4 mb-2">
                    <p>{seller.name}</p>
                    {seller.relationDetails && <p>{seller.relationDetails}</p>}
                    {seller.address && <p>முகவரி: {seller.address}</p>}
                  </div>
                ))}
              </div>
            )}

            {formData.propertyDetails.propertyName && (
              <div>
                <h3 className="text-lg font-medium mb-2">சொத்து விவரங்கள்:</h3>
                <div className="ml-4">
                  <p>{formData.propertyDetails.propertyName}</p>
                  {formData.propertyDetails.surveyNumber && <p>சர்வே எண்: {formData.propertyDetails.surveyNumber}</p>}
                  {formData.propertyDetails.propertyDetails && <p>{formData.propertyDetails.propertyDetails}</p>}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {formData.witnesses.length > 0 && (
        <Card className="border-2 border-gray-300 mt-4">
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-4">சாட்சிகள்:</h3>

            {formData.witnesses.map((witness, index) => (
              <div key={index} className="mb-4">
                <p>
                  {index + 1}. பெயர்: {witness.name}
                </p>
                <p className="ml-3">முகவரி: {witness.address}</p>
              </div>
            ))}

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div>
                <p className="font-medium">கிரையம் வாங்கியவர்:</p>
                {formData.buyers[0]?.name && <p>{formData.buyers[0].name}</p>}
                {formData.buyers[0]?.address && <p>முகவரி: {formData.buyers[0].address}</p>}
              </div>

              <div>
                <p className="font-medium">கிரையம் கொடுத்தவர்:</p>
                {formData.sellers[0]?.name && <p>{formData.sellers[0].name}</p>}
                {formData.sellers[0]?.address && <p>முகவரி: {formData.sellers[0].address}</p>}
              </div>
            </div>

            <div className="mt-6">
              <p className="font-medium">ஆவணம் எழுதியவர்:</p>
              <p>பெயர்: </p>
              <p>முகவரி: </p>
            </div>

            <div className="mt-6 border-t pt-4">
              <p className="text-center">கைரேகை</p>
              <p className="text-center">(கிரையம் கொடுத்தவர்)</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
