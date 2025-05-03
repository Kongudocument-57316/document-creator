import { Header } from "@/components/header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PropertyForm } from "./property-form"
import { PropertySearch } from "./property-search"
import { Suspense } from "react"
import Loading from "./loading"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Home, ArrowLeft } from "lucide-react"

export default function PropertyDetails() {
  return (
    <div className="flex min-h-screen flex-col bg-purple-50">
      <Header className="bg-purple-100 border-purple-200" />
      <main className="flex-1 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <Link href="/system-settings">
              <Button
                variant="outline"
                size="icon"
                className="border-purple-300 text-purple-700 hover:bg-purple-100"
                aria-label="Back"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/">
              <Button
                variant="outline"
                size="icon"
                className="border-purple-300 text-purple-700 hover:bg-purple-100"
                aria-label="Home"
              >
                <Home className="h-4 w-4" />
              </Button>
            </Link>
            <h2 className="text-2xl font-bold text-purple-800 ml-2">மனையின் சொத்து விபரங்கள்</h2>
          </div>

          <Tabs defaultValue="add" className="w-full">
            <TabsList className="grid grid-cols-2 bg-purple-100">
              <TabsTrigger
                value="add"
                className="data-[state=active]:bg-purple-200 data-[state=active]:text-purple-800"
              >
                புதிய சொத்து சேர்க்க
              </TabsTrigger>
              <TabsTrigger
                value="search"
                className="data-[state=active]:bg-purple-200 data-[state=active]:text-purple-800"
              >
                சொத்து தேடல்
              </TabsTrigger>
            </TabsList>
            <div className="mt-4 bg-white p-6 rounded-lg border border-purple-200 shadow-sm">
              <TabsContent value="add">
                <PropertyForm />
              </TabsContent>
              <TabsContent value="search">
                <Suspense fallback={<Loading />}>
                  <PropertySearch />
                </Suspense>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </main>
      <footer className="bg-purple-100 border-t border-purple-200 py-4 text-center text-purple-700">
        <p>© 2025 தமிழ் ஆவண மேலாண்மை. அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.</p>
      </footer>
    </div>
  )
}
