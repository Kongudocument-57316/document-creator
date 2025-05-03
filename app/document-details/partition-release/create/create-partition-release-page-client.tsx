"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreatePartitionReleaseForm } from "./create-partition-release-form"
import { DocumentLivePreview } from "./document-live-preview"
import { saveDocument } from "./save-document-action"

export default function CreatePartitionReleasePageClient({ documentTypes, submissionTypes, typists, offices }) {
  const router = useRouter()
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    documentNumber: "",
    documentDate: "",
    documentType: "",
    submissionType: "",
    typist: "",
    office: "",
    firstPartyName: "",
    firstPartyAge: "",
    firstPartyOccupation: "",
    firstPartyAddress: "",
    secondPartyName: "",
    secondPartyAge: "",
    secondPartyOccupation: "",
    secondPartyAddress: "",
    propertyDetails: "",
    partitionDetails: "",
    releaseAmount: "",
    releaseAmountInWords: "",
    witness1Name: "",
    witness2Name: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const result = await saveDocument(formData)

      if (result.success) {
        toast({
          title: "ஆவணம் வெற்றிகரமாக சேமிக்கப்பட்டது",
          description: "உங்கள் பாகபாத்திய விடுதலை ஆவணம் சேமிக்கப்பட்டது",
        })
        router.push(`/document-details/partition-release/view/${result.id}`)
      } else {
        throw new Error(result.error || "ஆவணம் சேமிப்பதில் பிழை")
      }
    } catch (error) {
      toast({
        title: "பிழை ஏற்பட்டது",
        description: error.message || "ஆவணம் சேமிப்பதில் பிழை ஏற்பட்டது. மீண்டும் முயற்சிக்கவும்.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">பாகபாத்திய விடுதலை ஆவணம் உருவாக்கு</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card className="p-6">
            <CreatePartitionReleaseForm
              formData={formData}
              onChange={handleFormChange}
              documentTypes={documentTypes}
              submissionTypes={submissionTypes}
              typists={typists}
              offices={offices}
            />

            <div className="mt-6 flex justify-end">
              <Button
                type="button"
                variant="outline"
                className="mr-2"
                onClick={() => router.push("/document-details/partition-release")}
              >
                ரத்து செய்
              </Button>
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? "சேமிக்கிறது..." : "சேமி"}
              </Button>
            </div>
          </Card>
        </div>

        <div>
          <Tabs defaultValue="preview" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="preview">முன்னோட்டம்</TabsTrigger>
            </TabsList>
            <TabsContent value="preview" className="mt-0">
              <DocumentLivePreview formData={formData} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
