import { Metadata } from "next";
import { connectDB } from "@/lib/mongodb";
import Devotion from "@/models/Devotion";
import { notFound } from "next/navigation";
import { Calendar, User, BookOpen, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { InteractiveHoverButton } from "@/components/magicui/interactive-hover-button";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  await connectDB();
  const devotion = await Devotion.findOne({ slug, status: "published" });
  if (!devotion) return { title: "Devotion Not Found" };

  return {
    title: `${devotion.title} | Daily Devotions`,
    description: devotion.scripture,
  };
}

export default async function DevotionDetailPage({ params }: Props) {
  const { slug } = await params;
  await connectDB();
  const devotion = await Devotion.findOne({ slug, status: "published" });

  if (!devotion) {
    notFound();
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Sticky Top Nav */}
      <nav className="sticky top-0 z-40 border-b border-neutral-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between lg:px-8">
          <Link 
            href="/resources/devotions" 
            className="flex items-center gap-2 text-sm font-bold text-neutral-500 hover:text-neutral-900 transition-colors uppercase tracking-widest"
          >
            <ArrowLeft className="h-4 w-4" />
            BACK TO DEVOTIONS
          </Link>
        </div>
      </nav>

      <main className="py-20 lg:py-32">
        <article className="mx-auto max-w-3xl px-6 lg:px-8">
          {/* Hero Header */}
          <header className="text-center mb-20 lg:mb-32">
            <div className="flex justify-center mb-8">
                <div className="h-20 w-20 flex items-center justify-center rounded-[2rem] bg-neutral-900 text-white shadow-2xl shadow-neutral-200">
                    <BookOpen className="h-10 w-10" />
                </div>
            </div>
            
            <div className="flex items-center justify-center gap-4 text-xs font-bold text-neutral-400 uppercase tracking-widest mb-8">
                <span className="flex items-center gap-1.5 bg-neutral-50 px-3 py-1.5 rounded-full border border-neutral-100">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date(devotion.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
                <span className="flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5" />
                    {devotion.author}
                </span>
            </div>

            <h1 className="font-serif text-5xl font-semibold tracking-tight text-neutral-900 sm:text-7xl mb-12 leading-tight">
                {devotion.title}
            </h1>

            <div className="relative p-10 lg:p-14 rounded-[3rem] border border-neutral-100 bg-neutral-50/30 overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                    <BookOpen className="h-64 w-64" />
                </div>
                <div className="relative text-2xl font-serif italic text-neutral-600 leading-relaxed max-w-xl mx-auto">
                    "{devotion.scripture}"
                </div>
            </div>
          </header>

          {/* Devotion Content */}
          <div 
            className="prose prose-neutral prose-xl max-w-none text-neutral-800 leading-relaxed font-light selection:bg-neutral-900 selection:text-white"
            dangerouslySetInnerHTML={{ __html: devotion.content }}
          />

          {/* Footer Action */}
          <footer className="mt-32 pt-20 border-t border-neutral-100 text-center">
            <h3 className="font-serif text-3xl font-semibold text-neutral-900 mb-4">Finding Grace Daily</h3>
            <p className="text-neutral-500 mb-10 max-w-md mx-auto">We hope this reflection strengthened your spirit today. Join us again tomorrow.</p>
            <Link href="/resources/devotions">
                <InteractiveHoverButton className="w-64 bg-white text-neutral-900 border-neutral-100">
                    Explore Archive
                </InteractiveHoverButton>
            </Link>
          </footer>
        </article>
      </main>
    </div>
  );
}
