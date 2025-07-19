"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  HotelIcon,
  UsersIcon,
  FileTextIcon,
  StarIcon,
  MapPinIcon,
  PhoneIcon,
  MailIcon,
  EditIcon,
  PlusIcon,
  CheckIcon,
  XIcon,
  EyeIcon,
} from "lucide-react"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"

interface PropertySubmission {
  id: string
  name: string
  short_description: string
  address: string
  area: string
  phone: string
  email: string
  starting_price: number
  total_rooms: number
  status: string
  amenities: string[]
  individual_rooms: any[]
  owner_info: {
    name: string
    phone: string
    email: string
  }
  submission_date: string
}

interface Hotel {
  id: string
  name: string
  short_description: string
  address: string
  area: string
  phone: string
  email: string
  starting_price: number
  total_rooms: number
  status: string
  amenities: string[]
  is_featured: boolean
  is_verified: boolean
  created_at: string
}

interface Amenity {
  id: string
  name: string
  icon: string
  category: string
  is_active: boolean
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("submissions")
  const [submissions, setSubmissions] = useState<PropertySubmission[]>([])
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [amenities, setAmenities] = useState<Amenity[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSubmission, setSelectedSubmission] = useState<PropertySubmission | null>(null)
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null)
  const [showSubmissionDialog, setShowSubmissionDialog] = useState(false)
  const [showHotelDialog, setShowHotelDialog] = useState(false)
  const [showAmenityDialog, setShowAmenityDialog] = useState(false)
  const [newAmenity, setNewAmenity] = useState({ name: "", icon: "", category: "general" })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      // Fetch property submissions
      const { data: submissionsData, error: submissionsError } = await supabase
        .from("property_submissions")
        .select("*")
        .order("submission_date", { ascending: false })

      if (submissionsError) {
        console.error("Error fetching submissions:", submissionsError)
      } else {
        setSubmissions(submissionsData || [])
      }

      // Fetch hotels
      const { data: hotelsData, error: hotelsError } = await supabase
        .from("hotels")
        .select("*")
        .order("created_at", { ascending: false })

      if (hotelsError) {
        console.error("Error fetching hotels:", hotelsError)
      } else {
        setHotels(hotelsData || [])
      }

      // Fetch amenities
      const { data: amenitiesData, error: amenitiesError } = await supabase
        .from("amenities")
        .select("*")
        .order("category", { ascending: true })

      if (amenitiesError) {
        console.error("Error fetching amenities:", amenitiesError)
      } else {
        setAmenities(amenitiesData || [])
      }
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  const approveSubmission = async (submission: PropertySubmission) => {
    try {
      // Create hotel from submission
      const hotelData = {
        name: submission.name,
        short_description: submission.short_description,
        description: submission.short_description, // You might want to add a full description field
        address: submission.address,
        area: submission.area,
        phone: submission.phone,
        email: submission.email,
        starting_price: submission.starting_price,
        total_rooms: submission.individual_rooms?.length || submission.total_rooms,
        status: "active",
        amenities: submission.amenities || [],
        is_featured: false,
        is_verified: true,
        slug: submission.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, ""),
        category: "hotel", // Default category
        latitude: null,
        longitude: null,
        check_in_time: "14:00",
        check_out_time: "11:00",
      }

      const { data: hotel, error: hotelError } = await supabase.from("hotels").insert([hotelData]).select().single()

      if (hotelError) {
        console.error("Error creating hotel:", hotelError)
        alert("Error approving submission")
        return
      }

      // Create individual rooms if they exist
      if (submission.individual_rooms && submission.individual_rooms.length > 0) {
        const roomsData = submission.individual_rooms.map((room) => ({
          hotel_id: hotel.id,
          submission_id: submission.id,
          room_name: room.room_name,
          floor: room.floor,
          room_type: room.room_type,
          max_occupancy: Number.parseInt(room.max_occupancy),
          base_price: Number.parseFloat(room.base_price),
          has_attached_toilet: room.has_attached_toilet,
          toilet_count: Number.parseInt(room.toilet_count),
          bed_type: room.bed_type,
          has_mattress: room.has_mattress,
          has_cupboard: room.has_cupboard,
          has_ac: room.has_ac,
          has_ceiling_fan: room.has_ceiling_fan,
          has_balcony_access: room.has_balcony_access,
          room_amenities: room.room_amenities || [],
        }))

        const { error: roomsError } = await supabase.from("individual_rooms").insert(roomsData)

        if (roomsError) {
          console.error("Error creating rooms:", roomsError)
        }
      }

      // Update submission status
      const { error: updateError } = await supabase
        .from("property_submissions")
        .update({ status: "approved" })
        .eq("id", submission.id)

      if (updateError) {
        console.error("Error updating submission:", updateError)
      }

      alert("Submission approved successfully!")
      fetchData()
    } catch (error) {
      console.error("Error approving submission:", error)
      alert("Error approving submission")
    }
  }

  const rejectSubmission = async (submissionId: string) => {
    try {
      const { error } = await supabase
        .from("property_submissions")
        .update({ status: "rejected" })
        .eq("id", submissionId)

      if (error) {
        console.error("Error rejecting submission:", error)
        alert("Error rejecting submission")
        return
      }

      alert("Submission rejected")
      fetchData()
    } catch (error) {
      console.error("Error rejecting submission:", error)
      alert("Error rejecting submission")
    }
  }

  const updateHotelAmenities = async (hotelId: string, amenities: string[]) => {
    try {
      const { error } = await supabase.from("hotels").update({ amenities }).eq("id", hotelId)

      if (error) {
        console.error("Error updating hotel amenities:", error)
        alert("Error updating amenities")
        return
      }

      alert("Hotel amenities updated successfully!")
      fetchData()
      setShowHotelDialog(false)
    } catch (error) {
      console.error("Error updating hotel amenities:", error)
      alert("Error updating amenities")
    }
  }

  const addAmenity = async () => {
    if (!newAmenity.name.trim()) {
      alert("Please enter amenity name")
      return
    }

    try {
      const { error } = await supabase.from("amenities").insert([
        {
          name: newAmenity.name,
          icon: newAmenity.icon || "star",
          category: newAmenity.category,
        },
      ])

      if (error) {
        console.error("Error adding amenity:", error)
        alert("Error adding amenity")
        return
      }

      alert("Amenity added successfully!")
      setNewAmenity({ name: "", icon: "", category: "general" })
      setShowAmenityDialog(false)
      fetchData()
    } catch (error) {
      console.error("Error adding amenity:", error)
      alert("Error adding amenity")
    }
  }

  const toggleAmenityStatus = async (amenityId: string, isActive: boolean) => {
    try {
      const { error } = await supabase.from("amenities").update({ is_active: !isActive }).eq("id", amenityId)

      if (error) {
        console.error("Error updating amenity status:", error)
        alert("Error updating amenity status")
        return
      }

      fetchData()
    } catch (error) {
      console.error("Error updating amenity status:", error)
      alert("Error updating amenity status")
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0071C2] mx-auto mb-4"></div>
            <p>Loading admin dashboard...</p>
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
        <section className="bg-[#003580] text-white py-8">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-lg opacity-90">Manage properties, submissions, and system settings</p>
          </div>
        </section>

        {/* Dashboard Content */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="submissions" className="flex items-center">
                  <FileTextIcon className="w-4 h-4 mr-2" />
                  Submissions ({submissions.filter((s) => s.status === "pending").length})
                </TabsTrigger>
                <TabsTrigger value="hotels" className="flex items-center">
                  <HotelIcon className="w-4 h-4 mr-2" />
                  Hotels ({hotels.length})
                </TabsTrigger>
                <TabsTrigger value="amenities" className="flex items-center">
                  <StarIcon className="w-4 h-4 mr-2" />
                  Amenities ({amenities.length})
                </TabsTrigger>
                <TabsTrigger value="users" className="flex items-center">
                  <UsersIcon className="w-4 h-4 mr-2" />
                  Users
                </TabsTrigger>
              </TabsList>

              {/* Property Submissions Tab */}
              <TabsContent value="submissions" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Property Submissions</h2>
                </div>

                <div className="grid gap-6">
                  {submissions
                    .filter((s) => s.status === "pending")
                    .map((submission) => (
                      <Card key={submission.id}>
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="flex items-center">
                                <HotelIcon className="w-5 h-5 mr-2" />
                                {submission.name}
                              </CardTitle>
                              <p className="text-gray-600 mt-1">{submission.short_description}</p>
                            </div>
                            <Badge variant={submission.status === "pending" ? "default" : "secondary"}>
                              {submission.status}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div className="space-y-2">
                              <div className="flex items-center text-sm">
                                <MapPinIcon className="w-4 h-4 mr-2 text-gray-500" />
                                {submission.address}, {submission.area}
                              </div>
                              <div className="flex items-center text-sm">
                                <PhoneIcon className="w-4 h-4 mr-2 text-gray-500" />
                                {submission.phone}
                              </div>
                              <div className="flex items-center text-sm">
                                <MailIcon className="w-4 h-4 mr-2 text-gray-500" />
                                {submission.email}
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="text-sm">
                                <span className="font-medium">Starting Price:</span> ₹{submission.starting_price}/night
                              </div>
                              <div className="text-sm">
                                <span className="font-medium">Total Rooms:</span>{" "}
                                {submission.individual_rooms?.length || submission.total_rooms}
                              </div>
                              <div className="text-sm">
                                <span className="font-medium">Owner:</span> {submission.owner_info?.name}
                              </div>
                            </div>
                          </div>

                          {submission.amenities && submission.amenities.length > 0 && (
                            <div className="mb-4">
                              <h4 className="font-medium mb-2">Amenities:</h4>
                              <div className="flex flex-wrap gap-1">
                                {submission.amenities.map((amenity) => (
                                  <Badge key={amenity} variant="outline" className="text-xs">
                                    {amenity}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          {submission.individual_rooms && submission.individual_rooms.length > 0 && (
                            <div className="mb-4">
                              <h4 className="font-medium mb-2">
                                Individual Rooms ({submission.individual_rooms.length}):
                              </h4>
                              <div className="space-y-2">
                                {submission.individual_rooms.slice(0, 3).map((room, index) => (
                                  <div key={index} className="text-sm bg-gray-50 p-2 rounded">
                                    <span className="font-medium">{room.room_name}</span> - Floor {room.floor}, ₹
                                    {room.base_price}/night,
                                    {room.has_ac ? " AC," : ""}
                                    {room.has_attached_toilet ? " Attached Toilet" : " Common Toilet"}
                                  </div>
                                ))}
                                {submission.individual_rooms.length > 3 && (
                                  <div className="text-sm text-gray-500">
                                    +{submission.individual_rooms.length - 3} more rooms
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          <div className="flex space-x-2">
                            <Button
                              onClick={() => {
                                setSelectedSubmission(submission)
                                setShowSubmissionDialog(true)
                              }}
                              variant="outline"
                              size="sm"
                            >
                              <EyeIcon className="w-4 h-4 mr-2" />
                              View Details
                            </Button>
                            <Button
                              onClick={() => approveSubmission(submission)}
                              className="bg-green-600 hover:bg-green-700"
                              size="sm"
                            >
                              <CheckIcon className="w-4 h-4 mr-2" />
                              Approve
                            </Button>
                            <Button onClick={() => rejectSubmission(submission.id)} variant="destructive" size="sm">
                              <XIcon className="w-4 h-4 mr-2" />
                              Reject
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}

                  {submissions.filter((s) => s.status === "pending").length === 0 && (
                    <Card>
                      <CardContent className="text-center py-8">
                        <FileTextIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p className="text-gray-500">No pending submissions</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>

              {/* Hotels Tab */}
              <TabsContent value="hotels" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Manage Hotels</h2>
                </div>

                <div className="grid gap-4">
                  {hotels.map((hotel) => (
                    <Card key={hotel.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="flex items-center">
                              <HotelIcon className="w-5 h-5 mr-2" />
                              {hotel.name}
                            </CardTitle>
                            <p className="text-gray-600 mt-1">{hotel.short_description}</p>
                          </div>
                          <div className="flex space-x-2">
                            <Badge variant={hotel.status === "active" ? "default" : "secondary"}>{hotel.status}</Badge>
                            {hotel.is_featured && <Badge variant="outline">Featured</Badge>}
                            {hotel.is_verified && <Badge className="bg-green-100 text-green-800">Verified</Badge>}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="space-y-2">
                            <div className="flex items-center text-sm">
                              <MapPinIcon className="w-4 h-4 mr-2 text-gray-500" />
                              {hotel.address}, {hotel.area}
                            </div>
                            <div className="flex items-center text-sm">
                              <PhoneIcon className="w-4 h-4 mr-2 text-gray-500" />
                              {hotel.phone}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="text-sm">
                              <span className="font-medium">Starting Price:</span> ₹{hotel.starting_price}/night
                            </div>
                            <div className="text-sm">
                              <span className="font-medium">Total Rooms:</span> {hotel.total_rooms}
                            </div>
                          </div>
                        </div>

                        {hotel.amenities && hotel.amenities.length > 0 && (
                          <div className="mb-4">
                            <h4 className="font-medium mb-2">Current Amenities ({hotel.amenities.length}):</h4>
                            <div className="flex flex-wrap gap-1">
                              {hotel.amenities.map((amenity) => (
                                <Badge key={amenity} variant="outline" className="text-xs">
                                  {amenity}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="flex space-x-2">
                          <Button
                            onClick={() => {
                              setSelectedHotel(hotel)
                              setShowHotelDialog(true)
                            }}
                            variant="outline"
                            size="sm"
                          >
                            <EditIcon className="w-4 h-4 mr-2" />
                            Edit Amenities
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {hotels.length === 0 && (
                    <Card>
                      <CardContent className="text-center py-8">
                        <HotelIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p className="text-gray-500">No hotels found</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>

              {/* Amenities Tab */}
              <TabsContent value="amenities" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Manage Amenities</h2>
                  <Button onClick={() => setShowAmenityDialog(true)}>
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Add Amenity
                  </Button>
                </div>

                <Card>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Icon</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {amenities.map((amenity) => (
                          <TableRow key={amenity.id}>
                            <TableCell className="font-medium">{amenity.name}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{amenity.category}</Badge>
                            </TableCell>
                            <TableCell>{amenity.icon}</TableCell>
                            <TableCell>
                              <Badge variant={amenity.is_active ? "default" : "secondary"}>
                                {amenity.is_active ? "Active" : "Inactive"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button
                                onClick={() => toggleAmenityStatus(amenity.id, amenity.is_active)}
                                variant="outline"
                                size="sm"
                              >
                                {amenity.is_active ? "Deactivate" : "Activate"}
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Users Tab */}
              <TabsContent value="users" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">User Management</h2>
                </div>
                <Card>
                  <CardContent className="text-center py-8">
                    <UsersIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-500">User management features coming soon</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
      <Footer />

      {/* Submission Details Dialog */}
      <Dialog open={showSubmissionDialog} onOpenChange={setShowSubmissionDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Submission Details</DialogTitle>
          </DialogHeader>
          {selectedSubmission && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Property Information</h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium">Name:</span> {selectedSubmission.name}
                    </div>
                    <div>
                      <span className="font-medium">Description:</span> {selectedSubmission.short_description}
                    </div>
                    <div>
                      <span className="font-medium">Address:</span> {selectedSubmission.address}
                    </div>
                    <div>
                      <span className="font-medium">Area:</span> {selectedSubmission.area}
                    </div>
                    <div>
                      <span className="font-medium">Phone:</span> {selectedSubmission.phone}
                    </div>
                    <div>
                      <span className="font-medium">Email:</span> {selectedSubmission.email}
                    </div>
                    <div>
                      <span className="font-medium">Starting Price:</span> ₹{selectedSubmission.starting_price}/night
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Owner Information</h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium">Name:</span> {selectedSubmission.owner_info?.name}
                    </div>
                    <div>
                      <span className="font-medium">Phone:</span> {selectedSubmission.owner_info?.phone}
                    </div>
                    <div>
                      <span className="font-medium">Email:</span> {selectedSubmission.owner_info?.email}
                    </div>
                    <div>
                      <span className="font-medium">Submitted:</span>{" "}
                      {new Date(selectedSubmission.submission_date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>

              {selectedSubmission.individual_rooms && selectedSubmission.individual_rooms.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">
                    Individual Rooms ({selectedSubmission.individual_rooms.length})
                  </h3>
                  <div className="space-y-3">
                    {selectedSubmission.individual_rooms.map((room, index) => (
                      <div key={index} className="border rounded p-3">
                        <div className="font-medium">{room.room_name}</div>
                        <div className="text-sm text-gray-600 mt-1">
                          Floor {room.floor} • {room.room_type} • ₹{room.base_price}/night • Max {room.max_occupancy}{" "}
                          guests • {room.bed_type} bed
                        </div>
                        <div className="text-sm mt-2">
                          <span className="font-medium">Features:</span>
                          {room.has_ac && " AC,"}
                          {room.has_ceiling_fan && " Ceiling Fan,"}
                          {room.has_attached_toilet && " Attached Toilet,"}
                          {room.has_cupboard && " Cupboard,"}
                          {room.has_balcony_access && " Balcony"}
                        </div>
                        {room.room_amenities && room.room_amenities.length > 0 && (
                          <div className="mt-2">
                            <div className="flex flex-wrap gap-1">
                              {room.room_amenities.map((amenity: string) => (
                                <Badge key={amenity} variant="outline" className="text-xs">
                                  {amenity}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowSubmissionDialog(false)}>
                  Close
                </Button>
                <Button
                  onClick={() => {
                    approveSubmission(selectedSubmission)
                    setShowSubmissionDialog(false)
                  }}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckIcon className="w-4 h-4 mr-2" />
                  Approve
                </Button>
                <Button
                  onClick={() => {
                    rejectSubmission(selectedSubmission.id)
                    setShowSubmissionDialog(false)
                  }}
                  variant="destructive"
                >
                  <XIcon className="w-4 h-4 mr-2" />
                  Reject
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Hotel Amenities Edit Dialog */}
      <Dialog open={showHotelDialog} onOpenChange={setShowHotelDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Hotel Amenities - {selectedHotel?.name}</DialogTitle>
          </DialogHeader>
          {selectedHotel && (
            <HotelAmenitiesEditor
              hotel={selectedHotel}
              amenities={amenities}
              onSave={(amenities) => updateHotelAmenities(selectedHotel.id, amenities)}
              onCancel={() => setShowHotelDialog(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Add Amenity Dialog */}
      <Dialog open={showAmenityDialog} onOpenChange={setShowAmenityDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Amenity</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="amenity-name">Amenity Name</Label>
              <Input
                id="amenity-name"
                value={newAmenity.name}
                onChange={(e) => setNewAmenity((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Enter amenity name"
              />
            </div>
            <div>
              <Label htmlFor="amenity-icon">Icon (optional)</Label>
              <Input
                id="amenity-icon"
                value={newAmenity.icon}
                onChange={(e) => setNewAmenity((prev) => ({ ...prev, icon: e.target.value }))}
                placeholder="e.g., wifi, car, pool"
              />
            </div>
            <div>
              <Label htmlFor="amenity-category">Category</Label>
              <Select
                value={newAmenity.category}
                onValueChange={(value) => setNewAmenity((prev) => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="comfort">Comfort</SelectItem>
                  <SelectItem value="connectivity">Connectivity</SelectItem>
                  <SelectItem value="recreation">Recreation</SelectItem>
                  <SelectItem value="dining">Dining</SelectItem>
                  <SelectItem value="parking">Parking</SelectItem>
                  <SelectItem value="wellness">Wellness</SelectItem>
                  <SelectItem value="fitness">Fitness</SelectItem>
                  <SelectItem value="service">Service</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="family">Family</SelectItem>
                  <SelectItem value="outdoor">Outdoor</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowAmenityDialog(false)}>
                Cancel
              </Button>
              <Button onClick={addAmenity}>Add Amenity</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Hotel Amenities Editor Component
function HotelAmenitiesEditor({
  hotel,
  amenities,
  onSave,
  onCancel,
}: {
  hotel: Hotel
  amenities: Amenity[]
  onSave: (amenities: string[]) => void
  onCancel: () => void
}) {
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(hotel.amenities || [])

  const toggleAmenity = (amenityName: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenityName) ? prev.filter((a) => a !== amenityName) : [...prev, amenityName],
    )
  }

  const groupedAmenities = amenities.reduce(
    (acc, amenity) => {
      if (!acc[amenity.category]) {
        acc[amenity.category] = []
      }
      acc[amenity.category].push(amenity)
      return acc
    },
    {} as Record<string, Amenity[]>,
  )

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium mb-2">Current Amenities ({selectedAmenities.length})</h3>
        <div className="flex flex-wrap gap-1 mb-4">
          {selectedAmenities.map((amenity) => (
            <Badge key={amenity} variant="default" className="text-xs">
              {amenity}
            </Badge>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {Object.entries(groupedAmenities).map(([category, categoryAmenities]) => (
          <div key={category}>
            <h4 className="font-medium mb-2 capitalize">{category}</h4>
            <div className="grid grid-cols-2 gap-2">
              {categoryAmenities
                .filter((amenity) => amenity.is_active)
                .map((amenity) => (
                  <div key={amenity.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={amenity.id}
                      checked={selectedAmenities.includes(amenity.name)}
                      onCheckedChange={() => toggleAmenity(amenity.name)}
                    />
                    <Label htmlFor={amenity.id} className="text-sm">
                      {amenity.name}
                    </Label>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={() => onSave(selectedAmenities)}>Save Changes</Button>
      </div>
    </div>
  )
}
