"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Music, ChevronRight, Zap } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/use-debounce";

interface Song {
  _id: string;
  title: string;
  slug: string;
  songNumber: number;
  language: string;
  category: string;
}

const LANGUAGES = ["Hindi", "English", "Odia"];
const CATEGORIES = [
  "All Library",
  "Worship",
  "Praise",
  "Christmas",
  "Lent",
  "Hymn",
  "Special Songs",
  "Live"
];

export default function SongsPage() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeLang, setActiveLang] = useState("Hindi");
  const [activeCategory, setActiveCategory] = useState("All Library");
  const debouncedSearch = useDebounce(search, 300);

  // Reset category when language changes
  useEffect(() => {
    setActiveCategory("All Library");
  }, [activeLang]);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/songs?search=${debouncedSearch}&lang=${activeLang}&category=${activeCategory}`);
        const data = await res.json();
        if (data.success) {
          setSongs(data.data);
          setCounts(data.counts || {});
        }
      } catch (error) {
        console.error("Failed to fetch songs");
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();
  }, [debouncedSearch, activeLang, activeCategory]);

  return (
    <div className="min-h-screen bg-[#fafafa] selection:bg-neutral-900 selection:text-white">
      {/* Header Section */}
      <section className="relative pt-32 pb-4 px-6 bg-white border-b border-neutral-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-16">
            <div className="space-y-4">
              <Badge variant="outline" className="rounded-full px-4 py-1 text-[10px] uppercase font-bold tracking-[0.2em] border-neutral-200 text-neutral-400">
                Resource Center
              </Badge>
              <h1 className="text-5xl md:text-7xl font-semibold tracking-tight leading-tight text-neutral-900">
                The <span className="font-serif italic font-light">Hymnal</span>
              </h1>
              <p className="text-xl text-neutral-500 max-w-lg font-light leading-relaxed">
                A unified library of spiritual songs in Hindi, English, and Odia.
              </p>
            </div>

            <div className="relative w-full md:w-[400px]">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
              <Input 
                placeholder="Search collection..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-16 pl-14 rounded-[2rem] border-neutral-100 bg-neutral-50 focus:bg-white transition-all shadow-sm focus:ring-0 text-lg font-light"
              />
            </div>
          </div>

          <div className="space-y-8">
            {/* 1st Level: Language Tabs */}
            <div className="flex items-center gap-1 p-1 bg-neutral-100 rounded-2xl w-fit">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang}
                  onClick={() => setActiveLang(lang)}
                  className={cn(
                    "relative px-10 py-3.5 rounded-xl text-sm font-bold tracking-wide transition-all duration-300",
                    activeLang === lang 
                      ? "text-neutral-900" 
                      : "text-neutral-500 hover:text-neutral-700"
                  )}
                >
                  {activeLang === lang && (
                    <motion.div
                      layoutId="activeLang"
                      className="absolute inset-0 bg-white shadow-sm rounded-xl"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10">{lang}</span>
                </button>
              ))}
            </div>

            {/* 2nd Level: Category Filter (Scrollable) */}
            <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
                {CATEGORIES.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={cn(
                            "group flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold tracking-wider transition-all border shrink-0",
                            activeCategory === cat 
                                ? "bg-neutral-900 text-white border-neutral-900 shadow-xl shadow-neutral-200" 
                                : "bg-white text-neutral-400 border-neutral-100 hover:border-neutral-300 hover:text-neutral-600"
                        )}
                    >
                        {cat === "Live" && <Zap className={cn("h-3 w-3", activeCategory === "Live" ? "text-amber-400" : "text-amber-500 group-hover:text-amber-600")} />}
                        {cat}
                        <span className={cn(
                            "px-1.5 py-0.5 rounded-md text-[9px] font-bold",
                            activeCategory === cat ? "bg-white/10 text-white/50" : "bg-neutral-50 text-neutral-300"
                        )}>
                            {counts[cat] || 0}
                        </span>
                    </button>
                ))}
            </div>
          </div>
        </div>
      </section>

      {/* Songs List */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-24 rounded-[2rem] bg-neutral-100 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      href={`/resources/songs/${song.slug}`}
                      className="group flex items-center gap-6 p-6 rounded-[2rem] bg-white hover:shadow-2xl hover:shadow-neutral-200/50 transition-all border border-neutral-100/50 hover:border-neutral-200 hover:-translate-y-0.5"
                    >
                      <div className="w-16 h-16 rounded-2xl bg-neutral-50 flex items-center justify-center font-mono text-xl font-bold text-neutral-200 group-hover:text-neutral-900 transition-colors border border-neutral-100/50">
                        {song.songNumber?.toString().padStart(3, "0")}
                      </div>
                      <div className="flex flex-col gap-1">
                        <h3 className="text-xl font-medium tracking-tight text-neutral-800">
                            {song.title}
                        </h3>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-neutral-300 uppercase tracking-widest">{song.category}</span>
                            <span className="w-1 h-1 rounded-full bg-neutral-100" />
                            <span className="text-[10px] font-bold text-neutral-300 uppercase tracking-widest">{song.language}</span>
                        </div>
                      </div>
                      <ChevronRight className="ml-auto h-5 w-5 text-neutral-200 group-hover:text-neutral-900 group-hover:translate-x-1 transition-all" />
                    </Link>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-40 text-center">
                  <div className="w-24 h-24 rounded-[2.5rem] bg-neutral-50 flex items-center justify-center mb-8">
                    <Music className="h-10 w-10 text-neutral-200" />
                  </div>
                  <h2 className="text-3xl font-semibold text-neutral-900 mb-2">No Songs Found</h2>
                  <p className="text-lg text-neutral-500 font-light max-w-sm">
                    We couldn't find any songs matching <span className="font-semibold text-neutral-900">{activeCategory}</span> in <span className="font-semibold text-neutral-900">{activeLang}</span>.
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
