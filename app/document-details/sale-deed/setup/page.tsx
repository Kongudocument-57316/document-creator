"use client"

import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Home, Database } from "lucide-react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"

export default function SetupSaleDeedTablesPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message?: string; error?: string } | null>(null)

  const setupTables = async () => {
    try {
      setIsLoading(true)
      setResult(null)

      const response = await fetch("/api/setup-sale-deed-tables", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()
      setResult(data)
    } catch (error: any) {
      setResult({ success: false, error: error.message })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-cyan-50">
      <Header className="bg-cyan-100 border-cyan-200" />
      <div className="flex items-center gap-2 p-4 bg-cyan-50">
        <Button asChild variant="outline" className="border-cyan-300 text-cyan-700 hover:bg-cyan-100">
          <Link href="/document-details/sale-deed">
            <ArrowLeft className="h-4 w-4 mr-2" />
            பின்செல்
          </Link>
        </Button>
        <Button asChild variant="outline" className="border-cyan-300 text-cyan-700 hover:bg-cyan-100">
          <Link href="/">
            <Home className="h-4 w-4 mr-2" />
            முகப்பு
          </Link>
        </Button>
      </div>
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-cyan-800">கிரைய பத்திர தரவுத்தள அமைப்பு</h2>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>தரவுத்தள அட்டவணைகளை அமைக்கவும்</CardTitle>
              <CardDescription>கிரைய பத்திர தரவுத்தள அட்டவணைகளை உருவாக்க கீழே உள்ள பொத்தானை அழுத்தவும்</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={setupTables} disabled={isLoading} className="bg-cyan-600 hover:bg-cyan-700 text-white">
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    அமைக்கிறது...
                  </>
                ) : (
                  <>
                    <Database className="h-4 w-4 mr-2" />
                    தரவுத்தள அட்டவணைகளை அமைக்கவும்
                  </>
                )}
              </Button>

              {result && (
                <Alert
                  className={`mt-4 ${result.success ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}
                >
                  <AlertTitle>{result.success ? "வெற்றி!" : "பிழை!"}</AlertTitle>
                  <AlertDescription>{result.success ? result.message : result.error}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-amber-800 mb-2">குறிப்பு</h3>
            <p className="text-amber-700">
              இந்த செயல்பாடு கிரைய பத்திர தரவுத்தள அட்டவணைகளை உருவாக்கும். இது ஏற்கனவே உள்ள அட்டவணைகளை மாற்றாது. இந்த செயல்பாட்டை ஒரு முறை
              மட்டுமே இயக்க வேண்டும்.
            </p>
          </div>
        </div>
      </main>
      <footer className="bg-cyan-100 border-t border-cyan-200 py-4 text-center text-cyan-700">
        <p>© 2025 தமிழ் ஆவண மேலாண்மை. அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.</p>
      </footer>
    </div>
  )
}
