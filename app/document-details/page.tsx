import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Home, Scissors, FileCheck } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function DocumentDetailsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Header />
      <main className="flex-1 p-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">ஆவண விவரங்கள்</h1>
            <div className="flex gap-2">
              <Link href="/">
                <Button variant="outline" className="bg-white hover:bg-gray-100">
                  <Home className="mr-2 h-4 w-4" />
                  முகப்பு
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href="/document-details/sale-document">
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="bg-blue-50 border-b border-blue-100">
                  <CardTitle className="flex items-center text-blue-800">
                    <FileText className="mr-2 h-5 w-5" />
                    விற்பனை ஆவணம்
                  </CardTitle>
                  <CardDescription className="text-blue-600">விற்பனை ஆவண விவரங்கள்</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <p className="text-gray-700">விற்பனை ஆவணங்களை உருவாக்கவும், தேடவும் மற்றும் நிர்வகிக்கவும்.</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/document-details/sale-agreement">
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="bg-violet-50 border-b border-violet-100">
                  <CardTitle className="flex items-center text-violet-800">
                    <FileText className="mr-2 h-5 w-5" />
                    கிரைய உடன்படிக்கை
                  </CardTitle>
                  <CardDescription className="text-violet-600">கிரைய உடன்படிக்கை ஆவண விவரங்கள்</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <p className="text-gray-700">கிரைய உடன்படிக்கை ஆவணங்களை உருவாக்கவும், தேடவும் மற்றும் நிர்வகிக்கவும்.</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/document-details/settlement-document">
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="bg-green-50 border-b border-green-100">
                  <CardTitle className="flex items-center text-green-800">
                    <FileText className="mr-2 h-5 w-5" />
                    தானசெட்டில்மெண்ட்
                  </CardTitle>
                  <CardDescription className="text-green-600">தானசெட்டில்மெண்ட் ஆவண விவரங்கள்</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <p className="text-gray-700">தானசெட்டில்மெண்ட் ஆவணங்களை உருவாக்கவும், தேடவும் மற்றும் நிர்வகிக்கவும்.</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/document-details/partition-release">
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="bg-amber-50 border-b border-amber-100">
                  <CardTitle className="flex items-center text-amber-800">
                    <Scissors className="mr-2 h-5 w-5" />
                    பாகபாத்திய விடுதலை
                  </CardTitle>
                  <CardDescription className="text-amber-600">பாகபாத்திய விடுதலை ஆவண விவரங்கள்</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <p className="text-gray-700">பாகபாத்திய விடுதலை ஆவணங்களை உருவாக்கவும், தேடவும் மற்றும் நிர்வகிக்கவும்.</p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/document-details/mortgage-loan">
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="bg-teal-50 border-b border-teal-100">
                  <CardTitle className="flex items-center text-teal-800">
                    <FileCheck className="mr-2 h-5 w-5" />
                    அடமான கடன் ஆவணம்
                  </CardTitle>
                  <CardDescription className="text-teal-600">அடமான கடன் ஆவண விவரங்கள்</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <p className="text-gray-700">அடமான கடன் ஆவணங்களை உருவாக்கவும், தேடவும் மற்றும் நிர்வகிக்கவும்.</p>
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
