import { WritingInterface } from "@/components/writing/writing-interface";
import { ProtectedRoute } from "@/components/protected-route";

export default function WritingPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="relative z-10">
          <WritingInterface />
        </div>
      </div>
    </ProtectedRoute>
  );
}
