"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, Users, Star, Loader2 } from "lucide-react";
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{typeName} Writing Prompts</h2>
        <div
          onClick={onBack}
          className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Types
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-3">
            <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
            <span className="text-gray-600 dark:text-gray-300">
              Loading writing prompts...
            </span>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="text-red-500 mb-2">Failed to load prompts</div>
            <div className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              {error}
            </div>
            <Button onClick={() => window.location.reload()} variant="outline">
              Try Again
            </Button>
          </div>
        </div>
      )}

      {/* Topics Grid */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topics.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-500 dark:text-gray-400 mb-2">
                No prompts available
              </div>
              <div className="text-sm text-gray-400 dark:text-gray-500">
                Check back later for new writing topics
              </div>
            </div>
          ) : (
            topics.map((topic) => (
              <Card
                key={topic?.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{topic?.title}</CardTitle>
                    <Badge
                      variant={
                        topic.difficulty === "Easy"
                          ? "default"
                          : topic.difficulty === "Medium"
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {topic?.difficulty}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground">{topic?.description}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {topic?.timeEstimate}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {topic?.audience}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-1">
                      <Star className="h-4 w-4" />
                      Guidelines
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {topic?.guidelines
                        ?.slice(0, 2)
                        .map((guideline: any, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-primary">•</span>
                            {guideline}
                          </li>
                        ))}
                      {topic?.guidelines?.length > 2 && (
                        <li className="text-xs text-muted-foreground">
                          +{topic.guidelines.length - 2} more guidelines
                        </li>
                      )}
                    </ul>
                  </div>

                  <Button
                    className="w-full"
                    onClick={() => onStartWriting(topic)}
                  >
                    Start Writing
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}
