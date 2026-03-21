import { connectDB } from "@/lib/mongodb";
import Song from "@/models/Song";
import { notFound } from "next/navigation";
import SongDetailClient from "./SongDetailClient";
import { isValidObjectId } from "mongoose";

export default async function SongDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  await connectDB();

  const query: any = { status: "active", isPublished: true };
  
  if (isValidObjectId(slug)) {
    query.$or = [{ slug: slug }, { _id: slug }];
  } else {
    query.slug = slug;
  }

  const song = await Song.findOne(query);

  if (!song) {
    notFound();
  }

  // Fetch previous and next songs by songNo
  let prevSong = null;
  let nextSong = null;

  if (song.songNo) {
    const prev = await Song.findOne({
      songNo: { $lt: song.songNo },
      language: song.language,
      status: "active",
      isPublished: true,
    })
      .sort({ songNo: -1 })
      .select("slug title songNo");

    const next = await Song.findOne({
      songNo: { $gt: song.songNo },
      language: song.language,
      status: "active",
      isPublished: true,
    })
      .sort({ songNo: 1 })
      .select("slug title songNo");

    if (prev) {
      prevSong = { slug: prev.slug, title: prev.title, songNo: prev.songNo };
    }
    if (next) {
      nextSong = { slug: next.slug, title: next.title, songNo: next.songNo };
    }
  }

  // Convert Mongoose doc to plain object for Client Component
  const songData = {
    title: song.title,
    songNo: song.songNo,
    category: song.category,
    language: song.language,
    lyrics: song.lyrics,
    author: song.author || "",
  };

  return (
    <SongDetailClient
      song={songData}
      prevSong={prevSong}
      nextSong={nextSong}
    />
  );
}
