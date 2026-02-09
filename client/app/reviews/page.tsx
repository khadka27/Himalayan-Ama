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
import { Star, Filter, ChevronLeft, ChevronRight, Sparkles, Loader2, Plus } from "lucide-react"
import axiosInstance from "@/services/axios-instance"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Header } from "@/components/layout/header"

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
  const [allServices, setAllServices] = useState<{ id: string; title: string }[]>([])
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
    // Validate form
    if (!formData.name || !formData.email || !formData.review || !formData.service) {
      toast.error("Please fill in all required fields")
      return
    }

    // Validate email
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

      if (data.status) {
        toast.success(data.message || "Review submitted successfully!")
        // Reset form
        setFormData({
          name: "",
          email: "",
          service: "",
          review: "",
        })
        setUserRating(5)
        setIsModalOpen(false)
        // Refresh reviews
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
    fetchServices()
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

  const fetchServices = async () => {
    try {
      const { data } = await axiosInstance.get("/api/services")
      if (data.status) {
        // Extract only id and title for the dropdown
        const servicesList = data.data.map((service: any) => ({
          id: service.id,
          title: service.title,
        }))
        setAllServices(servicesList)
      }
    } catch (err) {
      console.error("Failed to fetch services:", err)
    }
  }

  const filteredReviews = selectedRating ? reviews.filter((review) => review.rating === selectedRating) : reviews

  // Format date from API
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Recent"

    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Get review text (handle both 'comment' and 'review' fields)
  const getReviewText = (review: Review) => {
    return review.comment || review.review || ""
  }

  return (
    <>
    <Header/>
      {/* Hero Section */}
      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden "        style={{
          backgroundImage: `
    linear-gradient(
      rgba(90, 122, 89, 0.6),
      rgba(90, 122, 89, 0.6)
    ),
    url(/banner/review.png)
  `,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}>
        <div
          className="absolute inset-0 bg-cover bg-center opacity-70"
          style={{
            backgroundImage:
              "url(/placeholder.svg?height=600&width=1920&query=people practicing yoga in a serene studio)",
          }}
        />
        <div className="absolute inset-0 bg-[#627A64]/40" />
        <div className="relative container mx-auto flex h-full flex-col items-center justify-center px-6 text-center text-white">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-2 text-sm uppercase tracking-wider text-white/90"
          >
            OUR COMMUNITY
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-4 text-5xl font-bold text-balance"
          >
            Student Reviews
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-2xl text-lg text-white/90 mb-6"
          >
            Read what our students have to say about their yoga journey with us
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button
                  size="lg"
                  className="bg-white text-[#627A64] hover:bg-white/90 font-semibold text-lg px-8 py-6 rounded-full shadow-2xl hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <Plus className="mr-2 h-5 w-5" />
                  Add Your Review
                </Button>
              </DialogTrigger>
            </Dialog>
          </motion.div>
        </div>
      </section>

      <section className="border-b bg-white py-8 shadow-sm">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-4"
          >
            <Filter className="h-5 w-5 text-[#627A64]" />
            <span className="text-sm font-medium text-gray-700">Filter by:</span>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => setSelectedRating(null)}
                className={selectedRating === null ? "bg-[#627A64] hover:bg-[#4A5D4C] shadow-md" : "hover:bg-gray-100"}
                variant={selectedRating === null ? "default" : "outline"}
              >
                All Reviews
              </Button>
              <Button
                size="sm"
                onClick={() => setSelectedRating(5)}
                variant={selectedRating === 5 ? "default" : "outline"}
                className={selectedRating === 5 ? "bg-[#627A64] hover:bg-[#4A5D4C] shadow-md" : "hover:bg-gray-100"}
              >
                ⭐ 5 Stars
              </Button>
              <Button
                size="sm"
                onClick={() => setSelectedRating(4)}
                variant={selectedRating === 4 ? "default" : "outline"}
                className={selectedRating === 4 ? "bg-[#627A64] hover:bg-[#4A5D4C] shadow-md" : "hover:bg-gray-100"}
              >
                ⭐ 4 Stars
              </Button>
              <Button
                size="sm"
                onClick={() => setSelectedRating(3)}
                variant={selectedRating === 3 ? "default" : "outline"}
                className={selectedRating === 3 ? "bg-[#627A64] hover:bg-[#4A5D4C] shadow-md" : "hover:bg-gray-100"}
              >
                ⭐ 3 Stars
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* All Reviews Grid */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-6">
          {isLoading ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, index) => (
                <Card key={index} className="p-8 h-full bg-white border-gray-200 rounded-2xl animate-pulse">
                  <div className="flex items-start gap-4 mb-5">
                    <div className="h-16 w-16 rounded-full bg-gray-200 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="h-5 bg-gray-200 rounded w-32 mb-2" />
                      <div className="h-4 bg-gray-200 rounded w-24 mb-2" />
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <div key={i} className="h-5 w-5 bg-gray-200 rounded-full" />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="h-7 bg-gray-200 rounded-full w-32" />
                  </div>

                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-full" />
                    <div className="h-4 bg-gray-200 rounded w-full" />
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                  </div>
                </Card>
              ))}
            </div>
          ) : filteredReviews.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20 bg-white rounded-2xl shadow-md"
            >
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-gray-600 text-lg">No reviews found matching your filter.</p>
              <Button className="mt-4 bg-[#627A64] hover:bg-[#4A5D4C]" onClick={() => setSelectedRating(null)}>
                View All Reviews
              </Button>
            </motion.div>
          ) : (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
              >
                {filteredReviews.map((review, index) => (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.1 }}
                    transition={{ delay: index * 0.05, duration: 0.4 }}
                    whileHover={{ y: -8, transition: { duration: 0.3 } }}
                  >
                    <Card className="p-8 h-full bg-white border-gray-200 hover:border-[#627A64]/40 hover:shadow-2xl transition-all duration-300 rounded-2xl relative overflow-hidden group">
                      {/* Decorative gradient on hover */}
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#627A64] to-[#4A5D4C] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />

                      <div className="flex items-start gap-4 mb-5">
                        <div className="h-16 w-16 overflow-hidden rounded-full bg-gradient-to-br from-[#627A64] to-[#4A5D4C] flex-shrink-0 ring-4 ring-[#627A64]/10 shadow-lg">
                          {review.avatar_url ? (
                            <img
                              src={review.avatar_url || "/placeholder.svg"}
                              alt={review.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-xl font-bold text-white">
                              {review.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-lg text-gray-900 mb-1">{review.name}</h3>
                          <p className="text-sm text-gray-500 mb-2">{formatDate(review.created_at)}</p>
                          <div className="flex gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-5 w-5 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"}`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>

                      {review.service_title && (
                        <div className="mb-4">
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#627A64]/10 px-4 py-1.5 text-sm font-medium text-[#627A64] border border-[#627A64]/20">
                            <Sparkles className="h-3.5 w-3.5" />
                            {review.service_title}
                          </span>
                        </div>
                      )}

                      <p className="text-base leading-relaxed text-gray-700">{getReviewText(review)}</p>

                      {/* Quote decoration */}
                      <div className="absolute bottom-6 right-8 text-[#627A64]/5 text-8xl font-serif leading-none pointer-events-none">
                        "
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>

              {/* Pagination */}
              {filteredReviews.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="mt-12 flex items-center justify-center gap-3"
                >
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-10 w-10 rounded-full bg-[#627A64] text-white hover:bg-[#4A5D4C] hover:text-white border-[#627A64] shadow-md hover:shadow-lg transition-all"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <span className="px-6 py-2 text-sm font-medium bg-white rounded-full shadow-sm border border-gray-200">
                    Page 1
                  </span>
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-10 w-10 rounded-full hover:bg-[#627A64] hover:text-white border-gray-300 shadow-md hover:shadow-lg transition-all bg-transparent"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </motion.div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Review Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-lg w-[95vw] sm:w-full max-h-[85vh] sm:max-h-[90vh] overflow-y-auto p-0 gap-0 bg-gradient-to-br from-[#627A64]/95 via-[#4A5D4C]/95 to-[#3A4D3C]/95 border-none">
          <div className="p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-4 sm:p-6 shadow-xl bg-white/98 backdrop-blur-sm border-white/50 rounded-2xl">
                <div className="space-y-3 sm:space-y-4">
                  {/* Compact Header */}
                  <div className="text-center pb-2 sm:pb-3 border-b border-gray-200">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900">Share Your Experience</h3>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">We'd love to hear your feedback</p>
                  </div>

                  {/* Form Fields - Compact Spacing */}
                  <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                    {/* Name and Email - 2 columns */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="name" className="text-xs sm:text-sm font-medium text-gray-700">
                          Your Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Enter your full name"
                          required
                          className="h-9 sm:h-10 text-sm border-gray-300 focus:border-[#627A64] focus:ring-[#627A64] rounded-lg"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="email" className="text-xs sm:text-sm font-medium text-gray-700">
                          Your Email <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="your.email@example.com"
                          required
                          className="h-9 sm:h-10 text-sm border-gray-300 focus:border-[#627A64] focus:ring-[#627A64] rounded-lg"
                        />
                      </div>
                    </div>

                    {/* Service Selection */}
                    <div className="space-y-1.5">
                      <Label htmlFor="service" className="text-xs sm:text-sm font-medium text-gray-700">
                        Service You Attended <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        name="service"
                        value={formData.service}
                        onValueChange={(value) => setFormData({ ...formData, service: value })}
                        required
                      >
                        <SelectTrigger className="h-9 sm:h-10 text-sm border-gray-300 focus:border-[#627A64] focus:ring-[#627A64] rounded-lg">
                          <SelectValue placeholder="Choose the service you experienced" />
                        </SelectTrigger>
                        <SelectContent>
                          {allServices.map((service) => (
                            <SelectItem key={service.id} value={service.id}>
                              {service.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Star Rating */}
                    <div className="space-y-2">
                      <Label className="text-xs sm:text-sm font-medium text-gray-700">
                        Your Rating <span className="text-red-500">*</span>
                      </Label>
                      <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-gray-50 rounded-xl border border-gray-200">
                        <div className="flex gap-1 sm:gap-1.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <motion.button
                              key={star}
                              type="button"
                              onClick={() => setRating(star)}
                              className="focus:outline-none transition-transform"
                              whileHover={{ scale: 1.2 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Star
                                className={`h-6 w-6 sm:h-7 sm:w-7 ${
                                  star <= userRating ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-300"
                                } transition-colors duration-200`}
                              />
                            </motion.button>
                          ))}
                        </div>
                        <span className="text-lg sm:text-xl font-bold text-gray-700 ml-auto">
                          {userRating}
                          <span className="text-xs sm:text-sm font-normal text-gray-500"> / 5 stars</span>
                        </span>
                      </div>
                    </div>

                    {/* Review Text */}
                    <div className="space-y-1.5">
                      <Label htmlFor="review" className="text-xs sm:text-sm font-medium text-gray-700">
                        Your Review <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        id="review"
                        name="review"
                        value={formData.review}
                        onChange={handleChange}
                        placeholder="Share your experience with us... Tell us what you loved about your yoga class and how it impacted your journey!"
                        required
                        rows={4}
                        className="text-sm resize-none border-gray-300 focus:border-[#627A64] focus:ring-[#627A64] rounded-lg"
                      />
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-10 sm:h-11 bg-gradient-to-r from-[#627A64] to-[#4A5D4C] hover:from-[#4A5D4C] hover:to-[#3A4D3C] text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        "Submit Review"
                      )}
                    </Button>
                  </form>
                </div>
              </Card>
            </motion.div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Floating Add Review Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button
              size="lg"
              className="bg-[#627A64] hover:bg-[#4A5D4C] text-white font-semibold px-6 py-6 rounded-full shadow-2xl hover:shadow-xl transition-all duration-300 hover:scale-110"
            >
              <Plus className="h-6 w-6" />
            </Button>
          </DialogTrigger>
        </Dialog>
      </div>

      <Footer />
    </>
  )
}
