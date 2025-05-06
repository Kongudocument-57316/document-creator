import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { MapPin, Users, Home, FileText } from "lucide-react"

export default function SystemSettings() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-lavender-50 to-white">
      <Header className="bg-gradient-to-r from-lavender-100 to-lavender-200 border-lavender-300" />
      <main className="flex-1 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center space-x-2 mb-6">
            <div className="h-10 w-10 rounded-full bg-lavender-200 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-lavender-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-lavender-800">அமைப்பு விவரங்கள்</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
            <Link href="/system-settings/location-details">
              <Card className="hover:bg-gradient-to-br from-blue-50 to-blue-100 cursor-pointer transition-colors border-blue-300 shadow-md hover:shadow-blue-200/50 overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-blue-600/5 opacity-50 group-hover:opacity-70 transition-opacity"></div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                  <CardTitle className="text-lg font-medium text-blue-700 group-hover:text-blue-800">
                    இட விவரங்கள்
                  </CardTitle>
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <MapPin className="h-5 w-5 text-blue-600 group-hover:text-blue-700" />
                  </div>
                </CardHeader>
                <CardContent className="relative z-10">
                  <CardDescription className="text-blue-600 group-hover:text-blue-700">
                    மாநிலம், மாவட்டம், வட்டம், கிராமம், வட்டாட்சியர் அலுவலகம், பதிவு மாவட்டம், சார்பதிவாளர் அலுவலகம்
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>

            <Link href="/system-settings/user-management">
              <Card className="hover:bg-gradient-to-br from-green-50 to-green-100 cursor-pointer transition-colors border-green-300 shadow-md hover:shadow-green-200/50 overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-green-600/5 opacity-50 group-hover:opacity-70 transition-opacity"></div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                  <CardTitle className="text-lg font-medium text-green-700 group-hover:text-green-800">
                    பயனாளர்கள் மேலாண்மை
                  </CardTitle>
                  <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors">
                    <Users className="h-5 w-5 text-green-600 group-hover:text-green-700" />
                  </div>
                </CardHeader>
                <CardContent className="relative z-10">
                  <CardDescription className="text-green-600 group-hover:text-green-700">
                    பயனாளரின் பெயர், பாலினம், உறவுமுறை, முகவரி, தொலைபேசி எண், ஆதார் விவரங்கள்
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>

            <Link href="/system-settings/property-details">
              <Card className="hover:bg-gradient-to-br from-purple-50 to-purple-100 cursor-pointer transition-colors border-purple-300 shadow-md hover:shadow-purple-200/50 overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-purple-600/5 opacity-50 group-hover:opacity-70 transition-opacity"></div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                  <CardTitle className="text-lg font-medium text-purple-700 group-hover:text-purple-800">
                    மனையின் சொத்து விபரங்கள்
                  </CardTitle>
                  <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                    <Home className="h-5 w-5 text-purple-600 group-hover:text-purple-700" />
                  </div>
                </CardHeader>
                <CardContent className="relative z-10">
                  <CardDescription className="text-purple-600 group-hover:text-purple-700">
                    மனையின் பெயர், பதிவு மாவட்டம், சார்பதிவாளர் அலுவலகம், மாவட்டம், வட்டம், கிராமம், சர்வே எண்
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>

            <Link href="/system-settings/document-requirements">
              <Card className="hover:bg-gradient-to-br from-rose-50 to-rose-100 cursor-pointer transition-colors border-rose-300 shadow-md hover:shadow-rose-200/50 overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-rose-500/10 to-rose-600/5 opacity-50 group-hover:opacity-70 transition-opacity"></div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                  <CardTitle className="text-lg font-medium text-rose-700 group-hover:text-rose-800">
                    ஆவணத்திற்கு தேவையான விவரங்கள்
                  </CardTitle>
                  <div className="h-8 w-8 rounded-full bg-rose-100 flex items-center justify-center group-hover:bg-rose-200 transition-colors">
                    <FileText className="h-5 w-5 text-rose-600 group-hover:text-rose-700" />
                  </div>
                </CardHeader>
                <CardContent className="relative z-10">
                  <CardDescription className="text-rose-600 group-hover:text-rose-700">
                    புத்தக எண், ஆவணத்தின் வகை, ஆவணம் ஒப்படைப்பு, தட்டச்சாளர் பெயர், தட்டச்சு அலுவலக பெயர், தொலைபேசி எண்
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </main>
      <footer className="bg-gradient-to-r from-lavender-100 to-lavender-200 border-t border-lavender-300 py-4 text-center text-lavender-700">
        <p>© 2023 தமிழ் ஆவண மேலாண்மை. அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.</p>
      </footer>
    </div>
  )
}
