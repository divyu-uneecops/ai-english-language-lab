import { ReadingInterface } from "@/components/reading/components/reading-interface";
import { ProtectedRoute } from "@/components/protected-route";

export default function ReadingPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background relative overflow-hidden">
        <div className="relative z-10">
          <ReadingInterface />
        </div>
      </div>
    </ProtectedRoute>
  );
}
