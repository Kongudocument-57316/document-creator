import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="container mx-auto py-6">
      <Skeleton className="h-8 w-64 mb-6" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Skeleton className="h-[600px] w-full" />
        </div>

        <div>
          <Skeleton className="h-6 w-48 mb-4" />
          <Skeleton className="h-[600px] w-full" />
        </div>
      </div>
    </div>
  )
}
