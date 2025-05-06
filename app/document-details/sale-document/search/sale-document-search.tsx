"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DataTable } from "@/components/ui/data-table"
import { useState, useEffect } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase"
import { Pencil, Eye, Search, FileText, FileEdit } from "lucide-react"
import { toast } from "sonner"
import type { ColumnDef } from "@tanstack/react-table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface SaleDocument {
  id: number
  document_number: string
  document_date: string
  book_number?: string
  document_type?: string
  seller_name?: string
  buyer_name?: string
  property_name?: string
  sale_amount: number
  document_id?: string
}

interface BookNumber {
  id: number
  number: string
}

interface DocumentType {
  id: number
  name: string
}

interface Property {
  id: number
  property_name: string
}

interface User {
  id: number
  name: string
}

export function SaleDocumentSearch() {
  const [searchTerm, setSearchTerm] = useState("")
  const [searchBy, setSearchBy] = useState<"document_number" | "property_name" | "seller_name" | "buyer_name">(
    "document_number",
  )
  const [documents, setDocuments] = useState<SaleDocument[]>([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // Filter states
  const [bookNumberId, setBookNumberId] = useState("")
  const [documentTypeId, setDocumentTypeId] = useState("")
  const [propertyId, setPropertyId] = useState("")
  const [sellerId, setSellerId] = useState("")
  const [buyerId, setBuyerId] = useState("")

  // Reference data
  const [bookNumbers, setBookNumbers] = useState<BookNumber[]>([])
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([])
  const [properties, setProperties] = useState<Property[]>([])
  const [users, setUsers] = useState<User[]>([])

  const supabase = getSupabaseBrowserClient()

  const fetchReferenceData = async () => {
    try {
      // Fetch book numbers
      const { data: bookNumbersData } = await supabase.from("book_numbers").select("id, number").order("number")
      if (bookNumbersData) setBookNumbers(bookNumbersData)

      // Fetch document types
      const { data: documentTypesData } = await supabase.from("document_types").select("id, name").order("name")
      if (documentTypesData) setDocumentTypes(documentTypesData)

      // Fetch properties
      const { data: propertiesData } = await supabase
        .from("properties")
        .select("id, property_name")
        .order("property_name")
      if (propertiesData) setProperties(propertiesData)

      // Fetch users
      const { data: usersData } = await supabase.from("users").select("id, name").order("name")
      if (usersData) setUsers(usersData)
    } catch (error: any) {
      toast.error("தரவுகளை பெறுவதில் பிழை: " + error.message)
    }
  }

  const fetchDocuments = async () => {
    setLoading(true)

    try {
      let query = supabase.from("sale_documents").select(`
          id,
          document_number,
          document_date,
          sale_amount,
          document_id,
          book_numbers:book_number_id (number),
          document_types:document_type_id (name),
          properties:property_id (property_name),
          sellers:seller_id (name),
          buyers:buyer_id (name)
        `)

      if (searchTerm) {
        if (searchBy === "document_number") {
          query = query.ilike("document_number", `%${searchTerm}%`)
        } else if (searchBy === "property_name") {
          query = query.filter("properties.property_name", "ilike", `%${searchTerm}%`)
        } else if (searchBy === "seller_name") {
          query = query.filter("sellers.name", "ilike", `%${searchTerm}%`)
        } else if (searchBy === "buyer_name") {
          query = query.filter("buyers.name", "ilike", `%${searchTerm}%`)
        }
      }

      if (bookNumberId && bookNumberId !== "all") {
        query = query.eq("book_number_id", Number.parseInt(bookNumberId))
      }

      if (documentTypeId && documentTypeId !== "all") {
        query = query.eq("document_type_id", Number.parseInt(documentTypeId))
      }

      if (propertyId && propertyId !== "all") {
        query = query.eq("property_id", Number.parseInt(propertyId))
      }

      if (sellerId && sellerId !== "all") {
        query = query.eq("seller_id", Number.parseInt(sellerId))
      }

      if (buyerId && buyerId !== "all") {
        query = query.eq("buyer_id", Number.parseInt(buyerId))
      }

      const { data, error } = await query.order("document_date", { ascending: false })

      if (error) throw error

      const formattedData =
        data?.map((doc) => ({
          id: doc.id,
          document_number: doc.document_number,
          document_date: doc.document_date,
          book_number: doc.book_numbers?.number,
          document_type: doc.document_types?.name,
          property_name: doc.properties?.property_name,
          seller_name: doc.sellers?.name,
          buyer_name: doc.buyers?.name,
          sale_amount: doc.sale_amount,
          document_id: doc.document_id,
        })) || []

      setDocuments(formattedData)
    } catch (error: any) {
      toast.error("ஆவணங்களை பெறுவதில் பிழை: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReferenceData()
    fetchDocuments()
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchDocuments()
  }

  const handleView = (id: number) => {
    router.push(`/document-details/sale-document/view/${id}`)
  }

  const handleEdit = (id: number) => {
    router.push(`/document-details/sale-document/edit/${id}`)
  }

  const handleEditDocument = (id: number, documentId?: string) => {
    if (documentId) {
      router.push(`/document-details/sale-document/edit-document/${id}?documentId=${documentId}`)
    } else {
      toast.error("ஆவணம் உருவாக்கப்படவில்லை")
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("ta-IN")
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ta-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount)
  }

  const columns: ColumnDef<SaleDocument>[] = [
    {
      accessorKey: "document_number",
      header: "ஆவண எண்",
    },
    {
      accessorKey: "document_date",
      header: "ஆவண தேதி",
      cell: ({ row }) => formatDate(row.original.document_date),
    },
    {
      accessorKey: "book_number",
      header: "புத்தக எண்",
    },
    {
      accessorKey: "document_type",
      header: "ஆவண வகை",
    },
    {
      accessorKey: "property_name",
      header: "சொத்து விவரம்",
    },
    {
      accessorKey: "seller_name",
      header: "விற்பனையாளர்",
    },
    {
      accessorKey: "buyer_name",
      header: "வாங்குபவர்",
    },
    {
      accessorKey: "sale_amount",
      header: "விற்பனை தொகை",
      cell: ({ row }) => formatCurrency(row.original.sale_amount),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const document = row.original

        return (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => handleView(document.id)} className="text-sky-600">
              <Eye className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleEdit(document.id)} className="text-sky-600">
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleEditDocument(document.id, document.document_id)}
              className="text-purple-600"
              title="ஆவணத்தை திருத்து"
            >
              <FileEdit className="h-4 w-4" />
            </Button>
          </div>
        )
      },
    },
  ]

  return (
    <div className="grid gap-6">
      <Card className="border-sky-200">
        <CardHeader className="bg-sky-50 rounded-t-lg">
          <CardTitle className="text-sky-700">கிரைய ஆவணங்கள் தேடுதல்</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="search-term">தேடுதல்</Label>
                <Input
                  id="search-term"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="தேடுதல் சொல்லை உள்ளிடவும்"
                  className="border-sky-200 focus:border-sky-400"
                />
              </div>

              <div className="w-full md:w-48">
                <Label htmlFor="search-by">தேடுதல் வகை</Label>
                <select
                  id="search-by"
                  value={searchBy}
                  onChange={(e) => setSearchBy(e.target.value as any)}
                  className="flex h-10 w-full rounded-md border border-sky-200 bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="document_number">ஆவண எண்</option>
                  <option value="property_name">சொத்து விவரம்</option>
                  <option value="seller_name">விற்பனையாளர்</option>
                  <option value="buyer_name">வாங்குபவர்</option>
                </select>
              </div>

              <div className="flex items-end">
                <Button type="submit" disabled={loading} className="bg-sky-600 hover:bg-sky-700">
                  <Search className="h-4 w-4 mr-2" />
                  தேடு
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <Label htmlFor="book-number-filter">புத்தக எண்</Label>
                <Select value={bookNumberId} onValueChange={setBookNumberId}>
                  <SelectTrigger className="border-sky-200">
                    <SelectValue placeholder="அனைத்தும்" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">அனைத்தும்</SelectItem>
                    {bookNumbers.map((bookNumber) => (
                      <SelectItem key={bookNumber.id} value={bookNumber.id.toString()}>
                        {bookNumber.number}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="document-type-filter">ஆவண வகை</Label>
                <Select value={documentTypeId} onValueChange={setDocumentTypeId}>
                  <SelectTrigger className="border-sky-200">
                    <SelectValue placeholder="அனைத்தும்" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">அனைத்தும்</SelectItem>
                    {documentTypes.map((documentType) => (
                      <SelectItem key={documentType.id} value={documentType.id.toString()}>
                        {documentType.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="property-filter">சொத்து விவரம்</Label>
                <Select value={propertyId} onValueChange={setPropertyId}>
                  <SelectTrigger className="border-sky-200">
                    <SelectValue placeholder="அனைத்தும்" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">அனைத்தும்</SelectItem>
                    {properties.map((property) => (
                      <SelectItem key={property.id} value={property.id.toString()}>
                        {property.property_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="seller-filter">விற்பனையாளர்</Label>
                <Select value={sellerId} onValueChange={setSellerId}>
                  <SelectTrigger className="border-sky-200">
                    <SelectValue placeholder="அனைத்தும்" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">அனைத்தும்</SelectItem>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id.toString()}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="buyer-filter">வாங்குபவர்</Label>
                <Select value={buyerId} onValueChange={setBuyerId}>
                  <SelectTrigger className="border-sky-200">
                    <SelectValue placeholder="அனைத்தும்" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">அனைத்தும்</SelectItem>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id.toString()}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="flex justify-end mb-4">
        <Button asChild className="bg-sky-600 hover:bg-sky-700">
          <Link href="/document-details/sale-document/create">
            <FileText className="h-4 w-4 mr-2" />
            புதிய ஆவணம் உருவாக்கு
          </Link>
        </Button>
      </div>

      <Card className="border-sky-200">
        <CardHeader className="bg-sky-50 rounded-t-lg">
          <CardTitle className="text-sky-700">கிரைய ஆவணங்கள்</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={documents} />
        </CardContent>
      </Card>
    </div>
  )
}
