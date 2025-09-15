import { Dashboard } from "@/components/dashboard";
import { ProtectedRoute } from "@/components/protected-route";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background relative overflow-hidden">
        {/* Modern Background */}
        <div className="fixed inset-0 z-0">
          <div className="absolute inset-0 background-pattern" />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />

          {/* Animated Background Elements */}
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-20 left-20 w-80 h-80 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full blur-3xl floating-animation" />
            <div
              className="absolute bottom-20 right-20 w-64 h-64 bg-gradient-to-r from-accent/10 to-primary/10 rounded-full blur-3xl floating-animation"
              style={{ animationDelay: "2s" }}
            />
            <div
              className="absolute top-1/2 left-1/2 w-72 h-72 bg-gradient-to-r from-secondary/10 to-accent/10 rounded-full blur-2xl floating-animation"
              style={{ animationDelay: "4s" }}
            />
          </div>
        </div>

        <div className="relative z-10">
          <Dashboard />
        </div>
      </div>
    </ProtectedRoute>
  );
}
