"use client";

import { SpeakingInterface } from "@/components/speaking/components/speaking-interface";
import { ProtectedRoute } from "@/components/protected-route";

export default function SpeakingPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="relative z-10">
          <SpeakingInterface />
        </div>
      </div>
    </ProtectedRoute>
  );
}
