import { Button } from "@/components/ui/button"
import { BookOpen, Mic, MessageCircle, TrendingUp } from "lucide-react"
import Link from "next/link"

export function Navigation() {
  return (
    <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-primary" />
            <h1 className="text-xl font-bold text-foreground">English Lab</h1>
          </Link>

          <div className="flex items-center gap-4">
            <Link href="/reading">
              <Button variant="ghost" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Reading
              </Button>
            </Link>
            <Link href="/speaking">
              <Button variant="ghost" className="flex items-center gap-2">
                <Mic className="h-4 w-4" />
                Speaking
              </Button>
            </Link>
            <Link href="/chat">
              <Button variant="ghost" className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                AI Chat
              </Button>
            </Link>
            <Link href="/progress">
              <Button variant="ghost" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Progress
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
