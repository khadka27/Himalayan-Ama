"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { MapPin, DollarSign, Home } from "lucide-react"
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
        <div className="text-center py-12">
          <p className="text-muted-foreground">No apartments found.</p>
        </div>
      )
    }

    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredFlats.map((flat) => {
          const imageSrc = flat.imagesUri && flat.imagesUri.length > 0
            ? (flat.imagesUri[0].startsWith("http") ? flat.imagesUri[0] : `${BACKEND}/images/${flat.imagesUri[0]}`)
            : "/placeholder.svg";

          return (
            <Card
              key={flat._id}
              className="overflow-hidden border border-gray-200 transition-all duration-300 hover:border-[#627A64] hover:shadow-xl flex flex-col"
            >
              <div className="relative h-64 cursor-pointer group" onClick={() => handleDetails(flat._id)}>
                <Image
                  src={imageSrc}
                  alt={flat.flatName}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute top-4 left-4 bg-white/90 px-3 py-1 rounded-full text-xs font-semibold text-gray-800 shadow-sm flex items-center gap-1">
                  <Home className="w-3 h-3" />
                  Apartment
                </div>
                <div className="absolute bottom-4 right-4 bg-[#627A64] text-white px-3 py-1 rounded-full text-sm font-bold shadow-sm">
                  ${flat.price} / mo
                </div>
              </div>

              <div className="p-6 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold text-gray-900 group-hover:text-[#627A64] transition-colors">{flat.flatName}</h3>
                </div>

                <div className="flex items-center gap-2 text-muted-foreground mb-4 text-sm">
                  <MapPin className="h-4 w-4 text-[#627A64]" />
                  <span>{flat.location}</span>
                </div>

                <div className="mt-auto grid grid-cols-2 gap-3 pt-4 border-t border-gray-100">
                  <Button
                    variant="outline"
                    className="w-full border-gray-300 hover:bg-gray-50 text-gray-700"
                    onClick={() => handleDetails(flat._id)}
                  >
                    Details
                  </Button>
                  <Button
                    className="w-full bg-[#627A64] hover:bg-[#4A5D4C] text-white"
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
    <div className="min-h-screen bg-gray-50">
      <Header />

      <Hero
        title="Find Your Perfect Home"
        description="Discover our curated selection of apartments available for rent."
        image="/banner/service.png"
      />

      <section className="border-b bg-white py-6 sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-1/2">
              <input
                type="text"
                placeholder="Search by name or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-full border border-gray-300 px-6 py-2.5 focus:border-[#627A64] focus:outline-none focus:ring-2 focus:ring-[#627A64]/20 pl-10"
              />
              <MapPin className="absolute left-3.5 top-3 h-5 w-5 text-gray-400" />
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
              <Button
                variant={selectedLocation === "all" ? "default" : "outline"}
                className={selectedLocation === "all" ? "bg-[#627A64] hover:bg-[#4A5D4C]" : "text-gray-600 hover:text-[#627A64] hover:border-[#627A64]"}
                onClick={() => setSelectedLocation("all")}
              >
                All Locations
              </Button>
              {locations.filter(l => l !== "all").map(loc => (
                <Button
                  key={loc}
                  variant={selectedLocation === loc ? "default" : "outline"}
                  className={`whitespace-nowrap ${selectedLocation === loc ? "bg-[#627A64] hover:bg-[#4A5D4C]" : "text-gray-600 hover:text-[#627A64] hover:border-[#627A64]"}`}
                  onClick={() => setSelectedLocation(loc)}
                >
                  {loc}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 pb-24">
        <div className="container mx-auto px-6">
          <div className="mb-8">
            <h2 className="text-3xl font-serif text-[#4A5D4C] mb-2">Available Apartments</h2>
            <p className="text-gray-500">Browse our latest listings and find a place to call home.</p>
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
