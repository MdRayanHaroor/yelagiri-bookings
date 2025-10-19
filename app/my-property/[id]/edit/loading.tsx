import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function EditPropertyLoading() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow py-8 px-4">
        <div className="container mx-auto max-w-2xl">
          <Skeleton className="h-10 w-48 mb-4" />

          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-40 mb-2" />
              <Skeleton className="h-4 w-60" />
            </CardHeader>
            <CardContent className="space-y-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
