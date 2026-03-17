import { Music, ArrowLeft, Bookmark, Share2, Languages, Hash, Tag, User } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import dbConnect from "@/lib/mongodb";
import Song from "@/models/Song";
import { notFound } from "next/navigation";

export default async function SongDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  await dbConnect();
  const song = await Song.findOne({ slug: slug, status: "published" });

  if (!song) {
      notFound();
  }

  return (
    <div className="bg-white min-h-screen pb-32">
      {/* Navigation Header */}
      <nav className="sticky top-0 z-40 border-b border-neutral-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between lg:px-8">
          <Link 
            href="/resources/songs" 
            className="flex items-center gap-2 text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Song Book
          </Link>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Bookmark className="h-5 w-5 text-neutral-400" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Share2 className="h-5 w-5 text-neutral-400" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Header */}
      <section className="py-20 lg:py-24">
        <div className="mx-auto max-w-3xl px-6 lg:px-8 text-center">
            <div className="flex justify-center mb-8">
                <div className="h-16 w-16 flex items-center justify-center rounded-3xl bg-neutral-900 text-white shadow-xl shadow-neutral-200">
                    <Music className="h-8 w-8" />
                </div>
            </div>
            {song.songNumber && (
                <span className="inline-flex items-center rounded-full bg-neutral-100 px-4 py-1.5 text-xs font-bold text-neutral-500 uppercase tracking-widest mb-6 border border-neutral-200">
                    No. {song.songNumber}
                </span>
            )}
            <h1 className="font-serif text-5xl font-semibold tracking-tight text-neutral-900 sm:text-7xl mb-8">
                {song.title}
            </h1>
            
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-neutral-500">
                <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-neutral-300" />
                    <span className="font-medium text-neutral-700">{song.category}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Languages className="h-4 w-4 text-neutral-300" />
                    <span className="font-medium text-neutral-700">{song.language}</span>
                </div>
            </div>
        </div>
      </section>

      {/* Lyrics Content */}
      <section className="py-12">
        <div className="mx-auto max-w-2xl px-6 lg:px-8">
            <div className="rounded-[3rem] border border-neutral-100 bg-neutral-50/30 p-12 lg:p-20 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                    <Music className="h-64 w-64" />
                </div>
                <article 
                    className="prose prose-neutral prose-lg max-w-none text-neutral-800 leading-relaxed font-light whitespace-pre-wrap select-text"
                    dangerouslySetInnerHTML={{ __html: song.lyrics || "" }}
                />
            </div>
            
            {/* Tags Footer */}
            {song.tags && song.tags.length > 0 && (
                <div className="mt-16 flex flex-wrap gap-2 justify-center">
                    {song.tags.map((tag) => (
                        <span 
                            key={tag}
                            className="px-4 py-1.5 rounded-full bg-neutral-100 text-neutral-500 text-xs font-semibold tracking-wider hover:bg-neutral-200 transition-colors cursor-default"
                        >
                            #{tag.toLowerCase()}
                        </span>
                    ))}
                </div>
            )}
        </div>
      </section>

      {/* Footer Navigation */}
      <section className="mt-32 border-t border-neutral-100 py-20 bg-neutral-50/30">
        <div className="mx-auto max-w-3xl px-6 lg:px-8 text-center">
            <h3 className="font-serif text-2xl font-semibold text-neutral-900 mb-4">Want more songs?</h3>
            <p className="text-neutral-500 mb-8">Explore our full library of hymns and worship songs.</p>
            <Link href="/resources/songs">
                <Button className="rounded-2xl h-12 px-8 font-semibold shadow-lg shadow-neutral-200">
                    Back to Song Book
                </Button>
            </Link>
        </div>
      </section>
    </div>
  );
}
