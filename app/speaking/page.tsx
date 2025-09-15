import { SpeakingInterface } from "@/components/speaking/speaking-interface";
import { ProtectedRoute } from "@/components/protected-route";

export default function SpeakingPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background relative overflow-hidden">
        <div className="relative z-10">
          <SpeakingInterface />
        </div>
      </div>
    </ProtectedRoute>
  );
}
