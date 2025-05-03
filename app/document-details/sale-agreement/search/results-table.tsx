"use client"

import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatDate } from "@/lib/utils"
import { Eye, FileDown, FileIcon as FilePdf, Pencil } from "lucide-react"
import Link from "next/link"
import { DeleteAgreementDialog } from "@/components/delete-agreement-dialog"

interface ResultsTableProps {
  results: any[]
  onRefresh: () => void
}

export function ResultsTable({ results, onRefresh }: ResultsTableProps) {
  if (!results || results.length === 0) {
    return (
      <div className="text-center p-8 border rounded-md bg-muted/20">
        <p className="text-muted-foreground">தேடல் முடிவுகள் எதுவும் இல்லை</p>
        <p className="text-sm text-muted-foreground mt-2">வேறு தேடல் அளவுருக்களை முயற்சிக்கவும்</p>
      </div>
    )
  }

  return (
    <div className="border rounded-md overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ஆவண பெயர்</TableHead>
            <TableHead>தேதி</TableHead>
            <TableHead>சார்பதிவாளர் அலுவலகம்</TableHead>
            <TableHead>ஆவண எண்</TableHead>
            <TableHead>வாங்குபவர்</TableHead>
            <TableHead>விற்பவர்</TableHead>
            <TableHead className="text-right">செயல்கள்</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {results.map((result) => (
            <TableRow key={result.id}>
              <TableCell className="font-medium">{result.document_name || "கிரைய உடன்படிக்கை ஆவணம்"}</TableCell>
              <TableCell>
                {result.document_date ? formatDate(new Date(result.document_date)) : "குறிப்பிடப்படவில்லை"}
              </TableCell>
              <TableCell>{result.sub_registrar_office_name || "குறிப்பிடப்படவில்லை"}</TableCell>
              <TableCell>{result.document_number || "குறிப்பிடப்படவில்லை"}</TableCell>
              <TableCell>
                {result.buyer_names && result.buyer_names.length > 0
                  ? result.buyer_names.join(", ")
                  : "குறிப்பிடப்படவில்லை"}
              </TableCell>
              <TableCell>
                {result.seller_names && result.seller_names.length > 0
                  ? result.seller_names.join(", ")
                  : "குறிப்பிடப்படவில்லை"}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Link href={`/document-details/sale-agreement/view/${result.id}`}>
                    <Button variant="ghost" size="icon" title="பார்வையிடு">
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">பார்வையிடு</span>
                    </Button>
                  </Link>
                  <Link href={`/document-details/sale-agreement/edit/${result.id}`}>
                    <Button variant="ghost" size="icon" title="திருத்து">
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">திருத்து</span>
                    </Button>
                  </Link>
                  <Link href={`/api/sale-agreements/${result.id}/download`} target="_blank">
                    <Button variant="ghost" size="icon" title="DOCX பதிவிறக்கு">
                      <FileDown className="h-4 w-4" />
                      <span className="sr-only">DOCX பதிவிறக்கு</span>
                    </Button>
                  </Link>
                  <Link href={`/api/sale-agreements/${result.id}/download-pdf`} target="_blank">
                    <Button variant="ghost" size="icon" title="PDF பதிவிறக்கு">
                      <FilePdf className="h-4 w-4" />
                      <span className="sr-only">PDF பதிவிறக்கு</span>
                    </Button>
                  </Link>
                  <DeleteAgreementDialog id={result.id} onSuccess={onRefresh} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
