"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface ToggleProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  pressed: boolean;
  onPressedChange: (pressed: boolean) => void;
  size?: "sm" | "default" | "lg";
}

export function Toggle({ 
    pressed, 
    onPressedChange, 
    className, 
    size = "default",
    ...props 
}: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={pressed}
      onClick={() => onPressedChange(!pressed)}
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-neutral-100 hover:text-neutral-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 disabled:pointer-events-none disabled:opacity-50",
        pressed ? "bg-neutral-100 text-neutral-900" : "bg-transparent text-neutral-500",
        size === "sm" && "h-8 px-2",
        size === "default" && "h-9 px-3",
        size === "lg" && "h-10 px-3",
        className
      )}
      {...props}
    />
  );
}
