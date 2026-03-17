"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Save, 
  X, 
  ArrowLeft,
  Settings,
  Globe,
  Tag as TagIcon,
  Layout,
  Type
} from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import Editor from "./Editor";
import { toast } from "sonner";
import { SongInput } from "@/lib/validations/song";

interface SongFormProps {
  initialData?: any;
  isEditing?: boolean;
}

export default function SongForm({ initialData, isEditing }: SongFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    songNumber: initialData?.songNumber || "",
    lyrics: initialData?.lyrics || "",
    category: initialData?.category || "hymn",
    language: initialData?.language || "English",
    tags: initialData?.tags || [],
    status: initialData?.status || "published",
    isLive: initialData?.isLive || false,
  });

  const [tagInput, setTagInput] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const url = isEditing 
        ? `/api/songs/${initialData._id}` 
        : "/api/songs";
      const method = isEditing ? "PUT" : "POST";

      // Ensure songNumber is a number
      const payload = {
        ...formData,
        songNumber: formData.songNumber ? Number(formData.songNumber) : null
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(isEditing ? "Song updated successfully" : "Song created successfully");
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

  const addTag = () => {
    if (tagInput && !formData.tags.includes(tagInput)) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput] });
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter((t: string) => t !== tag) });
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
              {isEditing ? "Edit Song" : "Add Song Book"}
            </h1>
            <p className="mt-1 text-sm text-neutral-500 font-light">
              Create a premium digital hymn book entry.
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
            {loading ? "Saving..." : <><Save className="h-4 w-4" /> Save Entry</>}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 px-6 lg:px-0">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-[2.5rem] border border-neutral-100 bg-white p-10 shadow-sm space-y-8">
            <div className="space-y-3">
              <Label htmlFor="title" className="text-xs font-bold uppercase tracking-widest text-neutral-400 flex items-center gap-2">
                <Type className="h-3 w-3" />
                Song Title
              </Label>
              <Input
                id="title"
                required
                placeholder="Amazing Grace..."
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="h-14 rounded-2xl border-neutral-100 bg-neutral-50/50 focus:bg-white text-lg font-medium transition-all"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-xs font-bold uppercase tracking-widest text-neutral-400 flex items-center gap-2">
                Lyrics Content
              </Label>
              <div className="rounded-2xl border border-neutral-100 overflow-hidden">
                <Editor
                  content={formData.lyrics}
                  onChange={(content) => setFormData({ ...formData, lyrics: content })}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[2.5rem] border border-neutral-100 bg-white p-10 shadow-sm space-y-8">
            <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-neutral-400">
              <Settings className="h-3 w-3" />
              Configuration
            </h3>

            <div className="space-y-3">
              <Label htmlFor="songNumber" className="text-xs font-bold uppercase tracking-widest text-neutral-400">
                Song Number
              </Label>
              <Input
                id="songNumber"
                type="number"
                placeholder="001"
                value={formData.songNumber}
                onChange={(e) => setFormData({ ...formData, songNumber: e.target.value })}
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
                onValueChange={(val) => setFormData({ ...formData, language: val as any })}
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

            <div className="space-y-3 pt-4 border-t border-neutral-50">
              <Label className="text-xs font-bold uppercase tracking-widest text-neutral-400 flex items-center gap-2">
                <TagIcon className="h-3 w-3" />
                Tags
              </Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Hymn..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                  className="h-10 rounded-xl border-neutral-100 bg-neutral-50/50"
                />
                <Button type="button" variant="outline" onClick={addTag} className="rounded-xl h-10 border-neutral-100">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {formData.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1 rounded-full bg-neutral-50 border border-neutral-100 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-neutral-400"
                  >
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)}>
                      <X className="h-2.5 w-2.5 hover:text-red-500 transition-colors" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-4 pt-6 mt-6 border-t border-neutral-50">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">Live Set</span>
                <Switch
                  checked={formData.isLive}
                  onCheckedChange={(checked: boolean) => 
                    setFormData({ ...formData, isLive: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">Published</span>
                <Switch
                  checked={formData.status === "published"}
                  onCheckedChange={(checked: boolean) => 
                    setFormData({ ...formData, status: checked ? "published" : "draft" })
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

// Ensure Switch is available
import { Toggle as ButtonToggle } from "@/components/ui/toggle";
