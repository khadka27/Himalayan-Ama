"use client"

import type React from "react"
import { useRef, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, useScroll, useTransform } from "framer-motion"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Heart,
  Users,
  Mail,
  Phone,
  Star,
  Check,
  Sparkles,
  Leaf,
  Globe,
  Feather,
  Bird,
  Sun,
  Home,
  MapPin,
  DollarSign
} from "lucide-react"
import Image from "next/image"
import { ApartmentBookingModal } from "@/components/apartment-booking-modal"
import axiosInstance from "@/services/axios-instance"
import { toast } from "sonner"
import { HomeServicesSkeleton } from "@/components/skeletons/home-services-skeleton"
import { useApp } from "@/context/AppContext"
import { VideoSection } from "@/components/home/video-section"
import { AnimatedIns } from "@/components/home/animated-ins"

function AnimatedSection({ children, className, id }: { children: React.ReactNode, className?: string, id?: string }) {
  return (
    <motion.section
      id={id}
      className={className}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
    >
      {children}
    </motion.section>
  )
}

export default function HomePage() {
  const router = useRouter()
  const { flats, isLoadingFlats, instructors } = useApp()

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [isBookingOpen, setIsBookingOpen] = useState(false)
  const [selectedFlat, setSelectedFlat] = useState<any | null>(null)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })

  const { scrollY } = useScroll()
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0])

  const handleBookNow = (flat: any) => {
    setSelectedFlat(flat)
    setIsBookingOpen(true)
  }

  const handleDetails = (flatId: string) => {
    router.push(`/apartments/${flatId}`)
  }

  const displayedFlats = flats.slice(0, 6)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.message || !formData.email) {
      toast.info("Please fill in all required details")
      return
    }

    try {
      setIsSubmitting(true)
      const payload = { ...formData, service: "General Inquiry" }

      const { data } = await axiosInstance.post("/api/inquiries", payload)

      if (data.status || data.success) {
        toast.success(data.message || "Inquiry sent successfully")
        setFormData({
          name: "",
          email: "",
          phone: "",
          message: "",
        })
      } else {
        toast.info(data.message || "Inquiry not sent")
      }
    } catch (err) {
      const Err = err as Error
      toast.error(Err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const BACKEND = process.env.NEXT_PUBLIC_BACKEND || "http://localhost:4000";

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAF8F3] to-white overflow-hidden">
      <Header />

      <motion.section
        className="relative h-[90vh] min-h-[600px] overflow-hidden"
        style={{
          backgroundImage: 'url("/hero.png")',
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-emerald-900/40 via-teal-800/30 to-slate-900/50"
          style={{ opacity: heroOpacity }}
        />

        <div className="relative container mx-auto flex h-full items-center justify-center px-6">
          <motion.div
            className="max-w-3xl space-y-6 text-center text-white"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-balance tracking-tight drop-shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Find Your Perfect
              <span className="text-[#E8D5B7] font-bold"> Home in Nepal</span>
            </motion.h1>
            <motion.p
              className="text-lg text-white/90 leading-relaxed text-balance max-w-2xl mx-auto drop-shadow-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Discover luxury apartments and comfortable living spaces in the heart of nature. Experience the perfect blend of modern amenities and serene surroundings.
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Button
                size="lg"
                className="bg-white text-[#6B8E6A] hover:bg-white/90 transition-all font-semibold px-8 shadow-xl hover:shadow-2xl hover:scale-105"
                onClick={() => router.push("/apartments")}
              >
                Browse Apartments
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-[#6B8E6A] transition-all font-semibold px-8 backdrop-blur-sm bg-white/10"
                onClick={() => {
                  document.getElementById("featured")?.scrollIntoView({ behavior: "smooth" })
                }}
              >
                Featured Listings
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Featured Apartments */}
      <AnimatedSection id="featured" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center gap-2 text-[#8C9E8B] text-sm font-medium mb-3">
              <Home className="h-4 w-4" />
              Latest Listings
            </div>
            <h2 className="text-3xl font-medium text-gray-800 mb-4">Available Apartments</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Choose from our carefully selected apartments designed for comfort and style.
            </p>
          </motion.div>

          {isLoadingFlats ? (
            <HomeServicesSkeleton />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" >
              {displayedFlats.map((flat, index) => {
                const imageSrc = flat.imagesUri && flat.imagesUri.length > 0
                  ? (flat.imagesUri[0].startsWith("http") ? flat.imagesUri[0] : `${BACKEND}/images/${flat.imagesUri[0]}`)
                  : "/placeholder.svg";

                return (
                  <motion.div
                    key={flat._id}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="overflow-hidden border border-gray-100 bg-white hover:border-[#8C9E8B] transition-all duration-300 h-full flex flex-col group cursor-pointer" onClick={() => handleDetails(flat._id)}>
                      <div className="relative h-64 overflow-hidden">
                        <Image
                          src={imageSrc}
                          alt={flat.flatName}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                          loading="lazy"
                        />
                        <div className="absolute top-3 right-3 bg-[#627A64] text-white px-3 py-1 rounded-full text-sm font-bold shadow-sm">
                          ${flat.price} / mo
                        </div>
                      </div>

                      <div className="p-5 flex flex-col flex-1">
                        <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-[#627A64] transition-colors">{flat.flatName}</h3>

                        <div className="flex items-center gap-2 text-gray-600 mb-4 text-sm">
                          <MapPin className="h-4 w-4 text-[#627A64]" />
                          <span>{flat.location}</span>
                        </div>

                        <div className="mt-auto grid grid-cols-2 gap-3 pt-4 border-t border-gray-100">
                          <Button
                            variant="outline"
                            className="w-full hover:bg-[#627A64] hover:text-white transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDetails(flat._id);
                            }}
                          >
                            Details
                          </Button>
                          <Button
                            className="w-full bg-[#627A64] text-white hover:bg-[#4A5D4C]"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleBookNow(flat);
                            }}
                          >
                            Inquire
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          )}

          {!isLoadingFlats && displayedFlats.length === 0 && (
            <div className="text-center py-10">
              <p className="text-gray-500">No apartments currently available.</p>
            </div>
          )}

          <div className="mt-12 text-center">
            <Button
              className="bg-white text-[#6B8E6A] border border-[#6B8E6A] hover:bg-[#6B8E6A] hover:text-white transition-all px-8 py-6 text-lg"
              onClick={() => router.push("/apartments")}
            >
              View All Apartments
            </Button>
          </div>
        </div>
      </AnimatedSection>

      <VideoSection />

      {/* Why Choose Us */}
      <AnimatedSection className="py-20 bg-[#FAF8F3]">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-2 text-[#8C9E8B] text-sm font-medium">
                <Star className="h-4 w-4" />
                Premium Living
              </div>
              <h2 className="text-3xl font-medium text-gray-800 leading-snug">Why Choose Our Apartments?</h2>
              <p className="text-gray-600 leading-relaxed">
                We offer more than just a place to stay. Our apartments are curated to provide a peaceful and luxurious living experience, connecting you with nature without compromising on modern comforts.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                {[
                  { icon: <MapPin className="h-5 w-5" />, label: "Prime Locations" },
                  { icon: <DollarSign className="h-5 w-5" />, label: "Best Prices" },
                  { icon: <Check className="h-5 w-5" />, label: "Verified Listings" },
                  { icon: <Phone className="h-5 w-5" />, label: "24/7 Support" },
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm border border-gray-100">
                    <div className="text-[#6B8E6A]">{feature.icon}</div>
                    <span className="font-medium text-gray-700">{feature.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-xl">
                <Image src="/peacefull.png" alt="Peaceful Living" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-tr from-[#6B8E6A]/20 to-transparent" />
              </div>
            </motion.div>
          </div>
        </div>
      </AnimatedSection>

      {/* Contact Section */}
      <AnimatedSection className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto bg-[#FAF8F3] rounded-3xl overflow-hidden shadow-lg border border-[#E8D5B7]/30">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-8 md:p-12 space-y-6">
                <h2 className="text-3xl font-serif text-[#4A5D4C]">Get in Touch</h2>
                <p className="text-gray-600">
                  Have questions about renting? Send us a message and our team will get back to you shortly.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Input
                      placeholder="Your Name"
                      className="bg-white border-gray-200"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Input
                      placeholder="Email Address"
                      type="email"
                      className="bg-white border-gray-200"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <Input
                      placeholder="Phone Number"
                      type="tel"
                      className="bg-white border-gray-200"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <Textarea
                      placeholder="Your Message..."
                      className="bg-white border-gray-200 min-h-[100px]"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-[#627A64] hover:bg-[#4A5D4C] text-white"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </div>

              <div className="relative hidden md:block h-full min-h-[400px]">
                <Image src="/practice.png" alt="Contact Us" fill className="object-cover" />
                <div className="absolute inset-0 bg-[#4A5D4C]/80" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-8 text-center">
                  <Mail className="h-12 w-12 mb-4 text-[#E8D5B7]" />
                  <h3 className="text-2xl font-serif mb-2">Contact Info</h3>
                  <p className="mb-6 opacity-90">We are here to help you find your dream home.</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-[#E8D5B7]" />
                      <span>+977 9800000000</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-[#E8D5B7]" />
                      <span>info@himalayanama.com</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>

      <Footer />

      <ApartmentBookingModal
        open={isBookingOpen}
        onOpenChange={setIsBookingOpen}
        flat={selectedFlat}
      />
    </div>
  )
}
