"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  XCircle,
  Trophy,
  RotateCcw,
  Clock,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Square,
} from "lucide-react";
import Link from "next/link";
import { readingService } from "@/services/readingService";

interface Question {
  question_id: string;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

interface Story {
  _id: string;
  passage_id: string;
  title: string;
  passage: string;
  difficulty: string;
  standard: number;
  questions: Question[];
  created_at: string;
}

export default function StoryPage() {
  const params = useParams();
  const storyId = params.storyId as string;

  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showQuestions, setShowQuestions] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [textAnswer, setTextAnswer] = useState<string>("");
  const [verificationResults, setVerificationResults] = useState<any[]>([]);
  const [verifyingAnswers, setVerifyingAnswers] = useState(false);

  // Text-to-speech state
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const [speechUtterance, setSpeechUtterance] =
    useState<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    const fetchStory = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch the specific story by ID
        const response = await readingService.fetchStoryById(storyId);
        const storyData: Story[] = response;

        if (storyData && storyData.length > 0) {
          setStory(storyData[0]);
        } else {
          setError("Story not found");
        }
      } catch (err) {
        console.error("Error fetching story:", err);
        setError("Failed to load story. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (storyId) {
      fetchStory();
    }
  }, [storyId]);

  // Text-to-speech functions
  const splitTextIntoWords = (text: string) => {
    return text.split(/\s+/).filter((word) => word.trim().length > 0);
  };

  const speakText = (text: string) => {
    if (!story) return;

    // Stop any existing speech
    if (speechUtterance) {
      speechSynthesis?.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.8; // Slightly slower for better comprehension
    utterance.pitch = 1;
    utterance.volume = 1;

    const words = splitTextIntoWords(text);
    let currentIndex = 0;

    utterance.onboundary = (event) => {
      if (event.name === "word") {
        setCurrentWordIndex(currentIndex);
        currentIndex++;
      }
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
      setCurrentWordIndex(-1);
      setSpeechUtterance(null);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setIsPaused(false);
      setCurrentWordIndex(-1);
      setSpeechUtterance(null);
    };

    setSpeechUtterance(utterance);
    speechSynthesis?.speak(utterance);
    setIsPlaying(true);
    setIsPaused(false);
  };

  const pauseSpeech = () => {
    if (speechSynthesis?.speaking && !speechSynthesis?.paused) {
      speechSynthesis?.pause();
      setIsPaused(true);
    }
  };

  const resumeSpeech = () => {
    if (speechSynthesis?.paused) {
      speechSynthesis?.resume();
      setIsPaused(false);
    }
  };

  const stopSpeech = () => {
    speechSynthesis?.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentWordIndex(-1);
    setSpeechUtterance(null);
  };

  const handleSpeakerClick = () => {
    if (!story) return;

    if (isPlaying) {
      if (isPaused) {
        resumeSpeech();
      } else {
        pauseSpeech();
      }
    } else {
      speakText(story.passage);
    }
  };

  const handleStopClick = () => {
    stopSpeech();
  };

  // Cleanup speech on component unmount
  useEffect(() => {
    return () => {
      if (speechUtterance) {
        speechSynthesis?.cancel();
      }
    };
  }, [speechUtterance]);

  const handleAnswerSelect = (value: string) => {
    setSelectedAnswer(value);
  };

  const handleNextQuestion = async () => {
    if (!story) return;

    const question = story.questions[currentQuestion];
    const hasOptions = question?.options && question?.options?.length > 0;
    const hasAnswer = hasOptions ? selectedAnswer : textAnswer?.trim();

    if (hasAnswer) {
      const answerValue = hasOptions ? selectedAnswer : textAnswer?.trim();
      const updatedAnswers = [
        ...answers,
        {
          question_id: question.question_id,
          answer: answerValue,
        },
      ];
      setAnswers(updatedAnswers);

      if (currentQuestion < story.questions.length - 1) {
        setCurrentQuestion((prev) => prev + 1);
        setSelectedAnswer("");
        setTextAnswer("");
      } else {
        // Finish quiz - call verify API
        try {
          setVerifyingAnswers(true);
          const verificationResponse = await readingService.verifyAnswers(
            storyId,
            updatedAnswers
          );
          setVerificationResults(verificationResponse);
          setShowResults(true);
        } catch (error) {
          console.error("Error verifying answers:", error);
          // Still show results even if verification fails
          setShowResults(true);
        } finally {
          setVerifyingAnswers(false);
        }
      }
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "beginner":
      case "easy":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800";
      case "intermediate":
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800";
      case "advanced":
      case "hard":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800";
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800";
    }
  };

  const renderStoryWithHighlighting = (text: string) => {
    if (!text) return null;

    // Split text into words and spaces separately for better control
    const parts = text.split(/(\s+)/);
    let wordCount = 0;

    return (
      <div className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
        {parts.map((part, index) => {
          const isWord = part.trim().length > 0 && !/^\s+$/.test(part);
          const isHighlighted =
            isWord && wordCount === currentWordIndex && isPlaying;

          if (isWord) {
            wordCount++;
          }

          return (
            <span
              key={index}
              className={`transition-all duration-200 ${
                isHighlighted
                  ? "bg-yellow-200 dark:bg-yellow-800 text-yellow-900 dark:text-yellow-100 rounded"
                  : ""
              }`}
            >
              {part}
            </span>
          );
        })}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading story...</p>
        </div>
      </div>
    );
  }

  if (error || !story) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            {error || "Story not found"}
          </h1>
          <Link href="/reading">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Reading
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Verification loading view
  if (verifyingAnswers) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-6"></div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Verifying Your Answers
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-2">
            Please wait while we check your responses...
          </p>
          <div className="flex justify-center space-x-1 mt-4">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
            <div
              className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
              style={{ animationDelay: "0.1s" }}
            ></div>
            <div
              className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  // Results view
  if (showResults) {
    // Calculate score from verification results if available, otherwise fallback to local calculation
    const correctAnswers =
      verificationResults?.filter((result) => result.correct).length || 0;

    const scorePercentage = story
      ? Math.round((correctAnswers / story.questions.length) * 100)
      : 0;
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Results Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
              <Trophy className="h-10 w-10 text-gray-600 dark:text-gray-400" />
            </div>
            <h2 className="text-3xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Quiz Complete!
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Review your performance for "{story?.title}"
            </p>
          </div>

          {/* Score */}
          <div className="text-center mb-8">
            <div className="text-6xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              {scorePercentage}%
            </div>
            <p className="text-lg text-gray-500 dark:text-gray-400">
              {correctAnswers} of {story?.questions?.length} questions answered
              correctly
            </p>
          </div>

          {/* Question Review */}
          <div className="space-y-6 mb-8">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
              Question Review
            </h3>
            {verificationResults.map((result: any, index) => {
              const isCorrect = result.correct;

              return (
                <Card
                  key={result?.question_id}
                  className="border border-gray-200 dark:border-gray-700"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center mt-1 ${
                          isCorrect
                            ? "bg-green-100 dark:bg-green-900/30"
                            : "bg-red-100 dark:bg-red-900/30"
                        }`}
                      >
                        {isCorrect ? (
                          <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                          {result?.question}
                        </p>
                        <div className="space-y-3 text-sm">
                          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded border">
                            <span className="text-gray-500 dark:text-gray-400 font-medium">
                              Your answer:{" "}
                            </span>
                            <span className="text-gray-900 dark:text-gray-100">
                              {result?.your_answer}
                            </span>
                          </div>
                          {!isCorrect && (
                            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-800">
                              <span className="text-green-700 dark:text-green-400 font-medium">
                                Correct answer:{" "}
                              </span>
                              <span className="text-green-800 dark:text-green-300">
                                {result?.correct_answer}
                              </span>
                            </div>
                          )}
                          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
                            <span className="text-blue-700 dark:text-blue-400 font-medium">
                              Explanation:{" "}
                            </span>
                            <p className="mt-2 text-blue-800 dark:text-blue-300">
                              {result?.explanation}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              className="border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gradient-to-br hover:from-gray-50 hover:to-gray-100 dark:hover:from-gray-800 dark:hover:to-gray-700 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-all duration-300 ease-out hover:shadow-md hover:-translate-y-0.5 px-6 py-2"
              onClick={() => {
                setShowResults(false);
                setShowQuestions(false);
                setCurrentQuestion(0);
                setAnswers([]);
                setSelectedAnswer("");
                setTextAnswer("");
                setVerificationResults([]);
                setVerifyingAnswers(false);
              }}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Story
            </Button>
            <Link href="/reading">
              <Button className="bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-700 hover:to-violet-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 ease-out hover:-translate-y-1 px-6 py-2 font-medium tracking-wide border border-violet-500 hover:border-violet-600">
                <RotateCcw className="h-4 w-4 mr-2" />
                Continue Learning
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Questions view
  if (showQuestions && story) {
    const question = story.questions[currentQuestion];
    const progress = (currentQuestion / story?.questions?.length) * 100;

    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <nav className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
              <Link
                href="/reading"
                className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              >
                Reading
              </Link>
              <span>/</span>
              <span className="text-gray-900 dark:text-gray-100 font-medium">
                {story?.title}
              </span>
            </nav>

            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  Questions for "{story?.title}"
                </h1>
                <div className="flex items-center gap-3">
                  <Badge
                    variant="secondary"
                    className={`text-xs font-medium border ${getDifficultyColor(
                      story?.difficulty
                    )}`}
                  >
                    {story?.difficulty}
                  </Badge>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {story?.questions?.length} questions
                  </span>
                </div>
              </div>
            </div>

            {/* Progress */}
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600 dark:text-gray-400">
                  Question {currentQuestion + 1} of {story?.questions?.length}
                </span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {Math.round(progress)}% Complete
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </div>

          {/* Question */}
          <Card className="border border-gray-200 dark:border-gray-700">
            <CardContent className="p-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
                {question?.question}
              </h3>

              {/* Multiple Choice Questions */}
              {question?.options && question?.options?.length > 0 ? (
                <RadioGroup
                  value={selectedAnswer}
                  onValueChange={handleAnswerSelect}
                >
                  <div className="space-y-3">
                    {question?.options.map((option, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-3 p-4 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-colors cursor-pointer bg-white dark:bg-gray-800 rounded-lg"
                      >
                        <RadioGroupItem
                          value={option}
                          id={`option-${index}`}
                          className="border-gray-300 dark:border-gray-600"
                        />
                        <Label
                          htmlFor={`option-${index}`}
                          className="flex-1 cursor-pointer text-gray-900 dark:text-gray-100"
                        >
                          {option}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              ) : (
                /* Text Input Questions */
                <div className="space-y-4">
                  <Label
                    htmlFor="text-answer"
                    className="text-sm font-medium text-gray-900 dark:text-gray-100"
                  >
                    Your Answer
                  </Label>
                  <Textarea
                    id="text-answer"
                    placeholder="Enter your answer here..."
                    value={textAnswer}
                    onChange={(e) => setTextAnswer(e?.target?.value)}
                    className="min-h-[120px] resize-none border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-500"
                  />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Provide your response based on your understanding of the
                    passage.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Button */}
          <div className="mt-8 flex justify-between">
            <Button
              variant="outline"
              className="border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gradient-to-br hover:from-gray-50 hover:to-gray-100 dark:hover:from-gray-800 dark:hover:to-gray-700 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-all duration-300 ease-out hover:shadow-md hover:-translate-y-0.5 px-6 py-2"
              onClick={() => setShowQuestions(false)}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Story
            </Button>
            <Button
              onClick={handleNextQuestion}
              disabled={
                question?.options && question?.options?.length > 0
                  ? !selectedAnswer
                  : !textAnswer.trim()
              }
              className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 ease-out hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-lg px-6 py-2 font-medium tracking-wide border border-emerald-500 hover:border-emerald-600"
            >
              {currentQuestion < story.questions.length - 1
                ? "Next Question"
                : "Finish Quiz"}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <nav className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
            <Link
              href="/reading"
              className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            >
              Reading
            </Link>
            <span>/</span>
            <span className="text-gray-900 dark:text-gray-100 font-medium">
              {story?.title}
            </span>
          </nav>

          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <Badge
                  variant="secondary"
                  className={`text-xs font-medium border ${getDifficultyColor(
                    story?.difficulty
                  )}`}
                >
                  {story?.difficulty}
                </Badge>
                <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                  <Clock className="h-4 w-4" />
                  <span>5 Min</span>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {story?.questions?.length} questions
                </div>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3 leading-tight">
                {story?.title}
              </h1>
            </div>
          </div>
        </div>

        {/* Story Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="p-8">
            <div className="max-w-3xl mx-auto">
              <div className="space-y-6">
                {/* Speaker Controls */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSpeakerClick}
                      className={`flex items-center gap-2 transition-all duration-300 ease-out hover:shadow-md hover:-translate-y-0.5 ${
                        isPlaying
                          ? "bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/25 dark:to-indigo-900/25 border-blue-200 dark:border-blue-600 text-blue-700 dark:text-blue-300 shadow-sm"
                          : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300"
                      } hover:border-blue-300 dark:hover:border-blue-600 hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 dark:hover:from-blue-900/20 dark:hover:to-indigo-900/20 hover:text-blue-700 dark:hover:text-blue-300`}
                    >
                      {isPlaying ? (
                        isPaused ? (
                          <>
                            <Play className="h-4 w-4" />
                            Resume
                          </>
                        ) : (
                          <>
                            <Pause className="h-4 w-4" />
                            Pause
                          </>
                        )
                      ) : (
                        <>
                          <Volume2 className="h-4 w-4" />
                          Listen
                        </>
                      )}
                    </Button>
                    {isPlaying && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleStopClick}
                        className="flex items-center gap-2 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-red-300 dark:hover:border-red-600 hover:bg-gradient-to-br hover:from-red-50 hover:to-pink-50 dark:hover:from-red-900/20 dark:hover:to-pink-900/20 text-gray-700 dark:text-gray-300 hover:text-red-700 dark:hover:text-red-300 transition-all duration-300 ease-out hover:shadow-md hover:-translate-y-0.5"
                      >
                        <Square className="h-4 w-4" />
                        Stop
                      </Button>
                    )}
                  </div>
                </div>

                {/* Story Text with Highlighting */}
                <div className="whitespace-pre-wrap break-words overflow-hidden">
                  {renderStoryWithHighlighting(story?.passage || "")}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-end">
          <Button
            onClick={() => {
              handleStopClick();
              setShowQuestions(true);
            }}
            className="bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900 text-white shadow-lg hover:shadow-xl transition-all duration-300 ease-out hover:-translate-y-1 px-8 py-3 font-medium tracking-wide border border-slate-600 hover:border-slate-700"
          >
            Start Questions
          </Button>
        </div>
      </div>
    </div>
  );
}
