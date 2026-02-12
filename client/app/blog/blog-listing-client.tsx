"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Clock, User, ChevronLeft, ChevronRight, Bookmark, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { BlogGridSkeleton } from "@/components/skeletons/blog-card-skeleton";
import axiosInstance from "@/services/axios-instance";
import { toast } from "sonner";
import Hero from "@/components/hero";

interface Blog {
  image_url: any;
  id: number;
  title: string;
  subtitle: string;
  description: string;
  excerpt: string;
  author: string;
  content: Array<{
    heading: string;
    paragraph: string;
  }>;
  conclusion: string;
  is_active: boolean;
  slug: string;
  image?: string;
  category?: string;
  created_at?: string;
  read_time?: string;
}

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setIsLoading(true);
        const { data } = await axiosInstance.get("/api/v1/blog/getPublishedBlogs");

        if (data.success && Array.isArray(data.blogs)) {
          console.log("Fetched blogs:", data.blogs);
          const mappedBlogs = data.blogs.map((blog: any) => ({
            id: blog._id,
            title: blog.title,
            excerpt: blog.shortDescription || blog.excerpt || "",
            image_url: blog.bannerImageURI,
            author: blog.author?.authorName || "Guest",
            category: blog.category,
            slug: blog.slug,
            created_at: blog.publishDate || blog.createdAt,
            is_active: blog.isActive,
            // Map other fields as necessary, providing defaults
            subtitle: blog.subtitle || "",
            description: blog.description || "",
            content: blog.content || [],
            conclusion: blog.conclusion || "",
            read_time: "5 Min Read" // Placeholder or calculate based on content length
          }));
          setBlogs(mappedBlogs);
        } else {
          console.error("Failed to fetch blogs or invalid format:", data);
          setBlogs([]);
        }
      } catch (error) {
        console.error("Error fetching blogs:", error);
        toast.info(`Error fetching blogs`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const filteredPosts = blogs.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.toLowerCase().includes(searchQuery.toLowerCase());

    if (selectedCategory === "all") return matchesSearch;
    return matchesSearch && post.category?.toLowerCase() === selectedCategory.toLowerCase();
  });

  const renderContent = () => {
    if (isLoading) {
      return (
        <section className="bg-slate-50 py-24">
          <div className="container mx-auto px-6">
            <BlogGridSkeleton />
          </div>
        </section>
      );
    }

    if (filteredPosts.length === 0) {
      return (
        <section className="bg-slate-50 py-24">
          <div className="container mx-auto px-6">
            <div className="text-center py-20 bg-white rounded-[40px] shadow-sm border border-gray-100">
              <div className="h-20 w-20 rounded-3xl bg-blue-50 text-blue-500 flex items-center justify-center mx-auto mb-6">
                <Search className="h-10 w-10" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No articles found</h3>
              <p className="text-gray-500 font-medium">Try adjusting your search terms or filters.</p>
            </div>
          </div>
        </section>
      );
    }

    return (
      <section className="bg-slate-50 py-24">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Latest from the <span className="text-blue-500">Journal</span></h2>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-100">
              {filteredPosts.length} Articles
            </p>
          </div>

          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map((post, index) => {
              const BACKEND = process.env.NEXT_PUBLIC_BACKEND || "http://localhost:4000";
              const blogImage = post.image_url
                ? (post.image_url.startsWith("http") ? post.image_url : `${BACKEND}/images/${post.image_url}`)
                : "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2070&auto=format&fit=crop";

              return (
                <Card key={post.id} className="group overflow-hidden border-none shadow-xl hover:shadow-2xl transition-all duration-500 rounded-[40px] bg-white flex flex-col">
                  <div className="relative h-72 cursor-pointer overflow-hidden">
                    <Image
                      src={blogImage}
                      alt={post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

                    {post.category && (
                      <div className="absolute left-6 top-6 rounded-2xl bg-white/90 backdrop-blur-md px-5 py-2 text-xs font-bold text-blue-600 shadow-xl border border-white/50">
                        {post.category.toUpperCase()}
                      </div>
                    )}

                    <button className="absolute right-6 top-6 h-10 w-10 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-blue-500 transition-all">
                      <Bookmark className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="p-10 flex flex-col grow">
                    <div className="mb-6 flex items-center gap-6 text-xs font-bold uppercase tracking-widest text-gray-400">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                        <span>{post.author}</span>
                      </div>
                      {post.created_at && (
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-blue-300" />
                          <span>
                            {new Date(post.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </span>
                        </div>
                      )}
                    </div>

                    <h3 className="mb-4 text-2xl font-bold leading-tight text-gray-900 group-hover:text-blue-500 transition-colors uppercase tracking-tight">
                      {post.title}
                    </h3>
                    <p className="mb-8 text-base text-gray-500 line-clamp-3 leading-relaxed font-medium">
                      {post.excerpt}
                    </p>

                    <div className="mt-auto flex items-center justify-between pt-8 border-t border-gray-100">
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-300">
                        {post.read_time || "5 Min Read"}
                      </span>
                      <Button
                        asChild
                        size="sm"
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-2xl h-11 px-6 shadow-lg shadow-blue-100 transition-all"
                      >
                        <Link href={`/blog/${post.slug}`}>Read Article</Link>
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Pagination */}
          {filteredPosts.length > 0 && (
            <div className="mt-20 flex items-center justify-center gap-4">
              <Button
                size="icon"
                variant="outline"
                className="h-14 w-14 rounded-2xl border-gray-100 text-gray-400 hover:bg-blue-500 hover:text-white transition-all shadow-xl bg-white"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <div className="h-14 bg-white rounded-2xl shadow-xl flex items-center px-4 gap-2 border border-gray-50">
                <Button size="icon" className="h-10 w-10 rounded-xl bg-blue-500 text-white font-bold">1</Button>
                <Button size="icon" variant="ghost" className="h-10 w-10 rounded-xl text-gray-500 font-bold hover:bg-gray-100">2</Button>
              </div>
              <Button
                size="icon"
                variant="outline"
                className="h-14 w-14 rounded-2xl border-gray-100 text-gray-400 hover:bg-blue-500 hover:text-white transition-all shadow-xl bg-white"
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </div>
          )}
        </div>
      </section>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <Hero
        title="Our Journal"
        description="Insights, stories, and curated guides for the modern traveler in Nepal."
        image="https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=2070&auto=format&fit=crop"
      />

      <section className="bg-white/80 backdrop-blur-md py-10 shadow-sm border-b border-gray-100">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-10 items-center justify-between">
            <div className="w-full lg:max-w-xl group">
              <div className="relative">
                <Search className="absolute left-6 top-1/2 h-6 w-6 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-500 transition-colors" />
                <Input
                  placeholder="Search articles, stories, or guides..."
                  className="pl-16 h-16 rounded-2xl border-none bg-gray-50 focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all font-medium text-lg placeholder:text-gray-300"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {["All", "Living", "Travel", "Lifestyle", "Local Guide"].map((cat) => (
                <Button
                  key={cat}
                  size="sm"
                  onClick={() => setSelectedCategory(cat.toLowerCase() === "all" ? "all" : cat.toLowerCase())}
                  className={`rounded-xl px-8 py-6 text-sm font-bold transition-all ${selectedCategory === (cat.toLowerCase() === "all" ? "all" : cat.toLowerCase())
                    ? "bg-blue-500 text-white shadow-xl shadow-blue-100 scale-105"
                    : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                    }`}
                  variant="ghost"
                >
                  {cat}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      {renderContent()}

      <Footer />
    </div>
  );
}
