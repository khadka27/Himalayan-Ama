"use client"

import { useState, useEffect } from "react"
import { Save, AlertCircle, X, Check } from "lucide-react"
import axiosInstance from "@/services/axios-instance"
import { toast } from "sonner"
import Cookies from "js-cookie"

interface OfferBannerData {
    id?: string
    banner_text: string
    background_color: string
    text_color: string
    is_active: boolean
}

export default function OfferBannerPage() {
    const [loading, setLoading] = useState(false)
    const [isFetching, setIsFetching] = useState(true) // Add specific fetching state
    const [formData, setFormData] = useState<OfferBannerData>({
        banner_text: "",
        background_color: "#6B8E6A", // Default Sage Green
        text_color: "#ffffff",
        is_active: true,
    })
    const TOKEN = Cookies.get("auth_token")

    useEffect(() => {
        fetchBannerData()
    }, [])

    const fetchBannerData = async () => {
        try {
            setIsFetching(true) // Start fetching
            const { data } = await axiosInstance.get("/api/banner", {
                headers: { Authorization: `Bearer ${TOKEN}` }
            })
            // API returns an XML/JSON array: [{...}] or sometimes { status: true, data: {...} } depending on backend.
            // Based on curl check: [{"id":1, ...}]
            let banner = null;
            if (Array.isArray(data) && data.length > 0) {
                banner = data[0];
            } else if (data.status && data.data) {
                banner = data.data;
            } else if (data.id) {
                banner = data;
            }

            if (banner) {
                setFormData({
                    banner_text: banner.banner_text || "",
                    background_color: banner.background_color || "#6B8E6A",
                    text_color: banner.text_color || "#ffffff",
                    is_active: banner.is_active === true || banner.is_active === "active" || banner.is_active === 1
                })
            }
        } catch (err) {
            console.error("Failed to load banner settings", err)
        } finally {
            setIsFetching(false) // Stop fetching
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            const payload = {
                ...formData,
                is_active: formData.is_active ? "active" : "inactive"
            }
            const { data } = await axiosInstance.post("/api/banner/1", payload, {
                headers: { Authorization: `Bearer ${TOKEN}` }
            })
            if (data.status) {
                toast.success("Banner settings updated successfully")
            } else {
                toast.success("Banner settings saved")
            }
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to save settings")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col bg-sage-50 min-h-screen">
            <div className="bg-white border-b border-sage-200 px-8 py-6 shadow-sm">
                <h1 className="text-3xl font-serif font-bold text-sage-900">Offer Banner</h1>
                <p className="text-sage-600 mt-1">Manage the global top banner for announcements</p>
            </div>

            <div className="flex-1 p-8">
                {isFetching ? (
                    <div className="w-full h-96 flex items-center justify-center">
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-8 h-8 border-4 border-sage-200 border-t-sage-600 rounded-full animate-spin"></div>
                            <p className="text-sage-500 font-medium">Loading settings...</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                        {/* Settings Form */}
                        <div className="bg-white rounded-lg border border-sage-200 shadow-sm p-6">
                            <h2 className="text-xl font-semibold text-sage-900 mb-6 flex items-center gap-2">
                                <SettingsIcon /> Settings
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-6">

                                <div className="flex items-center gap-3 p-4 bg-sage-50 rounded-lg border border-sage-100">
                                    <div className="flex-1">
                                        <label htmlFor="isActive" className="font-medium text-sage-900">Enable Banner</label>
                                        <p className="text-sm text-sage-500">Show this banner at the top of all pages</p>
                                    </div>
                                    <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                                        <input
                                            type="checkbox"
                                            name="is_active"
                                            id="is_active"
                                            checked={formData.is_active}
                                            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                            className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                                            style={{ right: formData.is_active ? '0' : '50%' }}
                                        />
                                        <label htmlFor="is_active" className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${formData.is_active ? 'bg-sage-600' : 'bg-gray-300'}`}></label>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-sage-700 mb-1">Banner Text</label>
                                    <input
                                        type="text"
                                        value={formData.banner_text}
                                        onChange={(e) => setFormData({ ...formData, banner_text: e.target.value })}
                                        className="w-full px-4 py-2 border border-sage-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-600"
                                        placeholder="e.g., Summer Sale is Live!"
                                        required
                                    />
                                </div>



                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-sage-700 mb-1">Background Color</label>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="color"
                                                value={formData.background_color}
                                                onChange={(e) => setFormData({ ...formData, background_color: e.target.value })}
                                                className="h-10 w-10 border border-sage-200 rounded cursor-pointer"
                                            />
                                            <span className="text-sm text-sage-600">{formData.background_color}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-sage-700 mb-1">Text Color</label>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="color"
                                                value={formData.text_color}
                                                onChange={(e) => setFormData({ ...formData, text_color: e.target.value })}
                                                className="h-10 w-10 border border-sage-200 rounded cursor-pointer"
                                            />
                                            <span className="text-sm text-sage-600">{formData.text_color}</span>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-sage-600 text-white px-6 py-3 rounded-lg hover:bg-sage-700 transition flex items-center justify-center gap-2 "
                                >
                                    {loading ? "Saving..." : <><Save size={20} /> Save Changes</>}
                                </button>
                            </form>
                        </div>

                        {/* Preview */}
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold text-sage-900">Live Preview</h2>
                            <div className="bg-gray-100 p-8 rounded-lg border border-dashed border-gray-300 flex flex-col items-center justify-center min-h-[200px]">
                                <div className="w-full bg-white shadow-xl rounded-lg overflow-hidden">
                                    {/* Mock Header */}
                                    <div
                                        className="px-4 py-3 flex items-center justify-between relative"
                                        style={{ backgroundColor: formData.background_color, color: formData.text_color }}
                                    >
                                        <div className="flex-1 text-center font-medium text-sm">
                                            {formData.banner_text || "Banner Text Preview"}
                                        </div>
                                        <button className="opacity-70 hover:opacity-100">
                                            <X size={16} />
                                        </button>
                                    </div>

                                    <div className="h-40 bg-gray-50 flex items-center justify-center text-gray-400">
                                        Page Content Area
                                    </div>
                                </div>
                                <p className="text-sm text-gray-500 mt-4">Note: This is how it will appear at the top of the website.</p>
                            </div>
                        </div>

                    </div>
                )}
            </div>
        </div>
    )
}

function SettingsIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-settings"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.09a2 2 0 0 1-1-1.74v-.47a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.39a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></svg>
    )
}
