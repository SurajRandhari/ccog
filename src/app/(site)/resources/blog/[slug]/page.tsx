import { Metadata } from "next";
import { connectDB } from "@/lib/mongodb";
import Blog from "@/models/Blog";
import { notFound } from "next/navigation";
import { Calendar, User, ArrowLeft, Tag } from "lucide-react";
import Link from "next/link";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  await connectDB();
  const post = await Blog.findOne({ slug, published: true });
  
  if (!post) return { title: "Post Not Found" };

  return {
    title: post.metaTitle || `${post.title} | Blog`,
    description: post.metaDescription || post.content.replace(/<[^>]*>?/gm, '').substring(0, 160),
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  await connectDB();
  const post = await Blog.findOne({ slug, published: true });

  if (!post) {
    notFound();
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Sticky Top Nav */}
      <nav className="sticky top-0 z-40 border-b border-neutral-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between lg:px-8">
          <Link 
            href="/resources/blog" 
            className="flex items-center gap-2 text-sm font-bold text-neutral-500 hover:text-neutral-900 transition-colors uppercase tracking-widest"
          >
            <ArrowLeft className="h-4 w-4" />
            BACK TO BLOG
          </Link>
        </div>
      </nav>

      <main className="py-20 lg:py-32">
        <article className="mx-auto max-w-4xl px-6 lg:px-8">
          {/* Hero Header */}
          <header className="mb-20">
            <div className="flex items-center gap-4 text-xs font-bold text-neutral-400 uppercase tracking-widest mb-8">
                <span className="flex items-center gap-1.5 bg-neutral-50 px-3 py-1.5 rounded-full border border-neutral-100">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
                <span className="flex items-center gap-1.5 bg-neutral-50 px-3 py-1.5 rounded-full border border-neutral-100">
                    <User className="h-3.5 w-3.5" />
                    {post.author}
                </span>
                 {post.tags?.length > 0 && (
                  <span className="flex items-center gap-1.5 bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full border border-blue-100">
                      <Tag className="h-3.5 w-3.5" />
                      {post.tags[0]}
                  </span>
                )}
            </div>

            <h1 className="font-serif text-4xl font-semibold tracking-tight text-neutral-900 sm:text-6xl mb-12 leading-tight">
                {post.title}
            </h1>

            {post.coverImage && (
              <div className="relative aspect-[21/9] w-full overflow-hidden rounded-[3rem] bg-neutral-100 mb-16 shadow-2xl shadow-neutral-200/50">
                <img 
                  src={post.coverImage} 
                  alt={post.title} 
                  className="w-full h-full object-cover" 
                />
              </div>
            )}
          </header>

          {/* Content */}
          <div className="mx-auto max-w-3xl">
             <div 
              className="prose prose-neutral prose-xl max-w-none text-neutral-800 leading-relaxed font-light
                         [&>p]:mb-8 [&>h2]:font-serif [&>h2]:text-3xl [&>h2]:font-semibold [&>h2]:mt-16 [&>h2]:mb-8 [&>h2]:text-neutral-900
                         [&>ul]:my-8 [&>ul]:space-y-4 [&>ul>li]:text-neutral-700
                         [&>blockquote]:border-l-4 [&>blockquote]:border-neutral-200 [&>blockquote]:pl-6 [&>blockquote]:italic [&>blockquote]:font-serif [&>blockquote]:text-2xl [&>blockquote]:text-neutral-600 [&>blockquote]:my-12
                         selection:bg-neutral-900 selection:text-white"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        </article>
      </main>
    </div>
  );
}
