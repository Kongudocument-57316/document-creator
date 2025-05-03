"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, Pencil, Trash2 } from "lucide-react"
import Link from "next/link"
import { DeletePartitionReleaseDialog } from "@/components/delete-partition-release-dialog"
import { format } from "date-fns"
import { useToast } from "@/hooks/use-toast"

interface PartitionReleaseDocument {
  id: number
  document_number: string
  document_date: string
  first_party_name: string
  second_party_name: string
  property_details: string
  created_at: string
}

interface ResultsTableProps {
  documents: PartitionReleaseDocument[]
  onRefresh: () => void
}

export function ResultsTable({ documents, onRefresh }: ResultsTableProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<PartitionReleaseDocument | null>(null)
  const { toast } = useToast()

  const handleDelete = (document: PartitionReleaseDocument) => {
    setSelectedDocument(document)
    setDeleteDialogOpen(true)
  }

  const handleDeleteSuccess = () => {
    toast({
      title: "ஆவணம் நீக்கப்பட்டது",
      description: "பாகபாத்திய விடுதலை ஆவணம் வெற்றிகரமாக நீக்கப்பட்டது",
      variant: "default",
    })
    onRefresh()
  }

  if (documents.length === 0) {
    return (
      <div className="text-center p-8 bg-cyan-50 rounded-lg border border-cyan-200">
        <p className="text-cyan-700">ஆவணங்கள் எதுவும் கிடைக்கவில்லை</p>
        <p className="text-cyan-600 text-sm">(No documents found)</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden border border-cyan-200">
      <Table>
        <TableHeader className="bg-gradient-to-r from-cyan-100 to-cyan-50">
          <TableRow>
            <TableHead className="text-cyan-800">ஆவண எண்</TableHead>
            <TableHead className="text-cyan-800">தேதி</TableHead>
            <TableHead className="text-cyan-800">முதல் கட்சி</TableHead>
            <TableHead className="text-cyan-800">இரண்டாம் கட்சி</TableHead>
            <TableHead className="text-cyan-800">சொத்து விவரம்</TableHead>
            <TableHead className="text-cyan-800 text-right">செயல்கள்</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.map((document) => (
            <TableRow key={document.id} className="hover:bg-cyan-50">
              <TableCell className="font-medium">{document.document_number || "-"}</TableCell>
              <TableCell>
                {document.document_date ? format(new Date(document.document_date), "dd-MM-yyyy") : "-"}
              </TableCell>
              <TableCell>{document.first_party_name}</TableCell>
              <TableCell>{document.second_party_name}</TableCell>
              <TableCell className="max-w-xs truncate">{document.property_details || "-"}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Link href={`/document-details/partition-release/view/${document.id}`}>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 w-8 p-0 text-blue-600 border-blue-200 hover:bg-blue-50"
                    >
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">View</span>
                    </Button>
                  </Link>
                  <Link href={`/document-details/partition-release/edit/${document.id}`}>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 w-8 p-0 text-amber-600 border-amber-200 hover:bg-amber-50"
                    >
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                  </Link>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 w-8 p-0 text-red-600 border-red-200 hover:bg-red-50"
                    onClick={() => handleDelete(document)}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedDocument && (
        <DeletePartitionReleaseDialog
          documentId={selectedDocument.id}
          documentNumber={selectedDocument.document_number || `ID: ${selectedDocument.id}`}
          isOpen={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          onDeleted={handleDeleteSuccess}
        />
      )}
    </div>
  )
}
