"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  BookOpen,
  MessageCircle,
  CheckCircle,
  Clock,
  ChevronRight,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { StoryReader } from "./story-reader";
import { QuestionPanel } from "./question-panel";
import { readingService } from "@/services/readingService";

// Story interface
interface Story {
  id: number;
  title: string;
  difficulty: string;
  readTime: string;
  description: string;
  content: string;
  questions: {
    id: number;
    question: string;
    options: string[];
    correct: number;
  }[];
}

export function ReadingInterface() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStory, setSelectedStory] = useState<number | null>(null);
  const [showQuestions, setShowQuestions] = useState(false);
  const [completedQuestions, setCompletedQuestions] = useState<number[]>([]);

  // Fetch stories from API
  useEffect(() => {
    const fetchStories = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await readingService.fetchStories();
        const data = response.map((story: any) => ({
          id: story?.passage_id,
          title: story?.title,
          difficulty: story?.difficulty,
          readTime: story?.readTime || "5 Min",
          description: story?.passage,
          content: story?.passage,
          questions: story?.questions?.map((question: any) => ({
            id: question?.question_id,
            question: question?.question,
            options: question?.options,
            correct: question?.answer,
            explanation: question?.explanation,
          })),
        }));

        setStories(data);
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

  const currentStory = selectedStory
    ? stories.find((s) => s?.id === selectedStory)
    : null;

  const handleStoryComplete = () => {
    setShowQuestions(true);
  };

  const handleQuestionsComplete = (questionIds: number[]) => {
    setCompletedQuestions((prev) => [...prev, ...questionIds]);
  };

  if (selectedStory && currentStory) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-6 py-8 max-w-7xl">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div
                  onClick={() => {
                    setSelectedStory(null);
                    setShowQuestions(false);
                  }}
                  className="flex items-center gap-2 cursor-pointer transition-colors hover:text-primary hover:-translate-x-1 duration-150"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Stories
                </div>
                <div className="h-4 w-px bg-border" />
                <h1 className="text-lg font-semibold text-foreground">
                  {currentStory.title}
                </h1>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {currentStory.difficulty}
                </Badge>
                <Badge
                  variant="outline"
                  className="text-xs flex items-center gap-1"
                >
                  <Clock className="h-3 w-3" />
                  {currentStory.readTime}
                </Badge>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="border border-border/50 rounded-lg">
            {!showQuestions ? (
              <StoryReader
                story={currentStory}
                onComplete={handleStoryComplete}
              />
            ) : (
              <QuestionPanel
                questions={currentStory.questions}
                onComplete={handleQuestionsComplete}
              />
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-foreground mb-1">
                Reading Practice
              </h1>
              <p className="text-sm text-muted-foreground">
                Improve your reading comprehension with interactive stories
              </p>
            </div>
            <Link href="/dashboard">
              <div className="flex items-center gap-2 cursor-pointer transition-colors hover:text-primary hover:-translate-x-1 duration-150">
                <ArrowLeft className="h-4 w-4 transition-transform duration-150 group-hover:-translate-x-1" />
                Dashboard
              </div>
            </Link>
          </div>
        </div>

        {/* Stories Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-foreground">
              Available Stories
            </h2>
            <div className="text-sm text-muted-foreground">
              {loading ? "Loading..." : `${stories.length} stories available`}
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-3">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span className="text-muted-foreground">
                  Loading stories...
                </span>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-12">
              <div className="text-red-600 dark:text-red-400 mb-4">
                <MessageCircle className="h-8 w-8 mx-auto mb-2" />
                <p className="font-medium">Failed to load stories</p>
                <p className="text-sm text-muted-foreground">{error}</p>
              </div>
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                size="sm"
              >
                Try Again
              </Button>
            </div>
          )}

          {/* Stories Grid */}
          {!loading && !error && (
            <div className="grid md:grid-cols-2 gap-4">
              {stories.length === 0 ? (
                <div className="col-span-2 text-center py-12">
                  <BookOpen className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No stories available</p>
                </div>
              ) : (
                stories.map((story) => {
                  const isCompleted = completedQuestions.some((id) =>
                    story.questions.some((q) => q?.id === id)
                  );

                  return (
                    <Card
                      key={story?.id}
                      className="border border-border/50 hover:border-border transition-colors cursor-pointer"
                      onClick={() => setSelectedStory(story?.id)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-md bg-muted">
                              <BookOpen className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-foreground mb-1">
                                {story?.title}
                              </h3>
                              <p className="text-sm text-muted-foreground text truncate w-90">
                                {story?.description}
                              </p>
                            </div>
                          </div>
                          {isCompleted && (
                            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                          )}
                        </div>

                        <div className="space-y-4">
                          {/* Story Info */}
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1">
                              <Badge variant="secondary" className="text-xs">
                                {story?.difficulty}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {story?.readTime}
                            </div>
                            <div className="text-muted-foreground">
                              {story?.questions?.length} questions
                            </div>
                          </div>

                          {/* Progress */}
                          {isCompleted && (
                            <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                              <CheckCircle className="h-4 w-4" />
                              Completed
                            </div>
                          )}

                          {/* Action Button */}
                          <Button className="w-full" size="sm">
                            {isCompleted ? "Review Story" : "Start Reading"}
                            <ChevronRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          )}
        </div>

        {/* Instructions */}
        <Card className="border border-border/50">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              How It Works
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6 text-sm">
              <div className="space-y-2">
                <div className="font-medium text-foreground">
                  1. Read the Story
                </div>
                <div className="text-muted-foreground">
                  Take your time to read through the story carefully. You can
                  read at your own pace.
                </div>
              </div>
              <div className="space-y-2">
                <div className="font-medium text-foreground">
                  2. Answer Questions
                </div>
                <div className="text-muted-foreground">
                  After reading, answer comprehension questions to test your
                  understanding.
                </div>
              </div>
              <div className="space-y-2">
                <div className="font-medium text-foreground">
                  3. Get Feedback
                </div>
                <div className="text-muted-foreground">
                  Receive instant feedback on your answers and track your
                  progress.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
