"use client"

import { useState, useEffect } from "react"
import { Calendar, Plus, X, Trash2, Tag, Percent, Sparkles, Clock, AlertCircle } from "lucide-react"
import axiosInstance from "@/services/axios-instance"
import { toast } from "sonner"
import Cookies from "js-cookie"
import Loading from "@/components/loading"
import Swal from "sweetalert2"

interface Flat {
    _id: string
    flatName: string
    price?: number
}

interface Offer {
    _id: string
    flat: Flat | string
    discountPercentage: number
    startDate: string
    endDate: string
    description?: string
    isActive: boolean
    createdAt?: string
}

export default function OffersPage() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isFetching, setIsFetching] = useState(true)
    const [offers, setOffers] = useState<Offer[]>([])
    const [flats, setFlats] = useState<Flat[]>([])
    const [showForm, setShowForm] = useState(false)
    const [editingOffer, setEditingOffer] = useState<Offer | null>(null)

    const [formData, setFormData] = useState({
        flat: "",
        discountPercentage: "",
        startDate: "",
        endDate: "",
        description: "",
        isActive: true
    })

    const TOKEN = Cookies.get("auth_token")

    useEffect(() => {
        fetchFlats()
        fetchOffers()
    }, [])

    const fetchFlats = async () => {
        try {
            const { data } = await axiosInstance.get("/api/v1/flats/all")
            if (data.success) {
                setFlats(data.flats)
            }
        } catch (err) {
            console.error("Failed to fetch apartments", err)
        }
    }

    const fetchOffers = async () => {
        try {
            setIsFetching(true)
            const { data } = await axiosInstance.get("/api/v1/offer", {
                headers: { Authorization: `Bearer ${TOKEN}` }
            })
            if (data.success) {
                setOffers(data.offers)
            }
        } catch (err) {
            console.error("Failed to fetch offers", err)
            toast.error("Failed to fetch offers")
        } finally {
            setIsFetching(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.flat || !formData.discountPercentage || !formData.startDate || !formData.endDate) {
            toast.info("Please fill all required fields")
            return
        }

        if (new Date(formData.startDate) > new Date(formData.endDate)) {
            toast.error("End date must be after start date")
            return
        }

        setIsSubmitting(true)
        try {
            const payload = {
                flat: formData.flat,
                discountPercentage: parseFloat(formData.discountPercentage),
                startDate: formData.startDate,
                endDate: formData.endDate,
                description: formData.description,
                isActive: formData.isActive
            }

            let response;
            if (editingOffer) {
                response = await axiosInstance.put(`/api/v1/offer/${editingOffer._id}`, payload, {
                    headers: { Authorization: `Bearer ${TOKEN}` }
                })
            } else {
                response = await axiosInstance.post("/api/v1/offer", payload, {
                    headers: { Authorization: `Bearer ${TOKEN}` }
                })
            }

            if (response.data.success) {
                toast.success(editingOffer ? "Offer refined" : "Offer activated")
                fetchOffers()
                resetForm()
            } else {
                toast.error(response.data.message || "Operation failed")
            }

        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to save offer")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDelete = async (id: string) => {
        const result = await Swal.fire({
            title: "Delete Offer?",
            text: "This promotion will be permanently removed.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Delete",
            confirmButtonColor: "#EF4444",
        });

        if (!result.isConfirmed) return;

        setIsSubmitting(true)
        try {
            const { data } = await axiosInstance.delete(`/api/v1/offer/${id}`, {
                headers: { Authorization: `Bearer ${TOKEN}` }
            })

            if (data.success) {
                toast.success("Offer deleted")
                setOffers(offers.filter(o => o._id !== id))
            }
        } catch (err) {
            toast.error("Failed to delete offer")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleEdit = (offer: Offer) => {
        setEditingOffer(offer)
        setFormData({
            flat: (offer.flat && typeof offer.flat === 'object') ? offer.flat._id : (offer.flat || ""),
            discountPercentage: offer.discountPercentage.toString(),
            startDate: offer.startDate.split('T')[0],
            endDate: offer.endDate.split('T')[0],
            description: offer.description || "",
            isActive: offer.isActive
        })
        setShowForm(true)
    }

    const resetForm = () => {
        setFormData({
            flat: "",
            discountPercentage: "",
            startDate: "",
            endDate: "",
            description: "",
            isActive: true
        })
        setEditingOffer(null)
        setShowForm(false)
    }

    const formatDate = (dateString: string) => {
        if (!dateString) return "N/A"
        return new Date(dateString).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        })
    }

    return (
        <div className="space-y-8">
            {isFetching && <Loading color="rgba(0, 0, 0, 0.3)" />}

            <div className="flex justify-between items-center bg-white p-8 rounded-[40px] shadow-sm border border-slate-50">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
                        <Tag className="text-blue-500" />
                        Campaign Manager
                    </h2>
                    <p className="text-slate-400 font-medium text-sm mt-1">Create and manage discounts for your premium services.</p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 px-6 rounded-2xl shadow-xl shadow-blue-100 transition-all flex items-center gap-2"
                >
                    <Plus size={20} /> Launch Campaign
                </button>
            </div>

            {showForm && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-8">
                    <div className="bg-white rounded-[40px] w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in duration-300">
                        <div className="px-10 py-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                            <h3 className="text-xl font-bold text-slate-900 leading-none">
                                {editingOffer ? "Adjust Campaign" : "New Promotion"}
                            </h3>
                            <button onClick={resetForm} className="h-10 w-10 bg-white shadow-sm border border-slate-100 flex items-center justify-center rounded-xl hover:bg-slate-50 transition-colors">
                                <X size={20} className="text-slate-400" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-10 space-y-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">Target Apartment</label>
                                <select
                                    value={formData.flat}
                                    onChange={(e) => setFormData({ ...formData, flat: e.target.value })}
                                    className="w-full h-14 px-5 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-50 font-bold text-slate-800 transition-all cursor-pointer appearance-none"
                                >
                                    <option value="">Select an apartment...</option>
                                    {flats.map(f => (
                                        <option key={f._id} value={f._id}>{f.flatName}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">Discount Amount (%)</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={formData.discountPercentage}
                                        onChange={(e) => setFormData({ ...formData, discountPercentage: e.target.value })}
                                        className="w-full h-14 px-5 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-50 font-bold text-slate-800 transition-all pr-12"
                                        placeholder="e.g. 25"
                                        required
                                    />
                                    <Percent size={18} className="absolute right-5 top-4 text-slate-400" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">Start Date</label>
                                    <input
                                        type="date"
                                        value={formData.startDate}
                                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                        className="w-full h-14 px-5 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-50 font-bold text-slate-800 transition-all"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">End Date</label>
                                    <input
                                        type="date"
                                        value={formData.endDate}
                                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                        className="w-full h-14 px-5 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-50 font-bold text-slate-800 transition-all"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">Campaign Note</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-50 min-h-[100px] font-medium text-slate-600 transition-all"
                                    placeholder="Flash sale, summer special, etc."
                                />
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold h-14 rounded-2xl shadow-xl shadow-blue-100 transition-all active:scale-95"
                                >
                                    {isSubmitting ? "Syncing..." : editingOffer ? "Update Promotion" : "Launch Now"}
                                </button>
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="h-14 px-8 rounded-2xl font-bold bg-slate-100 text-slate-400 hover:bg-slate-200 transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-slate-50/30 border-b border-slate-50">
                                <th className="px-10 py-5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Promotion</th>
                                <th className="px-14 py-5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Discount</th>
                                <th className="px-10 py-5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Timeline</th>
                                <th className="px-10 py-5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Status</th>
                                <th className="px-10 py-5 text-right text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {offers.map((offer) => {
                                const flatId = (offer.flat && typeof offer.flat === 'object') ? offer.flat._id : offer.flat
                                const flat = flats.find(f => f._id === flatId)
                                const title = flat?.flatName || "Unknown Apartment"

                                const end = new Date(offer.endDate)
                                const isExpired = end < new Date()

                                return (
                                    <tr key={offer._id} className="hover:bg-slate-50/20 transition-colors group">
                                        <td className="px-10 py-6">
                                            <div className="flex items-center gap-5">
                                                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 border border-blue-100 shadow-sm">
                                                    <Tag size={18} />
                                                </div>
                                                <div>
                                                    <p className="text-base font-bold text-slate-900 tracking-tight leading-tight">{title}</p>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{offer.description || 'General Offer'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-6">
                                            <div className="flex items-center gap-2">
                                                <div className="h-10 w-24 bg-red-50 rounded-xl flex items-center justify-center border border-red-100">
                                                    <span className="text-sm font-bold text-red-600 flex items-center gap-1">
                                                        <Sparkles size={14} /> -{offer.discountPercentage}%
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-6">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                                                    <Clock size={12} className="text-slate-300" />
                                                    {formatDate(offer.startDate)} — {formatDate(offer.endDate)}
                                                </div>
                                                {isExpired && (
                                                    <span className="text-[10px] font-bold text-red-400 uppercase tracking-tighter flex items-center gap-1">
                                                        <AlertCircle size={10} /> Expired
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-10 py-6">
                                            {offer.isActive && !isExpired ? (
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100 uppercase tracking-widest">Live</span>
                                            ) : (
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold bg-slate-50 text-slate-400 border border-slate-100 uppercase tracking-widest">Inactive</span>
                                            )}
                                        </td>
                                        <td className="px-10 py-6 text-right">
                                            <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                                                <button
                                                    onClick={() => handleEdit(offer)}
                                                    className="h-10 w-10 flex items-center justify-center rounded-xl border border-slate-100 text-slate-400 hover:bg-slate-900 hover:text-white transition-all shadow-sm bg-white"
                                                    title="Edit Campaign"
                                                >
                                                    <Calendar size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(offer._id)}
                                                    className="h-10 w-10 flex items-center justify-center rounded-xl border border-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm bg-white"
                                                    title="Remove Campaign"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                    {offers.length === 0 && (
                        <div className="py-20 text-center">
                            <Tag size={48} className="text-slate-100 mx-auto mb-4" />
                            <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">No active campaigns</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
