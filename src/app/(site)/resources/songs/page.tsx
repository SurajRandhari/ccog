import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Songs",
  description: "Explore the song library of Calvary Church of God — lyrics, audio, and chords.",
};

export default function SongsPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">
      <h1 className="font-serif text-4xl font-semibold tracking-tight text-neutral-900 sm:text-5xl">
        Songs
      </h1>
      <p className="mt-6 text-lg leading-relaxed text-neutral-500">
        Browse our collection of worship songs and hymns.
      </p>
      <div className="mt-12 text-center text-sm text-neutral-400">
        Songs will appear here once added via the CMS.
      </div>
    </div>
  );
}
