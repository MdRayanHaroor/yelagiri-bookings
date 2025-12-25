"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, Mountain, Camera, TreePine, Waves, MapPin, Clock } from "lucide-react"
import { useState, useEffect } from "react"

const attractions = [
  {
    id: 1,
    name: "Yelagiri Lake",
    image: "/placeholder.svg?height=400&width=600",
    description: "A serene lake perfect for boating and peaceful walks",
  },
  {
    id: 2,
    name: "Swamimalai Hills",
    image: "/placeholder.svg?height=400&width=600",
    description: "The highest peak in Yelagiri, ideal for trekking and sunrise views",
  },
  {
    id: 3,
    name: "Jalagamparai Waterfalls",
    image: "/placeholder.svg?height=400&width=600",
    description: "A beautiful waterfall surrounded by lush greenery",
  },
  {
    id: 4,
    name: "Punganoor Lake Park",
    image: "/placeholder.svg?height=400&width=600",
    description: "A well-maintained park with boating facilities and gardens",
  },
  {
    id: 5,
    name: "Telescope Observatory",
    image: "/placeholder.svg?height=400&width=600",
    description: "Perfect for stargazing and astronomical observations",
  },
]

const activities = [
  { icon: Mountain, name: "Trekking", description: "Explore scenic trails and mountain peaks" },
  { icon: Camera, name: "Paragliding", description: "Soar through the skies with stunning views" },
  { icon: TreePine, name: "Nature Walks", description: "Peaceful walks through fruit orchards" },
  { icon: Waves, name: "Boating", description: "Enjoy serene boat rides on the lake" },
]

export default function AboutPage() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [scrollY, setScrollY] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    const handleScroll = () => setScrollY(window.scrollY)

    if (typeof window !== "undefined") {
      window.addEventListener("scroll", handleScroll)
      return () => window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % attractions.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + attractions.length) % attractions.length)
  }

  // Don't render parallax effects until mounted
  const parallaxStyle = mounted
    ? {
      backgroundAttachment: window.innerWidth > 768 ? "fixed" : "scroll",
    }
    : {}

  const parallaxTransform = mounted
    ? {
      transform: `translateY(${scrollY * 0.5}px)`,
    }
    : {}

  const heroTextTransform = mounted
    ? {
      transform: `translateY(${scrollY * 0.3}px)`,
      opacity: Math.max(0, 1 - scrollY / 500),
    }
    : {}

  const heroSubtextTransform = mounted
    ? {
      transform: `translateY(${scrollY * 0.2}px)`,
      opacity: Math.max(0, 1 - scrollY / 600),
    }
    : {}

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        {/* Hero Section with Parallax Effect */}
        <section
          className="relative h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-screen flex items-center justify-center text-white overflow-hidden"
          style={{
            backgroundImage: `url('/placeholder.svg?height=800&width=1200')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            ...parallaxStyle,
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-40" style={parallaxTransform} />
          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
            <h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 animate-fade-in"
              style={heroTextTransform}
            >
              Yelagiri Hills
            </h1>
            <p
              className="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed"
              style={heroSubtextTransform}
            >
              A pristine hill station where nature meets tranquility
            </p>
          </div>
        </section>

        {/* Photo Slider Section */}
        <section className="py-8 sm:py-12 md:py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12">
              Discover Amazing Places
            </h2>
            <div className="relative max-w-5xl mx-auto">
              <div className="relative h-48 sm:h-64 md:h-80 lg:h-96 rounded-lg overflow-hidden">
                <img
                  src={attractions[currentSlide].image || "/placeholder.svg"}
                  alt={attractions[currentSlide].name}
                  className="w-full h-full object-cover transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 text-white max-w-[80%]">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-1 sm:mb-2">
                    {attractions[currentSlide].name}
                  </h3>
                  <p className="text-sm sm:text-base md:text-lg opacity-90">{attractions[currentSlide].description}</p>
                </div>
              </div>

              {/* Navigation Buttons */}
              <Button
                variant="outline"
                size="icon"
                className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white w-8 h-8 sm:w-10 sm:h-10"
                onClick={prevSlide}
              >
                <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white w-8 h-8 sm:w-10 sm:h-10"
                onClick={nextSlide}
              >
                <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>

              {/* Dots Indicator */}
              <div className="flex justify-center mt-4 sm:mt-6 space-x-2">
                {attractions.map((_, index) => (
                  <button
                    key={index}
                    className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-colors ${index === currentSlide ? "bg-[#0071C2]" : "bg-gray-300"
                      }`}
                    onClick={() => setCurrentSlide(index)}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Activities Section */}
        <section className="py-8 sm:py-12 md:py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12">Things to Do</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {activities.map((activity, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
                  <CardContent className="p-4 sm:p-6">
                    <activity.icon className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 mx-auto mb-3 sm:mb-4 text-[#0071C2]" />
                    <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-2">{activity.name}</h3>
                    <p className="text-sm sm:text-base text-gray-600">{activity.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Information Section */}
        <section className="py-8 sm:py-12 md:py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
              <div className="order-2 lg:order-1">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">About Yelagiri Hills</h2>
                <p className="text-sm sm:text-base text-gray-700 mb-3 sm:mb-4 leading-relaxed">
                  Yelagiri is a hill station in Tamil Nadu, India, situated at an altitude of 1,110 meters above sea
                  level. Known for its pleasant climate throughout the year, it's a perfect destination for those
                  seeking peace and tranquility.
                </p>
                <p className="text-sm sm:text-base text-gray-700 mb-4 sm:mb-6 leading-relaxed">
                  The hill station is famous for its rose gardens, orange groves, and the annual Summer Festival that
                  attracts visitors from all over the country. With its scenic beauty and adventure activities, Yelagiri
                  offers something for everyone.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-[#0071C2] mr-2 flex-shrink-0" />
                    <span className="text-sm sm:text-base">Tamil Nadu, India</span>
                  </div>
                  <div className="flex items-center">
                    <Mountain className="h-4 w-4 sm:h-5 sm:w-5 text-[#0071C2] mr-2 flex-shrink-0" />
                    <span className="text-sm sm:text-base">1,110m above sea level</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-[#0071C2] mr-2 flex-shrink-0" />
                    <span className="text-sm sm:text-base">Pleasant year-round climate</span>
                  </div>
                  <div className="flex items-center">
                    <TreePine className="h-4 w-4 sm:h-5 sm:w-5 text-[#0071C2] mr-2 flex-shrink-0" />
                    <span className="text-sm sm:text-base">Rich flora and fauna</span>
                  </div>
                </div>
              </div>
              <div className="relative order-1 lg:order-2">
                <img
                  src="/placeholder.svg?height=400&width=500"
                  alt="Yelagiri Hills Scenic View"
                  className="w-full h-64 sm:h-80 md:h-96 object-cover rounded-lg shadow-lg"
                />
                <div className="absolute -bottom-3 -right-3 sm:-bottom-6 sm:-right-6 w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-[#0071C2] rounded-lg opacity-20" />
                <div className="absolute -top-3 -left-3 sm:-top-6 sm:-left-6 w-12 h-12 sm:w-16 sm:h-16 md:w-24 md:h-24 bg-[#FEBB02] rounded-lg opacity-30" />
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-8 sm:py-12 md:py-16 bg-[#003580] text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">Ready to Explore Yelagiri?</h2>
            <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 opacity-90">
              Book your perfect stay and create unforgettable memories
            </p>
            <Button className="bg-[#FEBB02] text-[#003580] hover:bg-yellow-400 text-sm sm:text-base md:text-lg px-6 sm:px-8 py-2 sm:py-3 font-medium">
              Book Your Stay Now
            </Button>
          </div>
        </section>
      </main>
    </div>
  )
}
