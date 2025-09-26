"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  BookOpen,
  MessageCircle,
  CheckCircle,
  Clock,
  ChevronRight,
  Loader2,
  Star,
  Filter,
  Trophy,
  Target,
  Brain,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { readingService } from "@/services/readingService";
import { getDifficultyColor, getLevelColor } from "@/lib/utils";

// Internal Story interface
interface Story {
  passage_id: string;
  title: string;
  level: string;
  difficulty: string;
  readTime?: string;
  passage: string;
}

interface PaginatedResponse {
  page: number;
  page_size: number;
  total: number;
  results: Story[];
}

export function ReadingInterface() {
  const router = useRouter();
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showLevelDialog, setShowLevelDialog] = useState<boolean>(true);
  const [selectedLevel, setSelectedLevel] = useState<
    "beginner" | "intermediate" | "advanced" | "ai" | null
  >(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<
    "easy" | "medium" | "hard" | null
  >(null);
  const [showDifficultyDialog, setShowDifficultyDialog] =
    useState<boolean>(false);
  const [filters, setFilters] = useState({
    status: {
      solved: false,
      unsolved: false,
    },
    level: {
      beginner: false,
      intermediate: false,
      advanced: false,
    },
    difficulty: {
      easy: false,
      medium: false,
      hard: false,
    },
  });
  const [userStats] = useState({
    points: 0,
    nextStar: 35,
  });

  // Helper function to extract selected filter values
  const getSelectedFilters = () => {
    const selectedLevel = Object.entries(filters.level).find(
      ([_, isSelected]) => isSelected
    )?.[0];
    const selectedDifficulty = Object.entries(filters.difficulty).find(
      ([_, isSelected]) => isSelected
    )?.[0];

    return {
      level: selectedLevel || undefined,
      difficulty: selectedDifficulty || undefined,
    };
  };

  // Fetch stories from API
  useEffect(() => {
    const fetchStories = async () => {
      try {
        setLoading(true);
        setError(null);

        const { level, difficulty } = getSelectedFilters();

        const params = {
          page: 1,
          page_size: 10,
          level: level,
          difficulty: difficulty,
        };
        const paginatedData: PaginatedResponse =
          await readingService.fetchStories(params);

        // Transform the API data to match our interface
        const transformedStories: Story[] = paginatedData?.results;

        setStories(transformedStories);
      } catch (err) {
        console.error("Error fetching stories:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch stories"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, [filters]);

  // Open level selection dialog on first mount
  useEffect(() => {
    setShowLevelDialog(true);
  }, []);

  const applyLevel = (
    level: "beginner" | "intermediate" | "advanced" | "ai"
  ) => {
    setSelectedLevel(level);
    setShowLevelDialog(false);

    // If level is "ai", skip difficulty selection
    if (level === "ai") {
      router.push(`/reading/d11f52d3-85c6-4a86-93d3-88304ebfb6ca`);
    } else {
      // Show difficulty selection for other levels
      setShowDifficultyDialog(true);
    }
  };

  const applyDifficulty = (difficulty: "easy" | "medium" | "hard") => {
    setSelectedDifficulty(difficulty);
    setShowDifficultyDialog(false);
    router.push(`/reading/d11f52d3-85c6-4a86-93d3-88304ebfb6ca`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-8">
          {/* Left Section - Header and Story Cards */}
          <div className="flex-1">
            {/* Header Section */}
            <div className="mb-8">
              <div className="space-y-2 mb-6">
                {/* Breadcrumb Navigation */}
                <nav className="flex items-center space-x-2 text-sm text-gray-500">
                  <Link
                    href="/dashboard"
                    className="hover:text-orange-600 transition-colors font-medium"
                  >
                    Prepare
                  </Link>
                  <ChevronRight className="h-4 w-4" />
                  <span className="text-gray-900 font-semibold">Reading</span>
                </nav>

                {/* Page Title */}
                <h1 className="text-2xl font-bold text-gray-900">
                  Reading Practice
                </h1>
              </div>
            </div>

            {/* Main Content Area */}
            {/* Loading State - Enhanced */}
            {loading && (
              <div className="flex items-center justify-center py-16">
                <div className="text-center bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
                  <div className="p-4 bg-gradient-to-r from-orange-100 to-orange-200 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Loading stories...
                  </h3>
                  <p className="text-gray-600">
                    Please wait while we fetch the content
                  </p>
                </div>
              </div>
            )}

            {/* Error State - Enhanced */}
            {error && (
              <div className="text-center py-16">
                <div className="max-w-md mx-auto bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
                  <div className="p-4 bg-gradient-to-r from-red-100 to-pink-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <MessageCircle className="h-8 w-8 text-red-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Unable to load stories
                  </h3>
                  <p className="text-gray-600 mb-6">{error}</p>
                  <button
                    onClick={() => window?.location?.reload()}
                    className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            )}

            {/* Stories List - Similar to coding challenges */}
            {!loading && !error && (
              <div className="space-y-4">
                {stories?.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20 max-w-md mx-auto">
                      <div className="p-4 bg-gradient-to-r from-gray-100 to-blue-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                        <BookOpen className="h-8 w-8 text-gray-500" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        No stories available
                      </h3>
                      <p className="text-gray-600">
                        Check back later for new reading materials
                      </p>
                    </div>
                  </div>
                ) : (
                  stories.map((story) => (
                    <Card
                      key={story?.passage_id}
                      className="group relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-white/20 hover:border-orange-200/50 hover:scale-[1.02]"
                      onClick={() =>
                        router.push(`/reading/${story?.passage_id}`)
                      }
                    >
                      {/* Gradient overlay for visual appeal */}
                      <div className="absolute inset-0 bg-gradient-to-br from-orange-50/30 via-transparent to-orange-100/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                      <div className="relative p-6">
                        {/* Header with star and badges */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-full group-hover:scale-110 transition-transform duration-200">
                              <Star className="h-4 w-4 text-yellow-600" />
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge
                                variant="outline"
                                className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${getLevelColor(
                                  story?.level
                                )} shadow-sm`}
                              >
                                {story?.level}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge
                                variant="outline"
                                className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${getDifficultyColor(
                                  story?.difficulty
                                )} shadow-sm`}
                              >
                                {story?.difficulty}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        {/* Story title */}
                        <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors duration-200 line-clamp-1">
                          {story?.title}
                        </h3>

                        {/* Story description */}
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                          {story?.passage}
                        </p>

                        {/* Stats and metadata */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-full">
                              <Trophy className="h-3 w-3 text-yellow-500" />
                              <span className="font-medium">Max Score: 10</span>
                            </div>

                            <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-full">
                              <Clock className="h-3 w-3 text-orange-500" />
                              <span className="font-medium">
                                {story?.readTime || "5 Min"}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Action button */}
                        <div className="flex justify-end">
                          <Button
                            size="sm"
                            className="px-6 py-2 text-sm font-semibold rounded-full transition-all duration-200 shadow-md hover:shadow-lg bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
                          >
                            Start Reading
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Right Section - User Progress Stats and Filters */}
          <div className="w-80 space-y-6">
            {/* User Progress Stats */}
            <Card className="p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20">
              <div className="text-center">
                <div className="flex items-center justify-center mb-3">
                  <div className="p-3 bg-gradient-to-r from-orange-100 to-orange-200 rounded-full">
                    <Trophy className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
                <div className="text-sm text-gray-600 mb-2 font-medium">
                  {userStats.nextStar - userStats.points} more points to get
                  your first star!
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-center space-x-4 text-sm">
                    <div className="flex items-center space-x-1 text-gray-500">
                      <BookOpen className="h-4 w-4" />
                      <span className="font-semibold">Points:</span>
                      <span className="font-bold text-gray-900">
                        {userStats.points}/{userStats.nextStar}
                      </span>
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                    <div
                      className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${
                          (userStats.points / userStats.nextStar) * 100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Enhanced Filters */}
            <Card className="p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg">
                  <Filter className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Filters</h3>
              </div>

              {/* Status Filter */}
              <div className="mb-8">
                <h4 className="text-sm font-bold text-gray-800 mb-4 uppercase tracking-wide flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  STATUS
                </h4>
                <div className="space-y-3">
                  <label className="group flex items-center space-x-3 p-3 rounded-lg hover:bg-green-50 transition-all duration-200 cursor-pointer border border-transparent hover:border-green-200">
                    <input
                      type="checkbox"
                      checked={filters?.status?.solved}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          status: {
                            ...filters?.status,
                            solved: e?.target?.checked,
                          },
                        })
                      }
                      className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
                    />
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-700 group-hover:text-green-700">
                        Solved
                      </span>
                    </div>
                  </label>
                  <label className="group flex items-center space-x-3 p-3 rounded-lg hover:bg-orange-50 transition-all duration-200 cursor-pointer border border-transparent hover:border-orange-200">
                    <input
                      type="checkbox"
                      checked={filters?.status?.unsolved}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          status: {
                            ...filters?.status,
                            unsolved: e?.target?.checked,
                          },
                        })
                      }
                      className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500 focus:ring-2"
                    />
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-700 group-hover:text-orange-700">
                        Unsolved
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Level Filter */}
              <div className="mb-8">
                <h4 className="text-sm font-bold text-gray-800 mb-4 uppercase tracking-wide flex items-center gap-2">
                  <Brain className="h-4 w-4 text-blue-500" />
                  LEVEL
                </h4>
                <div className="space-y-3">
                  <label className="group flex items-center space-x-3 p-3 rounded-lg hover:bg-green-50 transition-all duration-200 cursor-pointer border border-transparent hover:border-green-200">
                    <input
                      type="checkbox"
                      checked={filters?.level?.beginner}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          level: {
                            ...filters?.level,
                            beginner: e?.target?.checked,
                          },
                        })
                      }
                      className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
                    />
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-700 group-hover:text-green-700">
                        Beginner
                      </span>
                    </div>
                  </label>
                  <label className="group flex items-center space-x-3 p-3 rounded-lg hover:bg-yellow-50 transition-all duration-200 cursor-pointer border border-transparent hover:border-yellow-200">
                    <input
                      type="checkbox"
                      checked={filters.level.intermediate}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          level: {
                            ...filters?.level,
                            intermediate: e?.target?.checked,
                          },
                        })
                      }
                      className="w-4 h-4 text-yellow-600 bg-gray-100 border-gray-300 rounded focus:ring-yellow-500 focus:ring-2"
                    />
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-700 group-hover:text-yellow-700">
                        Intermediate
                      </span>
                    </div>
                  </label>
                  <label className="group flex items-center space-x-3 p-3 rounded-lg hover:bg-red-50 transition-all duration-200 cursor-pointer border border-transparent hover:border-red-200">
                    <input
                      type="checkbox"
                      checked={filters?.level?.advanced}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          level: {
                            ...filters?.level,
                            advanced: e?.target?.checked,
                          },
                        })
                      }
                      className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500 focus:ring-2"
                    />
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-700 group-hover:text-red-700">
                        Advanced
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Difficulty Filter */}
              <div>
                <h4 className="text-sm font-bold text-gray-800 mb-4 uppercase tracking-wide flex items-center gap-2">
                  <Target className="h-4 w-4 text-red-500" />
                  DIFFICULTY
                </h4>
                <div className="space-y-3">
                  <label className="group flex items-center space-x-3 p-3 rounded-lg hover:bg-green-50 transition-all duration-200 cursor-pointer border border-transparent hover:border-green-200">
                    <input
                      type="checkbox"
                      checked={filters.difficulty.easy}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          difficulty: {
                            ...filters?.difficulty,
                            easy: e?.target?.checked,
                          },
                        })
                      }
                      className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
                    />
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-700 group-hover:text-green-700">
                        Easy
                      </span>
                    </div>
                  </label>
                  <label className="group flex items-center space-x-3 p-3 rounded-lg hover:bg-yellow-50 transition-all duration-200 cursor-pointer border border-transparent hover:border-yellow-200">
                    <input
                      type="checkbox"
                      checked={filters.difficulty.medium}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          difficulty: {
                            ...filters?.difficulty,
                            medium: e?.target?.checked,
                          },
                        })
                      }
                      className="w-4 h-4 text-yellow-600 bg-gray-100 border-gray-300 rounded focus:ring-yellow-500 focus:ring-2"
                    />
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-700 group-hover:text-yellow-700">
                        Medium
                      </span>
                    </div>
                  </label>
                  <label className="group flex items-center space-x-3 p-3 rounded-lg hover:bg-red-50 transition-all duration-200 cursor-pointer border border-transparent hover:border-red-200">
                    <input
                      type="checkbox"
                      checked={filters?.difficulty?.hard}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          difficulty: {
                            ...filters?.difficulty,
                            hard: e?.target?.checked,
                          },
                        })
                      }
                      className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500 focus:ring-2"
                    />
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-700 group-hover:text-red-700">
                        Hard
                      </span>
                    </div>
                  </label>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Level Selection Dialog */}
      <Dialog open={showLevelDialog} onOpenChange={setShowLevelDialog}>
        <DialogContent className="sm:max-w-lg p-0 overflow-hidden rounded-2xl shadow-2xl border-0">
          <div className="relative p-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_left,_#fff,_transparent_50%)]"></div>
            <div className="relative z-10 text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-xs font-semibold mb-3">
                <BookOpen className="h-4 w-4" />
                Reading Practice
              </div>
              <DialogTitle className="text-2xl font-extrabold tracking-tight text-white">
                Choose Your Reading Level
              </DialogTitle>
              <DialogDescription className="text-white/90 text-sm mt-1">
                Pick a level to get a random challenge at that difficulty
              </DialogDescription>
            </div>
          </div>
          <div className="p-6 bg-white">
            <div className="grid grid-cols-1 gap-3">
              <button
                className="group w-full text-left flex items-center gap-3 p-4 rounded-xl border border-green-200 hover:border-green-300 hover:shadow-md transition-all bg-gradient-to-br from-green-50 to-white"
                onClick={() => applyLevel("beginner")}
              >
                <div className="p-2 rounded-lg bg-green-100 text-green-700 group-hover:scale-110 transition-transform">
                  <Star className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">Beginner</div>
                  <div className="text-xs text-gray-600">
                    Short passages, simple vocabulary
                  </div>
                </div>
              </button>

              <button
                className="group w-full text-left flex items-center gap-3 p-4 rounded-xl border border-yellow-200 hover:border-yellow-300 hover:shadow-md transition-all bg-gradient-to-br from-yellow-50 to-white"
                onClick={() => applyLevel("intermediate")}
              >
                <div className="p-2 rounded-lg bg-yellow-100 text-yellow-700 group-hover:scale-110 transition-transform">
                  <Target className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">
                    Intermediate
                  </div>
                  <div className="text-xs text-gray-600">
                    Balanced challenge and comprehension
                  </div>
                </div>
              </button>

              <button
                className="group w-full text-left flex items-center gap-3 p-4 rounded-xl border border-red-200 hover:border-red-300 hover:shadow-md transition-all bg-gradient-to-br from-red-50 to-white"
                onClick={() => applyLevel("advanced")}
              >
                <div className="p-2 rounded-lg bg-red-100 text-red-700 group-hover:scale-110 transition-transform">
                  <Trophy className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">Advanced</div>
                  <div className="text-xs text-gray-600">
                    Longer texts, complex structures
                  </div>
                </div>
              </button>

              <button
                className="group w-full text-left flex items-center gap-3 p-4 rounded-xl border border-blue-200 hover:border-blue-300 hover:shadow-md transition-all bg-gradient-to-br from-blue-50 to-white"
                onClick={() => applyLevel("ai")}
              >
                <div className="p-2 rounded-lg bg-blue-100 text-blue-700 group-hover:scale-110 transition-transform">
                  <Brain className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">
                    Let AI Decide
                  </div>
                  <div className="text-xs text-gray-600">
                    AI selects a suitable level and a random challenge
                  </div>
                </div>
              </button>
            </div>

            <div className="mt-5 flex items-center justify-center gap-4">
              <Button
                variant="ghost"
                className="text-gray-600 hover:text-gray-900"
                onClick={() => setShowLevelDialog(false)}
              >
                Skip for now
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Difficulty Selection Dialog */}
      <Dialog
        open={showDifficultyDialog}
        onOpenChange={setShowDifficultyDialog}
      >
        <DialogContent className="sm:max-w-lg p-0 overflow-hidden rounded-2xl shadow-2xl border-0">
          <div className="relative p-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_left,_#fff,_transparent_50%)]"></div>
            <div className="relative z-10 text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-xs font-semibold mb-3">
                <Target className="h-4 w-4" />
                Difficulty Selection
              </div>
              <DialogTitle className="text-2xl font-extrabold tracking-tight text-white">
                Choose Difficulty Level
              </DialogTitle>
              <DialogDescription className="text-white/90 text-sm mt-1">
                Select the difficulty for your {selectedLevel} reading practice
              </DialogDescription>
            </div>
          </div>
          <div className="p-6 bg-white">
            <div className="grid grid-cols-1 gap-3">
              <button
                className="group w-full text-left flex items-center gap-3 p-4 rounded-xl border border-green-200 hover:border-green-300 hover:shadow-md transition-all bg-gradient-to-br from-green-50 to-white"
                onClick={() => applyDifficulty("easy")}
              >
                <div className="p-2 rounded-lg bg-green-100 text-green-700 group-hover:scale-110 transition-transform">
                  <Star className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">Easy</div>
                  <div className="text-xs text-gray-600">
                    Simple vocabulary and short sentences
                  </div>
                </div>
              </button>

              <button
                className="group w-full text-left flex items-center gap-3 p-4 rounded-xl border border-yellow-200 hover:border-yellow-300 hover:shadow-md transition-all bg-gradient-to-br from-yellow-50 to-white"
                onClick={() => applyDifficulty("medium")}
              >
                <div className="p-2 rounded-lg bg-yellow-100 text-yellow-700 group-hover:scale-110 transition-transform">
                  <Target className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">Medium</div>
                  <div className="text-xs text-gray-600">
                    Moderate complexity with some challenging words
                  </div>
                </div>
              </button>

              <button
                className="group w-full text-left flex items-center gap-3 p-4 rounded-xl border border-red-200 hover:border-red-300 hover:shadow-md transition-all bg-gradient-to-br from-red-50 to-white"
                onClick={() => applyDifficulty("hard")}
              >
                <div className="p-2 rounded-lg bg-red-100 text-red-700 group-hover:scale-110 transition-transform">
                  <Trophy className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">Hard</div>
                  <div className="text-xs text-gray-600">
                    Complex vocabulary and advanced structures
                  </div>
                </div>
              </button>
            </div>

            <div className="mt-5 flex items-center justify-center gap-4">
              <Button
                variant="ghost"
                className="text-gray-600 hover:text-gray-900"
                onClick={() => setShowDifficultyDialog(false)}
              >
                Back to Level Selection
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
