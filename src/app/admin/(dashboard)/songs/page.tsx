"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { 
  Music, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  Eye,
  Languages,
  Tag,
  ChevronLeft,
  ChevronRight,
  Loader2
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

export default function SongsAdminPage() {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Form State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSong, setEditingSong] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sort, setSort] = useState("songNumber");
  const [order, setOrder] = useState("asc");

  const [formData, setFormData] = useState<{
    title: string;
    lyrics: string;
    language: string;
    category: string;
    status: string;
  }>({
    title: "",
    lyrics: "",
    language: "English",
    category: "worship",
    status: "published"
  });

  const fetchSongs = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/songs?search=${search}&sort=${sort}&order=${order}`);
      const data = await res.json();
      if (data.success) {
        setSongs(data.data);
        if (data.pagination) {
          setTotalPages(data.pagination.pages);
        }
      }
    } catch (error) {
      toast.error("Failed to fetch songs");
    } finally {
      setLoading(false);
    }
  }, [search, sort, order]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSongs();
    }, 500);
    return () => clearTimeout(timer);
  }, [fetchSongs]);

  const handleOpenAdd = () => {
    setEditingSong(null);
    setFormData({
      title: "",
      lyrics: "",
      language: "English",
      category: "worship",
      status: "published"
    });
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (song: any) => {
    setEditingSong(song);
    setFormData({
      title: song.title,
      lyrics: song.lyrics,
      language: song.language,
      category: song.category,
      status: song.status
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.lyrics || formData.lyrics === "<p></p>") {
      toast.error("Please add lyrics to the song");
      return;
    }
    setIsSubmitting(true);
    try {
      const url = editingSong ? `/api/songs/${editingSong._id}` : "/api/songs";
      const method = editingSong ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      const data = await res.json();
      if (data.success) {
        toast.success(editingSong ? "Song updated successfully" : "Song created successfully");
        setIsDialogOpen(false);
        fetchSongs();
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
    if (!confirm("Are you sure? This will permanently delete the song.")) return;
    try {
      const res = await fetch(`/api/songs/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        toast.success("Song deleted");
        fetchSongs();
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
          <h1 className="font-serif text-3xl font-bold text-neutral-900">Digital Hymn Book</h1>
          <p className="mt-1 text-neutral-500">Manage church songs, lyrics, and languages.</p>
        </div>
        <Button onClick={handleOpenAdd} className="rounded-xl gap-2 shadow-lg shadow-neutral-200">
          <Plus className="h-4 w-4" />
          Add New Song
        </Button>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <Input 
            placeholder="Search by title or lyrics..." 
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
                <th 
                  className="px-6 py-4 italic w-20 cursor-pointer hover:text-neutral-900 transition-colors"
                  onClick={() => {
                    setSort("songNumber");
                    setOrder(order === "asc" ? "desc" : "asc");
                  }}
                >
                  # {sort === "songNumber" && (order === "asc" ? "↑" : "↓")}
                </th>
                <th 
                  className="px-6 py-4 cursor-pointer hover:text-neutral-900 transition-colors"
                  onClick={() => {
                    setSort("title");
                    setOrder(order === "asc" ? "desc" : "asc");
                  }}
                >
                  Title {sort === "title" && (order === "asc" ? "↑" : "↓")}
                </th>
                <th 
                  className="px-6 py-4 cursor-pointer hover:text-neutral-900 transition-colors"
                  onClick={() => {
                    setSort("language");
                    setOrder(order === "asc" ? "desc" : "asc");
                  }}
                >
                  Language {sort === "language" && (order === "asc" ? "↑" : "↓")}
                </th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <Loader2 className="mx-auto h-6 w-6 animate-spin text-neutral-400" />
                  </td>
                </tr>
              ) : songs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-neutral-400">
                    No songs found matching your search.
                  </td>
                </tr>
              ) : (
                songs.map((song: any, i) => (
                  <motion.tr
                    key={song._id}
                    initial="hidden"
                    animate="visible"
                    custom={i}
                    variants={fadeInUp}
                    className="group hover:bg-neutral-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <span className="font-mono text-neutral-400 font-bold tracking-wider">
                        #{song.songNumber?.toString().padStart(3, "0")}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-500 group-hover:bg-neutral-900 group-hover:text-white transition-all">
                          <Music className="h-4 w-4" />
                        </div>
                        <span className="font-semibold text-neutral-900">{song.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className="gap-1 font-normal border-neutral-200 text-neutral-600">
                        <Languages className="h-3 w-3" />
                        {song.language}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-neutral-600 capitalize">
                      {song.category}
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
                          <DropdownMenuItem onClick={() => handleOpenEdit(song)} className="cursor-pointer gap-2">
                             <Edit2 className="h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(song._id)} className="cursor-pointer gap-2 text-red-600 focus:text-red-600">
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
            className="rounded-lg h-9 w-9 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium text-neutral-500 mx-2">
            Page {page} of {totalPages}
          </span>
          <Button 
            variant="outline" 
            size="sm" 
            disabled={page === totalPages}
            onClick={() => setPage(p => p + 1)}
            className="rounded-lg h-9 w-9 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] flex flex-col rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
          <DialogHeader className="p-8 pb-0 shrink-0">
            <DialogTitle className="font-serif text-2xl">{editingSong ? "Edit Song" : "Add New Song"}</DialogTitle>
            <DialogDescription>Fill in the details to update the digital hymn book.</DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
            <div className="flex-1 overflow-y-auto p-8 pt-6 space-y-6 custom-scrollbar">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="title">Song Title</Label>
                  <Input 
                    id="title" 
                    value={formData.title} 
                    onChange={e => setFormData({...formData, title: e.target.value})} 
                    placeholder="Enter song title..."
                    required
                    className="rounded-xl border-neutral-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Language</Label>
                  <Select value={formData.language || "English"} onValueChange={(v: string | null) => setFormData({...formData, language: v || "English"})}>
                    <SelectTrigger className="rounded-xl border-neutral-200">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl shadow-xl">
                      <SelectItem value="English">English</SelectItem>
                      <SelectItem value="Hindi">Hindi</SelectItem>
                      <SelectItem value="Odia">Odia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={formData.category || "worship"} onValueChange={(v: string | null) => setFormData({...formData, category: v || "worship"})}>
                    <SelectTrigger className="rounded-xl border-neutral-200">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl shadow-xl">
                      <SelectItem value="worship">Worship</SelectItem>
                      <SelectItem value="praise">Praise</SelectItem>
                      <SelectItem value="traditional">Traditional</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="lyrics">Lyrics</Label>
                <Editor 
                  content={formData.lyrics} 
                  onChange={c => setFormData({...formData, lyrics: c})}
                  placeholder="Type or paste lyrics here..." 
                />
              </div>
            </div>

            <DialogFooter className="p-8 pt-4 border-t border-neutral-100 shrink-0">
              <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting} className="rounded-xl">
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="rounded-xl bg-neutral-900 px-8">
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                {editingSong ? "Update Song" : "Create Song"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
