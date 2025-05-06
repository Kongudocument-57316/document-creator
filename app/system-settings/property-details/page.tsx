import { Header } from "@/components/header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PropertyForm } from "./property-form"
import { PropertySearch } from "./property-search"
import { Suspense } from "react"
import Loading from "./loading"

export default function PropertyDetails() {
  return (
    <div className="flex min-h-screen flex-col bg-purple-50">
      <Header className="bg-purple-100 border-purple-200" />
      <main className="flex-1 p-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-purple-800">மனையின் சொத்து விபரங்கள்</h2>

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
        <p>© 2023 தமிழ் ஆவண மேலாண்மை. அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.</p>
      </footer>
    </div>
  )
}
