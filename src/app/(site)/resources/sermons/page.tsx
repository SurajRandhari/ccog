import type { Metadata } from "next";
import SermonsPageClient from "./page.client";

export const metadata: Metadata = {
  title: "Spirit-Filled Sermons",
  description: "Explore our archive of spirit-filled messages and sermon series from Calvary Church of God, Nagarnar. Watch and grow in the Word.",
};

export default function SermonsPage() {
  return <SermonsPageClient />;
}
