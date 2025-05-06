import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { MapPin, Users, Home, FileText } from "lucide-react"

export default function SystemSettings() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-lavender-50 to-lavender-100">
      <Header className="bg-lavender-200/70 border-lavender-300 backdrop-blur-sm" />
      <main className="flex-1 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white/60 backdrop-blur-sm p-6 rounded-lg shadow-sm border border-lavender-200 mb-6">
            <h2 className="text-2xl font-bold text-lavender-800 flex items-center gap-2">
              <span className="bg-lavender-600 h-8 w-1 rounded-full inline-block"></span>
              அமைப்பு விவரங்கள்
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
            <Link
              href="/system-settings/location-details"
              className="transition-transform duration-300 hover:scale-[1.02]"
            >
              <Card className="h-full bg-gradient-to-br from-lavender-50 to-lavender-100 border-lavender-200 shadow-md overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-lavender-300/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-lavender-100/50">
                  <CardTitle className="text-lg font-medium text-lavender-800">இட விவரங்கள்</CardTitle>
                  <div className="p-2 bg-lavender-200 rounded-full group-hover:bg-lavender-300 transition-colors">
                    <MapPin className="h-5 w-5 text-lavender-700" />
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <CardDescription className="text-lavender-700">
                    மாநிலம், மாவட்டம், வட்டம், கிராமம், வட்டாட்சியர் அலுவலகம், பதிவு மாவட்டம், சார்பதிவாளர் அலுவலகம்
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>

            <Link
              href="/system-settings/user-management"
              className="transition-transform duration-300 hover:scale-[1.02]"
            >
              <Card className="h-full bg-gradient-to-br from-lavender-50 to-lavender-100 border-lavender-200 shadow-md overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-lavender-300/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-lavender-100/50">
                  <CardTitle className="text-lg font-medium text-lavender-800">பயனாளர்கள் மேலாண்மை</CardTitle>
                  <div className="p-2 bg-lavender-200 rounded-full group-hover:bg-lavender-300 transition-colors">
                    <Users className="h-5 w-5 text-lavender-700" />
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <CardDescription className="text-lavender-700">
                    பயனாளரின் பெயர், பாலினம், உறவுமுறை, முகவரி, தொலைபேசி எண், ஆதார் விவரங்கள்
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>

            <Link
              href="/system-settings/property-details"
              className="transition-transform duration-300 hover:scale-[1.02]"
            >
              <Card className="h-full bg-gradient-to-br from-lavender-50 to-lavender-100 border-lavender-200 shadow-md overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-lavender-300/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-lavender-100/50">
                  <CardTitle className="text-lg font-medium text-lavender-800">மனையின் சொத்து விபரங்கள்</CardTitle>
                  <div className="p-2 bg-lavender-200 rounded-full group-hover:bg-lavender-300 transition-colors">
                    <Home className="h-5 w-5 text-lavender-700" />
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <CardDescription className="text-lavender-700">
                    மனையின் பெயர், பதிவு மாவட்டம், சார்பதிவாளர் அலுவலகம், மாவட்டம், வட்டம், கிராமம், சர்வே எண்
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>

            <Link
              href="/system-settings/document-requirements"
              className="transition-transform duration-300 hover:scale-[1.02]"
            >
              <Card className="h-full bg-gradient-to-br from-lavender-50 to-lavender-100 border-lavender-200 shadow-md overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-lavender-300/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-lavender-100/50">
                  <CardTitle className="text-lg font-medium text-lavender-800">ஆவணத்திற்கு தேவையான விவரங்கள்</CardTitle>
                  <div className="p-2 bg-lavender-200 rounded-full group-hover:bg-lavender-300 transition-colors">
                    <FileText className="h-5 w-5 text-lavender-700" />
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <CardDescription className="text-lavender-700">
                    புத்தக எண், ஆவணத்தின் வகை, ஆவணம் ஒப்படைப்பு, தட்டச்சாளர் பெயர், தட்டச்சு அலுவலக பெயர், தொலைபேசி எண்
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </main>
      <footer className="bg-lavender-200/70 backdrop-blur-sm border-t border-lavender-300 py-6 text-center text-lavender-800 shadow-inner">
        <p className="font-medium">© 2023 தமிழ் ஆவண மேலாண்மை. அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.</p>
      </footer>
    </div>
  )
}
