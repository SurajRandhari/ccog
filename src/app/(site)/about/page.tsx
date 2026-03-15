import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Our Church",
  description:
    "Learn about Calvary Church of God — our mission, vision, values, and history.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-24 lg:px-8 lg:py-32">
      <h1 className="font-serif text-4xl font-semibold tracking-tight text-neutral-900 sm:text-5xl">
        Our Church
      </h1>
      <p className="mt-6 text-lg leading-relaxed text-neutral-500">
        Calvary Church of God is a vibrant community of believers united by
        faith, hope, and love. We exist to glorify God and make disciples of all
        nations.
      </p>
    </div>
  );
}
