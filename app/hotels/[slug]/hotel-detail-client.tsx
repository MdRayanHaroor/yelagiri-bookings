"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { MapPin, Phone, Mail, Star, Users, Bed, Wifi, Tv, Snowflake, ChevronLeft, ChevronRight } from "lucide-react"
import type { Hotel } from "@/lib/hotels"

interface HotelDetailClientProps {
  hotel: Hotel
}

export default function HotelDetailClient({ hotel }: HotelDetailClientProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")
  const [guests, setGuests] = useState(2)

  // Safe access to hotel images with fallback
  const images = hotel.hotel_images || []
  const hasImages = images.length > 0
  const currentImage = hasImages ? images[currentImageIndex] : null

  const nextImage = () => {
    if (hasImages) {
      setCurrentImageIndex((prev) => (prev + 1) % images.length)
    }
  }

  const prevImage = () => {
    if (hasImages) {
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
    }
  }

  const roomTypes = hotel.room_types || []
  const amenities = hotel.hotel_amenities || []
  const reviews = hotel.reviews || []

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Image Gallery */}
      <div className="relative h-96 bg-gray-200">
        {hasImages && currentImage ? (
          <>
            <Image
              src={currentImage.image_url || "/placeholder.svg"}
              alt={currentImage.alt_text || hotel.name}
              fill
              className="object-cover"
              priority
            />
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        index === currentImageIndex ? "bg-white" : "bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-300">
            <div className="text-center">
              <div className="text-6xl mb-4">🏨</div>
              <p className="text-gray-600">No images available</p>
            </div>
          </div>
        )}
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hotel Info */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-3xl font-bold">{hotel.name}</h1>
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{hotel.average_rating}</span>
                  <span className="text-gray-600">({hotel.total_reviews} reviews)</span>
                </div>
              </div>

              <div className="flex items-center text-gray-600 mb-4">
                <MapPin className="h-4 w-4 mr-2" />
                <span>{hotel.address}</span>
              </div>

              <p className="text-gray-700 leading-relaxed">
                {hotel.description || hotel.short_description || "No description available."}
              </p>
            </div>

            {/* Amenities */}
            {amenities.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Amenities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {amenities.map((amenity) => (
                      <div key={amenity.id} className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 text-sm">✓</span>
                        </div>
                        <span className="text-sm">{amenity.amenities.name}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Room Types */}
            {roomTypes.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Room Types</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {roomTypes.map((room) => (
                    <div key={room.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-lg">{room.name}</h3>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-600">₹{room.base_price}</div>
                          <div className="text-sm text-gray-600">per night</div>
                        </div>
                      </div>

                      <p className="text-gray-600 mb-3">{room.description}</p>

                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge variant="outline" className="flex items-center space-x-1">
                          <Users className="h-3 w-3" />
                          <span>{room.max_occupancy} guests</span>
                        </Badge>
                        <Badge variant="outline" className="flex items-center space-x-1">
                          <Bed className="h-3 w-3" />
                          <span>{room.bed_type}</span>
                        </Badge>
                        {room.has_wifi && (
                          <Badge variant="outline" className="flex items-center space-x-1">
                            <Wifi className="h-3 w-3" />
                            <span>WiFi</span>
                          </Badge>
                        )}
                        {room.has_ac && (
                          <Badge variant="outline" className="flex items-center space-x-1">
                            <Snowflake className="h-3 w-3" />
                            <span>AC</span>
                          </Badge>
                        )}
                        {room.has_tv && (
                          <Badge variant="outline" className="flex items-center space-x-1">
                            <Tv className="h-3 w-3" />
                            <span>TV</span>
                          </Badge>
                        )}
                      </div>

                      <Button className="w-full">Select Room</Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Reviews */}
            {reviews.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Guest Reviews</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {reviews.slice(0, 3).map((review) => (
                    <div key={review.id} className="border-b pb-4 last:border-b-0">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{review.guest_name}</h4>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{review.rating}</span>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm">{review.review_text}</p>
                      <p className="text-xs text-gray-400 mt-2">{new Date(review.created_at).toLocaleDateString()}</p>
                    </div>
                  ))}
                  {reviews.length > 3 && (
                    <Button variant="outline" className="w-full bg-transparent">
                      View All Reviews ({reviews.length})
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Booking Sidebar */}
          <div className="space-y-6">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Book Your Stay</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">₹{hotel.starting_price}</div>
                  <div className="text-sm text-gray-600">per night</div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Check-in</label>
                    <input
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Check-out</label>
                    <input
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Guests</label>
                    <select
                      value={guests}
                      onChange={(e) => setGuests(Number(e.target.value))}
                      className="w-full p-2 border rounded-md"
                    >
                      {[1, 2, 3, 4, 5, 6].map((num) => (
                        <option key={num} value={num}>
                          {num} {num === 1 ? "Guest" : "Guests"}
                        </option>
                      ))}
                    </select>
                  </div>

                  <Button className="w-full" size="lg">
                    Book Now
                  </Button>
                </div>

                <Separator />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Base price</span>
                    <span>₹{hotel.starting_price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Service fee</span>
                    <span>₹200</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxes</span>
                    <span>₹{Math.round(hotel.starting_price * 0.12)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>₹{hotel.starting_price + 200 + Math.round(hotel.starting_price * 0.12)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {hotel.phone && (
                  <div className="flex items-center space-x-3">
                    <Phone className="h-4 w-4 text-gray-600" />
                    <span className="text-sm">{hotel.phone}</span>
                  </div>
                )}
                {hotel.email && (
                  <div className="flex items-center space-x-3">
                    <Mail className="h-4 w-4 text-gray-600" />
                    <span className="text-sm">{hotel.email}</span>
                  </div>
                )}
                <div className="flex items-center space-x-3">
                  <MapPin className="h-4 w-4 text-gray-600" />
                  <span className="text-sm">{hotel.address}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
