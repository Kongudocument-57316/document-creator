import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Home, Search, Plus, ArrowLeft, Receipt } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function MortgageLoanDocumentPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Header />
      <main className="flex-1 p-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">அடமான கடன் ஆவண விவரங்கள்</h1>
            <div className="flex gap-2">
              <Link href="/document-details">
                <Button variant="outline" className="bg-white hover:bg-gray-100">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  திரும்பிச் செல்
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" className="bg-white hover:bg-gray-100">
                  <Home className="mr-2 h-4 w-4" />
                  முகப்பு
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link href="/document-details/mortgage-loan/create">
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="bg-teal-50 border-b border-teal-100">
                  <CardTitle className="flex items-center text-teal-800">
                    <Plus className="mr-2 h-5 w-5" />
                    புதிய அடமான கடன் ஆவணம் உருவாக்கு
                  </CardTitle>
                  <CardDescription className="text-teal-600">புதிய அடமான கடன் ஆவணம் உருவாக்கு</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <p className="text-gray-700">புதிய அடமான கடன் ஆவணத்தை உருவாக்கவும்.</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/document-details/mortgage-loan/search">
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="bg-teal-50 border-b border-teal-100">
                  <CardTitle className="flex items-center text-teal-800">
                    <Search className="mr-2 h-5 w-5" />
                    அடமான கடன் ஆவணம் தேடுதல்
                  </CardTitle>
                  <CardDescription className="text-teal-600">அடமான கடன் ஆவணம் தேடுதல்</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <p className="text-gray-700">அடமான கடன் ஆவணங்களை தேடவும்.</p>
                </CardContent>
              </Card>
            </Link>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mt-10 mb-6">அடமான கடன் ரசீது விவரங்கள்</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link href="/document-details/mortgage-loan/receipt/create">
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="bg-blue-50 border-b border-blue-100">
                  <CardTitle className="flex items-center text-blue-800">
                    <Receipt className="mr-2 h-5 w-5" />
                    புதிய அடமான கடன் ரசீது
                  </CardTitle>
                  <CardDescription className="text-blue-600">புதிய அடமான கடன் ரசீது உருவாக்கு</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <p className="text-gray-700">புதிய அடமான கடன் ரசீதை உருவாக்கவும்.</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/document-details/mortgage-loan/receipt/search">
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="bg-blue-50 border-b border-blue-100">
                  <CardTitle className="flex items-center text-blue-800">
                    <Search className="mr-2 h-5 w-5" />
                    அடமான கடன் ரசீது ஆவணங்கள் தேடுதல்
                  </CardTitle>
                  <CardDescription className="text-blue-600">அடமான கடன் ரசீது ஆவணங்கள் தேடுதல்</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <p className="text-gray-700">அடமான கடன் ரசீது ஆவணங்களை தேடவும்.</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </main>
      <footer className="bg-gray-100 border-t border-gray-200 py-4 text-center text-gray-600">
        <p>© 2025 தமிழ் ஆவண மேலாண்மை. அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.</p>
      </footer>
    </div>
  )
}
