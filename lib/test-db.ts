import { supabase } from "./supabase"

export async function testDatabaseData() {
  console.log("🧪 Testing database data access...")

  try {
    // Test 1: Check if tables exist and have data
    const tables = ["users", "hotels", "hotel_images", "amenities", "hotel_categories"]

    for (const table of tables) {
      const { data, error, count } = await supabase.from(table).select("*", { count: "exact", head: true })

      if (error) {
        console.error(`❌ Error accessing ${table}:`, error)
      } else {
        console.log(`✅ ${table}: ${count} records`)
      }
    }

    // Test 2: Try to fetch hotels directly
    console.log("🔍 Testing direct hotel fetch...")
    const { data: hotels, error: hotelError } = await supabase.from("hotels").select("*").limit(5)

    if (hotelError) {
      console.error("❌ Error fetching hotels:", hotelError)
    } else {
      console.log(`✅ Direct hotel fetch successful: ${hotels?.length} hotels`)
      console.log(
        "Hotels:",
        hotels?.map((h) => ({ name: h.name, featured: h.is_featured, status: h.status })),
      )
    }

    // Test 3: Test the exact featured hotels query
    console.log("🔍 Testing featured hotels query...")
    const { data: featured, error: featuredError } = await supabase
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

    if (featuredError) {
      console.error("❌ Error fetching featured hotels:", featuredError)
    } else {
      console.log(`✅ Featured hotels query successful: ${featured?.length} hotels`)
      console.log("Featured hotels:", featured)
    }

    // Test 4: Test images query
    if (featured && featured.length > 0) {
      console.log("🔍 Testing images query...")
      const hotelIds = featured.map((h) => h.id)
      const { data: images, error: imageError } = await supabase
        .from("hotel_images")
        .select("hotel_id, image_url, alt_text, is_primary")
        .in("hotel_id", hotelIds)
        .eq("is_primary", true)

      if (imageError) {
        console.error("❌ Error fetching images:", imageError)
      } else {
        console.log(`✅ Images query successful: ${images?.length} images`)
        console.log("Images:", images)
      }
    }

    return true
  } catch (err) {
    console.error("❌ Database test failed:", err)
    return false
  }
}
