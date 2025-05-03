import { Header } from "@/components/header"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col bg-amber-50">
      <Header className="bg-amber-100 border-amber-200" />
      <main className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-10 w-32" />
          </div>

          <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
            {Array(3)
              .fill(null)
              .map((_, index) => (
                <Card key={index} className="border-amber-200 shadow-md">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <Skeleton className="h-6 w-40" />
                    <Skeleton className="h-6 w-6 rounded-full" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-full mt-2" />
                    <Skeleton className="h-4 w-3/4 mt-2" />
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      </main>
      <footer className="bg-amber-100 border-t border-amber-200 py-4 text-center text-amber-700">
        <Skeleton className="h-4 w-64 mx-auto" />
      </footer>
    </div>
  )
}
