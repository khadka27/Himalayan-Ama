import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"

export function ServiceDetailSkeleton() {
  return (
    <div className="min-h-screen">
      {/* Back Navigation */}
      <div className="border-b bg-white py-4">
        <div className="container mx-auto px-6">
          <Skeleton className="h-4 w-32" />
        </div>
      </div>

      {/* Service Details */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Image Gallery */}
              <div className="space-y-4">
                <Skeleton className="h-96 w-full rounded-lg" />
                <div className="flex gap-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-20 w-20 rounded-lg" />
                  ))}
                </div>
              </div>

              {/* Title and Description */}
              <div>
                <Skeleton className="mb-2 h-10 w-3/4" />
                <Skeleton className="mb-4 h-6 w-24" />
                <Skeleton className="mb-2 h-4 w-full" />
                <Skeleton className="mb-2 h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>

              {/* Details Cards */}
              {Array.from({ length: 2 }).map((_, i) => (
                <Card key={i} className="p-6">
                  <Skeleton className="mb-4 h-6 w-32" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </Card>
              ))}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card className="p-6">
                <Skeleton className="mb-4 h-6 w-32" />
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  ))}
                </div>
                <Skeleton className="mt-4 h-10 w-full" />
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
