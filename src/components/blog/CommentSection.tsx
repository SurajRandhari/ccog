"use client";

import { useState, useEffect, useCallback } from "react";
import { MessageSquare, Send, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

interface Comment {
  _id: string;
  name: string;
  content: string;
  createdAt: string;
}

interface CommentSectionProps {
  blogId: string;
}

export function CommentSection({ blogId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchComments = useCallback(async () => {
    try {
      const res = await fetch(`/api/blogs/${blogId}/comments`);
      const data = await res.json();
      if (data.success) {
        setComments(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch comments", error);
    } finally {
      setIsLoading(false);
    }
  }, [blogId]);

  useEffect(() => {
    fetchComments();
    
    // Autofill name from localStorage if available
    const savedName = localStorage.getItem("comment_name");
    if (savedName) setName(savedName);
  }, [fetchComments]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !content.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/blogs/${blogId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, content }),
      });

      const data = await res.json();
      if (data.success) {
        setComments((prev) => [data.data, ...prev]);
        setContent("");
        localStorage.setItem("comment_name", name);
        toast.success("Comment posted successfully!");
      } else {
        toast.error(data.message || "Failed to post comment");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-32 pt-32 border-t border-neutral-100">
      <div className="flex items-center gap-3 mb-12">
        <div className="p-3 bg-neutral-900 rounded-2xl text-white">
          <MessageSquare className="h-6 w-6" />
        </div>
        <h2 className="text-3xl font-serif font-bold text-neutral-900">
          Comments ({comments.length})
        </h2>
      </div>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="mb-20 bg-neutral-50 p-8 rounded-[2rem] border border-neutral-100">
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label htmlFor="name" className="block text-xs font-bold text-neutral-400 uppercase tracking-widest mb-2 ml-1">
              Your Name
            </label>
            <Input
              id="name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-white rounded-xl border-neutral-200 h-12"
              required
            />
          </div>
          <div>
            <label htmlFor="content" className="block text-xs font-bold text-neutral-400 uppercase tracking-widest mb-2 ml-1">
              Your Comment
            </label>
            <Textarea
              id="content"
              placeholder="What are your thoughts?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="bg-white rounded-xl border-neutral-200 min-h-[120px] resize-none"
              required
            />
          </div>
          <div className="flex justify-end">
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-neutral-900 text-white rounded-full px-8 h-12 font-bold transition-all hover:scale-105 active:scale-95"
            >
              {isSubmitting ? "POSTING..." : "POST COMMENT"}
              <Send className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-12">
        {isLoading ? (
          <div className="py-20 text-center text-neutral-400 font-medium">Loading comments...</div>
        ) : comments.length === 0 ? (
          <div className="py-20 text-center text-neutral-500 bg-neutral-50 rounded-[2rem] border border-dashed border-neutral-200">
            <p className="font-medium">No comments yet. Be the first to share your thoughts!</p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {comments.map((comment) => (
              <motion.div
                key={comment._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-6 group"
              >
                <div className="flex-shrink-0">
                  <div className="h-14 w-14 rounded-2xl bg-neutral-100 flex items-center justify-center text-neutral-400 group-hover:bg-neutral-900 group-hover:text-white transition-colors">
                    <User className="h-6 w-6" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-bold text-neutral-900">{comment.name}</h3>
                    <span className="w-1 h-1 rounded-full bg-neutral-200" />
                    <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                      {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-neutral-600 leading-relaxed">
                    {comment.content}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
