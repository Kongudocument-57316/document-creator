import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Home, Plus, Search } from "lucide-react"
import Link from "next/link"

export default function PartitionReleasePage() {
  return (
    <div className="flex min-h-screen flex-col bg-amber-50">
      <Header className="bg-amber-100 border-amber-200" />
      <main className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-amber-800">பாகபாத்திய விடுதலை ஆவண விவரங்கள்</h1>
            <div className="flex gap-2">
              <Link href="/document-details">
                <Button variant="outline" className="bg-amber-100 hover:bg-amber-200 text-amber-800 border-amber-300">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  திரும்பிச் செல்
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" className="bg-amber-100 hover:bg-amber-200 text-amber-800 border-amber-300">
                  <Home className="mr-2 h-4 w-4" />
                  முகப்பு
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link href="/document-details/partition-release/create">
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer border-amber-200">
                <CardHeader className="bg-amber-100 border-b border-amber-200">
                  <CardTitle className="flex items-center text-amber-800">
                    <Plus className="mr-2 h-5 w-5" />
                    புதிய ஆவணம் உருவாக்கு
                  </CardTitle>
                  <CardDescription className="text-amber-600">புதிய பாகபாத்திய விடுதலை ஆவணம் உருவாக்கவும்</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <p className="text-amber-700">
                    இந்த பகுதியில் புதிய பாகபாத்திய விடுதலை ஆவணத்தை உருவாக்கலாம். தேவையான விவரங்களை நிரப்பி ஆவணத்தை உருவாக்கவும்.
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/document-details/partition-release/search">
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer border-amber-200">
                <CardHeader className="bg-amber-100 border-b border-amber-200">
                  <CardTitle className="flex items-center text-amber-800">
                    <Search className="mr-2 h-5 w-5" />
                    ஆவணங்கள் தேடுதல்
                  </CardTitle>
                  <CardDescription className="text-amber-600">பாகபாத்திய விடுதலை ஆவணங்களை தேடவும்</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <p className="text-amber-700">
                    இந்த பகுதியில் ஏற்கனவே உருவாக்கப்பட்ட பாகபாத்திய விடுதலை ஆவணங்களை தேடலாம். பல்வேறு தேடல் விருப்பங்களைப் பயன்படுத்தி
                    ஆவணங்களைக் கண்டறியலாம்.
                  </p>
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
