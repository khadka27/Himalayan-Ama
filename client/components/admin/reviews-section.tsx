"use client"

import { useEffect, useState } from "react"
import { Star, Trash2, CheckCircle, MessageSquare } from "lucide-react"
import { toast } from "sonner"
import axiosInstance from "@/services/axios-instance"
import Cookies from "js-cookie"
import Loading from "../loading"
import Swal from "sweetalert2"

interface Review {
  _id: string
  userName: string
  userEmail: string
  rating: number
  review: string
  flat?: {
    flatName: string
  }
  isPublished: boolean
  createdAt: string
}

export function ReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const TOKEN = Cookies.get("auth_token")

  useEffect(() => {
    fetchReviews()
  }, [])

  const fetchReviews = async () => {
    try {
      setIsLoading(true)
      const { data } = await axiosInstance.get("/api/v1/review", {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      })

      if (data.success) {
        setReviews(data.reviews)
      }
    } catch (err) {
      const Err = err as Error
      toast.error(Err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleApprove = async (id: string) => {
    try {
      setIsLoading(true)
      const { data } = await axiosInstance.patch(
        `/api/v1/review/status`,
        { id, status: true },
        {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      )

      if (data.success) {
        setReviews(reviews.map((r) => (r._id === id ? { ...r, isPublished: true } : r)))
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
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#64748b",
      background: "#ffffff",
      color: "#0f172a"
    });

    if (!result.isConfirmed) return;

    try {
      setIsLoading(true)
      const { data } = await axiosInstance.delete(`/api/v1/review/${id}`, {
        headers: { Authorization: `Bearer ${TOKEN}` }
      })
      if (data.success) {
        setReviews(reviews.filter((r) => r._id !== id))
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
            className={i < rating ? "fill-amber-400 text-amber-400" : "text-slate-200"}
          />
        ))}
      </div>
    )
  }

  const getStatusBadge = (isPublished: boolean) => {
    return isPublished ? (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border bg-emerald-50 text-emerald-700 border-emerald-100 uppercase tracking-wider">
        Approved
      </span>
    ) : (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border bg-amber-50 text-amber-700 border-amber-100 uppercase tracking-wider">
        Pending
      </span>
    )
  }

  const pendingCount = reviews.filter((r) => !r.isPublished).length
  const approvedCount = reviews.filter((r) => r.isPublished).length
  const totalCount = reviews.length
  const averageRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : "0.0"

  return (
    <div className="space-y-8">
      {isLoading && <Loading color="rgba(0, 0, 0, 0.3)" />}
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Reviews</p>
          <div className="flex items-end gap-2">
            <p className="text-3xl font-bold text-slate-900">{totalCount}</p>
            <MessageSquare size={16} className="text-slate-300 mb-2" />
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
          <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1">Approved</p>
          <div className="flex items-end gap-2">
            <p className="text-3xl font-bold text-slate-900">{approvedCount}</p>
            <CheckCircle size={16} className="text-emerald-300 mb-2" />
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
          <p className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-1">Pending</p>
          <div className="flex items-end gap-2">
            <p className="text-3xl font-bold text-slate-900">{pendingCount}</p>
            <div className="w-4 h-4 rounded-full bg-amber-100 border-2 border-amber-300 animate-pulse mb-2"></div>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
          <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-1">Avg. Rating</p>
          <div className="flex items-end gap-2">
            <p className="text-3xl font-bold text-slate-900">{averageRating}</p>
            <Star size={16} className="text-blue-300 fill-blue-300 mb-2" />
          </div>
        </div>
      </div>

      {/* Reviews Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
          <h2 className="text-xl font-bold text-slate-900">Guest Feedback</h2>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{totalCount} Total Items</span>
        </div>

        {reviews.length === 0 ? (
          <div className="text-center py-20 px-6">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-slate-200">
              <MessageSquare size={32} />
            </div>
            <p className="text-slate-500 font-medium">No reviews found in the database.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-full">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">Guest</th>
                  <th className="px-8 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">Apartment</th>
                  <th className="px-8 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">Rating</th>
                  <th className="px-8 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">Feedback</th>
                  <th className="px-8 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">Status</th>
                  <th className="px-8 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">Date</th>
                  <th className="px-8 py-4 text-right text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {reviews.map((review) => (
                  <tr key={review._id} className="hover:bg-slate-50/30 transition-colors group">
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-xs font-bold text-blue-600 border border-blue-100">
                          {getInitials(review.userName)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{review.userName}</p>
                          <p className="text-xs font-medium text-slate-400">{review.userEmail}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <span className="text-sm font-bold text-slate-600">{review.flat?.flatName || "Unknown Stay"}</span>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      {renderStars(review.rating)}
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-sm text-slate-600 line-clamp-2 max-w-[250px] font-medium leading-relaxed">
                        "{review.review}"
                      </p>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      {getStatusBadge(review.isPublished)}
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{formatDate(review.createdAt)}</span>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        {!review.isPublished && (
                          <button
                            onClick={() => handleApprove(review._id)}
                            className="bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all p-2.5 rounded-xl border border-emerald-100"
                            title="Approve Review"
                          >
                            <CheckCircle size={18} />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(review._id)}
                          className="bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all p-2.5 rounded-xl border border-red-100"
                          title="Delete Review"
                        >
                          <Trash2 size={18} />
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