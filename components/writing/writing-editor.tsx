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
import { Progress } from "@/components/ui/progress";
import { EvaluationResults } from "./evaluation-results";

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
  const [timeSpent, setTimeSpent] = useState(0);
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
      const response = await fetch("/api/evaluate-writing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
          writingType,
          prompt: prompt.id,
        }),
      });

      if (response.ok) {
        const evaluationData = await response.json();
        setEvaluation(evaluationData);
        setShowEvaluation(true);
      } else {
        alert("Failed to evaluate writing. Please try again.");
      }
    } catch (error) {
      alert("An error occurred while evaluating your writing.");
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

  const targetWordCount = 200;
  const progress = Math.min((wordCount / targetWordCount) * 100, 100);

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
          <div
            onClick={onBack}
            className="flex items-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Prompts
          </div>
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
                    {wordCount} / {targetWordCount} words
                  </div>
                  <Progress value={progress} className="w-24" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Start writing here..."
                value={content}
                onChange={(e) => handleContentChange(e.target.value)}
                className="min-h-[400px] resize-none"
              />
            </CardContent>
          </Card>

          <div className="flex items-center gap-2">
            <Button>
              <Save className="h-4 w-4 mr-2" />
              Save Draft
            </Button>
            <Button variant="outline">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
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
              <CardTitle>Writing Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Word Count</span>
                  <span>
                    {wordCount}/{targetWordCount}
                  </span>
                </div>
                <Progress value={progress} />
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Audience:</span>
                  <span className="font-medium">{prompt.audience}</span>
                </div>
                <div className="flex justify-between">
                  <span>Type:</span>
                  <span className="font-medium capitalize">{writingType}</span>
                </div>
                <div className="flex justify-between">
                  <span>Difficulty:</span>
                  <Badge variant="outline" className="text-xs">
                    {prompt.difficulty}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

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
