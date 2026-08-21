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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Star,
  Check,
  Phone,
  Mail,
  Home,
  MapPin,
  DollarSign,
  Sparkles,
  ArrowRight,
  Loader2,
  Send
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
  const { flats, offers, isLoadingFlats } = useApp()

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [isBookingOpen, setIsBookingOpen] = useState(false)
  const [selectedFlat, setSelectedFlat] = useState<any | null>(null)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "general",
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

  const displayedFlats = flats.filter(f => f.isActive).slice(0, 6)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.message || !formData.email) {
      toast.error("Please fill in all required details")
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address")
      return
    }

    try {
      setIsSubmitting(true)
      const payload = {
        name: formData.name,
        email: formData.email,
        message: formData.message,
        phone: formData.phone || undefined,
        flat: formData.service === "general" ? "General Inquiry" : `Apartment Inquiry: ${formData.service}`,
      }

      const { data } = await axiosInstance.post("/api/v1/inquiry", payload)

      if (data.status || data.success) {
        toast.success(data.message || "Message sent successfully!")
        setFormData({
          name: "",
          email: "",
          phone: "",
          service: "general",
          message: "",
        })
      } else {
        toast.error(data.message || "Failed to send inquiry")
      }
    } catch (err) {
      const error = err as Error
      toast.error(error.message || "An error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const BACKEND = process.env.NEXT_PUBLIC_BACKEND || "http://localhost:4000";

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section (SolCharge Style - 1 Single Screen Fold) */}
      <section className="relative w-full lg:h-screen min-h-[620px] lg:max-h-[920px] overflow-hidden bg-[#ebf3fa] flex flex-col justify-between pb-3 lg:pb-6 border-b border-slate-200/80">
        {/* Top Hero Photo Frame */}
        <div className="relative w-full h-[400px] sm:h-[480px] lg:h-[68%] min-h-[360px] max-h-[580px] overflow-hidden shrink-0">
          <Image
            src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=2000&auto=format&fit=crop"
            alt="Luxury Residence in Pokhara"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-slate-900/35 to-transparent pointer-events-none" />
          <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#ebf3fa] via-[#ebf3fa]/80 to-transparent pointer-events-none" />
        </div>

        {/* Content Wrapper */}
        <div className="container mx-auto px-4 sm:px-6 relative z-10 -mt-32 sm:-mt-44 lg:-mt-56 flex-1 flex flex-col justify-end pb-2">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-end">

            {/* Left Content Column */}
            <motion.div
              className="lg:col-span-7 space-y-3 sm:space-y-4 text-left pt-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-blue-200/80 text-blue-700 text-[11px] sm:text-xs font-bold uppercase tracking-widest shadow-xs">
                <span>Self-Catering 1BHK in Lakeside Pokhara</span>
              </div>

              <div className="space-y-2 sm:space-y-3">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-[1.05] text-slate-900 tracking-tight font-[family-name:var(--font-playful)]">
                  Experience <br />
                  <span className="text-blue-600">Pokhara Refined</span>
                </h1>
                <p className="text-xs sm:text-sm lg:text-base text-slate-700 font-medium leading-relaxed max-w-lg">
                  Indulge in carefully curated apartments where modern luxury meets the timeless serenity of the Himalayas.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 sm:px-8 h-11 sm:h-12 text-xs sm:text-sm rounded-full shadow-lg shadow-blue-500/20 transition-all hover:scale-105 active:scale-95"
                  onClick={() => router.push("/apartments")}
                >
                  Explore Residences
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-blue-200 text-blue-700 hover:bg-blue-50 transition-all font-bold px-6 sm:px-8 h-11 sm:h-12 text-xs sm:text-sm rounded-full bg-white/80 backdrop-blur-sm"
                  onClick={() => {
                    document.getElementById("featured")?.scrollIntoView({ behavior: "smooth" })
                  }}
                >
                  Featured Suites
                </Button>
              </div>
            </motion.div>

            {/* Right Overlapping Card + Micro Badges */}
            <motion.div
              className="lg:col-span-5 space-y-3 lg:space-y-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {/* Floating Form Overlay Card */}
              <div className="bg-white/95 backdrop-blur-xl p-6 sm:p-8 rounded-[32px] shadow-2xl border border-white/80 space-y-4">
                <div className="space-y-1">
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight font-[family-name:var(--font-playful)]">Quick Stay Consultation</h3>
                  <p className="text-xs text-slate-500 font-medium">Reach out directly for availability & instant quotes.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3.5">
                  <div className="grid grid-cols-2 gap-3.5">
                    <Input
                      placeholder="Your Name"
                      className="bg-slate-100/90 border-none h-11 sm:h-12 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 text-xs sm:text-sm font-medium px-4 text-slate-800"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                    <Input
                      placeholder="Phone Number"
                      className="bg-slate-100/90 border-none h-11 sm:h-12 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 text-xs sm:text-sm font-medium px-4 text-slate-800"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3.5">
                    <Input
                      placeholder="Email Address"
                      type="email"
                      className="bg-slate-100/90 border-none h-11 sm:h-12 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 text-xs sm:text-sm font-medium px-4 text-slate-800"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                    <Select
                      value={formData.service}
                      onValueChange={(value) => setFormData({ ...formData, service: value })}
                    >
                      <SelectTrigger className="bg-slate-100/90 border-none h-11 sm:h-12 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 text-xs sm:text-sm font-medium px-4 text-slate-800">
                        <SelectValue placeholder="Inquiry Type" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-none shadow-xl">
                        <SelectItem value="general" className="text-xs sm:text-sm font-medium">General Inquiry</SelectItem>
                        {flats.map((flat) => (
                          <SelectItem key={flat._id} value={flat.flatName} className="text-xs sm:text-sm font-medium">
                            {flat.flatName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Textarea
                    placeholder="Your Message / Travel Dates..."
                    className="bg-slate-100/90 border-none min-h-[85px] rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 text-xs sm:text-sm font-medium p-4 resize-none text-slate-800"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                  />
                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 rounded-xl shadow-lg shadow-blue-500/20 text-xs sm:text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <span>Submit Inquiry</span>
                        <Send className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>
              </div>

              {/* 3 Micro Feature Badges */}
              <div className="grid grid-cols-3 gap-2.5">
                <div className="p-2.5 sm:p-3 rounded-xl bg-[#dce8f5] border border-white/80 text-center space-y-1 flex flex-col items-center justify-center shadow-xs">
                  <div className="h-6 w-6 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xs">
                    <Home className="h-3.5 w-3.5" />
                  </div>
                  <p className="text-[9px] sm:text-[10px] font-bold text-slate-900 leading-tight">Self-Catering Kitchen</p>
                </div>

                <div className="p-2.5 sm:p-3 rounded-xl bg-[#dce8f5] border border-white/80 text-center space-y-1 flex flex-col items-center justify-center shadow-xs">
                  <div className="h-6 w-6 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xs">
                    <Phone className="h-3.5 w-3.5" />
                  </div>
                  <p className="text-[9px] sm:text-[10px] font-bold text-slate-900 leading-tight">BBQ & Open Yard</p>
                </div>

                <div className="p-2.5 sm:p-3 rounded-xl bg-[#dce8f5] border border-white/80 text-center space-y-1 flex flex-col items-center justify-center shadow-xs">
                  <div className="h-6 w-6 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xs">
                    <MapPin className="h-3.5 w-3.5" />
                  </div>
                  <p className="text-[9px] sm:text-[10px] font-bold text-slate-900 leading-tight">Walk to Phewa Lake</p>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Featured Apartments */}
      <AnimatedSection id="featured" className="py-16 md:py-32 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 md:mb-20 gap-8">
            <div className="space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-2 text-blue-500 text-xs font-bold uppercase tracking-[0.2em]">
                <Home className="h-4 w-4" />
                <span>Selected Collection</span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight">Handpicked <span className="text-blue-500">Sanctuaries</span></h2>
              <p className="text-base md:text-lg text-gray-500 font-medium">
                Each residence is chosen for its unique character, premium amenities, and breathtaking mountain vistas.
              </p>
            </div>
            <Button
              variant="ghost"
              className="text-blue-500 font-bold text-base md:text-lg hover:bg-blue-50 rounded-xl p-4 md:p-6"
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

                const activeOffer = offers.find(o =>
                  (typeof o.flat === 'string' ? o.flat === flat._id : o.flat?._id === flat._id)
                );
                const discountedPrice = activeOffer
                  ? Math.round(flat.price * (1 - activeOffer.discountPercentage / 100))
                  : flat.price;

                return (
                  <motion.div
                    key={flat._id}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card
                      className="group overflow-hidden border-none bg-white rounded-2xl md:rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 h-full flex flex-col cursor-pointer"
                      onClick={() => handleDetails(flat._id)}
                    >
                      <div className="relative h-64 md:h-72 overflow-hidden">
                        <Image
                          src={imageSrc}
                          alt={flat.flatName}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                        {activeOffer && (
                          <div className="absolute top-4 md:top-6 left-4 md:left-6 bg-red-600 text-white px-3 py-1 md:py-1.5 rounded-lg text-[10px] md:text-xs font-black uppercase tracking-[0.2em] shadow-xl flex items-center gap-1.5 animate-pulse z-10 transition-transform group-hover:scale-110">
                            {activeOffer.discountPercentage}% OFF
                          </div>
                        )}

                        <div className="absolute top-4 md:top-6 right-4 md:right-6 bg-white/95 backdrop-blur-md text-gray-900 px-4 md:px-5 py-1.5 md:py-2 rounded-xl text-sm md:text-base font-bold shadow-xl border border-white/50">
                          {activeOffer ? (
                            <div className="flex flex-col items-end leading-tight">
                              <span className="text-[10px] line-through opacity-40 font-medium">Rs. {flat.price}</span>
                              <span>Rs. {discountedPrice} <span className="text-xs font-medium text-gray-400">/day</span></span>
                            </div>
                          ) : (
                            <span>Rs. {flat.price} <span className="text-xs font-medium text-gray-500">/day</span></span>
                          )}
                        </div>
                      </div>

                      <div className="p-6 md:p-10 flex flex-col flex-1">
                        <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-500 transition-colors uppercase tracking-tight">{flat.flatName}</h3>

                        <div className="flex items-center gap-2 text-gray-400 mb-6 md:mb-8 text-xs md:text-sm font-bold uppercase tracking-widest">
                          <MapPin className="h-4 w-4 text-blue-400" />
                          <span>{flat.location}</span>
                        </div>

                        <div className="mt-auto flex items-center gap-4">
                          <Button
                            className="flex-1 h-12 md:h-14 rounded-xl bg-blue-500 text-white font-bold hover:bg-blue-600 shadow-lg shadow-blue-100 transition-all"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleBookNow(flat);
                            }}
                          >
                            Book Now
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
            <div className="text-center py-20 bg-white rounded-3xl border border-gray-100">
              <p className="text-xl text-gray-400 font-bold uppercase tracking-widest">Finding Listings...</p>
            </div>
          )}
        </div>
      </AnimatedSection>

      {/* Why Choose Us */}
      <AnimatedSection className="py-16 md:py-32 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-center">
            <motion.div
              className="space-y-8 md:space-y-10"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 text-blue-500 text-xs font-bold uppercase tracking-[0.2em]">
                  <span>Unmatched Quality</span>
                </div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight tracking-tight">Redefining the <br /><span className="text-blue-500">Rental Experience</span></h2>
              </div>

              <p className="text-lg md:text-xl text-gray-500 font-medium leading-relaxed">
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
              <div className="relative h-[400px] md:h-[600px] rounded-[40px] overflow-hidden shadow-2xl border-4 md:border-8 border-white group">
                <Image
                  src="https://th.bing.com/th/id/R.eca02af78c024b183a27d12d22af0979?rik=AC5jizk3yXq9Cg&pid=ImgRaw&r=0"
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
      <AnimatedSection className="py-16 md:py-32 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto bg-white rounded-[40px] overflow-hidden shadow-2xl border-none relative">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-6 sm:p-10 md:p-12 lg:p-20 space-y-8 md:space-y-10">
                <div className="space-y-4">
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight">Need a <span className="text-blue-500">Consultation?</span></h2>
                  <p className="text-base md:text-lg text-gray-500 font-medium leading-relaxed">
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

              <div className="relative block h-full min-h-[420px] rounded-b-[40px] lg:rounded-b-none lg:rounded-r-[40px] overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1760&auto=format&fit=crop"
                  alt="Lakeside View"
                  fill
                  className="object-cover blur-[1.5px] scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/70 to-slate-900/60 backdrop-blur-sm" />
                <div className="relative lg:absolute inset-0 flex flex-col items-center justify-center text-white p-8 sm:p-10 lg:p-14 text-center space-y-8 lg:space-y-10 z-10 py-12">
                  <div className="space-y-4">
                    <div className="h-16 w-16 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center mx-auto mb-6 shadow-xl">
                      <Mail className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-4xl lg:text-5xl font-bold tracking-tight !text-white drop-shadow-xl font-[family-name:var(--font-playful)]">
                      Direct Path
                    </h3>
                    <p className="text-white/95 font-medium max-w-xs mx-auto text-base leading-relaxed drop-shadow-md">
                      Reach out via our concierge desk for immediate assistance.
                    </p>
                  </div>

                  <div className="space-y-4 w-full max-w-sm">
                    <a
                      href="https://wa.me/9779816685279"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-5 text-left group cursor-pointer p-4 rounded-2xl bg-slate-900/60 hover:bg-slate-900/80 border border-white/20 backdrop-blur-md transition-all decoration-transparent shadow-xl"
                    >
                      <div className="h-12 w-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md">
                        <Phone className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-widest text-blue-300">Call Us</p>
                        <p className="text-base lg:text-lg font-bold text-white tracking-wide">+977 9816685279</p>
                      </div>
                    </a>
                    <a
                      href="mailto:info@himalayanama.com"
                      className="flex items-center gap-5 text-left group cursor-pointer p-4 rounded-2xl bg-slate-900/60 hover:bg-slate-900/80 border border-white/20 backdrop-blur-md transition-all decoration-transparent shadow-lg"
                    >
                      <div className="h-12 w-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md">
                        <Mail className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-widest text-blue-300">Email Us</p>
                        <p className="text-base lg:text-lg font-bold text-white tracking-wide">info@himalayanama.com</p>
                      </div>
                    </a>
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
