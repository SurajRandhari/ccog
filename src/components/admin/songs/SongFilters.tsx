"use client";

import { Search, Globe, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface SongFiltersProps {
  search: string;
  onSearchChange: (val: string) => void;
  langFilter: string;
  onLangChange: (val: string) => void;
  categoryFilter: string;
  onCategoryChange: (val: string) => void;
  publishedFilter: string;
  onPublishedChange: (val: string) => void;
  showDeleted: boolean;
  onShowDeletedChange: (val: boolean) => void;
  languages: string[];
  categories: string[];
}

export function SongFilters({
  search,
  onSearchChange,
  langFilter,
  onLangChange,
  categoryFilter,
  onCategoryChange,
  publishedFilter,
  onPublishedChange,
  showDeleted,
  onShowDeletedChange,
  languages,
  categories,
}: SongFiltersProps) {
  return (
    <div className="rounded-2xl border border-neutral-100 bg-white p-4 shadow-sm space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <Input
            placeholder="Search by title, lyrics, or song number..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-11 border-neutral-200 bg-neutral-50/50 pl-10 focus-visible:ring-neutral-900 rounded-xl"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Language Filter */}
          <Select value={langFilter} onValueChange={(val) => onLangChange(val || "All")}>
            <SelectTrigger className="h-10 w-[130px] rounded-xl border-neutral-200 bg-white text-xs font-medium">
              <Globe className="h-3 w-3 mr-1 text-neutral-400" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {languages.map((l) => (
                <SelectItem key={l} value={l}>
                  {l === "All" ? "All Languages" : l}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Category Filter */}
          <Select value={categoryFilter} onValueChange={(val) => onCategoryChange(val || "All")}>
            <SelectTrigger className="h-10 w-[140px] rounded-xl border-neutral-200 bg-white text-xs font-medium">
              <Filter className="h-3 w-3 mr-1 text-neutral-400" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {categories.map((c) => (
                <SelectItem key={c} value={c}>
                  {c === "All" ? "All Categories" : c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Published Filter */}
          <Select value={publishedFilter} onValueChange={(val) => onPublishedChange(val || "all")}>
            <SelectTrigger className="h-10 w-[130px] rounded-xl border-neutral-200 bg-white text-xs font-medium">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="true">Published</SelectItem>
              <SelectItem value="false">Unpublished</SelectItem>
            </SelectContent>
          </Select>

          {/* Show Deleted Toggle */}
          <div className="flex items-center gap-2 px-3 py-2 bg-neutral-50 rounded-xl border border-neutral-100">
            <Switch
              checked={showDeleted}
              onCheckedChange={onShowDeletedChange}
              className="scale-90"
            />
            <span className="text-xs font-medium text-neutral-500 whitespace-nowrap">
              Show Deleted
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
