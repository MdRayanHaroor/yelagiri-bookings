"use client"

import { useState } from "react"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Star,
  MapPin,
  Phone,
  Mail,
  Globe,
  Wifi,
  Car,
  Utensils,
  Waves,
  ChevronLeft,
  ChevronRight,
  CalendarIcon,
  Users,
  Bed,
  Coffee,
  Tv,
  Wind,
} from "lucide-react"
import { format } from "date-fns"
import type { Hotel } from "@/lib/hotels"

interface HotelDetailClientProps {
  hotel: Hotel
}

export default function HotelDetailClient({ hotel }: HotelDetailClientProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [checkInDate, setCheckInDate] = useState<Date>()
  const [checkOutDate, setCheckOutDate] = useState<Date>()
  const [guests, setGuests] = useState("2")
  const [selectedRoom, setSelectedRoom] = useState("")

  // Safe access to hotel data with fallbacks
  const images = hotel?.hotel_images || []
  const roomTypes = hotel?.room_types || []
  const amenities = hotel?.hotel_amenities || []
  const reviews = hotel?.reviews || []

  const nextImage = () => {
    if (images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % images.length)
    }
  }

  const prevImage = () => {
    if (images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
    ))
  }

  const getAmenityIcon = (iconName: string) => {
    const iconMap: { [key: string]: any } = {
      wifi: Wifi,
      parking: Car,
      restaurant: Utensils,
      pool: Waves,
      coffee: Coffee,
      tv: Tv,
      ac: Wind,
    }
    const IconComponent = iconMap[iconName?.toLowerCase()] || Coffee
    return <IconComponent className="h-4 w-4" />
  }

  const calculateTotal = () => {
    if (!selectedRoom || !checkInDate || !checkOutDate) return 0

    const room = roomTypes.find((r) => r.id === selectedRoom)
    if (!room) return 0

    const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24))
    return room.base_price * nights * Number.parseInt(guests)
  }

  if (!hotel) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Hotel not found</h1>
            <p className="text-gray-600">The hotel you're looking for doesn't exist.</p>
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
        {/* Hero Section with Image Gallery */}
        <section className="relative">
          <div className="relative h-64 md:h-96 lg:h-[500px]">
            {images.length > 0 ? (
              <Image
                src={images[currentImageIndex]?.image_url || "/placeholder.jpg"}
                alt={images[currentImageIndex]?.alt_text || hotel.name}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500 text-lg">No images available</span>
              </div>
            )}

            {images.length > 1 && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                  onClick={prevImage}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                  onClick={nextImage}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>

                {/* Image indicators */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentImageIndex ? "bg-white" : "bg-white/50"
                      }`}
                      onClick={() => setCurrentImageIndex(index)}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </section>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Hotel Info */}
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">{hotel.name}</h1>
                    <div className="flex items-center text-gray-600 mb-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{hotel.area}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">{renderStars(Math.round(hotel.average_rating || 0))}</div>
                      <span className="text-sm text-gray-600">({hotel.total_reviews || 0} reviews)</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">
                      ₹{hotel.starting_price?.toLocaleString() || "N/A"}
                    </div>
                    <div className="text-sm text-gray-600">per night</div>
                  </div>
                </div>

                <p className="text-gray-700 leading-relaxed">
                  {hotel.description || hotel.short_description || "No description available."}
                </p>
              </div>

              {/* Amenities */}
              <div>
                <h2 className="text-2xl font-bold mb-4">Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {amenities.length > 0 ? (
                    amenities.map((amenity) => (
                      <div key={amenity.id} className="flex items-center space-x-2">
                        {getAmenityIcon(amenity.amenities.icon)}
                        <span className="text-sm">{amenity.amenities.name}</span>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full text-gray-500">No amenities listed</div>
                  )}
                </div>
              </div>

              {/* Room Types */}
              <div>
                <h2 className="text-2xl font-bold mb-4">Room Types</h2>
                <div className="space-y-4">
                  {roomTypes.length > 0 ? (
                    roomTypes.map((room) => (
                      <Card key={room.id}>
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="text-lg font-semibold mb-2">{room.name}</h3>
                              <p className="text-gray-600 text-sm mb-3">
                                {room.description || "No description available"}
                              </p>
                              <div className="flex items-center space-x-4 text-sm text-gray-600">
                                <div className="flex items-center">
                                  <Users className="h-4 w-4 mr-1" />
                                  <span>Up to {room.max_occupancy} guests</span>
                                </div>
                                <div className="flex items-center">
                                  <Bed className="h-4 w-4 mr-1" />
                                  <span>{room.bed_type}</span>
                                </div>
                              </div>
                              <div className="flex flex-wrap gap-2 mt-3">
                                {room.has_ac && <Badge variant="secondary">AC</Badge>}
                                {room.has_wifi && <Badge variant="secondary">WiFi</Badge>}
                                {room.has_tv && <Badge variant="secondary">TV</Badge>}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-xl font-bold text-green-600">
                                ₹{room.base_price?.toLocaleString() || "N/A"}
                              </div>
                              <div className="text-sm text-gray-600">per night</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="text-gray-500">No room types available</div>
                  )}
                </div>
              </div>

              {/* Reviews */}
              <div>
                <h2 className="text-2xl font-bold mb-4">Guest Reviews</h2>
                <div className="space-y-4">
                  {reviews.length > 0 ? (
                    reviews.slice(0, 5).map((review) => (
                      <Card key={review.id}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="font-semibold">{review.guest_name}</h4>
                              <div className="flex items-center mt-1">{renderStars(review.rating)}</div>
                            </div>
                            <span className="text-sm text-gray-500">
                              {new Date(review.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-gray-700 text-sm">{review.review_text || "No comment provided"}</p>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="text-gray-500">No reviews available</div>
                  )}
                </div>
              </div>
            </div>

            {/* Booking Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle>Book Your Stay</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Check-in Date */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Check-in</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {checkInDate ? format(checkInDate, "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={checkInDate} onSelect={setCheckInDate} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Check-out Date */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Check-out</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {checkOutDate ? format(checkOutDate, "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={checkOutDate} onSelect={setCheckOutDate} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Guests */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Guests</label>
                    <Select value={guests} onValueChange={setGuests}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6].map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num} Guest{num > 1 ? "s" : ""}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Room Selection */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Room Type</label>
                    <Select value={selectedRoom} onValueChange={setSelectedRoom}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select room type" />
                      </SelectTrigger>
                      <SelectContent>
                        {roomTypes.map((room) => (
                          <SelectItem key={room.id} value={room.id}>
                            {room.name} - ₹{room.base_price?.toLocaleString()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  {/* Total */}
                  <div className="flex justify-between items-center font-semibold">
                    <span>Total:</span>
                    <span className="text-lg text-green-600">₹{calculateTotal().toLocaleString()}</span>
                  </div>

                  <Button className="w-full bg-[#0071C2] hover:bg-[#005999]">Book Now</Button>
                </CardContent>
              </Card>

              {/* Contact Info */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {hotel.phone && (
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-gray-600" />
                      <span className="text-sm">{hotel.phone}</span>
                    </div>
                  )}
                  {hotel.email && (
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-600" />
                      <span className="text-sm">{hotel.email}</span>
                    </div>
                  )}
                  {hotel.website && (
                    <div className="flex items-center space-x-2">
                      <Globe className="h-4 w-4 text-gray-600" />
                      <span className="text-sm">{hotel.website}</span>
                    </div>
                  )}
                  <div className="flex items-start space-x-2">
                    <MapPin className="h-4 w-4 text-gray-600 mt-0.5" />
                    <span className="text-sm">{hotel.address}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
