"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/lib/supabase"
import { Plus, Edit2, Trash2, Eye, EyeOff, AlertCircle } from "lucide-react"
import Link from "next/link"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Property {
  id: string
  name: string
  short_description: string
  area: string
  starting_price: number
  total_rooms: number
  status: string
  is_verified: boolean
  is_featured: boolean
  slug: string
}

export default function MyPropertyPage() {
  const router = useRouter()
  const [properties, setProperties] = useState<Property[]>([])
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const checkAuthAndFetchProperties = async () => {
      const { data } = await supabase.auth.getSession()
      if (!data?.session?.user) {
        router.push("/signin?redirect=/list-property")
        return
      }

      setUser(data.session.user)

      // Fetch user's properties
      const { data: propsData, error } = await supabase
        .from("hotels")
        .select("*")
        .eq("owner_id", data.session.user.id)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching properties:", error)
      } else {
        setProperties(propsData || [])
      }

      setLoading(false)
    }

    checkAuthAndFetchProperties()
  }, [router])

  const handleDelete = async () => {
    if (!deleteId) return

    setDeleting(true)
    try {
      const { error } = await supabase.from("hotels").delete().eq("id", deleteId).eq("owner_id", user?.id)

      if (error) throw error

      setProperties(properties.filter((p) => p.id !== deleteId))
      setDeleteId(null)
    } catch (err) {
      console.error("Error deleting property:", err)
      alert("Failed to delete property")
    } finally {
      setDeleting(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <p className="text-gray-600">Loading your properties...</p>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow py-8 px-4">
        <div className="container mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">My Properties</h1>
              <p className="text-gray-600">Manage and edit your listed properties</p>
            </div>
            <Button asChild className="mt-4 md:mt-0 bg-[#0071C2] hover:bg-[#005999]">
              <Link href="/list-property">
                <Plus className="h-4 w-4 mr-2" />
                List New Property
              </Link>
            </Button>
          </div>

          {/* Empty State */}
          {properties.length === 0 ? (
            <Card>
              <CardContent className="py-16 text-center">
                <div className="mb-4 text-5xl">🏠</div>
                <h3 className="text-xl font-semibold mb-2">No Properties Listed</h3>
                <p className="text-gray-600 mb-6">Start listing your properties to attract guests</p>
                <Button asChild className="bg-[#0071C2] hover:bg-[#005999]">
                  <Link href="/list-property">
                    <Plus className="h-4 w-4 mr-2" />
                    List Your First Property
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {properties.map((property) => (
                <Card key={property.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      {/* Property Info */}
                      <div className="flex-1">
                        <div className="flex flex-col gap-2 mb-3">
                          <h3 className="text-xl font-semibold">{property.name}</h3>
                          <p className="text-gray-600 text-sm">{property.short_description}</p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                          <div>
                            <span className="text-gray-600">Area</span>
                            <p className="font-semibold">{property.area}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Starting Price</span>
                            <p className="font-semibold">₹{property.starting_price.toLocaleString()}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Rooms</span>
                            <p className="font-semibold">{property.total_rooms}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Status</span>
                            <p className="font-semibold capitalize">{property.status}</p>
                          </div>
                        </div>

                        {/* Badges */}
                        <div className="flex flex-wrap gap-2">
                          <Badge className={getStatusColor(property.status)}>
                            {property.status === "pending" && <AlertCircle className="h-3 w-3 mr-1" />}
                            {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                          </Badge>

                          {property.is_verified && (
                            <Badge className="bg-blue-100 text-blue-800">
                              <Eye className="h-3 w-3 mr-1" />
                              Verified
                            </Badge>
                          )}

                          {property.is_featured && <Badge className="bg-purple-100 text-purple-800">⭐ Featured</Badge>}

                          {!property.is_verified && (
                            <Badge variant="outline">
                              <EyeOff className="h-3 w-3 mr-1" />
                              Pending Review
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2 md:w-32">
                        <Button asChild variant="outline" size="sm" className="bg-transparent">
                          <Link href={`/my-property/${property.id}/edit`}>
                            <Edit2 className="h-4 w-4 mr-2" />
                            Edit
                          </Link>
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDeleteId(property.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>

                        <Button asChild variant="default" size="sm" className="bg-[#0071C2] hover:bg-[#005999]">
                          <Link href={`/hotels/${property.slug}`}>View</Link>
                        </Button>
                      </div>
                    </div>

                    {property.status === "pending" && (
                      <div className="mt-4 pt-4 border-t bg-yellow-50 -mx-6 -mb-6 px-6 py-3 rounded-b-lg">
                        <p className="text-sm text-yellow-800">
                          ⏱ Your property is under review. It will be visible to guests once approved.
                        </p>
                      </div>
                    )}

                    {property.status === "rejected" && (
                      <div className="mt-4 pt-4 border-t bg-red-50 -mx-6 -mb-6 px-6 py-3 rounded-b-lg">
                        <p className="text-sm text-red-800">
                          ❌ Your property was rejected. Please edit and resubmit for review.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => !deleting && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Property</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this property? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-4">
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={deleting} className="bg-red-600 hover:bg-red-700">
              {deleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
