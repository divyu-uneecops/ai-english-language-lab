"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Volume2,
  RotateCcw,
  Trophy,
  Sparkles,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { VocabularyCard } from "./vocabulary-card";
import { vocabularyService } from "@/services/vocabularyService";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface VocabularyItem {
  word: string;
  meaning: string;
  example: string[];
}

export function VocabularyInterface() {
  const router = useRouter();
  const [vocabularyData, setVocabularyData] = useState<VocabularyItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const hasPlayedCelebration = useRef(false);

  const fetchVocabulary = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await vocabularyService.fetchVocabulary(1, 15);
      setVocabularyData(data?.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error fetching vocabulary:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVocabulary();
  }, []);

  useEffect(() => {
    if (
      isCompleted &&
      !hasPlayedCelebration.current &&
      vocabularyData.length > 0
    ) {
      hasPlayedCelebration.current = true;
      playCelebrationSound();
    }
  }, [isCompleted, vocabularyData.length]);

  const playCelebrationSound = () => {
    // Play a celebratory voice message
    const wordCount = vocabularyData.length || 15; // Fallback to 15 if somehow empty
    const celebrationMessage = `Congratulations!`;
    const utterance = new SpeechSynthesisUtterance(celebrationMessage);
    utterance.rate = 0.9;
    utterance.pitch = 1.2;
    utterance.volume = 1;
    speechSynthesis.speak(utterance);
  };

  const handleExerciseComplete = () => {
    setIsCompleted(true);
  };

  const handleGoToDashboard = () => {
    router.push(`/dashboard`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Modern Ed-Tech Header */}

        <div className="flex items-center justify-between">
          <div className="space-y-4">
            <nav className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <Link
                href="/dashboard"
                className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              >
                Dashboard
              </Link>
              <span>/</span>
              <span className="text-gray-900 dark:text-gray-100 font-medium">
                Vocabulary
              </span>
            </nav>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex justify-center">
          {loading ? (
            <div className="flex items-center justify-center py-16 w-full">
              <div className="text-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20 dark:border-gray-700/20">
                <div className="p-4 bg-gradient-to-r from-orange-100 to-orange-200 dark:from-orange-900/30 dark:to-orange-800/30 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Loading vocabulary...
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Please wait while we fetch the content
                </p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Volume2 className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
                Error Loading Vocabulary
              </h3>
              <p className="text-red-700 dark:text-red-300 mb-4">{error}</p>
              <Button
                onClick={fetchVocabulary}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </div>
          ) : isCompleted ? (
            <div className="w-full max-w-2xl mx-auto">
              <div className="text-center py-12 px-6">
                {/* Celebration Animation Container */}
                <div className="relative mb-8">
                  {/* Animated Trophy Icon */}
                  <div className="relative inline-block">
                    <div className="absolute inset-0 bg-yellow-400 rounded-full blur-2xl opacity-50 animate-pulse"></div>
                    <div className="relative w-32 h-32 bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500 rounded-full flex items-center justify-center shadow-2xl transform animate-bounce">
                      <Trophy className="h-16 w-16 text-white" />
                    </div>
                  </div>

                  {/* Floating Sparkles */}
                  <div className="absolute top-0 left-1/4">
                    <Sparkles
                      className="h-8 w-8 text-yellow-400 animate-pulse"
                      style={{ animationDelay: "0s" }}
                    />
                  </div>
                  <div className="absolute top-0 right-1/4">
                    <Sparkles
                      className="h-8 w-8 text-orange-400 animate-pulse"
                      style={{ animationDelay: "0.5s" }}
                    />
                  </div>
                  <div className="absolute bottom-0 left-1/3">
                    <Sparkles
                      className="h-6 w-6 text-yellow-300 animate-pulse"
                      style={{ animationDelay: "1s" }}
                    />
                  </div>
                  <div className="absolute bottom-0 right-1/3">
                    <Sparkles
                      className="h-6 w-6 text-orange-300 animate-pulse"
                      style={{ animationDelay: "1.5s" }}
                    />
                  </div>
                </div>

                {/* Achievement Message */}
                <div className="space-y-4 mb-8">
                  <h2 className="text-4xl font-bold bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 text-transparent bg-clip-text">
                    🎉 Congratulations! 🎉
                  </h2>
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 border-2 border-green-200 dark:border-green-700 shadow-lg">
                    <div className="flex items-center justify-center gap-3 mb-3">
                      <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
                      <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                        Today's Goal is Completed!
                      </p>
                    </div>
                    <p className="text-xl text-gray-700 dark:text-gray-300 font-medium">
                      You learned{" "}
                      <span className="font-bold text-green-600 dark:text-green-400">
                        {vocabularyData.length} Vocabulary
                      </span>{" "}
                      words
                    </p>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-lg">
                    Keep up the excellent work! Your dedication to learning is
                    inspiring.
                  </p>
                </div>

                {/* Action Button */}
                <Button
                  onClick={handleGoToDashboard}
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  Go to Dashboard
                  <Sparkles className="h-5 w-5 ml-2" />
                </Button>
              </div>
            </div>
          ) : (
            <VocabularyCard
              vocabularyData={vocabularyData}
              onComplete={handleExerciseComplete}
            />
          )}
        </div>
      </div>
    </div>
  );
}
