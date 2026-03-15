"use client";

import { motion } from "framer-motion";
import { Clock, MapPin, Coffee, Users } from "lucide-react";
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

const attractions = [
  {
    icon: Clock,
    title: "Service Times",
    description: "Sundays at 10:00 AM. Join us early for coffee and fellowship at 9:30 AM.",
  },
  {
    icon: MapPin,
    title: "Location",
    description: "Easy to find with ample parking. Enter through the main double doors.",
  },
  {
    icon: Coffee,
    title: "What to Expect",
    description: "A warm welcome, contemporary worship, and a practical, biblical message.",
  },
  {
    icon: Users,
    title: "Small Groups",
    description: "The best way to get connected is through our weekly life groups and ministries.",
  },
];

export default function ConnectPage() {
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
              I&apos;m New Here
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-neutral-500">
              Welcome to Calvary Church of God! We are so glad you are considering visiting us. Here is everything you need to know for your first visit.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Grid Section */}
      <section className="bg-neutral-50 py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {attractions.map((item, i) => (
              <motion.div
                key={item.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={1 + i}
                variants={fadeInUp}
                className="group rounded-3xl border border-neutral-100 bg-white p-8 shadow-sm transition-all hover:shadow-md"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-900 text-white transition-transform group-hover:scale-110">
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-8 text-xl font-semibold text-neutral-900">{item.title}</h3>
                <p className="mt-2 text-sm text-neutral-500 leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Next Steps */}
      <section className="py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="rounded-[2.5rem] bg-neutral-950 px-8 py-16 text-center text-white lg:py-24">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={5}
              variants={fadeInUp}
            >
              <h2 className="font-serif text-3xl font-semibold sm:text-4xl">Ready to take the next step?</h2>
              <p className="mx-auto mt-6 max-w-2xl text-lg text-neutral-400">
                Whether you want to join a small group, serve in a ministry, or just learn more about us, we would love to hear from you.
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button render={<Link href="/contact" />} size="lg" className="px-8">
                  Get in Touch
                </Button>
                <Button render={<Link href="/about/membership" />} variant="outline" size="lg" className="border-white/20 px-8 hover:bg-white/10 hover:text-white">
                  Learn About Membership
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
