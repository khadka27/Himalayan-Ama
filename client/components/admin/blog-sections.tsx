"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Trash2, Edit2, Plus, X, GripVertical, FileText, CheckCircle, Clock } from "lucide-react"
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
  description: string
  excerpt: string
  author: {
    authorName: string
  } | string
  content: ContentSection[] | string
  conclusion: string
  isActive: boolean
  slug: string
  bannerImageURI: string
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

  useEffect(() => {
    fetchBlogs()
  }, [])

  const fetchBlogs = async () => {
    try {
      setIsLoading(true)
      const { data } = await axiosInstance.get("/api/v1/blog")
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
    if (!formData.title || !formData.description || !formData.author) {
      toast.info("Please fill in required fields (Title, Author, Description)")
      return
    }

    try {
      setIsLoading(true)
      const formDataPayload = new FormData()
      formDataPayload.append("title", formData.title)
      formDataPayload.append("subtitle", formData.subtitle)
      formDataPayload.append("shortDescription", formData.description) // Matches model
      formDataPayload.append("excerpt", formData.excerpt)
      formDataPayload.append("authorName", formData.author) // Handled in service
      formDataPayload.append("content", JSON.stringify(formData.content))
      formDataPayload.append("conclusion", formData.conclusion)
      formDataPayload.append("slug", formData.slug || generateSlug(formData.title))
      formDataPayload.append("isActive", "true")
      if (imageFile) formDataPayload.append("image", imageFile)

      let response
      if (editingBlog) {
        formDataPayload.append("_id", editingBlog._id)
        response = await axiosInstance.put("/api/v1/blog", formDataPayload, {
          headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "multipart/form-data" },
        })
      } else {
        response = await axiosInstance.post("/api/v1/blog", formDataPayload, {
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
    } catch (err) {
      toast.error((err as Error).message)
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
      description: blog.description || "",
      excerpt: blog.excerpt || "",
      author: typeof blog.author === 'object' ? blog.author.authorName : (blog.author || ""),
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

      const { data } = await axiosInstance.patch(
        `/api/v1/blog/status`,
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

  return (
    <div className="space-y-8">
      {isLoading && <Loading color="rgba(0, 0, 0, 0.3)" />}

      <div className="flex justify-between items-center bg-white p-8 rounded-[40px] shadow-sm border border-slate-50">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
            <FileText className="text-blue-500" />
            Articles & Updates
          </h2>
          <p className="text-slate-400 font-medium text-sm mt-1">Manage your blog content and reaching your audience.</p>
        </div>
        <button
          onClick={() => {
            setEditingBlog(null)
            setShowForm(true)
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 px-6 rounded-2xl shadow-xl shadow-blue-100 transition-all flex items-center gap-2"
        >
          <Plus size={20} />
          Create Article
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-8">
          <div className="bg-white rounded-[40px] w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
            <div className="px-10 py-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
                {editingBlog ? "Refine Article" : "Draft New Article"}
              </h3>
              <button onClick={resetForm} className="h-10 w-10 bg-white shadow-sm border border-slate-100 flex items-center justify-center rounded-xl hover:bg-slate-50 transition-colors">
                <X size={20} className="text-slate-400" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-10 space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">Title</label>
                    <input
                      type="text"
                      placeholder="Catchy headline..."
                      value={formData.title}
                      onChange={(e) => {
                        setFormData({ ...formData, title: e.target.value, slug: generateSlug(e.target.value) })
                      }}
                      className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-50 font-bold text-slate-800 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">Author Name</label>
                    <input
                      type="text"
                      placeholder="Writer's name"
                      value={formData.author}
                      onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                      className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-50 font-medium text-slate-700 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">Featured Image</label>
                  <div className="relative h-[142px] rounded-[32px] overflow-hidden bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center group cursor-pointer">
                    {imagePreview ? (
                      <>
                        <img src={imagePreview} className="absolute inset-0 w-full h-full object-cover" alt="Preview" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Plus className="text-white" />
                        </div>
                      </>
                    ) : (
                      <div className="text-center p-6">
                        <Plus className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Select Image</p>
                      </div>
                    )}
                    <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">Summary (Short Description)</label>
                <textarea
                  placeholder="Tell readers what this is about in 2 sentences..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-50 min-h-[100px] font-medium text-slate-600 transition-all"
                />
              </div>

              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold text-slate-900">Article Content Sections</label>
                  <button
                    type="button"
                    onClick={handleAddContentSection}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-bold text-xs uppercase tracking-widest"
                  >
                    <Plus size={16} />
                    Add Section
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
                  <div className="text-center py-10 bg-slate-50/50 rounded-[32px] border border-dashed border-slate-100">
                    <p className="text-sm font-medium text-slate-400">Click "Add Section" to start writing your content.</p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">Final Thoughts (Conclusion)</label>
                <textarea
                  placeholder="Wrap up your article..."
                  value={formData.conclusion}
                  onChange={(e) => setFormData({ ...formData, conclusion: e.target.value })}
                  className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-50 min-h-[100px] font-medium text-slate-600 transition-all"
                />
              </div>
            </div>

            <div className="px-10 py-8 border-t border-slate-50 flex gap-4 bg-slate-50/30">
              <button
                onClick={handleSaveBlog}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-14 px-10 rounded-2xl shadow-xl shadow-blue-100 transition-all active:scale-95"
              >
                {editingBlog ? "Push Updates" : "Publish Article"}
              </button>
              <button
                onClick={resetForm}
                className="h-14 px-8 rounded-2xl font-bold bg-white border border-slate-100 text-slate-500 hover:bg-slate-50 transition-all"
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
                <th className="px-10 py-5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Story & Author</th>
                <th className="px-10 py-5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Published Date</th>
                <th className="px-10 py-5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Visibility</th>
                <th className="px-10 py-5 text-right text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Tools</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {blogs.map((blog) => (
                <tr key={blog._id} className="hover:bg-slate-50/20 transition-colors group">
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-2xl overflow-hidden relative border border-slate-100 shadow-sm flex-shrink-0">
                        <img
                          src={blog.bannerImageURI?.startsWith("http") ? blog.bannerImageURI : `${process.env.NEXT_PUBLIC_BACKEND || "http://localhost:4000"}/images/${blog.bannerImageURI}`}
                          className="object-cover w-full h-full"
                          alt=""
                        />
                      </div>
                      <div>
                        <p className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-tight mb-1">{blog.title}</p>
                        <p className="text-xs font-bold text-blue-500/70 uppercase tracking-widest">By {typeof blog.author === 'object' ? blog.author.authorName : (blog.author || "Guest Writer")}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-500">
                      <Clock size={14} className="text-slate-300" />
                      {formatDate(blog.createdAt)}
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    {blog.isActive ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100 uppercase tracking-widest">
                        <CheckCircle size={10} className="mr-1.5" /> Published
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold bg-slate-50 text-slate-400 border border-slate-100 uppercase tracking-widest">
                        Draft
                      </span>
                    )}
                  </td>
                  <td className="px-10 py-6 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button
                        onClick={() => handleToggleActive(blog._id)}
                        className={`h-10 w-10 flex items-center justify-center rounded-xl border transition-all ${blog.isActive ? 'hover:bg-amber-50 border-amber-50 text-amber-500' : 'hover:bg-emerald-50 border-emerald-50 text-emerald-500'}`}
                      >
                        {blog.isActive ? <Clock size={16} /> : <CheckCircle size={16} />}
                      </button>
                      <button
                        onClick={() => handleEditBlog(blog)}
                        className="h-10 w-10 flex items-center justify-center rounded-xl border border-blue-50 text-blue-500 hover:bg-blue-600 hover:text-white transition-all"
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
            <div className="py-20 text-center">
              <FileText size={48} className="text-slate-100 mx-auto mb-4" />
              <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">No stories published yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}