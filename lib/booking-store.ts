export interface BookingData {
  hotelId: string
  hotelName: string
  roomId: string
  roomName: string
  roomPrice: number
  checkInDate: Date
  checkOutDate: Date
  guests: number
  nights: number
  baseAmount: number
  taxRate: number
  taxAmount: number
  totalPrice: number
}

const BOOKING_STORAGE_KEY = "bookingData"

export function setBookingData(data: BookingData): void {
  if (typeof window !== "undefined") {
    sessionStorage.setItem(BOOKING_STORAGE_KEY, JSON.stringify(data))
  }
}

export function getBookingData(): BookingData | null {
  if (typeof window === "undefined") {
    return null
  }

  const data = sessionStorage.getItem(BOOKING_STORAGE_KEY)
  if (!data) {
    return null
  }

  try {
    const parsed = JSON.parse(data)
    return {
      ...parsed,
      checkInDate: new Date(parsed.checkInDate),
      checkOutDate: new Date(parsed.checkOutDate),
    }
  } catch (error) {
    console.error("Error parsing booking data:", error)
    return null
  }
}

export function clearBookingData(): void {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem(BOOKING_STORAGE_KEY)
  }
}
