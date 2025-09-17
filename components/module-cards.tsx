"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Mic,
  MessageCircle,
  PenTool,
  ArrowRight,
  Lock,
  Sparkles,
  Star,
  Zap,
  Play,
  TrendingUp,
  Award,
  BookMarked,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { useState } from "react";

export function ModuleCards() {
  const { user } = useAuth();
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const ModuleCard = ({
    icon: Icon,
    title,
    description,
    features,
    href,
    buttonText,
    variant = "default",
    gradient,
    isPopular = false,
    delay = 0,
    index,
  }: {
    icon: any;
    title: string;
    description: string;
    features: string[];
    href: string;
    buttonText: string;
    variant?: "default" | "secondary" | "outline";
    gradient: string;
    isPopular?: boolean;
    delay?: number;
    index: number;
  }) => (
    <div
      className="group relative premium-card rounded-3xl p-8 hover-lift overflow-hidden bg-white dark:bg-slate-800/60 border border-gray-200 dark:border-slate-700"
      style={{
        animationDelay: `${delay}ms`,
        transform:
          hoveredCard === index
            ? "translateY(-8px) scale(1.02)"
            : "translateY(0) scale(1)",
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
      onMouseEnter={() => setHoveredCard(index)}
      onMouseLeave={() => setHoveredCard(null)}
    >
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/50 dark:from-white/10 dark:via-transparent dark:to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(37,99,235,0.05)_0%,transparent_70%)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/60 dark:bg-white/40 rounded-full particle-effect"
            style={{
              left: `${20 + i * 30}%`,
              top: `${20 + i * 20}%`,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        {/* Icon with 3D Effect */}
        <div className="w-20 h-20 mb-6 rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100 dark:from-white/20 dark:to-white/10 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 border border-blue-200 dark:border-white/30">
          <Icon className="h-10 w-10 text-blue-600 dark:text-white drop-shadow-lg" />
        </div>

        {/* Content */}
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-glow transition-all duration-300">
            {title}
          </h3>
          <p className="text-slate-600 dark:text-white/80 leading-relaxed mb-4 text-base">
            {description}
          </p>

          <ul className="space-y-3">
            {features.map((feature, index) => (
              <li
                key={index}
                className="flex items-center gap-3 text-sm text-slate-500 dark:text-white/70 group-hover:text-slate-700 dark:group-hover:text-white/90 transition-colors duration-300"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-white/60 flex-shrink-0 group-hover:scale-125 transition-transform duration-300" />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* Button */}
        {user && (
          <Link href={href}>
            <Button
              variant={variant}
              className={`w-full py-3 font-bold text-sm transition-all duration-500 group-hover:scale-105 ${
                variant === "default"
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl"
                  : variant === "secondary"
                  ? "bg-blue-100 hover:bg-blue-200 text-blue-700 border border-blue-200 hover:border-blue-300"
                  : "bg-transparent hover:bg-blue-50 text-blue-600 border-2 border-blue-200 hover:border-blue-300"
              }`}
            >
              <Play className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
              {buttonText}
              <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
          </Link>
        )}
      </div>

      {/* Shimmer Effect */}
      <div className="absolute inset-0 -top-10 -left-10 w-20 h-20 bg-gradient-to-r from-transparent via-blue-200/40 dark:via-white/20 to-transparent rotate-45 opacity-0 group-hover:opacity-100 group-hover:animate-shimmer transition-opacity duration-500" />

      {/* Holographic Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-50/30 dark:via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </div>
  );

  return (
    <section className="py-32 px-4 relative overflow-hidden">
      {/* Eye-Comfort Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-gray-100 to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-100/10 via-transparent to-green-100/10 dark:from-indigo-900/20 dark:to-purple-900/20" />

      {/* Floating Elements */}
      <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl floating-element" />
      <div
        className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-cyan-400/10 to-pink-400/10 rounded-full blur-3xl floating-element"
        style={{ animationDelay: "2s" }}
      />

      <div className="relative max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-3 px-8 py-4 rounded-full premium-card mb-8 group hover:scale-105 transition-all duration-500">
            <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-green-400 rounded-full animate-pulse" />
            <span className="text-sm font-bold gradient-text">
              Choose Your Learning Path
            </span>
            <Sparkles className="h-4 w-4 text-blue-500 dark:text-blue-400 animate-spin" />
          </div>

          <h2 className="text-5xl md:text-6xl font-black text-slate-800 dark:text-white mb-8 leading-tight">
            Learning Modules
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-4xl mx-auto leading-relaxed font-light">
            {user
              ? "Continue your English learning journey with our AI-powered modules designed to enhance your skills"
              : "Sign in to unlock all learning modules and start your personalized English learning experience"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <ModuleCard
            icon={BookOpen}
            title="Reading Practice"
            description="Immerse yourself in engaging stories and enhance comprehension"
            features={[
              "Interactive Stories",
              "Comprehension Questions",
              "Vocabulary building",
            ]}
            href="/reading"
            buttonText="Start Reading"
            gradient="from-blue-400 to-blue-500"
            isPopular={true}
            delay={0}
            index={0}
          />

          <ModuleCard
            icon={BookMarked}
            title="Vocabulary Practice"
            description="Expand your vocabulary with interactive learning and quizzes"
            features={[
              "Word Learning",
              "Interactive Quizzes",
              "Pronunciation Guide",
            ]}
            href="/vocabulary"
            buttonText="Start Learning"
            variant="secondary"
            gradient="from-purple-400 to-purple-500"
            delay={100}
            index={1}
          />

          {/* <ModuleCard
            icon={Mic}
            title="Speaking Practice"
            description="Enhance your pronunciation and fluency with AI-powered speech exercises"
            features={[
              "Pronunciation Training",
              "Fluency Exercises",
              "AI Feedback",
            ]}
            href="/speaking"
            buttonText="Start Speaking"
            variant="secondary"
            gradient="from-green-400 to-green-500"
            delay={200}
            index={2}
          /> */}

          <ModuleCard
            icon={PenTool}
            title="Writing Practice"
            description="Develop your writing skills with guided exercises and AI evaluation"
            features={["Guided Writing", "Grammar Check", "AI Evaluation"]}
            href="/writing"
            buttonText="Start Writing"
            variant="outline"
            gradient="from-blue-300 to-green-400"
            delay={400}
            index={2}
          />

          <ModuleCard
            icon={MessageCircle}
            title="AI Assistant"
            description="Get instant, intelligent support for all your questions"
            features={[
              "24/7 AI support",
              "Grammar explanations",
              "Vocabulary help",
              "Learning tips",
            ]}
            href="/chat"
            buttonText="Chat with AI"
            variant="outline"
            gradient="from-green-400 to-blue-400"
            delay={600}
            index={3}
          />
        </div>
      </div>
    </section>
  );
}
