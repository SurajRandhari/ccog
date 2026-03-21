"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Music, ChevronRight, Zap, Tag } from "lucide-react";
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
      {/* Hero Banner Section */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        {/* Background Image with Parallax & Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/site/songs-hero.png" 
            alt="Library Background" 
            className="w-full h-full object-cover scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/80 via-neutral-950/40 to-[#fafafa]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="space-y-6"
            >
                <Badge variant="outline" className="rounded-full px-6 py-2 text-[10px] uppercase font-bold tracking-[0.3em] border-white/20 text-white/60 backdrop-blur-md bg-white/5">
                    Sacred Collection
                </Badge>
                <h1 className="text-6xl md:text-8xl font-serif font-light tracking-tight leading-tight text-white">
                    The <span className="italic font-normal text-blue-200">Hymnal</span>
                </h1>
                <p className="text-xl text-white/60 max-w-2xl mx-auto font-light leading-relaxed">
                    A curated digital archive of spiritual melodies and sacred lyrics, preserved for the community.
                </p>
                
                {/* Glassmorphic Search Bar */}
                <div className="pt-12 max-w-2xl mx-auto">
                    <div className="relative group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-white/30 group-focus-within:text-blue-300 transition-colors" />
                        <Input 
                            placeholder="Find a song by title or lyrics..." 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="h-20 pl-16 pr-8 rounded-3xl border-white/10 bg-white/5 backdrop-blur-2xl text-white placeholder:text-white/20 focus:bg-white/10 transition-all shadow-2xl focus:ring-1 focus:ring-white/20 text-xl font-serif font-light"
                        />
                    </div>
                </div>
            </motion.div>
        </div>
      </section>

      {/* Filter & Content Section */}
      <section className="relative z-20 -mt-16 pb-32">
        <div className="max-w-7xl mx-auto px-6">
          {/* Controls Bar */}
          <div className="bg-white rounded-[2.5rem] p-4 shadow-xl shadow-neutral-200/50 border border-neutral-100 mb-16 flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* Language Selection */}
            <div className="flex items-center gap-1 p-1.5 bg-neutral-50 rounded-2xl w-full lg:w-fit">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang}
                  onClick={() => setActiveLang(lang)}
                  className={cn(
                    "relative px-8 py-3 rounded-xl text-xs font-bold tracking-widest transition-all duration-300 flex-1 lg:flex-none uppercase",
                    activeLang === lang 
                      ? "text-neutral-900" 
                      : "text-neutral-400 hover:text-neutral-600"
                  )}
                >
                  {activeLang === lang && (
                    <motion.div
                      layoutId="activeLang"
                      className="absolute inset-0 bg-white shadow-sm border border-neutral-100 rounded-xl"
                      transition={{ type: "spring", bounce: 0.1, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10">{lang}</span>
                </button>
              ))}
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 scrollbar-hide no-scrollbar">
                {CATEGORIES.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={cn(
                            "group flex items-center gap-3 px-6 py-3 rounded-2xl text-[10px] uppercase font-bold tracking-widest transition-all border shrink-0",
                            activeCategory === cat 
                                ? "bg-neutral-900 text-white border-neutral-900 shadow-lg" 
                                : "bg-white text-neutral-400 border-neutral-50 hover:border-neutral-200 hover:text-neutral-600"
                        )}
                    >
                        {cat === "Live" && <Zap className={cn("h-3 w-3", activeCategory === "Live" ? "text-amber-400" : "text-amber-500")} />}
                        {cat}
                        <span className={cn(
                            "px-2 py-0.5 rounded-md text-[9px] font-bold",
                            activeCategory === cat ? "bg-white/10 text-white/50" : "bg-neutral-50 text-neutral-300"
                        )}>
                            {counts[cat] || 0}
                        </span>
                    </button>
                ))}
            </div>
          </div>

          {/* Songs Display */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-44 rounded-[3rem] bg-white animate-pulse border border-neutral-100" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {songs.length > 0 ? (
                  songs.map((song, i) => (
                    <motion.div
                      key={song._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.5, delay: i * 0.03, ease: [0.23, 1, 0.32, 1] }}
                    >
                      <Link 
                        href={`/resources/songs/${song.slug}`}
                        className="group flex flex-col gap-6 p-8 rounded-[3rem] bg-white hover:bg-neutral-950 transition-all duration-500 border border-neutral-100 hover:border-neutral-900 shadow-sm hover:shadow-2xl hover:shadow-neutral-900/20 relative overflow-hidden h-full"
                      >
                        <div className="flex justify-between items-start relative z-10">
                            <div className="w-14 h-14 rounded-2xl bg-neutral-50 group-hover:bg-white/10 flex items-center justify-center font-mono text-lg font-bold text-neutral-300 group-hover:text-blue-300 transition-colors border border-neutral-100 group-hover:border-white/10">
                                {song.songNumber?.toString().padStart(3, "0") || '---'}
                            </div>
                            <Badge variant="outline" className="rounded-full px-3 py-1 text-[9px] uppercase font-bold tracking-widest border-neutral-100 group-hover:border-white/10 text-neutral-400 group-hover:text-white/40">
                                {song.language}
                            </Badge>
                        </div>
                        
                        <div className="space-y-3 relative z-10">
                            <h3 className="text-2xl font-serif font-light tracking-tight text-neutral-900 group-hover:text-white transition-colors leading-snug">
                                {song.title}
                            </h3>
                            <div className="flex items-center gap-2">
                                <Tag className="h-3 w-3 text-neutral-300 group-hover:text-white/20" />
                                <span className="text-[10px] font-bold text-neutral-400 group-hover:text-white/40 uppercase tracking-[0.2em]">{song.category}</span>
                            </div>
                        </div>

                        <div className="mt-4 pt-6 border-t border-neutral-50 group-hover:border-white/5 flex items-center justify-between relative z-10">
                            <span className="text-xs font-medium text-neutral-400 group-hover:text-white/30 flex items-center gap-2">
                                <Music className="h-3 w-3" /> View Lyrics
                            </span>
                            <ChevronRight className="h-5 w-5 text-neutral-200 group-hover:text-white group-hover:translate-x-1 transition-all" />
                        </div>

                        {/* Background Ornament */}
                        <Music className="absolute -bottom-8 -right-8 h-40 w-40 text-neutral-50 group-hover:text-white/5 pointer-events-none transition-colors" />
                      </Link>
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full flex flex-col items-center justify-center py-40 text-center">
                    <div className="w-24 h-24 rounded-[3rem] bg-white shadow-xl shadow-neutral-100 flex items-center justify-center mb-8 border border-neutral-50">
                      <Music className="h-10 w-10 text-neutral-200" />
                    </div>
                    <h2 className="text-4xl font-serif font-light text-neutral-900 mb-4 italic">No Songs Found</h2>
                    <p className="text-lg text-neutral-500 font-light max-w-sm leading-relaxed">
                        We couldn't find any sacred songs matching <span className="text-neutral-900 font-medium">"{activeCategory}"</span> in the current collection.
                    </p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
