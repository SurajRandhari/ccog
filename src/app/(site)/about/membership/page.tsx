"use client";

import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

const steps = [
  {
    title: "Attend a Service",
    description: "Start by joining us for a Sunday worship service to experience our community firsthand.",
  },
  {
    title: "New Member Orientation",
    description: "Attend our orientation class to learn about our beliefs, mission, and how we function as a church.",
  },
  {
    title: "Personal Interview",
    description: "Meet with a pastor or elder to share your testimony and ask any remaining questions.",
  },
  {
    title: "Public Affirmation",
    description: "Be introduced to the congregation as a new member and receive our warm welcome.",
  },
];

export default function MembershipPage() {
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
              Membership
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-neutral-500">
              Discover what it means to belong to the Calvary Church of God family and how you can take the next step in your spiritual journey.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Why Membership? */}
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
              <h2 className="font-serif text-3xl font-semibold text-neutral-900">Why Membership?</h2>
              <p className="mt-6 text-lg leading-relaxed text-neutral-600">
                Membership at Calvary Church of God is more than just having your name on a list. It's a commitment to a community of believers where you can grow, serve, and be supported.
              </p>
              <ul className="mt-8 space-y-4">
                {[
                  "Spiritual accountability and pastoral care",
                  "Opportunities to serve in various ministries",
                  "A voice in the direction of the church",
                  "A supportive family of faith",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-neutral-600">
                    <CheckCircle2 className="mt-1 h-5 w-5 flex-shrink-0 text-neutral-900" />
                    <span className="text-lg">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-neutral-200"
            >
              <div className="absolute inset-0 flex items-center justify-center text-neutral-400">
                Community Image Placeholder
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center">
            <motion.h2
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={2}
              variants={fadeInUp}
              className="font-serif text-3xl font-semibold text-neutral-900"
            >
              The Path to Membership
            </motion.h2>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={3 + i}
                variants={fadeInUp}
                className="relative flex flex-col items-center text-center"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-950 text-white font-serif text-xl font-semibold">
                  {i + 1}
                </div>
                <h3 className="mt-6 text-xl font-semibold text-neutral-900">{step.title}</h3>
                <p className="mt-2 text-sm text-neutral-500 leading-relaxed">
                  {step.description}
                </p>
                {i < steps.length - 1 && (
                  <div className="hidden absolute top-6 left-[calc(50%+1.5rem)] right-[-1.5rem] h-px bg-neutral-100 lg:block" />
                )}
              </motion.div>
            ))}
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={7}
            variants={fadeInUp}
            className="mt-16 text-center"
          >
            <Button render={<Link href="/contact" />} size="lg" className="gap-2 px-8">
              Enquire About Membership
              <ArrowRight className="h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
