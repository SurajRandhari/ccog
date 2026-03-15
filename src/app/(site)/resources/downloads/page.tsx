"use client";

import { motion } from "framer-motion";
import { Download, FileIcon, Search, ArrowDownToLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

// Dummy data for downloads
const resources = [
  {
    id: "1",
    title: "Bible Study Guide: The Gospel of John",
    description: "A comprehensive 12-week guide for small groups or individual study.",
    type: "PDF",
    size: "2.4 MB",
  },
  {
    id: "2",
    title: "Annual Ministry Report 2025",
    description: "Summary of our church's activities, growth, and finances over the past year.",
    type: "PDF",
    size: "5.1 MB",
  },
  {
    id: "3",
    title: "Worship Songbook (Chords & Lyrics)",
    description: "Our current repertoire of worship songs for home study and practice.",
    type: "ZIP",
    size: "12.8 MB",
  },
];

export default function DownloadsPage() {
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
              Resources & Downloads
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-neutral-500">
              Access free study guides, reports, and other materials to support your spiritual growth.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Grid Section */}
      <section className="bg-neutral-50 py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <h3 className="font-serif text-2xl font-semibold text-neutral-900">All Downloads</h3>
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
              <Input
                placeholder="Search resources..."
                className="h-11 border-neutral-200 bg-white pl-10 focus-visible:ring-neutral-900"
              />
            </div>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {resources.map((resource, i) => (
              <motion.div
                key={resource.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                variants={fadeInUp}
                className="group relative flex flex-col justify-between rounded-3xl border border-neutral-200 bg-white p-8 transition-all hover:border-neutral-900 hover:shadow-xl hover:shadow-neutral-200"
              >
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-600 transition-colors group-hover:bg-neutral-900 group-hover:text-white">
                    <FileIcon className="h-6 w-6" />
                  </div>
                  <h4 className="mt-6 text-xl font-semibold text-neutral-900">{resource.title}</h4>
                  <p className="mt-2 text-sm text-neutral-500 leading-relaxed">
                    {resource.description}
                  </p>
                </div>
                <div className="mt-8 flex items-center justify-between border-t border-neutral-100 pt-6">
                  <div className="text-xs font-medium text-neutral-400">
                    <span className="uppercase">{resource.type}</span> • {resource.size}
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 gap-2 rounded-full px-4 text-xs">
                    <Download className="h-3 w-3" />
                    Download
                  </Button>
                </div>
                <div className="absolute top-4 right-4 opacity-0 transition-opacity group-hover:opacity-100">
                  <ArrowDownToLine className="h-5 w-5 text-neutral-200" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
