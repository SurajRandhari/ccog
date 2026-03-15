"use client";

import { motion } from "framer-motion";
import { Music, FileText, ExternalLink, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

// Dummy data for songs
const songs = [
  {
    id: "1",
    title: "How Great Is Our God",
    artist: "Chris Tomlin",
    category: "Worship",
    hasLyrics: true,
    hasChords: true,
  },
  {
    id: "2",
    title: "Goodness of God",
    artist: "Bethel Music",
    category: "Worship",
    hasLyrics: true,
    hasChords: true,
  },
  {
    id: "3",
    title: "Amazing Grace",
    artist: "Traditional",
    category: "Hymn",
    hasLyrics: true,
    hasChords: false,
  },
];

export default function SongsPage() {
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
              Songs & Lyrics
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-neutral-500">
              Access lyrics, chords, and recordings for the songs we sing together in worship.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Library Section */}
      <section className="bg-neutral-50 py-24 lg:py-32">
        <div className="mx-auto max-w-5xl px-6 lg:px-8">
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <h3 className="font-serif text-2xl font-semibold text-neutral-900">Song Library</h3>
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
              <Input
                placeholder="Search songs or artists..."
                className="h-11 border-neutral-200 bg-white pl-10 focus-visible:ring-neutral-900"
              />
            </div>
          </div>

          <div className="mt-12 overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-neutral-100 bg-neutral-50/50 text-neutral-400 uppercase tracking-wider font-medium">
                  <tr>
                    <th className="px-6 py-4">Title</th>
                    <th className="px-6 py-4">Artist</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4 text-right">Resources</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {songs.map((song, i) => (
                    <motion.tr
                      key={song.id}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      custom={i}
                      variants={fadeInUp}
                      className="group transition-colors hover:bg-neutral-50/50"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Music className="h-4 w-4 text-neutral-300" />
                          <span className="font-medium text-neutral-900">{song.title}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-neutral-500">{song.artist}</td>
                      <td className="px-6 py-4">
                        <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-600">
                          {song.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2 text-neutral-400">
                          {song.hasLyrics && (
                            <button className="rounded-md p-1.5 hover:bg-neutral-100 hover:text-neutral-900" title="Lyrics">
                              <FileText className="h-4 w-4" />
                            </button>
                          )}
                          <button className="rounded-md p-1.5 hover:bg-neutral-100 hover:text-neutral-900" title="View details">
                            <ExternalLink className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
