"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Plus,
    Trash2,
    Edit,
    Save,
    X,
    Image as ImageIcon,
    Wifi,
    Utensils,
    ParkingCircle,
    Waves,
    Flame,
    Refrigerator,
    ChefHat,
    Sparkles,
    Loader2
} from "lucide-react"
import axiosInstance from "@/services/axios-instance"
import { toast } from "sonner"
import Image from "next/image"

interface Service {
    _id: string
    title: string
    description: string
    icon: string
    image: string
    features: string[]
    isActive: boolean
}

const iconsMap: any = {
    Wifi, Utensils, ParkingCircle, Waves, Flame, Refrigerator, ChefHat, Sparkles
}

export default function AdminServicesPage() {
    const [services, setServices] = useState<Service[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isEditing, setIsEditing] = useState<string | null>(null)
    const [isAdding, setIsAdding] = useState(false)
    const [formData, setFormData] = useState<any>({
        title: "",
        description: "",
        icon: "Sparkles",
        features: "",
        image: null
    })
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        fetchServices()
    }, [])

    const fetchServices = async () => {
        try {
            setIsLoading(true)
            const { data } = await axiosInstance.get("/api/v1/services/all")
            if (data.success) {
                setServices(data.services)
            }
        } catch (err) {
            toast.error("Failed to fetch services")
        } finally {
            setIsLoading(false)
        }
    }

    const handleEdit = (service: Service) => {
        setIsEditing(service._id)
        setFormData({
            title: service.title,
            description: service.description,
            icon: service.icon,
            features: service.features.join(", "),
            image: null
        })
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this service?")) return
        try {
            const { data } = await axiosInstance.delete(`/api/v1/services/delete/${id}`)
            if (data.success) {
                toast.success("Service deleted")
                fetchServices()
            }
        } catch (err) {
            toast.error("Failed to delete service")
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        try {
            const submitData = new FormData()
            submitData.append("title", formData.title)
            submitData.append("description", formData.description)
            submitData.append("icon", formData.icon)
            submitData.append("features", JSON.stringify(formData.features.split(",").map((s: string) => s.trim())))
            if (formData.image) {
                submitData.append("image", formData.image)
            }

            let response
            if (isEditing) {
                response = await axiosInstance.put(`/api/v1/services/update/${isEditing}`, submitData)
            } else {
                response = await axiosInstance.post("/api/v1/services/create", submitData)
            }

            if (response.data.success) {
                toast.success(isEditing ? "Service updated" : "Service created")
                setIsEditing(null)
                setIsAdding(false)
                setFormData({ title: "", description: "", icon: "Sparkles", features: "", image: null })
                fetchServices()
            }
        } catch (err) {
            toast.error("Failed to save service")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="p-8 space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Manage Amenities</h1>
                    <p className="text-gray-500 font-medium">Add or edit the services and amenities shown on the Services page.</p>
                </div>
                <Button
                    onClick={() => {
                        setIsAdding(true)
                        setIsEditing(null)
                        setFormData({ title: "", description: "", icon: "Sparkles", features: "", image: null })
                    }}
                    className="bg-blue-600 hover:bg-blue-700 h-12 rounded-xl px-6 font-bold"
                >
                    <Plus className="mr-2 h-5 w-5" /> Add Service
                </Button>
            </div>

            {(isEditing || isAdding) && (
                <Card className="p-8 border-2 border-blue-100 shadow-xl rounded-3xl">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-900">{isEditing ? "Edit Service" : "New Service"}</h2>
                            <Button variant="ghost" onClick={() => { setIsEditing(null); setIsAdding(false); }}>
                                <X className="h-5 w-5" />
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-bold text-gray-400 uppercase tracking-widest">Title</label>
                                    <Input
                                        required
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                        className="h-12 rounded-xl border-gray-100"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-bold text-gray-400 uppercase tracking-widest">Description</label>
                                    <Textarea
                                        required
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        className="min-h-[100px] rounded-xl border-gray-100"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-bold text-gray-400 uppercase tracking-widest">Features (comma separated)</label>
                                    <Input
                                        value={formData.features}
                                        onChange={e => setFormData({ ...formData, features: e.target.value })}
                                        placeholder="Induction, Oven, Microwave"
                                        className="h-12 rounded-xl border-gray-100"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-bold text-gray-400 uppercase tracking-widest">Icon</label>
                                    <div className="grid grid-cols-4 gap-2 mt-2">
                                        {Object.keys(iconsMap).map(iconName => {
                                            const Icon = iconsMap[iconName]
                                            return (
                                                <button
                                                    key={iconName}
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, icon: iconName })}
                                                    className={`p-4 rounded-xl border-2 transition-all flex items-center justify-center ${formData.icon === iconName ? 'border-blue-500 bg-blue-50 text-blue-500' : 'border-gray-50 hover:border-gray-200'}`}
                                                >
                                                    <Icon className="h-6 w-6" />
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-bold text-gray-400 uppercase tracking-widest">Service Image</label>
                                    <div className="mt-2 flex items-center gap-4">
                                        <div className="h-24 w-24 rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden">
                                            {formData.image ? (
                                                <ImageIcon className="h-8 w-8 text-blue-500" />
                                            ) : (
                                                <ImageIcon className="h-8 w-8 text-gray-300" />
                                            )}
                                        </div>
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            onChange={e => setFormData({ ...formData, image: e.target.files?.[0] })}
                                            className="h-12 border-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-50">
                            <Button variant="outline" type="button" onClick={() => { setIsEditing(null); setIsAdding(false); }}>Cancel</Button>
                            <Button className="bg-blue-600 hover:bg-blue-700 min-w-[120px]" disabled={isSubmitting}>
                                {isSubmitting ? <Loader2 className="animate-spin" /> : <><Save className="mr-2 h-4 w-4" /> Save Service</>}
                            </Button>
                        </div>
                    </form>
                </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {isLoading ? (
                    <div className="col-span-full py-20 text-center">
                        <Loader2 className="h-10 w-10 animate-spin mx-auto text-blue-500" />
                        <p className="mt-4 text-gray-500 font-bold uppercase tracking-widest">Loading Amenities...</p>
                    </div>
                ) : services.length === 0 ? (
                    <div className="col-span-full py-20 text-center bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-200">
                        <ImageIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 font-bold uppercase tracking-widest">No amenities added yet</p>
                    </div>
                ) : services.map(service => {
                    const Icon = iconsMap[service.icon] || Sparkles
                    return (
                        <Card key={service._id} className="group overflow-hidden border-none shadow-lg hover:shadow-2xl transition-all duration-500 rounded-[40px] bg-white flex flex-col">
                            <div className="relative h-48">
                                {service.image ? (
                                    <Image
                                        src={`${process.env.NEXT_PUBLIC_BACKEND || "http://localhost:4000"}/images/${service.image}`}
                                        alt={service.title}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="h-full w-full bg-blue-50 flex items-center justify-center">
                                        <Icon className="h-12 w-12 text-blue-200" />
                                    </div>
                                )}
                                <div className="absolute top-4 right-4 flex gap-2">
                                    <button onClick={() => handleEdit(service)} className="h-10 w-10 rounded-xl bg-white/90 backdrop-blur-md text-blue-600 flex items-center justify-center shadow-lg hover:bg-blue-600 hover:text-white transition-all">
                                        <Edit className="h-4 w-4" />
                                    </button>
                                    <button onClick={() => handleDelete(service._id)} className="h-10 w-10 rounded-xl bg-white/90 backdrop-blur-md text-red-600 flex items-center justify-center shadow-lg hover:bg-red-600 hover:text-white transition-all">
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                            <div className="p-8 space-y-4 grow">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                                        <Icon className="h-5 w-5" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900">{service.title}</h3>
                                </div>
                                <p className="text-gray-500 text-sm line-clamp-3 leading-relaxed font-medium">{service.description}</p>
                                <div className="pt-4 border-t border-gray-50 flex flex-wrap gap-2">
                                    {service.features.map(f => (
                                        <span key={f} className="px-3 py-1 bg-gray-50 text-[10px] font-bold text-gray-400 rounded-full border border-gray-100 uppercase tracking-widest">
                                            {f}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </Card>
                    )
                })}
            </div>
        </div>
    )
}
