import { Skeleton } from "@/components/ui/skeleton"
import { Header } from "@/components/header"

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col bg-cyan-50">
      <Header className="bg-cyan-100 border-cyan-200" />
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <Skeleton className="h-8 w-64" />
            <div className="flex gap-2">
              <Skeleton className="h-10 w-24" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        </div>
      </main>
      <footer className="bg-cyan-100 border-t border-cyan-200 py-4 text-center text-cyan-700">
        <Skeleton className="h-6 w-96 mx-auto" />
      </footer>
    </div>
  )
}
