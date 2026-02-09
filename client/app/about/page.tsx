"use client"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card } from "@/components/ui/card"
import { Users, Heart, Shield, Sparkles } from "lucide-react"
import Image from "next/image"
import Hero from "@/components/hero"
import { useApp } from "@/context/AppContext"

export default function AboutPage() {
  const { instructors, isLoadingInstructors } = useApp()
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <Hero
        title="Our Story"
        description="Discover the passion and vision behind Himalayan Ama's luxury residences in Pokhara."
        image="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop"
      />

      {/* Our Mission */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 items-center gap-20 lg:grid-cols-2">
            <div className="relative h-[600px] overflow-hidden rounded-[40px] shadow-2xl border-8 border-white group">
              <Image
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop"
                alt="Himalayan Ama Apartments"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-blue-500/10 mix-blend-overlay" />
            </div>

            <div className="space-y-10">
              <div className="space-y-4">
                <span className="text-sm font-bold uppercase tracking-widest text-blue-500">Established 2020</span>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight leading-tight">Elevating the Art of <span className="text-blue-500">Nepalese Living</span></h2>
              </div>

              <div className="space-y-6 text-lg text-gray-600 leading-relaxed font-medium">
                <p>
                  <strong>Himalayan Ama</strong> was born from a desire to redefine luxury hospitality in Nepal. We believe that true comfort comes from the seamless blend of modern sophistication and local warmth.
                </p>
                <p>
                  Our apartments are more than just spaces; they are sanctuaries crafted for those who seek the extraordinary. Every detail, from the panoramic views of Phewa Lake to the handpicked furnishings, is designed to inspire.
                </p>
                <p>
                  We are committed to sustainable local impact and authentic hospitality, ensuring that every guest feels like they belong to the heart of the Himalayas.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6 pt-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500">
                    <Heart className="h-5 w-5" />
                  </div>
                  <span className="font-bold text-gray-900">Hospitality</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500">
                    <Shield className="h-5 w-5" />
                  </div>
                  <span className="font-bold text-gray-900">Curated Safety</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Meet Our Hosts */}
      <section className="py-24 bg-blue-50/50">
        <div className="container mx-auto px-6">
          <div className="mb-20 text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm border border-blue-100 text-blue-600 text-sm font-bold">
              <Sparkles className="h-4 w-4" />
              <span>Our Dedicated Team</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 tracking-tight">Meet Your Dedicated Hosts</h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-500 font-medium">
              We are a group of locals passionate about sharing the beauty of Pokhara through exceptional service.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-2 max-w-5xl mx-auto">
            {isLoadingInstructors ? (
              [1, 2].map((i) => (
                <Card key={i} className="overflow-hidden animate-pulse rounded-3xl border-none shadow-xl">
                  <div className="bg-gray-200 h-96 w-full" />
                  <div className="p-10 space-y-4">
                    <div className="h-8 bg-gray-200 rounded-xl w-1/2" />
                    <div className="h-4 bg-gray-200 rounded-xl w-1/4" />
                    <div className="h-24 bg-gray-200 rounded-xl" />
                  </div>
                </Card>
              ))
            ) : instructors.length > 0 ? (
              instructors.map((instructor) => (
                <Card key={instructor.id} className="overflow-hidden hover:shadow-2xl transition-all duration-500 rounded-[40px] border-none shadow-xl bg-white group">
                  <div className="relative h-[450px] overflow-hidden">
                    <Image
                      src={instructor.image_url || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1976&auto=format&fit=crop"}
                      alt={instructor.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>
                  <div className="p-10">
                    <h3 className="mb-2 text-3xl font-bold text-gray-900 group-hover:text-blue-500 transition-colors uppercase tracking-tight">{instructor.name}</h3>
                    <p className="mb-6 text-sm font-bold uppercase tracking-widest text-blue-500">
                      {instructor.profession || "Chief Host & Concierge"}
                    </p>
                    <p className="text-lg leading-relaxed text-gray-600 font-medium italic">
                      "{instructor.bio}"
                    </p>
                  </div>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                <Users className="mx-auto h-16 w-16 mb-6 text-gray-200" />
                <p className="text-gray-400 font-bold uppercase tracking-widest">Host information is being curated.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
