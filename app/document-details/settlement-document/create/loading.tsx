import { Header } from "@/components/header"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col bg-amber-50">
      <Header className="bg-amber-100 border-amber-200" />
      <main className="flex-1 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Skeleton className="h-10 w-96" />
            <Skeleton className="h-10 w-32" />
          </div>

          <div className="space-y-6">
            <Skeleton className="h-12 w-full" />
            <div className="space-y-4">
              <Skeleton className="h-[400px] w-full" />
            </div>
            <div className="flex justify-end gap-4">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
