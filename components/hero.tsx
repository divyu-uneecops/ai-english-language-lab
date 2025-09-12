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
  BookOpen,
  Mic,
  PenTool,
  MessageCircle,
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
      {/* Eye-Comfort Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-gray-100 to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-blue-100/15 via-transparent to-green-100/15 dark:from-indigo-900/30 dark:to-purple-900/30" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-green-100/10 via-transparent to-blue-100/10 dark:from-cyan-900/20 dark:to-pink-900/20" />

      {/* Interactive Particle System */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full particle-effect opacity-60"
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
      <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl floating-element animate-pulse" />
      <div
        className="absolute top-40 right-32 w-96 h-96 bg-gradient-to-r from-cyan-400/20 to-pink-400/20 rounded-full blur-3xl floating-element animate-pulse"
        style={{ animationDelay: "2s" }}
      />
      <div
        className="absolute bottom-32 left-1/3 w-64 h-64 bg-gradient-to-r from-violet-400/20 to-indigo-400/20 rounded-full blur-2xl floating-element animate-pulse"
        style={{ animationDelay: "4s" }}
      />

      {/* Interactive Grid Pattern */}
      <div
        className="absolute inset-0 bg-[linear-gradient(rgba(37,99,235,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(37,99,235,0.03)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse"
        style={{
          transform: `translate(${mousePosition.x * 0.01}px, ${
            mousePosition.y * 0.01
          }px)`,
        }}
      />

      <div className="relative max-w-7xl mx-auto z-10 text-center">
        {/* Eye-Comfort Badge */}
        <div className="inline-flex items-center gap-3 px-8 py-4 rounded-full premium-card mb-12 group hover:scale-105 transition-all duration-500">
          <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-green-400 rounded-full animate-pulse" />
          <span className="text-sm font-bold gradient-text">
            AI-Powered Learning Platform
          </span>
          <Sparkles className="h-4 w-4 text-blue-500 dark:text-blue-400 animate-spin" />
        </div>

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

        {/* Eye-Comfort Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <div className="group text-center p-8 rounded-2xl premium-card hover-lift">
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/50 dark:to-blue-800/50 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
              <BookOpen className="h-8 w-8 text-blue-500" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-3 gradient-text">
              Reading Lab
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
              Interactive stories with AI-powered comprehension
            </p>
          </div>

          <div className="group text-center p-8 rounded-2xl premium-card hover-lift">
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/50 dark:to-green-800/50 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
              <Mic className="h-8 w-8 text-green-500" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-3 gradient-text-secondary">
              Speaking Lab
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
              Voice practice with instant pronunciation feedback
            </p>
          </div>

          <div className="group text-center p-8 rounded-2xl premium-card hover-lift">
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-100 to-green-100 dark:from-cyan-900/50 dark:to-cyan-800/50 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
              <PenTool className="h-8 w-8 text-blue-500" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-3 gradient-text-accent">
              Writing Lab
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
              AI evaluation with personalized improvement tips
            </p>
          </div>

          <div className="group text-center p-8 rounded-2xl premium-card hover-lift">
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900/50 dark:to-green-800/50 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
              <MessageCircle className="h-8 w-8 text-green-500" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-3 gradient-text-accent">
              AI Assistant
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
              24/7 intelligent support for all your questions
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
