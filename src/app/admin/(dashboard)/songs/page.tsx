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
  Hash,
  Tag,
  FileText,
  ExternalLink,
  Zap
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
import { toast } from "sonner";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

export default function SongsAdminPage() {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchSongs = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/v1/admin/songs?page=${page}&search=${search}`);
      const data = await res.json();
      if (data.success) {
        setSongs(data.data.songs);
        setTotalPages(data.data.totalPages);
      }
    } catch (error) {
      toast.error("Failed to fetch songs");
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    const timer = setTimeout(() => {
        fetchSongs();
    }, 500);
    return () => clearTimeout(timer);
  }, [fetchSongs]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this song?")) return;
    try {
      const res = await fetch(`/api/v1/admin/songs/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        toast.success("Song deleted successfully");
        fetchSongs();
      } else {
        toast.error(data.error.message);
      }
    } catch (error) {
      toast.error("Failed to delete song");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-neutral-900">Song Book</h1>
          <p className="mt-1 text-neutral-500">Manage your digital hymnbook and song library.</p>
        </div>
        <Link href="/admin/songs/new">
          <Button className="rounded-xl gap-2 shadow-lg shadow-neutral-200">
            <Plus className="h-4 w-4" />
            Add Song
          </Button>
        </Link>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <Input 
            placeholder="Search by title, lyrics, or category..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-11 border-neutral-200 bg-white pl-10 focus-visible:ring-neutral-900"
          />
        </div>
        <Button variant="outline" className="h-11 gap-2 rounded-xl border-neutral-200 bg-white">
          <Filter className="h-4 w-4 text-neutral-400" />
          Sort & Filter
        </Button>
      </div>

      <div className="overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-neutral-100 bg-neutral-50/50 text-neutral-400 uppercase tracking-wider font-medium">
              <tr>
                <th className="px-6 py-4">Song Details</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Language</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-neutral-400">
                    Loading songs...
                  </td>
                </tr>
              ) : songs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-neutral-400">
                    No songs found.
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
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 flex-shrink-0 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-400 group-hover:bg-neutral-900 group-hover:text-white transition-colors">
                          <Music className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-semibold text-neutral-900 line-clamp-1">{song.title}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            {song.songNumber && (
                                <span className="flex items-center gap-1 text-[10px] text-neutral-400">
                                    <Hash className="h-2.5 w-2.5" />
                                    {song.songNumber}
                                </span>
                            )}
                            {song.author && (
                                <span className="flex items-center gap-1 text-[10px] text-neutral-400">
                                    <Tag className="h-2.5 w-2.5" />
                                    {song.author}
                                </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-neutral-600 font-medium">
                      {song.category}
                    </td>
                    <td className="px-6 py-4 text-neutral-500">
                      <div className="flex items-center gap-2">
                        <Languages className="h-3.5 w-3.5 text-neutral-300" />
                        {song.language}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-2">
                        <span className={`inline-flex items-center w-fit rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                          song.status === 'published' 
                          ? 'bg-emerald-50 text-emerald-700' 
                          : 'bg-neutral-100 text-neutral-500'
                        }`}>
                          {song.status}
                        </span>
                        {song.isLive && (
                          <span className="inline-flex items-center w-fit rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-100">
                            <Zap className="h-2.5 w-2.5 mr-1 fill-current" />
                            Live Set
                          </span>
                        )}
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
                        <DropdownMenuContent align="end" className="w-40 rounded-xl">
                          <DropdownMenuItem
                            render={<Link href={`/resources/songs/${song.slug}`} target="_blank" className="flex items-center gap-2" />}
                          >
                            <Eye className="h-4 w-4" /> View
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            render={<Link href={`/admin/songs/${song._id}`} className="flex items-center gap-2" />}
                          >
                            <Edit2 className="h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDelete(song._id)}
                            className="flex items-center gap-2 text-red-600 focus:text-red-600 cursor-pointer"
                          >
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
      
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
            {[...Array(totalPages)].map((_, i) => (
                <Button
                    key={i}
                    variant={page === i + 1 ? "default" : "outline"}
                    size="sm"
                    className="h-8 w-8 rounded-lg"
                    onClick={() => setPage(i + 1)}
                >
                    {i + 1}
                </Button>
            ))}
        </div>
      )}
    </div>
  );
}
