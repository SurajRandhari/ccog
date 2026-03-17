"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { 
  BookOpen, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  Calendar,
  User,
  ChevronLeft,
  ChevronRight,
  Loader2,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
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
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import dynamic from "next/dynamic";

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

export default function DevotionsAdminPage() {
  const [devotions, setDevotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  // Form State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDevotion, setEditingDevotion] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    scripture: "",
    content: "",
    date: new Date().toISOString().split('T')[0],
    author: "Rev. Suresh Randhari",
    status: "published"
  });

  const fetchDevotions = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/devotions`);
      const data = await res.json();
      if (data.success) {
        setDevotions(data.data);
      }
    } catch (error) {
      toast.error("Failed to fetch devotions");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDevotions();
  }, [fetchDevotions]);

  const filteredDevotions = devotions.filter((d: any) => 
    d.title.toLowerCase().includes(search.toLowerCase()) || 
    d.scripture.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingDevotion(null);
    setFormData({
      title: "",
      scripture: "",
      content: "",
      date: new Date().toISOString().split('T')[0],
      author: "Rev. Suresh Randhari",
      status: "published"
    });
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (devotion: any) => {
    setEditingDevotion(devotion);
    setFormData({
      title: devotion.title,
      scripture: devotion.scripture,
      content: devotion.content,
      date: new Date(devotion.date).toISOString().split('T')[0],
      author: devotion.author,
      status: devotion.status
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.content || formData.content === "<p></p>") {
      toast.error("Please add content to the devotion");
      return;
    }
    setIsSubmitting(true);
    try {
      const url = editingDevotion ? `/api/admin/devotions/${editingDevotion._id}` : "/api/admin/devotions";
      const method = editingDevotion ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            ...formData,
            // Temporary hardcoded admin ID for createdBy
            // In a real flow, this would be handled by the server session
            createdBy: "65e0a1a2b3c4d5e6f7a8b9c0" 
        }),
      });
      
      const data = await res.json();
      if (data.success) {
        toast.success(editingDevotion ? "Devotion updated" : "Devotion created");
        setIsDialogOpen(false);
        fetchDevotions();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure? This devotion will be permanently deleted.")) return;
    try {
      const res = await fetch(`/api/admin/devotions/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        toast.success("Devotion deleted");
        fetchDevotions();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-neutral-900">Daily Devotions</h1>
          <p className="mt-1 text-neutral-500">Create and manage spiritual reflections for the community.</p>
        </div>
        <Button onClick={handleOpenAdd} className="rounded-xl gap-2 shadow-lg shadow-neutral-200">
          <Plus className="h-4 w-4" />
          New Devotion
        </Button>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input 
            placeholder="Search devotions..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex h-11 w-full rounded-xl border border-neutral-200 bg-white px-10 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-neutral-100 bg-neutral-50/50 text-neutral-400 uppercase tracking-wider font-medium">
              <tr>
                <th className="px-6 py-4">Title & Scripture</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Author</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <Loader2 className="mx-auto h-6 w-6 animate-spin text-neutral-400" />
                  </td>
                </tr>
              ) : filteredDevotions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-neutral-400">
                    No devotions found.
                  </td>
                </tr>
              ) : (
                filteredDevotions.map((devotion: any, i) => (
                  <motion.tr
                    key={devotion._id}
                    initial="hidden"
                    animate="visible"
                    custom={i}
                    variants={fadeInUp}
                    className="group hover:bg-neutral-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-neutral-900 line-clamp-1">{devotion.title}</span>
                        <span className="text-xs text-neutral-400 italic line-clamp-1">{devotion.scripture}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-neutral-500">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-neutral-300" />
                        {new Date(devotion.date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-neutral-500">
                      <div className="flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5 text-neutral-300" />
                        {devotion.author}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={devotion.status === "published" ? "default" : "secondary"} className="capitalize">
                        {devotion.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                            <MoreVertical className="h-4 w-4 text-neutral-400" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40 rounded-xl shadow-xl border-neutral-200">
                          <DropdownMenuItem onClick={() => handleOpenEdit(devotion)} className="cursor-pointer gap-2">
                             <Edit2 className="h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(devotion._id)} className="cursor-pointer gap-2 text-red-600 focus:text-red-600">
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[95vh] flex flex-col rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
          <DialogHeader className="p-8 pb-0 shrink-0">
            <DialogTitle className="font-serif text-2xl">{editingDevotion ? "Edit Devotion" : "New Devotion"}</DialogTitle>
            <DialogDescription>Share a daily reflection and scripture with the church.</DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
            <div className="flex-1 overflow-y-auto p-8 pt-6 space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="title">Title</Label>
                  <Input 
                    id="title" 
                    value={formData.title} 
                    onChange={e => setFormData({...formData, title: e.target.value})} 
                    placeholder="E.g., Finding Peace in the Storm"
                    required
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input 
                    id="date" 
                    type="date"
                    value={formData.date} 
                    onChange={e => setFormData({...formData, date: e.target.value})} 
                    required
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="author">Author</Label>
                  <Input 
                    id="author" 
                    value={formData.author} 
                    onChange={e => setFormData({...formData, author: e.target.value})} 
                    required
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="scripture">Scripture Reference</Label>
                  <Input 
                    id="scripture" 
                    value={formData.scripture} 
                    onChange={e => setFormData({...formData, scripture: e.target.value})} 
                    placeholder="E.g., Psalm 23:1-4"
                    required
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={formData.status} onValueChange={(v: string | null) => setFormData({...formData, status: v || "published"})}>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Devotion Content</Label>
                <div className="min-h-[300px] border border-neutral-200 rounded-2xl overflow-hidden bg-white">
                    <Editor 
                        content={formData.content} 
                        onChange={c => setFormData({...formData, content: c})}
                        placeholder="Share your spiritual reflection..." 
                    />
                </div>
              </div>
            </div>

            <DialogFooter className="p-8 pt-4 border-t border-neutral-100 shrink-0">
              <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting} className="rounded-xl">
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="rounded-xl bg-neutral-900 px-8">
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                {editingDevotion ? "Update Devotion" : "Create Devotion"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
