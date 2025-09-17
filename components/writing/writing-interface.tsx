"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WritingEditor } from "./writing-editor";
import { WritingPrompts } from "./writing-prompts";
import {
  FileText,
  Mail,
  Newspaper,
  Clock,
  ChevronRight,
  MessageCircle,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";

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

export function WritingInterface() {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedPrompt, setSelectedPrompt] = useState<any>(null);
  const [isWriting, setIsWriting] = useState(false);

  const handleStartWriting = (prompt: any) => {
    setSelectedPrompt(prompt);
    setIsWriting(true);
  };

  const handleBackToSelection = () => {
    setIsWriting(false);
    setSelectedPrompt(null);
    setSelectedType(null);
  };

  if (isWriting && selectedPrompt && selectedType) {
    return (
      <WritingEditor
        prompt={selectedPrompt}
        writingType={selectedType}
        onBack={handleBackToSelection}
      />
    );
  }

  if (selectedType) {
    return (
      <WritingPrompts
        writingType={selectedType}
        onBack={() => setSelectedType(null)}
        onStartWriting={handleStartWriting}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Modern Ed-Tech Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <div className="space-y-4">
              <nav className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <Link
                  href="/dashboard"
                  className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                >
                  Dashboard
                </Link>
                <span>/</span>
                <span className="text-gray-900 dark:text-gray-100 font-medium">
                  Writing
                </span>
              </nav>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  Writing Practice
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Improve your writing skills with AI-powered feedback and
                  structured exercises
                </p>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                Progress
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                3 / 12
              </div>
              <div className="text-xs text-gray-400 dark:text-gray-500">
                Exercises completed
              </div>
            </div>
          </div>
        </div>

        {/* Modern Content Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Writing Types
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Choose a writing type to start practicing
              </p>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {writingTypes.length} types available
            </div>
          </div>

          {/* Modern Writing Types Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {writingTypes.map((type) => {
              const IconComponent = type.icon;
              return (
                <div
                  key={type?.id}
                  className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md"
                  onClick={() => setSelectedType(type?.id)}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <div
                            className={`w-12 h-12 ${type?.color} rounded-lg flex items-center justify-center`}
                          >
                            <IconComponent className="h-6 w-6 text-white" />
                          </div>
                          <Badge
                            variant="secondary"
                            className={`text-xs font-medium ${
                              type?.difficulty === "Beginner"
                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border border-green-200 dark:border-green-800"
                                : type?.difficulty === "Intermediate"
                                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800"
                                : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border border-red-200 dark:border-red-800"
                            }`}
                          >
                            {type?.difficulty}
                          </Badge>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 leading-tight">
                          {type?.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                          {type?.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{type?.timeEstimate}</span>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        Start
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modern How It Works */}
        <div className="mt-16 pt-12 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              How It Works
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Simple steps to improve your writing skills with AI assistance
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                1. Choose a Topic
              </h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                Select from various writing prompts and topics tailored to your
                skill level.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <MessageCircle className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                2. Write Your Response
              </h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                Practice writing with our guided editor and real-time feedback
                tools.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                3. Get AI Feedback
              </h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                Receive detailed feedback on grammar, style, and structure to
                improve your writing.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
