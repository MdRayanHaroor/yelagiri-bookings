"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { supabase } from "@/lib/supabase"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"

interface Hotel {
  id: string
  name: string
  short_description: string
  description: string
  area: string
  address: string
  starting_price: number
  total_rooms: number
  amenities: string
  owner_id: string
}

export default function EditPropertyPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [hotel, setHotel] = useState<Hotel | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState<Hotel | null>(null)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchHotel = async () => {
      const { data: sessionData } = await supabase.auth.getSession()
      if (!sessionData?.session?.user) {
        router.push("/signin?redirect=/my-property")
        return
      }

      setUser(sessionData.session.user)

      const { data, error: fetchError } = await supabase
        .from("hotels")
        .select("*")
        .eq("id", params.id)
        .eq("owner_id", sessionData.session.user.id)
        .single()

      if (fetchError || !data) {
        console.error("Error fetching hotel:", fetchError)
        router.push("/my-property")
        return
      }

      setHotel(data)
      setFormData(data)
      setLoading(false)
    }

    fetchHotel()
  }, [params.id, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target

    if (name === "starting_price" || name === "total_rooms") {
      setFormData((prev) => (prev ? { ...prev, [name]: Number.parseInt(value) } : null))
    } else {
      setFormData((prev) => (prev ? { ...prev, [name]: value } : null))
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => (prev ? { ...prev, [name]: value } : null))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData) return

    // Validation
    if (!formData.name.trim()) {
      setError("Hotel name is required")
      return
    }
    if (!formData.area.trim()) {
      setError("Area is required")
      return
    }
    if (formData.starting_price <= 0) {
      setError("Starting price must be greater than 0")
      return
    }
    if (formData.total_rooms <= 0) {
      setError("Total rooms must be greater than 0")
      return
    }

    setSaving(true)
    try {
      const { error: updateError } = await supabase
        .from("hotels")
        .update({
          name: formData.name,
          short_description: formData.short_description,
          description: formData.description,
          area: formData.area,
          address: formData.address,
          starting_price: formData.starting_price,
          total_rooms: formData.total_rooms,
          amenities: formData.amenities,
          updated_at: new Date().toISOString(),
        })
        .eq("id", formData.id)
        .eq("owner_id", user?.id)

      if (updateError) throw updateError

      router.push("/my-property")
    } catch (err) {
      console.error("Error updating hotel:", err)
      setError("Failed to update property. Please try again.")
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow flex items-center justify-center">
          <p className="text-gray-600">Loading property details...</p>
        </main>
      </div>
    )
  }

  if (!hotel || !formData) {
    return (
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow flex items-center justify-center">
          <p className="text-red-600">Property not found</p>
        </main>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow py-8 px-4">
        <div className="container mx-auto max-w-2xl">
          {/* Back Button */}
          <Button asChild variant="ghost" className="mb-4">
            <Link href="/my-property">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to My Properties
            </Link>
          </Button>

          <Card>
            <CardHeader>
              <CardTitle>Edit Property</CardTitle>
              <CardDescription>Update your property details</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">{error}</div>}

                {/* Hotel Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">Hotel Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter hotel name"
                    required
                  />
                </div>

                {/* Short Description */}
                <div className="space-y-2">
                  <Label htmlFor="short_description">Short Description</Label>
                  <Textarea
                    id="short_description"
                    name="short_description"
                    value={formData.short_description}
                    onChange={handleChange}
                    placeholder="Brief description of your hotel"
                    rows={2}
                  />
                </div>

                {/* Full Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Full Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Detailed description of your hotel"
                    rows={4}
                  />
                </div>

                {/* Area */}
                <div className="space-y-2">
                  <Label htmlFor="area">Area</Label>
                  <Input
                    id="area"
                    name="area"
                    value={formData.area}
                    onChange={handleChange}
                    placeholder="e.g., Yelagiri, Tirupati"
                    required
                  />
                </div>

                {/* Address */}
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Full address"
                    rows={3}
                  />
                </div>

                {/* Starting Price */}
                <div className="space-y-2">
                  <Label htmlFor="starting_price">Starting Price (₹)</Label>
                  <Input
                    id="starting_price"
                    name="starting_price"
                    type="number"
                    value={formData.starting_price}
                    onChange={handleChange}
                    placeholder="1000"
                    required
                    min="1"
                  />
                </div>

                {/* Total Rooms */}
                <div className="space-y-2">
                  <Label htmlFor="total_rooms">Total Rooms</Label>
                  <Input
                    id="total_rooms"
                    name="total_rooms"
                    type="number"
                    value={formData.total_rooms}
                    onChange={handleChange}
                    placeholder="10"
                    required
                    min="1"
                  />
                </div>

                {/* Amenities */}
                <div className="space-y-2">
                  <Label htmlFor="amenities">Amenities (comma separated)</Label>
                  <Textarea
                    id="amenities"
                    name="amenities"
                    value={formData.amenities}
                    onChange={handleChange}
                    placeholder="WiFi, Swimming Pool, AC, etc."
                    rows={2}
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-6">
                  <Button type="submit" disabled={saving} className="bg-[#0071C2] hover:bg-[#005999]">
                    {saving ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                  <Button type="button" variant="outline" asChild>
                    <Link href="/my-property">Cancel</Link>
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
