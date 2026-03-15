"use client";

import { useEffect, useState } from "react";
import SongForm from "@/components/admin/SongForm";
import { toast } from "sonner";
import { useParams } from "next/navigation";

export default function EditSongPage() {
  const params = useParams();
  const [song, setSong] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSong() {
      try {
        const res = await fetch(`/api/v1/admin/songs/${params.id}`);
        const data = await res.json();
        if (data.success) {
          setSong(data.data);
        } else {
          toast.error(data.error.message);
        }
      } catch (error) {
        toast.error("Failed to fetch song");
      } finally {
        setLoading(false);
      }
    }

    if (params.id) {
      fetchSong();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center text-neutral-400">
        Loading song data...
      </div>
    );
  }

  if (!song) {
    return (
      <div className="flex h-[400px] items-center justify-center text-red-500">
        Song not found
      </div>
    );
  }

  return <SongForm initialData={song} isEditing />;
}
