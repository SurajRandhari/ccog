"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Video, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  Eye,
  Calendar,
  User,
  Youtube,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import Link from "next/link";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.4, ease: "easeOut" as const },
  }),
};

export default function SermonsAdminPage() {
  const [sermons, setSermons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Form State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSermon, setEditingSermon] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    speaker: "Rev. Suresh Randhari",
    description: "",
    videoUrl: "",
    date: new Date().toISOString().split('T')[0],
    tags: ""
  });

  const fetchSermons = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/sermons?page=${page}&limit=9&search=${search}`);
      const data = await res.json();
      if (data.success) {
        setSermons(data.data);
        setTotalPages(data.pagination.pages);
      }
    } catch (error) {
      toast.error("Failed to fetch sermons");
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSermons();
    }, 500);
    return () => clearTimeout(timer);
  }, [fetchSermons]);

  const handleOpenAdd = () => {
    setEditingSermon(null);
    setFormData({
      title: "",
      speaker: "Rev. Suresh Randhari",
      description: "",
      videoUrl: "",
      date: new Date().toISOString().split('T')[0],
      tags: ""
    });
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (sermon: any) => {
    setEditingSermon(sermon);
    setFormData({
      title: sermon.title,
      speaker: sermon.speaker,
      description: sermon.description,
      videoUrl: sermon.videoUrl,
      date: new Date(sermon.date).toISOString().split('T')[0],
      tags: sermon.tags?.join(", ") || ""
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const url = editingSermon ? `/api/sermons/${editingSermon._id}` : "/api/sermons";
      const method = editingSermon ? "PUT" : "POST";
      
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
        toast.success(editingSermon ? "Sermon updated" : "Sermon added");
        setIsDialogOpen(false);
        fetchSermons();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this sermon message?")) return;
    try {
      const res = await fetch(`/api/sermons/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        toast.success("Sermon deleted");
        fetchSermons();
      }
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-neutral-900">Sermon Archive</h1>
          <p className="mt-1 text-neutral-500">Manage video messages and series library.</p>
        </div>
        <Button onClick={handleOpenAdd} className="rounded-xl gap-2 shadow-lg shadow-neutral-200">
          <Plus className="h-4 w-4" />
          New Sermon
        </Button>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <Input 
            placeholder="Search sermons by title or speaker..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-11 border-neutral-200 bg-white pl-10 focus-visible:ring-neutral-900"
          />
        </div>
        <Button variant="outline" className="h-11 gap-2 rounded-xl border-neutral-200 bg-white">
          <Filter className="h-4 w-4 text-neutral-400" />
          Speaker Filter
        </Button>
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <div className="flex min-h-[400px] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-neutral-300" />
          </div>
        ) : sermons.length === 0 ? (
          <div className="flex min-h-[400px] flex-col items-center justify-center rounded-3xl border-2 border-dashed border-neutral-200 bg-neutral-50/50 p-12 text-center">
            <div className="rounded-full bg-white p-4 shadow-sm mb-4">
              <Video className="h-8 w-8 text-neutral-300" />
            </div>
            <h3 className="text-lg font-serif font-bold text-neutral-900">No Sermons Found</h3>
            <p className="text-neutral-500 max-w-xs mx-auto mt-2">Adjust your search or add a new sermon to get started.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sermons.map((sermon: any, i) => (
              <motion.div
                key={sermon._id}
                initial="hidden"
                animate="visible"
                custom={i}
                variants={fadeInUp}
              >
                <Card className="group overflow-hidden border-neutral-200 bg-white hover:shadow-xl transition-all h-full flex flex-col">
                  <div className="relative aspect-video bg-neutral-900 overflow-hidden">
                    <img 
                      src={`https://img.youtube.com/vi/${sermon.videoUrl.split('v=')[1]?.split('&')[0] || sermon.videoUrl.split('/').pop()}/maxresdefault.jpg`} 
                      alt={sermon.title}
                      className="h-full w-full object-cover opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all duration-500"
                      onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=800'; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pt-10" />
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                      <Badge className="bg-neutral-900/50 backdrop-blur-md border-none text-[10px]">
                        {sermon.tags?.[0] || 'Sermon'}
                      </Badge>
                      <Youtube className="h-5 w-5 text-red-600" />
                    </div>
                  </div>
                  <CardHeader className="p-5 pb-2">
                    <div className="flex justify-between items-start gap-2">
                      <CardTitle className="text-lg font-serif leading-tight line-clamp-2 min-h-[3.5rem] group-hover:text-blue-600 transition-colors">
                        {sermon.title}
                      </CardTitle>
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full -mr-2" />
                          }
                        >
                          <MoreVertical className="h-4 w-4 text-neutral-400" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40 rounded-xl shadow-xl border-neutral-200">
                          <DropdownMenuItem onClick={() => handleOpenEdit(sermon)} className="cursor-pointer gap-2">
                             <Edit2 className="h-4 w-4" /> Edit Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(sermon._id)} className="cursor-pointer gap-2 text-red-600 focus:text-red-600">
                             <Trash2 className="h-4 w-4" /> Remove
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent className="p-5 pt-0 flex-1">
                    <div className="flex flex-col gap-2 mt-2 text-xs text-neutral-500">
                      <div className="flex items-center gap-2">
                        <User className="h-3.5 w-3.5 text-neutral-300" />
                        {sermon.speaker}
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5 text-neutral-300" />
                        {new Date(sermon.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-5 pt-0 border-t border-neutral-50 mt-auto bg-neutral-50/30">
                    <Link href={sermon.videoUrl} target="_blank" className="w-full">
                      <Button variant="ghost" className="w-full justify-between group/btn text-xs font-semibold text-neutral-600 hover:text-neutral-900">
                        Watch Sermon
                        <ChevronRight className="h-3 w-3 transition-transform group-hover/btn:translate-x-1" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 py-4">
          <Button 
            variant="outline" 
            size="sm" 
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
            className="rounded-xl h-10 px-4"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          <span className="text-sm font-medium text-neutral-900 bg-neutral-100 px-4 py-2 rounded-xl">
            {page} / {totalPages}
          </span>
          <Button 
            variant="outline" 
            size="sm" 
            disabled={page === totalPages}
            onClick={() => setPage(p => p + 1)}
            className="rounded-xl h-10 px-4"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[650px] rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
          <DialogHeader className="p-8 pb-0">
            <DialogTitle className="font-serif text-2xl">{editingSermon ? "Edit Sermon" : "Upload New Sermon"}</DialogTitle>
            <DialogDescription>Enter sermon details and YouTube link to publish.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Sermon Title</Label>
                <Input 
                  id="title" 
                  value={formData.title} 
                  onChange={e => setFormData({...formData, title: e.target.value})} 
                  placeholder="e.g. The Power of Grace"
                  required
                  className="rounded-xl border-neutral-200"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="speaker">Speaker</Label>
                <Input 
                  id="speaker" 
                  value={formData.speaker} 
                  onChange={e => setFormData({...formData, speaker: e.target.value})} 
                  placeholder="Speaker name..."
                  required
                  className="rounded-xl border-neutral-200"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Preach Date</Label>
                <Input 
                  id="date" 
                  type="date"
                  value={formData.date} 
                  onChange={e => setFormData({...formData, date: e.target.value})} 
                  required
                  className="rounded-xl border-neutral-200"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="videoUrl">YouTube URL</Label>
                <Input 
                  id="videoUrl" 
                  value={formData.videoUrl} 
                  onChange={e => setFormData({...formData, videoUrl: e.target.value})} 
                  placeholder="https://youtube.com/watch?v=..."
                  required
                  className="rounded-xl border-neutral-200"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma separated)</Label>
              <Input 
                id="tags" 
                value={formData.tags} 
                onChange={e => setFormData({...formData, tags: e.target.value})} 
                placeholder="Faith, Hope, SeriesName"
                className="rounded-xl border-neutral-200"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Message Description</Label>
              <Textarea 
                id="description" 
                value={formData.description} 
                onChange={e => setFormData({...formData, description: e.target.value})} 
                rows={4}
                placeholder="Brief summary of the message..."
                className="rounded-2xl border-neutral-200 resize-none"
                required
              />
            </div>
            <DialogFooter className="pt-4 border-t border-neutral-100 -mx-8 px-8 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-neutral-400">
                <Info className="h-3 w-3" />
                Slug will be auto-generated
              </div>
              <div className="flex gap-2">
                <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting} className="rounded-xl">
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} className="rounded-xl bg-neutral-900 px-8">
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  {editingSermon ? "Update Archive" : "Publish Sermon"}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
