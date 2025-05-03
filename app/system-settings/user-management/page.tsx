import { Header } from "@/components/header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserForm } from "./user-form"
import { UserSearch } from "./user-search"
import { Suspense } from "react"
import Loading from "./loading"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Home, ArrowLeft } from "lucide-react"

export default function UserManagement({ searchParams }: { searchParams: { tab?: string } }) {
  const defaultTab = searchParams.tab || "add"

  return (
    <div className="flex min-h-screen flex-col bg-green-50">
      <Header className="bg-green-100 border-green-200" />
      <main className="flex-1 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <Link href="/system-settings">
              <Button
                variant="outline"
                size="icon"
                className="border-green-300 text-green-700 hover:bg-green-100"
                aria-label="Back"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/">
              <Button
                variant="outline"
                size="icon"
                className="border-green-300 text-green-700 hover:bg-green-100"
                aria-label="Home"
              >
                <Home className="h-4 w-4" />
              </Button>
            </Link>
            <h2 className="text-2xl font-bold text-green-800 ml-2">பயனாளர்கள் மேலாண்மை</h2>
          </div>

          <Tabs defaultValue={defaultTab} className="w-full">
            <TabsList className="grid grid-cols-2 bg-green-100">
              <TabsTrigger value="add" className="data-[state=active]:bg-green-200 data-[state=active]:text-green-800">
                புதிய பயனாளர் சேர்க்க
              </TabsTrigger>
              <TabsTrigger
                value="search"
                className="data-[state=active]:bg-green-200 data-[state=active]:text-green-800"
              >
                பயனாளர் தேடல்
              </TabsTrigger>
            </TabsList>
            <div className="mt-4">
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
      <footer className="bg-green-100 border-t border-green-200 py-4 text-center text-green-700">
        <p>© 2025 தமிழ் ஆவண மேலாண்மை. அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.</p>
      </footer>
    </div>
  )
}
