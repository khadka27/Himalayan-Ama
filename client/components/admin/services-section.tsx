"use client"

import { useEffect, useState } from "react"
import { Edit2, Plus, X, Trash2, Sparkles, Layout, List, Heart, Layers, CheckCircle2, Activity, Cloud, Sun, Moon, Zap, Eye, EyeOff } from "lucide-react"
import axiosInstance from "@/services/axios-instance"
import { toast } from "sonner"
import Loading from "@/components/loading"
import Cookies from "js-cookie"
import Image from "next/image"
import Swal from "sweetalert2"

interface Service {
  _id: string
  title: string
  description: string
  icon: string
  image?: string
  features: string[]
  isActive: boolean
  order: number
}

export function ServicesSection() {
  const [services, setServices] = useState<Service[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const TOKEN = Cookies.get("auth_token")

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    icon: "Sparkles",
    features: "",
    isActive: true,
    order: 0
  })

  const icons = ["Sparkles", "Heart", "Layout", "List", "Layers", "Activity", "Cloud", "Sun", "Moon", "Zap"]

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
      console.error(err)
      toast.error("Failed to fetch services")
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
    if (!formData.title || !formData.description) {
      toast.info("Title and Description are required")
      return
    }

    try {
      setIsLoading(true)
      const formDataPayload = new FormData()
      formDataPayload.append("title", formData.title)
      formDataPayload.append("description", formData.description)
      formDataPayload.append("icon", formData.icon)
      formDataPayload.append("order", formData.order.toString())
      formDataPayload.append("isActive", formData.isActive.toString())

      const featuresArray = formData.features.split(",").map(f => f.trim()).filter(f => f !== "")
      formDataPayload.append("features", JSON.stringify(featuresArray))

      if (imageFile) {
        formDataPayload.append("image", imageFile)
      }

      let response;
      if (editingService) {
        response = await axiosInstance.put(`/api/v1/services/update/${editingService._id}`, formDataPayload, {
          headers: {
            'Authorization': `Bearer ${TOKEN}`,
            'Content-Type': 'multipart/form-data'
          }
        })
      } else {
        response = await axiosInstance.post("/api/v1/services/create", formDataPayload, {
          headers: {
            'Authorization': `Bearer ${TOKEN}`,
            'Content-Type': 'multipart/form-data'
          }
        })
      }

      if (response.data.success) {
        toast.success(editingService ? "Service updated" : "Service added")
        await fetchServices()
        resetForm()
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to save service")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Delete Service?",
      text: "This service will be permanently removed.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#EF4444",
    });

    if (!result.isConfirmed) return;

    try {
      setIsLoading(true)
      const { data } = await axiosInstance.delete(`/api/v1/services/delete/${id}`, {
        headers: { 'Authorization': `Bearer ${TOKEN}` }
      })
      if (data.success) {
        toast.success("Service deleted")
        await fetchServices()
      }
    } catch (err) {
      toast.error("Failed to delete service")
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      setIsLoading(true)
      const { data } = await axiosInstance.put(`/api/v1/services/status/${id}`, {
        status: !currentStatus
      }, {
        headers: { 'Authorization': `Bearer ${TOKEN}` }
      })

      if (data.success) {
        setServices(prev => prev.map(s => s._id === id ? { ...s, isActive: !currentStatus } : s))
        toast.success(`Service ${!currentStatus ? "activated" : "deactivated"}`)
      }
    } catch (err) {
      toast.error("Failed to update status")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (service: Service) => {
    setEditingService(service)
    setFormData({
      title: service.title,
      description: service.description,
      icon: service.icon || "Sparkles",
      features: service.features?.join(", ") || "",
      isActive: service.isActive,
      order: service.order || 0
    })
    const BACKEND = process.env.NEXT_PUBLIC_BACKEND || "http://localhost:8000";
    setImagePreview(service.image ? (service.image.startsWith("http") ? service.image : `${BACKEND}/images/${service.image}`) : null)
    setImageFile(null)
    setShowForm(true)
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      icon: "Sparkles",
      features: "",
      isActive: true,
      order: 0
    })
    setImageFile(null)
    setImagePreview(null)
    setShowForm(false)
    setEditingService(null)
  }

  const BACKEND = process.env.NEXT_PUBLIC_BACKEND || "http://localhost:8000";

  return (
    <div className="space-y-8 pb-20">
      {isLoading && <Loading color="rgba(0, 0, 0, 0.3)" />}

      <div className="flex justify-between items-center bg-white p-8 rounded-[40px] shadow-sm border border-slate-50">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
            <Sparkles className="text-amber-500" />
            Service Catalog
          </h2>
          <p className="text-slate-400 font-medium text-sm mt-1">Define and organize the premium services you offer.</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-slate-900 hover:bg-black text-white font-bold h-12 px-6 rounded-2xl shadow-xl shadow-slate-100 transition-all flex items-center gap-2 active:scale-95"
        >
          <Plus size={20} /> Add Service
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-8">
          <div className="bg-white rounded-[40px] w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in duration-300">
            <div className="px-10 py-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
              <h3 className="text-xl font-bold text-slate-900 leading-none">
                {editingService ? "Edit Service" : "New Service"}
              </h3>
              <button onClick={resetForm} className="h-10 w-10 bg-white shadow-sm border border-slate-100 flex items-center justify-center rounded-xl hover:bg-slate-50 transition-colors">
                <X size={20} className="text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-10 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">Service Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full h-14 px-5 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-amber-50 font-bold text-slate-800 transition-all"
                    placeholder="Guided Meditation"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">Display Order</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                    className="w-full h-14 px-5 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-amber-50 font-bold text-slate-800 transition-all"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">Icon Style</label>
                <div className="flex flex-wrap gap-3">
                  {icons.map((iconName) => {
                    const iconMap: Record<string, any> = {
                      Sparkles, Heart, Layout, List, Layers, Activity, Cloud, Sun, Moon, Zap
                    }
                    const IconComponent = iconMap[iconName] || Sparkles;
                    return (
                      <button
                        key={iconName}
                        type="button"
                        onClick={() => setFormData({ ...formData, icon: iconName })}
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all border ${formData.icon === iconName ? 'bg-amber-500 text-white border-amber-600 shadow-lg shadow-amber-100' : 'bg-slate-50 text-slate-400 border-transparent hover:bg-slate-100'}`}
                        title={iconName}
                      >
                        <IconComponent size={18} />
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">Detailed Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-5 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-amber-50 font-medium text-slate-600 min-h-[120px] transition-all"
                  placeholder="Describe the value this service provides..."
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">Key Features (Comma separated)</label>
                <input
                  type="text"
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  className="w-full h-14 px-5 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-amber-50 font-bold text-slate-800 transition-all"
                  placeholder="Feature 1, Feature 2, Feature 3"
                />
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">Cover Image</label>
                <div className="border-2 border-dashed border-slate-100 rounded-[32px] p-8 text-center bg-slate-50/50 hover:bg-slate-50 transition-colors cursor-pointer relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  {imagePreview ? (
                    <div className="relative w-full h-40 rounded-2xl overflow-hidden shadow-sm">
                      <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-slate-400 mb-2">
                        <Layout size={24} />
                      </div>
                      <p className="text-sm font-bold text-slate-700">Add a stunning cover image</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 py-2">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, isActive: !prev.isActive }))}
                  className={`w-12 h-6 rounded-full transition-all relative ${formData.isActive ? 'bg-amber-500' : 'bg-slate-200'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.isActive ? 'left-7' : 'left-1'}`} />
                </button>
                <span className="text-sm font-bold text-slate-600">Visible for potential clients</span>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-bold h-14 rounded-2xl shadow-xl shadow-amber-100 transition-all active:scale-95"
                >
                  {isLoading ? "Syncing..." : editingService ? "Update Service" : "Launch Service"}
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
                <th className="px-10 py-5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Service</th>
                <th className="px-10 py-5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Sequence</th>
                <th className="px-10 py-5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Features</th>
                <th className="px-10 py-5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Status</th>
                <th className="px-10 py-5 text-right text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {services.sort((a, b) => a.order - b.order).map((service) => (
                <tr key={service._id} className="hover:bg-slate-50/20 transition-colors group">
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 relative rounded-2xl overflow-hidden shadow-sm flex-shrink-0 bg-slate-50 border border-slate-100">
                        <Image src={service.image ? (service.image.startsWith("http") ? service.image : `${BACKEND}/images/${service.image}`) : "/placeholder.svg"} alt={service.title} fill className="object-cover" />
                      </div>
                      <div>
                        <p className="text-base font-bold text-slate-900 tracking-tight leading-tight">{service.title}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 line-clamp-1 max-w-[200px]">{service.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center font-black text-slate-400 text-xs">
                      {service.order}
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <div className="flex flex-wrap gap-1 max-w-[250px]">
                      {service.features?.slice(0, 3).map((f, i) => (
                        <span key={i} className="px-2 py-0.5 bg-slate-50 text-slate-500 rounded-md text-[9px] font-bold border border-slate-100">
                          {f}
                        </span>
                      ))}
                      {service.features?.length > 3 && (
                        <span className="text-[9px] font-bold text-slate-400">+{service.features.length - 3}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    {service.isActive ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100 uppercase tracking-widest">
                        <Eye size={10} /> Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-slate-50 text-slate-400 border border-slate-100 uppercase tracking-widest">
                        <EyeOff size={10} /> Disabled
                      </span>
                    )}
                  </td>
                  <td className="px-10 py-6 text-right">
                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                      <button
                        onClick={() => handleToggleStatus(service._id, service.isActive)}
                        className={`h-10 w-10 flex items-center justify-center rounded-xl border transition-all shadow-sm bg-white ${service.isActive ? 'hover:bg-red-500 hover:text-white border-slate-100 text-slate-400' : 'hover:bg-emerald-500 hover:text-white border-emerald-50 text-emerald-500'}`}
                        title={service.isActive ? "Hide Service" : "Show Service"}
                      >
                        {service.isActive ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                      <button
                        onClick={() => handleEdit(service)}
                        className="h-10 w-10 flex items-center justify-center rounded-xl border border-slate-100 text-slate-400 hover:bg-slate-900 hover:text-white transition-all shadow-sm bg-white"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(service._id)}
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
          {services.length === 0 && (
            <div className="py-24 text-center">
              <Sparkles size={64} className="text-slate-100 mx-auto mb-4" />
              <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">No services configured</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}