"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { useDebounce } from "@/hooks/use-debounce";

// Modular Components
import { SongFilters } from "@/components/songs/SongFilters";
import { SongSearchBar } from "@/components/songs/SongSearchBar";
import { SongList } from "@/components/songs/SongList";
import { SongPagination } from "@/components/songs/SongPagination";

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
  const [limit, setLimit] = useState(20);

  // Suggestions
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const debouncedSearch = useDebounce(search, 300);
  const debouncedSuggestionSearch = useDebounce(search, 300);

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
          limit: limit.toString(),
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
  }, [debouncedSearch, activeLang, activeCategory, sortOption, page, limit]);

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
          {/* Controls Bar (Glassmorphism) using modular components */}
          <div className="backdrop-blur-xl bg-white/40 rounded-[2.5rem] p-6 shadow-xl border border-white/20 mb-10">
            <SongFilters
              activeLang={activeLang}
              setActiveLang={setActiveLang}
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              sortOption={sortOption}
              setSortOption={setSortOption}
              limit={limit}
              setLimit={setLimit}
              languages={LANGUAGES}
              categories={CATEGORIES}
              sortOptions={SORT_OPTIONS}
              counts={counts}
            >
              <SongSearchBar
                search={search}
                onSearchChange={setSearch}
                suggestions={suggestions}
                showSuggestions={showSuggestions}
                setShowSuggestions={setShowSuggestions}
                searchRef={searchRef}
              />
            </SongFilters>
          </div>

          {/* Songs Display using modular component */}
          <SongList songs={songs} loading={loading} />

          {/* Pagination using modular component */}
          <SongPagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      </section>
    </div>
  );
}
