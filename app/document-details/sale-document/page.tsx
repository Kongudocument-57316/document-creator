import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Home, ArrowLeft, Plus, Search } from "lucide-react"

export default function SaleDocumentPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-teal-800">கிரைய ஆவண விவரங்கள்</h1>
        <div className="flex space-x-2">
          <Button variant="outline" asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              முகப்பு
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/document-details">
              <ArrowLeft className="mr-2 h-4 w-4" />
              பின்செல்
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/document-details/sale-document/create">
          <Card className="bg-cyan-50 border-cyan-200 hover:bg-cyan-100 transition-colors cursor-pointer h-full">
            <CardHeader>
              <CardTitle className="text-cyan-800">புதிய கிரைய ஆவணம் உருவாக்கு</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-cyan-700">புதிய கிரைய ஆவணத்தை உருவாக்கவும்.</p>
              <div className="flex justify-center mt-4">
                <Plus className="h-8 w-8 text-cyan-600" />
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/document-details/sale-document/search">
          <Card className="bg-sky-50 border-sky-200 hover:bg-sky-100 transition-colors cursor-pointer h-full">
            <CardHeader>
              <CardTitle className="text-sky-800">கிரைய ஆவணங்கள் தேடுதல்</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sky-700">கிரைய ஆவணங்களை தேடவும்.</p>
              <div className="flex justify-center mt-4">
                <Search className="h-8 w-8 text-sky-600" />
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}
