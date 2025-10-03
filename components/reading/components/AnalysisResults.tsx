"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Target,
  BarChart3,
  Lightbulb,
} from "lucide-react";
import { getOverallRating, getScoreColor } from "@/lib/utils";
import { AnalysisResultsProps } from "../interfaces";

export default function AnalysisResults({
  result,
  onRetry,
  onPracticeMore,
}: AnalysisResultsProps) {
  const [activeTab, setActiveTab] = useState("accuracy");

  const getScoreIcon = (score: number) => {
    if (score >= 8) return <Award className="h-4 w-4" />;
    if (score >= 6) return <CheckCircle className="h-4 w-4" />;
    if (score >= 4) return <AlertCircle className="h-4 w-4" />;
    return <XCircle className="h-4 w-4" />;
  };

  const overallRating = getOverallRating(result?.score || 0);

  const renderFeedbackItems = (feedbackItems: string[]) => {
    return (
      <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-orange-200 scrollbar-track-transparent">
        {feedbackItems.map((item, index) => (
          <div
            key={index}
            className="flex items-start gap-2 p-2 bg-white/60 backdrop-blur-sm rounded-md border border-white/30 hover:bg-white/80 transition-all duration-200"
          >
            <div className="flex-shrink-0 w-5 h-5 bg-gradient-to-r from-orange-100 to-orange-200 rounded-full flex items-center justify-center mt-0.5">
              <span className="text-xs font-bold text-orange-700">
                {index + 1}
              </span>
            </div>
            <p className="text-gray-700 leading-tight text-xs">{item}</p>
          </div>
        ))}
      </div>
    );
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "accuracy":
        return <Target className="h-4 w-4" />;
      case "fluency":
        return <TrendingUp className="h-4 w-4" />;
      case "consistency":
        return <Volume2 className="h-4 w-4" />;
      case "overall":
        return <Star className="h-4 w-4" />;
      default:
        return <Lightbulb className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "accuracy":
        return "from-blue-100 to-blue-200 text-blue-600";
      case "fluency":
        return "from-green-100 to-green-200 text-green-600";
      case "consistency":
        return "from-purple-100 to-purple-200 text-purple-600";
      case "overall":
        return "from-orange-100 to-orange-200 text-orange-600";
      default:
        return "from-gray-100 to-gray-200 text-gray-600";
    }
  };

  return (
    <div className="bg-gradient-to-br from-orange-50 via-white to-orange-50 overflow-hidden">
      <div className="h-full max-w-7xl mx-auto px-4 py-4 flex flex-col">
        {/* Ultra-Compact Header */}
        <Card className="relative overflow-hidden glass-card border-0 shadow-lg mb-3 flex-shrink-0">
          <div className="relative p-4">
            <div className="flex items-center justify-between">
              {/* Left: Title and Overall Score */}
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-orange-100 to-yellow-100 rounded-lg">
                  <Star className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900">
                    Reading Performance
                  </h1>
                  <div className="flex items-center gap-2 mt-1">
                    <div
                      className={`text-2xl font-black ${getScoreColor(
                        result?.score || 0
                      )}`}
                    >
                      {result?.score || 0}/10
                    </div>
                    <Badge
                      variant="outline"
                      className={`text-xs font-bold px-3 py-1 rounded-full ${overallRating?.bg} ${overallRating?.color} border-2`}
                    >
                      {getScoreIcon(result?.score || 0)}
                      <span className="ml-1">{overallRating?.text}</span>
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Main Content Area - Takes remaining height */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-0">
          {/* Left Column: Detailed Scores */}
          <div className="lg:col-span-1">
            <Card className="glass-card border-0 shadow-lg h-full">
              <div className="p-4 h-full flex flex-col">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-1.5 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg">
                    <BarChart3 className="h-4 w-4 text-blue-600" />
                  </div>
                  <h2 className="text-base font-bold text-gray-900">
                    Score Breakdown
                  </h2>
                </div>

                <div className="space-y-3 flex-1">
                  {/* Accuracy */}
                  <div className="p-3 bg-gradient-to-r from-blue-50/50 to-blue-100/30 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <Target className="h-3 w-3 text-blue-600" />
                        <span className="font-semibold text-gray-800 text-sm">
                          Accuracy
                        </span>
                      </div>
                      <span className="text-base font-bold text-gray-900">
                        {result?.scoreBreakdown?.accuracy || 0}/4
                      </span>
                    </div>
                    <div className="text-xs text-gray-600">
                      {result?.detailedMetrics?.accuracy || "Word Recognition"}
                    </div>
                  </div>

                  {/* Fluency */}
                  <div className="p-3 bg-gradient-to-r from-green-50/50 to-green-100/30 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-3 w-3 text-green-600" />
                        <span className="font-semibold text-gray-800 text-sm">
                          Fluency
                        </span>
                      </div>
                      <span className="text-base font-bold text-gray-900">
                        {result?.scoreBreakdown?.fluency || 0}/4
                      </span>
                    </div>
                    <div className="text-xs text-gray-600">
                      {result?.detailedMetrics?.fluency || "Reading Speed"}
                    </div>
                  </div>

                  {/* Consistency */}
                  <div className="p-3 bg-gradient-to-r from-purple-50/50 to-purple-100/30 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <Volume2 className="h-3 w-3 text-purple-600" />
                        <span className="font-semibold text-gray-800 text-sm">
                          Consistency
                        </span>
                      </div>
                      <span className="text-base font-bold text-gray-900">
                        {result?.scoreBreakdown?.consistency || 0}/2
                      </span>
                    </div>
                    <div className="text-xs text-gray-600">
                      {result?.detailedMetrics?.consistency || "Speech Clarity"}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column: Feedback Tabs */}
          <div className="lg:col-span-2">
            {result?.feedback && (
              <Card className="glass-card border-0 shadow-lg h-full">
                <div className="p-4 h-full flex flex-col">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-1.5 bg-gradient-to-r from-orange-100 to-yellow-100 rounded-lg">
                      <MessageSquare className="h-4 w-4 text-orange-600" />
                    </div>
                    <h2 className="text-base font-bold text-gray-900">
                      Personalized Feedback
                    </h2>
                  </div>

                  <Tabs
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="w-full flex-1 flex flex-col"
                  >
                    <TabsList className="grid w-full grid-cols-4 mb-3 flex-shrink-0">
                      {Object.keys(result.feedback).map((category) => (
                        <TabsTrigger
                          key={category}
                          value={category}
                          className="text-xs font-medium capitalize py-2"
                        >
                          <div className="flex items-center gap-1">
                            <div
                              className={`p-0.5 rounded ${getCategoryColor(
                                category
                              )}`}
                            >
                              {getCategoryIcon(category)}
                            </div>
                            <span className="hidden sm:inline">{category}</span>
                          </div>
                        </TabsTrigger>
                      ))}
                    </TabsList>

                    <div className="flex-1 min-h-0">
                      {Object.entries(result.feedback).map(
                        ([category, feedbackItems]) => (
                          <TabsContent
                            key={category}
                            value={category}
                            className="mt-0 h-full"
                          >
                            <div className="h-full flex flex-col">
                              <div className="flex-1 min-h-0">
                                {renderFeedbackItems(feedbackItems)}
                              </div>
                            </div>
                          </TabsContent>
                        )
                      )}
                    </div>
                  </Tabs>
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* Action Buttons - Fixed at bottom */}
        <div className="flex flex-col sm:flex-row gap-3 mt-3 flex-shrink-0">
          <Button
            onClick={onRetry}
            variant="outline"
            className="flex-1 h-10 text-sm font-semibold border-2 hover:bg-orange-50 hover:border-orange-200 hover:text-orange-700 transition-all duration-300 rounded-lg shadow-lg hover:shadow-xl"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
          <Button
            onClick={onPracticeMore}
            className="flex-1 h-10 text-sm font-semibold bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 rounded-lg hover:scale-105"
          >
            <BookOpenCheck className="h-4 w-4 mr-2" />
            Practice More
          </Button>
        </div>
      </div>
    </div>
  );
}
