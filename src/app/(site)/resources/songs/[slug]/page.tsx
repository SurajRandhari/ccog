import dbConnect from "@/lib/mongodb";
import Song from "@/models/Song";
import { notFound } from "next/navigation";
import SongDetailClient from "./SongDetailClient";

export default async function SongDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  await dbConnect();
  const song = await Song.findOne({ slug: slug, status: "published" });

  if (!song) {
      notFound();
  }

  // Convert Mongoose doc to plain object for Client Component
  const songData = {
    title: song.title,
    songNumber: song.songNumber,
    category: song.category,
    language: song.language,
    lyrics: song.lyrics,
    tags: song.tags ? [...song.tags] : [],
  };

  return <SongDetailClient song={songData} />;
}
