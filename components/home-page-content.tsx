"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { Hero } from "@/components/hero";
import { CultivateThink } from "@/components/writing/components/CultivateThink";
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

  // If user is logged in, don't render the home page content
  // (they will be redirected to dashboard)
  if (user) {
    return null;
  }

  // Show home page content for non-logged-in users
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="relative z-10">
        <main className="container mx-auto">
          <Hero />
          <CultivateThink />
          <ModuleCards />
        </main>
      </div>
    </div>
  );
}
