"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { format, parseISO, isWithinInterval, differenceInDays } from "date-fns"
import { Home, Calendar as CalendarIcon, DollarSign, History, MapPin, CheckCircle2, XCircle, Clock, Users, ArrowRight } from "lucide-react"
import axiosInstance from "@/services/axios-instance"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"

interface Flat {
    _id: string
    flatName: string
    location: string
    price: number
    isActive: boolean
    imagesUri: string[]
}

interface Booking {
    _id: string
    userName: string
    email: string
    phone: string
    startDate: string
    endDate: string
    status: string
    isVerified: boolean
    participants: number
    message?: string
    createdAt: string
}

interface ApartmentDetailsModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    flat: Flat | null
}

export function ApartmentDetailsModal({ open, onOpenChange, flat }: ApartmentDetailsModalProps) {
    const [bookings, setBookings] = useState<Booking[]>([])
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (open && flat) {
            fetchBookings()
        }
    }, [open, flat])

    const fetchBookings = async () => {
        try {
            setIsLoading(true)
            const { data } = await axiosInstance.get(`/api/v1/bookings/flat/${flat?._id}`)
            if (data.success) {
                setBookings(data.bookings)
            }
        } catch (err) {
            console.error("Failed to fetch bookings", err)
        } finally {
            setIsLoading(false)
        }
    }

    if (!flat) return null

    const verifiedBookings = bookings.filter(b => b.isVerified)
    const totalRevenue = verifiedBookings.reduce((acc, booking) => {
        const start = parseISO(booking.startDate)
        const end = parseISO(booking.endDate)
        const days = Math.max(1, differenceInDays(end, start))
        return acc + (days * flat.price)
    }, 0)

    const disabledDays = (date: Date) => {
        return verifiedBookings.some(booking => {
            const start = parseISO(booking.startDate)
            const end = parseISO(booking.endDate)
            return isWithinInterval(date, { start, end })
        })
    }

    const modifiers = {
        booked: (date: Date) => {
            return verifiedBookings.some(booking => {
                const start = parseISO(booking.startDate)
                const end = parseISO(booking.endDate)
                return isWithinInterval(date, { start, end })
            })
        },
        pending: (date: Date) => {
            return bookings.some(booking => {
                if (booking.isVerified) return false
                if (booking.status !== 'pending' && booking.status !== 'overlap') return false
                const start = parseISO(booking.startDate)
                const end = parseISO(booking.endDate)
                return isWithinInterval(date, { start, end })
            })
        }
    }

    const modifierClassNames = {
        booked: "bg-indigo-600 text-white font-bold rounded-full",
        pending: "bg-amber-100 text-amber-700 font-medium rounded-full"
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'confirmed': return <CheckCircle2 size={14} className="text-emerald-500" />
            case 'rejected': return <XCircle size={14} className="text-red-500" />
            case 'overlap': return <Clock size={14} className="text-amber-500" />
            default: return <Clock size={14} className="text-blue-500" />
        }
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'confirmed': return (
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-100 uppercase text-[10px] font-bold gap-1.5 px-3 py-1 rounded-full">
                    <CheckCircle2 size={10} /> Confirmed
                </Badge>
            )
            case 'rejected': return (
                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-100 uppercase text-[10px] font-bold gap-1.5 px-3 py-1 rounded-full">
                    <XCircle size={10} /> Rejected
                </Badge>
            )
            case 'overlap': return (
                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-100 uppercase text-[10px] font-bold gap-1.5 px-3 py-1 rounded-full">
                    <Clock size={10} /> Overlap
                </Badge>
            )
            default: return (
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-100 uppercase text-[10px] font-bold gap-1.5 px-3 py-1 rounded-full">
                    <Clock size={10} /> Pending
                </Badge>
            )
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-4xl p-0 overflow-hidden border-none rounded-[40px] shadow-2xl h-[85vh] flex flex-col">
                <DialogHeader className="bg-slate-900 px-10 py-8 text-white flex flex-row justify-between items-center shrink-0 space-y-0 border-b border-white/5">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-indigo-500/10 rounded-[24px] flex items-center justify-center text-indigo-400 border border-indigo-500/20 shadow-inner">
                            <Home size={32} />
                        </div>
                        <div className="space-y-1.5">
                            <DialogTitle className="text-3xl text-white font-black tracking-tighter leading-none">
                                <span className="text-white">
                                    {flat.flatName}
                                </span>
                            </DialogTitle>
                            <div className="flex items-center gap-3">
                                <p className="text-indigo-300/80 text-sm font-bold flex items-center gap-1.5 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
                                    <MapPin size={14} /> {flat.location}
                                </p>
                                <span className="h-4 w-[1px] bg-slate-700" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Suite Analytics</span>
                            </div>
                        </div>
                    </div>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {/* Revenue Card */}
                        <div className="bg-emerald-50 rounded-[32px] p-6 border border-emerald-100">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-emerald-500 text-white rounded-xl">
                                    <DollarSign size={20} />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-900/60">Total Revenue</span>
                            </div>
                            <div className="space-y-1">
                                <p className="text-3xl font-black text-emerald-900">Rs. {totalRevenue.toLocaleString()}</p>
                                <p className="text-xs font-bold text-emerald-600">{verifiedBookings.length} confirmed bookings</p>
                            </div>
                        </div>

                        {/* Inventory Card */}
                        <div className="bg-indigo-50 rounded-[32px] p-6 border border-indigo-100">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-indigo-600 text-white rounded-xl">
                                    <CalendarIcon size={20} />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-900/60">Occupancy</span>
                            </div>
                            <div className="space-y-1">
                                <p className="text-3xl font-black text-indigo-900">{bookings.filter(b => b.isVerified).length}</p>
                                <p className="text-xs font-bold text-indigo-600">Reserved time slots</p>
                            </div>
                        </div>

                        {/* Recent Activity Card */}
                        <div className="bg-slate-50 rounded-[32px] p-6 border border-slate-100">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-slate-900 text-white rounded-xl">
                                    <History size={20} />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-900/40">Total Requests</span>
                            </div>
                            <div className="space-y-1">
                                <p className="text-3xl font-black text-slate-900">{bookings.length}</p>
                                <p className="text-xs font-bold text-slate-500">Total inquiry count</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Calendar Section */}
                        <div className="lg:col-span-5 space-y-4">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Availability Calendar</h4>
                            <div className="bg-white rounded-[32px] border border-slate-100 p-6 shadow-sm">
                                <Calendar
                                    mode="single"
                                    modifiers={modifiers}
                                    modifiersClassNames={modifierClassNames}
                                    className="w-full flex justify-center"
                                />
                                <div className="mt-6 space-y-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-indigo-600 rounded-full" />
                                        <span className="text-xs font-bold text-slate-600">Confirmed Booking</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-amber-100 rounded-full border border-amber-200" />
                                        <span className="text-xs font-bold text-slate-600">Pending / Overlap</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent History Section */}
                        <div className="lg:col-span-7 space-y-4">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Booking History</h4>
                            <div className="bg-white rounded-[40px] border border-slate-100 overflow-hidden shadow-sm">
                                <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
                                    {isLoading ? (
                                        <div className="p-8 space-y-4">
                                            {[1, 2, 3].map(i => (
                                                <Skeleton key={i} className="h-20 w-full rounded-2xl" />
                                            ))}
                                        </div>
                                    ) : bookings.length === 0 ? (
                                        <div className="p-12 text-center text-slate-400">
                                            <History size={48} className="mx-auto mb-4 opacity-10" />
                                            <p className="font-bold text-sm uppercase tracking-widest">No history available</p>
                                        </div>
                                    ) : (
                                        <div className="divide-y divide-slate-50">
                                            {bookings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(booking => (
                                                <div key={booking._id} className="p-6 hover:bg-slate-50/50 transition-colors">
                                                    <div className="flex items-start justify-between mb-3">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 font-bold uppercase">
                                                                {booking.userName.charAt(0)}
                                                            </div>
                                                            <div>
                                                                <h5 className="font-bold text-slate-900">{booking.userName}</h5>
                                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                                    {booking.email}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        {getStatusBadge(booking.status)}
                                                    </div>

                                                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-4 text-[11px] font-bold text-slate-600">
                                                        <div className="flex items-center gap-2">
                                                            <CalendarIcon size={14} className="text-slate-300" />
                                                            {format(parseISO(booking.startDate), "MMM d")} - {format(parseISO(booking.endDate), "MMM d, yyyy")}
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Users size={14} className="text-slate-300" />
                                                            {booking.participants} Guests
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Clock size={14} className="text-slate-300" />
                                                            {format(parseISO(booking.createdAt), "'Relative:' p")}
                                                        </div>
                                                    </div>

                                                    {booking.message && (
                                                        <div className="mt-4 p-3 bg-slate-50 rounded-xl text-[10px] text-slate-500 italic leading-relaxed">
                                                            "{booking.message}"
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end shrink-0">
                    <button
                        onClick={() => onOpenChange(false)}
                        className="px-8 py-3 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all active:scale-95"
                    >
                        Close Details
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
