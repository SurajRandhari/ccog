import Link from "next/link";
import { Separator } from "@/components/ui/separator";

const footerLinks = [
  {
    title: "About",
    links: [
      { href: "/about", label: "Our Church" },
      { href: "/about/pastor", label: "Our Pastor" },
      { href: "/about/membership", label: "Membership" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "/resources/sermons", label: "Sermons" },
      { href: "/resources/devotions", label: "Daily Devotions" },
      { href: "/resources/blog", label: "Blog" },
      { href: "/resources/songs", label: "Songs" },
    ],
  },
  {
    title: "Connect",
    links: [
      { href: "/events", label: "Events" },
      { href: "/contact", label: "Contact Us" },
      { href: "/about/connect", label: "I'm New Here" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-neutral-50">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12">
                <img
                  src="/images/logo.png"
                  alt="Calvary Church of God Logo"
                  className="h-full w-full object-contain"
                />
              </div>
              <div>
                <h3 className="font-serif text-xl font-semibold tracking-tight text-neutral-900">
                  Calvary
                </h3>
                <p className="text-xs font-light tracking-widest text-neutral-500 uppercase">
                  Church of God
                </p>
              </div>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-neutral-500">
              A community of faith, hope, and love. Join us as we grow together
              in the grace and knowledge of our Lord Jesus Christ.
            </p>
          </div>

          {/* Link columns */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h4 className="text-sm font-semibold tracking-wide text-neutral-900 uppercase">
                {section.title}
              </h4>
              <ul className="mt-4 space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-neutral-500 transition-colors hover:text-neutral-900"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-10" />

        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-neutral-400">
            &copy; {new Date().getFullYear()} Calvary Church of God. All rights
            reserved.
          </p>
          <p className="text-xs text-neutral-400">
            Built with ❤️ for the glory of God
          </p>
        </div>
      </div>
    </footer>
  );
}
