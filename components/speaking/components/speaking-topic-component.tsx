"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Mic,
  Loader2,
  Sparkles,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import LiveSpeechToText from "@/components/shared/LiveSpeechToText";
import { getDifficultyColor, getLevelColor, isEmpty } from "@/lib/utils";
import {
  SpeakingTopicComponentProps,
  SpeakingEvaluationData,
  EvaluationHistoryItem,
} from "../types/index";
import { speakingService } from "@/services/speakingService";
import { SpeakingEvaluationResults } from "./evaluation-results";

export function SpeakingTopicComponent({
  topic,
  onBack,
}: SpeakingTopicComponentProps) {
  const [speechChunks, setSpeechChunks] = useState<
    { text: string; startTime: number; endTime: number }[]
  >([]);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<SpeakingEvaluationData | null>(
    null
  );
  const [showEvaluation, setShowEvaluation] = useState(false);
  const [activeTab, setActiveTab] = useState("topic");
  const [submissionHistory, setSubmissionHistory] = useState<
    EvaluationHistoryItem[]
  >([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  useEffect(() => {
    if (!isEmpty(topic)) {
      if (topic?.solved && topic?.evaluation_data) {
        setShowEvaluation(true);
        setEvaluation(topic?.evaluation_data);
      }
      // Fetch submission history
      fetchSubmissionHistory();
    }
  }, [topic]);

  const fetchSubmissionHistory = async () => {
    if (!topic?.topic_id) return;

    setIsLoadingHistory(true);
    try {
      const history = await speakingService.fetchEvaluationHistory(
        topic.topic_id
      );
      setSubmissionHistory(history || []);
    } catch (error) {
      console.error("Error fetching submission history:", error);
      setSubmissionHistory([]);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleSubmitForEvaluation = async () => {
    if (speechChunks?.length === 0) {
      alert("Please speak something before submitting for evaluation");
      return;
    }

    setIsEvaluating(true);

    try {
      const evaluationData = await speakingService.submitForEvaluation(
        speechChunks,
        topic?.topic_id
      );
      // Add transcription to evaluation data
      setEvaluation(evaluationData);
      setShowEvaluation(true);
      // Refresh submission history
      await fetchSubmissionHistory();
    } catch (error) {
      alert(
        "An error occurred while evaluating your speech. Please try again."
      );
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleViewSubmission = (submission: EvaluationHistoryItem) => {
    setEvaluation(submission);
    setShowEvaluation(true);
  };

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "a few seconds ago";
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 2592000)
      return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return date.toLocaleDateString();
  };

  const getScoreStatus = (score: number) => {
    if (score >= 7)
      return {
        icon: CheckCircle,
        color: "text-green-600",
        bg: "bg-green-50",
        label: "Excellent",
      };
    if (score >= 5)
      return {
        icon: CheckCircle,
        color: "text-blue-600",
        bg: "bg-blue-50",
        label: "Good",
      };
    return {
      icon: XCircle,
      color: "text-yellow-600",
      bg: "bg-yellow-50",
      label: "Needs Practice",
    };
  };

  const handleCloseEvaluation = () => {
    onBack();
  };

  const handlePracticeAgain = () => {
    setShowEvaluation(false);
    setSpeechChunks([]);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header Bar - HackerRank Style */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <nav className="flex items-center space-x-2 text-sm text-gray-500">
              <span
                className="hover:text-blue-600 transition-colors cursor-pointer"
                onClick={onBack}
              >
                Speaking
              </span>
              <span>/</span>
              <span className="text-gray-900 font-medium">{topic?.title}</span>
            </nav>
          </div>
          <div className="flex items-center space-x-3">
            <Badge
              variant="secondary"
              className={`text-xs font-medium px-3 py-1 capitalize ${getLevelColor(
                topic?.level
              )}`}
            >
              {topic?.level}
            </Badge>
            <Badge
              variant="secondary"
              className={`text-xs font-medium px-3 py-1 capitalize ${getDifficultyColor(
                topic?.difficulty
              )}`}
            >
              {topic?.difficulty}
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content - Two Panel Layout */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Panel - Topic & Submissions Tabs */}
        <div className="flex-1 bg-white border-r border-gray-200 flex flex-col">
          {/* Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="flex-1 flex flex-col"
          >
            <div className="bg-gray-50 border-b border-gray-200 px-6">
              <TabsList className="bg-transparent h-12 p-0 gap-6">
                <TabsTrigger
                  value="topic"
                  className="bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-blue-600 rounded-none px-0 pb-3 pt-3 font-medium text-gray-600 data-[state=active]:text-gray-900"
                >
                  Topic
                </TabsTrigger>
                <TabsTrigger
                  value="submissions"
                  className="bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-blue-600 rounded-none px-0 pb-3 pt-3 font-medium text-gray-600 data-[state=active]:text-gray-900"
                >
                  Submissions
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Topic Tab Content */}
            <TabsContent
              value="topic"
              className="flex-1 overflow-y-auto p-6 m-0"
            >
              <div className="space-y-6">
                {/* Topic Card */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Mic className="h-5 w-5 text-blue-600" />
                    <h3 className="text-base font-semibold text-gray-900">
                      Your Speaking Topic
                    </h3>
                  </div>
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
                    <p className="text-gray-800 leading-relaxed text-lg">
                      {topic?.description}
                    </p>
                  </div>
                </div>

                {/* Instructions */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">
                    How to Practice:
                  </h4>
                  <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
                    <li>Read the topic carefully</li>
                    <li>Think about your response for a moment</li>
                    <li>Click the microphone icon to start recording</li>
                    <li>Speak naturally and clearly about the topic</li>
                    <li>Review your transcript and practice again if needed</li>
                  </ol>
                </div>
              </div>
            </TabsContent>

            {/* Submissions Tab Content */}
            <TabsContent
              value="submissions"
              className="flex-1 overflow-y-auto m-0"
            >
              {isLoadingHistory ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                </div>
              ) : submissionHistory.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <div className="text-center">
                    <div className="mb-3 text-gray-400">
                      <svg
                        className="mx-auto h-12 w-12"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <p className="text-sm font-medium">No submissions yet</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Submit your first evaluation to see it here
                    </p>
                  </div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  {/* Table Header */}
                  <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200 text-xs font-medium text-gray-600">
                    <div className="col-span-2">Status</div>
                    <div className="col-span-2">Submitted</div>
                    <div className="col-span-2">Fluency</div>
                    <div className="col-span-2">Pronunciation</div>
                    <div className="col-span-2">Relevance</div>
                    <div className="col-span-2">Score</div>
                  </div>

                  {/* Table Rows */}
                  <div className="divide-y divide-gray-100">
                    {submissionHistory.map((submission, index) => {
                      const status = getScoreStatus(submission.overall_score);
                      const StatusIcon = status.icon;

                      return (
                        <div
                          key={submission.submission_id}
                          className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors group"
                          onClick={() => handleViewSubmission(submission)}
                        >
                          {/* Status */}
                          <div className="col-span-2 flex items-center gap-2">
                            <div className={`p-1 rounded ${status.bg}`}>
                              <StatusIcon
                                className={`h-4 w-4 ${status.color}`}
                              />
                            </div>
                            <span
                              className={`text-sm font-medium ${status.color}`}
                            >
                              {status.label}
                            </span>
                          </div>

                          {/* Submitted Time */}
                          <div className="col-span-2 flex items-center">
                            <span className="text-sm text-gray-600">
                              {getRelativeTime(submission.submitted_at)}
                            </span>
                          </div>

                          {/* Fluency Score */}
                          <div className="col-span-2 flex items-center">
                            <span className="text-sm font-medium text-gray-900">
                              {Math.round(submission.fluency_score)}/10
                            </span>
                          </div>

                          {/* Pronunciation Score */}
                          <div className="col-span-2 flex items-center">
                            <span className="text-sm font-medium text-gray-900">
                              {Math.round(submission.pronunciation_score)}/10
                            </span>
                          </div>

                          {/* Relevance Score */}
                          <div className="col-span-2 flex items-center">
                            <span className="text-sm font-medium text-gray-900">
                              {Math.round(submission.content_relevance_score)}
                              /10
                            </span>
                          </div>

                          {/* Overall Score */}
                          <div className="col-span-2 flex items-center justify-between">
                            <span
                              className={`text-sm font-bold ${status.color}`}
                            >
                              {Math.round(submission.overall_score)}/10
                            </span>
                            <button className="opacity-0 group-hover:opacity-100 text-blue-600 text-xs font-medium transition-opacity">
                              View Details →
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Panel - Speech Practice */}
        <div className="w-1/2 bg-white flex flex-col">
          {/* Right Panel Header */}
          <div className="bg-gray-50 border-b border-gray-200 px-6 h-16 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-1 h-6 bg-green-500 rounded-full"></div>
              <h2 className="text-lg font-semibold text-gray-900">
                Live Speech Recognition
              </h2>
            </div>

            <Button
              size="sm"
              onClick={handleSubmitForEvaluation}
              disabled={isEvaluating || speechChunks.length === 0}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8"
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

          {/* Speech Practice Content */}
          <div className="flex-1 overflow-hidden flex flex-col p-6 space-y-4">
            <div className="flex-1 overflow-hidden">
              <LiveSpeechToText
                onChunksUpdate={setSpeechChunks}
                placeholderText="Start speaking about your topic"
                listeningText="Listening to your speech..."
                readyText="Ready to speak"
                clickToStartText="Click the microphone to start speaking"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Evaluation Results Dialog */}
      <Dialog open={showEvaluation} onOpenChange={setShowEvaluation}>
        <DialogContent className="sm:max-w-6xl max-h-[90vh] overflow-hidden p-0 rounded-2xl shadow-2xl border-0">
          <div className="overflow-y-auto max-h-[90vh]">
            {evaluation && (
              <SpeakingEvaluationResults
                evaluation={evaluation}
                onClose={handleCloseEvaluation}
                onRevise={handlePracticeAgain}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
