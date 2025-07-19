"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Building,
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  MapPin,
  Phone,
  Mail,
  Calendar,
} from "lucide-react"
import { supabase } from "@/lib/supabase"

interface PropertySubmission {
  id: string
  name: string
  description: string
  short_description: string
  address: string
  area: string
  phone: string
  email: string
  starting_price: number
  total_rooms: number
  owner_info: {
    name: string
    phone: string
    email: string
  }
  amenities: string[]
  room_types: any[]
  status: string
  submission_date: string
  admin_notes?: string
}

interface DashboardStats {
  totalHotels: number
  pendingSubmissions: number
  totalBookings: number
  totalRevenue: number
}

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loginForm, setLoginForm] = useState({ email: "", password: "" })
  const [stats, setStats] = useState<DashboardStats>({
    totalHotels: 0,
    pendingSubmissions: 0,
    totalBookings: 0,
    totalRevenue: 0,
  })
  const [submissions, setSubmissions] = useState<PropertySubmission[]>([])
  const [selectedSubmission, setSelectedSubmission] = useState<PropertySubmission | null>(null)
  const [adminNotes, setAdminNotes] = useState("")
  const [loading, setLoading] = useState(false)

  const [hotels, setHotels] = useState<any[]>([])
  const [selectedHotel, setSelectedHotel] = useState<any>(null)
  const [editingHotel, setEditingHotel] = useState<any>(null)
  const [hotelFormData, setHotelFormData] = useState<any>({})

  useEffect(() => {
    // Check if already authenticated (simple session check)
    const isAdmin = localStorage.getItem("admin_authenticated")
    if (isAdmin === "true") {
      setIsAuthenticated(true)
      loadDashboardData()
      loadHotels()
    }
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    // Simple admin authentication (in production, use proper auth)
    if (loginForm.email === "admin@yelagiribookings.com" && loginForm.password === "admin123") {
      setIsAuthenticated(true)
      localStorage.setItem("admin_authenticated", "true")
      loadDashboardData()
    } else {
      alert("Invalid credentials")
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem("admin_authenticated")
  }

  const loadDashboardData = async () => {
    setLoading(true)
    try {
      // Load stats
      const [hotelsResult, submissionsResult] = await Promise.all([
        supabase.from("hotels").select("id", { count: "exact", head: true }),
        supabase.from("property_submissions").select("*").order("submission_date", { ascending: false }),
      ])

      const totalHotels = hotelsResult.count || 0
      const pendingSubmissions = submissionsResult.data?.filter((s) => s.status === "pending").length || 0

      setStats({
        totalHotels,
        pendingSubmissions,
        totalBookings: 0, // Would come from bookings table
        totalRevenue: 0, // Would be calculated from bookings
      })

      setSubmissions(submissionsResult.data || [])
    } catch (error) {
      console.error("Error loading dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadHotels = async () => {
    try {
      const { data, error } = await supabase
        .from("hotels")
        .select(`
        *,
        hotel_images (
          id,
          image_url,
          alt_text,
          is_primary
        ),
        hotel_amenities (
          id,
          amenities (
            name,
            icon
          )
        ),
        room_types (
          id,
          name,
          base_price,
          total_rooms,
          available_rooms
        )
      `)
        .order("created_at", { ascending: false })

      if (error) throw error
      setHotels(data || [])
    } catch (error) {
      console.error("Error loading hotels:", error)
    }
  }

  const handleHotelStatusChange = async (hotelId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("hotels")
        .update({
          status: newStatus,
          updated_at: new Date().toISOString(),
        })
        .eq("id", hotelId)

      if (error) throw error

      loadHotels()
      alert(`Hotel status updated to ${newStatus}`)
    } catch (error) {
      console.error("Error updating hotel status:", error)
      alert("Error updating hotel status")
    }
  }

  const handleToggleFeatured = async (hotelId: string, currentFeatured: boolean) => {
    try {
      const { error } = await supabase
        .from("hotels")
        .update({
          is_featured: !currentFeatured,
          updated_at: new Date().toISOString(),
        })
        .eq("id", hotelId)

      if (error) throw error

      loadHotels()
      alert(`Hotel ${!currentFeatured ? "added to" : "removed from"} featured list`)
    } catch (error) {
      console.error("Error updating featured status:", error)
      alert("Error updating featured status")
    }
  }

  const handleDeleteHotel = async (hotelId: string) => {
    if (!confirm("Are you sure you want to delete this hotel? This action cannot be undone.")) {
      return
    }

    try {
      const { error } = await supabase.from("hotels").delete().eq("id", hotelId)

      if (error) throw error

      loadHotels()
      setSelectedHotel(null)
      alert("Hotel deleted successfully")
    } catch (error) {
      console.error("Error deleting hotel:", error)
      alert("Error deleting hotel")
    }
  }

  const startEditingHotel = (hotel: any) => {
    setEditingHotel(hotel)
    setHotelFormData({
      name: hotel.name,
      description: hotel.description,
      short_description: hotel.short_description,
      address: hotel.address,
      area: hotel.area,
      phone: hotel.phone,
      email: hotel.email,
      website: hotel.website || "",
      starting_price: hotel.starting_price.toString(),
      total_rooms: hotel.total_rooms.toString(),
      check_in_time: hotel.check_in_time,
      check_out_time: hotel.check_out_time,
    })
  }

  const handleUpdateHotel = async () => {
    try {
      const { error } = await supabase
        .from("hotels")
        .update({
          name: hotelFormData.name,
          description: hotelFormData.description,
          short_description: hotelFormData.short_description,
          address: hotelFormData.address,
          area: hotelFormData.area,
          phone: hotelFormData.phone,
          email: hotelFormData.email,
          website: hotelFormData.website || null,
          starting_price: Number.parseFloat(hotelFormData.starting_price),
          total_rooms: Number.parseInt(hotelFormData.total_rooms),
          check_in_time: hotelFormData.check_in_time,
          check_out_time: hotelFormData.check_out_time,
          updated_at: new Date().toISOString(),
        })
        .eq("id", editingHotel.id)

      if (error) throw error

      loadHotels()
      setEditingHotel(null)
      setHotelFormData({})
      alert("Hotel updated successfully")
    } catch (error) {
      console.error("Error updating hotel:", error)
      alert("Error updating hotel")
    }
  }

  const handleSubmissionAction = async (submissionId: string, action: "approve" | "reject") => {
    try {
      if (action === "approve") {
        // Move to hotels table
        const submission = submissions.find((s) => s.id === submissionId)
        if (!submission) return

        // Create hotel record
        const hotelData = {
          name: submission.name,
          description: submission.description,
          short_description: submission.short_description,
          address: submission.address,
          area: submission.area,
          phone: submission.phone,
          email: submission.email,
          starting_price: submission.starting_price,
          total_rooms: submission.total_rooms,
          status: "active",
          is_featured: false,
          is_verified: true,
          slug: submission.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, ""),
          average_rating: 0,
          total_reviews: 0,
        }

        const { error: hotelError } = await supabase.from("hotels").insert([hotelData])
        if (hotelError) throw hotelError
      }

      // Update submission status
      const { error } = await supabase
        .from("property_submissions")
        .update({
          status: action === "approve" ? "approved" : "rejected",
          admin_notes: adminNotes,
          reviewed_at: new Date().toISOString(),
        })
        .eq("id", submissionId)

      if (error) throw error

      // Reload data
      loadDashboardData()
      setSelectedSubmission(null)
      setAdminNotes("")

      alert(`Submission ${action}d successfully!`)
    } catch (error) {
      console.error(`Error ${action}ing submission:`, error)
      alert(`Error ${action}ing submission`)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Admin Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="admin@yelagiribookings.com"
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm((prev) => ({ ...prev, password: e.target.value }))}
                  placeholder="Enter password"
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-[#0071C2] hover:bg-[#005999]">
                Login
              </Button>
            </form>
            <div className="mt-4 p-3 bg-blue-50 rounded text-sm text-blue-700">
              <p>
                <strong>Demo Credentials:</strong>
              </p>
              <p>Email: admin@yelagiribookings.com</p>
              <p>Password: admin123</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <Button onClick={handleLogout} variant="outline">
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Building className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Hotels</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalHotels}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending Reviews</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pendingSubmissions}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalBookings}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">₹{stats.totalRevenue.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="submissions" className="space-y-6">
          <TabsList>
            <TabsTrigger value="submissions">Property Submissions</TabsTrigger>
            <TabsTrigger value="hotels">Manage Hotels</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
          </TabsList>

          <TabsContent value="submissions">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Submissions List */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Property Submissions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="text-center py-8">Loading...</div>
                    ) : submissions.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">No submissions found</div>
                    ) : (
                      <div className="space-y-4">
                        {submissions.map((submission) => (
                          <div
                            key={submission.id}
                            className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                              selectedSubmission?.id === submission.id
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                            onClick={() => setSelectedSubmission(submission)}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-semibold text-lg">{submission.name}</h3>
                              <Badge
                                variant={
                                  submission.status === "pending"
                                    ? "default"
                                    : submission.status === "approved"
                                      ? "secondary"
                                      : "destructive"
                                }
                              >
                                {submission.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{submission.short_description}</p>
                            <div className="flex items-center text-sm text-gray-500 space-x-4">
                              <span className="flex items-center">
                                <MapPin className="w-4 h-4 mr-1" />
                                {submission.area}
                              </span>
                              <span className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                {new Date(submission.submission_date).toLocaleDateString()}
                              </span>
                              <span>₹{submission.starting_price.toLocaleString()}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Submission Details */}
              <div>
                {selectedSubmission ? (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Eye className="w-5 h-5 mr-2" />
                        Review Submission
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h3 className="font-semibold text-lg">{selectedSubmission.name}</h3>
                        <p className="text-sm text-gray-600">{selectedSubmission.description}</p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center text-sm">
                          <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                          <span>{selectedSubmission.address}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Phone className="w-4 h-4 mr-2 text-gray-400" />
                          <span>{selectedSubmission.phone}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Mail className="w-4 h-4 mr-2 text-gray-400" />
                          <span>{selectedSubmission.email}</span>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Owner Information</h4>
                        <div className="bg-gray-50 p-3 rounded text-sm">
                          <p>
                            <strong>Name:</strong> {selectedSubmission.owner_info.name}
                          </p>
                          <p>
                            <strong>Phone:</strong> {selectedSubmission.owner_info.phone}
                          </p>
                          <p>
                            <strong>Email:</strong> {selectedSubmission.owner_info.email}
                          </p>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Property Details</h4>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-gray-500">Price:</span>
                            <span className="ml-1 font-medium">
                              ₹{selectedSubmission.starting_price.toLocaleString()}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500">Rooms:</span>
                            <span className="ml-1 font-medium">{selectedSubmission.total_rooms}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Area:</span>
                            <span className="ml-1 font-medium">{selectedSubmission.area}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Amenities</h4>
                        <div className="flex flex-wrap gap-1">
                          {selectedSubmission.amenities.map((amenity, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {amenity}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Room Types</h4>
                        <div className="space-y-2">
                          {selectedSubmission.room_types.map((room, index) => (
                            <div key={index} className="bg-gray-50 p-2 rounded text-sm">
                              <p className="font-medium">{room.name}</p>
                              <p className="text-gray-600">
                                ₹{room.base_price} • {room.max_occupancy} guests
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {selectedSubmission.status === "pending" && (
                        <div className="space-y-3">
                          <div>
                            <Label htmlFor="admin_notes">Admin Notes</Label>
                            <Textarea
                              id="admin_notes"
                              value={adminNotes}
                              onChange={(e) => setAdminNotes(e.target.value)}
                              placeholder="Add notes for this submission..."
                              rows={3}
                            />
                          </div>

                          <div className="flex space-x-2">
                            <Button
                              onClick={() => handleSubmissionAction(selectedSubmission.id, "approve")}
                              className="flex-1 bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Approve
                            </Button>
                            <Button
                              onClick={() => handleSubmissionAction(selectedSubmission.id, "reject")}
                              variant="destructive"
                              className="flex-1"
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              Reject
                            </Button>
                          </div>
                        </div>
                      )}

                      {selectedSubmission.admin_notes && (
                        <div>
                          <h4 className="font-medium mb-2">Admin Notes</h4>
                          <div className="bg-yellow-50 p-3 rounded text-sm">{selectedSubmission.admin_notes}</div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="p-8 text-center text-gray-500">Select a submission to review</CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="hotels">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Hotels List */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Manage Hotels ({hotels.length})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="text-center py-8">Loading hotels...</div>
                    ) : hotels.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">No hotels found</div>
                    ) : (
                      <div className="space-y-4">
                        {hotels.map((hotel) => (
                          <div
                            key={hotel.id}
                            className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                              selectedHotel?.id === hotel.id
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                            onClick={() => setSelectedHotel(hotel)}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-semibold text-lg">{hotel.name}</h3>
                              <div className="flex space-x-2">
                                <Badge
                                  variant={
                                    hotel.status === "active"
                                      ? "secondary"
                                      : hotel.status === "inactive"
                                        ? "outline"
                                        : "destructive"
                                  }
                                >
                                  {hotel.status}
                                </Badge>
                                {hotel.is_featured && <Badge variant="default">Featured</Badge>}
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{hotel.short_description}</p>
                            <div className="flex items-center text-sm text-gray-500 space-x-4">
                              <span className="flex items-center">
                                <MapPin className="w-4 h-4 mr-1" />
                                {hotel.area}
                              </span>
                              <span>₹{hotel.starting_price.toLocaleString()}</span>
                              <span>{hotel.total_rooms} rooms</span>
                              <span>
                                {hotel.average_rating}★ ({hotel.total_reviews})
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Hotel Details/Edit */}
              <div>
                {selectedHotel ? (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>Hotel Details</span>
                        <div className="flex space-x-2">
                          <Button onClick={() => startEditingHotel(selectedHotel)} variant="outline" size="sm">
                            Edit
                          </Button>
                          <Button onClick={() => handleDeleteHotel(selectedHotel.id)} variant="destructive" size="sm">
                            Delete
                          </Button>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {editingHotel?.id === selectedHotel.id ? (
                        // Edit Form
                        <div className="space-y-4">
                          <div>
                            <Label>Hotel Name</Label>
                            <Input
                              value={hotelFormData.name || ""}
                              onChange={(e) => setHotelFormData((prev) => ({ ...prev, name: e.target.value }))}
                            />
                          </div>
                          <div>
                            <Label>Short Description</Label>
                            <Input
                              value={hotelFormData.short_description || ""}
                              onChange={(e) =>
                                setHotelFormData((prev) => ({ ...prev, short_description: e.target.value }))
                              }
                            />
                          </div>
                          <div>
                            <Label>Description</Label>
                            <Textarea
                              value={hotelFormData.description || ""}
                              onChange={(e) => setHotelFormData((prev) => ({ ...prev, description: e.target.value }))}
                              rows={3}
                            />
                          </div>
                          <div>
                            <Label>Address</Label>
                            <Textarea
                              value={hotelFormData.address || ""}
                              onChange={(e) => setHotelFormData((prev) => ({ ...prev, address: e.target.value }))}
                              rows={2}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <Label>Area</Label>
                              <Input
                                value={hotelFormData.area || ""}
                                onChange={(e) => setHotelFormData((prev) => ({ ...prev, area: e.target.value }))}
                              />
                            </div>
                            <div>
                              <Label>Starting Price</Label>
                              <Input
                                type="number"
                                value={hotelFormData.starting_price || ""}
                                onChange={(e) =>
                                  setHotelFormData((prev) => ({ ...prev, starting_price: e.target.value }))
                                }
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <Label>Phone</Label>
                              <Input
                                value={hotelFormData.phone || ""}
                                onChange={(e) => setHotelFormData((prev) => ({ ...prev, phone: e.target.value }))}
                              />
                            </div>
                            <div>
                              <Label>Email</Label>
                              <Input
                                type="email"
                                value={hotelFormData.email || ""}
                                onChange={(e) => setHotelFormData((prev) => ({ ...prev, email: e.target.value }))}
                              />
                            </div>
                          </div>
                          <div>
                            <Label>Website</Label>
                            <Input
                              value={hotelFormData.website || ""}
                              onChange={(e) => setHotelFormData((prev) => ({ ...prev, website: e.target.value }))}
                            />
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <div>
                              <Label>Total Rooms</Label>
                              <Input
                                type="number"
                                value={hotelFormData.total_rooms || ""}
                                onChange={(e) => setHotelFormData((prev) => ({ ...prev, total_rooms: e.target.value }))}
                              />
                            </div>
                            <div>
                              <Label>Check-in</Label>
                              <Input
                                type="time"
                                value={hotelFormData.check_in_time || ""}
                                onChange={(e) =>
                                  setHotelFormData((prev) => ({ ...prev, check_in_time: e.target.value }))
                                }
                              />
                            </div>
                            <div>
                              <Label>Check-out</Label>
                              <Input
                                type="time"
                                value={hotelFormData.check_out_time || ""}
                                onChange={(e) =>
                                  setHotelFormData((prev) => ({ ...prev, check_out_time: e.target.value }))
                                }
                              />
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button onClick={handleUpdateHotel} className="flex-1">
                              Save Changes
                            </Button>
                            <Button
                              onClick={() => {
                                setEditingHotel(null)
                                setHotelFormData({})
                              }}
                              variant="outline"
                              className="flex-1"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        // View Details
                        <div className="space-y-4">
                          <div>
                            <h3 className="font-semibold text-lg">{selectedHotel.name}</h3>
                            <p className="text-sm text-gray-600">{selectedHotel.description}</p>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center text-sm">
                              <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                              <span>{selectedHotel.address}</span>
                            </div>
                            <div className="flex items-center text-sm">
                              <Phone className="w-4 h-4 mr-2 text-gray-400" />
                              <span>{selectedHotel.phone}</span>
                            </div>
                            <div className="flex items-center text-sm">
                              <Mail className="w-4 h-4 mr-2 text-gray-400" />
                              <span>{selectedHotel.email}</span>
                            </div>
                          </div>

                          <div>
                            <h4 className="font-medium mb-2">Hotel Statistics</h4>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>
                                <span className="text-gray-500">Price:</span>
                                <span className="ml-1 font-medium">
                                  ₹{selectedHotel.starting_price.toLocaleString()}
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-500">Rooms:</span>
                                <span className="ml-1 font-medium">{selectedHotel.total_rooms}</span>
                              </div>
                              <div>
                                <span className="text-gray-500">Rating:</span>
                                <span className="ml-1 font-medium">{selectedHotel.average_rating}★</span>
                              </div>
                              <div>
                                <span className="text-gray-500">Reviews:</span>
                                <span className="ml-1 font-medium">{selectedHotel.total_reviews}</span>
                              </div>
                            </div>
                          </div>

                          {selectedHotel.hotel_amenities && selectedHotel.hotel_amenities.length > 0 && (
                            <div>
                              <h4 className="font-medium mb-2">Amenities</h4>
                              <div className="flex flex-wrap gap-1">
                                {selectedHotel.hotel_amenities.map((amenity, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {amenity.amenities.name}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          {selectedHotel.room_types && selectedHotel.room_types.length > 0 && (
                            <div>
                              <h4 className="font-medium mb-2">Room Types</h4>
                              <div className="space-y-2">
                                {selectedHotel.room_types.map((room, index) => (
                                  <div key={index} className="bg-gray-50 p-2 rounded text-sm">
                                    <p className="font-medium">{room.name}</p>
                                    <p className="text-gray-600">
                                      ₹{room.base_price} • {room.available_rooms}/{room.total_rooms} available
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="space-y-3">
                            <div>
                              <Label>Hotel Status</Label>
                              <div className="flex space-x-2 mt-1">
                                <Button
                                  onClick={() => handleHotelStatusChange(selectedHotel.id, "active")}
                                  variant={selectedHotel.status === "active" ? "default" : "outline"}
                                  size="sm"
                                >
                                  Active
                                </Button>
                                <Button
                                  onClick={() => handleHotelStatusChange(selectedHotel.id, "inactive")}
                                  variant={selectedHotel.status === "inactive" ? "default" : "outline"}
                                  size="sm"
                                >
                                  Inactive
                                </Button>
                                <Button
                                  onClick={() => handleHotelStatusChange(selectedHotel.id, "suspended")}
                                  variant={selectedHotel.status === "suspended" ? "destructive" : "outline"}
                                  size="sm"
                                >
                                  Suspended
                                </Button>
                              </div>
                            </div>

                            <div>
                              <Label>Featured Status</Label>
                              <div className="mt-1">
                                <Button
                                  onClick={() => handleToggleFeatured(selectedHotel.id, selectedHotel.is_featured)}
                                  variant={selectedHotel.is_featured ? "default" : "outline"}
                                  size="sm"
                                >
                                  {selectedHotel.is_featured ? "Remove from Featured" : "Add to Featured"}
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="p-8 text-center text-gray-500">Select a hotel to view details</CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="bookings">
            <Card>
              <CardHeader>
                <CardTitle>Bookings Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">Booking management features coming soon...</div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
