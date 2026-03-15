"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Music, FileText, ExternalLink, Search, Check, ChevronDown, Zap } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

const categories = ["Live", "all", "Worship", "Praise", "Christmas", "Lent", "Hymn", "Special"];
const languages = ["all", "Hindi", "English", "Odia", "Both"];

export default function SongsPage() {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Live");
  const [language, setLanguage] = useState("all");
  const [filteredSongs, setFilteredSongs] = useState([]);

  useEffect(() => {
    async function fetchSongs() {
      try {
        setLoading(true);
        const res = await fetch("/api/v1/songs");
        const data = await res.json();
        if (data.success) {
          setSongs(data.data);
          setFilteredSongs(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch songs");
      } finally {
        setLoading(false);
      }
    }
    fetchSongs();
  }, []);

  useEffect(() => {
    const term = search.toLowerCase();
    const result = songs.filter((song: any) => {
        const matchesSearch = !term || 
            song.title.toLowerCase().includes(term) || 
            (song.author && song.author.toLowerCase().includes(term)) ||
            (song.lyrics && song.lyrics.toLowerCase().includes(term));
        
        let matchesCategory = false;
        if (category === "Live") {
            matchesCategory = song.isLive === true;
        } else {
            matchesCategory = category === "all" || song.category === category;
        }

        const matchesLanguage = language === "all" || song.language === language;
        
        return matchesSearch && matchesCategory && matchesLanguage;
    });
    setFilteredSongs(result);
  }, [search, category, language, songs]);

  return (
    <div className="bg-white min-h-screen">
      {/* Header Section */}
      <section className="relative overflow-hidden pt-32 pb-20 lg:pt-48 lg:pb-32">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(0,0,0,0.03)_0%,transparent_50%)]" />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            custom={0}
            variants={fadeInUp}
            className="mx-auto max-w-3xl"
          >
            <span className="inline-flex items-center rounded-full bg-neutral-100 px-4 py-1.5 text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-8 border border-neutral-200/50">
              Multilingual Hymnbook
            </span>
            <h1 className="font-serif text-6xl font-semibold tracking-tight text-neutral-900 sm:text-8xl mb-8">
              Song Book
            </h1>
            <p className="text-xl leading-relaxed text-neutral-500 font-light max-w-2xl mx-auto">
              A curated collection of spiritual songs in Hindi, English, and Odia for worship and reflection.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="bg-neutral-50/30 border-t border-neutral-100 py-12 lg:py-20 min-h-[600px]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-col gap-12">
            
            {/* Search & Filters Controls */}
            <div className="space-y-10">
                {/* Glassmorphic Search Bar */}
                <div className="relative max-w-2xl mx-auto">
                    <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400 z-10" />
                    <Input
                        placeholder="Search by title, lyrics or composer..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="h-16 border-neutral-200/60 bg-white/70 backdrop-blur-xl pl-14 pr-6 rounded-3xl shadow-xl shadow-neutral-200/30 focus-visible:ring-neutral-900 transition-all text-lg font-light"
                    />
                </div>

                {/* Unified Filter Row */}
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between bg-white/50 backdrop-blur-sm p-4 rounded-[2.5rem] border border-neutral-100 shadow-sm">
                    {/* Categories Chips */}
                    <div className="flex flex-wrap gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setCategory(cat)}
                                className={cn(
                                    "flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-semibold tracking-wide transition-all border shrink-0",
                                    cat === "Live" && category !== "Live" && "border-amber-200 text-amber-700 bg-amber-50/50",
                                    category === cat 
                                        ? "bg-neutral-900 text-white border-neutral-900 shadow-lg shadow-neutral-200" 
                                        : "bg-white text-neutral-500 border-neutral-200 hover:border-neutral-400"
                                )}
                            >
                                {cat === "Live" && <Zap className={cn("h-3 w-3", category === "Live" ? "text-amber-400" : "text-amber-500")} />}
                                {cat === "all" ? "All Library" : cat === "Special" ? "Special Songs" : cat}
                            </button>
                        ))}
                    </div>

                    {/* Language Dropdown */}
                    <div className="shrink-0 w-full lg:w-48">
                        <Select value={language} onValueChange={(val: string | null) => {
                            if (val) setLanguage(val);
                        }}>
                            <SelectTrigger className="h-11 rounded-full border-neutral-200 bg-white px-6 text-xs font-semibold tracking-wide text-neutral-600 focus:ring-neutral-900">
                                <div className="flex items-center gap-2">
                                    <SelectValue placeholder="Language" />
                                </div>
                            </SelectTrigger>
                            <SelectContent className="rounded-2xl border-neutral-100 shadow-xl overflow-hidden p-1">
                                {languages.map((lang) => (
                                    <SelectItem 
                                        key={lang} 
                                        value={lang}
                                        className="rounded-xl text-xs font-medium py-2.5"
                                    >
                                        {lang === "all" ? "All Languages" : lang === "Both" ? "Bilingual" : lang}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            {/* Content Grid */}
            <div className="mt-4">
                {loading ? (
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {[1,2,3,4,5,6].map(i => (
                            <div key={i} className="h-64 rounded-[3rem] bg-white border border-neutral-100 animate-pulse" />
                        ))}
                    </div>
                ) : filteredSongs.length === 0 ? (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="py-32 text-center"
                    >
                        <div className="h-20 w-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6 text-neutral-300">
                            <Music className="h-10 w-10" />
                        </div>
                        <h3 className="text-xl font-medium text-neutral-900 mb-2 font-serif">
                            {category === "Live" ? "No songs in current set" : "No songs found"}
                        </h3>
                        <p className="text-neutral-500 font-light">
                            {category === "Live" 
                                ? "Songs for today's session haven't been selected yet." 
                                : "Try adjusting your filters or search term."}
                        </p>
                        <button 
                            onClick={() => {setSearch(""); setCategory("all"); setLanguage("all")}}
                            className="mt-8 text-sm font-semibold text-neutral-900 underline underline-offset-4"
                        >
                            Explore full library
                        </button>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        <AnimatePresence mode="popLayout">
                            {filteredSongs.map((song: any, i) => (
                                <motion.div
                                    key={song._id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Link
                                        href={`/resources/songs/${song.slug}`}
                                        className="group relative flex flex-col justify-between h-72 rounded-[3.5rem] border border-neutral-100 bg-white p-10 shadow-sm transition-all hover:shadow-2xl hover:shadow-neutral-200/50 hover:-translate-y-2 overflow-hidden"
                                    >
                                        {song.isLive && (
                                            <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10 px-3 py-1 bg-amber-100 text-amber-700 text-[8px] font-bold uppercase tracking-widest rounded-full border border-amber-200 shadow-sm shadow-amber-100 flex items-center gap-1 animate-pulse">
                                                <Zap className="h-2 w-2 fill-current" />
                                                Live Set
                                            </div>
                                        )}

                                        <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity pointer-events-none">
                                            <Music className="h-32 w-32" />
                                        </div>
                                        
                                        <div>
                                            <div className="flex items-start justify-between">
                                                <div className="h-14 w-14 flex items-center justify-center rounded-2xl bg-neutral-50 text-neutral-300 group-hover:bg-neutral-900 group-hover:text-white transition-all transform group-hover:rotate-12 duration-500">
                                                    <Music className="h-7 w-7" />
                                                </div>
                                                {song.songNumber && (
                                                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em] px-4 py-1.5 rounded-full bg-neutral-50 border border-neutral-100">
                                                        #{song.songNumber}
                                                    </span>
                                                )}
                                            </div>
                                            <h4 className="mt-8 text-2xl font-semibold text-neutral-900 group-hover:text-neutral-700 line-clamp-2 leading-tight font-serif tracking-tight">
                                                {song.title}
                                            </h4>
                                            <p className="mt-3 text-sm text-neutral-400 line-clamp-1 font-light italic">
                                                {song.author || "Calvary Hymnal"}
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between pt-8 border-t border-neutral-50/50">
                                            <div className="flex gap-2">
                                                <span className="px-3 py-1 rounded-full bg-neutral-100/50 text-[9px] font-bold text-neutral-500 uppercase tracking-wider">
                                                    {song.language === "Both" ? "Bilingual" : song.language}
                                                </span>
                                                <span className="px-3 py-1 rounded-full bg-neutral-900/5 text-[9px] font-bold text-neutral-700 uppercase tracking-wider">
                                                    {song.category}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-neutral-900 uppercase tracking-[0.1em] opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0">
                                                Read
                                                <ExternalLink className="h-3.5 w-3.5" />
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
