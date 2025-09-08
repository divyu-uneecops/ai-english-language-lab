import { AIChatInterface } from "@/components/chat/ai-chat-interface"
import { ProtectedRoute } from "@/components/protected-route"

export default function ChatPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <AIChatInterface />
      </div>
    </ProtectedRoute>
  )
}
