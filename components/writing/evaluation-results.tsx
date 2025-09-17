"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  AlertCircle,
  XCircle,
  TrendingUp,
  MessageSquare,
  Lightbulb,
  Target,
  Award,
} from "lucide-react";

interface EvaluationData {
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
  const getScoreColor = (score: number) => {
    if (score >= 0.9) return "text-green-600";
    if (score >= 0.8) return "text-blue-600";
    if (score >= 0.7) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 0.9) return "Excellent";
    if (score >= 0.8) return "Good";
    if (score >= 0.7) return "Fair";
    return "Needs Improvement";
  };

  // Convert score from 0-1 to 0-100 for display
  const displayScore = Math.round(evaluation.score * 100);

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "positive":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "low":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case "medium":
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
      case "high":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Modern Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Writing Evaluation Results
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Detailed feedback on your writing performance
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={onRevise} className="px-6">
                Revise Writing
              </Button>
              <Button
                onClick={onClose}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6"
              >
                Close
              </Button>
            </div>
          </div>
        </div>

        {/* Overall Score */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm mb-8">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Award className="h-6 w-6" />
              Overall Score
            </h2>
          </div>
          <div className="p-8">
            <div className="flex items-center gap-8">
              <div className="text-6xl font-bold text-gray-900 dark:text-gray-100">
                {displayScore}
              </div>
              <div className="flex-1">
                <Progress value={displayScore} className="mb-4 h-3" />
                <p
                  className={`text-xl font-semibold ${getScoreColor(
                    evaluation.score
                  )}`}
                >
                  {getScoreLabel(evaluation.score)}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  Based on grammar, structure, and content quality
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Strengths and Improvements */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Strengths
              </h3>
            </div>
            <div className="p-6">
              {evaluation.feedback.strengths.length > 0 ? (
                <ul className="space-y-3">
                  {evaluation.feedback.strengths.map(
                    (strength: string, index: number) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 text-sm"
                      >
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          {strength}
                        </span>
                      </li>
                    )
                  )}
                </ul>
              ) : (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  No specific strengths identified.
                </p>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-500" />
                Areas for Improvement
              </h3>
            </div>
            <div className="p-6">
              {evaluation.feedback.areas_for_improvement.length > 0 ? (
                <ul className="space-y-3">
                  {evaluation.feedback.areas_for_improvement.map(
                    (improvement: string, index: number) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 text-sm"
                      >
                        <Target className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          {improvement}
                        </span>
                      </li>
                    )
                  )}
                </ul>
              ) : (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Great job! No major areas for improvement identified.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Example Answer */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-500" />
              Example Answer
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Here's a well-structured example for reference
            </p>
          </div>
          <div className="p-6">
            <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <pre className="whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200 leading-relaxed font-mono">
                {evaluation.example_answer}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
