"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, ArrowLeft, CheckCircle } from "lucide-react"
import { supabase } from "@/lib/supabase"
import type { User as SupabaseUser } from "@supabase/supabase-js"

interface BookingData {
  hotelId: string
  hotelName: string
  checkIn: string
  checkOut: string
  guests: number
  roomType: string
  roomPrice: number
  totalNights: number
  totalPrice: number
}

interface GuestFormData {
  fullName: string
  email: string
  phone: string
  specialRequests: string
}

interface FormErrors {
  fullName?: string
  email?: string
  phone?: string
}

export default function BookingSummaryPage() {
  const router = useRouter()
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [bookingData, setBookingData] = useState<BookingData | null>(null)
  const [formData, setFormData] = useState<GuestFormData>({
    fullName: "",
    email: "",
    phone: "",
    specialRequests: "",
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session?.user) {
        router.push("/signin?redirect=/booking-summary")
        return
      }
      setUser(session.user)
      setFormData((prev) => ({
        ...prev,
        email: session.user.email || "",
      }))

      // Get booking data from session storage
      const stored = sessionStorage.getItem("bookingData")
      if (!stored) {
        router.push("/hotels")
        return
      }
      setBookingData(JSON.parse(stored))
      setLoading(false)
    }

    checkAuth()
  }, [router])

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Full Name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required"
    } else if (formData.fullName.trim().length < 3) {
      newErrors.fullName = "Full name must be at least 3 characters"
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    // Phone validation (Indian phone number)
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required"
    } else if (!/^[6-9]\d{9}$/.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Please enter a valid 10-digit Indian phone number"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error for this field when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    if (!bookingData || !user) {
      setSubmitError("Booking data missing. Please start over.")
      return
    }

    setIsSubmitting(true)
    setSubmitError("")

    try {
      // Save booking to database
      const { data, error } = await supabase.from("bookings").insert([
        {
          hotel_id: bookingData.hotelId,
          user_id: user.id,
          guest_name: formData.fullName,
          guest_email: formData.email,
          guest_phone: formData.phone,
          check_in: bookingData.checkIn,
          check_out: bookingData.checkOut,
          number_of_guests: bookingData.guests,
          room_type: bookingData.roomType,
          special_requests: formData.specialRequests || null,
          total_price: bookingData.totalPrice,
          status: "confirmed",
          created_at: new Date().toISOString(),
        },
      ])

      if (error) {
        console.error("Error saving booking:", error)
        setSubmitError("Failed to save booking. Please try again.")
        setIsSubmitting(false)
        return
      }

      // Clear session storage
      sessionStorage.removeItem("bookingData")

      // Redirect to confirmation page with booking ID
      if (data && data.length > 0) {
        router.push(`/booking-confirmation?bookingId=${data[0].id}`)
      } else {
        router.push("/booking-confirmation")
      }
    } catch (err) {
      console.error("Unexpected error:", err)
      setSubmitError("An unexpected error occurred. Please try again.")
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0071C2]"></div>
      </div>
    )
  }

  if (!bookingData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-gray-600 mb-4">No booking data found</p>
            <Button asChild>
              <Link href="/hotels">Back to Hotels</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/hotels" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Hotels
          </Link>
        </Button>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Booking Summary */}
          <div className="md:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="text-lg">Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Hotel</p>
                  <p className="font-medium">{bookingData.hotelName}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Room Type</p>
                  <p className="font-medium">{bookingData.roomType}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Check-in</p>
                  <p className="font-medium">
                    {new Date(bookingData.checkIn).toLocaleDateString("en-IN", {
                      weekday: "short",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Check-out</p>
                  <p className="font-medium">
                    {new Date(bookingData.checkOut).toLocaleDateString("en-IN", {
                      weekday: "short",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Number of Guests</p>
                  <p className="font-medium">{bookingData.guests}</p>
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      ₹{bookingData.roomPrice.toLocaleString()} × {bookingData.totalNights} night
                      {bookingData.totalNights > 1 ? "s" : ""}
                    </span>
                    <span className="font-medium">
                      ₹{(bookingData.roomPrice * bookingData.totalNights).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between font-semibold text-base pt-2 border-t">
                    <span>Total</span>
                    <span className="text-[#0071C2]">₹{bookingData.totalPrice.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Guest Information Form */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Guest Information</CardTitle>
              </CardHeader>
              <CardContent>
                {submitError && (
                  <Alert variant="destructive" className="mb-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{submitError}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-base font-medium">
                      Full Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className={errors.fullName ? "border-red-500" : ""}
                      disabled={isSubmitting}
                    />
                    {errors.fullName && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.fullName}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-base font-medium">
                      Email Address <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={errors.email ? "border-red-500" : ""}
                      disabled={isSubmitting}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-base font-medium">
                      Phone Number <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="Enter your 10-digit phone number"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={errors.phone ? "border-red-500" : ""}
                      disabled={isSubmitting}
                    />
                    {errors.phone && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  {/* Special Requests */}
                  <div className="space-y-2">
                    <Label htmlFor="specialRequests" className="text-base font-medium">
                      Special Requests <span className="text-gray-500 text-sm">(Optional)</span>
                    </Label>
                    <Textarea
                      id="specialRequests"
                      name="specialRequests"
                      placeholder="Any special requests? (e.g., high floor, crib needed, etc.)"
                      value={formData.specialRequests}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                      rows={4}
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="flex gap-3 pt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.back()}
                      disabled={isSubmitting}
                      className="flex-1"
                    >
                      Back
                    </Button>
                    <Button type="submit" disabled={isSubmitting} className="flex-1 bg-[#0071C2] hover:bg-[#0056a0]">
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Complete Payment
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
