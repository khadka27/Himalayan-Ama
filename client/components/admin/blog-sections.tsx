"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Trash2, Edit2, Plus, X, GripVertical } from "lucide-react"
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
  id: string
  title: string
  subtitle: string
  description: string
  excerpt: string
  author: string
  content: ContentSection[]
  conclusion: string
  is_active: boolean
  slug: string
  image_url: string
  created_at: string
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
    <div ref={setNodeRef} style={style} className="bg-sage-50 border border-sage-200 rounded-lg p-4 mb-3">
      <div className="flex items-start gap-3">
        <button
          type="button"
          className="mt-2 cursor-grab active:cursor-grabbing text-sage-400 hover:text-sage-600"
          {...attributes}
          {...listeners}
        >
          <GripVertical size={20} />
        </button>
        <div className="flex-1 space-y-3">
          <input
            type="text"
            placeholder={`Heading ${index + 1}`}
            value={section.heading}
            onChange={(e) => onUpdate(index, "heading", e.target.value)}
            className="w-full px-4 py-2 border border-sage-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-600"
          />
          <textarea
            placeholder={`Paragraph ${index + 1}`}
            value={section.paragraph}
            onChange={(e) => onUpdate(index, "paragraph", e.target.value)}
            className="w-full px-4 py-2 border border-sage-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-600 min-h-24"
          />
        </div>
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="mt-2 p-2 hover:bg-red-100 rounded-lg transition text-red-500"
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
    setIsLoading(true)
    const getBlogs = async () => {
      const { data } = await axiosInstance.get("/api/blogs")
      setIsLoading(false)

      if (data.status) {
        setBlogs(data.data)
      }
    }

    getBlogs()
  }, [])

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

  const handleAddBlog = async () => {
    if (
      !formData.title ||
      !formData.subtitle ||
      !formData.excerpt ||
      !formData.author ||
      !formData.description ||
      !formData.conclusion
    ) {
      toast.info("Please fill in all required fields")
      return
    }

    if (formData.content.length === 0) {
      toast.info("Please add at least one content section")
      return
    }

    if (!imageFile) {
      toast.info("Please select an image")
      return
    }

    try {
      setIsLoading(true)

      const formDataPayload = new FormData()
      formDataPayload.append("title", formData.title)
      formDataPayload.append("subtitle", formData.subtitle)
      formDataPayload.append("description", formData.description)
      formDataPayload.append("excerpt", formData.excerpt)
      formDataPayload.append("author", formData.author)
      formDataPayload.append("content", JSON.stringify(formData.content))
      formDataPayload.append("conclusion", formData.conclusion)
      formDataPayload.append("slug", formData.slug || generateSlug(formData.title))
      formDataPayload.append("is_active", "true")
      formDataPayload.append("image", imageFile)

      const { data } = await axiosInstance.post("/api/blogs", formDataPayload, {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          "Content-Type": "multipart/form-data",
        },
      })

      if (data.status) {
        toast.success(data.message || "Blog added successfully")

        const newBlog: Blog = {
          id: Date.now().toString(),
          title: formData.title,
          subtitle: formData.subtitle,
          excerpt: formData.excerpt,
          description: formData.description,
          author: formData.author,
          content: formData.content,
          conclusion: formData.conclusion,
          slug: formData.slug || generateSlug(formData.title),
          image_url: imagePreview,
          created_at: new Date().toISOString().split("T")[0],
          is_active: true,
        }

        setBlogs([...blogs, newBlog])
      } else {
        toast.info(data.message || "Error while creating blog")
      }
    } catch (err) {
      toast.error((err as Error).message)
    } finally {
      setIsLoading(false)
      resetForm()
    }
  }

  const handleEditBlog = (blog: Blog) => {
    setEditingBlog(blog)
    setFormData({
      title: blog.title,
      subtitle: blog.subtitle || "",
      description: blog.description,
      excerpt: blog.excerpt,
      author: blog.author || "",
      content: blog.content || [],
      conclusion: blog.conclusion || "",
      slug: blog.slug || "",
    })
    setImagePreview(blog.image_url)
    setShowForm(true)
  }

  const handleUpdateBlog = async () => {
    if (
      !editingBlog ||
      !formData.title ||
      !formData.subtitle ||
      !formData.excerpt ||
      !formData.author ||
      !formData.description ||
      !formData.conclusion
    ) {
      toast.info("Please fill in all required fields")
      return
    }

    if (formData.content.length === 0) {
      toast.info("Please add at least one content section")
      return
    }

    try {
      setIsLoading(true)

      const formDataPayload = new FormData()
      formDataPayload.append("title", formData.title)
      formDataPayload.append("subtitle", formData.subtitle)
      formDataPayload.append("description", formData.description)
      formDataPayload.append("excerpt", formData.excerpt)
      formDataPayload.append("author", formData.author)
      formDataPayload.append("content", JSON.stringify(formData.content))
      formDataPayload.append("conclusion", formData.conclusion)
      formDataPayload.append("slug", formData.slug || generateSlug(formData.title))

      if (imageFile) {
        formDataPayload.append("image", imageFile)
      }

      const { data } = await axiosInstance.post(`/api/blogs/${editingBlog.id}`, formDataPayload, {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          "Content-Type": "multipart/form-data",
        },
      })

      if (data.status) {
        toast.success(data.message || "Blog updated successfully")

        setBlogs(
          blogs.map((blog) =>
            blog.id === editingBlog.id
              ? {
                  ...blog,
                  title: formData.title,
                  subtitle: formData.subtitle,
                  excerpt: formData.excerpt,
                  description: formData.description,
                  author: formData.author,
                  content: formData.content,
                  conclusion: formData.conclusion,
                  slug: formData.slug || generateSlug(formData.title),
                  image: imagePreview || blog.image_url,
                }
              : blog,
          ),
        )
      } else {
        toast.info(data.message || "Error while updating blog")
      }
    } catch (err) {
      toast.error((err as Error).message)
    } finally {
      setIsLoading(false)
      resetForm()
    }
  }

  const handleToggleActive = async (id: string) => {
    try {
      setIsLoading(true)
      const blogToToggle = blogs.find((blog) => blog.id === id)
      const newStatus = blogToToggle ? !blogToToggle.is_active : null

      const { data } = await axiosInstance.post(
        `/api/blogs/${id}`,
        {
          is_active: newStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        },
      )

      if (data.status) {
        toast.success(data.message || "Status updated")
        setBlogs(blogs.map((blog) => (blog.id === id ? { ...blog, is_active: !blog.is_active } : blog)))
      } else {
        toast.info(data.message || "Status update failed")
      }
    } catch (err) {
      const Err = err as Error
      toast.error(Err.message)
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

    const date = new Date(dateString)
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  return (
    <>
      {isLoading && <Loading color="rgba(0, 0, 0, 0.3)" />}

      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-serif font-bold text-sage-900">Blog Management</h2>
          <button
            onClick={() => {
              setEditingBlog(null)
              setShowForm(!showForm)
            }}
            className="flex items-center gap-2 bg-sage-600 text-white px-4 py-2 rounded-lg hover:bg-sage-700 transition"
          >
            <Plus size={20} />
            New Blog
          </button>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-sage-200 px-6 py-4 flex justify-between items-center z-10">
                <h3 className="text-xl font-semibold text-sage-900">{editingBlog ? "Edit Blog" : "Create New Blog"}</h3>
                <button onClick={resetForm} className="p-1 hover:bg-sage-100 rounded-lg transition">
                  <X size={24} className="text-sage-600" />
                </button>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <input
                    type="text"
                    placeholder="Blog Title *"
                    value={formData.title}
                    onChange={(e) => {
                      setFormData({ ...formData, title: e.target.value, slug: generateSlug(e.target.value) })
                    }}
                    className="px-4 py-2 border border-sage-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-600"
                  />
                  <input
                    type="text"
                    placeholder="Subtitle *"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    className="px-4 py-2 border border-sage-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-600"
                  />
                  <input
                    type="text"
                    placeholder="Author Name *"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="px-4 py-2 border border-sage-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-600"
                  />
                  <input
                    type="text"
                    placeholder="Slug (auto-generated)"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="px-4 py-2 border border-sage-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-600 bg-sage-50"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 mb-4">
                  <textarea
                    placeholder="Short Description *"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="px-4 py-2 border border-sage-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-600 min-h-20"
                  />
                  <textarea
                    placeholder="Brief Excerpt (for preview) *"
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    className="px-4 py-2 border border-sage-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-600 min-h-20"
                  />
                </div>

                <div className="mb-4">
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-sm font-semibold text-sage-900">Content Sections *</label>
                    <button
                      type="button"
                      onClick={handleAddContentSection}
                      className="flex items-center gap-2 bg-sage-600 text-white px-3 py-1.5 rounded-lg hover:bg-sage-700 transition text-sm"
                    >
                      <Plus size={16} />
                      Add Section
                    </button>
                  </div>

                  {formData.content.length === 0 ? (
                    <div className="border-2 border-dashed border-sage-300 rounded-lg p-8 text-center text-sage-500">
                      No content sections yet. Click "Add Section" to create your first section.
                    </div>
                  ) : (
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
                  )}
                </div>

                <div className="mb-4">
                  <textarea
                    placeholder="Conclusion *"
                    value={formData.conclusion}
                    onChange={(e) => setFormData({ ...formData, conclusion: e.target.value })}
                    className="w-full px-4 py-2 border border-sage-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-600 min-h-24"
                  />
                </div>

                <div className="border-2 border-dashed border-sage-300 rounded-lg p-4 mb-4">
                  <label className="block text-sm font-semibold text-sage-900 mb-2">Featured Image *</label>
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

                <div className="flex gap-3">
                  <button
                    onClick={editingBlog ? handleUpdateBlog : handleAddBlog}
                    className="bg-sage-600 text-white px-6 py-2 rounded-lg hover:bg-sage-700 transition"
                  >
                    {editingBlog ? "Update Blog" : "Create Blog"}
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
                <th className="px-6 py-3 text-left text-sm font-semibold text-sage-900">Title</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-sage-900">Author</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-sage-900">Date</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-sage-900">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-sage-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((blog, idx) => (
                <tr key={blog.id} className={idx % 2 === 0 ? "bg-white" : "bg-sage-50"}>
                  <td className="px-6 py-4 text-sm font-medium text-sage-900">{blog.title}</td>
                  <td className="px-6 py-4 text-sm text-sage-600">{blog.author || "N/A"}</td>
                  <td className="px-6 py-4 text-sm text-sage-600">{formatDate(blog.created_at)}</td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        blog.is_active ? "bg-green-200 text-green-700" : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {blog.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm flex gap-2 items-center">
                    {/* Professional Toggle Switch */}
                    <div className="relative inline-block w-11 h-6">
                      <input
                        type="checkbox"
                        checked={blog.is_active}
                        onChange={() => handleToggleActive(blog.id)}
                        className="sr-only peer"
                        id={`toggle-blog-${blog.id}`}
                      />
                      <label
                        htmlFor={`toggle-blog-${blog.id}`}
                        className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 rounded-full transition-all duration-300 ${blog.is_active ? 'bg-sage-600' : 'bg-gray-300'}`}
                      >
                        <span
                          className={`absolute top-0.5 left-0.5 bg-white rounded-full w-5 h-5 transition-all duration-300 shadow-sm transform ${blog.is_active ? 'translate-x-5' : ''}`}
                        />
                      </label>
                    </div>
                    
                    <button
                      onClick={() => handleEditBlog(blog)}
                      className="p-2 hover:bg-sage-100 rounded-lg transition ml-2"
                      title="Edit blog"
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