import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { MapPin, Users, Home, FileText } from "lucide-react"

export default function SystemSettings() {
  return (
    <div className="flex min-h-screen flex-col bg-lavender-50">
      <Header className="bg-lavender-100 border-lavender-200" />
      <main className="flex-1 p-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-lavender-800">அமைப்பு விவரங்கள்</h2>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
            <Link href="/system-settings/location-details">
              <Card className="hover:bg-lavender-50 cursor-pointer transition-colors border-lavender-200 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-medium text-lavender-700">இட விவரங்கள்</CardTitle>
                  <MapPin className="h-5 w-5 text-lavender-500" />
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-lavender-600">
                    மாநிலம், மாவட்டம், வட்டம், கிராமம், வட்டாட்சியர் அலுவலகம், பதிவு மாவட்டம், சார்பதிவாளர் அலுவலகம்
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>

            <Link href="/system-settings/user-management">
              <Card className="hover:bg-lavender-50 cursor-pointer transition-colors border-lavender-200 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-medium text-lavender-700">பயனாளர்கள் மேலாண்மை</CardTitle>
                  <Users className="h-5 w-5 text-lavender-500" />
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-lavender-600">
                    பயனாளரின் பெயர், பாலினம், உறவுமுறை, முகவரி, தொலைபேசி எண், ஆதார் விவரங்கள்
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>

            <Link href="/system-settings/property-details">
              <Card className="hover:bg-lavender-50 cursor-pointer transition-colors border-lavender-200 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-medium text-lavender-700">மனையின் சொத்து விபரங்கள்</CardTitle>
                  <Home className="h-5 w-5 text-lavender-500" />
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-lavender-600">
                    மனையின் பெயர், பதிவு மாவட்டம், சார்பதிவாளர் அலுவலகம், மாவட்டம், வட்டம், கிராமம், சர்வே எண்
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>

            <Link href="/system-settings/document-requirements">
              <Card className="hover:bg-lavender-50 cursor-pointer transition-colors border-lavender-200 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-medium text-lavender-700">ஆவணத்திற்கு தேவையான விவரங்கள்</CardTitle>
                  <FileText className="h-5 w-5 text-lavender-500" />
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-lavender-600">
                    புத்தக எண், ஆவணத்தின் வகை, ஆவணம் ஒப்படைப்பு, தட்டச்சாளர் பெயர், தட்டச்சு அலுவலக பெயர், தொலைபேசி எண்
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </main>
      <footer className="bg-lavender-100 border-t border-lavender-200 py-4 text-center text-lavender-700">
        <p>© 2023 தமிழ் ஆவண மேலாண்மை. அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.</p>
      </footer>
    </div>
  )
}
