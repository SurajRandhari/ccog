"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface LikeButtonProps {
  blogId: string;
  initialLikes: number;
}

export function LikeButton({ blogId, initialLikes }: LikeButtonProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [hasLiked, setHasLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if user has liked (from localStorage for guests)
    const likedPosts = JSON.parse(localStorage.getItem("liked_posts") || "[]");
    setHasLiked(likedPosts.includes(blogId));
  }, [blogId]);

  const handleLike = async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const res = await fetch(`/api/blogs/${blogId}/like`, {
        method: "POST",
      });

      const data = await res.json();

      if (data.success) {
        setLikes(data.likes);
        setHasLiked(data.hasLiked);
        
        const likedPosts = JSON.parse(localStorage.getItem("liked_posts") || "[]");
        if (data.hasLiked) {
          localStorage.setItem("liked_posts", JSON.stringify([...likedPosts, blogId]));
        } else {
          localStorage.setItem("liked_posts", JSON.stringify(likedPosts.filter((id: string) => id !== blogId)));
        }
      } else {
        toast.error("Failed to update like");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "h-16 w-16 rounded-full border border-neutral-100 bg-white transition-all hover:bg-red-50 hover:text-red-500",
          hasLiked && "text-red-500 bg-red-50 border-red-100"
        )}
        onClick={handleLike}
        disabled={isLoading}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={hasLiked ? "liked" : "unliked"}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Heart 
              className={cn("h-8 w-8", hasLiked && "fill-current")} 
            />
          </motion.div>
        </AnimatePresence>
      </Button>
      <span className="text-sm font-bold text-neutral-500 tabular-nums">
        {likes} {likes === 1 ? 'LIKE' : 'LIKES'}
      </span>
    </div>
  );
}
