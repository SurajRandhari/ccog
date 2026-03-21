"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Music,
  ChevronRight,
  ChevronLeft,
  Tag,
  ArrowUpDown,
  SortAsc,
  SortDesc,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/use-debounce";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Globe } from "lucide-react";

interface Song {
  _id: string;
  title: string;
  slug: string;
  songNo: number | null;
  language: string;
  category: string;
}

interface Suggestion {
  title: string;
  slug: string;
  songNo: number | null;
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
];

const SORT_OPTIONS = [
  { label: "Song No ↑", value: "songNo-asc" },
  { label: "Song No ↓", value: "songNo-desc" },
  { label: "A → Z", value: "title-asc" },
  { label: "Z → A", value: "title-desc" },
];

export default function SongsPage() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeLang, setActiveLang] = useState("Hindi");
  const [activeCategory, setActiveCategory] = useState("All Library");
  const [sortOption, setSortOption] = useState("songNo-asc");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Suggestions
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const debouncedSearch = useDebounce(search, 300);
  const debouncedSuggestionSearch = useDebounce(search, 300);

  const LIMIT = 20;

  // Reset category & page when language changes
  useEffect(() => {
    setActiveCategory("All Library");
    setPage(1);
  }, [activeLang]);

  // Reset page on filter/search changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, activeCategory, sortOption]);

  // Fetch songs
  useEffect(() => {
    const fetchSongs = async () => {
      try {
        setLoading(true);
        const [sortField, sortOrder] = sortOption.split("-");
        const params = new URLSearchParams({
          search: debouncedSearch,
          lang: activeLang,
          category: activeCategory,
          sort: sortField,
          order: sortOrder,
          page: page.toString(),
          limit: LIMIT.toString(),
        });

        const res = await fetch(`/api/songs?${params.toString()}`);
        const data = await res.json();
        if (data.success) {
          setSongs(data.data);
          setCounts(data.counts || {});
          if (data.pagination) {
            setTotalPages(data.pagination.pages);
            setTotal(data.pagination.total);
          }
        }
      } catch (error) {
        console.error("Failed to fetch songs");
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();
  }, [debouncedSearch, activeLang, activeCategory, sortOption, page]);

  // Fetch suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!debouncedSuggestionSearch || debouncedSuggestionSearch.length < 2) {
        setSuggestions([]);
        return;
      }
      try {
        const res = await fetch(
          `/api/songs/suggestions?q=${encodeURIComponent(debouncedSuggestionSearch)}`
        );
        const data = await res.json();
        if (data.success) {
          setSuggestions(data.data);
        }
      } catch {
        // Silently fail
      }
    };
    fetchSuggestions();
  }, [debouncedSuggestionSearch]);

  // Close suggestions on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="min-h-screen bg-[#fafafa] selection:bg-neutral-900 selection:text-white">
      {/* Hero Banner Section */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
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
            <Badge
              variant="outline"
              className="rounded-full px-6 py-2 text-[10px] uppercase font-bold tracking-[0.3em] border-white/20 text-white/60 backdrop-blur-md bg-white/5"
            >
              Sacred Collection
            </Badge>
            <h1 className="text-6xl md:text-8xl font-serif font-light tracking-tight leading-tight text-white">
              The <span className="italic font-normal text-blue-200">Hymnal</span>
            </h1>
            <p className="text-xl text-white/60 max-w-2xl mx-auto font-light leading-relaxed">
              A curated digital archive of spiritual melodies and sacred lyrics,
              preserved for the community.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter & Content Section */}
      <section className="relative z-20 -mt-20 pb-32">
        <div className="max-w-7xl mx-auto px-6">
          {/* Controls Bar */}
          <div className="bg-white rounded-[2.5rem] p-6 shadow-xl shadow-neutral-200/50 border border-neutral-100 mb-10 space-y-6">
            <div className="flex flex-col lg:flex-row gap-6 items-center border-b border-neutral-50 pb-6">
              {/* Language Selection Dropdown */}
              <div className="flex items-center gap-3 w-full lg:w-fit shrink-0">
                <div className="h-10 w-10 rounded-xl bg-neutral-50 flex items-center justify-center text-neutral-400">
                  <Globe className="h-5 w-5" />
                </div>
                <Select value={activeLang} onValueChange={(val) => setActiveLang(val || "Hindi")}>
                  <SelectTrigger className="w-full lg:w-[150px] h-12 rounded-xl border-neutral-100 bg-neutral-50/50 font-bold uppercase tracking-widest text-[10px]">
                    <SelectValue placeholder="Language" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-neutral-100">
                    {LANGUAGES.map((lang) => (
                      <SelectItem key={lang} value={lang} className="uppercase text-[10px] font-bold tracking-widest">
                        {lang}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Integrated Search Input (Middle) */}
              <div className="relative flex-1 w-full lg:max-w-2xl mx-auto" ref={searchRef}>
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-300 pointer-events-none" />
                <Input
                  placeholder="Find songs by title, lyrics, or song number..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  className="h-12 pl-11 pr-4 rounded-xl border-neutral-100 bg-neutral-50/50 focus:bg-white text-sm transition-all focus:ring-1 focus:ring-neutral-200"
                />

                {/* Suggestion Dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-neutral-100 overflow-hidden z-50 max-h-[300px] overflow-y-auto">
                    {suggestions.map((s, i) => (
                      <Link
                        key={i}
                        href={`/resources/songs/${s.slug}`}
                        className="flex items-center gap-4 px-6 py-4 hover:bg-neutral-50 transition-colors"
                        onClick={() => setShowSuggestions(false)}
                      >
                        <div className="h-8 w-8 rounded-lg bg-neutral-100 flex items-center justify-center text-[10px] font-mono font-bold text-neutral-400 shrink-0">
                          {s.songNo
                            ? s.songNo.toString().padStart(3, "0")
                            : "—"}
                        </div>
                        <span className="text-sm font-medium text-neutral-900 truncate">
                          {s.title}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-3 w-full lg:w-fit shrink-0">
                <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 whitespace-nowrap">Sort:</span>
                <Select value={sortOption} onValueChange={(val) => setSortOption(val || "songNo-asc")}>
                  <SelectTrigger className="w-full lg:w-[150px] h-12 rounded-xl border-neutral-100 bg-neutral-50/50 font-bold uppercase tracking-widest text-[10px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-neutral-100">
                    {SORT_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value} className="uppercase text-[10px] font-bold tracking-widest">
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Category Tabs */}
            <div className="flex gap-2 items-center overflow-x-auto w-full pb-2 no-scrollbar">
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
                  {cat}
                  <span
                    className={cn(
                      "px-2 py-0.5 rounded-md text-[9px] font-bold",
                      activeCategory === cat
                        ? "bg-white/10 text-white/50"
                        : "bg-neutral-50 text-neutral-300"
                    )}
                  >
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
                <div
                  key={i}
                  className="h-44 rounded-[3rem] bg-white animate-pulse border border-neutral-100"
                />
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
                      transition={{
                        duration: 0.5,
                        delay: i * 0.03,
                        ease: [0.23, 1, 0.32, 1],
                      }}
                    >
                      <Link
                        href={`/resources/songs/${song.slug}`}
                        className="group flex flex-col gap-6 p-8 rounded-[3rem] bg-white hover:bg-neutral-950 transition-all duration-500 border border-neutral-100 hover:border-neutral-900 shadow-sm hover:shadow-2xl hover:shadow-neutral-900/20 relative overflow-hidden h-full"
                      >
                        <div className="flex justify-between items-start relative z-10">
                          <div className="w-14 h-14 rounded-2xl bg-neutral-50 group-hover:bg-white/10 flex items-center justify-center font-mono text-lg font-bold text-neutral-300 group-hover:text-blue-300 transition-colors border border-neutral-100 group-hover:border-white/10">
                            {song.songNo
                              ?.toString()
                              .padStart(3, "0") || "---"}
                          </div>
                          <Badge
                            variant="outline"
                            className="rounded-full px-3 py-1 text-[9px] uppercase font-bold tracking-widest border-neutral-100 group-hover:border-white/10 text-neutral-400 group-hover:text-white/40"
                          >
                            {song.language}
                          </Badge>
                        </div>

                        <div className="space-y-3 relative z-10">
                          <h3 className="text-2xl font-serif font-light tracking-tight text-neutral-900 group-hover:text-white transition-colors leading-snug">
                            {song.title}
                          </h3>
                          <div className="flex items-center gap-2">
                            <Tag className="h-3 w-3 text-neutral-300 group-hover:text-white/20" />
                            <span className="text-[10px] font-bold text-neutral-400 group-hover:text-white/40 uppercase tracking-[0.2em]">
                              {song.category}
                            </span>
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
                    <h2 className="text-4xl font-serif font-light text-neutral-900 mb-4 italic">
                      No Songs Found
                    </h2>
                    <p className="text-lg text-neutral-500 font-light max-w-sm leading-relaxed">
                      We couldn&apos;t find any songs matching your search in this
                      collection.
                    </p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-16">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="rounded-xl h-11 px-5 gap-2 border-neutral-200"
              >
                <ChevronLeft className="h-4 w-4" /> Previous
              </Button>
              <span className="text-sm font-medium text-neutral-500">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-xl h-11 px-5 gap-2 border-neutral-200"
              >
                Next <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
