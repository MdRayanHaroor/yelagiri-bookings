"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, Search, Wifi, Car, Utensils, Waves, Wind } from "lucide-react"
import { useState, useEffect } from "react"
import { getHotels, getHotelAreas, getAmenities } from "@/lib/hotels"
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
  hotel_amenities?: Array<{
    amenities: {
      name: string
      icon: string
    }
  }>
}

interface Amenity {
  id: string
  name: string
  icon: string
  category: string
}

const iconMap: { [key: string]: any } = {
  wifi: Wifi,
  car: Car,
  utensils: Utensils,
  waves: Waves,
  wind: Wind,
}

export default function HotelsPage() {
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [filteredHotels, setFilteredHotels] = useState<Hotel[]>([])
  const [loading, setLoading] = useState(true)
  const [areas, setAreas] = useState<string[]>([])
  const [amenities, setAmenities] = useState<Amenity[]>([])

  // Filter states
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedArea, setSelectedArea] = useState<string>("all")
  const [priceRange, setPriceRange] = useState<string>("all")
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<string>("rating")

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        const [hotelsData, areasData, amenitiesData] = await Promise.all([getHotels(), getHotelAreas(), getAmenities()])

        setHotels(hotelsData as Hotel[])
        setFilteredHotels(hotelsData as Hotel[])
        setAreas(areasData)
        setAmenities(amenitiesData)
      } catch (error) {
        console.error("Error loading hotels data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Apply filters
  useEffect(() => {
    let filtered = [...hotels]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (hotel) =>
          hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          hotel.short_description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Area filter
    if (selectedArea !== "all") {
      filtered = filtered.filter((hotel) => hotel.area === selectedArea)
    }

    // Price range filter
    if (priceRange !== "all") {
      const [min, max] = priceRange.split("-").map(Number)
      filtered = filtered.filter((hotel) => {
        if (max) {
          return hotel.starting_price >= min && hotel.starting_price <= max
        } else {
          return hotel.starting_price >= min
        }
      })
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.starting_price - b.starting_price
        case "price-high":
          return b.starting_price - a.starting_price
        case "rating":
          return b.average_rating - a.average_rating
        case "reviews":
          return b.total_reviews - a.total_reviews
        default:
          return 0
      }
    })

    setFilteredHotels(filtered)
  }, [hotels, searchTerm, selectedArea, priceRange, selectedAmenities, sortBy])

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedArea("all")
    setPriceRange("all")
    setSelectedAmenities([])
    setSortBy("rating")
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-[#003580] text-white py-8 sm:py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">Hotels in Yelagiri Hills</h1>
            <p className="text-base sm:text-lg opacity-90">Discover the perfect accommodation for your stay</p>
          </div>
        </section>

        {/* Filters and Search */}
        <section className="py-6 bg-gray-50 border-b">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search hotels..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Area Filter */}
              <Select value={selectedArea} onValueChange={setSelectedArea}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Area" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Areas</SelectItem>
                  {areas.map((area) => (
                    <SelectItem key={area} value={area}>
                      {area}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Price Range */}
              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Price Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="0-1500">Under ₹1,500</SelectItem>
                  <SelectItem value="1500-3000">₹1,500 - ₹3,000</SelectItem>
                  <SelectItem value="3000-5000">₹3,000 - ₹5,000</SelectItem>
                  <SelectItem value="5000">Above ₹5,000</SelectItem>
                </SelectContent>
              </Select>

              {/* Sort By */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="reviews">Most Reviews</SelectItem>
                </SelectContent>
              </Select>

              {/* Clear Filters */}
              <Button variant="outline" onClick={clearFilters} className="w-full bg-transparent">
                Clear Filters
              </Button>
            </div>

            {/* Results Count */}
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600">
                {loading ? "Loading..." : `${filteredHotels.length} hotels found`}
              </p>
            </div>
          </div>
        </section>

        {/* Hotels Grid */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <HotelCardSkeleton key={i} />
                ))}
              </div>
            ) : filteredHotels.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredHotels.map((hotel) => (
                  <HotelCard key={hotel.id} hotel={hotel} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="bg-gray-50 rounded-lg p-8 max-w-md mx-auto">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">No Hotels Found</h3>
                  <p className="text-gray-600 mb-4">Try adjusting your filters or search terms</p>
                  <Button onClick={clearFilters} variant="outline">
                    Clear All Filters
                  </Button>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

function HotelCard({ hotel }: { hotel: Hotel }) {
  const primaryImage = hotel.hotel_images?.find((img) => img.is_primary) || hotel.hotel_images?.[0]

  return (
    <Link href={`/hotels/${hotel.slug}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer h-full">
        <div className="relative">
          <img
            src={primaryImage?.image_url || "/placeholder.svg?height=200&width=300"}
            alt={primaryImage?.alt_text || hotel.name}
            className="w-full h-48 object-cover"
          />
          <div className="absolute top-2 right-2 flex items-center bg-[#003580] text-white px-2 py-1 rounded text-sm">
            <span className="font-bold mr-1">{hotel.average_rating}</span>
            <Star className="w-4 h-4" />
          </div>
        </div>
        <CardContent className="p-4 flex flex-col h-full">
          <div className="flex-grow">
            <h3 className="font-semibold text-lg mb-1 line-clamp-2">{hotel.name}</h3>
            <div className="flex items-center text-sm text-gray-600 mb-2">
              <MapPin className="w-4 h-4 mr-1" />
              {hotel.area}
            </div>
            <p className="text-sm text-gray-500 mb-3 line-clamp-2">{hotel.short_description}</p>

            {/* Amenities */}
            {hotel.hotel_amenities && hotel.hotel_amenities.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {hotel.hotel_amenities.slice(0, 3).map((amenity, index) => {
                  const IconComponent = iconMap[amenity.amenities.icon] || Wifi
                  return (
                    <Badge key={index} variant="secondary" className="text-xs">
                      <IconComponent className="w-3 h-3 mr-1" />
                      {amenity.amenities.name}
                    </Badge>
                  )
                })}
                {hotel.hotel_amenities.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{hotel.hotel_amenities.length - 3} more
                  </Badge>
                )}
              </div>
            )}
          </div>

          <div className="flex justify-between items-center mt-auto pt-3 border-t">
            <div>
              <p className="text-xs text-gray-500">Starting from</p>
              <p className="text-lg font-bold text-[#0071C2]">₹{hotel.starting_price.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">{hotel.total_reviews} reviews</p>
              <Button className="bg-[#0071C2] hover:bg-[#005999] text-white text-sm px-4 py-2 mt-1">
                View Details
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
    <Card className="overflow-hidden h-full">
      <div className="w-full h-48 bg-gray-200 animate-pulse" />
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="h-5 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
          <div className="flex gap-2">
            <div className="h-6 bg-gray-200 rounded w-16 animate-pulse" />
            <div className="h-6 bg-gray-200 rounded w-16 animate-pulse" />
          </div>
        </div>
        <div className="flex justify-between items-center mt-4 pt-3 border-t">
          <div className="space-y-1">
            <div className="h-3 bg-gray-200 rounded w-16 animate-pulse" />
            <div className="h-5 bg-gray-200 rounded w-20 animate-pulse" />
          </div>
          <div className="h-8 bg-gray-200 rounded w-24 animate-pulse" />
        </div>
      </CardContent>
    </Card>
  )
}
