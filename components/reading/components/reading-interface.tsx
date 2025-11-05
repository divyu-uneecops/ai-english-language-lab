"use client";

import { useState, useEffect, useRef } from "react";
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
  FileText,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { readingService } from "@/services/readingService";
import { getDifficultyColor, getLevelColor } from "@/lib/utils";
import Markdown from "@/components/shared/components/MarkDown";
import {
  FilterDialog,
  FilterCategory,
} from "@/components/shared/components/FilterDialog";
import { PaginatedResponse, Story } from "../interfaces";

export function ReadingInterface() {
  const router = useRouter();
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showLevelDifficultyDialog, setShowLevelDifficultyDialog] =
    useState<boolean>(true);
  const [selectedLevel, setSelectedLevel] = useState<
    "beginner" | "intermediate" | "advanced" | "ai" | null
  >(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<
    "easy" | "medium" | "hard" | null
  >(null);
  const [showFilterDialog, setShowFilterDialog] = useState<boolean>(false);
  const filterCategories: FilterCategory[] = [
    {
      key: "status",
      label: "Progress Status",
      icon: <CheckCircle className="h-5 w-5" />,
      type: "checkbox",
      multiSelect: true,
      options: [
        {
          key: "solved",
          label: "Solved",
        },
        {
          key: "unsolved",
          label: "Unsolved",
        },
      ],
    },
    {
      key: "level",
      label: "Skill Level & Difficulty",
      icon: <Brain className="h-5 w-5" />,
      type: "checkbox",
      multiSelect: true,
      options: [
        {
          key: "beginner",
          label: "Beginner",
          icon: <Star className="h-4 w-4" />,
          children: [
            {
              key: "beginner.easy",
              label: "Easy",
            },
            {
              key: "beginner.medium",
              label: "Medium",
            },
            {
              key: "beginner.hard",
              label: "Hard",
            },
          ],
        },
        {
          key: "intermediate",
          label: "Intermediate",
          icon: <Target className="h-4 w-4" />,
          children: [
            {
              key: "intermediate.easy",
              label: "Easy",
            },
            {
              key: "intermediate.medium",
              label: "Medium",
            },
            {
              key: "intermediate.hard",
              label: "Hard",
            },
          ],
        },
        {
          key: "advanced",
          label: "Advanced",
          icon: <Trophy className="h-4 w-4" />,
          children: [
            {
              key: "advanced.easy",
              label: "Easy",
            },
            {
              key: "advanced.medium",
              label: "Medium",
            },
            {
              key: "advanced.hard",
              label: "Hard",
            },
          ],
        },
      ],
    },
  ];
  const [filters, setFilters] = useState<Record<string, string[]>>({
    status: [],
    level: [],
  });

  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
  });
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<AbortController | null>(null);

  //Fetch stories from API
  useEffect(() => {
    fetchStories();
  }, [filters]);

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
        loadMoreStories();
      }
    };

    scrollContainer.addEventListener("scroll", handleScroll);
    return () => scrollContainer.removeEventListener("scroll", handleScroll);
  }, [hasMore, loadingMore, stories.length]);

  // Open level selection dialog on first mount
  useEffect(() => {
    setShowLevelDifficultyDialog(true);
  }, []);

  const fetchStories = async (aiDecide = false) => {
    // Cancel previous request if active
    controllerRef.current?.abort();

    // Create a new AbortController for this request
    const controller = new AbortController();
    controllerRef.current = controller;

    // Set loading state FIRST to ensure UI updates immediately
    setLoading(true);
    setError(null);

    try {
      const selectedFilters = getSelectedFilters();

      const params = {
        page: 1,
        page_size: pagination.pageSize,
        aiDecide: aiDecide,
        ...selectedFilters, // Spread all filters (level-difficulty, status)
      };

      if (aiDecide) {
        const response = await readingService.fetchStories(
          params,
          controller.signal
        );

        // Only navigate if this is still the active request
        if (controllerRef.current === controller) {
          if (response?.passage_id) {
            router.push(`/reading/${response?.passage_id}`);
          }
        }
      } else {
        const paginatedData: PaginatedResponse =
          await readingService.fetchStories(params, controller.signal);

        // Only update state if this is still the active request
        if (controllerRef.current === controller) {
          // Transform the API data to match our interface
          const transformedStories: Story[] = paginatedData?.results;

          // Replace stories for initial load or filter change
          setStories(transformedStories);
          setPagination((prev) => ({
            ...prev,
            currentPage: 1,
            total: paginatedData?.total || 0,
            totalPages: Math.ceil(
              (paginatedData?.total || 0) / pagination.pageSize
            ),
          }));

          // Check if there are more stories to load
          const totalLoaded = transformedStories.length;
          setHasMore(totalLoaded < (paginatedData?.total || 0));
        }
      }
    } catch (err: any) {
      // Ignore cancellation errors
      if (err.name === "CanceledError" || err.code === "ERR_CANCELED") {
        return;
      }
      // Only set error if this is still the active request
      if (controllerRef.current === controller) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch stories"
        );
      }
    } finally {
      // Only update loading state if this is still the active request
      if (controllerRef.current === controller) {
        setLoading(false);
      }
    }
  };

  // Helper function to extract selected filter values
  const getSelectedFilters = () => {
    const params: Record<string, string> = {};

    // Add status filter
    if (filters.status.length > 0) {
      params.status = filters.status.join(",");
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

  // Load more stories function
  const loadMoreStories = async () => {
    if (!hasMore || loadingMore) return;

    try {
      setLoadingMore(true);
      const selectedFilters = getSelectedFilters();

      const params = {
        page: pagination.currentPage + 1,
        page_size: pagination.pageSize,
        aiDecide: false,
        ...selectedFilters, // Spread all filters
      };
      const paginatedData: PaginatedResponse =
        await readingService.fetchStories(params);

      const transformedStories: Story[] = paginatedData?.results;

      // Append new stories to existing ones
      setStories((prev) => [...prev, ...transformedStories]);
      setPagination((prev) => ({
        ...prev,
        currentPage: prev.currentPage + 1,
      }));

      // Check if there are more stories to load
      const totalLoaded = stories.length + transformedStories.length;
      setHasMore(totalLoaded < (paginatedData?.total || 0));
    } catch (err) {
      console.error("Error loading more stories:", err);
    } finally {
      setLoadingMore(false);
    }
  };

  const openReadingSubmissions = () => {
    router.push("/reading/submissions");
  };

  const handleLevelClick = (
    level: "beginner" | "intermediate" | "advanced" | "ai"
  ) => {
    setSelectedLevel(level);
    setShowLevelDifficultyDialog(false);

    // For AI, immediately fetch and navigate
    if (level === "ai") {
      fetchStories(true);
    } else {
      // For other levels, select all difficulties for that level
      const allDifficulties = ["easy", "medium", "hard"];
      const levelDifficultyKeys = allDifficulties.map(
        (difficulty) => `${level}.${difficulty}`
      );

      setFilters((prev) => ({
        ...prev,
        level: [...prev.level, ...levelDifficultyKeys],
      }));
    }
  };

  const handleDifficultySelection = (
    difficulty: "easy" | "medium" | "hard"
  ) => {
    setSelectedDifficulty(difficulty);
    setShowLevelDifficultyDialog(false);

    if (selectedLevel) {
      const levelDifficultyKey = `${selectedLevel}.${difficulty}`;
      setFilters((prev) => ({
        ...prev,
        level: [...prev.level, levelDifficultyKey],
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header Section */}
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
              <span className="text-gray-900 font-semibold">Reading</span>
            </nav>

            {/* Page Title */}
            <h1 className="text-2xl font-bold text-gray-900">
              Reading Practice
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={openReadingSubmissions}
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-200/80 text-gray-700 font-medium rounded-lg shadow-sm hover:shadow-md hover:bg-white hover:border-orange-200 hover:text-orange-600 transition-all duration-200 group cursor-pointer"
            >
              <div className="relative">
                <FileText className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5" />
                <div className="absolute inset-0 bg-orange-500/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
              </div>
              <span className="relative">
                View Submissions
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-orange-500 to-orange-600 group-hover:w-full transition-all duration-300 ease-out"></span>
              </span>
              <ChevronRight className="h-3.5 w-3.5 opacity-0 -ml-1 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200" />
            </Button>

            <Button
              onClick={() => setShowFilterDialog(true)}
              variant="ghost"
              size="sm"
              className="group flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-200/80 text-gray-700 font-medium rounded-lg shadow-sm hover:shadow-md hover:bg-white hover:border-orange-200 hover:text-orange-600 transition-all duration-200 cursor-pointer"
            >
              <div className="relative">
                <Filter className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5" />
                <div className="absolute inset-0 bg-orange-500/10 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
              </div>
              <span className="relative">
                Filters
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-orange-500 to-orange-600 group-hover:w-full transition-all duration-300 ease-out"></span>
              </span>
              <ChevronRight className="h-3.5 w-3.5 opacity-0 -ml-1 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200" />
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
            <div
              ref={scrollContainerRef}
              className="h-[850px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 pr-2"
            >
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
                    <Link
                      key={story?.passage_id}
                      href={`/reading/${story?.passage_id}`}
                      prefetch={true}
                      className="block"
                    >
                      <Card className="group relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-2xl transition-all duration-300 cursor-pointer border border-white/20 hover:border-orange-200/50 py-0">
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

                          <Markdown
                            passage={story?.passage}
                            className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed"
                          />

                          {/* Stats and metadata */}
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-full">
                                <Trophy className="h-3 w-3 text-yellow-500" />
                                <span className="font-medium">
                                  Max Score: 10
                                </span>
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
                              className={
                                "px-6 py-2 text-sm font-semibold rounded-full transition-all duration-200 shadow-md hover:shadow-lg bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
                              }
                            >
                              Start Reading
                              <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  ))
                )}

                {/* Infinite Scroll Loading Indicator */}
                {loadingMore && (
                  <div className="mt-4 flex items-center justify-center">
                    <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/20">
                      <Loader2 className="h-4 w-4 animate-spin text-orange-600" />
                      <span className="text-sm font-medium text-gray-700">
                        Loading more stories...
                      </span>
                    </div>
                  </div>
                )}

                {/* End of results indicator */}
                {!loading && !error && !hasMore && stories.length > 0 && (
                  <div className="mt-4 flex items-center justify-center">
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/20">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-gray-700">
                          You've reached the end! No more stories to load.
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

      {/* Combined Level & Difficulty Selection Dialog */}
      <Dialog
        open={showLevelDifficultyDialog}
        onOpenChange={setShowLevelDifficultyDialog}
      >
        <DialogContent className="sm:max-w-2xl p-0 overflow-hidden rounded-2xl shadow-2xl border-0">
          <div className="relative p-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_left,_#fff,_transparent_50%)]"></div>
            <div className="relative z-10 text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-xs font-semibold mb-3">
                <BookOpen className="h-4 w-4" />
                Reading Practice Setup
              </div>
              <DialogTitle className="text-2xl font-extrabold tracking-tight text-white">
                Choose Your Reading Level
              </DialogTitle>
              <DialogDescription className="text-white/90 text-sm mt-1">
                Select your reading level to get started
              </DialogDescription>
            </div>
          </div>

          <div className="p-6 bg-white">
            {/* Level Selection */}
            <div className="h-full flex flex-col">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Select Level
              </h3>
              <div className="grid grid-cols-1 gap-3 flex-1">
                <button
                  className="group w-full text-left flex items-center gap-3 p-4 rounded-xl border border-green-200 hover:border-green-300 hover:shadow-md transition-all bg-gradient-to-br from-green-50 to-white"
                  onClick={() => handleLevelClick("beginner")}
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
                  <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-green-600" />
                </button>

                <button
                  className="group w-full text-left flex items-center gap-3 p-4 rounded-xl border border-yellow-200 hover:border-yellow-300 hover:shadow-md transition-all bg-gradient-to-br from-yellow-50 to-white"
                  onClick={() => handleLevelClick("intermediate")}
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
                  <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-yellow-600" />
                </button>

                <button
                  className="group w-full text-left flex items-center gap-3 p-4 rounded-xl border border-red-200 hover:border-red-300 hover:shadow-md transition-all bg-gradient-to-br from-red-50 to-white"
                  onClick={() => handleLevelClick("advanced")}
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
                  <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-red-600" />
                </button>

                <button
                  className="group w-full text-left flex items-center gap-3 p-4 rounded-xl border border-blue-200 hover:border-blue-300 hover:shadow-md transition-all bg-gradient-to-br from-blue-50 to-white"
                  onClick={() => handleLevelClick("ai")}
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
                  <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600" />
                </button>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-center gap-4">
              <Button
                variant="ghost"
                className="text-gray-600 hover:text-gray-900"
                onClick={() => {
                  setSelectedLevel(null);
                  setSelectedDifficulty(null);
                  setShowLevelDifficultyDialog(false);
                }}
              >
                Skip for now
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reusable Filter Dialog */}
      <FilterDialog
        open={showFilterDialog}
        onOpenChange={setShowFilterDialog}
        categories={filterCategories}
        selectedFilters={filters}
        onFiltersChange={setFilters}
        onApply={() => setShowFilterDialog(false)}
      />
    </div>
  );
}
