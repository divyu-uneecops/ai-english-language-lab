"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Mic,
  PenTool,
  MessageCircle,
  TrendingUp,
  Target,
  Clock,
  Star,
  ArrowRight,
  BookMarked,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";

// Mock data - in a real app, this would come from a database
const modulesData = [
  {
    id: "reading",
    title: "Reading Practice",
    description: "Interactive stories and comprehension exercises",
    icon: BookOpen,
    stats: {
      completed: 2,
      total: 4,
      timeSpent: "15 min",
    },
    href: "/reading",
  },
  {
    id: "vocabulary",
    title: "Vocabulary Practice",
    description: "Interactive vocabulary learning and quizzes",
    icon: BookMarked,
    stats: {
      completed: 1,
      total: 3,
      timeSpent: "12 min",
    },
    href: "/vocabulary",
  },
  // {
  //   id: "speaking",
  //   title: "Speaking Practice",
  //   description: "AI-powered pronunciation and fluency training",
  //   icon: Mic,
  //   stats: {
  //     completed: 3,
  //     total: 6,
  //     timeSpent: "25 min",
  //   },
  //   href: "/speaking",
  // },
  {
    id: "writing",
    title: "Writing Practice",
    description: "Guided writing with AI evaluation",
    icon: PenTool,
    stats: {
      completed: 1,
      total: 5,
      timeSpent: "10 min",
    },
    href: "/writing",
  },
  {
    id: "chat",
    title: "AI Chat Practice",
    description: "Conversational practice with AI assistant",
    icon: MessageCircle,
    stats: {
      completed: 0,
      total: 3,
      timeSpent: "0 min",
    },
    href: "/chat",
  },
];

const overallStats = {
  totalModules: 5,
  completedModules: 7,
  totalExercises: 21,
  timeSpent: "62 min",
  currentStreak: 5,
  averageScore: 85,
};

export function Dashboard() {
  const { user } = useAuth();

  const overallProgress = Math.round(
    (overallStats?.completedModules / overallStats?.totalExercises) * 100
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Professional Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-1">
                Dashboard
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Welcome back, {user?.name || "Student"}
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                Overall Progress
              </div>
              <div className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                {overallProgress}%
              </div>
            </div>
          </div>

          {/* Professional Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="border border-gray-200 dark:border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Overall Progress
                    </p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                      {overallProgress}%
                    </p>
                  </div>
                  <div className="p-2 rounded-md bg-blue-50 dark:bg-blue-950/30">
                    <Target className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <div className="mt-3 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                  <div
                    className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${overallProgress}%` }}
                  ></div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 dark:border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Time Spent
                    </p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                      {overallStats.timeSpent}
                    </p>
                  </div>
                  <div className="p-2 rounded-md bg-green-50 dark:bg-green-950/30">
                    <Clock className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                  This week
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 dark:border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Current Streak
                    </p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                      {overallStats.currentStreak} days
                    </p>
                  </div>
                  <div className="p-2 rounded-md bg-purple-50 dark:bg-purple-950/30">
                    <Star className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
                <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                  Keep it up!
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 dark:border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Average Score
                    </p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                      {overallStats.averageScore}%
                    </p>
                  </div>
                  <div className="p-2 rounded-md bg-orange-50 dark:bg-orange-950/30">
                    <TrendingUp className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                  </div>
                </div>
                <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                  Across all modules
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Professional Learning Modules */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Learning Modules
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {modulesData.map((module) => {
              const IconComponent = module.icon;
              const progress = Math.round(
                (module.stats.completed / module.stats.total) * 100
              );

              return (
                <Card
                  key={module.id}
                  className="border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-md bg-gray-100 dark:bg-gray-800">
                          <IconComponent className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                            {module.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {module.description}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {/* Progress */}
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-600 dark:text-gray-400">
                            Progress
                          </span>
                          <span className="font-medium text-gray-900 dark:text-gray-100">
                            {module.stats.completed}/{module.stats.total}{" "}
                            completed
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="h-2 rounded-full bg-blue-600 transition-all duration-300"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="flex justify-between text-sm">
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">
                            Time:{" "}
                          </span>
                          <span className="font-medium text-gray-900 dark:text-gray-100">
                            {module.stats.timeSpent}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">
                            Progress:{" "}
                          </span>
                          <span className="font-medium text-gray-900 dark:text-gray-100">
                            {progress}%
                          </span>
                        </div>
                      </div>

                      {/* Action Button */}
                      <Link href={module.href} className="block">
                        <Button className="w-full" size="sm">
                          {module.stats.completed > 0 ? "Continue" : "Start"}{" "}
                          Module
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
