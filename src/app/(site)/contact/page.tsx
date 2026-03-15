"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    // TODO: Connect to API endpoint
    await new Promise((r) => setTimeout(r, 1000));
    setSubmitted(true);
    setLoading(false);
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-2xl text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-serif text-4xl font-semibold tracking-tight text-neutral-900 sm:text-5xl"
        >
          Contact Us
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-4 text-lg text-neutral-500"
        >
          We&apos;d love to hear from you. Reach out anytime.
        </motion.p>
      </div>

      <div className="mt-16 grid gap-16 lg:grid-cols-2">
        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-8"
        >
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100">
              <MapPin className="h-5 w-5 text-neutral-600" />
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900">Address</h3>
              <p className="mt-1 text-sm text-neutral-500">
                Calvary Church of God
                <br />
                Church address will be updated from CMS
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100">
              <Phone className="h-5 w-5 text-neutral-600" />
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900">Phone</h3>
              <p className="mt-1 text-sm text-neutral-500">
                Contact number will be updated from CMS
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100">
              <Mail className="h-5 w-5 text-neutral-600" />
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900">Email</h3>
              <p className="mt-1 text-sm text-neutral-500">
                Email will be updated from CMS
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100">
              <Clock className="h-5 w-5 text-neutral-600" />
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900">Service Times</h3>
              <div className="mt-2 space-y-1 text-sm text-neutral-500">
                <p>Sunday Worship — 10:00 AM</p>
                <p>Wednesday Bible Study — 7:00 PM</p>
                <p>Friday Prayer — 7:00 PM</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          {submitted ? (
            <div className="flex h-full items-center justify-center rounded-2xl border border-neutral-200 bg-neutral-50 p-12">
              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                  <Send className="h-5 w-5 text-green-600" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-neutral-900">
                  Message Sent!
                </h3>
                <p className="mt-2 text-sm text-neutral-500">
                  Thank you for reaching out. We&apos;ll get back to you soon.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="contact-name">Name</Label>
                <Input
                  id="contact-name"
                  type="text"
                  required
                  placeholder="Your name"
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="contact-email">Email</Label>
                <Input
                  id="contact-email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="contact-message">Message</Label>
                <Textarea
                  id="contact-message"
                  required
                  rows={5}
                  placeholder="How can we help?"
                  className="mt-2 resize-none"
                />
              </div>
              <Button type="submit" size="lg" className="w-full" disabled={loading}>
                {loading ? "Sending..." : "Send Message"}
              </Button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}
