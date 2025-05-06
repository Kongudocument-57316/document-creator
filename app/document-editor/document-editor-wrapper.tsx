"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { RichTextEditor } from "./rich-text-editor"
import { DocumentTemplates } from "./document-templates"
import { DocumentExport } from "./document-export"
import { getSupabaseBrowserClient } from "@/lib/supabase"
import { ensureDocumentTemplatesExist } from "@/lib/document-utils"
import { toast } from "sonner"

export function DocumentEditorWrapper() {
  const [activeTab, setActiveTab] = useState("editor")
  const [documentTitle, setDocumentTitle] = useState("")
  const [documentContent, setDocumentContent] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [supabase, setSupabase] = useState(() => {
    try {
      return getSupabaseBrowserClient()
    } catch (error) {
      console.error("Failed to initialize Supabase client:", error)
      return null
    }
  })

  useEffect(() => {
    // Initialize document templates and storage bucket
    const initialize = async () => {
      try {
        // Check if Supabase environment variables exist
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
          throw new Error("Supabase environment variables are not configured properly")
        }

        // Ensure document templates exist
        await ensureDocumentTemplatesExist()

        // Get the Supabase client safely
        const supabaseClient = getSupabaseBrowserClient()

        // Initialize storage bucket
        const { data: buckets } = await supabaseClient.storage.listBuckets()
        if (!buckets?.find((bucket) => bucket.name === "document-assets")) {
          await supabaseClient.storage.createBucket("document-assets", {
            public: true,
          })
        }
      } catch (error) {
        console.error("Error initializing:", error)
        toast.error(`ஆரம்பமாக்குவதில் பிழை: ${error instanceof Error ? error.message : "Unknown error"}`)
      }
    }

    initialize()
  }, [])

  const handleSaveDocument = async () => {
    if (!documentTitle.trim()) {
      toast.error("ஆவணத்திற்கு தலைப்பு தேவை")
      return
    }

    if (!supabase) {
      toast.error("Supabase சேவையை அணுக முடியவில்லை. மீண்டும் முயற்சிக்கவும்.")
      return
    }

    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from("saved_documents")
        .insert({
          title: documentTitle,
          content: documentContent,
        })
        .select()

      if (error) throw error

      toast.success("ஆவணம் வெற்றிகரமாக சேமிக்கப்பட்டது")
    } catch (error: any) {
      toast.error(`ஆவணத்தை சேமிக்க முடியவில்லை: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <label htmlFor="document-title" className="text-sm font-medium text-gray-700">
          ஆவண தலைப்பு
        </label>
        <Input
          id="document-title"
          value={documentTitle}
          onChange={(e) => setDocumentTitle(e.target.value)}
          className="border-purple-200 focus-visible:ring-purple-400"
          placeholder="ஆவண தலைப்பை உள்ளிடவும்"
        />
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSaveDocument} disabled={isLoading} className="bg-purple-600 hover:bg-purple-700">
          {isLoading ? "சேமிக்கிறது..." : "ஆவணத்தை சேமி"}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="editor">ஆவண திருத்தி</TabsTrigger>
          <TabsTrigger value="templates">வார்ப்புருக்கள்</TabsTrigger>
          <TabsTrigger value="export">ஏற்றுமதி</TabsTrigger>
        </TabsList>
        <TabsContent value="editor">
          <Card>
            <CardHeader>
              <CardTitle>ஆவண திருத்தி</CardTitle>
              <CardDescription>உங்கள் ஆவணத்தை உருவாக்கவும் மற்றும் வடிவமைக்கவும்</CardDescription>
            </CardHeader>
            <CardContent>
              <RichTextEditor content={documentContent} onContentChange={setDocumentContent} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="templates">
          <DocumentTemplates
            onTemplateSelect={(template) => {
              setDocumentContent(template.content)
              setDocumentTitle(template.title)
              setActiveTab("editor")
            }}
          />
        </TabsContent>
        <TabsContent value="export">
          <DocumentExport title={documentTitle} content={documentContent} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
