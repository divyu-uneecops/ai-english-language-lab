"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  BookOpen,
  Mic,
  PenTool,
  CheckCircle,
  XCircle,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { readingService } from "@/services/readingService";
import { writingService } from "@/services/writingService";
import { speakingService } from "@/services/speakingService";
import ReadingEvaluationResult from "@/components/shared/components/ReadingEvaluationResult";
import { useRouter, useSearchParams } from "next/navigation";
import { SpeakingEvaluationResults } from "@/components/shared/components/SpeakingEvaluationResults";
import { WritingEvaluationResults } from "@/components/shared/components/WritingEvaluationResults";
import { isEmpty } from "@/lib/utils";

interface ReadingSubmission {
  passage_id: string;
  title: string;
  evaluation_data: {
    overall_score: number;
    scoreBreakdown: {
      accuracy: number;
      fluency: number;
      consistency: number;
    };
    detailedMetrics: {
      accuracy: string;
      fluency: string;
      consistency: string;
    };
    feedback: {
      accuracy: string[];
      fluency: string[];
      consistency: string[];
      overall: string[];
    };
  };
  submitted_at: string;
}

interface WritingSubmission {
  topic_id: string;
  title: string;
  evaluation_data: {
    your_answer: string;
    overall_score: number;
    feedback: {
      strengths: string[];
      areas_for_improvement: string[];
    };
    example_answer: string;
  };
  submitted_at: string;
}

interface SpeakingSubmission {
  topic_id: string;
  title: string;
  evaluation_data: {
    fluency_score: number;
    pronunciation_score: number;
    content_relevance_score: number;
    overall_score: number;
    feedback: {
      strengths: string[];
      areas_for_improvement: string[];
    };
    detailed_feedback: string;
    example_response: string;
  };
  submitted_at: string;
}

export default function SubmissionsPage() {
  const router = useRouter();
  const initialTab = "reading";
  const [activeTab, setActiveTab] = useState(initialTab);
  const [readingSubmissions, setReadingSubmissions] = useState<
    ReadingSubmission[]
  >([]);
  const [writingSubmissions, setWritingSubmissions] = useState<
    WritingSubmission[]
  >([]);
  const [speakingSubmissions, setSpeakingSubmissions] = useState<
    SpeakingSubmission[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  useEffect(() => {
    fetchAllSubmissions();
  }, []);

  const fetchAllSubmissions = async () => {
    setIsLoading(true);
    try {
      const [reading, writing, speaking] = await Promise.allSettled([
        readingService.fetchAllSubmissions(),
        writingService.fetchAllSubmissions(),
        speakingService.fetchAllSubmissions(),
      ]);

      if (reading.status === "fulfilled") {
        setReadingSubmissions(reading.value || []);
      }
      if (writing.status === "fulfilled") {
        setWritingSubmissions(writing.value || []);
      }
      if (speaking.status === "fulfilled") {
        setSpeakingSubmissions(speaking.value || []);
      }
    } catch (error) {
      console.error("Error fetching submissions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRelativeTime = (dateString: string) => {
    const localDate = new Date(dateString);
    const formatted = localDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    return formatted;
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

  const handleViewDetails = (submission: any, type: string) => {
    setSelectedSubmission({ ...submission, type });
    setShowDetailsDialog(true);
  };

  const renderReadingSubmissions = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      );
    }

    if (readingSubmissions.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
          <div className="text-center">
            <div className="mb-3 text-gray-400">
              <BookOpen className="h-12 w-12 mx-auto" />
            </div>
            <p className="text-sm font-medium">No reading submissions yet</p>
            <p className="text-xs text-gray-400 mt-1">
              Start practicing reading to see your submissions here
            </p>
            <Link href="/reading">
              <Button className="mt-4" size="sm">
                Go to Reading Practice
              </Button>
            </Link>
          </div>
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200 text-xs font-medium text-gray-600">
          <div className="col-span-3">Passage</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2">Submitted</div>
          <div className="col-span-2">Score</div>
        </div>

        {/* Table Rows */}
        <div className="divide-y divide-gray-100">
          {readingSubmissions?.map((submission, index) => {
            const status = getScoreStatus(
              submission?.evaluation_data?.overall_score
            );
            const StatusIcon = status.icon;

            return (
              <div
                key={`reading-${index}`}
                className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors group"
                onClick={() => handleViewDetails(submission, "reading")}
              >
                {/* Passage Title */}
                <div className="col-span-3 flex items-center">
                  <span className="text-sm font-medium text-gray-900 truncate">
                    {submission?.title || "Untitled Passage"}
                  </span>
                </div>

                {/* Status */}
                <div className="col-span-2 flex items-center gap-2">
                  <div className={`p-1 rounded ${status?.bg}`}>
                    <StatusIcon className={`h-4 w-4 ${status?.color}`} />
                  </div>
                  <span className={`text-sm font-medium ${status?.color}`}>
                    {status?.label}
                  </span>
                </div>

                {/* Submitted Time */}
                <div className="col-span-2 flex items-center">
                  <span className="text-sm text-gray-600">
                    {getRelativeTime(submission?.submitted_at)}
                  </span>
                </div>

                {/* Overall Score */}
                <div className="col-span-2 flex items-center justify-between">
                  <span className={`text-sm font-bold ${status?.color}`}>
                    {Math.round(submission?.evaluation_data?.overall_score)}/10
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
    );
  };

  const renderWritingSubmissions = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      );
    }

    if (writingSubmissions.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
          <div className="text-center">
            <div className="mb-3 text-gray-400">
              <PenTool className="h-12 w-12 mx-auto" />
            </div>
            <p className="text-sm font-medium">No writing submissions yet</p>
            <p className="text-xs text-gray-400 mt-1">
              Start practicing writing to see your submissions here
            </p>
            <Link href="/writing">
              <Button className="mt-4" size="sm">
                Go to Writing Practice
              </Button>
            </Link>
          </div>
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200 text-xs font-medium text-gray-600">
          <div className="col-span-3">Topic</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2">Submitted</div>
          <div className="col-span-2">Score</div>
        </div>

        {/* Table Rows */}
        <div className="divide-y divide-gray-100">
          {writingSubmissions?.map((submission, index) => {
            const status = getScoreStatus(
              submission?.evaluation_data?.overall_score
            );
            const StatusIcon = status.icon;

            return (
              <div
                key={`writing-${index}`}
                className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors group"
                onClick={() => handleViewDetails(submission, "writing")}
              >
                {/* Topic Title */}
                <div className="col-span-3 flex items-center">
                  <span className="text-sm font-medium text-gray-900 truncate">
                    {submission?.title || "Untitled Topic"}
                  </span>
                </div>

                {/* Status */}
                <div className="col-span-2 flex items-center gap-2">
                  <div className={`p-1 rounded ${status?.bg}`}>
                    <StatusIcon className={`h-4 w-4 ${status?.color}`} />
                  </div>
                  <span className={`text-sm font-medium ${status?.color}`}>
                    {status?.label}
                  </span>
                </div>

                {/* Submitted Time */}
                <div className="col-span-2 flex items-center">
                  <span className="text-sm text-gray-600">
                    {getRelativeTime(submission?.submitted_at)}
                  </span>
                </div>

                {/* Overall Score */}
                <div className="col-span-2 flex items-center justify-between">
                  <span className={`text-sm font-bold ${status?.color}`}>
                    {Math.round(submission?.evaluation_data?.overall_score)}/10
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
    );
  };

  const renderSpeakingSubmissions = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      );
    }

    if (speakingSubmissions.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
          <div className="text-center">
            <div className="mb-3 text-gray-400">
              <Mic className="h-12 w-12 mx-auto" />
            </div>
            <p className="text-sm font-medium">No speaking submissions yet</p>
            <p className="text-xs text-gray-400 mt-1">
              Start practicing speaking to see your submissions here
            </p>
            <Link href="/speaking">
              <Button className="mt-4" size="sm">
                Go to Speaking Practice
              </Button>
            </Link>
          </div>
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200 text-xs font-medium text-gray-600">
          <div className="col-span-3">Topic</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2">Submitted</div>
          <div className="col-span-2">Score</div>
        </div>

        {/* Table Rows */}
        <div className="divide-y divide-gray-100">
          {speakingSubmissions?.map((submission, index) => {
            const status = getScoreStatus(
              submission?.evaluation_data?.overall_score
            );
            const StatusIcon = status.icon;

            return (
              <div
                key={`speaking-${index}`}
                className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors group"
                onClick={() => handleViewDetails(submission, "speaking")}
              >
                {/* Topic Title */}
                <div className="col-span-3 flex items-center">
                  <span className="text-sm font-medium text-gray-900 truncate">
                    {submission?.title || "Untitled Topic"}
                  </span>
                </div>

                {/* Status */}
                <div className="col-span-2 flex items-center gap-2">
                  <div className={`p-1 rounded ${status?.bg}`}>
                    <StatusIcon className={`h-4 w-4 ${status?.color}`} />
                  </div>
                  <span className={`text-sm font-medium ${status?.color}`}>
                    {status?.label}
                  </span>
                </div>

                {/* Submitted Time */}
                <div className="col-span-2 flex items-center">
                  <span className="text-sm text-gray-600">
                    {getRelativeTime(submission?.submitted_at)}
                  </span>
                </div>

                {/* Overall Score */}
                <div className="col-span-2 flex items-center justify-between">
                  <span className={`text-sm font-bold ${status?.color}`}>
                    {Math.round(submission?.evaluation_data?.overall_score)}/10
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
    );
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <Link href="/dashboard">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mb-4 -ml-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100/50 transition-all duration-200 group cursor-pointer"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
                    <span className="font-medium">Back to Dashboard</span>
                  </Button>
                </Link>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  My Submissions
                </h1>
                <p className="text-gray-600 mt-2">
                  View all your practice submissions across different modules
                </p>
              </div>
            </div>
          </div>

          {/* Submissions Tabs */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <div className="bg-white border-b border-gray-200 px-6 rounded-t-2xl">
                <TabsList className="bg-transparent h-auto p-0 gap-8">
                  <TabsTrigger
                    value="reading"
                    className="relative bg-transparent shadow-none border-0 rounded-none px-1 pb-4 pt-4 font-medium text-[15px] text-gray-500 data-[state=active]:text-gray-900 hover:text-gray-700 transition-colors duration-150 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-orange-600 after:rounded-full after:scale-x-0 data-[state=active]:after:scale-x-100 after:transition-transform after:duration-300 after:ease-out"
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    <span>Reading</span>
                    {readingSubmissions?.length > 0 && (
                      <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-semibold text-orange-700 bg-orange-100 rounded-full">
                        {readingSubmissions?.length}
                      </span>
                    )}
                  </TabsTrigger>
                  <TabsTrigger
                    value="writing"
                    className="relative bg-transparent shadow-none border-0 rounded-none px-1 pb-4 pt-4 font-medium text-[15px] text-gray-500 data-[state=active]:text-gray-900 hover:text-gray-700 transition-colors duration-150 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-orange-600 after:rounded-full after:scale-x-0 data-[state=active]:after:scale-x-100 after:transition-transform after:duration-300 after:ease-out"
                  >
                    <PenTool className="h-4 w-4 mr-2" />
                    <span>Writing</span>
                    {writingSubmissions?.length > 0 && (
                      <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-semibold text-orange-700 bg-orange-100 rounded-full">
                        {writingSubmissions?.length}
                      </span>
                    )}
                  </TabsTrigger>
                  <TabsTrigger
                    value="speaking"
                    className="relative bg-transparent shadow-none border-0 rounded-none px-1 pb-4 pt-4 font-medium text-[15px] text-gray-500 data-[state=active]:text-gray-900 hover:text-gray-700 transition-colors duration-150 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-orange-600 after:rounded-full after:scale-x-0 data-[state=active]:after:scale-x-100 after:transition-transform after:duration-300 after:ease-out"
                  >
                    <Mic className="h-4 w-4 mr-2" />
                    <span>Speaking</span>
                    {speakingSubmissions?.length > 0 && (
                      <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-semibold text-orange-700 bg-orange-100 rounded-full">
                        {speakingSubmissions?.length}
                      </span>
                    )}
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Tab Content */}
              <TabsContent value="reading" className="m-0 min-h-[400px]">
                {renderReadingSubmissions()}
              </TabsContent>

              <TabsContent value="writing" className="m-0 min-h-[400px]">
                {renderWritingSubmissions()}
              </TabsContent>

              <TabsContent value="speaking" className="m-0 min-h-[400px]">
                {renderSpeakingSubmissions()}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="sm:max-w-6xl max-h-[90vh] overflow-hidden p-0 rounded-2xl shadow-2xl border-0">
          <div className="overflow-y-auto max-h-[90vh]">
            {selectedSubmission && selectedSubmission?.type === "reading" && (
              <ReadingEvaluationResult
                result={selectedSubmission?.evaluation_data}
                onClose={() => router.push("/reading")}
                onRetry={() => {
                  if (isEmpty(selectedSubmission?.passage_id)) {
                    return;
                  }
                  router.push(`/reading/${selectedSubmission?.passage_id}`);
                }}
              />
            )}

            {selectedSubmission && selectedSubmission?.type === "speaking" && (
              <SpeakingEvaluationResults
                evaluation={selectedSubmission?.evaluation_data}
                onClose={() => router.push("/speaking")}
                onRevise={() => {
                  if (isEmpty(selectedSubmission?.topic_id)) {
                    return;
                  }

                  router.push(`/speaking/${selectedSubmission?.topic_id}`);
                }}
              />
            )}

            {selectedSubmission && selectedSubmission?.type === "writing" && (
              <WritingEvaluationResults
                evaluation={selectedSubmission?.evaluation_data}
                onClose={() => router.push("/writing")}
                onRevise={() => {
                  if (selectedSubmission?.topic_id) {
                    return;
                  }
                  router.push(`/writing/${selectedSubmission?.topic_id}`);
                }}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
