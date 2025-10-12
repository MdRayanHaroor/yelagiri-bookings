"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { MapPin, Star, Wifi, Car, Utensils, Waves, Search, Filter, Users, Eye } from "lucide-react"
import { getAllHotels } from "@/lib/hotels"

interface Hotel {
  id: string
  name: string
  slug: string
  description: string
  location: string
  images: string[]
  amenities: string[]
  room_types: Array<{
    base_price: number
    max_occupancy: number
  }>
  average_rating: number
  total_reviews: number
  price_range: {
    min: number
    max: number
  }
}

export default function HotelsPage() {
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [filteredHotels, setFilteredHotels] = useState<Hotel[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLocation, setSelectedLocation] = useState("all")
  const [priceRange, setPriceRange] = useState([0, 10000])
  const initialPriceRange = [500, 10000];
  const initialLocation = "all";
  const initialAmenities: string[] = [];
  const initialSearchTerm = "";
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])
  const [sortBy, setSortBy] = useState("rating")

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const hotelsData = await getAllHotels()
        setHotels(hotelsData)
        setFilteredHotels(hotelsData)

        // Set initial price range based on actual data
        if (hotelsData.length > 0) {
          const minPrice = Math.min(...hotelsData.map((h) => h.price_range.min))
          const maxPrice = Math.max(...hotelsData.map((h) => h.price_range.max))
          setPriceRange([minPrice, maxPrice])
        }
      } catch (error) {
        console.error("Error fetching hotels:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchHotels()
  }, [])

  useEffect(() => {
    let filtered = hotels

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (hotel) =>
          hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          hotel.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          hotel.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Location filter
    if (selectedLocation !== "all") {
      filtered = filtered.filter((hotel) => hotel.location.toLowerCase().includes(selectedLocation.toLowerCase()))
    }

    // Price range filter
    filtered = filtered.filter(
      (hotel) => hotel.price_range.min >= priceRange[0] && hotel.price_range.max <= priceRange[1],
    )

    // Amenities filter
    if (selectedAmenities.length > 0) {
      filtered = filtered.filter((hotel) =>
        selectedAmenities.every((amenity) =>
          hotel.amenities.some((hotelAmenity) => hotelAmenity.toLowerCase().includes(amenity.toLowerCase())),
        ),
      )
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price_range.min - b.price_range.min
        case "price-high":
          return b.price_range.min - a.price_range.min
        case "rating":
          return b.average_rating - a.average_rating
        case "name":
          return a.name.localeCompare(b.name)
        default:
          return 0
      }
    })

    setFilteredHotels(filtered)
  }, [hotels, searchTerm, selectedLocation, priceRange, selectedAmenities, sortBy])

  const getAmenityIcon = (amenity: string) => {
    const iconMap: { [key: string]: any } = {
      "Free WiFi": Wifi,
      "Free Parking": Car,
      Restaurant: Utensils,
      "Swimming Pool": Waves,
    }
    const IconComponent = iconMap[amenity] || null
    return IconComponent ? <IconComponent className="h-4 w-4" /> : null
  }

  const uniqueLocations = Array.from(new Set(hotels.map((hotel) => hotel.location)))
  const commonAmenities = [
    "Free WiFi",
    "Free Parking",
    "Restaurant",
    "Swimming Pool",
    "Air Conditioning",
    "Spa Services",
  ]

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    if (checked) {
      setSelectedAmenities([...selectedAmenities, amenity])
    } else {
      setSelectedAmenities(selectedAmenities.filter((a) => a !== amenity))
    }
  }

  const resetFilters = () => {
    setSearchTerm(initialSearchTerm);
    setSelectedLocation(initialLocation);
    setPriceRange(initialPriceRange);
    setSelectedAmenities(initialAmenities);
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <div className="bg-[#003580] text-white py-12">
            <div className="container mx-auto px-4 text-center">
              <Skeleton className="h-10 w-64 mx-auto mb-4 bg-white/20" />
              <Skeleton className="h-6 w-96 mx-auto bg-white/20" />
            </div>
          </div>
          <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="md:col-span-1">
                <Skeleton className="h-96 w-full" />
              </div>
              <div className="md:col-span-3">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <Skeleton key={i} className="h-80 w-full" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-[#003580] text-white py-12">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Find Your Perfect Stay in Yelagiri</h1>
            <p className="text-lg opacity-90">Discover amazing hotels and resorts in the beautiful hills of Yelagiri</p>
          </div>
        </section>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <div className="md:col-span-1">
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Filter className="h-5 w-5 mr-2" />
                    Filters
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Search */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Search</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search hotels..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* Location */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Location</label>
                    <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Locations</SelectItem>
                        {uniqueLocations.map((location) => (
                          <SelectItem key={location} value={location}>
                            {location}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Price Range */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}
                    </label>
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      max={15000}
                      min={500}
                      step={500}
                      className="mt-2"
                    />
                  </div>

                  {/* Amenities */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Amenities</label>
                    <div className="space-y-2">
                      {commonAmenities.map((amenity) => (
                        <div key={amenity} className="flex items-center space-x-2">
                          <Checkbox
                            id={amenity}
                            checked={selectedAmenities.includes(amenity)}
                            onCheckedChange={(checked) => handleAmenityChange(amenity, checked as boolean)}
                          />
                          <label htmlFor={amenity} className="text-sm flex items-center">
                            {getAmenityIcon(amenity)}
                            <span className="ml-2">{amenity}</span>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Clear Filters Button (New Feature) */}
                  <div className="pt-2">
                    {/* Use Button with variant="outline" for a clean look, 
                    and make it full width (w-full).
                    The 'type="button"' is important to prevent accidental form submission.
                */}
                    <Button
                      variant="outline"
                      onClick={resetFilters} // Assuming this function exists or will be created
                      className="w-full text-red-600 border-red-300 hover:bg-red-50"
                      type="button"
                    >
                      Clear Filters
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Hotels Grid */}
            <div className="md:col-span-3">
              {/* Sort and Results Count */}
              <div className="flex items-center justify-between mb-6">
                <div className="text-gray-600">
                  {filteredHotels.length} hotel{filteredHotels.length !== 1 ? "s" : ""} found
                </div>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="name">Name: A to Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Hotels Grid */}
              {filteredHotels.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <div className="text-gray-500 mb-4">
                      <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-semibold mb-2">No hotels found</h3>
                      <p>Try adjusting your filters or search terms</p>
                    </div>
                    <Button
                      onClick={() => {
                        setSearchTerm("")
                        setSelectedLocation("all")
                        setSelectedAmenities([])
                        setPriceRange([0, 10000])
                      }}
                      variant="outline"
                    >
                      Clear Filters
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filteredHotels.map((hotel) => (
                    <Card key={hotel.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="relative">
                        <Image
                          src={hotel.images[0] || "/placeholder.jpg"}
                          alt={hotel.name}
                          width={400}
                          height={200}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute top-2 right-2">
                          <Badge className="bg-[#0071C2] text-white">
                            <Star className="h-3 w-3 mr-1 fill-current" />
                            {hotel.average_rating}
                          </Badge>
                        </div>
                      </div>

                      <CardContent className="p-4">
                        <div className="mb-3">
                          <h3 className="text-lg font-semibold mb-1">{hotel.name}</h3>
                          <div className="flex items-center text-gray-600 text-sm mb-2">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span>{hotel.location}</span>
                          </div>
                          <p className="text-gray-600 text-sm line-clamp-2">{hotel.description}</p>
                        </div>

                        {/* Amenities */}
                        <div className="flex flex-wrap gap-1 mb-3">
                          {hotel.amenities.slice(0, 4).map((amenity) => (
                            <Badge key={amenity} variant="secondary" className="text-xs">
                              {amenity}
                            </Badge>
                          ))}
                          {hotel.amenities.length > 4 && (
                            <Badge variant="secondary" className="text-xs">
                              +{hotel.amenities.length - 4} more
                            </Badge>
                          )}
                        </div>

                        {/* Price and Occupancy */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center text-sm text-gray-600">
                            <Users className="h-4 w-4 mr-1" />
                            <span>Up to {Math.max(...hotel.room_types.map((rt) => rt.max_occupancy))} guests</span>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-[#0071C2]">
                              ₹{hotel.price_range.min.toLocaleString()}
                            </div>
                            <div className="text-xs text-gray-600">per night</div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <Button asChild className="flex-1 bg-[#0071C2] hover:bg-[#005999]">
                            <Link href={`/hotels/${hotel.slug}`}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Link>
                          </Button>
                        </div>

                        {/* Reviews */}
                        <div className="mt-3 text-xs text-gray-600 text-center">
                          {hotel.total_reviews} review{hotel.total_reviews !== 1 ? "s" : ""}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
