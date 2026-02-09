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
import { Star, Filter, ChevronLeft, ChevronRight, Sparkles, Loader2, Plus, MessageSquare } from "lucide-react"
import axiosInstance from "@/services/axios-instance"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Header } from "@/components/layout/header"
import Hero from "@/components/hero"

interface Review {
  id: string
  name: string
  comment?: string
  review?: string
  rating: number
  service_title?: string
  created_at?: string
  avatar_url?: string
}

export default function ReviewsPage() {
  const [selectedRating, setSelectedRating] = useState<number | null>(null)
  const [userRating, setUserRating] = useState(5)
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [reviews, setReviews] = useState<Review[]>([])
  const [allFlats, setAllFlats] = useState<{ id: string; title: string }[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    service: "",
    review: "",
  })

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
        name: formData.name,
        email: formData.email,
        rating: userRating,
        review: formData.review,
        service_id: formData.service,
      }

      const { data } = await axiosInstance.post("/api/reviews", payload)

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
    fetchFlats()
  }, [])

  const fetchReviews = async () => {
    try {
      setIsLoading(true)
      const { data } = await axiosInstance.get("/api/reviews/publishable")
      if (data.status) {
        setReviews(data.data)
      }
    } catch (err) {
      const error = err as Error
      toast.error(error.message || "Failed to load reviews")
    } finally {
      setIsLoading(false)
    }
  }

  const fetchFlats = async () => {
    try {
      const { data } = await axiosInstance.get("/api/v1/flats")
      if (data.success) {
        const flatsList = data.flats.map((flat: any) => ({
          id: flat._id,
          title: flat.flatName,
        }))
        setAllFlats(flatsList)
      }
    } catch (err) {
      console.error("Failed to fetch apartments:", err)
    }
  }

  const filteredReviews = selectedRating ? reviews.filter((review) => review.rating === selectedRating) : reviews

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Recent"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getReviewText = (review: Review) => {
    return review.comment || review.review || ""
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <Hero
        title="Guest Experiences"
        description="Authentic feedback from travelers who called Himalayan Ama their home."
        image="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop"
      />

      <section className="bg-white/80 backdrop-blur-md py-6 shadow-sm sticky top-20 z-10 border-b border-gray-100">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <div className="flex items-center gap-3 text-gray-500 font-bold uppercase tracking-widest text-xs">
              <Filter className="h-4 w-4 text-blue-500" />
              <span>Filter By Rating</span>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
              <Button
                size="sm"
                onClick={() => setSelectedRating(null)}
                className={`rounded-xl px-6 py-5 font-bold transition-all ${selectedRating === null
                    ? "bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-100"
                    : "text-gray-500 hover:bg-gray-100"
                  }`}
                variant={selectedRating === null ? "default" : "ghost"}
              >
                All Stories
              </Button>
              {[5, 4, 3].map((val) => (
                <Button
                  key={val}
                  size="sm"
                  onClick={() => setSelectedRating(val)}
                  variant={selectedRating === val ? "default" : "ghost"}
                  className={`rounded-xl px-6 py-5 font-bold transition-all whitespace-nowrap ${selectedRating === val
                      ? "bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-100"
                      : "text-gray-500 hover:bg-gray-100"
                    }`}
                >
                  <Star className={`mr-2 h-4 w-4 ${selectedRating === val ? 'fill-white' : 'fill-blue-400 text-blue-400'}`} />
                  {val} Stars
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-6">
          {isLoading ? (
            <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="p-10 h-full bg-white border-none rounded-[40px] animate-pulse shadow-xl">
                  <div className="flex items-start gap-5 mb-8">
                    <div className="h-20 w-20 rounded-full bg-gray-100" />
                    <div className="flex-1 space-y-3">
                      <div className="h-6 bg-gray-100 rounded-xl w-3/4" />
                      <div className="h-4 bg-gray-100 rounded-xl w-1/2" />
                    </div>
                  </div>
                  <div className="h-24 bg-gray-100 rounded-2xl w-full" />
                </Card>
              ))}
            </div>
          ) : filteredReviews.length === 0 ? (
            <div className="text-center py-32 bg-white rounded-[40px] shadow-sm border border-gray-100 max-w-4xl mx-auto">
              <div className="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-50 text-blue-500 mb-6">
                <MessageSquare className="h-10 w-10" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No experiences shared yet here.</h3>
              <p className="text-gray-500 font-medium mb-8">Be the first to tell others about your stay!</p>
              <Button className="bg-blue-500 hover:bg-blue-600 rounded-2xl h-12 px-8 font-bold" onClick={() => setSelectedRating(null)}>
                View All Reviews
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
              {filteredReviews.map((review, index) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-10 h-full bg-white border-none shadow-xl hover:shadow-2xl transition-all duration-500 rounded-[40px] group flex flex-col">
                    <div className="flex items-start gap-5 mb-8">
                      <div className="h-20 w-20 rounded-[30px] bg-blue-50 flex items-center justify-center ring-8 ring-blue-50/50 shadow-inner group-hover:scale-110 transition-transform duration-500">
                        {review.avatar_url ? (
                          <img src={review.avatar_url} alt={review.name} className="w-full h-full object-cover rounded-[30px]" />
                        ) : (
                          <span className="text-3xl font-bold text-blue-500">{review.name.charAt(0)}</span>
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-xl text-gray-900 mb-1 group-hover:text-blue-500 transition-colors uppercase tracking-tight">{review.name}</h3>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{formatDate(review.created_at)}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 mb-6">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-5 w-5 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-100 text-gray-100"}`} />
                      ))}
                    </div>

                    {review.service_title && (
                      <div className="mb-6">
                        <span className="inline-flex items-center gap-2 rounded-xl bg-slate-50 px-4 py-2 text-xs font-bold text-blue-600 border border-blue-50">
                          <Home className="h-3.5 w-3.5" />
                          {review.service_title}
                        </span>
                      </div>
                    )}

                    <p className="text-lg leading-relaxed text-gray-600 font-medium italic grow">"{getReviewText(review)}"</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Review Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl w-[95vw] p-0 border-none bg-transparent shadow-none overflow-hidden">
          <Card className="p-10 shadow-2xl bg-white rounded-[40px] border-none">
            <div className="space-y-8">
              <div className="text-center space-y-2">
                <div className="h-14 w-14 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="h-7 w-7" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 tracking-tight">Share Your Experience</h3>
                <p className="text-gray-500 font-medium">Your feedback helps us provide better Nepalese hospitality.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-widest text-gray-400">Your Full Name</Label>
                    <Input name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" className="h-14 rounded-2xl bg-gray-50 border-none focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all font-medium" required />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-widest text-gray-400">Email Address</Label>
                    <Input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="john@example.com" className="h-14 rounded-2xl bg-gray-50 border-none focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all font-medium" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-gray-400">Which Apartment?</Label>
                  <Select name="service" value={formData.service} onValueChange={(value) => setFormData({ ...formData, service: value })} required>
                    <SelectTrigger className="h-14 rounded-2xl bg-gray-50 border-none focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all font-medium">
                      <SelectValue placeholder="Select your stay" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-none shadow-2xl">
                      {allFlats.map((flat) => (
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

                <Button type="submit" disabled={isSubmitting} className="w-full h-16 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-2xl shadow-xl shadow-blue-100 transition-all text-lg">
                  {isSubmitting ? <Loader2 className="animate-spin" /> : "Publish Review"}
                </Button>
              </form>
            </div>
          </Card>
        </DialogContent>
      </Dialog>

      {/* Floating Add Review Button */}
      <div className="fixed bottom-10 right-10 z-50">
        <Button
          size="lg"
          onClick={() => setIsModalOpen(true)}
          className="h-20 w-20 rounded-3xl bg-blue-500 hover:bg-blue-600 text-white shadow-2xl hover:shadow-blue-200 transition-all hover:scale-110 active:scale-95 flex items-center justify-center p-0"
        >
          <Plus className="h-10 w-10" />
        </Button>
      </div>

      <Footer />
    </div>
  )
}
