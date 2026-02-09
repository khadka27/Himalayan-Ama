"use client"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card } from "@/components/ui/card"
import { Heart, Users, Award, TrendingUp } from "lucide-react"
import Image from "next/image"
import Hero from "@/components/hero"
import { useApp } from "@/context/AppContext"

interface Instructor {
  id: number
  name: string
  profession: string
  experience: number
  bio: string
  specialities: string
  certifications: string[]
  image: string
  created_at: string
  updated_at: string
  image_url: string
}

export default function AboutPage() {
  const { instructors, isLoadingInstructors } = useApp()
  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <Hero
        title="About Us"
        description="Learn more about our journey, values, and the passionate team behind our yoga studio."
        image="/banner/about.png"
      />

      {/* Our Story */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div className="relative h-[500px] overflow-hidden rounded-xl">
              <Image
                src="/yoga2.png" // Recommendation: Replace with a photo of the center/Lakeside
                alt="Himalayan Yogini Center"
                fill
                className="object-cover"
                loading="lazy"
              />
            </div>

            <div className="space-y-6">
              <h2 className="text-3xl font-bold">Our Story</h2>
              <p className="leading-relaxed text-muted-foreground">
                Originally founded as the <strong>Nepali Yoga Center</strong> in 2000 in Lakeside, Pokhara, we are now known as <strong>Himalayan Yogini</strong>. Our roots in the community run deep, having served as a sanctuary for yoga, meditation, and healing for over two decades.
              </p>
              <p className="leading-relaxed text-muted-foreground">
                Founded by Devika Gurung, who began her journey inspired by international teachers and solidified her path with diplomas in Kathmandu, the center was established to offer authentic Hatha yoga and Ayurvedic practices.
              </p>
              <p className="leading-relaxed text-muted-foreground">
                Through major life challenges, including the survival of severe illness and the 2015 earthquake relief efforts led with Shyam Gurung, our mission has evolved. We now focus on deep self-healing, incorporating Kundalini Shakti, Shamanic healing, and traditional wisdom to help every student find their balance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Meet Our Instructors */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold">Meet Our Instructors</h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Our founders and lead instructors bring decades of experience and a deep commitment to traditional and holistic practices.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-2">
            {isLoadingInstructors ? (
              // Loading skeletons
              [1, 2].map((i) => (
                <Card key={i} className="overflow-hidden animate-pulse">
                  <div className="bg-gray-200 h-64 w-full" />
                  <div className="p-6 space-y-3">
                    <div className="h-6 bg-gray-200 rounded w-1/2" />
                    <div className="h-4 bg-gray-200 rounded w-1/3" />
                    <div className="h-20 bg-gray-200 rounded" />
                  </div>
                </Card>
              ))
            ) : instructors.length > 0 ? (
              instructors.map((instructor) => (
                <Card key={instructor.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-96">
                    <Image
                      src={instructor.image_url || "/placeholder.svg"}
                      alt={instructor.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="mb-1 text-xl font-semibold">{instructor.name}</h3>
                    <p className="mb-1 text-sm font-medium text-[#627A64]">
                      {instructor.profession || "Instructor"}
                    </p>
                    <p className="mb-2 text-xs text-muted-foreground">
                      {instructor.experience ? `${instructor.experience}+ Years Experience` : ""}
                      {instructor.specialities ? ` • Specialized in ${instructor.specialities}` : ""}
                    </p>
                    <p className="mb-3 text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
                      {instructor.bio}
                    </p>
                    {instructor.certifications && instructor.certifications.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {instructor.certifications.map((cert, idx) => (
                          <span key={idx} className="bg-[#F3F5F3] text-[#627A64] text-[10px] px-2 py-0.5 rounded-full border border-[#D9E1D9]">
                            {cert}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                <Users className="mx-auto h-12 w-12 mb-4 opacity-20" />
                <p>Lead instructors information will be added soon.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
