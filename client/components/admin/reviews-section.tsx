"use client"

import { useEffect, useState } from "react"
import { Star, Trash2, CheckCircle, XCircle, MessageSquare } from "lucide-react"
import { toast } from "sonner"
import axiosInstance from "@/services/axios-instance"
import Cookies from "js-cookie"
import Loading from "../loading"
import Swal from "sweetalert2"


interface Review {
  id: string
  name: string
  email: string
  rating: number
  review: string
  service: string
  status: boolean
  created_at: string
}

export function ReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const TOKEN = Cookies.get("auth_token")

  useEffect(() => {
    const getReviews = async () => {
      try {
        setIsLoading(true)
        const { data } = await axiosInstance.get("/api/reviews", {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        })

        if (data.status) {
          setReviews(data.data)
        }
      } catch (err) {
        const Err = err as Error
        toast.error(Err.message)
      } finally {
        setIsLoading(false)
      }
    }

    getReviews()
  }, [])



  const handleApprove = async (id: string) => {
    try {
      // Call API to approve the review
      setIsLoading(true)
      const { data } = await axiosInstance.post(
        `/api/reviews/${id}/approve`,
        {},
        {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      )

      if (data.status) {
        setReviews(reviews.map((r) => (r.id === id ? { ...r, status: true } : r)))
        toast.success("Review approved")
      }
    } catch (err) {
      const Err = err as Error
      toast.error(Err.message)
    } finally {
      setIsLoading(false)

    }
  }

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Delete this review?",
      text: "You won't be able to undo this.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
    });
    if (!result.isConfirmed) return;
    try {
      setIsLoading(true)
      const { data } = await axiosInstance.delete(`/api/reviews/${id}`, { headers: { Authorization: `Bearer ${TOKEN}` } })
      if (data.status) {
        setReviews(reviews.filter((r) => r.id !== id))
        toast.success("Review deleted successfully")
      }
    } catch (err) {
      const Err = err as Error
      toast.error(Err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const getInitials = (name?: string | null) => {
    return name
      ?.split(" ")
      .filter(word => word.length > 0)
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "??"
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={16}
            className={i < rating ? "fill-amber-400 text-amber-400" : "text-sage-300"}
          />
        ))}
      </div>
    )
  }

  const getStatusBadge = (status: boolean) => {
    return status ? (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border bg-emerald-100 text-emerald-700 border-emerald-200">
        Approved
      </span>
    ) : (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border bg-amber-100 text-amber-700 border-amber-200">
        Pending
      </span>
    )
  }

  // Calculate counts - these will automatically update when reviews state changes
  const pendingCount = reviews.filter((r) => !r.status).length
  const approvedCount = reviews.filter((r) => r.status).length
  const totalCount = reviews.length
  const averageRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : "0.0"

  if (isLoading) {
    return <Loading color="rgba(0, 0, 0, 0.3)" />
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-sage-200 p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-sage-100 p-3 rounded-lg">
              <MessageSquare size={20} className="text-sage-600" />
            </div>
            <div>
              <p className="text-sm text-sage-600">Total Reviews</p>
              <p className="text-2xl font-bold text-sage-900">{totalCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-sage-200 p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-100 p-3 rounded-lg">
              <CheckCircle size={20} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-sage-600">Approved</p>
              <p className="text-2xl font-bold text-sage-900">
                {approvedCount}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-sage-200 p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-amber-100 p-3 rounded-lg">
              <MessageSquare size={20} className="text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-sage-600">Pending</p>
              <p className="text-2xl font-bold text-sage-900">{pendingCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-sage-200 p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-amber-100 p-3 rounded-lg">
              <Star size={20} className="text-amber-600 fill-amber-600" />
            </div>
            <div>
              <p className="text-sm text-sage-600">Avg. Rating</p>
              <p className="text-2xl font-bold text-sage-900">
                {averageRating}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Table */}
      <div className="bg-white rounded-lg border border-sage-200 shadow-sm overflow-hidden">
        <div className="px-4 sm:px-6 py-4 border-b border-sage-200">
          <h2 className="text-lg font-semibold text-sage-900">All Reviews</h2>
        </div>

        {reviews.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare size={48} className="mx-auto text-sage-300 mb-4" />
            <p className="text-sage-600">No reviews found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-full divide-y divide-sage-200">
              <thead>
                <tr className="bg-sage-50">
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-sage-700 uppercase tracking-wider whitespace-nowrap">
                    Member
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-sage-700 uppercase tracking-wider whitespace-nowrap">
                    Service
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-sage-700 uppercase tracking-wider whitespace-nowrap">
                    Rating
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-sage-700 uppercase tracking-wider">
                    Review
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-sage-700 uppercase tracking-wider whitespace-nowrap">
                    Status
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-sage-700 uppercase tracking-wider whitespace-nowrap">
                    Date
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-sage-700 uppercase tracking-wider whitespace-nowrap">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sage-200 bg-white">
                {reviews.map((review) => (
                  <tr key={review.id} className="hover:bg-sage-50/50 transition-colors">
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-sage-200 rounded-full flex items-center justify-center text-xs font-semibold text-sage-700 shrink-0">
                          {getInitials(review.name)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-sage-900 truncate">{review.name}</p>
                          <p className="text-xs text-sage-600 truncate">{review.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-sage-700">{review.service}</span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      {renderStars(review.rating)}
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <p className="text-sm text-sage-700 line-clamp-1 max-w-[200px]">
                        {review.review}
                      </p>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(review.status)}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-sage-600">{formatDate(review.created_at)}</span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {/* Show approve button only for pending reviews (status = false) */}
                        {!review.status && (
                          <button
                            onClick={() => handleApprove(review.id)}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 hover:bg-emerald-200 transition-colors"
                            title="Approve"
                          >
                            <CheckCircle size={16} />
                          </button>
                        )}

                        {/* Show delete button for all reviews */}
                        <button
                          onClick={() => handleDelete(review.id)}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}