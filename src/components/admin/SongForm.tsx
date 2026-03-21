"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Save,
  ArrowLeft,
  Settings,
  Globe,
  Type,
  User,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import Editor from "./Editor";
import { toast } from "sonner";

interface SongFormProps {
  initialData?: any;
  isEditing?: boolean;
}

export default function SongForm({ initialData, isEditing }: SongFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    songNo: initialData?.songNo ?? initialData?.songNumber ?? "",
    lyrics: initialData?.lyrics || "",
    category: initialData?.category || "Worship",
    language: initialData?.language || "English",
    author: initialData?.author || "",
    isPublished: initialData?.isPublished ?? false,
    status: initialData?.status || "active",
  });

  const [autoSlug, setAutoSlug] = useState("");

  // Auto-generate slug when title changes
  useEffect(() => {
    if (formData.title) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
      setAutoSlug(slug);
    } else {
      setAutoSlug("");
    }
  }, [formData.title]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const url = isEditing
        ? `/api/songs/${initialData._id}`
        : "/api/songs";
      const method = isEditing ? "PUT" : "POST";

      const payload = {
        ...formData,
        songNo: formData.songNo ? Number(formData.songNo) : null,
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(
          isEditing ? "Song updated successfully" : "Song created successfully"
        );
        router.push("/admin/songs");
        router.refresh();
      } else {
        toast.error(data.message || "Failed to save song");
      }
    } catch (error) {
      toast.error("An error occurred while saving");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-20">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between px-6 lg:px-0">
        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="rounded-full h-10 w-10 border border-neutral-100 bg-white"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="font-serif text-3xl font-bold text-neutral-900 leading-tight">
              {isEditing ? "Edit Song" : "Add New Song"}
            </h1>
            <p className="mt-1 text-sm text-neutral-500 font-light">
              {isEditing
                ? "Update song details and lyrics."
                : "Create a new song entry for the hymn book."}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.back()}
            className="rounded-xl text-neutral-500 font-medium"
          >
            Discard
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="rounded-xl h-12 px-6 gap-2 bg-neutral-900 shadow-xl shadow-neutral-200"
          >
            {loading ? (
              "Saving..."
            ) : (
              <>
                <Save className="h-4 w-4" /> Save Entry
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 px-6 lg:px-0">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-[2.5rem] border border-neutral-100 bg-white p-10 shadow-sm space-y-8">
            <div className="space-y-3">
              <Label
                htmlFor="title"
                className="text-xs font-bold uppercase tracking-widest text-neutral-400 flex items-center gap-2"
              >
                <Type className="h-3 w-3" />
                Song Title
              </Label>
              <Input
                id="title"
                required
                placeholder="Amazing Grace..."
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="h-14 rounded-2xl border-neutral-100 bg-neutral-50/50 focus:bg-white text-lg font-medium transition-all"
              />
              {autoSlug && (
                <p className="text-xs text-neutral-400 pl-1">
                  Slug: <span className="font-mono text-neutral-500">{autoSlug}</span>
                </p>
              )}
            </div>

            <div className="space-y-3">
              <Label className="text-xs font-bold uppercase tracking-widest text-neutral-400 flex items-center gap-2">
                Lyrics Content
              </Label>
              <p className="text-[11px] text-neutral-400">
                Use headings for sections (Verse, Chorus, Bridge) for future presentation mode.
              </p>
              <div className="rounded-2xl border border-neutral-100 overflow-hidden">
                <Editor
                  content={formData.lyrics}
                  onChange={(content) =>
                    setFormData({ ...formData, lyrics: content })
                  }
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="rounded-[2.5rem] border border-neutral-100 bg-white p-10 shadow-sm space-y-8">
            <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-neutral-400">
              <Settings className="h-3 w-3" />
              Configuration
            </h3>

            <div className="space-y-3">
              <Label
                htmlFor="songNo"
                className="text-xs font-bold uppercase tracking-widest text-neutral-400"
              >
                Song Number
              </Label>
              <Input
                id="songNo"
                type="number"
                placeholder="001"
                value={formData.songNo}
                onChange={(e) =>
                  setFormData({ ...formData, songNo: e.target.value })
                }
                className="h-12 rounded-xl border-neutral-100 bg-neutral-50/50"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-xs font-bold uppercase tracking-widest text-neutral-400 flex items-center gap-2">
                <Globe className="h-3 w-3" />
                Language
              </Label>
              <Select
                value={formData.language}
                onValueChange={(val) =>
                  setFormData({ ...formData, language: val })
                }
              >
                <SelectTrigger className="h-12 rounded-xl border-neutral-100 bg-neutral-50/50">
                  <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-neutral-100">
                  <SelectItem value="Hindi">Hindi</SelectItem>
                  <SelectItem value="English">English</SelectItem>
                  <SelectItem value="Odia">Odia</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label className="text-xs font-bold uppercase tracking-widest text-neutral-400">
                Category
              </Label>
              <Select
                value={formData.category}
                onValueChange={(val) =>
                  setFormData({ ...formData, category: val })
                }
              >
                <SelectTrigger className="h-12 rounded-xl border-neutral-100 bg-neutral-50/50">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-neutral-100">
                  <SelectItem value="Worship">Worship</SelectItem>
                  <SelectItem value="Praise">Praise</SelectItem>
                  <SelectItem value="Christmas">Christmas</SelectItem>
                  <SelectItem value="Lent">Lent</SelectItem>
                  <SelectItem value="Hymn">Hymn</SelectItem>
                  <SelectItem value="Special Songs">Special Songs</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator className="bg-neutral-50" />

            <div className="space-y-3">
              <Label className="text-xs font-bold uppercase tracking-widest text-neutral-400 flex items-center gap-2">
                <User className="h-3 w-3" />
                Author (Optional)
              </Label>
              <Input
                placeholder="John Newton..."
                value={formData.author}
                onChange={(e) =>
                  setFormData({ ...formData, author: e.target.value })
                }
                className="h-12 rounded-xl border-neutral-100 bg-neutral-50/50"
              />
            </div>

            <Separator className="bg-neutral-50" />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">
                  Published
                </span>
                <Switch
                  checked={formData.isPublished}
                  onCheckedChange={(checked: boolean) =>
                    setFormData({ ...formData, isPublished: checked })
                  }
                />
              </div>
              <p className="text-[11px] text-neutral-400">
                {formData.isPublished
                  ? "Song is visible on the public site."
                  : "Song is hidden from the public site."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
