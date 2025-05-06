"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"

type Template = {
  id: number
  title: string
  description: string
  content: string
  category: string
}

type DocumentTemplatesProps = {
  onTemplateSelect: (template: Template) => void
}

export function DocumentTemplates({ onTemplateSelect }: DocumentTemplatesProps) {
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await fetch("/api/document-templates")
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`)
        }
        const data = await response.json()
        setTemplates(data)
      } catch (error) {
        console.error("Failed to fetch templates:", error)
        toast.error("வார்ப்புருக்களை பெற முடியவில்லை")
        // Set default templates if fetch fails
        setTemplates([
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
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchTemplates()
  }, [])

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-4 w-2/3" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-24 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">ஆவண வார்ப்புருக்கள்</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {templates.map((template) => (
          <Card key={template.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>{template.title}</CardTitle>
              <CardDescription>{template.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="h-24 overflow-hidden text-sm text-gray-500 border p-2 rounded">
                <div dangerouslySetInnerHTML={{ __html: template.content.substring(0, 150) + "..." }} />
              </div>
              <Button onClick={() => onTemplateSelect(template)} className="w-full bg-purple-600 hover:bg-purple-700">
                இந்த வார்ப்புருவைப் பயன்படுத்து
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
