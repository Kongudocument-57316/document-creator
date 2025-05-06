"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Editor } from "@tinymce/tinymce-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { FileText, Download, Upload, RefreshCw, Plus, Save, Eye } from "lucide-react"
import { getSupabaseBrowserClient } from "@/lib/supabase"
import { DocumentPreview } from "./document-preview"

interface DocumentEditorProps {
  initialContent?: string
  onSave?: (content: string) => void
  formData: any
}

export function DocumentEditor({ initialContent = "", onSave, formData }: DocumentEditorProps) {
  const [content, setContent] = useState(initialContent)
  const [templates, setTemplates] = useState<any[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState("")
  const [newTemplateName, setNewTemplateName] = useState("")
  const [isFieldDialogOpen, setIsFieldDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("editor")
  const editorRef = useRef<any>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = getSupabaseBrowserClient()

  useEffect(() => {
    fetchTemplates()
  }, [])

  useEffect(() => {
    // Update content when initialContent changes
    if (initialContent) {
      setContent(initialContent)
    }
  }, [initialContent])

  const fetchTemplates = async () => {
    try {
      const { data, error } = await supabase.from("document_templates").select("*").order("name")
      if (error) throw error
      setTemplates(data || [])
    } catch (error: any) {
      console.error("Error fetching templates:", error.message)
      toast.error("வார்ப்புருக்களைப் பெறுவதில் பிழை")
    }
  }

  const handleEditorChange = (content: string) => {
    setContent(content)
  }

  const handleSave = () => {
    if (onSave) {
      onSave(content)
      toast.success("ஆவணம் வெற்றிகரமாக சேமிக்கப்பட்டது")
    }
  }

  const handleTemplateSelect = async (templateId: string) => {
    if (!templateId) return

    try {
      const { data, error } = await supabase.from("document_templates").select("content").eq("id", templateId).single()
      if (error) throw error

      if (data && data.content) {
        setContent(data.content)
        if (editorRef.current) {
          editorRef.current.setContent(data.content)
        }
        toast.success("வார்ப்புரு ஏற்றப்பட்டது")
      }
    } catch (error: any) {
      console.error("Error loading template:", error.message)
      toast.error("வார்ப்புருவை ஏற்றுவதில் பிழை")
    }
  }

  const handleSaveTemplate = async () => {
    if (!newTemplateName.trim()) {
      toast.error("வார்ப்புரு பெயரை உள்ளிடவும்")
      return
    }

    try {
      const { data, error } = await supabase
        .from("document_templates")
        .insert([{ name: newTemplateName, content: content }])
        .select()

      if (error) throw error

      toast.success("வார்ப்புரு சேமிக்கப்பட்டது")
      setNewTemplateName("")
      fetchTemplates()
    } catch (error: any) {
      console.error("Error saving template:", error.message)
      toast.error("வார்ப்புருவை சேமிப்பதில் பிழை")
    }
  }

  const handleExportWord = () => {
    const htmlContent = content
    const blob = new Blob(
      [
        `
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: 'Arial Unicode MS', 'Nirmala UI', sans-serif; }
            p { margin: 0; padding: 0; line-height: 1.5; }
          </style>
        </head>
        <body>${htmlContent}</body>
      </html>
    `,
      ],
      { type: "application/msword" },
    )

    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = "document.doc"
    link.click()
    URL.revokeObjectURL(link.href)
  }

  const handleImportWord = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await fetch("/api/convert-docx-to-html", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Conversion failed")
      }

      const data = await response.json()
      if (data.html) {
        setContent(data.html)
        if (editorRef.current) {
          editorRef.current.setContent(data.html)
        }
        toast.success("Word ஆவணம் வெற்றிகரமாக இறக்குமதி செய்யப்பட்டது")
      }
    } catch (error) {
      console.error("Error importing Word document:", error)
      toast.error("Word ஆவணத்தை இறக்குமதி செய்வதில் பிழை")
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const getValueByPath = (obj: any, path: string) => {
    const parts = path.split(".")
    let current = obj

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i]

      // Handle array notation like "buyers[0].name"
      if (part.includes("[") && part.includes("]")) {
        const arrayName = part.substring(0, part.indexOf("["))
        const indexStr = part.substring(part.indexOf("[") + 1, part.indexOf("]"))
        const index = Number.parseInt(indexStr, 10)

        if (!current[arrayName] || !Array.isArray(current[arrayName]) || index >= current[arrayName].length) {
          return undefined
        }

        current = current[arrayName][index]
      } else {
        if (current === undefined || current === null || !(part in current)) {
          return undefined
        }
        current = current[part]
      }
    }

    return current
  }

  const replacePlaceholders = () => {
    if (!editorRef.current) return

    let updatedContent = editorRef.current.getContent()

    // Find all placeholders in the format {{fieldPath}}
    const placeholderRegex = /{{([^}]+)}}/g
    let match

    while ((match = placeholderRegex.exec(updatedContent)) !== null) {
      const placeholder = match[0]
      const fieldPath = match[1].trim()

      const value = getValueByPath(formData, fieldPath)

      if (value !== undefined) {
        updatedContent = updatedContent.replace(placeholder, value.toString())
      }
    }

    editorRef.current.setContent(updatedContent)
    setContent(updatedContent)
    toast.success("ஆவணம் புதுப்பிக்கப்பட்டது")
  }

  const handleInsertField = (fieldPath: string, label: string) => {
    if (!editorRef.current) return

    const placeholder = `{{${fieldPath}}}`
    editorRef.current.insertContent(placeholder)
    toast.success(`"${label}" புலம் சேர்க்கப்பட்டது`)
  }

  const handlePreviewClick = () => {
    setActiveTab("preview")
  }

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="editor" className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              ஆவண உருவாக்கி
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              முன்னோட்டம்
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              வார்ப்புருக்கள்
            </TabsTrigger>
          </TabsList>

          <TabsContent value="editor" className="space-y-4">
            <div className="flex flex-wrap gap-2 mb-4">
              <Button onClick={handleSave} className="bg-purple-600 hover:bg-purple-700">
                <Save className="h-4 w-4 mr-2" />
                சேமி
              </Button>

              <Button onClick={handleExportWord} variant="outline" className="border-purple-200 hover:bg-purple-50">
                <Download className="h-4 w-4 mr-2" />
                Word ஆக ஏற்றுமதி செய்
              </Button>

              <Button onClick={handleImportWord} variant="outline" className="border-purple-200 hover:bg-purple-50">
                <Upload className="h-4 w-4 mr-2" />
                Word இலிருந்து இறக்குமதி செய்
              </Button>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".docx,.doc"
                className="hidden"
              />

              <Button onClick={replacePlaceholders} variant="outline" className="border-purple-200 hover:bg-purple-50">
                <RefreshCw className="h-4 w-4 mr-2" />
                புதுப்பி
              </Button>

              <Dialog open={isFieldDialogOpen} onOpenChange={setIsFieldDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="border-purple-200 hover:bg-purple-50">
                    <Plus className="h-4 w-4 mr-2" />
                    புலத்தைச் சேர்க்க
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>புலத்தைத் தேர்ந்தெடுக்கவும்</DialogTitle>
                  </DialogHeader>
                  <div className="max-h-[70vh] overflow-y-auto">
                    <FieldSelectorContent formData={formData} onSelectField={handleInsertField} />
                  </div>
                </DialogContent>
              </Dialog>

              <Button onClick={handlePreviewClick} variant="outline" className="border-purple-200 hover:bg-purple-50">
                <Eye className="h-4 w-4 mr-2" />
                முன்னோட்டம் காண்க
              </Button>
            </div>

            <Editor
              onInit={(evt, editor) => (editorRef.current = editor)}
              initialValue={initialContent}
              value={content}
              onEditorChange={handleEditorChange}
              init={{
                height: 500,
                menubar: true,
                plugins: [
                  "advlist",
                  "autolink",
                  "lists",
                  "link",
                  "image",
                  "charmap",
                  "preview",
                  "anchor",
                  "searchreplace",
                  "visualblocks",
                  "code",
                  "fullscreen",
                  "insertdatetime",
                  "media",
                  "table",
                  "code",
                  "help",
                  "wordcount",
                  "directionality",
                  "pagebreak",
                ],
                toolbar:
                  "undo redo | blocks | " +
                  "bold italic forecolor | alignleft aligncenter " +
                  "alignright alignjustify | bullist numlist outdent indent | " +
                  "removeformat | pagebreak | help | ltr rtl",
                content_style: `
                  body { 
                    font-family: Arial, sans-serif; 
                    font-size: 14px;
                    line-height: 1.5;
                    max-width: 210mm;
                    min-height: 297mm;
                    padding: 2cm;
                    margin: 0 auto;
                    background-color: white;
                  }
                  .mce-content-body [data-mce-selected="inline-boundary"] {
                    background-color: #E9D5FF;
                  }
                  .mce-pagebreak {
                    border-top: 2px dashed #5b21b6;
                    border-bottom: none;
                    height: 5px;
                    margin-top: 15px;
                    margin-bottom: 15px;
                    page-break-before: always;
                    page-break-after: always;
                  }
                `,
                directionality: "ltr",
                language: "en",
                language_url: "/tinymce/langs/ta.js",
                setup: (editor) => {
                  editor.ui.registry.addButton("insertField", {
                    text: "புலத்தைச் சேர்க்க",
                    onAction: () => {
                      setIsFieldDialogOpen(true)
                    },
                  })
                },
              }}
            />
          </TabsContent>

          <TabsContent value="preview" className="space-y-4">
            <DocumentPreview content={content} title={formData?.deed?.documentType || "கிரைய ஆவணம்"} />
          </TabsContent>

          <TabsContent value="templates" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-medium text-purple-800 mb-2">வார்ப்புருவைத் தேர்ந்தெடுக்கவும்</h3>
                <Select value={selectedTemplate} onValueChange={handleTemplateSelect}>
                  <SelectTrigger className="border-purple-200 focus-visible:ring-purple-400">
                    <SelectValue placeholder="வார்ப்புருவைத் தேர்ந்தெடுக்கவும்" />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.map((template) => (
                      <SelectItem key={template.id} value={template.id.toString()}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <h3 className="text-lg font-medium text-purple-800 mb-2">புதிய வார்ப்புருவைச் சேமிக்கவும்</h3>
                <div className="flex gap-2">
                  <Input
                    value={newTemplateName}
                    onChange={(e) => setNewTemplateName(e.target.value)}
                    placeholder="வார்ப்புரு பெயர்"
                    className="border-purple-200 focus-visible:ring-purple-400"
                  />
                  <Button onClick={handleSaveTemplate} className="bg-purple-600 hover:bg-purple-700">
                    சேமி
                  </Button>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <Label className="text-lg font-medium text-purple-800">உள்ள வார்ப்புருக்கள்</Label>
              {templates.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
                  {templates.map((template) => (
                    <Card
                      key={template.id}
                      className="p-3 border-purple-200 hover:border-purple-300 cursor-pointer"
                      onClick={() => handleTemplateSelect(template.id.toString())}
                    >
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-purple-600 mr-2" />
                        <span>{template.name}</span>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 mt-2">வார்ப்புருக்கள் எதுவும் இல்லை</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  )
}

function FieldSelectorContent({
  formData,
  onSelectField,
}: {
  formData: any
  onSelectField: (fieldPath: string, label: string) => void
}) {
  return (
    <div className="space-y-6 p-2">
      {/* Basic document details */}
      <div>
        <h3 className="text-lg font-medium text-purple-800 mb-2">ஆவண அடிப்படை விவரங்கள்</h3>
        <div className="grid grid-cols-2 gap-2">
          {formData.deed?.documentNumber && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSelectField("deed.documentNumber", "ஆவண எண்")}
              className="justify-start border-purple-200"
            >
              ஆவண எண்: {formData.deed.documentNumber}
            </Button>
          )}
          {formData.deed?.documentDate && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSelectField("deed.documentDate", "ஆவண தேதி")}
              className="justify-start border-purple-200"
            >
              ஆவண தேதி: {formData.deed.documentDate}
            </Button>
          )}
          {formData.deed?.year && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSelectField("deed.year", "ஆண்டு")}
              className="justify-start border-purple-200"
            >
              ஆண்டு: {formData.deed.year}
            </Button>
          )}
          {formData.deed?.month && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSelectField("deed.month", "மாதம்")}
              className="justify-start border-purple-200"
            >
              மாதம்: {formData.deed.month}
            </Button>
          )}
          {formData.deed?.day && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSelectField("deed.day", "நாள்")}
              className="justify-start border-purple-200"
            >
              நாள்: {formData.deed.day}
            </Button>
          )}
        </div>
      </div>

      {/* Buyer details */}
      {formData.buyer && formData.buyer.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-purple-800 mb-2">வாங்குபவர் விவரங்கள்</h3>
          <div className="grid grid-cols-2 gap-2">
            {formData.buyer.map((buyer: any, index: number) => (
              <div key={`buyer-${index}`} className="space-y-2">
                <h4 className="text-sm font-medium">
                  வாங்குபவர் {index + 1}: {buyer.name}
                </h4>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onSelectField(`buyer[${index}].name`, `வாங்குபவர் ${index + 1} பெயர்`)}
                  className="justify-start w-full border-purple-200"
                >
                  பெயர்: {buyer.name}
                </Button>
                {buyer.address && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onSelectField(`buyer[${index}].address`, `வாங்குபவர் ${index + 1} முகவரி`)}
                    className="justify-start w-full border-purple-200"
                  >
                    முகவரி: {buyer.address}
                  </Button>
                )}
                {buyer.phone && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onSelectField(`buyer[${index}].phone`, `வாங்குபவர் ${index + 1} தொலைபேசி`)}
                    className="justify-start w-full border-purple-200"
                  >
                    தொலைபேசி: {buyer.phone}
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Seller details */}
      {formData.seller && formData.seller.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-purple-800 mb-2">விற்பனையாளர் விவரங்கள்</h3>
          <div className="grid grid-cols-2 gap-2">
            {formData.seller.map((seller: any, index: number) => (
              <div key={`seller-${index}`} className="space-y-2">
                <h4 className="text-sm font-medium">
                  விற்பனையாளர் {index + 1}: {seller.name}
                </h4>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onSelectField(`seller[${index}].name`, `விற்பனையாளர் ${index + 1} பெயர்`)}
                  className="justify-start w-full border-purple-200"
                >
                  பெயர்: {seller.name}
                </Button>
                {seller.address && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onSelectField(`seller[${index}].address`, `விற்பனையாளர் ${index + 1} முகவரி`)}
                    className="justify-start w-full border-purple-200"
                  >
                    முகவரி: {seller.address}
                  </Button>
                )}
                {seller.phone && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onSelectField(`seller[${index}].phone`, `விற்பனையாளர் ${index + 1} தொலைபேசி`)}
                    className="justify-start w-full border-purple-200"
                  >
                    தொலைபேசி: {seller.phone}
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Property details */}
      {formData.property && Object.keys(formData.property).length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-purple-800 mb-2">சொத்து விவரங்கள்</h3>
          <div className="grid grid-cols-2 gap-2">
            {formData.property.district && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onSelectField("property.district", "மாவட்டம்")}
                className="justify-start border-purple-200"
              >
                மாவட்டம்: {formData.property.district}
              </Button>
            )}
            {formData.property.taluk && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onSelectField("property.taluk", "வட்டம்")}
                className="justify-start border-purple-200"
              >
                வட்டம்: {formData.property.taluk}
              </Button>
            )}
            {formData.property.doorNo && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onSelectField("property.doorNo", "கதவு எண்")}
                className="justify-start border-purple-200"
              >
                கதவு எண்: {formData.property.doorNo}
              </Button>
            )}
            {formData.property.addressLine && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onSelectField("property.addressLine", "முகவரி")}
                className="justify-start border-purple-200"
              >
                முகவரி: {formData.property.addressLine}
              </Button>
            )}
            {formData.property.propertyValue && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onSelectField("property.propertyValue", "சொத்து மதிப்பு")}
                className="justify-start border-purple-200"
              >
                சொத்து மதிப்பு: {formData.property.propertyValue}
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Payment details */}
      {formData.payment && Object.keys(formData.payment).length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-purple-800 mb-2">பணப்பட்டுவாடா விவரங்கள்</h3>
          <div className="grid grid-cols-2 gap-2">
            {formData.payment.totalAmount && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onSelectField("payment.totalAmount", "மொத்த தொகை")}
                className="justify-start border-purple-200"
              >
                மொத்த தொகை: {formData.payment.totalAmount}
              </Button>
            )}
            {formData.payment.amountInWords && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onSelectField("payment.amountInWords", "தொகை (எழுத்தில்)")}
                className="justify-start border-purple-200"
              >
                தொகை (எழுத்தில்): {formData.payment.amountInWords}
              </Button>
            )}
            {formData.payment.paymentMethod && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onSelectField("payment.paymentMethod", "செலுத்தும் முறை")}
                className="justify-start border-purple-200"
              >
                செலுத்தும் முறை: {formData.payment.paymentMethod}
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
