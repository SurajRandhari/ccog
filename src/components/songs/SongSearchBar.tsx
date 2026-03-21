"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";

interface Suggestion {
  title: string;
  slug: string;
  songNo: number | null;
}

interface SongSearchBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  suggestions: Suggestion[];
  showSuggestions: boolean;
  setShowSuggestions: (show: boolean) => void;
  searchRef: React.RefObject<HTMLDivElement | null>;
}

export function SongSearchBar({
  search,
  onSearchChange,
  suggestions,
  showSuggestions,
  setShowSuggestions,
  searchRef
}: SongSearchBarProps) {
  return (
    <div className="relative flex-1 w-full lg:max-w-2xl mx-auto" ref={searchRef}>
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 pointer-events-none" />
      <Input
        placeholder="Find songs by title, lyrics, or song number..."
        value={search}
        onChange={(e) => {
          onSearchChange(e.target.value);
          setShowSuggestions(true);
        }}
        onFocus={() => setShowSuggestions(true)}
        className="h-12 pl-11 pr-4 rounded-xl border-neutral-200 bg-white/40 focus:bg-white text-sm transition-all focus:ring-1 focus:ring-neutral-200 backdrop-blur-sm placeholder:text-neutral-400 text-neutral-900"
      />

      {/* Suggestion Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-neutral-100 overflow-hidden z-50 max-h-[300px] overflow-y-auto">
          {suggestions.map((s, i) => (
            <Link
              key={i}
              href={`/resources/songs/${s.slug || (s as any)._id}`}
              className="flex items-center gap-4 px-6 py-4 hover:bg-neutral-50 transition-colors"
              onClick={() => setShowSuggestions(false)}
            >
              <div className="h-8 w-8 rounded-lg bg-neutral-100 flex items-center justify-center text-[10px] font-mono font-bold text-neutral-400 shrink-0">
                {s.songNo ? s.songNo.toString().padStart(3, "0") : "—"}
              </div>
              <span className="text-sm font-medium text-neutral-900 truncate">
                {s.title}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
