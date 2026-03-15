"use client";

import { motion } from "framer-motion";
import { Target, Eye, Heart, Shield } from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

const values = [
  {
    icon: Heart,
    title: "Unconditional Love",
    description: "We believe in loving God and loving our neighbors as ourselves, without judgment or reservation.",
  },
  {
    icon: Target,
    title: "Biblical Truth",
    description: "Our foundation is built on the unchanging Word of God, guiding every decision and teaching.",
  },
  {
    icon: Shield,
    title: "Integrity",
    description: "We strive for transparency and honesty in all our dealings, reflecting the character of Christ.",
  },
  {
    icon: Heart,
    title: "Community",
    description: "We are a family, supporting one another through life's triumphs and challenges.",
  },
];

export default function AboutPage() {
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
              About Our Church
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-neutral-500">
              Calvary Church of God is a community of faith, hope, and love—growing together in the grace and knowledge of our Lord Jesus Christ.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="bg-neutral-50 py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={1}
              variants={fadeInUp}
            >
              <h2 className="font-serif text-3xl font-semibold text-neutral-900">Our Story</h2>
              <p className="mt-6 text-lg leading-relaxed text-neutral-600">
                Founded with a vision to share the transformative power of God's love, Calvary Church of God has remained a steadfast pillar of faith in our community. What began as a small gathering of believers has grown into a vibrant family dedicated to worship, fellowship, and service.
              </p>
              <p className="mt-4 text-lg leading-relaxed text-neutral-600">
                Through decades of ministry, we have seen lives changed, families restored, and hope renewed. Our history is a testament to God's faithfulness and the enduring spirit of our congregation.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative aspect-video overflow-hidden rounded-2xl bg-neutral-200 shadow-xl"
            >
              <img
                src="/images/site/hero.png"
                alt="Our Sanctuary"
                className="h-full w-full object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={2}
              variants={fadeInUp}
              className="rounded-3xl border border-neutral-100 bg-white p-8 shadow-sm transition-shadow hover:shadow-md lg:p-12"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-950 text-white">
                <Target className="h-6 w-6" />
              </div>
              <h3 className="mt-8 font-serif text-2xl font-semibold text-neutral-900">Our Mission</h3>
              <p className="mt-4 text-lg leading-relaxed text-neutral-600">
                To glorify God by making disciples of all nations, teaching them to observe everything Christ has commanded, and building a community where His love is known and felt.
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={3}
              variants={fadeInUp}
              className="rounded-3xl border border-neutral-100 bg-white p-8 shadow-sm transition-shadow hover:shadow-md lg:p-12"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-100 text-neutral-900">
                <Eye className="h-6 w-6" />
              </div>
              <h3 className="mt-8 font-serif text-2xl font-semibold text-neutral-900">Our Vision</h3>
              <p className="mt-4 text-lg leading-relaxed text-neutral-600">
                A world transformed by the Gospel, where every person experiences the love of God and is empowered to live a life of purpose and service.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="bg-neutral-950 py-24 text-white lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center">
            <motion.h2
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={4}
              variants={fadeInUp}
              className="font-serif text-3xl font-semibold sm:text-4xl"
            >
              Our Core Values
            </motion.h2>
            <motion.p
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={5}
              variants={fadeInUp}
              className="mt-4 text-lg text-neutral-400"
            >
              The principles that guide everything we do.
            </motion.p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value, i) => (
              <motion.div
                key={value.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={6 + i}
                variants={fadeInUp}
                className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm"
              >
                <value.icon className="h-8 w-8 text-white/60" />
                <h4 className="mt-6 text-xl font-semibold">{value.title}</h4>
                <p className="mt-2 text-sm text-neutral-400 leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
