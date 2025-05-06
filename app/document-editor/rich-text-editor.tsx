"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Type,
  ImageIcon,
} from "lucide-react"
import { toast } from "sonner"
import { getSupabaseBrowserClient } from "@/lib/supabase"

interface RichTextEditorProps {
  content: string
  onContentChange: (content: string) => void
}

export function RichTextEditor({ content, onContentChange }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = content
    }
  }, [])

  const execCommand = (command: string, value = "") => {
    document.execCommand(command, false, value)
    if (editorRef.current) {
      onContentChange(editorRef.current.innerHTML)
    }
  }

  const handleEditorChange = () => {
    if (editorRef.current) {
      onContentChange(editorRef.current.innerHTML)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const supabase = getSupabaseBrowserClient()
    if (!supabase) {
      toast.error("Supabase சேவையை அணுக முடியவில்லை")
      return
    }

    setIsUploading(true)
    try {
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("படம் 5MB க்கு குறைவாக இருக்க வேண்டும்")
        return
      }

      // Check file type
      if (!file.type.startsWith("image/")) {
        toast.error("படம் மட்டுமே அனுமதிக்கப்படும்")
        return
      }

      const fileName = `${Date.now()}-${file.name}`

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage.from("document-assets").upload(fileName, file)

      if (error) {
        throw error
      }

      // Get public URL
      const { data: urlData } = supabase.storage.from("document-assets").getPublicUrl(fileName)

      // Insert image into editor
      execCommand("insertImage", urlData.publicUrl)
      toast.success("படம் வெற்றிகரமாக சேர்க்கப்பட்டது")
    } catch (error: any) {
      console.error("Image upload error:", error)
      toast.error(`படத்தை பதிவேற்ற முடியவில்லை: ${error.message}`)
    } finally {
      setIsUploading(false)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  return (
    <div className="border rounded-md overflow-hidden">
      <div className="bg-gray-50 p-2 border-b flex flex-wrap gap-1">
        <Button type="button" variant="ghost" size="sm" onClick={() => execCommand("bold")} className="h-8 w-8 p-0">
          <Bold className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => execCommand("italic")} className="h-8 w-8 p-0">
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => execCommand("underline")}
          className="h-8 w-8 p-0"
        >
          <Underline className="h-4 w-4" />
        </Button>
        <span className="border-r mx-1 h-8"></span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => execCommand("justifyLeft")}
          className="h-8 w-8 p-0"
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => execCommand("justifyCenter")}
          className="h-8 w-8 p-0"
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => execCommand("justifyRight")}
          className="h-8 w-8 p-0"
        >
          <AlignRight className="h-4 w-4" />
        </Button>
        <span className="border-r mx-1 h-8"></span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => execCommand("insertUnorderedList")}
          className="h-8 w-8 p-0"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => execCommand("insertOrderedList")}
          className="h-8 w-8 p-0"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <span className="border-r mx-1 h-8"></span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => execCommand("formatBlock", "<h1>")}
          className="h-8 w-8 p-0"
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => execCommand("formatBlock", "<h2>")}
          className="h-8 w-8 p-0"
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => execCommand("formatBlock", "<h3>")}
          className="h-8 w-8 p-0"
        >
          <Heading3 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => execCommand("formatBlock", "<p>")}
          className="h-8 w-8 p-0"
        >
          <Type className="h-4 w-4" />
        </Button>
        <span className="border-r mx-1 h-8"></span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="h-8 px-2"
        >
          <ImageIcon className="h-4 w-4 mr-1" />
          {isUploading ? "பதிவேற்றுகிறது..." : "படம்"}
        </Button>
        <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
      </div>
      <div
        ref={editorRef}
        contentEditable
        className="min-h-[400px] p-4 focus:outline-none"
        onInput={handleEditorChange}
        onBlur={handleEditorChange}
      />
    </div>
  )
}
