import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Settings, FileText, FileEdit } from "lucide-react"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-12">தமிழ் ஆவ</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-green-200">
            <CardHeader className="bg-green-50 rounded-t-lg">
              <CardTitle className="text-green-700">அமைப்பு விவரங்கள்</CardTitle>
              <CardDescription>System Settings</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-gray-600">அமைப்பு விவரங்களை நிர்வகிக்கவும்</p>
            </CardContent>
            <CardFooter>
              <Link href="/system-settings" className="w-full">
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  <Settings className="mr-2 h-4 w-4" />
                  அமைப்பு விவரங்கள்
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <Card className="border-amber-200">
            <CardHeader className="bg-amber-50 rounded-t-lg">
              <CardTitle className="text-amber-700">ஆவண விவரங்கள்</CardTitle>
              <CardDescription>Document Details</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-gray-600">ஆவண விவரங்களை நிர்வகிக்கவும்</p>
            </CardContent>
            <CardFooter>
              <Link href="/document-details" className="w-full">
                <Button className="w-full bg-amber-600 hover:bg-amber-700">
                  <FileText className="mr-2 h-4 w-4" />
                  ஆவண விவரங்கள்
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <Card className="border-purple-200">
            <CardHeader className="bg-purple-50 rounded-t-lg">
              <CardTitle className="text-purple-700">ஆவண எடிட்டர்</CardTitle>
              <CardDescription>Document Editor</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-gray-600">ஆவணங்களை உருவாக்கவும், திருத்தவும், ஏற்றுமதி செய்யவும்</p>
            </CardContent>
            <CardFooter>
              <Link href="/document-editor" className="w-full">
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  <FileEdit className="mr-2 h-4 w-4" />
                  ஆவண எடிட்டர்
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </main>
  )
}
