import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getDifficultyColor = (difficulty: string) => {
  switch (difficulty?.toLowerCase()) {
    case "easy":
      return "text-green-600 bg-green-50 border-green-200";
    case "medium":
      return "text-yellow-600 bg-yellow-50 border-yellow-200";
    case "hard":
      return "text-red-600 bg-red-50 border-red-200";
    default:
      return "text-gray-600 bg-gray-50 border-gray-200";
  }
};

export const getLevelColor = (level: string) => {
  switch (level?.toLowerCase()) {
    case "beginner":
      return "text-green-600 bg-green-50 border-green-200";
    case "intermediate":
      return "text-yellow-600 bg-yellow-50 border-yellow-200";
    case "advanced":
      return "text-red-600 bg-red-50 border-red-200";
    default:
      return "text-gray-600 bg-gray-50 border-gray-200";
  }
};

export const getScoreColor = (score: number) => {
  if (score >= 8) return "from-emerald-500 to-green-500";
  if (score >= 6) return "from-blue-500 to-indigo-500";
  if (score >= 4) return "from-yellow-500 to-orange-500";
  if (score >= 2) return "from-orange-500 to-red-500";
  return "from-red-500 to-red-600";
};

export const getOverallRating = (score: number) => {
  if (score >= 8)
    return {
      text: "Excellent",
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      emoji: "🌟",
    };
  if (score >= 6)
    return {
      text: "Good",
      color: "text-blue-600",
      bg: "bg-blue-50",
      emoji: "👍",
    };
  if (score >= 4)
    return {
      text: "Fair",
      color: "text-yellow-600",
      bg: "bg-yellow-50",
      emoji: "📈",
    };
  if (score >= 2)
    return {
      text: "Needs Work",
      color: "text-orange-600",
      bg: "bg-orange-50",
      emoji: "💪",
    };
  return {
    text: "Keep Going",
    color: "text-red-600",
    bg: "bg-red-50",
    emoji: "🚀",
  };
};

export const getCategoryConfig = (category: string) => {
  const configs = {
    accuracy: {
      icon: "🎯",
      color: "blue",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      textColor: "text-blue-800",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    fluency: {
      icon: "🌊",
      color: "green",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      textColor: "text-green-800",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
    consistency: {
      icon: "⚖️",
      color: "purple",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      textColor: "text-purple-800",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    overall: {
      icon: "🎉",
      color: "emerald",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
      textColor: "text-emerald-800",
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
    },
  };
  return configs[category as keyof typeof configs];
};

export function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined) {
    return true;
  }

  if (typeof value === "string") {
    return value.trim().length === 0;
  }

  if (Array.isArray(value)) {
    return value.length === 0;
  }

  if (typeof value === "object") {
    return Object.keys(value as Record<string, unknown>).length === 0;
  }

  if (typeof value === "number") {
    return false; // Numbers are never empty unless null/undefined
  }

  return false; // Other types
}
