import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Video Sermons",
  description:
    "Watch sermons from Calvary Church of God — explore our sermon library and series.",
};

export default function SermonsPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">
      <h1 className="font-serif text-4xl font-semibold tracking-tight text-neutral-900 sm:text-5xl">
        Sermons
      </h1>
      <p className="mt-6 text-lg leading-relaxed text-neutral-500">
        Watch our latest messages and explore past series.
      </p>
      <div className="mt-12 text-center text-sm text-neutral-400">
        Sermons will appear here once added via the CMS.
      </div>
    </div>
  );
}
