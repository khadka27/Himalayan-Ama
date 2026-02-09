"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { ArrowLeft, MapPin, DollarSign, Home } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { ApartmentBookingModal } from "@/components/apartment-booking-modal"
import { toast } from "sonner"
import { ServiceDetailSkeleton } from "@/components/skeletons/service-detail-skeleton"
import { useApp } from "@/context/AppContext"
import axiosInstance from "@/services/axios-instance"

interface Flat {
  _id: string
  flatName: string
  location: string
  price: number
  isActive: boolean
  imagesUri: string[]
  createdAt?: string
  updatedAt?: string
  description?: string
}

export default function ApartmentDetailPage() {
  const router = useRouter()
  const params = useParams()
  const slug = params.slug as string

  const { flats, isLoadingFlats } = useApp()

  const [flat, setFlat] = useState<Flat | null>(null)
  const [isBookingOpen, setIsBookingOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState(0)
  const [loadingSpecific, setLoadingSpecific] = useState(true)

  useEffect(() => {
    if (!slug) return;

    const fetchSpecificFlat = async (id: string) => {
      try {
        const { data } = await axiosInstance.get(`/api/v1/flats/${id}`);
        if (data.success) {
          setFlat(data.flat);
        } else {
          toast.error("Apartment not found");
          router.push("/apartments");
        }
      } catch (e) {
        console.error(e);
        toast.error("Error loading apartment details");
      } finally {
        setLoadingSpecific(false);
      }
    }

    // Try to find in existing context first
    if (flats.length > 0) {
      const found = flats.find(f => f._id === slug);
      if (found) {
        setFlat(found);
        setLoadingSpecific(false);
        return;
      }
    }

    if (!isLoadingFlats && flats.length > 0 && !flat) {
      const found = flats.find(f => f._id === slug);
      if (found) {
        setFlat(found);
      } else {
        fetchSpecificFlat(slug);
      }
      setLoadingSpecific(false);
    } else if (!isLoadingFlats && flats.length === 0) {
      fetchSpecificFlat(slug);
    }

  }, [slug, flats, isLoadingFlats, router])

  const BACKEND = process.env.NEXT_PUBLIC_BACKEND || "http://localhost:4000";

  const toggleBooking = () => setIsBookingOpen(!isBookingOpen)

  if (isLoadingFlats && loadingSpecific) {
    return (
      <div className="min-h-screen">
        <Header />
        <ServiceDetailSkeleton />
        <Footer />
      </div>
    )
  }

  if (!flat) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto py-20 text-center">
          <h2 className="text-2xl font-bold">Apartment not found</h2>
          <Link href="/apartments">
            <Button className="mt-4">Back to Apartments</Button>
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  const images = flat.imagesUri && flat.imagesUri.length > 0
    ? flat.imagesUri.map(uri => uri.startsWith("http") ? uri : `${BACKEND}/images/${uri}`)
    : ["/placeholder.svg"];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="border-b bg-white py-4 shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-6">
          <Link
            href="/apartments"
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#627A64] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Apartments
          </Link>
        </div>
      </div>

      <section className="py-8 md:py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

            <div className="order-2 lg:order-1 flex flex-col h-full">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#627A64]/10 px-3 py-1 text-xs font-semibold text-[#627A64] w-fit">
                <Home className="w-3 h-3" />
                Apartment for Rent
              </div>

              <h1 className="mb-4 text-3xl md:text-4xl font-serif text-gray-900">{flat.flatName}</h1>

              <div className="flex flex-wrap gap-4 mb-6 text-sm text-gray-600">
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-[#627A64]" />
                  {flat.location}
                </div>
                <div className="flex items-center gap-1.5">
                  <DollarSign className="h-4 w-4 text-[#627A64]" />
                  <span className="font-semibold text-gray-900">${flat.price}</span> / month
                </div>
              </div>

              <div className="prose prose-stone max-w-none mb-8 text-gray-600 leading-relaxed">
                <p>{flat.description || "A beautiful apartment available for rent. Contact us for more details and to schedule a viewing."}</p>
              </div>

              <div className="mt-auto pt-6 border-t border-gray-200">
                <Button size="lg" className="w-full md:w-auto bg-[#627A64] hover:bg-[#4A5D4C] text-white px-8" onClick={toggleBooking}>
                  Inquire Now
                </Button>
              </div>
            </div>

            <div className="order-1 lg:order-2 space-y-4">
              <div className="relative h-[300px] md:h-[400px] overflow-hidden rounded-2xl shadow-md bg-gray-200">
                <Image
                  src={images[selectedImage]}
                  alt={flat.flatName}
                  fill
                  className="object-cover transition-all duration-300"
                  priority
                />
              </div>

              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      className={`relative h-20 w-24 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all ${selectedImage === index ? "border-[#627A64] ring-2 ring-[#627A64]/20" : "border-transparent hover:border-gray-300"
                        }`}
                      onClick={() => setSelectedImage(index)}
                    >
                      <Image
                        src={img}
                        alt={`${flat.flatName} view ${index + 1}`}
                        fill
                        className="object-cover"
                        loading="lazy"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />

      <ApartmentBookingModal
        open={isBookingOpen}
        onOpenChange={setIsBookingOpen}
        flat={flat}
      />
    </div>
  )
}
