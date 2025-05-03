"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2, Database, Play, RefreshCw } from "lucide-react"

export default function DatabasePage() {
  const [sql, setSql] = useState("")
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [setupLoading, setSetupLoading] = useState(false)
  const [setupResult, setSetupResult] = useState<any>(null)

  const executeSql = async () => {
    if (!sql.trim()) return

    setLoading(true)
    try {
      const response = await fetch("/api/execute-sql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sql }),
      })

      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({
        success: false,
        message: "Error executing SQL",
        error: String(error),
      })
    } finally {
      setLoading(false)
    }
  }

  const setupDatabase = async () => {
    setSetupLoading(true)
    try {
      const response = await fetch("/api/setup-database", {
        method: "POST",
      })

      const data = await response.json()
      setSetupResult(data)
    } catch (error) {
      setSetupResult({
        success: false,
        message: "Error setting up database",
        error: String(error),
      })
    } finally {
      setSetupLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">தரவுத்தள நிர்வாகம் (Database Management)</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              தரவுத்தள அமைப்பு (Database Setup)
            </CardTitle>
            <CardDescription>
              அனைத்து அட்டவணைகளையும் உருவாக்க இந்த பொத்தானை அழுத்தவும் (Click this button to create all tables)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {setupResult && (
              <Alert variant={setupResult.success ? "default" : "destructive"} className="mb-4">
                {setupResult.success ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                <AlertTitle>{setupResult.success ? "வெற்றி (Success)" : "பிழை (Error)"}</AlertTitle>
                <AlertDescription>
                  {setupResult.message}
                  {setupResult.stats && (
                    <div className="mt-2">
                      <p>மொத்த கூற்றுகள் (Total statements): {setupResult.stats.totalStatements}</p>
                      <p>வெற்றிகரமான கூற்றுகள் (Successful): {setupResult.stats.successfulStatements}</p>
                      <p>தோல்வியடைந்த கூற்றுகள் (Failed): {setupResult.stats.failedStatements}</p>
                    </div>
                  )}
                  {setupResult.error && <p className="text-red-500 mt-2">{setupResult.error}</p>}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter>
            <Button onClick={setupDatabase} disabled={setupLoading} className="w-full">
              {setupLoading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  செயல்படுத்துகிறது... (Processing...)
                </>
              ) : (
                <>
                  <Database className="mr-2 h-4 w-4" />
                  தரவுத்தளத்தை அமைக்கவும் (Setup Database)
                </>
              )}
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="h-5 w-5" />
              SQL இயக்கி (SQL Executor)
            </CardTitle>
            <CardDescription>தனிப்பயன் SQL கூற்றுகளை இயக்கவும் (Execute custom SQL statements)</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={sql}
              onChange={(e) => setSql(e.target.value)}
              placeholder="SELECT * FROM users;"
              className="min-h-[200px] font-mono"
            />

            {result && (
              <Alert variant={result.success ? "default" : "destructive"} className="mt-4">
                {result.success ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                <AlertTitle>{result.success ? "வெற்றி (Success)" : "பிழை (Error)"}</AlertTitle>
                <AlertDescription>
                  {result.message}
                  {result.error && <p className="text-red-500 mt-2">{result.error}</p>}
                  {result.data && (
                    <pre className="bg-gray-100 p-2 rounded mt-2 overflow-auto max-h-[200px] text-xs">
                      {JSON.stringify(result.data, null, 2)}
                    </pre>
                  )}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter>
            <Button onClick={executeSql} disabled={loading || !sql.trim()} className="w-full">
              {loading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  செயல்படுத்துகிறது... (Processing...)
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  SQL ஐ இயக்கவும் (Execute SQL)
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
