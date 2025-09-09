"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export function Hero() {
  const { user } = useAuth();

  return (
    <section className="relative text-center py-12 sm:py-16 lg:py-24 px-4 overflow-hidden min-h-[80vh] flex items-center">
      {/* Animated Background */}
      <div className="absolute inset-0 background-pattern" />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 pointer-events-none" />

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-primary/20 rounded-full blur-xl floating-animation" />
      <div
        className="absolute top-40 right-20 w-32 h-32 bg-accent/20 rounded-full blur-2xl floating-animation"
        style={{ animationDelay: "2s" }}
      />
      <div
        className="absolute bottom-20 left-1/4 w-16 h-16 bg-secondary/20 rounded-full blur-lg floating-animation"
        style={{ animationDelay: "4s" }}
      />

      {/* 3D Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-primary/5 to-accent/5 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-accent/5 to-primary/5 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="relative max-w-5xl mx-auto z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-morphism text-primary text-sm font-medium mb-6 slide-up pulse-glow">
          <Sparkles className="h-4 w-4 animate-spin" />
          AI-Powered Learning Platform
        </div>

        <h1 className="text-responsive-3xl gradient-text text-balance mb-6 sm:mb-8 slide-up text-shadow-glow">
          Master English with{" "}
          <span className="relative inline-block">
            AI-Powered
            <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-primary to-accent rounded-full opacity-60 animate-pulse" />
            <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 to-accent/20 rounded-lg blur-sm -z-10" />
          </span>{" "}
          Learning
        </h1>

        <p
          className="text-responsive-lg text-muted-foreground text-balance mb-8 sm:mb-10 max-w-3xl mx-auto leading-relaxed px-4 slide-up"
          style={{ animationDelay: "0.2s" }}
        >
          Transform your English skills with interactive lessons, AI-powered
          evaluation, and personalized feedback. Get instant help from our
          intelligent assistant whenever you need it.
        </p>

        {!user && (
          <div
            className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center mb-8 sm:mb-12 px-4 slide-up"
            style={{ animationDelay: "0.4s" }}
          >
            <Link href="/auth/login">
              <Button
                size="lg"
                className="flex items-center gap-2 w-full sm:w-auto px-8 py-4 text-lg font-semibold modern-shadow hover:scale-105 transition-all duration-300 neon-glow hover:neon-glow focus-ring"
              >
                Start Learning
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mt-12 sm:mt-16 max-w-4xl mx-auto">
          <div
            className="flex flex-col items-center text-center p-6 rounded-xl glass-morphism modern-shadow card-3d scale-in group"
            style={{ animationDelay: "0.6s" }}
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <span className="text-2xl">📚</span>
            </div>
            <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
              Interactive Reading
            </h3>
            <p className="text-sm text-muted-foreground">
              Engaging stories with comprehension questions
            </p>
          </div>

          <div
            className="flex flex-col items-center text-center p-6 rounded-xl glass-morphism modern-shadow card-3d scale-in group"
            style={{ animationDelay: "0.8s" }}
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent/20 to-accent/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <span className="text-2xl">🎤</span>
            </div>
            <h3 className="font-semibold text-lg mb-2 group-hover:text-accent transition-colors">
              Speaking Practice
            </h3>
            <p className="text-sm text-muted-foreground">
              Voice recording and pronunciation feedback
            </p>
          </div>

          <div
            className="flex flex-col items-center text-center p-6 rounded-xl glass-morphism modern-shadow card-3d scale-in group"
            style={{ animationDelay: "1s" }}
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-secondary/20 to-secondary/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <span className="text-2xl">✍️</span>
            </div>
            <h3 className="font-semibold text-lg mb-2 group-hover:text-secondary transition-colors">
              Writing Enhancement
            </h3>
            <p className="text-sm text-muted-foreground">
              AI-powered evaluation and suggestions
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
