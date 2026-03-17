"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Send, Heart, Shield, Globe, Lock, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

export default function PrayerRequestPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    request: "",
    isPublic: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/prayer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        setIsSubmitted(true);
        toast.success("Prayer request submitted. We are praying for you.");
      } else {
        toast.error(data.message || "Failed to submit request");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center p-6">
        <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full text-center space-y-8 p-12 rounded-[3rem] border border-neutral-100 bg-neutral-50/50"
        >
            <div className="flex justify-center">
                <div className="h-24 w-24 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                    <CheckCircle2 className="h-12 w-12" />
                </div>
            </div>
            <div className="space-y-4">
                <h1 className="font-serif text-4xl font-semibold text-neutral-900">Received with Love</h1>
                <p className="text-neutral-500 text-lg leading-relaxed">
                    Your prayer request has been received. Our prayer team will be interceding for you. 
                    May God's peace and grace be with you.
                </p>
            </div>
            <Button 
                onClick={() => setIsSubmitted(false)}
                className="rounded-2xl h-14 px-10 bg-neutral-900 shadow-xl"
            >
                Submit Another Request
            </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-16 lg:pt-48 lg:pb-24">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(0,0,0,0.03)_0%,transparent_50%)]" />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            custom={0}
            variants={fadeInUp}
            className="mx-auto max-w-2xl text-center"
          >
            <span className="inline-flex items-center rounded-full bg-rose-50 px-4 py-1.5 text-[10px] font-bold text-rose-500 uppercase tracking-widest mb-8 border border-rose-100">
              Intercession
            </span>
            <h1 className="font-serif text-5xl font-semibold tracking-tight text-neutral-900 sm:text-7xl mb-6">
              How Can We <span className="italic font-light">Pray</span> for You?
            </h1>
            <p className="text-xl leading-relaxed text-neutral-500 font-light max-w-xl mx-auto">
              We believe in the power of prayer. Share your needs with our community or keep them private between you and our leadership.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-24 lg:py-32 bg-neutral-50/50 border-t border-neutral-100">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-start">
            {/* Left Side: Context */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={1}
              variants={fadeInUp}
              className="space-y-12"
            >
              <div className="space-y-6">
                <h2 className="font-serif text-3xl font-semibold text-neutral-900">Your needs are important to us.</h2>
                <p className="text-lg text-neutral-500 leading-relaxed font-light">
                  "Carry each other’s burdens, and in this way you will fulfill the law of Christ." <br />
                  <span className="font-bold text-neutral-400 text-sm">— Galatians 6:2</span>
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-8">
                <div className="p-8 rounded-[2rem] bg-white border border-neutral-200 shadow-sm">
                    <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6">
                        <Shield className="h-6 w-6" />
                    </div>
                    <h3 className="font-bold text-neutral-900 mb-2">Private & Confidential</h3>
                    <p className="text-sm text-neutral-500 leading-relaxed font-light">
                        Opt to keep your request private, and only our pastoral team will see it.
                    </p>
                </div>
                <div className="p-8 rounded-[2rem] bg-white border border-neutral-200 shadow-sm">
                    <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6">
                        <Heart className="h-6 w-6" />
                    </div>
                    <h3 className="font-bold text-neutral-900 mb-2">Community Support</h3>
                    <p className="text-sm text-neutral-500 leading-relaxed font-light">
                        Make your request public to join our community wall and receive collective prayers.
                    </p>
                </div>
              </div>
            </motion.div>

            {/* Right Side: Form */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={2}
              variants={fadeInUp}
              className="bg-white p-10 lg:p-14 rounded-[3rem] border border-neutral-200 shadow-2xl shadow-neutral-200/50"
            >
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-neutral-400">Full Name</Label>
                    <Input 
                        id="name"
                        placeholder="Your name"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="h-14 rounded-2xl border-neutral-100 bg-neutral-50/50 focus:bg-white transition-all text-base"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-neutral-400">Email Address</Label>
                    <Input 
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        required
                        className="h-14 rounded-2xl border-neutral-100 bg-neutral-50/50 focus:bg-white transition-all text-base"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="request" className="text-xs font-bold uppercase tracking-widest text-neutral-400">Prayer Request</Label>
                    <Textarea 
                        id="request"
                        placeholder="Tell us what's on your heart..."
                        value={formData.request}
                        onChange={e => setFormData({ ...formData, request: e.target.value })}
                        required
                        className="min-h-[180px] rounded-3xl border-neutral-100 bg-neutral-50/50 focus:bg-white transition-all text-base p-6 resize-none"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between p-6 rounded-3xl border border-neutral-100 bg-neutral-50/50">
                    <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-xl ${formData.isPublic ? 'bg-blue-100 text-blue-600' : 'bg-neutral-200 text-neutral-500'}`}>
                            {formData.isPublic ? <Globe className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
                        </div>
                        <div>
                            <p className="text-sm font-bold text-neutral-900">Make it Public?</p>
                            <p className="text-[11px] text-neutral-400 font-medium">Show this on our community wall</p>
                        </div>
                    </div>
                    <Switch 
                        checked={formData.isPublic}
                        onCheckedChange={val => setFormData({ ...formData, isPublic: val })}
                    />
                </div>

                <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full h-16 rounded-[2rem] bg-neutral-900 text-white font-bold text-lg shadow-2xl shadow-neutral-200/50 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Sending...
                        </>
                    ) : (
                        <>
                            <Send className="mr-2 h-5 w-5" />
                            Submit Prayer Request
                        </>
                    )}
                </Button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
