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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Writing Evaluation Results</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={onRevise}>
            Revise Writing
          </Button>
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>

      {/* Overall Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Overall Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="text-4xl font-bold text-primary">
              {displayScore}
            </div>
            <div className="flex-1">
              <Progress value={displayScore} className="mb-2" />
              <p className={`font-semibold ${getScoreColor(evaluation.score)}`}>
                {getScoreLabel(evaluation.score)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Strengths and Improvements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              Strengths
            </CardTitle>
          </CardHeader>
          <CardContent>
            {evaluation.feedback.strengths.length > 0 ? (
              <ul className="space-y-2">
                {evaluation.feedback.strengths.map(
                  (strength: string, index: number) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      {strength}
                    </li>
                  )
                )}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">
                No specific strengths identified.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-600">
              <TrendingUp className="h-5 w-5" />
              Areas for Improvement
            </CardTitle>
          </CardHeader>
          <CardContent>
            {evaluation.feedback.areas_for_improvement.length > 0 ? (
              <ul className="space-y-2">
                {evaluation.feedback.areas_for_improvement.map(
                  (improvement: string, index: number) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <Target className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      {improvement}
                    </li>
                  )
                )}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">
                Great job! No major areas for improvement identified.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Example Answer */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            Example Answer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <pre className="whitespace-pre-wrap text-sm font-mono">
              {evaluation.example_answer}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
