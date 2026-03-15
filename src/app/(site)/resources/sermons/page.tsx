"use client";

import { motion } from "framer-motion";
import { Play, Calendar, User, Search } from "lucide-react";
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

// Dummy data for sermons
const sermons = [
  {
    id: "1",
    title: "The Power of Radical Love",
    series: "Greater Love",
    speaker: "Rev. Suresh Randhari",
    date: "May 18, 2026",
    thumbnail: "",
  },
  {
    id: "2",
    title: "Walking in Faith",
    series: "The Journey",
    speaker: "Rev. Suresh Randhari",
    date: "May 11, 2026",
    thumbnail: "",
  },
  {
    id: "3",
    title: "A Community of Hope",
    series: "Kingdom Life",
    speaker: "Rev. Suresh Randhari",
    date: "May 4, 2026",
    thumbnail: "",
  },
];

export default function SermonsPage() {
  return (
    <div className="bg-white">
      {/* Header */}
      <section className="relative py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            custom={0}
            variants={fadeInUp}
            className="mx-auto max-w-2xl text-center"
          >
            <h1 className="font-serif text-4xl font-semibold tracking-tight text-neutral-900 sm:text-6xl">
              Sermons
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-neutral-500">
              Explore our library of messages and stay connected with the teaching ministry of Calvary Church of God.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Featured Sermon */}
      <section className="pb-24 lg:pb-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="group relative overflow-hidden rounded-[2.5rem] bg-neutral-900 shadow-2xl"
          >
            <div className="absolute inset-0 z-0">
              <img
                src="/images/site/hero.png"
                alt="Featured Sermon"
                className="h-full w-full object-cover opacity-60 transition-transform duration-1000 group-hover:scale-105"
              />
            </div>
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-12">
              <div className="max-w-3xl">
                <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur-md">
                  Latest Sermon
                </span>
                <h2 className="mt-4 font-serif text-3xl font-semibold text-white sm:text-4xl lg:text-5xl">
                  {sermons[0].title}
                </h2>
                <div className="mt-6 flex flex-wrap items-center gap-6 text-sm text-white/60">
                  <span className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {sermons[0].speaker}
                  </span>
                  <span className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {sermons[0].date}
                  </span>
                </div>
                <div className="mt-8 flex gap-4">
                  <Button size="lg" className="h-12 gap-2 rounded-full px-8">
                    <Play className="h-4 w-4 fill-current" />
                    Watch Now
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Search & Grid */}
      <section className="bg-neutral-50 py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <h3 className="font-serif text-2xl font-semibold text-neutral-900">Recent Messages</h3>
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
              <Input
                placeholder="Search sermons..."
                className="h-11 border-neutral-200 bg-white pl-10 focus-visible:ring-neutral-900"
              />
            </div>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {sermons.map((sermon, i) => (
              <motion.div
                key={sermon.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                variants={fadeInUp}
              >
                <Link
                  href={`/resources/sermons/${sermon.id}`}
                  className="group block overflow-hidden rounded-2xl border border-neutral-200 bg-white transition-all hover:border-neutral-300 hover:shadow-xl hover:shadow-neutral-200"
                >
                  <div className="relative aspect-video w-full overflow-hidden bg-neutral-100">
                    <img
                      src={i % 2 === 0 ? "/images/site/vision.png" : "/images/site/hero.png"}
                      alt={sermon.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <span className="text-xs font-semibold tracking-wider text-neutral-400 uppercase">
                      {sermon.series}
                    </span>
                    <h4 className="mt-2 text-xl font-semibold text-neutral-900 group-hover:text-neutral-700">
                      {sermon.title}
                    </h4>
                    <div className="mt-4 flex items-center justify-between text-sm text-neutral-500">
                      <span className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {sermon.date}
                      </span>
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-neutral-50 group-hover:bg-neutral-900 group-hover:text-white transition-colors">
                        <Play className="h-3 w-3 fill-current" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
