"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

export default function PastorPageClient() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-12 lg:pt-32 lg:pb-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
            <motion.div
              initial="hidden"
              animate="visible"
              custom={0}
              variants={fadeInUp}
            >
              <span className="text-sm font-medium tracking-[0.2em] text-neutral-400 uppercase">
                Our Shepherd
              </span>
              <h1 className="mt-4 font-serif text-4xl font-semibold tracking-tight text-neutral-900 sm:text-6xl">
                Rev. Suresh Randhari
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-neutral-500">
                Leading Calvary Church of God with a profound dedication to the Word, a heart for the broken, and a vision for community transformation through the Gospel of Jesus Christ.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-neutral-100 shadow-2xl shadow-neutral-200 lg:max-w-md lg:justify-self-end"
            >
              <img
                src="/images/site/pastor.jpg"
                alt="Rev. Suresh Randhari"
                className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Biography Section */}
      <section className="bg-neutral-50 py-24 lg:py-32">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={1}
            variants={fadeInUp}
          >
            <h2 className="font-serif text-3xl font-semibold text-neutral-900">A Life of Service</h2>
            <div className="mt-8 space-y-6 text-lg leading-relaxed text-neutral-600">
              <p>
                Rev. Suresh Randhari has been serving in ministry for over two decades, carrying a mantle of leadership that combines biblical depth with practical compassion. His journey in faith began with a simple but powerful calling to share the light of Christ in a world marked by shadows.
              </p>
              <p>
                Under his guidance, Calvary Church of God has flourished into a sanctuary for seekers and a powerhouse of discipleship. He is known for his expositional preaching, his focus on the primacy of Scripture, and his unwavering belief in the power of prayer.
              </p>
              <p>
                He holds a deep-seated conviction that the local church is the hope of the world when it functions as the healthy, active Body of Christ. His ministry is characterized by a commitment to raising the next generation of leaders and fostering a culture of extravagant worship and radical hospitality.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Message Section */}
      <section className="py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="relative rounded-[2.5rem] bg-neutral-950 px-8 py-16 text-center text-white lg:py-24">
            <Quote className="mx-auto h-12 w-12 text-white/20" />
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={2}
              variants={fadeInUp}
              className="mt-8"
            >
              <h3 className="font-serif text-2xl font-normal leading-relaxed italic sm:text-3xl lg:text-4xl">
                &ldquo;Our goal is not just to build a church, but to build people who are so filled with the love of God that they cannot help but overflow into their communities.&rdquo;
              </h3>
              <p className="mt-8 text-sm font-medium tracking-widest text-white/40 uppercase">
                A Message from Pastor Suresh
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
