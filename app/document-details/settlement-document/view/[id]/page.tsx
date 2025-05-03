"use client"

import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { fetchSettlementDocument } from "../fetch-document"
import { DocumentPreview } from "../document-preview"
import { notFound } from "next/navigation"
import { DeleteSettlementDialog } from "@/components/delete-settlement-dialog"
import { Home, ArrowLeft } from "lucide-react"

interface SettlementDocumentViewPageProps {
  params: {
    id: string
  }
}

export default async function SettlementDocumentViewPage({ params }: SettlementDocumentViewPageProps) {
  const { id } = params
  const result = await fetchSettlementDocument(id)

  if (!result.success || !result.data) {
    notFound()
  }

  const document = result.data

  return (
    <div className="flex min-h-screen flex-col bg-amber-50">
      <Header className="bg-amber-100 border-amber-200" />
      <main className="flex-1 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Link href="/document-details/settlement-document/search">
                <Button
                  variant="outline"
                  size="icon"
                  className="border-amber-300 text-amber-700 hover:bg-amber-100"
                  aria-label="Back"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/">
                <Button
                  variant="outline"
                  size="icon"
                  className="border-amber-300 text-amber-700 hover:bg-amber-100"
                  aria-label="Home"
                >
                  <Home className="h-4 w-4" />
                </Button>
              </Link>
              <h1 className="text-3xl font-bold text-amber-800 ml-2">தானசெட்டில்மெண்ட் ஆவண விவரங்கள்</h1>
            </div>
            <div className="flex gap-2">
              <Link href={`/document-details/settlement-document/edit/${id}`}>
                <Button variant="outline" className="border-amber-300 text-amber-700 hover:bg-amber-100">
                  திருத்து
                </Button>
              </Link>
              <DeleteSettlementDialog id={id} />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <DocumentPreview document={document} />

            <div className="flex justify-end gap-2">
              <Link href={`/api/settlement-documents/${id}/download-word`} target="_blank">
                <Button variant="outline" className="border-amber-300 text-amber-700 hover:bg-amber-100">
                  Word பதிவிறக்கு
                </Button>
              </Link>
              <Link href={`/api/settlement-documents/${id}/download-pdf`} target="_blank">
                <Button variant="outline" className="border-amber-300 text-amber-700 hover:bg-amber-100">
                  PDF பதிவிறக்கு
                </Button>
              </Link>
              <Button
                variant="outline"
                className="border-amber-300 text-amber-700 hover:bg-amber-100"
                onClick={() => window.print()}
              >
                அச்சிடு
              </Button>
            </div>
          </div>
        </div>
      </main>
      <footer className="bg-amber-100 border-t border-amber-200 py-4 text-center text-amber-700">
        <p>© 2025 தமிழ் ஆவண மேலாண்மை. அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.</p>
      </footer>
    </div>
  )
}
