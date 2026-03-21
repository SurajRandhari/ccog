"use client";

import {
  Music,
  ArrowLeft,
  Bookmark,
  Share2,
  Languages,
  Tag,
  ChevronLeft,
  ChevronRight,
  User,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";

import { SongViewer } from "@/components/songs/SongViewer";

interface NavSong {
  slug: string;
  title: string;
  songNo: number | null;
}

interface SongDetailClientProps {
  song: {
    title: string;
    songNo: number | null;
    category: string;
    language: string;
    lyrics: string;
    author?: string;
  };
  prevSong?: NavSong | null;
  nextSong?: NavSong | null;
}

export default function SongDetailClient({
  song,
  prevSong,
  nextSong,
}: SongDetailClientProps) {
  return (
    <div className="bg-[#fafafa] min-h-screen pb-32 selection:bg-neutral-900 selection:text-white">
      {/* Navigation Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-neutral-100 bg-white/70 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-6 h-20 flex items-center justify-between">
          <Link
            href="/resources/songs"
            className="group flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-neutral-400 hover:text-neutral-900 transition-all"
          >
            <div className="h-8 w-8 rounded-full border border-neutral-100 flex items-center justify-center group-hover:border-neutral-900 group-hover:bg-neutral-900 group-hover:text-white transition-all">
              <ArrowLeft className="h-4 w-4" />
            </div>
            Back to Library
          </Link>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-xl hover:bg-neutral-50 transition-colors"
            >
              <Bookmark className="h-5 w-5 text-neutral-400" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-xl hover:bg-neutral-50 transition-colors"
            >
              <Share2 className="h-5 w-5 text-neutral-400" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Song Content using modular component */}
      <SongViewer 
        song={song}
        prevSong={prevSong}
        nextSong={nextSong}
      />

      {/* Footer Navigation */}
      <section className="mt-40 border-t border-neutral-100 pt-32 pb-40">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h3 className="font-serif text-4xl font-light text-neutral-900 mb-6 italic">
            Continue the journey
          </h3>
          <p className="text-xl text-neutral-500 mb-12 font-light">
            Explore more hymns and spiritual melodies from our collection.
          </p>
          <Link href="/resources/songs">
            <Button
              size="lg"
              className="h-16 px-12 rounded-2xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold tracking-widest uppercase text-xs shadow-xl shadow-neutral-900/20"
            >
              Browse All Songs
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
