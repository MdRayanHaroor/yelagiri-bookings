"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { X, Plus, Building, MapPin, Star, Bed } from "lucide-react"
import { useState } from "react"
import { supabase } from "@/lib/supabase"

interface PropertyFormData {
  // Basic Information
  name: string
  description: string
  short_description: string
  category: string

  // Location (remove latitude and longitude)
  address: string
  area: string

  // Contact
  phone: string
  email: string
  website: string

  // Pricing
  starting_price: string

  // Features
  total_rooms: string
  check_in_time: string
  check_out_time: string

  // Owner Information
  owner_name: string
  owner_phone: string
  owner_email: string

  // Amenities
  amenities: string[]
  kitchen_amenities: string[]

  // Room Types with toilet information
  room_types: RoomType[]

  // Food Delivery Details
  food_delivery_details: string
}

interface RoomType {
  name: string
  description: string
  max_occupancy: string
  base_price: string
  total_rooms: string
  bed_type: string
  has_ac: boolean
  has_wifi: boolean
  has_tv: boolean
  has_balcony: boolean
  // New toilet fields
  toilet_type: string // 'attached' or 'common'
  toilet_count: string
}

const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const validatePhone = (phone: string) => {
  const phoneRegex = /^(\+91|91)?[6-9]\d{9}$/
  return phoneRegex.test(phone.replace(/\s+/g, ""))
}

const validateForm = (step: number, formData: PropertyFormData) => {
  const errors: string[] = []

  if (step === 1) {
    if (!formData.name.trim()) errors.push("Property name is required")
    if (!formData.category) errors.push("Property category is required")
    if (!formData.short_description.trim()) errors.push("Short description is required")
    if (!formData.description.trim()) errors.push("Detailed description is required")
    if (!formData.starting_price || Number.parseFloat(formData.starting_price) <= 0)
      errors.push("Valid starting price is required")
    if (!formData.total_rooms || Number.parseInt(formData.total_rooms) <= 0)
      errors.push("Valid number of rooms is required")
  }

  if (step === 2) {
    if (!formData.address.trim()) errors.push("Address is required")
    if (!formData.area) errors.push("Area selection is required")
    if (!formData.phone.trim()) errors.push("Property phone is required")
    if (!validatePhone(formData.phone)) errors.push("Please enter a valid Indian phone number")
    if (!formData.email.trim()) errors.push("Property email is required")
    if (!validateEmail(formData.email)) errors.push("Please enter a valid email address")
    if (!formData.owner_name.trim()) errors.push("Owner name is required")
    if (!formData.owner_phone.trim()) errors.push("Owner phone is required")
    if (!validatePhone(formData.owner_phone)) errors.push("Please enter a valid owner phone number")
    if (!formData.owner_email.trim()) errors.push("Owner email is required")
    if (!validateEmail(formData.owner_email)) errors.push("Please enter a valid owner email address")
  }

  if (step === 4) {
    if (formData.room_types.length === 0) errors.push("At least one room type is required")
    formData.room_types.forEach((room, index) => {
      if (!room.name.trim()) errors.push(`Room type ${index + 1}: Name is required`)
      if (!room.base_price || Number.parseFloat(room.base_price) <= 0)
        errors.push(`Room type ${index + 1}: Valid price is required`)
      if (!room.total_rooms || Number.parseInt(room.total_rooms) <= 0)
        errors.push(`Room type ${index + 1}: Valid number of rooms is required`)
      if (!room.toilet_count || Number.parseInt(room.toilet_count) <= 0)
        errors.push(`Room type ${index + 1}: Valid toilet count is required`)
    })
  }

  return errors
}

const AREAS = [
  "Lake View Area",
  "Swamimalai Area",
  "Town Center",
  "Hilltop Area",
  "Orchard Area",
  "Adventure Zone",
  "Heritage Area",
]

const CATEGORIES = [
  { value: "luxury", label: "Luxury Resort" },
  { value: "budget", label: "Budget Hotel" },
  { value: "boutique", label: "Boutique Hotel" },
  { value: "family", label: "Family Resort" },
  { value: "business", label: "Business Hotel" },
  { value: "eco", label: "Eco Resort" },
]

const AMENITIES = [
  "Free WiFi",
  "Swimming Pool",
  "Restaurant",
  "Free Parking",
  "Air Conditioning",
  "Spa Services",
  "Gym/Fitness Center",
  "24/7 Room Service",
  "Conference Hall",
  "Kids Play Area",
  "Garden/Lawn",
  "Travel Desk",
  "Doctor on Call",
  "Bonfire Area",
  "Adventure Sports",
  "Pet Friendly",
  "Carrom",
  "Cycles",
  "Terrace",
  "Smart TV",
  "TV (Normal)",
  "Heater (Hot Water)",
  "Food Delivery",
]

const KITCHEN_AMENITIES = [
  "Gas Stove",
  "Electric Stove",
  "Refrigerator",
  "Microwave",
  "Kitchen Utensils",
  "Dining Table",
  "Water Purifier",
  "Induction Cooktop",
]

const BED_TYPES = ["Single", "Double", "Queen", "King", "Twin"]

export default function ListPropertyPage() {
  const [formData, setFormData] = useState<PropertyFormData>({
    name: "",
    description: "",
    short_description: "",
    category: "",
    address: "",
    area: "",
    phone: "",
    email: "",
    website: "",
    starting_price: "",
    total_rooms: "",
    check_in_time: "14:00",
    check_out_time: "11:00",
    owner_name: "",
    owner_phone: "",
    owner_email: "",
    amenities: [],
    kitchen_amenities: [],
    room_types: [
      {
        name: "",
        description: "",
        max_occupancy: "2",
        base_price: "",
        total_rooms: "",
        bed_type: "Double",
        has_ac: true,
        has_wifi: true,
        has_tv: true,
        has_balcony: false,
        toilet_type: "attached",
        toilet_count: "1",
      },
    ],
    food_delivery_details: "",
  })

  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [formErrors, setFormErrors] = useState<string[]>([])

  const handleInputChange = (field: keyof PropertyFormData, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleAmenityToggle = (amenity: string) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }))
  }

  const addRoomType = () => {
    setFormData((prev) => ({
      ...prev,
      room_types: [
        ...prev.room_types,
        {
          name: "",
          description: "",
          max_occupancy: "2",
          base_price: "",
          total_rooms: "",
          bed_type: "Double",
          has_ac: true,
          has_wifi: true,
          has_tv: true,
          has_balcony: false,
          toilet_type: "attached",
          toilet_count: "1",
        },
      ],
    }))
  }

  const removeRoomType = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      room_types: prev.room_types.filter((_, i) => i !== index),
    }))
  }

  const updateRoomType = (index: number, field: keyof RoomType, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      room_types: prev.room_types.map((room, i) => (i === index ? { ...room, [field]: value } : room)),
    }))
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      // Create property submission record
      const propertyData = {
        name: formData.name,
        description: formData.description,
        short_description: formData.short_description,
        address: formData.address,
        area: formData.area,
        phone: formData.phone,
        email: formData.email,
        website: formData.website || null,
        starting_price: Number.parseFloat(formData.starting_price),
        total_rooms: Number.parseInt(formData.total_rooms),
        check_in_time: formData.check_in_time,
        check_out_time: formData.check_out_time,
        status: "pending", // Will be reviewed by admin
        is_featured: false,
        is_verified: false,
        slug: formData.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, ""),
        owner_info: {
          name: formData.owner_name,
          phone: formData.owner_phone,
          email: formData.owner_email,
        },
        amenities: formData.amenities,
        kitchen_amenities: formData.kitchen_amenities,
        room_types: formData.room_types,
        submission_date: new Date().toISOString(),
        food_delivery_details: formData.food_delivery_details,
      }

      // Store in a separate table for admin review
      const { error } = await supabase.from("property_submissions").insert([propertyData])

      if (error) {
        console.error("Error submitting property:", error)
        alert("Error submitting property. Please try again.")
        return
      }

      setSubmitSuccess(true)
    } catch (error) {
      console.error("Error:", error)
      alert("Error submitting property. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleNextStep = () => {
    const errors = validateForm(currentStep, formData)
    if (errors.length > 0) {
      setFormErrors(errors)
      return
    }
    setFormErrors([])
    setCurrentStep((prev) => Math.min(4, prev + 1))
  }

  if (submitSuccess) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex items-center justify-center py-12">
          <Card className="max-w-md mx-auto">
            <CardContent className="text-center p-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Submission Successful!</h2>
              <p className="text-gray-600 mb-6">
                Thank you for submitting your property. Our admin team will review your submission and contact you
                within 2-3 business days.
              </p>
              <Button onClick={() => (window.location.href = "/")} className="w-full">
                Return to Home
              </Button>
            </CardContent>
          </Card>
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
            <h1 className="text-3xl md:text-4xl font-bold mb-4">List Your Property</h1>
            <p className="text-lg opacity-90">Join Yelagiri Bookings and reach thousands of travelers</p>
          </div>
        </section>

        {/* Progress Steps */}
        <section className="py-6 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex justify-center">
              <div className="flex items-center space-x-4">
                {[1, 2, 3, 4].map((step) => (
                  <div key={step} className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        currentStep >= step ? "bg-[#0071C2] text-white" : "bg-gray-300 text-gray-600"
                      }`}
                    >
                      {step}
                    </div>
                    {step < 4 && (
                      <div className={`w-12 h-1 mx-2 ${currentStep > step ? "bg-[#0071C2]" : "bg-gray-300"}`} />
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-center mt-4">
              <div className="text-sm text-gray-600">
                Step {currentStep} of 4:{" "}
                {currentStep === 1
                  ? "Basic Information"
                  : currentStep === 2
                    ? "Location & Contact"
                    : currentStep === 3
                      ? "Amenities & Features"
                      : "Room Types & Review"}
              </div>
            </div>
          </div>
        </section>

        {/* Form Content */}
        <section className="py-8">
          <div className="container mx-auto px-4 max-w-4xl">
            {currentStep === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Building className="w-5 h-5 mr-2" />
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="name">Property Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="Enter your property name"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="category">Property Category *</Label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="short_description">Short Description *</Label>
                    <Input
                      id="short_description"
                      value={formData.short_description}
                      onChange={(e) => handleInputChange("short_description", e.target.value)}
                      placeholder="Brief description (max 100 characters)"
                      maxLength={100}
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Detailed Description *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      placeholder="Describe your property in detail"
                      rows={5}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="starting_price">Starting Price (₹ per night) *</Label>
                      <Input
                        id="starting_price"
                        type="number"
                        value={formData.starting_price}
                        onChange={(e) => handleInputChange("starting_price", e.target.value)}
                        placeholder="1000"
                      />
                    </div>
                    <div>
                      <Label htmlFor="total_rooms">Total Rooms *</Label>
                      <Input
                        id="total_rooms"
                        type="number"
                        value={formData.total_rooms}
                        onChange={(e) => handleInputChange("total_rooms", e.target.value)}
                        placeholder="10"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {currentStep === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="w-5 h-5 mr-2" />
                    Location & Contact Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="address">Full Address *</Label>
                    <Textarea
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      placeholder="Enter complete address"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="area">Area *</Label>
                    <Select value={formData.area} onValueChange={(value) => handleInputChange("area", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select area" />
                      </SelectTrigger>
                      <SelectContent>
                        {AREAS.map((area) => (
                          <SelectItem key={area} value={area}>
                            {area}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Remove the latitude/longitude section completely */}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Property Phone *</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        placeholder="+91 98765 43210"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Property Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="info@yourhotel.com"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="website">Website (Optional)</Label>
                    <Input
                      id="website"
                      value={formData.website}
                      onChange={(e) => handleInputChange("website", e.target.value)}
                      placeholder="https://yourhotel.com"
                    />
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold mb-4">Owner Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="owner_name">Owner Name *</Label>
                        <Input
                          id="owner_name"
                          value={formData.owner_name}
                          onChange={(e) => handleInputChange("owner_name", e.target.value)}
                          placeholder="Your full name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="owner_phone">Owner Phone *</Label>
                        <Input
                          id="owner_phone"
                          value={formData.owner_phone}
                          onChange={(e) => handleInputChange("owner_phone", e.target.value)}
                          placeholder="+91 98765 43210"
                        />
                      </div>
                      <div>
                        <Label htmlFor="owner_email">Owner Email *</Label>
                        <Input
                          id="owner_email"
                          type="email"
                          value={formData.owner_email}
                          onChange={(e) => handleInputChange("owner_email", e.target.value)}
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {currentStep === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle>Amenities & Features</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label>Select Available Amenities</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
                      {AMENITIES.map((amenity) => (
                        <div key={amenity} className="flex items-center space-x-2">
                          <Checkbox
                            id={amenity}
                            checked={formData.amenities.includes(amenity)}
                            onCheckedChange={() => handleAmenityToggle(amenity)}
                          />
                          <Label htmlFor={amenity} className="text-sm">
                            {amenity}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>Kitchen Amenities (if applicable)</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
                      {KITCHEN_AMENITIES.map((amenity) => (
                        <div key={amenity} className="flex items-center space-x-2">
                          <Checkbox
                            id={`kitchen-${amenity}`}
                            checked={formData.kitchen_amenities.includes(amenity)}
                            onCheckedChange={() => {
                              setFormData((prev) => ({
                                ...prev,
                                kitchen_amenities: prev.kitchen_amenities.includes(amenity)
                                  ? prev.kitchen_amenities.filter((a) => a !== amenity)
                                  : [...prev.kitchen_amenities, amenity],
                              }))
                            }}
                          />
                          <Label htmlFor={`kitchen-${amenity}`} className="text-sm">
                            {amenity}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="food_delivery_details">Food Delivery Details (Optional)</Label>
                    <Textarea
                      id="food_delivery_details"
                      value={formData.food_delivery_details}
                      onChange={(e) => handleInputChange("food_delivery_details", e.target.value)}
                      placeholder="Describe food delivery options, timings, partner restaurants, etc."
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="check_in_time">Check-in Time</Label>
                      <Input
                        id="check_in_time"
                        type="time"
                        value={formData.check_in_time}
                        onChange={(e) => handleInputChange("check_in_time", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="check_out_time">Check-out Time</Label>
                      <Input
                        id="check_out_time"
                        type="time"
                        value={formData.check_out_time}
                        onChange={(e) => handleInputChange("check_out_time", e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {currentStep === 4 && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center">
                        <Bed className="w-5 h-5 mr-2" />
                        Room Types
                      </span>
                      <Button onClick={addRoomType} variant="outline" size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Room Type
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {formData.room_types.map((room, index) => (
                      <div key={index} className="border rounded-lg p-4 mb-4">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-semibold">Room Type {index + 1}</h4>
                          {formData.room_types.length > 1 && (
                            <Button onClick={() => removeRoomType(index)} variant="outline" size="sm">
                              <X className="w-4 h-4" />
                            </Button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <Label>Room Name *</Label>
                            <Input
                              value={room.name}
                              onChange={(e) => updateRoomType(index, "name", e.target.value)}
                              placeholder="Deluxe Room"
                            />
                          </div>
                          <div>
                            <Label>Bed Type</Label>
                            <Select
                              value={room.bed_type}
                              onValueChange={(value) => updateRoomType(index, "bed_type", value)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {BED_TYPES.map((type) => (
                                  <SelectItem key={type} value={type}>
                                    {type}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="mb-4">
                          <Label>Description</Label>
                          <Textarea
                            value={room.description}
                            onChange={(e) => updateRoomType(index, "description", e.target.value)}
                            placeholder="Describe this room type"
                            rows={2}
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <Label>Max Occupancy</Label>
                            <Input
                              type="number"
                              value={room.max_occupancy}
                              onChange={(e) => updateRoomType(index, "max_occupancy", e.target.value)}
                            />
                          </div>
                          <div>
                            <Label>Price per Night (₹)</Label>
                            <Input
                              type="number"
                              value={room.base_price}
                              onChange={(e) => updateRoomType(index, "base_price", e.target.value)}
                            />
                          </div>
                          <div>
                            <Label>Number of Rooms</Label>
                            <Input
                              type="number"
                              value={room.total_rooms}
                              onChange={(e) => updateRoomType(index, "total_rooms", e.target.value)}
                            />
                          </div>
                        </div>

                        {/* New toilet information section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <Label>Toilet Type</Label>
                            <Select
                              value={room.toilet_type}
                              onValueChange={(value) => updateRoomType(index, "toilet_type", value)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="attached">Attached Bathroom</SelectItem>
                                <SelectItem value="common">Common Bathroom</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Number of Toilets</Label>
                            <Input
                              type="number"
                              min="1"
                              value={room.toilet_count}
                              onChange={(e) => updateRoomType(index, "toilet_count", e.target.value)}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`ac-${index}`}
                              checked={room.has_ac}
                              onCheckedChange={(checked) => updateRoomType(index, "has_ac", checked as boolean)}
                            />
                            <Label htmlFor={`ac-${index}`}>AC</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`wifi-${index}`}
                              checked={room.has_wifi}
                              onCheckedChange={(checked) => updateRoomType(index, "has_wifi", checked as boolean)}
                            />
                            <Label htmlFor={`wifi-${index}`}>WiFi</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`tv-${index}`}
                              checked={room.has_tv}
                              onCheckedChange={(checked) => updateRoomType(index, "has_tv", checked as boolean)}
                            />
                            <Label htmlFor={`tv-${index}`}>TV</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`balcony-${index}`}
                              checked={room.has_balcony}
                              onCheckedChange={(checked) => updateRoomType(index, "has_balcony", checked as boolean)}
                            />
                            <Label htmlFor={`balcony-${index}`}>Balcony</Label>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Review Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle>Review Your Submission</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold">Property: {formData.name}</h4>
                        <p className="text-sm text-gray-600">{formData.short_description}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold">Location: {formData.area}</h4>
                        <p className="text-sm text-gray-600">{formData.address}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold">Starting Price: ₹{formData.starting_price} per night</h4>
                        <p className="text-sm text-gray-600">{formData.total_rooms} total rooms</p>
                      </div>
                      <div>
                        <h4 className="font-semibold">Amenities: {formData.amenities.length} selected</h4>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {formData.amenities.slice(0, 5).map((amenity) => (
                            <Badge key={amenity} variant="secondary" className="text-xs">
                              {amenity}
                            </Badge>
                          ))}
                          {formData.amenities.length > 5 && (
                            <Badge variant="outline" className="text-xs">
                              +{formData.amenities.length - 5} more
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold">Room Types: {formData.room_types.length}</h4>
                        <p className="text-sm text-gray-600">
                          {formData.room_types
                            .map((room) => room.name)
                            .filter(Boolean)
                            .join(", ")}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
                disabled={currentStep === 1}
              >
                Previous
              </Button>

              {/* Show validation errors */}
              {formErrors.length > 0 && (
                <div className="flex-1 mx-4">
                  <div className="bg-red-50 border border-red-200 rounded p-3">
                    <h4 className="text-red-800 font-medium text-sm mb-1">Please fix the following errors:</h4>
                    <ul className="text-red-700 text-xs space-y-1">
                      {formErrors.map((error, index) => (
                        <li key={index}>• {error}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {currentStep < 4 ? (
                <Button onClick={handleNextStep} className="bg-[#0071C2] hover:bg-[#005999]">
                  Next
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-[#0071C2] hover:bg-[#005999]">
                  {isSubmitting ? "Submitting..." : "Submit for Review"}
                </Button>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
