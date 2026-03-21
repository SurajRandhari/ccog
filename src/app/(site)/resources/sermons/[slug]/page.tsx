import { connectDB } from "@/lib/mongodb";
import Sermon from "@/models/Sermon";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { Calendar, User, Clock, ChevronLeft, Play, FileText, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { InteractiveHoverButton } from "@/components/magicui/interactive-hover-button";
import { ArrowRight } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

async function getSermon(slug: string) {
  await connectDB();
  return await Sermon.findOne({ slug }).lean();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const sermon = await getSermon(slug);
  if (!sermon) return { title: "Sermon Not Found" };

  return {
    title: `${sermon.title} | Calvary Church of God`,
    description: sermon.description,
  };
}

export default async function SermonDetailPage({ params }: Props) {
  const { slug } = await params;
  const sermon: any = await getSermon(slug);

  if (!sermon) notFound();

  // Extract YouTube ID
  const getYoutubeId = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const videoId = getYoutubeId(sermon.videoUrl);

  return (
    <div className="bg-white min-h-screen">
      {/* Navigation */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 pt-12 md:pt-16">
        <Link 
          href="/resources/sermons" 
          className="inline-flex items-center text-sm font-bold uppercase tracking-widest text-neutral-400 hover:text-neutral-900 transition-colors group"
        >
          <ChevronLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Sermons
        </Link>
      </div>

      <article className="mx-auto max-w-7xl px-6 lg:px-8 py-12">
        {/* Header */}
        <header className="max-w-4xl mb-12">
          <div className="flex items-center gap-4 mb-8">
            <span className="inline-flex items-center rounded-full bg-blue-50 px-4 py-1.5 text-[10px] font-bold text-blue-500 uppercase tracking-widest border border-blue-100 uppercase">
                {sermon.tags?.[0] || 'Sermon'}
            </span>
            <span className="text-neutral-300">/</span>
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
                {new Date(sermon.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
          <h1 className="font-serif text-5xl font-semibold tracking-tight text-neutral-900 sm:text-6xl mb-8 leading-[1.1]">
            {sermon.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-10">
            <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400">
                    <User className="h-6 w-6" />
                </div>
                <div>
                    <p className="text-[10px] uppercase tracking-widest font-bold text-neutral-400">Speaker</p>
                    <p className="text-base font-semibold text-neutral-900">{sermon.speaker}</p>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400">
                    <Calendar className="h-6 w-6" />
                </div>
                <div>
                    <p className="text-[10px] uppercase tracking-widest font-bold text-neutral-400">Date</p>
                    <p className="text-base font-semibold text-neutral-900">
                        {new Date(sermon.date).toLocaleDateString()}
                    </p>
                </div>
            </div>
          </div>
        </header>

        {/* Video Player Section */}
        {videoId && (
            <section className="mb-16 md:mb-24">
                <div className="aspect-video w-full overflow-hidden rounded-[3rem] bg-neutral-900 shadow-3xl ring-1 ring-neutral-200">
                    <iframe
                        width="100%"
                        height="100%"
                        src={`https://www.youtube.com/embed/${videoId}?rel=0&showinfo=0&autoplay=0`}
                        title={sermon.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="h-full w-full"
                    />
                </div>
            </section>
        )}

        {/* Content Section */}
        <div className="grid lg:grid-cols-3 gap-20">
            <div className="lg:col-span-2 space-y-12">
                {/* Description */}
                <div className="prose prose-xl prose-neutral max-w-none italic text-neutral-600 font-light border-l-4 border-blue-500/20 pl-8 leading-relaxed">
                    {sermon.description}
                </div>

                {/* Full Text Content */}
                {sermon.content ? (
                    <div className="space-y-8 pt-12 border-t border-neutral-100">
                        <div className="flex items-center gap-4 text-blue-600">
                            <FileText className="h-6 w-6" />
                            <h3 className="font-serif text-2xl font-semibold">Transcript & Notes</h3>
                        </div>
                        <div 
                            className="prose prose-lg prose-neutral max-w-none text-neutral-700 leading-extra-relaxed
                                       [&_p]:mb-6 [&_h2]:font-serif [&_h2]:text-3xl [&_h2]:mt-12 [&_h2]:mb-6
                                       [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-8
                                       [&_li]:mb-3 [&_blockquote]:italic [&_blockquote]:border-l-4
                                       [&_blockquote]:border-neutral-200 [&_blockquote]:pl-6
                                      "
                            dangerouslySetInnerHTML={{ __html: sermon.content }}
                        />
                    </div>
                ) : (
                    sermon.videoUrl && (
                        <div className="pt-12 border-t border-neutral-100 text-neutral-400 italic font-light">
                            No transcript available for this message.
                        </div>
                    )
                )}
            </div>

            {/* Sidebar / Info */}
            <aside className="space-y-12">
                <div className="bg-neutral-50 rounded-[2.5rem] p-10 border border-neutral-100 sticky top-32">
                    <h4 className="font-serif text-xl font-semibold text-neutral-900 mb-6">Series Tags</h4>
                    <div className="flex flex-wrap gap-2 mb-10">
                        {sermon.tags?.map((tag: string) => (
                            <span key={tag} className="px-4 py-2 bg-white rounded-xl text-xs font-bold text-neutral-500 uppercase tracking-widest border border-neutral-200">
                                {tag}
                            </span>
                        ))}
                    </div>
                    
                    <div className="space-y-4">
                        <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest border-b border-neutral-200 pb-4 mb-6">Share this message</p>
                        <div className="flex gap-4">
                            <Button variant="outline" className="flex-1 h-14 rounded-2xl gap-2 hover:bg-neutral-900 hover:text-white transition-all">
                                <Share2 className="h-4 w-4" />
                                Share
                            </Button>
                        </div>
                    </div>
                </div>
            </aside>
        </div>
      </article>

      {/* Footer CTA */}
      <section className="bg-neutral-950 py-24 sm:py-32 overflow-hidden relative">
        <div className="absolute inset-0 z-0 opacity-20">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(59,130,246,0.2),transparent_50%)]" />
        </div>
        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10 text-center">
            <h2 className="font-serif text-4xl font-semibold text-white sm:text-5xl mb-8">Ready to join our community?</h2>
            <p className="text-xl text-neutral-400 font-light max-w-2xl mx-auto mb-12 leading-relaxed">
                Connect with us this Sunday and experience the power of God's word in person.
            </p>
            <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-center">
                <Link href="/about/connect">
                    <InteractiveHoverButton className="w-64 bg-white text-neutral-900 border-none">
                        I&apos;m New Here
                    </InteractiveHoverButton>
                </Link>
                <Link href="/about/membership">
                    <Button 
                        variant="outline" 
                        className="group h-12 rounded-full px-8 border-white bg-transparent text-white hover:bg-white hover:text-neutral-900 transition-all duration-300 cursor-pointer"
                    >
                        Become a Member
                        <ArrowRight className="ml-2 h-4 w-4 text-white/40 group-hover:text-neutral-900 transition-colors" />
                    </Button>
                </Link>
            </div>
        </div>
      </section>
    </div>
  );
}
