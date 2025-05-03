import { formatDate } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface DocumentPreviewProps {
  document: any
}

export function DocumentPreview({ document }: DocumentPreviewProps) {
  return (
    <div className="space-y-6">
      {/* Basic Details */}
      <Card className="border-l-4 border-cyan-400 bg-gradient-to-br from-cyan-50 to-white shadow-md">
        <CardHeader className="bg-cyan-100/50 pb-2">
          <CardTitle className="text-lg font-medium text-cyan-800">அடிப்படை தகவல்</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">ஆவண எண்</p>
              <p className="text-base font-medium">{document.document_number || "-"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">ஆவண தேதி</p>
              <p className="text-base font-medium">
                {document.document_date ? formatDate(document.document_date) : "-"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">கடன் தொகை</p>
              <p className="text-base font-medium text-emerald-700">
                ₹ {document.loan_amount?.toLocaleString() || "-"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">வட்டி விகிதம்</p>
              <p className="text-base font-medium">{document.interest_rate || "-"}%</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">கடன் காலம்</p>
              <p className="text-base font-medium">
                {document.loan_duration || "-"} {document.loan_duration_type || "-"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">கடன் தொடக்க தேதி</p>
              <p className="text-base font-medium">
                {document.loan_start_date ? formatDate(document.loan_start_date) : "-"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Buyer Details */}
      <Card className="border-l-4 border-purple-400 bg-gradient-to-br from-purple-50 to-white shadow-md">
        <CardHeader className="bg-purple-100/50 pb-2">
          <CardTitle className="text-lg font-medium text-purple-800">வாங்குபவர் விவரம் (கடன் பெறுபவர்)</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">பெயர்</p>
              <p className="text-base font-medium">{document.buyer_name || "-"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">வயது</p>
              <p className="text-base font-medium">{document.buyer_age || "-"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">உறவினர் பெயர்</p>
              <p className="text-base font-medium">{document.buyer_relations_name || "-"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">உறவு முறை</p>
              <p className="text-base font-medium">{document.buyer_relation_type || "-"}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm font-medium text-gray-500">முகவரி</p>
              <p className="text-base font-medium">
                {[
                  document.buyer_door_no,
                  document.buyer_address_line1,
                  document.buyer_address_line2,
                  document.buyer_address_line3,
                  document.buyer_taluk,
                  document.buyer_district,
                  document.buyer_pincode,
                ]
                  .filter(Boolean)
                  .join(", ") || "-"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">ஆதார் எண்</p>
              <p className="text-base font-medium">{document.buyer_aadhar_no || "-"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">தொலைபேசி எண்</p>
              <p className="text-base font-medium">{document.buyer_phone_no || "-"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Seller Details */}
      <Card className="border-l-4 border-green-400 bg-gradient-to-br from-green-50 to-white shadow-md">
        <CardHeader className="bg-green-100/50 pb-2">
          <CardTitle className="text-lg font-medium text-green-800">விற்பவர் விவரம் (கடன் கொடுப்பவர்)</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">பெயர்</p>
              <p className="text-base font-medium">{document.seller_name || "-"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">வயது</p>
              <p className="text-base font-medium">{document.seller_age || "-"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">உறவினர் பெயர்</p>
              <p className="text-base font-medium">{document.seller_relations_name || "-"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">உறவு முறை</p>
              <p className="text-base font-medium">{document.seller_relation_type || "-"}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm font-medium text-gray-500">முகவரி</p>
              <p className="text-base font-medium">
                {[
                  document.seller_door_no,
                  document.seller_address_line1,
                  document.seller_address_line2,
                  document.seller_address_line3,
                  document.seller_taluk,
                  document.seller_district,
                  document.seller_pincode,
                ]
                  .filter(Boolean)
                  .join(", ") || "-"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">ஆதார் எண்</p>
              <p className="text-base font-medium">{document.seller_aadhar_no || "-"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">தொலைபேசி எண்</p>
              <p className="text-base font-medium">{document.seller_phone_no || "-"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Property Document Details */}
      <Card className="border-l-4 border-amber-400 bg-gradient-to-br from-amber-50 to-white shadow-md">
        <CardHeader className="bg-amber-100/50 pb-2">
          <CardTitle className="text-lg font-medium text-amber-800">சொத்து ஆவண விவரங்கள்</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">ஆவண தேதி</p>
              <p className="text-base font-medium">
                {document.pr_document_date ? formatDate(document.pr_document_date) : "-"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">துணை பதிவாளர் அலுவலகம்</p>
              <p className="text-base font-medium">{document.sub_register_office || "-"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">புத்தக எண்</p>
              <p className="text-base font-medium">{document.pr_book_no || "-"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">ஆவண ஆண்டு</p>
              <p className="text-base font-medium">{document.pr_document_year || "-"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">ஆவண எண்</p>
              <p className="text-base font-medium">{document.pr_document_no || "-"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">ஆவண வகை</p>
              <p className="text-base font-medium">{document.pr_document_type || "-"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Property Details */}
      <Card className="border-l-4 border-amber-400 bg-gradient-to-br from-amber-50 to-white shadow-md">
        <CardHeader className="bg-amber-100/50 pb-2">
          <CardTitle className="text-lg font-medium text-amber-800">சொத்து விவரம்</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div>
            <p className="text-sm font-medium text-gray-500">சொத்து விவரம்</p>
            <p className="text-base font-medium whitespace-pre-wrap">{document.property_details || "-"}</p>
          </div>
        </CardContent>
      </Card>

      {/* Witness 1 Details */}
      <Card className="border-l-4 border-teal-400 bg-gradient-to-br from-teal-50 to-white shadow-md">
        <CardHeader className="bg-teal-100/50 pb-2">
          <CardTitle className="text-lg font-medium text-teal-800">சாட்சி 1 விவரம்</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">பெயர்</p>
              <p className="text-base font-medium">{document.witness1_name || "-"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">வயது</p>
              <p className="text-base font-medium">{document.witness1_age || "-"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">உறவினர் பெயர்</p>
              <p className="text-base font-medium">{document.witness1_relations_name || "-"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">உறவு முறை</p>
              <p className="text-base font-medium">{document.witness1_relation_type || "-"}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm font-medium text-gray-500">முகவரி</p>
              <p className="text-base font-medium">
                {[
                  document.witness1_door_no,
                  document.witness1_address_line1,
                  document.witness1_address_line2,
                  document.witness1_address_line3,
                  document.witness1_taluk,
                  document.witness1_district,
                  document.witness1_pincode,
                ]
                  .filter(Boolean)
                  .join(", ") || "-"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">ஆதார் எண்</p>
              <p className="text-base font-medium">{document.witness1_aadhar_no || "-"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Witness 2 Details */}
      <Card className="border-l-4 border-teal-400 bg-gradient-to-br from-teal-50 to-white shadow-md">
        <CardHeader className="bg-teal-100/50 pb-2">
          <CardTitle className="text-lg font-medium text-teal-800">சாட்சி 2 விவரம்</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">பெயர்</p>
              <p className="text-base font-medium">{document.witness2_name || "-"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">வயது</p>
              <p className="text-base font-medium">{document.witness2_age || "-"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">உறவினர் பெயர்</p>
              <p className="text-base font-medium">{document.witness2_relations_name || "-"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">உறவு முறை</p>
              <p className="text-base font-medium">{document.witness2_relation_type || "-"}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm font-medium text-gray-500">முகவரி</p>
              <p className="text-base font-medium">
                {[
                  document.witness2_door_no,
                  document.witness2_address_line1,
                  document.witness2_address_line2,
                  document.witness2_address_line3,
                  document.witness2_taluk,
                  document.witness2_district,
                  document.witness2_pincode,
                ]
                  .filter(Boolean)
                  .join(", ") || "-"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">ஆதார் எண்</p>
              <p className="text-base font-medium">{document.witness2_aadhar_no || "-"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Typist Details */}
      <Card className="border-l-4 border-blue-400 bg-gradient-to-br from-blue-50 to-white shadow-md">
        <CardHeader className="bg-blue-100/50 pb-2">
          <CardTitle className="text-lg font-medium text-blue-800">டைப்பிஸ்ட் விவரம்</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">டைப்பிஸ்ட் பெயர்</p>
              <p className="text-base font-medium">{document.typist_name || "-"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">அலுவலக பெயர்</p>
              <p className="text-base font-medium">{document.typist_office_name || "-"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">தொலைபேசி எண்</p>
              <p className="text-base font-medium">{document.typist_phone_no || "-"}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
