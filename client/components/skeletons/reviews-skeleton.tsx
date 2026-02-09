import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"

export function ReviewsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i} className="p-6">
          {/* Stars skeleton */}
          <div className="mb-4 flex gap-1">
            {Array.from({ length: 5 }).map((_, j) => (
              <Skeleton key={j} className="h-4 w-4 rounded-full" />
            ))}
          </div>

          {/* Review text skeleton */}
          <div className="mb-4 space-y-2">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-4/5" />
          </div>

          {/* Avatar and name skeleton */}
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
