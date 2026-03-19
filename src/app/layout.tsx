import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Calvary Church of God | Nagarnar - Jagdalpur, Bastar",
    template: "%s | Calvary Church of God",
  },
  description:
    "Calvary Church of God in Nagarnar (Jagdalpur, Bastar, Chhattisgarh) is a vibrant community of the Indian Pentecostal Church. Join us for worship, spirit-filled sermons, and fellowship. 494001.",
  keywords: [
    "Calvary Church of God",
    "Church in Nagarnar",
    "Church in Jagdalpur",
    "Church in Bastar",
    "Church in Chhattisgarh",
    "Indian Pentecostal Church",
    "IPC Nagarnar",
    "Pastor Suresh Randhari",
    "Christian Church Jagdalpur",
  ],
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://ccog-nagarnar.vercel.app"
  ),
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Calvary Church of God",
    title: "Calvary Church of God | Nagarnar - Jagdalpur",
    description: "Welcome to Calvary Church of God, Nagarnar. A spirit-filled Indian Pentecostal Church in Jagdalpur, Bastar.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "PlaceOfWorship",
              "name": "Calvary Church of God",
              "description": "Indian Pentecostal Church in Nagarnar, Jagdalpur, Bastar, Chhattisgarh.",
              "url": "https://ccog-nagarnar.vercel.app",
              "logo": "https://ccog-nagarnar.vercel.app/images/logo.png",
              "image": "https://ccog-nagarnar.vercel.app/images/site/hero.png",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Nagarnar",
                "addressLocality": "Jagdalpur",
                "addressRegion": "Chhattisgarh",
                "postalCode": "494001",
                "addressCountry": "IN"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": "19.100750",
                "longitude": "82.175194"
              },
              "openingHours": [
                "Su 10:00-13:00",
                "We 19:00-21:00",
                "Fr 19:00-21:00"
              ]
            })
          }}
        />
        {children}
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}
