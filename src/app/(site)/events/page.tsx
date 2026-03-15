"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Calendar as CalendarIcon, List, MapPin, Clock, ArrowRight } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

// Dummy data for events
const events = [
  {
    id: "1",
    title: "Youth Night: Connect",
    date: "Every Friday",
    time: "7:00 PM",
    location: "Main Hall",
    category: "Youth",
  },
  {
    id: "2",
    title: "Sunday Worship Service",
    date: "Every Sunday",
    time: "10:00 AM",
    location: "Sanctuary",
    category: "Worship",
  },
  {
    id: "3",
    title: "Mid-Week Bible Study",
    date: "Every Wednesday",
    time: "7:00 PM",
    location: "Interactive Room",
    category: "Teaching",
  },
  {
    id: "4",
    title: "Community Outreach: Care Day",
    date: "June 15, 2026",
    time: "9:00 AM",
    location: "City Square",
    category: "Outreach",
  },
];

export default function EventsPage() {
  const [view, setView] = useState<"list" | "calendar">("list");

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
              Events
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-neutral-500">
              Stay connected with our community through regular weekly programs and special upcoming events.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Controls */}
      <section className="border-y border-neutral-100 bg-neutral-50/50 py-6">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="font-serif text-2xl font-semibold text-neutral-900">Upcoming Schedule</h3>
            <Tabs defaultValue="list" onValueChange={(v) => setView(v as "list" | "calendar")}>
              <TabsList className="bg-neutral-100">
                <TabsTrigger value="list" className="gap-2">
                  <List className="h-4 w-4" />
                  List View
                </TabsTrigger>
                <TabsTrigger value="calendar" className="gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  Calendar
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <AnimatePresence mode="wait">
            {view === "list" ? (
              <motion.div
                key="list"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {events.map((event, i) => (
                  <motion.div
                    key={event.id}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    custom={i}
                    variants={fadeInUp}
                    className="group relative flex flex-col gap-6 rounded-3xl border border-neutral-100 bg-white p-8 transition-all hover:border-neutral-200 hover:shadow-xl hover:shadow-neutral-100 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
                      <div className="flex h-16 w-16 flex-shrink-0 flex-col items-center justify-center rounded-2xl bg-neutral-950 text-white">
                        <span className="text-xs font-semibold uppercase tracking-wider text-white/60">
                          {event.date.includes("Every") ? "WKLY" : "JUN"}
                        </span>
                        <span className="text-xl font-bold font-serif">
                          {event.date.includes("Every") ? event.date.split(" ")[1].slice(0, 3) : "15"}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                            {event.category}
                          </span>
                        </div>
                        <h4 className="mt-2 text-xl font-semibold text-neutral-900">
                          {event.title}
                        </h4>
                        <div className="mt-4 flex flex-wrap items-center gap-6 text-sm text-neutral-500">
                          <span className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            {event.time}
                          </span>
                          <span className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            {event.location}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" className="group-hover:translate-x-1 transition-transform">
                      Details
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="calendar"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="rounded-[2.5rem] border border-neutral-200 bg-white p-8 shadow-sm lg:p-12"
              >
                <div className="grid grid-cols-7 gap-px overflow-hidden rounded-2xl border border-neutral-100 bg-neutral-100">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                    <div key={day} className="bg-neutral-50 py-3 text-center text-xs font-semibold uppercase tracking-wider text-neutral-400">
                      {day}
                    </div>
                  ))}
                  {Array.from({ length: 35 }).map((_, i) => {
                    const day = i - 0; // Simplified calendar logic for demo
                    const isToday = day === 15;
                    const hasEvent = [0, 3, 5, 7, 10, 15].includes(day);
                    
                    return (
                      <div key={i} className={`min-h-[120px] bg-white p-4 transition-colors hover:bg-neutral-50 ${day < 1 || day > 31 ? 'opacity-30' : ''}`}>
                         <span className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-sm font-medium ${isToday ? 'bg-neutral-950 text-white' : 'text-neutral-900'}`}>
                           {day > 0 && day <= 31 ? day : ''}
                         </span>
                         {day > 0 && day <= 31 && hasEvent && (
                           <div className="mt-2 space-y-1">
                             <div className="h-1.5 w-full rounded-full bg-neutral-900/5 transition-colors group-hover:bg-neutral-900/10" />
                             <div className="text-[10px] font-medium text-neutral-500 truncate">
                               {day === 15 ? 'Care Day...' : 'Service'}
                             </div>
                           </div>
                         )}
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}
