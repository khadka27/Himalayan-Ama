import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"

export function HomeServicesSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="overflow-hidden border border-gray-200">
          {/* Image skeleton */}
          <Skeleton className="h-48 w-full rounded-none" />

          {/* Content skeleton */}
          <div className="p-6 space-y-4">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />

            {/* Details grid skeleton */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>

            {/* Benefits skeleton */}
            <div className="space-y-2 border-t pt-4">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-4/5" />
            </div>

            {/* Buttons skeleton */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-full" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
