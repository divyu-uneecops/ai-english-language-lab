import { WritingInterface } from "@/components/writing/writing-interface";
import { ProtectedRoute } from "@/components/protected-route";

export default function WritingPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background relative overflow-hidden">
        <div className="relative z-10">
          <main className="container mx-auto px-4 py-8">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-8 slide-up">
                <h1 className="text-4xl font-bold gradient-text mb-4 text-shadow-glow">
                  Writing Practice
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
