"use client";

import { motion } from "framer-motion";
import { 
  Clock, 
  MapPin, 
  Coffee, 
  Users, 
  Send, 
  Phone, 
  Mail, 
  MessageSquare,
  ArrowRight,
  Sparkles
} from "lucide-react";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { InteractiveHoverButton } from "@/components/magicui/interactive-hover-button";
import { toast } from "sonner";
import Link from "next/link";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.21, 0.45, 0.32, 0.9] as const },
  }),
};

const attractions = [
  {
    icon: Clock,
    title: "Service Times",
    description: "Sundays at 10:00 AM. Join us early for coffee and fellowship at 9:30 AM.",
    color: "bg-blue-50 text-blue-600"
  },
  {
    icon: MapPin,
    title: "Location",
    description: "Easy to find with ample parking. Enter through the main double doors.",
    color: "bg-emerald-50 text-emerald-600"
  },
  {
    icon: Coffee,
    title: "What to Expect",
    description: "A warm welcome, contemporary worship, and a practical, biblical message.",
    color: "bg-orange-50 text-orange-600"
  },
  {
    icon: Users,
    title: "Small Groups",
    description: "The best way to get connected is through our weekly life groups and ministries.",
    color: "bg-purple-50 text-purple-600"
  },
];

export default function ConnectPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    toast.success("Thank you! We'll be in touch soon.");
    setIsSubmitting(false);
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-neutral-900 border-b border-white/5">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1511112232414-06788db31154?q=80&w=2070&auto=format&fit=crop"
            alt="Welcome Background"
            className="h-full w-full object-cover opacity-30 mix-blend-soft-light"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-neutral-900" />
        </div>

        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[10px] font-bold text-white/60 uppercase tracking-widest mb-8 border border-white/10 backdrop-blur-sm">
              <Sparkles className="h-3 w-3 text-amber-400" />
              Your First Visit
            </span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-serif text-5xl font-semibold tracking-tight text-white sm:text-8xl mb-8"
          >
            I&apos;m New Here
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mx-auto max-w-2xl text-xl leading-relaxed text-white/50 font-light mb-12"
          >
            Welcome to Calvary Church of God! We are so glad you are considering visiting us. Here is everything you need to know for your first visit.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
             <InteractiveHoverButton onClick={scrollToForm} className="w-64 bg-white text-neutral-900 border-none">
                Connect With Us
             </InteractiveHoverButton>
          </motion.div>
        </div>
      </section>

      {/* Info Grid */}
      <section className="py-24 lg:py-40 bg-neutral-50/50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {attractions.map((item, i) => (
              <motion.div
                key={item.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                variants={fadeInUp}
                className="group rounded-[2.5rem] border border-neutral-100 bg-white p-10 shadow-lg shadow-neutral-200/20 transition-all hover:shadow-2xl hover:shadow-neutral-200/40 hover:-translate-y-2 duration-500"
              >
                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${item.color} transition-transform group-hover:rotate-6`}>
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-8 text-2xl font-semibold text-neutral-900">{item.title}</h3>
                <p className="mt-4 text text-neutral-500 leading-relaxed font-light">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Connect Form Section */}
      <section ref={formRef} className="py-24 lg:py-40 px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.3em] mb-6 block">Stay Connected</span>
            <h2 className="font-serif text-5xl md:text-6xl font-semibold text-neutral-900 mb-8 leading-tight">
              We&apos;d Love to <br />Meet You
            </h2>
            <p className="text-xl text-neutral-500 font-light leading-relaxed mb-12 max-w-lg">
              Whether you have questions, need prayer, or want to join a ministry, we are here to support your spiritual journey.
            </p>

            <div className="space-y-8">
              <div className="flex items-center gap-6 group/item">
                <div className="h-14 w-14 rounded-2xl bg-neutral-50 flex items-center justify-center border border-neutral-100 group-hover/item:border-neutral-900 transition-colors">
                  <Mail className="h-6 w-6 text-neutral-400" />
                </div>
                <div>
                  <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-1">Email Us</p>
                  <p className="text-lg font-medium text-neutral-900">calvarycogindia@gmail.com</p>
                </div>
              </div>
              <div className="flex items-center gap-6 group/item">
                <div className="h-14 w-14 rounded-2xl bg-neutral-50 flex items-center justify-center border border-neutral-100 group-hover/item:border-neutral-900 transition-colors">
                  <MessageSquare className="h-6 w-6 text-neutral-400" />
                </div>
                <div>
                  <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-1">Need Prayer?</p>
                  <p className="text-lg font-medium text-neutral-900">info@calvarycogindia.com</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-white rounded-[3rem] border border-neutral-100 p-10 lg:p-14 shadow-2xl shadow-neutral-200/50"
          >
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label htmlFor="firstName" className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 ml-1">First Name</Label>
                  <Input 
                    id="firstName" 
                    placeholder="John" 
                    required 
                    className="h-14 rounded-2xl border-neutral-100 bg-neutral-50/50 focus:bg-white transition-all text-lg font-light px-6"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="lastName" className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 ml-1">Last Name</Label>
                  <Input 
                    id="lastName" 
                    placeholder="Doe" 
                    required 
                    className="h-14 rounded-2xl border-neutral-100 bg-neutral-50/50 focus:bg-white transition-all text-lg font-light px-6"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <Label htmlFor="email" className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 ml-1">Email Address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="john@example.com" 
                  required 
                  className="h-14 rounded-2xl border-neutral-100 bg-neutral-50/50 focus:bg-white transition-all text-lg font-light px-6"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="message" className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 ml-1">How can we help you?</Label>
                <Textarea 
                  id="message" 
                  placeholder="Tell us a bit about yourself..." 
                  required 
                  className="min-h-[160px] rounded-3xl border-neutral-100 bg-neutral-50/50 focus:bg-white transition-all text-lg font-light p-6 resize-none"
                />
              </div>
              <div className="pt-4">
                <InteractiveHoverButton 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-neutral-900 text-white border-none py-4 text-sm"
                >
                  {isSubmitting ? "Sending..." : "Submit Connection Card"}
                </InteractiveHoverButton>
              </div>
            </form>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-neutral-900 py-24 lg:py-32">
        <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-serif text-4xl font-semibold text-white mb-8">Ready to take the next step?</h2>
            <p className="mx-auto max-w-2xl text-lg text-white/50 font-light mb-12">
              Whether you want to join a small group, serve in a ministry, or just learn more about us, we would love to hear from you.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link href="/about/membership">
                <button className="group flex items-center gap-3 px-8 py-3 text-white font-semibold transition-all hover:gap-5 border border-white/10 rounded-full hover:bg-white/5">
                  About Membership
                  <ArrowRight className="h-5 w-5 text-white/40 group-hover:text-white transition-colors" />
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
