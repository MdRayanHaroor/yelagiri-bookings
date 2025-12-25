import { notFound } from "next/navigation"
import { getHotelBySlug, getHotelReviews } from "@/lib/hotels"
import { HotelDetailClient } from "./hotel-detail-client"

interface HotelDetailPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function HotelDetailPage({ params }: HotelDetailPageProps) {
  const { slug } = await params
  const hotel = await getHotelBySlug(slug)

  if (!hotel) {
    notFound()
  }

  const rooms = (hotel.room_types || []).map((rt) => ({
    id: rt.id,
    room_name: rt.name,
    room_type: rt.bed_type || "Standard",
    max_occupancy: rt.max_occupancy,
    base_price: rt.base_price,
  }))

  const reviews = await getHotelReviews(hotel.id)

  // Transform hotel data to match HotelDetailClient expectation
  const clientHotel = {
    id: hotel.id,
    name: hotel.name,
    slug: hotel.slug,
    short_description: hotel.short_description || "",
    description: hotel.description || "",
    address: hotel.address,
    area: hotel.area,
    starting_price: hotel.starting_price,
    amenities: (hotel.hotel_amenities || []).map((ha) => ha.amenities.name),
    rating: hotel.average_rating,
    reviews_count: hotel.total_reviews,
  }

  return <HotelDetailClient hotel={clientHotel} rooms={rooms} reviews={reviews} />
}
