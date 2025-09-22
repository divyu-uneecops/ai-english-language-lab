import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getDifficultyColor = (difficulty: string) => {
  switch (difficulty.toLowerCase()) {
    case "easy":
    case "beginner":
      return "text-green-600 bg-green-50 border-green-200";
    case "medium":
    case "intermediate":
      return "text-yellow-600 bg-yellow-50 border-yellow-200";
    case "hard":
    case "advanced":
      return "text-red-600 bg-red-50 border-red-200";
    default:
      return "text-gray-600 bg-gray-50 border-gray-200";
  }
};
