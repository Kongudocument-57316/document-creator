import { Header } from "@/components/header"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col bg-amber-50">
      <Header className="bg-amber-100 border-amber-200" />
      <main className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <Skeleton className="h-10 w-96" />
            <div className="flex gap-2">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="h-full border-amber-200">
              <div className="p-6">
                <Skeleton className="h-7 w-64 mb-2" />
                <Skeleton className="h-4 w-full mb-6" />
                <Skeleton className="h-20 w-full" />
              </div>
            </Card>

            <Card className="h-full border-amber-200">
              <div className="p-6">
                <Skeleton className="h-7 w-64 mb-2" />
                <Skeleton className="h-4 w-full mb-6" />
                <Skeleton className="h-20 w-full" />
              </div>
            </Card>
          </div>
        </div>
      </main>
      <footer className="bg-amber-100 border-t border-amber-200 py-4 text-center text-amber-700">
        <p>© 2025 தமிழ் ஆவண மேலாண்மை. அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.</p>
      </footer>
    </div>
  )
}
