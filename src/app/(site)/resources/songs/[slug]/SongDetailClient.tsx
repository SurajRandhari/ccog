"use client";

import { Music, ArrowLeft, Bookmark, Share2, Languages, Tag } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface SongDetailClientProps {
  song: {
    title: string;
    songNumber?: number;
    category: string;
    language: string;
    lyrics: string;
    tags?: string[];
  };
}

export default function SongDetailClient({ song }: SongDetailClientProps) {
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
            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-neutral-50 transition-colors">
              <Bookmark className="h-5 w-5 text-neutral-400" />
            </Button>
            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-neutral-50 transition-colors">
              <Share2 className="h-5 w-5 text-neutral-400" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Header */}
      <section className="pt-44 pb-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <div className="flex justify-center mb-10">
                    <div className="h-20 w-20 flex items-center justify-center rounded-[2.5rem] bg-white border border-neutral-100 shadow-xl shadow-neutral-100 text-neutral-900">
                        <Music className="h-8 w-8" />
                    </div>
                </div>
                
                {song.songNumber && (
                    <span className="inline-flex items-center rounded-full bg-neutral-900 px-6 py-2 text-[10px] font-bold text-white uppercase tracking-[0.3em] mb-10 shadow-lg shadow-neutral-900/20">
                        Song No. {song.songNumber}
                    </span>
                )}
                
                <h1 className="font-serif text-6xl md:text-8xl font-light tracking-tight text-neutral-900 leading-[1.1] mb-10">
                    {song.title}
                </h1>
                
                <div className="flex flex-wrap items-center justify-center gap-8">
                    <div className="flex items-center gap-3">
                        <Tag className="h-4 w-4 text-neutral-300" />
                        <span className="text-xs font-bold uppercase tracking-widest text-neutral-500">{song.category}</span>
                    </div>
                    <div className="h-1 w-1 rounded-full bg-neutral-200" />
                    <div className="flex items-center gap-3">
                        <Languages className="h-4 w-4 text-neutral-300" />
                        <span className="text-xs font-bold uppercase tracking-widest text-neutral-500">{song.language}</span>
                    </div>
                </div>
            </motion.div>
        </div>
      </section>

      {/* Lyrics Content */}
      <section className="py-12 relative overflow-hidden">
        <div className="mx-auto max-w-3xl px-6">
            <motion.div 
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative z-10 rounded-[4rem] border border-neutral-100 bg-white p-12 md:p-24 shadow-2xl shadow-neutral-100 overflow-hidden group"
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
            
            {/* Tags Footer */}
            {song.tags && song.tags.length > 0 && (
                <div className="mt-20 flex flex-wrap gap-3 justify-center">
                    {song.tags.map((tag) => (
                        <span 
                            key={tag}
                            className="px-6 py-2 rounded-full border border-neutral-100 bg-white text-neutral-400 text-[10px] font-bold uppercase tracking-widest hover:border-neutral-900 hover:text-neutral-900 transition-all cursor-default"
                        >
                            #{tag.toLowerCase()}
                        </span>
                    ))}
                </div>
            )}
        </div>
      </section>

      {/* Footer Navigation */}
      <section className="mt-40 border-t border-neutral-100 pt-32 pb-40">
        <div className="mx-auto max-w-4xl px-6 text-center">
            <h3 className="font-serif text-4xl font-light text-neutral-900 mb-6 italic">Continue the journey</h3>
            <p className="text-xl text-neutral-500 mb-12 font-light">Explore more hymns and spiritual melodies from our collection.</p>
            <Link href="/resources/songs">
                <Button size="lg" className="h-16 px-12 rounded-2xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold tracking-widest uppercase text-xs shadow-xl shadow-neutral-900/20">
                    Browse All Songs
                </Button>
            </Link>
        </div>
      </section>
    </div>
  );
}
