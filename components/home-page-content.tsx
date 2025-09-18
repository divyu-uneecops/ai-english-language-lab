"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { Hero } from "@/components/hero";
import { CultivateThink } from "@/components/writing/CultivateThink";
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
      <div className="relative z-10">
        <main className="container mx-auto px-4 py-8">
          <Hero />
          <CultivateThink />
          <ModuleCards />
        </main>
      </div>
    </div>
  );
}
