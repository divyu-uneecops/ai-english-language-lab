"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function Hero() {
  const { user } = useAuth();

  return (
    <section className="text-center py-8 sm:py-12 lg:py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-balance mb-4 sm:mb-6">
          Master English with <span className="text-primary">AI-Powered</span>{" "}
          Learning
        </h1>
        <p className="text-base sm:text-lg lg:text-xl text-muted-foreground text-balance mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed px-4">
          Improve your reading, speaking, and writing skills with interactive
          lessons, AI-powered evaluation, and personalized feedback. Get instant
          help from our AI assistant whenever you need it.
        </p>
        {!user && (
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-6 sm:mb-8 px-4">
            <Link href="/auth/login">
              <Button
                size="lg"
                className="flex items-center gap-2 w-full sm:w-auto"
              >
                Sign In
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
