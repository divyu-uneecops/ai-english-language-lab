"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

  const speakWord = async (text: string) => {
    if (isPlaying) return;

    setIsPlaying(true);

    try {
      // Call Sarvam AI TTS REST API route
      const response = await fetch("/api/sarvam-tts-rest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate speech");
      }

      const data = await response.json();

      // Convert base64 audio to playable format
      const audioBlob = base64ToBlob(data.audio, data.mimeType);
      const audioUrl = URL.createObjectURL(audioBlob);

      // Create and play audio
      const audio = new Audio(audioUrl);
      audio.onended = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(audioUrl); // Clean up
      };
      audio.onerror = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(audioUrl); // Clean up
        console.error("Error playing audio");
      };

      await audio.play();
    } catch (error) {
      console.error("Error with Sarvam TTS:", error);
      setIsPlaying(false);
    }
  };

  // Helper function to convert base64 to Blob
  const base64ToBlob = (base64: string, mimeType: string): Blob => {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
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
      <div className="relative mb-12 flex justify-center">
        <div
          className="relative w-full max-w-md h-[28rem]"
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
                <CardContent className="h-full flex flex-col items-center justify-center p-6 text-center">
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
                    <div className="flex items-center justify-center gap-3 mb-6">
                      <Button
                        onClick={() => speakWord(currentWord.word)}
                        disabled={isPlaying}
                        className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-lg"
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
                  <div className="space-y-4">
                    <Button
                      onClick={() => setIsFlipped(true)}
                      className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-semibold"
                    >
                      <Sparkles className="h-5 w-5 mr-2" />
                      Flip Card
                    </Button>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
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
                <CardContent className="h-full flex flex-col p-6">
                  {/* Header Section */}
                  <div className="text-center mb-3 flex-shrink-0">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${
                        isWordLearned
                          ? "bg-green-100 dark:bg-green-900/30"
                          : "bg-green-100 dark:bg-green-900/30"
                      }`}
                    >
                      {isWordLearned ? (
                        <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                      ) : (
                        <Lightbulb className="h-6 w-6 text-green-600 dark:text-green-400" />
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {currentWord.word}
                    </h3>
                    {isWordLearned && (
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 mb-2">
                        ✓ Learned
                      </Badge>
                    )}
                  </div>

                  {/* Meaning Section */}
                  <div className="mb-3 flex-shrink-0">
                    <div
                      className={`rounded-lg p-3 ${
                        isWordLearned
                          ? "bg-green-100 dark:bg-green-800/30"
                          : "bg-gray-50 dark:bg-gray-700"
                      }`}
                    >
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
                        {currentWord.meaning}
                      </p>
                    </div>
                  </div>

                  {/* Examples Section */}
                  <div className="mb-3 flex-shrink-0">
                    <Button
                      onClick={() => setShowExamples(!showExamples)}
                      className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-4 py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-medium mb-2"
                    >
                      <Star className="h-4 w-4 mr-2" />
                      {showExamples ? "Hide" : "Show"} Examples
                    </Button>

                    <div
                      className={`transition-all duration-300 ease-in-out overflow-hidden ${
                        showExamples
                          ? "max-h-28 opacity-100"
                          : "max-h-0 opacity-0"
                      }`}
                    >
                      <div>
                        {currentWord.example
                          .slice(0, 2)
                          .map((example, index) => (
                            <div
                              key={index}
                              className="p-2 bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-lg text-xs border-l-3 border-orange-400 shadow-sm hover:shadow-md transition-all duration-200 mb-1"
                            >
                              <div className="flex items-start gap-2">
                                <span className="font-bold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-800/30 rounded-full w-4 h-4 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                                  {index + 1}
                                </span>
                                <span className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                  {example}
                                </span>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>

                  {/* Spacer to push buttons to bottom */}
                  <div className="flex-grow"></div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 flex-shrink-0 mt-4">
                    <Button
                      onClick={() => setIsFlipped(false)}
                      className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-4 py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-medium"
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Flip Back
                    </Button>
                    <Button
                      onClick={markWordLearned}
                      disabled={isWordLearned}
                      className={`flex-1 px-4 py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-medium ${
                        isWordLearned
                          ? "bg-gray-400 text-gray-200 cursor-not-allowed transform-none disabled:hover:shadow-lg"
                          : "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
                      }`}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      {isWordLearned ? "Learned" : "Got it!"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Navigation */}
      <div className="flex items-center justify-center gap-4 mt-8">
        <Button
          onClick={previousWord}
          disabled={currentWordIndex === 0}
          className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-lg"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Previous
        </Button>

        <Button
          onClick={nextWord}
          className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-semibold"
        >
          {isLastWord ? "🎉 Complete" : "Next Word"}
          <ArrowRight className="h-5 w-5 ml-2" />
        </Button>
      </div>
    </div>
  );
}
