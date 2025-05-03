import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { FileCodeIcon as FileContract, Search, Home, ArrowLeft } from "lucide-react"

export default function SaleAgreement() {
  return (
    <div className="flex min-h-screen flex-col bg-purple-50">
      <Header className="bg-purple-100 border-purple-200" />
      <div className="flex items-center gap-2 p-4 bg-purple-50">
        <Button asChild variant="outline" className="border-purple-300 text-purple-700 hover:bg-purple-100">
          <Link href="/document-details">
            <ArrowLeft className="h-4 w-4 mr-2" />
            பின்செல்
          </Link>
        </Button>
        <Button asChild variant="outline" className="border-purple-300 text-purple-700 hover:bg-purple-100">
          <Link href="/">
            <Home className="h-4 w-4 mr-2" />
            முகப்பு
          </Link>
        </Button>
      </div>
      <main className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-purple-800 text-center">கிரைய உடன்படிக்கை ஆவண விவரங்கள்</h1>

          <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
            <Link href="/document-details/sale-agreement/create">
              <Card className="hover:bg-purple-100 cursor-pointer transition-colors border-purple-200 shadow-md">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xl font-medium text-purple-700">
                    புதிய கிரைய உடன்படிக்கை ஆவணம் உருவாக்கு
                  </CardTitle>
                  <FileContract className="h-6 w-6 text-purple-500" />
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-purple-700 text-base">
                    புதிய கிரைய உடன்படிக்கை ஆவணத்தை உருவாக்க இங்கே கிளிக் செய்யவும்
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>

            <Link href="/document-details/sale-agreement/search">
              <Card className="hover:bg-purple-100 cursor-pointer transition-colors border-purple-200 shadow-md">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xl font-medium text-purple-700">கிரைய உடன்படிக்கை ஆவணங்கள் தேடுதல்</CardTitle>
                  <Search className="h-6 w-6 text-purple-500" />
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-purple-700 text-base">
                    கிரைய உடன்படிக்கை ஆவணங்களை தேட இங்கே கிளிக் செய்யவும்
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </main>
      <footer className="bg-purple-100 border-t border-purple-200 py-4 text-center text-purple-700">
        <p>© 2025 தமிழ் ஆவண மேலாண்மை. அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.</p>
      </footer>
    </div>
  )
}
