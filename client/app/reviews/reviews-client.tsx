"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, Filter, Sparkles, Loader2, Plus, MessageSquare, Home, ExternalLink, CheckCircle2 } from "lucide-react"
import axiosInstance from "@/services/axios-instance"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Header } from "@/components/layout/header"
import Hero from "@/components/hero"
import { useApp } from "@/context/AppContext"

interface Flat {
  _id: string
  flatName: string
}

interface Review {
  _id: string
  userName: string
  userEmail: string
  review: string
  rating: number
  flat?: {
    flatName: string
  }
  createdAt?: string
}

interface FeaturedGoogleReview {
  id: string
  name: string
  rating: number
  dateText: string
  reviewText: string
  googleUrl: string
}

export default function ReviewsPageClient() {
  const { flats } = useApp()

  const [selectedRating, setSelectedRating] = useState<number | null>(null)
  const [userRating, setUserRating] = useState(5)
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [dynamicReviews, setDynamicReviews] = useState<Review[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Featured Google Reviews provided by client
  const googleReviews: FeaturedGoogleReview[] = [
    {
      id: "g1",
      name: "Krishna Thapa",
      rating: 5,
      dateText: "Google Review · 3 months ago",
      reviewText: "Straight from the trekking and we're dead until 10am with pindrop silence. Complimentary breakfast to understand our situation by Shyam, felt a motherly home away from the home. It's small paradise and this has magnets as we extended our staying.",
      googleUrl: "https://share.google/AaVqVqlYDoqvyYMzv",
    },
    {
      id: "g2",
      name: "Khangsar Tenzin Sangpo",
      rating: 5,
      dateText: "Google Review · 3 months ago",
      reviewText: "Spent totally 1 week with full of silence and peaceful. Very supportive host. Walking distance for lakeside. Hiking to Sarangkot. Fresh Veg from the Garden. Self practice yoga. Well equipped kitchen",
      googleUrl: "https://share.google/UX1ss7d09ZLaWJ2lx",
    },
    {
      id: "g3",
      name: "Aarsang",
      rating: 5,
      dateText: "Google Review · 3 months ago",
      reviewText: "I along with my family absolutely enjoyed a week here. It's just 5km away from the lakeside and yet small paradise with Yogic energy and people around. We were invited for their sound healing as gesture of pure love/care which we are still resonating. Susmita is always there to cook for you whenever you're bored to cook. The sound of the birds and trees scenarios are unmatched to anything around. The host Shyam and Pema are pure gem",
      googleUrl: "https://share.google/TNtJsc5YDCG2QqLNt",
    },
    {
      id: "g4",
      name: "Ngawang Tsering",
      rating: 5,
      dateText: "Google Review · 2 months ago",
      reviewText: "Small paradise is located in the hills of Khapaudi village. Surrounded by paddy fields, smell of fruits trees and songs of the birds/insects where Host Mr. SHYAM is Always there to assist and taking care of you. The apartment is tidy with well maintained equipped. Susmita is 24/7 to look around. Well valued of the money you paid.",
      googleUrl: "https://share.google/Atko6ohWyjEcW9HUa",
    },
    {
      id: "g5",
      name: "Jampa Lekdhen",
      rating: 5,
      dateText: "Google Review · 10 months ago",
      reviewText: "Seeing the Phewalake throughout the day and listening to music of birds/insects have been very nostalgic. Complimentary lunch and access to yoga hall. Freshly picked mint and holy basil tea. I'll certainly comeback.",
      googleUrl: "https://share.google/2GVbgzo9nybnpjT1N",
    },
    {
      id: "g6",
      name: "Denisha Gurung",
      rating: 5,
      dateText: "Google Review · 10 months ago",
      reviewText: "Lovely place with so much nature to offering. Listening to those insect and birds singing were so soothing. We're offered the dinner at first night with big smile. Very tranquility throughout the day and night. A lot spot for short hiking.",
      googleUrl: "https://share.google/2ugo6EGTF9B1r8aXm",
    },
    {
      id: "g7",
      name: "Tsering Norbu",
      rating: 5,
      dateText: "Google Review · a year ago",
      reviewText: "Very tranquil and spiritual place to be. The Host Shyam and his teams were all the time assisting as well as making you FEEL like a home. Spent 5nights. I wish; I could stay longer. Freshly picked vegetables from the garden.",
      googleUrl: "https://share.google/6yMR9FhJGsJ1c6NGr",
    },
  ]

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    service: "",
    review: "",
  })

  const allFlats = flats.map((flat: Flat) => ({
    id: flat._id,
    title: flat.flatName
  }))

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const setRating = (star: number) => {
    setUserRating(star)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.review || !formData.service) {
      toast.error("Please fill in all required fields")
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
        userName: formData.name,
        userEmail: formData.email,
        rating: userRating,
        review: formData.review,
        flat: formData.service,
      }

      const { data } = await axiosInstance.post("/api/v1/review", payload)

      if (data.status || data.success) {
        toast.success(data.message || "Review submitted successfully!")
        setFormData({
          name: "",
          email: "",
          service: "",
          review: "",
        })
        setUserRating(5)
        setIsModalOpen(false)
        fetchReviews()
      } else {
        toast.error(data.message || "Failed to submit review")
      }
    } catch (err) {
      const error = err as Error
      toast.error(error.message || "An error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    fetchReviews()
  }, [])

  const fetchReviews = async () => {
    try {
      setIsLoading(true)
      const { data } = await axiosInstance.get("/api/v1/review/publishable")
      if (data.status || data.success) {
        setDynamicReviews(data.reviews || [])
      }
    } catch (err) {
      const error = err as Error
      toast.error(error.message || "Failed to load reviews")
    } finally {
      setIsLoading(false)
    }
  }

  const filteredGoogleReviews = selectedRating
    ? googleReviews.filter((r) => r.rating === selectedRating)
    : googleReviews

  const filteredDynamicReviews = selectedRating
    ? dynamicReviews.filter((r) => r.rating === selectedRating)
    : dynamicReviews

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Recent"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      {/* Hero */}
      <Hero
        title="Guest Reviews & Experiences at Himalayan Ama"
        description="See what travelers say about their stay at Himalayan Ama and their experience of a comfortable, home-like stay in Lakeside, Pokhara."
        image="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop"
      />

      {/* Main H1 Title Header */}
      <section className="py-16 bg-white border-b border-slate-100">
        <div className="container mx-auto px-6 max-w-4xl text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-4 py-2 rounded-full border border-blue-100 inline-block">
            Verified Feedback
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight leading-tight">
            Guest Reviews & Experiences at <span className="text-blue-600">Himalayan Ama</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 font-medium leading-relaxed max-w-3xl mx-auto">
            See what travelers say about their stay at Himalayan Ama and their experience of a comfortable, home-like stay in Lakeside, Pokhara.
          </p>
        </div>
      </section>

      {/* Filters Bar */}
      <section className="bg-white/80 backdrop-blur-md py-6 shadow-sm border-b border-gray-100 sticky top-0 z-30">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3 text-gray-500 font-bold uppercase tracking-widest text-xs">
              <Filter className="h-4 w-4 text-blue-600" />
              <span>Filter By Rating</span>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
              <Button
                size="sm"
                onClick={() => setSelectedRating(null)}
                className={`rounded-xl px-6 py-5 font-bold transition-all ${selectedRating === null
                  ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-100"
                  : "text-gray-500 hover:bg-gray-100"
                  }`}
                variant={selectedRating === null ? "default" : "ghost"}
              >
                All Stories ({googleReviews.length + dynamicReviews.length})
              </Button>
              {[5, 4, 3].map((val) => (
                <Button
                  key={val}
                  size="sm"
                  onClick={() => setSelectedRating(val)}
                  variant={selectedRating === val ? "default" : "ghost"}
                  className={`rounded-xl px-6 py-5 font-bold transition-all whitespace-nowrap ${selectedRating === val
                    ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-100"
                    : "text-gray-500 hover:bg-gray-100"
                    }`}
                >
                  <Star className={`mr-2 h-4 w-4 ${selectedRating === val ? 'fill-white' : 'fill-blue-400 text-blue-400'}`} />
                  {val} Stars
                </Button>
              ))}
            </div>

            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl px-6 py-5 shadow-lg shadow-blue-200 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              Write a Review
            </Button>
          </div>
        </div>
      </section>

      {/* Reviews Grid */}
      <section className="py-24">
        <div className="container mx-auto px-6 space-y-16">

          {/* Verified Google Reviews */}
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="h-3 w-3 rounded-full bg-emerald-500" />
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Verified Google Reviews</h2>
            </div>

            <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
              {filteredGoogleReviews.map((review, index) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                >
                  <Card className="p-8 h-full bg-white border border-gray-100 shadow-xl hover:shadow-2xl transition-all duration-500 rounded-[36px] group flex flex-col justify-between">
                    <div className="space-y-6">
                      <div className="flex items-start gap-4">
                        <div className="h-16 w-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-2xl ring-4 ring-blue-50/50 shadow-inner group-hover:scale-105 transition-transform">
                          {review.name.charAt(0)}
                        </div>
                        <div className="space-y-1">
                          <h3 className="font-bold text-xl text-gray-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">
                            {review.name}
                          </h3>
                          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Verified Google Review
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`h-4 w-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-100 text-gray-100"}`} />
                          ))}
                        </div>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{review.dateText}</span>
                      </div>

                      <p className="text-base leading-relaxed text-gray-600 font-medium italic grow">
                        &quot;{review.reviewText}&quot;
                      </p>
                    </div>

                    <div className="pt-6 mt-6 border-t border-slate-100">
                      <a
                        href={review.googleUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline transition-all"
                      >
                        <span>View Original Review on Google</span>
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Dynamic Platform Reviews (If Any) */}
          {filteredDynamicReviews.length > 0 && (
            <div className="space-y-8 pt-10 border-t border-slate-200">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-blue-600" />
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Himalayan Ama Guest Stories</h2>
              </div>

              <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
                {filteredDynamicReviews.map((review, index) => (
                  <motion.div
                    key={review._id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.08 }}
                  >
                    <Card className="p-8 h-full bg-white border border-gray-100 shadow-xl hover:shadow-2xl transition-all duration-500 rounded-[36px] group flex flex-col justify-between">
                      <div className="space-y-6">
                        <div className="flex items-start gap-4">
                          <div className="h-16 w-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-2xl ring-4 ring-blue-50/50 shadow-inner group-hover:scale-105 transition-transform">
                            {review.userName.charAt(0)}
                          </div>
                          <div>
                            <h3 className="font-bold text-xl text-gray-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{review.userName}</h3>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{formatDate(review.createdAt)}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`h-4 w-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-100 text-gray-100"}`} />
                          ))}
                        </div>

                        {review.flat?.flatName && (
                          <div>
                            <span className="inline-flex items-center gap-2 rounded-xl bg-slate-50 px-4 py-2 text-xs font-bold text-blue-600 border border-blue-50">
                              <Home className="h-3.5 w-3.5" />
                              {review.flat.flatName}
                            </span>
                          </div>
                        )}

                        <p className="text-base leading-relaxed text-gray-600 font-medium italic grow">
                          &quot;{review.review || ""}&quot;
                        </p>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

        </div>
      </section>

      {/* H2 Section: Experiences Shared by Real Travelers */}
      <section className="py-20 bg-blue-600 text-white border-t border-blue-500">
        <div className="container mx-auto px-6 max-w-4xl text-center space-y-6">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-200 bg-white/10 px-4 py-2 rounded-full inline-block backdrop-blur-md">
            Memories in Pokhara
          </span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            Experiences Shared by Real Travelers
          </h2>
          <p className="text-lg md:text-xl text-blue-100 font-medium leading-relaxed max-w-3xl mx-auto">
            From trekkers looking for peaceful rest to families, solo travelers, and guests staying longer in Pokhara, every visit brings a different story. Read more verified guest experiences and discover what staying at Himalayan Aama can feel like.
          </p>
          <div className="pt-4">
            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-white text-blue-600 hover:bg-blue-50 font-bold text-lg h-16 px-10 rounded-2xl shadow-xl transition-all hover:scale-105"
            >
              Share Your Own Experience
            </Button>
          </div>
        </div>
      </section>

      {/* Review Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl w-[95vw] p-0 border-none bg-transparent shadow-none overflow-hidden">
          <Card className="p-10 shadow-2xl bg-white rounded-[40px] border-none">
            <div className="space-y-8">
              <div className="text-center space-y-2">
                <div className="h-14 w-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="h-7 w-7" />
                </div>
                <DialogTitle className="text-3xl font-bold text-gray-900 tracking-tight">Share Your Experience</DialogTitle>
                <p className="text-gray-500 font-medium">Your feedback helps us provide better Nepalese hospitality.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-widest text-gray-400">Your Full Name</Label>
                    <Input name="name" value={formData.name} onChange={handleChange} placeholder="Your Name" className="h-14 rounded-2xl bg-gray-50 border-none focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all font-medium" required />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-widest text-gray-400">Email Address</Label>
                    <Input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="example@gmail.com" className="h-14 rounded-2xl bg-gray-50 border-none focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all font-medium" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-gray-400">Which Apartment?</Label>
                  <Select name="service" value={formData.service} onValueChange={(value) => setFormData({ ...formData, service: value })} required>
                    <SelectTrigger className="w-full h-14 rounded-2xl bg-gray-50 border-none focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all font-medium">
                      <SelectValue placeholder="Select your stay" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-none shadow-2xl">
                      {allFlats.map((flat: { id: string; title: string }) => (
                        <SelectItem key={flat.id} value={flat.id} className="rounded-xl py-3 font-medium">{flat.title}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <Label className="text-xs font-bold uppercase tracking-widest text-gray-400">Overall Rating</Label>
                  <div className="flex items-center justify-center gap-4 p-8 bg-blue-50 rounded-3xl">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button key={star} type="button" onClick={() => setRating(star)} className="transition-transform active:scale-90">
                        <Star className={`h-10 w-10 ${star <= userRating ? "fill-yellow-400 text-yellow-400" : "fill-blue-100 text-blue-100"}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-gray-400">Your Story</Label>
                  <Textarea name="review" value={formData.review} onChange={handleChange} placeholder="Tell us about the highlights of your stay..." className="min-h-[150px] rounded-2xl bg-gray-50 border-none focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all font-medium p-6" required />
                </div>

                <Button type="submit" disabled={isSubmitting} className="w-full h-16 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-xl shadow-blue-100 transition-all text-lg">
                  {isSubmitting ? <Loader2 className="animate-spin" /> : "Publish Review"}
                </Button>
              </form>
            </div>
          </Card>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  )
}
