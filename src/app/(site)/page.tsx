"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Clock, MapPin, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

const quickLinks = [
  {
    href: "/about/connect",
    label: "I'm New Here",
    description: "Welcome! Find out how to get connected.",
    icon: MapPin,
  },
  {
    href: "/resources/sermons",
    label: "Watch Sermons",
    description: "Catch up on recent messages and series.",
    icon: BookOpen,
  },
  {
    href: "/contact",
    label: "Contact Us",
    description: "Reach out — we'd love to hear from you.",
    icon: Clock,
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden bg-white">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,0,0,0.02)_0%,transparent_50%)]" />
        <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-neutral-100/50 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-neutral-50 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 py-32 text-center lg:px-8">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-sm font-medium tracking-[0.2em] text-neutral-400 uppercase"
          >
            Welcome to
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-6 font-serif text-5xl font-semibold tracking-tight text-neutral-900 sm:text-6xl lg:text-7xl"
          >
            Calvary Church
            <br />
            <span className="text-neutral-400">of God</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-neutral-500 sm:text-xl"
          >
            A community of faith, hope, and love — growing together in the
            grace and knowledge of our Lord Jesus Christ.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          >
            <Button render={<Link href="/about/connect" />} size="lg" className="gap-2 px-8">
              I&apos;m New Here
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button render={<Link href="/resources/sermons" />} variant="outline" size="lg" className="px-8">
              Watch Sermons
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Service Times Banner */}
      <section className="border-y border-neutral-200 bg-neutral-50">
        <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
          <div className="flex flex-col items-center justify-center gap-6 text-center sm:flex-row sm:gap-12">
            <div>
              <p className="text-xs font-medium tracking-widest text-neutral-400 uppercase">
                Sunday Worship
              </p>
              <p className="mt-1 text-lg font-semibold text-neutral-900">
                10:00 AM
              </p>
            </div>
            <div className="hidden h-8 w-px bg-neutral-200 sm:block" />
            <div>
              <p className="text-xs font-medium tracking-widest text-neutral-400 uppercase">
                Wednesday Bible Study
              </p>
              <p className="mt-1 text-lg font-semibold text-neutral-900">
                7:00 PM
              </p>
            </div>
            <div className="hidden h-8 w-px bg-neutral-200 sm:block" />
            <div>
              <p className="text-xs font-medium tracking-widest text-neutral-400 uppercase">
                Friday Prayer
              </p>
              <p className="mt-1 text-lg font-semibold text-neutral-900">
                7:00 PM
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="bg-white py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {quickLinks.map((link, i) => (
              <motion.div key={link.href} custom={i} variants={fadeInUp}>
                <Link
                  href={link.href}
                  className="group block rounded-2xl border border-neutral-200 bg-white p-8 transition-all duration-300 hover:border-neutral-300 hover:shadow-lg hover:shadow-neutral-100"
                >
                  <link.icon className="h-6 w-6 text-neutral-400 transition-colors group-hover:text-neutral-900" />
                  <h3 className="mt-4 text-lg font-semibold text-neutral-900">
                    {link.label}
                  </h3>
                  <p className="mt-2 text-sm text-neutral-500">
                    {link.description}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-neutral-400 transition-colors group-hover:text-neutral-900">
                    Learn more
                    <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Vision Statement */}
      <section className="bg-neutral-950 py-24 lg:py-32">
        <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
          <motion.blockquote
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="font-serif text-2xl font-normal leading-relaxed text-white/90 italic sm:text-3xl lg:text-4xl"
          >
            &ldquo;For where two or three gather in my name, there am I with
            them.&rdquo;
          </motion.blockquote>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-6 text-sm tracking-widest text-white/40 uppercase"
          >
            Matthew 18:20
          </motion.p>
        </div>
      </section>
    </>
  );
}
