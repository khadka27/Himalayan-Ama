"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Edit2, Plus, X } from "lucide-react"
import { toast } from "sonner"
import axiosInstance from "@/services/axios-instance"
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
  image_url: string
  created_at: string
}

export function Instructors() {
  const [instructors, setInstructors] = useState<Instructor[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingInstructor, setEditingInstructor] = useState<Instructor | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [formData, setFormData] = useState({
    name: "",
    profession: "",
    experience: "",
    bio: "",
    specialities: "",
    certifications: "",
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const TOKEN = Cookies.get("auth_token")


  useEffect(() => {
    fetchInstructors()
  }, [])

  const fetchInstructors = async () => {
    try {
      setIsLoading(true)
      const { data } = await axiosInstance.get("/api/instructors")
      if (data.status) {
        setInstructors(data.data)
      }
    } catch (err) {
      toast.error((err as Error).message)
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

  const handleAddInstructor = async () => {
    if (!formData.name || !formData.profession || !formData.experience || !formData.bio) {
      toast.info("Fill in all required details")
      return
    }

    if (!imageFile && !editingInstructor) {
      toast.info("Select an image")
      return
    }

    try {
      setIsLoading(true)

      const formDataPayload = new FormData()
      formDataPayload.append("name", formData.name)
      formDataPayload.append("profession", formData.profession)
      formDataPayload.append("experience", formData.experience)
      formDataPayload.append("bio", formData.bio)
      formDataPayload.append("specialities", formData.specialities)
      formDataPayload.append("certifications", formData.certifications)
      if (imageFile) {
        formDataPayload.append("image", imageFile)
      }

      const { data } = await axiosInstance.post("/api/instructors", formDataPayload, {
        headers: {
          'Authorization': `Bearer ${TOKEN}`,
          "Content-Type": "multipart/form-data",
        },
      })

      if (data.status) {
        toast.success(data.message || "Instructor added")

        const newInstructor: Instructor = {
          id: Date.now().toString(),
          name: formData.name,
          profession: formData.profession,
          experience: formData.experience,
          bio: formData.bio,
          specialities: formData.specialities,
          certifications: formData.certifications,
          image_url: imagePreview,
          created_at: new Date().toISOString().split("T")[0],
        }

        setInstructors([...instructors, newInstructor])
        resetForm()
      } else {
        toast.info(data.message || "Error while creating instructor")
      }
    } catch (err) {
      toast.error((err as Error).message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditInstructor = (instructor: Instructor) => {
    setEditingInstructor(instructor)
    setFormData({
      name: instructor.name,
      profession: instructor.profession,
      experience: instructor.experience,
      bio: instructor.bio,
      specialities: instructor.specialities,
      certifications: instructor.certifications,
    })
    setImagePreview(instructor.image_url)
    setShowForm(true)
  }

  const handleUpdateInstructor = async () => {
    if (!editingInstructor || !formData.name || !formData.profession || !formData.experience || !formData.bio) {
      toast.info("Error while updating")
      return
    }

    try {
      setIsLoading(true)
      const formDataPayload = new FormData()
      formDataPayload.append("name", formData.name)
      formDataPayload.append("profession", formData.profession)
      formDataPayload.append("experience", formData.experience)
      formDataPayload.append("bio", formData.bio)
      formDataPayload.append("specialities", formData.specialities)
      formDataPayload.append("certifications", formData.certifications)
      if (imageFile) {
        formDataPayload.append("image", imageFile)
      }

      const { data } = await axiosInstance.post(`/api/instructors/${editingInstructor.id}`, formDataPayload, {
        headers: {
          'Authorization': `Bearer ${TOKEN}`,
          "Content-Type": "multipart/form-data",
        },
      })

      if (data.status) {
        toast.success(data.message || "Instructor updated")

        setInstructors(
          instructors.map((instructor) =>
            instructor.id === editingInstructor.id
              ? {
                ...instructor,
                name: formData.name,
                profession: formData.profession,
                experience: formData.experience,
                bio: formData.bio,
                specialities: formData.specialities,
                certifications: formData.certifications,
                image: imagePreview || instructor.image_url,
              }
              : instructor,
          ),
        )
        resetForm()
      } else {
        toast.info(data.message || "Error while updating instructor")
      }
    } catch (err) {
      toast.error((err as Error).message)
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      profession: "",
      experience: "",
      bio: "",
      specialities: "",
      certifications: "",
    })
    setImageFile(null)
    setImagePreview("")
    setShowForm(false)
    setEditingInstructor(null)
  }

  return (
    <>
      {isLoading && <Loading color="rgba(0, 0, 0, 0.3)" />}

      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-serif font-bold text-sage-900">Instructor Management</h2>
          <button
            onClick={() => {
              setEditingInstructor(null)
              setShowForm(!showForm)
            }}
            className="flex items-center gap-2 bg-sage-600 text-white px-4 py-2 rounded-lg hover:bg-sage-700 transition"
          >
            <Plus size={20} />
            New Instructor
          </button>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-sage-200 px-6 py-4 flex justify-between items-center">
                <h3 className="text-xl font-semibold text-sage-900">
                  {editingInstructor ? "Edit Instructor" : "Create New Instructor"}
                </h3>
                <button onClick={resetForm} className="p-1 hover:bg-sage-100 rounded-lg transition">
                  <X size={24} className="text-sage-600" />
                </button>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 gap-4 mb-4">
                  <input
                    type="text"
                    placeholder="Instructor Name *"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="px-4 py-2 border border-sage-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-600"
                  />
                  <input
                    type="text"
                    placeholder="Position (e.g., Senior Yoga Instructor) *"
                    value={formData.profession}
                    onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                    className="px-4 py-2 border border-sage-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-600"
                  />
                  <input
                    type="number"
                    placeholder="Experience (e.g., 10+ years)"
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    className="px-4 py-2 border border-sage-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-600"
                  />
                  <textarea
                    placeholder="bio *"
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="px-4 py-2 border border-sage-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-600 min-h-24"
                  />
                  <textarea
                    placeholder="Specialities"
                    value={formData.specialities}
                    onChange={(e) => setFormData({ ...formData, specialities: e.target.value })}
                    className="px-4 py-2 border border-sage-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-600 min-h-20"
                  />
                  <textarea
                    placeholder="Certifications (comma seprated)"
                    value={formData.certifications}
                    onChange={(e) => setFormData({ ...formData, certifications: e.target.value })}
                    className="px-4 py-2 border border-sage-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-600 min-h-20"
                  />
                  <div className="border-2 border-dashed border-sage-300 rounded-lg p-4">
                    <input type="file" accept="image/*" onChange={handleImageChange} className="w-full" />
                    {imagePreview && (
                      <div className="mt-4">
                        <p className="text-sm text-sage-600 mb-2">Image Preview:</p>
                        <img
                          src={imagePreview || "/placeholder.svg"}
                          alt="Preview"
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={editingInstructor ? handleUpdateInstructor : handleAddInstructor}
                    disabled={isLoading}
                    className="bg-sage-600 text-white px-6 py-2 rounded-lg hover:bg-sage-700 transition disabled:opacity-50"
                  >
                    {isLoading ? "Processing..." : editingInstructor ? "Update Instructor" : "Create Instructor"}
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
        )}

        <div className="bg-white rounded-lg border border-sage-200 overflow-hidden shadow-sm">
          <table className="w-full">
            <thead className="bg-sage-50 border-b border-sage-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-sage-900">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-sage-900">Position</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-sage-900">Experience</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-sage-900">Specialities</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-sage-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {instructors.map((instructor, idx) => (
                <tr key={instructor.id} className={idx % 2 === 0 ? "bg-white" : "bg-sage-50"}>
                  <td className="px-6 py-4 text-sm font-medium text-sage-900">{instructor.name}</td>
                  <td className="px-6 py-4 text-sm text-sage-600">{instructor.profession}</td>
                  <td className="px-6 py-4 text-sm text-sage-600">{instructor.experience}</td>
                  <td className="px-6 py-4 text-sm text-sage-600">{instructor.specialities}</td>
                  <td className="px-6 py-4 text-sm flex gap-2">
                    <button
                      onClick={() => handleEditInstructor(instructor)}
                      className="p-2 hover:bg-sage-100 rounded-lg transition"
                      title="Edit instructor"
                    >
                      <Edit2 size={16} className="text-sage-600" />
                    </button>
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
