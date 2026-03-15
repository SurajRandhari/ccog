"use client";

import { motion } from "framer-motion";
import { Calendar, User, ArrowRight, Tag } from "lucide-react";
import Link from "next/link";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

// Dummy data for blog posts
const posts = [
  {
    id: "1",
    title: "The Importance of Community in the Modern Age",
    excerpt: "In an increasingly fragmented world, the local church remains a vital center for real connection and mutual support...",
    author: "Rev. Suresh Randhari",
    date: "April 28, 2026",
    category: "Church Life",
    thumbnail: "",
  },
  {
    id: "2",
    title: "Understanding Grace in Daily Life",
    excerpt: "Grace is not just a theological concept for Sunday mornings; it is the practical reality that sustains us through every challenge...",
    author: "Rev. Suresh Randhari",
    date: "April 15, 2026",
    category: "Teaching",
    thumbnail: "",
  },
  {
    id: "3",
    title: "Upcoming Community Outreach Programs",
    excerpt: "We are excited to announce several new initiatives aimed at serving our neighborhood and sharing the love of Christ practically...",
    author: "Media Team",
    date: "April 5, 2026",
    category: "Events",
    thumbnail: "",
  },
];

export default function BlogPage() {
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
              Church Blog
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-neutral-500">
              Articles, stories, and updates from our community, designed to inspire and inform your walk with God.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Grid Section */}
      <section className="bg-neutral-50 py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            {posts.map((post, i) => (
              <motion.article
                key={post.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                variants={fadeInUp}
                className="group flex flex-col items-start"
              >
                <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[2rem] bg-neutral-200">
                  <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-neutral-900 backdrop-blur-sm">
                      <Tag className="h-3 w-3" />
                      {post.category}
                    </span>
                  </div>
                </div>
                <div className="mt-8">
                  <div className="flex items-center gap-4 text-sm text-neutral-400">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4" />
                      {post.date}
                    </span>
                    <span className="h-1 w-1 rounded-full bg-neutral-300" />
                    <span className="flex items-center gap-1.5">
                      <User className="h-4 w-4" />
                      {post.author}
                    </span>
                  </div>
                  <h2 className="mt-4 font-serif text-2xl font-semibold text-neutral-900 group-hover:text-neutral-700 lg:text-3xl">
                    <Link href={`/resources/blog/${post.id}`}>{post.title}</Link>
                  </h2>
                  <p className="mt-4 text-lg leading-relaxed text-neutral-600 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <Link
                    href={`/resources/blog/${post.id}`}
                    className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-neutral-900 transition-colors hover:text-neutral-600"
                  >
                    Read more
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
