"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Star, Target, Trophy, Mic } from "lucide-react";
import { SpeakingTopicComponent } from "./speaking-topic-component";

export function SpeakingInterface() {
  const [showLevelDialog, setShowLevelDialog] = useState<boolean>(true);
  const [selectedLevel, setSelectedLevel] = useState<
    "beginner" | "intermediate" | "advanced" | null
  >(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<
    "easy" | "medium" | "hard" | null
  >(null);
  const [showDifficultyDialog, setShowDifficultyDialog] =
    useState<boolean>(false);
  const [showTopicComponent, setShowTopicComponent] = useState<boolean>(false);

  const applyLevel = (level: "beginner" | "intermediate" | "advanced") => {
    setSelectedLevel(level);
    setShowLevelDialog(false);
    setShowDifficultyDialog(true);
  };

  const applyDifficulty = (difficulty: "easy" | "medium" | "hard") => {
    setSelectedDifficulty(difficulty);
    setShowDifficultyDialog(false);
    setShowTopicComponent(true);
  };

  const handleBackToSelection = () => {
    setShowTopicComponent(false);
    setSelectedLevel(null);
    setSelectedDifficulty(null);
    setShowLevelDialog(true);
  };

  // Show topic component if level and difficulty are selected
  if (showTopicComponent && selectedLevel && selectedDifficulty) {
    return (
      <SpeakingTopicComponent
        level={selectedLevel}
        difficulty={selectedDifficulty}
        onBack={handleBackToSelection}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      {/* Level Selection Dialog */}
      <Dialog open={showLevelDialog} onOpenChange={() => {}}>
        <DialogContent
          className="sm:max-w-lg p-0 overflow-hidden rounded-2xl shadow-2xl border-0 [&>button]:hidden"
          onInteractOutside={(e) => e.preventDefault()}
        >
          <div className="relative p-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_left,_#fff,_transparent_50%)]"></div>
            <div className="relative z-10 text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-xs font-semibold mb-3">
                <Mic className="h-4 w-4" />
                Speaking Practice
              </div>
              <DialogTitle className="text-2xl font-extrabold tracking-tight text-white">
                Choose Your Speaking Level
              </DialogTitle>
              <DialogDescription className="text-white/90 text-sm mt-1">
                Pick a level to get a random topic at that difficulty
              </DialogDescription>
            </div>
          </div>
          <div className="p-6 bg-white">
            <div className="grid grid-cols-1 gap-3">
              <button
                className="group w-full text-left flex items-center gap-3 p-4 rounded-xl border border-green-200 hover:border-green-300 hover:shadow-md transition-all bg-gradient-to-br from-green-50 to-white"
                onClick={() => applyLevel("beginner")}
              >
                <div className="p-2 rounded-lg bg-green-100 text-green-700 group-hover:scale-110 transition-transform">
                  <Star className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">Beginner</div>
                  <div className="text-xs text-gray-600">
                    Simple topics, basic vocabulary
                  </div>
                </div>
              </button>

              <button
                className="group w-full text-left flex items-center gap-3 p-4 rounded-xl border border-yellow-200 hover:border-yellow-300 hover:shadow-md transition-all bg-gradient-to-br from-yellow-50 to-white"
                onClick={() => applyLevel("intermediate")}
              >
                <div className="p-2 rounded-lg bg-yellow-100 text-yellow-700 group-hover:scale-110 transition-transform">
                  <Target className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">
                    Intermediate
                  </div>
                  <div className="text-xs text-gray-600">
                    Balanced topics with moderate complexity
                  </div>
                </div>
              </button>

              <button
                className="group w-full text-left flex items-center gap-3 p-4 rounded-xl border border-red-200 hover:border-red-300 hover:shadow-md transition-all bg-gradient-to-br from-red-50 to-white"
                onClick={() => applyLevel("advanced")}
              >
                <div className="p-2 rounded-lg bg-red-100 text-red-700 group-hover:scale-110 transition-transform">
                  <Trophy className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">Advanced</div>
                  <div className="text-xs text-gray-600">
                    Complex topics, sophisticated vocabulary
                  </div>
                </div>
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Difficulty Selection Dialog */}
      <Dialog open={showDifficultyDialog} onOpenChange={() => {}}>
        <DialogContent
          className="sm:max-w-lg p-0 overflow-hidden rounded-2xl shadow-2xl border-0 [&>button]:hidden"
          onInteractOutside={(e) => e.preventDefault()}
        >
          <div className="relative p-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_left,_#fff,_transparent_50%)]"></div>
            <div className="relative z-10 text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-xs font-semibold mb-3">
                <Target className="h-4 w-4" />
                Difficulty Selection
              </div>
              <DialogTitle className="text-2xl font-extrabold tracking-tight text-white">
                Choose Difficulty Level
              </DialogTitle>
              <DialogDescription className="text-white/90 text-sm mt-1">
                Select the difficulty for your {selectedLevel} speaking practice
              </DialogDescription>
            </div>
          </div>
          <div className="p-6 bg-white">
            <div className="grid grid-cols-1 gap-3">
              <button
                className="group w-full text-left flex items-center gap-3 p-4 rounded-xl border border-green-200 hover:border-green-300 hover:shadow-md transition-all bg-gradient-to-br from-green-50 to-white"
                onClick={() => applyDifficulty("easy")}
              >
                <div className="p-2 rounded-lg bg-green-100 text-green-700 group-hover:scale-110 transition-transform">
                  <Star className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">Easy</div>
                  <div className="text-xs text-gray-600">
                    Simple vocabulary and straightforward topics
                  </div>
                </div>
              </button>

              <button
                className="group w-full text-left flex items-center gap-3 p-4 rounded-xl border border-yellow-200 hover:border-yellow-300 hover:shadow-md transition-all bg-gradient-to-br from-yellow-50 to-white"
                onClick={() => applyDifficulty("medium")}
              >
                <div className="p-2 rounded-lg bg-yellow-100 text-yellow-700 group-hover:scale-110 transition-transform">
                  <Target className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">Medium</div>
                  <div className="text-xs text-gray-600">
                    Moderate complexity with some challenging aspects
                  </div>
                </div>
              </button>

              <button
                className="group w-full text-left flex items-center gap-3 p-4 rounded-xl border border-red-200 hover:border-red-300 hover:shadow-md transition-all bg-gradient-to-br from-red-50 to-white"
                onClick={() => applyDifficulty("hard")}
              >
                <div className="p-2 rounded-lg bg-red-100 text-red-700 group-hover:scale-110 transition-transform">
                  <Trophy className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">Hard</div>
                  <div className="text-xs text-gray-600">
                    Complex vocabulary and advanced topics
                  </div>
                </div>
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
