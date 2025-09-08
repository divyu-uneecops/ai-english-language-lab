import { Button } from "@/components/ui/button"
import { ArrowRight, BookOpen, Mic, PenTool, MessageCircle } from "lucide-react"
import Link from "next/link"

export function Hero() {
  return (
    <section className="text-center py-8 sm:py-12 lg:py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-balance mb-4 sm:mb-6">
          Master English with <span className="text-primary">AI-Powered</span> Learning
        </h1>
        <p className="text-base sm:text-lg lg:text-xl text-muted-foreground text-balance mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed px-4">
          Improve your reading, speaking, and writing skills with interactive lessons, AI-powered evaluation, and
          personalized feedback. Get instant help from our AI assistant whenever you need it.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-6 sm:mb-8 px-4">
          <Link href="/auth/login">
            <Button size="lg" className="flex items-center gap-2 w-full sm:w-auto">
              Sign In
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 max-w-2xl mx-auto px-4">
          <Link href="/reading">
            <Button variant="ghost" size="sm" className="flex items-center gap-1 sm:gap-2 w-full text-xs sm:text-sm">
              <BookOpen className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline">Reading</span>
              <span className="xs:hidden">Read</span>
            </Button>
          </Link>
          <Link href="/speaking">
            <Button variant="ghost" size="sm" className="flex items-center gap-1 sm:gap-2 w-full text-xs sm:text-sm">
              <Mic className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline">Speaking</span>
              <span className="xs:hidden">Speak</span>
            </Button>
          </Link>
          <Link href="/writing">
            <Button variant="ghost" size="sm" className="flex items-center gap-1 sm:gap-2 w-full text-xs sm:text-sm">
              <PenTool className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline">Writing</span>
              <span className="xs:hidden">Write</span>
            </Button>
          </Link>
          <Link href="/chat">
            <Button variant="ghost" size="sm" className="flex items-center gap-1 sm:gap-2 w-full text-xs sm:text-sm">
              <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline">AI Chat</span>
              <span className="xs:hidden">Chat</span>
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
