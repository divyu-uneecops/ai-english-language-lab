"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Volume2, RotateCcw } from "lucide-react";
import { VocabularyCard } from "./vocabulary-card";
import { vocabularyService } from "@/services/vocabularyService";
import Link from "next/link";

interface VocabularyItem {
  word: string;
  meaning: string;
  example: string[];
}

export function VocabularyInterface() {
  const [vocabularyData, setVocabularyData] = useState<VocabularyItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVocabulary = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await vocabularyService.fetchVocabulary(1, 10);
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

  const handleExerciseComplete = () => {
    console.log("Vocabulary learning completed!");
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
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">
                Loading vocabulary...
              </p>
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
