"use client";

import { motion } from "framer-motion";
import {
  Music,
  Edit2,
  Trash2,
  Eye,
  MoreVertical,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

interface SongTableProps {
  songs: Song[];
  loading: boolean;
  sort: string;
  order: string;
  onToggleSort: (field: string) => void;
  onDelete: (id: string, title: string) => void;
  onRestore: (id: string) => void;
  onTogglePublish: (id: string) => void;
}

const fadeInUp = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.03, duration: 0.35, ease: "easeOut" as const },
  }),
};

export function SongTable({
  songs,
  loading,
  sort,
  order,
  onToggleSort,
  onDelete,
  onRestore,
  onTogglePublish,
}: SongTableProps) {
  const getSortIndicator = (field: string) => {
    if (sort !== field) return "";
    return order === "asc" ? " ↑" : " ↓";
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-neutral-100 bg-neutral-50/50 text-neutral-400 uppercase tracking-wider font-medium text-[11px]">
            <tr>
              <th
                className="px-5 py-3.5 w-20 cursor-pointer hover:text-neutral-900 transition-colors"
                onClick={() => onToggleSort("songNo")}
              >
                #{getSortIndicator("songNo")}
              </th>
              <th
                className="px-5 py-3.5 cursor-pointer hover:text-neutral-900 transition-colors"
                onClick={() => onToggleSort("title")}
              >
                Title{getSortIndicator("title")}
              </th>
              <th className="px-5 py-3.5">Language</th>
              <th className="px-5 py-3.5">Category</th>
              <th className="px-5 py-3.5 text-center">Published</th>
              <th
                className="px-5 py-3.5 cursor-pointer hover:text-neutral-900 transition-colors"
                onClick={() => onToggleSort("createdAt")}
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
                              onClick={() => onTogglePublish(song._id)}
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
                              onClick={() => onDelete(song._id, song.title)}
                              className="cursor-pointer gap-2 text-red-600 focus:text-red-600"
                            >
                              <Trash2 className="h-4 w-4" /> Delete
                            </DropdownMenuItem>
                          </>
                        )}
                        {song.status === "deleted" && (
                          <DropdownMenuItem
                            onClick={() => onRestore(song._id)}
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
  );
}
