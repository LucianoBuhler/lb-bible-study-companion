import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatVerseReference(book: string, chapter: number, verse: number): string {
  return `${book} ${chapter}:${verse}`
}

export function highlightText(text: string, searchTerm: string): string {
  if (!searchTerm) return text
  const regex = new RegExp(`(${searchTerm})`, 'gi')
  return text.replace(regex, '<span class="search-highlight">$1</span>')
}