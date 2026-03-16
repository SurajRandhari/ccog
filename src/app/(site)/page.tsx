"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { 
  ArrowRight, 
  Clock, 
  MapPin, 
  BookOpen, 
  Music, 
  Users, 
  HandHeart, 
  Play,
  Calendar,
  Zap,
  Quote
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { InteractiveHoverButton } from "@/components/magicui/interactive-hover-button";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.21, 0.45, 0.32, 0.9] as const },
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
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);

  return (
    <>
      {/* Hero Section */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-neutral-900">
        {/* Background Image with Parallax Effect */}
        <motion.div style={{ y: y1 }} className="absolute inset-0 z-0">
          <img
            src="/images/site/hero.png"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1438032005730-c779502df39b?q=80&w=2071&auto=format&fit=crop";
            }}
            alt="Church Sanctuary"
            className="h-full w-full object-cover opacity-50 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/20 to-neutral-900" />
        </motion.div>
        
        <div className="absolute top-0 right-0 h-[32rem] w-[32rem] rounded-full bg-white/5 blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-white/5 blur-3xl animate-pulse delay-700" />

        <div className="relative z-10 mx-auto max-w-7xl px-6 py-32 text-center lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="inline-flex items-center rounded-full bg-white/10 px-4 py-1.5 text-[10px] font-bold text-white/60 uppercase tracking-[0.3em] mb-8 border border-white/5 backdrop-blur-sm">
              Soli Deo Gloria
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.21, 0.45, 0.32, 0.9] as const }}
            className="font-serif text-6xl font-semibold tracking-tight text-white sm:text-8xl lg:text-9xl mb-8 leading-tight"
          >
            Calvary Church
            <br />
            <span className="text-white/40 italic">of God</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.21, 0.45, 0.32, 0.9] as const }}
            className="mx-auto max-w-2xl text-lg leading-relaxed text-white/60 sm:text-2xl font-light mb-12"
          >
            A community of faith, hope, and love — growing together in the
            grace and knowledge of our Lord Jesus Christ.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.21, 0.45, 0.32, 0.9] as const }}
            className="flex flex-col items-center gap-6 sm:flex-row sm:justify-center"
          >
            <Link href="/about/connect">
              <InteractiveHoverButton className="w-64 bg-white text-neutral-900 border-none">
                I&apos;m New Here
              </InteractiveHoverButton>
            </Link>
            <Link href="/resources/sermons">
              <button className="group flex items-center gap-3 px-8 py-3 text-white font-semibold transition-all hover:gap-5">
                Watch Messages
                <ArrowRight className="h-5 w-5 text-white/40 group-hover:text-white transition-colors" />
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Service Times Horizontal Bar */}
      <section className="relative z-20 -mt-12 mx-auto max-w-5xl px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-[2rem] border border-neutral-100 shadow-xl shadow-neutral-200/50 p-8 md:p-12"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:divide-x divide-neutral-100">
            <ServiceTime icon={Calendar} title="Sunday Worship" time="10:00 AM" />
            <ServiceTime icon={BookOpen} title="Wednesday Study" time="07:00 PM" />
            <ServiceTime icon={HandHeart} title="Friday Prayer" time="07:00 PM" />
          </div>
        </motion.div>
      </section>

      {/* Meet Our Pastor Section */}
      <section className="py-24 lg:py-40 px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-[3rem] overflow-hidden">
              <img 
                src="/images/site/pastor.png" 
                alt="Rev. Suresh Randhari" 
                className="w-full h-full object-cover scale-105 hover:scale-100 transition-transform duration-700"
              />
            </div>
            <div className="absolute -bottom-10 -right-10 bg-neutral-900 text-white p-10 rounded-[2.5rem] hidden md:block shadow-2xl">
              <Quote className="h-10 w-10 text-white/20 mb-4" />
              <p className="text-xl font-serif italic mb-6 leading-relaxed max-w-xs">
                "Our prayer is that you find belonging and purpose here."
              </p>
              <p className="text-xs font-bold uppercase tracking-widest text-white/40">Rev. Suresh Randhari</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.3em] mb-6 block">Meet Our Senior Pastor</span>
            <h2 className="font-serif text-5xl md:text-6xl font-semibold text-neutral-900 mb-8 leading-tight">
              A Warm Welcome <br />to Our Church
            </h2>
            <div className="space-y-6 text-lg text-neutral-500 font-light leading-relaxed mb-10">
              <p>
                As the Senior Pastor of Calvary Church of God, it is my absolute joy to welcome you to our digital home. We are more than just a congregation; we are a family brought together by the love of Jesus.
              </p>
              <p>
                Whether you are exploring faith for the first time or looking for a community to call home, we invite you to grow with us in spirit and in truth.
              </p>
            </div>
            <Link href="/about/pastor">
              <Button variant="outline" className="rounded-full px-8 py-6 border-neutral-200 hover:bg-neutral-50 text-neutral-600 hover:text-neutral-900">
                Read Full Story
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Experience Calvary (Core Values) */}
      <section className="bg-neutral-50 py-24 lg:py-40">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-serif text-4xl md:text-6xl font-semibold text-neutral-900 mb-6"
            >
              Experience Calvary
            </motion.h2>
            <p className="text-neutral-500 text-lg font-light max-w-2xl mx-auto">
              We focus on building a strong foundation in Christ through three core pillars.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ValueCard 
              icon={Users} 
              title="Community" 
              desc="Building authentic relationships through small groups and fellowship."
              index={0}
            />
            <ValueCard 
              icon={Zap} 
              title="Discipleship" 
              desc="Deepening our faith through biblical teaching and spiritual growth."
              index={1}
            />
            <ValueCard 
              icon={HandHeart} 
              title="Outreach" 
              desc="Spreading the love of God to our local community and beyond."
              index={2}
            />
          </div>
        </div>
      </section>

      {/* Sermon & Worship Showcases */}
      <section className="py-24 lg:py-40">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Recent Messages */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-7 bg-white rounded-[3rem] border border-neutral-100 shadow-xl overflow-hidden group"
            >
              <div className="aspect-video relative overflow-hidden">
                <img src="/images/site/sermon_current.png" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Current Series" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-8 left-8 right-8 flex items-end justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest mb-2 block">Current Series</span>
                    <h3 className="text-3xl font-serif font-semibold text-white">The Grace of God</h3>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center shadow-lg cursor-pointer hover:scale-110 transition-transform">
                    <Play className="h-5 w-5 text-neutral-900 fill-current" />
                  </div>
                </div>
              </div>
              <div className="p-10 flex items-center justify-between border-t border-neutral-50">
                <p className="text-neutral-500 font-light">Explore our archive of spirit-filled messages.</p>
                <Link href="/resources/sermons">
                  <Button variant="ghost" className="gap-2 text-neutral-900 font-bold hover:bg-neutral-50 transition-colors">
                    View Archive <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Song Book Showcase */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-5 bg-neutral-900 rounded-[3rem] p-10 lg:p-12 text-white flex flex-col justify-between relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 h-40 w-40 bg-white/5 rounded-full -mr-20 -mt-20 blur-2xl group-hover:bg-white/10 transition-colors" />
              
              <div>
                <div className="h-14 w-14 rounded-2xl bg-white/10 flex items-center justify-center mb-8 border border-white/10">
                  <Music className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-serif text-4xl font-semibold mb-6">Worship & <br />Lyrics</h3>
                <p className="text-white/60 font-light text-lg leading-relaxed mb-8">
                  Sing along with our congregation. Access our lyrics library for worship, praise, and special songs.
                </p>
                <Link href="/resources/songs">
                  <InteractiveHoverButton className="w-full bg-white text-neutral-900 border-none py-4">
                    Explore Song Book
                  </InteractiveHoverButton>
                </Link>
              </div>

              <div className="mt-12 flex items-center gap-3">
                <div className="flex -space-x-3">
                  {[1,2,3].map(i => (
                    <div key={i} className="h-10 w-10 rounded-full border-2 border-neutral-900 bg-neutral-800 overflow-hidden">
                      <img src={`https://i.pravatar.cc/100?u=${i}`} alt="Avatar" />
                    </div>
                  ))}
                </div>
                <span className="text-sm text-white/40">Join 500+ worshippers</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Vision Quote Section (Polished) */}
      <section className="relative overflow-hidden bg-neutral-950 py-32 lg:py-48">
        <div className="absolute inset-0 z-0 opacity-20 hover:opacity-30 transition-opacity duration-1000">
          <img
            src="/images/site/vision.png"
            alt="Vision Background"
            className="h-full w-full object-cover blur-sm scale-110"
          />
          <div className="absolute inset-0 bg-neutral-950/80" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center lg:px-8">
          <motion.blockquote
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="font-serif text-3xl font-light leading-relaxed text-white italic sm:text-5xl"
          >
            &ldquo;For where two or three gather in my name, there am I with
            them.&rdquo;
          </motion.blockquote>
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            whileInView={{ opacity: 1, width: 100 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.5 }}
            className="h-px bg-white/20 mx-auto mt-10"
          />
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mt-6 text-xs tracking-[0.5em] text-white/40 uppercase font-bold"
          >
            Matthew 18:20
          </motion.p>
        </div>
      </section>

      {/* Visit Us / Location Map Section */}
      <section className="py-24 lg:py-40 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.3em] mb-6 block">Join Us This Sunday</span>
              <h2 className="font-serif text-4xl md:text-6xl font-semibold text-neutral-900 mb-8 leading-tight">
                Plan Your Visit
              </h2>
              <div className="space-y-10 group">
                <LocationItem 
                  icon={MapPin}
                  title="Our Location"
                  desc="Calvary Church of God, Sector-12, RK Puram, New Delhi, 110022"
                />
                <LocationItem 
                  icon={Clock}
                  title="Worship Times"
                  desc="Sundays at 10:00 AM — Join us for a powerful time of worship and word."
                />
              </div>
              <div className="mt-12">
                <Link href="/contact">
                  <Button className="rounded-full px-10 py-7 bg-neutral-900 text-white hover:bg-neutral-800 shadow-xl transition-all shadow-neutral-900/20">
                    Get Directions
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative h-[500px] rounded-[3rem] overflow-hidden shadow-2xl shadow-neutral-200/50 grayscale hover:grayscale-0 transition-all duration-700">
               <img 
                 src="https://images.unsplash.com/photo-1548337138-e87d889cc369?q=80&w=2000&auto=format&fit=crop" 
                 alt="Google Maps Placeholder" 
                 className="w-full h-full object-cover border border-neutral-100"
               />
               <div className="absolute inset-0 bg-neutral-900/10 pointer-events-none" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function ServiceTime({ icon: Icon, title, time }: { icon: any, title: string, time: string }) {
  return (
    <div className="flex flex-col items-center md:items-start px-6">
      <div className="h-10 w-10 rounded-full bg-neutral-50 flex items-center justify-center mb-4 text-neutral-400">
        <Icon className="h-5 w-5" />
      </div>
      <p className="text-[10px] font-bold tracking-[0.2em] text-neutral-400 uppercase mb-1">
        {title}
      </p>
      <p className="text-xl font-semibold text-neutral-900">{time}</p>
    </div>
  );
}

function ValueCard({ icon: Icon, title, desc, index }: { icon: any, title: string, desc: string, index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="group p-10 bg-white rounded-[2.5rem] border border-neutral-100/50 shadow-lg shadow-neutral-200/20 hover:shadow-2xl hover:shadow-neutral-200/40 transition-all duration-500 hover:-translate-y-2"
    >
      <div className="h-14 w-14 rounded-2xl bg-neutral-900 flex items-center justify-center mb-8 text-white group-hover:rotate-6 transition-transform">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-2xl font-semibold text-neutral-900 mb-4">{title}</h3>
      <p className="text-neutral-500 font-light leading-relaxed">{desc}</p>
    </motion.div>
  );
}

function LocationItem({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <div className="flex gap-6">
      <div className="h-12 w-12 rounded-2xl bg-neutral-50 flex items-center justify-center shrink-0 border border-neutral-100">
        <Icon className="h-5 w-5 text-neutral-400 group-hover:text-neutral-900 transition-colors" />
      </div>
      <div>
        <h4 className="font-bold text-neutral-900 mb-1">{title}</h4>
        <p className="text-neutral-500 font-light leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}
