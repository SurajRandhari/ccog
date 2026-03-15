import type { Metadata } from "next";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";

export const metadata: Metadata = {
  title: {
    default: "Calvary Church of God",
    template: "%s | Calvary Church of God",
  },
};

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-16 md:pt-20">{children}</main>
      <Footer />
    </>
  );
}
