import { getSupabaseServerClient } from "@/lib/supabase"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = getSupabaseServerClient()

    // Check if the bucket exists
    const { data: buckets } = await supabase.storage.listBuckets()

    const bucketExists = buckets?.some((bucket) => bucket.name === "document-assets")

    // Create the bucket if it doesn't exist
    if (!bucketExists) {
      const { error } = await supabase.storage.createBucket("document-assets", {
        public: true,
        fileSizeLimit: 10485760, // 10MB
        allowedMimeTypes: ["image/png", "image/jpeg", "image/gif", "image/webp"],
      })

      if (error) {
        throw error
      }
    }

    return NextResponse.json({ success: true, message: "Storage bucket initialized" })
  } catch (error: any) {
    console.error("Error initializing storage:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
