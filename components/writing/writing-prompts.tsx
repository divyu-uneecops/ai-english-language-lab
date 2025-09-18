"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  Users,
  Star,
  Loader2,
  FileText,
  MessageCircle,
  ChevronRight,
} from "lucide-react";
import { writingService } from "@/services/writingService";

// API Response interfaces
interface ApiTopic {
  topic_id: string;
  category: string;
  title: string;
  description: string;
  standard: number;
  difficulty: string;
  audience: string;
  guidelines: string[];
}

interface PaginatedResponse {
  page: number;
  page_size: number;
  total: number;
  results: ApiTopic[];
}

// Internal Topic interface
interface Topic {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  timeEstimate: string;
  audience: string;
  guidelines: string[];
}

interface WritingPromptsProps {
  writingType: string;
  onBack: () => void;
  onStartWriting: (prompt: any) => void;
}

export function WritingPrompts({
  writingType,
  onBack,
  onStartWriting,
}: WritingPromptsProps) {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const typeName = writingType.charAt(0).toUpperCase() + writingType.slice(1);

  // Fetch topics from API
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await writingService.fetchTopics(writingType, 1, 10);
        const paginatedData: PaginatedResponse = response;
        const transformedTopics: Topic[] = paginatedData.results.map(
          (topic) => ({
            id: topic.topic_id,
            title: topic.title,
            description: topic.description,
            difficulty: topic.difficulty,
            timeEstimate: getTimeEstimate(topic.difficulty),
            audience: topic.audience,
            guidelines: topic.guidelines,
          })
        );
        setTopics(transformedTopics);
      } catch (err) {
        console.error("Error fetching topics:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch writing topics"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTopics();
  }, [writingType]);

  // Helper function to estimate time based on difficulty and standard
  function getTimeEstimate(difficulty: string): string {
    const baseTime = {
      easy: 15,
      medium: 20,
      hard: 25,
    };

    const time =
      baseTime[difficulty.toLowerCase() as keyof typeof baseTime] || 20;
    return `${time} mins`;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Modern Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <div className="space-y-4">
              <nav className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <span
                  className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors cursor-pointer"
                  onClick={onBack}
                >
                  Writing
                </span>
                <span>/</span>
                <span className="text-gray-900 dark:text-gray-100 font-medium">
                  {typeName}
                </span>
              </nav>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  {typeName} Writing
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Choose a {typeName} to start your writing practice
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modern Content Section */}
        <div className="mb-12">
          {/* Modern Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Loading...
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Please wait while we fetch the writing {typeName}
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
                  Unable to load {typeName}
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

          {/* Modern Prompts Grid */}
          {!loading && !error && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topics.length === 0 ? (
                <div className="col-span-full text-center py-16">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    No {typeName} available
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Check back later for new writing topics
                  </p>
                </div>
              ) : (
                topics.map((topic) => (
                  <div
                    key={topic?.id}
                    className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md"
                    onClick={() => onStartWriting(topic)}
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-3">
                            <Badge
                              variant="secondary"
                              className={`text-xs font-medium ${
                                topic?.difficulty === "Easy" ||
                                topic?.difficulty === "easy"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border border-green-200 dark:border-green-800"
                                  : topic?.difficulty === "Medium" ||
                                    topic?.difficulty === "medium"
                                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800"
                                  : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border border-red-200 dark:border-red-800"
                              }`}
                            >
                              {topic?.difficulty}
                            </Badge>
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 leading-tight">
                            {topic?.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                            {topic?.description}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3 mb-4">
                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{topic?.timeEstimate}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span>{topic?.audience}</span>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2 flex items-center gap-1 text-sm text-gray-700 dark:text-gray-300">
                            <Star className="h-4 w-4" />
                            Guidelines
                          </h4>
                          <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                            {topic?.guidelines
                              ?.slice(0, 2)
                              .map((guideline: any, index) => (
                                <li
                                  key={index}
                                  className="flex items-start gap-2"
                                >
                                  <span className="text-blue-500 mt-1">•</span>
                                  <span className="leading-relaxed">
                                    {guideline}
                                  </span>
                                </li>
                              ))}
                            {topic?.guidelines?.length > 2 && (
                              <li className="text-xs text-gray-400 dark:text-gray-500">
                                +{topic.guidelines.length - 2} more guidelines
                              </li>
                            )}
                          </ul>
                        </div>
                      </div>

                      <Button
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={() => onStartWriting(topic)}
                      >
                        Start Writing
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
