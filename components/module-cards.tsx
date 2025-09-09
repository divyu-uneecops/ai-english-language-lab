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
      className="group relative premium-card rounded-3xl p-8 card-hover magnetic-hover overflow-hidden cyber-border dark:bg-slate-800/60 bg-white/80"
      style={{
        animationDelay: `${delay}ms`,
        background: `linear-gradient(135deg, ${gradient})`,
        transform:
          hoveredCard === index
            ? "translateY(-12px) scale(1.03)"
            : "translateY(0) scale(1)",
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
      onMouseEnter={() => setHoveredCard(index)}
      onMouseLeave={() => setHoveredCard(null)}
    >
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-slate-400/60 dark:bg-white/30 rounded-full particle-effect"
            style={{
              left: `${20 + i * 15}%`,
              top: `${20 + i * 10}%`,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        {/* Icon with 3D Effect */}
        <div className="w-24 h-24 mb-8 rounded-3xl bg-slate-100/80 dark:bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 border border-slate-200 dark:border-white/30 hologram-effect">
          <Icon className="h-12 w-12 text-slate-700 dark:text-white drop-shadow-lg" />
        </div>

        {/* Content */}
        <div className="mb-8">
          <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-4 group-hover:text-glow transition-all duration-300">
            {title}
          </h3>
          <p className="text-slate-700 dark:text-white/80 leading-relaxed mb-6 text-lg">
            {description}
          </p>

          <ul className="space-y-4">
            {features.map((feature, index) => (
              <li
                key={index}
                className="flex items-center gap-3 text-sm text-slate-600 dark:text-white/70 group-hover:text-slate-900 dark:group-hover:text-white/90 transition-colors duration-300"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-2 h-2 rounded-full bg-slate-500 dark:bg-white/60 flex-shrink-0 group-hover:scale-125 transition-transform duration-300" />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* Button */}
        {user ? (
          <Link href={href}>
            <Button
              variant={variant}
              className={`w-full py-4 font-bold text-base transition-all duration-500 group-hover:scale-105 ${
                variant === "default"
                  ? "bg-slate-900/80 hover:bg-slate-900 text-white border border-slate-300 dark:border-white/30 hover:border-slate-400 dark:hover:border-white/50 backdrop-blur-sm neon-glow"
                  : variant === "secondary"
                  ? "bg-slate-800/60 hover:bg-slate-800 text-white border border-slate-200 dark:border-white/20 hover:border-slate-300 dark:hover:border-white/40 backdrop-blur-sm"
                  : "bg-transparent hover:bg-slate-100 dark:hover:bg-white/10 text-slate-900 dark:text-white border-2 border-slate-300 dark:border-white/30 hover:border-slate-400 dark:hover:border-white/50 backdrop-blur-sm"
              }`}
            >
              <Play className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
              {buttonText}
              <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
          </Link>
        ) : (
          <Link href="/auth/login">
            <Button
              variant="outline"
              className="w-full py-4 font-bold text-base bg-transparent hover:bg-slate-100 dark:hover:bg-white/10 text-slate-900 dark:text-white border-2 border-slate-300 dark:border-white/30 hover:border-slate-400 dark:hover:border-white/50 backdrop-blur-sm transition-all duration-500 group-hover:scale-105"
            >
              <Lock className="h-5 w-5 mr-2" />
              Sign In to Access
            </Button>
          </Link>
        )}
      </div>

      {/* Shimmer Effect */}
      <div className="absolute inset-0 -top-10 -left-10 w-20 h-20 bg-gradient-to-r from-transparent via-slate-200/40 dark:via-white/20 to-transparent rotate-45 opacity-0 group-hover:opacity-100 group-hover:animate-shimmer transition-opacity duration-500" />

      {/* Holographic Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-100/20 dark:via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </div>
  );

  return (
    <section className="py-32 px-4 relative overflow-hidden">
      {/* 2025 Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-200/20 via-transparent to-purple-200/20 dark:from-indigo-900/20 dark:to-purple-900/20" />

      {/* Floating Elements */}
      <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-r from-indigo-400/10 to-purple-400/10 rounded-full blur-3xl floating-element" />
      <div
        className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-cyan-400/10 to-pink-400/10 rounded-full blur-3xl floating-element"
        style={{ animationDelay: "2s" }}
      />

      {/* Matrix Rain Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute text-xs text-indigo-400/10 font-mono matrix-rain"
            style={{
              left: `${i * 10}%`,
              animationDelay: `${Math.random() * 10}s`,
            }}
          >
            {[...Array(15)].map((_, j) => (
              <div key={j} className="opacity-30">
                {Math.random() > 0.5 ? "1" : "0"}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-3 px-8 py-4 rounded-full premium-card border-glow mb-8 group hover:scale-105 transition-all duration-500 cyber-border">
            <div className="w-3 h-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full animate-pulse neon-glow" />
            <span className="text-sm font-bold gradient-text">
              Choose Your Learning Path
            </span>
            <Sparkles className="h-4 w-4 text-indigo-500 dark:text-indigo-400 animate-spin" />
          </div>

          <h2 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white mb-8 leading-tight hologram-effect">
            Learning Modules
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-4xl mx-auto leading-relaxed font-light">
            {user
              ? "Continue your English learning journey with our AI-powered modules designed to enhance your skills"
              : "Sign in to unlock all learning modules and start your personalized English learning experience"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <ModuleCard
            icon={BookOpen}
            title="Reading Lab"
            description="Immerse yourself in engaging stories and enhance comprehension with interactive questions"
            features={[
              "Interactive story reading",
              "AI-powered comprehension questions",
              "Vocabulary building exercises",
              "Real-time progress tracking",
            ]}
            href="/reading"
            buttonText="Start Reading"
            gradient="from-indigo-500 to-purple-600"
            isPopular={true}
            delay={0}
            index={0}
          />

          <ModuleCard
            icon={Mic}
            title="Speaking Lab"
            description="Perfect your pronunciation and speaking confidence with AI-guided practice sessions"
            features={[
              "Advanced pronunciation analysis",
              "Interactive speaking exercises",
              "Voice recording & playback",
              "Instant AI feedback",
            ]}
            href="/speaking"
            buttonText="Start Speaking"
            variant="secondary"
            gradient="from-purple-500 to-pink-600"
            delay={200}
            index={1}
          />

          <ModuleCard
            icon={PenTool}
            title="Writing Lab"
            description="Master various writing styles with comprehensive AI evaluation and personalized feedback"
            features={[
              "Letter & article composition",
              "Professional notice writing",
              "AI-powered evaluation system",
              "Detailed improvement suggestions",
            ]}
            href="/writing"
            buttonText="Start Writing"
            variant="outline"
            gradient="from-cyan-500 to-blue-600"
            delay={400}
            index={2}
          />

          <ModuleCard
            icon={MessageCircle}
            title="AI Assistant"
            description="Get instant, intelligent support for all your English learning questions and challenges"
            features={[
              "24/7 intelligent AI support",
              "Grammar & syntax explanations",
              "Contextual vocabulary help",
              "Personalized learning tips",
            ]}
            href="/chat"
            buttonText="Chat with AI"
            variant="outline"
            gradient="from-emerald-500 to-teal-600"
            delay={600}
            index={3}
          />
        </div>
      </div>
    </section>
  );
}
