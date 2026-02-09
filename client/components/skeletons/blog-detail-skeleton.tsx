import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"

export function BlogDetailSkeleton() {
  return (
    <div className="min-h-screen">
      {/* Hero Image Skeleton */}
      <section className="relative h-[400px] overflow-hidden">
        <Skeleton className="h-full w-full" />
      </section>

      {/* Article Content Skeleton */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <Skeleton className="mb-6 h-6 w-32" />
              <Skeleton className="mb-6 h-12 w-full" />
              <Skeleton className="mb-8 h-6 w-3/4" />

              {/* Author Info */}
              <div className="mb-8 flex items-center gap-3 border-b pb-6">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="mb-2 h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>

              {/* Content Sections */}
              <div className="space-y-8">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i}>
                    <Skeleton className="mb-4 h-8 w-2/3" />
                    <Skeleton className="mb-2 h-4 w-full" />
                    <Skeleton className="mb-2 h-4 w-full" />
                    <Skeleton className="mb-2 h-4 w-5/6" />
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card className="p-6">
                <Skeleton className="mb-4 h-5 w-32" />
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-4 w-full" />
                  ))}
                </div>
              </Card>
              <Card className="p-6">
                <Skeleton className="mb-4 h-5 w-32" />
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-8" />
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
