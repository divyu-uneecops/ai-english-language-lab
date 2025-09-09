import { SpeakingInterface } from "@/components/speaking/speaking-interface";
import { ProtectedRoute } from "@/components/protected-route";

export default function SpeakingPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background relative overflow-hidden">
        {/* Modern Background */}
        <div className="fixed inset-0 z-0">
          <div className="absolute inset-0 background-pattern" />
          <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-primary/5" />

          {/* Animated Background Elements */}
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-20 right-20 w-72 h-72 bg-gradient-to-r from-accent/10 to-primary/10 rounded-full blur-3xl floating-animation" />
            <div
              className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full blur-3xl floating-animation"
              style={{ animationDelay: "2s" }}
            />
          </div>
        </div>

        <div className="relative z-10">
          <SpeakingInterface />
        </div>
      </div>
    </ProtectedRoute>
  );
}
