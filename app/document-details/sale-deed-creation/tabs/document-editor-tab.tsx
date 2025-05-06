"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { DocumentEditor } from "../components/document-editor"
import { FileText } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { getSupabaseBrowserClient } from "@/lib/supabase"
import { toast } from "sonner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import { saveDocumentContent } from "../actions/document-actions"

interface DocumentEditorTabProps {
  data: any
  documentId: string | null
  updateDocumentId: (id: string) => void
}

export function DocumentEditorTab({ data, documentId, updateDocumentId }: DocumentEditorTabProps) {
  const [documentContent, setDocumentContent] = useState(data.documentContent || "")
  const [loading, setLoading] = useState(true)
  const supabase = getSupabaseBrowserClient()
  const [lastFormUpdate, setLastFormUpdate] = useState<Date | null>(null)

  useEffect(() => {
    // If a document ID exists, try to load that document
    if (documentId) {
      loadExistingDocument(documentId)
    } else {
      // Otherwise load a default template
      loadDefaultTemplate()
    }
  }, [documentId])

  useEffect(() => {
    setLastFormUpdate(new Date())
  }, [
    data.buyer?.length,
    data.seller?.length,
    data.witness?.length,
    data.property?.propertyValue,
    data.payment?.totalAmount,
    data.deed?.documentNumber,
  ])

  const loadExistingDocument = async (id: string) => {
    setLoading(true)
    try {
      const { data: documentData, error } = await supabase
        .from("sale_deed_documents")
        .select("content")
        .eq("id", id)
        .single()

      if (error) throw error

      if (documentData && documentData.content) {
        setDocumentContent(documentData.content)
      } else {
        loadDefaultTemplate()
      }
    } catch (error: any) {
      console.error("Error loading document:", error.message)
      toast.error("ஆவணத்தை ஏற்றுவதில் பிழை")
      loadDefaultTemplate()
    } finally {
      setLoading(false)
    }
  }

  const loadDefaultTemplate = async () => {
    setLoading(true)
    try {
      const { data: templateData, error } = await supabase
        .from("document_templates")
        .select("content")
        .eq("is_default", true)
        .maybeSingle()

      if (error) throw error

      if (templateData && templateData.content) {
        setDocumentContent(templateData.content)
      } else {
        // If no default template, create an empty document
        setDocumentContent("")
      }
    } catch (error: any) {
      console.error("Error loading default template:", error.message)
      toast.error("இயல்புநிலை வார்ப்புருவை ஏற்றுவதில் பிழை")
      setDocumentContent("")
    } finally {
      setLoading(false)
    }
  }

  const handleSaveDocument = async (content: string) => {
    try {
      setLoading(true)
      const result = await saveDocumentContent(documentId || undefined, content, data)

      if (result.success && result.id) {
        // Update the document ID in the parent component
        updateDocumentId(result.id)
        setDocumentContent(content)
        toast.success("ஆவணம் வெற்றிகரமாக சேமிக்கப்பட்டது")
      } else {
        toast.error("ஆவணத்தை சேமிப்பதில் பிழை: " + (result.error || "அறியப்படாத பிழை"))
      }
    } catch (error: any) {
      console.error("Error saving document:", error)
      toast.error("ஆவணத்தை சேமிப்பதில் பிழை: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateFromFormData = () => {
    // This will trigger a refresh of the document with the latest form data
    loadDefaultTemplate()
    toast.success("படிவ தரவின்படி ஆவணம் புதுப்பிக்கப்பட்டது")
    setLastFormUpdate(new Date())
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>ஏற்றுகிறது...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold text-purple-800 flex items-center">
            <FileText className="h-5 w-5 mr-2 text-purple-600" />
            ஆவண உருவாக்கி
          </h3>

          <Button
            variant="outline"
            onClick={handleUpdateFromFormData}
            className="border-purple-300 hover:bg-purple-50 text-purple-700"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            படிவ தரவுடன் புதுப்பி
          </Button>
        </div>
        <Separator className="my-4 bg-purple-200" />

        <div className="mb-4">
          <Card className="bg-purple-50 border-purple-200">
            <CardContent className="p-3">
              <p className="text-sm text-purple-700">
                <strong>குறிப்பு:</strong> தங்கள் படிவத்தில் உள்ளிட்ட தகவல்கள் ஆவணத்தில் தானாக நிரப்பப்படுகின்றன. ஆவணத்தைத் திருத்தம் செய்து,
                வடிவமைத்து, ஏற்றுமதி செய்யலாம்.
                {lastFormUpdate && (
                  <span className="block mt-1 text-xs text-purple-500">
                    கடைசி புதுப்பிப்பு: {lastFormUpdate.toLocaleTimeString()}
                  </span>
                )}
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="editor" className="w-full">
          <TabsList className="grid grid-cols-2 w-full mb-4">
            <TabsTrigger value="editor">ஆவண திருத்தி</TabsTrigger>
            <TabsTrigger value="fields">புலங்களைத் தேர்ந்தெடு</TabsTrigger>
          </TabsList>

          <TabsContent value="editor">
            <Card>
              <CardContent className="p-4">
                <DocumentEditor
                  initialContent={documentContent}
                  onSave={handleSaveDocument}
                  formData={data}
                  documentId={documentId || undefined}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="fields">
            <FieldSelector data={data} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

// Field selector component
function FieldSelector({ data }: { data: any }) {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success(`"${text}" கிளிப்போர்டுக்கு நகலெடுக்கப்பட்டது`)
  }

  return (
    <Card className="border-purple-200">
      <CardContent className="p-4">
        <div className="space-y-6">
          <div>
            <h4 className="font-medium text-purple-800 mb-2">ஆவண அடிப்படை விவரங்கள்</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {data.deed?.documentNumber && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(data.deed.documentNumber)}
                  className="justify-start text-left"
                >
                  ஆவண எண்: {data.deed.documentNumber}
                </Button>
              )}
              {data.deed?.year && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(data.deed.year)}
                  className="justify-start text-left"
                >
                  ஆண்டு: {data.deed.year}
                </Button>
              )}
              {data.deed?.month && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(data.deed.month)}
                  className="justify-start text-left"
                >
                  மாதம்: {data.deed.month}
                </Button>
              )}
              {data.deed?.day && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(data.deed.day)}
                  className="justify-start text-left"
                >
                  நாள்: {data.deed.day}
                </Button>
              )}
            </div>
          </div>

          <div>
            <h4 className="font-medium text-purple-800 mb-2">வாங்குபவர் விவரங்கள்</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {data.buyer?.map((buyer: any, index: number) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(buyer.name)}
                  className="justify-start text-left"
                >
                  வாங்குபவர் {index + 1}: {buyer.name}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium text-purple-800 mb-2">விற்பனையாளர் விவரங்கள்</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {data.seller?.map((seller: any, index: number) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(seller.name)}
                  className="justify-start text-left"
                >
                  விற்பனையாளர் {index + 1}: {seller.name}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium text-purple-800 mb-2">சொத்து விவரங்கள்</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {data.property?.doorNo && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(data.property.doorNo)}
                  className="justify-start text-left"
                >
                  கதவு எண்: {data.property.doorNo}
                </Button>
              )}
              {data.property?.district && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(data.property.district)}
                  className="justify-start text-left"
                >
                  மாவட்டம்: {data.property.district}
                </Button>
              )}
              {data.property?.propertyValue && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(data.property.propertyValue.toString())}
                  className="justify-start text-left"
                >
                  சொத்து மதிப்பு: {data.property.propertyValue}
                </Button>
              )}
            </div>
          </div>

          <div>
            <h4 className="font-medium text-purple-800 mb-2">பணப்பட்டுவாடா விவரங்கள்</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {data.payment?.totalAmount && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(data.payment.totalAmount.toString())}
                  className="justify-start text-left"
                >
                  மொத்த தொகை: {data.payment.totalAmount}
                </Button>
              )}
              {data.payment?.amountInWords && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(data.payment.amountInWords)}
                  className="justify-start text-left"
                >
                  தொகை (எழுத்தில்): {data.payment.amountInWords}
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
