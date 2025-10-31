"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { writingService } from "@/services/writingService";
import { WritingEvaluationResults } from "@/components/shared/components/WritingEvaluationResults";
import {
  FileText,
  CheckCircle,
  XCircle,
  Loader2,
  ArrowLeft,
} from "lucide-react";

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

export default function WritingSubmissionsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [writingSubmissions, setWritingSubmissions] = useState<
    WritingSubmission[]
  >([]);
  const [selectedSubmission, setSelectedSubmission] =
    useState<WritingSubmission | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  useEffect(() => {
    fetchWritingSubmissions();
  }, []);

  const fetchWritingSubmissions = async () => {
    setIsLoading(true);
    try {
      const submissions = await writingService.fetchAllSubmissions();
      setWritingSubmissions(submissions || []);
    } catch (e) {
      console.error("Error fetching writing submissions:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const getRelativeTime = (dateString: string) => {
    const localDate = new Date(dateString);
    return localDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
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

  const handleViewDetails = (submission: WritingSubmission) => {
    setSelectedSubmission(submission);
    setShowDetailsDialog(true);
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <Link href="/writing">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mb-4 -ml-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100/50 transition-all duration-200 group cursor-pointer"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
                    <span className="font-medium">Back to Writing</span>
                  </Button>
                </Link>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Writing Submissions
                </h1>
                <p className="text-gray-600 mt-2">
                  Review your writing practice results
                </p>
              </div>
            </div>
          </div>

          {/* Submissions Table */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            ) : writingSubmissions.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <div className="text-center">
                  <div className="mb-3 text-gray-400">
                    <FileText className="h-12 w-12 mx-auto" />
                  </div>
                  <p className="text-sm font-medium">
                    No writing submissions yet
                  </p>
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
            ) : (
              <div className="overflow-x-auto">
                <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200 text-xs font-medium text-gray-600 rounded-t-2xl">
                  <div className="col-span-4">Prompt</div>
                  <div className="col-span-3">Status</div>
                  <div className="col-span-3">Submitted</div>
                  <div className="col-span-2">Score</div>
                </div>

                <div className="divide-y divide-gray-100">
                  {writingSubmissions.map((submission, index) => {
                    const status = getScoreStatus(
                      submission?.evaluation_data?.overall_score
                    );
                    const StatusIcon = status.icon;
                    return (
                      <div
                        key={`writing-${index}`}
                        className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors group"
                        onClick={() => handleViewDetails(submission)}
                      >
                        {/* Prompt Title */}
                        <div className="col-span-4 flex items-center">
                          <span className="text-sm font-medium text-gray-900 truncate">
                            {submission?.title || "Untitled Prompt"}
                          </span>
                        </div>

                        {/* Status */}
                        <div className="col-span-3 flex items-center gap-2">
                          <div className={`p-1 rounded ${status?.bg}`}>
                            <StatusIcon
                              className={`h-4 w-4 ${status?.color}`}
                            />
                          </div>
                          <span
                            className={`text-sm font-medium ${status?.color}`}
                          >
                            {status.label}
                          </span>
                        </div>

                        {/* Submitted Time */}
                        <div className="col-span-3 flex items-center">
                          <span className="text-sm text-gray-600">
                            {getRelativeTime(submission?.submitted_at)}
                          </span>
                        </div>

                        {/* Overall Score */}
                        <div className="col-span-2 flex items-center justify-between">
                          <span
                            className={`text-sm font-bold ${status?.color}`}
                          >
                            {Math.round(
                              submission?.evaluation_data?.overall_score
                            )}
                            /10
                          </span>
                          <button className="text-blue-600 text-xs font-medium transition-opacity">
                            View Details →
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="sm:max-w-6xl max-h-[90vh] overflow-hidden p-0 rounded-2xl shadow-2xl border-0">
          <div className="overflow-y-auto max-h-[90vh]">
            {selectedSubmission && (
              <WritingEvaluationResults
                evaluation={selectedSubmission?.evaluation_data}
                onClose={() => router.push("/writing")}
                onRevise={() =>
                  router.push(`/writing/${selectedSubmission?.topic_id}`)
                }
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
