"use client";

import { motion } from "framer-motion";
import { Calendar, User, ArrowRight, Tag, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

export default function BlogPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/blogs?limit=10");
        const data = await res.json();
        if (data.success) {
          setPosts(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch blog posts");
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);
  return (
    <div className="bg-white">
      {/* Header */}
      <section className="relative overflow-hidden py-16 lg:py-24">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(0,0,0,0.05)_0%,transparent_50%)]" />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            custom={0}
            variants={fadeInUp}
            className="mx-auto max-w-2xl text-center"
          >
            <h1 className="font-serif text-4xl font-semibold tracking-tight text-neutral-900 sm:text-6xl">
              Church Blog
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-neutral-500">
              Articles, stories, and updates from our community, designed to inspire and inform your walk with God.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Grid Section */}
      <section className="bg-neutral-50 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {loading ? (
            <div className="flex min-h-[400px] items-center justify-center">
              <Loader2 className="h-10 w-10 animate-spin text-neutral-200" />
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-[3rem] border border-neutral-100">
               <p className="text-neutral-400 font-serif text-xl italic">No blog posts available at this time.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
              {posts.map((post, i) => (
                <motion.article
                  key={post._id}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i}
                  variants={fadeInUp}
                  className="group flex flex-col items-start"
                >
                  <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[2.5rem] bg-neutral-200 shadow-xl shadow-neutral-200/50">
                    <img
                      src={post.coverImage || "/images/site/vision.png"}
                      alt={post.title}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <div className="absolute top-6 left-6">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-4 py-1.5 text-xs font-bold text-neutral-900 backdrop-blur-sm shadow-sm">
                        <Tag className="h-3 w-3" />
                        {post.tags?.[0] || 'Article'}
                      </span>
                    </div>
                  </div>
                  <div className="mt-8">
                    <div className="flex items-center gap-4 text-sm text-neutral-400">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4" />
                        {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </span>
                      <span className="h-1 w-1 rounded-full bg-neutral-300" />
                      <span className="flex items-center gap-1.5">
                        <User className="h-4 w-4" />
                        {post.author}
                      </span>
                    </div>
                    <h2 className="mt-4 font-serif text-2xl font-semibold text-neutral-900 group-hover:text-neutral-700 lg:text-3xl">
                      <Link href={`/resources/blog/${post.slug}`}>{post.title}</Link>
                    </h2>
                    <p className="mt-4 text-lg leading-relaxed text-neutral-600 line-clamp-2">
                      {post.content.replace(/<[^>]*>?/gm, '').substring(0, 160)}...
                    </p>
                    <Link
                      href={`/resources/blog/${post.slug}`}
                      className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-neutral-900 transition-colors hover:text-neutral-600"
                    >
                      Read more
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
