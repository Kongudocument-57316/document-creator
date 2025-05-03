"use client"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface DocumentLivePreviewProps {
  formData: any
  className?: string
}

export function DocumentLivePreview({ formData, className }: DocumentLivePreviewProps) {
  // Format date to Tamil style if available
  const formattedDate = formData.documentDate
    ? new Date(formData.documentDate).toLocaleDateString("ta-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : ""

  return (
    <Card className={cn("w-full h-full overflow-auto", className)}>
      <CardContent className="p-6 font-tamil text-base">
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-center mb-6">பாகபாத்திய விடுதலை ஆவணம்</h2>

          {formData.documentNumber && <p className="text-right">ஆவண எண்: {formData.documentNumber}</p>}

          {formattedDate && <p className="text-right">தேதி: {formattedDate}</p>}

          <div className="space-y-4">
            {formData.firstPartyName && (
              <p>
                இந்த பாகபாத்திய விடுதலை ஆவணம் {formData.firstPartyName || "_________"},
                {formData.firstPartyAge ? ` வயது ${formData.firstPartyAge},` : ""}
                {formData.firstPartyOccupation ? ` தொழில் ${formData.firstPartyOccupation},` : ""}
                {formData.firstPartyAddress ? ` வசிப்பிடம் ${formData.firstPartyAddress}` : ""} (இனி முதல் "முதல் தரப்பினர்"
                என அழைக்கப்படுவார்) மற்றும்
              </p>
            )}

            {formData.secondPartyName && (
              <p>
                {formData.secondPartyName || "_________"},
                {formData.secondPartyAge ? ` வயது ${formData.secondPartyAge},` : ""}
                {formData.secondPartyOccupation ? ` தொழில் ${formData.secondPartyOccupation},` : ""}
                {formData.secondPartyAddress ? ` வசிப்பிடம் ${formData.secondPartyAddress}` : ""} (இனி முதல் "இரண்டாம்
                தரப்பினர்" என அழைக்கப்படுவார்) ஆகியோர் இடையே செய்து கொள்ளப்படுகிறது.
              </p>
            )}

            {formData.propertyDetails && (
              <div className="space-y-2">
                <p className="font-semibold">சொத்து விவரங்கள்:</p>
                <p>{formData.propertyDetails}</p>
              </div>
            )}

            {formData.partitionDetails && (
              <div className="space-y-2">
                <p className="font-semibold">பாகப்பிரிவினை விவரங்கள்:</p>
                <p>{formData.partitionDetails}</p>
              </div>
            )}

            <div className="space-y-2">
              <p className="font-semibold">விடுதலை விவரங்கள்:</p>
              <p>
                மேற்கூறிய சொத்தில் முதல் தரப்பினருக்கு உள்ள உரிமையை இரண்டாம் தரப்பினருக்கு
                {formData.releaseAmount
                  ? ` ரூபாய் ${formData.releaseAmount}/- (${formData.releaseAmountInWords || ""})`
                  : " _________"}
                மதிப்புக்கு முழுமையாக விடுதலை செய்கிறேன். இந்த தொகையை முழுமையாக பெற்றுக் கொண்டேன் என்பதை உறுதி செய்கிறேன்.
              </p>
            </div>

            <div className="space-y-2">
              <p className="font-semibold">உறுதிமொழி:</p>
              <p>
                இந்த சொத்தின் மீது எனக்கு இருந்த அனைத்து உரிமைகளையும் இரண்டாம் தரப்பினருக்கு முழுமையாக மாற்றி விட்டேன். இனி இந்த சொத்தின் மீது
                எனக்கு எந்த உரிமையும் கிடையாது என உறுதியளிக்கிறேன்.
              </p>
            </div>

            <div className="mt-12 flex justify-between">
              <div>
                <p className="font-semibold">சாட்சிகள்:</p>
                <p>1. {formData.witness1Name || "_________"}</p>
                <p>2. {formData.witness2Name || "_________"}</p>
              </div>

              <div className="text-right">
                <p className="font-semibold">கையொப்பம்:</p>
                <p className="mt-6">முதல் தரப்பினர்</p>
                <p className="mt-6">இரண்டாம் தரப்பினர்</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
