"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { Hero } from "@/components/hero";
import { ModuleCards } from "@/components/module-cards";

export function HomePageContent() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Only redirect if user is logged in and not loading
    if (!isLoading && user) {
      router.push("/dashboard");
    }
  }, [user, isLoading, router]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is logged in, don't render the home page content
  // (they will be redirected to dashboard)
  if (user) {
    return null;
  }

  // Show home page content for non-logged-in users
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Modern Background with Images */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 background-pattern" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />

        {/* Animated Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full blur-3xl floating-animation" />
          <div
            className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-accent/10 to-primary/10 rounded-full blur-3xl floating-animation"
            style={{ animationDelay: "2s" }}
          />
          <div
            className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r from-secondary/10 to-accent/10 rounded-full blur-2xl floating-animation"
            style={{ animationDelay: "4s" }}
          />
        </div>
      </div>

      <div className="relative z-10">
        <main className="container mx-auto px-4 py-8">
          <Hero />
          <ModuleCards />
        </main>
      </div>
    </div>
  );
}
