"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Star, MapPin, AlertCircle } from "lucide-react"
import { format, differenceInDays } from "date-fns"
import { supabase } from "@/lib/supabase"
import { setBookingData } from "@/lib/booking-store"

interface Hotel {
  id: string
  name: string
  slug: string
  short_description: string
  description: string
  address: string
  area: string
  starting_price: number
  amenities: string[]
  rating: number
  reviews_count: number
}

interface Room {
  id: string
  room_name: string
  room_type: string
  max_occupancy: number
  base_price: number
}

interface HotelDetailClientProps {
  hotel: Hotel
  rooms: Room[]
  reviews: any[]
}

export function HotelDetailClient({ hotel, rooms, reviews }: HotelDetailClientProps) {
  const router = useRouter()
  const [checkInDate, setCheckInDate] = useState("")
  const [checkOutDate, setCheckOutDate] = useState("")
  const [guests, setGuests] = useState("1")
  const [selectedRoom, setSelectedRoom] = useState("")
  const [errors, setErrors] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const validateBookingForm = (): boolean => {
    const validationErrors: string[] = []

    if (!checkInDate) {
      validationErrors.push("Check-in date is required")
    }

    if (!checkOutDate) {
      validationErrors.push("Check-out date is required")
    }

    if (checkInDate && checkOutDate) {
      const checkIn = new Date(checkInDate)
      const checkOut = new Date(checkOutDate)

      if (checkOut <= checkIn) {
        validationErrors.push("Check-out date must be after check-in date")
      }

      if (checkIn < new Date()) {
        validationErrors.push("Check-in date cannot be in the past")
      }
    }

    if (!guests || Number(guests) < 1) {
      validationErrors.push("Please select at least 1 guest")
    }

    if (!selectedRoom) {
      validationErrors.push("Please select a room type")
    }

    setErrors(validationErrors)
    return validationErrors.length === 0
  }

  const handleBookNow = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateBookingForm()) {
      return
    }

    setIsLoading(true)

    try {
      // Check if user is logged in
      const { data } = await supabase.auth.getSession()

      if (!data?.session?.user) {
        // Store booking data and redirect to signin
        const selectedRoomData = rooms.find((r) => r.id === selectedRoom)
        if (selectedRoomData) {
          const checkIn = new Date(checkInDate)
          const checkOut = new Date(checkOutDate)
          const nights = differenceInDays(checkOut, checkIn)
          const totalPrice = selectedRoomData.base_price * nights * Math.ceil(1 + Math.ceil(Number(guests) / 2) / 2)

          setBookingData({
            hotelId: hotel.id,
            hotelName: hotel.name,
            roomId: selectedRoomData.id,
            roomName: selectedRoomData.room_name,
            roomPrice: selectedRoomData.base_price,
            checkInDate: checkIn,
            checkOutDate: checkOut,
            guests: Number(guests),
            nights,
            totalPrice,
          })
        }

        router.push(`/signin?redirect=/booking-summary`)
        return
      }

      // User is logged in, proceed to booking summary
      const selectedRoomData = rooms.find((r) => r.id === selectedRoom)
      if (selectedRoomData) {
        const checkIn = new Date(checkInDate)
        const checkOut = new Date(checkOutDate)
        const nights = differenceInDays(checkOut, checkIn)
        const totalPrice = selectedRoomData.base_price * nights * Math.ceil(1 + Math.ceil(Number(guests) / 2) / 2)

        setBookingData({
          hotelId: hotel.id,
          hotelName: hotel.name,
          roomId: selectedRoomData.id,
          roomName: selectedRoomData.room_name,
          roomPrice: selectedRoomData.base_price,
          checkInDate: checkIn,
          checkOutDate: checkOut,
          guests: Number(guests),
          nights,
          totalPrice,
        })
      }

      router.push("/booking-summary")
    } catch (err) {
      console.error("Error:", err)
      setErrors(["An error occurred. Please try again."])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative">
        <div className="h-[400px] md:h-[500px] bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{hotel.name}</h1>
            <div className="flex items-center justify-center space-x-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${i < Math.floor(hotel.rating) ? "fill-yellow-300 text-yellow-300" : "text-gray-300"}`}
                  />
                ))}
              </div>
              <span>{hotel.rating.toFixed(1)}</span>
              <span>({hotel.reviews_count} reviews)</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>About this property</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 leading-relaxed">{hotel.description}</p>

              <div className="flex items-start space-x-2 text-gray-600">
                <MapPin className="h-5 w-5 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold">{hotel.area}</p>
                  <p className="text-sm">{hotel.address}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Amenities */}
          <Card>
            <CardHeader>
              <CardTitle>Amenities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {hotel.amenities.map((amenity, index) => (
                  <Badge key={index} variant="secondary" className="text-sm py-2">
                    {amenity}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Room Types */}
          <Card>
            <CardHeader>
              <CardTitle>Available Rooms</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {rooms.map((room) => (
                  <div key={room.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">{room.room_name}</h4>
                        <p className="text-sm text-gray-600">Type: {room.room_type}</p>
                        <p className="text-sm text-gray-600">Max occupancy: {room.max_occupancy} guests</p>
                      </div>
                      <p className="font-bold text-lg">₹{room.base_price.toLocaleString()}/night</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Reviews */}
          {reviews.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Guest Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reviews.slice(0, 3).map((review, index) => (
                    <div key={index}>
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${i < review.rating ? "fill-yellow-300 text-yellow-300" : "text-gray-300"}`}
                            />
                          ))}
                        </div>
                        <span className="font-semibold">{review.guest_name}</span>
                      </div>
                      <p className="text-gray-600 text-sm">{review.review_text}</p>
                      {index < reviews.length - 1 && <Separator className="mt-4" />}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Booking Form Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-8">
            <CardHeader>
              <CardTitle>Book Your Stay</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleBookNow} className="space-y-4">
                {errors.length > 0 && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800 ml-2">
                      <ul className="list-disc list-inside space-y-1">
                        {errors.map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}

                <div>
                  <Label htmlFor="check-in">Check-in Date *</Label>
                  <Input
                    id="check-in"
                    type="date"
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    min={format(new Date(), "yyyy-MM-dd")}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="check-out">Check-out Date *</Label>
                  <Input
                    id="check-out"
                    type="date"
                    value={checkOutDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                    min={checkInDate || format(new Date(), "yyyy-MM-dd")}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="guests">Number of Guests *</Label>
                  <Select value={guests} onValueChange={setGuests}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num} {num === 1 ? "Guest" : "Guests"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="room-select">Select Room *</Label>
                  <Select value={selectedRoom} onValueChange={setSelectedRoom}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a room type" />
                    </SelectTrigger>
                    <SelectContent>
                      {rooms.map((room) => (
                        <SelectItem key={room.id} value={room.id}>
                          {room.room_name} - ₹{room.base_price.toLocaleString()}/night
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit" className="w-full bg-[#0071C2] hover:bg-[#005999]" disabled={isLoading}>
                  {isLoading ? "Processing..." : "Book Now"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
