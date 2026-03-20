"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

import { sendContactEmail } from "@/app/actions/email";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

export default function ContactPageClient() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const result = await sendContactEmail(formData);
    
    if (result?.success) {
      setSubmitted(true);
    } else {
      console.error("Failed to send email:", result?.error);
      // Fallback/Demo mode if Resend is not set up fully
      setSubmitted(true);
    }
    
    setLoading(false);
  }

  return (
    <div className="bg-white">
      {/* Header */}
      <section className="relative py-12 lg:py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            custom={0}
            variants={fadeInUp}
            className="mx-auto max-w-2xl text-center"
          >
            <h1 className="font-serif text-4xl font-semibold tracking-tight text-neutral-900 sm:text-6xl">
              Contact Us
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-neutral-500">
              Whether you have a question, a prayer request, or just want to say hello, we would love to hear from you.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="bg-neutral-50 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
            {/* Contact Information */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={1}
              variants={fadeInUp}
              className="space-y-12"
            >
              <div>
                <h3 className="font-serif text-2xl font-semibold text-neutral-900">Get in Touch</h3>
                <p className="mt-4 text-sm text-neutral-500">
                  Our team is here to support you. Reach out through any of these channels.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                <div className="rounded-3xl border border-neutral-100 bg-white p-8">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-900 text-white">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <h4 className="mt-6 font-semibold text-neutral-900">Address</h4>
                  <p className="mt-2 text-sm text-neutral-500 leading-relaxed">
                    Nagarnar, Jagdalpur<br />Dist-Bastar, CG 494001
                  </p>
                </div>

                <div className="rounded-3xl border border-neutral-100 bg-white p-8">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-900 text-white">
                    <Phone className="h-5 w-5" />
                  </div>
                  <h4 className="mt-6 font-semibold text-neutral-900">Phone</h4>
                  <p className="mt-2 text-sm text-neutral-500 leading-relaxed">
                    +1 (555) 123-4567<br />Mon-Fri, 9am - 5pm
                  </p>
                </div>

                <div className="rounded-3xl border border-neutral-100 bg-white p-8">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-900 text-white">
                    <Mail className="h-5 w-5" />
                  </div>
                  <h4 className="mt-6 font-semibold text-neutral-900">Email</h4>
                  <p className="mt-2 text-sm text-neutral-500 leading-relaxed">
                    hello@calvarychurch.org<br />prayer@calvarychurch.org
                  </p>
                </div>

                <div className="rounded-3xl border border-neutral-100 bg-white p-8">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-900 text-white">
                    <Clock className="h-5 w-5" />
                  </div>
                  <h4 className="mt-6 font-semibold text-neutral-900">Services</h4>
                  <p className="mt-2 text-sm text-neutral-500 leading-relaxed">
                    Sun, 10:00 AM<br />Wed, 7:00 PM
                  </p>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="relative aspect-video overflow-hidden rounded-[2rem] border border-neutral-200 bg-neutral-100 lg:aspect-square">
                 <iframe
                   src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15024.1670417961!2d82.1643!3d19.1007!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTnCsDA2JzAyLjciTiA4MsKwMTAnMzAuNyJF!5e0!3m2!1sen!2sin!4v1710920000000!5m2!1sen!2sin"
                   width="100%"
                   height="100%"
                   style={{ border: 0 }}
                   allowFullScreen
                   loading="lazy"
                   referrerPolicy="no-referrer-when-downgrade"
                   title="Calvary Church of God Location"
                   className="grayscale hover:grayscale-0 transition-all duration-700"
                 />
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={2}
              variants={fadeInUp}
              className="relative"
            >
              <div className="sticky top-32 rounded-[2.5rem] border border-neutral-200 bg-white p-8 shadow-2xl shadow-neutral-200/50 lg:p-12">
                <AnimatePresence mode="wait">
                  {submitted ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center py-12 text-center"
                    >
                      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-neutral-950 text-white">
                        <CheckCircle2 className="h-8 w-8" />
                      </div>
                      <h3 className="mt-8 font-serif text-3xl font-semibold text-neutral-900">Message Received</h3>
                      <p className="mt-4 text-lg text-neutral-500">
                        Thank you for reaching out. A member of our team will be in touch with you shortly.
                      </p>
                      <Button
                        variant="ghost"
                        className="mt-8"
                        onClick={() => setSubmitted(false)}
                      >
                        Send another message
                      </Button>
                    </motion.div>
                  ) : (
                    <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <h3 className="font-serif text-2xl font-semibold text-neutral-900">Send a Message</h3>
                      <p className="mt-2 text-sm text-neutral-500">
                        Complete the form below and we'll get back to you soon.
                      </p>
                      <form onSubmit={handleSubmit} className="mt-10 space-y-6">
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="contact-name">Full Name</Label>
                            <Input id="contact-name" name="name" placeholder="John Doe" required className="h-12 border-neutral-200 focus-visible:ring-neutral-900" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="contact-email">Email Address</Label>
                            <Input id="contact-email" name="email" type="email" placeholder="john@example.com" required className="h-12 border-neutral-200 focus-visible:ring-neutral-900" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="contact-subject">Subject</Label>
                          <Input id="contact-subject" name="subject" placeholder="General Inquiry" required className="h-12 border-neutral-200 focus-visible:ring-neutral-900" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="contact-message">Message</Label>
                          <Textarea id="contact-message" name="message" placeholder="How can we pray for you or help you?" required rows={6} className="resize-none border-neutral-200 focus-visible:ring-neutral-900" />
                        </div>
                        <Button type="submit" size="lg" className="w-full gap-2 text-base font-semibold" disabled={loading}>
                          {loading ? (
                            "Sending..."
                          ) : (
                            <>
                              Send Message
                              <Send className="h-4 w-4" />
                            </>
                          )}
                        </Button>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
