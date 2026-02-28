import React from "react"
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function parseHighlightedText(text: string) {
  if (!text) return null;
  const parts = text.split(/\*(.*?)\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <em key={i} className="text-highlight not-italic" >
        {part}
      </em>
    ) : (
      part
    )
  );
}
