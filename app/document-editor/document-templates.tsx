"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getSupabaseBrowserClient } from "@/lib/supabase"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"

interface Template {
  id: string
  title: string
  content: string
  created_at: string
}

interface DocumentTemplatesProps {
  onTemplateSelect: (template: Template) => void
}

export function DocumentTemplates({ onTemplateSelect }: DocumentTemplatesProps) {
  const [templates, setTemplates] = useState<Template[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = getSupabaseBrowserClient()

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const { data, error } = await supabase
          .from("document_templates")
          .select("*")
          .order("title", { ascending: true })

        if (error) throw error

        setTemplates(data || [])
      } catch (error: any) {
        toast.error(`வார்ப்புருக்களை பெறுவதில் பிழை: ${error.message}`)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTemplates()
  }, [])

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-48" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-full" />
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <Skeleton className="h-5 w-32 mb-2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4 mt-2" />
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>ஆவண வார்ப்புருக்கள்</CardTitle>
        <CardDescription>
          வேகமாக தொடங்க ஒரு வார்ப்புருவைத் தேர்ந்தெடுக்கவும். இது உங்கள் ஆவணத்தின் உள்ளடக்கத்தை மாற்றிவிடும்.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {templates.length === 0 ? (
          <p className="text-center text-gray-500 py-4">வார்ப்புருக்கள் எதுவும் கிடைக்கவில்லை</p>
        ) : (
          templates.map((template) => (
            <Card key={template.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-0">
                <Button
                  variant="ghost"
                  className="w-full h-full p-4 justify-start text-left flex flex-col items-start"
                  onClick={() => onTemplateSelect(template)}
                >
                  <h3 className="font-medium text-purple-700">{template.title}</h3>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                    {template.content.replace(/<[^>]*>/g, "").substring(0, 100)}...
                  </p>
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </CardContent>
    </Card>
  )
}
