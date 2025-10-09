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
  Clock,
  ChevronRight,
  CheckCircle,
  Star,
  Filter,
  Trophy,
  Target,
  Brain,
  Mic,
  Loader2,
  MessageCircle,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { speakingService } from "@/services/speakingService";
import { getDifficultyColor, getLevelColor } from "@/lib/utils";
import { PaginatedResponse, SpeakingTopic } from "../types";
import { FilterDialog, FilterCategory } from "@/components/shared/FilterDialog";

export function SpeakingInterface() {
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

  const [speakingTopics, setSpeakingTopics] = useState<SpeakingTopic[]>([]);
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

  // Fetch speaking topics from API
  useEffect(() => {
    const fetchSpeakingTopics = async (isLoadMore = false) => {
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

        const paginatedData: PaginatedResponse =
          await speakingService.fetchTopics(params);

        // Transform the API data to match our interface
        const transformedTopics: SpeakingTopic[] = paginatedData?.results || [];

        if (isLoadMore) {
          // Append new topics to existing ones
          setSpeakingTopics((prev) => [...prev, ...transformedTopics]);
          setPagination((prev) => ({
            ...prev,
            currentPage: prev.currentPage + 1,
          }));
        } else {
          // Replace topics for initial load or filter change
          setSpeakingTopics(transformedTopics);
          setPagination((prev) => ({
            ...prev,
            currentPage: 1,
            total: paginatedData?.total || 0,
            totalPages: Math.ceil(
              (paginatedData?.total || 0) / pagination.pageSize
            ),
          }));
        }

        // Check if there are more topics to load
        const totalLoaded = isLoadMore
          ? speakingTopics?.length + transformedTopics?.length
          : transformedTopics?.length;
        setHasMore(totalLoaded < (paginatedData?.total || 0));
      } catch (err: any) {
        if (err?.response) {
          // If using axios
          setError(
            err?.response?.data?.message ||
              "Failed to load topics. Please try again."
          );
        }
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    };

    fetchSpeakingTopics();
  }, [filters]);

  // Load more topics function
  const loadMoreTopics = async () => {
    if (!hasMore || loadingMore) return;

    try {
      setLoadingMore(true);
      const selectedFilters = getSelectedFilters();

      const params = {
        page: pagination?.currentPage + 1,
        page_size: pagination?.pageSize,
        ...selectedFilters, // Spread all filters
      };

      const paginatedData: PaginatedResponse =
        await speakingService.fetchTopics(params);

      const transformedTopics: SpeakingTopic[] = paginatedData?.results || [];

      // Append new topics to existing ones
      setSpeakingTopics((prev) => [...prev, ...transformedTopics]);
      setPagination((prev) => ({
        ...prev,
        currentPage: prev?.currentPage + 1,
      }));

      // Check if there are more topics to load
      const totalLoaded = speakingTopics?.length + transformedTopics?.length;
      setHasMore(totalLoaded < (paginatedData?.total || 0));
    } catch (err: any) {
      if (err?.response) {
        // If using axios
        setError(
          err?.response?.data?.message ||
            "Failed to load topics. Please try again."
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
        loadMoreTopics();
      }
    };

    scrollContainer.addEventListener("scroll", handleScroll);
    return () => scrollContainer.removeEventListener("scroll", handleScroll);
  }, [hasMore, loadingMore, speakingTopics?.length]);

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

  const applyDifficulty = (difficulty: "easy" | "medium" | "hard") => {
    setSelectedDifficulty(difficulty);
    setShowDifficultyDialog(false);
  };

  const handleTopicSelection = (topic: SpeakingTopic) => {
    router.push(`/speaking/${topic?.topic_id}`);
  };

  return (
    <div className="bg-gradient-to-br from-orange-50 via-white to-orange-50">
      <div className="max-w-6xl mx-auto px-4 py-6">
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
              <span className="text-gray-900 font-semibold">Speaking</span>
            </nav>

            {/* Page Title */}
            <h1 className="text-2xl font-bold text-gray-900">
              Speaking Practice
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
                  Loading speaking topics...
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
                  Unable to load topics
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

          {/* Speaking Topics List */}
          {!loading && !error && (
            <div
              ref={scrollContainerRef}
              className="h-[600px] sm:h-[700px] lg:h-[1200px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 pr-2"
            >
              <div className="space-y-4">
                {speakingTopics?.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20 max-w-md mx-auto">
                      <div className="p-4 bg-gradient-to-r from-gray-100 to-blue-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                        <Mic className="h-8 w-8 text-gray-500" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        No speaking topics available
                      </h3>
                      <p className="text-gray-600">
                        Check back later for new speaking materials
                      </p>
                    </div>
                  </div>
                ) : (
                  speakingTopics?.map((topic) => (
                    <Card
                      key={topic?.topic_id}
                      className="group relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-2xl transition-all duration-300 cursor-pointer border border-white/20 hover:border-orange-200/50 py-0"
                      onClick={() => handleTopicSelection(topic)}
                    >
                      {/* Gradient overlay for visual appeal */}
                      <div className="absolute inset-0 bg-gradient-to-br from-orange-50/30 via-transparent to-orange-100/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                      <div className="relative p-6">
                        {/* Header with icon and badges */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-r from-orange-100 to-orange-100 rounded-full group-hover:scale-110 transition-transform duration-200">
                              <Mic className="h-4 w-4 text-orange-600" />
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge
                                variant="outline"
                                className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${getLevelColor(
                                  topic?.level
                                )} shadow-sm`}
                              >
                                {topic?.level}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge
                                variant="outline"
                                className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${getDifficultyColor(
                                  topic?.difficulty
                                )} shadow-sm`}
                              >
                                {topic?.difficulty}
                              </Badge>
                            </div>
                          </div>
                          {/* Solved status badge - moved to right side */}
                          {topic?.solved && (
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

                        {/* Topic title */}
                        <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors duration-200 line-clamp-1">
                          {topic?.title}
                        </h3>

                        {/* Description preview */}
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                          {topic?.description}
                        </p>

                        {/* Action button */}
                        <div className="flex justify-end">
                          <Button
                            size="sm"
                            className={`px-6 py-2 text-sm font-semibold rounded-full transition-all duration-200 shadow-md hover:shadow-lg ${
                              topic?.solved
                                ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                                : "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
                            }`}
                          >
                            {topic?.solved
                              ? "Practice Again"
                              : "Start Speaking"}
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
                        Loading more topics...
                      </span>
                    </div>
                  </div>
                )}

                {/* End of results indicator */}
                {!loading &&
                  !error &&
                  !hasMore &&
                  speakingTopics.length > 0 && (
                    <div className="mt-4 flex items-center justify-center">
                      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/20">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium text-gray-700">
                            You've reached the end! No more topics to load.
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
                <Mic className="h-4 w-4" />
                Speaking Practice
              </div>
              <DialogTitle className="text-2xl font-extrabold tracking-tight text-white">
                Choose Your Speaking Level
              </DialogTitle>
              <DialogDescription className="text-white/90 text-sm mt-1">
                Pick a level to get speaking exercises at that difficulty
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
                    Simple topics, basic vocabulary
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
                    Balanced topics with moderate complexity
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
                    Complex topics, sophisticated vocabulary
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
                    AI selects a suitable level and speaking topic
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
