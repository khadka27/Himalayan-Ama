"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, MapPin, DollarSign, Home, Share2, Sparkles, ShieldCheck } from "lucide-react"
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

  const { flats, offers, isLoadingFlats } = useApp()

  const [flat, setFlat] = useState<Flat | null>(null)
  const [isBookingOpen, setIsBookingOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState(0)
  const [loadingSpecific, setLoadingSpecific] = useState(true)

  useEffect(() => {
    if (!slug) return;

    const fetchSpecificFlat = async (id: string) => {
      try {
        const { data } = await axiosInstance.get(`/api/v1/flats/${id}`);
        if (data.success && data.flat.isActive) {
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
      <div className="min-h-screen bg-[#F8FAFC]">
        <Header />
        <div className="container mx-auto py-32 text-center">
          <div className="h-20 w-20 rounded-3xl bg-blue-50 text-blue-500 flex items-center justify-center mx-auto mb-6">
            <Home className="h-10 w-10" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Apartment not found</h2>
          <p className="text-gray-500 font-medium mb-8">This listing may have been moved or removed.</p>
          <Link href="/apartments">
            <Button className="bg-blue-500 hover:bg-blue-600 rounded-2xl h-12 px-8 font-bold">Back to Apartments</Button>
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  const images = flat.imagesUri && flat.imagesUri.length > 0
    ? flat.imagesUri.map(uri => uri.startsWith("http") ? uri : `${BACKEND}/images/${uri}`)
    : ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2138&auto=format&fit=crop"];

  const activeOffer = offers.find(o =>
    (typeof o.flat === 'string' ? o.flat === flat._id : o.flat?._id === flat._id)
  );
  const discountedPrice = activeOffer
    ? Math.round(flat.price * (1 - activeOffer.discountPercentage / 100))
    : flat.price;

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <div className="bg-white/80 backdrop-blur-md py-4 border-b border-gray-100 sticky top-20 z-10">
        <div className="container mx-auto px-6 flex items-center justify-between">
          <Link
            href="/apartments"
            className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-blue-500 transition-all uppercase tracking-widest"
          >
            <ArrowLeft className="h-4 w-4" />
            Explore List
          </Link>
          <div className="flex items-center gap-4">
            <button className="h-10 w-10 rounded-xl bg-gray-50 text-gray-400 flex items-center justify-center hover:bg-blue-50 hover:text-blue-500 transition-all">
              <Share2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">

            <div className="space-y-10">
              <div className="space-y-6">
                {activeOffer ? (
                  <div className="inline-flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2 text-xs font-black text-red-600 shadow-sm border border-red-100 uppercase tracking-widest animate-pulse">
                    <Sparkles className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    Limited Time Special: {activeOffer.discountPercentage}% OFF
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 rounded-xl bg-blue-50 px-4 py-2 text-xs font-bold text-blue-600 shadow-sm border border-blue-100 uppercase tracking-widest">
                    <Sparkles className="h-4 w-4" />
                    Premium Residence
                  </div>
                )}

                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight leading-tight">{flat.flatName}</h1>

                <div className="flex flex-wrap gap-8 items-center text-gray-500 font-bold uppercase tracking-widest text-[10px]">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-blue-400" />
                    <span>{flat.location}</span>
                  </div>
                </div>
              </div>

              <Card className="p-10 bg-white border-none shadow-2xl rounded-3xl border border-gray-50">
                <div className="flex items-center justify-between mb-8">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Monthly Rate</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl lg:text-4xl font-black text-gray-900">${discountedPrice}</span>
                      {activeOffer && (
                        <span className="text-sm font-bold text-gray-400 line-through">${flat.price}</span>
                      )}
                      <span className="text-sm font-bold text-gray-400">/ USD</span>
                    </div>
                  </div>
                  <div className="h-14 w-14 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center">
                    <DollarSign className="h-7 w-7" />
                  </div>
                </div>

                <div className="space-y-8 prose prose-slate prose-lg max-w-none text-gray-600 leading-relaxed font-medium mb-10">
                  <p>{flat.description || "Indulge in the perfect blend of modern comfort and Nepalese hospitality. This sanctuary is thoughtfully designed to provide a peaceful living experience in one of Pokhara's most sought-after locations."}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                  <div className="flex items-center gap-4 p-5 bg-gray-50 rounded-xl">
                    <ShieldCheck className="h-6 w-6 text-green-500" />
                    <span className="font-bold text-gray-900 text-sm">Verified Listing</span>
                  </div>
                  <div className="flex items-center gap-4 p-5 bg-gray-50 rounded-xl">
                    <Sparkles className="h-6 w-6 text-blue-500" />
                    <span className="font-bold text-gray-900 text-sm">Fully Furnished</span>
                  </div>
                </div>

                <Button size="lg" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold h-16 rounded-xl shadow-xl shadow-blue-100 transition-all text-lg" onClick={toggleBooking}>
                  Inquire Availability
                </Button>
              </Card>
            </div>

            <div className="space-y-6 lg:sticky lg:top-40">
              <div className="relative h-[450px] md:h-[600px] overflow-hidden rounded-3xl shadow-2xl border-4 md:border-8 border-white bg-white group">
                <Image
                  src={images[selectedImage]}
                  alt={flat.flatName}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  priority
                />
                <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black/20 to-transparent">
                  <div className="h-1 bg-white/30 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-white transition-all duration-300"
                      style={{ width: `${((selectedImage + 1) / images.length) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide px-2">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      className={`relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl transition-all duration-300 ${selectedImage === index
                        ? "shadow-2xl scale-105 border-4 border-blue-500"
                        : "opacity-60 grayscale-[50%] hover:opacity-100 hover:grayscale-0"
                        }`}
                      onClick={() => setSelectedImage(index)}
                    >
                      <Image
                        src={img}
                        alt={`${flat.flatName} preview ${index + 1}`}
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
