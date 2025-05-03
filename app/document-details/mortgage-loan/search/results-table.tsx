"use client"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Eye, FileEdit } from "lucide-react"
import { useRouter } from "next/navigation"
import { DeleteMortgageLoanDialog } from "@/components/delete-mortgage-loan-dialog"

interface MortgageLoanDocument {
  id: number
  document_number: string
  document_date: string
  buyer_name: string
  seller_name: string
  loan_amount: number
  created_at: string
}

interface ResultsTableProps {
  documents: MortgageLoanDocument[]
  onRefresh: () => void
}

export function ResultsTable({ documents, onRefresh }: ResultsTableProps) {
  const router = useRouter()

  const formatDate = (dateString: string) => {
    if (!dateString) return "-"
    const date = new Date(dateString)
    return date.toLocaleDateString("ta-IN")
  }

  const formatAmount = (amount: number) => {
    if (!amount) return "-"
    return new Intl.NumberFormat("ta-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const handleView = (id: number) => {
    router.push(`/document-details/mortgage-loan/view/${id}`)
  }

  const handleEdit = (id: number) => {
    router.push(`/document-details/mortgage-loan/edit/${id}`)
  }

  return (
    <div className="rounded-md border border-cyan-100 overflow-hidden bg-white shadow-sm">
      <Table>
        <TableHeader className="bg-cyan-50">
          <TableRow className="hover:bg-cyan-100/50">
            <TableHead className="text-cyan-700">ஆவண எண்</TableHead>
            <TableHead className="text-cyan-700">தேதி</TableHead>
            <TableHead className="text-cyan-700">அடமானம் பெறுபவர்</TableHead>
            <TableHead className="text-cyan-700">அடமானம் கொடுப்பவர்</TableHead>
            <TableHead className="text-cyan-700">அடமான தொகை</TableHead>
            <TableHead className="text-cyan-700">செயல்கள்</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.length === 0 ? (
            <TableRow className="hover:bg-gray-50">
              <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                ஆவணங்கள் எதுவ���ம் கிடைக்கவில்லை
              </TableCell>
            </TableRow>
          ) : (
            documents.map((doc) => (
              <TableRow key={doc.id} className="hover:bg-cyan-50/30">
                <TableCell className="font-medium text-cyan-800">{doc.document_number || "-"}</TableCell>
                <TableCell>{formatDate(doc.document_date)}</TableCell>
                <TableCell>{doc.buyer_name}</TableCell>
                <TableCell>{doc.seller_name}</TableCell>
                <TableCell className="font-medium text-emerald-700">{formatAmount(doc.loan_amount)}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleView(doc.id)}
                      title="காண்"
                      className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(doc.id)}
                      title="திருத்து"
                      className="text-amber-600 hover:text-amber-800 hover:bg-amber-50"
                    >
                      <FileEdit className="h-4 w-4" />
                    </Button>
                    <DeleteMortgageLoanDialog id={doc.id} onSuccess={onRefresh} />
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
