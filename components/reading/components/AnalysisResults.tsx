"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  XCircle,
  Volume2,
  Star,
  TrendingUp,
  AlertCircle,
  RotateCcw,
  Award,
  MessageSquare,
  BookOpenCheck,
} from "lucide-react";
import {
  getCategoryConfig,
  getOverallRating,
  getScoreColor,
} from "@/lib/utils";
import { AnalysisResultsProps } from "../interfaces";

export default function AnalysisResults({
  result,
  onRetry,
  onPracticeMore,
}: AnalysisResultsProps) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const getScoreIcon = (score: number) => {
    if (score >= 8) return <Award className="h-5 w-5" />;
    if (score >= 6) return <CheckCircle className="h-5 w-5" />;
    if (score >= 4) return <AlertCircle className="h-5 w-5" />;
    return <XCircle className="h-5 w-5" />;
  };

  const overallRating = getOverallRating(result?.score || 0);

  const renderFeedbackCard = (category: string, feedbackItems: string[]) => {
    const config = getCategoryConfig(category);
    const isExpanded = expandedCategory === category;

    return (
      <div
        key={category}
        className={`${config?.bgColor} ${config?.borderColor} border rounded-xl p-5 transition-all duration-300 hover:shadow-md cursor-pointer`}
        onClick={() => setExpandedCategory(isExpanded ? null : category)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`${config?.iconBg} p-2 rounded-lg`}>
              <span className="text-lg">{config?.icon}</span>
            </div>
            <div>
              <h3 className={`font-semibold ${config?.textColor} capitalize`}>
                {category}
              </h3>
              <p className="text-sm text-gray-600">
                {feedbackItems?.length} feedback point
                {feedbackItems?.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div
              className={`transform transition-transform duration-200 ${
                isExpanded ? "rotate-180" : ""
              }`}
            >
              <svg
                className="w-5 h-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>

        {isExpanded && (
          <div className="mt-4 space-y-3 animate-in slide-in-from-top-2 duration-300">
            {feedbackItems.map((item, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 bg-white rounded-lg shadow-sm"
              >
                <div className="flex-shrink-0 w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-semibold text-gray-600">
                    {index + 1}
                  </span>
                </div>
                <p className="text-gray-700 leading-relaxed text-sm">{item}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Hero Score Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50 border border-gray-200 rounded-2xl p-8">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-200/30 to-orange-200/30 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-200/30 to-purple-200/30 rounded-full translate-y-12 -translate-x-12"></div>

        <div className="relative text-center space-y-6">
          <div className="flex items-center justify-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-xl">
              <Star className="h-6 w-6 text-yellow-600" />
            </div>
            <span className="text-lg font-semibold text-gray-700">
              Reading Performance
            </span>
          </div>

          <div className="space-y-4">
            <div
              className={`text-6xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent ${getScoreColor(
                result?.score || 0
              )}`}
            >
              {result?.score || 0}/10
            </div>

            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl">{overallRating?.emoji}</span>
              <Badge
                variant="outline"
                className={`text-lg font-semibold px-6 py-2 ${overallRating?.bg} ${overallRating?.color} border-2`}
              >
                {getScoreIcon(result?.score || 0)}
                <span className="ml-2">{overallRating?.text}</span>
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Scores Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-6 text-center hover:shadow-lg transition-shadow duration-300">
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-blue-600" />
              </div>
              <span className="text-sm font-semibold text-gray-700">
                Accuracy
              </span>
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {result?.scoreBreakdown?.accuracy || 0}/4
            </div>
            <div className="text-xs text-gray-500">
              {result?.detailedMetrics?.accuracy || "Word Recognition"}
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 text-center hover:shadow-lg transition-shadow duration-300">
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Volume2 className="h-5 w-5 text-purple-600" />
              </div>
              <span className="text-sm font-semibold text-gray-700">
                Consistency
              </span>
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {result?.scoreBreakdown?.consistency || 0}/2
            </div>
            <div className="text-xs text-gray-500">
              {result?.detailedMetrics?.consistency || "Speech Clarity"}
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 text-center hover:shadow-lg transition-shadow duration-300">
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <span className="text-sm font-semibold text-gray-700">
                Fluency
              </span>
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {result?.scoreBreakdown?.fluency || 0}/4
            </div>
            <div className="text-xs text-gray-500">
              {result?.detailedMetrics?.fluency || "Reading Speed"}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Feedback Section */}
      {result.feedback && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <MessageSquare className="h-7 w-7 text-indigo-600" />
              Personalized Feedback
            </h3>
          </div>

          <div className="space-y-4">
            {Object.entries(result?.feedback || {}).map(
              ([category, feedbackItems]) =>
                renderFeedbackCard(category, feedbackItems)
            )}
          </div>
        </div>
      )}

      {/* Enhanced Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          onClick={onRetry}
          variant="outline"
          className="flex-1 h-12 text-base font-semibold border-2 hover:bg-gray-50"
        >
          <RotateCcw className="h-5 w-5 mr-2" />
          Try Again
        </Button>
        <Button
          onClick={onPracticeMore}
          className="flex-1 h-12 text-base font-semibold bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <BookOpenCheck className="h-5 w-5 mr-2" />
          Practice More
        </Button>
      </div>
    </div>
  );
}
