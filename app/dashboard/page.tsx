"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Star,
  Target,
  TrendingUp,
  ChevronRight,
  CheckCircle,
  FileText,
  Mic,
  PenTool,
  BookMarked,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import {
  dashboardService,
  type DashboardSubmissionCounts,
} from "@/services/dashboardService";

export default function EnglishLearningDashboard() {
  const { user } = useAuth();

  const [userStats] = useState({
    streak: 7,
    completedModules: 12,
  });

  const [submissionCounts, setSubmissionCounts] =
    useState<DashboardSubmissionCounts>({
      reading: 0,
      writing: 0,
      speaking: 0,
    });
  const [isLoadingSubmissions, setIsLoadingSubmissions] = useState(true);

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
      type: "reading",
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
      href: "/speaking",
      type: "speaking",
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
      type: "writing",
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
      type: "vocabulary",
    },
  ]);

  useEffect(() => {
    fetchSubmissionCounts();
  }, []);

  const fetchSubmissionCounts = async () => {
    setIsLoadingSubmissions(true);
    try {
      const counts = await dashboardService.fetchSubmissions();

      setSubmissionCounts({
        reading: counts?.reading ?? 0,
        writing: counts?.writing ?? 0,
        speaking: counts?.speaking ?? 0,
      });
    } catch (error) {
      console.error("Error fetching submission counts:", error);
      setSubmissionCounts({
        reading: 0,
        writing: 0,
        speaking: 0,
      });
    } finally {
      setIsLoadingSubmissions(false);
    }
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
            <Link href="/submissions">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-200/80 text-gray-700 font-medium rounded-lg shadow-sm hover:shadow-md hover:bg-white hover:border-orange-200 hover:text-orange-600 transition-all duration-200 group cursor-pointer"
              >
                <div className="relative">
                  <FileText className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5" />
                  <div className="absolute inset-0 bg-orange-500/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                </div>
                <span className="relative">
                  View Submissions
                  <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-orange-500 to-orange-600 group-hover:w-full transition-all duration-300 ease-out"></span>
                </span>
                <ChevronRight className="h-3.5 w-3.5 opacity-0 -ml-1 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200" />
              </Button>
            </Link>
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
                        🌟 First Star Achieved! 🌟
                      </h2>
                    </div>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="flex items-center gap-4">
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
            {continuePracticing.map((item, index) => {
              const getSubmissionText = () => {
                if (isLoadingSubmissions) return "Loading...";
                if (item.type === "vocabulary")
                  return `${item.completed} completed`;
                const count =
                  submissionCounts[
                    item.type as keyof typeof submissionCounts
                  ] || 0;
                return `${count} submission${count !== 1 ? "s" : ""}`;
              };

              return (
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
                          <div className="flex items-center gap-2 mt-1">
                            <FileText className="h-3.5 w-3.5 text-gray-500" />
                            <span
                              className={`text-sm ${
                                isLoadingSubmissions
                                  ? "text-gray-400"
                                  : "text-gray-600"
                              }`}
                            >
                              {getSubmissionText()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="p-2 bg-gray-100 rounded-full group-hover:bg-orange-100 transition-colors">
                        <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-orange-500 transition-colors" />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
