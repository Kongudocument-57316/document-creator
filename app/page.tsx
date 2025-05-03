import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Settings, FileText } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-mint-50">
      <Header className="bg-mint-100 border-mint-200" />
      <main className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-mint-800 text-center">தமிழ் ஆவண மேலாண்மை</h1>

          <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-1">
            <Link href="/system-settings">
              <Card className="hover:bg-mint-100 cursor-pointer transition-colors border-mint-200 shadow-md">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xl font-medium text-mint-700">அமைப்பு விவரங்கள்</CardTitle>
                  <Settings className="h-6 w-6 text-mint-500" />
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-mint-700 text-base">
                    இட விவரங்கள், பயனாளர்கள் மேலாண்மை, ஆவண விபரங்கள், மனையின் சொத்து விவரங்கள் ஆகியவற்றை நிர்வகிக்க இங்கே கிளிக் செய்யவும்
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>

            <Link href="/document-details">
              <Card className="hover:bg-mint-100 cursor-pointer transition-colors border-mint-200 shadow-md">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xl font-medium text-mint-700">ஆவண விவரங்கள்</CardTitle>
                  <FileText className="h-6 w-6 text-mint-500" />
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-mint-700 text-base">
                    ஆவணங்களை நிர்வகிக்க இங்கே கிளிக் செய்யவும்
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          </div>

          <div className="mt-8 p-6 bg-mint-100 rounded-lg border border-mint-200 shadow-sm">
            <h2 className="text-xl font-semibold text-mint-800 mb-4">வரவேற்கிறோம்!</h2>
            <p className="text-mint-700 mb-3">இந்த மென்பொருள் ஆவணங்களை எளிதாக நிர்வகிக்க உதவுகிறது. இதன் மூலம் நீங்கள்:</p>
            <ul className="list-disc pl-5 text-mint-700 space-y-2">
              <li>இட விவரங்களை பதிவு செய்யலாம்</li>
              <li>பயனாளர்களை நிர்வகிக்கலாம்</li>
              <li>ஆவண விபரங்களை சேமிக்கலாம்</li>
              <li>மனையின் சொத்து விபரங்களை பதிவு செய்யலாம்</li>
            </ul>
          </div>
        </div>
      </main>
      <footer className="bg-mint-100 border-t border-mint-200 py-4 text-center text-mint-700">
        <p>© 2025 தமிழ் ஆவண மேலாண்மை. அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.</p>
      </footer>
    </div>
  )
}
