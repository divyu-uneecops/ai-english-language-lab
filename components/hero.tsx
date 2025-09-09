"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import {
  ArrowRight,
  Sparkles,
  Zap,
  Star,
  Play,
  Users,
  Award,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

export function Hero() {
  const { user } = useAuth();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      {/* Advanced 3D Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-indigo-200/30 via-transparent to-purple-200/30 dark:from-indigo-900/30 dark:to-purple-900/30" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-cyan-200/20 via-transparent to-pink-200/20 dark:from-cyan-900/20 dark:to-pink-900/20" />

      {/* Interactive Particle System */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full particle-effect opacity-60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${8 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      {/* Dynamic Floating Elements */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl floating-element animate-pulse hologram-effect" />
      <div
        className="absolute top-40 right-32 w-96 h-96 bg-gradient-to-r from-cyan-400/20 to-pink-400/20 rounded-full blur-3xl floating-element animate-pulse hologram-effect"
        style={{ animationDelay: "2s" }}
      />
      <div
        className="absolute bottom-32 left-1/3 w-64 h-64 bg-gradient-to-r from-violet-400/20 to-indigo-400/20 rounded-full blur-2xl floating-element animate-pulse hologram-effect"
        style={{ animationDelay: "4s" }}
      />

      {/* Interactive Grid Pattern */}
      <div
        className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse"
        style={{
          transform: `translate(${mousePosition.x * 0.01}px, ${
            mousePosition.y * 0.01
          }px)`,
        }}
      />

      {/* Matrix Rain Effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute text-xs text-indigo-400/20 font-mono matrix-rain"
            style={{
              left: `${i * 6.67}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${10 + Math.random() * 5}s`,
            }}
          >
            {[...Array(20)].map((_, j) => (
              <div key={j} className="opacity-50">
                {Math.random() > 0.5 ? "1" : "0"}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto z-10 text-center">
        {/* Premium Badge with Cyber Border */}
        <div className="inline-flex items-center gap-3 px-8 py-4 rounded-full premium-card border-glow mb-12 group hover:scale-105 transition-all duration-500 cyber-border">
          <div className="w-3 h-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full animate-pulse neon-glow" />
          <span className="text-sm font-bold gradient-text">
            AI-Powered Learning Platform
          </span>
          <Sparkles className="h-4 w-4 text-indigo-500 dark:text-indigo-400 animate-spin" />
        </div>

        {/* Main Heading with Advanced Typography */}
        <h1 className="text-6xl md:text-7xl lg:text-8xl font-black mb-8 leading-[0.9] tracking-tight">
          <span className="block text-slate-900 dark:text-white mb-4 hologram-effect">
            Master English
          </span>
          <span className="block relative">
            <span className="gradient-text text-glow neon-glow">
              with AI-Powered
            </span>
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full animate-pulse wave-effect" />
            <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-2xl blur-xl -z-10 animate-pulse" />
          </span>
          <span className="block text-slate-900 dark:text-white mt-4 hologram-effect">
            Learning
          </span>
        </h1>

        {/* Enhanced Subtitle */}
        <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-16 max-w-4xl mx-auto leading-relaxed font-light">
          Transform your English skills with interactive lessons, AI-powered
          evaluation, and personalized feedback.
          <span className="gradient-text-accent font-medium">
            {" "}
            Get instant help from our intelligent assistant
          </span>{" "}
          whenever you need it.
        </p>

        {/* Premium CTA Buttons */}
        {!user && (
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-20">
            <Link href="/auth/login">
              <Button
                size="lg"
                className="group px-12 py-6 text-lg font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-700 hover:via-purple-700 hover:to-indigo-700 text-white shadow-2xl hover:shadow-indigo-500/25 transition-all duration-500 hover:-translate-y-1 hover:scale-105 border-glow neon-glow cyber-border"
                style={{ backgroundSize: "200% 200%" }}
              >
                <Play className="h-6 w-6 mr-3 group-hover:scale-110 transition-transform duration-300" />
                <span className="relative z-10">Start Learning</span>
                <ArrowRight className="h-6 w-6 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 rounded-lg blur opacity-0 group-hover:opacity-75 transition-opacity duration-500" />
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button
                variant="outline"
                size="lg"
                className="px-12 py-6 text-lg font-bold border-2 border-slate-300 dark:border-slate-600 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-500 hover:-translate-y-1 hover:scale-105 premium-card"
              >
                Create Account
              </Button>
            </Link>
          </div>
        )}

        {/* Premium Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="group text-center p-10 rounded-3xl premium-card card-hover magnetic-hover cyber-border">
            <div className="w-20 h-20 mx-auto mb-8 rounded-3xl bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-900/50 dark:to-indigo-800/50 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 border-glow neon-glow">
              <span className="text-4xl">📚</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 gradient-text">
              Interactive Reading
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Engaging stories with comprehension questions and vocabulary
              building
            </p>
          </div>

          <div className="group text-center p-10 rounded-3xl premium-card card-hover magnetic-hover cyber-border">
            <div className="w-20 h-20 mx-auto mb-8 rounded-3xl bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/50 dark:to-purple-800/50 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 border-glow neon-glow">
              <span className="text-4xl">🎤</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 gradient-text-secondary">
              Speaking Practice
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Voice recording and pronunciation feedback with AI analysis
            </p>
          </div>

          <div className="group text-center p-10 rounded-3xl premium-card card-hover magnetic-hover cyber-border">
            <div className="w-20 h-20 mx-auto mb-8 rounded-3xl bg-gradient-to-br from-cyan-100 to-cyan-200 dark:from-cyan-900/50 dark:to-cyan-800/50 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 border-glow neon-glow">
              <span className="text-4xl">✍️</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 gradient-text-accent">
              Writing Enhancement
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              AI-powered evaluation and personalized improvement suggestions
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
