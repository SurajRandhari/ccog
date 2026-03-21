"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Music,
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Loader2,
  RotateCcw,
  Globe,
  CheckCircle2,
  XCircle,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useDebounce } from "@/hooks/use-debounce";

interface Song {
  _id: string;
  songNo: number | null;
  title: string;
  slug: string;
  language: string;
  category: string;
  isPublished: boolean;
  status: string;
  createdAt: string;
  author?: string;
}

const LANGUAGES = ["All", "Hindi", "English", "Odia"];
const CATEGORIES = [
  "All",
  "Worship",
  "Praise",
  "Christmas",
  "Lent",
  "Hymn",
  "Special Songs",
];

const fadeInUp = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.03, duration: 0.35, ease: "easeOut" as const },
  }),
};

export default function SongsAdminPage() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Filters
  const [langFilter, setLangFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [publishedFilter, setPublishedFilter] = useState("all"); // "all" | "true" | "false"
  const [showDeleted, setShowDeleted] = useState(false);

  // Sort
  const [sort, setSort] = useState("songNo");
  const [order, setOrder] = useState("asc");

  const debouncedSearch = useDebounce(search, 300);

  const fetchSongs = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.set("search", debouncedSearch);
      params.set("sort", sort);
      params.set("order", order);
      params.set("page", page.toString());
      params.set("limit", "30");
      if (langFilter !== "All") params.set("lang", langFilter);
      if (categoryFilter !== "All") params.set("category", categoryFilter);
      if (publishedFilter !== "all") params.set("published", publishedFilter);
      if (showDeleted) params.set("showDeleted", "true");

      const res = await fetch(`/api/songs?${params.toString()}`, {
        headers: { "x-user-role": "admin" },
      });
      const data = await res.json();
      if (data.success) {
        setSongs(data.data);
        if (data.pagination) {
          setTotalPages(data.pagination.pages);
          setTotal(data.pagination.total);
        }
      }
    } catch (error) {
      toast.error("Failed to fetch songs");
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, sort, order, page, langFilter, categoryFilter, publishedFilter, showDeleted]);

  useEffect(() => {
    fetchSongs();
  }, [fetchSongs]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, langFilter, categoryFilter, publishedFilter, showDeleted]);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Soft-delete "${title}"? It can be restored later.`)) return;
    try {
      const res = await fetch(`/api/songs/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        toast.success("Song deleted");
        fetchSongs();
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("Failed to delete");
    }
  };

  const handleRestore = async (id: string) => {
    try {
      const res = await fetch(`/api/songs/${id}/restore`, { method: "PATCH" });
      const data = await res.json();
      if (data.success) {
        toast.success("Song restored");
        fetchSongs();
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("Failed to restore");
    }
  };

  const handleTogglePublish = async (id: string) => {
    try {
      const res = await fetch(`/api/songs/${id}/publish`, { method: "PATCH" });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
        fetchSongs();
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("Failed to toggle publish status");
    }
  };

  const toggleSort = (field: string) => {
    if (sort === field) {
      setOrder(order === "asc" ? "desc" : "asc");
    } else {
      setSort(field);
      setOrder("asc");
    }
  };

  const getSortIndicator = (field: string) => {
    if (sort !== field) return "";
    return order === "asc" ? " ↑" : " ↓";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-neutral-900">
            Song Library
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Manage songs, lyrics, publishing, and categories.{" "}
            <span className="font-medium text-neutral-700">{total} songs</span>
          </p>
        </div>
        <Link href="/admin/songs/new">
          <Button className="rounded-xl gap-2 shadow-lg shadow-neutral-200">
            <Plus className="h-4 w-4" />
            Add New Song
          </Button>
        </Link>
      </div>

      {/* Search & Filters */}
      <div className="rounded-2xl border border-neutral-100 bg-white p-4 shadow-sm space-y-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <Input
              placeholder="Search by title, lyrics, or song number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-11 border-neutral-200 bg-neutral-50/50 pl-10 focus-visible:ring-neutral-900 rounded-xl"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Language Filter */}
            <Select value={langFilter} onValueChange={(val) => setLangFilter(val || "All")}>
              <SelectTrigger className="h-10 w-[130px] rounded-xl border-neutral-200 bg-white text-xs font-medium">
                <Globe className="h-3 w-3 mr-1 text-neutral-400" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {LANGUAGES.map((l) => (
                  <SelectItem key={l} value={l}>
                    {l === "All" ? "All Languages" : l}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Category Filter */}
            <Select value={categoryFilter} onValueChange={(val) => setCategoryFilter(val || "All")}>
              <SelectTrigger className="h-10 w-[140px] rounded-xl border-neutral-200 bg-white text-xs font-medium">
                <Filter className="h-3 w-3 mr-1 text-neutral-400" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c === "All" ? "All Categories" : c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Published Filter */}
            <Select value={publishedFilter} onValueChange={(val) => setPublishedFilter(val || "all")}>
              <SelectTrigger className="h-10 w-[130px] rounded-xl border-neutral-200 bg-white text-xs font-medium">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="true">Published</SelectItem>
                <SelectItem value="false">Unpublished</SelectItem>
              </SelectContent>
            </Select>

            {/* Show Deleted Toggle */}
            <div className="flex items-center gap-2 px-3 py-2 bg-neutral-50 rounded-xl border border-neutral-100">
              <Switch
                checked={showDeleted}
                onCheckedChange={setShowDeleted}
                className="scale-90"
              />
              <span className="text-xs font-medium text-neutral-500 whitespace-nowrap">
                Show Deleted
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-neutral-100 bg-neutral-50/50 text-neutral-400 uppercase tracking-wider font-medium text-[11px]">
              <tr>
                <th
                  className="px-5 py-3.5 w-20 cursor-pointer hover:text-neutral-900 transition-colors"
                  onClick={() => toggleSort("songNo")}
                >
                  #{getSortIndicator("songNo")}
                </th>
                <th
                  className="px-5 py-3.5 cursor-pointer hover:text-neutral-900 transition-colors"
                  onClick={() => toggleSort("title")}
                >
                  Title{getSortIndicator("title")}
                </th>
                <th className="px-5 py-3.5">Language</th>
                <th className="px-5 py-3.5">Category</th>
                <th className="px-5 py-3.5 text-center">Published</th>
                <th
                  className="px-5 py-3.5 cursor-pointer hover:text-neutral-900 transition-colors"
                  onClick={() => toggleSort("createdAt")}
                >
                  Created{getSortIndicator("createdAt")}
                </th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <Loader2 className="mx-auto h-6 w-6 animate-spin text-neutral-400" />
                    <p className="mt-2 text-xs text-neutral-400">Loading songs...</p>
                  </td>
                </tr>
              ) : songs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <Music className="mx-auto h-8 w-8 text-neutral-200 mb-3" />
                    <p className="text-neutral-400 text-sm">No songs found.</p>
                  </td>
                </tr>
              ) : (
                songs.map((song, i) => (
                  <motion.tr
                    key={song._id}
                    initial="hidden"
                    animate="visible"
                    custom={i}
                    variants={fadeInUp}
                    className={`group hover:bg-neutral-50/80 transition-colors ${
                      song.status === "deleted" ? "opacity-60" : ""
                    }`}
                  >
                    <td className="px-5 py-3.5">
                      <span className="font-mono text-neutral-400 font-bold text-xs tracking-wider">
                        {song.songNo
                          ? `#${song.songNo.toString().padStart(3, "0")}`
                          : "—"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-400 group-hover:bg-neutral-900 group-hover:text-white transition-all shrink-0">
                          <Music className="h-3.5 w-3.5" />
                        </div>
                        <div className="min-w-0">
                          <span className="font-semibold text-neutral-900 block truncate max-w-[250px]">
                            {song.title}
                          </span>
                          {song.author && (
                            <span className="text-[11px] text-neutral-400">
                              by {song.author}
                            </span>
                          )}
                        </div>
                        {song.status === "deleted" && (
                          <Badge
                            variant="outline"
                            className="text-red-500 border-red-200 text-[10px] px-2 py-0 shrink-0"
                          >
                            Deleted
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge
                        variant="outline"
                        className="font-normal border-neutral-200 text-neutral-600 text-[11px]"
                      >
                        {song.language}
                      </Badge>
                    </td>
                    <td className="px-5 py-3.5 text-neutral-600 text-xs">
                      {song.category}
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      {song.isPublished ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 mx-auto" />
                      ) : (
                        <XCircle className="h-4 w-4 text-neutral-300 mx-auto" />
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-neutral-400 text-xs">
                      {new Date(song.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-full"
                            >
                              <MoreVertical className="h-4 w-4 text-neutral-400" />
                            </Button>
                          }
                        />
                        <DropdownMenuContent
                          align="end"
                          className="w-44 rounded-xl shadow-xl border-neutral-200"
                        >
                          {song.status !== "deleted" && (
                            <>
                              <DropdownMenuItem
                                render={
                                  <Link
                                    href={`/admin/songs/${song._id}`}
                                    className="cursor-pointer gap-2 text-sm"
                                  >
                                    <Edit2 className="h-4 w-4" /> Edit
                                  </Link>
                                }
                              />
                              <DropdownMenuItem
                                render={
                                  <Link
                                    href={`/resources/songs/${song.slug}`}
                                    target="_blank"
                                    className="cursor-pointer gap-2 text-sm"
                                  >
                                    <Eye className="h-4 w-4" /> Preview
                                  </Link>
                                }
                              />
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleTogglePublish(song._id)}
                                className="cursor-pointer gap-2"
                              >
                                {song.isPublished ? (
                                  <>
                                    <XCircle className="h-4 w-4" /> Unpublish
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle2 className="h-4 w-4" /> Publish
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() =>
                                  handleDelete(song._id, song.title)
                                }
                                className="cursor-pointer gap-2 text-red-600 focus:text-red-600"
                              >
                                <Trash2 className="h-4 w-4" /> Delete
                              </DropdownMenuItem>
                            </>
                          )}
                          {song.status === "deleted" && (
                            <DropdownMenuItem
                              onClick={() => handleRestore(song._id)}
                              className="cursor-pointer gap-2 text-emerald-600 focus:text-emerald-600"
                            >
                              <RotateCcw className="h-4 w-4" /> Restore
                            </DropdownMenuItem>
                          )}
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
        <div className="flex items-center justify-between px-2">
          <p className="text-xs text-neutral-400">
            Page {page} of {totalPages} ({total} songs)
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="rounded-lg h-9 w-9 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-lg h-9 w-9 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
