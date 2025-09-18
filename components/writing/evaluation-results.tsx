"use client";

import { useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { CheckCircle, TrendingUp, FileText, Eye, EyeOff } from "lucide-react";

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
  userContent: string;
  onClose: () => void;
  onRevise: () => void;
}

export function EvaluationResults({
  evaluation,
  userContent,
  onClose,
  onRevise,
}: EvaluationResultsProps) {
  const [showComparison, setShowComparison] = useState(false);

  const getScoreColor = (score: number) => {
    if (score >= 9) return "text-green-600";
    if (score >= 8) return "text-blue-600";
    if (score >= 7) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 9) return "Excellent";
    if (score >= 8) return "Good";
    if (score >= 7) return "Fair";
    return "Needs Improvement";
  };

  const displayScore = Math.round(evaluation?.score);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Simple Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Writing Evaluation
          </h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onRevise}>
              Revise
            </Button>
            <Button onClick={onClose}>Close</Button>
          </div>
        </div>

        {/* Score Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="text-center">
            <div className="text-5xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {displayScore}
            </div>
            <Progress value={displayScore * 10} className="mb-3 h-2" />
            <p
              className={`text-lg font-semibold ${getScoreColor(
                evaluation?.score
              )}`}
            >
              {getScoreLabel(evaluation?.score)}
            </p>
          </div>
        </div>

        {/* Feedback Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Feedback
          </h2>

          {/* Strengths */}
          {evaluation?.feedback?.strengths?.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-green-600 dark:text-green-400 mb-3 flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Strengths
              </h3>
              <ul className="space-y-2">
                {evaluation.feedback.strengths.map(
                  (strength: string, index: number) => (
                    <li
                      key={index}
                      className="text-sm text-gray-700 dark:text-gray-300 pl-6"
                    >
                      • {strength}
                    </li>
                  )
                )}
              </ul>
            </div>
          )}

          {/* Areas for Improvement */}
          {evaluation?.feedback?.areas_for_improvement?.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-3 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Areas for Improvement
              </h3>
              <ul className="space-y-2">
                {evaluation.feedback.areas_for_improvement.map(
                  (improvement: string, index: number) => (
                    <li
                      key={index}
                      className="text-sm text-gray-700 dark:text-gray-300 pl-6"
                    >
                      • {improvement}
                    </li>
                  )
                )}
              </ul>
            </div>
          )}
        </div>

        {/* Comparison Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Writing Comparison
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowComparison(!showComparison)}
                className="flex items-center gap-2"
              >
                {showComparison ? (
                  <>
                    <EyeOff className="h-4 w-4" />
                    Hide
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4" />
                    Show
                  </>
                )}
              </Button>
            </div>
          </div>

          {showComparison && (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* User Writing */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
                    Your Writing
                  </h3>
                  <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border">
                    <pre className="whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
                      {userContent || "No content written yet."}
                    </pre>
                  </div>
                </div>

                {/* Example Answer */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
                    Example Answer
                  </h3>
                  <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border">
                    <pre className="whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
                      {typeof evaluation?.example_answer === "string"
                        ? evaluation?.example_answer
                        : ""}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
