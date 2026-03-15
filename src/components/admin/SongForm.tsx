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
    author: initialData?.author || "",
    lyrics: initialData?.lyrics || "",
    category: initialData?.category || "Worship",
    language: initialData?.language || "Hindi",
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
        ? `/api/v1/admin/songs/${initialData._id}` 
        : "/api/v1/admin/songs";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(isEditing ? "Song updated" : "Song created");
        router.push("/admin/songs");
        router.refresh();
      } else {
        toast.error(data.error.message);
      }
    } catch (error) {
      toast.error("An error occurred");
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
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="font-serif text-3xl font-bold text-neutral-900">
              {isEditing ? "Edit Song" : "Add New Song"}
            </h1>
            <p className="mt-1 text-neutral-500">
              Fill in the details for your digital hymnbook entry.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            className="rounded-xl"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="rounded-xl gap-2 shadow-lg shadow-neutral-200"
          >
            <Save className="h-4 w-4" />
            {loading ? "Saving..." : "Save Song"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-semibold text-neutral-700 flex items-center gap-2">
                <Type className="h-4 w-4 text-neutral-400" />
                Song Title
              </Label>
              <Input
                id="title"
                required
                placeholder="Enter song title..."
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="h-12 rounded-xl border-neutral-200 focus-visible:ring-neutral-900"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-neutral-700 flex items-center gap-2">
                Lyrics (Rich Text)
              </Label>
              <Editor
                content={formData.lyrics}
                onChange={(content) => setFormData({ ...formData, lyrics: content })}
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm space-y-6">
            <h3 className="flex items-center gap-2 font-serif text-lg font-bold text-neutral-900">
              <Settings className="h-5 w-5 text-neutral-400" />
              Metadata
            </h3>

            <div className="space-y-2">
              <Label htmlFor="songNumber" className="text-sm font-semibold text-neutral-700">
                Song/Hymn Number
              </Label>
              <Input
                id="songNumber"
                placeholder="e.g. 101, A-42"
                value={formData.songNumber}
                onChange={(e) => setFormData({ ...formData, songNumber: e.target.value })}
                className="rounded-xl border-neutral-200"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="author" className="text-sm font-semibold text-neutral-700">
                Author / Composer
              </Label>
              <Input
                id="author"
                placeholder="Name or source"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                className="rounded-xl border-neutral-200"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-neutral-700 flex items-center gap-2">
                <Layout className="h-4 w-4 text-neutral-400" />
                Category
              </Label>
              <Select
                value={formData.category}
                onValueChange={(val) => setFormData({ ...formData, category: val })}
              >
                <SelectTrigger className="rounded-xl border-neutral-200">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="Worship">Worship</SelectItem>
                  <SelectItem value="Praise">Praise</SelectItem>
                  <SelectItem value="Christmas">Christmas</SelectItem>
                  <SelectItem value="Lent">Lent / Easter</SelectItem>
                  <SelectItem value="Hymn">Hymn</SelectItem>
                  <SelectItem value="Special">Special Songs</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-neutral-700 flex items-center gap-2">
                <Globe className="h-4 w-4 text-neutral-400" />
                Language
              </Label>
              <Select
                value={formData.language}
                onValueChange={(val) => setFormData({ ...formData, language: val })}
              >
                <SelectTrigger className="rounded-xl border-neutral-200">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="Hindi">Hindi</SelectItem>
                  <SelectItem value="English">English</SelectItem>
                  <SelectItem value="Odia">Odia</SelectItem>
                  <SelectItem value="Both">Bilingual</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-neutral-700 flex items-center gap-2">
                <TagIcon className="h-4 w-4 text-neutral-400" />
                Tags
              </Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Add tag..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                  className="rounded-xl border-neutral-200"
                />
                <Button type="button" variant="outline" onClick={addTag} className="rounded-xl">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {formData.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1 rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-600"
                  >
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)}>
                      <X className="h-3 w-3 hover:text-red-500" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
              <span className="text-sm font-semibold text-neutral-700">Live Session / Current Set</span>
              <Switch
                checked={formData.isLive}
                onCheckedChange={(checked: boolean) => 
                  setFormData({ ...formData, isLive: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
              <span className="text-sm font-semibold text-neutral-700">Visible to Public</span>
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
    </form>
  );
}

// Ensure Switch is available
import { Toggle as ButtonToggle } from "@/components/ui/toggle";
