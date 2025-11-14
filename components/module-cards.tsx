"use client";

import { Button } from "@/components/ui/button";
import { BookOpen, Mic, MessageCircle, PenTool, Play } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { useState } from "react";

export function ModuleCards() {
  const { user } = useAuth();
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const modules = [
    {
      icon: BookOpen,
      title: "Reading Practice",
      description:
        "Immerse yourself in engaging stories and enhance comprehension",
      features: [
        "Interactive Stories",
        "Comprehension Questions",
        "Vocabulary building",
      ],
      href: "/reading",
      buttonText: "Start Reading",
      variant: "default" as const,
      gradient: "from-orange-400 to-orange-500",
      color: "orange",
    },
    {
      icon: Mic,
      title: "Speaking Practice",
      description:
        "Enhance your pronunciation and fluency with AI-powered speech exercises",
      features: ["Pronunciation Training", "Fluency Exercises", "AI Feedback"],
      href: "/speaking",
      buttonText: "Start Speaking",
      variant: "secondary" as const,
      gradient: "from-pink-400 to-pink-500",
      color: "pink",
    },
    {
      icon: PenTool,
      title: "Writing Practice",
      description:
        "Develop your writing skills with guided exercises and AI evaluation",
      features: ["Guided Writing", "Grammar Check", "AI Evaluation"],
      href: "/writing",
      buttonText: "Start Writing",
      variant: "outline" as const,
      gradient: "from-yellow-400 to-orange-400",
      color: "yellow",
    },
    {
      icon: MessageCircle,
      title: "AI Assistant",
      description: "Get instant, intelligent support for all your questions",
      features: [
        "24/7 AI support",
        "Grammar explanations",
        "Vocabulary help",
        "Learning tips",
      ],
      href: "/chat",
      buttonText: "Chat with AI",
      variant: "outline" as const,
      gradient: "from-orange-400 to-pink-400",
      color: "blue",
    },
  ];

  const ModuleCard = ({ module, index }: { module: any; index: number }) => (
    <div
      className="group relative overflow-hidden bg-white rounded-3xl transition-all duration-700 ease-out shadow-lg border border-gray-200 h-full"
      onMouseEnter={() => setHoveredCard(index)}
      onMouseLeave={() => setHoveredCard(null)}
    >
      {/* Gradient Background */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${
          module.color === "orange"
            ? "from-orange-50 to-orange-100"
            : module.color === "pink"
            ? "from-pink-50 to-pink-100"
            : module.color === "yellow"
            ? "from-yellow-50 to-yellow-100"
            : "from-blue-50 to-blue-100"
        } opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
      />

      {/* Content */}
      <div className="relative p-8 h-full flex flex-col">
        {/* Icon */}
        <div
          className={`w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br ${
            module.color === "orange"
              ? "from-orange-100 to-orange-200"
              : module.color === "pink"
              ? "from-pink-100 to-pink-200"
              : module.color === "yellow"
              ? "from-yellow-100 to-yellow-200"
              : "from-blue-100 to-blue-200"
          } flex items-center justify-center group-hover:scale-110 transition-all duration-500 shadow-md`}
        >
          <module.icon
            className={`h-8 w-8 ${
              module.color === "orange"
                ? "text-orange-600"
                : module.color === "pink"
                ? "text-pink-600"
                : module.color === "yellow"
                ? "text-yellow-600"
                : "text-blue-600"
            }`}
          />
        </div>

        {/* Title and Description */}
        <div className="flex-1">
          <h3
            className={`text-xl font-bold mb-3 transition-colors duration-300 text-slate-800 ${
              hoveredCard === index
                ? module.color === "orange"
                  ? "text-orange-600"
                  : module.color === "pink"
                  ? "text-pink-600"
                  : module.color === "yellow"
                  ? "text-yellow-600"
                  : "text-blue-600"
                : ""
            }`}
          >
            {module.title}
          </h3>
          <p className="text-slate-600 text-sm leading-relaxed mb-4">
            {module.description}
          </p>

          {/* Features */}
          <ul className="space-y-2 mb-6">
            {module?.features?.map((feature: string, idx: number) => (
              <li
                key={idx}
                className="flex items-center gap-2 text-xs text-slate-500"
              >
                <div
                  className={`w-1.5 h-1.5 rounded-full ${
                    module.color === "orange"
                      ? "bg-orange-400"
                      : module.color === "pink"
                      ? "bg-pink-400"
                      : module.color === "yellow"
                      ? "bg-yellow-400"
                      : "bg-blue-400"
                  }`}
                />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* Button */}
        {user && (
          <Link href={module?.href}>
            <Button
              className={`w-full py-2.5 text-sm font-semibold transition-all duration-300 ${
                module.variant === "default"
                  ? `bg-gradient-to-r ${module.gradient} hover:shadow-lg text-white border-0`
                  : module.variant === "secondary"
                  ? `bg-${module.color}-100 hover:bg-${module.color}-200 text-${module.color}-700 border border-${module.color}-200`
                  : `bg-transparent hover:bg-${module.color}-50 text-${module.color}-600 border border-${module.color}-200`
              }`}
            >
              <Play className="h-3 w-3 mr-2" />
              {module?.buttonText}
            </Button>
          </Link>
        )}
      </div>
    </div>
  );

  return (
    <section className="pt-8 pb-24 px-4 relative overflow-hidden bg-white">
      <style jsx>{`
        @keyframes gradient {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease-in-out infinite;
        }
        .bg-size-200 {
          background-size: 200% 200%;
        }
      `}</style>
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 bg-white" />

      {/* Enhanced Floating Elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-r from-orange-400/8 to-pink-400/8 rounded-full blur-2xl floating-element animate-pulse" />
      <div className="absolute top-20 right-20 w-24 h-24 bg-gradient-to-r from-yellow-400/10 to-orange-400/10 rounded-full blur-xl floating-element" />
      <div
        className="absolute bottom-20 left-20 w-40 h-40 bg-gradient-to-r from-pink-400/6 to-orange-400/6 rounded-full blur-3xl floating-element"
        style={{ animationDelay: "1s" }}
      />
      <div
        className="absolute bottom-32 right-16 w-28 h-28 bg-gradient-to-r from-orange-400/8 to-yellow-400/8 rounded-full blur-2xl floating-element"
        style={{ animationDelay: "2.5s" }}
      />

      <div className="relative max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="relative inline-flex items-center gap-3 px-5 py-3 rounded-full bg-white border border-orange-200 mb-6 hover:border-orange-300 transition-all duration-300 shadow-sm hover:shadow-md group overflow-hidden">
            {/* Animated background glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-orange-50/50 via-pink-50/50 to-yellow-50/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            {/* Moving sparkle dots */}
            <div
              className="absolute top-1 left-4 w-1 h-1 bg-orange-400 rounded-full animate-ping"
              style={{ animationDuration: "2s", animationDelay: "0s" }}
            ></div>
            <div
              className="absolute bottom-1 right-6 w-1 h-1 bg-pink-400 rounded-full animate-ping"
              style={{ animationDuration: "1.5s", animationDelay: "0.7s" }}
            ></div>
            <div
              className="absolute top-2 right-4 w-0.5 h-0.5 bg-yellow-400 rounded-full animate-pulse"
              style={{ animationDuration: "1.8s", animationDelay: "1.2s" }}
            ></div>

            {/* Floating sparkle emoji with gentle movement */}
            <span
              className="text-sm animate-bounce relative z-10"
              style={{ animationDuration: "3s" }}
            >
              ✨
            </span>

            {/* Text with subtle gradient animation */}
            <span className="text-sm font-medium bg-gradient-to-r from-orange-600 via-pink-600 to-orange-600 bg-clip-text text-transparent bg-size-200 animate-gradient relative z-10">
              Choose Your Learning Path
            </span>

            {/* Trailing sparkle with delayed animation */}
            <span
              className="text-sm animate-pulse relative z-10"
              style={{ animationDuration: "2.5s", animationDelay: "0.5s" }}
            >
              ✨
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-3 leading-tight bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            Learning Modules
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full mx-auto mb-4"></div>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-snug font-medium">
            {user
              ? "Continue your English learning journey with our AI-powered modules designed to enhance your skills"
              : "Sign in to unlock all learning modules and start your personalized English learning experience"}
          </p>
        </div>

        {/* Cards Grid */}
        <div className="max-w-7xl mx-auto mt-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {modules?.map((module, index) => (
              <ModuleCard key={index} module={module} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
