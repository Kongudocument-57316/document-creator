import { type NextRequest, NextResponse } from "next/server"
import mammoth from "mammoth"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const result = await mammoth.convertToHtml({ buffer })

    return NextResponse.json({ html: result.value })
  } catch (error) {
    console.error("Error converting document:", error)
    return NextResponse.json({ error: "Failed to convert document" }, { status: 500 })
  }
}
