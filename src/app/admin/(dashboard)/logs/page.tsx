"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { 
  Shield, 
  Search, 
  Filter, 
  User, 
  Activity, 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  Loader2,
  Database,
  Globe,
  Settings,
  MoreHorizontal,
  Info,
  Calendar,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog";
import { toast } from "sonner";

const fadeInUp = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.03, duration: 0.3, ease: "easeOut" as const },
  }),
};

export default function ActivityLogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedLog, setSelectedLog] = useState<any>(null);

  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/logs?page=${page}&limit=20`);
      const data = await res.json();
      if (data.success) {
        setLogs(data.data);
        setTotalPages(data.pagination.pages);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to fetch logs");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const getActionColor = (action: string) => {
    if (action.includes("created")) return "bg-emerald-50 text-emerald-700 border-emerald-100";
    if (action.includes("updated")) return "bg-blue-50 text-blue-700 border-blue-100";
    if (action.includes("deleted")) return "bg-rose-50 text-rose-700 border-rose-100";
    return "bg-neutral-50 text-neutral-700 border-neutral-100";
  };

  const getEntityIcon = (type: string) => {
    switch (type) {
      case "song": return <Activity className="h-4 w-4" />;
      case "sermon": return <Activity className="h-4 w-4 text-purple-500" />;
      case "event": return <Calendar className="h-4 w-4 text-orange-500" />;
      case "blog": return <FileText className="h-4 w-4 text-green-500" />;
      default: return <Database className="h-4 w-4 text-neutral-400" />;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-neutral-900">Activity Logs</h1>
          <p className="mt-1 text-neutral-500">Audit trail of all administrative actions in the CMS.</p>
        </div>
        <Button variant="outline" onClick={fetchLogs} className="rounded-xl gap-2 h-11">
          <Activity className="h-4 w-4" />
          Refresh Logs
        </Button>
      </div>

      <div className="flex items-center gap-4 bg-neutral-100/50 p-4 rounded-2xl border border-neutral-200/60">
        <div className="p-2 bg-neutral-900 rounded-lg">
           <Shield className="h-5 w-5 text-white" />
        </div>
        <div className="flex-1">
           <h4 className="text-sm font-semibold text-neutral-900">Security Monitoring Active</h4>
           <p className="text-xs text-neutral-500">Every change to the church content is recorded for security purposes.</p>
        </div>
        <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-100">Live</Badge>
      </div>

      <div className="overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-neutral-100 bg-neutral-50/50 text-neutral-400 uppercase tracking-wider font-medium text-[10px]">
              <tr>
                <th className="px-6 py-4">Timestamp</th>
                <th className="px-6 py-4">Admin User</th>
                <th className="px-6 py-4">Action</th>
                <th className="px-6 py-4">Entity</th>
                <th className="px-6 py-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <Loader2 className="mx-auto h-6 w-6 animate-spin text-neutral-400" />
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-neutral-400">
                    No activity logs found.
                  </td>
                </tr>
              ) : (
                logs.map((log: any, i) => (
                  <motion.tr
                    key={log._id}
                    initial="hidden"
                    animate="visible"
                    custom={i}
                    variants={fadeInUp}
                    className="group hover:bg-neutral-50/50 transition-colors"
                  >
                    <td className="px-6 py-4 text-neutral-500 font-mono text-[11px]">
                      <div className="flex flex-col">
                        <span>{new Date(log.timestamp).toLocaleDateString()}</span>
                        <span className="opacity-60">{new Date(log.timestamp).toLocaleTimeString()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-neutral-900">{log.userEmail.split('@')[0]}</span>
                        <span className="text-[10px] text-neutral-400">{log.userEmail}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                       <Badge variant="outline" className={`rounded-lg py-0 h-6 text-[10px] font-bold ${getActionColor(log.action)}`}>
                          {log.action.replace('_', ' ').toUpperCase()}
                       </Badge>
                    </td>
                    <td className="px-6 py-4">
                       <div className="flex items-center gap-2 text-neutral-600 capitalize">
                          <Badge variant="secondary" className="bg-neutral-100 border-none text-neutral-500 text-[10px]">
                            {log.entityType}
                          </Badge>
                       </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <Button 
                        variant="ghost" 
                        size="sm" 
                        className="rounded-lg text-xs"
                        onClick={() => setSelectedLog(log)}
                       >
                         View Details
                       </Button>
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
            className="rounded-xl h-10 w-10 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium text-neutral-500 mx-4">
            Page {page} of {totalPages}
          </span>
          <Button 
            variant="outline" 
            size="sm" 
            disabled={page === totalPages}
            onClick={() => setPage(p => p + 1)}
            className="rounded-xl h-10 w-10 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Log Details Dialog */}
      <Dialog open={!!selectedLog} onOpenChange={() => setSelectedLog(null)}>
        <DialogContent className="sm:max-w-md rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
          {selectedLog && (
            <>
              <DialogHeader className="p-8 pb-4 bg-neutral-900 text-white">
                <div className="flex items-center justify-between mb-4">
                   <Badge className="bg-white/20 border-white/10 text-white">Audit Log</Badge>
                   <span className="text-[10px] opacity-60 font-mono">ID: {selectedLog._id}</span>
                </div>
                <DialogTitle className="text-2xl font-serif">Action Details</DialogTitle>
                <DialogDescription className="text-neutral-400">
                  Detailed information about the security event.
                </DialogDescription>
              </DialogHeader>
              <div className="p-8 space-y-6">
                 <div className="grid gap-4">
                    <div className="space-y-1">
                       <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Admin User</p>
                       <p className="text-sm font-semibold flex items-center gap-2">
                          <User className="h-4 w-4 text-neutral-300" />
                          {selectedLog.userEmail}
                       </p>
                    </div>
                    <div className="space-y-1">
                       <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Action Taken</p>
                       <Badge className={getActionColor(selectedLog.action)}>
                          {selectedLog.action.toUpperCase()}
                       </Badge>
                    </div>
                    <div className="space-y-1">
                       <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Activity Description</p>
                       <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100 text-sm text-neutral-700 leading-relaxed italic">
                          "{selectedLog.details}"
                       </div>
                    </div>
                    {selectedLog.entityId && (
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Target Resource ID</p>
                        <p className="text-xs font-mono text-neutral-500 bg-neutral-100 p-2 rounded-lg truncate">
                          {selectedLog.entityId}
                        </p>
                      </div>
                    )}
                 </div>
              </div>
              <div className="p-8 pt-0 flex justify-end">
                <Button className="rounded-xl bg-neutral-900 px-8" onClick={() => setSelectedLog(null)}>
                  Close Audit
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
