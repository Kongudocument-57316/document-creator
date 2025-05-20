import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Home } from "lucide-react"

export default function DocumentDetailsPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-amber-800">ஆவண விவரங்கள்</h1>
        <Button variant="outline" asChild>
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            முகப்பு
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/document-details/sale-document">
          <Card className="bg-amber-50 border-amber-200 hover:bg-amber-100 transition-colors cursor-pointer h-full">
            <CardHeader>
              <CardTitle className="text-amber-800">கிரைய ஆவண விவரங்கள்</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-amber-700">கிரைய ஆவணங்களை நிர்வகிக்கவும், புதிய கிரைய ஆவணங்களை உருவாக்கவும்.</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}
