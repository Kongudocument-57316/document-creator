import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Home, User } from "lucide-react"

export default function SystemSettingsPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">அமைப்பு விவரங்கள்</h1>
        <Button variant="outline" asChild>
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            முகப்பு
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/system-settings/user-management">
          <Card className="bg-green-50 border-green-200 hover:bg-green-100 transition-colors cursor-pointer h-full">
            <CardHeader>
              <CardTitle className="text-green-800">பயனாளர் மேலாண்மை</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-green-700">பயனாளர்களை நிர்வகிக்கவும், புதிய பயனாளர்களை சேர்க்கவும்.</p>
              <div className="flex justify-center mt-4">
                <User className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}
