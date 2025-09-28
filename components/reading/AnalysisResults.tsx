"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  XCircle,
  Volume2,
  Star,
  Trophy,
  Target,
  TrendingUp,
  AlertCircle,
  RotateCcw,
  Eye,
  EyeOff,
  Award,
  BookOpen,
  Zap,
  MessageSquare,
} from "lucide-react";

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

interface AnalysisResultsProps {
  result: AnalysisResult;
  onRetry: () => void;
}

export default function AnalysisResults({
  result,
  onRetry,
}: AnalysisResultsProps) {
  const [showDetailedFeedback, setShowDetailedFeedback] = useState(false);

  const getScoreColor = (score: number) => {
    if (score >= 8) return "from-emerald-500 to-green-500";
    if (score >= 6) return "from-blue-500 to-indigo-500";
    if (score >= 4) return "from-yellow-500 to-orange-500";
    if (score >= 2) return "from-orange-500 to-red-500";
    return "from-red-500 to-red-600";
  };

  const getScoreIcon = (score: number) => {
    if (score >= 8) return <Award className="h-5 w-5" />;
    if (score >= 6) return <CheckCircle className="h-5 w-5" />;
    if (score >= 4) return <AlertCircle className="h-5 w-5" />;
    return <XCircle className="h-5 w-5" />;
  };

  const getOverallRating = (score: number) => {
    if (score >= 8)
      return {
        text: "Excellent",
        color: "text-emerald-600",
        bg: "bg-emerald-50",
      };
    if (score >= 6)
      return { text: "Good", color: "text-blue-600", bg: "bg-blue-50" };
    if (score >= 4)
      return { text: "Fair", color: "text-yellow-600", bg: "bg-yellow-50" };
    if (score >= 2)
      return {
        text: "Needs Work",
        color: "text-orange-600",
        bg: "bg-orange-50",
      };
    return { text: "Poor", color: "text-red-600", bg: "bg-red-50" };
  };

  const getLevelColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case "excellent":
        return "bg-gradient-to-r from-emerald-500 to-green-500 text-white";
      case "good":
        return "bg-gradient-to-r from-blue-500 to-indigo-500 text-white";
      case "satisfactory":
        return "bg-gradient-to-r from-yellow-500 to-orange-500 text-white";
      case "needs improvement":
        return "bg-gradient-to-r from-orange-500 to-red-500 text-white";
      case "poor":
        return "bg-gradient-to-r from-red-500 to-red-600 text-white";
      default:
        return "bg-gradient-to-r from-gray-500 to-gray-600 text-white";
    }
  };

  const overallRating = getOverallRating(result.score || 0);

  return (
    <div className="space-y-6">
      {/* Overall Score Card - HackerRank Style */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Star className="h-6 w-6 text-yellow-500" />
            <span className="text-sm font-medium text-gray-600">
              Overall Score
            </span>
          </div>

          <div className="space-y-3">
            <div className="text-4xl font-bold text-gray-900">
              {result.score || 0}/10
            </div>
            <div className="flex items-center justify-center gap-2">
              <Badge
                variant="outline"
                className={`text-sm font-semibold px-4 py-1 ${getScoreColor(
                  (result.score || 0) * 10
                )}`}
              >
                {getScoreIcon((result.score || 0) * 10)}
                <span className="ml-1">{overallRating.text}</span>
              </Badge>
              {result.level && (
                <Badge
                  variant="outline"
                  className={`text-sm font-semibold px-3 py-1 ${getLevelColor(
                    result.level
                  )}`}
                >
                  {result.level}
                </Badge>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all duration-1000 ${
                (result.score || 0) >= 8
                  ? "bg-gradient-to-r from-green-500 to-emerald-500"
                  : (result.score || 0) >= 6
                  ? "bg-gradient-to-r from-yellow-500 to-orange-500"
                  : "bg-gradient-to-r from-red-500 to-pink-500"
              }`}
              style={{ width: `${(result.score || 0) * 10}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Detailed Scores Grid - Consistent Styling */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2">
              <CheckCircle className="h-5 w-5 text-blue-500" />
              <span className="text-sm font-medium text-gray-600">
                Accuracy
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {result.scoreBreakdown?.accuracy || 0}/4
            </div>
            <div className="text-xs text-gray-500">
              {result.detailedMetrics?.accuracy || "Word Recognition"}
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2">
              <Volume2 className="h-5 w-5 text-purple-500" />
              <span className="text-sm font-medium text-gray-600">
                Pronunciation
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {result.scoreBreakdown?.pronunciation || 0}/4
            </div>
            <div className="text-xs text-gray-500">
              {result.detailedMetrics?.pronunciation || "Speech Clarity"}
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <span className="text-sm font-medium text-gray-600">Fluency</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {result.scoreBreakdown?.fluency || 0}/2
            </div>
            <div className="text-xs text-gray-500">
              {result.detailedMetrics?.fluency || "Reading Speed"}
            </div>
          </div>
        </div>
      </div>

      {/* Previous Attempts Info */}
      {result.previous_attempts && result.previous_attempts > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <RotateCcw className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <div className="text-sm font-medium text-blue-800">
                Previous Attempts: {result.previous_attempts}
              </div>
              <div className="text-xs text-blue-600">
                Best Score: {result.best_score || 0}/10
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Feedback Section - Consistent with Reading Module */}
      {result.feedback && result.feedback.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Feedback</h3>
            </div>

            <div className="space-y-3">
              {result.feedback.map((feedbackItem, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-semibold text-blue-600">
                      {index + 1}
                    </span>
                  </div>
                  <p className="text-gray-700 leading-relaxed text-sm">
                    {feedbackItem}
                  </p>
                </div>
              ))}
            </div>

            {/* Detailed Segment Analysis */}
            {showDetailedFeedback && result.audio_data && (
              <div className="space-y-3 pt-4 border-t border-gray-200">
                <h4 className="text-sm font-semibold text-gray-800">
                  Segment Analysis
                </h4>
                <div className="space-y-2">
                  {result.audio_data.map((segment, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">
                          "{segment.text}"
                        </div>
                        <div className="text-xs text-gray-500">
                          {segment.startTime.toFixed(1)}s -{" "}
                          {segment.endTime.toFixed(1)}s
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {segment.accuracy && (
                          <Badge variant="outline" className="text-xs bg-white">
                            {segment.accuracy}%
                          </Badge>
                        )}
                        {segment.feedback && (
                          <div className="text-xs text-gray-600 max-w-xs truncate">
                            {segment.feedback}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Action Buttons - Consistent with Reading Module */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button onClick={onRetry} variant="outline" className="flex-1">
          <RotateCcw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      </div>
    </div>
  );
}
