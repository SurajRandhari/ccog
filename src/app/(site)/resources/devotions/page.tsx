"use client";

import { motion } from "framer-motion";
import { BookOpen, Calendar, User, ArrowRight } from "lucide-react";
import Link from "next/link";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

// Dummy data for devotions
const devotions = [
  {
    id: "1",
    title: "Finding Peace in the Storm",
    excerpt: "When the winds of life howl and the waves crash against your soul, remember the one who speaks to the storm...",
    author: "Rev. Suresh Randhari",
    date: "May 20, 2026",
  },
  {
    id: "2",
    title: "The Strength of Weakness",
    excerpt: "It is in our moments of greatest vulnerability that God's power is most perfectly displayed. Let us lean into His grace...",
    author: "Rev. Suresh Randhari",
    date: "May 19, 2026",
  },
  {
    id: "3",
    title: "Walking by Faith, Not by Sight",
    excerpt: "Our eyes often deceive us, focusing on the obstacles rather than the objective. Faith is the lens that reveals God's plan...",
    author: "Rev. Suresh Randhari",
    date: "May 18, 2026",
  },
];

export default function DevotionsPage() {
  return (
    <div className="bg-white">
      {/* Header */}
      <section className="relative overflow-hidden py-24 lg:py-32">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(0,0,0,0.05)_0%,transparent_50%)]" />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            custom={0}
            variants={fadeInUp}
            className="mx-auto max-w-2xl text-center"
          >
            <h1 className="font-serif text-4xl font-semibold tracking-tight text-neutral-900 sm:text-6xl">
              Daily Devotions
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-neutral-500">
              Pause for a moment each day to reflect on God's Word and find strength for your journey.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Devotions List */}
      <section className="bg-neutral-50 py-24 lg:py-32">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <div className="space-y-12">
            {devotions.map((devotion, i) => (
              <motion.article
                key={devotion.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                variants={fadeInUp}
                className="group relative rounded-[2rem] border border-neutral-200 bg-white p-8 transition-all hover:border-neutral-300 hover:shadow-xl hover:shadow-neutral-200 lg:p-12"
              >
                <div className="flex items-center gap-4 text-sm text-neutral-400">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    {devotion.date}
                  </span>
                  <span className="h-1 w-1 rounded-full bg-neutral-300" />
                  <span className="flex items-center gap-1.5">
                    <User className="h-4 w-4" />
                    {devotion.author}
                  </span>
                </div>
                <h2 className="mt-6 font-serif text-2xl font-semibold text-neutral-900 lg:text-3xl">
                  {devotion.title}
                </h2>
                <p className="mt-4 text-lg leading-relaxed text-neutral-600">
                  {devotion.excerpt}
                </p>
                <Link
                  href={`/resources/devotions/${devotion.id}`}
                  className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-neutral-900 transition-colors hover:text-neutral-600"
                >
                  Read full devotion
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </motion.article>
            ))}
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={4}
            variants={fadeInUp}
            className="mt-16 text-center"
          >
            <p className="text-sm text-neutral-400">
              More devotions are available in our archive.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
