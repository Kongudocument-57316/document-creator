import { Header } from "@/components/header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserForm } from "./user-form"
import { UserSearch } from "./user-search"
import { Suspense } from "react"
import Loading from "./loading"
import { Users } from "lucide-react"

export default function UserManagement({ searchParams }: { searchParams: { tab?: string } }) {
  const defaultTab = searchParams.tab || "add"

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-green-50 to-white">
      <Header className="bg-gradient-to-r from-green-100 to-green-200 border-green-300" />
      <main className="flex-1 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center space-x-2 mb-6">
            <div className="h-10 w-10 rounded-full bg-green-200 flex items-center justify-center">
              <Users className="h-6 w-6 text-green-700" />
            </div>
            <h2 className="text-2xl font-bold text-green-800">பயனாளர்கள் மேலாண்மை</h2>
          </div>

          <Tabs defaultValue={defaultTab} className="w-full">
            <TabsList className="grid grid-cols-2 bg-gradient-to-r from-green-100 to-green-200 rounded-t-lg overflow-hidden">
              <TabsTrigger
                value="add"
                className="data-[state=active]:bg-green-300 data-[state=active]:text-green-900 hover:bg-green-200 transition-colors"
              >
                புதிய பயனாளர் சேர்க்க
              </TabsTrigger>
              <TabsTrigger
                value="search"
                className="data-[state=active]:bg-green-300 data-[state=active]:text-green-900 hover:bg-green-200 transition-colors"
              >
                பயனாளர் தேடல்
              </TabsTrigger>
            </TabsList>
            <div className="mt-0 bg-white p-6 rounded-b-lg border border-green-300 shadow-md">
              <TabsContent value="add">
                <UserForm />
              </TabsContent>
              <TabsContent value="search">
                <Suspense fallback={<Loading />}>
                  <UserSearch />
                </Suspense>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </main>
      <footer className="bg-gradient-to-r from-green-100 to-green-200 border-t border-green-300 py-4 text-center text-green-700">
        <p>© 2023 தமிழ் ஆவண மேலாண்மை. அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.</p>
      </footer>
    </div>
  )
}
