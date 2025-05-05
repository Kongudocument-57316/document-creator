import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { FileText } from "lucide-react"

export default function DocumentDetails() {
  return (
    <div className="flex min-h-screen flex-col bg-amber-50">
      <Header className="bg-amber-100 border-amber-200" />
      <main className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-amber-800 text-center">ஆவண விவரங்கள்</h1>

          <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-1">
            <Link href="/document-details/sale-document">
              <Card className="hover:bg-amber-100 cursor-pointer transition-colors border-amber-200 shadow-md">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xl font-medium text-amber-700">கிரைய ஆவண விவரங்கள்</CardTitle>
                  <FileText className="h-6 w-6 text-amber-500" />
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-amber-700 text-base">
                    கிரைய ஆவணங்களை நிர்வகிக்க இங்கே கிளிக் செய்யவும்
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </main>
      <footer className="bg-amber-100 border-t border-amber-200 py-4 text-center text-amber-700">
        <p>© 2025 தமிழ் ஆவண மேலாண்மை. அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.</p>
      </footer>
    </div>
  )
}
