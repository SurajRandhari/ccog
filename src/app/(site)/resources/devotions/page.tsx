"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Calendar, User, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

export default function DevotionsPage() {
  const [devotions, setDevotions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchDevotions = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/devotions?page=${page}&limit=6`);
      const data = await res.json();
      if (data.success) {
        setDevotions(data.data);
        setTotalPages(data.pagination.pages);
      }
    } catch (error) {
      console.error("Failed to fetch devotions");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchDevotions();
  }, [fetchDevotions]);

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <section className="relative overflow-hidden pt-32 pb-16 lg:pt-48 lg:pb-24">
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
            <span className="inline-flex items-center rounded-full bg-neutral-100 px-4 py-1.5 text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-8 border border-neutral-200/50">
              Spiritual Nutrition
            </span>
            <h1 className="font-serif text-5xl font-semibold tracking-tight text-neutral-900 sm:text-7xl mb-6">
              Daily <span className="italic font-light">Devotions</span>
            </h1>
            <p className="text-xl leading-relaxed text-neutral-500 font-light max-w-xl mx-auto">
              Pause for a moment each day to reflect on God's Word and find strength for your journey.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Devotions List */}
      <section className="bg-neutral-50/50 border-t border-neutral-100 py-24 lg:py-32 min-h-[600px]">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-neutral-300" />
            </div>
          ) : (
            <div className="space-y-12">
              <AnimatePresence mode="popLayout">
                {devotions.length > 0 ? (
                    devotions.map((devotion, i) => (
                    <motion.article
                        key={devotion._id}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        custom={i % 6}
                        variants={fadeInUp}
                        className="group relative rounded-[2.5rem] border border-neutral-200/60 bg-white p-10 transition-all hover:border-neutral-300 hover:shadow-2xl hover:shadow-neutral-200/50 lg:p-14"
                    >
                        <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-neutral-400">
                        <span className="flex items-center gap-1.5 bg-neutral-50 px-3 py-1.5 rounded-full border border-neutral-100">
                            <Calendar className="h-3 w-3" />
                            {new Date(devotion.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <User className="h-3 w-3 text-neutral-300" />
                            {devotion.author}
                        </span>
                        </div>
                        <h2 className="mt-8 font-serif text-3xl font-semibold text-neutral-900 lg:text-4xl group-hover:text-neutral-700 transition-colors">
                        {devotion.title}
                        </h2>
                        <div className="mt-6 text-lg leading-relaxed text-neutral-500 font-light line-clamp-3 italic">
                        {devotion.scripture}
                        </div>
                        <Link
                        href={`/resources/devotions/${devotion.slug}`}
                        className="mt-10 inline-flex items-center gap-2 text-sm font-bold text-neutral-900 group-hover:underline underline-offset-8"
                        >
                        READ FULL DEVOTION
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-2" />
                        </Link>
                    </motion.article>
                    ))
                ) : (
                    <div className="text-center py-32">
                        <p className="text-neutral-400">No devotions have been published yet.</p>
                    </div>
                )}
              </AnimatePresence>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 pt-12">
                  <Button 
                    variant="ghost" 
                    disabled={page === 1}
                    onClick={() => setPage(p => p - 1)}
                    className="rounded-full px-6"
                  >
                    Previous
                  </Button>
                  <span className="text-sm font-bold text-neutral-900">
                    {page} / {totalPages}
                  </span>
                  <Button 
                    variant="ghost" 
                    disabled={page === totalPages}
                    onClick={() => setPage(p => p + 1)}
                    className="rounded-full px-6"
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
