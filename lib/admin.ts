import { supabaseServer } from "./supabase-server"

// Admin functions for hotel management
export async function createHotel(hotelData: any) {
  const { data, error } = await supabaseServer.from("hotels").insert([hotelData]).select().single()

  if (error) {
    throw new Error(`Error creating hotel: ${error.message}`)
  }

  return data
}

export async function updateHotel(id: string, updates: any) {
  const { data, error } = await supabaseServer.from("hotels").update(updates).eq("id", id).select().single()

  if (error) {
    throw new Error(`Error updating hotel: ${error.message}`)
  }

  return data
}

export async function deleteHotel(id: string) {
  const { error } = await supabaseServer.from("hotels").delete().eq("id", id)

  if (error) {
    throw new Error(`Error deleting hotel: ${error.message}`)
  }

  return true
}

export async function getAllHotelsForAdmin() {
  const { data, error } = await supabaseServer
    .from("hotels")
    .select(`
      *,
      hotel_images(count),
      room_types(count),
      reviews(count)
    `)
    .order("created_at", { ascending: false })

  if (error) {
    throw new Error(`Error fetching hotels: ${error.message}`)
  }

  return data
}

export async function updateHotelStatus(id: string, status: string) {
  const { data, error } = await supabaseServer
    .from("hotels")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    throw new Error(`Error updating hotel status: ${error.message}`)
  }

  return data
}
