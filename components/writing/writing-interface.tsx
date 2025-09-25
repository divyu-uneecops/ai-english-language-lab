"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { WritingEditor } from "./writing-editor";
import {
  FileText,
  Mail,
  Newspaper,
  Clock,
  ChevronRight,
  CheckCircle,
  Star,
  Filter,
  Trophy,
  Target,
  Brain,
  PenTool,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getDifficultyColor } from "@/lib/utils";

const writingTypes = [
  {
    id: "letter",
    title: "Letter Writing",
    description: "Personal and formal letters",
    icon: Mail,
    color: "bg-blue-500",
    difficulty: "Beginner",
    timeEstimate: "15-20 mins",
  },
  {
    id: "article",
    title: "Article Writing",
    description: "News articles and blog posts",
    icon: Newspaper,
    color: "bg-green-500",
    difficulty: "Intermediate",
    timeEstimate: "20-25 mins",
  },
  {
    id: "notice",
    title: "Notice Writing",
    description: "Official notices and announcements",
    icon: FileText,
    color: "bg-purple-500",
    difficulty: "Advanced",
    timeEstimate: "10-15 mins",
  },
];

const writingTypeOptions = [
  {
    id: "article",
    title: "Article Writing",
    description: "News articles, blog posts, and informative content",
    icon: Newspaper,
    color: "bg-green-500",
    examples: [
      "Technology trends",
      "Health tips",
      "Travel guide",
      "Product review",
    ],
  },
  {
    id: "notice",
    title: "Notice Writing",
    description: "Official notices, announcements, and formal communications",
    icon: FileText,
    color: "bg-purple-500",
    examples: [
      "School event",
      "Office meeting",
      "Public announcement",
      "Event cancellation",
    ],
  },
  {
    id: "letter",
    title: "Letter Writing",
    description: "Personal and formal letters for various purposes",
    icon: Mail,
    color: "bg-blue-500",
    examples: [
      "Job application",
      "Complaint letter",
      "Thank you letter",
      "Invitation letter",
    ],
  },
  {
    id: "essay",
    title: "Essay Writing",
    description: "Structured essays on various topics and themes",
    icon: PenTool,
    color: "bg-orange-500",
    examples: [
      "Environmental issues",
      "Education system",
      "Social media impact",
      "Future of technology",
    ],
  },
];

// Dummy data for writing prompts
const writingPrompts = [
  // Letter prompts
  {
    id: "91123966-a564-4163-9811-7769deb71428",
    category: "letter",
    context:
      "Write a letter to your best friend telling them about a new hobby you have started.",
    difficulty: "Easy",
    level: "Beginner",
    guidelines: [
      "Start with a friendly greeting.",
      "Introduce your new hobby clearly.",
      "Explain why you enjoy it and how you spend time on it.",
      "Invite your friend to try it or share their thoughts.",
    ],
  },
  {
    id: "letter-2",
    category: "letter",
    context: "Write a cover letter for your dream job application.",
    difficulty: "Medium",
    level: "Intermediate",
    guidelines: [
      "Start with a professional greeting.",
      "Introduce yourself and mention the position you're applying for.",
      "Highlight your relevant skills and experience.",
      "Express enthusiasm for the role and company.",
      "End with a professional closing.",
    ],
  },
  {
    id: "letter-3",
    category: "letter",
    context: "Write a formal complaint letter to a company about poor service.",
    difficulty: "Hard",
    level: "Advanced",
    guidelines: [
      "Use formal language and tone.",
      "Clearly state the problem and its impact.",
      "Provide specific details and evidence.",
      "Request a specific resolution.",
      "Maintain professionalism throughout.",
    ],
  },
  // Article prompts
  {
    id: "article-1",
    category: "article",
    context:
      "Write an article about a recent school sports day or cultural event.",
    difficulty: "Easy",
    level: "Beginner",
    guidelines: [
      "Start with an engaging introduction.",
      "Describe the event in chronological order.",
      "Include quotes from participants or organizers.",
      "Highlight key moments and achievements.",
      "End with a conclusion about the event's success.",
    ],
  },
  {
    id: "article-2",
    category: "article",
    context:
      "Write an article about climate change and its impact on your community.",
    difficulty: "Medium",
    level: "Intermediate",
    guidelines: [
      "Research and present factual information.",
      "Include local examples and impacts.",
      "Interview community members if possible.",
      "Suggest practical solutions.",
      "Use a balanced and informative tone.",
    ],
  },
  {
    id: "article-3",
    category: "article",
    context:
      "Write an investigative article about social media's influence on teenage mental health.",
    difficulty: "Hard",
    level: "Advanced",
    guidelines: [
      "Conduct thorough research from credible sources.",
      "Present multiple perspectives on the issue.",
      "Include statistics and expert opinions.",
      "Analyze the psychological and social implications.",
      "Provide balanced conclusions and recommendations.",
    ],
  },
  // Notice prompts
  {
    id: "notice-1",
    category: "notice",
    context:
      "Write a notice about upcoming school holidays and important dates.",
    difficulty: "Easy",
    level: "Beginner",
    guidelines: [
      "Use clear and simple language.",
      "Include all important dates and holidays.",
      "Mention any special instructions or requirements.",
      "Use bullet points for easy reading.",
      "Include contact information for questions.",
    ],
  },
  {
    id: "notice-2",
    category: "notice",
    context: "Write a notice about a community cleanup drive or social event.",
    difficulty: "Medium",
    level: "Intermediate",
    guidelines: [
      "Create an attention-grabbing headline.",
      "Provide clear event details (date, time, location).",
      "Explain the purpose and benefits of participation.",
      "Include registration or contact information.",
      "Use persuasive language to encourage attendance.",
    ],
  },
  {
    id: "notice-3",
    category: "notice",
    context: "Write a formal notice about new company policies and procedures.",
    difficulty: "Hard",
    level: "Advanced",
    guidelines: [
      "Use formal business language.",
      "Clearly explain the new policies.",
      "Provide rationale for the changes.",
      "Include implementation timeline.",
      "Specify consequences for non-compliance.",
    ],
  },
  // Essay prompts
  {
    id: "essay-1",
    category: "essay",
    context: "Write an essay about environmental issues affecting our planet.",
    difficulty: "Easy",
    level: "Beginner",
    guidelines: [
      "Choose a specific environmental issue to focus on.",
      "Start with a clear thesis statement.",
      "Provide examples and evidence to support your points.",
      "Use simple, clear language.",
      "End with a call to action or personal reflection.",
    ],
  },
  {
    id: "essay-2",
    category: "essay",
    context: "Write an essay about the impact of social media on teenagers.",
    difficulty: "Medium",
    level: "Intermediate",
    guidelines: [
      "Present both positive and negative impacts.",
      "Include relevant statistics and research.",
      "Use personal examples or case studies.",
      "Analyze the psychological and social effects.",
      "Provide balanced conclusions and recommendations.",
    ],
  },
  {
    id: "essay-3",
    category: "essay",
    context:
      "Write a critical essay analyzing the role of artificial intelligence in modern education.",
    difficulty: "Hard",
    level: "Advanced",
    guidelines: [
      "Conduct extensive research from academic sources.",
      "Present multiple theoretical perspectives.",
      "Analyze current trends and future implications.",
      "Critically evaluate benefits and limitations.",
      "Use sophisticated academic language and structure.",
    ],
  },
];

export function WritingInterface() {
  const [showLevelDialog, setShowLevelDialog] = useState<boolean>(true);
  const [selectedLevel, setSelectedLevel] = useState<
    "beginner" | "intermediate" | "advanced" | "ai" | null
  >(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<
    "easy" | "medium" | "hard" | null
  >(null);
  const [showDifficultyDialog, setShowDifficultyDialog] =
    useState<boolean>(false);
  const [selectedWritingType, setSelectedWritingType] = useState<string | null>(
    null
  );
  const [topicContext, setTopicContext] = useState<string>("");
  const [filters, setFilters] = useState({
    status: {
      solved: false,
      unsolved: false,
    },
    level: {
      beginner: false,
      intermediate: false,
      advanced: false,
    },
    difficulty: {
      easy: false,
      medium: false,
      hard: false,
    },
  });
  const [userStats] = useState({
    points: 0,
    nextStar: 35,
  });

  // Open level selection dialog on first mount
  useEffect(() => {
    setShowLevelDialog(true);
  }, []);

  const applyLevel = (
    level: "beginner" | "intermediate" | "advanced" | "ai"
  ) => {
    setSelectedLevel(level);
    setShowLevelDialog(false);

    // Always show difficulty dialog (now contains all inputs)
    setShowDifficultyDialog(true);
  };

  const applyDifficulty = (difficulty: "easy" | "medium" | "hard") => {
    setSelectedDifficulty(difficulty);
    setShowDifficultyDialog(false);
  };

  const handlePromptSelection = (prompt: any) => {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-8">
          {/* Left Section - Header and Writing Type Cards */}
          <div className="flex-1">
            {/* Header Section */}
            <div className="mb-8">
              <div className="space-y-2 mb-6">
                {/* Breadcrumb Navigation */}
                <nav className="flex items-center space-x-2 text-sm text-gray-500">
                  <Link
                    href="/dashboard"
                    className="hover:text-orange-600 transition-colors font-medium"
                  >
                    Prepare
                  </Link>
                  <ChevronRight className="h-4 w-4" />
                  <span className="text-gray-900 font-semibold">Writing</span>
                </nav>

                {/* Page Title */}
                <h1 className="text-2xl font-bold text-gray-900">
                  Writing Practice
                </h1>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="space-y-4">
              {writingPrompts.length === 0 ? (
                <div className="text-center py-16">
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20 max-w-md mx-auto">
                    <div className="p-4 bg-gradient-to-r from-gray-100 to-blue-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <PenTool className="h-8 w-8 text-gray-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No writing prompts available
                    </h3>
                    <p className="text-gray-600">
                      Check back later for new writing materials
                    </p>
                  </div>
                </div>
              ) : (
                writingPrompts.map((prompt, index) => {
                  const getIcon = (category: string) => {
                    switch (category) {
                      case "letter":
                        return Mail;
                      case "article":
                        return Newspaper;
                      case "notice":
                        return FileText;
                      case "essay":
                        return PenTool;
                      default:
                        return PenTool;
                    }
                  };

                  const getIconColor = (category: string) => {
                    switch (category) {
                      case "letter":
                        return "bg-blue-500";
                      case "article":
                        return "bg-green-500";
                      case "notice":
                        return "bg-purple-500";
                      case "essay":
                        return "bg-orange-500";
                      default:
                        return "bg-orange-500";
                    }
                  };
                  const IconComponent = getIcon(prompt.category);
                  return (
                    <Card
                      key={prompt.id}
                      className="group relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-white/20 hover:border-orange-200/50 hover:scale-[1.02]"
                      onClick={() => handlePromptSelection(prompt)}
                    >
                      {/* Gradient overlay for visual appeal */}
                      <div className="absolute inset-0 bg-gradient-to-br from-yellow-50/30 via-transparent to-orange-100/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                      <div className="relative p-6">
                        {/* Header with icon and badges */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`p-2 ${getIconColor(
                                prompt.category
                              )} rounded-full group-hover:scale-110 transition-transform duration-200`}
                            >
                              <IconComponent className="h-4 w-4 text-white" />
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge
                                variant="outline"
                                className={`text-xs font-semibold px-3 py-1 rounded-full ${
                                  prompt.difficulty === "Easy"
                                    ? "border-green-300 text-green-700 bg-green-50"
                                    : prompt.difficulty === "Medium"
                                    ? "border-yellow-300 text-yellow-700 bg-yellow-50"
                                    : "border-red-300 text-red-700 bg-red-50"
                                } shadow-sm`}
                              >
                                {prompt.difficulty}
                              </Badge>
                              <Badge
                                variant="secondary"
                                className="text-xs font-semibold px-3 py-1 rounded-full"
                              >
                                {prompt.level}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        {/* Prompt title */}
                        <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors duration-200 line-clamp-2">
                          {prompt.context}
                        </h3>

                        {/* Guidelines preview */}
                        <div className="mb-4">
                          <h4 className="text-sm font-semibold text-gray-700 mb-2">
                            Guidelines:
                          </h4>
                          <ul className="text-xs text-gray-600 space-y-1">
                            {prompt.guidelines
                              .slice(0, 2)
                              .map((guideline: string, idx: number) => (
                                <li
                                  key={idx}
                                  className="flex items-start gap-2"
                                >
                                  <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                                  <span className="line-clamp-1">
                                    {guideline}
                                  </span>
                                </li>
                              ))}
                            {prompt.guidelines.length > 2 && (
                              <li className="text-gray-500 text-xs">
                                +{prompt.guidelines.length - 2} more guidelines
                              </li>
                            )}
                          </ul>
                        </div>

                        {/* Stats and metadata */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-full">
                              <Trophy className="h-3 w-3 text-yellow-500" />
                              <span className="font-medium">Max Score: 10</span>
                            </div>

                            <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-full">
                              <Clock className="h-3 w-3 text-orange-500" />
                              <span className="font-medium">15-20 mins</span>
                            </div>
                          </div>
                        </div>

                        {/* Action button */}
                        <div className="flex justify-end">
                          <Button
                            size="sm"
                            className="px-6 py-2 text-sm font-semibold rounded-full transition-all duration-200 shadow-md hover:shadow-lg bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
                          >
                            Start Writing
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Section - User Progress Stats and Filters */}
          <div className="w-80 space-y-6">
            {/* User Progress Stats */}
            <Card className="p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20">
              <div className="text-center">
                <div className="flex items-center justify-center mb-3">
                  <div className="p-3 bg-gradient-to-r from-orange-100 to-orange-200 rounded-full">
                    <Trophy className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
                <div className="text-sm text-gray-600 mb-2 font-medium">
                  {userStats.nextStar - userStats.points} more points to get
                  your first star!
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-center space-x-4 text-sm">
                    <div className="flex items-center space-x-1 text-gray-500">
                      <PenTool className="h-4 w-4" />
                      <span className="font-semibold">Points:</span>
                      <span className="font-bold text-gray-900">
                        {userStats.points}/{userStats.nextStar}
                      </span>
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                    <div
                      className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${
                          (userStats.points / userStats.nextStar) * 100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Enhanced Filters */}
            <Card className="p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg">
                  <Filter className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Filters</h3>
              </div>

              {/* Status Filter */}
              <div className="mb-8">
                <h4 className="text-sm font-bold text-gray-800 mb-4 uppercase tracking-wide flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  STATUS
                </h4>
                <div className="space-y-3">
                  <label className="group flex items-center space-x-3 p-3 rounded-lg hover:bg-green-50 transition-all duration-200 cursor-pointer border border-transparent hover:border-green-200">
                    <input
                      type="checkbox"
                      checked={filters.status.solved}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          status: {
                            ...filters.status,
                            solved: e.target.checked,
                          },
                        })
                      }
                      className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
                    />
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-700 group-hover:text-green-700">
                        Solved
                      </span>
                    </div>
                  </label>
                  <label className="group flex items-center space-x-3 p-3 rounded-lg hover:bg-orange-50 transition-all duration-200 cursor-pointer border border-transparent hover:border-orange-200">
                    <input
                      type="checkbox"
                      checked={filters.status.unsolved}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          status: {
                            ...filters.status,
                            unsolved: e.target.checked,
                          },
                        })
                      }
                      className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500 focus:ring-2"
                    />
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-700 group-hover:text-orange-700">
                        Unsolved
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Level Filter */}
              <div className="mb-8">
                <h4 className="text-sm font-bold text-gray-800 mb-4 uppercase tracking-wide flex items-center gap-2">
                  <Brain className="h-4 w-4 text-blue-500" />
                  LEVEL
                </h4>
                <div className="space-y-3">
                  <label className="group flex items-center space-x-3 p-3 rounded-lg hover:bg-green-50 transition-all duration-200 cursor-pointer border border-transparent hover:border-green-200">
                    <input
                      type="checkbox"
                      checked={filters.level.beginner}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          level: {
                            ...filters.level,
                            beginner: e.target.checked,
                          },
                        })
                      }
                      className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
                    />
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-700 group-hover:text-green-700">
                        Beginner
                      </span>
                    </div>
                  </label>
                  <label className="group flex items-center space-x-3 p-3 rounded-lg hover:bg-yellow-50 transition-all duration-200 cursor-pointer border border-transparent hover:border-yellow-200">
                    <input
                      type="checkbox"
                      checked={filters.level.intermediate}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          level: {
                            ...filters.level,
                            intermediate: e.target.checked,
                          },
                        })
                      }
                      className="w-4 h-4 text-yellow-600 bg-gray-100 border-gray-300 rounded focus:ring-yellow-500 focus:ring-2"
                    />
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-700 group-hover:text-yellow-700">
                        Intermediate
                      </span>
                    </div>
                  </label>
                  <label className="group flex items-center space-x-3 p-3 rounded-lg hover:bg-red-50 transition-all duration-200 cursor-pointer border border-transparent hover:border-red-200">
                    <input
                      type="checkbox"
                      checked={filters.level.advanced}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          level: {
                            ...filters.level,
                            advanced: e.target.checked,
                          },
                        })
                      }
                      className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500 focus:ring-2"
                    />
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-700 group-hover:text-red-700">
                        Advanced
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Difficulty Filter */}
              <div>
                <h4 className="text-sm font-bold text-gray-800 mb-4 uppercase tracking-wide flex items-center gap-2">
                  <Target className="h-4 w-4 text-red-500" />
                  DIFFICULTY
                </h4>
                <div className="space-y-3">
                  <label className="group flex items-center space-x-3 p-3 rounded-lg hover:bg-green-50 transition-all duration-200 cursor-pointer border border-transparent hover:border-green-200">
                    <input
                      type="checkbox"
                      checked={filters.difficulty.easy}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          difficulty: {
                            ...filters.difficulty,
                            easy: e.target.checked,
                          },
                        })
                      }
                      className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
                    />
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-700 group-hover:text-green-700">
                        Easy
                      </span>
                    </div>
                  </label>
                  <label className="group flex items-center space-x-3 p-3 rounded-lg hover:bg-yellow-50 transition-all duration-200 cursor-pointer border border-transparent hover:border-yellow-200">
                    <input
                      type="checkbox"
                      checked={filters.difficulty.medium}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          difficulty: {
                            ...filters.difficulty,
                            medium: e.target.checked,
                          },
                        })
                      }
                      className="w-4 h-4 text-yellow-600 bg-gray-100 border-gray-300 rounded focus:ring-yellow-500 focus:ring-2"
                    />
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-700 group-hover:text-yellow-700">
                        Medium
                      </span>
                    </div>
                  </label>
                  <label className="group flex items-center space-x-3 p-3 rounded-lg hover:bg-red-50 transition-all duration-200 cursor-pointer border border-transparent hover:border-red-200">
                    <input
                      type="checkbox"
                      checked={filters.difficulty.hard}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          difficulty: {
                            ...filters.difficulty,
                            hard: e.target.checked,
                          },
                        })
                      }
                      className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500 focus:ring-2"
                    />
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-700 group-hover:text-red-700">
                        Hard
                      </span>
                    </div>
                  </label>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Level Selection Dialog */}
      <Dialog open={showLevelDialog} onOpenChange={setShowLevelDialog}>
        <DialogContent className="sm:max-w-lg p-0 overflow-hidden rounded-2xl shadow-2xl border-0">
          <div className="relative p-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_left,_#fff,_transparent_50%)]"></div>
            <div className="relative z-10 text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-xs font-semibold mb-3">
                <PenTool className="h-4 w-4" />
                Writing Practice
              </div>
              <DialogTitle className="text-2xl font-extrabold tracking-tight text-white">
                Choose Your Writing Level
              </DialogTitle>
              <DialogDescription className="text-white/90 text-sm mt-1">
                Pick a level to get writing exercises at that difficulty
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
                    Simple prompts, basic vocabulary
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
                    Balanced challenge and creativity
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
                    Complex topics, sophisticated writing
                  </div>
                </div>
              </button>

              <button
                className="group w-full text-left flex items-center gap-3 p-4 rounded-xl border border-blue-200 hover:border-blue-300 hover:shadow-md transition-all bg-gradient-to-br from-blue-50 to-white"
                onClick={() => applyLevel("ai")}
              >
                <div className="p-2 rounded-lg bg-blue-100 text-blue-700 group-hover:scale-110 transition-transform">
                  <Brain className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">
                    Let AI Decide
                  </div>
                  <div className="text-xs text-gray-600">
                    AI selects a suitable level and writing prompt
                  </div>
                </div>
              </button>
            </div>

            <div className="mt-5 flex items-center justify-center gap-4">
              <Button
                variant="ghost"
                className="text-gray-600 hover:text-gray-900"
                onClick={() => setShowLevelDialog(false)}
              >
                Skip for now
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Writing Configuration Dialog */}
      <Dialog
        open={showDifficultyDialog}
        onOpenChange={setShowDifficultyDialog}
      >
        <DialogContent className="sm:max-w-2xl p-0 overflow-hidden rounded-2xl shadow-2xl border-0">
          <div className="relative p-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_left,_#fff,_transparent_50%)]"></div>
            <div className="relative z-10 text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-xs font-semibold mb-3">
                <PenTool className="h-4 w-4" />
                Writing Configuration
              </div>
              <DialogTitle className="text-2xl font-extrabold tracking-tight text-white">
                Configure Your Writing Practice
              </DialogTitle>
              <DialogDescription className="text-white/90 text-sm mt-1">
                Set up your writing exercise with difficulty, type, and topic
              </DialogDescription>
            </div>
          </div>
          <div className="p-6 bg-white">
            <div className="space-y-6">
              {/* Writing Type Selection */}
              <div>
                <Label className="text-sm font-semibold text-gray-900 mb-3 block">
                  Writing Type
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  {writingTypeOptions.map((type) => {
                    const IconComponent = type.icon;
                    return (
                      <button
                        key={type.id}
                        className={`group w-full text-left flex items-center gap-3 p-3 rounded-lg border transition-all ${
                          selectedWritingType === type.id
                            ? "border-orange-300 bg-orange-50"
                            : "border-gray-200 hover:border-orange-300 hover:bg-gray-50"
                        }`}
                        onClick={() => setSelectedWritingType(type.id)}
                      >
                        <div
                          className={`p-2 rounded-lg ${type.color} text-white group-hover:scale-110 transition-transform`}
                        >
                          <IconComponent className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900 text-sm">
                            {type.title}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Difficulty Selection */}
              <div>
                <Label className="text-sm font-semibold text-gray-900 mb-3 block">
                  Difficulty Level
                </Label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    className={`group w-full text-left flex items-center gap-3 p-3 rounded-lg border transition-all ${
                      selectedDifficulty === "easy"
                        ? "border-green-300 bg-green-50"
                        : "border-gray-200 hover:border-green-300 hover:bg-gray-50"
                    }`}
                    onClick={() => setSelectedDifficulty("easy")}
                  >
                    <div className="p-2 rounded-lg bg-green-100 text-green-700 group-hover:scale-110 transition-transform">
                      <Star className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 text-sm">
                        Easy
                      </div>
                    </div>
                  </button>

                  <button
                    className={`group w-full text-left flex items-center gap-3 p-3 rounded-lg border transition-all ${
                      selectedDifficulty === "medium"
                        ? "border-yellow-300 bg-yellow-50"
                        : "border-gray-200 hover:border-yellow-300 hover:bg-gray-50"
                    }`}
                    onClick={() => setSelectedDifficulty("medium")}
                  >
                    <div className="p-2 rounded-lg bg-yellow-100 text-yellow-700 group-hover:scale-110 transition-transform">
                      <Target className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 text-sm">
                        Medium
                      </div>
                    </div>
                  </button>

                  <button
                    className={`group w-full text-left flex items-center gap-3 p-3 rounded-lg border transition-all ${
                      selectedDifficulty === "hard"
                        ? "border-red-300 bg-red-50"
                        : "border-gray-200 hover:border-red-300 hover:bg-gray-50"
                    }`}
                    onClick={() => setSelectedDifficulty("hard")}
                  >
                    <div className="p-2 rounded-lg bg-red-100 text-red-700 group-hover:scale-110 transition-transform">
                      <Trophy className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 text-sm">
                        Hard
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Topic Context Input */}
              <div>
                <Label
                  htmlFor="topic-context"
                  className="text-sm font-semibold text-gray-900 mb-3 block"
                >
                  Topic Context
                </Label>
                <Input
                  id="topic-context"
                  type="text"
                  placeholder={
                    selectedWritingType === "letter"
                      ? "e.g., I want to write a letter to my best friend about a new hobby..."
                      : selectedWritingType === "article"
                      ? "e.g., I want to write an article about a school sports day..."
                      : selectedWritingType === "notice"
                      ? "e.g., I want to write a notice about upcoming school holidays..."
                      : selectedWritingType === "essay"
                      ? "e.g., I want to write an essay about environmental issues..."
                      : "Enter what you want to write about..."
                  }
                  value={topicContext}
                  onChange={(e) => setTopicContext(e.target.value)}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-2">
                  {selectedWritingType === "letter" && (
                    <>
                      Examples: "I want to write a letter to my best friend
                      about a new hobby I started", "I want to write a cover
                      letter for my dream job application"
                    </>
                  )}
                  {selectedWritingType === "article" && (
                    <>
                      Examples: "I want to write an article about a recent
                      school sports day", "I want to write an article about
                      climate change and its impact on my community"
                    </>
                  )}
                  {selectedWritingType === "notice" && (
                    <>
                      Examples: "I want to write a notice about upcoming school
                      holidays", "I want to write a notice about a community
                      cleanup drive"
                    </>
                  )}
                  {selectedWritingType === "essay" && (
                    <>
                      Examples: "I want to write an essay about environmental
                      issues", "I want to write an essay about the impact of
                      social media on teenagers"
                    </>
                  )}
                </p>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <Button
                variant="ghost"
                className="text-gray-600 hover:text-gray-900"
                onClick={() => setShowDifficultyDialog(false)}
              >
                Back to Level Selection
              </Button>

              <Button
                onClick={() => {
                  if (
                    selectedWritingType &&
                    selectedDifficulty &&
                    topicContext.trim()
                  ) {
                    applyDifficulty(selectedDifficulty);
                  }
                }}
                disabled={
                  !selectedWritingType ||
                  !selectedDifficulty ||
                  !topicContext.trim()
                }
                className="bg-orange-600 hover:bg-orange-700 text-white px-6"
              >
                View Prompts
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
