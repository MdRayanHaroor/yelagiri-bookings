"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, Download, Home } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface Booking {
  id: string
  hotel_id: string
  guest_name: string
  guest_email: string
  guest_phone: string
  check_in: string
  check_out: string
  number_of_guests: number
  room_type: string
  total_price: number
  special_requests: string | null
  created_at: string
  hotel_name?: string
}

export default function BookingConfirmationPage() {
  const searchParams = useSearchParams()
  const bookingId = searchParams.get("bookingId")
  const [booking, setBooking] = useState<Booking | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchBooking = async () => {
      if (!bookingId) {
        setError("No booking found")
        setLoading(false)
        return
      }

      try {
        const { data, error: fetchError } = await supabase
          .from("bookings")
          .select(
            `
            *,
            hotels:hotel_id (
              name
            )
          `,
          )
          .eq("id", bookingId)
          .single()

        if (fetchError) {
          console.error("Error fetching booking:", fetchError)
          setError("Could not find booking details")
          setLoading(false)
          return
        }

        if (data) {
          setBooking({
            ...data,
            hotel_name: data.hotels?.name || "Hotel",
          })
        }
      } catch (err) {
        console.error("Unexpected error:", err)
        setError("An error occurred while fetching booking details")
      } finally {
        setLoading(false)
      }
    }

    fetchBooking()
  }, [bookingId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0071C2]"></div>
      </div>
    )
  }

  if (error || !booking) {
    return (
      <main className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="container mx-auto max-w-2xl">
          <Card>
            <CardContent className="pt-6">
              <Alert variant="destructive" className="mb-6">
                <AlertDescription>{error || "Booking not found"}</AlertDescription>
              </Alert>
              <Button asChild className="w-full">
                <Link href="/hotels">Back to Hotels</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    )
  }

  const checkInDate = new Date(booking.check_in)
  const checkOutDate = new Date(booking.check_out)
  const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24))

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4">
      <div className="container mx-auto max-w-2xl">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-green-100 p-4">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
          <p className="text-gray-600">Your reservation has been successfully booked</p>
        </div>

        {/* Booking Reference */}
        <Card className="mb-6 border-2 border-green-200 bg-white">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Booking Reference Number</p>
              <p className="text-2xl font-bold text-[#0071C2] font-mono">{booking.id.slice(0, 12).toUpperCase()}</p>
            </div>
          </CardContent>
        </Card>

        {/* Booking Details */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Booking Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Hotel */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Hotel Name</p>
                <p className="font-semibold text-gray-900">{booking.hotel_name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Room Type</p>
                <p className="font-semibold text-gray-900">{booking.room_type}</p>
              </div>
            </div>

            {/* Dates */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Check-in</p>
                <p className="font-semibold text-gray-900">
                  {checkInDate.toLocaleDateString("en-IN", {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Check-out</p>
                <p className="font-semibold text-gray-900">
                  {checkOutDate.toLocaleDateString("en-IN", {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>

            {/* Guests */}
            <div>
              <p className="text-sm text-gray-600 mb-1">Number of Guests</p>
              <p className="font-semibold text-gray-900">{booking.number_of_guests}</p>
            </div>

            {/* Special Requests */}
            {booking.special_requests && (
              <div>
                <p className="text-sm text-gray-600 mb-1">Special Requests</p>
                <p className="text-gray-900">{booking.special_requests}</p>
              </div>
            )}

            {/* Price Summary */}
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Number of nights</span>
                <span className="font-medium">{nights}</span>
              </div>
              <div className="flex justify-between font-semibold text-base pt-2 border-t">
                <span>Total Amount</span>
                <span className="text-[#0071C2]">₹{booking.total_price.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Guest Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Guest Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Name</p>
              <p className="font-semibold text-gray-900">{booking.guest_name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Email</p>
              <p className="font-semibold text-gray-900">{booking.guest_email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Phone</p>
              <p className="font-semibold text-gray-900">{booking.guest_phone}</p>
            </div>
          </CardContent>
        </Card>

        {/* Info Alert */}
        <Alert className="mb-6 bg-blue-50 border-blue-200">
          <AlertDescription className="text-blue-800">
            A confirmation email with your booking details has been sent to <strong>{booking.guest_email}</strong>.
            Please check your email for further information.
          </AlertDescription>
        </Alert>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            variant="outline"
            asChild
            className="flex-1 border-[#0071C2] text-[#0071C2] hover:bg-blue-50 bg-transparent"
          >
            <Link href="/hotels" className="flex items-center justify-center gap-2">
              <Home className="h-4 w-4" />
              Continue Browsing
            </Link>
          </Button>
          <Button className="flex-1 bg-[#0071C2] hover:bg-[#0056a0]" onClick={() => window.print()}>
            <Download className="h-4 w-4 mr-2" />
            Download Receipt
          </Button>
        </div>
      </div>
    </main>
  )
}
