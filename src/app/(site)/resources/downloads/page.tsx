import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Downloads",
  description:
    "Download free resources from Calvary Church of God — study guides, PDFs, and more.",
};

export default function DownloadsPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">
      <h1 className="font-serif text-4xl font-semibold tracking-tight text-neutral-900 sm:text-5xl">
        Free Downloads
      </h1>
      <p className="mt-6 text-lg leading-relaxed text-neutral-500">
        Study guides, devotional PDFs, and printable resources.
      </p>
      <div className="mt-12 text-center text-sm text-neutral-400">
        Downloads will appear here once added via the CMS.
      </div>
    </div>
  );
}
