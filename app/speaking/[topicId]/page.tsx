"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { SpeakingTopicComponent } from "@/components/speaking/components/speaking-topic-component";
import { ProtectedRoute } from "@/components/protected-route";
import { speakingService } from "@/services/speakingService";
import { Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { isEmpty } from "@/lib/utils";
import { SpeakingTopic } from "@/components/speaking/types";

export default function SpeakingTopicPage() {
  const params = useParams();
  const router = useRouter();
  const topicId = params?.topicId as string;

  const [topic, setTopic] = useState<SpeakingTopic | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTopic = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch the specific speaking topic by ID
        const response = await speakingService?.fetchTopicById(topicId);

        const topicData: SpeakingTopic = response;

        if (!isEmpty(topicData)) {
          setTopic(topicData);
        }
      } catch (err: any) {
        if (err?.response) {
          // If using axios
          setError(
            err?.response?.data?.message ||
              "Failed to load topic. Please try again."
          );
        }
      } finally {
        setLoading(false);
      }
    };

    if (topicId) {
      fetchTopic();
    }
  }, [topicId]);

  const handleBack = () => {
    router.push("/speaking");
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <div className="p-4 bg-gradient-to-r from-orange-100 to-orange-200 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Loading speaking topic...
            </h3>
            <p className="text-gray-600">
              Please wait while we fetch the content
            </p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto">
            <div className="p-4 bg-gradient-to-r from-red-100 to-red-200 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Unable to load speaking topic
            </h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="flex gap-3 justify-center">
              <Button
                onClick={handleBack}
                variant="outline"
                className="border-gray-300 text-gray-600 hover:bg-gray-50"
              >
                Back to Speaking
              </Button>
              <Button
                onClick={() => window?.location?.reload()}
                className="bg-orange-600 hover:bg-orange-700 text-white"
              >
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!topic) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <div className="p-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <AlertCircle className="h-8 w-8 text-gray-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Speaking topic not found
            </h3>
            <p className="text-gray-600 mb-6">
              The speaking topic you're looking for doesn't exist.
            </p>
            <Button
              onClick={handleBack}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              Back to Speaking
            </Button>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <SpeakingTopicComponent topic={topic} onBack={handleBack} />
    </ProtectedRoute>
  );
}
