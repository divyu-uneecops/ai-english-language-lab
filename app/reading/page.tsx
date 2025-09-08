import { ReadingInterface } from "@/components/reading/reading-interface"
import { ProtectedRoute } from "@/components/protected-route"

export default function ReadingPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <ReadingInterface />
      </div>
    </ProtectedRoute>
  )
}
