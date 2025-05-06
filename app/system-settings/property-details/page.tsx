import { Header } from "@/components/header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PropertyForm } from "./property-form"
import { PropertySearch } from "./property-search"
import { Suspense } from "react"
import Loading from "./loading"
import { Home } from "lucide-react"

export default function PropertyDetails() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-purple-50 to-white">
      <Header className="bg-gradient-to-r from-purple-100 to-purple-200 border-purple-300" />
      <main className="flex-1 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center space-x-2 mb-6">
            <div className="h-10 w-10 rounded-full bg-purple-200 flex items-center justify-center">
              <Home className="h-6 w-6 text-purple-700" />
            </div>
            <h2 className="text-2xl font-bold text-purple-800">மனையின் சொத்து விபரங்கள்</h2>
          </div>

          <Tabs defaultValue="add" className="w-full">
            <TabsList className="grid grid-cols-2 bg-gradient-to-r from-purple-100 to-purple-200 rounded-t-lg overflow-hidden">
              <TabsTrigger
                value="add"
                className="data-[state=active]:bg-purple-300 data-[state=active]:text-purple-900 hover:bg-purple-200 transition-colors"
              >
                புதிய சொத்து சேர்க்க
              </TabsTrigger>
              <TabsTrigger
                value="search"
                className="data-[state=active]:bg-purple-300 data-[state=active]:text-purple-900 hover:bg-purple-200 transition-colors"
              >
                சொத்து தேடல்
              </TabsTrigger>
            </TabsList>
            <div className="mt-0 bg-white p-6 rounded-b-lg border border-purple-300 shadow-md">
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
      <footer className="bg-gradient-to-r from-purple-100 to-purple-200 border-t border-purple-300 py-4 text-center text-purple-700">
        <p>© 2023 தமிழ் ஆவண மேலாண்மை. அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.</p>
      </footer>
    </div>
  )
}
