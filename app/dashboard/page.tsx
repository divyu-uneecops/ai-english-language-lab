"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Star,
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
      icon: <BookOpen className="h-8 w-8" />,
      color: "orange",
      href: "/reading",
      type: "reading",
    },
    {
      id: 2,
      title: "Speaking Practice",
      icon: <Mic className="h-8 w-8" />,
      color: "pink",
      href: "/speaking",
      type: "speaking",
    },
    {
      id: 3,
      title: "Writing Practice",
      icon: <PenTool className="h-8 w-8" />,
      color: "yellow",
      href: "/writing",
      type: "writing",
    },
    {
      id: 4,
      title: "Vocabulary Practice",
      icon: <BookMarked className="h-8 w-8" />,
      color: "purple",
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-orange-50/40 relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgb(0 0 0) 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }}
      ></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Refined Header */}
        <div className="mb-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
            <div className="flex items-center gap-4">
              {user && (
                <div className="space-y-1">
                  <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent">
                    Welcome back, {user?.name || user?.email?.split("@")[0]}
                  </h1>
                </div>
              )}
            </div>
            <Link href="/submissions" prefetch>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl shadow-sm hover:shadow-md hover:bg-gradient-to-r hover:from-orange-500 hover:to-orange-600 hover:border-orange-500 hover:text-white transition-all duration-300 group cursor-pointer"
              >
                <FileText className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                <span>View Submissions</span>
                <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Overview - Modern Card Design */}
        <div className="mb-7">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
            {/* Streak Card */}
            <div className="group relative bg-white rounded-2xl p-6 border border-gray-200/60 hover:border-orange-300/60 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 via-transparent to-yellow-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-orange-200/20 to-yellow-200/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>

              <div className="relative z-10 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-3 bg-gradient-to-br from-orange-100 to-orange-50 rounded-xl group-hover:scale-110 transition-transform duration-300">
                    <TrendingUp className="h-5 w-5 text-orange-600" />
                  </div>
                  <CheckCircle className="h-4 w-4 text-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-900 mb-1">
                    {userStats?.streak}
                  </p>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Day Streak
                  </p>
                </div>
              </div>
            </div>

            {/* Reading Card */}
            <div className="group relative bg-white rounded-2xl p-6 border border-gray-200/60 hover:border-blue-300/60 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-cyan-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-blue-200/20 to-cyan-200/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>

              <div className="relative z-10 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl group-hover:scale-110 transition-transform duration-300">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                  </div>
                  <CheckCircle className="h-4 w-4 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-900 mb-1">
                    {isLoadingSubmissions ? "..." : submissionCounts?.reading}
                  </p>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {`Submission${submissionCounts?.reading !== 1 ? "s" : ""}`}
                  </p>
                </div>
              </div>
            </div>

            {/* Speaking Card */}
            <div className="group relative bg-white rounded-2xl p-6 border border-gray-200/60 hover:border-pink-300/60 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-50/50 via-transparent to-rose-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-pink-200/20 to-rose-200/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>

              <div className="relative z-10 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-3 bg-gradient-to-br from-pink-100 to-pink-50 rounded-xl group-hover:scale-110 transition-transform duration-300">
                    <Mic className="h-5 w-5 text-pink-600" />
                  </div>
                  <CheckCircle className="h-4 w-4 text-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-900 mb-1">
                    {isLoadingSubmissions ? "..." : submissionCounts?.speaking}
                  </p>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {`Submission${submissionCounts?.speaking !== 1 ? "s" : ""}`}
                  </p>
                </div>
              </div>
            </div>

            {/* Writing Card */}
            <div className="group relative bg-white rounded-2xl p-6 border border-gray-200/60 hover:border-green-300/60 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 via-transparent to-emerald-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-green-200/20 to-emerald-200/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>

              <div className="relative z-10 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-3 bg-gradient-to-br from-green-100 to-green-50 rounded-xl group-hover:scale-110 transition-transform duration-300">
                    <PenTool className="h-5 w-5 text-green-600" />
                  </div>
                  <CheckCircle className="h-4 w-4 text-green-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-900 mb-1">
                    {isLoadingSubmissions ? "..." : submissionCounts?.writing}
                  </p>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {`Submission${submissionCounts?.writing !== 1 ? "s" : ""}`}
                  </p>
                </div>
              </div>
            </div>

            {/* Vocabulary Card */}
            <div className="group relative bg-white rounded-2xl p-6 border border-gray-200/60 hover:border-purple-300/60 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 via-transparent to-violet-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-purple-200/20 to-violet-200/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>

              <div className="relative z-10 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-3 bg-gradient-to-br from-purple-100 to-purple-50 rounded-xl group-hover:scale-110 transition-transform duration-300">
                    <BookMarked className="h-5 w-5 text-purple-600" />
                  </div>
                  <CheckCircle className="h-4 w-4 text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-900 mb-1">
                    {isLoadingSubmissions ? "..." : 15}
                  </p>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vocabulary
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Learning Modules - Premium Card Design */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8 sm:mb-10">
            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Practice Areas
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {continuePracticing?.map((item: any, index: number) => {
              const colorSchemes = {
                orange: {
                  bg: "from-orange-50/80 to-orange-100/50",
                  hoverBg:
                    "group-hover:from-orange-100/90 group-hover:to-orange-200/60",
                  border: "border-orange-200/40 hover:border-orange-300",
                  iconBg: "bg-gradient-to-br from-orange-500 to-orange-600",
                  glow: "from-orange-400/30 via-orange-300/20 to-orange-200/10",
                  button:
                    "from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700",
                },
                pink: {
                  bg: "from-pink-50/80 to-pink-100/50",
                  hoverBg:
                    "group-hover:from-pink-100/90 group-hover:to-pink-200/60",
                  border: "border-pink-200/40 hover:border-pink-300",
                  iconBg: "bg-gradient-to-br from-pink-500 to-pink-600",
                  glow: "from-pink-400/30 via-pink-300/20 to-pink-200/10",
                  button:
                    "from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700",
                },
                yellow: {
                  bg: "from-yellow-50/80 to-yellow-100/50",
                  hoverBg:
                    "group-hover:from-yellow-100/90 group-hover:to-yellow-200/60",
                  border: "border-yellow-200/40 hover:border-yellow-300",
                  iconBg: "bg-gradient-to-br from-yellow-500 to-yellow-600",
                  glow: "from-yellow-400/30 via-yellow-300/20 to-yellow-200/10",
                  button:
                    "from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700",
                },
                purple: {
                  bg: "from-purple-50/80 to-purple-100/50",
                  hoverBg:
                    "group-hover:from-purple-100/90 group-hover:to-purple-200/60",
                  border: "border-purple-200/40 hover:border-purple-300",
                  iconBg: "bg-gradient-to-br from-purple-500 to-purple-600",
                  glow: "from-purple-400/30 via-purple-300/20 to-purple-200/10",
                  button:
                    "from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700",
                },
              };

              const scheme =
                colorSchemes[item?.color as keyof typeof colorSchemes] ||
                colorSchemes.orange;

              return (
                <Link
                  key={item?.id}
                  href={item?.href}
                  prefetch
                  className="group relative block"
                  style={{ textDecoration: "none" }}
                >
                  <div
                    className={`relative bg-gradient-to-br ${scheme.bg} ${scheme.hoverBg} rounded-2xl p-8 border ${scheme.border} shadow-sm hover:shadow-2xl transition-all duration-500 min-h-[280px] flex flex-col overflow-hidden`}
                  >
                    {/* Animated glow on hover */}
                    <div
                      className={`absolute -inset-1 bg-gradient-to-br ${scheme.glow} rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500 -z-10`}
                    ></div>

                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/30 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/20 rounded-full translate-y-12 -translate-x-12 group-hover:scale-150 transition-transform duration-700"></div>

                    {/* Arrow indicator */}
                    <div className="absolute top-6 right-6 p-2 bg-white/60 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
                      <ChevronRight className="h-4 w-4 text-gray-700" />
                    </div>

                    {/* Content */}
                    <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center space-y-6">
                      {/* Icon */}
                      <div className="relative">
                        <div
                          className={`${scheme.iconBg} p-5 rounded-2xl shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}
                        >
                          <div className="text-white">{item?.icon}</div>
                        </div>
                        {/* Icon glow */}
                        <div
                          className={`absolute inset-0 bg-gradient-to-br ${scheme.glow} rounded-2xl blur-xl opacity-0 group-hover:opacity-80 transition-opacity duration-500`}
                        ></div>
                      </div>

                      {/* Title */}
                      <div className="space-y-2">
                        <h3 className="font-bold text-gray-900 text-xl tracking-tight">
                          {item?.title}
                        </h3>
                        <div className="h-0.5 w-12 mx-auto bg-gradient-to-r from-transparent via-gray-300 to-transparent group-hover:w-20 transition-all duration-500"></div>
                      </div>
                    </div>

                    {/* Action button */}
                    <div className="relative z-10 mt-6">
                      <div
                        className={`w-full bg-gradient-to-r ${scheme.button} text-white font-semibold py-3 px-6 rounded-xl shadow-md group-hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2`}
                      >
                        <span>Start Practice</span>
                        <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
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
