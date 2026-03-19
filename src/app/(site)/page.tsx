import type { Metadata } from "next";
import HomePageClient from "./page.client";

export const metadata: Metadata = {
  title: {
    absolute: "Calvary Church of God | Nagarnar - Jagdalpur, Bastar",
  },
  description: "Official website of Calvary Church of God, Nagarnar. A spirit-filled Indian Pentecostal Church in Jagdalpur, Bastar, Chhattisgarh. Join us for worship and fellowship.",
};

export default function HomePage() {
  return <HomePageClient />;
}
