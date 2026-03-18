"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  MapPin,
  Clock,
  Image as ImageIcon,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Upload,
  X
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

export default function EventsAdminPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isUpcomingOnly, setIsUpcomingOnly] = useState(false);

  // Form State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "Calvary Church of God",
    date: new Date().toISOString().split('T')[0],
    time: "10:00 AM",
    image: "",
    category: "Worship",
    status: "published"
  });

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/events?page=${page}&limit=10&search=${search}&upcoming=${isUpcomingOnly}`);
      const data = await res.json();
      if (data.success) {
        setEvents(data.data);
        // Assuming the events API I updated doesn't have pagination metadata yet, 
        // I should probably add it or use a default.
        // Actually, I'll update the events API to match the songs API format later.
        setTotalPages(1); 
      }
    } catch (error) {
      toast.error("Failed to fetch events");
    } finally {
      setLoading(false);
    }
  }, [page, search, isUpcomingOnly]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleOpenAdd = () => {
    setEditingEvent(null);
    setFormData({
      title: "",
      description: "",
      location: "Calvary Church of God",
      date: new Date().toISOString().split('T')[0],
      time: "10:00 AM",
      image: "",
      category: "Worship",
      status: "published"
    });
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (event: any) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      location: event.location,
      date: new Date(event.date).toISOString().split('T')[0],
      time: event.time,
      image: event.image,
      category: event.category || "Worship",
      status: event.status
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
        setFormData({ ...formData, image: data.url });
        toast.success("Image uploaded!");
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
    setIsSubmitting(true);
    try {
      const url = editingEvent ? `/api/events/${editingEvent._id}` : "/api/events";
      const method = editingEvent ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      const data = await res.json();
      if (data.success) {
        toast.success(editingEvent ? "Event updated" : "Event created");
        setIsDialogOpen(false);
        fetchEvents();
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
    if (!confirm("Delete this event?")) return;
    try {
      const res = await fetch(`/api/events/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Event deleted");
        fetchEvents();
      }
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-neutral-900">Events Manager</h1>
          <p className="mt-1 text-neutral-500">Plan and publish church activities and special occasions.</p>
        </div>
        <Button onClick={handleOpenAdd} className="rounded-xl gap-2 shadow-lg shadow-neutral-200">
          <Plus className="h-4 w-4" />
          Create Event
        </Button>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <Input 
            placeholder="Search events..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-11 border-neutral-200 bg-white pl-10 focus-visible:ring-neutral-900"
          />
        </div>
        <Button 
          variant={isUpcomingOnly ? "default" : "outline"}
          onClick={() => setIsUpcomingOnly(!isUpcomingOnly)}
          className="h-11 gap-2 rounded-xl border-neutral-200 transition-all"
        >
          <Filter className="h-4 w-4" />
          Upcoming Only
        </Button>
      </div>

      <div className="overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-neutral-100 bg-neutral-50/50 text-neutral-400 uppercase tracking-wider font-medium">
              <tr>
                <th className="px-6 py-4">Event Details</th>
                <th className="px-6 py-4">Date & Time</th>
                <th className="px-6 py-4">Location</th>
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
              ) : events.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-neutral-400">
                    No events found.
                  </td>
                </tr>
              ) : (
                events.map((event: any, i) => (
                  <motion.tr
                    key={event._id}
                    initial="hidden"
                    animate="visible"
                    custom={i}
                    variants={fadeInUp}
                    className="group hover:bg-neutral-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 flex-shrink-0 rounded-lg bg-neutral-100 overflow-hidden border border-neutral-200">
                          {event.image ? (
                            <img src={event.image} alt="" className="h-full w-full object-cover" />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <Calendar className="h-4 w-4 text-neutral-400" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-neutral-900">{event.title}</p>
                          <p className="text-xs text-neutral-400 line-clamp-1 max-w-[200px]">{event.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-neutral-600">
                      <div className="flex flex-col">
                        <span className="font-medium">{new Date(event.date).toLocaleDateString()}</span>
                        <span className="text-xs text-neutral-400">{event.time}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-neutral-500">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5 text-neutral-300" />
                        {event.location}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                       <Badge variant={event.status === 'published' ? 'default' : 'secondary'} className="rounded-full px-2 py-0 h-5 text-[10px] uppercase">
                          {event.status}
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
                          <DropdownMenuItem onClick={() => handleOpenEdit(event)} className="cursor-pointer gap-2 text-sm">
                             <Edit2 className="h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(event._id)} className="cursor-pointer gap-2 text-sm text-red-600 focus:text-red-600">
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
            <DialogTitle className="font-serif text-2xl">{editingEvent ? "Edit Event" : "Create New Event"}</DialogTitle>
            <DialogDescription>Fill in the details to publish a church event.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[80vh] overflow-y-auto">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="title">Event Title</Label>
                <Input 
                  id="title" 
                  value={formData.title} 
                  onChange={e => setFormData({...formData, title: e.target.value})} 
                  placeholder="e.g. Sunday Service, Youth Meet..."
                  required
                  className="rounded-xl border-neutral-200"
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
                  className="rounded-xl border-neutral-200"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Input 
                  id="time" 
                  value={formData.time} 
                  onChange={e => setFormData({...formData, time: e.target.value})} 
                  placeholder="e.g. 10:00 AM - 12:00 PM"
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
                  <option value="Worship">Worship</option>
                  <option value="Youth">Youth</option>
                  <option value="Teaching">Teaching</option>
                  <option value="Outreach">Outreach</option>
                  <option value="Special">Special</option>
                </select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="location">Location</Label>
                <Input 
                  id="location" 
                  value={formData.location} 
                  onChange={e => setFormData({...formData, location: e.target.value})} 
                  placeholder="Event venue..."
                  required
                  className="rounded-xl border-neutral-200"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Event Image</Label>
              <div className="flex flex-col gap-4">
                {formData.image && (
                  <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-neutral-200 bg-neutral-50 group">
                    <img src={formData.image} alt="Preview" className="h-full w-full object-cover" />
                    <Button 
                      type="button" 
                      variant="destructive" 
                      size="icon" 
                      className="absolute top-2 right-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
                      onClick={() => setFormData({...formData, image: ""})}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                {!formData.image && (
                  <div className="relative group">
                    <Input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      id="image-upload"
                      onChange={handleImageUpload}
                      disabled={isUploading}
                    />
                    <Label
                      htmlFor="image-upload"
                      className="flex flex-col items-center justify-center w-full aspect-video rounded-2xl border-2 border-dashed border-neutral-200 bg-neutral-50/50 cursor-pointer hover:bg-neutral-100 transition-all hover:border-neutral-300"
                    >
                      {isUploading ? (
                        <Loader2 className="h-6 w-6 animate-spin text-neutral-400" />
                      ) : (
                        <>
                          <Upload className="h-6 w-6 text-neutral-400 mb-2" />
                          <span className="text-sm font-medium text-neutral-600">Click to upload image</span>
                          <span className="text-xs text-neutral-400 mt-1">PNG, JPG or WEBP (Max 10MB)</span>
                        </>
                      )}
                    </Label>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Event Description</Label>
              <Textarea 
                id="description" 
                value={formData.description} 
                onChange={e => setFormData({...formData, description: e.target.value})} 
                rows={4}
                placeholder="Give more details about the event..."
                className="rounded-2xl border-neutral-200 resize-none"
                required
              />
            </div>

            <DialogFooter className="pt-4 border-t border-neutral-100 -mx-8 px-8">
              <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting} className="rounded-xl font-medium">
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || isUploading} className="rounded-xl bg-neutral-900 px-8 shadow-lg shadow-neutral-200 font-medium tracking-tight">
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                {editingEvent ? "Update Event" : "Publish Event"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
