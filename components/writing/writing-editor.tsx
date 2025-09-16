"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Save,
  RotateCcw,
  Eye,
  Clock,
  Target,
  CheckCircle,
  Loader2,
  Sparkles,
} from "lucide-react";
import { EvaluationResults } from "./evaluation-results";
import { writingService } from "@/services/writingService";

interface WritingEditorProps {
  prompt: any;
  writingType: string | null;
  onBack: () => void;
}

export function WritingEditor({
  prompt,
  writingType,
  onBack,
}: WritingEditorProps) {
  const [content, setContent] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [showGuidelines, setShowGuidelines] = useState(true);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState(null);
  const [showEvaluation, setShowEvaluation] = useState(false);

  const handleContentChange = (value: string) => {
    setContent(value);
    const words = value
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0);
    setWordCount(words.length);
  };

  const handleSubmitForEvaluation = async () => {
    if (!content.trim()) {
      alert("Please write something before submitting for evaluation");
      return;
    }

    setIsEvaluating(true);

    try {
      const evaluationData = await writingService.submitForEvaluation(
        content,
        prompt.id
      );
      setEvaluation(evaluationData);
      setShowEvaluation(true);
    } catch (error) {
      console.error("Error evaluating writing:", error);
      alert(
        "An error occurred while evaluating your writing. Please try again."
      );
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleCloseEvaluation = () => {
    setShowEvaluation(false);
  };

  const handleReviseWriting = () => {
    setShowEvaluation(false);
    // Focus back on the textarea for revision
  };

  if (showEvaluation && evaluation) {
    return (
      <EvaluationResults
        evaluation={evaluation}
        onClose={handleCloseEvaluation}
        onRevise={handleReviseWriting}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold">{prompt.title}</h2>
            <p className="text-muted-foreground">{prompt.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {prompt.timeEstimate}
          </Badge>
          <Badge variant="outline">{prompt.difficulty}</Badge>
          <div
            onClick={onBack}
            className="flex items-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Prompts
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Your Writing</CardTitle>
                <div className="flex items-center gap-4">
                  <div className="text-sm text-muted-foreground">
                    {wordCount} words
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Start writing here..."
                value={content}
                onChange={(e) => handleContentChange(e?.target?.value)}
                className="min-h-[400px] resize-none"
              />
            </CardContent>
          </Card>

          <div className="flex items-center gap-2">
            <Button variant="outline">
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button
              className="ml-auto"
              onClick={handleSubmitForEvaluation}
              disabled={isEvaluating || !content.trim()}
            >
              {isEvaluating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Evaluating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Get AI Feedback
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {showGuidelines && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Guidelines
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {prompt.guidelines.map((guideline: string, index: number) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      {guideline}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                AI Evaluation
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p>Submit your writing to get:</p>
              <ul className="mt-2 space-y-1">
                <li>• Grammar and style feedback</li>
                <li>• Structure analysis</li>
                <li>• Vocabulary suggestions</li>
                <li>• Overall score and tips</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
