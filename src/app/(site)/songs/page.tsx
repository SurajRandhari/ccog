"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Music, ArrowUpDown, ChevronRight, Hash } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/use-debounce"; // I'll check if this exists or create it

interface Song {
  _id: string;
  title: string;
  slug: string;
  songNumber: number;
  language: string;
}

const LANGUAGES = ["Hindi", "English", "Odia"];

export default function SongsPage() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("Hindi");
  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/songs?search=${debouncedSearch}&lang=${activeTab}`);
        const data = await res.json();
        if (data.success) {
          setSongs(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch songs");
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();
  }, [debouncedSearch, activeTab]);

  return (
    <div className="min-h-screen bg-[#fafafa] selection:bg-neutral-900 selection:text-white">
      {/* Header Section */}
      <section className="relative pt-32 pb-6 px-6 border-b border-neutral-100 bg-white">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
            <Badge variant="outline" className="rounded-full px-4 py-1 text-[10px] uppercase font-bold tracking-[0.2em] border-neutral-200 text-neutral-400">
              Song Library
            </Badge>
            <h1 className="text-5xl md:text-6xl font-semibold tracking-tight leading-tight text-neutral-900">
              Spiritual <span className="font-serif italic font-light">Songs</span>
            </h1>
            <p className="text-lg text-neutral-500 max-w-lg font-light leading-relaxed">
              Find hymns and worship songs in your preferred language.
            </p>
          </div>

          <div className="relative w-full md:w-[350px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <Input 
              placeholder="Search by number or title..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-14 pl-12 rounded-2xl border-neutral-100 bg-neutral-50 focus:bg-white transition-all shadow-sm focus:ring-0 text-neutral-600"
            />
          </div>
        </div>

        {/* Language Tabs */}
        <div className="max-w-5xl mx-auto mt-16 overflow-x-auto scrollbar-hide pb-2">
          <div className="flex items-center gap-1 p-1 bg-neutral-100 rounded-2xl w-fit">
            {LANGUAGES.map((lang) => (
              <button
                key={lang}
                onClick={() => setActiveTab(lang)}
                className={cn(
                  "relative px-8 py-3 rounded-xl text-sm font-medium transition-all duration-300",
                  activeTab === lang 
                    ? "text-neutral-900 shadow-sm" 
                    : "text-neutral-500 hover:text-neutral-700"
                )}
              >
                {activeTab === lang && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-white shadow-sm rounded-xl"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">{lang}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Songs List */}
      <main className="max-w-5xl mx-auto px-6 py-12">
        {loading ? (
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-20 rounded-2xl bg-neutral-100 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-1">
            <AnimatePresence mode="popLayout">
              {songs.length > 0 ? (
                songs.map((song, i) => (
                  <motion.div
                    key={song._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.4, delay: i * 0.02, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Link 
                      href={`/songs/${song.slug}`}
                      className="group flex items-center gap-6 p-6 rounded-2xl hover:bg-white hover:shadow-xl hover:shadow-neutral-200/50 transition-all border border-transparent hover:border-neutral-100"
                    >
                      <span className="text-xl font-mono font-bold text-neutral-200 group-hover:text-neutral-900 transition-colors w-14">
                        {song.songNumber?.toString().padStart(3, "0")}
                      </span>
                      <div className="h-6 w-px bg-neutral-100 group-hover:bg-neutral-200 transition-colors shadow-none" />
                      <h3 className="text-xl font-medium tracking-tight text-neutral-800 group-hover:translate-x-1 transition-transform">
                        {song.title}
                      </h3>
                      <ChevronRight className="ml-auto h-5 w-5 text-neutral-200 group-hover:text-neutral-900 group-hover:translate-x-1 transition-all" />
                    </Link>
                  </motion.div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-32 text-center">
                  <div className="w-20 h-20 rounded-full bg-neutral-50 flex items-center justify-center mb-6">
                    <Music className="h-8 w-8 text-neutral-200" />
                  </div>
                  <h2 className="text-2xl font-semibold text-neutral-900 mb-2">No Hymns Found</h2>
                  <p className="text-neutral-500 font-light max-w-xs">
                    We couldn't find any songs matching your criteria in {activeTab}.
                  </p>
                </div>
              )}
            </AnimatePresence>
          </div>
        )}
      </main>
    </div>
  );
}
