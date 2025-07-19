import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function HotelDetailLoading() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow">
        {/* Breadcrumb Skeleton */}
        <div className="bg-gray-50 py-4">
          <div className="container mx-auto px-4">
            <Skeleton className="h-4 w-64" />
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Hotel Header Skeleton */}
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <Skeleton className="h-8 w-3/4 mb-2" />
                    <div className="flex items-center space-x-4">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                </div>

                {/* Image Gallery Skeleton */}
                <Skeleton className="aspect-video w-full rounded-lg mb-6" />
              </div>

              {/* Description Card Skeleton */}
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-48" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </CardContent>
              </Card>

              {/* Amenities Card Skeleton */}
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="flex items-center space-x-2">
                        <Skeleton className="h-4 w-4" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Room Types Card Skeleton */}
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent className="space-y-6">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <Skeleton className="h-5 w-48 mb-2" />
                          <Skeleton className="h-4 w-full mb-2" />
                          <Skeleton className="h-4 w-32" />
                        </div>
                        <div className="text-right">
                          <Skeleton className="h-8 w-24 mb-1" />
                          <Skeleton className="h-4 w-16" />
                        </div>
                      </div>
                      <Skeleton className="w-full h-48 rounded-lg mb-4" />
                      <div className="flex flex-wrap gap-2">
                        {[...Array(3)].map((_, j) => (
                          <Skeleton key={j} className="h-6 w-16" />
                        ))}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Booking Sidebar Skeleton */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <Card>
                  <CardHeader>
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-4 w-48" />
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Skeleton className="h-4 w-20 mb-2" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Skeleton className="h-4 w-16 mb-2" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                      <div>
                        <Skeleton className="h-4 w-16 mb-2" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Skeleton className="h-4 w-12 mb-2" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                      <div>
                        <Skeleton className="h-4 w-12 mb-2" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                    </div>
                    <div>
                      <Skeleton className="h-4 w-32 mb-2" />
                      <Skeleton className="h-20 w-full" />
                    </div>
                    <Skeleton className="h-10 w-full" />
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
