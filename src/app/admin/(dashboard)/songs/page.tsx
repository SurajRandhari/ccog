"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";
import { useDebounce } from "@/hooks/use-debounce";

// Modular Components
import { SongFilters } from "@/components/admin/songs/SongFilters";
import { SongTable } from "@/components/admin/songs/SongTable";

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

      {/* Filters (Modular) */}
      <SongFilters 
        search={search}
        onSearchChange={setSearch}
        langFilter={langFilter}
        onLangChange={setLangFilter}
        categoryFilter={categoryFilter}
        onCategoryChange={setCategoryFilter}
        publishedFilter={publishedFilter}
        onPublishedChange={setPublishedFilter}
        showDeleted={showDeleted}
        onShowDeletedChange={setShowDeleted}
        languages={LANGUAGES}
        categories={CATEGORIES}
      />

      {/* Table (Modular) */}
      <SongTable 
        songs={songs}
        loading={loading}
        sort={sort}
        order={order}
        onToggleSort={toggleSort}
        onDelete={handleDelete}
        onRestore={handleRestore}
        onTogglePublish={handleTogglePublish}
      />

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
