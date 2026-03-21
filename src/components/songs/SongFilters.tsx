"use client";

import { Globe } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface SongFiltersProps {
  activeLang: string;
  setActiveLang: (lang: string) => void;
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  sortOption: string;
  setSortOption: (opt: string) => void;
  limit: number;
  setLimit: (limit: number) => void;
  languages: string[];
  categories: string[];
  sortOptions: { label: string; value: string } [];
  counts: Record<string, number>;
  children?: React.ReactNode;
}

export function SongFilters({
  activeLang,
  setActiveLang,
  activeCategory,
  setActiveCategory,
  sortOption,
  setSortOption,
  limit,
  setLimit,
  languages,
  categories,
  sortOptions,
  counts,
  children
}: SongFiltersProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row gap-6 items-center border-b border-white/10 pb-6 relative">
        {/* Language Selection */}
        <div className="flex items-center gap-3 w-full lg:w-fit shrink-0">
          <div className="h-10 w-10 rounded-xl bg-neutral-900/5 flex items-center justify-center text-neutral-400">
            <Globe className="h-5 w-5" />
          </div>
          <Select value={activeLang} onValueChange={(val) => setActiveLang(val || "Hindi")}>
            <SelectTrigger className="w-full lg:w-[150px] h-12 rounded-xl border-neutral-200 bg-white/40 font-bold uppercase tracking-widest text-[10px] text-neutral-700">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-neutral-100">
              {languages.map((lang) => (
                <SelectItem key={lang} value={lang} className="uppercase text-[10px] font-bold tracking-widest">
                  {lang}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Integrated Search Input (Middle) */}
        {children}

        {/* Sort Dropdown */}
        <div className="flex items-center gap-3 w-full lg:w-fit shrink-0">
          <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 whitespace-nowrap">Sort:</span>
          <Select value={sortOption} onValueChange={(val) => setSortOption(val || "songNo-asc")}>
            <SelectTrigger className="w-full lg:w-[150px] h-12 rounded-xl border-neutral-200 bg-white/40 font-bold uppercase tracking-widest text-[10px] text-neutral-700">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-neutral-100">
              {sortOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value} className="uppercase text-[10px] font-bold tracking-widest">
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Category Tabs & Limit */}
      <div className="flex flex-wrap gap-4 items-center justify-between overflow-x-auto w-full pb-2 no-scrollbar">
        <div className="flex gap-2 items-center">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "group flex items-center gap-3 px-6 py-3 rounded-2xl text-[10px] uppercase font-bold tracking-widest transition-all border shrink-0",
                activeCategory === cat
                  ? "bg-neutral-900 text-white border-neutral-900 shadow-lg"
                  : "bg-neutral-900/5 text-neutral-500 border-neutral-200 hover:border-neutral-300 hover:text-neutral-700 backdrop-blur-md"
              )}
            >
              {cat}
              <span
                className={cn(
                  "px-2 py-0.5 rounded-md text-[9px] font-bold",
                  activeCategory === cat
                    ? "bg-white/10 text-white/50"
                    : "bg-neutral-900/5 text-neutral-400"
                )}
              >
                {counts[cat] || 0}
              </span>
            </button>
          ))}
        </div>

        {/* Page Limit Selection */}
        <div className="flex items-center gap-2 pr-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 whitespace-nowrap">Show:</span>
          <Select value={limit.toString()} onValueChange={(val) => setLimit(parseInt(val || "20"))}>
            <SelectTrigger className="h-9 w-[80px] rounded-xl border-neutral-200 bg-neutral-900/5 font-bold uppercase tracking-widest text-[10px] text-neutral-600">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-neutral-100">
              <SelectItem value="20" className="uppercase text-[10px] font-bold tracking-widest">20</SelectItem>
              <SelectItem value="50" className="uppercase text-[10px] font-bold tracking-widest">50</SelectItem>
              <SelectItem value="100" className="uppercase text-[10px] font-bold tracking-widest">100</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
