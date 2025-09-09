"use client"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"

export function Hero() {
  const { user } = useAuth()

  return (
    <section className="relative text-center py-12 sm:py-16 lg:py-24 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />

      <div className="relative max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary-foreground bg-primary text-sm font-medium mb-6">
          <Sparkles className="h-4 w-4" />
          AI-Powered Learning Platform
        </div>

        <h1 className="text-responsive-3xl gradient-text text-balance mb-6 sm:mb-8">
          Master English with{" "}
          <span className="relative">
            AI-Powered
            <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-primary to-accent rounded-full opacity-60" />
          </span>{" "}
          Learning
        </h1>

        <p className="text-responsive-lg text-muted-foreground text-balance mb-8 sm:mb-10 max-w-3xl mx-auto leading-relaxed px-4">
          Transform your English skills with interactive lessons, AI-powered evaluation, and personalized feedback. Get
          instant help from our intelligent assistant whenever you need it.
        </p>

        {!user && (
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center mb-8 sm:mb-12 px-4">
            <Link href="/auth/login">
              <Button
                size="lg"
                className="flex items-center gap-2 w-full sm:w-auto px-8 py-4 text-lg font-semibold modern-shadow hover:scale-105 transition-all duration-300"
              >
                Start Learning
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mt-12 sm:mt-16 max-w-4xl mx-auto">
          <div className="flex flex-col items-center text-center p-6 rounded-xl glass-effect modern-shadow">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <span className="text-2xl">📚</span>
            </div>
            <h3 className="font-semibold text-lg mb-2">Interactive Reading</h3>
            <p className="text-sm text-muted-foreground">Engaging stories with comprehension questions</p>
          </div>

          <div className="flex flex-col items-center text-center p-6 rounded-xl glass-effect modern-shadow">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <span className="text-2xl">🎤</span>
            </div>
            <h3 className="font-semibold text-lg mb-2">Speaking Practice</h3>
            <p className="text-sm text-muted-foreground">Voice recording and pronunciation feedback</p>
          </div>

          <div className="flex flex-col items-center text-center p-6 rounded-xl glass-effect modern-shadow">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <span className="text-2xl">✍️</span>
            </div>
            <h3 className="font-semibold text-lg mb-2">Writing Enhancement</h3>
            <p className="text-sm text-muted-foreground">AI-powered evaluation and suggestions</p>
          </div>
        </div>
      </div>
    </section>
  )
}
