"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Clock, Target, CheckCircle, Loader2, Sparkles } from "lucide-react";
import { EvaluationResults } from "./evaluation-results";
import { writingService } from "@/services/writingService";

interface WritingEditorProps {
  prompt: any;
  writingType: string;
  onBack: () => void;
}

export function WritingEditor({ prompt, onBack }: WritingEditorProps) {
  const [content, setContent] = useState("");
  const [wordCount, setWordCount] = useState(0);

  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState(null);
  const [showEvaluation, setShowEvaluation] = useState(false);

  const handleContentChange = (value: string) => {
    setContent(value);
    const words = value
      ?.trim()
      ?.split(/\s+/)
      ?.filter((word) => word?.length > 0);
    setWordCount(words?.length);
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
        prompt?.topic_id
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
  };

  // Remove the early return for evaluation results - we'll show them in a dialog instead

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Modern Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="space-y-4">
              <nav className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <span
                  className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors cursor-pointer"
                  onClick={onBack}
                >
                  Writing
                </span>
                <span>/</span>
                <span className="text-gray-900 dark:text-gray-100 font-medium">
                  {prompt?.title}
                </span>
              </nav>
              <div>
                <p className="text-gray-600 dark:text-gray-400">
                  {prompt?.description}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  Time Estimate
                </div>
                <div className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {prompt?.timeEstimate}
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  Difficulty
                </div>
                <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  <Badge
                    variant="secondary"
                    className={`text-xs font-medium ${
                      prompt?.difficulty === "Easy" ||
                      prompt?.difficulty === "easy"
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border border-green-200 dark:border-green-800"
                        : prompt?.difficulty === "Medium" ||
                          prompt?.difficulty === "medium"
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800"
                        : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border border-red-200 dark:border-red-800"
                    }`}
                  >
                    {prompt?.difficulty}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    Your Writing
                  </h2>
                  <div className="flex items-center gap-4">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {wordCount} words
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleContentChange("")}
                      disabled={!content.trim()}
                      className={`border border-red-200 dark:border-red-700 text-red-600 dark:text-red-300 bg-white dark:bg-gray-800 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-900/30 transition-colors ${
                        !content.trim()
                          ? "opacity-60 cursor-not-allowed"
                          : "hover:border-red-400"
                      }`}
                    >
                      <span className="font-medium">Clear All</span>
                    </Button>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <Textarea
                  placeholder="Start writing here..."
                  value={content}
                  onChange={(e) => handleContentChange(e?.target?.value)}
                  className="min-h-[500px] resize-none border-0 focus:ring-0 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end">
              <Button
                size="lg"
                onClick={handleSubmitForEvaluation}
                disabled={isEvaluating || !content.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8"
              >
                {isEvaluating ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Evaluating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5 mr-2" />
                    Get AI Feedback
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Guidelines
                </h3>
              </div>
              <div className="p-6">
                <ul className="space-y-3">
                  {prompt.guidelines.map((guideline: string, index: number) => (
                    <li key={index} className="flex items-start gap-3 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        {guideline}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  AI Evaluation
                </h3>
              </div>
              <div className="p-6">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Submit your writing to get comprehensive feedback:
                </p>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    Grammar and style feedback
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    Structure analysis
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    Vocabulary suggestions
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    Overall score and tips
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Evaluation Results Dialog */}
      <Dialog open={showEvaluation} onOpenChange={setShowEvaluation}>
        <DialogContent className="sm:max-w-6xl max-h-[90vh] overflow-hidden p-0 rounded-2xl shadow-2xl border-0">
          <div className="overflow-y-auto max-h-[90vh]">
            {evaluation && (
              <EvaluationResults
                evaluation={evaluation}
                userContent={content}
                onClose={handleCloseEvaluation}
                onRevise={handleReviseWriting}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
