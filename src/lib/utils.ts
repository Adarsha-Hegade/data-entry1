import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getScoreColor(score: number): string {
  if (score >= 96) return 'bg-green-900 text-white';
  if (score >= 86) return 'bg-green-600 text-white';
  if (score >= 76) return 'bg-green-400 text-white';
  if (score >= 66) return 'bg-yellow-400';
  if (score >= 51) return 'bg-orange-500 text-white';
  if (score >= 26) return 'bg-red-500 text-white';
  return 'bg-red-900 text-white';
}