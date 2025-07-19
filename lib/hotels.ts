import { supabase } from "./supabase"

export interface Hotel {
  id: string
  name: string
  slug: string
  description?: string
  short_description?: string
  area: string
  address: string
  phone?: string
  email?: string
  website?: string
  starting_price: number
  average_rating: number
  total_reviews: number
  hotel_images?: Array<{
    id: string
    image_url: string
    alt_text: string
    is_primary: boolean
  }>
  room_types?: Array<{
    id: string
    name: string
    description: string
    base_price: number
    max_occupancy: number
    bed_type: string
    has_ac?: boolean
    has_wifi?: boolean
    has_tv?: boolean
  }>
  hotel_amenities?: Array<{
    id: string
    amenities: {
      id: string
      name: string
      category: string
      icon: string
    }
  }>
  reviews?: Array<{
    id: string
    guest_name: string
    rating: number
    review_text: string
    created_at: string
  }>
}

export async function testDatabaseConnection(): Promise<boolean> {
  try {
    console.log("🔍 Testing database connection...")
    const { data, error } = await supabase.from("hotels").select("id").limit(1)

    if (error) {
      console.error("❌ Database connection test failed:", error)
      return false
    }

    console.log("✅ Database connection successful")
    return true
  } catch (error) {
    console.error("❌ Database connection test error:", error)
    return false
  }
}

export async function getFeaturedHotels(): Promise<Hotel[]> {
  try {
    console.log("🔍 Fetching featured hotels...")

    const { data: hotels, error } = await supabase
      .from("hotels")
      .select(`
        *,
        hotel_images (
          id,
          image_url,
          alt_text,
          is_primary
        )
      `)
      .eq("is_featured", true)
      .order("average_rating", { ascending: false })
      .limit(8)

    if (error) {
      console.error("❌ Error fetching featured hotels:", error)
      return []
    }

    console.log(`✅ Fetched ${hotels?.length || 0} featured hotels`)
    return hotels || []
  } catch (error) {
    console.error("❌ Error in getFeaturedHotels:", error)
    return []
  }
}

export async function getFeaturedHotelsAlternative(): Promise<Hotel[]> {
  try {
    console.log("🔍 Fetching hotels (alternative method)...")

    // Test connection first
    const isConnected = await testDatabaseConnection()
    if (!isConnected) {
      console.error("❌ Database not connected")
      return []
    }

    const { data: hotels, error } = await supabase
      .from("hotels")
      .select(`
        id,
        name,
        short_description,
        area,
        starting_price,
        average_rating,
        total_reviews,
        slug,
        hotel_images (
          id,
          image_url,
          alt_text,
          is_primary
        )
      `)
      .order("average_rating", { ascending: false })
      .limit(12)

    if (error) {
      console.error("❌ Error fetching hotels:", error)
      return []
    }

    console.log(`✅ Hotels fetched successfully: ${hotels?.length || 0}`)
    return hotels || []
  } catch (error) {
    console.error("❌ Error in getFeaturedHotelsAlternative:", error)
    return []
  }
}

export async function getHotels(): Promise<Hotel[]> {
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
        room_types (
          id,
          name,
          description,
          base_price,
          max_occupancy,
          bed_type,
          has_ac,
          has_wifi,
          has_tv
        ),
        hotel_amenities (
          id,
          amenities (
            id,
            name,
            category,
            icon
          )
        )
      `)
      .order("name")

    if (error) {
      console.error("Error fetching hotels:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error in getHotels:", error)
    return []
  }
}

export async function getHotelBySlug(slug: string): Promise<Hotel | null> {
  try {
    console.log(`🔍 Fetching hotel by slug: ${slug}`)

    const { data, error } = await supabase
      .from("hotels")
      .select(`
        *,
        hotel_images (
          id,
          image_url,
          alt_text,
          is_primary,
          display_order
        ),
        room_types (
          id,
          name,
          description,
          base_price,
          max_occupancy,
          bed_type,
          has_ac,
          has_wifi,
          has_tv
        ),
        hotel_amenities (
          id,
          amenities (
            id,
            name,
            category,
            icon
          )
        ),
        reviews (
          id,
          guest_name,
          rating,
          review_text,
          created_at
        )
      `)
      .eq("slug", slug)
      .single()

    if (error) {
      console.error(`❌ Error fetching hotel by slug ${slug}:`, error)
      return null
    }

    if (!data) {
      console.log(`❌ Hotel not found for slug: ${slug}`)
      return null
    }

    console.log(`✅ Hotel fetched successfully: ${data.name}`)
    return data
  } catch (error) {
    console.error("❌ Error in getHotelBySlug:", error)
    return null
  }
}

export async function getHotelReviews(hotelId: string, limit = 10) {
  try {
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("hotel_id", hotelId)
      .order("created_at", { ascending: false })
      .limit(limit)

    if (error) {
      console.error("Error fetching reviews:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error in getHotelReviews:", error)
    return []
  }
}

export async function searchHotels(query: string): Promise<Hotel[]> {
  try {
    const { data: hotels, error } = await supabase
      .from("hotels")
      .select(`
        *,
        hotel_images (
          id,
          image_url,
          alt_text,
          is_primary
        )
      `)
      .or(`name.ilike.%${query}%,area.ilike.%${query}%,short_description.ilike.%${query}%`)
      .order("average_rating", { ascending: false })

    if (error) {
      console.error("Error searching hotels:", error)
      return []
    }

    return hotels || []
  } catch (error) {
    console.error("Error in searchHotels:", error)
    return []
  }
}

// Get available areas
export async function getHotelAreas() {
  const { data, error } = await supabase.from("hotels").select("area").not("area", "is", null)

  if (error) {
    console.error("Error fetching areas:", error)
    return []
  }

  // Get unique areas
  const uniqueAreas = [...new Set(data?.map((item) => item.area) || [])]
  return uniqueAreas
}

// Get all amenities
export async function getAmenities() {
  const { data, error } = await supabase
    .from("amenities")
    .select("*")
    .eq("is_active", true)
    .order("category")
    .order("name")

  if (error) {
    console.error("Error fetching amenities:", error)
    return []
  }

  return data || []
}
