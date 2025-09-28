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
  onViewDetails: () => void;
}

export default function AnalysisResults({
  result,
  onRetry,
  onViewDetails,
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
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <div className="relative">
          <div
            className={`inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r ${getScoreColor(
              result.score || 0
            )} shadow-lg`}
          >
            {getScoreIcon(result.score || 0)}
          </div>
          <div className="absolute -top-2 -right-2">
            <div
              className={`w-8 h-8 rounded-full ${overallRating.bg} flex items-center justify-center shadow-md`}
            >
              <Star className="h-4 w-4 text-yellow-500" />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl font-bold text-gray-900">
            {result.is_solved ? "🎉 Congratulations!" : "📊 Reading Analysis"}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {result.is_solved
              ? "You've successfully completed this reading passage with flying colors!"
              : "Here's your detailed reading performance analysis"}
          </p>
        </div>

        {/* Score Display */}
        <div className="flex items-center justify-center gap-4">
          <div className="text-center">
            <div className="text-5xl font-bold text-gray-900 mb-1">
              {result.score || 0}
            </div>
            <div className="text-sm text-gray-500 font-medium">out of 10</div>
          </div>
          <div className="h-16 w-px bg-gray-200"></div>
          <div className="text-center">
            <Badge
              className={`px-4 py-2 text-sm font-semibold ${getLevelColor(
                result.level || ""
              )}`}
            >
              {result.level || "Not Rated"}
            </Badge>
            <div className="text-sm text-gray-500 mt-1 font-medium">
              {overallRating.text}
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Accuracy */}
        <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
          <div className="p-6 text-center space-y-4">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 group-hover:bg-blue-200 transition-colors">
              <Target className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {result.scoreBreakdown?.accuracy || 0}
              </div>
              <div className="text-sm text-gray-600 font-medium">Accuracy</div>
              <div className="text-xs text-gray-500 mt-1">
                {result.detailedMetrics?.accuracy || "Word Recognition"}
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-1000"
                style={{
                  width: `${(result.scoreBreakdown?.accuracy || 0) * 10}%`,
                }}
              ></div>
            </div>
          </div>
        </Card>

        {/* Fluency */}
        <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
          <div className="p-6 text-center space-y-4">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 group-hover:bg-green-200 transition-colors">
              <Zap className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {result.scoreBreakdown?.fluency || 0}
              </div>
              <div className="text-sm text-gray-600 font-medium">Fluency</div>
              <div className="text-xs text-gray-500 mt-1">
                {result.detailedMetrics?.fluency || "Reading Speed"}
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-1000"
                style={{
                  width: `${(result.scoreBreakdown?.fluency || 0) * 10}%`,
                }}
              ></div>
            </div>
          </div>
        </Card>

        {/* Pronunciation */}
        <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
          <div className="p-6 text-center space-y-4">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 group-hover:bg-purple-200 transition-colors">
              <Volume2 className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {result.scoreBreakdown?.pronunciation || 0}
              </div>
              <div className="text-sm text-gray-600 font-medium">
                Pronunciation
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {result.detailedMetrics?.pronunciation || "Speech Clarity"}
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2 rounded-full transition-all duration-1000"
                style={{
                  width: `${(result.scoreBreakdown?.pronunciation || 0) * 10}%`,
                }}
              ></div>
            </div>
          </div>
        </Card>
      </div>

      {/* Previous Attempts */}
      {result.previous_attempts && result.previous_attempts > 0 && (
        <Card className="border-0 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <RotateCcw className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-blue-900">
                  Progress Tracking
                </h3>
                <p className="text-blue-700">
                  This is attempt #{result.previous_attempts + 1}. Your best
                  score so far is {result.best_score || 0}/10.
                </p>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Feedback Section */}
      {result.feedback && result.feedback.length > 0 && (
        <Card className="border-0 bg-white/80 backdrop-blur-sm">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <MessageSquare className="h-5 w-5 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Personalized Feedback
                </h3>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDetailedFeedback(!showDetailedFeedback)}
                className="hover:bg-indigo-50 hover:border-indigo-200"
              >
                {showDetailedFeedback ? (
                  <>
                    <EyeOff className="h-4 w-4 mr-2" />
                    Hide Details
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4 mr-2" />
                    Show Details
                  </>
                )}
              </Button>
            </div>

            <div className="space-y-4">
              {result.feedback.map((feedbackItem, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {index + 1}
                  </div>
                  <p className="text-gray-700 leading-relaxed flex-1">
                    {feedbackItem}
                  </p>
                </div>
              ))}
            </div>

            {/* Detailed Segment Analysis */}
            {showDetailedFeedback && result.audio_data && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-gray-600" />
                  Segment Analysis
                </h4>
                <div className="space-y-3">
                  {result.audio_data.map((segment, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900 mb-1">
                          "{segment.text}"
                        </div>
                        <div className="text-xs text-gray-500">
                          {segment.startTime.toFixed(1)}s -{" "}
                          {segment.endTime.toFixed(1)}s
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {segment.accuracy && (
                          <Badge variant="outline" className="text-xs bg-white">
                            {segment.accuracy}%
                          </Badge>
                        )}
                        {segment.feedback && (
                          <div className="text-xs text-gray-600 max-w-xs">
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
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <Button
          onClick={onRetry}
          variant="outline"
          className="flex-1 h-12 text-base font-medium hover:bg-gray-50"
        >
          <RotateCcw className="h-5 w-5 mr-2" />
          Try Again
        </Button>
        <Button
          onClick={onViewDetails}
          className="flex-1 h-12 text-base font-medium bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <Eye className="h-5 w-5 mr-2" />
          View Detailed Analysis
        </Button>
      </div>
    </div>
  );
}
