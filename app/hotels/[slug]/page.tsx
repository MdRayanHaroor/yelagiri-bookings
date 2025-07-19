import { notFound } from "next/navigation"
import { getHotelBySlug } from "@/lib/hotels"
import HotelDetailClient from "./hotel-detail-client"

interface HotelDetailPageProps {
  params: {
    slug: string
  }
}

export default async function HotelDetailPage({ params }: HotelDetailPageProps) {
  const hotel = await getHotelBySlug(params.slug)

  if (!hotel) {
    notFound()
  }

  return <HotelDetailClient hotel={hotel} />
}
