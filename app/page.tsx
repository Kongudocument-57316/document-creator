import Link from "next/link"
import { User, FileText, Settings } from "lucide-react"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-8">
      <div className="w-full max-w-5xl">
        <h1 className="text-4xl font-bold text-center mb-12">தமிழ் ஆவ</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            href="/document-details"
            className="group rounded-lg border border-amber-200 bg-amber-50 px-5 py-4 transition-colors hover:border-amber-300 hover:bg-amber-100"
          >
            <div className="flex items-center mb-3">
              <FileText className="mr-2 text-amber-600" />
              <h3 className="text-2xl font-semibold text-amber-800">ஆவண விவரங்கள்</h3>
            </div>
            <p className="m-0 text-sm text-amber-700 opacity-70">ஆவணங்களை நிர்வகிக்கவும், புதிய ஆவணங்களை உருவாக்கவும்.</p>
          </Link>

          <Link
            href="/system-settings"
            className="group rounded-lg border border-gray-200 bg-gray-50 px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100"
          >
            <div className="flex items-center mb-3">
              <Settings className="mr-2 text-gray-600" />
              <h3 className="text-2xl font-semibold text-gray-800">அமைப்பு விவரங்கள்</h3>
            </div>
            <p className="m-0 text-sm text-gray-700 opacity-70">அமைப்பு விவரங்களை நிர்வகிக்கவும், பயனர்களை சேர்க்கவும்.</p>
          </Link>

          <Link
            href="/system-settings/user-management"
            className="group rounded-lg border border-green-200 bg-green-50 px-5 py-4 transition-colors hover:border-green-300 hover:bg-green-100"
          >
            <div className="flex items-center mb-3">
              <User className="mr-2 text-green-600" />
              <h3 className="text-2xl font-semibold text-green-800">பயனாளர் மேலாண்மை</h3>
            </div>
            <p className="m-0 text-sm text-green-700 opacity-70">பயனாளர்களை நிர்வகிக்கவும், புதிய பயனாளர்களை சேர்க்கவும்.</p>
          </Link>
        </div>
      </div>
    </main>
  )
}
