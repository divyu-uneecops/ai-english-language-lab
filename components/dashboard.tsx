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
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";

// Mock data - in a real app, this would come from a database
const modulesData = [
  {
    id: "reading",
    title: "Reading Practice",
    description:
      "Immerse yourself in engaging stories and enhance comprehension",
    icon: BookOpen,
    color: "from-blue-500 to-cyan-500",
    hoverColor: "from-blue-600 to-cyan-600",
    bgColor: "bg-blue-50 dark:bg-blue-950/20",
    iconColor: "text-blue-600 dark:text-blue-400",
    stats: {
      completed: 2,
      total: 4,
      timeSpent: "15 min",
      difficulty: "Beginner",
    },
    features: [
      "Interactive Stories",
      "Comprehension Questions",
      "Vocabulary Building",
    ],
    href: "/reading",
  },
  {
    id: "speaking",
    title: "Speaking Practice",
    description:
      "Enhance your pronunciation and fluency with AI-powered speech exercises",
    icon: Mic,
    color: "from-green-500 to-emerald-500",
    hoverColor: "from-green-600 to-emerald-600",
    bgColor: "bg-green-50 dark:bg-green-950/20",
    iconColor: "text-green-600 dark:text-green-400",
    stats: {
      completed: 3,
      total: 6,
      timeSpent: "25 min",
      difficulty: "Intermediate",
    },
    features: ["Pronunciation Training", "Fluency Exercises", "AI Feedback"],
    href: "/speaking",
  },
  {
    id: "writing",
    title: "Writing Practice",
    description:
      "Develop your writing skills with guided exercises and AI evaluation",
    icon: PenTool,
    color: "from-purple-500 to-violet-500",
    hoverColor: "from-purple-600 to-violet-600",
    bgColor: "bg-purple-50 dark:bg-purple-950/20",
    iconColor: "text-purple-600 dark:text-purple-400",
    stats: {
      completed: 1,
      total: 5,
      timeSpent: "10 min",
      difficulty: "Beginner",
    },
    features: ["Guided Writing", "AI Evaluation", "Grammar Check"],
    href: "/writing",
  },
  {
    id: "chat",
    title: "AI Assistant",
    description: "Get instant, intelligent support for all your questions",
    icon: MessageCircle,
    color: "from-orange-500 to-red-500",
    hoverColor: "from-orange-600 to-red-600",
    bgColor: "bg-orange-50 dark:bg-orange-950/20",
    iconColor: "text-orange-600 dark:text-orange-400",
    stats: {
      completed: 0,
      total: 3,
      timeSpent: "0 min",
      difficulty: "All Levels",
    },
    features: ["24/7 AI support", "Grammar explanations", "Learning tips"],
    href: "/chat",
  },
];

const overallStats = {
  totalModules: 4,
  completedModules: 6,
  totalExercises: 18,
  timeSpent: "50 min",
  currentStreak: 5,
  averageScore: 85,
};

export function Dashboard() {
  const { user } = useAuth();

  const overallProgress = Math.round(
    (overallStats.completedModules / overallStats.totalExercises) * 100
  );

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Welcome back, {user?.name || "Student"}!
            </h1>
            <p className="text-muted-foreground mt-1">
              Continue your English learning journey
            </p>
          </div>
          <Link href="/progress">
            <Button variant="outline" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              View Progress
            </Button>
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" />
                <div>
                  <div className="text-2xl font-bold">{overallProgress}%</div>
                  <div className="text-xs text-muted-foreground">
                    Overall Progress
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-secondary" />
                <div>
                  <div className="text-2xl font-bold">
                    {overallStats.timeSpent}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Time Spent
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-accent" />
                <div>
                  <div className="text-2xl font-bold">
                    {overallStats.currentStreak}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Day Streak
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <div>
                  <div className="text-2xl font-bold">
                    {overallStats.averageScore}%
                  </div>
                  <div className="text-xs text-muted-foreground">Avg Score</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Learning Modules */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-6">Learning Modules</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {modulesData.map((module) => {
            const IconComponent = module.icon;
            const progress = Math.round(
              (module.stats.completed / module.stats.total) * 100
            );

            return (
              <Card
                key={module.id}
                className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className={`p-3 rounded-lg ${module.bgColor} mb-4`}>
                      <IconComponent
                        className={`h-6 w-6 ${module.iconColor}`}
                      />
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {module.stats.difficulty}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl mb-2">{module.title}</CardTitle>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {module.description}
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span className="font-medium">
                        {module.stats.completed}/{module.stats.total} completed
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className={`h-2 rounded-full bg-gradient-to-r ${module.color}`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Time Spent</div>
                      <div className="font-medium">
                        {module.stats.timeSpent}
                      </div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Progress</div>
                      <div className="font-medium">{progress}%</div>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Features:</div>
                    <div className="flex flex-wrap gap-1">
                      {module.features.map((feature, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs"
                        >
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Action Button */}
                  <Link href={module.href} className="block">
                    <Button
                      className={`w-full bg-gradient-to-r ${module.color} hover:${module.hoverColor} text-white font-semibold group-hover:shadow-lg transition-all duration-300`}
                    >
                      {module.stats.completed > 0 ? "Continue" : "Start"} Module
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
