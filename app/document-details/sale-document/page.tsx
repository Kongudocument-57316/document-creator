import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { FileText, Search, Home, ArrowLeft } from "lucide-react"

export default function SaleDocument() {
  return (
    <div className="flex min-h-screen flex-col bg-teal-50">
      <Header className="bg-teal-100 border-teal-200" />
      <div className="flex items-center gap-2 p-4 bg-teal-50">
        <Button asChild variant="outline" className="border-teal-300 text-teal-700 hover:bg-teal-100">
          <Link href="/document-details">
            <ArrowLeft className="h-4 w-4 mr-2" />
            பின்செல்
          </Link>
        </Button>
        <Button asChild variant="outline" className="border-teal-300 text-teal-700 hover:bg-teal-100">
          <Link href="/">
            <Home className="h-4 w-4 mr-2" />
            முகப்பு
          </Link>
        </Button>
      </div>
      <main className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-teal-800 text-center">கிரைய ஆவண விவரங்கள்</h1>

          <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
            <Link href="/document-details/sale-document/create">
              <Card className="hover:bg-teal-100 cursor-pointer transition-colors border-teal-200 shadow-md">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xl font-medium text-teal-700">புதிய கிரைய ஆவணம் உருவாக்கு</CardTitle>
                  <FileText className="h-6 w-6 text-teal-500" />
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-teal-700 text-base">
                    புதிய கிரைய ஆவணத்தை உருவாக்க இங்கே கிளிக் செய்யவும்
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>

            <Link href="/document-details/sale-document/search">
              <Card className="hover:bg-teal-100 cursor-pointer transition-colors border-teal-200 shadow-md">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xl font-medium text-teal-700">கிரைய ஆவணங்கள் தேடுதல்</CardTitle>
                  <Search className="h-6 w-6 text-teal-500" />
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-teal-700 text-base">
                    கிரைய ஆவணங்களை தேட இங்கே கிளிக் செய்யவும்
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </main>
      <footer className="bg-teal-100 border-t border-teal-200 py-4 text-center text-teal-700">
        <p>© 2025 தமிழ் ஆவண மேலாண்மை. அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.</p>
      </footer>
    </div>
  )
}
