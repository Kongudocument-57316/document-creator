import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { fetchMortgageLoanDocument } from "../fetch-document"
import { DocumentPreview } from "../document-preview"
import { DeleteMortgageLoanDialog } from "@/components/delete-mortgage-loan-dialog"
import { ArrowLeft, FileEdit, Download, FileText } from "lucide-react"

export default async function MortgageLoanDocumentViewPage({
  params,
}: {
  params: { id: string }
}) {
  try {
    const document = await fetchMortgageLoanDocument(params.id)

    return (
      <div className="container mx-auto p-4 space-y-6 bg-gradient-to-br from-cyan-50 to-white min-h-screen">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-cyan-200">
          <div>
            <h1 className="text-2xl font-bold text-cyan-800">அடமான கடன் ஆவண விவரங்கள்</h1>
            <p className="text-gray-500">ஆவண எண்: {document.document_number || "-"}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              className="bg-white hover:bg-gray-100 text-gray-800 border-gray-300"
              asChild
            >
              <Link href="/document-details/mortgage-loan/search">
                <ArrowLeft className="mr-1 h-4 w-4" />
                திரும்பிச் செல்
              </Link>
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="bg-white hover:bg-amber-100 text-amber-700 border-amber-300"
              asChild
            >
              <Link href={`/document-details/mortgage-loan/edit/${params.id}`}>
                <FileEdit className="mr-1 h-4 w-4" />
                திருத்து
              </Link>
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="bg-white hover:bg-blue-100 text-blue-700 border-blue-300"
              asChild
            >
              <Link href={`/api/mortgage-loan-documents/${params.id}/download-word`}>
                <FileText className="mr-1 h-4 w-4" />
                Word பதிவிறக்கம்
              </Link>
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="bg-white hover:bg-red-100 text-red-700 border-red-300"
              asChild
            >
              <Link href={`/api/mortgage-loan-documents/${params.id}/download-pdf`}>
                <Download className="mr-1 h-4 w-4" />
                PDF பதிவிறக்கம்
              </Link>
            </Button>

            <DeleteMortgageLoanDialog id={params.id} />
          </div>
        </div>

        <Card className="shadow-lg border-cyan-200 overflow-hidden">
          <div className="p-6">
            <DocumentPreview document={document} />
          </div>
        </Card>
      </div>
    )
  } catch (error) {
    console.error("Error loading mortgage loan document:", error)
    notFound()
  }
}
