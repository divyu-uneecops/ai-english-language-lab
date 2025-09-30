"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
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
  ChevronDown,
  Target,
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
      <Card
        key={category}
        className={`group relative overflow-hidden glass-card hover:shadow-xl transition-all duration-500 cursor-pointer border-0 hover:scale-[1.02] ${
          isExpanded ? "shadow-xl scale-[1.02]" : ""
        }`}
        onClick={() => setExpandedCategory(isExpanded ? null : category)}
      >
        {/* Gradient overlay for visual appeal */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50/30 via-transparent to-orange-100/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        <div className="relative p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div
                className={`${config?.iconBg} p-3 rounded-xl group-hover:scale-110 transition-transform duration-200`}
              >
                <span className="text-xl">{config?.icon}</span>
              </div>
              <div>
                <h3
                  className={`font-bold text-lg ${config?.textColor} capitalize group-hover:text-orange-600 transition-colors duration-200`}
                >
                  {category}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {feedbackItems?.length} feedback point
                  {feedbackItems?.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div
                className={`transform transition-transform duration-300 ${
                  isExpanded ? "rotate-180" : ""
                }`}
              >
                <ChevronDown className="w-5 h-5 text-gray-500 group-hover:text-orange-600 transition-colors duration-200" />
              </div>
            </div>
          </div>

          {isExpanded && (
            <div className="mt-6 space-y-4 animate-in slide-in-from-top-2 duration-500">
              {feedbackItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-white/20 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-orange-100 to-orange-200 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-orange-700">
                      {index + 1}
                    </span>
                  </div>
                  <p className="text-gray-700 leading-relaxed text-sm font-medium">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Hero Score Card - Redesigned with Orange Theme */}
        <Card className="relative overflow-hidden glass-card border-0 shadow-xl">
          {/* Background decorative elements */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-orange-200/20 to-yellow-200/20 rounded-full -translate-y-20 translate-x-20 floating-animation"></div>
          <div
            className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-orange-100/20 to-yellow-100/20 rounded-full translate-y-16 -translate-x-16 floating-animation"
            style={{ animationDelay: "2s" }}
          ></div>
          <div
            className="absolute top-1/2 left-1/2 w-24 h-24 bg-gradient-to-r from-orange-200/10 to-yellow-200/10 rounded-full -translate-x-1/2 -translate-y-1/2 floating-animation"
            style={{ animationDelay: "4s" }}
          ></div>

          <div className="relative p-8 md:p-12">
            <div className="text-center space-y-8">
              {/* Header */}
              <div className="flex items-center justify-center gap-4">
                <div className="p-3 bg-gradient-to-r from-orange-100 to-yellow-100 rounded-2xl group-hover:scale-110 transition-transform duration-200">
                  <Star className="h-8 w-8 text-orange-600" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                    Reading Performance
                  </h1>
                </div>
              </div>

              {/* Score Display */}
              <div className="space-y-6">
                <div className="relative">
                  <div
                    className={`text-7xl md:text-8xl font-black gradient-text ${getScoreColor(
                      result?.score || 0
                    )}`}
                  >
                    {result?.score || 0}/10
                  </div>
                  {/* Score glow effect */}
                  <div className="absolute inset-0 text-7xl md:text-8xl font-black opacity-20 blur-sm">
                    {result?.score || 0}/10
                  </div>
                </div>

                <div className="flex items-center justify-center gap-4">
                  <span className="text-3xl">{overallRating?.emoji}</span>
                  <Badge
                    variant="outline"
                    className={`text-lg font-bold px-8 py-3 rounded-full ${overallRating?.bg} ${overallRating?.color} border-2 shadow-lg hover:shadow-xl transition-all duration-300`}
                  >
                    {getScoreIcon(result?.score || 0)}
                    <span className="ml-3">{overallRating?.text}</span>
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Detailed Scores Grid - Enhanced */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="group relative overflow-hidden glass-card hover:shadow-xl transition-all duration-500 border-0 hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-blue-100/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative p-6 text-center">
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-3">
                  <div className="p-3 bg-gradient-to-r from-blue-100 to-blue-200 rounded-xl group-hover:scale-110 transition-transform duration-200">
                    <Target className="h-6 w-6 text-blue-600" />
                  </div>
                  <span className="text-lg font-bold text-gray-800">
                    Accuracy
                  </span>
                </div>
                <div className="text-4xl font-black text-gray-900">
                  {result?.scoreBreakdown?.accuracy || 0}/4
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  {result?.detailedMetrics?.accuracy || "Word Recognition"}
                </div>
              </div>
            </div>
          </Card>

          <Card className="group relative overflow-hidden glass-card hover:shadow-xl transition-all duration-500 border-0 hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 via-transparent to-purple-100/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative p-6 text-center">
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-3">
                  <div className="p-3 bg-gradient-to-r from-purple-100 to-purple-200 rounded-xl group-hover:scale-110 transition-transform duration-200">
                    <Volume2 className="h-6 w-6 text-purple-600" />
                  </div>
                  <span className="text-lg font-bold text-gray-800">
                    Consistency
                  </span>
                </div>
                <div className="text-4xl font-black text-gray-900">
                  {result?.scoreBreakdown?.consistency || 0}/2
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  {result?.detailedMetrics?.consistency || "Speech Clarity"}
                </div>
              </div>
            </div>
          </Card>

          <Card className="group relative overflow-hidden glass-card hover:shadow-xl transition-all duration-500 border-0 hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 via-transparent to-green-100/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative p-6 text-center">
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-3">
                  <div className="p-3 bg-gradient-to-r from-green-100 to-green-200 rounded-xl group-hover:scale-110 transition-transform duration-200">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                  <span className="text-lg font-bold text-gray-800">
                    Fluency
                  </span>
                </div>
                <div className="text-4xl font-black text-gray-900">
                  {result?.scoreBreakdown?.fluency || 0}/4
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  {result?.detailedMetrics?.fluency || "Reading Speed"}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Enhanced Feedback Section */}
        {result.feedback && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-orange-100 to-yellow-100 rounded-xl">
                <MessageSquare className="h-7 w-7 text-orange-600" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">
                  Personalized Feedback
                </h2>
                <p className="text-gray-600 mt-1">
                  Detailed insights to help you improve
                </p>
              </div>
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
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Button
            onClick={onRetry}
            variant="outline"
            className="flex-1 h-14 text-lg font-bold border-2 hover:bg-orange-50 hover:border-orange-200 hover:text-orange-700 transition-all duration-300 rounded-xl shadow-lg hover:shadow-xl"
          >
            <RotateCcw className="h-6 w-6 mr-3" />
            Try Again
          </Button>
          <Button
            onClick={onPracticeMore}
            className="flex-1 h-14 text-lg font-bold bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 rounded-xl hover:scale-105"
          >
            <BookOpenCheck className="h-6 w-6 mr-3" />
            Practice More
          </Button>
        </div>
      </div>
    </div>
  );
}
