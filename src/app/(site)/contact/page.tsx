import type { Metadata } from "next";
import ContactPageClient from "./page.client";

export const metadata: Metadata = {
  title: "Contact & Directions",
  description: "Find directions to Calvary Church of God in Nagarnar, Jagdalpur. Contact us for prayer requests, inquiries, or more information about our services.",
};

export default function ContactPage() {
  return <ContactPageClient />;
}
