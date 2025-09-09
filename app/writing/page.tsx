import { WritingInterface } from "@/components/writing/writing-interface";
import { ProtectedRoute } from "@/components/protected-route";

export default function WritingPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background relative overflow-hidden">
        {/* Modern Background */}
        <div className="fixed inset-0 z-0">
          <div className="absolute inset-0 background-pattern" />
          <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 via-transparent to-accent/5" />

          {/* Animated Background Elements */}
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-20 left-1/4 w-64 h-64 bg-gradient-to-r from-secondary/10 to-accent/10 rounded-full blur-3xl floating-animation" />
            <div
              className="absolute bottom-20 right-1/4 w-80 h-80 bg-gradient-to-r from-accent/10 to-secondary/10 rounded-full blur-3xl floating-animation"
              style={{ animationDelay: "2.5s" }}
            />
          </div>
        </div>

        <div className="relative z-10">
          <main className="container mx-auto px-4 py-8">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-8 slide-up">
                <h1 className="text-4xl font-bold gradient-text mb-4 text-shadow-glow">
                  Writing Lab
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Practice different types of writing with AI-powered feedback
                  and suggestions
                </p>
              </div>

              <WritingInterface />
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
