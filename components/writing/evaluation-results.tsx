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
} from "lucide-react";
import { getOverallRating, getScoreColor } from "@/lib/utils";

interface EvaluationData {
  your_answer: string;
  score: number;
  feedback: {
    strengths: string[];
    areas_for_improvement: string[];
  };
  example_answer: string;
}

interface EvaluationResultsProps {
  evaluation: EvaluationData;
  onClose: () => void;
  onRevise: () => void;
}

export function EvaluationResults({
  evaluation,
  onClose,
  onRevise,
}: EvaluationResultsProps) {
  const [activeTab, setActiveTab] = useState("strengths");
  const [showComparison, setShowComparison] = useState(false);

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

  const overallRating = getOverallRating(evaluation?.score || 0);
  const displayScore = Math.round(evaluation?.score);

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
                  <Star className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900">
                    Writing Performance
                  </h1>
                  <div className="flex items-center gap-2 mt-1">
                    <div
                      className={`text-2xl font-black ${getScoreColor(
                        evaluation?.score || 0
                      )}`}
                    >
                      {displayScore}/10
                    </div>
                    <Badge
                      variant="outline"
                      className={`text-xs font-bold px-3 py-1 rounded-full ${overallRating?.bg} ${overallRating?.color} border-2`}
                    >
                      {getScoreIcon(evaluation?.score || 0)}
                      <span className="ml-1">{overallRating?.text}</span>
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Main Content Area - Takes remaining height */}
        <div>
          {/* Right Column: Feedback Tabs */}
          <div>
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
                      value="comparison"
                      className="text-xs font-medium capitalize py-2"
                    >
                      <div className="flex items-center gap-1">
                        <div className="p-0.5 rounded from-purple-100 to-purple-200 text-purple-600">
                          <FileText className="h-4 w-4" />
                        </div>
                        <span className="hidden sm:inline">Comparison</span>
                      </div>
                    </TabsTrigger>
                  </TabsList>

                  <div className="flex-1 min-h-0">
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

                    <TabsContent value="comparison" className="mt-0 h-full">
                      <div className="h-full flex flex-col">
                        <div className="flex-1 min-h-0">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* User Writing */}
                            <div>
                              <h4 className="text-xs font-medium text-gray-700 mb-2">
                                Your Writing
                              </h4>
                              <div className="bg-white/60 backdrop-blur-sm p-3 rounded-md border border-white/30">
                                <pre className="whitespace-pre-wrap text-xs text-gray-700 leading-relaxed">
                                  {evaluation?.your_answer ||
                                    "No content written yet."}
                                </pre>
                              </div>
                            </div>

                            {/* Example Answer */}
                            <div>
                              <h4 className="text-xs font-medium text-gray-700 mb-2">
                                Example Answer
                              </h4>
                              <div className="bg-white/60 backdrop-blur-sm p-3 rounded-md border border-white/30">
                                <pre className="whitespace-pre-wrap text-xs text-gray-700 leading-relaxed">
                                  {typeof evaluation?.example_answer ===
                                  "string"
                                    ? evaluation?.example_answer
                                    : "No example available."}
                                </pre>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </div>
                </Tabs>
              </div>
            </Card>
          </div>
        </div>

        {/* Action Buttons - Fixed at bottom */}
        <div className="flex flex-col sm:flex-row gap-3 mt-3 flex-shrink-0">
          <Button
            onClick={onRevise}
            variant="outline"
            className="flex-1 h-10 text-sm font-semibold border-2 hover:bg-orange-50 hover:border-orange-200 hover:text-orange-700 transition-all duration-300 rounded-lg shadow-lg hover:shadow-xl"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Revise Writing
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
