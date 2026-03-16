"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { 
  Newspaper, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  Eye,
  User,
  Tags,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Upload,
  X,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import dynamic from "next/dynamic";
import Link from "next/link";

// Dynamically import Editor to avoid SSR issues
const Editor = dynamic(() => import("@/components/admin/Editor"), { 
    ssr: false,
    loading: () => <div className="h-[300px] w-full animate-pulse bg-neutral-100 rounded-2xl" />
});

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.4, ease: "easeOut" as const },
  }),
};

export default function BlogAdminPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Form State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    coverImage: "",
    author: "Pastor Suresh Randhari",
    tags: "",
    published: true
  });

  const fetchBlogs = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/blogs?page=${page}&limit=10&search=${search}`);
      const data = await res.json();
      if (data.success) {
        setBlogs(data.data);
        setTotalPages(data.pagination.pages);
      }
    } catch (error) {
      toast.error("Failed to fetch blog posts");
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchBlogs();
    }, 500);
    return () => clearTimeout(timer);
  }, [fetchBlogs]);

  const handleOpenAdd = () => {
    setEditingBlog(null);
    setFormData({
      title: "",
      slug: "",
      content: "",
      coverImage: "",
      author: "Pastor Suresh Randhari",
      tags: "",
      published: true
    });
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (blog: any) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title,
      slug: blog.slug,
      content: blog.content,
      coverImage: blog.coverImage || "",
      author: blog.author || "Pastor Suresh Randhari",
      tags: blog.tags?.join(", ") || "",
      published: blog.published
    });
    setIsDialogOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const uploadData = new FormData();
    uploadData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: uploadData,
      });
      const data = await res.json();
      if (data.success) {
        setFormData({ ...formData, coverImage: data.url });
        toast.success("Cover image uploaded");
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.content || formData.content === "<p></p>") {
      toast.error("Please add some content to your post");
      return;
    }

    setIsSubmitting(true);
    try {
      const url = editingBlog ? `/api/blogs/${editingBlog._id}` : "/api/blogs";
      const method = editingBlog ? "PUT" : "POST";
      
      const payload = {
        ...formData,
        tags: formData.tags.split(",").map(t => t.trim()).filter(t => t !== "")
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      
      const data = await res.json();
      if (data.success) {
        toast.success(editingBlog ? "Post updated" : "Post published");
        setIsDialogOpen(false);
        fetchBlogs();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Save failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Permanently delete this post?")) return;
    try {
      const res = await fetch(`/api/blogs/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Post removed");
        fetchBlogs();
      }
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-neutral-900">Church Blog</h1>
          <p className="mt-1 text-neutral-500">Share news, devotionals, and updates with your community.</p>
        </div>
        <Button onClick={handleOpenAdd} className="rounded-xl gap-2 shadow-lg shadow-neutral-200">
          <Plus className="h-4 w-4" />
          Create Post
        </Button>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <Input 
            placeholder="Search articles..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-11 border-neutral-200 bg-white pl-10 focus-visible:ring-neutral-900"
          />
        </div>
        <Button variant="outline" className="h-11 gap-2 rounded-xl border-neutral-200 bg-white">
          <Filter className="h-4 w-4 text-neutral-400" />
          Filter
        </Button>
      </div>

      <div className="overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-neutral-100 bg-neutral-50/50 text-neutral-400 uppercase tracking-wider font-medium">
              <tr>
                <th className="px-6 py-4">Title & Author</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Tags</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <Loader2 className="mx-auto h-6 w-6 animate-spin text-neutral-400" />
                  </td>
                </tr>
              ) : blogs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-neutral-400">
                    No articles found.
                  </td>
                </tr>
              ) : (
                blogs.map((blog: any, i) => (
                  <motion.tr
                    key={blog._id}
                    initial="hidden"
                    animate="visible"
                    custom={i}
                    variants={fadeInUp}
                    className="group hover:bg-neutral-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 flex-shrink-0 rounded-lg bg-neutral-100 overflow-hidden border border-neutral-200 flex items-center justify-center">
                          {blog.coverImage ? (
                            <img src={blog.coverImage} alt="" className="h-full w-full object-cover" />
                          ) : (
                            <FileText className="h-5 w-5 text-neutral-300" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-neutral-900">{blog.title}</p>
                          <div className="flex items-center gap-2 mt-0.5 text-xs text-neutral-400">
                             <User className="h-3 w-3" />
                             {blog.author}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                       <Badge variant={blog.published ? 'default' : 'secondary'} className="rounded-full px-2.5 py-0.5 h-6 text-[10px] uppercase tracking-tighter">
                          {blog.published ? 'Published' : 'Draft'}
                       </Badge>
                    </td>
                    <td className="px-6 py-4">
                       <div className="flex flex-wrap gap-1">
                          {blog.tags?.slice(0, 2).map((tag: string) => (
                             <Badge key={tag} variant="outline" className="text-[10px] py-0 border-neutral-200">#{tag}</Badge>
                          ))}
                          {blog.tags?.length > 2 && <span className="text-[10px] text-neutral-400">+{blog.tags.length - 2}</span>}
                       </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" />
                          }
                        >
                          <MoreVertical className="h-4 w-4 text-neutral-400" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40 rounded-xl shadow-xl border-neutral-200">
                          <DropdownMenuItem onClick={() => handleOpenEdit(blog)} className="cursor-pointer gap-2">
                             <Edit2 className="h-4 w-4" /> Edit Post
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(blog._id)} className="cursor-pointer gap-2 text-red-600 focus:text-red-600">
                             <Trash2 className="h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-screen-lg rounded-3xl p-0 overflow-hidden border-none shadow-2xl h-[90vh] flex flex-col">
          <DialogHeader className="p-8 pb-4">
            <DialogTitle className="font-serif text-2xl">{editingBlog ? "Edit Article" : "Write New Article"}</DialogTitle>
            <DialogDescription>Compose your blog post with rich text and images.</DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto px-8 pb-8">
            <div className="flex flex-col gap-6">
               <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="title">Article Title</Label>
                    <Input 
                      id="title" 
                      value={formData.title} 
                      onChange={e => setFormData({...formData, title: e.target.value})} 
                      placeholder="Catchy headline..."
                      className="rounded-xl border-neutral-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="author">Author</Label>
                    <Input 
                      id="author" 
                      value={formData.author} 
                      onChange={e => setFormData({...formData, author: e.target.value})} 
                      className="rounded-xl border-neutral-200"
                    />
                  </div>
               </div>

               <div className="space-y-2">
                  <Label>Cover Image</Label>
                  {formData.coverImage ? (
                    <div className="relative aspect-[21/9] w-full rounded-2xl overflow-hidden border border-neutral-200 bg-neutral-50 group">
                      <img src={formData.coverImage} alt="Cover" className="h-full w-full object-cover" />
                      <Button 
                        type="button" 
                        variant="destructive" 
                        size="icon" 
                        className="absolute top-4 right-4 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => setFormData({...formData, coverImage: ""})}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <Label
                      htmlFor="cover-upload"
                      className="flex flex-col items-center justify-center w-full aspect-[21/9] rounded-2xl border-2 border-dashed border-neutral-200 bg-neutral-50/50 cursor-pointer hover:bg-neutral-100 transition-all"
                    >
                      {isUploading ? <Loader2 className="h-6 w-6 animate-spin" /> : <><Upload className="h-6 w-6 text-neutral-400 mb-2" /> <span className="text-sm font-medium">Upload feature image</span></>}
                      <input type="file" id="cover-upload" className="hidden" onChange={handleImageUpload} accept="image/*" />
                    </Label>
                  )}
               </div>

               <div className="space-y-2">
                  <Label>Content</Label>
                  <Editor 
                    content={formData.content} 
                    onChange={c => setFormData({...formData, content: c})}
                    placeholder="Start writing your story..." 
                  />
               </div>

               <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags (comma separated)</Label>
                    <Input 
                      id="tags" 
                      value={formData.tags} 
                      onChange={e => setFormData({...formData, tags: e.target.value})} 
                      placeholder="News, Devotional, Community"
                      className="rounded-xl border-neutral-200"
                    />
                  </div>
                  <div className="flex items-center gap-4 pt-8">
                     <Switch 
                        checked={formData.published} 
                        onCheckedChange={v => setFormData({...formData, published: v})} 
                     />
                     <Label>Publish Post (Publicly Visible)</Label>
                  </div>
               </div>
            </div>
          </div>
          <DialogFooter className="p-8 pt-4 border-t border-neutral-100 bg-neutral-50/30">
            <Button variant="ghost" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting} className="rounded-xl">
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting} className="rounded-xl bg-neutral-900 px-12 shadow-xl shadow-neutral-200">
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {editingBlog ? "Save Changes" : "Post Article"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
