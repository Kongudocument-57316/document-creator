import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function Loading() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <Skeleton className="h-8 w-64" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-full max-w-md mx-auto" />
          <Skeleton className="h-6 w-32 mx-auto mt-2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />

            <div>
              <Skeleton className="h-8 w-48 mx-auto mb-4" />
              <Skeleton className="h-32 w-full" />
            </div>

            <div className="flex justify-between mt-8">
              <div className="text-center w-1/3">
                <Skeleton className="h-6 w-32 mx-auto" />
                <Skeleton className="h-20 w-full mt-4" />
              </div>
              <div className="text-center w-1/3">
                <Skeleton className="h-6 w-32 mx-auto" />
                <Skeleton className="h-20 w-full mt-4" />
              </div>
            </div>

            <div>
              <Skeleton className="h-8 w-32 mb-4" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full mt-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
