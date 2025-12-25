"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { X, Plus, Building, MapPin, Star, Home } from "lucide-react"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"

interface PropertyFormData {
  // Basic Information
  name: string
  description: string
  short_description: string
  category: string

  // Location
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

  // Individual Rooms
  individual_rooms: IndividualRoom[]

  // Food Delivery Details
  food_delivery_details: string
}

interface IndividualRoom {
  id: string
  room_name: string
  floor: string
  room_type: string // 'single', 'double', 'suite', etc.
  max_occupancy: string
  base_price: string

  // Toilet facilities
  has_attached_toilet: boolean
  toilet_count: string

  // Furniture & Bedding
  bed_type: string // 'single', 'double', 'queen', 'king'
  has_mattress: boolean
  has_cupboard: boolean

  // Electrical & Comfort
  has_ac: boolean
  has_ceiling_fan: boolean
  has_balcony_access: boolean

  // Additional amenities
  room_amenities: string[]
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
    if (formData.individual_rooms.length === 0) errors.push("At least one room must be added")
    formData.individual_rooms.forEach((room, index) => {
      if (!room.room_name.trim()) errors.push(`Room ${index + 1}: Room name is required`)
      if (!room.base_price || Number.parseFloat(room.base_price) <= 0)
        errors.push(`Room ${index + 1}: Valid price is required`)
      if (!room.floor.trim()) errors.push(`Room ${index + 1}: Floor is required`)
      if (!room.toilet_count || Number.parseInt(room.toilet_count) <= 0)
        errors.push(`Room ${index + 1}: Valid toilet count is required`)
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
  { value: "family", label: "Family Resort" },
  { value: "eco", label: "Eco Resort" },
  { value: "homestay", label: "Family Home" },
]

const ROOM_TYPES = [
  { value: "single", label: "Single Room" },
  { value: "double", label: "Double Room" },
  { value: "deluxe", label: "Deluxe Room" },
  { value: "suite", label: "Suite" },
  { value: "family", label: "Family Room" },
]

const BED_TYPES = ["Single", "Double", "Queen", "King", "Twin"]

const ROOM_AMENITIES = [
  "WiFi",
  "TV",
  "Mini Fridge",
  "Tea/Coffee Maker",
  "Room Service",
  "Laundry Service",
  "Iron/Ironing Board",
  "Hair Dryer",
  "Safe",
  "Telephone",
  "Desk/Work Area",
  "Sofa/Seating Area",
]

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
    individual_rooms: [],
    food_delivery_details: "",
  })

  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [formErrors, setFormErrors] = useState<string[]>([])
  const [showRoomDialog, setShowRoomDialog] = useState(false)
  const [editingRoomIndex, setEditingRoomIndex] = useState<number | null>(null)

  // Auto-fill owner info
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        setFormData(prev => ({
          ...prev,
          owner_name: session.user.user_metadata?.full_name || "",
          owner_email: session.user.email || "",
        }))
      }
    }
    fetchUser()
  }, [])

  const [currentRoom, setCurrentRoom] = useState<IndividualRoom>({
    id: "",
    room_name: "",
    floor: "",
    room_type: "double",
    max_occupancy: "2",
    base_price: "",
    has_attached_toilet: true,
    toilet_count: "1",
    bed_type: "Double",
    has_mattress: true,
    has_cupboard: true,
    has_ac: false,
    has_ceiling_fan: true,
    has_balcony_access: false,
    room_amenities: [],
  })

  const handleInputChange = (field: keyof PropertyFormData, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleRoomInputChange = (field: keyof IndividualRoom, value: string | boolean | string[]) => {
    setCurrentRoom((prev) => ({ ...prev, [field]: value }))
  }

  const handleRoomAmenityToggle = (amenity: string) => {
    setCurrentRoom((prev) => ({
      ...prev,
      room_amenities: prev.room_amenities.includes(amenity)
        ? prev.room_amenities.filter((a) => a !== amenity)
        : [...prev.room_amenities, amenity],
    }))
  }

  const openRoomDialog = (index?: number) => {
    if (index !== undefined) {
      setEditingRoomIndex(index)
      setCurrentRoom(formData.individual_rooms[index])
    } else {
      setEditingRoomIndex(null)
      setCurrentRoom({
        id: Date.now().toString(),
        room_name: "",
        floor: "",
        room_type: "double",
        max_occupancy: "2",
        base_price: "",
        has_attached_toilet: true,
        toilet_count: "1",
        bed_type: "Double",
        has_mattress: true,
        has_cupboard: true,
        has_ac: false,
        has_ceiling_fan: true,
        has_balcony_access: false,
        room_amenities: [],
      })
    }
    setShowRoomDialog(true)
  }

  const saveRoom = () => {
    if (!currentRoom.room_name.trim() || !currentRoom.base_price || !currentRoom.floor.trim()) {
      alert("Please fill in all required fields")
      return
    }

    setFormData((prev) => {
      const newRooms = [...prev.individual_rooms]
      if (editingRoomIndex !== null) {
        newRooms[editingRoomIndex] = currentRoom
      } else {
        newRooms.push(currentRoom)
      }
      return { ...prev, individual_rooms: newRooms }
    })

    setShowRoomDialog(false)
    setEditingRoomIndex(null)
  }

  const removeRoom = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      individual_rooms: prev.individual_rooms.filter((_, i) => i !== index),
    }))
  }

  // Calculate general amenities from individual rooms
  const getGeneralAmenities = () => {
    const amenities = new Set<string>()

    formData.individual_rooms.forEach((room) => {
      if (room.has_ac) amenities.add("Air Conditioning")
      if (room.has_ceiling_fan) amenities.add("Ceiling Fan")
      if (room.has_balcony_access) amenities.add("Balcony Access")
      if (room.has_attached_toilet) amenities.add("Attached Bathroom")
      if (room.has_cupboard) amenities.add("Cupboard/Wardrobe")

      room.room_amenities.forEach((amenity) => amenities.add(amenity))
    })

    return Array.from(amenities)
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      // Calculate general amenities from rooms
      const generalAmenities = getGeneralAmenities()

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
        total_rooms: formData.individual_rooms.length, // Use actual room count
        check_in_time: formData.check_in_time,
        check_out_time: formData.check_out_time,
        status: "pending",
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
        amenities: generalAmenities, // Auto-calculated from rooms
        individual_rooms: formData.individual_rooms,
        submission_date: new Date().toISOString(),
        food_delivery_details: formData.food_delivery_details,
      }

      // Remove .select() to avoid RLS policy errors if user cannot read their own submission immediately
      const { error } = await supabase.from("property_submissions").insert([propertyData])

      if (error) {
        throw error
      }

      setSubmitSuccess(true)
    } catch (error: any) {
      console.error("Error submitting property:", error)
      alert(`Error submitting property: ${error.message || "Unknown error"}. Please try again.`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleNextStep = () => {
    const errors = validateForm(currentStep, formData)
    if (errors.length > 0) {
      setFormErrors(errors)
      window.scrollTo({ top: 0, behavior: "smooth" })
      return
    }
    setFormErrors([])
    setCurrentStep((prev) => Math.min(4, prev + 1))
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  if (submitSuccess) {
    return (
      <div className="flex flex-col min-h-screen">
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
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
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
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${currentStep >= step ? "bg-[#0071C2] text-white" : "bg-gray-300 text-gray-600"
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
                      ? "Additional Features"
                      : "Individual Rooms & Review"}
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
                      <Label htmlFor="total_rooms">Expected Total Rooms *</Label>
                      <Input
                        id="total_rooms"
                        type="number"
                        value={formData.total_rooms}
                        onChange={(e) => handleInputChange("total_rooms", e.target.value)}
                        placeholder="10"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        This will be updated based on individual rooms you add later
                      </p>
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
                  <CardTitle>Additional Features</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
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

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">About Individual Room Management</h4>
                    <p className="text-sm text-blue-700">
                      In the next step, you'll add individual rooms one by one. Each room can have its own amenities,
                      pricing, and features. The general hotel amenities will be automatically calculated based on
                      what's available across all your rooms.
                    </p>
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
                        <Home className="w-5 h-5 mr-2" />
                        Individual Rooms ({formData.individual_rooms.length})
                      </span>
                      <Button onClick={() => openRoomDialog()} variant="outline" size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Room
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {formData.individual_rooms.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <Home className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p>No rooms added yet. Click "Add Room" to start adding individual rooms.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {formData.individual_rooms.map((room, index) => (
                          <div key={room.id} className="border rounded-lg p-4">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h4 className="font-semibold text-lg">{room.room_name}</h4>
                                <p className="text-sm text-gray-600">
                                  Floor {room.floor} • {room.room_type} • ₹{room.base_price}/night
                                </p>
                              </div>
                              <div className="flex space-x-2">
                                <Button onClick={() => openRoomDialog(index)} variant="outline" size="sm">
                                  Edit
                                </Button>
                                <Button onClick={() => removeRoom(index)} variant="destructive" size="sm">
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className="text-gray-500">Occupancy:</span>
                                <span className="ml-1 font-medium">{room.max_occupancy} guests</span>
                              </div>
                              <div>
                                <span className="text-gray-500">Bed:</span>
                                <span className="ml-1 font-medium">{room.bed_type}</span>
                              </div>
                              <div>
                                <span className="text-gray-500">Toilet:</span>
                                <span className="ml-1 font-medium">
                                  {room.has_attached_toilet ? "Attached" : "Common"} ({room.toilet_count})
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-500">AC:</span>
                                <span className="ml-1 font-medium">{room.has_ac ? "Yes" : "No"}</span>
                              </div>
                            </div>

                            <div className="mt-3">
                              <div className="flex flex-wrap gap-1">
                                {room.has_mattress && (
                                  <Badge variant="outline" className="text-xs">
                                    Mattress
                                  </Badge>
                                )}
                                {room.has_cupboard && (
                                  <Badge variant="outline" className="text-xs">
                                    Cupboard
                                  </Badge>
                                )}
                                {room.has_ceiling_fan && (
                                  <Badge variant="outline" className="text-xs">
                                    Ceiling Fan
                                  </Badge>
                                )}
                                {room.has_balcony_access && (
                                  <Badge variant="outline" className="text-xs">
                                    Balcony
                                  </Badge>
                                )}
                                {room.room_amenities.map((amenity) => (
                                  <Badge key={amenity} variant="outline" className="text-xs">
                                    {amenity}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Auto-calculated General Amenities */}
                {formData.individual_rooms.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Auto-Calculated General Amenities</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-3">
                        These amenities are automatically calculated based on your individual rooms:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {getGeneralAmenities().map((amenity) => (
                          <Badge key={amenity} variant="secondary" className="text-sm">
                            {amenity}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

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
                        <p className="text-sm text-gray-600">
                          {formData.individual_rooms.length} individual rooms added
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold">General Amenities: {getGeneralAmenities().length} calculated</h4>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {getGeneralAmenities()
                            .slice(0, 5)
                            .map((amenity) => (
                              <Badge key={amenity} variant="secondary" className="text-xs">
                                {amenity}
                              </Badge>
                            ))}
                          {getGeneralAmenities().length > 5 && (
                            <Badge variant="outline" className="text-xs">
                              +{getGeneralAmenities().length - 5} more
                            </Badge>
                          )}
                        </div>
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

      {/* Room Management Dialog */}
      <Dialog open={showRoomDialog} onOpenChange={setShowRoomDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingRoomIndex !== null ? "Edit Room" : "Add New Room"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Basic Room Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="room_name">Room Name *</Label>
                <Input
                  id="room_name"
                  value={currentRoom.room_name}
                  onChange={(e) => handleRoomInputChange("room_name", e.target.value)}
                  placeholder="e.g., Deluxe Room 101"
                />
              </div>
              <div>
                <Label htmlFor="floor">Floor *</Label>
                <Input
                  id="floor"
                  value={currentRoom.floor}
                  onChange={(e) => handleRoomInputChange("floor", e.target.value)}
                  placeholder="e.g., Ground Floor, 1st Floor, 2nd Floor"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="room_type">Room Type</Label>
                <Select
                  value={currentRoom.room_type}
                  onValueChange={(value) => handleRoomInputChange("room_type", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ROOM_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="max_occupancy">Max Occupancy</Label>
                <Input
                  id="max_occupancy"
                  type="number"
                  min="1"
                  max="10"
                  value={currentRoom.max_occupancy}
                  onChange={(e) => handleRoomInputChange("max_occupancy", e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="base_price">Price per Night (₹) *</Label>
              <Input
                id="base_price"
                type="number"
                value={currentRoom.base_price}
                onChange={(e) => handleRoomInputChange("base_price", e.target.value)}
                placeholder="1500"
              />
            </div>

            {/* Toilet Facilities */}
            <div className="border-t pt-4">
              <h4 className="font-medium mb-3">Toilet Facilities</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="has_attached_toilet"
                    checked={currentRoom.has_attached_toilet}
                    onCheckedChange={(checked) => handleRoomInputChange("has_attached_toilet", checked as boolean)}
                  />
                  <Label htmlFor="has_attached_toilet">Attached Toilet</Label>
                </div>
                <div>
                  <Label htmlFor="toilet_count">Number of Toilets</Label>
                  <Input
                    id="toilet_count"
                    type="number"
                    min="1"
                    value={currentRoom.toilet_count}
                    onChange={(e) => handleRoomInputChange("toilet_count", e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Furniture & Bedding */}
            <div className="border-t pt-4">
              <h4 className="font-medium mb-3">Furniture & Bedding</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <Label htmlFor="bed_type">Bed Type</Label>
                  <Select
                    value={currentRoom.bed_type}
                    onValueChange={(value) => handleRoomInputChange("bed_type", value)}
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
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="has_mattress"
                    checked={currentRoom.has_mattress}
                    onCheckedChange={(checked) => handleRoomInputChange("has_mattress", checked as boolean)}
                  />
                  <Label htmlFor="has_mattress">Mattress</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="has_cupboard"
                    checked={currentRoom.has_cupboard}
                    onCheckedChange={(checked) => handleRoomInputChange("has_cupboard", checked as boolean)}
                  />
                  <Label htmlFor="has_cupboard">Cupboard/Wardrobe</Label>
                </div>
              </div>
            </div>

            {/* Electrical & Comfort */}
            <div className="border-t pt-4">
              <h4 className="font-medium mb-3">Electrical & Comfort</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="has_ac"
                    checked={currentRoom.has_ac}
                    onCheckedChange={(checked) => handleRoomInputChange("has_ac", checked as boolean)}
                  />
                  <Label htmlFor="has_ac">Air Conditioning</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="has_ceiling_fan"
                    checked={currentRoom.has_ceiling_fan}
                    onCheckedChange={(checked) => handleRoomInputChange("has_ceiling_fan", checked as boolean)}
                  />
                  <Label htmlFor="has_ceiling_fan">Ceiling Fan</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="has_balcony_access"
                    checked={currentRoom.has_balcony_access}
                    onCheckedChange={(checked) => handleRoomInputChange("has_balcony_access", checked as boolean)}
                  />
                  <Label htmlFor="has_balcony_access">Balcony Access</Label>
                </div>
              </div>
            </div>

            {/* Additional Room Amenities */}
            <div className="border-t pt-4">
              <h4 className="font-medium mb-3">Additional Room Amenities</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {ROOM_AMENITIES.map((amenity) => (
                  <div key={amenity} className="flex items-center space-x-2">
                    <Checkbox
                      id={`room-amenity-${amenity}`}
                      checked={currentRoom.room_amenities.includes(amenity)}
                      onCheckedChange={() => handleRoomAmenityToggle(amenity)}
                    />
                    <Label htmlFor={`room-amenity-${amenity}`} className="text-sm">
                      {amenity}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setShowRoomDialog(false)}>
                Cancel
              </Button>
              <Button onClick={saveRoom}>{editingRoomIndex !== null ? "Update Room" : "Add Room"}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
