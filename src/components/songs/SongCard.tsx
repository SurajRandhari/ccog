"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Music, Tag, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Song {
  _id: string;
  title: string;
  slug: string;
  songNo: number | null;
  language: string;
  category: string;
}

interface SongCardProps {
  song: Song;
  index: number;
}

export function SongCard({ song, index }: SongCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{
        duration: 0.5,
        delay: index * 0.03,
        ease: [0.23, 1, 0.32, 1],
      }}
    >
      <Link
        href={`/resources/songs/${song.slug || song._id}`}
        className="group flex flex-col gap-6 p-8 rounded-[3rem] bg-white hover:bg-neutral-950 transition-all duration-500 border border-neutral-100 hover:border-neutral-900 shadow-sm hover:shadow-2xl hover:shadow-neutral-900/20 relative overflow-hidden h-full z-10"
      >
        <div className="flex justify-between items-start relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-neutral-50 group-hover:bg-white/10 flex items-center justify-center font-mono text-lg font-bold text-neutral-300 group-hover:text-blue-300 transition-colors border border-neutral-100 group-hover:border-white/10">
            {song.songNo?.toString().padStart(3, "0") || "---"}
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
  );
}
