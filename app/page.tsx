import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Settings,
  FileText,
  FileEdit,
  BarChart3,
  Users,
  Clock,
  FileCheck,
  PlusCircle,
  Calendar,
  Building,
  Landmark,
} from "lucide-react"
import { Header } from "@/components/header"

export default function Dashboard() {
  // Sample data for the dashboard
  const recentDocuments = [
    { id: 1, title: "கிரைய பத்திரம் #2023-001", date: "10 மே 2023", type: "விற்பனை" },
    { id: 2, title: "அடமான பத்திரம் #2023-002", date: "15 மே 2023", type: "அடமானம்" },
    { id: 3, title: "வாடகை ஒப்பந்தம் #2023-003", date: "20 மே 2023", type: "வாடகை" },
  ]

  const stats = [
    { title: "மொத்த ஆவணங்கள்", value: "124", icon: FileText, color: "bg-purple-500" },
    { title: "பயனர்கள்", value: "38", icon: Users, color: "bg-cyan-500" },
    { title: "இன்றைய ஆவணங்கள்", value: "7", icon: Clock, color: "bg-amber-500" },
    { title: "முடிக்கப்பட்டவை", value: "96", icon: FileCheck, color: "bg-green-500" },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-purple-50 to-white">
      <Header className="bg-white shadow-sm" />

      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-xl p-6 mb-8 shadow-lg">
          <h1 className="text-3xl font-bold text-white mb-2">வணக்கம், நிர்வாகி!</h1>
          <p className="text-purple-100">தமிழ் ஆவண மேலாண்மை அமைப்பிற்கு வரவேற்கிறோம்</p>
          <div className="flex gap-4 mt-4">
            <Button className="bg-white text-purple-700 hover:bg-purple-50">
              <PlusCircle className="mr-2 h-4 w-4" />
              புதிய ஆவணம் உருவாக்கு
            </Button>
            <Button variant="outline" className="bg-transparent text-white border-white hover:bg-purple-700">
              <FileText className="mr-2 h-4 w-4" />
              ஆவணங்களைப் பார்க்க
            </Button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="border-none shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6 flex items-center">
                <div className={`${stat.color} p-3 rounded-full mr-4`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Recent Documents */}
            <Card className="shadow-md border-none">
              <CardHeader className="bg-gradient-to-r from-purple-100 to-purple-50 rounded-t-lg pb-4">
                <CardTitle className="text-purple-800 flex items-center">
                  <Clock className="mr-2 h-5 w-5" />
                  சமீபத்திய ஆவணங்கள்
                </CardTitle>
                <CardDescription>உங்கள் சமீபத்திய ஆவணங்களின் பட்டியல்</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  {recentDocuments.map((doc) => (
                    <div key={doc.id} className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium text-purple-900">{doc.title}</h3>
                          <p className="text-sm text-gray-500">{doc.date}</p>
                        </div>
                        <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">{doc.type}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="bg-gray-50 rounded-b-lg">
                <Button variant="ghost" className="text-purple-600 hover:text-purple-800 hover:bg-purple-50 w-full">
                  அனைத்து ஆவணங்களையும் காண்க
                </Button>
              </CardFooter>
            </Card>

            {/* Activity Chart */}
            <Card className="shadow-md border-none">
              <CardHeader className="bg-gradient-to-r from-cyan-100 to-cyan-50 rounded-t-lg">
                <CardTitle className="text-cyan-800 flex items-center">
                  <BarChart3 className="mr-2 h-5 w-5" />
                  ஆவண செயல்பாடு
                </CardTitle>
                <CardDescription>கடந்த 30 நாட்களில் உருவாக்கப்பட்ட ஆவணங்கள்</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="h-64 flex items-center justify-center bg-gradient-to-r from-cyan-50 to-purple-50 rounded-lg">
                  <div className="flex space-x-2">
                    {[40, 65, 30, 55, 60, 75, 45, 80, 65, 70, 50, 60].map((height, i) => (
                      <div key={i} className="flex flex-col items-center">
                        <div
                          className="w-6 bg-gradient-to-t from-purple-500 to-cyan-500 rounded-t-sm"
                          style={{ height: `${height}%` }}
                        ></div>
                        <span className="text-xs mt-1 text-gray-500">{i + 1}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <Card className="shadow-md border-none">
              <CardHeader className="bg-gradient-to-r from-amber-100 to-amber-50 rounded-t-lg">
                <CardTitle className="text-amber-800 flex items-center">
                  <Settings className="mr-2 h-5 w-5" />
                  விரைவு செயல்கள்
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="grid grid-cols-2 gap-4">
                  <Link href="/document-details/sale-deed-creation" className="w-full">
                    <Button className="w-full bg-purple-600 hover:bg-purple-700 h-auto py-4 flex flex-col items-center">
                      <FileEdit className="h-6 w-6 mb-2" />
                      <span>கிரைய பத்திரம் உருவாக்கு</span>
                    </Button>
                  </Link>
                  <Link href="/system-settings/user-management" className="w-full">
                    <Button className="w-full bg-cyan-600 hover:bg-cyan-700 h-auto py-4 flex flex-col items-center">
                      <Users className="h-6 w-6 mb-2" />
                      <span>பயனர் மேலாண்மை</span>
                    </Button>
                  </Link>
                  <Link href="/document-editor" className="w-full">
                    <Button className="w-full bg-amber-600 hover:bg-amber-700 h-auto py-4 flex flex-col items-center">
                      <FileText className="h-6 w-6 mb-2" />
                      <span>ஆவண எடிட்டர்</span>
                    </Button>
                  </Link>
                  <Link href="/system-settings" className="w-full">
                    <Button className="w-full bg-green-600 hover:bg-green-700 h-auto py-4 flex flex-col items-center">
                      <Settings className="h-6 w-6 mb-2" />
                      <span>அமைப்புகள்</span>
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Calendar */}
            <Card className="shadow-md border-none">
              <CardHeader className="bg-gradient-to-r from-green-100 to-green-50 rounded-t-lg">
                <CardTitle className="text-green-800 flex items-center">
                  <Calendar className="mr-2 h-5 w-5" />
                  நாட்காட்டி
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="bg-white rounded-lg p-4 border border-gray-100">
                  <div className="grid grid-cols-7 gap-1 text-center mb-2">
                    {["ஞா", "தி", "செ", "பு", "வி", "வெ", "ச"].map((day, i) => (
                      <div key={i} className="text-xs font-medium text-gray-500 py-1">
                        {day}
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-1 text-center">
                    {Array.from({ length: 31 }, (_, i) => i + 1).map((date) => (
                      <div
                        key={date}
                        className={`text-sm py-2 rounded-full ${
                          date === 15
                            ? "bg-purple-600 text-white"
                            : date === 22
                              ? "bg-cyan-600 text-white"
                              : date === 10
                                ? "bg-amber-600 text-white"
                                : "hover:bg-purple-50"
                        }`}
                      >
                        {date}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Property Stats */}
            <Card className="shadow-md border-none overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-purple-100 to-purple-50 rounded-t-lg">
                <CardTitle className="text-purple-800 flex items-center">
                  <Building className="mr-2 h-5 w-5" />
                  சொத்து வகைகள்
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="px-4 py-3 flex items-center justify-between hover:bg-gray-50">
                  <div className="flex items-center">
                    <div className="bg-purple-100 p-2 rounded-full mr-3">
                      <Landmark className="h-4 w-4 text-purple-600" />
                    </div>
                    <span>நிலம்</span>
                  </div>
                  <span className="font-medium">42</span>
                </div>
                <div className="px-4 py-3 flex items-center justify-between hover:bg-gray-50 border-t border-gray-100">
                  <div className="flex items-center">
                    <div className="bg-cyan-100 p-2 rounded-full mr-3">
                      <Building className="h-4 w-4 text-cyan-600" />
                    </div>
                    <span>கட்டிடம்</span>
                  </div>
                  <span className="font-medium">38</span>
                </div>
                <div className="px-4 py-3 flex items-center justify-between hover:bg-gray-50 border-t border-gray-100">
                  <div className="flex items-center">
                    <div className="bg-amber-100 p-2 rounded-full mr-3">
                      <Building className="h-4 w-4 text-amber-600" />
                    </div>
                    <span>வணிக சொத்து</span>
                  </div>
                  <span className="font-medium">24</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 mt-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>© 2023 தமிழ் ஆவண மேலாண்மை. அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.</p>
        </div>
      </footer>
    </div>
  )
}
