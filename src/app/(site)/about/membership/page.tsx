import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Membership",
  description: "Discover how to become a member of Calvary Church of God.",
};

export default function MembershipPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-24 lg:px-8 lg:py-32">
      <h1 className="font-serif text-4xl font-semibold tracking-tight text-neutral-900 sm:text-5xl">
        Membership
      </h1>
      <p className="mt-6 text-lg leading-relaxed text-neutral-500">
        We invite you to become part of our church family. Learn about our
        membership process and upcoming classes.
      </p>
    </div>
  );
}
