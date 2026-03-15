import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Daily Devotions",
  description: "Read daily devotionals from Calvary Church of God.",
};

export default function DevotionsPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">
      <h1 className="font-serif text-4xl font-semibold tracking-tight text-neutral-900 sm:text-5xl">
        Daily Devotions
      </h1>
      <p className="mt-6 text-lg leading-relaxed text-neutral-500">
        Daily encouragement from the Word of God.
      </p>
      <div className="mt-12 text-center text-sm text-neutral-400">
        Devotions will appear here once added via the CMS.
      </div>
    </div>
  );
}
