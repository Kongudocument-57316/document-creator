import { Suspense } from "react"
import { CreatePartitionReleaseForm } from "./create-partition-release-form"
import { Skeleton } from "@/components/ui/skeleton"

export default function CreatePartitionReleasePage() {
  return (
    <Suspense
      fallback={
        <div className="p-4">
          <Skeleton className="w-full h-[600px]" />
        </div>
      }
    >
      <CreatePartitionReleaseForm />
    </Suspense>
  )
}
