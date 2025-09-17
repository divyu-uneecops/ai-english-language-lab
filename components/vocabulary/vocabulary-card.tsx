"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Volume2,
  ArrowRight,
  ArrowLeft,
  Star,
  BookOpen,
  Lightbulb,
  Sparkles,
  CheckCircle,
  RotateCcw,
} from "lucide-react";

interface VocabularyItem {
  word: string;
  meaning: string;
  example: string[];
}

interface VocabularyCardProps {
  vocabularyData: VocabularyItem[];
  onComplete: () => void;
}

export function VocabularyCard({
  vocabularyData,
  onComplete,
}: VocabularyCardProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [showExamples, setShowExamples] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [learnedWords, setLearnedWords] = useState<Set<number>>(new Set());
  const [isFlipped, setIsFlipped] = useState(false);

  // Get words for this exercise (limit to wordCount)
  const wordsToLearn = vocabularyData || [];
  const currentWord = wordsToLearn[currentWordIndex];
  const progress =
    wordsToLearn.length > 0
      ? ((currentWordIndex + 1) / wordsToLearn.length) * 100
      : 0;

  const speakWord = (text: string) => {
    if (isPlaying) return;

    setIsPlaying(true);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.8;
    utterance.pitch = 1;
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);
    speechSynthesis.speak(utterance);
  };

  const markWordLearned = () => {
    setLearnedWords((prev) => new Set([...prev, currentWordIndex]));
  };

  const nextWord = () => {
    if (currentWordIndex < wordsToLearn.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1);
      setShowExamples(false);
      setIsFlipped(false);
    } else {
      onComplete();
    }
  };

  const previousWord = () => {
    if (currentWordIndex > 0) {
      setCurrentWordIndex(currentWordIndex - 1);
      setShowExamples(false);
      setIsFlipped(false);
    }
  };

  const resetProgress = () => {
    setCurrentWordIndex(0);
    setLearnedWords(new Set());
    setShowExamples(false);
    setIsFlipped(false);
  };

  if (!currentWord || wordsToLearn.length === 0) {
    return (
      <div className="text-center py-20">
        <Card className="max-w-md mx-auto bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-blue-800 dark:text-blue-200 mb-2">
              No vocabulary available
            </h3>
            <p className="text-blue-700 dark:text-blue-300">
              Please try again later or check your connection.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isWordLearned = learnedWords.has(currentWordIndex);
  const isLastWord = currentWordIndex === wordsToLearn.length - 1;

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Simple Progress */}
      <div className="mb-6 text-center">
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          {currentWordIndex + 1} of {wordsToLearn.length}
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
          <div
            className="bg-blue-500 h-1 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Interactive Flashcard */}
      <div className="relative mb-8 flex justify-center">
        <div
          className="relative w-full max-w-md h-80"
          style={{ perspective: "1000px" }}
        >
          <div
            className={`relative w-full h-full transition-transform duration-700 ${
              isFlipped ? "rotate-y-180" : ""
            }`}
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Front of Card */}
            <div
              className={`absolute inset-0 w-full h-full ${
                isFlipped ? "opacity-0" : "opacity-100"
              } transition-opacity duration-300`}
              style={{ backfaceVisibility: "hidden" }}
            >
              <Card
                className={`w-full h-full bg-white dark:bg-gray-800 border-2 shadow-xl hover:shadow-2xl transition-all duration-300 ${
                  isWordLearned
                    ? "border-green-300 dark:border-green-600 bg-green-50 dark:bg-green-900/20"
                    : "border-gray-200 dark:border-gray-700"
                }`}
              >
                <CardContent className="h-full flex flex-col items-center justify-center p-8 text-center">
                  <div className="mb-6">
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                        isWordLearned
                          ? "bg-green-100 dark:bg-green-900/30"
                          : "bg-blue-100 dark:bg-blue-900/30"
                      }`}
                    >
                      {isWordLearned ? (
                        <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                      ) : (
                        <BookOpen className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                      )}
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                      {currentWord.word}
                    </h3>
                    {isWordLearned && (
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 mb-4">
                        ✓ Learned
                      </Badge>
                    )}
                    <div className="flex items-center justify-center gap-2 mb-6">
                      <Button
                        onClick={() => speakWord(currentWord.word)}
                        disabled={isPlaying}
                        variant="outline"
                        size="sm"
                        className="bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
                      >
                        <Volume2
                          className={`h-4 w-4 mr-2 ${
                            isPlaying ? "animate-pulse" : ""
                          }`}
                        />
                        {isPlaying ? "Speaking..." : "Listen"}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Button
                      onClick={() => setIsFlipped(true)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      Flip Card
                    </Button>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Click to reveal the meaning
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Back of Card */}
            <div
              className={`absolute inset-0 w-full h-full ${
                isFlipped ? "opacity-100" : "opacity-0"
              } transition-opacity duration-300`}
              style={{
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
              }}
            >
              <Card
                className={`w-full h-full bg-white dark:bg-gray-800 border-2 shadow-xl hover:shadow-2xl transition-all duration-300 ${
                  isWordLearned
                    ? "border-green-300 dark:border-green-600 bg-green-50 dark:bg-green-900/20"
                    : "border-gray-200 dark:border-gray-700"
                }`}
              >
                <CardContent className="h-full flex flex-col justify-center p-8">
                  <div className="text-center mb-6">
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                        isWordLearned
                          ? "bg-green-100 dark:bg-green-900/30"
                          : "bg-green-100 dark:bg-green-900/30"
                      }`}
                    >
                      {isWordLearned ? (
                        <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                      ) : (
                        <Lightbulb className="h-8 w-8 text-green-600 dark:text-green-400" />
                      )}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                      {currentWord.word}
                    </h3>
                    {isWordLearned && (
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 mb-4">
                        ✓ Learned
                      </Badge>
                    )}
                    <div
                      className={`rounded-lg p-4 mb-4 ${
                        isWordLearned
                          ? "bg-green-100 dark:bg-green-800/30"
                          : "bg-gray-50 dark:bg-gray-700"
                      }`}
                    >
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        {currentWord.meaning}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Button
                      onClick={() => setShowExamples(!showExamples)}
                      variant="outline"
                      className="w-full bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
                    >
                      <Star className="h-4 w-4 mr-2" />
                      {showExamples ? "Hide" : "Show"} Examples
                    </Button>

                    {showExamples && (
                      <div className="space-y-2 max-h-24 overflow-y-auto">
                        {currentWord.example
                          .slice(0, 2)
                          .map((example, index) => (
                            <div
                              key={index}
                              className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-sm border-l-4 border-blue-400"
                            >
                              <span className="font-semibold text-blue-600 dark:text-blue-400">
                                {index + 1}.
                              </span>{" "}
                              {example}
                            </div>
                          ))}
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button
                        onClick={() => setIsFlipped(false)}
                        variant="outline"
                        className="flex-1 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
                      >
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Flip Back
                      </Button>
                      <Button
                        onClick={markWordLearned}
                        disabled={isWordLearned}
                        className={`flex-1 px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 ${
                          isWordLearned
                            ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                            : "bg-green-600 hover:bg-green-700 text-white"
                        }`}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        {isWordLearned ? "Already Learned" : "Got it!"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Simple Navigation */}
      <div className="flex items-center justify-center gap-4">
        <Button
          onClick={previousWord}
          disabled={currentWordIndex === 0}
          variant="outline"
          size="sm"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Previous
        </Button>

        <Button
          onClick={nextWord}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6"
        >
          {isLastWord ? "Complete" : "Next"}
          <ArrowRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
