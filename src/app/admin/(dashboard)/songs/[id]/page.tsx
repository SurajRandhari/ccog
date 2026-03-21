"use client";

import { useEffect, useState } from "react";
import SongForm from "@/components/admin/SongForm";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function EditSongPage() {
  const params = useParams();
  const [song, setSong] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSong() {
      try {
        const res = await fetch(`/api/songs/${params.id}`);
        const data = await res.json();
        if (data.success) {
          setSong(data.data);
        } else {
          toast.error(data.message || "Song not found");
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
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-neutral-400" />
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
