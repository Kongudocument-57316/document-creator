import { Header } from "@/components/header"
import Link from "next/link"
import { FileText, FileSignature } from "lucide-react"

export default function DocumentDetails() {
  return (
    <div className="flex min-h-screen flex-col bg-purple-50">
      <Header className="bg-purple-100 border-purple-200" />
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-purple-800">ஆவண விவரங்கள்</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href="/document-details/sale-document" className="block">
              <div className="bg-white p-6 rounded-lg border border-purple-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  <FileText className="h-8 w-8 text-purple-600 mr-3" />
                  <h3 className="text-xl font-semibold text-purple-800">கிரைய ஆவணம்</h3>
                </div>
                <p className="text-gray-600">கிரைய ஆவணங்களை உருவாக்கவும், தேடவும் மற்றும் நிர்வகிக்கவும்.</p>
              </div>
            </Link>

            <Link href="/document-details/sale-deed-creation" className="block">
              <div className="bg-white p-6 rounded-lg border border-purple-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  <FileSignature className="h-8 w-8 text-purple-600 mr-3" />
                  <h3 className="text-xl font-semibold text-purple-800">கிரைய பத்திரம் உருவாக்கு</h3>
                </div>
                <p className="text-gray-600">புதிய கிரைய பத்திரத்தை உருவாக்கவும் மற்றும் PDF ஆக ஏற்றுமதி செய்யவும்.</p>
              </div>
            </Link>
          </div>
        </div>
      </main>
      <footer className="bg-purple-100 border-t border-purple-200 py-4 text-center text-purple-700">
        <p>© 2023 தமிழ் ஆவண மேலாண்மை. அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.</p>
      </footer>
    </div>
  )
}
