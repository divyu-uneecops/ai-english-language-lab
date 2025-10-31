"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckCircle,
  XCircle,
  Star,
  TrendingUp,
  AlertCircle,
  RotateCcw,
  Award,
  MessageSquare,
  BookOpenCheck,
  FileText,
  Mic,
  Volume2,
  Target,
} from "lucide-react";
import { getOverallRating, getScoreColor } from "@/lib/utils";
import { SpeakingEvaluationResultsProps } from "../interfaces";

export function SpeakingEvaluationResults({
  evaluation,
  onClose,
  onRevise,
}: SpeakingEvaluationResultsProps) {
  const [activeTab, setActiveTab] = useState("strengths");

  const getScoreIcon = (score: number) => {
    if (score >= 8) return <Award className="h-4 w-4" />;
    if (score >= 6) return <CheckCircle className="h-4 w-4" />;
    if (score >= 4) return <AlertCircle className="h-4 w-4" />;
    return <XCircle className="h-4 w-4" />;
  };

  const renderFeedbackItems = (feedbackItems: string[]) => {
    return (
      <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-orange-200 scrollbar-track-transparent">
        {feedbackItems?.map((item, index) => (
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

  const overallRating = getOverallRating(evaluation?.overall_score || 0);
  const displayScore = Math.round(evaluation?.overall_score);

  return (
    <div className="bg-gradient-to-br from-orange-50 via-white to-orange-50 overflow-hidden">
      <div className="h-full max-w-6xl mx-auto px-4 py-4 flex flex-col">
        {/* Ultra-Compact Header */}
        <Card className="relative overflow-hidden glass-card border-0 shadow-lg mb-3 flex-shrink-0">
          <div className="relative p-4">
            <div className="flex items-center justify-between">
              {/* Left: Title and Overall Score */}
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-orange-100 to-yellow-100 rounded-lg">
                  <Mic className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900">
                    Speaking Performance
                  </h1>
                  <div className="flex items-center gap-2 mt-1">
                    <div
                      className={`text-2xl font-black ${getScoreColor(
                        evaluation?.overall_score || 0
                      )}`}
                    >
                      {displayScore}/10
                    </div>
                    <Badge
                      variant="outline"
                      className={`text-xs font-bold px-3 py-1 rounded-full ${overallRating?.bg} ${overallRating?.color} border-2`}
                    >
                      {getScoreIcon(evaluation?.overall_score || 0)}
                      <span className="ml-1">{overallRating?.text}</span>
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Right: Individual Scores */}
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg border border-orange-200">
                  <Volume2 className="h-4 w-4 text-orange-600" />
                  <div>
                    <p className="text-xs text-gray-600">Fluency</p>
                    <p
                      className={`text-sm font-bold ${getScoreColor(
                        evaluation?.fluency_score || 0
                      )}`}
                    >
                      {Math.round(evaluation?.fluency_score || 0)}/10
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg border border-orange-200">
                  <Mic className="h-4 w-4 text-orange-600" />
                  <div>
                    <p className="text-xs text-gray-600">Pronunciation</p>
                    <p
                      className={`text-sm font-bold ${getScoreColor(
                        evaluation?.pronunciation_score || 0
                      )}`}
                    >
                      {Math.round(evaluation?.pronunciation_score || 0)}/10
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg border border-orange-200">
                  <Target className="h-4 w-4 text-orange-600" />
                  <div>
                    <p className="text-xs text-gray-600">Relevance</p>
                    <p
                      className={`text-sm font-bold ${getScoreColor(
                        evaluation?.content_relevance_score || 0
                      )}`}
                    >
                      {Math.round(evaluation?.content_relevance_score || 0)}/10
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1">
          {/* Left Column: Detailed Feedback */}
          <Card className="glass-card border-0 shadow-lg h-full flex flex-col">
            <div className="p-4 flex-1 flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 bg-gradient-to-r from-orange-100 to-yellow-100 rounded-lg">
                  <MessageSquare className="h-4 w-4 text-orange-600" />
                </div>
                <h2 className="text-base font-bold text-gray-900">
                  Detailed Analysis
                </h2>
              </div>

              <div className="flex-1 overflow-y-auto">
                <div className="bg-gradient-to-br from-gray-50/50 to-gray-100/30 backdrop-blur-sm p-4 rounded-lg border border-gray-200/50">
                  <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
                    {evaluation?.detailed_feedback ||
                      "No detailed feedback available."}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Right Column: Feedback Tabs */}
          <Card className="glass-card border-0 shadow-lg h-full flex flex-col">
            <div className="p-4 flex-1 flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 bg-gradient-to-r from-orange-100 to-yellow-100 rounded-lg">
                  <Star className="h-4 w-4 text-orange-600" />
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
                <TabsList className="grid w-full grid-cols-3 mb-3 flex-shrink-0">
                  <TabsTrigger
                    value="strengths"
                    className="text-xs font-medium capitalize py-2"
                  >
                    <div className="flex items-center gap-1">
                      <div className="p-0.5 rounded from-green-100 to-green-200 text-green-600">
                        <CheckCircle className="h-4 w-4" />
                      </div>
                      <span className="hidden sm:inline">Strengths</span>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger
                    value="areas_for_improvement"
                    className="text-xs font-medium capitalize py-2"
                  >
                    <div className="flex items-center gap-1">
                      <div className="p-0.5 rounded from-blue-100 to-blue-200 text-blue-600">
                        <TrendingUp className="h-4 w-4" />
                      </div>
                      <span className="hidden sm:inline">Improvements</span>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger
                    value="example"
                    className="text-xs font-medium capitalize py-2"
                  >
                    <div className="flex items-center gap-1">
                      <div className="p-0.5 rounded from-purple-100 to-purple-200 text-purple-600">
                        <FileText className="h-4 w-4" />
                      </div>
                      <span className="hidden sm:inline">Example</span>
                    </div>
                  </TabsTrigger>
                </TabsList>

                <div className="flex-1 min-h-0 overflow-hidden">
                  <TabsContent value="strengths" className="mt-0 h-full">
                    <div className="h-full flex flex-col">
                      <div className="flex-1 min-h-0">
                        {evaluation?.feedback?.strengths?.length > 0 ? (
                          renderFeedbackItems(evaluation.feedback.strengths)
                        ) : (
                          <div className="text-center text-gray-500 py-8">
                            No strengths identified yet.
                          </div>
                        )}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent
                    value="areas_for_improvement"
                    className="mt-0 h-full"
                  >
                    <div className="h-full flex flex-col">
                      <div className="flex-1 min-h-0">
                        {evaluation?.feedback?.areas_for_improvement?.length >
                        0 ? (
                          renderFeedbackItems(
                            evaluation.feedback.areas_for_improvement
                          )
                        ) : (
                          <div className="text-center text-gray-500 py-8">
                            No areas for improvement identified yet.
                          </div>
                        )}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="example" className="mt-0 h-full">
                    <div className="h-full flex flex-col overflow-hidden">
                      <div className="flex-1 min-h-0 overflow-y-auto">
                        <div className="bg-gradient-to-br from-green-50/50 to-green-100/30 backdrop-blur-sm p-4 rounded-lg border border-green-200/50 hover:border-green-300/50 transition-all duration-200">
                          <h4 className="text-sm font-semibold text-gray-900 mb-2">
                            Example Response
                          </h4>
                          <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
                            {evaluation?.example_response ||
                              "No example available."}
                          </p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </Card>
        </div>

        {/* Action Buttons - Fixed at bottom */}
        <div className="flex flex-col sm:flex-row gap-3 mt-3 flex-shrink-0">
          <Button
            onClick={onRevise}
            variant="outline"
            className="flex-1 h-10 text-sm font-semibold border-2 hover:bg-orange-50 hover:border-orange-200 hover:text-orange-700 transition-all duration-300 rounded-lg shadow-lg hover:shadow-xl"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Practice Again
          </Button>
          <Button
            onClick={onClose}
            className="flex-1 h-10 text-sm font-semibold bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 rounded-lg hover:scale-105"
          >
            <BookOpenCheck className="h-4 w-4 mr-2" />
            Continue Learning
          </Button>
        </div>
      </div>
    </div>
  );
}
