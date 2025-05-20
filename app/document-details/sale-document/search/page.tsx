import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Home, ArrowLeft, Search } from "lucide-react"

export default function SearchSaleDocumentPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-sky-800">கிரைய ஆவணங்கள் தேடுதல்</h1>
        <div className="flex space-x-2">
          <Button variant="outline" asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              முகப்பு
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/document-details/sale-document">
              <ArrowLeft className="mr-2 h-4 w-4" />
              பின்செல்
            </Link>
          </Button>
        </div>
      </div>

      <Card className="bg-sky-50 border-sky-200">
        <CardHeader>
          <CardTitle className="text-sky-800">தேடல் விருப்பங்கள்</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="document_number">ஆவண எண்</Label>
              <Input id="document_number" placeholder="ஆவண எண்ணை உள்ளிடவும்" className="bg-white" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="registration_date">பதிவு தேதி</Label>
              <Input id="registration_date" type="date" className="bg-white" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="seller_name">விற்பவர் பெயர்</Label>
              <Input id="seller_name" placeholder="விற்பவர் பெயரை உள்ளிடவும்" className="bg-white" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="buyer_name">வாங்குபவர் பெயர்</Label>
              <Input id="buyer_name" placeholder="வாங்குபவர் பெயரை உள்ளிடவும்" className="bg-white" />
            </div>
          </div>
          <Button className="mt-4 bg-sky-600 hover:bg-sky-700">
            <Search className="mr-2 h-4 w-4" />
            தேடு
          </Button>
        </CardContent>
      </Card>

      <Card className="mt-6 bg-white">
        <CardHeader>
          <CardTitle className="text-sky-800">தேடல் முடிவுகள்</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500">தேடல் முடிவுகள் இங்கே காட்டப்படும்.</p>
        </CardContent>
      </Card>
    </div>
  )
}
