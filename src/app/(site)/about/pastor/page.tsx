import type { Metadata } from "next";
import PastorPageClient from "./page.client";

export const metadata: Metadata = {
  title: "Rev. Suresh Randhari | Senior Pastor",
  description: "Meet Rev. Suresh Randhari, the Senior Pastor of Calvary Church of God, Nagarnar. A life dedicated to service, discipleship, and community transformation.",
};

export default function PastorPage() {
  return <PastorPageClient />;
}
