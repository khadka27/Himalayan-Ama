"use client"

import { useEffect, useState } from "react"
import { Edit2, Plus, X, Clock, Calendar, Timer } from "lucide-react"
import axiosInstance from "@/services/axios-instance"
import { toast } from "sonner"
import Loading from "../loading"
import Cookies from "js-cookie"

interface Instructor {
  id: string
  name: string
  profession: string
  experience: string
  bio: string
  specialities: string
  certifications: string
  image: string
  created_at: string
}

interface Service {
  id: number
  title: string
  description: string
  benefits: string[]
  available_time_slots: Record<string, string[]>
  duration: number
  session_time?: string
  instructor_name: string
  yoga_type: string
  image_urls: string[]
  created_at: string
  updated_at: string
  is_active?: boolean
  // For form handling
  instructor_id?: string
  price?: number
  capacity?: number
  pricing_options?: {
    label: string
    price: number
    currency: string
    min_pax: number
    max_pax: number
    description?: string
  }[]
}

export function Services() {
  const [services, setServices] = useState<Service[]>([])
  const [instructors, setInstructors] = useState<Instructor[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const TOKEN = Cookies.get("auth_token")

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    benefits: "",
    instructor_id: "",
    yoga_type: "",
    price: "",
    capacity: "",
    duration: "60", // Default duration in minutes (sort key)
    session_time: "", // Display duration (e.g. "23 Days")
    is_active: true
  })

  // State for Pricing Options
  const [pricingOptions, setPricingOptions] = useState<any[]>([])
  const [newPricingOption, setNewPricingOption] = useState({
    label: "",
    price: "",
    min_pax: "1",
    max_pax: "1",
    description: ""
  })

  const addPricingOption = () => {
    if (!newPricingOption.label || !newPricingOption.price) {
      toast.info("Label and Price are required")
      return
    }
    setPricingOptions([...pricingOptions, {
      ...newPricingOption,
      currency: "USD", // Default
      price: Number(newPricingOption.price),
      min_pax: Number(newPricingOption.min_pax),
      max_pax: Number(newPricingOption.max_pax)
    }])
    setNewPricingOption({ label: "", price: "", min_pax: "1", max_pax: "1", description: "" })
  }

  const removePricingOption = (idx: number) => {
    setPricingOptions(pricingOptions.filter((_, i) => i !== idx))
  }

  // State for available_time_slots
  // { "DD-MM-YYYY": ["HH:MM AM", "HH:MM AM"] }
  const [availableTimeSlots, setAvailableTimeSlots] = useState<Record<string, string[]>>({})

  // Temporary state for adding a new slot
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("09:00")

  const yogaTypes = [
    "Training",
    "Retreat",
    "Class",
    "Wellness",
    "Trek"
  ]

  // Removed daysOfWeek as we use specific dates now

  const timeSlots = [
    "06:00", "06:30",
    "07:00", "07:30",
    "08:00", "08:30",
    "09:00", "09:30",
    "10:00", "10:30",
    "11:00", "11:30",
    "12:00", "12:30",
    "13:00", "13:30",
    "14:00", "14:30",
    "15:00", "15:30",
    "16:00", "16:30",
    "17:00", "17:30",
    "18:00", "18:30",
    "19:00", "19:30",
    "20:00"
  ]

  const durationOptions = [
    { value: 30, label: "30 mins" },
    { value: 45, label: "45 mins" },
    { value: 60, label: "1 hour" },
    { value: 75, label: "1 hour 15 mins" },
    { value: 90, label: "1 hour 30 mins" },
    { value: 105, label: "1 hour 45 mins" },
    { value: 120, label: "2 hours" }
  ]

  // Format 24h time to 12h AM/PM for display and storage
  const formatTime12Hour = (time24: string) => {
    if (!time24) return ""
    const [hours, minutes] = time24.split(':')
    const hour = parseInt(hours)
    if (isNaN(hour)) return time24

    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  const formatTime = (time: string) => {
    if (!time) return "Invalid time"
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours)
    if (isNaN(hour)) return time

    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  const formatDuration = (minutes: number) => {
    if (!minutes) return "Invalid duration"

    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60

    if (hours === 0) {
      return `${mins} mins`
    } else if (mins === 0) {
      return `${hours} ${hours === 1 ? 'hour' : 'hours'}`
    } else {
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ${mins} mins`
    }
  }

  // Convert YYYY-MM-DD to DD-MM-YYYY
  const formatKeyDate = (dateString: string) => {
    if (!dateString) return ""
    const [year, month, day] = dateString.split('-')
    return `${day}-${month}-${year}`
  }

  // Convert DD-MM-YYYY to YYYY-MM-DD for input value
  const parseKeyDate = (dateKey: string) => {
    if (!dateKey) return ""
    const [day, month, year] = dateKey.split('-')
    return `${year}-${month}-${day}`
  }

  const calculateEndTime = (startTime: string, duration: number) => {
    if (!startTime || !duration) return ""

    const [hours, minutes] = startTime.split(':').map(Number)
    const startDate = new Date()
    startDate.setHours(hours, minutes, 0, 0)

    const endDate = new Date(startDate.getTime() + duration * 60000)

    const endHours = endDate.getHours().toString().padStart(2, '0')
    const endMinutes = endDate.getMinutes().toString().padStart(2, '0')

    return `${endHours}:${endMinutes}`
  }

  useEffect(() => {
    fetchServices()
    fetchInstructors()
  }, [])

  const fetchServices = async () => {
    try {
      setIsLoading(true)
      const { data } = await axiosInstance.get("/api/services")
      setIsLoading(false)
      if (data.status) {
        const formattedServices = data.data.map((service: any) => ({
          ...service,
          // Handle available_time_slots from API, default to empty object
          available_time_slots: (() => {
            const slots = service.available_time_slots || {};
            const normalized: Record<string, string[]> = {};
            Object.keys(slots).forEach(key => {
              // Check if key is YYYY-MM-DD
              if (/^\d{4}-\d{2}-\d{2}$/.test(key)) {
                const [y, m, d] = key.split('-');
                normalized[`${d}-${m}-${y}`] = slots[key];
              } else {
                normalized[key] = slots[key];
              }
            });
            return normalized;
          })(),
          duration: service.duration || 60
        }))
        setServices(formattedServices)
      }
    } catch (err) {
      toast.error((err as Error).message)
    }
  }

  const fetchInstructors = async () => {
    try {
      const { data } = await axiosInstance.get("/api/instructors")
      if (data.status) {
        setInstructors(data.data)
      }
    } catch (err) {
      toast.error((err as Error).message)
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

  const getInstructorName = (instructorId: string) => {
    const instructor = instructors.find(inst => inst.id === instructorId)
    return instructor ? instructor.name : "Unknown"
  }

  const addTimeSlot = () => {
    if (!selectedDate || !selectedTime) {
      toast.info("Please select a date and time")
      return
    }

    const dateKey = formatKeyDate(selectedDate)
    const formattedTime = formatTime12Hour(selectedTime)

    setAvailableTimeSlots(prev => {
      const currentSlots = prev[dateKey] || []
      if (currentSlots.includes(formattedTime)) {
        toast.info("This time slot already exists for the selected date")
        return prev
      }
      return {
        ...prev,
        [dateKey]: [...currentSlots, formattedTime].sort() // simple string sort for times
      }
    })
  }

  const removeTimeSlot = (dateKey: string, timeToRemove: string) => {
    setAvailableTimeSlots(prev => {
      const currentSlots = prev[dateKey] || []
      const updatedSlots = currentSlots.filter(t => t !== timeToRemove)

      if (updatedSlots.length === 0) {
        const { [dateKey]: _, ...rest } = prev
        return rest
      }

      return {
        ...prev,
        [dateKey]: updatedSlots
      }
    })
  }

  const removeDate = (dateKey: string) => {
    setAvailableTimeSlots(prev => {
      const { [dateKey]: _, ...rest } = prev
      return rest
    })
  }

  const handleAddService = async () => {
    if (!formData.title || !formData.description || !formData.instructor_id || !formData.yoga_type) {
      toast.info("Please fill in all required fields")
      return
    }

    if (Object.keys(availableTimeSlots).length === 0) {
      toast.info("Please add at least one time slot")
      return
    }

    try {
      setIsLoading(true)

      const formDataPayload = new FormData()
      formDataPayload.append("title", formData.title)
      formDataPayload.append("description", formData.description)
      formDataPayload.append("benefits", formData.benefits)
      formDataPayload.append("instructor_id", formData.instructor_id)
      formDataPayload.append("yoga_type", formData.yoga_type)
      formDataPayload.append("price", formData.price || "0")
      formDataPayload.append("capacity", formData.capacity || "0")
      formDataPayload.append("duration", formData.duration?.toString() || "60")
      formDataPayload.append("session_time", formData.session_time || "")
      formDataPayload.append("is_active", formData.is_active.toString())

      // Append pricing_options if existing, or just rely on global Price
      // If backend supports it, we send it. Using 'benefits' field hack if strictly needed? 
      // User said "dont change backend", so we rely on backend having 'pricing_options' OR we ignore it.
      // But user ASKED for it. We will try to send 'pricing_options' as JSON string if backend accepts generic inputs
      // OR we can't save it without backend change. 
      // However, we can append it and if backend ignores it, fine.
      // Wait, 'benefits' is cast to array. Maybe we can misuse? No.
      // Let's send it as a separate field.
      if (pricingOptions.length > 0) {
        formDataPayload.append("pricing_options", JSON.stringify(pricingOptions))
      }

      // Append available_time_slots as JSON
      // Convert to YYYY-MM-DD for backend
      const formattedSlots: Record<string, string[]> = {};
      Object.keys(availableTimeSlots).forEach(key => {
        // key is DD-MM-YYYY
        const parts = key.split('-');
        if (parts.length === 3) {
          const [d, m, y] = parts;
          formattedSlots[`${y}-${m}-${d}`] = availableTimeSlots[key];
        } else {
          formattedSlots[key] = availableTimeSlots[key];
        }
      });
      formDataPayload.append("available_time_slots", JSON.stringify(formattedSlots))

      // Append all image files
      imageFiles.forEach((file, index) => {
        formDataPayload.append(`images[${index}]`, file)
      })

      const { data } = await axiosInstance.post("/api/services", formDataPayload, {
        headers: {
          'Authorization': `Bearer ${TOKEN}`,

        },
      })

      if (data.status) {
        await fetchServices()
        resetForm()
        toast.success(data.message || "Service added successfully")
      } else {
        toast.info(data.message || "Error while creating service")
      }
    } catch (err) {
      toast.error((err as Error).message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditService = (service: Service) => {
    setEditingService(service)
    setFormData({
      title: service.title,
      description: service.description,
      benefits: service.benefits?.join(", ") || "",
      instructor_id: service.instructor_id || "",
      yoga_type: service.yoga_type,
      price: service.price?.toString() || "",
      capacity: service.capacity?.toString() || "",
      duration: service.duration?.toString() || "60",
      session_time: service.session_time || "", // Map backend session_time
      is_active: service.is_active || true
    })
    setPricingOptions(service.pricing_options || [])
    setAvailableTimeSlots(service.available_time_slots || {})
    setImagePreviews(service.image_urls || [])
    setImageFiles([])
    setShowForm(true)
  }

  const handleUpdateService = async () => {
    if (!editingService || !formData.title || !formData.description || !formData.instructor_id || !formData.yoga_type) {
      toast.info("Please fill in all required fields")
      return
    }

    if (Object.keys(availableTimeSlots).length === 0) {
      toast.info("Please add at least one time slot")
      return
    }

    try {
      setIsLoading(true)

      const formDataPayload = new FormData()
      formDataPayload.append("title", formData.title)
      formDataPayload.append("description", formData.description)
      formDataPayload.append("benefits", formData.benefits)
      formDataPayload.append("instructor_id", formData.instructor_id)
      formDataPayload.append("yoga_type", formData.yoga_type)
      formDataPayload.append("price", formData.price || "0")
      formDataPayload.append("capacity", formData.capacity || "0")
      formDataPayload.append("duration", formData.duration?.toString() || "60")
      formDataPayload.append("is_active", formData.is_active.toString())
      // Append available_time_slots as JSON
      // Convert to YYYY-MM-DD for backend
      const formattedSlots: Record<string, string[]> = {};
      Object.keys(availableTimeSlots).forEach(key => {
        // key is DD-MM-YYYY
        const parts = key.split('-');
        if (parts.length === 3) {
          const [d, m, y] = parts;
          formattedSlots[`${y}-${m}-${d}`] = availableTimeSlots[key];
        } else {
          formattedSlots[key] = availableTimeSlots[key];
        }
      });

      for (const [key, value] of Object.entries(formattedSlots)) {
        formDataPayload.append(`available_time_slots[${key}]`, JSON.stringify(value))
      }

      // Append all new image files
      if (imageFiles.length > 0) {
        imageFiles.forEach((file) => {
          formDataPayload.append("images[]", file)
        })
      }

      // Log FormData for debugging
      const entries = Array.from(formDataPayload.entries());

      const { data } = await axiosInstance.post(`/api/services/${editingService.id}`, formDataPayload, {
        headers: {
          'Authorization': `Bearer ${TOKEN}`,
          // Content-Type is set automatically
        },
      })


      if (data.status) {
        toast.success(data.message || "Service updated successfully")
        fetchServices() // Refresh the list
        resetForm()
      } else {
        toast.error(data.message || "Failed to update service")
      }
    } catch (err) {
      console.error("Update error:", err)

      // Handle specific server status errors
      const errorStr = (err as Error).message;
      if (errorStr.includes("405")) {
        toast.error("Method Not Allowed (405). Please check API method.");
      } else if (errorStr.includes("422")) {
        toast.error("Validation Error. Please check inputs.");
      } else {
        toast.error(errorStr);
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleActive = async (serviceId: number) => {
    try {
      setIsLoading(true);
      const service = services.find(s => s.id === serviceId)
      if (!service) return

      const { data } = await axiosInstance.post(`/api/services/${serviceId}/toggle-status`, {}, {
        headers: {
          'Authorization': `Bearer ${TOKEN}`
        }
      })

      if (data.status) {
        await fetchServices() // Refresh the list
        toast.success(data.message || `Service ${service.is_active ? "deactivated" : "activated"} successfully`)
      }
    } catch (err) {
      toast.error((err as Error).message)
    } finally {
      setIsLoading(false);
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      benefits: "",
      instructor_id: "",
      yoga_type: "",
      price: "",
      capacity: "",
      duration: "60",
      session_time: "",
      is_active: true
    })
    setPricingOptions([])
    setAvailableTimeSlots({})
    setSelectedDate("")
    setSelectedTime("09:00")
    setImageFiles([])
    setImagePreviews([])
    setShowForm(false)
    setEditingService(null)
  }



  return (
    <>
      {isLoading && <Loading color="rgba(0, 0, 0, 0.3)" />}

      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-serif font-bold text-sage-900">Services Management</h2>
          <button
            onClick={() => {
              setEditingService(null)
              setShowForm(!showForm)
            }}
            className="flex items-center gap-2 bg-sage-600 text-white px-4 py-2 rounded-lg hover:bg-sage-700 transition"
          >
            <Plus size={20} />
            Add Service
          </button>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-5xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-sage-200 px-6 py-4 flex justify-between items-center">
                <h3 className="text-xl font-semibold text-sage-900">
                  {editingService ? "Edit Service" : "Create New Service"}
                </h3>
                <button onClick={resetForm} className="p-1 hover:bg-sage-100 rounded-lg transition">
                  <X size={24} className="text-sage-600" />
                </button>
              </div>

              <div className="p-6 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <input
                      type="text"
                      placeholder="Service Title *"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-2 border border-sage-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-600"
                    />
                  </div>

                  <div>
                    <select
                      value={formData.instructor_id}
                      onChange={(e) => setFormData({ ...formData, instructor_id: e.target.value })}
                      className="w-full px-4 py-2 border border-sage-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-600"
                    >
                      <option value="">Select Instructor *</option>
                      {instructors.map((instructor) => (
                        <option key={instructor.id} value={instructor.id}>
                          {instructor.name} - {instructor.profession}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <select
                      value={formData.yoga_type}
                      onChange={(e) => setFormData({ ...formData, yoga_type: e.target.value })}
                      className="w-full px-4 py-2 border border-sage-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-600"
                    >
                      <option value="">Select Category *</option>
                      {yogaTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <input
                      type="number"
                      placeholder="Price ($) *"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full px-4 py-2 border border-sage-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-600"
                    />
                  </div>

                  <div>
                    <input
                      type="number"
                      placeholder="Capacity *"
                      value={formData.capacity}
                      onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                      className="w-full px-4 py-2 border border-sage-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-600"
                    />
                  </div>

                </div>

                <div className="space-y-2">
                  <label className="text-xs text-sage-600 block mb-1">Duration (Display Text)</label>
                  <input
                    type="text"
                    placeholder="e.g. 23 Days / 90 Mins"
                    value={formData.session_time}
                    onChange={(e) => setFormData({ ...formData, session_time: e.target.value })}
                    className="w-full px-4 py-2 border border-sage-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-600"
                  />
                </div>

                {/* Pricing Options Builder */}
                <div className="md:col-span-2 bg-sage-50 p-4 rounded-lg border border-sage-200">
                  <h4 className="font-semibold text-sage-900 mb-2">Pricing Variants (Optional)</h4>
                  <p className="text-xs text-sage-600 mb-3">Add variants for diff durations, pax, or room types. Leave empty to use standard Price.</p>

                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
                    <input
                      placeholder="Label (e.g. Deluxe, 2 Pax)"
                      value={newPricingOption.label}
                      onChange={e => setNewPricingOption({ ...newPricingOption, label: e.target.value })}
                      className="px-3 py-2 border rounded text-sm focus:ring-1 focus:ring-sage-600 outline-none"
                    />
                    <input
                      type="number"
                      placeholder="Price ($)"
                      value={newPricingOption.price}
                      onChange={e => setNewPricingOption({ ...newPricingOption, price: e.target.value })}
                      className="px-3 py-2 border rounded text-sm focus:ring-1 focus:ring-sage-600 outline-none"
                    />
                    <input
                      type="number"
                      placeholder="Min Pax"
                      value={newPricingOption.min_pax}
                      onChange={e => setNewPricingOption({ ...newPricingOption, min_pax: e.target.value })}
                      className="px-3 py-2 border rounded text-sm focus:ring-1 focus:ring-sage-600 outline-none"
                    />
                    <input
                      type="number"
                      placeholder="Max Pax"
                      value={newPricingOption.max_pax}
                      onChange={e => setNewPricingOption({ ...newPricingOption, max_pax: e.target.value })}
                      className="px-3 py-2 border rounded text-sm focus:ring-1 focus:ring-sage-600 outline-none"
                    />
                    <button type="button" onClick={addPricingOption} className="bg-sage-600 text-white rounded px-4 py-2 text-sm hover:bg-sage-700 transition font-medium">Add Option</button>
                  </div>

                  {pricingOptions.length > 0 && (
                    <div className="space-y-1">
                      {pricingOptions.map((opt, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-white border p-2 rounded text-sm">
                          <span><strong>{opt.label}</strong>: ${opt.price} ({opt.min_pax}-{opt.max_pax} pax)</span>
                          <button type="button" onClick={() => removePricingOption(idx)}><X size={14} /></button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="md:col-span-2">
                  <textarea
                    placeholder="Description *"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 border border-sage-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-600"
                    rows={3}
                  />
                </div>

                <div className="md:col-span-2">
                  <textarea
                    placeholder="Benefits (comma separated) *"
                    value={formData.benefits}
                    onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                    className="w-full px-4 py-2 border border-sage-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-600"
                    rows={2}
                  />
                </div>

                {/* Schedule Section */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-sage-900 mb-4 flex items-center gap-2">
                    <Calendar size={20} />
                    Class Availability *
                  </h4>

                  <div className="space-y-4">
                    <div className="bg-sage-50 p-6 rounded-lg border border-sage-200">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                        {/* Date Picker */}
                        <input
                          type="date"
                          value={selectedDate} // YYYY-MM-DD
                          onChange={(e) => setSelectedDate(e.target.value)}
                          className="px-4 py-2 border border-sage-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-600"
                        />

                        {/* Time Picker */}
                        <select
                          value={selectedTime}
                          onChange={(e) => setSelectedTime(e.target.value)}
                          className="px-4 py-2 border border-sage-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-600"
                        >
                          <option value="" disabled>Select Time</option>
                          {timeSlots.map((time) => (
                            <option key={time} value={time}>
                              {formatTime(time)}
                            </option>
                          ))}
                        </select>

                        <button
                          onClick={addTimeSlot}
                          className="px-4 py-2 bg-sage-600 text-white rounded-lg hover:bg-sage-700 transition flex items-center justify-center gap-2"
                        >
                          <Plus size={18} />
                          Add Slot
                        </button>
                      </div>

                      {Object.keys(availableTimeSlots).length > 0 && (
                        <div className="space-y-3">
                          <p className="text-sm text-sage-600 font-medium">Scheduled Classes:</p>
                          {Object.entries(availableTimeSlots)
                            .sort(([dateA], [dateB]) => {
                              // Sort by date key (DD-MM-YYYY)
                              const [dA, mA, yA] = dateA.split('-').map(Number);
                              const [dB, mB, yB] = dateB.split('-').map(Number);
                              return new Date(yA, mA - 1, dA).getTime() - new Date(yB, mB - 1, dB).getTime();
                            })
                            .map(([dateKey, times]) => {
                              return (
                                <div
                                  key={dateKey}
                                  className="bg-white p-4 rounded-lg border border-sage-200"
                                >
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-3">
                                      <Calendar size={18} className="text-sage-600" />
                                      <span className="font-medium text-sage-900 min-w-24">{dateKey}</span>
                                    </div>
                                    <button
                                      onClick={() => removeDate(dateKey)}
                                      className="p-1 hover:bg-red-50 text-red-500 rounded transition text-xs"
                                    >
                                      Remove Date
                                    </button>
                                  </div>

                                  <div className="flex flex-wrap gap-2 mt-2">
                                    {times.map((time, idx) => (
                                      <div key={idx} className="bg-sage-100 text-sage-800 text-sm px-3 py-1 rounded-full flex items-center gap-2">
                                        <Clock size={14} />
                                        <span>{time}</span>
                                        <button
                                          onClick={() => removeTimeSlot(dateKey, time)}
                                          className="hover:text-red-500 transition"
                                        >
                                          <X size={14} />
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )
                            })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Images Section */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-sage-900 mb-4">Service Images</h4>
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
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="h-5 w-5 text-sage-600 border-sage-300 rounded focus:ring-sage-600"
                  />
                  <label htmlFor="is_active" className="text-sage-700 font-medium cursor-pointer">
                    Service is active
                  </label>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={editingService ? handleUpdateService : handleAddService}
                    disabled={isLoading}
                    className="bg-sage-600 text-white px-6 py-2 rounded-lg hover:bg-sage-700 transition disabled:opacity-50"
                  >
                    {isLoading ? "Processing..." : editingService ? "Update Service" : "Add Service"}
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
          <table className="w-full">
            <thead className="bg-sage-50 border-b border-sage-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-sage-900">Service Details</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-sage-900">Schedule</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-sage-900">Price & Capacity</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-sage-900">Images</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-sage-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service, idx) => (
                <tr key={service.id} className={idx % 2 === 0 ? "bg-white" : "bg-sage-50"}>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-sage-900">{service.title}</div>
                    <div className="text-xs text-sage-500 mt-1">
                      <div className="mb-1">Type: {service.yoga_type}</div>
                      <div className="mb-1">Instructor: {service.instructor_name || getInstructorName(service.instructor_id || "")}</div>
                      <div>
                        Status:
                        <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-medium ${service.is_active
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                          }`}>
                          {service.is_active ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      {Object.keys(service.available_time_slots || {}).slice(0, 3).map((dateKey) => (
                        <div key={dateKey} className="text-xs text-sage-700">
                          <div className="font-medium text-sage-900">{dateKey}</div>
                          <div className="text-sage-500 pl-2">
                            {(service.available_time_slots[dateKey] || []).join(", ")}
                          </div>
                        </div>
                      ))}
                      {Object.keys(service.available_time_slots || {}).length > 3 && (
                        <div className="text-xs text-sage-500 mt-1">
                          +{Object.keys(service.available_time_slots || {}).length - 3} more dates
                        </div>
                      )}

                      <div className="flex items-center gap-1 mt-2 border-t border-sage-100 pt-1">
                        <Timer size={12} className="text-sage-500" />
                        <span className="text-xs text-sage-500">{service.session_time || formatDuration(service.duration)} per session</span>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-sage-900">${service.price || "0"}</div>
                    <div className="text-xs text-sage-500">{service.capacity || "0"} people</div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {service.image_urls && service.image_urls.slice(0, 2).map((url, index) => (
                        <div key={index} className="w-10 h-10 rounded overflow-hidden border border-sage-200">
                          <img
                            src={url || "/placeholder.svg"}
                            alt={`Service ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                      {service.image_urls && service.image_urls.length > 2 && (
                        <div className="w-10 h-10 bg-sage-100 rounded flex items-center justify-center border border-sage-200">
                          <span className="text-xs text-sage-600">+{service.image_urls.length - 2}</span>
                        </div>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm flex gap-2 items-center">
                    <button
                      onClick={() => handleEditService(service)}
                      className="p-2 hover:bg-sage-100 rounded-lg transition"
                      title="Edit service"
                    >
                      <Edit2 size={16} className="text-sage-600" />
                    </button>

                    {/* Professional Toggle Switch */}
                    <div className="relative inline-block w-11 h-6">
                      <input
                        type="checkbox"
                        checked={service.is_active}
                        onChange={() => handleToggleActive(service.id)}
                        className="sr-only peer"
                        id={`toggle-${service.id}`}
                      />
                      <label
                        htmlFor={`toggle-${service.id}`}
                        className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 rounded-full transition-all duration-300 ${service.is_active ? 'bg-sage-600' : 'bg-gray-300'}`}
                      >
                        <span
                          className={`absolute top-0.5 left-0.5 bg-white rounded-full w-5 h-5 transition-all duration-300 shadow-sm transform ${service.is_active ? 'translate-x-5' : ''}`}
                        />
                      </label>
                    </div>

                    <span className="text-xs text-sage-600 font-medium">
                      {service.is_active ? 'ON' : 'OFF'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}