"use client";

import { AnimatePresence } from "framer-motion";
import { Music } from "lucide-react";
import { SongCard } from "./SongCard";

interface Song {
  _id: string;
  title: string;
  slug: string;
  songNo: number | null;
  language: string;
  category: string;
}

interface SongListProps {
  songs: Song[];
  loading: boolean;
}

export function SongList({ songs, loading }: SongListProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-44 rounded-[3rem] bg-white animate-pulse border border-neutral-100"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <AnimatePresence mode="popLayout">
        {songs.length > 0 ? (
          songs.map((song, i) => (
            <SongCard key={song._id} song={song} index={i} />
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
  );
}
