"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Clock,
  Lightbulb,
  Mic,
  XCircle,
  RefreshCw,
} from "lucide-react";
import LiveSpeechToText from "@/components/shared/LiveSpeechToText";
import { speakingService, SpeakingTopic } from "@/services/speakingService";
import { getDifficultyColor, getLevelColor } from "@/lib/utils";

interface SpeakingTopicComponentProps {
  level: "beginner" | "intermediate" | "advanced";
  difficulty: "easy" | "medium" | "hard";
  onBack: () => void;
}

export function SpeakingTopicComponent({
  level,
  difficulty,
  onBack,
}: SpeakingTopicComponentProps) {
  const [topic, setTopic] = useState<SpeakingTopic | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [speechChunks, setSpeechChunks] = useState<
    { text: string; startTime: number; endTime: number }[]
  >([]);

  useEffect(() => {
    fetchTopic();
  }, [level, difficulty]);

  const fetchTopic = async () => {
    try {
      setLoading(true);
      setError(null);
      const randomTopic = await speakingService.fetchRandomTopic(
        level,
        difficulty
      );
      setTopic(randomTopic);
    } catch (err) {
      setError("Failed to load topic. Please try again.");
      console.error("Error fetching topic:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleNewTopic = () => {
    setSpeechChunks([]);
    fetchTopic();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
          <div className="p-4 bg-gradient-to-r from-orange-100 to-orange-200 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Loading your topic...
          </h3>
          <p className="text-gray-600">
            Please wait while we prepare your speaking challenge
          </p>
        </div>
      </div>
    );
  }

  if (error || !topic) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20 max-w-md mx-auto">
          <div className="p-4 bg-gradient-to-r from-red-100 to-pink-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <XCircle className="h-8 w-8 text-red-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Unable to load topic
          </h3>
          <p className="text-gray-600 mb-6">
            {error || "Something went wrong"}
          </p>
          <div className="flex gap-3 justify-center">
            <Button onClick={onBack} variant="outline" className="px-6 py-2">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
            <Button
              onClick={fetchTopic}
              className="px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
            >
              Try Again
            </Button>
          </div>
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
              <span className="hover:text-blue-600 transition-colors cursor-pointer">
                Speaking
              </span>
              <span>/</span>
              <span className="text-gray-900 font-medium">{topic.title}</span>
            </nav>
          </div>
          <div className="flex items-center space-x-3">
            <Badge
              variant="secondary"
              className={`text-xs font-medium px-3 py-1 capitalize ${getLevelColor(
                topic.level
              )}`}
            >
              {topic.level}
            </Badge>
            <Badge
              variant="secondary"
              className={`text-xs font-medium px-3 py-1 capitalize ${getDifficultyColor(
                topic.difficulty
              )}`}
            >
              {topic.difficulty}
            </Badge>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>{topic.duration}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Two Panel Layout */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Panel - Topic & Tips */}
        <div className="flex-1 bg-white border-r border-gray-200 flex flex-col">
          {/* Left Panel Header */}
          <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Speaking Topic & Tips
                </h2>
              </div>
              <Button
                onClick={handleNewTopic}
                variant="outline"
                size="sm"
                className="font-medium"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                New Topic
              </Button>
            </div>
          </div>

          {/* Topic Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              {/* Topic Card */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Mic className="h-5 w-5 text-blue-600" />
                  <h3 className="text-base font-semibold text-gray-900">
                    Your Speaking Topic
                  </h3>
                </div>
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
                  <p className="text-gray-800 leading-relaxed text-lg">
                    {topic.topic}
                  </p>
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h4 className="text-sm font-semibold text-gray-900 mb-2">
                  How to Practice:
                </h4>
                <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
                  <li>Read the topic carefully</li>
                  <li>Think about your response for a moment</li>
                  <li>Click the microphone icon to start recording</li>
                  <li>Speak naturally and clearly about the topic</li>
                  <li>Review your transcript and practice again if needed</li>
                </ol>
              </div>
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
                  Live Speech Recognition
                </h2>
              </div>
              {speechChunks.length > 0 && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="font-medium">
                    {speechChunks.length} segment(s) recorded
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Speech Practice Content */}
          <div className="flex-1 overflow-hidden flex flex-col">
            <LiveSpeechToText
              onChunksUpdate={setSpeechChunks}
              placeholderText="Start speaking about your topic"
              listeningText="Listening to your speech..."
              readyText="Ready to speak"
              clickToStartText="Click the microphone to start speaking"
            />

            {/* Speech Stats */}
            {speechChunks.length > 0 && (
              <div className="p-4 bg-green-50 border-t border-green-200">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Words spoken:</span>
                    <span className="font-semibold text-gray-900">
                      {
                        speechChunks
                          .map((chunk) => chunk.text)
                          .join(" ")
                          .trim()
                          .split(/\s+/).length
                      }
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Total duration:</span>
                    <span className="font-semibold text-gray-900">
                      {speechChunks.length > 0
                        ? `${speechChunks[
                            speechChunks.length - 1
                          ].endTime.toFixed(1)}s`
                        : "0s"}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
