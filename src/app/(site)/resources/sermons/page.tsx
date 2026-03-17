"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Calendar, User, Search, Loader2, Video, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

export default function SermonsPage() {
  const [sermons, setSermons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchSermons = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/sermons?search=${search}`);
      const data = await res.json();
      if (data.success) {
        setSermons(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch sermons:", error);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(() => {
        fetchSermons();
    }, 500);
    return () => clearTimeout(timer);
  }, [fetchSermons]);

  const featuredSermon = sermons[0];

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <section className="relative pt-32 pb-16 lg:pt-48 lg:pb-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(0,0,0,0.03)_0%,transparent_50%)]" />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            custom={0}
            variants={fadeInUp}
            className="mx-auto max-w-2xl text-center"
          >
            <span className="inline-flex items-center rounded-full bg-blue-50 px-4 py-1.5 text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-8 border border-blue-100">
              Teaching Ministry
            </span>
            <h1 className="font-serif text-5xl font-semibold tracking-tight text-neutral-900 sm:text-7xl mb-6">
              Sermon <span className="italic font-light text-neutral-400">Archive</span>
            </h1>
            <p className="text-xl leading-relaxed text-neutral-500 font-light max-w-2xl mx-auto">
              Explore our library of messages and stay connected with the teaching ministry of Calvary Church of God.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Featured Sermon */}
      {featuredSermon && !search && (
        <section className="pb-24 lg:pb-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="group relative overflow-hidden rounded-[3rem] bg-neutral-900 shadow-3xl aspect-[21/9] flex items-center"
            >
                <div className="absolute inset-0 z-0">
                <img
                    src={featuredSermon.videoUrl ? 
                        `https://img.youtube.com/vi/${featuredSermon.videoUrl.split('v=')[1]?.split('&')[0] || featuredSermon.videoUrl.split('/').pop()}/maxresdefault.jpg` 
                        : "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=1200"}
                    alt={featuredSermon.title}
                    className="h-full w-full object-cover opacity-40 transition-transform duration-1000 group-hover:scale-105"
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=1200'; }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/60 to-transparent" />
                </div>
                
                <div className="relative z-10 p-8 lg:p-20 max-w-3xl">
                    <span className="inline-flex items-center rounded-full bg-white/10 px-4 py-1.5 text-[10px] font-bold text-white uppercase tracking-widest mb-6 backdrop-blur-md border border-white/20">
                        Latest Message
                    </span>
                    <h2 className="font-serif text-4xl font-semibold text-white sm:text-5xl lg:text-6xl mb-6 group-hover:text-blue-200 transition-colors">
                        {featuredSermon.title}
                    </h2>
                    <p className="text-lg text-white/70 font-light line-clamp-2 mb-8 max-w-xl">
                        {featuredSermon.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-8 mb-10 text-sm font-medium text-white/50">
                        <span className="flex items-center gap-3">
                            <User className="h-4 w-4" />
                            {featuredSermon.speaker}
                        </span>
                        <span className="flex items-center gap-3">
                            <Calendar className="h-4 w-4" />
                            {new Date(featuredSermon.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </span>
                    </div>
                    <Link href={`/resources/sermons/${featuredSermon.slug}`}>
                        <Button size="lg" className="h-16 gap-3 rounded-2xl px-10 bg-white text-neutral-900 hover:bg-neutral-100 shadow-2xl transition-all hover:scale-[1.02]">
                            {featuredSermon.videoUrl ? <Play className="h-5 w-5 fill-current" /> : <FileText className="h-5 w-5" />}
                            {featuredSermon.videoUrl ? "Watch Now" : "Read Message"}
                        </Button>
                    </Link>
                </div>
            </motion.div>
            </div>
        </section>
      )}

      {/* Search & Grid */}
      <section className="bg-neutral-50/50 py-24 lg:py-32 border-t border-neutral-100">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between mb-16">
            <div>
                <h3 className="font-serif text-3xl font-semibold text-neutral-900 tracking-tight">Recent Messages</h3>
                <p className="text-neutral-500 mt-2 font-light">Browse our previous messages and teachings.</p>
            </div>
            <div className="relative w-full max-w-md">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-300" />
              <Input
                placeholder="Search messages by title or speaker..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-14 border-neutral-200 bg-white pl-12 rounded-2xl focus-visible:ring-neutral-900 shadow-sm"
              />
            </div>
          </div>

          {loading ? (
             <div className="flex min-h-[400px] items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-neutral-200" />
             </div>
          ) : sermons.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-[3rem] border border-neutral-100">
                <p className="text-neutral-400 font-serif text-xl italic">No messages found matching your search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
                {sermons.map((sermon, i) => (
                <motion.div
                    key={sermon._id}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    custom={i}
                    variants={fadeInUp}
                >
                    <Link
                        href={`/resources/sermons/${sermon.slug}`}
                        className="group block overflow-hidden rounded-[2.5rem] bg-white border border-neutral-100 transition-all hover:shadow-3xl hover:-translate-y-2 h-full"
                    >
                        <div className="relative aspect-video w-full overflow-hidden bg-neutral-900">
                            {sermon.videoUrl ? (
                                <img
                                    src={`https://img.youtube.com/vi/${sermon.videoUrl.split('v=')[1]?.split('&')[0] || sermon.videoUrl.split('/').pop()}/mqdefault.jpg`}
                                    alt={sermon.title}
                                    className="h-full w-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-110 group-hover:opacity-100"
                                    onError={(e) => { (e.target as HTMLImageElement).src = '/images/site/hero.png'; }}
                                />
                            ) : (
                                <div className="h-full w-full flex items-center justify-center bg-neutral-100 text-neutral-300">
                                    <FileText className="h-12 w-12" />
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                            <div className="absolute top-4 left-4">
                                <Badge className="bg-white/10 backdrop-blur-md border-white/20 text-white text-[10px] uppercase tracking-widest px-3 py-1">
                                    {sermon.tags?.[0] || 'Message'}
                                </Badge>
                            </div>
                        </div>
                        <div className="p-8">
                            <h4 className="text-2xl font-serif font-semibold text-neutral-900 group-hover:text-blue-600 transition-colors leading-tight mb-4 line-clamp-2">
                                {sermon.title}
                            </h4>
                            <p className="text-neutral-500 text-sm font-light line-clamp-2 mb-8 leading-relaxed">
                                {sermon.description}
                            </p>
                            <div className="flex items-center justify-between text-xs font-bold text-neutral-400 uppercase tracking-widest pt-6 border-t border-neutral-50">
                                <div className="flex items-center gap-2">
                                    <User className="h-3 w-3" />
                                    <span>{sermon.speaker}</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span>{new Date(sermon.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                    <span className="h-8 w-8 inline-flex items-center justify-center rounded-full bg-neutral-50 group-hover:bg-neutral-900 group-hover:text-white transition-all transform group-hover:rotate-[360deg] duration-500">
                                        {sermon.videoUrl ? <Play className="h-3 w-3 fill-current" /> : <FileText className="h-3 w-3" />}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Link>
                </motion.div>
                ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border ${className}`}>
            {children}
        </span>
    );
}
