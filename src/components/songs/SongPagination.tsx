"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SongPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number | ((p: number) => number)) => void;
}

export function SongPagination({ page, totalPages, onPageChange }: SongPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-4 mt-16">
      <Button
        variant="outline"
        size="sm"
        disabled={page === 1}
        onClick={() => onPageChange((p) => p - 1)}
        className="rounded-xl h-11 px-5 gap-2 border-neutral-200"
      >
        <ChevronLeft className="h-4 w-4" /> Previous
      </Button>
      <span className="text-sm font-medium text-neutral-500">
        Page {page} of {totalPages}
      </span>
      <Button
        variant="outline"
        size="sm"
        disabled={page === totalPages}
        onClick={() => onPageChange((p) => p + 1)}
        className="rounded-xl h-11 px-5 gap-2 border-neutral-200"
      >
        Next <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
