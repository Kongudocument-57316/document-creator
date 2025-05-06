import { NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase"

export async function GET() {
  try {
    const supabase = getSupabaseServerClient()

    if (!supabase) {
      return NextResponse.json({ error: "Supabase client not available" }, { status: 500 })
    }

    const { data, error } = await supabase.from("document_templates").select("*").order("title")

    if (error) {
      console.error("Error fetching templates:", error)
      return NextResponse.json({ error: "Failed to fetch templates" }, { status: 500 })
    }

    // If no templates found, return default templates
    if (!data || data.length === 0) {
      const defaultTemplates = [
        {
          id: 1,
          title: "கிரைய பத்திரம்",
          description: "அடிப்படை கிரைய பத்திர வார்ப்புரு",
          content:
            "<h1>கிரைய பத்திரம்</h1><p>இந்த ஆவணம் [விற்பனையாளர் பெயர்] மற்றும் [வாங்குபவர் பெயர்] இடையே [தேதி] அன்று செய்யப்பட்டது.</p><p>சொத்து விவரங்கள்: [சொத்து விவரங்கள்]</p><p>விலை: [விலை]</p>",
          category: "sale_deed",
        },
        {
          id: 2,
          title: "அடமான பத்திரம்",
          description: "அடிப்படை அடமான பத்திர வார்ப்புரு",
          content:
            "<h1>அடமான பத்திரம்</h1><p>இந்த ஆவணம் [அடமானம் வைப்பவர் பெயர்] மற்றும் [அடமானம் பெறுபவர் பெயர்] இடையே [தேதி] அன்று செய்யப்பட்டது.</p><p>சொத்து விவரங்கள்: [சொத்து விவரங்கள்]</p><p>அடமான தொகை: [தொகை]</p>",
          category: "mortgage_deed",
        },
      ]
      return NextResponse.json(defaultTemplates)
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in document templates API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
