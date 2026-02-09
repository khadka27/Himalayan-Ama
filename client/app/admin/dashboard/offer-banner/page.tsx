"use client"

import { useState, useEffect } from "react"
import { Save, AlertCircle, X, Check, Megaphone, Palette, Type, Layout } from "lucide-react"
import axiosInstance from "@/services/axios-instance"
import { toast } from "sonner"
import Cookies from "js-cookie"
import Loading from "@/components/loading"

interface OfferBannerData {
    _id?: string
    bannerText: string
    backgroundColor: string
    textColor: string
    isActive: boolean
}

export default function OfferBannerPage() {
    const [loading, setLoading] = useState(false)
    const [isFetching, setIsFetching] = useState(true)
    const [formData, setFormData] = useState<OfferBannerData>({
        bannerText: "",
        backgroundColor: "#6B8E6A",
        textColor: "#ffffff",
        isActive: true,
    })
    const TOKEN = Cookies.get("auth_token")

    useEffect(() => {
        fetchBannerData()
    }, [])

    const fetchBannerData = async () => {
        try {
            setIsFetching(true)
            const { data } = await axiosInstance.get("/api/v1/banner")
            if (data.success && data.banner) {
                setFormData({
                    bannerText: data.banner.bannerText || "",
                    backgroundColor: data.banner.backgroundColor || "#6B8E6A",
                    textColor: data.banner.textColor || "#ffffff",
                    isActive: data.banner.isActive !== false
                })
            }
        } catch (err) {
            console.error("Failed to load banner settings", err)
            toast.error("Could not load banner settings")
        } finally {
            setIsFetching(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            const { data } = await axiosInstance.post("/api/v1/banner", formData, {
                headers: { Authorization: `Bearer ${TOKEN}` }
            })
            if (data.success) {
                toast.success("Banner updated successfully")
            } else {
                toast.error(data.message || "Failed to update banner")
            }
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Internal server error")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-8">
            {isFetching && <Loading color="rgba(0, 0, 0, 0.3)" />}

            <div className="flex justify-between items-center bg-white p-8 rounded-[40px] shadow-sm border border-slate-50">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
                        <Megaphone className="text-blue-500" />
                        Announcement Banner
                    </h2>
                    <p className="text-slate-400 font-medium text-sm mt-1">Manage the global notification bar at the top of your site.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Settings Form */}
                <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/50 p-10">
                    <h2 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-2">
                        <Palette className="text-blue-400" size={20} /> Design Settings
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="flex items-center gap-4 p-6 bg-slate-50 rounded-[32px] border border-slate-100 transition-all hover:bg-slate-100/50">
                            <div className="flex-1">
                                <label className="text-sm font-bold text-slate-900 block">Visibility</label>
                                <p className="text-xs text-slate-400 font-medium mt-0.5">Show or hide the banner globally</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                                className={`w-14 h-8 rounded-full transition-all duration-300 relative ${formData.isActive ? 'bg-blue-600 shadow-lg shadow-blue-100' : 'bg-slate-200'}`}
                            >
                                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all duration-300 ${formData.isActive ? 'left-7' : 'left-1'}`} />
                            </button>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">Banner Content</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={formData.bannerText}
                                    onChange={(e) => setFormData({ ...formData, bannerText: e.target.value })}
                                    className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-50 font-medium text-slate-800 transition-all pl-12"
                                    placeholder="e.g., Summer workshop starting June 1st!"
                                    required
                                />
                                <Type className="absolute left-4 top-4 text-slate-300" size={20} />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">Background Color</label>
                                <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-2xl h-14">
                                    <input
                                        type="color"
                                        value={formData.backgroundColor}
                                        onChange={(e) => setFormData({ ...formData, backgroundColor: e.target.value })}
                                        className="h-10 w-10 border-none bg-transparent rounded-xl cursor-pointer"
                                    />
                                    <span className="text-xs font-bold text-slate-600 tracking-wider font-mono">{formData.backgroundColor}</span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">Text Color</label>
                                <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-2xl h-14">
                                    <input
                                        type="color"
                                        value={formData.textColor}
                                        onChange={(e) => setFormData({ ...formData, textColor: e.target.value })}
                                        className="h-10 w-10 border-none bg-transparent rounded-xl cursor-pointer"
                                    />
                                    <span className="text-xs font-bold text-slate-600 tracking-wider font-mono">{formData.textColor}</span>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-14 rounded-[24px] shadow-xl shadow-blue-100 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                        >
                            {loading ? "Optimizing..." : <><Save size={20} /> Update Banner</>}
                        </button>
                    </form>
                </div>

                {/* Preview */}
                <div className="space-y-6">
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        <Layout className="text-blue-400" size={20} /> Live Preview
                    </h2>
                    <div className="bg-slate-50 p-12 rounded-[40px] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center min-h-[400px]">
                        <div className="w-full max-w-md bg-white shadow-2xl rounded-[32px] overflow-hidden">
                            {/* Mock Header */}
                            <div
                                className="px-6 py-4 flex items-center justify-between relative transition-colors duration-500"
                                style={{ backgroundColor: formData.backgroundColor, color: formData.textColor }}
                            >
                                <div className="flex-1 text-center font-bold text-xs uppercase tracking-widest leading-none">
                                    {formData.bannerText || "Banner Content Preview"}
                                </div>
                                <button className="opacity-50 hover:opacity-100">
                                    <X size={14} />
                                </button>
                            </div>

                            <div className="h-48 flex flex-col items-center justify-center p-8 text-center bg-slate-50/50">
                                <div className="w-24 h-2 bg-slate-100 rounded-full mb-3" />
                                <div className="w-40 h-2 bg-slate-100 rounded-full mb-6" />
                                <div className="grid grid-cols-2 gap-4 w-full">
                                    <div className="h-20 bg-white rounded-2xl border border-slate-100 shadow-sm" />
                                    <div className="h-20 bg-white rounded-2xl border border-slate-100 shadow-sm" />
                                </div>
                            </div>
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-8">Real-time simulation</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
