"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Clock,
  ChevronRight,
  CheckCircle,
  Star,
  Filter,
  Trophy,
  Target,
  Brain,
  PenTool,
  Loader2,
  MessageCircle,
  X,
  RotateCcw,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { writingService } from "@/services/writingService";
import { getDifficultyColor, getLevelColor } from "@/lib/utils";
import { PaginatedResponse, WritingPrompt } from "../types";
import { writingTypeOptions } from "../constants";
import { FilterDialog, FilterCategory } from "@/components/shared/FilterDialog";

export function WritingInterface() {
  const router = useRouter();
  const [showLevelDialog, setShowLevelDialog] = useState<boolean>(true);
  const [selectedLevel, setSelectedLevel] = useState<
    "beginner" | "intermediate" | "advanced" | "ai" | null
  >(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<
    "easy" | "medium" | "hard" | null
  >(null);
  const [showDifficultyDialog, setShowDifficultyDialog] =
    useState<boolean>(false);
  const [selectedWritingType, setSelectedWritingType] = useState<string | null>(
    null
  );
  const [topicContext, setTopicContext] = useState<string>("");

  // Filter dialog state
  const [showFilterDialog, setShowFilterDialog] = useState<boolean>(false);
  // Filter categories configuration
  const filterCategories: FilterCategory[] = [
    {
      key: "status",
      label: "Progress Status",
      description: "Filter by completion status",
      icon: <CheckCircle className="h-5 w-5" />,
      type: "checkbox",
      multiSelect: true,
      options: [
        {
          key: "solved",
          label: "Completed",
          description: "Writing exercises you've finished",
        },
        {
          key: "unsolved",
          label: "Not Started",
          description: "New writing challenges to explore",
        },
      ],
    },
    {
      key: "category",
      label: "Writing Types",
      description: "Choose your preferred writing format",
      icon: <PenTool className="h-5 w-5" />,
      type: "checkbox",
      multiSelect: true,
      options: [
        {
          key: "article",
          label: "Article",
          description: "Informative content",
        },
        {
          key: "notice",
          label: "Notice",
          description: "Official announcements",
        },
        {
          key: "essay",
          label: "Essay",
          description: "Structured arguments",
        },
        {
          key: "letter",
          label: "Letter",
          description: "Personal communication",
        },
      ],
    },
    {
      key: "level",
      label: "Skill Level & Difficulty",
      description: "Match your current writing abilities",
      icon: <Brain className="h-5 w-5" />,
      type: "checkbox",
      multiSelect: true,
      options: [
        {
          key: "beginner",
          label: "Beginner",
          description: "Basic vocabulary & simple structures",
          icon: <Star className="h-4 w-4" />,
          children: [
            {
              key: "beginner.easy",
              label: "Easy",
              description: "Simple prompts",
            },
            {
              key: "beginner.medium",
              label: "Medium",
              description: "Moderate challenge",
            },
            {
              key: "beginner.hard",
              label: "Hard",
              description: "Advanced beginner",
            },
          ],
        },
        {
          key: "intermediate",
          label: "Intermediate",
          description: "Balanced challenge & creativity",
          icon: <Target className="h-4 w-4" />,
          children: [
            {
              key: "intermediate.easy",
              label: "Easy",
              description: "Comfortable level",
            },
            {
              key: "intermediate.medium",
              label: "Medium",
              description: "Good challenge",
            },
            {
              key: "intermediate.hard",
              label: "Hard",
              description: "Push your limits",
            },
          ],
        },
        {
          key: "advanced",
          label: "Advanced",
          description: "Complex topics & sophisticated writing",
          icon: <Trophy className="h-4 w-4" />,
          children: [
            {
              key: "advanced.easy",
              label: "Easy",
              description: "Warm-up level",
            },
            {
              key: "advanced.medium",
              label: "Medium",
              description: "Standard advanced",
            },
            {
              key: "advanced.hard",
              label: "Hard",
              description: "Expert level",
            },
          ],
        },
      ],
    },
  ];

  // Simplified filters state
  const [filters, setFilters] = useState<Record<string, string[]>>({
    status: [],
    category: [],
    level: [],
  });

  const [writingPrompts, setWritingPrompts] = useState<WritingPrompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
  });
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Helper function to extract selected filter values
  const getSelectedFilters = () => {
    const params: Record<string, string> = {};

    // Add status filter
    if (filters.status.length > 0) {
      params.status = filters.status.join(",");
    }

    // Add category filter
    if (filters.category.length > 0) {
      params.category = filters.category.join(",");
    }

    // Add level-difficulty filter
    if (filters.level.length > 0) {
      const levelDifficultyMap: Record<string, string[]> = {};

      filters.level.forEach((levelDiff) => {
        const [level, difficulty] = levelDiff.split(".");
        if (!levelDifficultyMap[`level.${level}`]) {
          levelDifficultyMap[`level.${level}`] = [];
        }
        levelDifficultyMap[`level.${level}`].push(difficulty);
      });

      // Convert to comma-separated strings
      Object.entries(levelDifficultyMap).forEach(([key, difficulties]) => {
        params[key] = difficulties.join(",");
      });
    }

    return params;
  };

  // Helper function to clear all filters
  const clearAllFilters = () => {
    setFilters({
      status: [],
      category: [],
      level: [],
    });
  };

  // Helper function to check if any filters are active
  const hasActiveFilters = () => {
    return Object.values(filters).some((filterArray) => filterArray.length > 0);
  };

  // Helper function to get count of active filters
  const getActiveFiltersCount = () => {
    return Object.values(filters).reduce(
      (total, filterArray) => total + filterArray.length,
      0
    );
  };

  // Fetch writing topics from API
  useEffect(() => {
    const fetchWritingTopics = async (isLoadMore = false) => {
      try {
        if (isLoadMore) {
          setLoadingMore(true);
        } else {
          setLoading(true);
          setError(null);
        }

        const selectedFilters = getSelectedFilters();

        const params = {
          page: isLoadMore ? pagination?.currentPage + 1 : 1,
          page_size: pagination?.pageSize,
          ...selectedFilters, // Spread all filters (level-difficulty, status, category)
        };

        console.log("API Params:", params); // For debugging

        const paginatedData: PaginatedResponse =
          await writingService.fetchTopics(params);

        // Transform the API data to match our interface
        const transformedPrompts: WritingPrompt[] =
          paginatedData?.results || [];

        if (isLoadMore) {
          // Append new prompts to existing ones
          setWritingPrompts((prev) => [...prev, ...transformedPrompts]);
          setPagination((prev) => ({
            ...prev,
            currentPage: prev.currentPage + 1,
          }));
        } else {
          // Replace prompts for initial load or filter change
          setWritingPrompts(transformedPrompts);
          setPagination((prev) => ({
            ...prev,
            currentPage: 1,
            total: paginatedData?.total || 0,
            totalPages: Math.ceil(
              (paginatedData?.total || 0) / pagination.pageSize
            ),
          }));
        }

        // Check if there are more prompts to load
        const totalLoaded = isLoadMore
          ? writingPrompts?.length + transformedPrompts?.length
          : transformedPrompts?.length;
        setHasMore(totalLoaded < (paginatedData?.total || 0));
      } catch (err: any) {
        if (err?.response) {
          // If using axios
          setError(
            err?.response?.data?.message ||
              "Failed to load story. Please try again."
          );
        }
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    };

    fetchWritingTopics();
  }, [filters]);

  // Load more prompts function
  const loadMorePrompts = async () => {
    if (!hasMore || loadingMore) return;

    try {
      setLoadingMore(true);
      const selectedFilters = getSelectedFilters();

      const params = {
        page: pagination?.currentPage + 1,
        page_size: pagination?.pageSize,
        ...selectedFilters, // Spread all filters
      };

      const paginatedData: PaginatedResponse = await writingService.fetchTopics(
        params
      );

      const transformedPrompts: WritingPrompt[] = paginatedData?.results || [];

      // Append new prompts to existing ones
      setWritingPrompts((prev) => [...prev, ...transformedPrompts]);
      setPagination((prev) => ({
        ...prev,
        currentPage: prev?.currentPage + 1,
      }));

      // Check if there are more prompts to load
      const totalLoaded = writingPrompts?.length + transformedPrompts?.length;
      setHasMore(totalLoaded < (paginatedData?.total || 0));
    } catch (err: any) {
      if (err?.response) {
        // If using axios
        setError(
          err?.response?.data?.message ||
            "Failed to load story. Please try again."
        );
      }
    } finally {
      setLoadingMore(false);
    }
  };

  // Scroll detection for infinite scroll within container
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainer;

      // Load more when scrolled to within 100px of bottom
      if (
        scrollTop + clientHeight >= scrollHeight - 100 &&
        hasMore &&
        !loadingMore
      ) {
        loadMorePrompts();
      }
    };

    scrollContainer.addEventListener("scroll", handleScroll);
    return () => scrollContainer.removeEventListener("scroll", handleScroll);
  }, [hasMore, loadingMore, writingPrompts?.length]);

  // Open level selection dialog on first mount
  useEffect(() => {
    setShowLevelDialog(true);
  }, []);

  const applyLevel = (
    level: "beginner" | "intermediate" | "advanced" | "ai"
  ) => {
    setSelectedLevel(level);
    setShowLevelDialog(false);

    // Always show difficulty dialog (now contains all inputs)
    setShowDifficultyDialog(true);
  };

  const applyDifficulty = () => {
    setShowDifficultyDialog(false);
  };

  const handlePromptSelection = (prompt: WritingPrompt) => {
    router.push(`/writing/${prompt?.topic_id}`);
  };

  return (
    <div className="bg-gradient-to-br from-yellow-50 via-white to-orange-50">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header Section */}
        <div>
          <div className="flex items-center justify-between">
            <div className="space-y-2 mb-6">
              {/* Breadcrumb Navigation */}
              <nav className="flex items-center space-x-2 text-sm text-gray-500">
                <Link
                  href="/dashboard"
                  className="hover:text-orange-600 transition-colors font-medium"
                >
                  Dashboard
                </Link>
                <ChevronRight className="h-4 w-4" />
                <span className="text-gray-900 font-semibold">Writing</span>
              </nav>

              {/* Page Title */}
              <h1 className="text-2xl font-bold text-gray-900">
                Writing Practice
              </h1>
            </div>
            <Button
              onClick={() => setShowFilterDialog(true)}
              variant="outline"
              className="flex items-center gap-2 px-4 py-2 bg-white border-gray-200 hover:border-orange-300 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <Filter className="h-4 w-4" />
              Filters
              {hasActiveFilters() && (
                <Badge className="ml-1 bg-orange-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                  {getActiveFiltersCount()}
                </Badge>
              )}
            </Button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="space-y-6">
          {/* Loading State - Enhanced */}
          {loading && (
            <div className="flex items-center justify-center py-16">
              <div className="text-center bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
                <div className="p-4 bg-gradient-to-r from-orange-100 to-orange-200 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Loading writing prompts...
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
                  Unable to load prompts
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

          {/* Writing Prompts List */}
          {!loading && !error && (
            <div
              ref={scrollContainerRef}
              className="h-[600px] sm:h-[700px] lg:h-[1200px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 pr-2"
            >
              <div className="space-y-4">
                {writingPrompts?.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20 max-w-md mx-auto">
                      <div className="p-4 bg-gradient-to-r from-gray-100 to-blue-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                        <PenTool className="h-8 w-8 text-gray-500" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        No writing prompts available
                      </h3>
                      <p className="text-gray-600">
                        Check back later for new writing materials
                      </p>
                    </div>
                  </div>
                ) : (
                  writingPrompts?.map((prompt) => (
                    <Card
                      key={prompt?.topic_id}
                      className="group relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-2xl transition-all duration-300 cursor-pointer border border-white/20 hover:border-orange-200/50 py-0"
                      onClick={() => handlePromptSelection(prompt)}
                    >
                      {/* Gradient overlay for visual appeal */}
                      <div className="absolute inset-0 bg-gradient-to-br from-yellow-50/30 via-transparent to-orange-100/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                      <div className="relative p-6">
                        {/* Header with icon and badges */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-full group-hover:scale-110 transition-transform duration-200">
                              <PenTool className="h-4 w-4 text-yellow-600" />
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge
                                variant="outline"
                                className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${getLevelColor(
                                  prompt?.level
                                )} shadow-sm`}
                              >
                                {prompt?.level}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge
                                variant="outline"
                                className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${getDifficultyColor(
                                  prompt?.difficulty
                                )} shadow-sm`}
                              >
                                {prompt?.difficulty}
                              </Badge>
                            </div>
                          </div>
                          {/* Solved status badge - moved to right side */}
                          {prompt?.solved && (
                            <div className="flex items-center gap-2">
                              <Badge
                                variant="outline"
                                className="text-xs font-semibold px-3 py-1 rounded-full bg-green-50 text-green-700 border-green-200 shadow-sm"
                              >
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Solved
                              </Badge>
                            </div>
                          )}
                        </div>

                        {/* Prompt title */}
                        <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors duration-200 line-clamp-1">
                          {prompt?.title}
                        </h3>

                        {/* Description preview */}
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                          {prompt?.description}
                        </p>

                        {/* Guidelines preview */}
                        <div className="mb-4">
                          <h4 className="text-sm font-semibold text-gray-700 mb-2">
                            Guidelines:
                          </h4>
                          <ul className="text-xs text-gray-600 space-y-1">
                            {prompt?.guidelines
                              ?.slice(0, 2)
                              .map((guideline: string, idx: number) => (
                                <li
                                  key={idx}
                                  className="flex items-start gap-2"
                                >
                                  <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                                  <span className="line-clamp-1">
                                    {guideline}
                                  </span>
                                </li>
                              ))}
                            {prompt?.guidelines &&
                              prompt.guidelines.length > 2 && (
                                <li className="text-gray-500 text-xs">
                                  +{prompt.guidelines.length - 2} more
                                  guidelines
                                </li>
                              )}
                          </ul>
                        </div>

                        {/* Stats and metadata */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-full">
                              <Trophy className="h-3 w-3 text-yellow-500" />
                              <span className="font-medium">Max Score: 10</span>
                            </div>

                            <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-full">
                              <Clock className="h-3 w-3 text-orange-500" />
                              <span className="font-medium">15-20 mins</span>
                            </div>
                          </div>
                        </div>

                        {/* Action button */}
                        <div className="flex justify-end">
                          <Button
                            size="sm"
                            className={`px-6 py-2 text-sm font-semibold rounded-full transition-all duration-200 shadow-md hover:shadow-lg ${
                              prompt?.solved
                                ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                                : "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
                            }`}
                          >
                            {prompt?.solved ? "Write Again" : "Start Writing"}
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))
                )}

                {/* Infinite Scroll Loading Indicator */}
                {loadingMore && (
                  <div className="mt-4 flex items-center justify-center">
                    <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/20">
                      <Loader2 className="h-4 w-4 animate-spin text-orange-600" />
                      <span className="text-sm font-medium text-gray-700">
                        Loading more prompts...
                      </span>
                    </div>
                  </div>
                )}

                {/* End of results indicator */}
                {!loading &&
                  !error &&
                  !hasMore &&
                  writingPrompts.length > 0 && (
                    <div className="mt-4 flex items-center justify-center">
                      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/20">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium text-gray-700">
                            You've reached the end! No more prompts to load.
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Level Selection Dialog */}
      <Dialog open={showLevelDialog} onOpenChange={setShowLevelDialog}>
        <DialogContent className="sm:max-w-lg p-0 overflow-hidden rounded-2xl shadow-2xl border-0">
          <div className="relative p-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_left,_#fff,_transparent_50%)]"></div>
            <div className="relative z-10 text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-xs font-semibold mb-3">
                <PenTool className="h-4 w-4" />
                Writing Practice
              </div>
              <DialogTitle className="text-2xl font-extrabold tracking-tight text-white">
                Choose Your Writing Level
              </DialogTitle>
              <DialogDescription className="text-white/90 text-sm mt-1">
                Pick a level to get writing exercises at that difficulty
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
                    Simple prompts, basic vocabulary
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
                    Balanced challenge and creativity
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
                    Complex topics, sophisticated writing
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
                    AI selects a suitable level and writing prompt
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

      {/* Writing Configuration Dialog */}
      <Dialog
        open={showDifficultyDialog}
        onOpenChange={setShowDifficultyDialog}
      >
        <DialogContent className="sm:max-w-2xl p-0 overflow-hidden rounded-2xl shadow-2xl border-0">
          <div className="relative p-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_left,_#fff,_transparent_50%)]"></div>
            <div className="relative z-10 text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-xs font-semibold mb-3">
                <PenTool className="h-4 w-4" />
                Writing Configuration
              </div>
              <DialogTitle className="text-2xl font-extrabold tracking-tight text-white">
                Configure Your Writing Practice
              </DialogTitle>
              <DialogDescription className="text-white/90 text-sm mt-1">
                Set up your writing exercise with difficulty, type, and topic
              </DialogDescription>
            </div>
          </div>
          <div className="p-6 bg-white">
            <div className="space-y-6">
              {/* Writing Type Selection */}
              <div>
                <Label className="text-sm font-semibold text-gray-900 mb-3 block">
                  Writing Type
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  {writingTypeOptions?.map((type) => {
                    const IconComponent = type?.icon;
                    return (
                      <button
                        key={type?.id}
                        className={`group w-full text-left flex items-center gap-3 p-3 rounded-lg border transition-all ${
                          selectedWritingType === type?.id
                            ? "border-orange-300 bg-orange-50"
                            : "border-gray-200 hover:border-orange-300 hover:bg-gray-50"
                        }`}
                        onClick={() => setSelectedWritingType(type?.id)}
                      >
                        <div
                          className={`p-2 rounded-lg ${type.color} text-white group-hover:scale-110 transition-transform`}
                        >
                          <IconComponent className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900 text-sm">
                            {type?.title}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Difficulty Selection */}
              <div>
                <Label className="text-sm font-semibold text-gray-900 mb-3 block">
                  Difficulty Level
                </Label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    className={`group w-full text-left flex items-center gap-3 p-3 rounded-lg border transition-all ${
                      selectedDifficulty === "easy"
                        ? "border-green-300 bg-green-50"
                        : "border-gray-200 hover:border-green-300 hover:bg-gray-50"
                    }`}
                    onClick={() => setSelectedDifficulty("easy")}
                  >
                    <div className="p-2 rounded-lg bg-green-100 text-green-700 group-hover:scale-110 transition-transform">
                      <Star className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 text-sm">
                        Easy
                      </div>
                    </div>
                  </button>

                  <button
                    className={`group w-full text-left flex items-center gap-3 p-3 rounded-lg border transition-all ${
                      selectedDifficulty === "medium"
                        ? "border-yellow-300 bg-yellow-50"
                        : "border-gray-200 hover:border-yellow-300 hover:bg-gray-50"
                    }`}
                    onClick={() => setSelectedDifficulty("medium")}
                  >
                    <div className="p-2 rounded-lg bg-yellow-100 text-yellow-700 group-hover:scale-110 transition-transform">
                      <Target className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 text-sm">
                        Medium
                      </div>
                    </div>
                  </button>

                  <button
                    className={`group w-full text-left flex items-center gap-3 p-3 rounded-lg border transition-all ${
                      selectedDifficulty === "hard"
                        ? "border-red-300 bg-red-50"
                        : "border-gray-200 hover:border-red-300 hover:bg-gray-50"
                    }`}
                    onClick={() => setSelectedDifficulty("hard")}
                  >
                    <div className="p-2 rounded-lg bg-red-100 text-red-700 group-hover:scale-110 transition-transform">
                      <Trophy className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 text-sm">
                        Hard
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Topic Context Input */}
              <div>
                <Label
                  htmlFor="topic-context"
                  className="text-sm font-semibold text-gray-900 mb-3 block"
                >
                  Topic Context
                </Label>
                <Input
                  id="topic-context"
                  type="text"
                  placeholder={
                    selectedWritingType === "letter"
                      ? "e.g., I want to write a letter to my best friend about a new hobby..."
                      : selectedWritingType === "article"
                      ? "e.g., I want to write an article about a school sports day..."
                      : selectedWritingType === "notice"
                      ? "e.g., I want to write a notice about upcoming school holidays..."
                      : selectedWritingType === "essay"
                      ? "e.g., I want to write an essay about environmental issues..."
                      : "Enter what you want to write about..."
                  }
                  value={topicContext}
                  onChange={(e) => setTopicContext(e?.target?.value)}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-2">
                  {selectedWritingType === "letter" && (
                    <>
                      Examples: "I want to write a letter to my best friend
                      about a new hobby I started", "I want to write a cover
                      letter for my dream job application"
                    </>
                  )}
                  {selectedWritingType === "article" && (
                    <>
                      Examples: "I want to write an article about a recent
                      school sports day", "I want to write an article about
                      climate change and its impact on my community"
                    </>
                  )}
                  {selectedWritingType === "notice" && (
                    <>
                      Examples: "I want to write a notice about upcoming school
                      holidays", "I want to write a notice about a community
                      cleanup drive"
                    </>
                  )}
                  {selectedWritingType === "essay" && (
                    <>
                      Examples: "I want to write an essay about environmental
                      issues", "I want to write an essay about the impact of
                      social media on teenagers"
                    </>
                  )}
                </p>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <Button
                variant="ghost"
                className="text-gray-600 hover:text-gray-900"
                onClick={() => setShowDifficultyDialog(false)}
              >
                Back to Level Selection
              </Button>

              <Button
                onClick={() => {
                  if (
                    selectedWritingType &&
                    selectedDifficulty &&
                    topicContext.trim()
                  ) {
                    applyDifficulty();
                  }
                }}
                disabled={
                  !selectedWritingType ||
                  !selectedDifficulty ||
                  !topicContext.trim()
                }
                className="bg-orange-600 hover:bg-orange-700 text-white px-6"
              >
                View Prompts
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reusable Filter Dialog */}
      <FilterDialog
        open={showFilterDialog}
        onOpenChange={setShowFilterDialog}
        title="Writing Filters"
        description="Filter writing prompts by your preferences"
        categories={filterCategories}
        selectedFilters={filters}
        onFiltersChange={setFilters}
        onApply={() => setShowFilterDialog(false)}
        onClearAll={clearAllFilters}
        searchPlaceholder="Search filters..."
      />
    </div>
  );
}
