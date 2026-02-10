"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Trash2, Edit2, Plus, X, GripVertical, FileText, CheckCircle, Clock, Layout, User, Tag, Calendar } from "lucide-react"
import { toast } from "sonner"
import axiosInstance from "@/services/axios-instance"
import Loading from "../loading"
import Cookies from "js-cookie"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

interface ContentSection {
  heading: string
  paragraph: string
}

interface Blog {
  _id: string
  title: string
  subtitle: string
  shortDescription: string
  excerpt: string
  author: string
  content: ContentSection[] | string
  conclusion: string
  isActive: boolean
  slug: string
  bannerImageURI: string
  category: string
  publishDate: string
  createdAt: string
}

interface SortableItemProps {
  id: string
  index: number
  section: ContentSection
  onUpdate: (index: number, field: "heading" | "paragraph", value: string) => void
  onRemove: (index: number) => void
}

function SortableItem({ id, index, section, onUpdate, onRemove }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} className="bg-slate-50 border border-slate-200 rounded-2xl p-6 mb-4 shadow-sm group">
      <div className="flex items-start gap-4">
        <button
          type="button"
          className="mt-3 cursor-grab active:cursor-grabbing text-slate-300 hover:text-blue-500 transition-colors"
          {...attributes}
          {...listeners}
        >
          <GripVertical size={20} />
        </button>
        <div className="flex-1 space-y-4">
          <input
            type="text"
            placeholder={`Section Heading ${index + 1}`}
            value={section.heading}
            onChange={(e) => onUpdate(index, "heading", e.target.value)}
            className="w-full px-4 py-3 border border-slate-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-50 font-bold text-slate-800"
          />
          <textarea
            placeholder={`Detailed paragraph for this section...`}
            value={section.paragraph}
            onChange={(e) => onUpdate(index, "paragraph", e.target.value)}
            className="w-full px-4 py-3 border border-slate-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-50 min-h-[120px] text-slate-600 font-medium leading-relaxed"
          />
        </div>
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="mt-2 p-2.5 hover:bg-red-50 rounded-xl transition-all text-slate-300 hover:text-red-500"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  )
}

export function Blogs() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [imagePreview, setImagePreview] = useState<string>("")

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
    excerpt: "",
    author: "",
    category: "Meditation",
    publishDate: new Date().toISOString().split('T')[0],
    content: [] as ContentSection[],
    conclusion: "",
    slug: "",
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const TOKEN = Cookies.get("auth_token")

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  // TODO: Add categories here
  const categories = ["Meditation", "Yoga", "Wellness", "Nature", "Retreat", "Community", "General"]

  useEffect(() => {
    fetchBlogs()
  }, [])

  const fetchBlogs = async () => {
    try {
      setIsLoading(true)
      const { data } = await axiosInstance.get("/api/v1/blog/getAllBlogs")
      if (data.success) {
        setBlogs(data.blogs)
      }
    } catch (err) {
      console.error(err)
      toast.error("Failed to load blogs")
    } finally {
      setIsLoading(false)
    }
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }

  const handleAddContentSection = () => {
    setFormData({
      ...formData,
      content: [...formData.content, { heading: "", paragraph: "" }],
    })
  }

  const handleUpdateContentSection = (index: number, field: "heading" | "paragraph", value: string) => {
    const updatedContent = [...formData.content]
    updatedContent[index][field] = value
    setFormData({ ...formData, content: updatedContent })
  }

  const handleRemoveContentSection = (index: number) => {
    const updatedContent = formData.content.filter((_, i) => i !== index)
    setFormData({ ...formData, content: updatedContent })
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = formData.content.findIndex((_, i) => `section-${i}` === active.id)
      const newIndex = formData.content.findIndex((_, i) => `section-${i}` === over.id)

      setFormData({
        ...formData,
        content: arrayMove(formData.content, oldIndex, newIndex),
      })
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

  const handleSaveBlog = async () => {
    if (!formData.title || !formData.description || !formData.author || !formData.category) {
      toast.info("Please fill in required fields (Title, Author, Category, Description)")
      return
    }

    try {
      setIsLoading(true)
      const formDataPayload = new FormData()
      formDataPayload.append("title", formData.title)
      formDataPayload.append("subtitle", formData.subtitle)
      formDataPayload.append("shortDescription", formData.description)
      formDataPayload.append("excerpt", formData.excerpt)
      formDataPayload.append("author", formData.author)
      formDataPayload.append("category", formData.category)
      formDataPayload.append("publishDate", formData.publishDate)
      formDataPayload.append("content", JSON.stringify(formData.content))
      formDataPayload.append("conclusion", formData.conclusion)
      formDataPayload.append("slug", formData.slug || generateSlug(formData.title))
      formDataPayload.append("isActive", "true")

      if (imageFile) formDataPayload.append("bannerImage", imageFile)

      let response
      if (editingBlog) {
        formDataPayload.append("_id", editingBlog._id)
        response = await axiosInstance.put("/api/v1/blog/updateBlog", formDataPayload, {
          headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "multipart/form-data" },
        })
      } else {
        response = await axiosInstance.post("/api/v1/blog/addBlog", formDataPayload, {
          headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "multipart/form-data" },
        })
      }

      if (response.data.success) {
        toast.success(response.data.message || "Blog saved successfully")
        resetForm()
        fetchBlogs()
      } else {
        toast.error(response.data.message || "Error while saving blog")
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || (err as Error).message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditBlog = (blog: Blog) => {
    setEditingBlog(blog)
    let contentData: ContentSection[] = []
    try {
      contentData = typeof blog.content === 'string' ? JSON.parse(blog.content) : (blog.content || [])
    } catch (e) {
      contentData = []
    }

    setFormData({
      title: blog.title,
      subtitle: blog.subtitle || "",
      description: blog.shortDescription || "",
      excerpt: blog.excerpt || "",
      author: blog.author || "",
      category: blog.category || "Meditation",
      publishDate: blog.publishDate ? blog.publishDate.split('T')[0] : new Date().toISOString().split('T')[0],
      content: contentData,
      conclusion: blog.conclusion || "",
      slug: blog.slug || "",
    })
    const BACKEND = process.env.NEXT_PUBLIC_BACKEND || "http://localhost:4000";
    setImagePreview(blog.bannerImageURI?.startsWith("http") ? blog.bannerImageURI : `${BACKEND}/images/${blog.bannerImageURI}`)
    setShowForm(true)
  }

  const handleToggleActive = async (id: string) => {
    try {
      setIsLoading(true)
      const blogToToggle = blogs.find((blog) => blog._id === id)
      const newStatus = blogToToggle ? !blogToToggle.isActive : true

      const { data } = await axiosInstance.put(
        `/api/v1/blog/updateBlogStatus`,
        { _id: id, status: newStatus },
        { headers: { Authorization: `Bearer ${TOKEN}` } }
      )

      if (data.success) {
        toast.success("Status updated")
        setBlogs(blogs.map((b) => (b._id === id ? { ...b, isActive: newStatus } : b)))
      }
    } catch (err) {
      toast.error((err as Error).message)
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      subtitle: "",
      description: "",
      excerpt: "",
      author: "",
      category: "Meditation",
      publishDate: new Date().toISOString().split('T')[0],
      content: [],
      conclusion: "",
      slug: "",
    })
    setImageFile(null)
    setImagePreview("")
    setShowForm(false)
    setEditingBlog(null)
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  }

  const BACKEND = process.env.NEXT_PUBLIC_BACKEND || "http://localhost:4000";

  return (
    <div className="space-y-8 pb-20">
      {isLoading && <Loading color="rgba(0, 0, 0, 0.3)" />}

      <div className="flex justify-between items-center bg-white p-8 rounded-[40px] shadow-sm border border-slate-50">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
            <FileText className="text-blue-500" />
            Editorial Hub
          </h2>
          <p className="text-slate-400 font-medium text-sm mt-1">Curate and publish stories that inspire your community.</p>
        </div>
        <button
          onClick={() => {
            setEditingBlog(null)
            setShowForm(true)
          }}
          className="bg-slate-900 hover:bg-black text-white font-bold h-12 px-6 rounded-2xl shadow-xl shadow-slate-100 transition-all flex items-center gap-2"
        >
          <Plus size={20} />
          Launch Story
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-8">
          <div className="bg-white rounded-[40px] w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col animate-in zoom-in duration-300">
            <div className="px-10 py-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
              <h3 className="text-xl font-bold text-slate-900 leading-none">
                {editingBlog ? "Refine Story" : "New Editorial"}
              </h3>
              <button onClick={resetForm} className="h-10 w-10 bg-white shadow-sm border border-slate-100 flex items-center justify-center rounded-xl hover:bg-slate-50 transition-colors">
                <X size={20} className="text-slate-400" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">Article Headline</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Nature's Whispers..."
                        value={formData.title}
                        onChange={(e) => {
                          setFormData({ ...formData, title: e.target.value, slug: generateSlug(e.target.value) })
                        }}
                        className="w-full h-14 px-5 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-50 font-bold text-slate-800 transition-all"
                      />
                      <Layout size={18} className="absolute right-5 top-4 text-slate-300" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">Author Name</label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Author Name"
                          value={formData.author}
                          onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                          className="w-full h-14 px-5 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-50 font-bold text-slate-800 transition-all pl-12"
                          required
                        />
                        <User size={18} className="absolute left-4 top-4 text-slate-300" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">Genre</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full h-14 px-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-50 font-bold text-slate-800 transition-all cursor-pointer appearance-none"
                      >
                        {categories.map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">Cover Art</label>
                  <div className="relative h-[126px] rounded-[32px] overflow-hidden bg-slate-50 border-2 border-dashed border-slate-100 flex flex-col items-center justify-center group cursor-pointer hover:bg-slate-100 transition-all">
                    {imagePreview ? (
                      <>
                        <img src={imagePreview} className="absolute inset-0 w-full h-full object-cover" alt="Preview" />
                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Plus className="text-white" />
                        </div>
                      </>
                    ) : (
                      <div className="text-center p-6">
                        <Plus className="h-6 w-6 text-slate-300 mx-auto mb-1" />
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest text-center">Visual Asset</p>
                      </div>
                    )}
                    <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">Publish Date</label>
                  <input
                    type="date"
                    value={formData.publishDate}
                    onChange={(e) => setFormData({ ...formData, publishDate: e.target.value })}
                    className="w-full h-14 px-5 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-50 font-bold text-slate-800 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">URL Identifier (Slug)</label>
                  <input
                    type="text"
                    value={formData.slug}
                    readOnly
                    className="w-full h-14 px-5 bg-slate-100/50 border-none rounded-2xl font-bold text-slate-400 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">Brief Overview</label>
                <textarea
                  placeholder="The essence of your story..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-50 min-h-[80px] font-medium text-slate-600 transition-all"
                />
              </div>

              <div className="space-y-6">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Narrative Flow</label>
                  <button
                    type="button"
                    onClick={handleAddContentSection}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-bold text-[10px] uppercase tracking-widest"
                  >
                    <Plus size={14} /> Add Block
                  </button>
                </div>

                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <SortableContext
                    items={formData.content.map((_, i) => `section-${i}`)}
                    strategy={verticalListSortingStrategy}
                  >
                    {formData.content.map((section, index) => (
                      <SortableItem
                        key={`section-${index}`}
                        id={`section-${index}`}
                        index={index}
                        section={section}
                        onUpdate={handleUpdateContentSection}
                        onRemove={handleRemoveContentSection}
                      />
                    ))}
                  </SortableContext>
                </DndContext>

                {formData.content.length === 0 && (
                  <div className="text-center py-12 bg-slate-50/50 rounded-[40px] border border-dashed border-slate-100">
                    <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">No narrative blocks added</p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">Epilogue</label>
                <textarea
                  placeholder="Final reflections..."
                  value={formData.conclusion}
                  onChange={(e) => setFormData({ ...formData, conclusion: e.target.value })}
                  className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-50 min-h-[100px] font-medium text-slate-600 transition-all"
                />
              </div>
            </div>

            <div className="px-10 py-8 border-t border-slate-50 flex gap-4 bg-slate-50/30">
              <button
                onClick={handleSaveBlog}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold h-14 rounded-2xl shadow-xl shadow-blue-100 transition-all active:scale-95"
              >
                {editingBlog ? "Synchronize" : "Go Live"}
              </button>
              <button
                onClick={resetForm}
                className="px-10 h-14 rounded-2xl font-bold bg-white border border-slate-100 text-slate-400 hover:bg-slate-50 transition-all"
              >
                Discard
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50/30 border-b border-slate-50">
                <th className="px-10 py-5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Storytelling</th>
                <th className="px-10 py-5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Temporal</th>
                <th className="px-10 py-5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Presence</th>
                <th className="px-10 py-5 text-right text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {blogs.map((blog) => (
                <tr key={blog._id} className="hover:bg-slate-50/20 transition-colors group">
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-2xl overflow-hidden relative border border-slate-50 shadow-sm flex-shrink-0 bg-slate-100">
                        <img
                          src={blog.bannerImageURI?.startsWith("http") ? blog.bannerImageURI : `${BACKEND}/images/${blog.bannerImageURI}`}
                          className="object-cover w-full h-full"
                          alt=""
                        />
                      </div>
                      <div>
                        <p className="text-base font-bold text-slate-900 leading-tight mb-1">{blog.title}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-bold text-blue-500 bg-blue-50 px-2 py-0.5 rounded-md uppercase tracking-wider">{blog.category}</span>
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{blog.author || "Guest"}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                      <Calendar size={14} className="text-slate-200" />
                      {formatDate(blog.publishDate)}
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    {blog.isActive ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100 uppercase tracking-widest">
                        Published
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold bg-slate-50 text-slate-400 border border-slate-100 uppercase tracking-widest">
                        Archived
                      </span>
                    )}
                  </td>
                  <td className="px-10 py-6 text-right">
                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                      <button
                        onClick={() => handleToggleActive(blog._id)}
                        className={`h-10 w-10 flex items-center justify-center rounded-xl border transition-all bg-white shadow-sm ${blog.isActive ? 'hover:bg-slate-900 hover:text-white border-slate-100 text-slate-300' : 'hover:bg-emerald-500 hover:text-white border-emerald-50 text-emerald-500'}`}
                        title={blog.isActive ? "Archived Story" : "Publish Story"}
                      >
                        {blog.isActive ? <Clock size={16} /> : <CheckCircle size={16} />}
                      </button>
                      <button
                        onClick={() => handleEditBlog(blog)}
                        className="h-10 w-10 flex items-center justify-center rounded-xl border border-slate-100 text-slate-300 hover:bg-slate-900 hover:text-white transition-all bg-white shadow-sm"
                        title="Edit Details"
                      >
                        <Edit2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {blogs.length === 0 && (
            <div className="py-24 text-center">
              <FileText size={48} className="text-slate-100 mx-auto mb-4" />
              <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">The archives are currently empty</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}