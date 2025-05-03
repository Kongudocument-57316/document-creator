import { fetchSaleAgreement } from "../fetch-document"
import { DocumentPreview } from "../document-preview"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Edit, FileDown, FileIcon as FilePdf } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { formatDate } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { DeleteAgreementDialog } from "@/components/delete-agreement-dialog"

interface PageProps {
  params: {
    id: string
  }
}

export default async function ViewSaleAgreementPage({ params }: PageProps) {
  // Fetch the document data
  let document
  try {
    document = await fetchSaleAgreement(params.id)
  } catch (error) {
    console.error("Error fetching document:", error)
    notFound()
  }

  if (!document) {
    notFound()
  }

  // Format the document date
  const documentDate = document.document_date ? formatDate(new Date(document.document_date)) : "தேதி குறிப்பிடப்படவில்லை"

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{document.document_name || "கிரைய உடன்படிக்கை ஆவணம்"}</h1>
          <p className="text-muted-foreground">
            உருவாக்கப்பட்டது: {formatDate(new Date(document.created_at))}
            {document.updated_at &&
              document.updated_at !== document.created_at &&
              ` | புதுப்பிக்கப்பட்டது: ${formatDate(new Date(document.updated_at))}`}
          </p>
        </div>

        <div className="flex gap-2 print:hidden">
          <Link href="/document-details/sale-agreement/search">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              திரும்பிச் செல்
            </Button>
          </Link>

          <Link href={`/document-details/sale-agreement/edit/${params.id}`}>
            <Button variant="outline" size="sm">
              <Edit className="mr-2 h-4 w-4" />
              திருத்து
            </Button>
          </Link>

          <Link href={`/api/sale-agreements/${params.id}/download`} target="_blank">
            <Button variant="outline" size="sm">
              <FileDown className="mr-2 h-4 w-4" />
              DOCX பதிவிறக்கு
            </Button>
          </Link>

          <Link href={`/api/sale-agreements/${params.id}/download-pdf`} target="_blank">
            <Button variant="outline" size="sm">
              <FilePdf className="mr-2 h-4 w-4" />
              PDF பதிவிறக்கு
            </Button>
          </Link>

          <DeleteAgreementDialog agreementId={params.id} agreementName={document.document_name} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 print:hidden">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">அடிப்படை விவரங்கள்</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">ஆவண தேதி</dt>
                <dd>{documentDate}</dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-muted-foreground">சார்பதிவாளர் அலுவலகம்</dt>
                <dd>{document.subRegistrarOffice?.name || "குறிப்பிடப்படவில்லை"}</dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-muted-foreground">புத்தக எண்</dt>
                <dd>{document.bookNumber?.number || "குறிப்பிடப்படவில்ல���"}</dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-muted-foreground">ஆவண எண்</dt>
                <dd>{document.document_number || "குறிப்பிடப்படவில்லை"}</dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-muted-foreground">ஆவண வகை</dt>
                <dd>{document.documentType?.name || "குறிப்பிடப்படவில்லை"}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">கட்சிகள்</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">விற்பவர்கள்</h4>
                {document.sellers && document.sellers.length > 0 ? (
                  <ul className="list-disc pl-5 space-y-1">
                    {document.sellers.map((seller: any) => (
                      <li key={seller.id}>{seller.users?.name || "பெயர் குறிப்பிடப்படவில்லை"}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground text-sm">விற்பவர்கள் குறிப்பிடப்படவில்லை</p>
                )}
              </div>

              <div>
                <h4 className="text-sm font-medium text-muted-foreground">வாங்குபவர்கள்</h4>
                {document.buyers && document.buyers.length > 0 ? (
                  <ul className="list-disc pl-5 space-y-1">
                    {document.buyers.map((buyer: any) => (
                      <li key={buyer.id}>{buyer.users?.name || "பெயர் குறிப்பிடப்படவில்லை"}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground text-sm">வாங்குபவர்கள் குறிப்பிடப்படவில்லை</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">சொத்து விவரங்கள்</CardTitle>
          </CardHeader>
          <CardContent>
            {document.properties && document.properties.length > 0 ? (
              <div className="space-y-3">
                {document.properties.map((property: any, index: number) => (
                  <div key={index} className="border rounded p-2">
                    <p className="font-medium">
                      {property.properties?.survey_number || ""}
                      {property.properties?.sub_division_number ? ` / ${property.properties.sub_division_number}` : ""}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {property.properties?.villages?.name || ""},{property.properties?.villages?.taluks?.name || ""}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">சொத்து விவரங்கள் குறிப்பிடப்படவில்லை</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Separator className="my-6 print:hidden" />

      <h2 className="text-xl font-semibold mb-4 print:hidden">ஆவண முன்னோட்டம்</h2>

      <DocumentPreview document={document} />
    </div>
  )
}
