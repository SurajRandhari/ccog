"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  FileIcon,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.4, ease: "easeOut" as const },
  }),
};

export default function DownloadsAdminPage() {
  const [downloads, setDownloads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Form State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDownload, setEditingDownload] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    fileUrl: "",
    fileType: "PDF",
    fileSizeBytes: 0,
    category: "General",
    status: "published"
  });

  const fetchDownloads = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/downloads?page=${page}&limit=10&search=${search}`);
      const data = await res.json();
      if (data.success) {
        setDownloads(data.data);
        setTotalPages(data.pagination?.pages || 1); 
      }
    } catch (error) {
      toast.error("Failed to fetch downloads");
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchDownloads();
  }, [fetchDownloads]);

  const handleOpenAdd = () => {
    setEditingDownload(null);
    setFormData({
      title: "",
      description: "",
      fileUrl: "",
      fileType: "PDF",
      fileSizeBytes: 1048576, // 1MB default
      category: "General",
      status: "published"
    });
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (download: any) => {
    setEditingDownload(download);
    setFormData({
      title: download.title,
      description: download.description,
      fileUrl: download.fileUrl,
      fileType: download.fileType,
      fileSizeBytes: download.fileSizeBytes,
      category: download.category,
      status: download.status
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const url = editingDownload ? `/api/downloads/${editingDownload._id}` : "/api/downloads";
      const method = editingDownload ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      const data = await res.json();
      if (data.success) {
        toast.success(editingDownload ? "Download updated" : "Download created");
        setIsDialogOpen(false);
        fetchDownloads();
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
    if (!confirm("Delete this download?")) return;
    try {
      const res = await fetch(`/api/downloads/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Download deleted");
        fetchDownloads();
      }
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-neutral-900">Downloads Manager</h1>
          <p className="mt-1 text-neutral-500">Manage resources, documents, and files for the congregation.</p>
        </div>
        <Button onClick={handleOpenAdd} className="rounded-xl gap-2 shadow-lg shadow-neutral-200">
          <Plus className="h-4 w-4" />
          Add Download
        </Button>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <Input 
            placeholder="Search resources..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-11 border-neutral-200 bg-white pl-10 focus-visible:ring-neutral-900"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-neutral-100 bg-neutral-50/50 text-neutral-400 uppercase tracking-wider font-medium">
              <tr>
                <th className="px-6 py-4">Resource Details</th>
                <th className="px-6 py-4">Type & Size</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Downloads</th>
                <th className="px-6 py-4">Status</th>
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
              ) : downloads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-neutral-400">
                    No downloads found.
                  </td>
                </tr>
              ) : (
                downloads.map((download: any, i) => (
                  <motion.tr
                    key={download._id}
                    initial="hidden"
                    animate="visible"
                    custom={i}
                    variants={fadeInUp}
                    className="group hover:bg-neutral-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 flex-shrink-0 flex items-center justify-center rounded-lg bg-neutral-100 border border-neutral-200">
                          <FileIcon className="h-5 w-5 text-neutral-400" />
                        </div>
                        <div>
                          <p className="font-semibold text-neutral-900 line-clamp-1 max-w-[200px]" title={download.title}>{download.title}</p>
                          <p className="text-xs text-neutral-400 line-clamp-1 max-w-[200px]" title={download.description}>{download.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-neutral-600">
                      <div className="flex flex-col">
                        <span className="font-medium">{download.fileType}</span>
                        <span className="text-xs text-neutral-400">{(download.fileSizeBytes / (1024 * 1024)).toFixed(2)} MB</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-neutral-500">
                      {download.category}
                    </td>
                    <td className="px-6 py-4 text-neutral-500 font-medium">
                      {download.downloadCount}
                    </td>
                    <td className="px-6 py-4">
                       <Badge variant={download.status === 'published' ? 'default' : 'secondary'} className="rounded-full px-2 py-0 h-5 text-[10px] uppercase">
                          {download.status}
                       </Badge>
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
                          <DropdownMenuItem onClick={() => handleOpenEdit(download)} className="cursor-pointer gap-2 text-sm">
                             <Edit2 className="h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(download._id)} className="cursor-pointer gap-2 text-sm text-red-600 focus:text-red-600">
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
        <DialogContent className="sm:max-w-[600px] rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
          <DialogHeader className="p-8 pb-0">
            <DialogTitle className="font-serif text-2xl">{editingDownload ? "Edit Resource" : "Add New Resource"}</DialogTitle>
            <DialogDescription>Add a new file or document for users to download.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[80vh] overflow-y-auto">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="title">Resource Title</Label>
                <Input 
                  id="title" 
                  value={formData.title} 
                  onChange={e => setFormData({...formData, title: e.target.value})} 
                  placeholder="e.g. 2026 Ministry Report"
                  required
                  className="rounded-xl border-neutral-200"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="fileUrl">File URL (S3, Cloudinary, Dropbox link)</Label>
                <Input 
                  id="fileUrl" 
                  value={formData.fileUrl} 
                  onChange={e => setFormData({...formData, fileUrl: e.target.value})} 
                  placeholder="https://..."
                  required
                  className="rounded-xl border-neutral-200"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fileType">File Type</Label>
                <select 
                  id="fileType" 
                  value={formData.fileType} 
                  onChange={e => setFormData({...formData, fileType: e.target.value})} 
                  className="w-full h-11 rounded-xl border border-neutral-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900/10"
                >
                  <option value="PDF">PDF</option>
                  <option value="DOCX">DOCX</option>
                  <option value="ZIP">ZIP</option>
                  <option value="IMAGE">Image</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="fileSizeBytes">Approx. Size (in Bytes)</Label>
                <Input 
                  id="fileSizeBytes" 
                  type="number"
                  value={formData.fileSizeBytes} 
                  onChange={e => setFormData({...formData, fileSizeBytes: parseInt(e.target.value)})} 
                  required
                  className="rounded-xl border-neutral-200"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select 
                  id="category" 
                  value={formData.category} 
                  onChange={e => setFormData({...formData, category: e.target.value})} 
                  className="w-full h-11 rounded-xl border border-neutral-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900/10"
                >
                  <option value="General">General</option>
                  <option value="Study Guide">Study Guide</option>
                  <option value="Report">Report</option>
                  <option value="Form">Form</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select 
                  id="status" 
                  value={formData.status} 
                  onChange={e => setFormData({...formData, status: e.target.value})} 
                  className="w-full h-11 rounded-xl border border-neutral-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900/10"
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Resource Description</Label>
              <Textarea 
                id="description" 
                value={formData.description} 
                onChange={e => setFormData({...formData, description: e.target.value})} 
                rows={3}
                placeholder="Give more details about this file..."
                className="rounded-2xl border-neutral-200 resize-none"
                required
              />
            </div>

            <DialogFooter className="pt-4 border-t border-neutral-100 -mx-8 px-8">
              <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting} className="rounded-xl font-medium">
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="rounded-xl bg-neutral-900 px-8 shadow-lg shadow-neutral-200 font-medium tracking-tight">
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                {editingDownload ? "Update Resource" : "Add Resource"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
