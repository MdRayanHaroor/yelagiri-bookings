"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Star, MapPin } from "lucide-react"
import { useState, useEffect } from "react"
import { format, isBefore, addDays } from "date-fns"
import { cn } from "@/lib/utils"
import { getFeaturedHotelsAlternative, testDatabaseConnection } from "@/lib/hotels"
import { testDatabaseData } from "@/lib/test-db"
import Link from "next/link"

interface Hotel {
  id: string
  name: string
  short_description: string
  area: string
  starting_price: number
  average_rating: number
  total_reviews: number
  slug: string
  hotel_images: Array<{
    image_url: string
    alt_text: string
    is_primary: boolean
  }>
}

export default function Home() {
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [loading, setLoading] = useState(true)
  const [connectionStatus, setConnectionStatus] = useState<string>("")
  const [testResults, setTestResults] = useState<string>("")

  useEffect(() => {
    async function loadHotels() {
      try {
        console.log("🚀 Starting comprehensive database test...")

        // Test database connection first
        const isConnected = await testDatabaseConnection()
        setConnectionStatus(isConnected ? "Connected" : "Failed")

        if (!isConnected) {
          console.error("❌ Database connection failed, cannot load hotels")
          setLoading(false)
          return
        }

        // Run comprehensive database tests
        console.log("🧪 Running database data tests...")
        const testPassed = await testDatabaseData()
        setTestResults(testPassed ? "Passed" : "Failed")

        console.log("📊 Loading featured hotels...")
        const data = await getFeaturedHotelsAlternative()
        console.log("✅ Hotel data loaded:", data)
        setHotels(data as Hotel[])
      } catch (error) {
        console.error("❌ Error loading hotels:", error)
        setTestResults("Error: " + (error as Error).message)
      } finally {
        setLoading(false)
      }
    }

    loadHotels()
  }, [])

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {/* Development Info */}
        {process.env.NODE_ENV === "development" && (
          <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 text-sm">
            <p>
              <strong>Debug Info:</strong> DB Connection: {connectionStatus} | Data Tests: {testResults} | Hotels
              Loaded: {hotels.length}
            </p>
            <p className="text-xs mt-1">Check browser console for detailed logs</p>
          </div>
        )}

        {/* Hero Section */}
        <section className="bg-[#003580] text-white py-8 sm:py-12 md:py-16 lg:py-20">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 leading-tight">
                Book Your Perfect Stay in Yelagiri Hills
              </h1>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 sm:mb-8 opacity-90">
                Discover comfort and luxury in the heart of nature
              </p>
            </div>

            {/* Search Form */}
            <SearchForm />
          </div>
        </section>

        {/* Hotel Listings */}
        <section className="py-8 sm:py-12 md:py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 sm:mb-8 text-center sm:text-left">
              Featured Hotels in Yelagiri Hills
            </h2>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {[...Array(8)].map((_, i) => (
                  <HotelCardSkeleton key={i} />
                ))}
              </div>
            ) : hotels.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {hotels.map((hotel) => (
                  <HotelCard key={hotel.id} hotel={hotel} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-lg mx-auto">
                  <h3 className="text-lg font-semibold text-red-800 mb-2">No Hotels Found</h3>
                  <p className="text-red-700 text-sm mb-4">
                    {connectionStatus === "Failed"
                      ? "Database connection failed. Please check your Supabase configuration."
                      : testResults === "Failed"
                        ? "Database is connected but tables appear to be empty. Please run the data insertion script."
                        : "No featured hotels available. The database might be empty."}
                  </p>
                  <div className="bg-red-100 p-3 rounded text-xs text-red-600">
                    <p>
                      <strong>Next Steps:</strong>
                    </p>
                    <ol className="list-decimal list-inside mt-1 space-y-1">
                      <li>Go to your Supabase project dashboard</li>
                      <li>Open the SQL Editor</li>
                      <li>
                        Run the script: <code>scripts/05-insert-data-step-by-step.sql</code>
                      </li>
                      <li>Refresh this page</li>
                    </ol>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* About Yelagiri */}
        <section className="py-8 sm:py-12 md:py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 sm:mb-8 text-center">
              Discover Yelagiri Hills
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
              <div className="order-2 lg:order-1">
                <p className="text-sm sm:text-base text-gray-700 mb-4 sm:mb-6 leading-relaxed">
                  Yelagiri Hills is a serene hill station in Tamil Nadu, known for its pleasant climate, scenic beauty,
                  and various attractions. From trekking and paragliding to fruit orchards and a beautiful lake,
                  Yelagiri offers a perfect getaway for nature lovers and adventure enthusiasts.
                </p>
                <Link href="/about">
                  <Button className="bg-[#0071C2] hover:bg-[#005999] text-white w-full sm:w-auto">
                    Learn More About Yelagiri
                  </Button>
                </Link>
              </div>
              <div className="order-1 lg:order-2">
                <img
                  src="/placeholder.svg?height=300&width=500"
                  alt="Yelagiri Hills"
                  className="w-full h-48 sm:h-56 md:h-64 lg:h-72 object-cover rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

function SearchForm() {
  const [checkInDate, setCheckInDate] = useState<Date | undefined>(undefined)
  const [checkOutDate, setCheckOutDate] = useState<Date | undefined>(undefined)

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return (
    <div className="bg-[#FEBB02] p-3 sm:p-4 md:p-6 rounded-lg shadow-lg max-w-6xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Location Field - Non-editable */}
        <div className="sm:col-span-2 lg:col-span-1">
          <div className="relative">
            <div className="flex items-center w-full bg-white text-gray-700 px-3 py-2 sm:py-3 rounded-md border border-gray-200 cursor-not-allowed">
              <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-[#0071C2] mr-2 flex-shrink-0" />
              <span className="text-sm sm:text-base font-medium">Yelagiri Hills</span>
            </div>
          </div>
        </div>

        {/* Date Pickers */}
        <div className="sm:col-span-2 lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal bg-white text-gray-900 border-gray-300 hover:bg-gray-50 hover:text-gray-900 py-2 sm:py-3 text-sm sm:text-base",
                  !checkInDate && "text-gray-500",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
                <span className="truncate">{checkInDate ? format(checkInDate, "MMM dd") : "Check-in"}</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={checkInDate}
                onSelect={setCheckInDate}
                disabled={(date) => isBefore(date, today) || (checkOutDate && isBefore(date, checkOutDate))}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal bg-white text-gray-900 border-gray-300 hover:bg-gray-50 hover:text-gray-900 py-2 sm:py-3 text-sm sm:text-base",
                  !checkOutDate && "text-gray-500",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
                <span className="truncate">{checkOutDate ? format(checkOutDate, "MMM dd") : "Check-out"}</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={checkOutDate}
                onSelect={setCheckOutDate}
                disabled={(date) => isBefore(date, today) || (checkInDate && isBefore(date, addDays(checkInDate, 1)))}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Search Button */}
        <div className="sm:col-span-2 lg:col-span-1">
          <Button className="w-full bg-[#0071C2] hover:bg-[#005999] text-white py-2 sm:py-3 text-sm sm:text-base font-medium">
            Search Hotels
          </Button>
        </div>
      </div>
    </div>
  )
}

function HotelCard({ hotel }: { hotel: Hotel }) {
  const primaryImage = hotel.hotel_images?.find((img) => img.is_primary) || hotel.hotel_images?.[0]

  return (
    <Link href={`/hotels/${hotel.slug}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer">
        <div className="relative">
          <img
            src={primaryImage?.image_url || "/placeholder.svg?height=200&width=300"}
            alt={primaryImage?.alt_text || hotel.name}
            className="w-full h-40 sm:h-48 object-cover"
          />
          <div className="absolute top-2 right-2 flex items-center bg-[#003580] text-white px-2 py-1 rounded text-xs sm:text-sm">
            <span className="font-bold mr-1">{hotel.average_rating}</span>
            <Star className="w-3 h-3 sm:w-4 sm:h-4" />
          </div>
        </div>
        <CardContent className="p-3 sm:p-4">
          <div className="mb-2">
            <h3 className="font-semibold text-sm sm:text-base lg:text-lg line-clamp-2">{hotel.name}</h3>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">{hotel.area}</p>
            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{hotel.short_description}</p>
          </div>
          <div className="flex justify-between items-center mt-3 sm:mt-4">
            <div>
              <p className="text-xs text-gray-500">Starting from</p>
              <p className="text-sm sm:text-base lg:text-lg font-bold text-[#0071C2]">
                ₹{hotel.starting_price.toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">{hotel.total_reviews} reviews</p>
              <Button className="bg-[#0071C2] hover:bg-[#005999] text-white text-xs sm:text-sm px-3 sm:px-4 py-1 sm:py-2 mt-1">
                View Deal
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

function HotelCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="w-full h-40 sm:h-48 bg-gray-200 animate-pulse" />
      <CardContent className="p-3 sm:p-4">
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded animate-pulse" />
          <div className="h-3 bg-gray-200 rounded w-2/3 animate-pulse" />
          <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse" />
        </div>
        <div className="flex justify-between items-center mt-4">
          <div className="space-y-1">
            <div className="h-3 bg-gray-200 rounded w-16 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-20 animate-pulse" />
          </div>
          <div className="h-8 bg-gray-200 rounded w-20 animate-pulse" />
        </div>
      </CardContent>
    </Card>
  )
}
