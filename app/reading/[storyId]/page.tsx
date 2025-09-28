"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  XCircle,
  Clock,
  Volume2,
  Play,
  Pause,
  Square,
  Mic,
  Send,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import { readingService } from "@/services/readingService";
import LiveSpeechToText from "@/components/reading/LiveSpeechToText";
import AnalysisResults from "@/components/reading/AnalysisResults";
import { getDifficultyColor } from "@/lib/utils";

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

interface AudioSegment {
  text: string;
  startTime: number;
  endTime: number;
  accuracy?: number;
  pronunciation?: number;
  fluency?: number;
  feedback?: string;
}

interface AnalysisResult {
  passage_id: string;
  audio_data: AudioSegment[];
  score?: number;
  scoreBreakdown?: {
    accuracy: number;
    fluency: number;
    pronunciation: number;
  };
  detailedMetrics?: {
    accuracy: string;
    fluency: string;
    pronunciation: string;
  };
  feedback?: string[];
  level?: string;
  is_solved?: boolean;
  previous_attempts?: number;
  best_score?: number;
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
  const params = useParams();
  const storyId = params.storyId as string;
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Text-to-speech state
  const [ttsService] = useState(new TTSService());
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
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

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      stopSpeech();
    };
  }, []);

  // TTS functions
  const splitTextIntoWords = (text: string) => {
    return text.split(/\s+/).filter((word) => word.trim().length > 0);
  };

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

      const words = splitTextIntoWords(text);
      let currentIndex = 0;

      // Update current word based on time
      audio.ontimeupdate = () => {
        if (words.length > 0 && audio.duration && audio.duration > 0) {
          const currentTime = audio.currentTime;
          const duration = audio.duration;
          const progress = currentTime / duration;
          const estimatedIndex = Math.min(
            Math.floor(progress * words.length),
            words.length - 1
          );

          if (estimatedIndex !== currentIndex) {
            currentIndex = estimatedIndex;
            setCurrentWordIndex(currentIndex);
          }
        }
      };

      audio.onended = () => {
        setIsPlaying(false);
        setIsPaused(false);
        setCurrentWordIndex(-1);
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
        setCurrentWordIndex(-1);
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
    setCurrentWordIndex(-1);
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

  const handlePracticeMore = () => {
    // Navigate to reading practice page or show more practice options
    console.log("Practice more clicked:", analysisResult);
    // This could navigate to a practice selection page or show more reading materials
    // For now, we'll just close the modal and show a message
    setShowAnalysisResults(false);
    // You can implement navigation logic here
  };

  const renderStoryWithHighlighting = (text: string) => {
    if (!text) return null;

    // Split text into words and spaces separately for better control
    const parts = text.split(/(\s+)/);
    let wordCount = 0;

    return (
      <div className="text-xl leading-relaxed text-slate-700 font-medium">
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
              className={`${
                isHighlighted
                  ? "bg-gradient-to-r from-yellow-300 to-amber-300 text-amber-900"
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
        {/* Left Panel - Story Content */}
        <div className="flex-1 bg-white border-r border-gray-200 flex flex-col">
          {/* Left Panel Header */}
          <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Reading Passage
                </h2>
              </div>
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
            </div>
          </div>

          {/* Story Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="prose prose-lg max-w-none">
              {renderStoryWithHighlighting(story?.passage || "")}
            </div>
          </div>
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

      {/* Analysis Results Modal Overlay */}
      {showAnalysisResults && analysisResult && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <AnalysisResults
                result={analysisResult}
                onRetry={handleRetryAnalysis}
                onPracticeMore={handlePracticeMore}
              />
            </div>
          </div>
        </div>
      )}

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
