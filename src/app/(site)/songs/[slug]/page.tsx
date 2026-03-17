import { Music, ArrowLeft, ArrowRight, Share2, Printer, Languages } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import Song from "@/models/Song";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  await connectDB();
  const song = await Song.findOne({ slug: slug, status: "published" });
  if (!song) return {};

  return {
    title: `${song.title} | Song Book | Calvary Church of God`,
    description: `Read the lyrics of ${song.title} from the Calvary Church Song Book.`,
    openGraph: {
      title: `${song.title} | Calvary Song Book`,
      description: `Spiritual hymn: ${song.title}`,
    },
  };
}

export default async function SongDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  await connectDB();
  const song = await Song.findOne({ slug: slug, status: "published" });

  if (!song) {
    notFound();
  }

  // Fetch Next/Prev songs (by number)
  const prevSong = await Song.findOne({ 
    songNumber: { $lt: song.songNumber }, 
    status: "published" 
  }).sort({ songNumber: -1 });

  const nextSong = await Song.findOne({ 
    songNumber: { $gt: song.songNumber }, 
    status: "published" 
  }).sort({ songNumber: 1 });

  return (
    <div className="min-h-screen bg-white text-neutral-900 selection:bg-neutral-900 selection:text-white pb-32">
      {/* Sticky Premium Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-neutral-100 shadow-sm shadow-neutral-100/20">
        <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4 min-w-0">
            <Link 
              href="/songs"
              className="p-2 -ml-2 rounded-full hover:bg-neutral-50 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-neutral-400" />
            </Link>
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 leading-none mb-1">
                Hymn #{song.songNumber?.toString().padStart(3, "0")}
              </span>
              <h2 className="text-lg font-semibold text-neutral-900 truncate tracking-tight">
                {song.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
             <Badge variant="outline" className="hidden sm:flex rounded-full px-3 py-0.5 text-[10px] uppercase font-bold tracking-widest border-neutral-100 text-neutral-400">
                {song.language}
              </Badge>
            <Link href={`/songs/presentation/${song.slug}`}>
                 <Button variant="outline" size="sm" className="rounded-full h-9 px-4 text-[10px] font-bold uppercase tracking-widest gap-2 bg-neutral-900 text-white border-none hover:bg-neutral-800 hover:text-white transition-all shadow-lg shadow-neutral-200">
                    <Eye className="h-3 w-3" /> Presentation
                </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-[700px] mx-auto px-6 pt-20">
        <MotionDivWrapper>
            {/* Main Title Area */}
            <div className="flex flex-col items-center text-center mb-20">
                 <div className="w-16 h-16 rounded-3xl bg-neutral-50 flex items-center justify-center font-mono text-2xl font-bold text-neutral-200 mb-8 border border-neutral-100/50">
                    {song.songNumber?.toString().padStart(3, "0")}
                </div>
                <h1 className="text-4xl md:text-6xl font-semibold tracking-tight leading-tight text-neutral-900 mb-6">
                    {song.title}
                </h1>
                <div className="flex items-center gap-3">
                    <Badge variant="outline" className="rounded-full px-4 py-1 text-[10px] uppercase font-bold tracking-[0.2em] border-neutral-100 text-neutral-400">
                        {song.language}
                    </Badge>
                </div>
            </div>

            <Separator className="bg-neutral-100 mb-20 max-w-[100px] mx-auto h-1 rounded-full" />

            {/* Lyrics Content */}
            <article 
            className="prose prose-neutral max-w-none mb-32 prose-p:my-6 prose-headings:font-serif"
            style={{ fontFeatureSettings: "'ss01', 'ss02'" }}
            >
            <div 
                className="text-2xl md:text-3xl leading-[1.8] text-neutral-800 font-light flex flex-col gap-8 text-center"
                dangerouslySetInnerHTML={{ __html: song.lyrics }}
            />
            </article>

            <Separator className="bg-neutral-100 mb-12" />

            {/* Bottom Navigation */}
            <div className="grid grid-cols-2 gap-8 pt-8">
            {prevSong ? (
                <Link 
                href={`/songs/${prevSong.slug}`}
                className="group flex flex-col items-start gap-3 p-6 rounded-3xl hover:bg-neutral-50 transition-all border border-transparent hover:border-neutral-100"
                >
                <span className="text-[10px] font-bold text-neutral-300 uppercase tracking-widest flex items-center gap-2">
                    <ArrowLeft className="h-3 w-3" /> Previous
                </span>
                <span className="text-lg font-medium group-hover:text-neutral-900 transition-colors line-clamp-1">
                    #{prevSong.songNumber?.toString().padStart(3, "0")} {prevSong.title}
                </span>
                </Link>
            ) : <div />}

            {nextSong ? (
                <Link 
                href={`/songs/${nextSong.slug}`}
                className="group flex flex-col items-end gap-3 p-6 rounded-3xl hover:bg-neutral-50 transition-all border border-transparent hover:border-neutral-100 text-right"
                >
                <span className="text-[10px] font-bold text-neutral-300 uppercase tracking-widest flex items-center gap-2">
                    Next <ArrowRight className="h-3 w-3" />
                </span>
                <span className="text-lg font-medium group-hover:text-neutral-900 transition-colors line-clamp-1">
                    #{nextSong.songNumber?.toString().padStart(3, "0")} {nextSong.title}
                </span>
                </Link>
            ) : <div />}
            </div>
        </MotionDivWrapper>
      </main>
    </div>
  );
}

// Simple wrapper since this is a server component
function MotionDivWrapper({ children }: { children: React.ReactNode }) {
    return <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000 ease-out fill-mode-both">{children}</div>;
}

import { Eye } from "lucide-react";
