"use client"

import { useEffect, useState } from "react"
import { CheckCircle, Clock, Mail, Users, Calendar, Banknote, Trash2, XCircle } from "lucide-react"
import axiosInstance from "@/services/axios-instance"
import Swal from "sweetalert2"
import Loading from "../loading"
import Cookies from "js-cookie"
import { toast } from "sonner"

interface Booking {
  _id: string
  userName: string
  email: string
  flat?: {
    flatName: string
    price: number
  }
  startDate: string
  endDate: string
  isVerified: boolean
  status?: string
  createdAt: string
  // For backward compatibility or extra info
  participants?: number
  phone?: string
}

export function Bookings() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const TOKEN = Cookies.get("auth_token");

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      setIsLoading(true)
      const { data } = await axiosInstance.get("/api/v1/bookings", {
        headers: {
          Authorization: `Bearer ${TOKEN}`
        }
      })

      if (data.success) {
        setBookings(data.bookings);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error)
      toast.error("Failed to load bookings")
    } finally {
      setIsLoading(false)
    }
  }

  const handleConfirm = async (id: string) => {
    try {
      setIsLoading(true)
      const { data } = await axiosInstance.patch(`/api/v1/bookings/status`,
        { id, isVerified: true },
        {
          headers: {
            Authorization: `Bearer ${TOKEN}`
          }
        })

      if (data.success) {
        if (data.status === "overlap") {
          toast.info("Overlap detected. Booking marked as 'overlap' and user notified.")
        } else {
          toast.success("Booking confirmed")
        }

        setBookings(bookings.map((booking) =>
          booking._id === id ? { ...booking, isVerified: data.status === "confirmed", status: data.status } : booking
        ))
      }
    } catch (error) {
      console.error("Error confirming booking:", error)
      toast.error("Failed to confirm booking")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeny = async (id: string, userName: string) => {
    const result = await Swal.fire({
      title: "Deny Booking?",
      text: `Are you sure you want to deny ${userName}'s booking request? An email notification will be sent.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Deny it",
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#64748b"
    });

    if (!result.isConfirmed) return;

    try {
      setIsLoading(true)
      const { data } = await axiosInstance.delete(`/api/v1/bookings/${id}`, {
        headers: { Authorization: `Bearer ${TOKEN}` }
      })

      if (data.success) {
        toast.success("Booking request denied and user notified")
        setBookings(bookings.map((b) => b._id === id ? { ...b, status: "rejected", isVerified: false } : b))
      }
    } catch (error) {
      console.error("Error denying booking:", error)
      toast.error("Failed to deny booking")
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  const formatCurrency = (amount: number) => {
    return `Rs. ${new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 0
    }).format(amount)}`
  }

  const calculateDuration = (start: string, end: string) => {
    const s = new Date(start)
    const e = new Date(end)
    const diffTime = Math.abs(e.getTime() - s.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays || 1
  }






  const pendingCount = bookings.filter(b => !b.isVerified).length
  const confirmedCount = bookings.filter(b => b.isVerified).length
  const totalRevenue = bookings
    .filter(b => b.isVerified)
    .reduce((acc, b) => {
      const days = calculateDuration(b.startDate, b.endDate)
      return acc + (b.flat?.price || 0) * days
    }, 0)

  return (
    <div className="space-y-8">
      {isLoading && <Loading color="rgba(0, 0, 0, 0.3)" />}
      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Bookings</p>
          <div className="flex items-end gap-2">
            <p className="text-3xl font-bold text-slate-900">{bookings.length}</p>
            <Calendar size={16} className="text-slate-300 mb-2" />
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
          <p className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-1">Pending</p>
          <div className="flex items-end gap-2">
            <p className="text-3xl font-bold text-slate-900">{pendingCount}</p>
            <Clock size={16} className="text-amber-300 mb-2" />
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
          <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1">Confirmed</p>
          <div className="flex items-end gap-2">
            <p className="text-3xl font-bold text-slate-900">{confirmedCount}</p>
            <CheckCircle size={16} className="text-emerald-300 mb-2" />
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
          <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-1">Est. Revenue</p>
          <div className="flex items-end gap-2">
            <p className="text-2xl font-bold text-slate-900">{formatCurrency(totalRevenue)}</p>
            <Banknote size={16} className="text-blue-300 mb-2" />
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
          <h2 className="text-xl font-bold text-slate-900">Apartment Inquiries</h2>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{bookings.length} Total</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-full">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 whitespace-nowrap">Guest</th>
                <th className="px-8 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 whitespace-nowrap">Property</th>
                <th className="px-8 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 whitespace-nowrap">Stay Window</th>
                <th className="px-8 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 whitespace-nowrap">Details</th>
                <th className="px-8 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 whitespace-nowrap">Status</th>
                <th className="px-8 py-4 text-right text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {bookings.map((booking) => (
                <tr key={booking._id} className="hover:bg-slate-50/30 transition-colors group">
                  <td className="px-8 py-6 whitespace-nowrap">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-xs font-bold text-blue-600 border border-blue-100">
                        {booking.userName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{booking.userName}</p>
                        <p className="text-xs font-medium text-slate-400">{booking.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap">
                    <span className="text-sm font-bold text-slate-600">{booking.flat?.flatName || "Unknown Property"}</span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                        <Calendar size={12} className="text-blue-400" />
                        {formatDate(booking.startDate)}
                      </div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter px-5">
                        to {formatDate(booking.endDate)}
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                        <Users size={12} className="text-slate-300" />
                        <span>{booking.participants || 1} Guests</span>
                      </div>
                      <div className="text-sm font-bold text-slate-900">
                        {formatCurrency((booking.flat?.price || 0) * calculateDuration(booking.startDate, booking.endDate))}
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap">
                    {booking.status === "overlap" ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold border bg-red-50 text-red-700 border-red-100 uppercase tracking-wider">
                        <XCircle size={10} /> Overlap
                      </span>
                    ) : booking.status === "rejected" ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold border bg-slate-100 text-slate-500 border-slate-200 uppercase tracking-wider">
                        <XCircle size={10} /> Denied
                      </span>
                    ) : booking.isVerified ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold border bg-emerald-50 text-emerald-700 border-emerald-100 uppercase tracking-wider">
                        <CheckCircle size={10} /> Confirmed
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold border bg-amber-50 text-amber-700 border-amber-100 uppercase tracking-wider">
                        <Clock size={10} /> Pending
                      </span>
                    )}
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      {!booking.isVerified && booking.status !== "overlap" && (
                        <button
                          onClick={() => handleConfirm(booking._id)}
                          className="bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all p-2.5 rounded-xl border border-emerald-100"
                          title="Confirm Booking"
                        >
                          <CheckCircle size={18} />
                        </button>
                      )}
                      {!booking.isVerified && booking.status !== "rejected" && (
                        <button
                          onClick={() => handleDeny(booking._id, booking.userName)}
                          className="bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all p-2.5 rounded-xl border border-red-100"
                          title="Deny request"
                        >
                          <XCircle size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {bookings.length === 0 && (
            <div className="text-center py-20 px-6">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-slate-200">
                <Calendar size={32} />
              </div>
              <p className="text-slate-500 font-medium">No booking inquiries found yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}