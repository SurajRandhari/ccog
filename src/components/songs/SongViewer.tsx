"use client";

import { motion } from "framer-motion";
import { Music, Tag, Languages, User, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

interface NavSong {
  slug: string;
  title: string;
  songNo: number | null;
}

interface SongViewerProps {
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

export function SongViewer({ song, prevSong, nextSong }: SongViewerProps) {
  return (
    <>
      {/* Hero Header */}
      <section className="pt-32 pb-16">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex justify-center mb-8">
              <div className="h-20 w-20 flex items-center justify-center rounded-[2.5rem] bg-white border border-neutral-100 shadow-xl shadow-neutral-100 text-neutral-900">
                <Music className="h-8 w-8" />
              </div>
            </div>

            {song.songNo && (
              <span className="inline-flex items-center rounded-full bg-neutral-900 px-6 py-2 text-[10px] font-bold text-white uppercase tracking-[0.3em] mb-8 shadow-lg shadow-neutral-900/20">
                Song No. {song.songNo}
              </span>
            )}

            <h1 className="font-serif text-6xl md:text-8xl font-light tracking-tight text-neutral-900 leading-[1.1] mb-8">
              {song.title}
            </h1>

            <div className="flex flex-wrap items-center justify-center gap-8">
              <div className="flex items-center gap-3">
                <Tag className="h-4 w-4 text-neutral-300" />
                <span className="text-xs font-bold uppercase tracking-widest text-neutral-500">
                  {song.category}
                </span>
              </div>
              <div className="h-1 w-1 rounded-full bg-neutral-200" />
              <div className="flex items-center gap-3">
                <Languages className="h-4 w-4 text-neutral-300" />
                <span className="text-xs font-bold uppercase tracking-widest text-neutral-500">
                  {song.language}
                </span>
              </div>
              {song.author && (
                <>
                  <div className="h-1 w-1 rounded-full bg-neutral-200" />
                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-neutral-300" />
                    <span className="text-xs font-bold uppercase tracking-widest text-neutral-500">
                      {song.author}
                    </span>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Lyrics Content */}
      <section className="py-8 relative overflow-hidden">
        <div className="mx-auto max-w-3xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative z-10 rounded-[4rem] border border-neutral-100 bg-white p-10 md:p-20 shadow-2xl shadow-neutral-100 overflow-hidden group"
          >
            {/* Visual Accent */}
            <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none group-hover:opacity-[0.05] transition-opacity">
              <Music className="h-96 w-96" />
            </div>

            <article
              className="prose prose-neutral prose-2xl max-w-none text-neutral-800 font-light leading-[1.6] whitespace-pre-wrap select-text animate-in fade-in slide-in-from-bottom-4 duration-1000"
              dangerouslySetInnerHTML={{ __html: song.lyrics || "" }}
            />
          </motion.div>
        </div>
      </section>

      {/* Previous / Next Navigation */}
      {(prevSong || nextSong) && (
        <section className="mt-12 px-6">
          <div className="mx-auto max-w-3xl grid grid-cols-2 gap-4">
            {prevSong ? (
              <Link
                href={`/resources/songs/${prevSong.slug}`}
                className="group flex flex-col gap-2 p-6 rounded-3xl border border-neutral-100 bg-white hover:bg-neutral-950 hover:border-neutral-900 transition-all duration-500 shadow-sm hover:shadow-2xl"
              >
                <div className="flex items-center gap-2 text-xs text-neutral-400 group-hover:text-white/40 transition-colors">
                  <ChevronLeft className="h-3 w-3" />
                  <span className="uppercase font-bold tracking-widest">
                    Previous
                  </span>
                </div>
                <p className="font-serif text-lg font-light text-neutral-900 group-hover:text-white transition-colors truncate">
                  {prevSong.title}
                </p>
                {prevSong.songNo && (
                  <span className="text-xs font-mono text-neutral-300 group-hover:text-white/30">
                    #{prevSong.songNo.toString().padStart(3, "0")}
                  </span>
                )}
              </Link>
            ) : (
              <div />
            )}
            {nextSong ? (
              <Link
                href={`/resources/songs/${nextSong.slug}`}
                className="group flex flex-col gap-2 p-6 rounded-3xl border border-neutral-100 bg-white hover:bg-neutral-950 hover:border-neutral-900 transition-all duration-500 shadow-sm hover:shadow-2xl text-right"
              >
                <div className="flex items-center gap-2 justify-end text-xs text-neutral-400 group-hover:text-white/40 transition-colors">
                  <span className="uppercase font-bold tracking-widest">
                    Next
                  </span>
                  <ChevronRight className="h-3 w-3" />
                </div>
                <p className="font-serif text-lg font-light text-neutral-900 group-hover:text-white transition-colors truncate">
                  {nextSong.title}
                </p>
                {nextSong.songNo && (
                  <span className="text-xs font-mono text-neutral-300 group-hover:text-white/30">
                    #{nextSong.songNo.toString().padStart(3, "0")}
                  </span>
                )}
              </Link>
            ) : (
              <div />
            )}
          </div>
        </section>
      )}
    </>
  );
}
