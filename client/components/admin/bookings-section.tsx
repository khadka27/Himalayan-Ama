"use client"

import { useEffect, useState } from "react"
import { CheckCircle, Clock, Mail, Users, Calendar, DollarSign } from "lucide-react"
import axiosInstance from "@/services/axios-instance"
import Swal from "sweetalert2"
import Loading from "../loading"
import Cookies from "js-cookie"
import { toast } from "sonner"

interface Booking {
  id: string
  userName: string
  userEmail: string
  service: string
  fromDate: string
  toDate: string
  time: string
  status: "confirmed" | "pending" | "cancelled"
  participants: number
  price: number
}

export function Bookings() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const TOKEN = Cookies.get("auth_token");

  useEffect(() => {
    const getBookings = async () => {
      try {
        setIsLoading(true)
        const { data } = await axiosInstance.get("/api/bookings", {
          headers: {
            Authorization: `Bearer ${TOKEN}`
          }
        })

        if (data.status) {
          setBookings(data.data);
        }
      } catch (error) {
        console.error("Error fetching bookings:", error)
      } finally {
        setIsLoading(false)
      }
    }

    getBookings()
  }, [])

  const handleConfirm = async (id: string) => {
    try {
      setIsLoading(true)
      const { data } = await axiosInstance.put(`/api/bookings/${id}/status`,
        { status: "confirmed" },
        {
          headers: {
            Authorization: `Bearer ${TOKEN}`
          }
        })

      if (data.status) {
        toast.success(data.message || "Booking confirmed")
        setBookings(bookings.map((booking) =>
          booking.id === id ? { ...booking, status: "confirmed" as const } : booking
        ))
      }
    } catch (error) {
      console.error("Error fetching bookings:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = async (id: string) => {
    const result = await Swal.fire({
      title: "Cancel this booking?",
      text: "You won't be able to undo this.",
      icon: "warning",
      showCancelButton: false,
      confirmButtonText: "Delete",
    });
    if (!result.isConfirmed) return;

    try {
      setIsLoading(true)
      const { data } = await axiosInstance.put(`/api/bookings/${id}/status`,
        { status: "cancelled" },
        {
          headers: {
            Authorization: `Bearer ${TOKEN}`
          }
        })

      if (data.status) {
        toast.success(data.message || "Booking confirmed")
        setBookings(bookings.map((booking) =>
          booking.id === id ? { ...booking, status: "cancelled" as const } : booking
        ))
      }
    } catch (error) {
      console.error("Error fetching bookings:", error)
    } finally {
      setIsLoading(false)
    }


  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-700 border-green-200"
      case "pending":
        return "bg-terracotta-100 text-terracotta-700 border-terracotta-200"
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-200"
      default:
        return "bg-sage-100 text-sage-700 border-sage-200"
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
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'NPR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  if (isLoading) {
    return (
      <Loading color="rgba(0, 0, 0, 0.3)" />
    )
  }

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-serif font-bold text-sage-900">Bookings Management</h2>
        <p className="text-sage-600 mt-2">Manage all yoga class bookings and schedules</p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-sage-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-sage-600">Total Bookings</p>
              <p className="text-2xl font-bold text-sage-900">{bookings.length}</p>
            </div>
            <div className="bg-sage-100 p-3 rounded-lg">
              <Calendar size={20} className="text-sage-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-sage-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-sage-600">Pending</p>
              <p className="text-2xl font-bold text-sage-900">
                {bookings.filter(b => b.status === "pending").length}
              </p>
            </div>
            <div className="bg-terracotta-100 p-3 rounded-lg">
              <Clock size={20} className="text-terracotta-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-sage-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-sage-600">Confirmed</p>
              <p className="text-2xl font-bold text-sage-900">
                {bookings.filter(b => b.status === "confirmed").length}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <CheckCircle size={20} className="text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-sage-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-sage-600">Total Revenue</p>
              <p className="text-2xl font-bold text-sage-900">
                {formatCurrency(bookings.reduce((acc, b) => acc + b.price, 0))}
              </p>
            </div>
            <div className="bg-amber-100 p-3 rounded-lg">
              <DollarSign size={20} className="text-amber-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-lg border border-sage-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-full">
            <thead className="bg-sage-50 border-b border-sage-200">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-sage-900 uppercase tracking-wider whitespace-nowrap">
                  Customer
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-sage-900 uppercase tracking-wider whitespace-nowrap">
                  Service
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-sage-900 uppercase tracking-wider whitespace-nowrap">
                  Date Range
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-sage-900 uppercase tracking-wider whitespace-nowrap">
                  Time
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-sage-900 uppercase tracking-wider whitespace-nowrap">
                  Details
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-sage-900 uppercase tracking-wider whitespace-nowrap">
                  Status
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-sage-900 uppercase tracking-wider whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sage-200">
              {bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-sage-50/50 transition-colors">
                  <td className="px-4 sm:px-6 py-4">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-sage-900 truncate">{booking.userName}</p>
                      <p className="text-xs text-sage-600 truncate flex items-center gap-1 mt-1">
                        <Mail size={12} />
                        {booking.userEmail}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-sage-700 font-medium">{booking.service}</span>
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <div className="text-sm text-sage-700">
                      <div className="flex items-center gap-1">
                        <Calendar size={12} />
                        {formatDate(booking.fromDate)}
                      </div>
                      <div className="text-xs text-sage-500 ml-4">
                        to {formatDate(booking.toDate)}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-sage-600">{booking.time}</span>
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-sm text-sage-700">
                        <Users size={14} />
                        <span>{booking.participants} {booking.participants === 1 ? 'person' : 'people'}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm font-medium text-sage-900">
                        <span>{formatCurrency(booking.price)}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <div className="flex items-center gap-2">
                      {booking.status === "pending" && (
                        <button
                          onClick={() => handleConfirm(booking.id)}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
                          title="Confirm Booking"
                        >
                          <CheckCircle size={16} />
                        </button>
                      )}
                      {booking.status !== "cancelled" && (
                        <button
                          onClick={() => handleCancel(booking.id)}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                          title="Cancel Booking"
                        >
                          <Clock size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {bookings.length === 0 && (
          <div className="text-center py-12">
            <Calendar size={48} className="mx-auto text-sage-300 mb-4" />
            <p className="text-sage-600">No bookings found</p>
            <p className="text-sm text-sage-500 mt-1">All bookings will appear here</p>
          </div>
        )}
      </div>

      {/* Mobile Cards View (Hidden on desktop) */}
      <div className="lg:hidden space-y-4">
        {bookings.map((booking) => (
          <div key={booking.id} className="bg-white rounded-lg border border-sage-200 p-4 shadow-sm">
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-sage-900">{booking.userName}</h3>
                  <p className="text-xs text-sage-600 flex items-center gap-1 mt-1">
                    <Mail size={10} />
                    {booking.userEmail}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}>
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </span>
              </div>

              <div className="border-t border-sage-100 pt-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-sage-500">Service</p>
                    <p className="text-sm font-medium text-sage-900">{booking.service}</p>
                  </div>
                  <div>
                    <p className="text-xs text-sage-500">Time</p>
                    <p className="text-sm font-medium text-sage-900">{booking.time}</p>
                  </div>
                  <div>
                    <p className="text-xs text-sage-500">Date Range</p>
                    <p className="text-sm font-medium text-sage-900">
                      {formatDate(booking.fromDate)} - {formatDate(booking.toDate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-sage-500">Price</p>
                    <p className="text-sm font-medium text-sage-900">{formatCurrency(booking.price)}</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-sage-100 pt-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-sm text-sage-700">
                    <Users size={14} />
                    <span>{booking.participants} {booking.participants === 1 ? 'person' : 'people'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {booking.status === "pending" && (
                      <button
                        onClick={() => handleConfirm(booking.id)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-100 text-green-600 hover:bg-green-200 transition-colors text-sm"
                      >
                        <CheckCircle size={14} />
                        Confirm
                      </button>
                    )}
                    {booking.status !== "cancelled" && (
                      <button
                        onClick={() => handleCancel(booking.id)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors text-sm"
                      >
                        <Clock size={14} />
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}