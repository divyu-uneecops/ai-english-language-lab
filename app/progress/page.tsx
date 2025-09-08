import { ProgressDashboard } from "@/components/progress/progress-dashboard"
import { ProtectedRoute } from "@/components/protected-route"

export default function ProgressPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <ProgressDashboard />
      </div>
    </ProtectedRoute>
  )
}
