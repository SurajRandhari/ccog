import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Pastor",
  description: "Meet Rev. Suresh Randhari — the pastor of Calvary Church of God.",
};

export default function PastorPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-24 lg:px-8 lg:py-32">
      <h1 className="font-serif text-4xl font-semibold tracking-tight text-neutral-900 sm:text-5xl">
        Our Pastor
      </h1>
      <p className="mt-6 text-lg leading-relaxed text-neutral-500">
        Rev. Suresh Randhari leads Calvary Church of God with a heart for service,
        discipleship, and community.
      </p>
    </div>
  );
}
