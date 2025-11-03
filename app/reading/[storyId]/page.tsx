"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
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
} from "lucide-react";
import Link from "next/link";
import { readingService } from "@/services/readingService";
import LiveSpeechToText, {
  LiveSpeechToTextRef,
} from "@/components/shared/components/LiveSpeechToText";
import { getDifficultyColor, getLevelColor, isEmpty } from "@/lib/utils";
import Markdown from "@/components/shared/components/MarkDown";
import ReadingEvaluationResult from "@/components/shared/components/ReadingEvaluationResult";

interface Story {
  passage_id: string;
  title: string;
  passage: string;
  difficulty: string;
  level: string;
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
  const liveSpeechRef = useRef<LiveSpeechToTextRef>(null);

  // Analysis results state
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [showAnalysisResults, setShowAnalysisResults] = useState(false);

  useEffect(() => {
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

  const generateAndPlaySpeech = async (text: string) => {
    if (!story) return;

    try {
      setIsGenerating(true);

      // Stop any existing audio
      if (audioElement) {
        audioElement?.pause();
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
    }
  };

  const resumeSpeech = () => {
    if (audioElement && audioElement.paused) {
      audioElement.play().then(() => setIsPaused(false));
    }
  };

  const stopSpeech = () => {
    if (audioElement) {
      audioElement?.pause();
      audioElement.currentTime = 0;
    }

    setIsPlaying(false);
    setIsPaused(false);
    setIsGenerating(false);
  };

  const handleSpeakerClick = async () => {
    if (!story) return;

    if (isPlaying) {
      if (isPaused) {
        resumeSpeech();
      } else {
        pauseSpeech();
      }
    } else {
      if (audioElement) {
        await audioElement.play();
        setIsPlaying(true);
        setIsPaused(false);
        setIsGenerating(false);
      } else {
        generateAndPlaySpeech(story.passage);
      }
    }
  };

  const handleStopClick = () => {
    stopSpeech();
  };

  const handleSubmitAnalysis = async () => {
    liveSpeechRef.current?.stopListening();
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

  const handleCloseAnalysis = () => {
    router.push("/reading");
  };

  const handleRetryReading = () => {
    setShowAnalysisResults(false);
    setAnalysisResult(null);
    setSpeechChunks([]);
    liveSpeechRef.current?.handleRestart();
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
              className={`text-xs font-medium px-3 py-1 capitalize ${getLevelColor(
                story?.level
              )}`}
            >
              {story?.level}
            </Badge>
            <Badge
              variant="secondary"
              className={`text-xs font-medium px-3 py-1 capitalize ${getDifficultyColor(
                story?.difficulty
              )}`}
            >
              {story?.difficulty}
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content - Two Panel Layout */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Panel - Passage */}
        <div className="flex-1 bg-white border-r border-gray-200 flex flex-col">
          {/* Passage Header */}
          <div className="bg-white border-b border-gray-200 px-6 flex items-center justify-between py-4">
            <h2 className="text-lg font-semibold text-gray-900">Passage</h2>
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

          {/* Passage Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="prose prose-lg max-w-none">
              <Markdown passage={story?.passage || ""} />
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
            <LiveSpeechToText
              ref={liveSpeechRef}
              onChunksUpdate={setSpeechChunks}
            />
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
