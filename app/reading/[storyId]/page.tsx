"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  XCircle,
  Clock,
  Volume2,
  Play,
  Pause,
  Square,
  Send,
  CheckCircle,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { readingService } from "@/services/readingService";
import LiveSpeechToText from "@/components/shared/components/LiveSpeechToText";
import { getDifficultyColor, isEmpty } from "@/lib/utils";
import Markdown from "@/components/shared/components/MarkDown";
import ReadingEvaluationResult from "@/components/shared/components/ReadingEvaluationResult";

interface Story {
  passage_id: string;
  title: string;
  passage: string;
  difficulty: string;
  solved: boolean;
  level: string;
  evaluation_data: AnalysisResult;
}

interface AnalysisResult {
  overall_score: number;
  scoreBreakdown: {
    accuracy: number;
    fluency: number;
    consistency: number;
  };
  detailedMetrics: {
    accuracy: string;
    fluency: string;
    consistency: string;
  };
  feedback: {
    accuracy: string[];
    fluency: string[];
    consistency: string[];
    overall: string[];
  };
  submitted_at: string;
}

interface EvaluationHistoryItem {
  evaluation_data: AnalysisResult;
  submitted_at: string;
}

// Simple TTS Service for English only
class TTSService {
  async generateSpeech(text: string): Promise<string> {
    const response = await fetch("/api/sarvam-tts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to generate speech");
    }

    const data = await response.json();
    console.log(`Received TTS audio with ${data.chunksReceived} chunks`);

    // Convert base64 back to blob URL
    const binaryString = atob(data.audio);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const blob = new Blob([bytes], { type: data.mimeType });
    return URL.createObjectURL(blob);
  }
}

export default function StoryPage() {
  const router = useRouter();
  const params = useParams();
  const storyId = params?.storyId as string;
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Text-to-speech state
  const [ttsService] = useState(new TTSService());
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(
    null
  );
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Speech analysis state
  const [speechChunks, setSpeechChunks] = useState<
    { text: string; startTime: number; endTime: number }[]
  >([]);

  // Analysis results state
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [showAnalysisResults, setShowAnalysisResults] = useState(false);

  // Tabs and submission history state
  const [activeTab, setActiveTab] = useState("passage");
  const [submissionHistory, setSubmissionHistory] = useState<
    EvaluationHistoryItem[]
  >([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  useEffect(() => {
    if (storyId) {
      fetchStory();
      fetchSubmissionHistory();
    }
  }, [storyId]);

  const fetchStory = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch the specific story by ID
      const response = await readingService?.fetchStoryById(storyId);

      const storyData: Story = response;

      if (!isEmpty(storyData)) {
        setStory(storyData);
      }
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
    }
  };

  const fetchSubmissionHistory = async () => {
    if (!storyId) return;

    setIsLoadingHistory(true);
    try {
      const history = await readingService.fetchEvaluationHistory(storyId);
      setSubmissionHistory(history || []);
    } catch (error) {
      console.error("Error fetching submission history:", error);
      setSubmissionHistory([]);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "a few seconds ago";
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 2592000)
      return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return date.toLocaleDateString();
  };

  const getScoreStatus = (score: number) => {
    if (score >= 7)
      return {
        icon: CheckCircle,
        color: "text-green-600",
        bg: "bg-green-50",
        label: "Excellent",
      };
    if (score >= 5)
      return {
        icon: CheckCircle,
        color: "text-blue-600",
        bg: "bg-blue-50",
        label: "Good",
      };
    return {
      icon: XCircle,
      color: "text-yellow-600",
      bg: "bg-yellow-50",
      label: "Needs Practice",
    };
  };

  const handleViewSubmission = (submission: AnalysisResult) => {
    setAnalysisResult(submission);
    setShowAnalysisResults(true);
  };

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      stopSpeech();
    };
  }, []);

  const generateAndPlaySpeech = async (text: string) => {
    if (!story) return;

    try {
      setIsGenerating(true);

      // Stop any existing audio
      if (audioElement) {
        audioElement.pause();
        audioElement.currentTime = 0;
      }

      // Clean up previous URL
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }

      // Generate speech using our API route
      const generatedAudioUrl = await ttsService.generateSpeech(text);
      setAudioUrl(generatedAudioUrl);

      // Create audio element
      const audio = new Audio(generatedAudioUrl);
      setAudioElement(audio);

      audio.onended = () => {
        setIsPlaying(false);
        setIsPaused(false);
        // Clean up URL object
        if (audioUrl) {
          URL.revokeObjectURL(audioUrl);
          setAudioUrl(null);
        }
      };

      audio.onerror = (e) => {
        console.error("Audio playback error:", e);
        setIsPlaying(false);
        setIsPaused(false);
        setIsGenerating(false);
      };

      // Start playing
      await audio.play();
      setIsPlaying(true);
      setIsPaused(false);
      setIsGenerating(false);
    } catch (error) {
      console.error("Error generating or playing speech:", error);
      setIsGenerating(false);
      setIsPlaying(false);
      setIsPaused(false);
    }
  };

  const pauseSpeech = () => {
    if (audioElement && !audioElement.paused) {
      audioElement.pause();
      setIsPaused(true);
    } else if ("speechSynthesis" in window && speechSynthesis.speaking) {
      speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  const resumeSpeech = () => {
    if (audioElement && audioElement.paused) {
      audioElement.play().then(() => setIsPaused(false));
    } else if ("speechSynthesis" in window && speechSynthesis.paused) {
      speechSynthesis.resume();
      setIsPaused(false);
    }
  };

  const stopSpeech = () => {
    if (audioElement) {
      audioElement.pause();
      audioElement.currentTime = 0;
    }

    if ("speechSynthesis" in window) {
      speechSynthesis.cancel();
    }

    // Clean up URL object
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }

    setIsPlaying(false);
    setIsPaused(false);
    setIsGenerating(false);
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
      generateAndPlaySpeech(story.passage);
    }
  };

  const handleStopClick = () => {
    stopSpeech();
  };

  const handleSubmitAnalysis = async () => {
    if (speechChunks.length === 0) {
      return;
    }

    if (!story) {
      return;
    }

    try {
      setIsAnalyzing(true);
      setAnalysisError(null);

      const result = await readingService.evaluateReading(
        story.passage_id,
        speechChunks
      );

      setAnalysisResult(result);
      setShowAnalysisResults(true);
      // Refresh submission history
      await fetchSubmissionHistory();
    } catch (error) {
      console.error("Error submitting analysis:", error);
      setAnalysisError(
        error instanceof Error
          ? error.message
          : "Failed to analyze reading. Please try again."
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRetryAnalysis = () => {
    setShowAnalysisResults(false);
    setAnalysisResult(null);
    setAnalysisError(null);
    setSpeechChunks([]);
  };

  const handleCloseAnalysis = () => {
    router.push("/reading");
  };

  const handleRetryReading = () => {
    setShowAnalysisResults(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
          <div className="p-4 bg-gradient-to-r from-orange-100 to-orange-200 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Loading story...
          </h3>
          <p className="text-gray-600">
            Please wait while we fetch the content
          </p>
        </div>
      </div>
    );
  }

  if (error || !story) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20 max-w-md mx-auto">
          <div className="p-4 bg-gradient-to-r from-red-100 to-pink-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <XCircle className="h-8 w-8 text-red-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {error || "Story not found"}
          </h3>
          <p className="text-gray-600 mb-6">
            {error
              ? "Please try again later"
              : "The story you're looking for doesn't exist"}
          </p>
          <Link href="/reading">
            <Button className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium rounded-lg transition-all duration-200 shadow-md hover:shadow-lg">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Reading
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header Bar - HackerRank Style */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <nav className="flex items-center space-x-2 text-sm text-gray-500">
              <Link
                href="/reading"
                className="hover:text-blue-600 transition-colors"
              >
                Reading
              </Link>
              <span>/</span>
              <span className="text-gray-900 font-medium">{story?.title}</span>
            </nav>
          </div>
          <div className="flex items-center space-x-3">
            <Badge
              variant="secondary"
              className={`text-xs font-medium px-3 py-1 capitalize ${getDifficultyColor(
                story?.difficulty
              )}`}
            >
              {story?.difficulty}
            </Badge>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>5 Min</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Two Panel Layout */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Panel - Passage & Submissions Tabs */}
        <div className="flex-1 bg-white border-r border-gray-200 flex flex-col">
          {/* Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="flex-1 flex flex-col"
          >
            <div className="bg-white border-b border-gray-200 px-6 flex items-center justify-between">
              <TabsList className="bg-transparent h-auto p-0 gap-8 -mb-px">
                <TabsTrigger
                  value="passage"
                  className="relative bg-transparent shadow-none border-0 rounded-none px-1 pb-4 pt-4 font-medium text-[15px] text-gray-500 data-[state=active]:text-gray-900 hover:text-gray-700 transition-colors duration-150 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600 after:rounded-full after:scale-x-0 data-[state=active]:after:scale-x-100 after:transition-transform after:duration-300 after:ease-out"
                >
                  Passage
                </TabsTrigger>
                <TabsTrigger
                  value="submissions"
                  className="relative bg-transparent shadow-none border-0 rounded-none px-1 pb-4 pt-4 font-medium text-[15px] text-gray-500 data-[state=active]:text-gray-900 hover:text-gray-700 transition-colors duration-150 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600 after:rounded-full after:scale-x-0 data-[state=active]:after:scale-x-100 after:transition-transform after:duration-300 after:ease-out"
                >
                  <span>Submissions</span>
                  {submissionHistory.length > 0 && (
                    <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-semibold text-blue-700 bg-blue-100 rounded-full">
                      {submissionHistory.length}
                    </span>
                  )}
                </TabsTrigger>
              </TabsList>
              {activeTab === "passage" && (
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={handleSpeakerClick}
                    disabled={isGenerating}
                    variant={isPlaying ? "secondary" : "outline"}
                    size="sm"
                    className="font-medium"
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent mr-2"></div>
                        Generating
                      </>
                    ) : isPlaying ? (
                      isPaused ? (
                        <>
                          <Play className="h-4 w-4 mr-2" />
                          Resume
                        </>
                      ) : (
                        <>
                          <Pause className="h-4 w-4 mr-2" />
                          Pause
                        </>
                      )
                    ) : (
                      <>
                        <Volume2 className="h-4 w-4 mr-2" />
                        Play Audio
                      </>
                    )}
                  </Button>
                  {(isPlaying || isGenerating) && (
                    <Button
                      onClick={handleStopClick}
                      disabled={isGenerating}
                      variant="outline"
                      size="sm"
                    >
                      <Square className="h-4 w-4 mr-2" />
                      Stop
                    </Button>
                  )}
                </div>
              )}
            </div>

            {/* Passage Tab Content */}
            <TabsContent
              value="passage"
              className="flex-1 overflow-y-auto p-6 m-0"
            >
              <div className="prose prose-lg max-w-none">
                <Markdown passage={story?.passage || ""} />
              </div>
            </TabsContent>

            {/* Submissions Tab Content */}
            <TabsContent
              value="submissions"
              className="flex-1 overflow-y-auto m-0"
            >
              {isLoadingHistory ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                </div>
              ) : submissionHistory.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <div className="text-center">
                    <div className="mb-3 text-gray-400">
                      <svg
                        className="mx-auto h-12 w-12"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <p className="text-sm font-medium">No submissions yet</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Submit your first evaluation to see it here
                    </p>
                  </div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  {/* Table Header */}
                  <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200 text-xs font-medium text-gray-600">
                    <div className="col-span-2">Status</div>
                    <div className="col-span-2">Submitted</div>
                    <div className="col-span-2">Accuracy</div>
                    <div className="col-span-2">Fluency</div>
                    <div className="col-span-2">Consistency</div>
                    <div className="col-span-2">Score</div>
                  </div>

                  {/* Table Rows */}
                  <div className="divide-y divide-gray-100">
                    {submissionHistory.map((submission) => {
                      const status = getScoreStatus(
                        submission?.evaluation_data?.score
                      );
                      const StatusIcon = status.icon;

                      return (
                        <div
                          className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors group"
                          onClick={() =>
                            handleViewSubmission(submission?.evaluation_data)
                          }
                        >
                          {/* Status */}
                          <div className="col-span-2 flex items-center gap-2">
                            <div className={`p-1 rounded ${status.bg}`}>
                              <StatusIcon
                                className={`h-4 w-4 ${status.color}`}
                              />
                            </div>
                            <span
                              className={`text-sm font-medium ${status.color}`}
                            >
                              {status.label}
                            </span>
                          </div>

                          {/* Submitted Time */}
                          <div className="col-span-2 flex items-center">
                            <span className="text-sm text-gray-600">
                              {getRelativeTime(submission?.submitted_at)}
                            </span>
                          </div>

                          {/* Accuracy Score */}
                          <div className="col-span-2 flex items-center">
                            <span className="text-sm font-medium text-gray-900">
                              {Math.round(
                                submission?.evaluation_data?.scoreBreakdown
                                  ?.accuracy
                              )}
                              /4
                            </span>
                          </div>

                          {/* Fluency Score */}
                          <div className="col-span-2 flex items-center">
                            <span className="text-sm font-medium text-gray-900">
                              {Math.round(
                                submission?.evaluation_data?.scoreBreakdown
                                  ?.fluency
                              )}
                              /4
                            </span>
                          </div>

                          {/* Consistency Score */}
                          <div className="col-span-2 flex items-center">
                            <span className="text-sm font-medium text-gray-900">
                              {Math.round(
                                submission?.evaluation_data?.scoreBreakdown
                                  ?.consistency
                              )}
                              /2
                            </span>
                          </div>

                          {/* Overall Score */}
                          <div className="col-span-2 flex items-center justify-between">
                            <span
                              className={`text-sm font-bold ${status?.color}`}
                            >
                              {Math.round(submission?.evaluation_data?.score)}
                              /10
                            </span>
                            <button className="opacity-0 group-hover:opacity-100 text-blue-600 text-xs font-medium transition-opacity">
                              View Details →
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Panel - Speech Practice */}
        <div className="w-1/2 bg-white flex flex-col">
          {/* Right Panel Header */}
          <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-1 h-6 bg-green-500 rounded-full"></div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Reading Practice
                </h2>
              </div>
              <Button
                onClick={handleSubmitAnalysis}
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white font-medium"
                disabled={speechChunks.length === 0 || isAnalyzing}
              >
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent mr-2"></div>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Submit
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Speech Practice Content */}
          <div className="flex-1 overflow-hidden">
            <LiveSpeechToText onChunksUpdate={setSpeechChunks} />

            {/* Speech Chunks Preview */}
            {speechChunks.length > 0 && (
              <div className="p-4 bg-green-50 border-t border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">
                    Captured {speechChunks.length} segment(s)
                  </span>
                </div>
                <div className="text-xs text-green-600">
                  Total duration:{" "}
                  {speechChunks.length > 0
                    ? `${speechChunks[speechChunks.length - 1].endTime.toFixed(
                        1
                      )}s`
                    : "0s"}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Analysis Results Dialog */}
      <Dialog open={showAnalysisResults} onOpenChange={setShowAnalysisResults}>
        <DialogContent className="sm:max-w-6xl max-h-[90vh] overflow-hidden p-0 rounded-2xl shadow-2xl border-0">
          <div className="overflow-y-auto max-h-[90vh]">
            {analysisResult && (
              <ReadingEvaluationResult
                result={analysisResult}
                onClose={handleCloseAnalysis}
                onRetry={handleRetryReading}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Analysis Error Modal */}
      {analysisError && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-red-100 rounded-full">
                  <XCircle className="h-6 w-6 text-red-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-red-800 mb-2">
                    Analysis Failed
                  </h3>
                  <p className="text-red-700 leading-relaxed">
                    {analysisError}
                  </p>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button
                  onClick={() => setAnalysisError(null)}
                  variant="outline"
                  className="border-red-300 text-red-700 hover:bg-red-50 hover:border-red-400"
                >
                  Dismiss
                </Button>
                <Button
                  onClick={handleRetryAnalysis}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Try Again
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
