"use client"

import { useEffect, useState } from "react"
import { Edit2, Plus, X, Trash2 } from "lucide-react"
import axiosInstance from "@/services/axios-instance"
import { toast } from "sonner"
import Loading from "../loading"
import Cookies from "js-cookie"
import Image from "next/image"

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
            setIsLoading(false)
            if (data.success) {
                setFlats(data.flats)
            }
        } catch (err) {
            setIsLoading(false)
            console.error(err)
            toast.error("Failed to fetch flats")
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
                        setImagePreviews([...imagePreviews, ...newPreviews])
                    }
                }
                reader.readAsDataURL(file)
            })

            setImageFiles([...imageFiles, ...newFiles])
        }
    }

    const removeImage = (index: number) => {
        setImagePreviews(imagePreviews.filter((_, i) => i !== index))
        setImageFiles(imageFiles.filter((_, i) => i !== index))
    }

    const handleAddFlat = async () => {
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

            // Append all image files
            imageFiles.forEach((file, index) => {
                formDataPayload.append("images", file)
            })

            const { data } = await axiosInstance.post("/api/v1/flats/create", formDataPayload, {
                headers: {
                    'Authorization': `Bearer ${TOKEN}`,
                    'Content-Type': 'multipart/form-data'
                },
            })

            if (data.success) {
                await fetchFlats()
                resetForm()
                toast.success(data.message || "Flat added successfully")
            } else {
                toast.info(data.message || "Error while creating flat")
            }
        } catch (err) {
            toast.error((err as Error).message)
        } finally {
            setIsLoading(false)
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

        // For images, we show existing URLs. 
        // In this simple implementation, if user uploads new images, we will APPEND them as per backend service logic.
        // Ideally we should handle delete existing images too, but backend 'updateFlat' appends newImages.
        // Existing images are in flat.imagesUri
        // We can show them as previews but maybe distinct from new uploads?
        // For simplicity, let's just show existing ones as previews.
        // Note: The backend update logic simply appends new images. It doesn't seem to support removing specific old images easily without more complex logic.
        // Let's stick to appending new images for now. A more robust solution would be needed for full image management.

        // Construct full URLs if needed, but backend sends relative or absolute? Backend sends filename usually looking at service code.
        // We might need to prepend backend URL.
        const BACKEND = process.env.NEXT_PUBLIC_BACKEND || "http://localhost:4000";
        const existingImages = flat.imagesUri.map(img => img.startsWith("http") ? img : `${BACKEND}/images/${img}`);

        setImagePreviews(existingImages)
        setImageFiles([])
        setShowForm(true)
    }

    const handleUpdateFlat = async () => {
        if (!editingFlat || !formData.flatName || !formData.location || !formData.price) {
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

            // Append all new image files
            if (imageFiles.length > 0) {
                imageFiles.forEach((file) => {
                    formDataPayload.append("images", file)
                })
            }

            const { data } = await axiosInstance.put(`/api/v1/flats/update/${editingFlat._id}`, formDataPayload, {
                headers: {
                    'Authorization': `Bearer ${TOKEN}`,
                    'Content-Type': 'multipart/form-data' // axios usually sets this automatically with boundary if FormData is passed, but safe to specify or let axios handle it. 
                    // Actually better to let axios handle it to set boundary correctly.
                },
            })


            if (data.success) {
                toast.success(data.message || "Flat updated successfully")
                await fetchFlats()
                resetForm()
            } else {
                toast.error(data.message || "Failed to update flat")
            }
        } catch (err) {
            console.error("Update error:", err)
            toast.error((err as Error).message);
        } finally {
            setIsLoading(false)
        }
    }

    const handleDeleteFlat = async (id: string) => {
        if (!confirm("Are you sure you want to delete this flat?")) return;

        try {
            setIsLoading(true)
            const { data } = await axiosInstance.delete(`/api/v1/flats/delete/${id}`, {
                headers: {
                    'Authorization': `Bearer ${TOKEN}`
                }
            })

            if (data.success) {
                toast.success(data.message || "Flat deleted successfully");
                await fetchFlats();
            } else {
                toast.error(data.message || "Failed to delete flat");
            }
        } catch (err) {
            toast.error((err as Error).message);
        } finally {
            setIsLoading(false)
        }
    }

    const handleToggleActive = async (flatId: string, currentStatus: boolean) => {
        try {
            setIsLoading(true);

            const { data } = await axiosInstance.put(`/api/v1/flats/status/${flatId}`, {
                status: !currentStatus
            }, {
                headers: {
                    'Authorization': `Bearer ${TOKEN}`
                }
            })

            if (data.success) {
                await fetchFlats()
                toast.success(data.message || `Flat ${!currentStatus ? "activated" : "deactivated"} successfully`)
            }
        } catch (err) {
            toast.error((err as Error).message)
        } finally {
            setIsLoading(false);
        }
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

    const BACKEND = process.env.NEXT_PUBLIC_BACKEND || "http://localhost:4000";

    return (
        <>
            {isLoading && <Loading color="rgba(0, 0, 0, 0.3)" />}

            <div>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-serif font-bold text-sage-900">Apartments Management</h2>
                    <button
                        onClick={() => {
                            setEditingFlat(null)
                            resetForm()
                            setShowForm(true)
                        }}
                        className="flex items-center gap-2 bg-sage-600 text-white px-4 py-2 rounded-lg hover:bg-sage-700 transition"
                    >
                        <Plus size={20} />
                        Add Apartment
                    </button>
                </div>

                {showForm && (
                    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                            <div className="sticky top-0 bg-white border-b border-sage-200 px-6 py-4 flex justify-between items-center">
                                <h3 className="text-xl font-semibold text-sage-900">
                                    {editingFlat ? "Edit Apartment" : "Create New Apartment"}
                                </h3>
                                <button onClick={resetForm} className="p-1 hover:bg-sage-100 rounded-lg transition">
                                    <X size={24} className="text-sage-600" />
                                </button>
                            </div>

                            <div className="p-6 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <input
                                            type="text"
                                            placeholder="Apartment Name *"
                                            value={formData.flatName}
                                            onChange={(e) => setFormData({ ...formData, flatName: e.target.value })}
                                            className="w-full px-4 py-2 border border-sage-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-600"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <input
                                            type="text"
                                            placeholder="Location *"
                                            value={formData.location}
                                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                            className="w-full px-4 py-2 border border-sage-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-600"
                                        />
                                    </div>

                                    <div>
                                        <input
                                            type="number"
                                            placeholder="Price ($/Month) *"
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                            className="w-full px-4 py-2 border border-sage-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-600"
                                        />
                                    </div>
                                </div>

                                {/* Images Section */}
                                <div className="mb-6">
                                    <h4 className="text-lg font-semibold text-sage-900 mb-4">Apartment Images</h4>
                                    <div className="border-2 border-dashed border-sage-300 rounded-lg p-4">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            multiple
                                            className="w-full mb-4"
                                        />
                                        <p className="text-sm text-sage-600">
                                            Upload multiple images (Current: {imagePreviews.length} images)
                                        </p>

                                        {imagePreviews.length > 0 && (
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                                                {imagePreviews.map((preview, index) => (
                                                    <div key={index} className="relative group">
                                                        <img
                                                            src={preview || "/placeholder.svg"}
                                                            alt={`Preview ${index + 1}`}
                                                            className="w-full h-32 object-cover rounded-lg"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => removeImage(index)}
                                                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            <X size={16} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 pt-2">
                                    <input
                                        type="checkbox"
                                        id="is_active"
                                        checked={formData.isActive}
                                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                        className="h-5 w-5 text-sage-600 border-sage-300 rounded focus:ring-sage-600"
                                    />
                                    <label htmlFor="is_active" className="text-sage-700 font-medium cursor-pointer">
                                        Apartment is active
                                    </label>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={editingFlat ? handleUpdateFlat : handleAddFlat}
                                        disabled={isLoading}
                                        className="bg-sage-600 text-white px-6 py-2 rounded-lg hover:bg-sage-700 transition disabled:opacity-50"
                                    >
                                        {isLoading ? "Processing..." : editingFlat ? "Update Apartment" : "Add Apartment"}
                                    </button>
                                    <button
                                        onClick={resetForm}
                                        className="bg-sage-200 text-sage-900 px-6 py-2 rounded-lg hover:bg-sage-300 transition"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
                }

                <div className="bg-white rounded-lg border border-sage-200 overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-sage-50 border-b border-sage-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-sage-900">Apartment Details</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-sage-900">Location</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-sage-900">Price</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-sage-900">Images</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-sage-900">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {flats.map((flat, idx) => (
                                    <tr key={flat._id} className={idx % 2 === 0 ? "bg-white" : "bg-sage-50"}>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-sage-900">{flat.flatName}</div>
                                            <div className="text-xs text-sage-500 mt-1">
                                                <div>
                                                    Status:
                                                    <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-medium ${flat.isActive
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-red-100 text-red-700"
                                                        }`}>
                                                        {flat.isActive ? "Active" : "Inactive"}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="text-sm text-sage-900">{flat.location}</div>
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-sage-900">${flat.price}</div>
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="flex gap-2">
                                                {flat.imagesUri && flat.imagesUri.slice(0, 2).map((img, index) => {
                                                    const src = img.startsWith("http") ? img : `${BACKEND}/images/${img}`;
                                                    return (
                                                        <div key={index} className="w-10 h-10 rounded overflow-hidden border border-sage-200 relative">
                                                            <Image
                                                                src={src || "/placeholder.svg"}
                                                                alt={`Flat ${index + 1}`}
                                                                fill
                                                                className="object-cover"
                                                            />
                                                        </div>
                                                    )
                                                })}
                                                {flat.imagesUri && flat.imagesUri.length > 2 && (
                                                    <div className="w-10 h-10 bg-sage-100 rounded flex items-center justify-center border border-sage-200">
                                                        <span className="text-xs text-sage-600">+{flat.imagesUri.length - 2}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 text-sm flex gap-2 items-center">
                                            <button
                                                onClick={() => handleEditFlat(flat)}
                                                className="p-2 hover:bg-sage-100 rounded-lg transition"
                                                title="Edit apartment"
                                            >
                                                <Edit2 size={16} className="text-sage-600" />
                                            </button>

                                            <button
                                                onClick={() => handleDeleteFlat(flat._id)}
                                                className="p-2 hover:bg-red-100 rounded-lg transition"
                                                title="Delete apartment"
                                            >
                                                <Trash2 size={16} className="text-red-600" />
                                            </button>

                                            {/* Active Toggle Switch */}
                                            <div className="relative inline-block w-11 h-6">
                                                <input
                                                    type="checkbox"
                                                    checked={flat.isActive}
                                                    onChange={() => handleToggleActive(flat._id, flat.isActive)}
                                                    className="sr-only peer"
                                                    id={`toggle-${flat._id}`}
                                                />
                                                <label
                                                    htmlFor={`toggle-${flat._id}`}
                                                    className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 rounded-full transition-all duration-300 ${flat.isActive ? 'bg-sage-600' : 'bg-gray-300'}`}
                                                >
                                                    <span
                                                        className={`absolute top-0.5 left-0.5 bg-white rounded-full w-5 h-5 transition-all duration-300 shadow-sm transform ${flat.isActive ? 'translate-x-5' : ''}`}
                                                    />
                                                </label>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}
