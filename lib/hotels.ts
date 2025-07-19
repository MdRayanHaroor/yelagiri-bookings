import { supabase } from "./supabase"

export interface Hotel {
  id: string
  name: string
  description: string
  short_description: string
  address: string
  area: string
  phone: string
  email: string
  starting_price: number
  average_rating: number
  total_reviews: number
  total_rooms: number
  status: string
  is_featured: boolean
  slug: string
  created_at: string
  hotel_images: HotelImage[]
  hotel_amenities: HotelAmenity[]
  room_types: RoomType[]
}

export interface HotelImage {
  id: string
  image_url: string
  alt_text: string
  is_primary: boolean
  display_order: number
  image_type: string
}

export interface HotelAmenity {
  id: string
  amenities: {
    id: string
    name: string
    icon: string
    category: string
  }
}

export interface RoomType {
  id: string
  name: string
  description: string
  max_occupancy: number
  base_price: number
  bed_type: string
  has_ac: boolean
  has_wifi: boolean
  has_tv: boolean
  room_images: RoomImage[]
}

export interface RoomImage {
  id: string
  image_url: string
  alt_text: string
  is_primary: boolean
}

// Test database connection
export async function testDatabaseConnection() {
  try {
    console.log("🔍 Testing Supabase connection...")
    const { data, error } = await supabase.from("hotels").select("count", { count: "exact", head: true })

    if (error) {
      console.error("❌ Database connection failed:", error)
      return false
    }

    console.log("✅ Database connected successfully")
    console.log(`📊 Hotels table has ${data?.length || 0} records`)
    return true
  } catch (err) {
    console.error("❌ Database connection error:", err)
    return false
  }
}

// Fetch all active hotels with basic information
export async function getHotels(limit?: number) {
  console.log("🔍 Fetching hotels...")

  let query = supabase
    .from("hotels")
    .select(`
      id,
      name,
      short_description,
      area,
      starting_price,
      average_rating,
      total_reviews,
      is_featured,
      slug,
      hotel_images (
        id,
        image_url,
        alt_text,
        is_primary,
        image_type
      ),
      hotel_amenities (
        id,
        amenities (
          id,
          name,
          icon,
          category
        )
      )
    `)
    .eq("status", "active")
    .order("is_featured", { ascending: false })
    .order("average_rating", { ascending: false })

  if (limit) {
    query = query.limit(limit)
  }

  const { data, error } = await query

  if (error) {
    console.error("❌ Error fetching hotels:", error)
    return []
  }

  console.log(`✅ Fetched ${data?.length || 0} hotels`)
  return data || []
}

// Fetch featured hotels with detailed logging
export async function getFeaturedHotels() {
  console.log("🔍 Fetching featured hotels...")

  const { data, error } = await supabase
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
        image_url,
        alt_text,
        is_primary
      )
    `)
    .eq("status", "active")
    .eq("is_featured", true)
    .order("average_rating", { ascending: false })
    .limit(6)

  if (error) {
    console.error("❌ Error fetching featured hotels:", error)
    console.error("Error details:", error.message, error.details, error.hint)
    return []
  }

  console.log(`✅ Fetched ${data?.length || 0} featured hotels`)
  if (data && data.length > 0) {
    console.log(
      "Featured hotels:",
      data.map((h) => ({ name: h.name, featured: h.is_featured })),
    )
  }

  return data || []
}

// Alternative approach - fetch hotels and images separately
export async function getFeaturedHotelsAlternative() {
  console.log("🔍 Fetching featured hotels (alternative method)...")

  // Test connection first
  await testDatabaseConnection()

  // First get the hotels
  const { data: hotels, error: hotelsError } = await supabase
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
      is_featured,
      status
    `)
    .eq("status", "active")
    .eq("is_featured", true)
    .order("average_rating", { ascending: false })
    .limit(6)

  if (hotelsError) {
    console.error("❌ Error fetching hotels:", hotelsError)
    return []
  }

  console.log(`📊 Found ${hotels?.length || 0} featured hotels`)

  if (!hotels || hotels.length === 0) {
    // Let's check if there are any hotels at all
    const { data: allHotels, error: allError } = await supabase
      .from("hotels")
      .select("id, name, status, is_featured")
      .limit(10)

    if (allError) {
      console.error("❌ Error checking all hotels:", allError)
    } else {
      console.log(`📊 Total hotels in database: ${allHotels?.length || 0}`)
      if (allHotels && allHotels.length > 0) {
        console.log("Sample hotels:", allHotels)
      }
    }
    return []
  }

  // Get hotel IDs
  const hotelIds = hotels.map((hotel) => hotel.id)
  console.log("🔍 Fetching images for hotel IDs:", hotelIds)

  // Fetch images for these hotels
  const { data: images, error: imagesError } = await supabase
    .from("hotel_images")
    .select("hotel_id, image_url, alt_text, is_primary")
    .in("hotel_id", hotelIds)
    .eq("is_primary", true)

  if (imagesError) {
    console.error("❌ Error fetching images:", imagesError)
    // Return hotels without images
    return hotels.map((hotel) => ({
      ...hotel,
      hotel_images: [],
    }))
  }

  console.log(`📊 Found ${images?.length || 0} images`)

  // Combine hotels with their images
  const hotelsWithImages = hotels.map((hotel) => ({
    ...hotel,
    hotel_images: images?.filter((img) => img.hotel_id === hotel.id) || [],
  }))

  console.log("✅ Successfully combined hotels with images")
  return hotelsWithImages
}

// Fetch single hotel with full details
export async function getHotelBySlug(slug: string) {
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
        display_order,
        image_type
      ),
      hotel_amenities (
        id,
        amenities (
          id,
          name,
          icon,
          category
        )
      ),
      room_types (
        id,
        name,
        description,
        max_occupancy,
        base_price,
        bed_type,
        has_ac,
        has_wifi,
        has_tv,
        room_images (
          id,
          image_url,
          alt_text,
          is_primary
        )
      )
    `)
    .eq("slug", slug)
    .eq("status", "active")
    .single()

  if (error) {
    console.error(`❌ Error fetching hotel with slug ${slug}:`, error)
    return null
  }

  console.log(`✅ Found hotel: ${data.name}`)
  return data
}

// Search hotels with filters
export async function searchHotels(filters: {
  checkIn?: string
  checkOut?: string
  guests?: number
  minPrice?: number
  maxPrice?: number
  amenities?: string[]
  area?: string
}) {
  console.log("🔍 Searching hotels with filters:", filters)

  let query = supabase
    .from("hotels")
    .select(`
      id,
      name,
      short_description,
      area,
      starting_price,
      average_rating,
      total_reviews,
      slug
    `)
    .eq("status", "active")

  // Apply filters
  if (filters.minPrice) {
    query = query.gte("starting_price", filters.minPrice)
  }

  if (filters.maxPrice) {
    query = query.lte("starting_price", filters.maxPrice)
  }

  if (filters.area) {
    query = query.eq("area", filters.area)
  }

  const { data: hotels, error } = await query.order("average_rating", { ascending: false })

  if (error) {
    console.error("❌ Error searching hotels:", error)
    return []
  }

  if (!hotels || hotels.length === 0) {
    console.log("📊 No hotels found matching filters")
    return []
  }

  // Get primary images for these hotels
  const hotelIds = hotels.map((hotel) => hotel.id)
  const { data: images } = await supabase
    .from("hotel_images")
    .select("hotel_id, image_url, alt_text, is_primary")
    .in("hotel_id", hotelIds)
    .eq("is_primary", true)

  // Combine hotels with their images
  const hotelsWithImages = hotels.map((hotel) => ({
    ...hotel,
    hotel_images: images?.filter((img) => img.hotel_id === hotel.id) || [],
  }))

  console.log(`✅ Found ${hotelsWithImages.length} hotels matching filters`)
  return hotelsWithImages
}

// Get hotel reviews
export async function getHotelReviews(hotelId: string, limit = 10) {
  const { data, error } = await supabase
    .from("reviews")
    .select(`
      id,
      rating,
      title,
      review_text,
      guest_name,
      guest_location,
      cleanliness_rating,
      service_rating,
      location_rating,
      value_rating,
      created_at
    `)
    .eq("hotel_id", hotelId)
    .eq("is_approved", true)
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) {
    console.error("Error fetching reviews:", error)
    return []
  }

  return data || []
}

// Get available areas
export async function getHotelAreas() {
  const { data, error } = await supabase.from("hotels").select("area").eq("status", "active").not("area", "is", null)

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
