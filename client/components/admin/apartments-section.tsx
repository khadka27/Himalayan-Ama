"use client"

import { useEffect, useState } from "react"
import { Edit2, Plus, X, Trash2, Home, MapPin, DollarSign, Image as ImageIcon, CheckCircle2, AlertCircle } from "lucide-react"
import axiosInstance from "@/services/axios-instance"
import { toast } from "sonner"
import Loading from "@/components/loading"
import Cookies from "js-cookie"
import Image from "next/image"
import Swal from "sweetalert2"

interface Flat {
    _id: string
    flatName: string
    location: string
    price: number
    isActive: boolean
    imagesUri: string[]
    createdAt?: string
    updatedAt?: string
}

export function ApartmentsSection() {
    const [flats, setFlats] = useState<Flat[]>([])
    const [showForm, setShowForm] = useState(false)
    const [editingFlat, setEditingFlat] = useState<Flat | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [imagePreviews, setImagePreviews] = useState<string[]>([])
    const [imageFiles, setImageFiles] = useState<File[]>([])
    const TOKEN = Cookies.get("auth_token")

    const [formData, setFormData] = useState({
        flatName: "",
        location: "",
        price: "",
        isActive: true
    })

    useEffect(() => {
        fetchFlats()
    }, [])

    const fetchFlats = async () => {
        try {
            setIsLoading(true)
            const { data } = await axiosInstance.get("/api/v1/flats/all")
            if (data.success) {
                setFlats(data.flats)
            }
        } catch (err) {
            console.error(err)
            toast.error("Failed to fetch flats")
        } finally {
            setIsLoading(false)
        }
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (files) {
            const newFiles = Array.from(files)
            const newPreviews: string[] = []

            newFiles.forEach((file) => {
                const reader = new FileReader()
                reader.onloadend = () => {
                    newPreviews.push(reader.result as string)
                    if (newPreviews.length === newFiles.length) {
                        setImagePreviews(prev => [...prev, ...newPreviews])
                    }
                }
                reader.readAsDataURL(file)
            })

            setImageFiles(prev => [...prev, ...newFiles])
        }
    }

    const removeImage = (index: number) => {
        setImagePreviews(prev => prev.filter((_, i) => i !== index))
        setImageFiles(prev => prev.filter((_, i) => i !== index))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.flatName || !formData.location || !formData.price) {
            toast.info("Please fill in all required fields")
            return
        }

        try {
            setIsLoading(true)
            const formDataPayload = new FormData()
            formDataPayload.append("flatName", formData.flatName)
            formDataPayload.append("location", formData.location)
            formDataPayload.append("price", formData.price)
            formDataPayload.append("isActive", formData.isActive.toString())

            imageFiles.forEach((file) => {
                formDataPayload.append("images", file)
            })

            let response;
            if (editingFlat) {
                response = await axiosInstance.put(`/api/v1/flats/update/${editingFlat._id}`, formDataPayload, {
                    headers: {
                        'Authorization': `Bearer ${TOKEN}`,
                        'Content-Type': 'multipart/form-data'
                    },
                })
            } else {
                response = await axiosInstance.post("/api/v1/flats/create", formDataPayload, {
                    headers: {
                        'Authorization': `Bearer ${TOKEN}`,
                        'Content-Type': 'multipart/form-data'
                    },
                })
            }

            if (response.data.success) {
                toast.success(response.data.message || (editingFlat ? "Apartment updated" : "Apartment added"))
                await fetchFlats()
                resetForm()
            } else {
                toast.error(response.data.message || "Failed to save apartment")
            }
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Internal server error")
        } finally {
            setIsLoading(false)
        }
    }

    const handleDeleteFlat = async (id: string) => {
        const result = await Swal.fire({
            title: "Delete Apartment?",
            text: "This listing will be permanently removed.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Delete",
            confirmButtonColor: "#EF4444",
        });

        if (!result.isConfirmed) return;

        try {
            setIsLoading(true)
            const { data } = await axiosInstance.delete(`/api/v1/flats/delete/${id}`, {
                headers: { 'Authorization': `Bearer ${TOKEN}` }
            })

            if (data.success) {
                toast.success("Apartment deleted successfully")
                await fetchFlats()
            }
        } catch (err) {
            toast.error("Failed to delete flat")
        } finally {
            setIsLoading(false)
        }
    }

    const handleToggleActive = async (flatId: string, currentStatus: boolean) => {
        try {
            const { data } = await axiosInstance.put(`/api/v1/flats/status/${flatId}`, {
                status: !currentStatus
            }, {
                headers: { 'Authorization': `Bearer ${TOKEN}` }
            })

            if (data.success) {
                setFlats(prev => prev.map(f => f._id === flatId ? { ...f, isActive: !currentStatus } : f))
                toast.success(`Apartment ${!currentStatus ? "activated" : "deactivated"}`)
            }
        } catch (err) {
            toast.error("Failed to toggle status")
        }
    }

    const handleEditFlat = (flat: Flat) => {
        setEditingFlat(flat)
        setFormData({
            flatName: flat.flatName,
            location: flat.location,
            price: flat.price.toString(),
            isActive: flat.isActive
        })
        const BACKEND = process.env.NEXT_PUBLIC_BACKEND || "http://localhost:8000";
        const existingImages = flat.imagesUri.map(img => img.startsWith("http") ? img : `${BACKEND}/images/${img}`);
        setImagePreviews(existingImages)
        setImageFiles([])
        setShowForm(true)
    }

    const resetForm = () => {
        setFormData({
            flatName: "",
            location: "",
            price: "",
            isActive: true
        })
        setImageFiles([])
        setImagePreviews([])
        setShowForm(false)
        setEditingFlat(null)
    }

    const BACKEND = process.env.NEXT_PUBLIC_BACKEND || "http://localhost:8000";

    return (
        <div className="space-y-8 pb-20">
            {isLoading && <Loading color="rgba(0, 0, 0, 0.3)" />}

            <div className="flex justify-between items-center bg-white p-8 rounded-[40px] shadow-sm border border-slate-50">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
                        <Home className="text-indigo-500" />
                        Property Portfolio
                    </h2>
                    <p className="text-slate-400 font-medium text-sm mt-1">Manage your premium listings and residential suites.</p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-12 px-6 rounded-2xl shadow-xl shadow-indigo-100 transition-all flex items-center gap-2 active:scale-95"
                >
                    <Plus size={20} /> List Property
                </button>
            </div>

            {showForm && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-8">
                    <div className="bg-white rounded-[40px] w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in duration-300">
                        <div className="px-10 py-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                            <h3 className="text-xl font-bold text-slate-900 leading-none">
                                {editingFlat ? "Refine Property" : "New Listing"}
                            </h3>
                            <button onClick={resetForm} className="h-10 w-10 bg-white shadow-sm border border-slate-100 flex items-center justify-center rounded-xl hover:bg-slate-50 transition-colors">
                                <X size={20} className="text-slate-400" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-10 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">Property Name</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={formData.flatName}
                                            onChange={(e) => setFormData({ ...formData, flatName: e.target.value })}
                                            className="w-full h-14 px-5 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-indigo-50 font-bold text-slate-800 transition-all"
                                            placeholder="Emerald Heights Suite"
                                            required
                                        />
                                        <Home size={18} className="absolute right-5 top-4 text-slate-300" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">Monthly Rental ($)</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                            className="w-full h-14 px-5 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-indigo-50 font-bold text-slate-800 transition-all"
                                            placeholder="1200"
                                            required
                                        />
                                        <DollarSign size={18} className="absolute right-5 top-4 text-slate-300" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">Location Details</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        className="w-full h-14 px-12 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-indigo-50 font-bold text-slate-800 transition-all"
                                        placeholder="Downtown, Kathmandu"
                                        required
                                    />
                                    <MapPin size={18} className="absolute left-5 top-4 text-slate-400" />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">Gallery</label>
                                <div className="border-2 border-dashed border-slate-100 rounded-[32px] p-8 text-center bg-slate-50/50 hover:bg-slate-50 transition-colors cursor-pointer relative">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        multiple
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                    />
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-slate-400 mb-2">
                                            <ImageIcon size={24} />
                                        </div>
                                        <p className="text-sm font-bold text-slate-700">Drop images here or click to browse</p>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Support JPG, PNG (Max 5MB)</p>
                                    </div>
                                </div>

                                {imagePreviews.length > 0 && (
                                    <div className="grid grid-cols-4 gap-4">
                                        {imagePreviews.map((preview, index) => (
                                            <div key={index} className="relative aspect-square group rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
                                                <Image
                                                    src={preview || "/placeholder.svg"}
                                                    alt="Preview"
                                                    fill
                                                    className="object-cover"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(index)}
                                                    className="absolute top-2 right-2 h-7 w-7 bg-white/90 backdrop-blur-sm text-red-500 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-sm"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center gap-3 py-2">
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, isActive: !prev.isActive }))}
                                    className={`w-12 h-6 rounded-full transition-all relative ${formData.isActive ? 'bg-indigo-600' : 'bg-slate-200'}`}
                                >
                                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.isActive ? 'left-7' : 'left-1'}`} />
                                </button>
                                <span className="text-sm font-bold text-slate-600">Visible for potential clients</span>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-14 rounded-2xl shadow-xl shadow-indigo-100 transition-all active:scale-95 disabled:bg-slate-200"
                                >
                                    {isLoading ? "Synchronizing..." : editingFlat ? "Update Listing" : "Publish Listing"}
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
                                <th className="px-10 py-5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Apartment Name</th>
                                <th className="px-10 py-5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Neighborhood</th>
                                <th className="px-10 py-5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Pricing</th>
                                <th className="px-10 py-5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Visuals</th>
                                <th className="px-10 py-5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Status</th>
                                <th className="px-10 py-5 text-right text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {flats.map((flat) => (
                                <tr key={flat._id} className="hover:bg-slate-50/20 transition-colors group">
                                    <td className="px-10 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-500 border border-indigo-100 shadow-sm flex-shrink-0">
                                                <Home size={18} />
                                            </div>
                                            <div>
                                                <p className="text-base font-bold text-slate-900 tracking-tight leading-tight">{flat.flatName}</p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Property ID: {flat._id.slice(-6)}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-6">
                                        <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
                                            <MapPin size={14} className="text-slate-300" />
                                            {flat.location}
                                        </div>
                                    </td>
                                    <td className="px-10 py-6">
                                        <div className="flex items-center gap-1">
                                            <span className="text-base font-black text-slate-900">${flat.price}</span>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">/mo</span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-6">
                                        <div className="flex -space-x-3 overflow-hidden">
                                            {flat.imagesUri.slice(0, 3).map((img, idx) => {
                                                const src = img.startsWith("http") ? img : `${BACKEND}/images/${img}`;
                                                return (
                                                    <div key={idx} className="relative h-10 w-10 rounded-xl border-2 border-white overflow-hidden bg-slate-100 shadow-sm">
                                                        <Image src={src} alt="Property" fill className="object-cover" />
                                                    </div>
                                                )
                                            })}
                                            {flat.imagesUri.length > 3 && (
                                                <div className="h-10 w-10 rounded-xl border-2 border-white bg-slate-900 flex items-center justify-center text-[10px] font-bold text-white shadow-sm z-10">
                                                    +{flat.imagesUri.length - 3}
                                                </div>
                                            )}
                                            {flat.imagesUri.length === 0 && (
                                                <div className="h-10 w-10 rounded-xl border-2 border-white bg-slate-50 flex items-center justify-center text-slate-300">
                                                    <ImageIcon size={14} />
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-10 py-6">
                                        {flat.isActive ? (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100 uppercase tracking-widest">
                                                <CheckCircle2 size={10} /> Active
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-slate-50 text-slate-400 border border-slate-100 uppercase tracking-widest">
                                                <AlertCircle size={10} /> Hidden
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-10 py-6 text-right">
                                        <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                                            <button
                                                onClick={() => handleToggleActive(flat._id, flat.isActive)}
                                                className={`h-10 w-10 flex items-center justify-center rounded-xl border transition-all shadow-sm bg-white ${flat.isActive ? 'hover:bg-slate-900 hover:text-white border-slate-100 text-slate-400' : 'hover:bg-emerald-500 hover:text-white border-emerald-50 text-emerald-500'}`}
                                                title={flat.isActive ? "Hide Property" : "Show Property"}
                                            >
                                                {flat.isActive ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
                                            </button>
                                            <button
                                                onClick={() => handleEditFlat(flat)}
                                                className="h-10 w-10 flex items-center justify-center rounded-xl border border-slate-100 text-slate-400 hover:bg-slate-900 hover:text-white transition-all shadow-sm bg-white"
                                                title="Edit Listing"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteFlat(flat._id)}
                                                className="h-10 w-10 flex items-center justify-center rounded-xl border border-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm bg-white"
                                                title="Remove Listing"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {flats.length === 0 && (
                        <div className="py-24 text-center">
                            <Home size={64} className="text-slate-100 mx-auto mb-4" />
                            <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">No properties listed yet</p>
                            <button onClick={() => setShowForm(true)} className="mt-4 text-indigo-500 font-bold text-sm hover:underline">Start your first listing</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
