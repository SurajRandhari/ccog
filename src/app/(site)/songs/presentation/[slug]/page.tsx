import { notFound } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import Song from "@/models/Song";
import PresentationContent from "./PresentationContent";

export default async function PresentationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  await connectDB();
  const song = await Song.findOne({ slug: slug, status: "published" });

  if (!song) {
    notFound();
  }

  // Fetch Next/Prev songs for navigation
  const prevSong = await Song.findOne({ 
    songNumber: { $lt: song.songNumber }, 
    status: "published" 
  }).sort({ songNumber: -1 });

  const nextSong = await Song.findOne({ 
    songNumber: { $gt: song.songNumber }, 
    status: "published" 
  }).sort({ songNumber: 1 });

  return (
    <PresentationContent 
      song={{
        title: song.title,
        lyrics: song.lyrics,
        songNumber: Number(song.songNumber),
        slug: song.slug
      }} 
      nextSlug={nextSong?.slug}
      prevSlug={prevSong?.slug}
    />
  );
}
