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
} from "lucide-react";
import Link from "next/link";
import { readingService } from "@/services/readingService";
import LiveSpeechToText from "@/components/reading/LiveSpeechToText";
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
          <div className="p-4 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center">
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
            <Button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-200 shadow-md hover:shadow-lg">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Reading
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
            <Link
              href="/reading"
              className="hover:text-blue-600 transition-colors font-medium"
            >
              Reading
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-semibold">{story?.title}</span>
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
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Clock className="h-4 w-4" />
                  <span>5 Min</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Two-Column Layout */}
          <div
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            style={{ height: "calc(100vh - 250px)" }}
          >
            {/* Story Text Panel */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 border-b border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {/* <Volume2 className="h-5 w-5 text-gray-600" /> */}
                    <h3 className="font-semibold text-gray-900">Story Text</h3>
                  </div>
                  {/* Audio Controls */}
                  <div className="flex items-center space-x-3">
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
                            Resume Audio
                          </>
                        ) : (
                          <>
                            <Pause className="h-4 w-4 mr-2" />
                            Pause Audio
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
              <div className="p-6 h-full overflow-y-auto">
                <div className="prose prose-lg max-w-none">
                  {renderStoryWithHighlighting(story?.passage || "")}
                </div>
              </div>
            </div>

            {/* Speech Practice Panel */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 border-b border-gray-200 p-4">
                <div className="flex items-center space-x-2">
                  <Mic className="h-5 w-5 text-gray-600" />
                  <h3 className="font-semibold text-gray-900">
                    Speech Practice
                  </h3>
                </div>
              </div>
              <div className="p-6 h-full overflow-hidden">
                <LiveSpeechToText className="h-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
