"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, useScroll, useTransform } from "framer-motion"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Star,
  Check,
  Phone,
  Mail,
  Home,
  MapPin,
  DollarSign,
  Sparkles,
  ArrowRight
} from "lucide-react"
import Image from "next/image"
import { ApartmentBookingModal } from "@/components/apartment-booking-modal"
import axiosInstance from "@/services/axios-instance"
import { toast } from "sonner"
import { HomeServicesSkeleton } from "@/components/skeletons/home-services-skeleton"
import { useApp } from "@/context/AppContext"

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
  const { flats, isLoadingFlats } = useApp()

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
  const heroScale = useTransform(scrollY, [0, 500], [1, 1.1])
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0.5])

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
        toast.success("Inquiry sent successfully!")
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
    <div className="min-h-screen bg-white">
      <Header />

      <section className="relative h-screen min-h-[700px] overflow-hidden">
        <motion.div style={{ scale: heroScale }} className="absolute inset-0">
          <Image
            src={"https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=2000&auto=format&fit=crop"}
            alt="Luxury Residence in Pokhara"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
        </motion.div>

        <div className="relative container mx-auto h-full flex flex-col items-center justify-center px-6">
          <motion.div
            className="max-w-4xl space-y-10 text-center"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold text-xs uppercase tracking-[0.3em]"
              >
                <Sparkles className="h-4 w-4 text-blue-300" />
                <span>Luxury Rental Collections</span>
              </motion.div>

              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.05] text-white tracking-tighter drop-shadow-2xl">
                Experience <br />
                <span className="text-white">Pokhara</span> Refined
              </h1>
            </div>

            <p className="text-xl md:text-2xl text-white/90 leading-relaxed font-medium max-w-2xl mx-auto text-balance drop-shadow-lg">
              Indulge in carefully curated apartments where modern luxury meets the timeless serenity of the Himalayas.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-6">
              <Button
                size="lg"
                className="bg-blue-500 text-white hover:bg-blue-600 transition-all font-bold px-12 h-16 text-lg rounded-2xl shadow-2xl shadow-blue-500/20 hover:scale-105"
                onClick={() => router.push("/apartments")}
              >
                Explore Residences
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white/30 text-white hover:bg-white hover:text-gray-900 transition-all font-bold px-12 h-16 text-lg rounded-2xl backdrop-blur-md bg-white/5"
                onClick={() => {
                  document.getElementById("featured")?.scrollIntoView({ behavior: "smooth" })
                }}
              >
                Featured Suites
              </Button>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="h-10 w-6 rounded-full border-2 border-white/20 flex justify-center p-1">
            <div className="h-2 w-1 bg-white rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Featured Apartments */}
      <AnimatedSection id="featured" className="py-32 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
            <div className="space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-2 text-blue-500 text-xs font-bold uppercase tracking-[0.2em]">
                <Home className="h-4 w-4" />
                <span>Selected Collection</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">Handpicked <span className="text-blue-500">Sanctuaries</span></h2>
              <p className="text-lg text-gray-500 font-medium">
                Each residence is chosen for its unique character, premium amenities, and breathtaking mountain vistas.
              </p>
            </div>
            <Button
              variant="ghost"
              className="text-blue-500 font-bold text-lg hover:bg-blue-50 rounded-2xl p-6"
              onClick={() => router.push("/apartments")}
            >
              View Catalog <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>

          {isLoadingFlats ? (
            <HomeServicesSkeleton />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10" >
              {displayedFlats.map((flat, index) => {
                const imageSrc = flat.imagesUri && flat.imagesUri.length > 0
                  ? (flat.imagesUri[0].startsWith("http") ? flat.imagesUri[0] : `${BACKEND}/images/${flat.imagesUri[0]}`)
                  : "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2138&auto=format&fit=crop";

                return (
                  <motion.div
                    key={flat._id}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card
                      className="group overflow-hidden border-none bg-white rounded-[40px] shadow-xl hover:shadow-2xl transition-all duration-500 h-full flex flex-col cursor-pointer"
                      onClick={() => handleDetails(flat._id)}
                    >
                      <div className="relative h-72 overflow-hidden">
                        <Image
                          src={imageSrc}
                          alt={flat.flatName}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md text-gray-900 px-5 py-2 rounded-2xl text-base font-bold shadow-xl border border-white/50">
                          ${flat.price} <span className="text-xs font-medium text-gray-500">/mo</span>
                        </div>
                      </div>

                      <div className="p-10 flex flex-col flex-1">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-500 transition-colors uppercase tracking-tight">{flat.flatName}</h3>

                        <div className="flex items-center gap-2 text-gray-400 mb-8 text-sm font-bold uppercase tracking-widest">
                          <MapPin className="h-4 w-4 text-blue-400" />
                          <span>{flat.location}</span>
                        </div>

                        <div className="mt-auto flex items-center gap-4">
                          <Button
                            className="flex-1 h-14 rounded-2xl bg-blue-500 text-white font-bold hover:bg-blue-600 shadow-lg shadow-blue-100 transition-all"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleBookNow(flat);
                            }}
                          >
                            Inquire Now
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
            <div className="text-center py-20 bg-white rounded-[40px] border border-gray-100">
              <p className="text-xl text-gray-400 font-bold uppercase tracking-widest">Finding Listings...</p>
            </div>
          )}
        </div>
      </AnimatedSection>

      {/* Why Choose Us */}
      <AnimatedSection className="py-32 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <motion.div
              className="space-y-10"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 text-blue-500 text-xs font-bold uppercase tracking-[0.2em]">
                  <Sparkles className="h-4 w-4" />
                  <span>Unmatched Quality</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight tracking-tight">Redefining the <br /><span className="text-blue-500">Rental Experience</span></h2>
              </div>

              <p className="text-xl text-gray-500 font-medium leading-relaxed">
                We believe that luxury is not just about aesthetics, but about the feeling of complete peace and seamless living.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                {[
                  { icon: <MapPin className="h-5 w-5" />, label: "Prime Lakeside Locations" },
                  { icon: <DollarSign className="h-5 w-5" />, label: "Transparent Pricing" },
                  { icon: <Check className="h-5 w-5" />, label: "Luxury Furnishing" },
                  { icon: <Phone className="h-5 w-5" />, label: "Custom Concierge" },
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-4 p-5 bg-slate-50 rounded-2xl border border-white hover:bg-blue-50 hover:border-blue-100 transition-all group">
                    <div className="text-blue-500 group-hover:scale-110 transition-transform">{feature.icon}</div>
                    <span className="font-bold text-gray-900">{feature.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="relative h-[600px] rounded-[60px] overflow-hidden shadow-2xl border-8 border-white group">
                <Image
                  src="https://images.unsplash.com/photo-1512918760532-3ed46b2b73b5?q=80&w=2000&auto=format&fit=crop"
                  alt="Modern Interior"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-blue-500/5 mix-blend-overlay" />
              </div>
              <div className="absolute -bottom-10 -left-10 bg-white p-8 rounded-[40px] shadow-2xl border border-gray-50 hidden md:block">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center">
                    <Star className="h-8 w-8 fill-current" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 tracking-tight">4.9/5</p>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Average Resident Rating</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </AnimatedSection>

      {/* Contact Section */}
      <AnimatedSection className="py-32 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto bg-white rounded-[60px] overflow-hidden shadow-2xl border-none relative">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-12 md:p-20 space-y-10">
                <div className="space-y-4">
                  <h2 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">Need a <span className="text-blue-500">Consultation?</span></h2>
                  <p className="text-lg text-gray-500 font-medium leading-relaxed">
                    Our team is here to assist you in selecting the perfect residence for your stay.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <Input
                      placeholder="Your Name"
                      className="bg-gray-50 border-none h-14 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all font-medium px-6"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                    <Input
                      placeholder="Phone"
                      className="bg-gray-50 border-none h-14 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all font-medium px-6"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                  <Input
                    placeholder="Email Address"
                    type="email"
                    className="bg-gray-50 border-none h-14 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all font-medium px-6"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                  <Textarea
                    placeholder="Your Message..."
                    className="bg-gray-50 border-none min-h-[150px] rounded-3xl focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all font-medium p-6"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                  <Button
                    type="submit"
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold h-16 rounded-2xl shadow-xl shadow-blue-100 transition-all text-lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Processing..." : "Submit Inquiry"}
                  </Button>
                </form>
              </div>

              <div className="relative hidden lg:block h-full">
                <Image
                  src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1760&auto=format&fit=crop"
                  alt="Lakeside View"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-blue-600/90 mix-blend-multiply" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-20 text-center space-y-12">
                  <div className="space-y-4">
                    <div className="h-20 w-20 rounded-[30px] bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center mx-auto mb-8">
                      <Mail className="h-10 w-10 text-white" />
                    </div>
                    <h3 className="text-4xl font-bold tracking-tight">Direct Path</h3>
                    <p className="text-blue-100 font-medium">Reach out via our concierge desk for immediate assistance.</p>
                  </div>

                  <div className="space-y-8 w-full max-w-sm">
                    <div className="flex items-center gap-6 text-left group cursor-pointer p-2 hover:translate-x-2 transition-transform">
                      <div className="h-12 w-12 rounded-xl bg-white/10 flex items-center justify-center border border-white/10">
                        <Phone className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-blue-200">Call Us</p>
                        <p className="text-lg font-bold">+977 9816685279</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 text-left group cursor-pointer p-2 hover:translate-x-2 transition-transform">
                      <div className="h-12 w-12 rounded-xl bg-white/10 flex items-center justify-center border border-white/10">
                        <Mail className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-blue-200">Email Us</p>
                        <p className="text-lg font-bold">info@himalayanama.com</p>
                      </div>
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
