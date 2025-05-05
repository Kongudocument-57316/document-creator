import { format } from "date-fns"

interface SaleDeedPdfTemplateProps {
  formData: any
  registrationOfficeName?: string
  documentPreparerName?: string
  typingOfficeName?: string
  subRegistrarOfficeName?: string
  bookNumberName?: string
  documentTypeName?: string
  landTypeName?: string
  paymentMethodNames?: { [key: string]: string }
  districtNames?: { [key: string]: string }
  talukNames?: { [key: string]: string }
  villageNames?: { [key: string]: string }
  valueTypeNames?: { [key: string]: string }
}

export function SaleDeedPdfTemplate({
  formData,
  registrationOfficeName,
  documentPreparerName,
  typingOfficeName,
  subRegistrarOfficeName,
  bookNumberName,
  documentTypeName,
  landTypeName,
  paymentMethodNames = {},
  districtNames = {},
  talukNames = {},
  villageNames = {},
  valueTypeNames = {},
}: SaleDeedPdfTemplateProps) {
  const { deed, buyer, seller, previousDoc, property, payment, witness } = formData

  // Format date for display
  const formatDate = (date: string | Date | null) => {
    if (!date) return ""
    try {
      return format(new Date(date), "dd/MM/yyyy")
    } catch (error) {
      return ""
    }
  }

  return (
    <div className="sale-deed-pdf" style={{ fontFamily: "Arial, sans-serif", padding: "20px", maxWidth: "800px" }}>
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "10px" }}>கிரைய ஆவணம்</h1>
        <h2 style={{ fontSize: "18px", fontWeight: "bold" }}>SALE DEED</h2>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <h3 style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "10px", borderBottom: "1px solid #ccc" }}>
          ஆவண விவரங்கள் (Document Details)
        </h3>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <tbody>
            <tr>
              <td style={{ padding: "5px", width: "40%" }}>
                <strong>பதிவு அலுவலகம் (Registration Office):</strong>
              </td>
              <td style={{ padding: "5px" }}>{registrationOfficeName || ""}</td>
            </tr>
            <tr>
              <td style={{ padding: "5px" }}>
                <strong>தேதி (Date):</strong>
              </td>
              <td style={{ padding: "5px" }}>
                {deed.day || ""}/{deed.month || ""}/{deed.year || ""}
              </td>
            </tr>
            <tr>
              <td style={{ padding: "5px" }}>
                <strong>ஆவணம் தயாரித்தவர் (Document Preparer):</strong>
              </td>
              <td style={{ padding: "5px" }}>{documentPreparerName || ""}</td>
            </tr>
            <tr>
              <td style={{ padding: "5px" }}>
                <strong>தொலைபேசி எண் (Phone Number):</strong>
              </td>
              <td style={{ padding: "5px" }}>{deed.phoneNumber || ""}</td>
            </tr>
            <tr>
              <td style={{ padding: "5px" }}>
                <strong>தட்டச்சு அலுவலகம் (Typing Office):</strong>
              </td>
              <td style={{ padding: "5px" }}>{typingOfficeName || ""}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {buyer && buyer.length > 0 && (
        <div style={{ marginBottom: "20px" }}>
          <h3 style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "10px", borderBottom: "1px solid #ccc" }}>
            வாங்குபவர் விவரங்கள் (Buyer Details)
          </h3>
          {buyer.map((b: any, index: number) => (
            <div key={index} style={{ marginBottom: "15px" }}>
              <h4 style={{ fontSize: "14px", fontWeight: "bold", marginBottom: "5px" }}>வாங்குபவர் #{index + 1}</h4>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <tbody>
                  <tr>
                    <td style={{ padding: "5px", width: "40%" }}>
                      <strong>பெயர் (Name):</strong>
                    </td>
                    <td style={{ padding: "5px" }}>{b.name || ""}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "5px" }}>
                      <strong>வயது (Age):</strong>
                    </td>
                    <td style={{ padding: "5px" }}>{b.age || ""}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "5px" }}>
                      <strong>உறவு முறை (Relation Type):</strong>
                    </td>
                    <td style={{ padding: "5px" }}>{b.relationType || ""}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "5px" }}>
                      <strong>உறவினர் பெயர் (Relation Name):</strong>
                    </td>
                    <td style={{ padding: "5px" }}>{b.relationName || ""}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "5px" }}>
                      <strong>முகவரி (Address):</strong>
                    </td>
                    <td style={{ padding: "5px" }}>
                      {b.doorNo ? `${b.doorNo}, ` : ""}
                      {b.address1 ? `${b.address1}, ` : ""}
                      {b.address2 ? `${b.address2}, ` : ""}
                      {b.address3 ? `${b.address3}, ` : ""}
                      {districtNames[b.districtId] ? `${districtNames[b.districtId]}, ` : ""}
                      {talukNames[b.talukId] ? `${talukNames[b.talukId]}, ` : ""}
                      {b.pincode ? `${b.pincode}` : ""}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: "5px" }}>
                      <strong>ஆதார் எண் (Aadhar No):</strong>
                    </td>
                    <td style={{ padding: "5px" }}>{b.aadharNo || ""}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "5px" }}>
                      <strong>கைபேசி எண் (Phone No):</strong>
                    </td>
                    <td style={{ padding: "5px" }}>{b.phoneNo || ""}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}

      {seller && seller.length > 0 && (
        <div style={{ marginBottom: "20px" }}>
          <h3 style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "10px", borderBottom: "1px solid #ccc" }}>
            விற்பனையாளர் விவரங்கள் (Seller Details)
          </h3>
          {seller.map((s: any, index: number) => (
            <div key={index} style={{ marginBottom: "15px" }}>
              <h4 style={{ fontSize: "14px", fontWeight: "bold", marginBottom: "5px" }}>விற்பனையாளர் #{index + 1}</h4>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <tbody>
                  <tr>
                    <td style={{ padding: "5px", width: "40%" }}>
                      <strong>பெயர் (Name):</strong>
                    </td>
                    <td style={{ padding: "5px" }}>{s.name || ""}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "5px" }}>
                      <strong>வயது (Age):</strong>
                    </td>
                    <td style={{ padding: "5px" }}>{s.age || ""}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "5px" }}>
                      <strong>உறவு முறை (Relation Type):</strong>
                    </td>
                    <td style={{ padding: "5px" }}>{s.relationType || ""}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "5px" }}>
                      <strong>உறவினர் பெயர் (Relation Name):</strong>
                    </td>
                    <td style={{ padding: "5px" }}>{s.relationName || ""}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "5px" }}>
                      <strong>முகவரி (Address):</strong>
                    </td>
                    <td style={{ padding: "5px" }}>
                      {s.doorNo ? `${s.doorNo}, ` : ""}
                      {s.address1 ? `${s.address1}, ` : ""}
                      {s.address2 ? `${s.address2}, ` : ""}
                      {s.address3 ? `${s.address3}, ` : ""}
                      {districtNames[s.districtId] ? `${districtNames[s.districtId]}, ` : ""}
                      {talukNames[s.talukId] ? `${talukNames[s.talukId]}, ` : ""}
                      {s.pincode ? `${s.pincode}` : ""}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: "5px" }}>
                      <strong>ஆதார் எண் (Aadhar No):</strong>
                    </td>
                    <td style={{ padding: "5px" }}>{s.aadharNo || ""}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "5px" }}>
                      <strong>கைபேசி எண் (Phone No):</strong>
                    </td>
                    <td style={{ padding: "5px" }}>{s.phoneNo || ""}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}

      {previousDoc && (
        <div style={{ marginBottom: "20px" }}>
          <h3 style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "10px", borderBottom: "1px solid #ccc" }}>
            முந்தைய ஆவண விவரங்கள் (Previous Document Details)
          </h3>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              <tr>
                <td style={{ padding: "5px", width: "40%" }}>
                  <strong>விற்பனையாளர் வகை (Seller Type):</strong>
                </td>
                <td style={{ padding: "5px" }}>
                  {previousDoc.sellerType === "single"
                    ? "ஒற்றை விற்பனையாளர் (Single Seller)"
                    : previousDoc.sellerType === "multiple"
                      ? "பல விற்பனையாளர்கள் (Multiple Sellers)"
                      : "பல விற்பனையாளர்கள் ஒரே ஆவணம் (Multiple Sellers Single Document)"}
                </td>
              </tr>
              <tr>
                <td style={{ padding: "5px" }}>
                  <strong>முந்தைய ஆவண தேதி (Previous Document Date):</strong>
                </td>
                <td style={{ padding: "5px" }}>{formatDate(previousDoc.previousDocDate)}</td>
              </tr>
              <tr>
                <td style={{ padding: "5px" }}>
                  <strong>சார்பதிவாளர் அலுவலகம் (Sub Register Office):</strong>
                </td>
                <td style={{ padding: "5px" }}>{subRegistrarOfficeName || ""}</td>
              </tr>
              <tr>
                <td style={{ padding: "5px" }}>
                  <strong>புத்தகம் எண் (Book No):</strong>
                </td>
                <td style={{ padding: "5px" }}>{bookNumberName || ""}</td>
              </tr>
              <tr>
                <td style={{ padding: "5px" }}>
                  <strong>ஆவண வருடம் (Document Year):</strong>
                </td>
                <td style={{ padding: "5px" }}>{previousDoc.documentYear || ""}</td>
              </tr>
              <tr>
                <td style={{ padding: "5px" }}>
                  <strong>ஆவண எண் (Document No):</strong>
                </td>
                <td style={{ padding: "5px" }}>{previousDoc.documentNumber || ""}</td>
              </tr>
              <tr>
                <td style={{ padding: "5px" }}>
                  <strong>ஆவண வகை (Document Type):</strong>
                </td>
                <td style={{ padding: "5px" }}>{documentTypeName || ""}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {property && (
        <div style={{ marginBottom: "20px" }}>
          <h3 style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "10px", borderBottom: "1px solid #ccc" }}>
            சொத்து விவரங்கள் (Property Details)
          </h3>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              <tr>
                <td style={{ padding: "5px", width: "40%" }}>
                  <strong>பதிவு மாவட்டம் (Registration District):</strong>
                </td>
                <td style={{ padding: "5px" }}>{districtNames[property.registrationDistrictId] || ""}</td>
              </tr>
              <tr>
                <td style={{ padding: "5px" }}>
                  <strong>சார்பதிவாளர் அலுவலகம் (Sub Register Office):</strong>
                </td>
                <td style={{ padding: "5px" }}>{subRegistrarOfficeName || ""}</td>
              </tr>
              <tr>
                <td style={{ padding: "5px" }}>
                  <strong>மாவட்டம் (District):</strong>
                </td>
                <td style={{ padding: "5px" }}>{districtNames[property.districtId] || ""}</td>
              </tr>
              <tr>
                <td style={{ padding: "5px" }}>
                  <strong>வட்டம் (Taluk):</strong>
                </td>
                <td style={{ padding: "5px" }}>{talukNames[property.talukId] || ""}</td>
              </tr>
              <tr>
                <td style={{ padding: "5px" }}>
                  <strong>கிராமம் (Village):</strong>
                </td>
                <td style={{ padding: "5px" }}>{villageNames[property.villageId] || ""}</td>
              </tr>
              <tr>
                <td style={{ padding: "5px" }}>
                  <strong>நில வகை (Land Type):</strong>
                </td>
                <td style={{ padding: "5px" }}>{landTypeName || ""}</td>
              </tr>
              <tr>
                <td style={{ padding: "5px" }}>
                  <strong>சொத்து விவரம் (Property Description):</strong>
                </td>
                <td style={{ padding: "5px" }}>{property.propertyDescription || ""}</td>
              </tr>
              <tr>
                <td style={{ padding: "5px" }}>
                  <strong>மொத்த மதிப்பு (Total Value):</strong>
                </td>
                <td style={{ padding: "5px" }}>₹ {property.totalValue || "0.00"}</td>
              </tr>
            </tbody>
          </table>

          {property.otherDetails && property.otherDetails.length > 0 && (
            <div style={{ marginTop: "15px" }}>
              <h4 style={{ fontSize: "14px", fontWeight: "bold", marginBottom: "5px" }}>இதர விவரங்கள் (Other Details)</h4>
              <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #ccc" }}>
                <thead>
                  <tr style={{ backgroundColor: "#f0f0f0" }}>
                    <th style={{ padding: "5px", border: "1px solid #ccc", textAlign: "left" }}>
                      மதிப்பு வகை (Value Type)
                    </th>
                    <th style={{ padding: "5px", border: "1px solid #ccc", textAlign: "left" }}>தொகை (Amount)</th>
                    <th style={{ padding: "5px", border: "1px solid #ccc", textAlign: "left" }}>
                      விளக்கம் (Description)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {property.otherDetails.map((detail: any, index: number) => (
                    <tr key={index}>
                      <td style={{ padding: "5px", border: "1px solid #ccc" }}>
                        {valueTypeNames[detail.valueTypeId] || ""}
                      </td>
                      <td style={{ padding: "5px", border: "1px solid #ccc" }}>₹ {detail.amount || "0.00"}</td>
                      <td style={{ padding: "5px", border: "1px solid #ccc" }}>{detail.description || ""}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {payment && payment.length > 0 && (
        <div style={{ marginBottom: "20px" }}>
          <h3 style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "10px", borderBottom: "1px solid #ccc" }}>
            பணப்பட்டுவாடா விவரங்கள் (Payment Details)
          </h3>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              <tr>
                <td style={{ padding: "5px", width: "40%" }}>
                  <strong>கிரையத் தொகை (Sale Amount):</strong>
                </td>
                <td style={{ padding: "5px" }}>₹ {payment.saleAmount || "0.00"}</td>
              </tr>
              <tr>
                <td style={{ padding: "5px" }}>
                  <strong>தொகை (எழுத்துகளில்) (Amount in Words):</strong>
                </td>
                <td style={{ padding: "5px" }}>{payment.amountInWords || ""}</td>
              </tr>
            </tbody>
          </table>

          {payment
            .filter((p: any) => typeof p === "object")
            .map((p: any, index: number) => (
              <div key={index} style={{ marginTop: "15px" }}>
                <h4 style={{ fontSize: "14px", fontWeight: "bold", marginBottom: "5px" }}>
                  பணப்பட்டுவாடா விவரங்கள் #{index + 1}
                </h4>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <tbody>
                    <tr>
                      <td style={{ padding: "5px", width: "40%" }}>
                        <strong>இருந்து (From):</strong>
                      </td>
                      <td style={{ padding: "5px" }}>
                        {p.fromId === "buyer1" ? "வாங்குபவர் 1" : p.fromId === "buyer2" ? "வாங்குபவர் 2" : p.fromId || ""}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ padding: "5px" }}>
                        <strong>க்கு (To):</strong>
                      </td>
                      <td style={{ padding: "5px" }}>
                        {p.toId === "seller1" ? "விற்பனையாளர் 1" : p.toId === "seller2" ? "விற்பனையாளர் 2" : p.toId || ""}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ padding: "5px" }}>
                        <strong>தொகை (Amount):</strong>
                      </td>
                      <td style={{ padding: "5px" }}>₹ {p.amount || "0.00"}</td>
                    </tr>
                    <tr>
                      <td style={{ padding: "5px" }}>
                        <strong>தொகை (எழுத்துகளில்) (Amount in Words):</strong>
                      </td>
                      <td style={{ padding: "5px" }}>{p.amountInWords || ""}</td>
                    </tr>
                    <tr>
                      <td style={{ padding: "5px" }}>
                        <strong>பணப்பட்டுவாடா முறை (Payment Method):</strong>
                      </td>
                      <td style={{ padding: "5px" }}>{paymentMethodNames[p.paymentMethodId] || ""}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ))}
        </div>
      )}

      {witness && witness.length > 0 && (
        <div style={{ marginBottom: "20px" }}>
          <h3 style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "10px", borderBottom: "1px solid #ccc" }}>
            சாட்சி விவரங்கள் (Witness Details)
          </h3>
          {witness.map((w: any, index: number) => (
            <div key={index} style={{ marginBottom: "15px" }}>
              <h4 style={{ fontSize: "14px", fontWeight: "bold", marginBottom: "5px" }}>சாட்சி #{index + 1}</h4>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <tbody>
                  <tr>
                    <td style={{ padding: "5px", width: "40%" }}>
                      <strong>பெயர் (Name):</strong>
                    </td>
                    <td style={{ padding: "5px" }}>{w.name || ""}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "5px" }}>
                      <strong>வயது (Age):</strong>
                    </td>
                    <td style={{ padding: "5px" }}>{w.age || ""}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "5px" }}>
                      <strong>உறவு முறை (Relation Type):</strong>
                    </td>
                    <td style={{ padding: "5px" }}>{w.relationType || ""}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "5px" }}>
                      <strong>உறவினர் பெயர் (Relation Name):</strong>
                    </td>
                    <td style={{ padding: "5px" }}>{w.relationName || ""}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "5px" }}>
                      <strong>முகவரி (Address):</strong>
                    </td>
                    <td style={{ padding: "5px" }}>
                      {w.doorNo ? `${w.doorNo}, ` : ""}
                      {w.address1 ? `${w.address1}, ` : ""}
                      {w.address2 ? `${w.address2}, ` : ""}
                      {w.address3 ? `${w.address3}, ` : ""}
                      {districtNames[w.districtId] ? `${districtNames[w.districtId]}, ` : ""}
                      {talukNames[w.talukId] ? `${talukNames[w.talukId]}, ` : ""}
                      {w.pincode ? `${w.pincode}` : ""}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: "5px" }}>
                      <strong>ஆதார் எண் (Aadhar No):</strong>
                    </td>
                    <td style={{ padding: "5px" }}>{w.aadharNo || ""}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: "40px" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ width: "45%" }}>
            <p style={{ marginBottom: "60px", fontWeight: "bold" }}>வாங்குபவர் கையொப்பம் (Buyer's Signature)</p>
            <div style={{ borderTop: "1px solid #000", marginBottom: "10px" }}></div>
            {buyer &&
              buyer.length > 0 &&
              buyer.map((b: any, index: number) => <p key={index}>{b.name || `வாங்குபவர் ${index + 1}`}</p>)}
          </div>
          <div style={{ width: "45%" }}>
            <p style={{ marginBottom: "60px", fontWeight: "bold" }}>விற்பனையாளர் கையொப்பம் (Seller's Signature)</p>
            <div style={{ borderTop: "1px solid #000", marginBottom: "10px" }}></div>
            {seller &&
              seller.length > 0 &&
              seller.map((s: any, index: number) => <p key={index}>{s.name || `விற்பனையாளர் ${index + 1}`}</p>)}
          </div>
        </div>

        <div style={{ marginTop: "40px" }}>
          <p style={{ marginBottom: "60px", fontWeight: "bold" }}>சாட்சி கையொப்பம் (Witness Signature)</p>
          <div style={{ borderTop: "1px solid #000", marginBottom: "10px" }}></div>
          {witness &&
            witness.length > 0 &&
            witness.map((w: any, index: number) => (
              <p key={index} style={{ display: "inline-block", marginRight: "20px" }}>
                {w.name || `சாட்சி ${index + 1}`}
              </p>
            ))}
        </div>
      </div>
    </div>
  )
}

export default SaleDeedPdfTemplate
