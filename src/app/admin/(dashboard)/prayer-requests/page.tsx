"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageSquare, 
  Search, 
  Filter, 
  MoreVertical, 
  Trash2, 
  Eye,
  Mail,
  Calendar,
  Clock,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Globe,
  Lock,
  CheckCircle,
  XCircle
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
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.4, ease: "easeOut" as const },
  }),
};

export default function PrayerRequestsAdminPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all"); // all, public, private

  // Details Dialog
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const fetchRequests = useCallback(async () => {
    try {
      setLoading(true);
      // The API currently doesn't support search/filter in the way I'm using here, 
      // but I'll filter client-side for now or update the API if needed.
      const res = await fetch(`/api/prayer`);
      const data = await res.json();
      if (data.success) {
        setRequests(data.data);
      }
    } catch (error) {
      toast.error("Failed to fetch prayer requests");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const filteredRequests = requests.filter((req: any) => {
    const matchesSearch = req.name.toLowerCase().includes(search.toLowerCase()) || 
                          req.request.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || 
                          (filter === "public" && req.isPublic) || 
                          (filter === "private" && !req.isPublic);
    return matchesSearch && matchesFilter;
  });

  const handleTogglePublic = async (request: any) => {
    try {
      const res = await fetch(`/api/prayer/${request._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublic: !request.isPublic }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(request.isPublic ? "Set to Private" : "Set to Public");
        fetchRequests();
        if (selectedRequest?._id === request._id) {
           setSelectedRequest(data.data);
        }
      }
    } catch (err) {
      toast.error("Update failed");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this prayer request?")) return;
    try {
      const res = await fetch(`/api/prayer/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Request deleted");
        fetchRequests();
        setIsDetailsOpen(false);
      }
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-neutral-900">Prayer Requests</h1>
          <p className="mt-1 text-neutral-500">Manage and respond to prayer needs from the congregation.</p>
        </div>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <Input 
            placeholder="Search by name or request content..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-11 border-neutral-200 bg-white pl-10 focus-visible:ring-neutral-900"
          />
        </div>
        <div className="flex bg-neutral-100 p-1 rounded-xl">
           <Button 
            variant={filter === 'all' ? 'secondary' : 'ghost'} 
            size="sm" 
            onClick={() => setFilter('all')}
            className={`rounded-lg h-9 px-4 ${filter === 'all' ? 'bg-white shadow-sm' : ''}`}
           >
             All
           </Button>
           <Button 
            variant={filter === 'public' ? 'secondary' : 'ghost'} 
            size="sm" 
            onClick={() => setFilter('public')}
            className={`rounded-lg h-9 px-4 ${filter === 'public' ? 'bg-white shadow-sm' : ''}`}
           >
             Public
           </Button>
           <Button 
            variant={filter === 'private' ? 'secondary' : 'ghost'} 
            size="sm" 
            onClick={() => setFilter('private')}
            className={`rounded-lg h-9 px-4 ${filter === 'private' ? 'bg-white shadow-sm' : ''}`}
           >
             Private
           </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-neutral-100 bg-neutral-50/50 text-neutral-400 uppercase tracking-wider font-medium">
              <tr>
                <th className="px-6 py-4">From</th>
                <th className="px-6 py-4">Request Preview</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Visibility</th>
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
              ) : filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-neutral-400">
                    No prayer requests found.
                  </td>
                </tr>
              ) : (
                filteredRequests.map((req: any, i) => (
                  <motion.tr
                    key={req._id}
                    initial="hidden"
                    animate="visible"
                    custom={i}
                    variants={fadeInUp}
                    className="group hover:bg-neutral-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-neutral-900">{req.name}</span>
                        <span className="text-xs text-neutral-400">{req.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 max-w-xs">
                      <p className="text-neutral-600 line-clamp-1">{req.request}</p>
                    </td>
                    <td className="px-6 py-4 text-neutral-500 italic">
                      {new Date(req.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                       <Badge variant={req.isPublic ? 'default' : 'outline'} className="gap-1 font-normal border-neutral-200">
                          {req.isPublic ? <Globe className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
                          {req.isPublic ? 'Public' : 'Private'}
                       </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 rounded-full text-neutral-400 hover:text-blue-600"
                          onClick={() => { setSelectedRequest(req); setIsDetailsOpen(true); }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            render={
                              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" />
                            }
                          >
                            <MoreVertical className="h-4 w-4 text-neutral-400" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48 rounded-xl shadow-xl border-neutral-200">
                            <DropdownMenuItem onClick={() => handleTogglePublic(req)} className="cursor-pointer gap-2">
                               {req.isPublic ? <Lock className="h-4 w-4" /> : <Globe className="h-4 w-4" />}
                               Make it {req.isPublic ? 'Private' : 'Public'}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete(req._id)} className="cursor-pointer gap-2 text-red-600 focus:text-red-600">
                               <Trash2 className="h-4 w-4" /> Delete Permanently
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[550px] rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
          {selectedRequest && (
            <>
              <DialogHeader className="p-8 pb-4 bg-neutral-50/50 border-b border-neutral-100">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary" className="rounded-full bg-white border-neutral-200 text-neutral-500">
                    ID: {selectedRequest._id.slice(-6)}
                  </Badge>
                  <span className="text-xs text-neutral-400 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {new Date(selectedRequest.createdAt).toLocaleString()}
                  </span>
                </div>
                <DialogTitle className="font-serif text-2xl text-neutral-900">{selectedRequest.name}</DialogTitle>
                <div className="flex items-center gap-4 mt-2 text-sm text-neutral-500 font-medium">
                   <span className="flex items-center gap-1.5"><Mail className="h-4 w-4 text-neutral-300" /> {selectedRequest.email}</span>
                </div>
              </DialogHeader>
              <div className="p-8 space-y-6">
                <div className="space-y-2">
                  <Label className="text-neutral-400 uppercase tracking-widest text-[10px] font-bold">The Request</Label>
                  <p className="text-neutral-700 leading-relaxed bg-neutral-50 p-4 rounded-2xl border border-neutral-100 text-base">
                    "{selectedRequest.request}"
                  </p>
                </div>
                
                <div className="flex items-center justify-between p-4 rounded-2xl bg-neutral-900 text-white shadow-xl">
                   <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${selectedRequest.isPublic ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                        {selectedRequest.isPublic ? <Globe className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
                      </div>
                      <div>
                        <p className="text-sm font-semibold">Visibility Status</p>
                        <p className="text-[10px] opacity-70">This request is currently {selectedRequest.isPublic ? 'shown on public website' : 'hidden from public view'}</p>
                      </div>
                   </div>
                   <Switch 
                    checked={selectedRequest.isPublic} 
                    onCheckedChange={() => handleTogglePublic(selectedRequest)}
                    className="data-[state=checked]:bg-emerald-500"
                   />
                </div>
              </div>
              <DialogFooter className="p-8 pt-4 border-t border-neutral-100 flex items-center justify-between">
                <Button variant="ghost" className="text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl" onClick={() => handleDelete(selectedRequest._id)}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Request
                </Button>
                <Button className="rounded-xl bg-neutral-900 px-8" onClick={() => setIsDetailsOpen(false)}>
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
