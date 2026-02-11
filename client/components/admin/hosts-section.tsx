"use client"

import { useEffect, useState } from "react"
import { Edit2, Plus, X, Trash2, Users, User, Shield, Briefcase, Info, Camera } from "lucide-react"
import axiosInstance from "@/services/axios-instance"
import { toast } from "sonner"
import Loading from "@/components/loading"
import Cookies from "js-cookie"
import Image from "next/image"
import Swal from "sweetalert2"

interface Host {
    _id: string
    hostName: string
    imageUri: string
    profession?: string
    bio?: string
    isActive: boolean
}

export function HostsSection() {
    const [hosts, setHosts] = useState<Host[]>([])
    const [showForm, setShowForm] = useState(false)
    const [editingHost, setEditingHost] = useState<Host | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [imageFile, setImageFile] = useState<File | null>(null)
    const TOKEN = Cookies.get("auth_token")

    const [formData, setFormData] = useState({
        hostName: "",
        profession: "",
        bio: "",
        isActive: true
    })

    useEffect(() => {
        fetchHosts()
    }, [])

    const fetchHosts = async () => {
        try {
            setIsLoading(true)
            const { data } = await axiosInstance.get("/api/v1/host/getAllHosts")
            if (data.success) {
                setHosts(data.hosts)
            }
        } catch (err) {
            console.error(err)
            toast.error("Failed to fetch hosts")
        } finally {
            setIsLoading(false)
        }
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setImageFile(file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.hostName) {
            toast.info("Host name is required")
            return
        }

        try {
            setIsLoading(true)
            const payload = new FormData()
            payload.append("hostName", formData.hostName)
            payload.append("profession", formData.profession)
            payload.append("bio", formData.bio)
            payload.append("isActive", formData.isActive.toString())

            if (imageFile) {
                payload.append("hostImage", imageFile)
            }

            if (editingHost) {
                payload.append("_id", editingHost._id)
                const { data } = await axiosInstance.put("/api/v1/host/updateHost", payload, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${TOKEN}`
                    }
                })
                if (data.success) {
                    toast.success("Host updated successfully")
                    fetchHosts()
                    closeForm()
                }
            } else {
                const { data } = await axiosInstance.post("/api/v1/host/addHost", payload, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${TOKEN}`
                    }
                })
                if (data.success) {
                    toast.success("Host added successfully")
                    fetchHosts()
                    closeForm()
                }
            }
        } catch (err: any) {
            console.error(err)
            toast.error(err.response?.data?.message || "Something went wrong")
        } finally {
            setIsLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        const result = await Swal.fire({
            title: "Delete Host?",
            text: "This action cannot be undone.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ef4444",
            cancelButtonColor: "#64748b",
            confirmButtonText: "Yes, delete it!"
        })

        if (result.isConfirmed) {
            try {
                setIsLoading(true)
                const { data } = await axiosInstance.delete(`/api/v1/host/deleteHost/${id}`, {
                    headers: { Authorization: `Bearer ${TOKEN}` }
                })
                if (data.success) {
                    toast.success("Host deleted")
                    fetchHosts()
                }
            } catch (err) {
                console.error(err)
                toast.error("Failed to delete host")
            } finally {
                setIsLoading(false)
            }
        }
    }

    const handleEdit = (host: Host) => {
        setEditingHost(host)
        setFormData({
            hostName: host.hostName,
            profession: host.profession || "",
            bio: host.bio || "",
            isActive: host.isActive
        })
        const BACKEND = process.env.NEXT_PUBLIC_BACKEND || "http://localhost:8000";
        setImagePreview(host.imageUri.startsWith("http") ? host.imageUri : `${BACKEND}/images/${host.imageUri}`)
        setShowForm(true)
    }

    const closeForm = () => {
        setShowForm(false)
        setEditingHost(null)
        setFormData({
            hostName: "",
            profession: "",
            bio: "",
            isActive: true
        })
        setImagePreview(null)
        setImageFile(null)
    }

    const BACKEND = process.env.NEXT_PUBLIC_BACKEND || "http://localhost:8000";

    return (
        <div className="space-y-8 pb-20">
            {isLoading && <Loading color="rgba(0, 0, 0, 0.3)" />}

            <div className="flex justify-between items-center bg-white p-8 rounded-[40px] shadow-sm border border-slate-50">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
                        <Users className="text-blue-500" />
                        Host Management
                    </h2>
                    <p className="text-slate-400 font-medium text-sm mt-1">Manage the dedicated hosts who provide authentic hospitality.</p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="bg-slate-900 hover:bg-black text-white font-bold h-12 px-6 rounded-2xl shadow-xl shadow-slate-100 transition-all flex items-center gap-2 active:scale-95"
                >
                    <Plus size={20} /> Add Host
                </button>
            </div>

            {showForm && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-8">
                    <div className="bg-white rounded-[40px] w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in duration-300">
                        <div className="px-10 py-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                            <h3 className="text-xl font-bold text-slate-900 leading-none">
                                {editingHost ? "Edit Host Profile" : "New Host Profile"}
                            </h3>
                            <button onClick={closeForm} className="h-10 w-10 bg-white shadow-sm border border-slate-100 flex items-center justify-center rounded-xl hover:bg-slate-50 transition-colors">
                                <X size={20} className="text-slate-400" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-10 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                                        <input
                                            type="text"
                                            value={formData.hostName}
                                            onChange={(e) => setFormData({ ...formData, hostName: e.target.value })}
                                            className="w-full h-14 pl-14 pr-5 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-50 font-bold text-slate-800 transition-all"
                                            placeholder="e.g. Ama Yang"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">Profession / Role</label>
                                    <div className="relative">
                                        <Briefcase className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                                        <input
                                            type="text"
                                            value={formData.profession}
                                            onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                                            className="w-full h-14 pl-14 pr-5 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-50 font-bold text-slate-800 transition-all"
                                            placeholder="e.g. Chief Concierge"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">Biography / Welcome Message</label>
                                <div className="relative">
                                    <Info className="absolute left-5 top-5 h-5 w-5 text-slate-300" />
                                    <textarea
                                        value={formData.bio}
                                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                        className="w-full pl-14 pr-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-50 font-medium text-slate-600 min-h-[120px] transition-all"
                                        placeholder="Tell guests about this host..."
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">Profile Photo</label>
                                <div className="border-2 border-dashed border-slate-100 rounded-[32px] p-8 text-center bg-slate-50/50 hover:bg-slate-50 transition-colors cursor-pointer relative">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                    />
                                    {imagePreview ? (
                                        <div className="relative w-40 h-40 mx-auto rounded-[32px] overflow-hidden shadow-xl border-4 border-white">
                                            <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-slate-400 mb-2">
                                                <Camera size={28} />
                                            </div>
                                            <p className="text-sm font-bold text-slate-700">Upload a professional portrait</p>
                                            <p className="text-xs text-slate-400 font-medium italic">Supports JPG, PNG (Recommended 800x800)</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-3 py-2">
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, isActive: !prev.isActive }))}
                                    className={`w-12 h-6 rounded-full transition-all relative ${formData.isActive ? 'bg-blue-500' : 'bg-slate-200'}`}
                                >
                                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.isActive ? 'left-7' : 'left-1'}`} />
                                </button>
                                <span className="text-sm font-bold text-slate-600">Profile is visible in "About Us" section</span>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex-1 bg-slate-900 hover:bg-black text-white font-bold h-14 rounded-2xl shadow-xl shadow-slate-100 transition-all active:scale-95 disabled:opacity-50"
                                >
                                    {isLoading ? "Saving Changes..." : editingHost ? "Update Profile" : "Create Host Profile"}
                                </button>
                                <button
                                    type="button"
                                    onClick={closeForm}
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
                                <th className="px-10 py-5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Host Profile</th>
                                <th className="px-10 py-5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Profession</th>
                                <th className="px-10 py-5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Biography</th>
                                <th className="px-10 py-5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Status</th>
                                <th className="px-10 py-5 text-right text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {hosts.map((host) => (
                                <tr key={host._id} className="hover:bg-slate-50/20 transition-colors group">
                                    <td className="px-10 py-6">
                                        <div className="flex items-center gap-5">
                                            <div className="w-16 h-16 relative rounded-2xl overflow-hidden shadow-sm flex-shrink-0 bg-slate-50 border border-slate-100">
                                                <Image src={host.imageUri ? (host.imageUri.startsWith("http") ? host.imageUri : `${BACKEND}/images/${host.imageUri}`) : "/placeholder.svg"} alt={host.hostName} fill className="object-cover" />
                                            </div>
                                            <div>
                                                <p className="text-base font-bold text-slate-900 tracking-tight leading-tight">{host.hostName}</p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Himalayan Ama Host</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-6">
                                        <span className="text-sm font-bold text-slate-600">{host.profession || "—"}</span>
                                    </td>
                                    <td className="px-10 py-6">
                                        <p className="text-xs font-medium text-slate-400 line-clamp-2 max-w-[250px] italic">
                                            {host.bio ? `"${host.bio}"` : "No biography provided."}
                                        </p>
                                    </td>
                                    <td className="px-10 py-6">
                                        {host.isActive ? (
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-100 uppercase tracking-widest">Active</span>
                                        ) : (
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold bg-slate-50 text-slate-400 border border-slate-100 uppercase tracking-widest">Hidden</span>
                                        )}
                                    </td>
                                    <td className="px-10 py-6 text-right">
                                        <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                                            <button
                                                onClick={() => handleEdit(host)}
                                                className="h-10 w-10 flex items-center justify-center rounded-xl border border-slate-100 text-slate-400 hover:bg-slate-900 hover:text-white transition-all shadow-sm bg-white"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(host._id)}
                                                className="h-10 w-10 flex items-center justify-center rounded-xl border border-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm bg-white"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {hosts.length === 0 && (
                        <div className="py-24 text-center">
                            <Users size={64} className="text-slate-100 mx-auto mb-4" />
                            <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">No hosts registered yet</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
