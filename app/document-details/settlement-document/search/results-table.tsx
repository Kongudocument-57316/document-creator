"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Eye, FileEdit, Trash2, Download } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"

interface ResultsTableProps {
  results: any[]
}

export function ResultsTable({ results }: ResultsTableProps) {
  if (results.length === 0) {
    return (
      <div className="text-center p-6 bg-amber-100 rounded-md">
        <p className="text-amber-800">தேடலுக்கு பொருத்தமான ஆவணங்கள் எதுவும் இல்லை</p>
      </div>
    )
  }

  return (
    <div className="border rounded-md bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ஆவண எண்</TableHead>
            <TableHead>தேதி</TableHead>
            <TableHead>கொடையாளி</TableHead>
            <TableHead>பெறுநர்</TableHead>
            <TableHead className="text-right">செயல்கள்</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {results.map((document) => (
            <TableRow key={document.id}>
              <TableCell>{document.document_number}</TableCell>
              <TableCell>
                {document.document_date ? format(new Date(document.document_date), "dd/MM/yyyy") : "-"}
              </TableCell>
              <TableCell>{document.donor_name}</TableCell>
              <TableCell>{document.recipient_name}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Link href={`/document-details/settlement-document/view/${document.id}`}>
                    <Button variant="outline" size="icon" className="h-8 w-8">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href={`/document-details/settlement-document/edit/${document.id}`}>
                    <Button variant="outline" size="icon" className="h-8 w-8">
                      <FileEdit className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button variant="outline" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Link href={`/api/settlement-documents/${document.id}/download-pdf`}>
                    <Button variant="outline" size="icon" className="h-8 w-8 text-blue-500 hover:text-blue-600">
                      <Download className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
