"use client"

import { useEffect, useState } from "react"
import { MessageSquare, Phone, Mail, Calendar, Home } from "lucide-react"
import { toast } from "sonner"
import axiosInstance from "@/services/axios-instance"
import Cookies from "js-cookie"
import Loading from "../loading"

interface Inquiry {
    _id: string
    name: string
    email: string
    phone?: string
    flat: string
    message: string
    createdAt: string
}

export function InquiriesSection() {
    const [inquiries, setInquiries] = useState<Inquiry[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const TOKEN = Cookies.get("auth_token")

    useEffect(() => {
        fetchInquiries()
    }, [])

    const fetchInquiries = async () => {
        try {
            setIsLoading(true)
            const { data } = await axiosInstance.get("/api/v1/inquiry", {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                },
            })

            if (data.success) {
                setInquiries(data.data)
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
            hour: "2-digit",
            minute: "2-digit"
        })
    }



    return (
        <div className="space-y-6 md:space-y-8 max-w-[1600px] mx-auto">
            {isLoading && <Loading color="rgba(0, 0, 0, 0.3)" />}
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <div className="bg-white rounded-2xl border border-slate-100 p-5 md:p-6 shadow-sm hover:shadow-md transition-shadow">
                    <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Inquiries</p>
                    <div className="flex items-end justify-between">
                        <div>
                            <p className="text-2xl md:text-3xl font-bold text-slate-900">{inquiries.length}</p>
                            <p className="text-[10px] text-slate-400 mt-1">All time messages</p>
                        </div>
                        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500">
                            <MessageSquare size={20} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Inquiries List Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-1 h-8 bg-blue-500 rounded-full" />
                    <h2 className="text-xl md:text-2xl font-bold text-slate-900 font-serif">Recent Feedback</h2>
                </div>
                <div className="bg-slate-100/50 px-4 py-1.5 rounded-full border border-slate-200/50">
                    <span className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest">{inquiries.length} Total Items</span>
                </div>
            </div>

            {/* Inquiries Table Card */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
                {inquiries.length === 0 ? (
                    <div className="text-center py-24 px-6">
                        <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-200">
                            <MessageSquare size={40} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">No inquiries yet</h3>
                        <p className="text-slate-500 font-medium max-w-xs mx-auto">Once customers send messages from the contact page, they will appear here.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto scrollbar-hide">
                        <table className="w-full min-w-[1000px] border-collapse">
                            <thead>
                                <tr className="bg-slate-50/80">
                                    <th className="px-8 py-5 text-left text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.15em] border-b border-slate-100">Guest Details</th>
                                    <th className="px-8 py-5 text-left text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.15em] border-b border-slate-100">Inquiry Link</th>
                                    <th className="px-8 py-5 text-left text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.15em] border-b border-slate-100 w-1/3">Message</th>
                                    <th className="px-8 py-5 text-left text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.15em] border-b border-slate-100">Contact Method</th>
                                    <th className="px-8 py-5 text-left text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.15em] border-b border-slate-100">Received On</th>
                                    <th className="px-8 py-5 text-right text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.15em] border-b border-slate-100">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {inquiries.map((inquiry) => (
                                    <tr key={inquiry._id} className="hover:bg-blue-50/20 transition-all duration-200 group">
                                        <td className="px-8 py-6 whitespace-nowrap">
                                            <div className="flex items-center gap-4">
                                                <div className="w-11 h-11 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl flex items-center justify-center text-xs font-bold text-blue-600 border border-blue-100 shadow-sm group-hover:scale-105 transition-transform">
                                                    {getInitials(inquiry.name)}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{inquiry.name}</p>
                                                    <a
                                                        href={`mailto:${inquiry.email}`}
                                                        className="text-xs font-medium text-slate-400 flex items-center gap-1.5 mt-0.5 hover:text-blue-500 transition-colors"
                                                    >
                                                        <Mail size={12} className="opacity-70" /> {inquiry.email}
                                                    </a>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 whitespace-nowrap">
                                            <div className="flex items-center gap-2.5">
                                                <div className="p-1.5 bg-slate-50 rounded-lg text-slate-400 group-hover:text-blue-500 group-hover:bg-blue-50 transition-colors">
                                                    <Home size={16} />
                                                </div>
                                                <span className="text-sm font-bold text-slate-600">{inquiry.flat}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="relative">
                                                <p className="text-sm text-slate-600 line-clamp-2 max-w-md font-medium leading-relaxed italic">
                                                    "{inquiry.message}"
                                                </p>
                                                <div className="absolute -left-4 top-0 w-1 h-full bg-slate-100 group-hover:bg-blue-200 rounded-full transition-colors opacity-0 group-hover:opacity-100" />
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 whitespace-nowrap">
                                            {inquiry.phone ? (
                                                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-50 text-slate-600 rounded-lg border border-slate-100 group-hover:border-blue-100 group-hover:bg-blue-50 group-hover:text-blue-700 transition-all">
                                                    <Phone size={14} className="opacity-70" />
                                                    <span className="text-sm font-bold tracking-tight">{inquiry.phone}</span>
                                                </div>
                                            ) : (
                                                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest italic">Not provided</span>
                                            )}
                                        </td>
                                        <td className="px-8 py-6 whitespace-nowrap">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2 text-slate-700">
                                                    <Calendar size={14} className="text-blue-400" />
                                                    <span className="text-xs font-bold whitespace-nowrap">{formatDate(inquiry.createdAt).split(',')[0]}</span>
                                                </div>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase ml-5">{formatDate(inquiry.createdAt).split(',')[1]}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 whitespace-nowrap text-right">
                                            <a
                                                href={`mailto:${inquiry.email}`}
                                                className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-slate-50 text-slate-400 hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-blue-200"
                                                title={`Email ${inquiry.name}`}
                                            >
                                                <Mail size={18} />
                                            </a>
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
