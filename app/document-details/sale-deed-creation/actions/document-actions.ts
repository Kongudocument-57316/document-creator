"use server"

import { getSupabaseServerClient } from "@/lib/supabase"
import { v4 as uuidv4 } from "uuid"

export async function saveDocumentContent(documentId: string | undefined, content: string, formData: any) {
  try {
    const supabase = getSupabaseServerClient()

    if (!supabase) {
      console.error("Failed to initialize Supabase client")
      return { success: false, error: "Database connection error" }
    }

    // If no document ID, create a new one
    const id = documentId || uuidv4()

    const deedId = formData.id || null

    // Prepare data for saving
    const documentData = {
      id,
      content,
      deed_id: deedId,
      created_at: documentId ? undefined : new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    // Upsert the document (insert if not exists, update if exists)
    const { error } = await supabase.from("sale_deed_documents").upsert(documentData)

    if (error) {
      console.error("Error saving document content:", error)
      return { success: false, error: error.message }
    }

    return { success: true, id }
  } catch (error: any) {
    console.error("Unexpected error saving document content:", error)
    return { success: false, error: "Unexpected error occurred" }
  }
}

export async function ensureDocumentTemplatesExist() {
  try {
    const supabase = getSupabaseServerClient()

    if (!supabase) {
      console.error("Failed to initialize Supabase client")
      return { success: false, error: "Database connection error" }
    }

    // Check if any templates exist
    const { data: existingTemplates, error: countError } = await supabase
      .from("document_templates")
      .select("id")
      .limit(1)

    if (countError) {
      console.error("Error checking templates:", countError)
      return { success: false, error: countError.message }
    }

    // If no templates exist, create a default one
    if (!existingTemplates || existingTemplates.length === 0) {
      const defaultTemplate = {
        id: uuidv4(),
        name: "இயல்புநிலை கிரைய பத்திர வார்ப்புரு",
        content: `<h1 style="text-align: center;">கிரைய பத்திரம்</h1>
<p>&nbsp;</p>
<p><strong>ஆவண எண்:</strong> {{deed.documentNumber}}</p>
<p><strong>பதிவு தேதி:</strong> {{deed.documentDate}}</p>
<p>&nbsp;</p>
<p>இந்த கிரைய பத்திரம் {{deed.documentDate}} அன்று பின்வரும் நபர்களுக்கிடையே செய்து கொள்ளப்படுகிறது:</p>
<p>&nbsp;</p>
<p><strong>விற்பனையாளர்(கள்):</strong></p>
<p>திரு/திருமதி {{seller[0].name}}, {{seller[0].address}} (இனி "விற்பனையாளர்" என அழைக்கப்படுவார்)</p>
<p>&nbsp;</p>
<p><strong>வாங்குபவர்(கள்):</strong></p>
<p>திரு/திருமதி {{buyer[0].name}}, {{buyer[0].address}} (இனி "வாங்குபவர்" என அழைக்கப்படுவார்)</p>
<p>&nbsp;</p>
<p><strong>சொத்து விவரங்கள்:</strong></p>
<p>கதவு எண்: {{property.doorNo}}, {{property.addressLine}}, {{property.district}}</p>
<p>&nbsp;</p>
<p><strong>விற்பனை விலை:</strong> ரூபாய் {{payment.totalAmount}} ({{payment.amountInWords}} மட்டும்)</p>
<p>&nbsp;</p>
<p><strong>விற்பனை நிபந்தனைகள்:</strong></p>
<ol>
<li>விற்பனையாளர், மேற்கூறிய சொத்தின் முழு உரிமையை வாங்குபவருக்கு மாற்றுகிறார்.</li>
<li>இந்த சொத்து எந்த வகையிலும் அடமானம் வைக்கப்படவில்லை மற்றும் சட்டப்பூர்வ தடைகள் எதுவும் இல்லை.</li>
<li>வாங்குபவர் சொத்தின் முழு உரிமையையும் அனுபவிக்க உரிமை பெறுகிறார்.</li>
</ol>
<p>&nbsp;</p>
<p><strong>சாட்சிகள் முன்னிலையில், விற்பனையாளர் மற்றும் வாங்குபவர் இந்த ஆவணத்தில் கையெழுத்திட்டனர்.</strong></p>
<p>&nbsp;</p>
<p>விற்பனையாளர் கையொப்பம்:</p>
<p>&nbsp;</p>
<p>வாங்குபவர் கையொப்பம்:</p>
<p>&nbsp;</p>
<p>சாட்சிகள்:</p>
<p>1.</p>
<p>2.</p>`,
        is_default: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      const { error: insertError } = await supabase.from("document_templates").insert([defaultTemplate])

      if (insertError) {
        console.error("Error creating default template:", insertError)
        return { success: false, error: insertError.message }
      }
    }

    return { success: true }
  } catch (error: any) {
    console.error("Unexpected error ensuring templates exist:", error)
    return { success: false, error: "Unexpected error occurred" }
  }
}
