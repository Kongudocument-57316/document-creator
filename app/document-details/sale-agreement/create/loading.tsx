import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <Skeleton className="h-8 w-64 mb-6" />
        <Skeleton className="h-[600px] w-full rounded-lg" />
      </div>
    </div>
  )
}
