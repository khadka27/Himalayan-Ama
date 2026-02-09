"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { MapPin, Search, Home } from "lucide-react"
import Image from "next/image"
import { ApartmentBookingModal } from "@/components/apartment-booking-modal"
import { ServiceGridSkeleton } from "@/components/skeletons/service-card-skeleton"
import Hero from "@/components/hero"
import { useApp } from "@/context/AppContext"

interface Flat {
  _id: string
  flatName: string
  location: string
  price: number
  isActive: boolean
  imagesUri: string[]
  createdAt?: string
  updatedAt?: string
}

export default function ApartmentsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLocation, setSelectedLocation] = useState("all")
  const [isBookingOpen, setIsBookingOpen] = useState(false)
  const [selectedFlat, setSelectedFlat] = useState<Flat | null>(null)

  const { flats, isLoadingFlats } = useApp()

  const locations = ["all", ...Array.from(new Set(flats.map(f => f.location)))]

  // Filter flats based on search and location
  const filteredFlats = flats.filter((flat) => {
    const matchesSearch =
      flat.flatName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      flat.location.toLowerCase().includes(searchQuery.toLowerCase())

    if (selectedLocation === "all") return matchesSearch

    return matchesSearch && flat.location === selectedLocation
  })

  const handleBookNow = (flat: Flat) => {
    setSelectedFlat(flat)
    setIsBookingOpen(true)
  }

  const handleDetails = (flatId: string) => {
    router.push(`/apartments/${flatId}`)
  }

  const BACKEND = process.env.NEXT_PUBLIC_BACKEND || "http://localhost:4000";

  const renderFlats = () => {
    if (isLoadingFlats) {
      return <ServiceGridSkeleton />
    }

    if (filteredFlats.length === 0) {
      return (
        <div className="text-center py-20">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 text-gray-400 mb-4">
            <Search className="h-8 w-8" />
          </div>
          <p className="text-gray-500 font-medium">No apartments found matching your criteria.</p>
        </div>
      )
    }

    return (
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
        {filteredFlats.map((flat) => {
          const imageSrc = flat.imagesUri && flat.imagesUri.length > 0
            ? (flat.imagesUri[0].startsWith("http") ? flat.imagesUri[0] : `${BACKEND}/images/${flat.imagesUri[0]}`)
            : "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2138&auto=format&fit=crop";

          return (
            <Card
              key={flat._id}
              className="group overflow-hidden border border-gray-100 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 flex flex-col rounded-3xl"
            >
              <div className="relative h-72 cursor-pointer overflow-hidden" onClick={() => handleDetails(flat._id)}>
                <Image
                  src={imageSrc}
                  alt={flat.flatName}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl text-xs font-bold text-gray-900 shadow-xl flex items-center gap-2">
                  <Home className="w-4 h-4 text-blue-500" />
                  STAY
                </div>
                <div className="absolute bottom-6 right-6 bg-blue-500 text-white px-5 py-2 rounded-2xl text-base font-bold shadow-xl border border-white/20">
                  ${flat.price} <span className="text-xs font-medium opacity-80 decoration-transparent">/mo</span>
                </div>
              </div>

              <div className="p-8 flex flex-col flex-1 bg-white">
                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-500 transition-colors">{flat.flatName}</h3>

                <div className="flex items-center gap-2 text-gray-500 mb-8 font-medium">
                  <MapPin className="h-5 w-5 text-blue-400" />
                  <span>{flat.location}</span>
                </div>

                <div className="mt-auto grid grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    className="h-12 rounded-2xl border-gray-200 hover:bg-gray-50 text-gray-700 font-bold transition-all"
                    onClick={() => handleDetails(flat._id)}
                  >
                    View Details
                  </Button>
                  <Button
                    className="h-12 rounded-2xl bg-blue-500 hover:bg-blue-600 text-white font-bold shadow-lg shadow-blue-100 transition-all"
                    onClick={() => handleBookNow(flat)}
                  >
                    Inquire
                  </Button>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header />

      <Hero
        title="Find Your Perfect Home"
        description="Curated luxury apartments in the heart of Nepal's most serene locations."
        image="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop"
      />

      <section className="bg-white/80 backdrop-blur-md py-8 sticky top-28 z-10 shadow-sm border-b border-gray-100">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            <div className="relative w-full lg:w-1/2 group">
              <input
                type="text"
                placeholder="Search by name or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-14 rounded-2xl border border-gray-100 bg-gray-50 px-6 py-2.5 focus:bg-white focus:border-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 pl-12 transition-all font-medium text-gray-900"
              />
              <Search className="absolute left-4 top-4.5 h-6 w-6 text-gray-400 transition-colors group-focus-within:text-blue-500" />
            </div>

            <div className="flex gap-3 overflow-x-auto pb-2 md:pb-0 w-full lg:w-auto scrollbar-hide">
              <Button
                size="sm"
                variant={selectedLocation === "all" ? "default" : "ghost"}
                className={`rounded-xl px-6 py-5 font-bold transition-all ${selectedLocation === "all"
                  ? "bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-100"
                  : "text-gray-500 hover:bg-gray-100"
                  }`}
                onClick={() => setSelectedLocation("all")}
              >
                All Regions
              </Button>
              {locations.filter(l => l !== "all").map(loc => (
                <Button
                  key={loc}
                  size="sm"
                  variant={selectedLocation === loc ? "default" : "ghost"}
                  className={`rounded-xl px-6 py-5 font-bold transition-all whitespace-nowrap ${selectedLocation === loc
                    ? "bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-100"
                    : "text-gray-500 hover:bg-gray-100"
                    }`}
                  onClick={() => setSelectedLocation(loc)}
                >
                  {loc}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 pb-32">
        <div className="container mx-auto px-6">
          <div className="mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">Available Residences</h2>
            <div className="h-1.5 w-20 bg-blue-500 rounded-full mb-6" />
            <p className="text-lg text-gray-500 max-w-2xl font-medium">Explore our premium selection of fully furnished apartments designed for comfort and peace.</p>
          </div>
          {renderFlats()}
        </div>
      </section>

      <Footer />

      <ApartmentBookingModal
        open={isBookingOpen}
        onOpenChange={setIsBookingOpen}
        flat={selectedFlat}
      />
    </div>
  )
}
