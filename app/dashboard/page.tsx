"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Clock,
  Trophy,
  Star,
  Target,
  TrendingUp,
  Play,
  Lock,
  ChevronRight,
  CheckCircle,
  Award,
  Users,
  Brain,
  Zap,
  Globe,
  FileText,
  Mic,
  Volume2,
  MessageCircle,
  PenTool,
  BookMarked,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";

export default function EnglishLearningDashboard() {
  const { user } = useAuth();

  const [userStats] = useState({
    totalPoints: 127,
    level: "Intermediate",
    streak: 7,
    completedModules: 12,
    timeSpent: "2h 15m",
  });

  const [prepKits] = useState([
    {
      id: 1,
      title: "Complete English Mastery Kit",
      description:
        "45 Reading Passages • 30 Speaking Exercises • 20 Writing Tasks • 25 Vocabulary Sets • 1 Certification",
      difficulty: "Beginner to Advanced",
      isNew: true,
      modules: ["Reading", "Speaking", "Writing", "Vocabulary", "Chat"],
    },
    {
      id: 2,
      title: "Vocabulary & Reading Kit",
      description:
        "50 Vocabulary Sets • 20 Reading Passages • 15 Comprehension Tests • 1 Certification",
      difficulty: "Intermediate",
      isNew: false,
      modules: ["Vocabulary", "Reading"],
    },
  ]);

  const [continuePracticing] = useState([
    {
      id: 1,
      title: "Reading Practice",
      progress: 75,
      pointsNeeded: 15,
      icon: <BookOpen className="h-6 w-6" />,
      color: "orange",
      completed: 8,
      total: 12,
      href: "/reading",
    },
    {
      id: 2,
      title: "Speaking Practice",
      progress: 45,
      pointsNeeded: 25,
      icon: <Mic className="h-6 w-6" />,
      color: "pink",
      completed: 3,
      total: 8,
      href: "#",
    },
    {
      id: 3,
      title: "Writing Practice",
      progress: 20,
      pointsNeeded: 30,
      icon: <PenTool className="h-6 w-6" />,
      color: "yellow",
      completed: 1,
      total: 5,
      href: "/writing",
    },
    {
      id: 4,
      title: "Vocabulary Practice",
      progress: 60,
      pointsNeeded: 20,
      icon: <BookMarked className="h-6 w-6" />,
      color: "purple",
      completed: 6,
      total: 10,
      href: "/vocabulary",
    },
    {
      id: 5,
      title: "AI Chat Practice",
      progress: 0,
      pointsNeeded: 20,
      icon: <MessageCircle className="h-6 w-6" />,
      color: "blue",
      completed: 0,
      total: 3,
      href: "#",
      locked: true,
    },
  ]);

  const [practiceSkills] = useState([
    {
      name: "Reading Comprehension",
      icon: <BookOpen className="h-5 w-5" />,
      color: "orange",
      href: "/reading",
    },
    {
      name: "Pronunciation",
      icon: <Mic className="h-5 w-5" />,
      color: "pink",
      href: "/speaking",
    },
    {
      name: "Fluency",
      icon: <Zap className="h-5 w-5" />,
      color: "green",
      href: "/speaking",
    },
    {
      name: "Vocabulary",
      icon: <Brain className="h-5 w-5" />,
      color: "purple",
      href: "/reading",
    },
    {
      name: "Grammar",
      icon: <FileText className="h-5 w-5" />,
      color: "red",
      href: "/writing",
    },
    {
      name: "Listening",
      icon: <Volume2 className="h-5 w-5" />,
      color: "indigo",
      href: "/speaking",
    },
    {
      name: "Speaking",
      icon: <Users className="h-5 w-5" />,
      color: "pink",
      href: "/speaking",
    },
    {
      name: "Writing",
      icon: <PenTool className="h-5 w-5" />,
      color: "yellow",
      href: "/writing",
    },
  ]);

  const [aiPoweredTests] = useState([
    {
      id: 1,
      title: "Reading Assessment",
      description: "Comprehension Test (Medium)",
      duration: "30 mins",
      difficulty: "Medium",
      available: true,
      module: "Reading",
    },
    {
      id: 2,
      title: "Vocabulary Mastery Test",
      description: "Word Knowledge & Usage (Easy)",
      duration: "20 mins",
      difficulty: "Easy",
      available: true,
      module: "Vocabulary",
    },
    {
      id: 3,
      title: "Speaking Evaluation",
      description: "Pronunciation & Fluency (Medium)",
      duration: "20 mins",
      difficulty: "Medium",
      available: false,
      module: "Speaking",
    },
    {
      id: 4,
      title: "Writing Challenge",
      description: "Essay Writing (Hard)",
      duration: "45 mins",
      difficulty: "Hard",
      available: false,
      module: "Writing",
    },
    {
      id: 5,
      title: "Conversation Test",
      description: "AI Chat Assessment (Medium)",
      duration: "25 mins",
      difficulty: "Medium",
      available: false,
      module: "Chat",
    },
  ]);

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "bg-green-500";
    if (progress >= 60) return "bg-blue-500";
    if (progress >= 40) return "bg-yellow-500";
    return "bg-gray-300";
  };

  const getSkillColor = (color: string) => {
    const colors = {
      orange: "text-orange-600",
      pink: "text-pink-600",
      green: "text-green-600",
      purple: "text-purple-600",
      red: "text-red-600",
      indigo: "text-indigo-600",
      yellow: "text-yellow-600",
      blue: "text-blue-600",
    };
    return colors[color as keyof typeof colors] || "text-gray-600";
  };

  const getModuleColor = (module: string) => {
    const colors = {
      Reading: "bg-orange-100 text-orange-800",
      Speaking: "bg-pink-100 text-pink-800",
      Writing: "bg-yellow-100 text-yellow-800",
      Vocabulary: "bg-purple-100 text-purple-800",
      Chat: "bg-blue-100 text-blue-800",
    };
    return colors[module as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          {user && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Welcome back,</span>
              <span className="font-semibold text-gray-900">
                {user.name || user.email}
              </span>
            </div>
          )}
        </div>

        {/* Achievement Status - Expert UI/UX Design */}
        <div className="mb-12">
          {/* Primary Achievement Focus */}
          <div className="text-center mb-8">
            {/* Achievement Message with Emotional Design */}
            <div className="space-y-3">
              <h1 className="text-2xl font-bold text-gray-900">
                {userStats.totalPoints >= 35 ? (
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-orange-600">
                    🌟 First Star Achieved! 🌟
                  </span>
                ) : (
                  <>
                    <span className="text-orange-600 font-extrabold">
                      {35 - userStats.totalPoints}
                    </span>{" "}
                    points to your first star
                  </>
                )}
              </h1>

              {/* Progress with Visual Feedback */}
              <div className="flex items-center justify-center gap-3">
                <div className="flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full shadow-sm">
                  <Trophy className="h-4 w-4 text-orange-600" />
                  <span className="text-sm font-semibold text-gray-700">
                    {userStats.totalPoints}/35
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  {Math.round((userStats.totalPoints / 35) * 100)}% complete
                </div>
              </div>
            </div>
          </div>

          {/* Secondary Stats with Card-like Design */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Level Card */}
            <div className="bg-white/40 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20 hover:bg-white/60 transition-all duration-300">
              <div className="p-2 bg-blue-100 rounded-lg w-fit mx-auto mb-2">
                <Target className="h-5 w-5 text-blue-600" />
              </div>
              <p className="text-lg font-bold text-gray-900">
                {userStats.level}
              </p>
              <p className="text-xs text-gray-600 font-medium">Current Level</p>
            </div>

            {/* Streak Card */}
            <div className="bg-white/40 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20 hover:bg-white/60 transition-all duration-300">
              <div className="p-2 bg-orange-100 rounded-lg w-fit mx-auto mb-2">
                <TrendingUp className="h-5 w-5 text-orange-600" />
              </div>
              <p className="text-lg font-bold text-gray-900">
                {userStats.streak}
              </p>
              <p className="text-xs text-gray-600 font-medium">Day Streak</p>
            </div>

            {/* Completed Card */}
            <div className="bg-white/40 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20 hover:bg-white/60 transition-all duration-300">
              <div className="p-2 bg-green-100 rounded-lg w-fit mx-auto mb-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <p className="text-lg font-bold text-gray-900">
                {userStats.completedModules}
              </p>
              <p className="text-xs text-gray-600 font-medium">Completed</p>
            </div>

            {/* Time Spent Card */}
            <div className="bg-white/40 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20 hover:bg-white/60 transition-all duration-300">
              <div className="p-2 bg-indigo-100 rounded-lg w-fit mx-auto mb-2">
                <Clock className="h-5 w-5 text-indigo-600" />
              </div>
              <p className="text-lg font-bold text-gray-900">
                {userStats.timeSpent}
              </p>
              <p className="text-xs text-gray-600 font-medium">Time Spent</p>
            </div>
          </div>
        </div>

        {/* Continue Practicing Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Continue Practicing
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {continuePracticing.map((item) => (
              <Link key={item.id} href={item.href}>
                <Card className="p-6 bg-white hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg ${getSkillColor(
                          item.color
                        )}`}
                      >
                        {item.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {item.completed}/{item.total} completed
                        </p>
                      </div>
                    </div>
                    {item.locked ? (
                      <Lock className="h-5 w-5 text-gray-400" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    )}
                  </div>

                  <div className="mb-3">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>{item.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(
                          item.progress
                        )}`}
                        style={{ width: `${item.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600">
                    {item.locked
                      ? `Unlock at ${item.pointsNeeded} points`
                      : `${
                          item.pointsNeeded - item.progress * 0.1
                        } points to next level`}
                  </p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
