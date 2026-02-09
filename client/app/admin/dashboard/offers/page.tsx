"use client"

import { useState, useEffect } from "react"
import { Calendar, Plus, X, Trash2, Tag, Percent } from "lucide-react"
import axiosInstance from "@/services/axios-instance"
import { toast } from "sonner"
import Cookies from "js-cookie"

interface Service {
    id: number
    title: string
    price?: number
}

interface Offer {
    id: string
    service_id: number
    discount_percentage: number
    start_date: string
    end_date: string
    description?: string
    is_active: boolean
    created_at?: string
    updated_at?: string
}

export default function OffersPage() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isFetching, setIsFetching] = useState(true)
    const [offers, setOffers] = useState<Offer[]>([])
    const [services, setServices] = useState<Service[]>([])
    const [showForm, setShowForm] = useState(false)
    const [editingOffer, setEditingOffer] = useState<Offer | null>(null)

    const [formData, setFormData] = useState({
        service_id: "",
        discount_percentage: "",
        start_date: "",
        end_date: "",
        description: "",
        is_active: true
    })

    const TOKEN = Cookies.get("auth_token")

    useEffect(() => {
        fetchServices()
        fetchOffers()
    }, [])

    const fetchServices = async () => {
        try {
            const { data } = await axiosInstance.get("/api/services")
            if (data.status) {
                setServices(data.data)
            }
        } catch (err) {
            console.error("Failed to fetch services", err)
            // fallback if API fails in dev
            // setServices([{ id: 1, title: "Mock Service", price: 50 }]) 
        }
    }

    const fetchOffers = async () => {
        try {
            setIsFetching(true)
            const { data } = await axiosInstance.get("/api/offers", {
                headers: { Authorization: `Bearer ${TOKEN}` }
            })
            if (data.status) {
                // Map the API response to match our interface if needed
                // Assuming API returns data compatible with Offer interface
                // We might need to map service_title manually if the API doesn't return it

                setOffers(data.data)
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

        if (!formData.service_id || !formData.discount_percentage || !formData.start_date || !formData.end_date) {
            toast.info("Please fill all required fields")
            return
        }

        if (new Date(formData.start_date) > new Date(formData.end_date)) {
            toast.error("End date must be after start date")
            return
        }

        setIsSubmitting(true)
        try {
            const payload = {
                service_id: parseInt(formData.service_id),
                discount_percentage: parseFloat(formData.discount_percentage),
                start_date: formData.start_date,
                end_date: formData.end_date,
                description: formData.description,
                is_active: formData.is_active
            }

            let response;

            if (editingOffer) {
                response = await axiosInstance.post(`/api/offers/${editingOffer.id}`, payload, {
                    headers: { Authorization: `Bearer ${TOKEN}` }
                })
            } else {
                response = await axiosInstance.post("/api/offers", payload, {
                    headers: { Authorization: `Bearer ${TOKEN}` }
                })
            }

            const { data } = response

            if (data.status) {
                toast.success(editingOffer ? "Offer updated successfully" : "Offer created successfully")
                fetchOffers() // Refresh list
                resetForm()
            } else {
                toast.error(data.message || "Operation failed")
            }

        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to save offer")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this offer?")) return

        setIsSubmitting(true)
        try {
            const { data } = await axiosInstance.delete(`/api/offers/${id}`, {
                headers: { Authorization: `Bearer ${TOKEN}` }
            })

            if (data.status) {
                toast.success("Offer deleted successfully")
                setOffers(offers.filter(o => o.id !== id))
            } else {
                toast.error(data.message || "Failed to delete offer")
            }
        } catch (err) {
            console.error(err)
            toast.error("Failed to delete offer")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleEdit = (offer: Offer) => {
        setEditingOffer(offer)
        setFormData({
            service_id: offer.service_id.toString(),
            discount_percentage: offer.discount_percentage.toString(),
            start_date: offer.start_date,
            end_date: offer.end_date,
            description: offer.description || "",
            is_active: offer.is_active
        })
        setShowForm(true)
    }

    const resetForm = () => {
        setFormData({
            service_id: "",
            discount_percentage: "",
            start_date: "",
            end_date: "",
            description: "",
            is_active: true
        })
        setEditingOffer(null)
        setShowForm(false)
    }

    return (
        <div className="flex flex-col bg-sage-50 min-h-screen">
            <div className="bg-white border-b border-sage-200 px-8 py-6 shadow-sm flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-sage-900">Service Offers</h1>
                    <p className="text-sage-600 mt-1">Manage temporary discounts and special offers</p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="flex items-center gap-2 bg-sage-600 text-white px-4 py-2 rounded-lg hover:bg-sage-700 transition"
                >
                    <Plus size={20} /> Add Offer
                </button>
            </div>

            <div className="flex-1 p-8">

                {/* Form Modal */}
                {showForm && (
                    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg w-full max-w-md p-6 relative shadow-xl">
                            <button onClick={resetForm} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
                                <X size={20} />
                            </button>

                            <h2 className="text-xl font-bold text-sage-900 mb-4">
                                {editingOffer ? "Edit Offer" : "Create New Offer"}
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-sage-700 mb-1">Select Service *</label>
                                    <select
                                        value={formData.service_id}
                                        onChange={(e) => setFormData({ ...formData, service_id: e.target.value })}
                                        className="w-full px-3 py-2 border border-sage-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-600"
                                        required
                                    >
                                        <option value="">-- Choose a Service --</option>
                                        {services.map(s => (
                                            <option key={s.id} value={s.id}>{s.title} (${s.price})</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-sage-700 mb-1">Discount Percentage *</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            value={formData.discount_percentage}
                                            onChange={(e) => setFormData({ ...formData, discount_percentage: e.target.value })}
                                            className="w-full px-3 py-2 border border-sage-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-600 pr-8"
                                            placeholder="20"
                                            required
                                        />
                                        <Percent size={16} className="absolute right-3 top-3 text-gray-400" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-sage-700 mb-1">Start Date *</label>
                                        <input
                                            type="date"
                                            value={formData.start_date}
                                            onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                                            className="w-full px-3 py-2 border border-sage-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-600"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-sage-700 mb-1">End Date *</label>
                                        <input
                                            type="date"
                                            value={formData.end_date}
                                            onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                                            className="w-full px-3 py-2 border border-sage-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-600"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-sage-700 mb-1">Description (Optional)</label>
                                    <input
                                        type="text"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-3 py-2 border border-sage-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-600"
                                        placeholder="e.g. Summer Solstice Special"
                                    />
                                </div>

                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="offer_active"
                                        checked={formData.is_active}
                                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                        className="rounded border-sage-300 text-sage-600 focus:ring-sage-600"
                                    />
                                    <label htmlFor="offer_active" className="text-sm font-medium text-sage-700">
                                        Mark as Active
                                    </label>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-sage-600 text-white py-2 rounded-lg hover:bg-sage-700 transition"
                                >
                                    {isSubmitting ? "Saving..." : editingOffer ? "Update Offer" : "Create Offer"}
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {/* Offers List */}
                <div className="bg-white rounded-lg border border-sage-200 overflow-hidden shadow-sm">
                    {isFetching ? (
                        <div className="p-12 flex flex-col items-center justify-center text-center">
                            <div className="w-8 h-8 border-4 border-sage-200 border-t-sage-600 rounded-full animate-spin mb-4"></div>
                            <p className="text-sage-500 font-medium">Loading offers...</p>
                        </div>
                    ) : offers.length === 0 ? (
                        <div className="p-8 text-center text-sage-500">
                            <Tag size={48} className="mx-auto mb-3 opacity-30" />
                            <p>No active offers found. Create one to get started.</p>
                        </div>
                    ) : (
                        <table className="w-full">
                            <thead className="bg-sage-50 border-b border-sage-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-sage-900">Service</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-sage-900">Discount</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-sage-900">Duration</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-sage-900">Status</th>
                                    <th className="px-6 py-3 text-right text-sm font-semibold text-sage-900">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {offers.map((offer) => {
                                    const service = services.find(s => s.id === offer.service_id)
                                    const title = service?.title || `Service #${offer.service_id}`

                                    return (
                                        <tr key={offer.id} className="border-b border-sage-100 last:border-0 hover:bg-sage-50/50">
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-sage-900">{title}</div>
                                                {offer.description && <div className="text-xs text-sage-500">{offer.description}</div>}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                    -{offer.discount_percentage}%
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-sage-600">
                                                <div className="flex items-center gap-1">
                                                    <Calendar size={14} />
                                                    <span>{offer.start_date}</span>
                                                    <span className="mx-1">to</span>
                                                    <span>{offer.end_date}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex px-2 py-1 text-xs rounded-full font-medium ${offer.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                                    {offer.is_active ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => handleDelete(offer.id)}
                                                    className="text-red-500 hover:bg-red-50 p-2 rounded-full transition"
                                                    title="Delete Offer"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleEdit(offer)}
                                                    className="text-sage-600 hover:bg-sage-100 p-2 rounded-full transition"
                                                    title="Edit Offer"
                                                >
                                                    <Tag size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    )}
                </div>

            </div>
        </div>
    )
}
