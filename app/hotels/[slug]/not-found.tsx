import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Search, Home } from "lucide-react"

export default function HotelNotFound() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow flex items-center justify-center py-12">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <Card>
            <CardHeader>
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <MapPin className="h-8 w-8 text-gray-400" />
              </div>
              <CardTitle className="text-2xl">Hotel Not Found</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-gray-600">
                Sorry, we couldn't find the hotel you're looking for. It may have been moved, removed, or the URL might
                be incorrect.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild className="bg-[#0071C2] hover:bg-[#005999]">
                  <Link href="/hotels">
                    <Search className="h-4 w-4 mr-2" />
                    Browse All Hotels
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/">
                    <Home className="h-4 w-4 mr-2" />
                    Go Home
                  </Link>
                </Button>
              </div>

              <div className="text-sm text-gray-500">
                <p>
                  Need help?{" "}
                  <Link href="/contact" className="text-[#0071C2] hover:underline">
                    Contact our support team
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
