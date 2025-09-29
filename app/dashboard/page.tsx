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
  });

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50 relative overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* AI-Powered Personalized Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {user && (
                <div className="flex items-center gap-4 group">
                  <div>
                    <h1 className="text-sm text-gray-600">
                      Welcome back, {user.name || user.email?.split("@")[0]}
                    </h1>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Simplified Achievement Section */}
        <div className="mb-12">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-8 text-white relative overflow-hidden">
            {/* Simple Background Element */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>

            <div className="relative z-10">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                {/* Achievement Content */}
                <div className="flex-1 text-center lg:text-left">
                  <div className="flex items-center justify-center lg:justify-start gap-4 mb-6">
                    <div className="p-3 bg-white/20 rounded-xl">
                      <Star className="h-8 w-8 text-yellow-300" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold mb-2">
                        {userStats.totalPoints >= 35 ? (
                          "🌟 First Star Achieved! 🌟"
                        ) : (
                          <>
                            <span className="text-yellow-300 font-bold text-3xl">
                              {35 - userStats.totalPoints}
                            </span>{" "}
                            <span className="text-lg">
                              points to your first star
                            </span>
                          </>
                        )}
                      </h2>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full max-w-md mx-auto lg:mx-0">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-orange-100">Progress</span>
                      <span className="text-sm font-bold text-yellow-300">
                        {userStats.totalPoints}/35
                      </span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-yellow-300 to-yellow-400 h-3 rounded-full transition-all duration-1000"
                        style={{
                          width: `${Math.min(
                            (userStats.totalPoints / 35) * 100,
                            100
                          )}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white/10 rounded-xl p-4 text-center">
                    <Target className="h-5 w-5 text-white mx-auto mb-2" />
                    <p className="text-lg font-bold">{userStats.level}</p>
                    <p className="text-xs text-orange-100">Level</p>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4 text-center">
                    <TrendingUp className="h-5 w-5 text-white mx-auto mb-2" />
                    <p className="text-lg font-bold">{userStats.streak}</p>
                    <p className="text-xs text-orange-100">Streak</p>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4 text-center">
                    <CheckCircle className="h-5 w-5 text-white mx-auto mb-2" />
                    <p className="text-lg font-bold">
                      {userStats.completedModules}
                    </p>
                    <p className="text-xs text-orange-100">Done</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI-Powered Learning Modules Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
                Continue Learning
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {continuePracticing.map((item, index) => (
              <Link key={item.id} href={item.href}>
                <div className="group relative bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/20 hover:border-orange-200/50 cursor-pointer hover:scale-[1.02]">
                  {/* Enhanced Header */}
                  <div className="relative z-10 flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div
                          className={`p-4 rounded-2xl ${getSkillColor(
                            item.color
                          )} bg-opacity-10 group-hover:scale-110 transition-all duration-300`}
                        >
                          {item.icon}
                        </div>
                        <div className="absolute -inset-1 bg-gradient-to-r from-orange-200/20 to-yellow-200/20 rounded-2xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-xl group-hover:text-orange-600 transition-colors mb-1">
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {item.completed}/{item.total} lessons completed
                        </p>
                      </div>
                    </div>
                    <div className="p-2 bg-gray-100 rounded-full group-hover:bg-orange-100 transition-colors">
                      <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-orange-500 transition-colors" />
                    </div>
                  </div>

                  {/* Enhanced Progress Section */}
                  <div className="relative z-10 mb-6">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm font-semibold text-gray-700">
                        Progress
                      </span>
                      <span className="text-lg font-bold text-gray-900">
                        {item.progress}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 relative overflow-hidden">
                      <div
                        className={`h-3 rounded-full transition-all duration-700 ease-out relative ${getProgressColor(
                          item.progress
                        )}`}
                        style={{ width: `${item.progress}%` }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-pulse"></div>
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Footer */}
                  <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
                        <span className="text-xs font-medium text-gray-600">
                          {item.locked
                            ? `Unlock at ${item.pointsNeeded} points`
                            : `${Math.max(
                                0,
                                item.pointsNeeded -
                                  Math.floor(item.progress * 0.1)
                              )} points to next level`}
                        </span>
                      </div>
                    </div>
                    <div className="px-3 py-1 bg-gray-100 rounded-full group-hover:bg-orange-100 transition-colors">
                      <span className="text-xs font-semibold text-gray-600 group-hover:text-orange-600">
                        {item.progress > 0 ? "In Progress" : "Not Started"}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
