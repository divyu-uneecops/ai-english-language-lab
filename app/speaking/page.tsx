import { SpeakingInterface } from "@/components/speaking/speaking-interface"
import { ProtectedRoute } from "@/components/protected-route"

export default function SpeakingPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <SpeakingInterface />
      </div>
    </ProtectedRoute>
  )
}
