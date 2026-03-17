"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Maximize, Minimize } from "lucide-react";
import { cn } from "@/lib/utils";

interface Song {
  title: string;
  lyrics: string;
  songNumber: number;
  slug: string;
}

export default function PresentationMode({ song, nextSlug, prevSlug }: { song: Song, nextSlug?: string, prevSlug?: string }) {
  const router = useRouter();
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "ArrowRight" && nextSlug) {
      router.push(`/songs/presentation/${nextSlug}`);
    } else if (e.key === "ArrowLeft" && prevSlug) {
      router.push(`/songs/presentation/${prevSlug}`);
    } else if (e.key === "Escape") {
      router.push(`/songs/${song.slug}`);
    }
  }, [nextSlug, prevSlug, router, song.slug]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black text-white z-[100] flex flex-col items-center justify-center p-12 overflow-hidden select-none cursor-none group hover:cursor-auto">
      {/* Top Controls Overlay */}
      <div className="absolute top-0 left-0 right-0 p-8 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-b from-black/50 to-transparent">
        <div className="flex items-center gap-4">
          <span className="text-sm font-mono font-bold text-neutral-500 uppercase tracking-widest">
            #{song.songNumber?.toString().padStart(3, "0")}
          </span>
          <h2 className="text-xl font-medium tracking-tight text-neutral-300">
            {song.title}
          </h2>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={toggleFullscreen} className="p-3 hover:bg-white/10 rounded-full transition-colors">
            {isFullscreen ? <Minimize className="h-6 w-6" /> : <Maximize className="h-6 w-6" />}
          </button>
          <button 
            onClick={() => router.push(`/songs/${song.slug}`)}
            className="p-3 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Main Lyrics Display */}
      <motion.div 
        key={song.slug}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-7xl w-full text-center"
      >
        <div 
          className="text-4xl md:text-6xl lg:text-7xl font-semibold leading-[1.4] tracking-tight whitespace-pre-wrap px-4"
          dangerouslySetInnerHTML={{ __html: song.lyrics }}
        />
      </motion.div>

      {/* Bottom Navigation Hints */}
      <div className="absolute bottom-0 left-0 right-0 p-8 flex items-center justify-center gap-12 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={() => prevSlug && router.push(`/songs/presentation/${prevSlug}`)}
          disabled={!prevSlug}
          className={cn("flex items-center gap-2 text-sm font-bold uppercase tracking-widest transition-colors", prevSlug ? "text-neutral-500 hover:text-neutral-100" : "text-neutral-800 cursor-not-allowed")}
        >
          <ChevronLeft className="h-4 w-4" /> Prev
        </button>
        <div className="text-[10px] font-bold text-neutral-700 uppercase tracking-[0.4em]">
           Arrow keys to navigate
        </div>
        <button 
          onClick={() => nextSlug && router.push(`/songs/presentation/${nextSlug}`)}
          disabled={!nextSlug}
          className={cn("flex items-center gap-2 text-sm font-bold uppercase tracking-widest transition-colors", nextSlug ? "text-neutral-500 hover:text-neutral-100" : "text-neutral-800 cursor-not-allowed")}
        >
          Next <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <style jsx global>{`
        body {
          overflow: hidden !important;
        }
      `}</style>
    </div>
  );
}
