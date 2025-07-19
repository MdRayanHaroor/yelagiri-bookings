import { notFound } from "next/navigation"
import { getHotelBySlug } from "@/lib/hotels"
import HotelDetailClient from "./hotel-detail-client"

interface HotelDetailPageProps {
  params: {
    slug: string
  }
}

export default async function HotelDetailPage({ params }: HotelDetailPageProps) {
  const { slug } = params

  const hotel = await getHotelBySlug(slug)

  if (!hotel) {
    notFound()
  }

  return <HotelDetailClient hotel={hotel} />
}

export async function generateMetadata({ params }: HotelDetailPageProps) {
  const { slug } = params
  const hotel = await getHotelBySlug(slug)

  if (!hotel) {
    return {
      title: "Hotel Not Found",
    }
  }

  return {
    title: `${hotel.name} - Yelagiri Bookings`,
    description: hotel.short_description || hotel.description || `Book your stay at ${hotel.name}`,
  }
}
