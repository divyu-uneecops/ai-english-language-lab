"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  MessageCircle,
  CheckCircle,
  Clock,
  ChevronRight,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { readingService } from "@/services/readingService";

// API Story interface
interface ApiStory {
  passage_id: string;
  title: string;
  passage: string;
  difficulty: string;
  standard: number;
}

// Internal Story interface
interface Story {
  id: string;
  title: string;
  difficulty: string;
  readTime: string;
  description: string;
}

interface PaginatedResponse {
  page: number;
  page_size: number;
  total: number;
  results: ApiStory[];
}

export function ReadingInterface() {
  const router = useRouter();
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch stories from API
  useEffect(() => {
    const fetchStories = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await readingService.fetchStories(1, 10);
        const paginatedData: PaginatedResponse = response;

        // Transform the API data to match our interface
        const transformedStories: Story[] = paginatedData.results.map(
          (story) => ({
            id: story.passage_id,
            title: story.title,
            difficulty: story.difficulty,
            readTime: "5 Min", // Default read time since API doesn't provide it
            description: story.passage,
          })
        );

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
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Modern Ed-Tech Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <div className="space-y-4">
              <nav className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <Link
                  href="/dashboard"
                  className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                >
                  Dashboard
                </Link>
                <span>/</span>
                <span className="text-gray-900 dark:text-gray-100 font-medium">
                  Reading
                </span>
              </nav>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  Reading Practice
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Improve your reading comprehension with interactive stories
                  and questions
                </p>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                Progress
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                5 / 20
              </div>
              <div className="text-xs text-gray-400 dark:text-gray-500">
                Stories completed
              </div>
            </div>
          </div>
        </div>

        {/* Modern Content Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Available Stories
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Choose a story to start your reading practice
              </p>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {loading ? "Loading..." : `${stories?.length} stories available`}
            </div>
          </div>

          {/* Modern Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Loading stories...
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Please wait while we fetch the content
                </p>
              </div>
            </div>
          )}

          {/* Modern Error State */}
          {error && (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <MessageCircle className="h-12 w-12 text-red-500 dark:text-red-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Unable to load stories
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {/* Modern Story Grid */}
          {!loading && !error && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stories.length === 0 ? (
                <div className="col-span-full text-center py-16">
                  <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    No stories available
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Check back later for new reading materials
                  </p>
                </div>
              ) : (
                stories.map((story) => {
                  return (
                    <div
                      key={story?.id}
                      className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md"
                      onClick={() =>
                        router.push(`/reading/stories/${story?.id}`)
                      }
                    >
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-3">
                              <Badge
                                variant="secondary"
                                className={`text-xs font-medium ${
                                  story?.difficulty === "beginner" ||
                                  story?.difficulty === "easy"
                                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border border-green-200 dark:border-green-800"
                                    : story?.difficulty === "intermediate" ||
                                      story?.difficulty === "medium"
                                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800"
                                    : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border border-red-200 dark:border-red-800"
                                }`}
                              >
                                {story?.difficulty}
                              </Badge>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 leading-tight">
                              {story?.title}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                              {story?.description}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>{story?.readTime}</span>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            Start
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>

        {/* Modern How It Works */}
        <div className="mt-16 pt-12 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              How It Works
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Simple steps to improve your reading comprehension skills
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                1. Read the Story
              </h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                Take your time to read through the story carefully and
                understand the main ideas.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <MessageCircle className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                2. Answer Questions
              </h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                Test your understanding by answering questions about the story
                content.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                3. Get Feedback
              </h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                Receive instant feedback and explanations to help you learn and
                improve.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
