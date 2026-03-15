import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Getting Connected",
  description:
    "First-time visitor? Find out how to get connected with Calvary Church of God.",
};

export default function ConnectPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-24 lg:px-8 lg:py-32">
      <h1 className="font-serif text-4xl font-semibold tracking-tight text-neutral-900 sm:text-5xl">
        I&apos;m New Here
      </h1>
      <p className="mt-6 text-lg leading-relaxed text-neutral-500">
        Welcome! We&apos;re so glad you&apos;re considering visiting us. Here&apos;s
        everything you need to know for your first visit.
      </p>
    </div>
  );
}
